
run: 
	node ./dist/src/index.js
	
build: 
	npm run build

clean:
	rm -rf ./dist

eth: 
	node node_modules/ganache/dist/node/cli.js

test:
	npm test

.PHONY: run, build, clean, eth, test 