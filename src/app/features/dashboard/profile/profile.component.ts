import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  loggedUserName: string | undefined = '';

  constructor(private authService: AuthService) {
    this.loggedUserName = this.authService.getCurrentUser()?.username
  }

}
