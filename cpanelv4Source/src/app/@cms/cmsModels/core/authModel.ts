export class AuthUserSignInModel {
  Email: string;
  Password: string;
  IsRemember: boolean;
  SiteId: number;
  lang: string;
}
export class AuthRenewTokenModel {
  SiteId: number;
  UserId: number;
  UserAccessAdminAllowToAllData: boolean;
  UserAccessAdminAllowToProfessionalData: boolean;
  lang: string;
}
export class AuthUserSignUpModel {
  email: string;
  mobile: string;
  Password: string;
  rePassword: string;
  name: string;
  family: string;
  SiteId: number;
  roulaccespt: boolean;
}
export class AuthUserSignOutModel {
  Tokens: Array<string>= new Array<string>();
  AllToken: boolean= false;
}
export class AuthUserChangePasswordModel {
  OldPassword:string;
  NewPassword:string;
}
export class AuthUserForgetPasswordModel
{
  email:string;
}

