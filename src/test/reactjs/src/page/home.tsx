import {page} from "../reactbootdev/decorator/Page";


function WelcomeComponent() {
    return <div>WelcomeComponent</div>;
}

@page("/")
export class Welcome {

    render() {
        return <WelcomeComponent/>;
    }
}
