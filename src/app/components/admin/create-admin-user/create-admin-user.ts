import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../../services/api-service';
import { DialogService } from '../../../services/dialog-service';
import { AdminRegistration } from '../../../models/admin-registration';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-admin-user',
  imports: [ReactiveFormsModule],
  templateUrl: './create-admin-user.html',
})
export class CreateAdminUser implements OnInit {
  adminRegistrationForm!: FormGroup;
  body!: AdminRegistration;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogService: DialogService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.adminRegistrationForm = this.fb.group(
      {
        adminName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-Z ]+$/), // only letters & spaces
            this.noWhitespaceValidator,
          ],
        ],

        adminEmail: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.maxLength(100),
            this.noWhitespaceValidator,
          ],
        ],

        createPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/),
          ],
        ],

        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }
  noWhitespaceValidator(control: AbstractControl) {
    if (control.value && control.value.trim().length === 0) {
      return { whitespace: true };
    }
    return null;
  }
  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('createPassword')?.value;
    const confirm = form.get('confirmPassword');

    if (!confirm) return null;

    if (password !== confirm.value) {
      confirm.setErrors({
        ...confirm.errors,
        passwordMismatch: true,
      });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit() {
    if (this.adminRegistrationForm.invalid) {
      this.adminRegistrationForm.markAllAsTouched();
      this.dialogService.openDialog({
        dialogType: 'Error',
        title: 'Form Error!',
        message: 'Please correct the errors in the form before submitting.',
        buttons: ['OK'],
        actions: [() => {}],
      });
      return;
    }
    const formData = this.adminRegistrationForm.getRawValue();
    this.body = {
      name: formData.adminName.trim(),
      email: formData.adminEmail.trim(),
      password: formData.createPassword,
    };
    this.apiService.post<AdminRegistration>('api/admin/registrations/save', this.body).subscribe({
      next: (response) => {
        this.dialogService.openDialog({
          dialogType: 'Success',
          title: 'Admin Registration Successful!',
          message: 'New Admin User Created successfully.',
          buttons: ['OK'],
          actions: [
            () => {
              this.adminRegistrationForm.reset();
            },
          ],
        });
      },
      error: (error) => {
        console.error('Admin Registration failed:', error);
        this.dialogService.openDialog({
          dialogType: 'Error',
          title: 'Admin Registration Failed!',
          message: 'There was an error submitting your registration. Please try again later.',
          buttons: ['OK'],
          actions: [() => {}],
        });
      },
    });
  }
  redirect(route: string) {
    this.router.navigate([route]);
  }
}
