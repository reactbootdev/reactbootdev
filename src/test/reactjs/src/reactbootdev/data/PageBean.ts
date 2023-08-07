import { TaskBeansType,ObjectTypeEnum } from "../interface/TaskBeansType";


import { TestPageA2 } from "src/page/TestPage";
import { Welcome } from "src/page/home";


export const pageImportMap: { [key: string]: any } = {
	"src/page/TestPage.tsx////TestPageA2" : TestPageA2,
	"src/page/home.tsx////Welcome" : Welcome
}

export const pageBeans: TaskBeansType = {
  "src/page/TestPage.tsx": {
    "importPaths": {
      "React": "src/page/react.ts",
      "useRecoilState": "src/page/recoil.ts",
      "useRecoilValue": "src/page/recoil.ts",
      "BaseRepository": "src/reactbootdev/repository/BaseRepository.ts",
      "page": "src/reactbootdev/decorator/Page.ts",
      "Project": "src/entity/Project.ts",
      "entityRenderer": "src/reactbootdev/component/BaseComponentManager.ts",
      "RenderTypeEnum": "src/reactbootdev/component/BaseComponentManager.ts",
      "ProjectRepository": "src/repository/ProjectRepository.ts",
      "ProjectApi": "src/api/ProjectApi.ts"
    },
    "objects": {
      "TestPageA2": {
        "type": ObjectTypeEnum.CLASS,
        "data": {},
        "decorators": [
          {
            "name": "page",
            "definition": "any",
            "arguments": [
              {
                "type": "string",
                "value": "/test",
                "txt": "\"/test\""
              }
            ]
          }
        ]
      }
    }
  },
  "src/page/home.tsx": {
    "importPaths": {
      "page": "src/reactbootdev/decorator/Page.ts"
    },
    "objects": {
      "Welcome": {
        "type": ObjectTypeEnum.CLASS,
        "data": {},
        "decorators": [
          {
            "name": "page",
            "definition": "(pageUrl: string) => (target: any) => any",
            "arguments": [
              {
                "type": "string",
                "value": "/",
                "txt": "\"/\""
              }
            ]
          }
        ]
      }
    }
  }
}