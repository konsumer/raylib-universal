The idea with this is that you can write code using the [raylib API](https://www.raylib.com/cheatsheet/cheatsheet.html) in any programming language you like (that we support) and the games you create will run natively and on the web, without recompile. More languages can be added, in the future, pretty easily.

Many of the supported languages could use raylib directly, to make a native or wasm game, but this is about sharing games that are written in any language with others, and they don't need to compile or anything, just load it up in the native/web runtime.

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
9. Optimized builders for each language. For example, `qjsc` can disable a lot of language features, if not used


## development

The tools are a bit rough, initially.

If you don't have clang/nodejs/etc build-tools installed, you prefix these commands with:

```
docker run -it --rm -v $(pwd):/cart konsumer/null0:latest
```

```
make clean                          Clean up built files
make examples                       Build all examples
make help                           Show this help
make node                           Run nodejs native-host
make web                            Run a live-reloading web-host
```
