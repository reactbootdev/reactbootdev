reactbootdev
=========================

[![npm](https://img.shields.io/badge/npm-reactbootdev-brightgreen.svg?style=flat-square)]()
[![npm version](https://img.shields.io/npm/v/reactbootdev.svg?style=flat-square)](https://www.npmjs.com/package/reactbootdev)
[![npm downloads](https://img.shields.io/npm/dm/reactbootdev.svg?style=flat-square)](https://www.npmjs.com/package/reactbootdev)

## Features

* [Page](#page)
* [Entity](#entity)
* [Repository](#repository)
* [Api](#api)
* [Form](#form)


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
    "emitDecoratorMetadata": true,
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

### `.gitignore`
```gitignore
# reactbootdev
src/reactbootdev
```

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

## Usage

### Page

#### `@page`
* Add `@page("/url")` to class

##### `MyPage.tsx`
* Simple page
```typescript
import React from "react";
import {page} from "@src/reactbootdev/decorator/page";

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

##### `WelcomePage.tsx`
* Page with function component
```typescript
import React from "react";
import {page} from "@src/reactbootdev/decorator/page";

export function WelcomeComponent() {
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

### Entity

#### `@entity`
* Add `@entity` to class

##### `src/entity/ProjectEntity.ts`
```ts
import {entity} from "@src/reactbootdev/decorator/Entity";
import BaseEntity from "@src/reactbootdev/entity/BaseEntity";

@entity
export class ProjectEntity extends BaseEntity {
    id: number | null = null;
    name?: string
    description?: string
    startDate?: string
    endDate?: string
}
```

### Repository
* Recoil Based Repository

##### `src/repository/ProjectRepository.ts`
```ts
import BaseRepository from "@src/reactbootdev/repository/BaseRepository";
import {v4 as uuidv4} from 'uuid';
import {ProjectEntity} from "@src/entity/Project";

export class ProjectRepository extends BaseRepository<ProjectEntity> {
    static defaultRepositoryKey = uuidv4()
    static defaultEntityClass = ProjectEntity;
}
```

##### `src/component/CreateComponent.tsx`
* Single Entity
```ts
import {ProjectRepository} from "@src/repository/ProjectRepository";
import {ProjectEntity} from "@src/entity/Project";

const CreateComponent = () => {
    const repo = useRepository(ProjectRepository);

    useEffect(() => {
        const defaultEntity = new ProjectEntity()
        defaultEntity.name = "test"
        
        repo.setEntity(defaultEntity)
    }, [])
    
    return (
        <>
            {JSON.stringify(repo.getEntity())}
        </>
    );
}
```
* Multiple Entity
```ts
import {ProjectRepository} from "@src/repository/ProjectRepository";
import {ProjectEntity} from "@src/entity/Project";

const CreateComponent = () => {
    const repo = useRepository(ProjectRepository);

    useEffect(() => {
        const defaultEntity = new ProjectEntity()
        defaultEntity.name = "test"
        const defaultList = [defaultEntity, defaultEntity]
        
        repo.setList(defaultList)
    }, [])
    
    return (
        <>
            {JSON.stringify(repo.getList())}
        </>
    );
}
```

### Api
* ReactQuery Based Api

### Form
* ReactHookForm Based Form

### `bash`
```bash
npm run rtstart
```
