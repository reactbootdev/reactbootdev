export function page(pageUrl: string) {
    return function (target: any) {
        console.debug(`${pageUrl} > Class Name > ${target.name}`);
        return target;
    };
}