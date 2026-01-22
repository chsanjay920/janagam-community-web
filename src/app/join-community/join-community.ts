import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-join-community',
  imports: [ReactiveFormsModule],
  templateUrl: './join-community.html',
  styleUrl: './join-community.css',
})
export class JoinCommunity {
  registrationForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

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

      qualification: [''],
      course: ['']
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
      return;
    }

    console.log('Form Value:', this.registrationForm.getRawValue());
  }
}
