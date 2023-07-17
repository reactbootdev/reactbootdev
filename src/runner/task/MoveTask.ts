import {MOVE_TASK_TARGET_FOLDER, MOVE_TASK_SOURCE_DIST_FOLDER_NAMES} from "../config/config";
import {copyFolderRecursiveSync} from "../util/FileUtil";
import * as path from "path";


export function moveTask(){
    // move all folders
    MOVE_TASK_SOURCE_DIST_FOLDER_NAMES.forEach((folder: string): any => {
        const source = `${path.resolve(__dirname, '..')}\\${folder}`.replace(/\\/g, `/`)
        const target = `${MOVE_TASK_TARGET_FOLDER}`
        copyFolderRecursiveSync(source, target)
    })
}