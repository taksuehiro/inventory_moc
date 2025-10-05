import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            在庫照合MOC
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            会社データ（Excel）と在庫証明書（PDF）をアップロードして、
            効率的な在庫照合プロセスを体験できます
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* 機能紹介 */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-4">
                <FileText className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">ファイルアップロード</h3>
              </div>
              <p className="text-gray-600 mb-4">
                ExcelファイルとPDFファイルをドラッグ&ドロップで簡単にアップロードできます。
                サンプルファイルも提供しています。
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 対応形式: .xlsx, .xls, .pdf</li>
                <li>• ドラッグ&ドロップ対応</li>
                <li>• サンプルファイル提供</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">照合確認</h3>
              </div>
              <p className="text-gray-600 mb-4">
                PDF証明書とExcelデータを並べて表示し、
                項目ごとにチェックしてAccept/Rejectを決定できます。
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• PDFビューアー内蔵</li>
                <li>• 項目別チェック機能</li>
                <li>• リアルタイム統計表示</li>
              </ul>
            </div>
          </div>

          {/* 開始ボタン */}
          <div className="text-center">
            <Link href="/upload">
              <Button size="lg" className="px-8 py-4 text-lg">
                スタート
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              ※ このMOCでは実際のVLM機能は使用せず、手動チェックで体験できます
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}