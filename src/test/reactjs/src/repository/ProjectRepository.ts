import BaseRepository from "src/reactbootdev/repository/BaseRepository";
import BaseEntity from "src/reactbootdev/entity/BaseEntity";
import { v4 as uuidv4 } from 'uuid';

class ProjectRepository extends BaseRepository<BaseEntity> {
    static defaultRepositoryKey = uuidv4()

}
