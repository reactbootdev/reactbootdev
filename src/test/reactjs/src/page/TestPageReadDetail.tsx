import React, {useEffect, useMemo} from "react";
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
    Button,
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
import styled from 'styled-components';
import BaseRepository from "@src/reactbootdev/repository/BaseRepository";
import {StringOutputValueType} from "@src/reactbootdev/component/StringOutput";
import {
    exploreForEachTableData,
    getFlattenObj,
    getFlattenObjForArray,
    isCanOutputType,
    TableDataForArray,
    TableDataForArrayType
} from "@src/reactbootdev/util/RepositoryUtil";


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

const ReadDetailComponent = () => {

    // api
    const projectApi = new TestProjectApi()

    // readDetail
    const readDetailProjectRepository = new ProjectRepository(Project, ProjectRepository.defaultRepositoryKey + `readDetail`)
    const [readDetailEntityList, setReadDetailEntityList] = useRecoilState(readDetailProjectRepository.entityListState);
    readDetailProjectRepository.init(readDetailEntityList, setReadDetailEntityList);

    // entityKey
    const entityKey = useMemo(() => {
        return readDetailProjectRepository.getEntityKey()
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

    const tableData: TableProps<Project> = {
        repository: readDetailProjectRepository,
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

const InputMyTableReverseForArray = <T extends BaseEntity>(
    props: TableProps<T>
) => {


    const baseRepository = props.repository
    const flattenObjForArray = getFlattenObjForArray(baseRepository)
    const entityList = baseRepository.entityList

    const [tmpEntityList, setTmpEntityList] = useRecoilState(baseRepository.entityListState);


    const isRenderTableHead = false

    const matrix = props.header.map(header => {
        return header.data.map(data => {
            return data
        })
    })

    const maxRowMatrix = matrix.reduce((acc, cur) => {
        return acc.length > cur.length ? acc : cur
    }, []).length


    const forEachTableData: TableDataForArray[] = []
    exploreForEachTableData(flattenObjForArray, (item: TableDataForArray) => {
        forEachTableData.push(item)
    })

    const refinedForEachTableData = forEachTableData.filter(item => {
        return isCanOutputType(item.type)
    })

    console.log(`refinedForEachTableData`, refinedForEachTableData)

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


                        {refinedForEachTableData.map((d, idx2) => {
                            // {matrix.map((row, idx) => (

                            return (
                                <TableRow key={idx2}>
                                    <TableCell>
                                        <Item
                                            tooltipText={d.fullKey}
                                        >
                                            {d.shortKey}
                                        </Item>
                                    </TableCell>

                                    <TableCell key={idx2}>

                                        {/*    TODO:: 재구현 필요 > 각 하위 요소임. `entity`가 아니라. */}
                                        {
                                            d.addFunction !== undefined && (
                                                <>
                                                    <Button
                                                        onClick={(e) => {
                                                            if (d.addFunction === undefined) {
                                                                return
                                                            }
                                                            const addFunc = d.addFunction(undefined)
                                                            addFunc(e)


                                                            const typeTest = Project
                                                            const typeTest2 = new Project()
                                                            // TODO :: 결국 entitiy Bean으로 불러와야하고, string이 아닌 실제로 설정해야..

                                                        }}
                                                    >
                                                        add
                                                    </Button>
                                                </>
                                            )
                                        }

                                        {
                                            d.type !== TableDataForArrayType.ARRAY && (

                                                <TextField
                                                    label={d.fullKey} variant="outlined"
                                                    value={d.value}
                                                    // value={refinedValue}
                                                    onChange={(e) => {
                                                        if (d.updateFunction === undefined) {
                                                            return
                                                        }

                                                        const updateFunc = d.updateFunction(e.target.value)
                                                        updateFunc(e)
                                                        console.log(`updateFunc`, updateFunc)
                                                        console.log(updateFunc)
                                                        console.log(JSON.stringify(updateFunc))

                                                        // TODO :: update 시에 `ARRAY` type 데이터 삭제 됨. 덮어쓰기 되는듯.
                                                        // TODO :: Array가 Object로 바뀌면서 저장. 분기 처리 필요. setByDelimiterKey에서.
                                                        // baseRepository.updateEntityByDelimiterKey(0, e.target.value, d.desc)
                                                        // setInputValue(e.target.value);
                                                    }}
                                                />
                                            )
                                        }

                                        {
                                            d.removeFunction !== undefined && (
                                                <>
                                                    <Button
                                                        onClick={(e) => {
                                                            if (d.removeFunction === undefined) {
                                                                return
                                                            }
                                                            // TODO :: deleteBydelimiterKey 구현
                                                            // TODO :: UI 위치관련 구현.

                                                            const removeFunc = d.removeFunction(0)
                                                            removeFunc(e)
                                                        }}
                                                    >
                                                        remove
                                                    </Button>
                                                </>
                                            )
                                        }
                                    </TableCell>
                                </TableRow>
                            )
                        })}


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


@page("/rd")
export class ReadDetailPage {
    render() {
        return <ReadDetailComponent/>;
    }
}