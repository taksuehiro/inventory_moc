'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InventoryData, VerificationStatus } from '@/lib/types';
import { Eye } from 'lucide-react';

interface InventoryTableProps {
  data: InventoryData[];
  verificationStatus: VerificationStatus;
  onViewCertificate: (item: InventoryData) => void;
}

export function InventoryTable({ 
  data, 
  verificationStatus, 
  onViewCertificate 
}: InventoryTableProps) {
  const getStatusBadge = (id: number) => {
    const status = verificationStatus[id];
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">未確認</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              営業部名
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              在庫場所
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              在庫名称
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              数量
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              証明書
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              判定
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr 
              key={item.id} 
              className={`hover:bg-gray-50 ${
                item.差異あり 
                  ? 'bg-yellow-100 border-l-4 border-yellow-500' 
                  : ''
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.営業部名}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.在庫場所}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.在庫名称}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                item.差異あり 
                  ? 'text-red-600 font-bold bg-yellow-50' 
                  : 'text-gray-900'
              }`}>
                {item.数量}
                {item.差異あり && (
                  <span className="ml-2 text-xs text-red-500">
                    (営業指摘:差異あり)
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewCertificate(item)}
                  className="flex items-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>参照</span>
                </Button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getStatusBadge(item.id)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


