# 在庫証明書マッチングMOC アーキテクチャ設計書

## 1. 概要

本アプリケーションは、会社データ（Excel）と在庫証明書（PDF）をアップロードして照合結果を確認するデモアプリケーションです。現段階ではVLMによる自動マッチングは行わず、手動チェック＋Accept/Reject操作を体験できるように設計されています。

## 2. 技術スタック

### フロントエンド
- **Next.js 14** (App Router)
- **TypeScript** - 型安全性の確保
- **TailwindCSS** - スタイリング
- **shadcn/ui** - UIコンポーネントライブラリ
- **Framer Motion** - アニメーション
- **React-PDF** - PDF表示機能
- **Zustand** - 状態管理

### バックエンド・データ処理
- **xlsx** - Excelファイル解析
- **react-pdf** - PDF表示・操作
- **File API** - ファイルアップロード処理

### 開発環境
- **ESLint** - コード品質管理
- **PostCSS** - CSS処理

## 3. アーキテクチャ構成

### 3.1 フロントエンド構成

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # ホームページ
│   ├── upload/            # ファイルアップロードページ
│   │   └── page.tsx
│   └── review/            # 照合確認ページ
│       └── page.tsx
├── components/            # 再利用可能コンポーネント
│   ├── ui/               # shadcn/uiコンポーネント
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── checkbox.tsx
│   │   └── badge.tsx
│   ├── FileDropZone.tsx  # ファイルドロップゾーン
│   ├── InventoryTable.tsx # 在庫データテーブル
│   ├── CertificateModal.tsx # 証明書表示モーダル
│   └── PDFViewer.tsx     # PDFビューアー
└── lib/                  # ユーティリティ・型定義
    ├── types.ts          # TypeScript型定義
    ├── sampleData.ts     # サンプルデータ
    ├── parseExcel.ts     # Excel解析機能
    └── utils.ts          # 共通ユーティリティ
```

### 3.2 データフロー

```
1. ファイルアップロード
   ├── Excelファイル → parseExcel.ts → 在庫データ配列
   └── PDFファイル → ローカルストレージ保存

2. 照合確認
   ├── 在庫データ表示 → InventoryTable.tsx
   ├── 証明書参照 → CertificateModal.tsx
   └── 判定操作 → Accept/Reject

3. 状態管理
   ├── アップロード状態 → useState
   ├── 照合結果 → VerificationStatus
   └── チェック項目 → CheckedFields
```

## 4. 機能詳細

### 4.1 ファイルアップロード機能

**FileDropZone.tsx**
- ドラッグ&ドロップ対応
- ファイル形式検証（.xlsx, .xls, .pdf）
- 複数ファイル対応
- アップロード進捗表示

**parseExcel.ts**
- xlsxライブラリを使用したExcel解析
- ヘッダー行の自動スキップ
- 空行の除外処理
- 型安全なデータ変換

### 4.2 照合確認機能

**InventoryTable.tsx**
- 在庫データの表形式表示
- 参照ボタンによる証明書表示
- 判定状態の可視化（未確認/Accepted/Rejected）

**CertificateModal.tsx**
- 証明書データの詳細表示
- 照合項目のチェック機能
- Accept/Reject操作
- リアルタイム状態更新

**PDFViewer.tsx**
- PDF表示・操作機能
- ズーム・回転・ページ送り
- エラーハンドリング
- レスポンシブ対応

### 4.3 データ管理

**型定義（types.ts）**
```typescript
interface InventoryData {
  id: number;
  営業部名: string;
  在庫場所: string;
  在庫名称: string;
  数量: string;
  証明書ファイル: string;
  補足情報: string;
}

