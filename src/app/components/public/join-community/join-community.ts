import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Registration } from '../../../models/registration';
import { ApiService } from '../../../services/api-service';
import { DialogService } from '../../../services/dialog-service';
import { Router } from '@angular/router';
import { StarRating } from '../../../common-components/shared/star-rating/star-rating';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-join-community',
  imports: [ReactiveFormsModule, StarRating, MatProgressBarModule,CommonModule],
  templateUrl: './join-community.html',
  styleUrl: './join-community.css',
})
export class JoinCommunity {
  registrationForm!: FormGroup;
  body!: Registration;
  isMenuOpen: boolean = false;
  loading = false;
  productRating = 3;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogService: DialogService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],

      gender: ['', Validators.required],
      dob: ['', Validators.required],
      age: [{ value: '', disabled: true }],

      maritalStatus: [''],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      alternateMobile: ['',[Validators.pattern('^[0-9]{10}$')]],

      email: ['', [Validators.required, Validators.email]],
      aadhaar: ['', [Validators.pattern('^[0-9]{12}$')]],
      subCaste: [''],

      fatherName: [''],
      fatherOccupation: [''],
      motherName: [''],
      motherOccupation: [''],

      houseNo: [''],
      street: [''],
      city: [''],
      mandal: [''],
      taluka: [''],
      village: [''],
      villageGroup: [''],

      qualification: [''],
      course: [''],
    });
  }

  calculateAge(): void {
    const dob = this.registrationForm.get('dob')?.value;
    if (!dob) return;

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    this.registrationForm.patchValue({ age });
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      this.dialogService.openDialog({
        dialogType: 'Error',
        title: 'Form Error!',
        message: 'Please correct the errors in the form before submitting.',
        buttons: ['OK'],
        actions: [() => {}],
      });
      return;
    }
    this.body = this.registrationForm.getRawValue();
    this.apiService.post<Registration>('api/register', this.body).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.dialogService.openDialog({
          dialogType: 'Success',
          title: 'Registration Successful!',
          message: 'Your registration has been completed successfully.',
          buttons: ['OK'],
          actions: [() => {}],
        });
        this.registrationForm.reset();
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.dialogService.openDialog({
          dialogType: 'Error',
          title: 'Registration Failed!',
          message: 'There was an error submitting your registration. Please try again later.',
          buttons: ['OK'],
          actions: [() => {}],
        });
      },
    });
  }
  openDialog(): void {}
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  redirect(route: string, fragment: string = '') {
    this.isMenuOpen = false;
    this.router.navigate([route], { fragment: fragment });
  }
  submitRating() {
    this.loading = true;
    this.apiService.post<any>('api/submitrating', { rating: this.productRating }).subscribe({
      next: (res) => {
        console.log('Rating submitted:', res);
        this.loading = false;
        this.dialogService.openDialog({
          dialogType: 'Success',
          title: 'Rating Submitted!',
          message: 'Your rating has been submitted successfully.',
          buttons: ['OK'],
          actions: [() => {}],
        });
      },
      error: () => {
        this.loading = false;
        this.dialogService.openDialog({
          dialogType: 'Error',
          title: 'Failed to Submit Rating!',
          message: 'Failed to submit rating. Please try again.',
          buttons: ['OK'],
          actions: [() => {}],
        });
      },
    });
  }
}
