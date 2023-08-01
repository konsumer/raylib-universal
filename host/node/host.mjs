import { readFile } from 'fs/promises'

const decoder = new TextDecoder()
const encoder = new TextEncoder()

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
    pointer = this.mod.alloca(len)
  }
  const buffer = encoder.encode(value)
  for (let b = 0; b < len; b++) {
    mem.setUint8(pointer + b, buffer[b] || '\0')
  }
  return pointer
}

// returns printf-formatted string from vargs
const regexFormat = /\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fiosuxX])/g
function textformat (textP, vargsP) {
  const text = getString(textP)
  let p = vargsP
  return text.replace(regexFormat, (match, p1, p2, p3, p4, p5, p6, p7, p8, offset) => {
    if (p8 === 'd') {
      const o = mem.getInt32(p, true)
      p += 4
      return o
    }
    if (p8 === 'f') {
      let o = mem.getFloat64(p, true)
      if (typeof p7 !== 'undefined') {
        o = o.toFixed(p7)
      }
      p += 4
      return o
    }
    if (p8 === 's') {
      const o = getString(mem.getInt32(p, true))
      p += 4
      return o
    }
  })
}

let currentLoglevel

const env = {
  InitWindow (x, y, titleP) {
    const title = getString(titleP)
  },

  TextFormat: (textP, vargsP) => setString(textformat(textP, vargsP)),

  TraceLog (logLevel, textP, vargsP) {
    console.log(logLevel, textformat(textP, vargsP))
  },

  SetTraceLog (logLevel) {
    currentLoglevel = logLevel
  },

  BeginDrawing: () => {},

  ClearBackground: (colorP) => {},

  DrawText: () => {},

  EndDrawing: () => {}
}

const w = await WebAssembly.instantiate(await readFile('out/examples/justlog.wasm'), { env })
const mod = w.instance.exports
const mem = new DataView(mod.memory.buffer)

if (mod.InitGame) {
  mod.InitGame()
}

// if (mod.UpdateGame) {
//   setInterval(mod.UpdateGame, 100)
// }
