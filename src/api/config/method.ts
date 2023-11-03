import type { FlyError, FlyRequestConfig, FlyResponse } from 'flyio';
import FlyRequest, { type IConfig } from './request';
import jsConfig from '@/common/config';
import { useUserStore } from '@/store/state/user';
import { postRefreshTokenUrl } from '@/config';

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

  /** 十分钟时间戳 */
  #tenMinutes = 10 * 60 * 1000;

  /** 401 失败重新使用次数 超过一次 删除 */
  #errorMap = new Map([]);

  constructor(config: IConfig, options?:IOptions) {
    super(config, options);

    this.http.interceptors.request.use(async (requestConfig: FlyRequestConfig & IOptions) => {
      if (jsConfig.$isEnv('production')) console.log('request', requestConfig);

      // token
      const token = this.userStore.getToken;
      if (token) {
        const expirationTime = this.userStore.expirationTime as string;
        if (+(new Date()) - +expirationTime < this.#tenMinutes) {
          // 锁定
          this.http.lock();
          await this.refreshToken().finally(() => this.http.unlock());
        }

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
      async <T>(responseConfig: FlyResponse<IApiResponseData<T>> & { request: IOptions }) => {
        if (jsConfig.$isEnv('production')) console.log('response', responseConfig);

        const { data, request } = responseConfig;

        if (request.loading) uni.hideLoading();

        switch (data.code) {
        case 200:
          return Promise.resolve(data);
        case 401: {
          const reuqestUrl = (request.baseURL ?? '') + request.url;
          if (
            !this.#errorMap.get(request.baseURL)
            && this.userStore.token
            && reuqestUrl !== postRefreshTokenUrl
          ) {
            this.#errorMap.set(request.baseURL, true);
            this.http.lock();
            // 重试操作
            await this.refreshToken().finally(() => this.http.unlock());
            // 待验证
            return this.request(request.url as string, request.body, request);
          } else {
            this.#errorMap.delete(request.baseURL);
          }

          // 清除用户状态
          this.userStore.setToken({});
          this.userStore.setUserInfo({});

          if (!request.hideErrorToast) {
            uni.showToast({
              title: data?.msg ?? '登陆状态已失效, 请重新登录',
              icon: 'none',
              duration: 2000
            });
          }
          break;
        }
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

  /** 刷新静默token */
  async refreshToken () {
    const loading = uni.$loading('加载中...', true);
    await this.newHttp.post<IApiResponseData<string>>(
      postRefreshTokenUrl,
      { token: this.userStore.refreshToken }
    ).then((res) => {
      console.log('token 重新获取', res);
      if (res.data.code === 200) {
        this.userStore.setToken(JSON.parse(res.data.data));
      } else {
        Promise.reject(res.data);
      }
    }).catch((error) => {
      // 上报日志
      this.logManager && this.logManager.error(
        'requestApi: 刷新token error ',
        `时间: ${new Date().toLocaleString()}`,
        error
      );
      console.warn('刷新token 出错!', error);
      Promise.reject(error);
    }).finally(() => loading());
  }
}
