import {BASE_URL, BaseApi} from "@src/reactbootdev/api/BaseApi";
import {Project} from "@src/entity/Project";


export interface ReHandleReadListInterface {
    search: {
        customSearch: any
        ops: {
            eq: any
            ne: any
            gt: any
            ge: any
            lt: any
            le: any
            like: any
            in: any
            notIn: any
            between: any
            notBetween: any
            and: any
            or: any
            not: any
            isNull: any
            isNotNull: any
        }[]
    }
    sort: {
        name: string
        direction: string
    }[]
    pagination: {
        page: number
        size: number
    }
    type: any
    columns: string[]
}

export class TestProjectApi extends BaseApi {

    // TODO :: Test용 MockUp Result Settings > Pagenation, Search 등.

    OBJECT_URL = ``

    getTargetUrl = (actionUrl: string) => {
        const TOTAL_URL_ARRAY = [BASE_URL, this.OBJECT_URL, actionUrl]
        const TARGET_URL = TOTAL_URL_ARRAY
            .filter((url) => url !== ``)
            .join(`/`)
        return TARGET_URL
    }

    handleCreate = (data: any) => {
        const testRes = {
            code: 200,
            message: "success",
            result: {},
        }
        return testRes
    }

    handleUpdate = (data: any) => {
        alert("handleUpdate")
        const testRes = {
            code: 200,
            message: "success",
            result: {},
        }
        return testRes
    }

    handleDelte = (data: any) => {
        alert("handleDelte")
        const testRes = {
            code: 200,
            message: "success",
            result: {},
        }
        return testRes
    }

    handleReadList = (data: any) => {
        const testRes = {
            code: 200,
            message: "success",
            result: {
                data: [
                    {
                        id: 1,
                        name: "test1",
                        description: "test1",
                        startDate: "2021-01-01",
                        endDate: "2021-01-01",
                        testcol1a: "testcol1axxx",
                    },
                    {
                        id: 2,
                        name: "test2",
                        description: "test2",
                        startDate: "2021-01-01",
                        endDate: "2021-01-01",
                        testcol1a: "testcol2axxx",
                        subProject: {
                            id: 1,
                            name: "subProject1",
                            description: "subProject1",
                        },
                        subProject2: [{
                            id: 1,
                            name: "subProject1",
                            description: "subProject1",
                        }, {
                            id: 2,
                            name: "subProject1",
                            description: "subProject1",
                        }]
                    },
                ],
                pagination: {
                    total: 1,
                    page: 1,
                    size: 10,
                },
                search: {
                    name: "test1",
                    description: "test1",
                    startDate: "2021-01-01",
                },
                type: {
                    "name////adf////": {a: 1, b: 2},
                },
            }
        }
        return testRes
    }

    handleReadDetail = (data: any) => {
        const project: Project = {
            id: 1,
            name: "test1",
            description: "test1",
            startDate: "2021-01-01",
            endDate: "2021-01-01",
            testcol1a: "xxxxx1",
            subProject: {
                id: 33,
                subStringArray: ["ng1a", "2315", "3adf"],
                subNumberArray: [1, 2, 3, 45, 0.3],
            },
            subProjectArray: [{
                id: 1,
                subStringArray: [
                    "ngaaa1a",
                    "ngaaa1a",
                    "ngaaa1a",
                    "ngaaa1a",
                ],
            }, {
                id: 2,
                subStringArray: [
                    "nxxxag1a",
                    "nxxxag1a",
                    "nxxxag1a",

                ],
            }],
        }

        const testRes = {
            code: 200,
            message: "success",
            result: {
                data: project,
                search: {
                    name: "test1",
                    description: "test1",
                    startDate: "2021-01-01",
                },
                type: {
                    "name////adf////": {a: 1, b: 2},
                },
            }
        }
        return testRes
    }

}