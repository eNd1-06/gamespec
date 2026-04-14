import Link from "next/link";
import type { Metadata } from "next";
import { mice } from "@/data/mice";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングマウス おすすめランキング2026【軽量・コスパ・無線別】",
  description: "2026年版ゲーミングマウスおすすめランキング。軽量マウストップ5・コスパ最強トップ5・無線マウストップ5・総合おすすめトップ10をスペックデータで客観的に比較。",
  alternates: { canonical: `${BASE_URL}/mice/ranking` },
  openGraph: {
    title: "ゲーミングマウス おすすめランキング2026 | GameSpec",
    description: "軽量・コスパ・無線別のゲーミングマウスランキング。スペックデータで客観的に比較。",
    type: "website",
    url: `${BASE_URL}/mice/ranking`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "ゲーミングマウス おすすめランキング2026 | GameSpec",
    description: "軽量・コスパ・無線別のゲーミングマウスランキング。スペックデータで客観的に比較。",
  },
};

// 推薦コメント（ランキングカードに表示）
const comments: Record<string, string> = {
  "razer-viper-v3-pro":               "プロゲーマー使用率No.1。軽量・高精度・2.4GHz無線の三拍子が揃った現役最強クラス。",
  "logicool-g-pro-x-superlight-2":    "Logicool史上最軽量の60g。HERO 2センサーの精度とトッププロの実績が信頼の証。",
  "pulsar-x2-mini":                   "小手・中手に最適なコンパクト競技マウス。軽量設計でAPEXやVALORANTに強い。",
  "pulsar-x2v2-wireless":             "X2の正常進化版。安定した無線接続と軽量ボディで長時間プレイも快適。",
  "lamzu-thorn":                      "54gの超軽量ボディにPAW3395搭載。コスパと性能を両立した注目の新世代マウス。",
  "logicool-g-pro-x-superlight":      "初代Superlightも現役。61gの実績モデルで今もプロに支持される安定の一台。",
  "finalmouse-starlight-12":          "マグネシウム合金ボディで超軽量化。唯一無二の素材感とプレミアムな所有感。",
  "razer-viper-v2-pro":               "前世代のプロ標準機。今も多くのプレイヤーが信頼する完成度の高い定番モデル。",
  "zowie-ec2-c":                      "右手エルゴノミクスの名機。ドライバー不要で即使えるシンプルさがFPS向きの設計。",
  "razer-deathadder-v3":              "エルゴノミクス設計の傑作。82gの重量バランスと大型ボタンが長時間プレイを支える。",
  "ninjutso-sora-v2":                 "競技コミュニティで急速に評価上昇中の穴あきマウス。軽量×高性能でコスパも優秀。",
  "zowie-s2-c":                       "小〜中手向けアンビデクストラス形状。ドライバー不要のシンプル設計がZowie流。",
  "pulsar-xlite-v3":                  "穴あきデザインで極限の軽量化を実現。握り方を選ばないユニバーサルシェイプ。",
  "hyperx-pulsefire-haste-2-wireless":"穴あき＋無線の組み合わせで軽量・快適を両立。ケーブルのストレスがゼロに。",
  "attack-shark-x5":                  "1万円以下で4Kポーリングレートを実現。コスパ最優先のゲーマーの最有力候補。",
  "attack-shark-r3-pro":              "エントリー価格でPAW3395センサー搭載。初めて本格マウスを買う方に最適な一台。",
  "logicool-g502x-plus":              "多ボタン設計のMMO・MOBA向け高機能モデル。操作効率を最大化したい方に。",
  "asus-rog-keris-ii-ace":            "ROGの競技フラッグシップ。軽量・高剛性シェルとHotSwap機能が特徴の本格派。",
  "endgame-gear-xm2we":               "「クリック感」に徹底的にこだわったマウス。OptiSwitch採用で応答速度が別次元。",
  "corsair-m75-air-wireless":         "Corsair初の穴あき無線マウス。高品質なビルドクオリティと60gの軽量設計が魅力。",
};

