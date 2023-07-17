import * as ts from 'typescript';
import {
    getClassFilePath, getDecoratorInfo,
    getSuperClasses, getTypeOfNode, removeExtension, stringifyWithDepth
} from "../util/NodeUtil";
import {BeanInterface} from "../copy/interface/BeanInterface";
import {
    DECORATOR_TASK_TARGET_FOLDER,
    PRE_SOURCE_PATH,
} from "../config/config";
import fs from "fs";

export function pageDecoratorPostTask(beanList: BeanInterface[], targetFileName: string) {
    const outputListString = stringifyWithDepth(beanList, 2)
    const importStatments = beanList.map((bean: BeanInterface) => {
        const className = bean.className
        const classPath = removeExtension(bean.classPath)
        const importStatement = `import { ${className} } from "${classPath}";`
        return importStatement
    }).join('\n')

    const importMap =
        `export const importMap: { [key: string]: any } = `
        + `{\n`
        + beanList.map((bean: BeanInterface) => {
            const className = bean.className
            const classPath = bean.classPath
            const importStatement = `\t "${classPath}/${className}" :  ${className}`
            return importStatement
        }).join(',\n')
        + `\n}`

    const fileContent =
        `import { BeanInterface } from "../interface/BeanInterface";`
        + `\n\n`
        + importStatments
        + `\n\n`
        + importMap
        + `\n\n`
        + `export const beans: BeanInterface[] = ${outputListString}`

    return fileContent
}

export function pageDecoratorPreTask(sourceFile: ts.SourceFile, program: ts.Program, checker: ts.TypeChecker, beanList: BeanInterface[]) {
    // 소스 파일 내의 모든 데코레이터 소유한 클래스 탐색
    ts.forEachChild(sourceFile, node => {
        const decorators = ts.canHaveDecorators(node) ? ts.getDecorators(node) : [];

        if (!decorators) return

        const members: any[] = []
        if (ts.isClassDeclaration(node)) {
            if (!node?.name?.text ?? undefined) return

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

                if (!member?.name?.getText() ?? undefined) return

                const memberName = member.name.getText();
                const memberDecorators = ts.canHaveDecorators(member) ? ts.getDecorators(member) : [];
                if (!memberDecorators) return

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

            const output: BeanInterface = {
                superClasses: superClasses,
                classPath: getClassFilePath(sourceFile, className, PRE_SOURCE_PATH),
                className: className,
                decorators: tobeDecorators,
                members: members
            }
            beanList.push(output)

        }
    });
}
