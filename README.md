# reactbootdev

## Features

### Page

* Page

### Repository

* Repository

## Install

### `bash`

* Install typescript, reactjs project

```bash
npx create-react-app my-app --template typescript
```

* Install dependencies
```bash
npm i reactbootdev
```

```bash
npm i react-router-dom axios recoil uuid env-cmd
npm i @mui/material @emotion/react @emotion/styled
npm i @craco/craco craco-alias
npm i styled-components 
npm i reflect-metadata
```

* Install dev dependencies
```bash
npm install -D nodemon
npm install --save-dev @types/uuid
```

### `tsconfig.json`

```tsconfig.json
{
  "extends": "./tsconfig.paths.json",
  "compilerOptions": {
    "experimentalDecorators": true,
    "baseUrl": "src",
    "paths": {
      "@src/*": [
        "./*"
      ],
      "@components/*": [
        "components/*"
      ],
      "@utils/*": [
        "utils/*"
      ]
    },
    // ...
  },
  "include": [
    "src",
    "craco.config.js"
  ]
}

```

### `tsconfig.paths.json`

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@src/*": [
        "src/*"
      ]
    }
  }
}
```

### `craco.config.js`

```js
const CracoAlias = require("craco-alias");

module.exports = {
    plugins: [
        {
            plugin: CracoAlias,
            options: {
                source: "tsconfig",
                tsConfigPath: "tsconfig.paths.json",
            },
        },
    ],
};
```

### `.env.production`, `.env.development`

* Create blank files in root directory

### `package.json`

* Adjust `scripts` for `reactbootdev`, `nodemon`, `env-cmd`, `craco`
```package.json
  "scripts": {
    "rt": "npx reactbootdev",
    "rtstart": "npm run rt && npm run start",
    "rtbuild": "npm run rt && npm run build",
    "rtnodemon": "nodemon -V --watch src --ext js,mjs,cjs,json,jsx,ts,tsx --delay 5000ms --exec \"npm run rt\"",
    "build": "env-cmd -f .env.production craco build",
    "start": "env-cmd -f .env.development craco start",
    "test": "craco test",
    "eject": "react-scripts eject"
  },
```

### `App.tsx`
```typescript
import React from 'react';
import {ReactBoot} from "@src/reactbootdev/component/ReactBoot";

function App() {
    return (
        <div className="App">
            <ReactBoot/>
        </div>
    );
}

export default App;
```

### `MyPage.tsx`

* Add `@page("/url")`
* Simple page
```typescript
import React from "react";
import {page} from "@src/reactbootdev/decorator/Page";

@page("/")
export class MyPage  {
  render() {
    return (
      <div>
        <h1>My Page</h1>
      </div>
    );
  }
}
```

* Page with function component
```typescript
import React from "react";
import {page} from "@src/reactbootdev/decorator/Page";

function WelcomeComponent() {
    return (
        <div>
            <h1>Welcome</h1>
        </div>
    )
}

@page("/")
export class Welcome {
    render() {
        return <WelcomeComponent/>;
    }
}
```

### `bash`
```bash
npm run rtstart
```
