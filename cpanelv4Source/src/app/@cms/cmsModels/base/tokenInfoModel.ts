import { ManageUserAccessAreaTypes } from '../Enums/ManageUserAccessAreaTypes.enum';
import { ManageUserAccessControllerTypes } from '../Enums/manageUserAccessControllerTypes.enum';

export class TokenInfoModel {
  
  token: string;
  refresh_token: string;
  
  UserId: number;
  SiteId: number;
  UserGroupId: number;
  UserTypeTitle: string;
  UserAccessAdminAllowToProfessionalData: boolean;
  UserAccessAdminAllowToAllData: boolean;
  UserType: ManageUserAccessControllerTypes;
  UserAccessAreaType: ManageUserAccessAreaTypes;
  Username: string;
  Name: string;
  LastName: string;
  FullName: string;
  Language: string;
  Domain: string;
  SubDomain: string;
  Title: string;
  PhotoUrl: string;

}
