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
      address.villageGroup,
      address.mandal,
      address.taluka,
      address.city,
      address.course,
    ]
      .filter(Boolean)
      .join(', ');
  }
}
