import 'reflect-metadata';


class TestAAAA extends Test2 {
    property = 'property';

}



@page2("/test")
@page("/tes2t")
@page("/te3st", [1, 2], ["tes", ["df"]])
class Test extends TestAAAA {

    @Uppercase
    name?: string;

    property3 = 'property';


    // @page2("/testaaa2a")
    test = (str: any) => str

    test2 = (str: any) => str

    @page2({value: "", callback: (a, b) => a + "2"})
    test3(): string {
        return 'test';
    }

    @page3({value: "", callback: (a, b) => a + "2"})
    test33(): string {
        return 'test';
    }

}

function page(pageUrl: string) {
    return function (target: any) {
        console.log(`${pageUrl} - 클래스명: ${target.name}`);
        return target;
    };
}

function page2(option: { value: string, callback: (x: any, y: any) => any }) {
    return function (target: any, key: string) {
        // 기존 프로퍼티 값을 저장하기 위한 변수
        let value = target[key];

        // 새로운 getter 함수 정의
        const getter = function () {
            console.log(`Getting value of ${key}: ${value}`);
            return value;
        };

        // 새로운 setter 함수 정의
        const setter = function (newValue: any) {
            console.log(`Setting value of ${key} to: ${newValue}`);
            value = newValue;
        };

        // 프로퍼티의 getter와 setter를 재정의
        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        });
    }
}


function page3(option: { value: string, callback: (x: any, y: any) => any }) {
    return function logMethod(target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            console.log(`Calling method ${key} with arguments:`, args);
            const result = originalMethod.apply(this, args);
            console.log(`Method ${key} returned:`, result);
            return result;
        };

        return descriptor;
    }
}
