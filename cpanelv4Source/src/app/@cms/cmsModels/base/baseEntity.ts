import { RecordStatus } from "../Enums/recordStatus.enum";

export class BaseEntity<TKey> {
  Id: TKey;
  CreatedDate: Date;
  CreatedBy: number;
  UpdatedDate: Date;
  UpdatedBy: number;
  RecordStatus: RecordStatus;
}
