#!/usr/bin/env node

import {moveTask} from "./task/MoveTask";
import {copyTask} from "./task/CopyTask";
import ts from "typescript";
import {COMPILER_OPTIONS, DECORATOR_TASK_TARGET_FOLDER, getSourceFileNames, SOURCE_PATH} from "./config/config";
import {createFolderSync} from "./util/FileUtil";
import fs from "fs";
import {commonDecoratorPostTask, commonDecoratorPreTask, TaskArgsInterface} from "./task/CommonDecoratorTask";


export function runner(args: string[]) {

    // create folder dist `data`
    createFolderSync(DECORATOR_TASK_TARGET_FOLDER)

    const decoratorTasks: TaskArgsInterface[] = [
        {
            decoratorNames: [
                `@page`
            ],
            resultFileName: `page`,
            isRecursiveConnection: false,
            maxDepthRecursiveConnection: 0,
            taskBeans: {},
        },
        {
            decoratorNames: [
                `@entity`
            ],
            resultFileName: `entity`,
            isRecursiveConnection: true,
            maxDepthRecursiveConnection: 3,
            taskBeans: {},
        },
    ]

    const sourceFileNames = getSourceFileNames(SOURCE_PATH)
    const program = ts.createProgram(sourceFileNames, COMPILER_OPTIONS);
    const checker = program.getTypeChecker();

    program.getSourceFiles().forEach(sourceFile => {
        // sourceFileNames.forEach(sourceFile => {

        const ignoreSubString = [`node_modules`]
        const isIgnoreFile = ignoreSubString.some((subString) => {
            return sourceFile.fileName.includes(subString)
        })

        if (isIgnoreFile) {
            return
        }

        console.log(`sourceFile: ${sourceFile.fileName}`)
        decoratorTasks.forEach((decoratorTask) => {
            commonDecoratorPreTask(sourceFile, program, checker, decoratorTask)
        })
    });

    decoratorTasks.forEach((decoratorTask) => {
        let fileContent = commonDecoratorPostTask(decoratorTask, undefined, decoratorTask.isRecursiveConnection ? decoratorTask.maxDepthRecursiveConnection : 1)

        const upperFirstCharFileName = decoratorTask.resultFileName.charAt(0).toUpperCase() + decoratorTask.resultFileName.slice(1)
        const targetFullFilePath = `${DECORATOR_TASK_TARGET_FOLDER}\\${upperFirstCharFileName}Bean.ts`

        fs.writeFileSync(
            targetFullFilePath, fileContent
        )
    })


    const tasks = [
        copyTask,
        moveTask
    ]

    tasks.forEach((task: any) => {
        task()
    })
}


runner(process.argv)