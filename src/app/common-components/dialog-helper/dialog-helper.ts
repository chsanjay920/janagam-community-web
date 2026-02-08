import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent } from "@angular/material/dialog";
import { DialogData } from '../../models/dialog-data';

@Component({
  selector: 'app-dialog-helper',
  imports: [MatDialogActions, MatDialogContent],
  templateUrl: './dialog-helper.html',
})
export class DialogHelper {
  readonly dialog = inject(MatDialog);
  dialogData : DialogData = inject(MAT_DIALOG_DATA);
  closeDialog()
  {
    console.log('Dialog closed');
    this.dialog.closeAll();
  }
}
