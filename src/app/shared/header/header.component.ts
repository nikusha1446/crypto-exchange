import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  loggedUser: User | null = null;

  constructor(private authService: AuthService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.authService.getCurrentUserObservable().subscribe(user => {
      this.loggedUser = user;
      this.cdr.detectChanges();
    });
  }

  checkLoggedUser() {
    console.log(this.loggedUser);
  }

}
