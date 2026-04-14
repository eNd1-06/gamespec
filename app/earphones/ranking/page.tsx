import Link from "next/link";
import type { Metadata } from "next";
import { earphones } from "@/data/earphones";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングイヤホン おすすめランキング2026【有線・無線・ANC別】",
  description: "2026年版ゲーミングイヤホンおすすめランキング。有線TOP5・無線TOP5・ANC対応TOP5・総合TOP10をスペックデータで比較。",
  alternates: { canonical: `${BASE_URL}/earphones/ranking` },
  openGraph: { title: "ゲーミングイヤホン おすすめランキング2026 | GameSpec", description: "有線・無線・ANC別のゲーミングイヤホンランキング。", type: "website", url: `${BASE_URL}/earphones/ranking`, siteName: "GameSpec", locale: "ja_JP" },
  twitter: { card: "summary", title: "ゲーミングイヤホン おすすめランキング2026 | GameSpec", description: "有線・無線・ANC別のゲーミングイヤホンランキング。" },
};

// 総合スコア算出の考え方:
// ① 接続方式: 有線＝遅延ゼロで競技では最高評価。2.4GHz無線も実用上ほぼ同等。Bluetooth単体は遅延リスクで減点。
// ② 重さ: イヤホンは軽さが命。5g以下が理想。重いほど長時間使用で疲労が増す。
// ③ ドライバー方式: ダイナミック＝低音豊か・BA＝解像度高い・ハイブリッドは両方の特性。音の分離感が定位に影響。
// ④ マイク: ゲーム中のコミュニケーション必須。チームプレイなら加点要素。
// ⑤ ANCはゲーム（特にFPS）では競技上のメリットが薄いため評価しない。価格は品質指標に含めない。
function calcScore(e: (typeof earphones)[0]): number {
  // 接続方式: 遅延の観点から有線を最高評価
  const connectionScore =
    e.connection === "wired" ? 38 :
    e.connection === "both" ? 35 : // 両対応は有線も使えるため次点
    22; // wireless単体（Bluetoothは遅延リスク）

  // 重さ: イヤホンは5g以下が快適域。重さが増すほど減点
  const weightScore =
    e.weight <= 5 ? 30 :
    e.weight <= 8 ? 25 :
    e.weight <= 12 ? 18 :
    e.weight <= 20 ? 10 :
    5;

  // ドライバー方式: ゲームでの音の分離感・定位感を評価
  const driverScore =
    e.driver === "ハイブリッド型" ? 15 :
    e.driver === "BA型" ? 12 :
    e.driver === "ダイナミック型" ? 10 :
    8;

  // マイク: チームプレイ必須装備
  const micScore = e.microphone ? 10 : 0;

  // 発売年
  const newScore = e.releaseYear >= 2025 ? 7 : e.releaseYear >= 2024 ? 5 : e.releaseYear >= 2023 ? 3 : 1;

  return connectionScore + weightScore + driverScore + micScore + newScore;
}

const overall = [...earphones].sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 10);
const wired = [...earphones].filter((e) => e.connection === "wired").sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);
const wireless = [...earphones].filter((e) => e.connection !== "wired").sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);
const ancTop = [...earphones].filter((e) => e.anc).sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);

const connectionLabel = (c: string) => c === "wireless" ? "無線" : c === "wired" ? "有線" : "両対応";

const comments: Record<string, string> = {
  "final-vr3000": "ゲーミング特化設計のFinal製イヤホン。広い音場と定位感の良さでFPSに強い。",
  "razer-moray": "Razer初の有線ゲーミングイヤホン。THX認定の音質で足音の方向感が明確。",
  "kz-zs10-pro-x": "5ドライバー構成で驚異的なコスパ。3,000円台でハイエンド並みのサウンドを体験。",
  "shure-se215": "老舗オーディオブランドのエントリー機。高い遮音性と安定した装着感でゲーム集中に最適。",
  "sony-wf-1000xm5": "業界最高クラスのANC搭載TWS。没入感と音質の両立でゲームと音楽を最高品質で楽しめる。",
  "steelseries-tusq": "純正ゲーミングマイク内蔵イヤホン。コンパクトながらDiscord認定の通話品質を確保。",
};

