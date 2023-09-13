/** 基础方法 */

type TBasicType = 'String' | 'Number' | 'Boolean' | 'Function'
| 'Symbol' | 'BigInt' | 'Null' | 'Undefined' | 'Array' | 'Object';
/**
 * 判断类型
 * @param data 数据
 * @param type 判断类型
 * @returns { Boolean }
 */
export const judgmentType = <T>(data: T, type: TBasicType) => {
  const test = /^\[object +(\S*)+\]$/;
  const typeStr = Reflect.toString.call(data);
  const replaceStr = typeStr.replace(test, '$1');

  return type ? replaceStr === type : replaceStr;
};

/**
 * 防抖
 */
export function debounce(fun: Function, delay = 300) {
  let timeout: number;
  return function <T>(this: T, ...arg: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      Reflect.apply(fun, this, arg);
    }, delay);
  };
}

/**
 * 10进制转36进制
 */
function getNums36() {
  const nums36 = [];
  for (let i = 0; i < 36; i++) {
    if (i >= 0 && i <= 9) {
      nums36.push(i);
    } else {
      nums36.push(String.fromCharCode(i + 87));
    }
  }
  return nums36;
}

//十进制数转成36进制
export function scale36(n: number) {
  const arr = [];
  const nums36 = getNums36();
  while (n) {
    const res = n % 36;
    //作为下标，对应的36进制数，转换成
    arr.unshift(nums36[res]);
    //去掉个位
    n = parseInt(`${n / 36}`);
  }
  return arr.join('');
}
