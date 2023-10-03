import * as fs from "fs";
import * as path from "path";

export function createFolderSync(targetFolder: string) {
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, {recursive: true});
    }
}

const BACKUP_EXT = '.txt'

export function copyFolderRecursiveSync(source: string, target: string) {
    let files = [];

    // check if folder needs to be created or integrated
    let targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, {recursive: true});
    }

    // copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {

            // only ts and tsx files
            const allowExt = ['.ts', '.tsx', BACKUP_EXT]
            if (!allowExt.includes(path.extname(file))) return

            let curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                copyFileIfChanged(curSource, path.join(targetFolder, file));
            }
        });
    }
}

export function copyFileIfChanged(sourceFile: string, targetFile: string) {
    // 이전 파일 내용을 읽어옵니다.
    let previousContent = '';
    try {
        previousContent = fs.readFileSync(targetFile, 'utf8');
    } catch (error: unknown) { // Specify the type as 'unknown'
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            throw error;
        }
    }

    // 변경 여부를 확인하기 위해 파일 크기를 비교합니다.
    const previousSize = previousContent.length;
    const currentSize = fs.statSync(sourceFile).size;
    const hasChanged = previousSize !== currentSize;

    if (!hasChanged) {
        // TODO :: verbose option 설정 or log level
        // console.debug('No changes detected. File not copied:', targetFile , `<` , sourceFile);
        return
    }

    // if ext is `.txt`, remove `.txt` extension
    const ext = path.extname(targetFile)
    if (ext === BACKUP_EXT) {
        targetFile = targetFile.replace(ext, '')
    }

    // 변경된 경우 파일을 복사합니다.
    fs.copyFileSync(sourceFile, targetFile);
    console.debug('File copied:', targetFile, `<`, sourceFile);

}
