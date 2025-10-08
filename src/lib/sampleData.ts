import { InventoryData } from './types';

export const sampleInventoryData: InventoryData[] = [
  {
    id: 1,
    営業部名: 'Non-Ferrous Division',
    在庫場所: 'Toyota Logistics',
    在庫名称: 'Copper Pipe A',
    数量: '1200kg',
    証明書ファイル: 'toyota_logistics.pdf',
    補足情報: 'Delivery Date: 2025-09-20'
  },
  {
    id: 2,
    営業部名: 'Non-Ferrous Division',
    在庫場所: 'Sanyu Warehouse',
    在庫名称: 'Aluminum Plate C',
    数量: '800kg',
    証明書ファイル: 'sanyu_warehouse.pdf',
    補足情報: 'Lot No: ALM-003'
  },
  {
    id: 3,
    営業部名: 'Non-Ferrous Division',
    在庫場所: 'Nakagumi',
    在庫名称: 'Brass Rod B',
    数量: '950kg',
    証明書ファイル: 'nakagumi.pdf',
    補足情報: 'Storage Period: 2026-01-31',
    差異あり: true // 950KGと1500KGの差異がある行
  },
  {
    id: 4,
    営業部名: 'Non-Ferrous Division',
    在庫場所: 'Toyota Logistics',
    在庫名称: 'Copper Scrap',
    数量: '500kg',
    証明書ファイル: 'toyota_logistics2.pdf',
    補足情報: 'Category: Recycled Material'
  },
  {
    id: 5,
    営業部名: 'Non-Ferrous Division',
    在庫場所: 'Sanyu Warehouse',
    在庫名称: 'Copper Pipe B',
    数量: '1100kg',
    証明書ファイル: 'sanyu_warehouse2.pdf',
    補足情報: 'Remarks: Surface inspected'
  }
];
