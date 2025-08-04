import { XMLParser } from "fast-xml-parser";
import { readFileSync, readdirSync, writeFileSync } from "fs";
import prettier from "prettier";

const INPUT_DIR = "./data/xml";
const OUTPUT_DIR = "./data/json";

async function init() {
	const allInputFiles = readdirSync(INPUT_DIR);

	const parser = new XMLParser({
		parseAttributeValue: true,
		ignoreAttributes: ["ID", "Added"],
		attributeNamePrefix: ""
	});

	for (const file of allInputFiles) {
		const xmlInput = readFileSync(INPUT_DIR + "\\" + file, {
			encoding: "utf-8"
		});

		const outputPath = OUTPUT_DIR + "/" + file.replace(".xml", ".json");
		const parsed = parser.parse(xmlInput);

		const output = await prettier.format(JSON.stringify(parsed), {
			parser: "json"
		});

		writeFileSync(outputPath, output);
	}
}

init();
