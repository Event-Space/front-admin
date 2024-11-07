export enum UserRole {
  Manager = 'MANAGER',
  User = 'USER',
}

export interface IUser {
  email: string;
  firstname: string;
  lastname: string;
  phoneNumber: number;
  role: UserRole;
}
