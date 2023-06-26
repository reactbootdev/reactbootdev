import { OutputInterface } from "../src/interface/OutputInterface";

export const outputList: OutputInterface[] = [
 {
  "superClasses": [],
  "classPath": "test/source/test2.ts",
  "className": "Test2",
  "decorators": [
   {
    "decoratorName": "readonly",
    "definition": "(writable: boolean) => (target: any, decoratedPropertyName: any) => any",
    "arguments": [
     {
      "type": "boolean",
      "value": false,
      "txt": "false"
     }
    ]
   }
  ],
  "members": [
   {
    "name": "data1",
    "type": "property",
    "dataType": "number",
    "decorators": [
     {
      "decoratorName": "readonly",
      "definition": "(writable: boolean) => (target: any, decoratedPropertyName: any) => any",
      "arguments": [
       {
        "type": "boolean",
        "value": false,
        "txt": "false"
       }
      ]
     }
    ]
   },
   {
    "name": "data2",
    "type": "property",
    "dataType": "string",
    "decorators": [
     {
      "decoratorName": "readonly",
      "definition": "(writable: boolean) => (target: any, decoratedPropertyName: any) => any",
      "arguments": [
       {
        "type": "boolean",
        "value": true,
        "txt": "true"
       }
      ]
     }
    ]
   }
  ]
 },
 {
  "superClasses": [
   {
    "className": "TestAAAA",
    "classPath": "test/source/test.ts"
   }
  ],
  "classPath": "test/source/test.ts",
  "className": "Test",
  "decorators": [
   {
    "decoratorName": "page2",
    "definition": "(option: { value: string; callback: (x: any, y: any) => any; }) => (target: any, key: string) => void",
    "arguments": [
     {
      "type": "string",
      "value": "/test",
      "txt": "\"/test\""
     }
    ]
   },
   {
    "decoratorName": "page",
    "definition": "(pageUrl: string) => (target: any) => any",
    "arguments": [
     {
      "type": "string",
      "value": "/tes2t",
      "txt": "\"/tes2t\""
     }
    ]
   },
   {
    "decoratorName": "page",
    "definition": "(pageUrl: string) => (target: any) => any",
    "arguments": [
     {
      "type": "string",
      "value": "/te3st",
      "txt": "\"/te3st\""
     },
     {
      "type": "any[]",
      "value": [
       1,
       2
      ],
      "txt": "[1, 2]"
     },
     {
      "type": "any[]",
      "value": [
       "tes",
       [
        "df"
       ]
      ],
      "txt": "[\"tes\", [\"df\"]]"
     }
    ]
   }
  ],
  "members": [
   {
    "name": "test3",
    "type": "method",
    "dataType": "() => string",
    "decorators": [
     {
      "decoratorName": "page2",
      "definition": "(option: { value: string; callback: (x: any, y: any) => any; }) => (target: any, key: string) => void",
      "arguments": [
       {
        "type": "any",
        "value": {
         "value": ""
        },
        "txt": "{value: \"\", callback: (a, b) => a + \"2\"}"
       }
      ]
     }
    ]
   },
   {
    "name": "test33",
    "type": "method",
    "dataType": "() => string",
    "decorators": [
     {
      "decoratorName": "page3",
      "definition": "(option: { value: string; callback: (x: any, y: any) => any; }) => (target: any, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor",
      "arguments": [
       {
        "type": "any",
        "value": {
         "value": ""
        },
        "txt": "{value: \"\", callback: (a, b) => a + \"2\"}"
       }
      ]
     }
    ]
   }
  ]
 }
]