import {ObjectTypeEnum, TaskBeansType} from "../interface/TaskBeansType";


import {
  CreatePage as src_page_TestPage____CreatePage,
  DeletePage as src_page_TestPage____DeletePage,
  ReadDetailPage as src_page_TestPage____ReadDetailPage,
  ReadListPage as src_page_TestPage____ReadListPage,
  UpdatePage as src_page_TestPage____UpdatePage
} from "@src/page/TestPage";
import {Welcome as src_page_home____Welcome} from "@src/page/home";
import {TestEnum as src_entity_Project____TestEnum} from "@src/entity/Project";


export const pageImportMap: { [key: string]: any } = {
  "src/page/TestPage.tsx////CreatePage": src_page_TestPage____CreatePage,
  "src/page/TestPage.tsx////ReadListPage": src_page_TestPage____ReadListPage,
  "src/page/TestPage.tsx////ReadDetailPage": src_page_TestPage____ReadDetailPage,
  "src/page/TestPage.tsx////UpdatePage": src_page_TestPage____UpdatePage,
  "src/page/TestPage.tsx////DeletePage": src_page_TestPage____DeletePage,
  "src/page/home.tsx////Welcome": src_page_home____Welcome,
  "src/entity/Project.ts////TestEnum": src_entity_Project____TestEnum
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
      "entityRenderer": "src/reactbootdev/component/BaseComponentManager.ts",
      "extractShortKeyFromLongKey": "src/reactbootdev/component/BaseComponentManager.ts",
      "prettierLongKey": "src/reactbootdev/component/BaseComponentManager.ts",
      "removeFirstElementFromKey": "src/reactbootdev/component/BaseComponentManager.ts",
      "RenderTypeEnum": "src/reactbootdev/component/BaseComponentManager.ts",
      "transposeMatrix": "src/reactbootdev/component/BaseComponentManager.ts",
      "ProjectRepository": "src/repository/ProjectRepository.ts",
      "TestProjectApi": "src/api/TestProjectApi.ts",
      "BaseEntity": "src/reactbootdev/entity/BaseEntity.ts",
      "Box": "mui/material.ts",
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
      "Typography": "mui/material.ts",
      "BoxPropsExt": "src/reactbootdev/component/CreateContainer.ts",
      "styled": "src/page/styled-components.ts",
      "BaseRepository": "src/reactbootdev/repository/BaseRepository.ts",
      "SubProject": "src/entity/SubProject.ts",
      "StringOutputValueType": "src/reactbootdev/component/StringOutput.ts",
      "exploreForEachTableData": "src/reactbootdev/util/RepositoryUtil.ts",
      "getFlattenObj": "src/reactbootdev/util/RepositoryUtil.ts",
      "getFlattenObjForArray": "src/reactbootdev/util/RepositoryUtil.ts",
      "isCanOutputType": "src/reactbootdev/util/RepositoryUtil.ts",
      "TableDataForArray": "src/reactbootdev/util/RepositoryUtil.ts",
      "TableDataForArrayType": "src/reactbootdev/util/RepositoryUtil.ts"
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