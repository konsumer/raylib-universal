OUT_DIR = out
BUILD_DIR = ${OUT_DIR}/.build

.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z/._-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "make \033[36m%-30s\033[0m %s\n", $$1, $$2}'

examples: ${OUT_DIR}/examples/justlog.wasm ## Build all examples

${OUT_DIR}/examples/%.wasm: ${BUILD_DIR}/%.o
	@mkdir -p $(@D)
	wasm-ld --no-entry --strip-all --export-dynamic --allow-undefined --initial-memory=131072 -O3 -o $@ $?

${BUILD_DIR}/%.o: examples/%/main.c
	@mkdir -p $(@D)
	clang -c -Oz -flto -mbulk-memory --target=wasm32 -fvisibility=hidden --no-standard-libraries -Iexamples/ -o $@ $?

.PHONY: clean
clean: ## Clean up built files
	rm -rf ${OUT_DIR}

.PHONY: node
node: ## Run nodejs native-host
	@node host/node/host.js

.PHONY: web
web: ## Run a live-reloading web-host
	@node host/web/server.js