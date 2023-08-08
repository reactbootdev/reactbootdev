import {entity} from "src/reactbootdev/decorator/Entity";
import {SubProject} from "src/entity/SubProject";
import BaseEntity from "src/reactbootdev/entity/BaseEntity";

export function render(config: { groupName: string, rendererName: string }) {
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

    testcol1a?: string
    @render({groupName: "testrenderer", rendererName: "testrenderer"})
    testcol2a?: string
    testcol3a?: boolean
    testcol4a?: number

    subProject?: SubProject

}

