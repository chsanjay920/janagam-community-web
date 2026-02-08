import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api-service';
import { DialogService } from '../services/dialog-service';
import { LoginData, LoginResponse } from '../models/login-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html'
})
export class Login {
  login!: FormGroup;
  body!: LoginData;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogService: DialogService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.login = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  redirect(route: string) {
    this.router.navigate([route]);
  }
  onSubmit(): void {
    if (this.login.invalid) {
      this.login.markAllAsTouched();
      this.dialogService.openDialog({
        dialogType: 'Error',
        title: 'Invalid Credientials!',
        message: 'Please Enter valid email and password.',
        buttons: ['OK'],
        actions: [() => {}],
      });
      return;
    }
    this.body = this.login.getRawValue();
    this.apiService.post<LoginResponse>('api/admin/login', this.body).subscribe({
      next: (response) => {
        this.dialogService.openDialog({
          dialogType: 'Success',
          title: 'Login Successful!',
          message: 'You have been logged in successfully.',
          buttons: ['OK'],
          actions: [
            () => {
              this.login.reset();
              sessionStorage.setItem('authToken', response.token);
              sessionStorage.setItem('userData', JSON.stringify(response.data));
              this.redirect('admin/registrations');
            },
          ],
        });
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.dialogService.openDialog({
          dialogType: 'Error',
          title: 'Login Failed!',
          message: 'There was an error logging in. Please try again later.',
          buttons: ['OK'],
          actions: [() => {}],
        });
      },
    });
  }
}
