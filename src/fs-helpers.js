import fsp from "fs-promise";
import { FILE, DIRECTORY } from "./symbols.js";
export function getHomeDirectory() {
	return process.env.HOME || process.env.USERPROFILE;
};
export async function extendedStat(path) {
	let stats;
	let type = null;
	try {
		stats = await fsp.stat(path);
	}
	catch (e) {
		throw e;
	}
	if (stats.isFile()) {
		type = FILE;
	}
	else if (stats.isDirectory()) {
		type = DIRECTORY;
	}
	if (type) {
		return ({
			path,
			type
		});
	}
	throw Error(`${path} is not a regular file`);
};