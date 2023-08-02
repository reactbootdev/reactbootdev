import { TaskBeansType,ObjectTypeEnum } from "../interface/TaskBeansType";


import { TestPageA } from "src/page/TestPage";
import { TestPageA2 } from "src/page/TestPage";
import { BasePage2 } from "src/page/home";
import { BasePage3 } from "src/page/home";
import { Welcome } from "src/page/home";


export const pageImportMap: { [key: string]: any } = {
	"src/page/TestPage.tsx////TestPageA" : TestPageA,
	"src/page/TestPage.tsx////TestPageA2" : TestPageA2,
	"src/page/home.tsx////BasePage2" : BasePage2,
	"src/page/home.tsx////BasePage3" : BasePage3,
	"src/page/home.tsx////Welcome" : Welcome
}

export const pageBeans: TaskBeansType = {
  "src/page/TestPage.tsx": {
    "importPaths": {
      "React": "src/page/react.ts",
      "useMemo": "src/page/react.ts",
      "useRecoilState": "src/page/recoil.ts",
      "useRecoilValue": "src/page/recoil.ts",
      "BaseRepository": "src/reactbootdev/repository/BaseRepository.ts",
      "TestRepo": "src/reactbootdev/repository/BaseRepository.ts",
      "page": "src/reactbootdev/decorator/Page.ts",
      "Project": "src/entity/Project.ts",
      "entityRenderer": "src/reactbootdev/component/BaseComponentManager.ts"
    },
    "objects": {
      "TestPageA": {
        "type": ObjectTypeEnum.CLASS,
        "data": {},
        "decorators": [
          {
            "name": "page",
            "definition": "any",
            "arguments": [
              {
                "type": "string",
                "value": "/atest1",
                "txt": "\"/atest1\""
              }
            ]
          }
        ]
      },
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
                "value": "/atest2",
                "txt": "\"/atest2\""
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
      "BasePage2": {
        "type": ObjectTypeEnum.CLASS,
        "data": {},
        "decorators": [
          {
            "name": "page",
            "definition": "(pageUrl: string) => (target: any) => any",
            "arguments": [
              {
                "type": "string",
                "value": "/test2",
                "txt": "\"/test2\""
              }
            ]
          }
        ]
      },
      "BasePage3": {
        "type": ObjectTypeEnum.CLASS,
        "data": {},
        "decorators": [
          {
            "name": "page",
            "definition": "(pageUrl: string) => (target: any) => any",
            "arguments": [
              {
                "type": "string",
                "value": "/test3a",
                "txt": "\"/test3a\""
              }
            ]
          }
        ]
      },
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