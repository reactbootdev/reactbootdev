// member property decorator function
export function column(param: { group: string }) {
    return function (target: any, propertyKey: string) {
        console.debug('Property:', target, propertyKey, param);
    }
}