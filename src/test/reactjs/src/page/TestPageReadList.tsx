import React, {useEffect, useMemo} from "react";
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
    ThemeProvider,
    Tooltip,
    Typography
} from "@mui/material";
import BaseRepository, {useRepository} from "@src/reactbootdev/repository/BaseRepository";
import {
    BoxPropsExt,
    extractShortKeyFromLongKey,
    getFlattenObj,
    prettierLongKey,
    removeFirstElementFromKey,
    transposeMatrix
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
                                                tooltiptext={header.desc}
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
                                {row.map((
                                    d: { desc: string; value: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }
                                    , idx2: React.Key | null | undefined
                                ) => (
                                    <TableCell key={idx2}>
                                        <Item
                                            tooltiptext={d.desc}
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


const ReadListComponent = () => {

    const projectApi = new TestProjectApi()
    const repo = useRepository(ProjectRepository,  `readList`)

    // entityKey
    const entityKey = useMemo(() => {
        return repo.getEntityKey()
    }, [repo])


    useEffect(() => {
        const readListRes = projectApi.handleReadList(undefined)
        const resData = readListRes.result.data as Project[]
        repo.setList(resData)
    }, [])

    const whiteList: any[] = [
        // entityKey.testcol1a
    ]
    const blackList: any[] = [
        // entityKey.testcol1a
    ]

    const header = getHeader(repo.state, whiteList, blackList)

    const tableData: TableProps<Project> = {
        repository: repo,
        header: header,
    }

    return (
        <>
            <div>
                {MyTable(tableData)}
            </div>
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
