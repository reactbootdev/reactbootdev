import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {RecoilRoot} from "recoil";
import {ObjectTypeEnum} from "@src/reactbootdev/interface/TaskBeansType";
import {pageBeans, pageImportMap} from "@src/reactbootdev/data/PageBean";
import {DOUBLE_NAME_DELIMITER, PAGE_DECORATOR_NAME} from "@src/reactbootdev/config/config";


export function ReactBoot() {

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
        if(object.objectValue.type !== ObjectTypeEnum.CLASS) return undefined

        const pageDecorator = object.objectValue.decorators.filter((decorator) => {
            return decorator.name === PAGE_DECORATOR_NAME
        })[0]
        return {
            ...object,
            class: pageImportMap[`${object.objectPath}${DOUBLE_NAME_DELIMITER}${object.objectName}`],
            pageUrl: pageDecorator.arguments[0].value,
        }
    }).filter((object) => {
        return !!object
    })

    const pageUrls = pageClasses.map((pageClass) => {
        return pageClass?.pageUrl
    })
    const hasDuplicates = pageUrls.length !== new Set(pageUrls).size;

    if(hasDuplicates) {
        throw new Error(`pageUrl is not unique`)
    }

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
