import React, {useEffect} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import BaseRepository from "src/reactbootdev/repository/BaseRepository";
import {page} from "src/reactbootdev/decorator/Page";
import {Project} from "src/entity/Project";
import {entityRenderer, RenderTypeEnum} from "src/reactbootdev/component/BaseComponentManager";
import {ProjectRepository} from "src/repository/ProjectRepository";
import {ProjectApi} from "src/api/ProjectApi";
import {TestProjectApi} from "src/api/TestProjectApi";



const BasePageContent = () => {
    const projectApi = new TestProjectApi()

    // create
    const createProjectRepository = new ProjectRepository(ProjectRepository.defaultRepositoryKey + `create`)
    const [createEntityList, setCreateEntityList] = useRecoilState(createProjectRepository.entityListState);
    createProjectRepository.init(createEntityList, setCreateEntityList);

    // readList
    const readListProjectRepository = new ProjectRepository(ProjectRepository.defaultRepositoryKey + `readList`)
    const [readListEntityList, setReadListEntityList] = useRecoilState(readListProjectRepository.entityListState);
    readListProjectRepository.init(readListEntityList, setReadListEntityList);

    // readDetail
    const readDetailProjectRepository = new ProjectRepository(ProjectRepository.defaultRepositoryKey + `readDetail`)
    const [readDetailEntityList, setReadDetailEntityList] = useRecoilState(readDetailProjectRepository.entityListState);
    readDetailProjectRepository.init(readDetailEntityList, setReadDetailEntityList);

    // update
    const updateProjectRepository = new ProjectRepository(ProjectRepository.defaultRepositoryKey + `update`)
    const [updateEntityList, setUpdateEntityList] = useRecoilState(updateProjectRepository.entityListState);
    updateProjectRepository.init(updateEntityList, setUpdateEntityList);

    // delete
    const deleteProjectRepository = new ProjectRepository(ProjectRepository.defaultRepositoryKey + `delete`)
    const [deleteEntityList, setDeleteEntityList] = useRecoilState(deleteProjectRepository.entityListState);
    deleteProjectRepository.init(deleteEntityList, setDeleteEntityList);

    // set readDetailProjectRepository by projectApi
    useEffect(() => {
        // readList
        const readListRes = projectApi.handleReadList(undefined)
        const resData = readListRes.result.data as Project[]
        readListProjectRepository.addEntities(resData)

        // readDetail
        const readDetailRes = projectApi.handleReadDetail(undefined)
        const readDetailResData = readDetailRes.result.data as Project
        readDetailProjectRepository.addEntity(readDetailResData)

        // update
        const updateRes = projectApi.handleReadDetail(undefined)
        const updateResData = updateRes.result.data as Project
        updateProjectRepository.addEntity(updateResData)

    }, [])


    // TODO :: api에 의한 repo update는 두 곳에서. `page`랑 `component`

    const createEntity = entityRenderer(
        Project,
        createProjectRepository,
        projectApi,
        RenderTypeEnum.CREATE,
        {
            itemId: 0,
        },
    )

    const readListEntity = entityRenderer(
        Project,
        readListProjectRepository,
        projectApi,
        RenderTypeEnum.READ_LIST
    )

    const readDetailEntity = entityRenderer(
        Project,
        readDetailProjectRepository,
        projectApi,
        RenderTypeEnum.READ_DETAIL,
        {
            itemId: 0,
        },
    )

    const updateEntity = entityRenderer(
        Project,
        updateProjectRepository,
        projectApi,
        RenderTypeEnum.UPDATE,
        {
            itemId: 0,
        },
    )

    const deleteEntity = entityRenderer(
        Project,
        deleteProjectRepository,
        projectApi,
        RenderTypeEnum.DELETE,
        {
            itemId: 0,
        },
    )

    // TODO :: 아래와 같은 형태로 변환예정. 변수는 상속관계.
    // TODO :: 일단은 동작 가능한 최소의 프로토타입 코드 작성. CRRUD.
    // TODO :: key 가 값으면 같은 recoil 참고됨. 어떻게 파일별로 중복 방지해서 관리할 수 있을지 생각해봐. 데코레이터 활용?? > 엔티티에 키값 설정 디폴트는 클레스 네임?


    // TODO :: entity 합성 관계는 재귀적으로 호출하고, 순환참조 에러 띄우고, 기초타입까지 전수조사로 출력하면 되는건가?
    // TODO :: 반드시 순환참조가 필요하다면..?

    // TODO :: 객체 타입을 포함한 재귀형태 entity 를 json 형태로 변환하는 것. 이것이 가장 큰 기술적 난제야.


//     const addDate = () => {
//         projectRepository.addEntities(
// [{
//             id: 314
//         },
//         {
//             id: 3142
//         }])
//     }

    // TODO :: API Generator.
    // TODO :: renderedEntity > Container
    // TODO :: BaseDomain > Pagenation, Search


    return (
        <div>
            <div>
                defaultRepositoryKey : {BaseRepository.defaultRepositoryKey}
            </div>

            <div>--- --- ---</div>
            <div>{createEntity}</div>
            <div>--- --- ---</div>

            <div>--- --- ---</div>
            <div>{readDetailEntity}</div>
            <div>--- --- ---</div>

            <div>--- --- ---</div>
            <div>{readListEntity}</div>
            <div>--- --- ---</div>

            <div>--- --- ---</div>
            <div>{updateEntity}</div>
            <div>--- --- ---</div>

            <div>--- --- ---</div>
            <div>{deleteEntity}</div>
            <div>--- --- ---</div>


            <div>{JSON.stringify(readListEntityList)}</div>
            {/*<button onClick={addDate}>aadd</button>*/}
        </div>
    );
};


@page("/test")
export class TestPageA2 {


    // @Autowired
    // baseRepository: BaseRepository;


    render() {
        return <BasePageContent />;
    }

}
