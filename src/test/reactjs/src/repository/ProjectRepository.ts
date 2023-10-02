import BaseRepository from "@src/reactbootdev/repository/BaseRepository";
import {v4 as uuidv4} from 'uuid';
import {Project} from "@src/entity/Project";

export class ProjectRepository extends BaseRepository<Project> {
    static defaultRepositoryKey = uuidv4()
}
