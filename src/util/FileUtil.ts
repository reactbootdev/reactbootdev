import * as fs from "fs";
import * as path from "path";


export function copyFolderRecursiveSync(source: string, target: string) {
    let files = [];

    // check if folder needs to be created or integrated
    let targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
    }

    // copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {
            let curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                fs.copyFileSync(curSource, path.join(targetFolder, file));
            }
        });
    }
}