function RankCard({ rank, earphone, badge, comment }: { rank: number; earphone: (typeof earphones)[0]; badge?: string; comment?: string }) {
  return (
    <Link href={`/earphones/${earphone.slug}`} className="flex items-start gap-4 bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 transition-all group">
      <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg bg-gray-800 text-gray-400"
        style={rank <= 3 ? { background: rank === 1 ? "#b8860b" : rank === 2 ? "#708090" : "#8b4513", color: "#fff" } : {}}>
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs text-gray-500">{earphone.brand}</p>
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {earphone.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-1.5">{earphone.name}</h3>
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{connectionLabel(earphone.connection)}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{earphone.driver}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{earphone.weight}g</span>
          {earphone.anc && <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">ANC</span>}
          {earphone.batteryLife && <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{earphone.batteryLife}h</span>}
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{earphone.price.toLocaleString()}</span>
        </div>
        {earphone.feelTags && earphone.feelTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {earphone.feelTags.map((tag) => (
              <span key={tag} className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        )}
        {comment && (
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">{comment}</p>
        )}
      </div>
    </Link>
  );
}

export default function EarphonesRankingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/earphones" className="text-gray-400 hover:text-white text-sm">ゲーミングイヤホン</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">おすすめランキング</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングイヤホン おすすめランキング2026</h1>
        <p className="text-sm text-gray-400 mb-8">接続方式・重さ・ドライバー・マイク・発売年のスペックデータをもとに算出。全{earphones.length}製品から厳選。</p>
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-10">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ 総合おすすめランキング TOP10</a></li>
            <li><a href="#wired" className="text-sm text-blue-400 hover:text-blue-300">▶ 有線イヤホン ランキング TOP5</a></li>
            <li><a href="#wireless" className="text-sm text-blue-400 hover:text-blue-300">▶ 無線イヤホン ランキング TOP5</a></li>
            <li><a href="#anc" className="text-sm text-blue-400 hover:text-blue-300">▶ ANC対応イヤホン TOP5</a></li>
          </ul>
        </nav>
        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">総合おすすめランキング TOP10</h2>
          <p className="text-xs text-gray-500 mb-4">接続方式・重さ・ドライバー方式・マイク・発売年を総合スコア化して順位付け</p>
          <div className="space-y-3">{overall.map((e, i) => <RankCard key={e.slug} rank={i + 1} earphone={e} comment={comments[e.slug]}/>)}</div>
        </section>
        <section id="wired" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">有線イヤホン ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">遅延ゼロで安定した音質。FPSや競技ゲームで足音を正確に聞き取りたい方向け。</p>
          <div className="space-y-3">{wired.map((e, i) => <RankCard key={e.slug} rank={i + 1} earphone={e} badge="有線" comment={comments[e.slug]}/>)}</div>
        </section>
        <section id="wireless" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">無線イヤホン ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">コードなしで自由に動ける。低遅延モデルならゲームでも快適。</p>
          <div className="space-y-3">{wireless.map((e, i) => <RankCard key={e.slug} rank={i + 1} earphone={e} badge="無線" comment={comments[e.slug]}/>)}</div>
        </section>
        <section id="anc" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">ANC対応イヤホン TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">アクティブノイズキャンセリングで周囲の騒音を遮断。集中してゲームに臨める。</p>
          <div className="space-y-3">{ancTop.map((e, i) => <RankCard key={e.slug} rank={i + 1} earphone={e} badge="ANC" comment={comments[e.slug]}/>)}</div>
        </section>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">スペックで細かく絞り込みたい方はこちら</p>
          <Link href="/earphones" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">ゲーミングイヤホン {earphones.length}製品をすべて見る</Link>
        </div>
      </main>
    </div>
  );
}
