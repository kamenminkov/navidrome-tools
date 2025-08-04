import dotenv from "dotenv";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

dotenv.config();

const SOURCE_DB_PATH = process.env.NAVIDROME_DB;
const DESTINATION_DB_PATH = "./data/sqlite/navidrome.db";

(() => {
	const destinationDir = path.dirname(DESTINATION_DB_PATH);

	if (!existsSync(destinationDir)) {
		mkdirSync(destinationDir, { recursive: true });
	}

	if (SOURCE_DB_PATH) {
		try {
			copyFileSync(SOURCE_DB_PATH, DESTINATION_DB_PATH);
		} catch (err) {
			console.error(err);
		}
	}
})();