interface VerificationStatus {
  [rowId: number]: 'pending' | 'accepted' | 'rejected';
}
```

## 5. 画面構成

### 5.1 ホームページ（/）
- アプリケーション紹介
- 機能説明
- 開始ボタン

### 5.2 アップロードページ（/upload）
- Excelファイルアップロード
- PDFファイルアップロード
- サンプルファイルダウンロード
- 次へボタン

### 5.3 照合確認ページ（/review）
- 在庫データテーブル
- 統計情報表示
- 参照ボタン
- 判定結果表示

## 6. データ仕様

### 6.1 サンプルデータ
```
ID | 営業部名 | 在庫場所 | 在庫名称 | 数量 | 証明書ファイル
1  | Non-Ferrous Division | Toyota Logistics | Copper Pipe A | 1200kg | toyota_logistics.pdf
2  | Non-Ferrous Division | Sanyu Warehouse | Aluminum Plate C | 800kg | sanyu_warehouse.pdf
3  | Non-Ferrous Division | Nakagumi | Brass Rod B | 950kg | nakagumi.pdf
4  | Non-Ferrous Division | Toyota Logistics | Copper Scrap | 500kg | toyota_logistics2.pdf
5  | Non-Ferrous Division | Sanyu Warehouse | Copper Pipe B | 1100kg | sanyu_warehouse2.pdf
```

### 6.2 証明書データ
- 証明書番号: CERT-2025-001〜005
- 発行日: 2025-10-05
- 在庫場所: 各倉庫名
- 品目: 各在庫名称
- 数量: 各数量（ID 3のみ1500kgで不一致）
- 保管場所: Warehouse A-1F-01〜B-1F-05
- 品質: Passed
- 備考: 各補足情報

## 7. AWS構成への移行検討

### 7.1 現在の構成
- **フロントエンド**: Next.js (Static Generation)
- **ファイル保存**: ローカルストレージ
- **データ処理**: クライアントサイド
- **PDF表示**: クライアントサイド

### 7.2 AWS移行時の考慮事項

**ストレージ**
- S3: PDFファイル・Excelファイル保存
- CloudFront: 静的ファイル配信

**データベース**
- DynamoDB: 在庫データ・照合結果保存
- RDS: より複雑なデータ構造の場合

**API**
- API Gateway: RESTful API
- Lambda: サーバーレス処理
- Step Functions: ワークフロー管理

**認証・認可**
- Cognito: ユーザー管理
- IAM: 権限管理

**監視・ログ**
- CloudWatch: ログ・メトリクス
- X-Ray: 分散トレーシング

### 7.3 推奨AWS構成

```
Internet → CloudFront → S3 (Static Files)
                ↓
            API Gateway → Lambda Functions
                ↓
            DynamoDB (Data Storage)
                ↓
            S3 (File Storage)
```

## 8. セキュリティ考慮事項

### 8.1 現在の制限事項
- ファイル検証の不十分さ
- クライアントサイドでの機密データ処理
- 認証・認可機能の欠如

### 8.2 AWS移行時の改善点
- WAF: Webアプリケーションファイアウォール
- KMS: 暗号化キー管理
- Secrets Manager: 機密情報管理
- VPC: プライベートネットワーク

## 9. パフォーマンス考慮事項

### 9.1 現在の最適化
- Next.js App Routerによる最適化
- クライアントサイドレンダリング
- 画像・PDFの遅延読み込み

### 9.2 AWS移行時の最適化
- CloudFront: CDN配信
- Lambda: サーバーレス処理
- S3 Transfer Acceleration: 高速ファイル転送
- ElastiCache: キャッシュ層

## 10. 今後の拡張性

### 10.1 VLM機能統合
- Amazon Bedrock: 大規模言語モデル
- Amazon Textract: 文書解析
- Amazon Comprehend: 自然言語処理

### 10.2 リアルタイム機能
- WebSocket: リアルタイム通信
- EventBridge: イベント駆動処理
- SQS/SNS: メッセージング

### 10.3 分析・レポート機能
- QuickSight: データ可視化
- Athena: データ分析
- Glue: ETL処理

## 11. 運用・監視

### 11.1 ログ管理
- CloudWatch Logs: アプリケーションログ
- CloudTrail: API呼び出しログ
- X-Ray: 分散トレーシング

### 11.2 監視・アラート
- CloudWatch Alarms: メトリクス監視
- SNS: 通知配信
- PagerDuty: インシデント管理

### 11.3 バックアップ・災害復旧
- S3 Cross-Region Replication
- DynamoDB Global Tables
- RDS Multi-AZ

## 12. コスト最適化

### 12.1 サーバーレス構成
- Lambda: 使用量ベース課金
- API Gateway: リクエストベース課金
- DynamoDB: オンデマンド課金

### 12.2 ストレージ最適化
- S3 Intelligent Tiering: 自動階層化
- CloudFront: キャッシュ効率化
- Glacier: 長期保存

## 13. まとめ

本MOCアプリケーションは、在庫証明書照合プロセスのデモンストレーションを目的として設計されています。現在はクライアントサイドでの処理に依存していますが、AWS移行により以下のメリットが期待されます：

1. **スケーラビリティ**: サーバーレス構成による自動スケーリング
2. **セキュリティ**: AWSのセキュリティサービスによる強化
3. **可用性**: マルチAZ構成による高可用性
4. **コスト効率**: 使用量ベース課金による最適化
5. **拡張性**: VLM機能統合による高度な機能実現

AWS移行時は、段階的な移行を推奨し、まずは静的ファイルのS3移行から開始することを提案します。


