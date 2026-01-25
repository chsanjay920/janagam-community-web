export interface DialogData {
  dialogType : string;
  title: string;
  message: string;
  buttons: string[];
  actions: (() => void)[];
}
