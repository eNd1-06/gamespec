import Link from "next/link";
import type { Metadata } from "next";
import { headsets } from "@/data/headsets";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングヘッドセット おすすめランキング2026【無線・軽量・ANC別】",
  description: "2026年版ゲーミングヘッドセットおすすめランキング。軽量TOP5・無線TOP5・ANC対応TOP5・総合おすすめTOP10をスペックデータで比較。",
  alternates: { canonical: `${BASE_URL}/headsets/ranking` },
  openGraph: {
    title: "ゲーミングヘッドセット おすすめランキング2026 | GameSpec",
    description: "軽量・無線・ANC別のゲーミングヘッドセットランキング。スペックデータで客観的に比較。",
    type: "website",
    url: `${BASE_URL}/headsets/ranking`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "ゲーミングヘッドセット おすすめランキング2026 | GameSpec",
    description: "軽量・無線・ANC別のゲーミングヘッドセットランキング。スペックデータで客観的に比較。",
  },
};

// コミュニティ評価スコア（0-100）
// 出典: ProSettings.net（2251人プロゲーマー使用データ, 2025年末）・rtings.com・価格.com
// Razer BlackShark V2 Proが2025年#1最多使用（HyperX Cloud IIに10%以上の差）。
const proScores: Record<string, number> = {
  "razer-blackshark-v2-pro": 93,         // 2025年#1最多使用（単体・ブランド両方でリード）
  "steelseries-arctis-nova-pro-wireless": 84, // プレミアム最高機能、高評価
  "steelseries-arctis-nova-7": 80,       // コスパ高評価、コミュニティ人気
  "hyperx-cloud-alpha-wireless": 77,     // HyperX系で安定した評価
  "sony-inzone-h9": 74,
  "logicool-g-pro-x-2-lightspeed": 74,   // Logicoolはシェア低下傾向
  "astro-a50-x": 70,
  "corsair-hs80-rgb-wireless": 66,
  "steelseries-arctis-nova-pro": 80,
};

// 総合スコア算出の考え方:
// ① コミュニティ評価(proScore): ProSettings.netプロ使用率を約30%ウェイトで加算
// ② 重さ: 長時間装着の快適性に直結。ヘッドセットは300g台でも許容範囲。
// ③ バーチャルサラウンド: FPSでの足音・銃声の定位感に直結。最重要音響機能。
// ④ 接続品質: 2.4GHzワイヤレスは有線と同等。Bluetooth単体は遅延リスク。
// ⑤ ANCはゲーム向けでは加点しない。発売年・マイクを補助指標として評価。
function calcScore(h: (typeof headsets)[0]): number {
  // コミュニティ評価ボーナス（proScore 50→0pt, 70→16pt, 93→34.4pt）
  const communityBonus = ((proScores[h.slug] ?? 70) - 50) / 50 * 40;

  // 重さ: 250g以下が最高、350g以下を合格ライン（ヘッドセットは300g台が標準）
  const weightScore =
    h.weight <= 250 ? 35 :
    h.weight <= 300 ? 28 :
    h.weight <= 350 ? 22 :
    h.weight <= 400 ? 14 :
    6;

  // バーチャルサラウンド: FPSでの定位感に最重要
  const surroundScore = h.virtualSurround ? 25 : 0;

  // 接続品質: 2.4GHz無線=有線同等、Bluetooth単体は遅延リスクで評価落とす
  const connectionScore =
    h.connection === "wired" ? 20 :
    h.wirelessProtocol?.includes("2.4GHz") ? 22 : // 2.4GHz専用は有線より僅かに上
    12; // Bluetooth単体

  // マイク付きは汎用性ボーナス
  const micScore = h.microphone ? 8 : 0;

  // 発売年
  const newScore = h.releaseYear >= 2025 ? 10 : h.releaseYear >= 2024 ? 7 : h.releaseYear >= 2023 ? 4 : 1;

  return communityBonus + weightScore + surroundScore + connectionScore + micScore + newScore;
}

