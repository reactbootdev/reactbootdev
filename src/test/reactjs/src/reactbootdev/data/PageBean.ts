import { TaskBeansType,ObjectTypeEnum } from "../interface/TaskBeansType";


import {CreatePage} from "@src/page/TestPage";
import { ReadListPage } from "@src/page/TestPage";
import { ReadDetailPage } from "@src/page/TestPage";
import { UpdatePage } from "@src/page/TestPage";
import { DeletePage } from "@src/page/TestPage";
import { Welcome } from "@src/page/home";
import { TestEnum } from "@src/entity/Project";


export const pageImportMap: { [key: string]: any } = {
	"src/page/TestPage.tsx////CreatePage" : CreatePage,
	"src/page/TestPage.tsx////ReadListPage" : ReadListPage,
	"src/page/TestPage.tsx////ReadDetailPage" : ReadDetailPage,
	"src/page/TestPage.tsx////UpdatePage" : UpdatePage,
	"src/page/TestPage.tsx////DeletePage" : DeletePage,
	"src/page/home.tsx////Welcome" : Welcome,
	"src/entity/Project.ts////TestEnum" : TestEnum
}

export const pageBeans: TaskBeansType = {
  "src/page/TestPage.tsx": {
    "importPaths": {
      "React": "src/page/react.ts",
      "useEffect": "src/page/react.ts",
      "useRecoilState": "src/page/recoil.ts",
      "page": "src/page/@src/reactbootdev/decorator/Page.ts",
      "Project": "src/page/@src/entity/Project.ts",
      "entityRenderer": "src/page/@src/reactbootdev/component/BaseComponentManager.ts",
      "RenderTypeEnum": "src/page/@src/reactbootdev/component/BaseComponentManager.ts",
      "ProjectRepository": "src/page/@src/repository/ProjectRepository.ts",
      "TestProjectApi": "src/page/@src/api/TestProjectApi.ts",
      "extractEntityKeyWithFullPath": "src/page/@src/reactbootdev/util/RepositoryUtil.ts",
      "getEntitiKeyByType": "src/page/@src/reactbootdev/util/RepositoryUtil.ts"
    },
    "objects": {
      "CreatePage": {
        "type": ObjectTypeEnum.CLASS,
        "data": {},
        "decorators": [
          {
            "name": "page",
            "definition": "any",
            "arguments": [
              {
                "type": "string",
                "value": "/c",
                "txt": "\"/c\""
              }
            ]
          }
        ]
      },
      "ReadListPage": {
        "type": ObjectTypeEnum.CLASS,
        "data": {},
        "decorators": [
          {
            "name": "page",
            "definition": "any",
            "arguments": [
              {
                "type": "string",
                "value": "/r",
                "txt": "\"/r\""
              }
            ]
          }
        ]
      },
      "ReadDetailPage": {
        "type": ObjectTypeEnum.CLASS,
        "data": {},
        "decorators": [
          {
            "name": "page",
            "definition": "any",
            "arguments": [
              {
                "type": "string",
                "value": "/rd",
                "txt": "\"/rd\""
              }
            ]
          }
        ]
      },
      "UpdatePage": {
        "type": ObjectTypeEnum.CLASS,
        "data": {},
        "decorators": [
          {
            "name": "page",
            "definition": "any",
            "arguments": [
              {
                "type": "string",
                "value": "/u",
                "txt": "\"/u\""
              }
            ]
          }
        ]
      },
      "DeletePage": {
        "type": ObjectTypeEnum.CLASS,
        "data": {},
        "decorators": [
          {
            "name": "page",
            "definition": "any",
            "arguments": [
              {
                "type": "string",
                "value": "/d",
                "txt": "\"/d\""
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
  },
  "src/entity/Project.ts": {
    "importPaths": {
      "entity": "src/entity/@src/reactbootdev/decorator/Entity.ts",
      "SubProject": "src/entity/@src/entity/SubProject.ts",
      "BaseEntity": "src/entity/@src/reactbootdev/entity/BaseEntity.ts"
    },
    "objects": {
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