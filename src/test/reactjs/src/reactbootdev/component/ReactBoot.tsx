import React, {createContext, useContext, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {RecoilRoot} from "recoil";
import {ObjectTypeEnum} from "@src/reactbootdev/interface/TaskBeansType";
import {pageBeans, pageImportMap} from "@src/reactbootdev/data/PageBean";
import {DOUBLE_NAME_DELIMITER, PAGE_DECORATOR_NAME} from "@src/reactbootdev/config/config";
import {QueryClient, QueryClientProvider,} from '@tanstack/react-query'
import {createTheme, ThemeProvider} from "@mui/material/styles";

export function ReactBoot() {

    // page
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
        if (object.objectValue.type !== ObjectTypeEnum.CLASS) return false
        return object.objectValue.decorators.filter((decorator) => {
            return decorator.name === PAGE_DECORATOR_NAME
        }).length > 0
    }).map((object) => {
        if (object.objectValue.type !== ObjectTypeEnum.CLASS) return undefined

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

    if (hasDuplicates) {
        let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index)
        const msg = JSON.stringify(findDuplicates(pageUrls))
        throw new Error(`pageUrl is not unique : ${msg}`)
    }

    const routeList = pageClasses
        .map((page, idx) => {
            if (page?.class === undefined) {
                return undefined
            }
            const pageClass = new page.class()
            if (pageClass.render === undefined) {
                return undefined
            }

            return (
                <Route key={idx} path={page.pageUrl} element={pageClass.render()}></Route>
            )
        }).filter((route) => {
            return route !== undefined
        })

    // logging
    if (process.env.REACT_APP_CONFIG_ACTIVE_PROFILE !== `production`) {
        console.table(pageClasses.map((page) => {
            if (page?.class === undefined) {
                return undefined
            }
            const pageClass = new page.class()
            if (pageClass.render === undefined) {
                return undefined
            }
            const renderedClass = pageClass.render()

            return {
                path: page.pageUrl,
                class: pageClass,
                render: renderedClass.type.name,
            }
        }).filter((route) => {
            return route !== undefined
        }))
    }

    // React Query
    const queryClient = new QueryClient()

    // Theme
    const [mode, setMode] = useState(DEFAULT_THEME); // 초기 모드 설정 (light 또는 dark)
    const theme = createTheme({
        palette: {
            mode: mode,
            primary: {
                main: mode === "dark" ? "#FFF" : "rgba(0, 0, 0, 0.54)"
            }
        },
    });
    const colorMode = React.useMemo(
        () => ({
            toggleBootTheme: () => {
                setMode((prevMode) => (prevMode === BootThemeType.LIGHT ? BootThemeType.DARK : BootThemeType.LIGHT));
            },
            bootTheme: mode,
            theme: theme,
        }),
        [mode],
    );

    return (
        <QueryClientProvider client={queryClient}>
            <RecoilRoot>
                <ThemeContext.Provider value={colorMode}>
                    <ThemeProvider theme={theme}>
                        <Router>
                            <Routes>
                                {routeList}
                            </Routes>
                        </Router>
                    </ThemeProvider>
                </ThemeContext.Provider>
            </RecoilRoot>
        </QueryClientProvider>
    )
}
export enum BootThemeType {
    LIGHT = 'light',
    DARK = 'dark',
}
const DEFAULT_THEME = BootThemeType.LIGHT
const ThemeContext = createContext({ toggleBootTheme: () => { }, bootTheme: DEFAULT_THEME, theme: createTheme() });
export const useBootTheme = () => {
    return useContext(ThemeContext);
};
