import * as ts from "typescript";
import {DecoratorInfoInterface} from "../copy/interface/BeanInterface";

export function stringifyWithDepth(obj: any, maxDepth: number, currentDepth: number = 0): string {
    if (currentDepth > maxDepth) {
        return JSON.stringify(undefined);
    }

    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            const keys = Object.keys(value);
            if (keys.length > 0 && currentDepth < maxDepth) {
                return value;
            }
        }
        return value;
    }, 1);
}


export function printJsonWithDepth(obj: any, maxDepth: number = 5): void {
    console.log(stringifyWithDepth(obj, maxDepth));
}


export function getSuperClasses(node: ts.ClassDeclaration, sourceFile: ts.SourceFile): string[] {
    const superClasses: string[] = [];

    if (node.heritageClauses) {
        const extendsClause = node.heritageClauses.find(clause => clause.token === ts.SyntaxKind.ExtendsKeyword);
        if (extendsClause) {
            extendsClause.types.forEach(type => {
                const superClass = type.expression.getText(sourceFile);
                superClasses.push(superClass);
            });
        }
    }

    return superClasses;
}

export function getClassFilePath(sourceFile: ts.SourceFile, className: string, preSourcePath: string): string | undefined {
    let classFilePath: string | undefined;

    ts.forEachChild(sourceFile, node => {
        if(!ts.isClassDeclaration(node)) return
        if (!node.name) return

        classFilePath = sourceFile.fileName;
    });

    if (!classFilePath) return undefined;
    return classFilePath
    // TODO :: remove
    // return replaceSrcPath(preSourcePath, classFilePath);
}


export function getTypeOfNode(node: ts.Node, program: ts.Program): string {
    const typeChecker = program.getTypeChecker();
    const type = typeChecker.getTypeAtLocation(node);
    return typeChecker.typeToString(type);
}

export function getDecoratorName(decorator: ts.Decorator): string | undefined {
    if (ts.isCallExpression(decorator.expression) && ts.isIdentifier(decorator.expression.expression)) {
        return decorator.expression.expression.text;
    }
    return undefined;
}

export function getDecoratorArgsTxt(decorator: ts.Decorator, sourceFile: ts.SourceFile): string[] {
    const args: ts.Expression[] = [];

    if (ts.isCallExpression(decorator.expression)) {
        args.push(...decorator.expression.arguments);
    }

    return args.map(el => el.getText(sourceFile));
}



export function getDecoratorInfo(decorator: ts.Decorator, checker: ts.TypeChecker, sourceFile: ts.SourceFile)
    : DecoratorInfoInterface | undefined {

    const decoratorName = getDecoratorName(decorator)
    const definition = getDecoratorDefinition(decorator, checker)
    const argValues = getDecoratorArgsReal(decorator, checker)
    const argTypes = getDecoratorType(decorator)
    const argsTexts = getDecoratorArgsTxt(decorator, sourceFile)

    if(decoratorName === undefined) return undefined
    if(definition === undefined) return undefined
    if(argValues === undefined) return undefined
    if(argTypes === undefined) return undefined
    if(argsTexts === undefined) return undefined

    return {
        decoratorName: decoratorName,
        definition: definition,

        arguments: argValues.map((el, idx) => {
            return {
                type: argTypes[idx],
                value: argValues[idx],
                txt: argsTexts[idx],
            }
        })

    }
}


export function getDecoratorDefinition(decorator: ts.Decorator, checker: ts.TypeChecker): string | undefined {
    if (ts.isCallExpression(decorator.expression)) {
        const decoratorType = checker.getTypeAtLocation(decorator.expression.expression);
        const decoratorTypeString = checker.typeToString(decoratorType);

        const decoratorValue = decorator.expression.arguments.map(arg => {
            // @ts-ignore
            const argValue = checker.getConstantValue(arg);
            return argValue;
        });

        return decoratorTypeString;
    }
    return undefined;
}

function getDecoratorType(decorator: ts.Decorator): string[] {
    if (ts.isCallExpression(decorator.expression)) {
        return decorator.expression.arguments.map(arg => {
            const argType = arg.kind === ts.SyntaxKind.TrueKeyword || arg.kind === ts.SyntaxKind.FalseKeyword
                ? 'boolean'
                : arg.kind === ts.SyntaxKind.StringLiteral
                    ? 'string'
                    : arg.kind === ts.SyntaxKind.NumericLiteral
                        ? 'number'
                        : ts.isArrayLiteralExpression(arg)
                            ? 'any[]'
                            : 'any';
            return argType;
        });
    }
    return [];
}

export function getDecoratorArgsReal(decorator: ts.Decorator, checker: ts.TypeChecker): any[] {
    if (ts.isCallExpression(decorator.expression)) {
        return decorator.expression.arguments.map(arg => {
            const argValue = getArgumentValue(arg, checker);
            return argValue;
        });
    }
    return [];
}

function getArgumentValue(arg: ts.Expression, checker: ts.TypeChecker): any {
    if (arg.kind === ts.SyntaxKind.TrueKeyword) {
        return true;
    } else if (arg.kind === ts.SyntaxKind.FalseKeyword) {
        return false;
    } else if (ts.isStringLiteral(arg)) {
        return arg.text;
    } else if (ts.isNumericLiteral(arg)) {
        return parseFloat(arg.text);
    } else if (ts.isArrayLiteralExpression(arg)) {
        return arg.elements.map(element => getArgumentValue(element, checker));
    } else if (ts.isObjectLiteralExpression(arg)) {
        const obj: any = {};
        arg.properties.forEach(property => {
            if (ts.isPropertyAssignment(property)) {
                obj[property.name.getText()] = getArgumentValue(property.initializer, checker);
            }
        });
        return obj;
    }
    return undefined;
}

export function replaceSrcPath(preSourcePath: string, path: string): string {
    if (!path.startsWith(preSourcePath)) return path;
    return path.replace(preSourcePath, '@src')
}

// remove extension support undefined
export function removeExtension(path: string | undefined): string | undefined {
    if(path === undefined) return path
    return path.replace(/\.[^/.]+$/, "");
}