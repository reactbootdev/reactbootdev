const fs = require('fs');
const path = require('path');


function copyFilesRecursively(sourceDir: string, targetDir: string) {
    // sourceDir에 있는 모든 파일/폴더를 읽어옵니다.
    const items = fs.readdirSync(sourceDir);

    for (const item of items) {
        const sourcePath = path.join(sourceDir, item);
        const targetPath = path.join(targetDir, item);

        const stat = fs.lstatSync(sourcePath);

        if (sourcePath.includes('data')) { // 1. 제외 폴더
            break;
        }

        if (stat.isFile()) {
            // 파일인 경우
            if (!sourcePath.includes('interface')) { // 2. 확장자 변환 폴더
                // interface 폴더 내 파일이 아닌 경우만 처리
                const parsedPath = path.parse(targetPath);
                const newPath = path.format({
                    ...parsedPath,
                    base: parsedPath.name  + parsedPath.ext + '.txt',
                });

                fs.copyFileSync(sourcePath, newPath);
                console.log(`파일 복사 및 확장자 추가: ${sourcePath} -> ${newPath}`);
            } else { // 3. 확장자 유지 폴더
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

const srcPath = path.join(__dirname, '..', 'src', 'test', 'reactjs', 'src', 'reactbootdev');
const destPath = path.join(__dirname, '..', 'src', 'runner', 'copy');
copyFilesRecursively(srcPath, destPath)
