import { User } from '../../models/user.model';

export interface LoginState {
  user: User;
  authenticated: boolean;
  isLoading?: boolean;
  loaded?: boolean;
  error?: any;
}

export const initialState: LoginState = {
  user: { emno: '', login: '', password: '', name: '', token: '' },
  isLoading: false,
  loaded: false,
  authenticated: false
};
