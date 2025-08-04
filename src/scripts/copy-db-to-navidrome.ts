import { configDotenv } from "dotenv";
import { copyFileSync, existsSync } from "fs";
import { open, utimes } from "fs/promises";
import path from "path";

configDotenv();

const SOURCE_DB_PATH = "./data/sqlite/navidrome.db";
const DESTINATION_DB_PATH = process.env.NAVIDROME_DB;
const TIME = new Date();

(async () => {
	if (
		DESTINATION_DB_PATH &&
		existsSync(path.dirname(DESTINATION_DB_PATH)) &&
		SOURCE_DB_PATH &&
		existsSync(SOURCE_DB_PATH)
	) {
		try {
			copyFileSync(SOURCE_DB_PATH, DESTINATION_DB_PATH);

			await utimes(DESTINATION_DB_PATH, TIME, TIME).catch(async (err) => {
				// Not sure if updating the time is actually needed.

				if ("ENOENT" === err) {
					throw err;
				}

				const fh = await open(DESTINATION_DB_PATH, "a");
				await fh.close();
			});
		} catch (err) {
			console.error("Failed to copy DB to destination", err);
		}
	}
})();
