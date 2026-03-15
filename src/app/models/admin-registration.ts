export interface AdminRegistration {
  name: string,
  email: string,
  password: string,
}
export interface DashboardDataUpdate {
  description: string,
  typeCode: 'PRESIDENT' | 'GENERAL_SECRETARY',
}
