const fs = require('fs');
const path = require('path');


function copyFilesRecursively(sourceDir: string, targetDir: string) {
    // sourceDir에 있는 모든 파일/폴더를 읽어옵니다.
    const items = fs.readdirSync(sourceDir);

    for (const item of items) {
        const sourcePath = path.join(sourceDir, item);
        const targetPath = path.join(targetDir, item);

        const stat = fs.lstatSync(sourcePath);

        if (stat.isFile()) {
            // 파일인 경우
            if (!sourcePath.includes('interface')) {
                // interface 폴더 내 파일이 아닌 경우만 처리
                const parsedPath = path.parse(targetPath);
                const newPath = path.format({
                    ...parsedPath,
                    base: parsedPath.name  + parsedPath.ext + '.txt',
                });

                fs.copyFileSync(sourcePath, newPath);
                console.log(`파일 복사 및 확장자 추가: ${sourcePath} -> ${newPath}`);
            } else {
                // interface 폴더 내 파일인 경우 그냥 복사
                fs.copyFileSync(sourcePath, targetPath);
                console.log(`파일 복사: ${sourcePath} -> ${targetPath}`);
            }
        } else if (stat.isDirectory()) {
            // 폴더인 경우 재귀적으로 복사합니다.
            fs.mkdirSync(targetPath, { recursive: true }); // 폴더 생성
            copyFilesRecursively(sourcePath, targetPath); // 재귀 호출
        }
    }
}

// // 사용 예제:
// const sourceFolder = '원본폴더경로';
// const targetFolder = '대상폴더경로';
//
// copyFilesRecursively(sourceFolder, targetFolder);
// console.log('파일 복사가 완료되었습니다.');
//
// function reverseCopy(srcFilePath: string | undefined = undefined,
//                      destFilePath: string | undefined = undefined){
//     const srcFiles = fs.readdirSync(srcPath);
//     srcFiles.forEach((file: string) => {
//         const srcFilePath = path.join(srcPath, file);
//         const destFilePath = path.join(destPath, file);
//         console.log('srcFilePath', srcFilePath);
//         console.log('destFilePath', destFilePath);
//         console.log('file', file);
//         // const stat = fs.statSync(srcFilePath);
//         // if (stat.isDirectory()) {
//         //     // if dont exist, create folder
//         //     if (!fs.existsSync(destFilePath)){
//         //         fs.mkdirSync(destFilePath);
//         //         reverseCopy(srcFilePath, destFilePath);
//         //     } else {
//         //         reverseCopy(srcFilePath, destFilePath);
//         //     }
//         // } else {
//         //     console.log('copyFileSync', srcFilePath, destFilePath);
//         //     fs.copyFileSync(srcFilePath, destFilePath);
//         // }
//     });
// }

const srcPath = path.join(__dirname, '..', 'src', 'test', 'reactjs', 'src', 'reactbootdev');
const destPath = path.join(__dirname, '..', 'src', 'runner', 'copy');
copyFilesRecursively(srcPath, destPath)
