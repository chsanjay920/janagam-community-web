import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function verhoeffChecksumValid(digits: string): boolean {
  const d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  ];
  const p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
  ];
  let c = 0;
  const arr = digits.split('').reverse().map(Number);
  for (let i = 0; i < arr.length; i++) {
    c = d[c][p[i % 8][arr[i]]];
  }
  return c === 0;
}

export function normalizeAadhaarInput(value: unknown): string {
  if (value === undefined || value === null) return '';
  return String(value).replace(/\D/g, '');
}

/** UIDAI rules: 12 digits, first digit 2–9, Verhoeff checksum. */
export function isValidAadhaarValue(value: unknown): boolean {
  const s = normalizeAadhaarInput(value);
  if (!/^[2-9]\d{11}$/.test(s)) return false;
  return verhoeffChecksumValid(s);
}

export function aadhaarValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (v === null || v === undefined || String(v).trim() === '') {
      return null;
    }
    if (!isValidAadhaarValue(v)) {
      return { aadhaarInvalid: true };
    }
    return null;
  };
}
