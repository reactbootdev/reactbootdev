import {entity} from "@src/reactbootdev/decorator/Entity";
import {SubProject} from "@src/entity/SubProject";
import BaseEntity from "@src/reactbootdev/entity/BaseEntity";

export function render(config: { groupName: string, rendererName: string, propName: string }) {
    return function (target: any, key: string) {
        console.log(`renderer: ${config.rendererName} ${target} ${key}`)
    };
}

export function renderContainer(config: { groupName: string, rendererName: string }) {
    return function (target: any) {
        console.log(`containerRenderer: ${config.rendererName} ${target}`)
    };
}

export function rendererContainer(config: { name: string }) {
    return function (target: any) {
        console.log(`containerRenderer: ${config.name} ${target}`)
    };
}

export function renderer(config: { name: string }) {
    return function (target: any) {
        console.log(`containerRenderer: ${config.name} ${target}`)
    };
}

@entity
@renderContainer({groupName: "testrenderer", rendererName: "testrenderer"})
export class Project extends BaseEntity {
    id: number | null = null;

    testcol1a?: string
    @render({groupName: "testrenderer", rendererName: "testrenderer", propName: "testcol1a"})
    testcol2a?: string
    testcol3a?: boolean
    testcol4a?: number
    testArray?: string[]
    testcol5a?: TestEnum
    testcol6a?: TestEnum[]

    subProject?: SubProject

}

export enum TestEnum {
    test1 = "test1",
    test2 = "test2",
    test3 = "test3",
}