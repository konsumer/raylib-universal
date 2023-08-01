OUT_DIR = out
BUILD_DIR = ${OUT_DIR}/.build

examples: ${OUT_DIR}/examples/justlog.wasm

${OUT_DIR}/examples/%.wasm: ${BUILD_DIR}/%.o
	@mkdir -p $(@D)
	wasm-ld --no-entry --strip-all --export-dynamic --allow-undefined --initial-memory=131072 -O3 -o $@ $?

${BUILD_DIR}/%.o: examples/%/main.c
	@mkdir -p $(@D)
	clang -c -Oz -flto -mbulk-memory --target=wasm32 -fvisibility=hidden --no-standard-libraries -Iexamples/ -o $@ $?

.PHONY: clean
clean:
	rm -rf ${OUT_DIR}