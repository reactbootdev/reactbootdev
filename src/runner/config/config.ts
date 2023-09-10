import path from "path";
import * as ts from 'typescript';
import * as glob from "glob";

export const KEY_DELIMITER = '////'

// TypeScript 컴파일러 옵션 설정
export const COMPILER_OPTIONS: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES5, // 적절한 대상 버전 설정
    module: ts.ModuleKind.CommonJS, // 적절한 모듈 시스템 설정
};


export enum PROCESS_PROFILE_ENUM {
    TEST = 'test',
    PROD = 'prod',
    DEV = 'dev'
}

// if param test is true, use test file
export const PROCESS_ARGS = process.argv.slice(2); // Exclude the first two default arguments
export const PROCESS_ARG_PROFILE = PROCESS_ARGS[0] ?? PROCESS_PROFILE_ENUM.PROD
export const PROCESS_ARG_SOURCE_FOLDER = PROCESS_ARGS[1]
export const PROCESS_ARG_TARGET_FOLDER = PROCESS_ARGS[2]

export const PRE_SOURCE_PATH =
    PROCESS_ARG_SOURCE_FOLDER !== undefined ? PROCESS_ARG_SOURCE_FOLDER :
    PROCESS_PROFILE_ENUM.PROD === PROCESS_ARG_PROFILE
        ? './src'
        : './src/test/source'

export const SOURCE_PATH = `${PRE_SOURCE_PATH}/**/*.ts?(x)`


export const DECORATOR_TASK_TARGET_FOLDER = `${path.resolve(__dirname, '..\\..')}\\dist\\data`
export const COPY_TASK_PREFIX_FOLDER_PATH = `\\src\\runner\\copy\\`
export const MOVE_TASK_SOURCE_DIST_FOLDER_NAMES = [
    `config`,
    `api`,
    `component`,
    `entity`,
    `repository`,
    `decorator`,
    `interface`,
    `util`,
    `data`
]
export const MOVE_TASK_TARGET_FOLDER =
    PROCESS_ARG_TARGET_FOLDER !== undefined ? PROCESS_ARG_TARGET_FOLDER :
    PROCESS_PROFILE_ENUM.PROD === PROCESS_ARG_PROFILE
        ? `.\\src\\reactbootdev\\`
        : `.\\src\\test\\reactjs\\src\\reactbootdev\\`

// 프로젝트 내 모든 TypeScript 파일 경로 설정
// 재귀적으로 모든 파일을 탐색하고 싶다면 glob 패턴을 사용하면 된다.
// glob 패턴
export function getSourceFileNames(sourcePath: string) {
    console.log(`---------------------------------`)
    console.log(`PROCESS_ARGS: ${JSON.stringify(PROCESS_ARGS)}`)
    console.log(`PROCESS_ARG_PROFILE: ${PROCESS_ARG_PROFILE}`)
    console.log(`PRE_SOURCE_PATH: ${PRE_SOURCE_PATH}`)
    console.log(`MOVE_TASK_TARGET_FOLDER: ${MOVE_TASK_TARGET_FOLDER}`)

    const sourceFileNames = glob.sync(
        sourcePath,
        {
            ignore: [
                '**/src/reactbootdev/**/*',
                '**/node_modules/**/*',
                '**/*.spec.ts',
            ],
        }
    );

    console.log(`SOURCE_PATH: ${sourcePath}`)
    console.log(`SOURCE_FILE_NAMES:`)
    console.log(sourceFileNames)
    console.log(`---------------------------------`)

    return sourceFileNames;
}


