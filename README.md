﻿# reactbootdev

### Install

* `bash` > Install typescript, reactjs project

```bash
npx create-react-app my-app --template typescript
```

* `bash`
```bash
npm i reactbootdev
```

* `bash` > Install dependencies

```bash
npm i react-router-dom axios recoil uuid env-cmd
npm i @mui/material @emotion/react @emotion/styled
npm i @craco/craco craco-alias
npm i styled-components 
npm i reflect-metadata
```

* `bash` > Install dev dependencies

```bash
npm install -D nodemon
npm install --save-dev @types/uuid
```

* `tscofing.json` > Edit

```tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "baseUrl": ".",
    "paths": {
      "@src/*": [
        "src/*"
      ]
    },
    // ...
  },
  // ...
}
```

* `package.json` > Edit (`nodemon`, `env-cmd`)
```package.json
  "scripts": {
    "rt": "npx reactbootdev",
    "rtstart": "npm run rt && env-cmd -f .env.development react-scripts start",
    "rtbuild": "npm run rt && env-cmd -f .env.production react-scripts build",
    "rtnodemon": "nodemon -V --watch src --ext js,mjs,cjs,json,jsx,ts,tsx --delay 5000ms --exec \"npm run rt\"",
    "build": "env-cmd -f .env.production react-scripts build",
    "start": "env-cmd -f .env.development react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
```

* `App.tsx` > Edit
```typescript
import { App } from "reactbootdev";

function App() {
    return (
        <div className="App">
            <ReactBoot/>
        </div>
    );
}
```

* `MyPage.tsx` > Add `@Page("/url")`

```typescript
import React from "react";
import { Page } from "reactbootdev";

@Page("/url")
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




* `bash`
```bash
npm run rtstart
```
