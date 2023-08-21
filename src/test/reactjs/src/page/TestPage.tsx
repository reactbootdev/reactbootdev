import React, {useEffect} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import BaseRepository from "src/reactbootdev/repository/BaseRepository";
import {page} from "src/reactbootdev/decorator/Page";
import {Project} from "src/entity/Project";
import {entityRenderer, RenderTypeEnum} from "src/reactbootdev/component/BaseComponentManager";
import {ProjectRepository} from "src/repository/ProjectRepository";
import {ProjectApi} from "src/api/ProjectApi";
import {TestProjectApi} from "src/api/TestProjectApi";



const ReadListComponent = () => {

    // api
    const projectApi = new TestProjectApi()

    // readList
    const readListProjectRepository = new ProjectRepository(ProjectRepository.defaultRepositoryKey + `readList`)
    const [readListEntityList, setReadListEntityList] = useRecoilState(readListProjectRepository.entityListState);
    readListProjectRepository.init(readListEntityList, setReadListEntityList);

    // set readDetailProjectRepository by projectApi
    useEffect(() => {
        // readList
        const readListRes = projectApi.handleReadList(undefined)
        const resData = readListRes.result.data as Project[]
        readListProjectRepository.addEntities(resData)

    }, [])

    const readListEntity = entityRenderer(
        Project,
        readListProjectRepository,
        projectApi,
        RenderTypeEnum.READ_LIST
    )


    return (
        <div>
            <div>
                defaultRepositoryKey : {BaseRepository.defaultRepositoryKey}
            </div>

            <div>--- --- ---</div>
            <div>{readListEntity}</div>
            <div>--- --- ---</div>


            <div>{JSON.stringify(readListEntityList)}</div>
            {/*<button onClick={addDate}>aadd</button>*/}
        </div>
    );

}

const ReadDetailComponent = () => {

    // api
    const projectApi = new TestProjectApi()

    // readDetail
    const readDetailProjectRepository = new ProjectRepository(ProjectRepository.defaultRepositoryKey + `readDetail`)
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
        <div>
            <div>
                defaultRepositoryKey : {BaseRepository.defaultRepositoryKey}
            </div>

            <div>--- --- ---</div>
            <div>{readDetailEntity}</div>
            <div>--- --- ---</div>


            <div>{JSON.stringify(readDetailEntityList)}</div>
        </div>
    );

}

const UpdateComponent = () => {

    // api
    const projectApi = new TestProjectApi()

    // update
    const updateProjectRepository = new ProjectRepository(ProjectRepository.defaultRepositoryKey + `update`)
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
        <div>
            <div>
                defaultRepositoryKey : {BaseRepository.defaultRepositoryKey}
            </div>

            <div>--- --- ---</div>
            <div>{updateEntity}</div>
            <div>--- --- ---</div>

            <div>{JSON.stringify(updateEntityList)}</div>
            {/*<button onClick={addDate}>aadd</button>*/}
        </div>
    );

}


const DeleteComponent = () => {
    // api
    const projectApi = new TestProjectApi()

    // delete
    const deleteProjectRepository = new ProjectRepository(ProjectRepository.defaultRepositoryKey + `delete`)
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
        <div>
            <div>
                defaultRepositoryKey : {BaseRepository.defaultRepositoryKey}
            </div>

            <div>--- --- ---</div>
            <div>{deleteEntity}</div>
            <div>--- --- ---</div>


            <div>{JSON.stringify(deleteEntityList)}</div>
            {/*<button onClick={addDate}>aadd</button>*/}
        </div>
    );
}

const CreateComponent = () => {
    // api
    const projectApi = new TestProjectApi()

    // create
    const createProjectRepository = new ProjectRepository(ProjectRepository.defaultRepositoryKey + `create`)
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
        <div>
            <div>
                defaultRepositoryKey : {BaseRepository.defaultRepositoryKey}
            </div>

            <div>--- --- ---</div>
            <div>{createEntity}</div>
            <div>--- --- ---</div>


            <div>{JSON.stringify(createEntityList)}</div>
            {/*<button onClick={addDate}>aadd</button>*/}
        </div>
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
export class DeltePage {
    render() {
        return <DeleteComponent />;
    }
}

