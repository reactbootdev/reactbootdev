import {page} from "../reactbootdev/decorator/Page";



function BasePageContent() {
    return <div>BasePageContent</div>;
}


// TODO : update
@page("/test2")
export class BasePage2 {
    // @Autowired
    // baseRepository: BaseRepository;

    render() {
        return  <BasePageContent />;
    }
}

function BasePageConten23t() {
    return <div>BasePageConten23t</div>;
}


// TODO : update
@page("/test3")
export class BasePage3 {
    // @Autowired
    // baseRepository: BaseRepository;

    render() {
        return  <BasePageConten23t />;
    }
}
