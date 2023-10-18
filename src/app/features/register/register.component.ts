import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { passwordMatchValidator } from './validators/password.validator';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [RouterModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private authService: AuthService) {
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
    this.authService.registerUser(username, email, password).subscribe();
  }
}
