export class AuthUserSignInModel {
  Username: string;
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
  name: string;
  family: string;
  SiteId: number;
}
export class AuthUserSignOutModel {
  Tokens: Array<string>= new Array<string>();
  AllToken: boolean= false;
}

