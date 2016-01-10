"use strict";
import "babel-polyfill";
import chalk from "chalk";
import fsp from "fs-promise";
import path from "path";
import { getHomeDirectory, extendedStat } from "./fs-helpers.js";
import { FILE, DIRECTORY } from "./symbols.js";
/**
* Compares objects with one another and reports their property differences.
* @param {Object} a An object with the two properties "file" (the filename to display) and "json" (the file content as an object)
* @param {Object} b An object with the same structure to compare "a" to
*/
function compare(a, b) {
	let [fileA, fileB, jsonA, jsonB] = [a.file, b.file, a.json, b.json];
	let [prefixA, prefixB] = [a.prefix || "", b.prefix || ""];
	for (let property in jsonA) {
		let [propertyA, propertyB] = [jsonA[property], jsonB[property]];
		/* Check if "b" misses the property inferred from "a" */
		if (!jsonB.hasOwnProperty(property)) {
			console.log(`${chalk.yellow.bold(fileB)} is missing property ${chalk.red.bold(`"${prefixA}${property}"`)} (inferred from ${chalk.yellow.bold(fileA)})`);
		}
		if (!(propertyB instanceof Object && !jsonB.hasOwnProperty(property))) {
			/* If "a" contains an object, we need to compare more deeply */
			if (propertyA instanceof Object) {
				compare({
					file: fileA,
					json: propertyA || {},
					prefix: `${prefixA}${property}.`
				}, {
					file: fileB,
					json: propertyB || {},
					prefix: `${prefixB}${property}.`
				});
			}
		}
	}
}
/**
* Compares JSON files with one another and reports their property differences.
* @param paths A variadic list of strings representing (absolute or relative) filenames to JSON files
* @return A promise that resolves when the comparison is finished
*/
export async function crossCompare(...paths) {
	let [extendedStats, jsonContents] = [new Map(), new Map()];
	for (let filePath of paths) {
		try {
			/* Transform all paths to absolute paths */
			let path = await fsp.realpath(filePath.replace(/^~/g, getHomeDirectory()));
			/* Then, check out a small section of the file's extendedStats */
			extendedStats.set(filePath, await extendedStat(path));
		}
		catch (e) {
			throw e;
		}
		let content;
		try {
			/* Treat files */
			if (extendedStats.get(filePath).type === FILE) {
				content = await fsp.readFile(extendedStats.get(filePath).path, "utf-8");
			}
			/* Treat directories */
			else if (extendedStats.get(filePath).type === DIRECTORY) {
				/* TODO: Support directories */
				throw Error("Directories are not supported yet")
			}
		}
		catch (e) {
			throw e;
		}
		try {
			/* Check if all files contain JSON */
			let json = JSON.parse(content);
			jsonContents.set(filePath, json);
		}
		catch (e) {
			throw Error(`Invalid JSON in file ${filePath}: ${e}`);
		}
	}
	/* Compare each file with each other file */
	for (let [sourcePath, sourceJSON] of jsonContents) {
		let sourceFile = path.basename(sourcePath);
		for (let [comparisonPath, comparisonJSON] of jsonContents) {
			let comparisonFile = path.basename(comparisonPath);
			/* Don't compare a file to itself */
			if (sourcePath === comparisonPath) {
				continue;
			}
			compare({
				file: sourcePath,
				json: sourceJSON
			}, {
				file: comparisonPath,
				json: comparisonJSON
			});
		}
	}
}
export default {
	crossCompare
};