import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogData, VerificationDialogData } from '../models/dialog-data';
import { DialogHelper } from '../common-components/dialog-helper/dialog-helper';
import { ViewRegistrationDetailsDialog } from '../common-components/view-registration-details-dialog/view-registration-details-dialog';
import { MobileVerfication } from '../common-components/mobile-verfication/mobile-verfication';
import { EditRegistrationDialog } from '../common-components/edit-registration-dialog/edit-registration-dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  readonly dialog = inject(MatDialog);
  openDialog(data: DialogData): void {
    this.dialog.open(DialogHelper, {
      width: '50%',
      maxHeight: '90vh',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: data,
    });
  }
  viewRegistrationDetails(data: DialogData): void {
    this.dialog.open(ViewRegistrationDetailsDialog, {
      width: '80%',
      maxHeight: '90vh',
      data: data,
    });
  }
  verificationDialog(data: VerificationDialogData) {
    return this.dialog.open(MobileVerfication, {
      width: '50%',
      maxHeight: '90vh',
      data: data,
    });
  }
  editRegistration(data: { record: any; mode: 'admin' | 'public'; token?: string }) {
    return this.dialog.open(EditRegistrationDialog, {
      width: '96vw',
      maxWidth: '1200px',
      maxHeight: '92vh',
      panelClass: 'edit-registration-panel',
      data,
    });
  }
}
