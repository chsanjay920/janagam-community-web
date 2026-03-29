import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  getRegistrantFullName(el: any): string {
    const names = [el.firstName, el.middleName, el.lastName].filter((name) => !!name);
    return names.join(', ');
  }
  getFullAddress(address: any): string {
    return [
      address.houseNo,
      address.street,
      address.village,
      address.mandal,
      address.district,
      address.city,
    ]
      .filter(Boolean)
      .join(', ');
  }
}
