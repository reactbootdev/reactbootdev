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
import {pageDecoratorPostTask, pageDecoratorPreTask} from "./task/PageDecoratorPreTask";
import {createFolderSync} from "./util/FileUtil";
import {BeanInterface} from "./copy/interface/BeanInterface";
import {BaskTaskResultInterface} from "./copy/interface/BaskTaskResultInterface";


function runner(args: string[]){

    // create folder dist `data`
    createFolderSync(DECORATOR_TASK_TARGET_FOLDER)

    const decoratorTasks : {
        preTask: Function
        postTask: Function,
        taskResult: BaskTaskResultInterface[] | BaskTaskResultInterface,
        targetFileName: string
    }[] = [
        {
            preTask: pageDecoratorPreTask,
            postTask: pageDecoratorPostTask,
            taskResult: [],
            targetFileName: `Bean.ts`,
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
        decoratorTask.postTask(decoratorTask.taskResult, decoratorTask.targetFileName)
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