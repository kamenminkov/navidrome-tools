import { readdir, readFile } from "fs/promises";
import path from "path";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

import {
	Entry,
	FoobarPlaybackStatistics
} from "./types/foobar-playback-statistics.interface";

const NO_PATH = "NO_PATH";
const NAVIDROME_LOCAL_DB = "./data/sqlite/navidrome.db";

init();

async function init() {
	const inputFiles = await readdir("./data/json", { withFileTypes: true });

	const preparedData = await Promise.all(
		inputFiles.map(async (f) => {
			const filePath = path.join(...[f.parentPath, f.name]);
			const dataFromJson = await readFile(filePath, { encoding: "utf-8" });
			const parsedData: FoobarPlaybackStatistics = JSON.parse(dataFromJson);

			return prepareData(parsedData);
		})
	);

	await updateDB(preparedData);
}

async function updateDB(preparedData: Partial<Record<string, Entry[]>>[]) {
	let albumsUpdatedCount = 0;

	return await open({
		filename: NAVIDROME_LOCAL_DB,
		driver: sqlite3.Database,
		mode: sqlite3.OPEN_READWRITE
	})
		.then(async (db) => {
			for (const i in preparedData) {
				if (Object.prototype.hasOwnProperty.call(preparedData, i)) {
					const element = preparedData[i];

					let keys = Object.keys(element);

					for (const key of keys) {
						const dateTimeToSet = getTimeWithNanoseconds(
							(element[key] as unknown as Entry[])[0].AddedFriendly || ""
						);

						const path = key.replace(/\'/g, "''");

						if (path === NO_PATH) continue;

						try {
							await db.get(
								`UPDATE media_file SET created_at='${dateTimeToSet}', updated_at='${dateTimeToSet}' WHERE path LIKE '${path}%'`
							);

							const albumId = (
								await db.get(
									`SELECT album_id FROM media_file WHERE path LIKE '${path}/%'`
								)
							)?.album_id;

							if (!albumId) {
								continue;
							}

							await db.get(
								`UPDATE album SET created_at='${dateTimeToSet}', updated_at='${dateTimeToSet}', imported_at='${dateTimeToSet}' WHERE id IS '${albumId}'`
							);
						} catch (err) {
							console.error(err);
							continue;
						}

						const folderId = (
							await db.get(
								`SELECT folder_id from media_file WHERE path LIKE '${path}%'`
							)
						)?.folder_id;

						await db.exec(
							`UPDATE folder SET created_at='${dateTimeToSet}', updated_at='${dateTimeToSet}' WHERE id IS '${folderId}'`
						);

						albumsUpdatedCount++;

						console.clear();
						console.log("📢 Albums updated so far: ", albumsUpdatedCount);
					}
				}
			}

			return db;
		})
		.then((db) => {
			db.close();

			console.log("📢 Total number of albums updated: ", albumsUpdatedCount);
		})
		.catch((err) => {
			console.error(err);
			console.error(
				`There was a problem reading the database. Are you sure it exists at \`${NAVIDROME_LOCAL_DB}\`?`
			);
		})
		.finally(() => process.exit(0));
}

function prepareData(
	input: FoobarPlaybackStatistics,
	excludeMusicFolder = true
) {
	return Object.groupBy(input.PlaybackStatistics.Entry, (entry) => {
		if (!entry.Item) return NO_PATH;

		const parsedPath = path.parse(
			(Array.isArray(entry.Item) ? entry.Item.at(0)?.Path : entry.Item?.Path) ||
				""
		);

		const relPath = path.relative(
			parsedPath.root + (excludeMusicFolder ? "music\\" : ""),
			parsedPath.dir
		);

		const unixPath = convertWinPathToUnixPath(relPath);

		return unixPath;
	});
}

function convertWinPathToUnixPath(winPath: string) {
	return winPath.replace(/\\/gim, "/");
}

/**
 * @param input Date/time in the format "2023-03-31 10:37:13"
 */
function getTimeWithNanoseconds(input: string) {
	return input + ".000000000+00:00";
}
