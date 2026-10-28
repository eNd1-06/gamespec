---
name: ecc-verification-loop
description: GameSpecの変更をbuild・型・lint・テスト・安全性・差分の6観点で検証し、実施と未実施を区別して報告する。明示的に $ecc-verification-loop を指定した場合に使用し、自動修正・コミット・公開処理には使用しない。
license: MIT
metadata:
  origin: affaan-m/ECC
  upstream_commit: 25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b
---

# GameSpec verification loop

ECC `verification-loop` のGameSpec向け派生版。出典・変更点は
[出典記録](../../../docs/ai/ecc-sources.md)、ライセンスは
[ECC-LICENSE](../../../third_party/ECC-LICENSE) を参照する。

## 準備と範囲

1. `AGENTS.md`、変更内容、受け入れ条件、`package.json` を確認する。
2. 作業開始時の基準コミットと現在の作業ツリーを記録する。
   PRのbaseは実際の対象ブランチを確認する。GameSpecの既定は `master`。
   `HEAD~1` が作業全体の差分だと仮定しない。
3. 変更に必要な検証を選ぶ。文書・Skillのみならアプリのbuild・型・lintは
   理由付き `NOT RUN` にできる。未実施を `PASS` にしない。
4. 既存依存だけを使う。必要なツールがなければ `BLOCKED` とし、
   自動インストール、依存更新、Hooks・MCP導入、デプロイをしない。
   この手順はコミット・push・PR・マージの許可を追加しない。

## 6つの検証観点

### 1. Build

アプリ変更が対象なら `npm run build` を実行して終了コードを記録する。
`.next/` 等の生成物や外部フォント取得が発生し得る。
実行権限・ネットワーク不足とアプリのビルドエラーを区別する。
失敗を隠して次のゲートを合格にしない。範囲外の問題を無断修正しない。

### 2. Types

既存ツールがある場合はリポジトリルートで
`./node_modules/.bin/tsc --noEmit --incremental false` を使用できる。
Next.js生成型の不足等があれば原因と未検証の範囲を記録する。
このためだけに依存導入やアプリの書き換えをしない。

### 3. Lint

`npm run lint` を使用する。`next lint` や `--fix` に置き換えない。
警告とエラー、既存問題と今回の変更由来の問題を分ける。
出力を短縮するときも実行終了コードを保持する。

### 4. Tests / Skill checks

- 実在するテストスクリプト・設定を確認してから必要なものだけ実行する。
  第1段階の基準では `test` スクリプトとE2E基盤はない。
  変更されていない限り `NOT RUN: テスト基盤未整備` と報告する。
- 80%等のカバレッジを一律必須にしない。対象と基準を決め、実測値だけを報告する。
- Skill変更ではfrontmatterの名前・説明、名前の重複、相対リンク、ライセンス、
  `agents/openai.yaml` の `allow_implicit_invocation: false` を確認する。
- 利用クライアントでの一覧認識、明示呼び出し、通常依頼での非発火を分けて確認する。
  静的検査だけで実際のモデル呼び出し成功や非発火を断定しない。
- UI変更では絞り込み、比較、詳細遷移、無効slug、モバイル、キーボードを必要に応じて確認する。
  ブラウザを使っていなければ操作確認済みと書かない。

### 5. Safety

変更範囲の秘密情報、入力境界、JSON-LD/HTML、外部URL、意図しない権限・依存の増加を確認する。
検索には `rg` を使い、`node_modules`・生成物・`.git` を対象から除く。
秘密値の一致行をそのままログに出さず、ファイル位置と要約だけを記録する。
限定的な確認を「全脆弱性なし」と表現しない。`npm audit fix` や `npm update` は実行しない。

### 6. Diff

`git status --short`、`git diff --check`、基準コミットからの差分を確認する。
ステージ済み・未ステージ・未追跡ファイルも含め、許可されたファイルだけか照合する。
アプリ無変更のタスクでは `app/`・`data/`・依存・設定が変わっていないことを確認する。
作業を保存するときも生成物・秘密値・検証用の一時ファイルを含めない。

## 報告

```text
対象コミット / 基準コミット:
観点 | PASS / FAIL / NOT RUN / BLOCKED / N/A | コマンド・対象・根拠・理由
Build:
Types:
Lint:
Tests / Skill checks:
Safety:
Diff:
残るリスク:
判定: 準備完了 / 条件付き / 未完了（何に対する判定か明記）
```

`PASS` は実施した確認が条件を満たす場合のみ。`FAIL` は確認条件を満たさない場合、
`NOT RUN` は未実施、`BLOCKED` は環境等で実施できない場合、`N/A` は適用対象外を意味する。
自動の定期実行・Hooks・自動修正ループは設定しない。
