export function Page(pageUrl: string) {
    return function (target: any) {
        console.log(`${pageUrl} - 클래스명: ${target.name}`);
        return target;
    };
}