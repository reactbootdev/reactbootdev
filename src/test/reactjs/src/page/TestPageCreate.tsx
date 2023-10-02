import React, {useEffect} from "react";
import {useRecoilState} from "recoil";
import {page} from "@src/reactbootdev/decorator/Page";
import {Project} from "@src/entity/Project";
import {
    entityRenderer,
    extractShortKeyFromLongKey,
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
import BaseRepository from "@src/reactbootdev/repository/BaseRepository";
import {SubProject} from "@src/entity/SubProject";
import {StringOutputValueType} from "@src/reactbootdev/component/StringOutput";
import {getFlattenObj, getFlattenObjForArray} from "@src/reactbootdev/util/RepositoryUtil";


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

interface TableProps<T extends BaseEntity> {
    repository: BaseRepository<T>;
    header: TableHeader[];
}

const MyTable = <T extends BaseEntity>(
    props: TableProps<T>
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

const MyTableReverse = <T extends BaseEntity>(
    props: TableProps<T>
) => {

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
    const {sx, ...other} = props;
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

function getHeader<T extends BaseEntity>(
    readListEntityList: T[],
    whiteList: any[] = [],
    blackList: any[] = [],
) {
    const isWhiteList = whiteList.length > 0
    const isBlackList = blackList.length > 0

    const headerKeyMap: Record<string, TableData[]> = {}
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


const InputMyTableReverse = <T extends BaseEntity>(
    props: TableProps<T>
) => {


    const baseRepository = props.repository
    const entityList = baseRepository.entityList

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

                                    // const addEl

                                    return (
                                        <TableCell key={idx2}>
                                            {/*<Item*/}
                                            {/*    tooltipText={d.desc}*/}
                                            {/*>*/}
                                            {/*    {d.value}*/}
                                            {/*</Item>*/}

                                            {/*{ valueComponent}*/}

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
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </ThemeProvider>
    );
};


interface TableProps<T extends BaseEntity> {
    repository: BaseRepository<T>;
    header: TableHeader[];

}


interface StyledButtonProps {
    primary?: boolean;
}



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
    console.log(`### getFlattenObjForArray`, getFlattenObjForArray(createProjectRepository))

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

    const tableData: TableProps<Project> = {
        repository: createProjectRepository,
        header: header,
    }

    return (
        <>
            {InputMyTableReverse(tableData)}
        </>
    );

};


@page("/c")
export class CreatePage {
    render() {
        return <CreateComponent/>;
    }
}
