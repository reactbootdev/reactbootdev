import axios from 'axios';

export const BASE_URL = 'http://localhost:3000';

export class BaseApi {

    OBJECT_URL = ``

    getTargetUrl = (actionUrl: string) => {
        const TOTAL_URL_ARRAY = [BASE_URL, this.OBJECT_URL, actionUrl]
        const TARGET_URL = TOTAL_URL_ARRAY
            .filter((url) => url !== ``)
            .join(`/`)
        return TARGET_URL
    }

    handleCreate = (data: any) => {
        const ACTION_URL = `create`
        const TARGET_URL = this.getTargetUrl(ACTION_URL)
        console.log(data);

        axios.post(TARGET_URL, data)
        .then((response) => {
            console.log(response);
        })
    }

    handleUpdate = (data: any) => {
        const ACTION_URL = `update`
        const TARGET_URL = this.getTargetUrl(ACTION_URL)
        console.log(data);

        axios.put(TARGET_URL, data)
        .then((response) => {
            console.log(response);
        })
    }


}