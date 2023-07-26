import { TaskBeansType,ObjectTypeEnum } from "../interface/TaskBeansType";


import { SubProject } from "src/entity/SubProject";
import { Project } from "src/entity/Project";


export const entityImportMap: { [key: string]: any } = {
	"src/entity/SubProject.ts////SubProject" : SubProject,
	"src/entity/Project.ts////Project" : Project
}

export const entityBeans: TaskBeansType = {
  "src/entity/SubProject.ts": {
    "importPaths": {
      "entity": "src/reactbootdev/decorator/Entity.ts"
    },
    "objects": {
      "SubProject": {
        "type": ObjectTypeEnum.CLASS,
        "data": {
          "testcol1": {
            "type": "string",
            "isArray": false,
            "isTypeReferenceNode": false
          },
          "testcol2": {
            "type": "string",
            "isArray": false,
            "isTypeReferenceNode": false
          }
        },
        "decorators": []
      }
    }
  },
  "src/entity/Project.ts": {
    "importPaths": {
      "entity": "src/reactbootdev/decorator/Entity.ts",
      "SubProject": "src/entity/SubProject.ts"
    },
    "objects": {
      "Project": {
        "type": ObjectTypeEnum.CLASS,
        "data": {
          "testcol1": {
            "type": "string",
            "isArray": false,
            "isTypeReferenceNode": false
          },
          "testcol2": {
            "type": "string",
            "isArray": false,
            "isTypeReferenceNode": false
          },
          "subProject": {
            "type": "SubProject",
            "isArray": false,
            "isTypeReferenceNode": true,
            "referenceNode": {
              "type": ObjectTypeEnum.CLASS,
              "data": {
                "testcol1": {
                  "type": "string",
                  "isArray": false,
                  "isTypeReferenceNode": false
                },
                "testcol2": {
                  "type": "string",
                  "isArray": false,
                  "isTypeReferenceNode": false
                }
              },
              "decorators": []
            }
          }
        },
        "decorators": []
      }
    }
  }
}