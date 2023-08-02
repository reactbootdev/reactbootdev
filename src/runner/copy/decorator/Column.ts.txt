// member property decorator function
export function column(param: { group: string }) {
    return function (target: any, propertyKey: string) {
        console.log('Property:', target, propertyKey, param);
    }
}