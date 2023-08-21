

import { CreatePage } from "src/page/TestPage";
import { ReadListPage } from "src/page/TestPage";
import { ReadDetailPage } from "src/page/TestPage";
import { UpdatePage } from "src/page/TestPage";
import { DeltePage } from "src/page/TestPage";
import { Welcome } from "src/page/home";
import { TestEnum } from "src/entity/Project";
import { TaskBeansType,ObjectTypeEnum } from "../interface/TaskBeansType";


export const pageImportMap: { [key: string]: any } = {
	"src/page/TestPage.tsx////CreatePage" : CreatePage,
	"src/page/TestPage.tsx////ReadListPage" : ReadListPage,
	"src/page/TestPage.tsx////ReadDetailPage" : ReadDetailPage,
	"src/page/TestPage.tsx////UpdatePage" : UpdatePage,
	"src/page/TestPage.tsx////DeltePage" : DeltePage,
	"src/page/home.tsx////Welcome" : Welcome,
	"src/entity/Project.ts////TestEnum" : TestEnum,
}

export const pageBeans: TaskBeansType = {
  "src/page/TestPage.tsx": {
    "importPaths": {
      "React": "src/page/react.ts",
      "useEffect": "src/page/react.ts",
      "useRecoilState": "src/page/recoil.ts",
      "useRecoilValue": "src/page/recoil.ts",
      "BaseRepository": "src/reactbootdev/repository/BaseRepository.ts",
      "page": "src/reactbootdev/decorator/Page.ts",
      "Project": "src/entity/Project.ts",
      "entityRenderer": "src/reactbootdev/component/BaseComponentManager.ts",
      "RenderTypeEnum": "src/reactbootdev/component/BaseComponentManager.ts",
      "ProjectRepository": "src/repository/ProjectRepository.ts",
      "ProjectApi": "src/api/ProjectApi.ts",
      "TestProjectApi": "src/api/TestProjectApi.ts"
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
      "DeltePage": {
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
  },
  "src/test/reactjs/node_modules/axios/index.d.ts": {
    "importPaths": {},
    "objects": {
      "HttpStatusCode": {
        "type": ObjectTypeEnum.ENUM,
        "data": {
          "Continue": "100",
          "SwitchingProtocols": "101",
          "Processing": "102",
          "EarlyHints": "103",
          "Ok": "200",
          "Created": "201",
          "Accepted": "202",
          "NonAuthoritativeInformation": "203",
          "NoContent": "204",
          "ResetContent": "205",
          "PartialContent": "206",
          "MultiStatus": "207",
          "AlreadyReported": "208",
          "ImUsed": "226",
          "MultipleChoices": "300",
          "MovedPermanently": "301",
          "Found": "302",
          "SeeOther": "303",
          "NotModified": "304",
          "UseProxy": "305",
          "Unused": "306",
          "TemporaryRedirect": "307",
          "PermanentRedirect": "308",
          "BadRequest": "400",
          "Unauthorized": "401",
          "PaymentRequired": "402",
          "Forbidden": "403",
          "NotFound": "404",
          "MethodNotAllowed": "405",
          "NotAcceptable": "406",
          "ProxyAuthenticationRequired": "407",
          "RequestTimeout": "408",
          "Conflict": "409",
          "Gone": "410",
          "LengthRequired": "411",
          "PreconditionFailed": "412",
          "PayloadTooLarge": "413",
          "UriTooLong": "414",
          "UnsupportedMediaType": "415",
          "RangeNotSatisfiable": "416",
          "ExpectationFailed": "417",
          "ImATeapot": "418",
          "MisdirectedRequest": "421",
          "UnprocessableEntity": "422",
          "Locked": "423",
          "FailedDependency": "424",
          "TooEarly": "425",
          "UpgradeRequired": "426",
          "PreconditionRequired": "428",
          "TooManyRequests": "429",
          "RequestHeaderFieldsTooLarge": "431",
          "UnavailableForLegalReasons": "451",
          "InternalServerError": "500",
          "NotImplemented": "501",
          "BadGateway": "502",
          "ServiceUnavailable": "503",
          "GatewayTimeout": "504",
          "HttpVersionNotSupported": "505",
          "VariantAlsoNegotiates": "506",
          "InsufficientStorage": "507",
          "LoopDetected": "508",
          "NotExtended": "510",
          "NetworkAuthenticationRequired": "511"
        }
      }
    }
  }
}