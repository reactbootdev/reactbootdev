export function page(pageUrl: string) {
    return function (target: any) {
        console.debug(`URL | Class Name > '${pageUrl}' | '${target.name}'`);
        return target;
    };
}