import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {beans, importMap} from "../data/Bean";

export function ReactBoot() {

    const pageClasses = beans
        .filter((bean) => {
            let isPage = false;
            bean.decorators.forEach((decorator) => {
                if (
                    decorator.decoratorName === "Page"
                    && decorator.definition === "(pageUrl: string) => (target: any) => any"
                ) {
                    isPage = true;
                }
            })
            return isPage;
        })
        .map((bean) => {
            if(bean.classPath === undefined) {
                return undefined
            }
            const pageDecorators = bean.decorators.filter((decorator) => {
                return decorator.decoratorName === "Page";
            });
            if (pageDecorators.length === 0) {
                return undefined;
            }
            const pageDecorator = pageDecorators[0];
            if (pageDecorator.arguments.length === 0) {
                return undefined;
            }

            return {
                classPath: bean.classPath,
                className: bean.className,
                pageUrl: pageDecorator.arguments[0].value,
                class: importMap[bean.classPath]
            }
        })
        .filter((bean) => {
            return bean !== undefined;
        })

    const routeList = pageClasses
        .map((page) => {
            if(page?.class === undefined) {
                return undefined
            }
            const pageClass = new page.class()
            if(pageClass.render === undefined) {
                return undefined
            }
            return (
                <Route path={page.pageUrl} element={pageClass.render()}></Route>
            )
        }).filter((route) => {
            return route !== undefined
        })

    return (
        <Router>
            <Routes>
                {routeList}
            </Routes>
        </Router>
    );
}
