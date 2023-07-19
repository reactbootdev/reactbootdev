import {page} from "../reactbootdev/decorator/Page";



function BasePageContent() {
    return <div>BasePageContent</div>;
}



@page("/test2")
export class BasePage2 {
    // @Autowired
    // baseRepository: BaseRepository;

    render() {
        return  <BasePageContent />;
    }

}
