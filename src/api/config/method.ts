import type { FlyError, FlyRequestConfig, FlyResponse } from 'flyio';
import FlyRequest, { type IConfig } from './request';
import jsConfig from '@/common/config';
// import store from '@/store';
import { useUserStore } from '@/store/state/user';

export interface IOptions {
  loading?: boolean,
  showMask?: boolean,
  hideErrorToast?: boolean;
  token?: boolean;
}

export default class extends FlyRequest {
  /** 监控日志 基础库 >= 2.7.1 */
  private logManager = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null;

  private userStore = useUserStore();

  constructor(config: IConfig, options?:IOptions) {
    super(config, options);

    this.http.interceptors.request.use((requestConfig: FlyRequestConfig & IOptions) => {
      if (jsConfig.$isEnv('production')) console.log('request', requestConfig);

      // token
      const token = this.userStore.getToken;
      if (token) {
        requestConfig.headers['Authorization'] = `Bearer ${token}`;
      }

      if (requestConfig.loading) {
        uni.showLoading({
          title: '加载中...',
          mask: requestConfig.showMask
        });
      }
      return requestConfig;
    });

    this.http.interceptors.response.use(
      <T>(responseConfig: FlyResponse<IApiResponseData<T>> & { request: IOptions }) => {
        if (jsConfig.$isEnv('production')) console.log('response', responseConfig);

        const { data, request } = responseConfig;

        if (request.loading) uni.hideLoading();

        switch (data.code) {
        case 200:
          return Promise.resolve(data);
        case 401:
          // 清除用户状态
          this.userStore.setToken('');
          this.userStore.setUserInfo({});
          // 上报日志
          this.logManager
          && this.logManager.warn(
            'requestApi: success(code: 401) ',
            `时间: ${new Date().toLocaleString()}`,
            responseConfig,
          );

          if (!request.hideErrorToast) {
            uni.showToast({
              title: data?.msg ?? '登陆状态已失效, 请重新登录',
              icon: 'none',
              duration: 2000
            });
          }
          break;
        default:
          // 上报日志
          this.logManager
          && this.logManager.warn(
            'requestApi: success ',
            `时间: ${new Date().toLocaleString()}`,
            responseConfig,
          );

          if (!request.hideErrorToast) {
            uni.showToast({
              title: data.msg ?? '',
              icon: 'none',
              duration: 2000
            });
          }
          break;
        }
        // catch
        return Promise.reject(data);
      },
      (error: any & FlyError & { request: IOptions }) => {
        // 上报日志
        this.logManager
          && this.logManager.error(
            'requestApi: error ',
            `时间: ${new Date().toLocaleString()}`,
            error
          );

        if (error.request.loading) uni.hideLoading();

        if (!error.request.hideErrorToast) {
          uni.showToast({
            title: error.message,
            icon: 'none',
            duration: 2000
          });
          return Promise.reject(error);
        }
      },
    );
  }
}
