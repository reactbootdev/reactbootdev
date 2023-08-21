import { TaskBeansType,ObjectTypeEnum } from "../interface/TaskBeansType";


import { SubProject } from "src/entity/SubProject";
import { Project } from "src/entity/Project";
import { TestEnum } from "src/entity/Project";


export const entityImportMap: { [key: string]: any } = {
	"src/entity/SubProject.ts////SubProject" : SubProject,
	"src/entity/Project.ts////Project" : Project,
	"src/entity/Project.ts////TestEnum" : TestEnum
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
          "testcol1b": {
            "type": "string",
            "isArray": false,
            "isTypeReferenceNode": false
          },
          "testcol2b": {
            "type": "string",
            "isArray": false,
            "isTypeReferenceNode": false
          },
          "testcol3b": {
            "type": "boolean",
            "isArray": false,
            "isTypeReferenceNode": false
          },
          "testcol4b": {
            "type": "number",
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
      "SubProject": "src/entity/SubProject.ts",
      "BaseEntity": "src/reactbootdev/entity/BaseEntity.ts"
    },
    "objects": {
      "Project": {
        "type": ObjectTypeEnum.CLASS,
        "data": {
          "testcol1a": {
            "type": "string",
            "isArray": false,
            "isTypeReferenceNode": false
          },
          "testcol2a": {
            "type": "string",
            "isArray": false,
            "isTypeReferenceNode": false,
            "decorators": [
              {
                "name": "render",
                "definition": "(config: { groupName: string; rendererName: string; propName: string; }) => (target: any, key: string) => void",
                "arguments": [
                  {
                    "type": "any",
                    "value": {
                      "groupName": "testrenderer",
                      "rendererName": "testrenderer",
                      "propName": "testcol1a"
                    },
                    "txt": "{groupName: \"testrenderer\", rendererName: \"testrenderer\", propName: \"testcol1a\"}"
                  }
                ]
              }
            ]
          },
          "testcol3a": {
            "type": "boolean",
            "isArray": false,
            "isTypeReferenceNode": false
          },
          "testcol4a": {
            "type": "number",
            "isArray": false,
            "isTypeReferenceNode": false
          },
          "testcol5a": {
            "type": "TestEnum",
            "isArray": false,
            "isTypeReferenceNode": true
          },
          "testcol6a": {
            "type": "TestEnum",
            "isArray": true,
            "isTypeReferenceNode": true
          },
          "subProject": {
            "type": "SubProject",
            "isArray": false,
            "isTypeReferenceNode": true,
            "referenceNode": {
              "type": ObjectTypeEnum.CLASS,
              "data": {
                "testcol1b": {
                  "type": "string",
                  "isArray": false,
                  "isTypeReferenceNode": false
                },
                "testcol2b": {
                  "type": "string",
                  "isArray": false,
                  "isTypeReferenceNode": false
                },
                "testcol3b": {
                  "type": "boolean",
                  "isArray": false,
                  "isTypeReferenceNode": false
                },
                "testcol4b": {
                  "type": "number",
                  "isArray": false,
                  "isTypeReferenceNode": false
                }
              },
              "decorators": []
            }
          }
        },
        "decorators": [
          {
            "name": "renderContainer",
            "definition": "(config: { groupName: string; rendererName: string; }) => (target: any) => void",
            "arguments": [
              {
                "type": "any",
                "value": {
                  "groupName": "testrenderer",
                  "rendererName": "testrenderer"
                },
                "txt": "{groupName: \"testrenderer\", rendererName: \"testrenderer\"}"
              }
            ]
          }
        ]
      },
      "TestEnum": {
        "type": ObjectTypeEnum.ENUM,
        "data": {
          "test1": "\"test1\"",
          "test2": "\"test2\"",
          "test3": "\"test3\""
        }
      }
    }
  }
}