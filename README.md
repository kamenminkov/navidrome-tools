## Preface

The creation of this tool came out of necessity - something went wrong with my Navidrome instance, I had to reimport my whole library and as a result all the metadata Navidrome keeps got lost. The "Recently Added" list was affected - naturally, when adding things from scratch, Navidrome has nowhere to restore the data from.

My solution to this problem was to use my Foobar2000 library (which points to the same music files that Navidrome does), to export the Playback statistics from it and to map the paths from there to the paths from Navidrome's database.

## Prerequisites

A recent Node.js version. Tested locally with `v.22.11.0`.

## How to use

0. Open the project and do `npm i`.
1. Copy the `navidrome.db` into the project.

- If you have direct file access to the Navidrome data, open `.env` and set `NAVIDROME_DB` to the absolute path of the `navidrome.db` file, then `npm run copy-db-from-navidrome`.
- If you don't have direct access, manually copy `navidrome.db` to `./data/sqlite/navidrome.db`.

2. Copy the playback statistics `.xml` from Foobar2000 into `./data/xml/`.
3. Run `npm run parse-xml`.
4. Run `npm run update-timestamps`.
5. Stop the Navidrome instance and, depending on whether you have direct file access to its data (like in step 1):

- Do `npm run copy-db-to-navidrome`, or
- Manually copy `navidrome.db` back to the Navidrome config folder.

6. Start Navidrome and do a Quick Scan - this should be enough to bring up the updated data.

## Disclaimer

- Always make backups. I'm not responsible for any lost data.
- This tool might not work at all for you. It was not thoroughly tested, so there might be some things that I've overlooked. It might nevertheless be a good starting point for something similar you might need to do.
