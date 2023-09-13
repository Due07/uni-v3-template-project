/** 用户信息 */
import { defineStore } from 'pinia';
import type { IUserState } from '../types/user';

export const useUserStore = defineStore({
  id: 'user',
  state: (): IUserState => ({
    loginCode: undefined,
    token: undefined,
    userInfo: undefined,
    phone: undefined,
  }),
  getters: {
    getToken: (state) => state.token,
    getUserInfo: (state) => state.userInfo,
  },
  actions: {
    /** loginCode 微信用户code */
    setLoginCode (value: string) {
      this.loginCode = value;
    },
    /** 获取用户信息 */
    setUserInfo <T>(user: Record<string, T>) {
      this.userInfo = user;
      // this.token = user.token;
      // this.phone = user.phone;
    },
    setToken (value: string) {
      this.token = value;
    }
  },
  persist: { key: 'dzz-user-info' }
});
