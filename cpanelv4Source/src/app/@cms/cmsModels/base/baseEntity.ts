import { RecordStatus } from "../Enums/recordStatus.enum";

export class BaseEntity<TKey> {
  Id: TKey;
  CreatedDate: Date;
  CreatedBy: number;
  UpdatedDate: Date;
  UpdatedBy: number;
  RecordStatus: RecordStatus;

  //region AntiInjection
  AntiInjectionGuid: string;
  AntiInjectionDate: Date;
  CreateAntiInjectionValue: Boolean;
  AntiInjectionExpiredMinute: number;
  AntiInjectionToken: string;
  AntiInjectionExpireDate: Date;
  //endregion AniInjection
}
