import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {RecoilRoot} from "recoil";
import {beans, importMap} from "../data/Bean";

export function ReactBoot() {

    // TODO :: page url 충돌 시 예외 처리 > 에러 발생
    // TODO :: `readme.md`에 의존성 모듈 내역 추가 > route, recoil 등.

    const PAGE_DECORATOR_NAME = "Page"
    const PAGE_DECORATOR_DEFINITION = "(pageUrl: string) => (target: any) => any"

    const pageClasses = beans
        .filter((bean) => {
            let isPage = false
            bean.decorators.forEach((decorator) => {
                if (
                    decorator.decoratorName === PAGE_DECORATOR_NAME
                    && decorator.definition === PAGE_DECORATOR_DEFINITION
                ) {
                    isPage = true
                }
            })
            return isPage
        })
        .map((bean) => {
            if(bean.classPath === undefined) {
                return undefined
            }
            const pageDecorators = bean.decorators.filter((decorator) => {
                return decorator.decoratorName === PAGE_DECORATOR_NAME
            })
            if (pageDecorators.length === 0) {
                return undefined
            }
            const pageDecorator = pageDecorators[0]
            if (pageDecorator.arguments.length === 0) {
                return undefined
            }

            return {
                classPath: bean.classPath,
                className: bean.className,
                pageUrl: pageDecorator.arguments[0].value,
                class: importMap[`${bean.classPath}/${bean.className}`]
            }
        })
        .filter((bean) => {
            return bean !== undefined
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
        <RecoilRoot>
            <Router>
                <Routes>
                    {routeList}
                </Routes>
            </Router>
        </RecoilRoot>
    )
}
