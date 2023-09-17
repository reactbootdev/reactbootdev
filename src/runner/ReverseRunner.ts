


// copy from test\reactjs\src\reactbootdev to src\runner\copy

function reverseCopy(srcFilePath: string | undefined = undefined,
                     destFilePath: string | undefined = undefined){
    const fs = require('fs');
    const path = require('path');
    const srcPath = path.join(__dirname, 'test', 'reactjs', 'src', 'reactbootdev');
    const destPath = path.join(__dirname, 'src', 'runner', 'copy');
    const srcFiles = fs.readdirSync(srcPath);
    srcFiles.forEach((file: string) => {
        const srcFilePath = path.join(srcPath, file);
        const destFilePath = path.join(destPath, file);
        const stat = fs.statSync(srcFilePath);
        if (stat.isDirectory()) {
            fs.mkdirSync(destFilePath);
            reverseCopy(srcFilePath, destFilePath);
        } else {
            fs.copyFileSync(srcFilePath, destFilePath);
        }
    });
}

reverseCopy()
