import {ObjectTypeEnum, TaskBeansType} from "../interface/TaskBeansType";


import {UpdatePage as src_page_TestPageUpdate____UpdatePage} from "@src/page/TestPageUpdate";
import {ReadListPage as src_page_TestPageReadList____ReadListPage} from "@src/page/TestPageReadList";
import {ReadDetailPage as src_page_TestPageReadDetail____ReadDetailPage} from "@src/page/TestPageReadDetail";
import {DeletePage as src_page_TestPageDelete____DeletePage} from "@src/page/TestPageDelete";
import {CreatePage as src_page_TestPageCreate____CreatePage} from "@src/page/TestPageCreate";
import {Welcome as src_page_home____Welcome} from "@src/page/home";
import {TestEnum as src_entity_Project____TestEnum} from "@src/entity/Project";


export const pageImportMap: { [key: string]: any } = {
  "src/page/TestPageUpdate.tsx////UpdatePage": src_page_TestPageUpdate____UpdatePage,
  "src/page/TestPageReadList.tsx////ReadListPage": src_page_TestPageReadList____ReadListPage,
  "src/page/TestPageReadDetail.tsx////ReadDetailPage": src_page_TestPageReadDetail____ReadDetailPage,
  "src/page/TestPageDelete.tsx////DeletePage": src_page_TestPageDelete____DeletePage,
  "src/page/TestPageCreate.tsx////CreatePage": src_page_TestPageCreate____CreatePage,
  "src/page/home.tsx////Welcome": src_page_home____Welcome,
  "src/entity/Project.ts////TestEnum": src_entity_Project____TestEnum
}

