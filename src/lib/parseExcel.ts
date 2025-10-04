import * as XLSX from 'xlsx';
import { InventoryData } from './types';

export function parseExcelFile(file: File): Promise<InventoryData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // ExcelデータをJSONに変換
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // ヘッダー行をスキップしてデータを変換
        const inventoryData: InventoryData[] = jsonData
          .slice(1) // ヘッダー行をスキップ
          .filter((row: any[]) => row.length > 0) // 空行を除外
          .map((row: any[], index: number) => ({
            id: index + 1,
            営業部名: row[0] || '',
            在庫場所: row[1] || '',
            在庫名称: row[2] || '',
            数量: row[3] || '',
            証明書ファイル: row[4] || '',
            補足情報: row[5] || ''
          }));
        
        resolve(inventoryData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('ファイルの読み込みに失敗しました'));
    };
    
    reader.readAsBinaryString(file);
  });
}

export function createSampleExcelFile(): void {
  const sampleData = [
    ['営業部名', '在庫場所', '在庫名称', '数量', '証明書ファイル', '補足情報'],
    ['非鉄事業部', 'トヨタ物流', '銅パイプA', '1200kg', 'toyota_logistics.pdf', '納入日: 2025-09-20'],
    ['非鉄事業部', '三友倉庫', 'アルミ板C', '800kg', 'sanyu_warehouse.pdf', 'ロットNo: ALM-003'],
    ['非鉄事業部', '中組', '真鍮棒B', '950kg', 'nakagumi.pdf', '保管期限: 2026-01-31'],
    ['非鉄事業部', 'トヨタ物流', '銅スクラップ', '500kg', 'toyota_logistics2.pdf', '分類: リサイクル品'],
    ['非鉄事業部', '三友倉庫', '銅パイプB', '1100kg', 'sanyu_warehouse2.pdf', '備考: 表面検査済']
  ];
  
  const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '在庫データ');
  
  XLSX.writeFile(workbook, 'sample_inventory.xlsx');
}
