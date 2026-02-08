import { Component, inject } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DialogData } from '../../models/dialog-data';
import { CommonService } from '../../services/common-service';
import { RegistrationDataModel } from '../../components/admin/admin-list-registrations/registration-data-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-registration-details-dialog',
  imports: [CommonModule],
  templateUrl: './view-registration-details-dialog.html',
  styles: ['./view-registration-details-dialog.css'],
})
export class ViewRegistrationDetailsDialog {
  constructor(private commonService: CommonService) {}
  readonly dialog = inject(MatDialog);
  dialogData: RegistrationDataModel = inject(MAT_DIALOG_DATA);
  closeDialog() {
    this.dialog.closeAll();
  }
  getFullName(el: any): string {
    return this.commonService.getRegistrantFullName(el);
  }
  getClass(status: string) {
    switch (status) {
      case 'APPROVED':
        return 'status-active';
      case 'PENDING':
        return 'status-pending';
      case 'REJECTED':
        return 'status-rejected';
      default:
        return '';
    }
  }
  getFullAddress(address: any): string {
    return this.commonService.getFullAddress(address);
  }
  viewDetails() {
    console.log('View details for registration:', this.dialogData);
  }
}
