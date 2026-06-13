import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../services/api-service';
import { DialogService } from '../../services/dialog-service';
import { aadhaarValidator } from '../../validators/aadhaar-validators';

type EditMode = 'admin' | 'public';

@Component({
  selector: 'app-edit-registration-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './edit-registration-dialog.html',
  styleUrl: './edit-registration-dialog.css',
})
export class EditRegistrationDialog implements OnInit {
  form!: FormGroup;
  mode: EditMode = 'admin';
  title = 'Edit Registration';
  expandedSections: Record<string, boolean> = {
    registration: true,
    family: true,
    address: true,
    education: true,
    job: true,
  };

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogService: DialogService,
    private dialogRef: MatDialogRef<EditRegistrationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { record: any; mode: EditMode; token?: string },
  ) {}

  ngOnInit(): void {
    this.mode = this.data.mode || 'admin';
    this.title = this.mode === 'public' ? 'Edit Member Details' : 'Edit Registration';
    const record = this.data.record || {};

    this.form = this.fb.group({
      mobileVerficationToken: [this.data.token || ''],
      firstName: [record.firstName || ''],
      middleName: [record.middleName || ''],
      lastName: [record.lastName || ''],
      gender: [record.gender || ''],
      dob: [record.dob || ''],
      age: [record.age || ''],
      maritalStatus: [record.maritalStatus || ''],
      mobile: [record.mobile || ''],
      alternateMobile: [record.alternateMobile || ''],
      email: [record.email || ''],
      aadhaar: [record.aadhaar || '', [aadhaarValidator()]],
      subCaste: [record.subCaste || ''],
      rationCardNo: [record.rationCardNo || ''],
      fatherName: [record.fatherName || ''],
      fatherOccupation: [record.fatherOccupation || ''],
      fatherAadhaar: [record.fatherAadhaar || '', [aadhaarValidator()]],
      motherName: [record.motherName || ''],
      motherOccupation: [record.motherOccupation || ''],
      motherAadhaar: [record.motherAadhaar || '', [aadhaarValidator()]],
      spouseName: [record.spouseName || ''],
      spouseOccupation: [record.spouseOccupation || ''],
      spouseAadhaar: [record.spouseAadhaar || '', [aadhaarValidator()]],
      numberOfChildren: [record.numberOfChildren || 0],
      children: this.fb.array([]),
      houseNo: [record.houseNo || ''],
      street: [record.street || ''],
      city: [record.city || ''],
      district: [record.district || ''],
      mandal: [record.mandal || ''],
      village: [record.village || ''],
      qualification: [record.qualification || ''],
      course: [record.course || ''],
      jobDescription: [record.jobDescription || ''],
    });

    if (this.mode === 'public') {
      this.form.get('mobile')?.disable();
      this.form.get('email')?.disable();
    }

    const children = Array.isArray(record.children) ? record.children : [];
    children.forEach((child: any) => this.children.push(this.fb.group({
      name: [child.name || ''],
      qualification: [child.qualification || ''],
      aadhaar: [child.aadhaar || '', [aadhaarValidator()]],
    })));
  }

  get children(): FormArray {
    return this.form.get('children') as FormArray;
  }

  toggleSection(section: string): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  onChildCountChange(): void {
    const count = Number(this.form.get('numberOfChildren')?.value || 0);
    this.children.clear();
    for (let i = 0; i < count; i++) {
      this.children.push(this.fb.group({
        name: [''],
        qualification: [''],
        aadhaar: ['', [aadhaarValidator()]],
      }));
    }
  }

  submit(): void {
    const payload = this.form.getRawValue();
    const request$ = this.mode === 'public'
      ? this.apiService.post<any>(`api/public/registration/update/${this.data.record._id}`, payload)
      : this.apiService.post<any>(`api/admin/registration/update/${this.data.record._id}`, payload);

    request$.subscribe({
      next: (res) => {
        this.dialogRef.close(res);
        setTimeout(() => {
          this.dialogService.openDialog({
            dialogType: 'Success',
            title: 'Update Successful!',
            message: 'Registration details have been updated successfully.',
            buttons: ['OK'],
            actions: [() => {}],
          });
        }, 0);
      },
      error: (error) => {
        this.dialogService.openDialog({
          dialogType: 'Error',
          title: 'Update Failed!',
          message: error?.error?.message || 'There was an error updating the registration.',
          buttons: ['OK'],
          actions: [() => {}],
        });
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
