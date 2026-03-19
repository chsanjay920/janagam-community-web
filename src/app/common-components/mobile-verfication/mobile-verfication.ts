import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  inject,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MobileVerficationDataModel } from '../../components/admin/admin-list-registrations/registration-data-model';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api-service';
import { RegistrationMobileVerification } from '../../models/registration';
import { DialogService } from '../../services/dialog-service';

@Component({
  selector: 'app-mobile-verfication',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mobile-verfication.html',
  styleUrl: './mobile-verfication.css',
})
export class MobileVerfication implements AfterViewInit {
  dialog = inject(MatDialog);
  dialogData: MobileVerficationDataModel = inject(MAT_DIALOG_DATA);

  closeDialog() {
    this.dialog.closeAll();
  }
  otpForm: FormGroup;

  @ViewChildren('otpInput') inputs!: QueryList<ElementRef>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MobileVerfication>,
    private apiService: ApiService,
    private dialogService: DialogService,
  ) {
    this.otpForm = this.fb.group({
      otp: this.fb.array(this.createOtpArray(), Validators.minLength(6)),
    });
  }

  ngAfterViewInit() {
    this.focusInput(0);
  }

  createOtpArray() {
    return Array(6)
      .fill('')
      .map(() => this.fb.control('', [Validators.required]));
  }

  get otpControls() {
    return (this.otpForm.get('otp') as FormArray).controls;
  }

  focusInput(index: number) {
    const inputs = document.querySelectorAll('.otp-box');
    if (inputs[index]) {
      (inputs[index] as HTMLElement).focus();
    }
  }

  onKeyUp(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    if (input.value && index < 5) {
      this.focusInput(index + 1);
    }
  }

  onBackspace(event: any, index: number) {
    const input = event.target as HTMLInputElement;

    if (!input.value && index > 0) {
      this.focusInput(index - 1);
    }
  }

  verifyOtp() {
    if (this.otpForm.invalid) return;
    const otpArray = this.otpForm.value.otp;
    const otp = otpArray.join('');
    console.log('Entered OTP:', otp);
    this.apiService
      .post<RegistrationMobileVerification>('api/verifyOTP', {
        mobileNumber: this.dialogData.mobile,
        otp: otp,
      })
      .subscribe({
        next: (response) => {
          this.dialogRef.close(response);
          console.log('Verification successful:', response);
          this.dialogService.openDialog({
            dialogType: 'Success',
            title: 'Verification Successful!',
            message: 'Your mobile number has been verified successfully.',
            buttons: ['OK'],
            actions: [() => {}],
          });
        },
        error: (error) => {
          console.error('Verification failed:', error);
          this.dialogService.openDialog({
            dialogType: 'Error',
            title: 'Verification Failed!',
            message: 'There was an error verifying your mobile number. Please try again later.',
            buttons: ['OK'],
            actions: [() => {}],
          });
        },
      });
  }
}
