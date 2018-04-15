import { fs } from "mz";
import { FILE, DIRECTORY } from "./symbols.js";
export function getHomeDirectory() {
	return process.env.HOME || process.env.USERPROFILE;
};
export async function extendedStat(path) {
	const stats = await fs.stat(path);
	const type =
		stats.isFile() ? FILE :
		stats.isDirectory() ? DIRECTORY :
		throw `${path} is not a regular file`;
	return ({
		path,
		type
	});
}