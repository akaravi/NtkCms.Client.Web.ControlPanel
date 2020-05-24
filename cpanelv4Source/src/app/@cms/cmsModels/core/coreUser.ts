import { GenderType } from '../Enums/genderType.enum';
import { BaseEntity } from '../base/baseEntity';

export class CoreUser extends  BaseEntity<number> {
     Username: string;
     ExpireDate: Date;
     Email: string;
     EmailConfirmed: boolean;
     Mobile: string;
     MobileConfirmed: boolean;
     ExpireLockAccount: Date;
     Name: string;
     LastName: string;
     BirthDay: Date;
     Gender: GenderType;
     FullName: string;
     Address: string;
     PostalCode: string;
     LinkMainImageId: number;
     Tell: string;
     IsCompany: boolean;
     LinkLocationId: number;
     FirewallAllowIP: string;
}
