import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [RouterModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnDestroy {
  private subscription: Subscription | undefined;
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router
    ) {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required)
    });
  }

  onLogin() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    this.subscription = this.authService.loginUser(email, password).subscribe(() => {
      this.router.navigate(['/dashboard/profile']);
    });
    
  }

  onCheck() {
    console.log(this.authService.getCurrentUser());
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
