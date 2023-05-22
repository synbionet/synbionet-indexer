
run: 
	node ./dist/src/index.js
	
build: 
	npm run build

clean:
	rm -rf ./dist

test:
	npm test

.PHONY: run, build, clean, test 