import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Registration } from '../../../models/registration';
import { ApiService } from '../../../services/api-service';
import { DialogService } from '../../../services/dialog-service';
import { Router } from '@angular/router';
import { StarRating } from '../../../common-components/shared/star-rating/star-rating';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-join-community',
  imports: [
    ReactiveFormsModule,
    StarRating,
    MatProgressBarModule,
    CommonModule,
    MatIcon,
    MatFormFieldModule,
  ],
  templateUrl: './join-community.html',
  styleUrl: './join-community.css',
})
export class JoinCommunity {
  registrationForm!: FormGroup;
  body!: Registration;
  isMenuOpen: boolean = false;
  loading = false;
  productRating = 3;
  selectedDocument!: File | null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogService: DialogService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],

      gender: ['', Validators.required],
      dob: ['', Validators.required],
      age: [{ value: '', disabled: true }],

      maritalStatus: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      alternateMobile: ['', [Validators.pattern('^[0-9]{10}$')]],

      email: ['', [Validators.required, Validators.email]],
      aadhaar: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      subCaste: ['', Validators.required],
      rationCardNo: ['', Validators.required],

      fatherName: ['', Validators.required],
      fatherOccupation: ['', Validators.required],
      motherName: ['', Validators.required],
      motherOccupation: ['', Validators.required],

      houseNo: ['', Validators.required],
      spouseName: ['', Validators.required],
      spouseOccupation: ['', Validators.required],
      numberOfChildren: ['', Validators.required],
      childrenNames: ['', Validators.required],

      street: ['', Validators.required],
      city: ['', Validators.required],
      mandal: ['', Validators.required],
      taluka: ['', Validators.required],
      village: ['', Validators.required],
      villageGroup: ['', Validators.required],

      qualification: ['', Validators.required],
      course: ['', Validators.required],
      jobDescription: ['', Validators.required],
      documentFile: [null],
    });
  }
  documentPreviewUrl!: string | null;

  onDocumentSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedDocument = file;

      // create preview URL
      this.documentPreviewUrl = URL.createObjectURL(file);
    }
  }

  openDocument() {
    if (this.documentPreviewUrl) {
      window.open(this.documentPreviewUrl, '_blank');
    }
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
      const errorMessage = this.getFormValidationErrors();
      this.dialogService.openDialog({
        dialogType: 'Error',
        title: 'Form Error!',
        message: errorMessage || 'Please correct the errors in the form before submitting.',
        buttons: ['OK'],
        actions: [() => {}],
      });
      return;
    }
    const formData = new FormData();

    const rawValue = this.registrationForm.getRawValue();

    Object.keys(rawValue).forEach((key) => {
      if (rawValue[key] !== null && rawValue[key] !== undefined) {
        formData.append(key, rawValue[key]);
      }
    });

    if (this.selectedDocument) {
      formData.append('document', this.selectedDocument);
    }

    console.log('FormData content:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    this.apiService.post<Registration>('api/register', formData).subscribe({
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
        this.selectedDocument = null;
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
  private getFormValidationErrors(): string {
    const messages: string[] = [];
    Object.keys(this.registrationForm.controls).forEach((key) => {
      const control = this.registrationForm.get(key);

      if (control && control.invalid && control.touched) {
        if (control.errors?.['required']) {
          messages.push(`${this.getFieldLabel(key)} is required.`);
        }

        if (control.errors?.['email']) {
          messages.push(`Please enter a valid email address.`);
        }

        if (control.errors?.['pattern']) {
          if (key === 'mobile' || key === 'alternateMobile') {
            messages.push(`Mobile number must be 10 digits.`);
          }

          if (key === 'aadhaar') {
            messages.push(`Aadhaar number must be 12 digits.`);
          }
        }
      }
    });

    return messages.join('\n');
  }
  private getFieldLabel(controlName: string): string {
    const labels: any = {
      firstName: 'First Name',
      middleName: 'Middle Name',
      lastName: 'Last Name',
      gender: 'Gender',
      dob: 'Date of Birth',
      maritalStatus: 'Marital Status',
      mobile: 'Mobile Number',
      alternateMobile: 'Alternate Mobile',
      email: 'Email',
      aadhaar: 'Aadhaar Number',
      subCaste: 'Sub Caste',
      rationCardNo: 'Ration Card Number',
      fatherName: 'Father Name',
      fatherOccupation: 'Father Occupation',
      motherName: 'Mother Name',
      motherOccupation: 'Mother Occupation',
      houseNo: 'House Number',
      spouseName: 'Spouse Name',
      spouseOccupation: 'Spouse Occupation',
      numberOfChildren: 'Number of Children',
      childrenNames: 'Children Names',
      street: 'Street',
      city: 'City',
      mandal: 'Mandal',
      taluka: 'Taluka',
      village: 'Village',
      villageGroup: 'Village Group',
      qualification: 'Qualification',
      course: 'Course',
      jobDescription: 'Job Description',
    };

    return labels[controlName] || controlName;
  }
}
