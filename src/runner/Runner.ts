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
import {BaseTaskResultInterface} from "./copy/interface/BaseTaskResultInterface";
import {entityDecoratorPreTask, entityDecoratorPostTask} from "./task/EntityDecoratorTask";
import fs from "fs";
import {TaskBeansType} from "./copy/interface/TaskBeansType";
import {commonDecoratorPostTask, commonDecoratorPreTask, TaskArgsInterface} from "./task/CommonDecoratorTask";


export function runner(args: string[]){

    // create folder dist `data`
    createFolderSync(DECORATOR_TASK_TARGET_FOLDER)

    const decoratorTasks : TaskArgsInterface[] = [
        {
            decoratorNames: [
                `@page`
            ],
            resultFileName: `PageBean.ts`,
            isRecursiveConnection: false,
            maxDepthRecursiveConnection: 0,
            taskBeans: {},
        },
        {
            decoratorNames: [
                `@entity`
            ],
            resultFileName: `EntityBean.ts`,
            isRecursiveConnection: true,
            maxDepthRecursiveConnection: 3,
            taskBeans: {},
        },
    ]

    // {
    //     preTask: Function
    //     postTask: Function,
    //     taskResult: BaseTaskResultInterface[] | BaseTaskResultInterface | TaskBeansType,
    //     targetFileName: string
    // }[] = [
        // {
        //     preTask: pageDecoratorPreTask,
        //     postTask: pageDecoratorPostTask,
        //     taskResult: [],
        //     targetFileName: `PageBean.ts`,
        // },
        // {
        //     preTask: entityDecoratorPreTask,
        //     postTask: entityDecoratorPostTask,
        //     taskResult: {},
        //     targetFileName: `EntityBean.ts`,
        // },
        // {
        //     preTask: commonDecoratorPreTask,
        //     postTask: commonDecoratorPostTask,
        //     taskResult: {},
        //     targetFileName: `CommonBean.ts`,
        // }
    // ]
    // const taskArgs : TaskArgsInterface = {
    //     decoratorNames: [
    //         `@page`,
    //         `@entity`,
    //     ],
    //     resultFileName: `PageBean.ts`,
    //     isRecursiveConnection: true,
    //     maxDepthRecursiveConnection: 3,
    //     taskBeans: {},
    // }


    const sourceFileNames = getSourceFileNames(SOURCE_PATH)
    const program = ts.createProgram(sourceFileNames, COMPILER_OPTIONS);
    const checker = program.getTypeChecker();

    program.getSourceFiles().forEach(sourceFile => {
    // sourceFileNames.forEach(sourceFile => {
    //     console.log(sourceFile.fileName)
        decoratorTasks.forEach((decoratorTask) => {
            commonDecoratorPreTask(sourceFile, program, checker, decoratorTask)
        })
    });

    decoratorTasks.forEach((decoratorTask) => {
        let fileContent = commonDecoratorPostTask(decoratorTask.taskBeans, undefined)
        const targetFullFilePath = `${DECORATOR_TASK_TARGET_FOLDER}\\${decoratorTask.resultFileName}`

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