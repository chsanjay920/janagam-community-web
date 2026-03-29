import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { aadhaarValidator } from '../../../validators/aadhaar-validators';
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
export class JoinCommunity implements OnInit {
  registrationForm!: FormGroup;
  body!: Registration;
  isMenuOpen: boolean = false;
  loading = false;
  productRating = 3;
  selectedDocument!: File | null;
  isVerifyButtonDisabled: boolean = true;
  isMobileVerified: boolean = false;

  presidentName!: string | undefined;
  generalSecretaryName!: string | undefined;

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
      mobileVerficationToken: ['', Validators.required],
      alternateMobile: ['', [Validators.pattern('^[0-9]{10}$')]],

      email: ['', [Validators.required, Validators.email]],
      aadhaar: ['', [Validators.required, aadhaarValidator()]],
      subCaste: ['', Validators.required],
      rationCardNo: ['', Validators.required],

      fatherName: ['', Validators.required],
      fatherOccupation: ['', Validators.required],
      fatherAadhaar: ['', [Validators.required, aadhaarValidator()]],
      motherName: ['', Validators.required],
      motherOccupation: ['', Validators.required],
      motherAadhaar: ['', [Validators.required, aadhaarValidator()]],

      houseNo: ['', Validators.required],
      spouseName: ['', Validators.required],
      spouseOccupation: ['', Validators.required],
      spouseAadhaar: ['', [Validators.required, aadhaarValidator()]],
      numberOfChildren: ['', Validators.required],
      children: this.fb.array([]),

      street: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', Validators.required],
      mandal: ['', Validators.required],
      village: ['', Validators.required],

      qualification: ['', Validators.required],
      course: ['', Validators.required],
      jobDescription: ['', Validators.required],
      documentFile: [null],
    });
    this.presidentName = sessionStorage.getItem('presidentName') || undefined;
    this.generalSecretaryName = sessionStorage.getItem('generalSecretaryName') || undefined;
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
  get children(): FormArray {
    return this.registrationForm.get('children') as FormArray;
  }
  generateChildrenFields() {
    const count = this.registrationForm.get('numberOfChildren')?.value || 0;

    const childrenArray = this.registrationForm.get('children') as FormArray;

    childrenArray.clear();

    for (let i = 0; i < count; i++) {
      childrenArray.push(
        this.fb.group({
          name: ['', Validators.required],
          qualification: ['', Validators.required],
          aadhaar: ['', [Validators.required, aadhaarValidator()]],
        }),
      );
    }
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
      if (key === 'children') {
        // Convert children array to JSON string
        formData.append('children', JSON.stringify(rawValue.children));
      } else if (rawValue[key] !== null && rawValue[key] !== undefined) {
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
        this.isMobileVerified = false;
        this.isVerifyButtonDisabled = false;
        this.registrationForm.get('mobile')?.enable();
        this.selectedDocument = null;
      },
      error: (error) => {
        console.error('Registration failed:', error);
        const apiMessage =
          error?.error?.message ||
          (typeof error?.error === 'string' ? error.error : null);
        this.dialogService.openDialog({
          dialogType: 'Error',
          title: 'Registration Failed!',
          message:
            apiMessage ||
            'There was an error submitting your registration. Please try again later.',
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
  requestVerification(MobileNumber: string) {
    this.loading = true;
    this.apiService.post<any>('api/mobileVerificationRequest', { mobileNumber: MobileNumber }).subscribe({
      next: (res) => {
        console.log('Verification requested:', res);
        this.loading = false;
        const dialogRef = this.dialogService.verificationDialog({
          mobile: MobileNumber,
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            console.log('Received from dialog:', result);
            const token = result.token;
            this.registrationForm.patchValue({ mobileVerficationToken: token });
            console.log('Token:', token);
            this.isMobileVerified = true;
            this.registrationForm.get('mobile')?.disable();
          }
        });
      },
      error: () => {
        this.loading = false;
        this.dialogService.openDialog({
          dialogType: 'Error',
          title: 'Failed to Submit Verification!',
          message: 'Failed to submit verification. Please try again.',
          buttons: ['OK'],
          actions: [() => {}],
        });
      },
    });
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
    this.appendControlErrors(this.registrationForm, '', messages);
    return [...new Set(messages)].join('\n');
  }

  private appendControlErrors(control: AbstractControl, path: string, messages: string[]): void {
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach((key) => {
        const child = control.get(key);
        if (child) {
          const nextPath = path ? `${path}.${key}` : key;
          this.appendControlErrors(child, nextPath, messages);
        }
      });
      return;
    }
    if (control instanceof FormArray) {
      control.controls.forEach((c, i) => {
        this.appendControlErrors(c, `${path}[${i}]`, messages);
      });
      return;
    }
    if (!control.touched || !control.invalid) return;

    if (control.errors?.['required']) {
      messages.push(`${this.labelForPath(path)} is required.`);
    }
    if (control.errors?.['email']) {
      messages.push('Please enter a valid email address.');
    }
    if (control.errors?.['mobileVerficationToken']) {
      messages.push('Please validate your mobile number before submitting.');
    }
    if (control.errors?.['pattern']) {
      if (path.endsWith('mobile') || path.endsWith('alternateMobile')) {
        messages.push('Mobile number must be 10 digits.');
      }
    }
    if (control.errors?.['aadhaarInvalid']) {
      messages.push(
        `${this.labelForPath(path)} must be a valid 12-digit Aadhaar (UIDAI format and checksum).`,
      );
    }
  }

  private labelForPath(path: string): string {
    const childMatch = path.match(/^children\[(\d+)\]\.(\w+)$/);
    if (childMatch) {
      const n = Number(childMatch[1]) + 1;
      const f = childMatch[2];
      const labels: Record<string, string> = {
        name: `Child ${n} name`,
        qualification: `Child ${n} qualification`,
        aadhaar: `Child ${n} Aadhaar number`,
      };
      return labels[f] || `Child ${n} ${f}`;
    }
    const leaf = path.includes('.') ? path.split('.').pop()! : path;
    return this.getFieldLabel(leaf);
  }
  public verifyMobile() {
    const mobileNumber = this.registrationForm.get('mobile')?.value;
    if (!mobileNumber || !/^[0-9]{10}$/.test(mobileNumber)) {
      this.dialogService.openDialog({
        dialogType: 'Error',
        title: 'Invalid Mobile Number!',
        message: 'Please enter a valid 10-digit mobile number before verification.',
        buttons: ['OK'],
        actions: [() => {}],
      });
      return;
    }
    this.requestVerification(mobileNumber);
  }
  checkMobileValidity() {
    const mobileNumber = this.registrationForm.get('mobile')?.value;
    this.isVerifyButtonDisabled = !mobileNumber || !/^[0-9]{10}$/.test(mobileNumber);
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
      fatherAadhaar: 'Father Aadhaar Number',
      motherName: 'Mother Name',
      motherOccupation: 'Mother Occupation',
      motherAadhaar: 'Mother Aadhaar Number',
      houseNo: 'House Number',
      spouseName: 'Spouse Name',
      spouseOccupation: 'Spouse Occupation',
      spouseAadhaar: 'Spouse Aadhaar Number',
      numberOfChildren: 'Number of Children',
      childrenNames: 'Children Names',
      street: 'Street',
      city: 'City',
      district: 'District',
      mandal: 'Mandal',
      village: 'Village',
      mobileVerficationToken: 'Mobile verification',
      qualification: 'Qualification',
      course: 'Course',
      jobDescription: 'Job Description',
    };

    return labels[controlName] || controlName;
  }
}