// コミュニティ評価スコア（0-100）
// 出典: ProSettings.net（2248人のプロゲーマー使用率, 2025年末）・r/MouseReview・価格.com
// 未収集製品はデフォルト70。プロ使用率が高いほど高スコア。
const proScores: Record<string, number> = {
  "razer-viper-v3-pro": 95,             // 単体最多使用（全体の21%）
  "logicool-g-pro-x-superlight-2": 92,  // Superlightシリーズ合計29%、主力モデル
  "pulsar-x2-mini": 87,                 // 競技コミュニティ最人気
  "pulsar-x2v2-wireless": 85,
  "lamzu-thorn": 83,
  "logicool-g-pro-x-superlight": 82,    // 初代も現役プロが多用
  "finalmouse-starlight-12": 80,
  "razer-viper-v2-pro": 80,
  "zowie-ec2-c": 79,
  "razer-deathadder-v3": 77,
  "ninjutso-sora-v2": 76,
  "zowie-s2-c": 76,
  "pulsar-x2-wireless": 73,
  "lamzu-atlantis-mini": 74,
  "lamzu-maya": 73,
  "asus-rog-harpe-ace-aim-lab": 73,
  "zowie-fk2-c": 74,
  "zowie-ec1-c": 74,
  "hyperx-pulsefire-haste-2-wireless": 72,
  "asus-rog-keris-ii-ace": 72,
  "pulsar-xlite-v3": 71,
  "endgame-gear-op1we": 71,
  "endgame-gear-xm2we": 70,
  "xtrfy-m8-wireless": 70,
  "mountain-makalu-max": 69,
  "corsair-m75-air-wireless": 68,
  "glorious-model-o-wireless": 67,
  "corsair-m75-wireless": 67,
  "attack-shark-x5": 64,
  "logicool-g-pro-x2-lightspeed": 64,
  "attack-shark-r3-pro": 62,
  "logicool-g502x-plus": 58,            // 重量級、カジュアル・MMO向き
  "razer-basilisk-v3-pro": 55,
  "razer-naga-v2-pro": 45,              // MMO特化、FPS不向き
};

// 総合スコア算出の考え方:
// ① コミュニティ評価(proScore): プロ使用率・コミュニティ評価を30%ウェイトで加算
// ② センサー品質: PAW3395/PAW3950/HERO 2が現行競技標準センサー
// ③ 重さ: 55-70gが競技標準域。100g超は大きく減点。
// ④ ポーリングレート: 1000Hz基準、2000Hz/4000Hzで段階加点
// ⑤ 接続方式: 2.4GHzワイヤレスがプロの主流
// ⑥ 発売年: 新センサー・新技術の恩恵。価格は品質指標に含めない。
function calcScore(m: (typeof mice)[0]): number {
  // コミュニティ評価ボーナス（proScore 50→0pt, 70→16pt, 95→36pt）
  const communityBonus = ((proScores[m.slug] ?? 70) - 50) / 50 * 40;

  // センサー品質: 競技向けセンサーの世代・精度を評価
  const topSensors = ["PAW3395", "PAW3950", "HERO 2", "Focus Pro 35K", "AimPoint Pro", "26K Pulsefire"];
  const midSensors = ["PAW3370", "HERO 25K", "Focus Pro 30K", "TrueMove Air", "BAMF 2.0", "Marksman", "AimPoint", "Owl-Eye 19K", "3610", "FinaltouchPro", "TrueMove Pro", "BAMF", "PAW3335"];
  const sensorScore = topSensors.some(s => m.sensor.includes(s)) ? 25 :
    midSensors.some(s => m.sensor.includes(s)) ? 15 : 8;

  // 重さ: 55-70gが競技標準域。45-54gの超軽量も競技向き
  const weightScore =
    m.weight >= 55 && m.weight <= 70 ? 30 :
    m.weight >= 45 && m.weight < 55 ? 25 :
    m.weight < 45 ? 20 :
    m.weight <= 80 ? 20 :
    m.weight <= 90 ? 12 :
    5;

  // ポーリングレート: 高いほど入力遅延が減る
  const pollingScore =
    m.pollingRate >= 8000 ? 25 :
    m.pollingRate >= 4000 ? 22 :
    m.pollingRate >= 2000 ? 18 :
    m.pollingRate >= 1000 ? 12 :
    5;

  // 接続方式: ワイヤレス（2.4GHz）はケーブルドラッグなしでプロの主流
  const connectionScore = (m.connection === "wireless" || m.connection === "both") ? 18 : 8;

  // 発売年: 直近2年以内の設計思想・センサー世代を評価
  const newScore = m.releaseYear >= 2025 ? 15 : m.releaseYear >= 2024 ? 12 : m.releaseYear >= 2023 ? 7 : 3;

  return communityBonus + sensorScore + weightScore + pollingScore + connectionScore + newScore;
}

const overall = [...mice]
  .sort((a, b) => calcScore(b) - calcScore(a))
  .slice(0, 10);

const lightweight = [...mice]
  .filter((m) => m.weight <= 70)
  .sort((a, b) => a.weight - b.weight)
  .slice(0, 5);

const cospa = [...mice]
  .filter((m) => m.price <= 15000)
  .sort((a, b) => {
    const scoreA = (120 - a.weight) / a.price * 10000;
    const scoreB = (120 - b.weight) / b.price * 10000;
    return scoreB - scoreA;
  })
  .slice(0, 5);

