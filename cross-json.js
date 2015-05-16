#!/usr/bin/env iojs
"use strict";
let fs = require("fs");
let chalk = require("chalk");
let args = process.argv;
let DIRECTORY = Symbol(0);
let FILE = Symbol(1);
let help =
`Usage: cross-json.js FILE...

--help, -h: Displays this help menu`;
function displayHelp() {
	console.log(help);
}
Promise.all(process.argv.map(function(a, i, args) {
	if (args.length === 2) {
		displayHelp();
		process.exit();
	}
	if (i < 2) {
		return null;
	}
	else {
		if (a === "-h" || a === "--help") {
			displayHelp();
			return;
		}
		else {
			return args[i];
		}
	}
}).filter(function(a) {
	return a !== null;
}).map(function(file) {
	return new Promise(function(resolve, reject) {
		return fs.exists(file, function(exists) {
			if (exists) {
				resolve(file);
			}
			else {
				throw Error(`${args[0]}: ${file}: No such file or directory`);
			}
		});
	});
})).then(function(files) {
	Promise.all(files.map(function(file) {
		return new Promise(function(resolve, reject) {
			fs.realpath(file, function(e, realPath) {
				fs.stat(realPath, function(statError, stats) {
					if (statError) {
						throw Error(statError);
					}
					else {
						if (stats.isFile()) {
							resolve({
								type: FILE,
								path: file
							});
						}
						else if (stats.isDirectory()) {
							resolve({
								type: DIRECTORY,
								path: file
							});
						}
						else {
							throw Error(`${file} is not a regular file`);
						}
					}
				});
			});
		});
	})).then(function(list) {
		Promise.all(list.map(function(element) {
			return new Promise(function(resolve, reject) {
				switch (element.type) {
					case FILE:
						fs.readFile(element.path, "utf-8", function(readError, fileContent) {
							if (readError) {
								throw Error(readError);
							}
							else {
								try {
									resolve({
										json: JSON.parse(fileContent),
										element: element
									});
								}
								catch (jsonError) {
									throw Error(`Invalid JSON in file ${element.path}: ${jsonError}`);
								}
							}
						});
						break;
					case DIRECTORY:
						/* TODO: Add support for specifying directories */
						reject("ERR_DIRECTORY");
						break;
				}
			});
		})).then(function(jsonContent) {
			jsonContent.forEach(function(content, i) {
				let sourceFile = content.element.path.substr(content.element.path.lastIndexOf("/") + 1);
				for (let j = 0; j < jsonContent.length;  ++j) {
					if (i === j) {
						continue;
					}
					let comparisonFile = jsonContent[j].element.path.substr(jsonContent[j].element.path.lastIndexOf("/") + 1);
					let sourceJSON = content.json;
					let destinationJSON = jsonContent[j].json;
					for (let property in content.json) {
						if (!destinationJSON.hasOwnProperty(property)) {
							console.log(`${chalk.yellow.bold(comparisonFile)} is missing property ${chalk.red.bold(`"${property}"`)} (inferred from ${chalk.yellow.bold(sourceFile)})`);
						}
					}
				}
			});
		});
	});
});
