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
    createTheme,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ThemeProvider,
    Tooltip,
    Typography
} from "@mui/material";
import {BoxPropsExt} from "@src/reactbootdev/component/CreateContainer";
import BaseRepository from "@src/reactbootdev/repository/BaseRepository";
import {getFlattenObj} from "@src/reactbootdev/util/RepositoryUtil";


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


const ReadListComponent = () => {

    // api
    const projectApi = new TestProjectApi()

    // readList
    const readListProjectRepository = new ProjectRepository(Project, ProjectRepository.defaultRepositoryKey + `readList`)
    const [readListEntityList, setReadListEntityList] = useRecoilState(readListProjectRepository.entityListState);
    readListProjectRepository.init(readListEntityList, setReadListEntityList);

    // entityKey
    const entityKey = useMemo(() => {
        return readListProjectRepository.getEntityKey()
    }, [readListProjectRepository])


    console.log(`entityKey ###5`, entityKey)
    console.log(`entityKey ###5a`, entityKey.subProject?.testcol1b)

    useEffect(() => {
        const readListRes = projectApi.handleReadList(undefined)
        const resData = readListRes.result.data as Project[]
        readListProjectRepository.setEntities(resData)
    }, [])

    const readListEntity = entityRenderer(
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

    const tableData: TableProps<Project> = {
        repository: readListProjectRepository,
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


interface TableProps<T extends BaseEntity> {
    repository: BaseRepository<T>;
    header: TableHeader[];

}


@page("/r")
export class ReadListPage {
    render() {
        return <ReadListComponent/>;
    }
}
