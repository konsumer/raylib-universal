import { readFile } from 'fs/promises'
import * as raylib from './raylib-ffi.js'

const decoder = new TextDecoder()
const encoder = new TextEncoder()

const regexFormat = /\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fCiosuxX])/g

const traceLabels = {
  1: 'TRACE', // Trace logging, intended for internal use only
  2: 'DEBUG', // Debug logging, used for internal debugging, it should be disabled on release builds
  3: 'INFO', // Info logging, used for program execution info
  4: 'WARNING', // Warning logging, used on recoverable failures
  5: 'ERROR', // Error logging, used on unrecoverable failures
  6: 'FATAL' // Fatal logging, used to abort program: exit(EXIT_FAILURE)
}

// Get a list of imports that are used directly by the wasm
export async function getImports (bytes) {
  const mod = await WebAssembly.compile(bytes)
  return WebAssembly.Module.imports(mod)
    .filter(m => m.kind === 'function')
    .map(m => m.name)
}

// load the wasm and return a game-object
export default async function load (bytes) {
  const currentLoglevel = 2 // LOG_DEBUG

  // returns printf-formatted string from vargs
  // TODO: lots more to do here
  function textformat (textP, vargsP) {
    const text = getString(textP)
    let p = vargsP
    return text.replace(regexFormat, (match, p1, p2, p3, p4, p5, p6, p7, p8, offset) => {
      if (p8 === 'c') {
        const o = String.fromCharCode(mem.getUint8(p, true))
        p += 4
        return o
      } else if (p8 === 'C') {
        const o = String.fromCharCode(mem.getUint8(p, true)).toUpperCase()
        p += 4
        return o
      } else if (p8 === 'd') {
        let o = mem.getInt32(p, true)
        p += 4
        if (p6) {
          if (p4) {
            o = o.toString().padStart(p6, p4 || '0')
          } else {
            if (p5 === '-') {
              o = o.toString().padEnd(p6, ' ')
            } else if (p5 === '+') {
              const s = o < 0 ? '-' : '+'
              o = (s + o.toString()).padStart(p6, ' ')
            } else {
              o = o.toString().padStart(p6, ' ')
            }
          }
        }
        return o
      } else if (p8 === 'f') {
        let o = mem.getFloat64(p, true)
        if (typeof p7 !== 'undefined') {
          o = o.toFixed(p7)
        }
        p += 4
        return o
      } else if (p8 === 's') {
        const o = getString(mem.getInt32(p, true))
        p += 4
        return o
      } else {
        console.log({ p1, p2, p3, p4, p5, p6, p7, p8 })
      }
    })
  }

  function getString (pointer, len = 0) {
    let end = pointer + len
    if (!len) {
      while (end < (pointer + (1024 * 20))) { // max-string length, without len param
        if (mem.getUint8(end) === 0) {
          break
        }
        end++
      }
    }
    return decoder.decode(mem.buffer.slice(pointer, end))
  }

  function setString (value, pointer, len = 0) {
    if (!len) {
      len = value.length + 1
    }
    if (!pointer) {
      pointer = mod.alloca(len)
    }
    const buffer = encoder.encode(value)
    for (let b = 0; b < len; b++) {
      mem.setUint8(pointer + b, buffer[b] || '\0')
    }
    return pointer
  }

  const env = {
    InitWindow (width, height, titleP) {
      raylib.InitWindow(width, height, getString(titleP))
    },

    TextFormat (textP, vargsP) {
      return setString(textformat(textP, vargsP))
    },

    TraceLog (logLevel, textP, vargsP) {
      if (logLevel >= currentLoglevel) {
        console.error(`${traceLabels[logLevel]}: ${textformat(textP, vargsP)}`)
      }
    },

    SetTraceLogLevel (logLevel) {
      currentLoglevel = logLevel
      raylib.SetTraceLogLevel(logLevel)
    },

    BeginDrawing () {
      raylib.BeginDrawing()
    },

    ClearBackground (colorP) {
      raylib.ClearBackground(mem.getInt32(colorP, true))
    },

    DrawText (textP, x, y, fontSize, colorP) {
      raylib.DrawText(getString(textP), x, y, fontSize, mem.getInt32(colorP, true))
    },

    EndDrawing () {
      raylib.EndDrawing()
    }
  }

  const w = await WebAssembly.instantiate(bytes, { env })
  const mod = w.instance.exports
  const mem = new DataView(mod.memory.buffer)
  return mod
}

// example usage

const bytes = await readFile('../../out/examples/justlog.wasm')

console.log('Your game uses these functions:')
console.log('  ' + (await getImports(bytes)).join('\n  '))
const game = await load(bytes)

if (game.InitGame) {
  game.InitGame()
}

if (game.UpdateGame) {
  while (!raylib.WindowShouldClose()) {
    game.UpdateGame()
  }
}
