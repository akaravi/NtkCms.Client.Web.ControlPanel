import { BaseEntity } from '../base/baseEntity';
import { MenuPlaceType } from '../Enums/menuPlaceType.enum';

export class CoreCpMainMenuModel extends BaseEntity<number>{
    Title: string;
    TitleML: string;
    TitleResourceLanguage: string;
    Color: string;
    TitleEn: string;
    Icon: string;
    AddressLink: string;
    LinkParentId: number;
    LinkModuleId: number;
    Description: string;
    ShowInMenu: number;
    ShowInMenuOrder: number;
    ShowInAccessAdminAllowToProfessionalData:boolean;
    MenuPlaceType:MenuPlaceType;
    Children:CoreCpMainMenuModel[]
}
