import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { passwordMatchValidator } from './validators/password.validator';
import { AuthService } from 'src/app/core/services/auth.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Alert } from 'src/app/shared/interfaces/alert';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnDestroy {
  private subscription: Subscription | undefined;
  alert: Alert | null = null;
  registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef) {
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
    this.subscription = this.authService.registerUser(username, email, password).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 404) {
            this.alert = {
              message: 'HTTP 404 Error: The server endpoint was not found.',
              status: 'error'
            }

          } else {
            this.alert = {
              message: `HTTP 404 Error: The server endpoint was not found. ${error}`,
              status: 'error'
            }
          }
        } else {
          this.alert = {
            message: `${error}`,
            status: 'error'
          }
        }
        this.cdr.detectChanges();
      }
    })
  }

  closeError() {
    this.alert = null;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
