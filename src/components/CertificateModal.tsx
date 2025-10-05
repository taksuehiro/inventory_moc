'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { InventoryData, CheckedFields } from '@/lib/types';
import { PDFViewer } from '@/components/PDFViewer';
import { Check, X } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItem: InventoryData | null;
  onAccept: (item: InventoryData, checkedFields: string[]) => void;
  onReject: (item: InventoryData) => void;
}

export function CertificateModal({
  isOpen,
  onClose,
  inventoryItem,
  onAccept,
  onReject
}: CertificateModalProps) {
  const [checkedFields, setCheckedFields] = useState<CheckedFields>({});

  if (!inventoryItem) return null;

  const fields = [
    { key: '営業部名', value: inventoryItem.営業部名 },
    { key: '在庫場所', value: inventoryItem.在庫場所 },
    { key: '在庫名称', value: inventoryItem.在庫名称 },
    { key: '数量', value: inventoryItem.数量 }
  ];

  const handleFieldCheck = (fieldKey: string, checked: boolean) => {
    setCheckedFields(prev => ({
      ...prev,
      [inventoryItem.id]: checked
        ? [...(prev[inventoryItem.id] || []), fieldKey]
        : (prev[inventoryItem.id] || []).filter(f => f !== fieldKey)
    }));
  };

  const handleAccept = () => {
    const checked = checkedFields[inventoryItem.id] || [];
    onAccept(inventoryItem, checked);
    setCheckedFields({});
    onClose();
  };

  const handleReject = () => {
    onReject(inventoryItem);
    setCheckedFields({});
    onClose();
  };

  const isFieldChecked = (fieldKey: string) => {
    return (checkedFields[inventoryItem.id] || []).includes(fieldKey);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            在庫証明書照合 - {inventoryItem.在庫名称}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* PDF表示エリア */}
          <div className="flex-1 border rounded-lg p-6 bg-white">
            <div className="h-full overflow-auto">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📄</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Inventory Certificate</h2>
                  <p className="text-sm text-gray-600">Certificate No: CERT-2025-{String(inventoryItem.id).padStart(3, '0')}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Issue Date:</span>
                      <p className="text-sm text-gray-900">2025-10-05</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Warehouse:</span>
                      <p className="text-sm text-gray-900">{inventoryItem.在庫場所}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Department:</span>
                      <p className="text-sm text-gray-900">{inventoryItem.営業部名}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Item:</span>
                      <p className="text-sm text-gray-900">{inventoryItem.在庫名称}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Quantity:</span>
                      <p className="text-sm text-gray-900">{inventoryItem.id === 3 ? '1500kg' : inventoryItem.数量}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Storage Location:</span>
                      <p className="text-sm text-gray-900">Warehouse {String.fromCharCode(64 + inventoryItem.id)}-1F-{String(inventoryItem.id).padStart(2, '0')}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Quality:</span>
                    <p className="text-sm text-green-800 font-medium">Passed</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Remarks:</span>
                    <p className="text-sm text-gray-900">{inventoryItem.補足情報}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 照合項目エリア */}
          <div className="w-80 border rounded-lg p-4 bg-white flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              照合項目
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-4">
              {fields.map((field) => (
                <div
                  key={field.key}
                  className={`p-3 border rounded-lg transition-colors ${
                    isFieldChecked(field.key)
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={isFieldChecked(field.key)}
                      onCheckedChange={(checked) => 
                        handleFieldCheck(field.key, checked as boolean)
                      }
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {field.key}
                        </span>
                        {isFieldChecked(field.key) && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            確認済
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {field.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex space-x-2">
                <Button
                  onClick={handleAccept}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!Object.values(checkedFields[inventoryItem.id] || {}).length}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Accept
                </Button>
                <Button
                  onClick={handleReject}
                  variant="destructive"
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
