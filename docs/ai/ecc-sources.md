# ECC由来Skillsの出典とレビュー

## 固定した出典

- 上流: [affaan-m/ECC](https://github.com/affaan-m/ECC)
- 確認したコミット: `25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b`
- ライセンス: MIT、Copyright (c) 2026 Affaan Mustafa。
  [上流LICENSE](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/LICENSE) の全文を
  [third_party/ECC-LICENSE](../../third_party/ECC-LICENSE) に保持する。
- この3 SkillsはGameSpec用の派生・再構成版。ECC公式プラグインのインストールではない。
  上流の全機能・全ファイルの安全性を保証するものでもない。

| 上流の全文レビュー対象 | GameSpecの配置先 |
| --- | --- |
| [skills/seo/SKILL.md](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/skills/seo/SKILL.md) | [.agents/skills/ecc-seo/SKILL.md](../../.agents/skills/ecc-seo/SKILL.md) |
| [skills/frontend-patterns/SKILL.md](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/skills/frontend-patterns/SKILL.md) | [.agents/skills/ecc-frontend-patterns/SKILL.md](../../.agents/skills/ecc-frontend-patterns/SKILL.md) |
| [skills/verification-loop/SKILL.md](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/skills/verification-loop/SKILL.md) | [.agents/skills/ecc-verification-loop/SKILL.md](../../.agents/skills/ecc-verification-loop/SKILL.md) |

原文のfrontmatter、全見出し、コード例、末尾の関連項目まで全文をレビューした。
原文は資料として読み、記載されたコマンドをレビューのために実行していない。

取得したUTF-8原文のSHA-256（末尾改行を含む）:

| 原文 | SHA-256 |
| --- | --- |
| `skills/seo/SKILL.md` | `4b744d2ff5c9313e903e4e5139322cc98adb9f9778a7231d4826216ab0f6873a` |
| `skills/frontend-patterns/SKILL.md` | `a5b971eb9e74cd763c7e3308bfd888e0d9cf69f8b88477659889d77182479740` |
| `skills/verification-loop/SKILL.md` | `5b06be54d4852f60e6cf1b04c6e9a4748554334eb3e41af6c0959b544e6464ae` |
| `LICENSE` | `326146379f01bb137c0a5d3c54770c1aa31076705c8b88a7f6b26a460f6221b2` |

## 共通の調整

- 名前を `ecc-` で始め、上流Skillや個人設定との衝突を避ける。
- 日本語のGameSpec用ワークフローへ再構成。単なる全文コピーではない。
- 新規の `agents/openai.yaml` に `allow_implicit_invocation: false` を指定。
  スクリプト、外部ツール依存、Hooks、MCP、Codex設定、エージェント定義は含めない。
- 元のSkill名・固定SHA・MITライセンスを各frontmatterと本文から参照可能にする。
- Skillは実行権限を追加しない。未導入ツールの自動取得、無断の外部操作、
  エージェント自動委任を行わない。

## seo: レビューと変更点

| 原文の対象 | 判断・GameSpecでの変更 |
| --- | --- |
| 用途・原則 | 技術的障害、検索意図、実ページに基づく提案を維持。監査を既定にする |
| Crawlability / Indexability | canonical・robots・sitemapを維持。比較クエリ、vsペア、未知slug、更新日の根拠を追加 |
| Performance | 実測を前提とし、コード読解から数値を捏造しない。ラボと実ユーザー計測を区別 |
| Structured data | 表示との一致を維持。価格・在庫・評価の根拠、JSON-LDの安全な埋め込み、検索表示の適格性確認を追加 |
| Title / Description / Headings | 内容と階層を維持。英語の50–60/120–160文字目安の一律適用を外す |
| Keyword mapping / Internal linking | 検索意図・重複・内部リンクを維持。検索需要の未確認情報を仮説と明記 |
| Examples / Audit output / Anti-patterns | 汎用Article例と `src/routes/` の例を除き、GameSpecのファイル位置・根拠・検証状態を報告 |
| Related Skills | 未導入の `seo-specialist`、`brand-voice`、`market-research` への依存を除く。`seo-specialist` は別のエージェント定義 |

## frontend-patterns: レビューと変更点

| 原文の対象 | 判断・GameSpecでの変更 |
| --- | --- |
| 用途・Composition / Compound / Render props | コンポーネント合成を維持。汎用Market例・クライアント取得例を省き、Server Componentsを基本にする |
| Toggle / Async fetch / Debounce hooks | hooksの規則、依存、クリーンアップ、非同期競合を確認する手順へ整理。独自取得hookのコピーを要求しない |
| Context + Reducer | 状態の配置・導出・不変性を維持。Context導入を必須にしない |
| Memoization / Splitting / Virtualization | 根拠に基づく最適化を維持。追加依存が必要な仮想化例と一律のmemo化を外す |
| Forms / Error Boundary | 入力・エラーの観点を維持。非同期・イベント処理の限界とアクセシブルなラベルを追加 |
| Framer Motion | 未導入ライブラリのアニメーション例を除く |
| Keyboard / Focus management | 操作・フォーカスを維持。不完全なdialog等の例を完成形と誤認しないよう明記 |
| Next.js固有部分 | 同梱ガイド優先、非同期params、metadata、useSearchParams/Suspense、Turbopack、既存app/data構成を追加 |

## verification-loop: レビューと変更点

| 原文の対象 | 判断・GameSpecでの変更 |
| --- | --- |
| Build / Types / Lint | 6観点を維持。npm・既存ローカルtsc・ESLintに限定。Python/pnpm例と出力短縮パイプを除く |
| Tests / Coverage | 存在しないtestスクリプトを実行しない。固定80%基準を外し、未整備と未実行を明記する |
| Security grep | `src/` 前提・広範なgrepを除き、変更範囲をrgで確認。秘密値をログに表示しない |
| Diff review | `HEAD~1` 前提を除き、実際の基準コミット、ステージ済み・未ステージ・未追跡を対象にする |
| Report | PASS/FAILに加えNOT RUN/BLOCKED/N/Aと理由・範囲を記録。部分確認を包括的安全性と表現しない |
| Continuous / Hooks | 15分ごとの実行、`/verify`、PostToolUse連携を除く。明示呼び出しのみ |

## 参照した互換性資料

- [既存AGENTS.md](../../AGENTS.md) のNext.jsルールをそのまま保持する。
- インストール済みNext.js 16.2.2の `node_modules/next/dist/docs/`:
  `01-app/02-guides/upgrading/version-16.md`、`01-app/02-guides/json-ld.md`、
  `01-app/03-api-reference/04-functions/generate-metadata.md`。
- [OpenAI Skills仕様](https://developers.openai.com/codex/skills):
  `.agents/skills/` の認識と `agents/openai.yaml` の明示呼び出しポリシー。

更新は自動追従しない。新しい上流コミットの全文・差分・参照先を再レビューし、
ライセンス、変更理由、クライアントでの認識結果を更新する。
