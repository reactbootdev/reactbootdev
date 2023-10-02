import {copyFolderRecursiveSync} from "../util/FileUtil";
import * as path from "path";
import fs from "fs";
import {COPY_TASK_PREFIX_FOLDER_PATH} from "../config/config";

export function copyTask() {
    // `dist` folder
    const WORKSPACE_FOLDER = `${path.resolve(__dirname, '..')}`
    const ABSOLUT_COPY_TASK_FOLDER_PATH = `${path.resolve(__dirname, '..\\..')}${COPY_TASK_PREFIX_FOLDER_PATH}`
    const SUB_FOLDERS = fs.readdirSync(ABSOLUT_COPY_TASK_FOLDER_PATH)

    SUB_FOLDERS.forEach((subFolder: string): any => {
        const sourceDecoratorFolder = `${ABSOLUT_COPY_TASK_FOLDER_PATH}${subFolder}`
        copyFolderRecursiveSync(sourceDecoratorFolder, WORKSPACE_FOLDER)
    })

}