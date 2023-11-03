export interface ILoginToken {
  accessToken: string;
  /** 刷新token */
  refreshToken: string;
  expirationTime: string;
}
export interface IUserState {
  loginCode?: string,
  token?: string,
  expirationTime?: string;
  refreshToken?: string,
  userInfo?: Record<string, T>,
  phone?: number | string,
}
