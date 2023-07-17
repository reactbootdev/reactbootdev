#!/usr/bin/env node

import {moveTask} from "./task/MoveTask";
import {copyTask} from "./task/CopyTask";
import ts from "typescript";
import {
    COMPILER_OPTIONS,
    getSourceFileNames,
    SOURCE_PATH,
    DECORATOR_TASK_TARGET_FOLDER
} from "./config/config";
import {pageDecoratorPostTask, pageDecoratorPreTask} from "./task/PageDecoratorTask";
import {createFolderSync} from "./util/FileUtil";
import {BaskTaskResultInterface} from "./copy/interface/BaskTaskResultInterface";
import {entityDecoratorPreTask, entityDecoratorPostTask} from "./task/EntityDecoratorTask";
import fs from "fs";
import {FileObjectsType} from "./copy/interface/EntityBeanInterface";


export function runner(args: string[]){

    // create folder dist `data`
    createFolderSync(DECORATOR_TASK_TARGET_FOLDER)

    const decoratorTasks : {
        preTask: Function
        postTask: Function,
        taskResult: BaskTaskResultInterface[] | BaskTaskResultInterface | FileObjectsType,
        targetFileName: string
    }[] = [
        {
            preTask: pageDecoratorPreTask,
            postTask: pageDecoratorPostTask,
            taskResult: [],
            targetFileName: `PageBean.ts`,
        },
        {
            preTask: entityDecoratorPreTask,
            postTask: entityDecoratorPostTask,
            taskResult: {},
            targetFileName: `EntityBean.ts`,
        }
    ]


    const sourceFileNames = getSourceFileNames(SOURCE_PATH)
    console.log(`sourceFileNames`)
    console.log(sourceFileNames)

    const program = ts.createProgram(sourceFileNames, COMPILER_OPTIONS);
    const checker = program.getTypeChecker();

    program.getSourceFiles().forEach(sourceFile => {
        decoratorTasks.forEach((decoratorTask: any) => {
            decoratorTask.preTask(sourceFile, program, checker, decoratorTask.taskResult)
        })
    });

    decoratorTasks.forEach((decoratorTask: any) => {
        let fileContent = decoratorTask.postTask(decoratorTask.taskResult, decoratorTask.targetFileName)
        const targetFullFilePath = `${DECORATOR_TASK_TARGET_FOLDER}\\${decoratorTask.targetFileName}`

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