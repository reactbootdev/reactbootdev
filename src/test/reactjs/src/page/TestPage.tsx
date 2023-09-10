import React, {useEffect, useMemo} from "react";
import {useRecoilState} from "recoil";
import {page} from "@src/reactbootdev/decorator/Page";
import {Project} from "@src/entity/Project";
import {entityRenderer, RenderTypeEnum} from "@src/reactbootdev/component/BaseComponentManager";
import {ProjectRepository} from "@src/repository/ProjectRepository";
import {TestProjectApi} from "@src/api/TestProjectApi";


const ReadListComponent = () => {

    // api
    const projectApi = new TestProjectApi()

    // readList
    const readListProjectRepository = new ProjectRepository(Project, ProjectRepository.defaultRepositoryKey + `readList`)
    const [readListEntityList, setReadListEntityList] = useRecoilState(readListProjectRepository.entityListState);
    readListProjectRepository.init(readListEntityList, setReadListEntityList);

    const entityKey = useMemo(() => {
        return readListProjectRepository.getEntitiKey()
    }, [readListProjectRepository])


    console.log(`entityKey ###5`, entityKey)
    console.log(`entityKey ###5a`, entityKey.subProject?.testcol1b)


    // set readDetailProjectRepository by projectApi
    useEffect(() => {
        console.log(`ReadListComponent.useEffect`)
        // readList
        const readListRes = projectApi.handleReadList(undefined)
        const resData = readListRes.result.data as Project[]
        // readListProjectRepository.truncate() // TODO :: ??
        readListProjectRepository.setEntities(resData)

    }, [])

    const readListEntity = entityRenderer (
        Project,
        readListProjectRepository,
        projectApi,
        RenderTypeEnum.READ_LIST,
        {
            dataCallback: (data) => {
                console.log(`ReadListComponent.dataCallback`, data)
            }
        }
    )

    return (
        <>
            {readListEntity}
        </>
    );

}

const ReadDetailComponent = () => {

    // api
    const projectApi = new TestProjectApi()

    // readDetail
    const readDetailProjectRepository = new ProjectRepository(Project, ProjectRepository.defaultRepositoryKey + `readDetail`)
    const [readDetailEntityList, setReadDetailEntityList] = useRecoilState(readDetailProjectRepository.entityListState);
    readDetailProjectRepository.init(readDetailEntityList, setReadDetailEntityList);

    // set readDetailProjectRepository by projectApi
    useEffect(() => {
        // readDetail
        const readDetailRes = projectApi.handleReadDetail(undefined)
        const readDetailResData = readDetailRes.result.data as Project
        readDetailProjectRepository.addEntity(readDetailResData)
    }, [])

    const readDetailEntity = entityRenderer(
        Project,
        readDetailProjectRepository,
        projectApi,
        RenderTypeEnum.READ_DETAIL,
        {
            itemId: 0,
        },
    )

    return (
        <>
            {readDetailEntity}
        </>
    );

}

const UpdateComponent = () => {

    // api
    const projectApi = new TestProjectApi()

    // update
    const updateProjectRepository = new ProjectRepository(Project, ProjectRepository.defaultRepositoryKey + `update`)
    const [updateEntityList, setUpdateEntityList] = useRecoilState(updateProjectRepository.entityListState);
    updateProjectRepository.init(updateEntityList, setUpdateEntityList);



    // set readDetailProjectRepository by projectApi
    useEffect(() => {
        // update
        const updateRes = projectApi.handleReadDetail(undefined)
        const updateResData = updateRes.result.data as Project
        updateProjectRepository.addEntity(updateResData)
    }, [])

    const updateEntity = entityRenderer(
        Project,
        updateProjectRepository,
        projectApi,
        RenderTypeEnum.UPDATE,
        {
            itemId: 0,
        },

    )

    return (
        <>
            {updateEntity}
        </>
    );

}


const DeleteComponent = () => {
    // api
    const projectApi = new TestProjectApi()

    // delete
    const deleteProjectRepository = new ProjectRepository(Project, ProjectRepository.defaultRepositoryKey + `delete`)
    const [deleteEntityList, setDeleteEntityList] = useRecoilState(deleteProjectRepository.entityListState);
    deleteProjectRepository.init(deleteEntityList, setDeleteEntityList);

    const deleteEntity = entityRenderer(
        Project,
        deleteProjectRepository,
        projectApi,
        RenderTypeEnum.DELETE,
        {
            itemId: 0,
        },
    )

    return (
        <>
            {deleteEntity}
        </>
    );
}

const CreateComponent = () => {
    // api
    const projectApi = new TestProjectApi()

    // create
    const createProjectRepository = new ProjectRepository(Project, ProjectRepository.defaultRepositoryKey + `create`)
    const [createEntityList, setCreateEntityList] = useRecoilState(createProjectRepository.entityListState);
    createProjectRepository.init(createEntityList, setCreateEntityList);

    const createEntity = entityRenderer(
        Project,
        createProjectRepository,
        projectApi,
        RenderTypeEnum.CREATE,
        {
            itemId: 0,
        },
    )

    return (
        <>
            {createEntity}
        </>
    );

};


@page("/c")
export class CreatePage {
    render() {
        return <CreateComponent />;
    }
}
@page("/r")
export class ReadListPage {
    render() {
        return <ReadListComponent />;
    }
}
@page("/rd")
export class ReadDetailPage {
    render() {
        return <ReadDetailComponent />;
    }
}
@page("/u")
export class UpdatePage {
    render() {
        return <UpdateComponent />;
    }
}
@page("/d")
export class DeletePage {
    render() {
        return <DeleteComponent />;
    }
}

