# reactbootdev

### Install

* Install typescript, reactjs project `bash`
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

* Edit `tscofing.json`
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

* Edit `package.json`
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

* Edit `App.tsx`
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


* Add `@Page("/url")` in `MyPage.tsx`
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
