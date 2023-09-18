import {ObjectTypeEnum, TaskBeansType} from "../interface/TaskBeansType";


import {CreatePage, DeletePage, ReadDetailPage, ReadListPage, UpdatePage} from "@src/page/TestPage";
import {Welcome} from "@src/page/home";
import {TestEnum} from "@src/entity/Project";


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
        "useMemo": "src/page/react.ts",
      "useRecoilState": "src/page/recoil.ts",
      "page": "src/reactbootdev/decorator/Page.ts",
      "Project": "src/entity/Project.ts",
        "\r\n    entityRenderer": "src/reactbootdev/component/BaseComponentManager.ts",
        "extractShortKeyFromLongKey": "src/reactbootdev/component/BaseComponentManager.ts",
        "prettierLongKey": "src/reactbootdev/component/BaseComponentManager.ts",
        "removeFirstElementFromKey": "src/reactbootdev/component/BaseComponentManager.ts",
      "RenderTypeEnum": "src/reactbootdev/component/BaseComponentManager.ts",
        "transposeMatrix\r\n": "src/reactbootdev/component/BaseComponentManager.ts",
      "ProjectRepository": "src/repository/ProjectRepository.ts",
      "TestProjectApi": "src/api/TestProjectApi.ts",
        "BaseEntity": "src/reactbootdev/entity/BaseEntity.ts",
        "\r\n    Box": "mui/material.ts",
        "Button": "mui/material.ts",
        "createTheme": "mui/material.ts",
        "Paper": "mui/material.ts",
        "Table": "mui/material.ts",
        "TableBody": "mui/material.ts",
        "TableCell": "mui/material.ts",
        "TableContainer": "mui/material.ts",
        "TableHead": "mui/material.ts",
        "TableRow": "mui/material.ts",
        "TextField": "mui/material.ts",
        "ThemeProvider": "mui/material.ts",
        "Tooltip": "mui/material.ts",
        "Typography\r\n": "mui/material.ts",
        "BoxPropsExt": "src/reactbootdev/component/CreateContainer.ts",
        "styled": "src/page/styled-components.ts",
        "BaseRepository": "src/reactbootdev/repository/BaseRepository.ts",
        "SubProject": "src/entity/SubProject.ts",
        "StringOutputValueType": "src/reactbootdev/component/StringOutput.ts",
        "\r\n    exploreForEachTableData": "src/reactbootdev/util/RepositoryUtil.ts",
        "getFlattenObj": "src/reactbootdev/util/RepositoryUtil.ts",
        "getFlattenObjForArray": "src/reactbootdev/util/RepositoryUtil.ts",
        "isCanOutputType": "src/reactbootdev/util/RepositoryUtil.ts",
        "TableDataForArray": "src/reactbootdev/util/RepositoryUtil.ts",
        "TableDataForArrayType\r\n": "src/reactbootdev/util/RepositoryUtil.ts"
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
      "entity": "src/reactbootdev/decorator/Entity.ts",
      "SubProject": "src/entity/SubProject.ts",
      "BaseEntity": "src/reactbootdev/entity/BaseEntity.ts"
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