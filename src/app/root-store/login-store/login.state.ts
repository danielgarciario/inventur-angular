import { User } from '../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';

// import * as fromRoot from '../root-store.state';

export interface LoginState {
  user: User;
  authenticated: boolean;
  isLoading: boolean;
}

export const initialLoginState: LoginState = {
  user: { emno: '', login: '', password: '', name: '', token: '' },
  isLoading: false,
  authenticated: false
};
