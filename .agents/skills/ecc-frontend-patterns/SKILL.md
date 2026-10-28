---
name: ecc-frontend-patterns
description: GameSpecのNext.js 16・React 19のUI設計、実装、レビューに使用する。明示的に $ecc-frontend-patterns を指定した場合に使用し、依存追加やアプリ全体の書き換えには使用しない。
license: MIT
metadata:
  origin: affaan-m/ECC
  upstream_commit: 25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b
---

# GameSpec frontend patterns

ECC `frontend-patterns` のGameSpec向け派生版。出典・変更点は
[出典記録](../../../docs/ai/ecc-sources.md)、ライセンスは
[ECC-LICENSE](../../../third_party/ECC-LICENSE) を参照する。

## 入力と境界

1. `AGENTS.md`、`package.json`、対象コンポーネントと呼び出し元を読む。
   要件、編集範囲、受け入れ条件を確認する。レビュー依頼では編集しない。
2. コードを書く前に `node_modules/next/dist/docs/` の関連ガイドを読む。
   不在時は対象バージョンの公式ドキュメントを確認する。一般例よりこの手順を優先する。
3. 追加依存、Hooks・MCP、外部自動実行設定を導入しない。
   現在の構成で解決できない場合は根拠付きの別提案にする。

## Next.js 16 / React 19

- App RouterのServer Componentsを基本とし、操作・状態・ブラウザAPIが必要な
  最小の境界にだけ `'use client'` を置く。静的商品データを不用意にクライアント取得へ移さない。
- 動的ルートの `params` 等は対象バージョンの非同期APIに従う。
  `metadata` / `generateMetadata` は対応するサーバー側のページ・レイアウトで扱う。
- `useSearchParams` を使う比較UIは、同梱ガイドのSuspense・静的レンダリング要件と
  既存の `compare/layout.tsx` を確認する。URLと選択状態の整合性を保つ。
- `notFound()`、静的パラメータ、未知slugの扱いを既存ルートに合わせる。
- この環境のNext.js 16は開発・ビルドともTurbopackが既定。
  bundler・キャッシュ・設定を変える場合は `02-guides/upgrading/version-16.md` 等で確認する。

## コンポーネントと状態

- 既存の `app/`、`data/`、`@/*`、Tailwind CSS 4の構成を維持する。
  propsと合成を使い、変更に必要な単位だけを分離する。
- 絞り込み・比較の状態は必要な場所に置く。導出できる値を重複してstateにしない。
  配列をsortするときはコピーし、共有の商品データを変更しない。
- hooksを条件付きで呼ばず、依存配列とクリーンアップを確認する。
  非同期処理はエラー、古い応答、アンマウント、空結果を扱う。
- 変更のたびにContext・独自取得hook・状態管理ライブラリを追加しない。
  モーダルやフォームの例を、完成した実装だと仮定しない。

## 表示性能

- 計測または明確な根拠のあるボトルネックを先に特定する。
  `useMemo` / `useCallback` / `memo` を一律に追加しない。
- 重いUIの分割、Suspense、画像寸法を検討するが、既存の表示・SEOを損なわない。
- 仮想化・アニメーション・SWR等のライブラリを例のために追加しない。
  新しいクライアント境界やバンドル増加の影響を説明する。

## フォーム・操作・アクセシビリティ

- ラベル、ボタンの名前、見出し階層、適切なHTML要素を優先する。
  placeholderをlabelの代わりにせず、エラーを入力項目と関連付ける。
- キーボード、フォーカス移動・復帰、Escape、空結果、無効なクエリを確認する。
  dialogにはフォーカス制御が必要で、ARIA属性だけで完成とはしない。
- モバイルの比較表の横スクロール・はみ出し、コントラスト、押しやすさを調べる。
- Error Boundaryを万能とせず、イベント処理・非同期処理・ルートのエラー表示を確認する。
- 商品仕様・価格・リンク先・推薦文は根拠なく変更しない。

## 出力と検証

変更意図、参照した同梱ガイド、変更ファイル、挙動への影響、境界条件を報告する。
レビューではファイル位置と再現条件を付け、事実と仮説を分ける。
必要な検証は `$ecc-verification-loop` の手順で選び、未実施を合格にしない。
このSkillはエージェントの自動起動や公開操作を行わない。
