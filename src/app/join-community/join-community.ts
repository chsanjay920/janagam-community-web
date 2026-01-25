import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Registration } from '../models/registration';
import { ApiService } from '../services/api-service';
import { DialogService } from '../services/dialog-service';

@Component({
  selector: 'app-join-community',
  imports: [ReactiveFormsModule],
  templateUrl: './join-community.html',
  styleUrl: './join-community.css',
})
export class JoinCommunity {
  registrationForm!: FormGroup;
  body!: Registration;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogService: DialogService,
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
      alternateMobile: [''],

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
}
