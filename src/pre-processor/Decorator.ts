#!/usr/bin/env node

import * as ts from 'typescript';
import * as glob from 'glob';
import {
  getClassFilePath, getDecoratorInfo,
  getSuperClasses, getTypeOfNode, stringifyWithDepth
} from "../util/NodeUtil";
import {OutputInterface} from "../interface/OutputInterface";
import {outputList} from "../storage/OutputList";
import * as fs from 'fs';
import * as path from "path";

// TypeScript 컴파일러 옵션 설정
const compilerOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES5, // 적절한 대상 버전 설정
  module: ts.ModuleKind.CommonJS, // 적절한 모듈 시스템 설정
};

// 프로젝트 내 모든 TypeScript 파일 경로 설정
// 재귀적으로 모든 파일을 탐색하고 싶다면 glob 패턴을 사용하면 된다.
// glob 패턴

// if param test is true, use test file
const args = process.argv.slice(2); // Exclude the first two default arguments

let PRE_SOURCE_PATH = './src'
if (args[0] === 'test') {
  PRE_SOURCE_PATH = './test'
}

const SOURCE_PATH = `${PRE_SOURCE_PATH}/**/*.ts`
// const TARGET_DATA_FILE_PATH = `node_modules/reactbootdev/src/data`
const TARGET_DATA_FILE_PATH = `src/reactbootdev/data`
const TARGET_DATA_FILE = `${TARGET_DATA_FILE_PATH}/Data.ts`
const OUTPUT_INTERFACE_PATH = `reactbootdev`
const TARGET_DECORATOR_FILE_PATH = `src\\reactbootdev\\decorator`
const TARGET_INTERFACE_FILE_PATH = `src\\reactbootdev\\interface`

const fileNames = glob.sync(
    SOURCE_PATH,
    {
        ignore: [
            '**/node_modules/**/*.ts',
            '**/*.spec.ts',
        ],
    }
);

console.log(fileNames)

// 컴파일러 프로그램 생성
const program = ts.createProgram(fileNames, compilerOptions);
const checker = program.getTypeChecker();


program.getSourceFiles().forEach(sourceFile => {
  // 소스 파일 내의 모든 데코레이터 소유한 클래스 탐색
  ts.forEachChild(sourceFile, node => {
    const decorators = ts.canHaveDecorators(node) ? ts.getDecorators(node) : [];

    if(!decorators) return

    const members: any[] = []
    if (ts.isClassDeclaration(node)) {
      if(! node?.name?.text ?? undefined) return

      // 클래스
      const className = node.name.text

      // 데코레이터
      const tobeDecorators: any[] = []
      decorators.forEach(d => {
        let decoratorInfo = getDecoratorInfo(d, checker, sourceFile)
        if (decoratorInfo == null) return
        tobeDecorators.push(decoratorInfo);
      });

      // 부모 클래스
      const superClasses = getSuperClasses(node, sourceFile).map(el => {
        return {
          className: el,
          classPath: getClassFilePath(sourceFile, el, PRE_SOURCE_PATH)
        }
      })

      // 프로퍼티, 메소드
      node.members.forEach(member => {
        if (
            !ts.isPropertyDeclaration(member)
            && !ts.isMethodDeclaration(member)
        ) return

        if(! member?.name?.getText() ?? undefined) return

        const memberName = member.name.getText();
        const memberDecorators = ts.canHaveDecorators(member) ? ts.getDecorators(member) : [];
        if(!memberDecorators) return

        let tobeMemberDecorators: any[] = []
        memberDecorators.forEach(d => {
          let decoratorInfo = getDecoratorInfo(d, checker, sourceFile)
          if (decoratorInfo == null) return
          tobeMemberDecorators.push(decoratorInfo);
        });

        members.push(
            {
              name: memberName,
              type: ts.isPropertyDeclaration(member) ? 'property' : 'method',
              dataType: getTypeOfNode(member, program),
              decorators: tobeMemberDecorators
            })
      });

      const output: OutputInterface = {
        superClasses: superClasses,
        classPath: getClassFilePath(sourceFile, className, PRE_SOURCE_PATH),
        className: className,
        decorators: tobeDecorators,
        members: members
      }
      outputList.push(output)

    }
  });
});

//write file
// if folder not exist, create folder recursively
if (!fs.existsSync(TARGET_DATA_FILE_PATH)) {
    fs.mkdirSync(TARGET_DATA_FILE_PATH, { recursive: true });
}
const outputListString = stringifyWithDepth(outputList, 2)
fs.writeFileSync(
    TARGET_DATA_FILE,
    // `import { OutputInterface } from "${OUTPUT_INTERFACE_PATH}/src/interface/OutputInterface";\n\nexport const outputList: OutputInterface[] = ${outputListString}`
    `import { OutputInterface } from "../interface/OutputInterface";\n\nexport const outputList: OutputInterface[] = ${outputListString}`
)


// if folder not exist, create folder recursively
if (!fs.existsSync(TARGET_DECORATOR_FILE_PATH)) {
  fs.mkdirSync(TARGET_DECORATOR_FILE_PATH, { recursive: true });
}
// copy decorator files to target folder by regex
const decoratorFileNames = glob.sync(
    `${path.resolve(__dirname, '..')}\\decorator\\*.*`.replace(/\\/g, `/`),
    {
        ignore: [
            '**/*.spec.ts',
        ],
    }
);
decoratorFileNames.forEach(fileName => {
    // string convert `src/decorator/` to  ${TARGET_DECORATOR_FILE_PATH}/
    const targetFileName = fileName.replace("src\\decorator\\", `${TARGET_DECORATOR_FILE_PATH}\\`)

    fs.copyFileSync(fileName, targetFileName)
})



// if folder not exist, create folder recursively
if (!fs.existsSync(TARGET_INTERFACE_FILE_PATH)) {
    fs.mkdirSync(TARGET_INTERFACE_FILE_PATH, { recursive: true });
}
// replaceAll
// console.log(`${path.resolve(__dirname, '..')}\\interface\\*.*`.replace(`/\\/g`, `/`))
console.log()

// copy decorator files to target folder by regex
const interfaceFileNames = glob.sync(
    `${path.resolve(__dirname, '..')}\\interface\\*.*`.replace(/\\/g, `/`),
    {
        ignore: [
            '**/*.spec.ts',
        ],
    }
);
interfaceFileNames.forEach(fileName => {
    // string convert `src/decorator/` to  ${TARGET_DECORATOR_FILE_PATH}/
    console.log(fileName)
    const targetFileName = fileName.replace("src\\interface\\", `${TARGET_INTERFACE_FILE_PATH}\\`)

    console.log(targetFileName)
    fs.copyFileSync(fileName, targetFileName)
})

// how to get this file dir path
//


// console.log(__dirname)
// console.log(process.cwd())
// console.log(path.resolve(__dirname, '..'))
// console.log(path.resolve(__dirname, '../..'))
// console.log(path.resolve(__dirname, '../../..'))
// console.log(path.resolve(__dirname, '../../../..'))
// console.log(path.resolve(__dirname, '../../../../..'))
// console.log(path.resolve(__dirname, '../../../../../..'))
// console.log(path.resolve(__dirname, '../../../../../../..'))
