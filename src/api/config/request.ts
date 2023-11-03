import type { Fly } from 'flyio';
import Flyio from 'flyio/dist/npm/wx';

import type { IOptions } from './method';

export interface IConfig {
  baseURL: string;
}

type TMethod = 'post' | 'delete' | 'get' | 'put' | 'request';

export default class FlyRequest {
  protected http: Fly;
  newHttp: Fly;

  get!: <T>(url: string, data?: object, option?: object & IOptions) => Promise<T>;
  post!: <T>(url: string, data?: object, option?: object & IOptions) => Promise<T>;
  put!: <T>(url: string, data?: object, option?: object & IOptions) => Promise<T>;
  delete!: <T>(url: string, data?: object, option?: object & IOptions) => Promise<T>;
  request!: <T>(url: string, data?: object, config?: object & IOptions) => Promise<IApiResponseData<T>>;

  constructor(config: IConfig, options?: IOptions) {
    this.http = new Flyio();
    this.newHttp = new Flyio();
    Object.assign(
      this.http.config,
      config,
      { headers: { 'content-type': 'application/json' } },
    );

    (['post', 'delete', 'get', 'put', 'request'] as TMethod[]).forEach((item) => {
      this[item] = <T>(url: string, data?: object, option?: object & IOptions) => {
        return this.http[item](url, data, { ...options, ...option }) as unknown as Promise<T>;
      };
    });
  }
}

