/**
 * 全局配置 挂载在Vue
 */

import { judgmentType } from './base';
import { useSystemStore } from '@/store/state/system';
import { useUserStore } from '@/store/state/user';

/** 打印日志, production 不打印 */
const $log = (...args: unknown[]) => {
  if (import.meta.env.MODE === 'development') {
    console.log('%c LOG ', 'background: #aaa; color: #bada55', ...args);
  }
};
/** 打印日志, production 不打印 */
console.$log = $log;

/**
 * 订阅消息
 * @param {Array} idList - 订阅的id 数组
 */
export const $requestSubscribe = async function <T extends string>(idList: T[]) {
  return new Promise((resolve, reject) => {
    uni.requestSubscribeMessage({
      tmplIds: idList,
      complete: e => {
        resolve('complete');
        $log(e);
      },
      fail: e => {
        if (
          e.errMsg ==
          'requestSubscribeMessage:fail 开发者工具暂时不支持此 API 调试，请使用真机进行开发'
        ) {
          console.log(e);
        } else {
          $alert(e.errMsg);
        }
        // resolve('fail');
        reject(e);
      },
      success: async (e) => {
        resolve(e);
      }
    });
  });
};

type TOptionsIcon = 'success' | 'loading' | 'none' | 'error' | 'fail' | 'exception';
/**
 *  弹窗提示
 * @param {String} text - 文本
 * @param {Number} duration - 延长时间
 * @param {String} success - 状态 **{ 'success'|'loading'|'none' }**
 *
 */
export const $alert = (text: string, duration: number = 3000, success: TOptionsIcon = 'none', opt = {}) => {
  if (judgmentType(text, 'String')) {
    const test = '[\u4e00-\u9fa5]{8}';
    const math = (RegExp(test, 'gm').exec(text) ?? [])[0];
    // console.log(text, test);
    if (math && (math.length > 7)) console.warn('文本最多显示 7 个汉字长度~');
  }

  const defOpt = {
    title: text,
    duration,
    icon: ['success', 'loading'].includes(success) ? success : 'none',
  };

  uni.showToast({ ...defOpt, ...opt });
};
/**
 * 加载事件
 * @param { String } text - 文案
 * @param { Boolean } mask - 是否禁止穿透
 * @returns { Function } - 返回关闭事件
 */
export const $loading = (text: string = '加载中', mask: boolean = true): Function => {
  uni.showLoading({
    title: text,
    mask,
  });
  return uni.hideLoading;
};

/**
 * 获取登录code
 * @param { Function } fun - 获取成功后执行的函数
 * @returns { Promise }
 */
export const $login = async (fun?: Function): Promise<void> => {
  return new Promise<void>((resolve) => {
    uni.login({
      success(e) {
        // 使用 code 换取 openid、unionid、session_key 等信息
        console.log(e, e.code);

        const userStore = useUserStore();
        userStore.setLoginCode(e.code ?? '');

        if (judgmentType(fun, 'Function')) (fun as Function)();
        resolve();
      },
      fail(e) {
        console.warn('获取登录凭证失败', e);
        // if (judgmentType(fun, 'Function')) fun();
      },
      complete() {
        resolve();
      }
    });
  });
};

/**
 * 验证微信登录状态
 * @returns { Promise }
 */
export const $checkSession = function (): Promise<void> {
  return new Promise<void>((resolve) => {
    uni.checkSession({
      success: async (e) => {
        console.log(e);
        // if (process.env.NODE_ENV === 'development') {
        //   await $login(reslove);
        // }
        resolve();
      },
      fail: async (e) => {
        console.warn(e);
        // 失效重新获取
        await $login(resolve);
      },
    });
  });
};

/* 获取设备信息 ios / android / pc **/
export const $systemInfo = function () {
  const systemInfo = uni.getSystemInfoSync();

  const systemStore = useSystemStore();
  systemStore.setSystemInfo(systemInfo.osName ?? '');
  return systemInfo.osName;
};

/**
 * 环境判断
 * @param {String} value - 环境 ** {'development' | 'production'} **
 * @returns {Boolean}
 */
export const $isEnv = function (value: 'development' | 'production'): boolean {
  return import.meta.env.MODE === value;
};

const defaultConfig = {
  $requestSubscribe,
  $loading,
  $log,
  $alert,
  $checkSession,
  $login,
  $systemInfo,
  $isEnv,
};

export default defaultConfig;

// export type TConfig = typeof defaultConfig;
export type TConfig = {
  /**
   * 订阅消息
   * @param {Array} idList - 订阅的id 数组
   */
  $requestSubscribe: typeof $requestSubscribe;
  /**
   * 加载事件
   * @param { String } text - 文案
   * @param { Boolean } mask - 是否禁止穿透
   * @returns { Function } - 返回关闭事件
   */
  $loading: typeof $loading;
  /** 打印日志, production 不打印 */
  $log: typeof $log;
  /**
   *  弹窗提示
   * @param {String} text - 文本
   * @param {Number} duration - 延长时间
   * @param {String} success - 状态 **{ 'success'|'loading'|'none' }**
   *
   */
  $alert: typeof $alert;
  /**
   * 验证微信登录状态
   * @returns { Promise }
   */
  $checkSession: typeof $checkSession;
  /**
   * 获取登录code
   * @param { Function } fun - 获取成功后执行的函数
   * @returns { Promise }
   */
  $login: typeof $login;
  /* 获取设备信息 ios / android / pc **/
  $systemInfo: typeof $systemInfo;
  /**
   * 环境判断
   * @param {String} value - 环境 ** {'development' | 'production'} **
   * @returns {Boolean}
   */
  $isEnv: typeof $isEnv;
}
