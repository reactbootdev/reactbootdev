import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
// import {beans, importMap} from "../data/Bean";
import {RecoilRoot} from "recoil";
import {ObjectTypeEnum} from "src/reactbootdev/interface/TaskBeansType";
import {pageBeans, pageImportMap} from "src/reactbootdev/data/PageBean";


// TODO : update
export function ReactBoot() {

    // TODO :: page url 충돌 시 예외 처리 > 에러 발생
    // TODO :: `readme.md`에 의존성 모듈 내역 추가 > route, recoil 등.
    // TODO :: useMemo 사용

    const DELIMITER = "////"
    const PAGE_DECORATOR_NAME = "page"
    // const PAGE_DECORATOR_DEFINITION = "(pageUrl: string) => (target: any) => any"

    const pageClasses = Object.entries(pageBeans).map(([filePath, fileInfo]) => {
        const objects = Object.entries(fileInfo.objects).map(([objectName, objectValue]) => {
            return {
                objectPath: filePath,
                objectName: objectName,
                objectValue: objectValue,
            }
        })
        return objects
    }).flat().filter((object) => {
        if(object.objectValue.type !== ObjectTypeEnum.CLASS) return false
        return object.objectValue.decorators.filter((decorator) => {
            return decorator.name === PAGE_DECORATOR_NAME
        }).length > 0
    }).map((object) => {
        // console.log(object)

        if(object.objectValue.type !== ObjectTypeEnum.CLASS) return undefined

        const pageDecorator = object.objectValue.decorators.filter((decorator) => {
            return decorator.name === PAGE_DECORATOR_NAME
        })[0]
        // console.log(pageDecorator)
        return {
            ...object,
            class: pageImportMap[`${object.objectPath}${DELIMITER}${object.objectName}`],
            pageUrl: pageDecorator.arguments[0].value,
        }
    }).filter((object) => {
        // console.log(`filter`)
        // console.log(object)
        return !!object
    })

    // if pageUrl ununique, throw error
    const pageUrls = pageClasses.map((pageClass) => {
        return pageClass?.pageUrl
    })
    const hasDuplicates = pageUrls.length !== new Set(pageUrls).size;

    if(hasDuplicates) {
        throw new Error(`pageUrl is not unique`)
    }

    // entityBeans
    // .filter((bean) => {
    //     let isPage = false
    //     bean.decorators.forEach((decorator) => {
    //         if (
    //             decorator.decoratorName === PAGE_DECORATOR_NAME
    //             && decorator.definition === PAGE_DECORATOR_DEFINITION
    //         ) {
    //             isPage = true
    //         }
    //     })
    //     return isPage
    // })
    // .map((bean) => {
    //     if(bean.classPath === undefined) {
    //         return undefined
    //     }
    //     const pageDecorators = bean.decorators.filter((decorator) => {
    //         return decorator.decoratorName === PAGE_DECORATOR_NAME
    //     })
    //     if (pageDecorators.length === 0) {
    //         return undefined
    //     }
    //     const pageDecorator = pageDecorators[0]
    //     if (pageDecorator.arguments.length === 0) {
    //         return undefined
    //     }
    //
    //     return {
    //         classPath: bean.classPath,
    //         className: bean.className,
    //         pageUrl: pageDecorator.arguments[0].value,
    //         class: importMap[`${bean.classPath}/${bean.className}`]
    //     }
    // })
    // .filter((bean) => {
    //     return bean !== undefined
    // })

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

    // pageClasses
    // console.log(`pageClasses : ${pageClasses}`)
    // console.log(pageClasses)
    // console.log(routeList)
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
