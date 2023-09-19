import {ObjectTypeEnum, TaskBeansType} from "../interface/TaskBeansType";


import {SubProject as src_entity_SubProject____SubProject} from "@src/entity/SubProject";
import {
  Project as src_entity_Project____Project,
  TestEnum as src_entity_Project____TestEnum
} from "@src/entity/Project";


export const entityImportMap: { [key: string]: any } = {
  "src/entity/SubProject.ts////SubProject": src_entity_SubProject____SubProject,
  "src/entity/Project.ts////Project": src_entity_Project____Project,
  "src/entity/Project.ts////TestEnum": src_entity_Project____TestEnum
}

export const entityBeans: TaskBeansType = {
  "src/entity/SubProject.ts": {
    "importPaths": {
      "entity": "src/reactbootdev/decorator/Entity.ts",
      "BaseEntity": "src/reactbootdev/entity/BaseEntity.ts",
      "SubProject": "src/entity/SubProject.ts"
    },
    "objects": {
      "SubProject": {
        "type": ObjectTypeEnum.CLASS,
        "data": {
          "testcol1b": {
            "type": "string",
            "isArray": false,
            "isTypeReferenceNode": false,
            "realType": "string"
          },
          "testcol2b": {
            "type": "string",
            "isArray": false,
            "isTypeReferenceNode": false,
            "realType": "string"
          },
          "subStringArray": {
            "type": "string",
            "isArray": true,
            "isTypeReferenceNode": false,
            "realType": "string"
          },
          "subNumberArray": {
            "type": "number",
            "isArray": true,
            "isTypeReferenceNode": false,
            "realType": "number"
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
      "BaseEntity": "src/reactbootdev/entity/BaseEntity.ts",
      "Project": "src/entity/Project.ts",
      "TestEnum": "src/entity/Project.ts"
    },
    "objects": {
      "Project": {
        "type": ObjectTypeEnum.CLASS,
        "data": {
          "id": {
            "type": "number | null",
            "isArray": false,
            "isTypeReferenceNode": false,
            "realType": "number | null"
          },
          "name": {
            "type": "string",
            "isArray": false,
            "isTypeReferenceNode": false,
            "realType": "string"
          },
          "description": {
            "type": "string",
            "isArray": false,
            "isTypeReferenceNode": false,
            "realType": "string"
          },
          "startDate": {
            "type": "string",
            "isArray": false,
            "isTypeReferenceNode": false,
            "realType": "string"
          },
          "endDate": {
            "type": "string",
            "isArray": false,
            "isTypeReferenceNode": false,
            "realType": "string"
          },
          "testcol1a": {
            "type": "string",
            "isArray": false,
            "isTypeReferenceNode": false,
            "realType": "string"
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
            ],
            "realType": "string"
          },
          "testcol3a": {
            "type": "boolean",
            "isArray": false,
            "isTypeReferenceNode": false,
            "realType": "boolean"
          },
          "testcol4a": {
            "type": "number",
            "isArray": false,
            "isTypeReferenceNode": false,
            "realType": "number"
          },
          "testArray": {
            "type": "string",
            "isArray": true,
            "isTypeReferenceNode": false,
            "realType": "string"
          },
          "testcol5a": {
            "type": "TestEnum",
            "isArray": false,
            "isTypeReferenceNode": true,
            "realType": entityImportMap['src/entity/Project.ts////TestEnum'],
            "referenceNode": {
              "type": ObjectTypeEnum.ENUM,
              "data": {
                "test1": "\"test1\"",
                "test2": "\"test2\"",
                "test3": "\"test3\""
              }
            }
          },
          "testcol6a": {
            "type": "TestEnum",
            "isArray": true,
            "isTypeReferenceNode": true,
            "realType": entityImportMap['src/entity/Project.ts////TestEnum'],
            "referenceNode": {
              "type": ObjectTypeEnum.ENUM,
              "data": {
                "test1": "\"test1\"",
                "test2": "\"test2\"",
                "test3": "\"test3\""
              }
            }
          },
          "subProject": {
            "type": "SubProject",
            "isArray": false,
            "isTypeReferenceNode": true,
            "realType": entityImportMap['src/entity/SubProject.ts////SubProject'],
            "referenceNode": {
              "type": ObjectTypeEnum.CLASS,
              "data": {
                "testcol1b": {
                  "type": "string",
                  "isArray": false,
                  "isTypeReferenceNode": false,
                  "realType": "string"
                },
                "testcol2b": {
                  "type": "string",
                  "isArray": false,
                  "isTypeReferenceNode": false,
                  "realType": "string"
                },
                "subStringArray": {
                  "type": "string",
                  "isArray": true,
                  "isTypeReferenceNode": false,
                  "realType": "string"
                },
                "subNumberArray": {
                  "type": "number",
                  "isArray": true,
                  "isTypeReferenceNode": false,
                  "realType": "number"
                }
              },
              "decorators": []
            }
          },
          "subProjectArray": {
            "type": "SubProject",
            "isArray": true,
            "isTypeReferenceNode": true,
            "realType": entityImportMap['src/entity/SubProject.ts////SubProject'],
            "referenceNode": {
              "type": ObjectTypeEnum.CLASS,
              "data": {
                "testcol1b": {
                  "type": "string",
                  "isArray": false,
                  "isTypeReferenceNode": false,
                  "realType": "string"
                },
                "testcol2b": {
                  "type": "string",
                  "isArray": false,
                  "isTypeReferenceNode": false,
                  "realType": "string"
                },
                "subStringArray": {
                  "type": "string",
                  "isArray": true,
                  "isTypeReferenceNode": false,
                  "realType": "string"
                },
                "subNumberArray": {
                  "type": "number",
                  "isArray": true,
                  "isTypeReferenceNode": false,
                  "realType": "number"
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