import { LoginStoreState } from './login-store';
import { SessionsStoreState } from './sessions-store';

export interface Estado {
  login: LoginStoreState.LoginState;
  session: SessionsStoreState.Estado;
}
