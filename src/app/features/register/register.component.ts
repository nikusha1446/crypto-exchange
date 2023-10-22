import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { passwordMatchValidator } from './validators/password.validator';
import { AuthService } from 'src/app/core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [RouterModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnDestroy {
  private subscription: Subscription | undefined;
  registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router) {
    this.registerForm = new FormGroup({
      'username': new FormControl(null, [Validators.required, Validators.minLength(4)]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(4)]),
      'repeat-password': new FormControl(null),
    },{
      validators: passwordMatchValidator
    });
  }

  onRegister() {
    const username = this.registerForm.get('username')?.value;
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;
    this.subscription = this.authService.registerUser(username, email, password).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
