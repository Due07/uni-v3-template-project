/** 系统数据 */
import { defineStore } from 'pinia';
import type { IPrivacyState } from '../types/privacy';
import { judgmentType } from '@/common/base';

export const usePrivacyStore = defineStore({
  id: 'privacy',
  state: (): IPrivacyState => ({
    needAuthorization: false,
    privacyContractName: '',
  }),
  getters: {
    /** 是否需要同意协议 */
    getNeedAuthorization: (state) => state.needAuthorization,
    getPrivacyContractName: (state) => state.privacyContractName,
  },
  actions: {
    /** 获取用户隐私配置 */
    getPrivacySetting () {
      return new Promise<IPrivacyState | void>((resolve) => {
        /** 如果getPrivacySetting没有, 查看 pages.json 中的miniprogram-api-typings 版本 */
        if (Reflect.has(wx, 'getPrivacySetting') && judgmentType(wx.getPrivacySetting, 'Function')) {
          wx.getPrivacySetting({
            success: (res) => {
              console.log('同意隐私协议', res);
              const { needAuthorization, privacyContractName } = res;
              this.needAuthorization = needAuthorization;
              this.privacyContractName = privacyContractName;
              resolve({ needAuthorization, privacyContractName });
            },
            fail: (rej) => {
              console.log(rej);
              resolve();
            },
          });
        } else {
          console.log('版本库低于2.32.3, 无需提醒');
          resolve();
        }
      });

    }
  },
});