const overall = [...headsets].sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 10);
const lightweight = [...headsets].sort((a, b) => a.weight - b.weight).slice(0, 5);
const wirelessTop = [...headsets].filter((h) => h.connection !== "wired").sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);
const ancTop = [...headsets].filter((h) => h.anc).sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);

const connectionLabel = (c: string) => c === "wireless" ? "無線" : c === "wired" ? "有線" : "両対応";

function RankCard({ rank, headset, badge }: { rank: number; headset: (typeof headsets)[0]; badge?: string }) {
  return (
    <Link
      href={`/headsets/${headset.slug}`}
      className="flex items-start gap-4 bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 transition-all group"
    >
      <div
        className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg bg-gray-800 text-gray-400"
        style={rank <= 3 ? { background: rank === 1 ? "#b8860b" : rank === 2 ? "#708090" : "#8b4513", color: "#fff" } : {}}
      >
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs text-gray-500">{headset.brand}</p>
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {headset.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{headset.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{headset.weight}g</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{connectionLabel(headset.connection)}</span>
          {headset.batteryLife && <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">バッテリー{headset.batteryLife}h</span>}
          {headset.anc && <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">ANC</span>}
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{headset.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function HeadsetsRankingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/headsets" className="text-gray-400 hover:text-white text-sm">ゲーミングヘッドセット</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">おすすめランキング</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングヘッドセット おすすめランキング2026</h1>
        <p className="text-sm text-gray-400 mb-8">重さ・無線・ANC・価格・発売年のスペックデータをもとに客観的に算出したランキング。全{headsets.length}製品から厳選。</p>

        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-10">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ 総合おすすめランキング TOP10</a></li>
            <li><a href="#lightweight" className="text-sm text-blue-400 hover:text-blue-300">▶ 軽量ヘッドセット ランキング TOP5</a></li>
            <li><a href="#wireless" className="text-sm text-blue-400 hover:text-blue-300">▶ 無線ヘッドセット ランキング TOP5</a></li>
            <li><a href="#anc" className="text-sm text-blue-400 hover:text-blue-300">▶ ANC対応ヘッドセット ランキング TOP5</a></li>
          </ul>
        </nav>

        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">総合おすすめランキング TOP10</h2>
          <p className="text-xs text-gray-500 mb-4">重さ・無線対応・ANC・価格・発売年を総合スコア化して順位付け</p>
          <div className="space-y-3">
            {overall.map((h, i) => <RankCard key={h.slug} rank={i + 1} headset={h} />)}
          </div>
        </section>

        <section id="lightweight" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">軽量ヘッドセット ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">長時間ゲームでも頭・首への負担が少ない軽量モデル。重さ順に掲載。</p>
          <div className="space-y-3">
            {lightweight.map((h, i) => <RankCard key={h.slug} rank={i + 1} headset={h} badge={`${h.weight}g`} />)}
          </div>
        </section>

        <section id="wireless" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">無線ヘッドセット ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">ケーブル不要で自由に動ける。2.4GHzの低遅延モデルならFPS・APEXでも使える。</p>
          <div className="space-y-3">
            {wirelessTop.map((h, i) => <RankCard key={h.slug} rank={i + 1} headset={h} badge="無線" />)}
          </div>
        </section>

        <section id="anc" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">ANC対応ヘッドセット ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">アクティブノイズキャンセリング搭載。周囲の騒音を遮断して集中できる環境に。</p>
          <div className="space-y-3">
            {ancTop.map((h, i) => <RankCard key={h.slug} rank={i + 1} headset={h} badge="ANC" />)}
          </div>
        </section>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">スペックで細かく絞り込みたい方はこちら</p>
          <Link href="/headsets" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングヘッドセット {headsets.length}製品をすべて見る
          </Link>
        </div>
      </main>
    </div>
  );
}