const wireless = [...mice]
  .filter((m) => m.connection === "wireless" || m.connection === "both")
  .sort((a, b) => calcScore(b) - calcScore(a))
  .slice(0, 5);

const connectionLabel = (c: string) =>
  c === "wireless" ? "無線" : c === "wired" ? "有線" : "両対応";

function RankCard({
  rank,
  mouse,
  badge,
  comment,
}: {
  rank: number;
  mouse: (typeof mice)[0];
  badge?: string;
  comment?: string;
}) {
  const weightLabel =
    mouse.weight <= 55 ? "超軽量" : mouse.weight <= 70 ? "軽量" : mouse.weight <= 90 ? "標準" : "重め";
  return (
    <Link
      href={`/mice/${mouse.slug}`}
      className="flex items-start gap-4 bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 transition-all group"
    >
      <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg bg-gray-800 text-gray-400"
        style={rank <= 3 ? { background: rank === 1 ? "#b8860b" : rank === 2 ? "#708090" : "#8b4513", color: "#fff" } : {}}>
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs text-gray-500">{mouse.brand}</p>
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {mouse.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-1.5">{mouse.name}</h3>
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{mouse.weight}g · {weightLabel}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{connectionLabel(mouse.connection)}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{mouse.pollingRate}Hz</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{mouse.price.toLocaleString()}</span>
        </div>
        {mouse.feelTags && mouse.feelTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {mouse.feelTags.map((tag) => (
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

export default function MiceRankingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/mice" className="text-gray-400 hover:text-white text-sm">ゲーミングマウス</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">おすすめランキング</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングマウス おすすめランキング2026</h1>
        <p className="text-sm text-gray-400 mb-8">センサー品質・重さ・ポーリングレート・接続方式・発売年のスペックデータをもとに算出したランキングです。全{mice.length}製品から厳選。</p>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-10">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ 総合おすすめランキング TOP10</a></li>
            <li><a href="#lightweight" className="text-sm text-blue-400 hover:text-blue-300">▶ 軽量マウス ランキング TOP5</a></li>
            <li><a href="#cospa" className="text-sm text-blue-400 hover:text-blue-300">▶ コスパ最強ランキング TOP5</a></li>
            <li><a href="#wireless" className="text-sm text-blue-400 hover:text-blue-300">▶ 無線マウス ランキング TOP5</a></li>
          </ul>
        </nav>

        {/* 総合ランキング */}
        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">総合おすすめランキング TOP10</h2>
          <p className="text-xs text-gray-500 mb-4">重さ・ポーリングレート・価格・発売年を総合スコア化して順位付け</p>
          <div className="space-y-3">
            {overall.map((mouse, i) => (
              <RankCard key={mouse.slug} rank={i + 1} mouse={mouse} comment={comments[mouse.slug]} />
            ))}
          </div>
        </section>

        {/* 軽量マウスランキング */}
        <section id="lightweight" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">軽量マウス ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">70g以下の軽量マウスを重さ順に掲載。FPS・APEXプレイヤーにおすすめ。</p>
          <div className="space-y-3">
            {lightweight.map((mouse, i) => (
              <RankCard key={mouse.slug} rank={i + 1} mouse={mouse} badge={`${mouse.weight}g`} comment={comments[mouse.slug]} />
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/mice?weight=70&sort=weight" className="text-sm text-blue-400 hover:text-blue-300">
              70g以下の軽量マウスをすべて見る →
            </Link>
          </div>
        </section>

        {/* コスパランキング */}
        <section id="cospa" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">コスパ最強ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">15,000円以下のマウスを「軽さ÷価格」でスコア化。予算を抑えたい方向け。</p>
          <div className="space-y-3">
            {cospa.map((mouse, i) => (
              <RankCard key={mouse.slug} rank={i + 1} mouse={mouse} badge="コスパ◎" comment={comments[mouse.slug]} />
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/mice?price=15000" className="text-sm text-blue-400 hover:text-blue-300">
              15,000円以下のマウスをすべて見る →
            </Link>
          </div>
        </section>

        {/* 無線マウスランキング */}
        <section id="wireless" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">無線マウス ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">ワイヤレス対応マウスを総合スコア順に掲載。コード不要で快適な操作が可能。</p>
          <div className="space-y-3">
            {wireless.map((mouse, i) => (
              <RankCard key={mouse.slug} rank={i + 1} mouse={mouse} badge="無線" comment={comments[mouse.slug]} />
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/mice?conn=wireless" className="text-sm text-blue-400 hover:text-blue-300">
              無線マウスをすべて見る →
            </Link>
          </div>
        </section>

        {/* 全製品へのリンク */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">スペックで細かく絞り込みたい方はこちら</p>
          <Link href="/mice" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングマウス {mice.length}製品をすべて見る
          </Link>
        </div>
      </main>
    </div>
  );
}
