import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api-service';
import { DialogService } from '../../../services/dialog-service';
import { DashboardDataUpdate } from '../../../models/admin-registration';

@Component({
  selector: 'app-admin-update-dashboard',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-update-dashboard.html',
})
export class AdminUpdateDashboard implements OnInit {
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogService: DialogService,
    private router: Router,
  ) {}
  presindentNameUpdateForm!: FormGroup;
  generalSecretaryUpdateForm!: FormGroup;
  body!: DashboardDataUpdate;
  ngOnInit(): void {
    this.presindentNameUpdateForm = this.fb.group({
      presidentName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z ]+$/),
        ],
      ],
    });
    this.generalSecretaryUpdateForm = this.fb.group({
      generalSecretaryName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z ]+$/),
        ],
      ],
    });
  }
  onPresidentSubmit() {
    if (this.presindentNameUpdateForm.invalid) {
      this.presindentNameUpdateForm.markAllAsTouched();
      this.dialogService.openDialog({
        dialogType: 'Error',
        title: 'Form Error!',
        message: 'Please correct the errors in the form before submitting.',
        buttons: ['OK'],
        actions: [() => {}],
      });
      return;
    }
    const formData = this.presindentNameUpdateForm.getRawValue();
    this.body = {
      description: formData.presidentName.trim(),
      typeCode: 'PRESIDENT',
    };
    this.apiService.post<DashboardDataUpdate>('api/admin/dashboarddataupdate', this.body).subscribe({
      next: (response) => {
        this.dialogService.openDialog({
          dialogType: 'Success',
          title: 'President Data Updated!',
          message: 'President name updated successfully.',
          buttons: ['OK'],
          actions: [
            () => {
              this.presindentNameUpdateForm.reset();
            },
          ],
        });
      },
      error: (error) => {
        this.dialogService.openDialog({
          dialogType: 'Error',
          title: 'President Data Update Failed!',
          message: 'There was an error updating the president data. Please try again later.',
          buttons: ['OK'],
          actions: [() => {}],
        });
      },
    });
  }
  onGeneralSecretarySubmit() {
    if (this.generalSecretaryUpdateForm.invalid) {
      this.generalSecretaryUpdateForm.markAllAsTouched();
      this.dialogService.openDialog({
        dialogType: 'Error',
        title: 'Form Error!',
        message: 'Please correct the errors in the form before submitting.',
        buttons: ['OK'],
        actions: [() => {}],
      });
      return;
    }
    const formData = this.generalSecretaryUpdateForm.getRawValue();
    this.body = {
      description: formData.generalSecretaryName.trim(),
      typeCode: 'GENERAL_SECRETARY',
    };
    this.apiService.post<DashboardDataUpdate>('api/admin/dashboarddataupdate', this.body).subscribe({
      next: (response) => {
        this.dialogService.openDialog({
          dialogType: 'Success',
          title: 'General Secretary Data Updated!',
          message: 'General secretary name updated successfully.',
          buttons: ['OK'],
          actions: [
            () => {
              this.generalSecretaryUpdateForm.reset();
            },
          ],
        });
      },
      error: (error) => {
        this.dialogService.openDialog({
          dialogType: 'Error',
          title: 'General Secretary Data Update Failed!',
          message:
            'There was an error updating the general secretary data. Please try again later.',
          buttons: ['OK'],
          actions: [() => {}],
        });
      },
    });
  }
}
