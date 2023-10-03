import React, {useEffect} from "react";
import {useRecoilState} from "recoil";
import {page} from "@src/reactbootdev/decorator/Page";
import {Project} from "@src/entity/Project";
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
import BaseRepository from "@src/reactbootdev/repository/BaseRepository";
import {SubProject} from "@src/entity/SubProject";
import {
    BoxPropsExt,
    extractShortKeyFromLongKey,
    getFlattenObj,
    prettierLongKey,
    removeFirstElementFromKey
} from "@src/reactbootdev/util/RepositoryUtil";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
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

export function Item(props: BoxPropsExt) {
    const {sx, ...other} = props;
    return (
        <Tooltip
            title={prettierLongKey(props.tooltiptext)}
        >
            <Box
                sx={{
                    p: 1,
                    m: 1,
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
                                        tooltiptext={"속성"}
                                    >
                                        속성
                                    </Item>
                                </TableCell>
                                {
                                    Array(maxRowMatrix).fill(0).map((header, idx) => {
                                        return (
                                            <TableCell key={idx}>
                                                <Item
                                                    tooltiptext={String(idx)}
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
                                        tooltiptext={props.header[idx].desc}
                                    >
                                        {props.header[idx].name}
                                    </Item>
                                </TableCell>

                                {row.map((d, idx2) => {
                                    return (
                                        <TableCell key={idx2}>
                                            <TextField
                                                label={d.desc} variant="outlined"
                                                value={d.value}
                                                onChange={(e) => {
                                                    baseRepository.updateEntityByDelimiterKey(0, e.target.value, d.desc)
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

const CreateComponent = () => {

    const projectApi = new TestProjectApi()

    const createProjectRepository = new ProjectRepository(Project, ProjectRepository.defaultRepositoryKey + `create`)
    const [createEntityList, setCreateEntityList] = useRecoilState(createProjectRepository.entityListState);
    createProjectRepository.init(createEntityList, setCreateEntityList);

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
