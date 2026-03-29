export interface Registration {
  firstName: string,
  middleName: string,
  lastName: string,

  gender: string,
  dob: string,
  age: string,

  maritalStatus: string,
  mobile: string,
  alternateMobile: string,

  email: string,
  aadhaar: string,
  subCaste: string,

  fatherName: string,
  fatherOccupation: string,
  fatherAadhaar: string,
  motherName: string,
  motherOccupation: string,
  motherAadhaar: string,
  spouseAadhaar: string,

  houseNo: string,
  street: string,
  city: string,

  district: string,
  mandal: string,
  village: string,

  qualification: string,
  course: string,
}
export interface RegistrationMobileVerification {
  mobile: string,
  otp: string,
}
