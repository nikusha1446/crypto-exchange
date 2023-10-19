import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
    private cdr: ChangeDetectorRef,
    private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUserObservable().subscribe(user => {
      this.loggedUser = user;
      this.cdr.detectChanges();
    });
  }

  onLogout() {
    this.authService.logoutUser();
    this.router.navigate(['/login']);
  }

  checkLoggedUser() {
    console.log(this.loggedUser);
  }

}
