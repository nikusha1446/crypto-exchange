import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { passwordMatchValidator } from '../../register/validators/password.validator';
import { UserService } from 'src/app/shared/services/user.service';
import { Alert } from 'src/app/shared/interfaces/alert';

@Component({
  standalone: true,
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit, OnDestroy {
  private subscription: Subscription | undefined;
  private subscription2: Subscription | undefined;
  private subscription3: Subscription | undefined;
  alert: Alert | null = null;
  activeSection: string = 'details';
  settingsForm!: FormGroup;
  passwordForm!: FormGroup;
  edittingUser: User | null = null;

  constructor(private authService: AuthService,
    private userService: UserService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscription = this.authService.getCurrentUserObservable().subscribe({
      next: user => {
        this.edittingUser = user;
        
        this.settingsForm = new FormGroup({
          'avatar': new FormControl(this.edittingUser?.avatar, Validators.required),
          'username': new FormControl(this.edittingUser?.username, [Validators.required, Validators.minLength(4)]),
          'email': new FormControl(this.edittingUser?.email, [Validators.required, Validators.email])
        });

        this.passwordForm = new FormGroup({
          'password': new FormControl(null, [Validators.required, Validators.minLength(4)]),
          'repeat-password': new FormControl(null, Validators.required),
          'old-password': new FormControl(null, Validators.required),
        },{
          validators: passwordMatchValidator
        });
      },
      error: error => {
        console.error(error);
      }
    });
  }

  onSubmit() {
      const data = {
        username: this.settingsForm.value.username,
        email: this.settingsForm.value.email,
        avatar: this.settingsForm.value.avatar
      }

      const userId = this.authService.getCurrentUser()?.id;
  
      this.subscription2 = this.userService.changeUserFields(userId, data).subscribe({
        next: data => {
          const user = data as User;
          this.authService.setCurrentUser(user)
          this.alert = {
            message: 'Your account was successfully updated',
            status: 'success'
          }
          this.cdr.detectChanges();
        },
        error: error => {
          this.alert = {
            message: `${error}`,
            status: 'error'
          }
          this.cdr.detectChanges();
        }
      });

  }

  onPasswordChange() {
    if(this.passwordForm.value['old-password'] === this.edittingUser?.password) {
      const data = {
        password: this.passwordForm.value.password
      }
      const userId = this.authService.getCurrentUser()?.id;


      this.subscription3 = this.userService.changeUserFields(userId, data).subscribe({
        next: data => {
          const user = data as User;
          this.authService.setCurrentUser(user)
          this.alert = {
            message: 'Your password was successfully updated',
            status: 'success'
          }
          this.cdr.detectChanges();
        },
        error: error => {
          this.alert = {
            message: `${error}`,
            status: 'error'
          }
          this.cdr.detectChanges();
        }
      });
    } else {
      this.alert = {
        message: 'Password is incorrect!',
        status: 'error'
      }
    }
  }

  closeError() {
    this.alert = null;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
    this.subscription2?.unsubscribe()
    this.subscription3?.unsubscribe()
  }

}
