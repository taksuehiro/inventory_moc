export interface InventoryData {
  id: number;
  営業部名: string;
  在庫場所: string;
  在庫名称: string;
  数量: string;
  証明書ファイル: string;
  補足情報: string;
}

export interface CheckedFields {
  [rowId: number]: string[];
}

export interface VerificationStatus {
  [rowId: number]: 'pending' | 'accepted' | 'rejected';
}
