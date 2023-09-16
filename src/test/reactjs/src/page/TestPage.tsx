import React, {useEffect, useMemo} from "react";
import {useRecoilState} from "recoil";
import {page} from "@src/reactbootdev/decorator/Page";
import {Project} from "@src/entity/Project";
import {
    entityRenderer,
    extractShortKeyFromLongKey,
    isPrimtiveType,
    prettierLongKey,
    removeFirstElementFromKey,
    RenderTypeEnum,
    transposeMatrix
} from "@src/reactbootdev/component/BaseComponentManager";
import {ProjectRepository} from "@src/repository/ProjectRepository";
import {TestProjectApi} from "@src/api/TestProjectApi";
import BaseEntity from "@src/reactbootdev/entity/BaseEntity";
import {
    Box,
    createTheme,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    ThemeProvider,
    Tooltip,
    Typography
} from "@mui/material";
import {BoxPropsExt} from "@src/reactbootdev/component/CreateContainer";
import {NAME_DELIMITER} from "@src/reactbootdev/config/config";
import styled from 'styled-components';
import BaseRepository from "@src/reactbootdev/repository/BaseRepository";
import {SubProject} from "@src/entity/SubProject";
import {StringOutputValueType} from "@src/reactbootdev/component/StringOutput";


const darkTheme = createTheme({
    palette: {
        mode: 'dark', // 다크 모드 활성화
    },
});


