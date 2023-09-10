import {renderer, rendererContainer} from "@src/entity/Project";


function TestRendererContainerComponent (args: any) {
    return <div>WelcomeComponent</div>;
}

@rendererContainer({name: "TestRenderer"})
export class TestRendererContainer {
    render(args: {
        name: string
    }) {
        return <TestRendererContainerComponent {...args} />;
    }

}


function TestRendererComponent (args: any) {
    return <div>WelcomeComponent</div>;
}

@renderer({name: "TestRenderer"})
export class TestRenderer {
    render(args: {
        name: string
    }) {
        return <TestRendererComponent {...args} />;
    }

}