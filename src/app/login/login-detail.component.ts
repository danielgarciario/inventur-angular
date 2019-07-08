import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';

import { User } from './../models/user.model';

@Component({
  selector: 'app-logindetail-ui',
  templateUrl: './login-detail.component.html',
  styleUrls: ['./login-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginDetailComponent {
  @Input() user: User;
  @Output() logout: EventEmitter<void> = new EventEmitter();
}