interface TableData {
    name: string;
    desc: string;
    value: string;
}
interface TableHeader {
    name: string;
    desc: string;
    data: TableData[];
}
interface TableProps {
    repositoryKey: string;
    header: TableHeader[];
}
const MyTable = (
    props: TableProps
) => {

    const matrix = props.header.map(header => {
        return header.data.map(data => {
            return data
        })
    })

    const reverseMatrix = transposeMatrix(matrix)

    return (
        <ThemeProvider theme={darkTheme}>
            <TableContainer component={Paper}>
                <Typography variant="h5" gutterBottom>
                    My Table
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            {
                                props.header.map((header, idx) => {
                                    return (
                                        <TableCell key={idx}>
                                            <Item
                                                tooltipText={header.desc}
                                            >
                                                {header.name}
                                            </Item>
                                        </TableCell>
                                    )
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reverseMatrix.map((row, idx) => (
                            <TableRow key={idx}>
                                {row.map((d, idx2) => (
                                    <TableCell key={idx2}>
                                        <Item
                                            tooltipText={d.desc}
                                        >
                                            {d.value}
                                        </Item>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </ThemeProvider>
    );
};
function MyTableReverse (
    props: TableProps
) {

    const isRenderTableHead = false

    const matrix = props.header.map(header => {
        return header.data.map(data => {
            return data
        })
    })

    const maxRowMatrix = matrix.reduce((acc, cur) => {
        return acc.length > cur.length ? acc : cur
    }, []).length

    return (
        <ThemeProvider theme={darkTheme}>
            <TableContainer component={Paper}>
                <Typography variant="h5" gutterBottom>
                    My Table
                </Typography>
                <Table>
                    {isRenderTableHead && (
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Item
                                        tooltipText={"속성"}
                                    >
                                        속성
                                    </Item>
                                </TableCell>
                                {
                                    Array(maxRowMatrix).fill(0).map((header, idx) => {
                                        return (
                                            <TableCell key={idx}>
                                                <Item
                                                    tooltipText={String(idx)}
                                                >
                                                    {idx}
                                                </Item>
                                            </TableCell>
                                        )
                                    })
                                }
                            </TableRow>
                        </TableHead>
                    )}

                    <TableBody>
                        {matrix.map((row, idx) => (
                            <TableRow key={idx}>
                                <TableCell>
                                    <Item
                                        tooltipText={props.header[idx].desc}
                                    >
                                        {props.header[idx].name}
                                    </Item>
                                </TableCell>

                                {row.map((d, idx2) => (
                                    <TableCell key={idx2}>
                                        <Item
                                            tooltipText={d.desc}
                                        >
                                            {d.value}
                                        </Item>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </ThemeProvider>
    );
};
export function Item(props: BoxPropsExt) {
    const { sx, ...other } = props;
    return (
        <Tooltip
            title={prettierLongKey(props.tooltipText)}
        >
            <Box
                sx={{
                    p: 1,
                    m: 1,
                    // bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.100'),
                    // border: '1px solid',
                    // borderColor: (theme) =>
                    //     theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                    color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    ...sx,
                }}
                {...other}
            />
        </Tooltip>
    );
}


const ReadListComponent = () => {

    // api
    const projectApi = new TestProjectApi()

    // readList
    const readListProjectRepository = new ProjectRepository(Project, ProjectRepository.defaultRepositoryKey + `readList`)
    const [readListEntityList, setReadListEntityList] = useRecoilState(readListProjectRepository.entityListState);
    readListProjectRepository.init(readListEntityList, setReadListEntityList);

    // entityKey
    const entityKey = useMemo(() => {
        return readListProjectRepository.getEntitiKey()
    }, [readListProjectRepository])


    console.log(`entityKey ###5`, entityKey)
    console.log(`entityKey ###5a`, entityKey.subProject?.testcol1b)

    useEffect(() => {
        const readListRes = projectApi.handleReadList(undefined)
        const resData = readListRes.result.data as Project[]
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

    const whiteList: any[] = [
        // entityKey.testcol1a
    ]
    const blackList: any[] = [
        // entityKey.testcol1a
    ]

    const header = getHeader(readListEntityList, whiteList, blackList)

    const tableData : TableProps = {
        repositoryKey: readListProjectRepository.repositoryKey,
        header: header,
    }

    return (
        <>
            <div>
                {MyTable(tableData)}
            </div>
            {/*{readListEntity}*/}
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

    // entityKey
    const entityKey = useMemo(() => {
        return readDetailProjectRepository.getEntitiKey()
    }, [readDetailProjectRepository])

    // set readDetailProjectRepository by projectApi
    useEffect(() => {
        // readDetail
        const readDetailRes = projectApi.handleReadDetail(undefined)
        const readDetailResData = readDetailRes.result.data as Project
        readDetailProjectRepository.setEntity(readDetailResData)
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

    const whiteList: any[] = [
        // entityKey.testcol1a
    ]
    const blackList: any[] = [
        // entityKey.testcol1a
    ]

    const header = getHeader(readDetailEntityList, whiteList, blackList)

    const tableData : TableProps = {
        repositoryKey: readDetailProjectRepository.repositoryKey,
        header: header,
    }

    return (
        <>
            <div>
                {MyTableReverse(tableData)}
            </div>
            {/*{readListEntity}*/}
        </>
    );


}

function getHeader<T extends BaseEntity>(
    readListEntityList: T[],
    whiteList: any[] = [],
    blackList: any[] = [],
) {
    const isWhiteList = whiteList.length > 0
    const isBlackList = blackList.length > 0

    const headerKeyMap : Record<string, TableData[]> = {}
    const flattenObj = getFlattenObj(readListEntityList)
    Object.values(flattenObj).forEach(row => {
        row.forEach(col => {

            // TODO :: add element type in Array ?
            const colType = typeof col?.value

            if (isWhiteList) {
                const isWhiteList = whiteList.find(white => removeFirstElementFromKey(white) === col?.fullKey)
                if (typeof isWhiteList === 'undefined') {
                    return
                }
            } else if (isBlackList) {
                const isBlackList = blackList.find(black => removeFirstElementFromKey(black) === col?.fullKey)
                if (typeof isBlackList !== 'undefined') {
                    return
                }
            }
            headerKeyMap[col.fullKey] = []
        })
    })

    Object.values(flattenObj).forEach(row => {
        Object.keys(headerKeyMap).forEach(headerKey => {
            const col = row.find(col => col.fullKey === headerKey)

            const tableData = {
                name: extractShortKeyFromLongKey(col?.fullKey ?? ``),
                desc: col?.fullKey ?? ``,
                value: col?.value ?? ``,
            }
            headerKeyMap[headerKey].push(tableData)
        })

    })
    const header: TableHeader[] = Object.entries(headerKeyMap).map(([key, value]) => {
        return {
            name: extractShortKeyFromLongKey(key),
            desc: key,
            data: value,
        }
    })

    return header
}

function getFlattenObj<T extends BaseEntity>(readListEntityList: T[]) {
    const flattenObj = readListEntityList.map((entity) => {
        return Object.entries(flattenBaseEntity(entity)).map(([key, value]) => {
            return {
                fullKey: key,
                value: value,
            }
        })
    })
    return flattenObj
}

function flattenBaseEntity<T extends BaseEntity>(obj: T, objName: string | undefined = undefined) {
    const flattened : Record<string, string> = {}

    if(typeof obj === 'undefined') {
        return flattened
    }

    Object.entries(obj).map(([propertyName, propertyInfo]) => {
        if (propertyInfo === null) {
            return flattened
        }

        const flattenedKey =
            typeof objName !== 'undefined' ? `${objName}${NAME_DELIMITER}${propertyName}` : propertyName

        if (isPrimtiveType(typeof propertyInfo)) {
            flattened[flattenedKey] = String(propertyInfo)
        } else {
            Object.assign(flattened, flattenBaseEntity(propertyInfo, `${flattenedKey}`))
        }
    })

    return flattened
}



function InputMyTableReverse (
    props: TableProps
) {


    const baseRepository = new BaseRepository(BaseEntity, props.repositoryKey);
    const [entityList, setEntityList] = useRecoilState(baseRepository.entityListState);
    baseRepository.init(entityList, setEntityList)

    const isRenderTableHead = false

    const matrix = props.header.map(header => {
        return header.data.map(data => {
            return data
        })
    })

    const maxRowMatrix = matrix.reduce((acc, cur) => {
        return acc.length > cur.length ? acc : cur
    }, []).length

    return (
        <ThemeProvider theme={darkTheme}>
            <TableContainer component={Paper}>
                <Typography variant="h5" gutterBottom>
                    My Table
                    {JSON.stringify(entityList)}
                </Typography>
                <Table>
                    {isRenderTableHead && (
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Item
                                        tooltipText={"속성"}
                                    >
                                        속성
                                    </Item>
                                </TableCell>
                                {
                                    Array(maxRowMatrix).fill(0).map((header, idx) => {
                                        return (
                                            <TableCell key={idx}>
                                                <Item
                                                    tooltipText={String(idx)}
                                                >
                                                    {idx}
                                                </Item>
                                            </TableCell>
                                        )
                                    })
                                }
                            </TableRow>
                        </TableHead>
                    )}

                    <TableBody>
                        {matrix.map((row, idx) => (
                            <TableRow key={idx}>
                                <TableCell>
                                    <Item
                                        tooltipText={props.header[idx].desc}
                                    >
                                        {props.header[idx].name}
                                    </Item>
                                </TableCell>

                                {row.map((d, idx2) => {
                                    // TODO :: type > add el in array

                                    // const createEntity = entityRenderer(
                                    //     Project,
                                    //     createProjectRepository,
                                    //     projectApi,
                                    //     RenderTypeEnum.CREATE,
                                    //     {
                                    //         itemId: 0,
                                    //     },
                                    // )
                                    // const beanInfo = findBean(entity)
                                    // const beanInfo = findBean(Project)
                                    // const flattenObj = flattenObject(beanInfo.bean, beanInfo.entityName);


                                    // TODO :: remove
                                    const outputValue = baseRepository.getValueById(idx2, d.desc) as StringOutputValueType
                                    const valueComponent = Array.isArray(outputValue) ? outputValue.join(", ") : outputValue

                                    return (
                                    <TableCell key={idx2}>
                                        <Item
                                            tooltipText={d.desc}
                                        >
                                            {d.value}
                                        </Item>

                                        { valueComponent}

                                        <TextField
                                            label={d.desc} variant="outlined"
                                            value={d.value}
                                            // value={refinedValue}
                                            onChange={(e) => {
                                                baseRepository.updateEntityByDelimiterKey(0, e.target.value, d.desc)
                                                // setInputValue(e.target.value);
                                            }}
                                        />
                                    </TableCell>
                                )})}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </ThemeProvider>
    );
};

const containerStyle = {
    backgroundColor: 'lightblue',
    padding: '20px',
    border: '1px solid blue',
    borderRadius: '5px',
};


interface StyledButtonProps {
    primary?: boolean;
}
const StyledButton = styled.button<StyledButtonProps>`
  // 스타일 정의에서 primary prop 사용
  background-color: ${(props: any) => (props.primary ? 'blue' : 'red')};
  color: white;
  padding: 10px 20px;
`;


const CreateComponent = () => {

    // create container style
    // useStyle
    const useStyle = () => {

    }

    // api
    const projectApi = new TestProjectApi()

    // create
    const createProjectRepository = new ProjectRepository(Project, ProjectRepository.defaultRepositoryKey + `create`)
    const [createEntityList, setCreateEntityList] = useRecoilState(createProjectRepository.entityListState);
    createProjectRepository.init(createEntityList, setCreateEntityList);


    console.log(`### getEntityType`, createProjectRepository.getEntityType())

    // {
    //     "id": 1,
    //     "name": "test1",
    //     "description": "test1",
    //     "startDate": "2021-01-01",
    //     "endDate": "2021-01-01",
    //     "testcol1a": "xxxxx1",
    //     "subProject": {
    //     "id": 33
    // }
    // }

    useEffect(() => {

        const defaultEntity = new Project()
        defaultEntity.testcol1a = `testcol1a`
        defaultEntity.testcol2a = `s`
        defaultEntity.testcol4a = 34

        defaultEntity.subProject = new SubProject()
        defaultEntity.subProject.testcol1b = `testcol1b`

        const testArray = ["df", "adf"]
        defaultEntity.testArray = testArray

        // update
        const updateRes = projectApi.handleReadDetail(undefined)
        const updateResData = updateRes.result.data as Project
        // update
        createProjectRepository.setEntity(defaultEntity)
    }, [])


    const createEntity = entityRenderer(
        Project,
        createProjectRepository,
        projectApi,
        RenderTypeEnum.CREATE,
        {
            itemId: 0,
        },
    )

    const whiteList: any[] = [
        // entityKey.testcol1a
    ]
    const blackList: any[] = [
        // entityKey.testcol1a
    ]

    const header = getHeader(createEntityList, whiteList, blackList)

    const tableData : TableProps = {
        repositoryKey: createProjectRepository.repositoryKey,
        header: header,
    }

    return (
        <>
            {InputMyTableReverse(tableData)}

            {/*{createEntity}*/}
        </>
    );

};


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
        updateProjectRepository.setEntity(updateResData)
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

    const whiteList: any[] = [
        // entityKey.testcol1a
    ]
    const blackList: any[] = [
        // entityKey.testcol1a
    ]

    const header = getHeader(updateEntityList, whiteList, blackList)

    const tableData : TableProps = {
        repositoryKey: updateProjectRepository.repositoryKey,
        header: header,
    }

    return (
        <>
            {InputMyTableReverse(tableData)}
            {/*<div>test2</div>*/}
            {/*{updateEntity}*/}
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

