import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const repeatPassword = control.get('repeat-password')?.value;

  if (password === repeatPassword) {
    return null;
  } else {
    return { passwordMismatch: true };
  }
}