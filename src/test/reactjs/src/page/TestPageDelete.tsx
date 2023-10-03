import React from "react";
import {useRecoilState} from "recoil";
import {page} from "@src/reactbootdev/decorator/Page";
import {Project} from "@src/entity/Project";
import {ProjectRepository} from "@src/repository/ProjectRepository";
import {TestProjectApi} from "@src/api/TestProjectApi";
import BaseEntity from "@src/reactbootdev/entity/BaseEntity";
import {Box, createTheme, Tooltip} from "@mui/material";
import BaseRepository from "@src/reactbootdev/repository/BaseRepository";
import {BoxPropsExt, prettierLongKey} from "@src/reactbootdev/util/RepositoryUtil";

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

interface TableProps<T extends BaseEntity> {
    repository: BaseRepository<T>;
    header: TableHeader[];

}

const DeleteComponent = () => {
    // api
    const projectApi = new TestProjectApi()

    // delete
    const deleteProjectRepository = new ProjectRepository(Project, ProjectRepository.defaultRepositoryKey + `delete`)
    const [deleteEntityList, setDeleteEntityList] = useRecoilState(deleteProjectRepository.entityListState);
    deleteProjectRepository.init(deleteEntityList, setDeleteEntityList);


    return (
        <>
            <div>test</div>
        </>
    );
}

@page("/d")
export class DeletePage {
    render() {
        return <DeleteComponent/>;
    }
}

