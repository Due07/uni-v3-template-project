export interface IUserState {
  loginCode?: string,
  token?: string,
  userInfo?: Record<string, T>,
  phone?: number | string,
}
