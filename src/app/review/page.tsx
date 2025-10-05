'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { InventoryTable } from '@/components/InventoryTable';
import { CertificateModal } from '@/components/CertificateModal';
import { InventoryData, VerificationStatus } from '@/lib/types';
import { sampleInventoryData } from '@/lib/sampleData';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

export default function ReviewPage() {
  const router = useRouter();
  const [inventoryData, setInventoryData] = useState<InventoryData[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({});
  const [selectedItem, setSelectedItem] = useState<InventoryData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // MOCではサンプルデータを使用
    setInventoryData(sampleInventoryData);
  }, []);

  const handleViewCertificate = (item: InventoryData) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAccept = (item: InventoryData, checkedFields: string[]) => {
    setVerificationStatus(prev => ({
      ...prev,
      [item.id]: 'accepted'
    }));
  };

  const handleReject = (item: InventoryData) => {
    setVerificationStatus(prev => ({
      ...prev,
      [item.id]: 'rejected'
    }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const getVerificationSummary = () => {
    const total = inventoryData.length;
    const accepted = Object.values(verificationStatus).filter(status => status === 'accepted').length;
    const rejected = Object.values(verificationStatus).filter(status => status === 'rejected').length;
    const pending = total - accepted - rejected;

    return { total, accepted, rejected, pending };
  };

  const summary = getVerificationSummary();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* ヘッダー */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/upload')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>戻る</span>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    在庫照合確認
                  </h1>
                  <p className="text-sm text-gray-600">
                    読み込んだ会社データと在庫証明書を照合してください
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 統計情報 */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
                <div className="text-sm text-gray-600">総件数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{summary.accepted}</div>
                <div className="text-sm text-gray-600">承認済み</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{summary.rejected}</div>
                <div className="text-sm text-gray-600">却下</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{summary.pending}</div>
                <div className="text-sm text-gray-600">未確認</div>
              </div>
            </div>
          </div>

          {/* テーブル */}
          <div className="p-6">
            <InventoryTable
              data={inventoryData}
              verificationStatus={verificationStatus}
              onViewCertificate={handleViewCertificate}
            />
          </div>

          {/* フッター */}
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                照合完了: {summary.accepted + summary.rejected} / {summary.total}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => router.push('/upload')}
                >
                  新しいファイルをアップロード
                </Button>
                {summary.pending === 0 && (
                  <Button className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    照合完了
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 証明書モーダル */}
      <CertificateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        inventoryItem={selectedItem}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </div>
  );
}