export const pageBeans: TaskBeansType = {
  "src/page/TestPageUpdate.tsx": {
    "importPaths": {
      "React": "src/page/react.ts",
      "useEffect": "src/page/react.ts",
      "useRecoilState": "src/page/recoil.ts",
      "page": "src/reactbootdev/decorator/Page.ts",
      "Project": "src/entity/Project.ts",
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
      "BaseRepository": "src/reactbootdev/repository/BaseRepository.ts",
      "BoxPropsExt": "src/reactbootdev/util/RepositoryUtil.ts",
      "exploreForEachTableData": "src/reactbootdev/util/RepositoryUtil.ts",
      "extractShortKeyFromLongKey": "src/reactbootdev/util/RepositoryUtil.ts",
      "getFlattenObj": "src/reactbootdev/util/RepositoryUtil.ts",
      "getFlattenObjForArray": "src/reactbootdev/util/RepositoryUtil.ts",
      "isCanOutputType": "src/reactbootdev/util/RepositoryUtil.ts",
      "prettierLongKey": "src/reactbootdev/util/RepositoryUtil.ts",
      "removeFirstElementFromKey": "src/reactbootdev/util/RepositoryUtil.ts",
      "TableDataForArray": "src/reactbootdev/util/RepositoryUtil.ts",
      "TableDataForArrayType": "src/reactbootdev/util/RepositoryUtil.ts",
      "UpdatePage": "src/page/TestPageUpdate.tsx"
    },
    "objects": {
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
      }
    }
  },
  "src/page/TestPageReadList.tsx": {
    "importPaths": {
      "React": "src/page/react.ts",
      "useEffect": "src/page/react.ts",
      "useMemo": "src/page/react.ts",
      "useRecoilState": "src/page/recoil.ts",
      "page": "src/reactbootdev/decorator/Page.ts",
      "Project": "src/entity/Project.ts",
      "ProjectRepository": "src/repository/ProjectRepository.ts",
      "TestProjectApi": "src/api/TestProjectApi.ts",
      "BaseEntity": "src/reactbootdev/entity/BaseEntity.ts",
      "Box": "mui/material.ts",
      "createTheme": "mui/material.ts",
      "Paper": "mui/material.ts",
      "Table": "mui/material.ts",
      "TableBody": "mui/material.ts",
      "TableCell": "mui/material.ts",
      "TableContainer": "mui/material.ts",
      "TableHead": "mui/material.ts",
      "TableRow": "mui/material.ts",
      "ThemeProvider": "mui/material.ts",
      "Tooltip": "mui/material.ts",
      "Typography": "mui/material.ts",
      "BaseRepository": "src/reactbootdev/repository/BaseRepository.ts",
      "BoxPropsExt": "src/reactbootdev/util/RepositoryUtil.ts",
      "extractShortKeyFromLongKey": "src/reactbootdev/util/RepositoryUtil.ts",
      "getFlattenObj": "src/reactbootdev/util/RepositoryUtil.ts",
      "prettierLongKey": "src/reactbootdev/util/RepositoryUtil.ts",
      "removeFirstElementFromKey": "src/reactbootdev/util/RepositoryUtil.ts",
      "transposeMatrix": "src/reactbootdev/util/RepositoryUtil.ts",
      "ReadListPage": "src/page/TestPageReadList.tsx"
    },
    "objects": {
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
      }
    }
  },
  "src/page/TestPageReadDetail.tsx": {
    "importPaths": {
      "React": "src/page/react.ts",
      "useEffect": "src/page/react.ts",
      "useMemo": "src/page/react.ts",
      "useRecoilState": "src/page/recoil.ts",
      "page": "src/reactbootdev/decorator/Page.ts",
      "Project": "src/entity/Project.ts",
      "ProjectRepository": "src/repository/ProjectRepository.ts",
      "TestProjectApi": "src/api/TestProjectApi.ts",
      "BaseEntity": "src/reactbootdev/entity/BaseEntity.ts",
      "Box": "mui/material.ts",
      "createTheme": "mui/material.ts",
      "Paper": "mui/material.ts",
      "Table": "mui/material.ts",
      "TableBody": "mui/material.ts",
      "TableCell": "mui/material.ts",
      "TableContainer": "mui/material.ts",
      "TableHead": "mui/material.ts",
      "TableRow": "mui/material.ts",
      "ThemeProvider": "mui/material.ts",
      "Tooltip": "mui/material.ts",
      "Typography": "mui/material.ts",
      "BaseRepository": "src/reactbootdev/repository/BaseRepository.ts",
      "BoxPropsExt": "src/reactbootdev/util/RepositoryUtil.ts",
      "extractShortKeyFromLongKey": "src/reactbootdev/util/RepositoryUtil.ts",
      "getFlattenObj": "src/reactbootdev/util/RepositoryUtil.ts",
      "prettierLongKey": "src/reactbootdev/util/RepositoryUtil.ts",
      "removeFirstElementFromKey": "src/reactbootdev/util/RepositoryUtil.ts",
      "ReadDetailPage": "src/page/TestPageReadDetail.tsx"
    },
    "objects": {
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
      }
    }
  },
  "src/page/TestPageDelete.tsx": {
    "importPaths": {
      "React": "src/page/react.ts",
      "useRecoilState": "src/page/recoil.ts",
      "page": "src/reactbootdev/decorator/Page.ts",
      "Project": "src/entity/Project.ts",
      "ProjectRepository": "src/repository/ProjectRepository.ts",
      "TestProjectApi": "src/api/TestProjectApi.ts",
      "BaseEntity": "src/reactbootdev/entity/BaseEntity.ts",
      "Box": "mui/material.ts",
      "createTheme": "mui/material.ts",
      "Tooltip": "mui/material.ts",
      "BaseRepository": "src/reactbootdev/repository/BaseRepository.ts",
      "BoxPropsExt": "src/reactbootdev/util/RepositoryUtil.ts",
      "prettierLongKey": "src/reactbootdev/util/RepositoryUtil.ts",
      "DeletePage": "src/page/TestPageDelete.tsx"
    },
    "objects": {
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
  "src/page/TestPageCreate.tsx": {
    "importPaths": {
      "React": "src/page/react.ts",
      "useEffect": "src/page/react.ts",
      "useRecoilState": "src/page/recoil.ts",
      "page": "src/reactbootdev/decorator/Page.ts",
      "Project": "src/entity/Project.ts",
      "ProjectRepository": "src/repository/ProjectRepository.ts",
      "TestProjectApi": "src/api/TestProjectApi.ts",
      "BaseEntity": "src/reactbootdev/entity/BaseEntity.ts",
      "Box": "mui/material.ts",
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
      "BaseRepository": "src/reactbootdev/repository/BaseRepository.ts",
      "SubProject": "src/entity/SubProject.ts",
      "BoxPropsExt": "src/reactbootdev/util/RepositoryUtil.ts",
      "extractShortKeyFromLongKey": "src/reactbootdev/util/RepositoryUtil.ts",
      "getFlattenObj": "src/reactbootdev/util/RepositoryUtil.ts",
      "prettierLongKey": "src/reactbootdev/util/RepositoryUtil.ts",
      "removeFirstElementFromKey": "src/reactbootdev/util/RepositoryUtil.ts",
      "CreatePage": "src/page/TestPageCreate.tsx"
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
      }
    }
  },
  "src/page/home.tsx": {
    "importPaths": {
      "page": "src/reactbootdev/decorator/Page.ts",
      "Welcome": "src/page/home.tsx"
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
      "BaseEntity": "src/reactbootdev/entity/BaseEntity.ts",
      "TestEnum": "src/entity/Project.ts"
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