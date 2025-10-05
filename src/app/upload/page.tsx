'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FileDropZone } from '@/components/FileDropZone';
import { createSampleExcelFile, downloadSamplePDFs } from '@/lib/parseExcel';
import { Download, ArrowRight, FileText } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);

  const handleExcelFileSelect = (file: File) => {
    setExcelFile(file);
  };

  const handlePdfFileSelect = (file: File) => {
    setPdfFiles(prev => [...prev, file]);
  };

  const handleRemoveExcelFile = () => {
    setExcelFile(null);
  };

  const handleRemovePdfFile = (index: number) => {
    setPdfFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDownloadSample = () => {
    createSampleExcelFile();
  };

  const handleDownloadPDFSamples = () => {
    downloadSamplePDFs();
  };

  const handleNext = () => {
    if (excelFile) {
      // ファイルをローカルストレージに保存（MOC用）
      localStorage.setItem('excelFile', JSON.stringify({
        name: excelFile.name,
        size: excelFile.size,
        type: excelFile.type
      }));
      
      // PDFファイル情報も保存
      localStorage.setItem('pdfFiles', JSON.stringify(
        pdfFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }))
      ));
      
      router.push('/review');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              在庫照合MOC
            </h1>
            <p className="text-lg text-gray-600">
              会社データ（Excel）と在庫証明書（PDF）をアップロードして照合を開始します
            </p>
          </div>

          <div className="space-y-8">
            {/* Excelファイルアップロード */}
            <div>
              <FileDropZone
                onFileSelect={handleExcelFileSelect}
                acceptedTypes=".xlsx,.xls"
                label="会社データ (Excel)"
                selectedFile={excelFile}
                onRemoveFile={handleRemoveExcelFile}
              />
              
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  サンプルExcelファイルをダウンロードできます
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadSample}
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>サンプルをダウンロード</span>
                </Button>
              </div>
            </div>

            {/* PDFファイルアップロード */}
            <div>
              <FileDropZone
                onFileSelect={handlePdfFileSelect}
                acceptedTypes=".pdf"
                label="在庫証明書 (PDF)"
                selectedFile={null}
                onRemoveFile={() => {}}
              />
              
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  サンプルPDFファイル（5種類）をダウンロードできます
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPDFSamples}
                  className="flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>PDFサンプルをダウンロード</span>
                </Button>
              </div>
              
              {pdfFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">アップロード済みPDFファイル:</p>
                  {pdfFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePdfFile(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        削除
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 次へボタン */}
            <div className="flex justify-center pt-6">
              <Button
                onClick={handleNext}
                disabled={!excelFile}
                size="lg"
                className="px-8 py-3 text-lg"
              >
                次へ
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
