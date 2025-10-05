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
    ['Department', 'Warehouse', 'Item Name', 'Quantity', 'Certificate File', 'Remarks'],
    ['Non-Ferrous Division', 'Toyota Logistics', 'Copper Pipe A', '1200kg', 'toyota_logistics.pdf', 'Delivery Date: 2025-09-20'],
    ['Non-Ferrous Division', 'Sanyu Warehouse', 'Aluminum Plate C', '800kg', 'sanyu_warehouse.pdf', 'Lot No: ALM-003'],
    ['Non-Ferrous Division', 'Nakagumi', 'Brass Rod B', '950kg', 'nakagumi.pdf', 'Storage Period: 2026-01-31'],
    ['Non-Ferrous Division', 'Toyota Logistics', 'Copper Scrap', '500kg', 'toyota_logistics2.pdf', 'Category: Recycled Material'],
    ['Non-Ferrous Division', 'Sanyu Warehouse', 'Copper Pipe B', '1100kg', 'sanyu_warehouse2.pdf', 'Remarks: Surface inspected']
  ];
  
  const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Data');
  
  XLSX.writeFile(workbook, 'sample_inventory_english.xlsx');
}

export function downloadSamplePDFs(): void {
  // 簡単なPDFファイルを動的に生成してダウンロード
  const pdfFiles = [
    { name: 'toyota_logistics.pdf', content: 'Toyota Logistics Certificate\nCopper Pipe A: 1200kg\nDelivery Date: 2025-09-20' },
    { name: 'sanyu_warehouse.pdf', content: 'Sanyu Warehouse Certificate\nAluminum Plate C: 800kg\nLot No: ALM-003' },
    { name: 'nakagumi.pdf', content: 'Nakagumi Certificate\nBrass Rod B: 950kg\nStorage Period: 2026-01-31' },
    { name: 'toyota_logistics2.pdf', content: 'Toyota Logistics Certificate\nCopper Scrap: 500kg\nCategory: Recycled Material' },
    { name: 'sanyu_warehouse2.pdf', content: 'Sanyu Warehouse Certificate\nCopper Pipe B: 1100kg\nRemarks: Surface inspected' }
  ];
  
  // 各PDFファイルをダウンロード
  pdfFiles.forEach((file, index) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // 少し遅延を入れて順次ダウンロード
    setTimeout(() => {
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, index * 500);
  });
}
