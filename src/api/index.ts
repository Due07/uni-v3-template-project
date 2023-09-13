import { API_HOST } from '@/config';
import HttpMethod from './config/method';

export default abstract class {
  defaultHttp = new HttpMethod({baseURL: API_HOST}, {loading: true, showMask: true});

  /** 静默api 不显示 loading */
  silentHttp = new HttpMethod({baseURL: API_HOST}, {loading: false});
  // biHttp = new HttpMethod({baseURL: 'xxxx'});
}
