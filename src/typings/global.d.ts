import { TConfig } from '@/common/config';

declare global {
  interface Uni extends TConfig {}

  /** console上添加属性 */
  interface Console {
    $log<T>(...args: T[]): void
  }

  interface IApiResponseData <T>{
    code: number,
    data: T,
    msg: string,
  }
}
