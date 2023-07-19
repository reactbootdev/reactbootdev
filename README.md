# reactbootdev

### Install

* `bash` > Install typescript, reactjs project 
```bash
npx create-react-app my-app --template typescript
```

* `bash`
```bash
npm install reactbootdev
```

* `bash` > Install dependencies
```bash
npm install react-router-dom
npm install axios 
npm install recoil
npm install reflect-metadata
```
* `bash` > Install dev dependencies
```bash
npm install -D nodemon
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

* `package.json` > Edit
```package.json
  "scripts": {
    "pre": "npx reactbootdev",
    "prestart": "npx reactbootdev && react-scripts start",
    "prebuild": "npx reactbootdev && react-scripts build",
    "start": "react-scripts start",
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
npm run prestart
```
