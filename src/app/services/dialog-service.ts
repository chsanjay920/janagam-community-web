import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from '../models/dialog-data';
import { DialogHelper } from '../common-components/dialog-helper/dialog-helper';
import { ViewRegistrationDetailsDialog } from '../common-components/view-registration-details-dialog/view-registration-details-dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  readonly dialog = inject(MatDialog);
  openDialog(data:DialogData): void {
    this.dialog.open(DialogHelper, {
      width: '50%',
      enterAnimationDuration: "0ms",
      exitAnimationDuration: "0ms",
      data: data
    });
  }
  viewRegistrationDetails(data:DialogData): void {
    this.dialog.open(ViewRegistrationDetailsDialog, {
      width: '80%',
      data: data
    });
  }
}
