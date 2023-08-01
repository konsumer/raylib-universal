The idea with this is that you can write code using the [raylib API](https://www.raylib.com/cheatsheet/cheatsheet.html) in any programming language you like (that we support) and the games you create will run natively and on the web, without recompile. More languages can be added, in the future, pretty easily.

Many of the supported languages could use raylib directly, to make a native or wasm game, but this is about sharing games that are written in any language with others, and they don't need to compile or anything, just load it up in the native/web runtime.


## usecases

You like C.
You make a game in C and compile it to wasm using clang, and that wasm can be run in native runtime or on the web, without being recompiled.

You like C, and want to be able to edit on the fly, and have your game update.
You make a game in C and run it in native runtime or on the web, and it will update when you make changes (by recompiling.)

You like JS, but want to pre-compile it for distribution & performance.
You make a game in JS and compile it to wasm using quickjs, and that wasm can be run in native runtime or on the web, without being recompiled.

You like JS, and want to be able to edit on the fly, and have your game update.
You make a game in JS and run it in native runtime or on the web, and it will update when you make changes (by recompiling.)

You like JS, and want your source to be exposed (like in a codepen.)
You make a game in JS and run it on the web, and it will update when you make changes.

You like typescript, but want to pre-compile it for distribution & performance.
You make a game in JS and compile it to wasm using assemblyscript, and that wasm can be run in native runtime or on the web, without being recompiled.

You like typescript, and want to be able to edit on the fly, and have your game update.
You make a game in typescript and run it in native runtime or on the web, and it will update when you make changes (by recompiling.)

You like python, but want to pre-compile it for distribution & performance.
You make a game in JS and compile it to wasm using micropython, and that wasm can be run in native runtime or on the web, without being recompiled.

You like python, and want to be able to edit on the fly, and have your game update.
You make a game in python and run it in native runtime or on the web, and it will update when you make changes (by recompiling.)

You like lua, but want to pre-compile it for distribution & performance.
You make a game in lua and compile it to wasm using nelua, and that wasm can be run in native runtime or on the web, without being recompiled.

You like lua, and want to be able to edit on the fly, and have your game update.
You make a game in lua and run it in native runtime or on the web, and it will update when you make changes (by recompiling.)

You like rust.
You make a game in rust and compile it to wasm, and that wasm can be run in native runtime or on the web, without being recompiled.

You like rust, and want to be able to edit on the fly, and have your game update.
You make a game in rust and run it in native runtime or on the web, and it will update when you make changes (by recompiling.)

You like nim.
You make a game in nim and compile it to wasm using clang, and that wasm can be run in native runtime or on the web, without being recompiled.

You like nim, and want to be able to edit on the fly, and have your game update.
You make a game in nim and run it in native runtime or on the web, and it will update when you make changes (by recompiling.)

You like zig.
You make a game in zig and compile it to wasm, and that wasm can be run in native runtime or on the web, without being recompiled.

You like zig, and want to be able to edit on the fly, and have your game update.
You make a game in zig and run it in native runtime or on the web, and it will update when you make changes (by recompiling.)


Essentially, any language that can compile to wasm (or has an interpretor that can compile to wasm) should work. Compiled languages should be prefered, and there is a system in place for auto-recompiling on change (when developing locally.)

After you have your game ready for "production" you can easily compile it to a standalone website or EXE for distribution, on all supported platforms.


## work

### primary

Before working on other game-languages, the 3 main areas that should be complete are:

1. Web host runtime (maybe just raylib-wasm wrapper, to start)
2. Native host runtime (node)
3. C cart header (imports raylib from the host)

### secondary

After the first goals are met, these goals should be worked on:

1. Replace node native runtime with something small & light (c, nim, rust, etc)
2. Analyze the wasm at "production" build-time, and see what is needed in the native/web runtime, and strip out anything that is not used from host.
3. "production" standalone EXE for every target (cross-compile would be best, so we can compile for other platforms.) 
4. "production" standalone website
5. Retroarch host runtime
6. "production" zip file, that has the wasm & assets (for use in native/web/retroarch)
7. more language game-headers & examples
8. CI for building native runtime/tooling, to make it easy to get started with it.
