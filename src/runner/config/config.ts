import path from "path";
import * as ts from 'typescript';
import * as glob from "glob";


// TypeScript 컴파일러 옵션 설정
export const COMPILER_OPTIONS: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES5, // 적절한 대상 버전 설정
    module: ts.ModuleKind.CommonJS, // 적절한 모듈 시스템 설정
};


// if param test is true, use test file
export const PROCESS_ARGS = process.argv.slice(2); // Exclude the first two default arguments
export const PROCESS_ARG_PROFILE = PROCESS_ARGS[0]
export enum PROCESS_PROFILE_ENUM {
    TEST = 'test',
    PROD = 'prod'
}

export const PRE_SOURCE_PATH =
    PROCESS_PROFILE_ENUM.TEST === PROCESS_ARG_PROFILE ? './src/test' : './src'

export const SOURCE_PATH = `${PRE_SOURCE_PATH}/**/*.ts?(x)`





export const DECORATOR_TASK_TARGET_FOLDER = `${path.resolve(__dirname, '..\\..')}\\dist\\data`
export const COPY_TASK_PREFIX_FOLDER_PATH = `\\src\\runner\\copy\\`
export const MOVE_TASK_SOURCE_DIST_FOLDER_NAMES = [
    `decorator`,
    `interface`,
    `data`
]
export const MOVE_TASK_TARGET_FOLDER = `.\\src\\reactbootdev\\`

// 프로젝트 내 모든 TypeScript 파일 경로 설정
// 재귀적으로 모든 파일을 탐색하고 싶다면 glob 패턴을 사용하면 된다.
// glob 패턴
export function getSourceFileNames(sourcePath: string) {
    return glob.sync(
        sourcePath,
        {
            ignore: [
                '**/node_modules/**/*.ts',
                '**/*.spec.ts',
            ],
        }
    );
}


