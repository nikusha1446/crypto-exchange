import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { passwordMatchValidator } from './validators/password.validator';

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

  constructor() {
    this.registerForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(4)]),
      'repeat-password': new FormControl(null),
    },{
      validators: passwordMatchValidator
    });
  }

  onRegister() {
    console.log(this.registerForm);
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;
    console.log(email, password);
  }
}
