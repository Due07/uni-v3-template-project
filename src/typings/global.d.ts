import { TConfig } from '@/common/config';
import uViewPlus from 'uview-plus';

declare global {
  interface Uni extends TConfig {
    $u: typeof uViewPlus
  }

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
