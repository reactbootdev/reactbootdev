import { TaskBeansType,ObjectTypeEnum } from "../interface/TaskBeansType";


import { SubProject } from "src/entity/SubProject";
import { Project } from "src/entity/Project";
import { TestEnum } from "src/entity/Project";


export const entityImportMap: { [key: string]: any } = {
	"src/entity/SubProject.ts////SubProject" : SubProject,
	"src/entity/Project.ts////Project" : Project,
	"src/entity/Project.ts////TestEnum" : TestEnum,
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