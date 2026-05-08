# gamespec vsページ pSEO 設計書

## 現状

### vsページの実装状況
- 全9カテゴリにvsページ実装済み（`/[category]/vs/[pair]/page.tsx`）
- 合計約170ペア（カテゴリ別20ペア前後）
- Amazonアフィリエイトリンク付き
- スペック比較テーブル・勝敗ハイライト・推薦セクション・関連比較リンク

---

## vsページのテンプレート構造

```
H1: [製品A] vs [製品B] 比較【2025年】

  比較サマリー（製品カード2つ・重さ/HzなどのKey Badge）
  スペック比較テーブル（勝敗ハイライト・Amazonリンク）
  どちらを選ぶべきか？（ルールベース自動生成）
  個別ページへのリンク
  関連比較リンク（同一製品含む他ペア）
  ランキングCTA
```

### 自動生成ロジック（コードで自動判定）
- 重さ：軽い方が◎
- ポーリングレート：高い方が◎
- 価格：安い方がコスパ◎
- 接続方式：有線/無線の違いで推薦文を出し分け
- 形状：左右対称 vs エルゴノミクスで出し分け

---

## URL構造

```
/mice/vs/[slug-a]-vs-[slug-b]
/monitors/vs/[slug-a]-vs-[slug-b]
/keyboards/vs/[slug-a]-vs-[slug-b]
...（全9カテゴリ共通）
```

---

## SEOターゲット：カテゴリ別 Tier 1（最優先ペア）

### マウス（競合強め・検索量多い）
| ペア | 狙い目の理由 |
|---|---|
| Logicool G Pro X Superlight 2 vs Razer Viper V3 Pro | ゲーミングマウス2強。検索量最大 |
| Razer DeathAdder V3 vs Zowie EC2-C | エルゴノミクス定番対決 |
| Pulsar Xlite V3 vs EndGame Gear XM2we | コスパ軽量マウス比較 |
| Finalmouse Starlight-12 vs G Pro X Superlight 2 | 超軽量頂上対決 |

### モニター
| ペア | 狙い目の理由 |
|---|---|
| BenQ Zowie XL2546K vs ASUS ROG Swift PG259QN | FPS競技モニター2強 |
| ASUS ROG PG27AQDM vs LG 27GR95QE | OLED対決・急増クエリ |
| LG 27GP850-B vs MSI MAG274QRF | コスパ帯の定番比較 |

### キーボード
| ペア | 狙い目の理由 |
|---|---|
| Wooting 60HE V2 vs Razer Huntsman Mini | アナログ軸 vs 光学軸・話題性高い |
| Steelseries Apex Pro TKL vs Logicool G Pro X TKL | TKL 2強 |
| Wooting Two HE vs Steelseries Apex Pro TKL | ラピッドトリガー対決 |

### ヘッドセット
| ペア | 狙い目の理由 |
|---|---|
| SteelSeries Arctis Nova Pro vs Logicool G Pro X 2 | 高級ワイヤレス2強 |
| HyperX Cloud Alpha Wireless vs Corsair HS80 | コスパ帯で検索量多い |
| Sony INZONE H9 vs Astro A50 X | PS5ユーザー向け対決 |

### GPU（検索意図が購買直結）
| ペア | 狙い目の理由 |
|---|---|
| RTX 4070 vs RX 7700 XT | ミドルレンジ人気2強 |
| RTX 5090 vs RTX 4090 | 新旧フラグシップ・検索急増 |
| RX 9070 XT vs RTX 4070 Ti Super | RDNA4登場で比較需要増 |

---

## 内部リンク設計

- vsページ → 両製品の個別ページ（`/[category]/[slug]`）
- vsページ → 関連vsページ（同製品含む他ペア、最大6件）
- 個別製品ページ → その製品が含まれるvsページ一覧
- カテゴリ一覧ページ → vsページ一覧（`/mice/vs`）
- ランキングページ → vsページへのCTA

---

## CTA設計

### 比較テーブル下（横並び2つ）
```
[製品A] Amazonで見る →    [製品B] Amazonで見る →
```

### ページ末尾
```
[カテゴリ] ランキングを見る →
```

---

## 今後の拡張候補

### vsペアを増やすべきカテゴリ
- **マウス**：まだ増やせる（100ペア目標）
- **モニター**：解像度帯別（1080p/1440p/4K）の比較を増やす
- **GPU**：世代間比較（RTX 5070 vs RTX 4070 Tiなど）を増やす

### ガイドページが未実装のカテゴリ
- `/gpus/guide` — 未実装
- `/controllers/guide` — 未実装
- `/earphones/guide` — 未実装
- `/chairs/guide` — 未実装

### 新しいページタイプ候補
- `/mice/fps`（FPS向けマウスまとめ）— 実装済み
- `/mice/cospa`（コスパマウスまとめ）— 実装済み
- 予算別まとめページ（「1万円以下のゲーミングマウス」など）

---

## 実装済み vs 未実装

| ページタイプ | マウス | モニター | キーボード | ヘッドセット | マウスパッド | GPU | コントローラー | イヤホン | チェア |
|---|---|---|---|---|---|---|---|---|---|
| 一覧ページ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ランキング | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| vsページ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ガイドページ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| 特集ページ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
