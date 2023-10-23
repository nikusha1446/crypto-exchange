import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { Alert } from 'src/app/shared/interfaces/alert';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnDestroy {
  private subscription: Subscription | undefined;
  alert: Alert | null = null;
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
    ) {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required)
    });
  }

  onLogin() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    this.subscription = this.authService.loginUser(email, password).subscribe(
      {
        next: () => {
          this.router.navigate(['/dashboard/profile']);
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
      }
    );
  }

  closeError() {
    this.alert = null;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
