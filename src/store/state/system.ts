/** 系统数据 */
import { defineStore } from 'pinia';
import type { ISystemState } from '../types/system';

export const useSystemStore = defineStore({
  id: 'system',
  state: (): ISystemState => ({
    statusBarHeight: 0,
    systemName: '',
  }),
  actions: {
    /** 存储系统配置刘海高度 */
    setStatusBarHeight() {
      const { statusBarHeight } = wx.getSystemInfoSync();
      this.statusBarHeight = statusBarHeight;
    },
    /** 存储系统设备名称 */
    setSystemInfo (value: string) {
      this.systemName = value;
    },
  },
  persist: { key: 'dzz-system' }
});
