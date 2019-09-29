import {resolve} from "path";
import {readFileSync} from "fs";

export const dataLocation: string = resolve(`${__dirname}/../data/`);
export const PREFIX: string = '/';
export const TOKEN: string = readFileSync(`${dataLocation}/token.json`).toString();
export const whiteListedApps: Map<string, string> = new Map(
    JSON.parse(
        readFileSync(`${dataLocation}/whitelist.json`).toString()
    )
);