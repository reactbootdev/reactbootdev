import 'reflect-metadata';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import React from 'react';


export function ReactBoot(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // Modify or observe the function behavior here
    console.log("Decorator called");

    function Home() {
        return (
            <div>
                <h1>Home Page</h1>
                {/* 추가적인 컴포넌트 또는 컨텐츠를 여기에 추가 */}
            </div>
        );
    }

    function TestComponent() {
        return (
            <div>
                <p>test</p>
            </div>
        )
    }

    function TestComponent2() {
        return (
            <div>
                <p>test2</p>
            </div>
        )
    }

    const testJson = {
        pageList: [
            {
                url: "/",
                component: <TestComponent/>
            },
            {
                url: "/test",
                component: <TestComponent2/>
            }
        ]
    }

    // testJson to page Route
    const routeList = testJson.pageList.map((page) => {
        return (
            <Route path={page.url} element={page.component}></Route>
        )
    })


    // You can also modify the descriptor to change the function behavior
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        console.log("Before function execution");
        const result = originalMethod.apply(this, args);
        console.log("After function execution");
        return (
            <Router>
                <Routes>
                    {result}
                </Routes>
            </Router>
        );
    };
}
