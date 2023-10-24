import "reflect-metadata";

export function entity(target: any) {
    const symbol = getSymbolForEntity(target);
    Reflect.defineMetadata(symbol, true, target);
    console.debug('@entity > ', target);
}


export function getSymbolForEntity(cls: any): symbol {
    const className = cls.name;
    const nativeCode = cls.toString();
    const hash = generateHash(nativeCode);
    return Symbol.for(`SYMBOL_${className}_${hash}`);
}

function simpleHash(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function toBase62(num: number) {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = '';
    while (num > 0) {
        result = chars[num % 62] + result;
        num = Math.floor(num / 62);
    }
    return result.padStart(10, '0');
}

function generateHash(input: string) {
    const hashedValue = simpleHash(input);
    return toBase62(hashedValue);
}