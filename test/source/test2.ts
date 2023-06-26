// Write 데코레이터 팩토리
function write(able:boolean = true) {
  // Write 데코레이터
  return function(t:any,p:string,d:PropertyDescriptor) {
    d.writable = able;
  }
}


function readonly(writable: boolean) {
  return function (target: any, decoratedPropertyName: any): any {
    return {
      writable: !writable,
    };
  };
}

@readonly(false)
// @write(false)
class Test2 {
  property = 'property';

  @readonly(false)
  public data1 = 0;

  @readonly(true)
  public data2 = "0";
}

const t = new Test();
t.data1 = 1000;
t.data2 = 1000; // 런타임 에러 !! - data2는 writable이 false라서 값을 대입할 수가 없다.