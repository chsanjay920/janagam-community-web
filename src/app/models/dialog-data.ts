export interface DialogData {
  dialogType : string;
  title: string;
  message: string;
  buttons: string[];
  actions: (() => void)[];
}
export interface VerificationDialogData  {
  mobile: string;
}

