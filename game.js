// ========================================
// 鉱山探索ゲーム
// STEP 4-5
// 第2層「旧坑道」初期実装
//
// STEP 4-4
//
// STEP 3-35＝基本版完成
//
// STEP 4追加：
// ・5層構成の基礎
// ・第2層解放研究
// ・資料室
// ・鉱物図鑑
// ・アイテム図鑑
// ・開発モード
//
// STEP 4-3：
// ・新規開始は鉱山Lv1のみ解放
// ・鉱山Lv2解放条件追加
// ・帰還確認：Enter決定 / Space閉じる
// ・階段確認：Enter決定 / Space閉じる
// ・拠点UIをコンパクト化
//
// STEP 4-4：
// ・拠点に電光掲示板追加
// ・通常時は挨拶 / 激励 / 安全標語
// ・第2層フラグ進行で異常メッセージ混入
// ・第2層では一部文字欠損 / 未知言語化
// ・第3層では現実側らしき通信を受信
// ・第4層では警告 / 脅迫文
// ・第5層では掲示板破損 / 表示停止
//
// 正式階層名：
//
// 第1層　通常鉱山
// 第2層　旧坑道
// 第3層　無風回廊
// 第4層　残光遺跡
// 第5層　虚夜空間
//
// 現在、第2層「旧坑道」は実装済み。
// 第3～5層は未実装。開発モードでは枠のみ確認可能。
// ========================================


// ========================================
// 開発モード
// ========================================

const DEV_MODE = true;


// ========================================
// 基本設定
// ========================================

const MAP_SIZE = 20;

const VISION_RADIUS = 2;

const MOVE_REPEAT_DELAY = 300;

const MINING_HP_COST = 0.1;

const POTION_HEAL_AMOUNT = 2;

const HEALTH_BOOST_AMOUNT = 1;

const DETECTOR_RADIUS = 7;

const MAX_MINE_LEVEL = 100;

const PICKAXE_MAX_LEVEL = 999;

const BASE_MAX_LEVEL = 10;

const BASE_HP_GAIN = 2;


// ========================================
// 電光掲示板
// ========================================

const BASE_TICKER_INTERVAL = 9000;


// ========================================
// 通常時メッセージ
// ========================================

const BASE_TICKER_NORMAL_MESSAGES = [

    "GOOD LUCK, MINER.　本日も安全な採掘を。",

    "採掘員各位へ。成果よりも無事な帰還を優先してください。",

    "今日も良い採掘を。足元と周囲の安全確認を忘れずに。",

    "鉱山管理局より、すべての採掘員へ。ご安全に。",

    "焦らず、欲張らず、帰還地点を確認してから探索しましょう。",

    "WELCOME, MINER.　あなたの無事な帰還をお待ちしています。",

    "ツルハシの状態を確認しましたか？　準備を整えて出発しましょう。",

    "採掘は一日にして成らず。今日も一歩ずつ深部へ。",

    "安全第一。危険を感じたら迷わず帰還してください。",

    "GOOD DAY, MINER.　今日の鉱脈があなたに幸運をもたらしますように。"

];


// ========================================
// 異常反応検出後
// ========================================

const BASE_TICKER_ANOMALY_MESSAGES = [

    "GOOD LUCK, MINER.　本日も安全な採掘を。",

    "採掘員各位へ。成果よりも無事な帰還を優先してください。",

    "深部観測装置に軽微な誤差を確認。探索への影響はありません。",

    "未登録区画を発見した場合は、立ち入らず管理局へ報告してください。",

    "最深部の深度記録に不整合があります。現在確認中です。",

    "本日の採掘業務に異常はありません。繰り返します。異常はありません。",

    "帰還地点の位置情報に一時的な揺らぎを確認しました。",

    "鉱山管理局より――下層設備の点検予定はありません。",

    "現在確認されている鉱山はすべて管理区域内です。",

    "知らない通路を見つけても、その先を確認しないでください。"

];


// ========================================
// 共鳴確認後
// ========================================

const BASE_TICKER_RESONANCE_MESSAGES = [

    "GOOD LUCK, MINER.　今日も無事な帰還を。",

    "神鋼鉱保管庫より微弱な振動を検出しています。",

    "最深部の反応と神鋼鉱の波形が一致しました。",

    "これは設備故障ではありません。",

    "深度記録：100　／　観測深度：――",

    "下層への通路は存在しません。",

    "下層への通路は存在しません。",

    "……本当に？",

    "採掘員各位へ。最深部で聞こえる音について報告する必要はありません。",

    "GOOD LUCK, MINE――　通信にノイズを検出しました。"

];


// ========================================
// 研究開始後
// ========================================

const BASE_TICKER_RESEARCH_MESSAGES = [

    "異常反応解析中……接続点を検索しています。",

    "GOOD LUCK, MINER.　帰還を最優先してください。",

    "未確認反応は既知の地質構造と一致しません。",

    "鉱山の下に鉱山はありません。",

    "反応源までの距離を算出できません。",

    "深度：ERROR　座標：ERROR　接続：WAITING",

    "神鋼鉱を追加してください。反応がこちらを――",

    "観測装置が存在しない信号を受信しています。",

    "採掘員各位へ。掲示板に異常な文章が表示された場合は無視してください。",

    "この文章を読んでいる場合、掲示板は正常に動作しています。"

];


// ========================================
// 条件判明後
// ========================================

const BASE_TICKER_REQUIREMENT_MESSAGES = [

    "接続条件を確認。未確認領域への経路を算出しました。",

    "GOOD LUCK, MINER.　帰還を最優先してください。",

    "接続先の地質情報を取得できません。",

    "接続先の気圧情報を取得できません。",

    "接続先の座標情報を取得できません。",

    "接続先は鉱山管理局の登録区域外です。",

    "警告：接続後の安全は保証されません。",

    "――そこは本当に地下ですか？",

    "接続装置待機中。",

    "帰還を最優先してください。帰還を最優先してください。帰還を最優先してください。"

];


// ========================================
// 第2層：旧坑道
// ========================================

const BASE_TICKER_LAYER2_MESSAGES = [

    "G□□D LUCK, M▩NER.　本日も安全な採掘を。",

    "採掘員各位へ。成果よりも無事な帰還を優先し▧▧▧",

    "WELCOME, MINE▓.　あなたの無事な帰還をお待ちしていま――",

    "⟟⋏⍀　⌇⏃⎎⟒　⍀⟒⏁⎍⍀⋏",

    "旧坑道区域　安全確認：██％",

    "鉱山管理局より、すべての採掘員へ。ご安▧▧に。",

    "足元と周囲の安全確認を忘れずに。忘れずに。忘れずに。",

    "帰還地点を確認してください。帰還地点を確認してください。帰還地点はどこですか。",

    "⋏⍜　⍀⟒⏁⎍⍀⋏　⋏⍜　⍀⟒⏁⎍⍀⋏",

    "GOOD LUCK, ▓▓▓▓▓.　今日も良い採掘を。"

];


// ========================================
// 第3層：無風回廊
// ========================================

const BASE_TICKER_LAYER3_MESSAGES = [

    "……聞こえる？",

    "もし聞こえているなら返事をして",

    "お願い　起きて",

    "ここから出して",

    "まだ眠ってる",

    "聞こえる？　こっちは――",

    "██県██市――信号が途切れています",

    "お願いだから目を覚まして",

    "声が届いているなら……",

    "あなたはそこにいない",

    "そこは鉱山じゃない",

    "――SIGNAL LOST――",

    "たすけ――",

    "聞こえ……る……？",

    "起きて　起きて　起きて――"
];


// ========================================
// 第4層：残光遺跡
// ========================================

const BASE_TICKER_LAYER4_MESSAGES = [

    "警告　これ以上進むな",

    "引き返せ",

    "出口を探すな",

    "お前はここにいるべきだ",

    "帰還するな",

    "こちらを見るな",

    "見つけた",

    "もう遅い",

    "起きるな",

    "忘れろ",

    "警告　警告　警告　警告　警告",

    "お前が掘っているのは壁ではない",

    "その先に出口はない",

    "帰れない",

    "進むな",

    "目を覚ますな"
];


// ========================================
// 世界・階層
// ========================================

const MAX_WORLD_LAYER = 5;


const WORLD_LAYER_DATA = {

    1: {
        id: "normalMine",
        name: "通常鉱山",
        implemented: true
    },

    2: {
        id: "oldTunnel",
        name: "旧坑道",
        implemented: true
    },

    3: {
        id: "windlessCorridor",
        name: "無風回廊",
        implemented: false
    },

    4: {
        id: "afterglowRuins",
        name: "残光遺跡",
        implemented: false
    },

    5: {
        id: "hollowNightSpace",
        name: "虚夜空間",
        implemented: false
    }
};


// ========================================
// 第2層研究条件
// ========================================

const LAYER2_RESONANCE_REQUIREMENT = 1;

const LAYER2_RESEARCH_REQUIREMENT = 10;

const LAYER2_REQUIREMENTS_REVEAL = 30;


// ========================================
// 第2層最終接続条件
// ========================================

const LAYER2_UNLOCK_GODSTEEL = 100;

const LAYER2_UNLOCK_MONEY = 1000000;


// ========================================
// 開発用鉱石付与数
// ========================================

const DEV_ORE_AMOUNT = 999;


// ========================================
// セーブ
// ========================================

const SAVE_KEY =
    "miningGameSave_STEP_3_34";

const SAVE_VERSION = 6;


// ========================================
// 本番設定
// ========================================

const TEST_FULL_MAP_REVEAL = false;

const TEST_SHOW_ROCKFALL = false;


// ========================================
// 宝箱
// ========================================

const TREASURE_CHEST_SPAWN_RATE = 0.30;


// ========================================
// 宝箱爆発
// ========================================

const TREASURE_EXPLOSION_RATE = 0.05;

const TREASURE_EXPLOSION_DAMAGE_PERCENT = 0.18;

const TREASURE_EXPLOSION_DAMAGE_MIN = 2;


// ========================================
// ランダムイベント
// ========================================

const RANDOM_EVENT_SPAWN_RATE = 0.35;

const HEALING_POINT_PERCENT = 0.25;

const HEALING_POINT_MIN = 2;

const ROCKFALL_DAMAGE_PERCENT = 0.12;

const ROCKFALL_DAMAGE_MIN = 1;


// ========================================
// 鉱石データ
// ========================================

const ORE_TYPES = [

    {
        id: "iron",
        name: "鉄鉱石",
        unlockLevel: 1,
        minHp: 8,
        maxHp: 12,
        sellPrice: 10,
        weight: 55,
        color: "#b8b8b8"
    },

    {
        id: "copper",
        name: "銅鉱石",
        unlockLevel: 1,
        minHp: 12,
        maxHp: 18,
        sellPrice: 25,
        weight: 45,
        color: "#d88752"
    },

    {
        id: "silver",
        name: "銀鉱石",
        unlockLevel: 1,
        minHp: 18,
        maxHp: 25,
        sellPrice: 80,
        weight: 30,
        color: "#d9e1e8"
    },

    {
        id: "gold",
        name: "金鉱石",
        unlockLevel: 3,
        minHp: 28,
        maxHp: 36,
        sellPrice: 180,
        weight: 25,
        color: "#ffd700"
    },

    {
        id: "platinum",
        name: "白金鉱石",
        unlockLevel: 10,
        minHp: 40,
        maxHp: 52,
        sellPrice: 400,
        weight: 22,
        color: "#e5e4e2"
    },

    {
        id: "mithril",
        name: "ミスリル鉱石",
        unlockLevel: 20,
        minHp: 55,
        maxHp: 70,
        sellPrice: 900,
        weight: 20,
        color: "#9ee7ff"
    },

    {
        id: "orichalcum",
        name: "オリハルコン鉱石",
        unlockLevel: 30,
        minHp: 72,
        maxHp: 90,
        sellPrice: 2000,
        weight: 18,
        color: "#ffb347"
    },

    {
        id: "adamantite",
        name: "アダマンタイト鉱石",
        unlockLevel: 40,
        minHp: 92,
        maxHp: 115,
        sellPrice: 4500,
        weight: 17,
        color: "#7ddf90"
    },

    {
        id: "obsidianCrystal",
        name: "黒曜晶鉱",
        unlockLevel: 50,
        minHp: 118,
        maxHp: 145,
        sellPrice: 9000,
        weight: 16,
        color: "#a48bff"
    },

    {
        id: "starSilver",
        name: "星銀鉱石",
        unlockLevel: 60,
        minHp: 148,
        maxHp: 180,
        sellPrice: 18000,
        weight: 15,
        color: "#c8f4ff"
    },

    {
        id: "dragonCrystal",
        name: "竜晶鉱",
        unlockLevel: 70,
        minHp: 185,
        maxHp: 225,
        sellPrice: 36000,
        weight: 14,
        color: "#ff6b6b"
    },

    {
        id: "heavenCrystal",
        name: "天晶鉱",
        unlockLevel: 80,
        minHp: 230,
        maxHp: 275,
        sellPrice: 75000,
        weight: 13,
        color: "#fff2a8"
    },

    {
        id: "voidCrystal",
        name: "虚空晶鉱",
        unlockLevel: 90,
        minHp: 285,
        maxHp: 340,
        sellPrice: 160000,
        weight: 12,
        color: "#db76ff"
    },

    {
        id: "godSteel",
        name: "神鋼鉱",
        unlockLevel: 100,
        minHp: 360,
        maxHp: 430,
        sellPrice: 400000,
        weight: 10,
        color: "#ffffff"
    }

];


// ========================================
// アイテム図鑑データ
// ========================================

const ITEM_DATA = [

    {
        id: "potion",
        name: "回復薬",
        description: "HPを2回復する。"
    },

    {
        id: "returnFeather",
        name: "帰還の羽",
        description: "探索中に拠点へ安全に帰還する。"
    },

    {
        id: "detector",
        name: "探知機",
        description: "周囲15×15マスを探知する。"
    },

    {
        id: "healthBoost",
        name: "体力強化",
        description: "最大HPを1増加させる。"
    }

];


// ========================================
// クラフトレシピ
// ========================================

const CRAFT_RECIPES = [

    {
        id: "potion",
        name: "回復薬",
        description: "HPを2回復する。",
        amount: 1,
        unlockBaseLevel: 1,
        unlockMineLevel: 1,

        ores: {
            iron: 3,
            copper: 2
        }
    },

    {
        id: "returnFeather",
        name: "帰還の羽",
        description: "探索中に拠点へ帰還できる。",
        amount: 1,
        unlockBaseLevel: 2,
        unlockMineLevel: 3,

        ores: {
            silver: 3,
            gold: 1
        }
    },

    {
        id: "detector",
        name: "探知機",
        description: "周囲15×15マスを探知する。",
        amount: 1,
        unlockBaseLevel: 3,
        unlockMineLevel: 5,

        ores: {
            copper: 5,
            silver: 2
        }
    },

    {
        id: "healthBoost",
        name: "体力強化",
        description: "最大HPを1増加させる。",
        amount: 1,
        unlockBaseLevel: 5,
        unlockMineLevel: 10,

        ores: {
            gold: 5,
            platinum: 2
        }
    }

];


// ========================================
// 鉱石取得
// ========================================

function getOreTypeById(id) {

    return ORE_TYPES.find(
        function(type) {
            return type.id === id;
        }
    );
}


// ========================================
// アイテム取得
// ========================================

function getItemDataById(id) {

    return ITEM_DATA.find(
        function(item) {
            return item.id === id;
        }
    );
}


// ========================================
// 階層データ取得
// ========================================

function getWorldLayerData(level) {

    return WORLD_LAYER_DATA[level] || null;
}


// ========================================
// 出現可能鉱石
// ========================================

function getAvailableOreTypes(level) {

    return ORE_TYPES.filter(
        function(type) {
            return type.unlockLevel <= level;
        }
    );
}


// ========================================
// 鉱山データ
// ========================================

const MINE_LEVEL_DATA = {};


// ========================================
// 鉱山Lvデータ作成
// ========================================

function createMineLevelData() {

    for (
        let level = 1;
        level <= MAX_MINE_LEVEL;
        level++
    ) {

        const durabilityMultiplier =
            1 + (level - 1) * 0.15;


        const oreCount =
            10 + Math.floor(level / 10);


        MINE_LEVEL_DATA[level] = {

            name:
                "鉱山Lv" + level,

            durabilityMultiplier:
                durabilityMultiplier,

            oreCount:
                oreCount,

            oreTable:
                createOreTableForLevel(level)
        };
    }
}


// ========================================
// 鉱石出現テーブル
// ========================================

function createOreTableForLevel(level) {

    if (level === 1) {

        return [

            {
                id: "iron",
                weight: 70
            },

            {
                id: "copper",
                weight: 25
            },

            {
                id: "silver",
                weight: 5
            }
        ];
    }


    if (level === 2) {

        return [

            {
                id: "iron",
                weight: 50
            },

            {
                id: "copper",
                weight: 35
            },

            {
                id: "silver",
                weight: 15
            }
        ];
    }


    if (level === 3) {

        return [

            {
                id: "iron",
                weight: 25
            },

            {
                id: "copper",
                weight: 35
            },

            {
                id: "silver",
                weight: 25
            },

            {
                id: "gold",
                weight: 15
            }
        ];
    }


    if (level === 4) {

        return [

            {
                id: "iron",
                weight: 15
            },

            {
                id: "copper",
                weight: 30
            },

            {
                id: "silver",
                weight: 30
            },

            {
                id: "gold",
                weight: 25
            }
        ];
    }


    const available =
        getAvailableOreTypes(level);


    const table = [];


    available.forEach(
        function(type) {

            const age =
                level - type.unlockLevel;


            const decrease =
                Math.floor(age / 3);


            let weight =
                type.weight - decrease;


            weight =
                Math.max(2, weight);


            if (
                age >= 0 &&
                age <= 9
            ) {

                weight += 5;
            }


            table.push({

                id:
                    type.id,

                weight:
                    weight
            });
        }
    );


    return table;
}


createMineLevelData();


// ========================================
// 鉱山解放条件
// ========================================

const MINE_UNLOCK_DATA = {};


// ========================================
// 鉱山解放条件作成
// ========================================

function createMineUnlockData() {

    MINE_UNLOCK_DATA[2] = {

        money: 100,

        ores: {
            iron: 5
        }
    };


    MINE_UNLOCK_DATA[3] = {

        money: 500,

        ores: {
            iron: 12,
            copper: 5
        }
    };


    MINE_UNLOCK_DATA[4] = {

        money: 1500,

        ores: {
            copper: 12,
            silver: 5,
            gold: 2
        }
    };


    for (
        let level = 5;
        level <= MAX_MINE_LEVEL;
        level++
    ) {

        const rawMoney =
            300 * Math.pow(level - 2, 2);


        const money =
            Math.ceil(rawMoney / 100) * 100;


        const usableOres =
            getAvailableOreTypes(level - 1);


        const firstOre =
            usableOres[
                usableOres.length - 1
            ];


        const secondOre =
            usableOres[
                Math.max(
                    0,
                    usableOres.length - 2
                )
            ];


        const ores = {};


        if (secondOre) {

            ores[secondOre.id] =
                Math.max(
                    3,
                    Math.ceil(level * 0.40)
                );
        }


        if (firstOre) {

            ores[firstOre.id] =
                Math.max(
                    2,
                    Math.ceil(level * 0.22)
                );
        }


        MINE_UNLOCK_DATA[level] = {

            money:
                money,

            ores:
                ores
        };
    }
}


createMineUnlockData();


// ========================================
// 採掘力
// ========================================

function getMiningPower(
    pickaxeLevel
) {

    return (
        1 +
        Math.floor(
            (pickaxeLevel - 1) * 1.5
        )
    );
}


// ========================================
// ツルハシ強化条件
// ========================================

function getCurrentPickaxeMaxLevel() {

    ensureLayer2DataStructures();
    if (typeof ensureLayer3 === "function") ensureLayer3();
    if (typeof ensureLayer4 === "function") ensureLayer4();

    // 上位層の解放を最優先。
    if (game.layer4 && game.layer4.unlocked) return 999;
    if (game.layer3 && game.layer3.unlocked) return 300;
    if (game.layer2 && game.layer2.unlocked) return 200;

    // 通常鉱山では10Lv刻みで段階解放。
    const mineLevel =
        Math.max(
            1,
            Number(game.maxUnlockedMineLevel || 1)
        );

    if (mineLevel >= 90) return 100;
    if (mineLevel >= 80) return 90;
    if (mineLevel >= 70) return 80;
    if (mineLevel >= 60) return 70;
    if (mineLevel >= 50) return 60;
    if (mineLevel >= 40) return 50;
    if (mineLevel >= 30) return 40;
    if (mineLevel >= 20) return 30;
    if (mineLevel >= 10) return 20;

    return 10;
}


function getNextPickaxeCapUnlockText() {

    const cap = getCurrentPickaxeMaxLevel();

    if (cap < 100) {
        return "鉱山Lv" + cap + "到達でLv" + (cap + 10) + "まで解放";
    }

    if (cap === 100) {
        return "第2層「旧坑道」解放でLv200まで解放";
    }

    if (cap === 200) {
        return "第3層「無風回廊」解放でLv300まで解放";
    }

    if (cap === 300) {
        return "第4層「残光遺跡」解放でLv999まで解放";
    }

    return "最終強化上限に到達";
}


// ========================================
// ツルハシ強化条件
// ========================================

function getPickaxeUpgradeData(
    nextLevel
) {

    const currentCap =
        getCurrentPickaxeMaxLevel();

    if (
        nextLevel < 2 ||
        nextLevel > PICKAXE_MAX_LEVEL ||
        nextLevel > currentCap
    ) {
        return null;
    }


    let money = 0;
    let oreId = "iron";
    let amount = 1;


    // ------------------------------------------------
    // 通常鉱山：Lv2～100
    // 各帯を解放した時点で必ず入手可能な鉱石だけを使用。
    // ------------------------------------------------
    if (nextLevel <= 10) {

        money = 120 * nextLevel * nextLevel;

        if (nextLevel <= 3) oreId = "iron";
        else if (nextLevel <= 5) oreId = "copper";
        else if (nextLevel <= 7) oreId = "silver";
        else oreId = "gold";

        amount = Math.max(1, Math.ceil(nextLevel * 0.55));

    } else if (nextLevel <= 20) {

        oreId = "platinum";
        amount = 2 + Math.floor((nextLevel - 11) / 3);
        money = 12000 + (nextLevel - 10) * 2500;

    } else if (nextLevel <= 30) {

        oreId = "mithril";
        amount = 2 + Math.floor((nextLevel - 21) / 3);
        money = 30000 + (nextLevel - 20) * 5000;

    } else if (nextLevel <= 40) {

        oreId = "orichalcum";
        amount = 2 + Math.floor((nextLevel - 31) / 3);
        money = 70000 + (nextLevel - 30) * 9000;

    } else if (nextLevel <= 50) {

        oreId = "adamantite";
        amount = 2 + Math.floor((nextLevel - 41) / 3);
        money = 140000 + (nextLevel - 40) * 15000;

    } else if (nextLevel <= 60) {

        oreId = "obsidianCrystal";
        amount = 2 + Math.floor((nextLevel - 51) / 3);
        money = 260000 + (nextLevel - 50) * 24000;

    } else if (nextLevel <= 70) {

        oreId = "starSilver";
        amount = 2 + Math.floor((nextLevel - 61) / 3);
        money = 450000 + (nextLevel - 60) * 38000;

    } else if (nextLevel <= 80) {

        oreId = "dragonCrystal";
        amount = 2 + Math.floor((nextLevel - 71) / 3);
        money = 750000 + (nextLevel - 70) * 60000;

    } else if (nextLevel <= 90) {

        oreId = "heavenCrystal";
        amount = 2 + Math.floor((nextLevel - 81) / 3);
        money = 1200000 + (nextLevel - 80) * 90000;

    } else if (nextLevel <= 100) {

        oreId = "voidCrystal";
        amount = 2 + Math.floor((nextLevel - 91) / 3);
        money = 1900000 + (nextLevel - 90) * 130000;


    // ------------------------------------------------
    // 第2層：Lv101～200
    // 深度進行に合わせて旧坑道鉱石を順番に使う。
    // ------------------------------------------------
    } else if (nextLevel <= 120) {

        oreId = "greenCorrosion";
        amount = 2 + Math.floor((nextLevel - 101) / 5);
        money = 100000 + (nextLevel - 100) * 12000;

    } else if (nextLevel <= 140) {

        oreId = "grayCrystal";
        amount = 2 + Math.floor((nextLevel - 121) / 5);
        money = 180000 + (nextLevel - 120) * 15000;

    } else if (nextLevel <= 155) {

        oreId = "blackMembrane";
        amount = 2 + Math.floor((nextLevel - 141) / 5);
        money = 300000 + (nextLevel - 140) * 18000;

    } else if (nextLevel <= 170) {

        oreId = "deepBlueOre";
        amount = 2 + Math.floor((nextLevel - 156) / 5);
        money = 450000 + (nextLevel - 155) * 22000;

    } else if (nextLevel <= 185) {

        oreId = "sealedAirCrystal";
        amount = 2 + Math.floor((nextLevel - 171) / 5);
        money = 650000 + (nextLevel - 170) * 28000;

    } else if (nextLevel <= 200) {

        oreId = "zeroVeinCrystal";
        amount = 2 + Math.floor((nextLevel - 186) / 5);
        money = 900000 + (nextLevel - 185) * 35000;


    // ------------------------------------------------
    // 第3層：Lv201～300
    // 1Fから入手できる微風を主軸にし、後半のみ風結晶。
    // ------------------------------------------------
    } else if (nextLevel <= 250) {

        oreId = "breezeShard";
        amount = 2 + Math.floor((nextLevel - 201) / 10);
        money = 500000 + (nextLevel - 200) * 18000;

    } else if (nextLevel <= 300) {

        oreId = "windCrystal";
        amount = 1 + Math.floor((nextLevel - 251) / 10);
        money = 1000000 + (nextLevel - 250) * 26000;


    // ------------------------------------------------
    // 第4層：Lv301～999
    // 999まで解放されるが、要求量は緩やかに上昇。
    // 深層鉱石帯でも1Lvごとの要求を低く抑え、詰みを防ぐ。
    // ------------------------------------------------
    } else if (nextLevel <= 450) {

        oreId = "afterglowStone";
        amount = 1 + Math.floor((nextLevel - 301) / 40);
        money = 300000 + (nextLevel - 300) * 7000;

    } else if (nextLevel <= 600) {

        oreId = "twilightCrystal";
        amount = 1 + Math.floor((nextLevel - 451) / 40);
        money = 700000 + (nextLevel - 450) * 9000;

    } else if (nextLevel <= 750) {

        oreId = "duskOre";
        amount = 1 + Math.floor((nextLevel - 601) / 40);
        money = 1200000 + (nextLevel - 600) * 12000;

    } else if (nextLevel <= 900) {

        oreId = "shadowEaterCrystal";
        amount = 1 + Math.floor((nextLevel - 751) / 40);
        money = 2000000 + (nextLevel - 750) * 16000;

    } else {

        oreId = "hollowNightCrystal";
        amount = 1 + Math.floor((nextLevel - 901) / 33);
        money = 3200000 + (nextLevel - 900) * 22000;
    }


    return {
        money:
            Math.floor(money),

        ores: {
            [oreId]:
                Math.max(1, Math.floor(amount))
        }
    };
}


// ========================================
// 拠点強化条件
// ========================================

function getBaseUpgradeData(
    nextLevel
) {

    if (
        nextLevel < 2 ||
        nextLevel > BASE_MAX_LEVEL
    ) {

        return null;
    }


    const money =
        1000 * Math.pow(nextLevel, 2);


    const amount =
        Math.max(
            3,
            nextLevel * 3
        );


    let oreId = "iron";


    if (nextLevel === 2) {

        oreId = "iron";

    } else if (nextLevel === 3) {

        oreId = "copper";

    } else if (nextLevel === 4) {

        oreId = "silver";

    } else if (nextLevel === 5) {

        oreId = "gold";

    } else if (nextLevel === 6) {

        oreId = "platinum";

    } else if (nextLevel === 7) {

        oreId = "mithril";

    } else if (nextLevel === 8) {

        oreId = "orichalcum";

    } else if (nextLevel === 9) {

        oreId = "adamantite";

    } else {

        oreId = "obsidianCrystal";
    }


    return {

        money:
            money,

        ores: {
            [oreId]: amount
        }
    };
}


// ========================================
// 空鉱石保管領域
// ========================================

function createEmptyOreStorage() {

    const storage = {};


    ORE_TYPES.forEach(
        function(type) {

            storage[type.id] = 0;
        }
    );


    return storage;
}


// ========================================
// 鉱石図鑑記録
// ========================================

function createOreRecords() {

    const records = {};


    ORE_TYPES.forEach(
        function(type) {

            records[type.id] = {

                discovered: false,

                mined: 0,

                returned: 0
            };
        }
    );


    return records;
}


// ========================================
// アイテム図鑑記録
// ========================================

function createItemRecords() {

    const records = {};


    ITEM_DATA.forEach(
        function(item) {

            records[item.id] = {

                discovered: false,

                acquired: 0
            };
        }
    );


    return records;
}


// ========================================
// ゲームデータ
// ========================================

const game = {

    map: [],

    explored: [],


    world: {

        currentLayer: 1,

        maxUnlockedLayer: 1
    },


    dev: {

        allLayersUnlocked: false,

        fullMapReveal: false
    },


    progressFlags: {

        layer2ExistenceHint: true,

        layer2AnomalyDetected: false,

        layer2ResonanceDetected: false,

        layer2ResearchStarted: false,

        layer2RequirementsKnown: false,

        layer2Attempted: false
    },


    currentMineLevel: 1,

    selectedMineLevel: 1,

    maxUnlockedMineLevel: 1,


    money: 0,


    pickaxe: {
        level: 1
    },


    base: {
        level: 1
    },


    baseOpen: false,

    warehouseOpen: false,

    shopOpen: false,

    forgeOpen: false,

    baseUpgradeOpen: false,

    workshopOpen: false,

    archiveOpen: false,

    devOpen: false,

    archiveTab: "ores",

    inventoryOpen: false,

    deathWarningOpen: false,

    returnConfirmOpen: false,

    featherConfirmOpen: false,

    stairConfirmOpen: false,


    player: {

        x: 0,

        y: 0,

        hp: 10,

        maxHp: 10
    },


    returnPoint: {

        x: 0,

        y: 0,

        found: false
    },


    stairs: {

        x: 0,

        y: 0,

        found: false
    },


    treasureChest: {

        x: 0,

        y: 0,

        exists: false,

        found: false
    },


    randomEvent: {

        x: 0,

        y: 0,

        exists: false,

        found: false,

        type: null
    },


    ores: [],


    expeditionBag:
        createEmptyOreStorage(),


    warehouse: {

        ores:
            createEmptyOreStorage()
    },


    inventory: {

        items: {

            detector: 0,

            returnFeather: 0,

            potion: 0,

            food: 0,

            healthBoost: 0
        }
    },


    records: {

        ores:
            createOreRecords(),

        items:
            createItemRecords()
    },


    logs: [],


    mining: false,

    pendingDangerOre: null,

    dead: false
};


// ========================================
// HTML
// ========================================

let mapElement = null;

let minimapElement = null;

let logElement = null;


// ========================================
// 電光掲示板タイマー
// ========================================

let baseTickerTimer = null;

let lastBaseTickerMessage = "";


// ========================================
// 全体見た目調整
// ========================================

function applyVisualPolish() {

    if (
        document.getElementById(
            "miningGameVisualPolish"
        )
    ) {

        return;
    }


    const style =
        document.createElement("style");


    style.id =
        "miningGameVisualPolish";


    style.textContent = `

        :root {
            color-scheme: dark;
        }

        * {
            box-sizing: border-box;
        }

        html,
        body {
            margin: 0;
            padding: 0;
        }

        body {

            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                "Yu Gothic UI",
                "Yu Gothic",
                Meiryo,
                sans-serif;

            line-height: 1.45;

            background: #111316;

            color: #e8eaed;
        }

        button {

            min-height: 31px;

            padding: 6px 11px;

            font-family: inherit;

            font-size: 13px;

            line-height: 1.2;

            color: #e9edf1;

            background:
                linear-gradient(
                    180deg,
                    #3a4047 0%,
                    #282d32 100%
                );

            border:
                1px solid #626a73;

            border-radius: 5px;

            box-shadow:
                inset 0 1px 0
                rgba(255,255,255,0.07);

            cursor: pointer;

            transition:
                background 0.12s ease,
                border-color 0.12s ease,
                transform 0.05s ease,
                filter 0.12s ease;
        }

        button:hover:not(:disabled) {

            background:
                linear-gradient(
                    180deg,
                    #474e56 0%,
                    #30363c 100%
                );

            border-color: #8a949f;
        }

        button:active:not(:disabled) {

            transform:
                translateY(1px);

            filter:
                brightness(0.92);
        }

        button:focus-visible {

            outline:
                2px solid #d6b65d;

            outline-offset: 2px;
        }

        button:disabled {

            color: #777d83;

            background: #24282c;

            border-color: #3b4045;

            cursor: default;

            opacity: 0.60;

            box-shadow: none;
        }

        #playerStatus {

            margin:
                6px 0 9px !important;

            padding:
                7px 10px !important;

            background:
                linear-gradient(
                    180deg,
                    #22272c,
                    #171a1e
                ) !important;

            border:
                1px solid #4e565e !important;

            border-radius:
                5px !important;

            box-shadow:
                0 3px 10px
                rgba(0,0,0,0.25);

            color:
                #e5e8eb !important;

            font-size: 13px;

            font-variant-numeric:
                tabular-nums;
        }

        #map {

            border:
                2px solid #515961;

            background: #15181b;

            box-shadow:
                0 5px 18px
                rgba(0,0,0,0.42);

            user-select: none;
        }

        .tile {

            transition:
                background-color 0.08s linear,
                color 0.08s linear;
        }

        .tile.player {

            text-shadow:
                0 0 5px
                rgba(255,255,255,0.40);
        }

        #minimap {

            padding: 4px;

            background: #111417;

            border:
                1px solid #464d54;

            box-shadow:
                0 3px 10px
                rgba(0,0,0,0.28);

            user-select: none;
        }

        .mini-tile.current {

            outline:
                1px solid #ffffff;

            outline-offset: -1px;
        }

        #log {

            margin-top: 8px;

            padding: 8px 10px;

            background: #121518;

            color: #cfd4d9;

            border:
                1px solid #3d444b;

            border-radius: 5px;

            box-shadow:
                inset 0 1px 7px
                rgba(0,0,0,0.30);

            font-size: 12px;

            line-height: 1.5;

            scrollbar-width: thin;

            scrollbar-color:
                #565f68 #181b1e;
        }

        #log > div {

            padding: 2px 0;

            border-bottom:
                1px solid
                rgba(255,255,255,0.035);
        }

        #log > div:last-child {

            color: #f0f2f4;

            border-bottom: none;
        }

        #inventoryButton {
            margin-top: 7px;
        }

        #inventoryWindow {

            width:
                min(
                    370px,
                    calc(100vw - 32px)
                ) !important;

            min-width: 0 !important;

            padding: 15px !important;

            background:
                linear-gradient(
                    180deg,
                    #23272c,
                    #14171a
                ) !important;

            border:
                1px solid #656d75 !important;

            border-radius:
                7px !important;

            box-shadow:
                0 18px 60px
                rgba(0,0,0,0.70);
        }

        #inventoryWindow h2 {

            margin:
                0 0 11px;

            color: #e4c978;

            font-size: 18px;
        }

        #inventoryWindow h3 {

            margin:
                13px 0 7px;

            padding-bottom: 4px;

            color: #b9c1c8;

            font-size: 13px;

            border-bottom:
                1px solid #454b51;
        }

        [id$="Overlay"] {
            backdrop-filter: blur(2px);
        }

        #selectedMineLevelDisplay {

            font-variant-numeric:
                tabular-nums;

            box-shadow:
                inset 0 0 10px
                rgba(0,0,0,0.65);
        }

        #mineUnlockBox {
            line-height: 1.5;
        }

        #baseMessage {

            min-height: 34px;

            display: flex;

            align-items: center;
        }


        /* =================================
           STEP 4-4
           電光掲示板
           ================================= */

        #baseTickerBoard {

            position: relative;

            overflow: hidden;

            height: 42px;

            margin-bottom: 10px;

            padding: 4px;

            background:
                linear-gradient(
                    180deg,
                    #dffbff 0%,
                    #80dbe8 18%,
                    #266672 50%,
                    #8be8f2 82%,
                    #dfffff 100%
                );

            border:
                1px solid #e9ffff;

            border-radius: 5px;

            box-shadow:
                0 0 5px rgba(145,239,255,0.95),
                0 0 14px rgba(82,211,235,0.55),
                inset 0 0 4px rgba(255,255,255,0.80);

            transition:
                border-color 0.5s ease,
                box-shadow 0.5s ease,
                filter 0.5s ease;
        }

        #baseTickerScreen {

            position: relative;

            width: 100%;

            height: 100%;

            overflow: hidden;

            background:
                linear-gradient(
                    180deg,
                    #071012,
                    #020607
                );

            border:
                1px solid #21434a;

            border-radius: 2px;

            box-shadow:
                inset 0 0 9px rgba(0,0,0,0.95),
                inset 0 0 3px rgba(110,230,245,0.25);
        }

        #baseTickerScreen::after {

            content: "";

            pointer-events: none;

            position: absolute;

            inset: 0;

            z-index: 2;

            background:
                repeating-linear-gradient(
                    180deg,
                    rgba(255,255,255,0.018) 0px,
                    rgba(255,255,255,0.018) 1px,
                    transparent 1px,
                    transparent 3px
                );
        }

        #baseTickerText {

            position: absolute;

            left: 100%;

            top: 50%;

            transform:
                translateY(-50%);

            display: inline-block;

            width: max-content;

            max-width: none;

            white-space: nowrap;

            font-family:
                "Consolas",
                "Courier New",
                "Lucida Console",
                "MS Gothic",
                monospace;

            font-size: 15px;

            font-weight: bold;

            letter-spacing: 1.5px;

            color: #bff8ff;

            text-shadow:
                0 0 2px #ffffff,
                0 0 5px #66eaff,
                0 0 9px rgba(68,219,255,0.75);

            animation:
                baseTickerScroll 12s linear forwards;

            user-select: none;
        }

        @keyframes baseTickerScroll {

            from {
                left: 100%;
                transform:
                    translateY(-50%);
            }

            to {
                left: 0%;
                transform:
                    translate(-100%, -50%);
            }
        }

        #baseTickerBoard.ticker-anomaly {

            box-shadow:
                0 0 5px rgba(183,167,255,0.95),
                0 0 15px rgba(113,84,229,0.52),
                inset 0 0 4px rgba(255,255,255,0.8);

            border-color:
                #dacfff;

            filter:
                saturate(0.92);
        }

        #baseTickerBoard.ticker-anomaly
        #baseTickerText {

            color:
                #d0c5ff;

            text-shadow:
                0 0 2px #ffffff,
                0 0 5px #b697ff,
                0 0 10px rgba(117,77,255,0.70);
        }

        #baseTickerBoard.ticker-layer2 {

            animation:
                tickerLayer2Flicker
                5.8s steps(1) infinite;
        }

        @keyframes tickerLayer2Flicker {

            0%, 91%, 94%, 100% {
                opacity: 1;
            }

            92% {
                opacity: 0.72;
            }

            93% {
                opacity: 0.93;
            }
        }

        #baseTickerBoard.ticker-layer3 {

            border-color:
                #b9fff2;

            box-shadow:
                0 0 5px rgba(150,255,231,0.95),
                0 0 16px rgba(72,229,194,0.55);

            animation:
                tickerLayer3Signal
                4.5s ease-in-out infinite;
        }

        #baseTickerBoard.ticker-layer3
        #baseTickerText {

            color:
                #bdffec;

            text-shadow:
                0 0 2px #ffffff,
                0 0 6px #5dffd4,
                0 0 11px rgba(65,255,204,0.78);
        }

        @keyframes tickerLayer3Signal {

            0%,
            100% {
                filter:
                    brightness(1);
            }

            47% {
                filter:
                    brightness(0.93);
            }

            49% {
                filter:
                    brightness(1.30);
            }

            51% {
                filter:
                    brightness(0.82);
            }

            53% {
                filter:
                    brightness(1);
            }
        }

        #baseTickerBoard.ticker-layer4 {

            border-color:
                #ffb0a8;

            background:
                linear-gradient(
                    180deg,
                    #ffe3df,
                    #ea7469 18%,
                    #6e211c 50%,
                    #e4675c 82%,
                    #ffe0dc 100%
                );

            box-shadow:
                0 0 6px rgba(255,124,110,1),
                0 0 18px rgba(239,64,51,0.65);

            animation:
                tickerLayer4Warning
                1.8s steps(1) infinite;
        }

        #baseTickerBoard.ticker-layer4
        #baseTickerText {

            color:
                #ffd2cd;

            text-shadow:
                0 0 2px #ffffff,
                0 0 6px #ff6759,
                0 0 12px rgba(255,50,40,0.92);
        }

        @keyframes tickerLayer4Warning {

            0%,
            82%,
            100% {
                filter:
                    brightness(1);
            }

            84% {
                filter:
                    brightness(1.6);
            }

            87% {
                filter:
                    brightness(0.65);
            }

            90% {
                filter:
                    brightness(1.3);
            }
        }

        #baseTickerBoard.ticker-broken {

            height: 42px;

            background:
                linear-gradient(
                    135deg,
                    #393d40,
                    #161819 38%,
                    #343739 39%,
                    #101112 66%,
                    #292c2e
                );

            border-color:
                #555b5e;

            box-shadow:
                inset 0 0 12px rgba(0,0,0,0.96),
                0 1px 2px rgba(255,255,255,0.08);

            filter:
                none;

            animation:
                none;
        }

        #baseTickerBoard.ticker-broken
        #baseTickerScreen {

            background:
                #020202;

            border-color:
                #181818;

            box-shadow:
                inset 0 0 15px #000;
        }

        #baseTickerBoard.ticker-broken
        #baseTickerText {

            display: none;
        }

        #baseTickerCrack {

            display: none;

            pointer-events: none;

            position: absolute;

            inset: 0;

            z-index: 5;
        }

        #baseTickerBoard.ticker-broken
        #baseTickerCrack {

            display: block;
        }

        #baseTickerCrack::before {

            content: "";

            position: absolute;

            left: 57%;

            top: -8px;

            width: 1px;

            height: 58px;

            background:
                rgba(190,200,205,0.34);

            transform:
                rotate(21deg);

            box-shadow:
                10px 11px 0 -0.3px rgba(185,195,200,0.28),
                -9px 17px 0 -0.3px rgba(185,195,200,0.24),
                17px 24px 0 -0.3px rgba(185,195,200,0.22);
        }

        #baseTickerCrack::after {

            content: "";

            position: absolute;

            left: 34%;

            top: 4px;

            width: 1px;

            height: 46px;

            background:
                rgba(170,180,185,0.26);

            transform:
                rotate(-38deg);

            box-shadow:
                -8px 8px 0 -0.3px rgba(180,190,195,0.21),
                9px 15px 0 -0.3px rgba(180,190,195,0.21);
        }


        #warehouseWindow,
        #shopWindow,
        #forgeWindow,
        #baseUpgradeWindow,
        #workshopWindow,
        #archiveWindow,
        #devWindow {

            background:
                linear-gradient(
                    180deg,
                    #252a30 0%,
                    #16191d 100%
                ) !important;

            border:
                1px solid #646c75 !important;

            box-shadow:
                0 20px 65px
                rgba(0,0,0,0.72);

            scrollbar-width: thin;

            scrollbar-color:
                #626b74 #191c20;
        }

        #warehouseWindow h2,
        #shopWindow h2,
        #forgeWindow h2,
        #baseUpgradeWindow h2,
        #workshopWindow h2,
        #archiveWindow h2,
        #devWindow h2 {

            margin-bottom: 13px;

            padding-bottom: 7px;

            color: #e1c46d;

            font-size: 19px;

            border-bottom:
                1px solid #515960;
        }

        #depthObservationBox {

            position: relative;

            overflow: hidden;
        }

        #depthObservationBox::before {

            content: "";

            position: absolute;

            left: 0;

            top: 0;

            bottom: 0;

            width: 3px;

            background: #765ad2;
        }

        .archive-record {

            padding: 8px 10px;

            margin-bottom: 6px;

            text-align: left;

            border:
                1px solid #434a50;

            border-radius: 5px;

            background:
                rgba(0,0,0,0.16);
        }

        .archive-undiscovered {

            color: #777f86;

            border-color: #343a3f;

            background:
                rgba(0,0,0,0.26);
        }

        .archive-small {

            margin-top: 3px;

            font-size: 11px;

            color: #aab1b7;
        }

        .dev-panel {

            padding: 10px;

            margin-bottom: 8px;

            border:
                1px solid #654d4d;

            border-radius: 5px;

            background:
                rgba(45,20,20,0.28);

            text-align: left;
        }

        .dev-layer {

            display: flex;

            align-items: center;

            justify-content:
                space-between;

            gap: 8px;

            padding: 7px 8px;

            margin-bottom: 4px;

            border:
                1px solid #444b51;

            border-radius: 4px;

            background:
                rgba(0,0,0,0.15);
        }

        .confirm-key-guide {

            margin-top: 11px;

            padding-top: 8px;

            border-top:
                1px solid #3e444a;

            font-size: 12px;

            color: #9ca5ad;
        }

        #deathWarningOverlay > div,
        #returnConfirmOverlay > div,
        #featherConfirmOverlay > div,
        #stairConfirmOverlay > div {

            background:
                linear-gradient(
                    180deg,
                    #262b30,
                    #171a1d
                ) !important;

            border:
                1px solid #676f77 !important;

            box-shadow:
                0 18px 65px
                rgba(0,0,0,0.72);
        }

        #deathWarningOverlay h2 {
            color: #ef8c82;
        }

        #returnConfirmOverlay h2 {
            color: #e4c86f;
        }

        #featherConfirmOverlay h2 {
            color: #8fd9ee;
        }

        #stairConfirmOverlay h2 {
            color: #86dc8b;
        }

        ::-webkit-scrollbar {

            width: 9px;

            height: 9px;
        }

        ::-webkit-scrollbar-track {
            background: #171a1d;
        }

        ::-webkit-scrollbar-thumb {

            background: #555e67;

            border:
                2px solid #171a1d;

            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #6a747d;
        }

        @media (
            max-width: 600px
        ) {

            button {

                min-height: 36px;

                font-size: 13px;
            }

            #playerStatus {

                display: block !important;

                width: 100%;
            }

            #baseOverlay {

                padding: 6px !important;
            }

            #warehouseWindow,
            #shopWindow,
            #forgeWindow,
            #baseUpgradeWindow,
            #workshopWindow,
            #archiveWindow,
            #devWindow {

                width:
                    calc(100vw - 16px) !important;

                max-height:
                    calc(100vh - 18px) !important;

                padding: 13px !important;
            }

            #selectedMineLevelDisplay {

                min-width:
                    120px !important;

                font-size:
                    17px !important;
            }

            #baseTickerText {

                font-size: 13px;

                letter-spacing: 1px;
            }
        }

    `;


    document.head.appendChild(style);
}


// ========================================
// 起動
// ========================================

function bootstrapGame() {

    applyVisualPolish();


    mapElement =
        document.getElementById(
            "map"
        );


    minimapElement =
        document.getElementById(
            "minimap"
        );


    logElement =
        document.getElementById(
            "log"
        );


    createStatusUI();

    createInventoryUI();

    createDeathWarningUI();

    createReturnConfirmUI();

    createFeatherConfirmUI();

    createStairConfirmUI();

    createWarehouseUI();

    createShopUI();

    createForgeUI();

    createBaseUpgradeUI();

    createWorkshopUI();

    createArchiveUI();

    createDevUI();

    createBaseUI();

    bindMoveButtons();

    startBaseTicker();

    initGame();
}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        bootstrapGame
    );

} else {

    bootstrapGame();
}


// ========================================
// 電光掲示板開始
// ========================================

function startBaseTicker() {

    if (
        baseTickerTimer !== null
    ) {

        clearInterval(
            baseTickerTimer
        );
    }


    updateBaseTicker(
        true
    );


    baseTickerTimer =
        setInterval(
            function() {

                if (
                    game.baseOpen
                ) {

                    updateBaseTicker(
                        false
                    );
                }

            },
            BASE_TICKER_INTERVAL
        );
}


// ========================================
// 電光掲示板状態取得
// ========================================

function getBaseTickerState() {

    const layer =
        game.world.currentLayer;


    if (
        layer >= 5
    ) {

        return "broken";
    }


    if (
        layer === 4
    ) {

        return "layer4";
    }


    if (
        layer === 3
    ) {

        return "layer3";
    }


    if (
        layer === 2
    ) {

        return "layer2";
    }


    if (
        game.progressFlags
            .layer2RequirementsKnown
    ) {

        return "requirements";
    }


    if (
        game.progressFlags
            .layer2ResearchStarted
    ) {

        return "research";
    }


    if (
        game.progressFlags
            .layer2ResonanceDetected
    ) {

        return "resonance";
    }


    if (
        game.progressFlags
            .layer2AnomalyDetected
    ) {

        return "anomaly";
    }


    return "normal";
}


// ========================================
// 電光掲示板用メッセージ一覧
// ========================================

function getBaseTickerMessages(
    state
) {

    if (
        state === "layer4"
    ) {

        return BASE_TICKER_LAYER4_MESSAGES;
    }


    if (
        state === "layer3"
    ) {

        return BASE_TICKER_LAYER3_MESSAGES;
    }


    if (
        state === "layer2"
    ) {

        return BASE_TICKER_LAYER2_MESSAGES;
    }


    if (
        state === "requirements"
    ) {

        return BASE_TICKER_REQUIREMENT_MESSAGES;
    }


    if (
        state === "research"
    ) {

        return BASE_TICKER_RESEARCH_MESSAGES;
    }


    if (
        state === "resonance"
    ) {

        return BASE_TICKER_RESONANCE_MESSAGES;
    }


    if (
        state === "anomaly"
    ) {

        return BASE_TICKER_ANOMALY_MESSAGES;
    }


    return BASE_TICKER_NORMAL_MESSAGES;
}


// ========================================
// ランダム掲示文取得
// ========================================

function getRandomTickerMessage(
    messages
) {

    if (
        !messages ||
        messages.length === 0
    ) {

        return "";
    }


    if (
        messages.length === 1
    ) {

        return messages[0];
    }


    let selected = "";


    for (
        let attempt = 0;
        attempt < 10;
        attempt++
    ) {

        selected =
            messages[
                randomInt(
                    0,
                    messages.length - 1
                )
            ];


        if (
            selected !==
            lastBaseTickerMessage
        ) {

            break;
        }
    }


    return selected;
}


// ========================================
// 電光掲示板更新
// ========================================

function updateBaseTicker(
    force
) {

    const board =
        document.getElementById(
            "baseTickerBoard"
        );


    const text =
        document.getElementById(
            "baseTickerText"
        );


    if (
        !board ||
        !text
    ) {

        return;
    }


    const state =
        getBaseTickerState();


    board.classList.remove(
        "ticker-anomaly",
        "ticker-layer2",
        "ticker-layer3",
        "ticker-layer4",
        "ticker-broken"
    );


    if (
        state === "broken"
    ) {

        board.classList.add(
            "ticker-broken"
        );


        text.textContent = "";

        lastBaseTickerMessage = "";

        return;
    }


    if (
        state === "layer4"
    ) {

        board.classList.add(
            "ticker-layer4"
        );

    } else if (
        state === "layer3"
    ) {

        board.classList.add(
            "ticker-layer3"
        );

    } else if (
        state === "layer2"
    ) {

        board.classList.add(
            "ticker-anomaly",
            "ticker-layer2"
        );

    } else if (
        state !== "normal"
    ) {

        board.classList.add(
            "ticker-anomaly"
        );
    }


    const messages =
        getBaseTickerMessages(
            state
        );


    const message =
        getRandomTickerMessage(
            messages
        );


    if (
        !force &&
        message ===
        lastBaseTickerMessage
    ) {

        return;
    }


    lastBaseTickerMessage =
        message;


    text.style.animation =
        "none";


    void text.offsetWidth;


    text.textContent =
        "◆　" +
        message +
        "　◆";


    text.style.animation =
        "baseTickerScroll 12s linear forwards";
}


// ========================================
// 初期化
// ========================================

function initGame() {

    game.player.hp =
        game.player.maxHp;


    game.dead = false;

    game.mining = false;

    game.inventoryOpen = false;

    game.warehouseOpen = false;

    game.shopOpen = false;

    game.forgeOpen = false;

    game.baseUpgradeOpen = false;

    game.workshopOpen = false;

    game.archiveOpen = false;

    game.devOpen = false;

    game.deathWarningOpen = false;

    game.returnConfirmOpen = false;

    game.featherConfirmOpen = false;

    game.stairConfirmOpen = false;

    game.pendingDangerOre = null;

    game.selectedMineLevel = 1;

    game.dev.allLayersUnlocked = false;

    game.dev.fullMapReveal = false;


    clearExpeditionBag();

    registerCurrentlyOwnedItems();

    updateLayer2Progress();


    showBase(
        "鉱山へ向かう準備を整えよう。"
    );
}


// ========================================
// 現在所持アイテム登録
// ========================================

function registerCurrentlyOwnedItems() {

    ITEM_DATA.forEach(
        function(item) {

            const amount =
                game.inventory.items[
                    item.id
                ] || 0;


            if (amount > 0) {

                registerItemDiscovery(
                    item.id,
                    false
                );
            }
        }
    );
}


// ========================================
// 鉱石図鑑登録
// ========================================

function registerOreDiscovery(
    oreId
) {

    const record =
        game.records.ores[
            oreId
        ];


    const type =
        getOreTypeById(
            oreId
        );


    if (
        !record ||
        !type
    ) {

        return;
    }


    if (
        !record.discovered
    ) {

        record.discovered = true;


        addLog(
            type.name +
            "が鉱物図鑑に登録されました。"
        );


        updateArchiveUI();
    }
}


// ========================================
// 採掘記録
// ========================================

function recordOreMined(
    oreId,
    amount
) {

    const record =
        game.records.ores[
            oreId
        ];


    if (!record) {

        return;
    }


    record.mined +=
        Math.max(
            0,
            amount
        );


    updateArchiveUI();
}


// ========================================
// 持ち帰り記録
// ========================================

function recordOreReturned(
    oreId,
    amount
) {

    const record =
        game.records.ores[
            oreId
        ];


    if (!record) {

        return;
    }


    record.returned +=
        Math.max(
            0,
            amount
        );


    updateLayer2Progress();

    updateArchiveUI();
}


// ========================================
// アイテム図鑑登録
// ========================================

function registerItemDiscovery(
    itemId,
    countAcquired
) {

    const record =
        game.records.items[
            itemId
        ];


    const item =
        getItemDataById(
            itemId
        );


    if (
        !record ||
        !item
    ) {

        return;
    }


    const firstDiscovery =
        !record.discovered;


    record.discovered = true;


    if (countAcquired) {

        record.acquired++;
    }


    if (
        firstDiscovery &&
        countAcquired
    ) {

        addLog(
            item.name +
            "がアイテム図鑑に登録されました。"
        );
    }


    updateArchiveUI();
}


// ========================================
// アイテム取得共通
// ========================================

function addInventoryItem(
    itemId,
    amount
) {

    const safeAmount =
        Math.max(
            0,
            Math.floor(amount)
        );


    if (safeAmount <= 0) {

        return;
    }


    game.inventory.items[
        itemId
    ] =
        (
            game.inventory.items[
                itemId
            ] || 0
        ) +
        safeAmount;


    const record =
        game.records.items[
            itemId
        ];


    const item =
        getItemDataById(
            itemId
        );


    if (
        record &&
        item
    ) {

        const firstDiscovery =
            !record.discovered;


        record.discovered = true;

        record.acquired += safeAmount;


        if (firstDiscovery) {

            addLog(
                item.name +
                "がアイテム図鑑に登録されました。"
            );
        }
    }


    updateArchiveUI();
}


// ========================================
// 第2層進行更新
// ========================================

function updateLayer2Progress() {

    const flags =
        game.progressFlags;


    flags.layer2ExistenceHint = true;


    if (
        game.maxUnlockedMineLevel >=
        MAX_MINE_LEVEL
    ) {

        if (
            !flags.layer2AnomalyDetected
        ) {

            flags.layer2AnomalyDetected =
                true;


            addLog(
                "鉱山最深部より未知の空間反応を検出しました。"
            );
        }
    }


    const godSteelRecord =
        game.records.ores.godSteel;


    const returnedGodSteel =
        godSteelRecord
            ?
            godSteelRecord.returned
            :
            0;


    if (
        flags.layer2AnomalyDetected &&

        returnedGodSteel >=
        LAYER2_RESONANCE_REQUIREMENT
    ) {

        if (
            !flags.layer2ResonanceDetected
        ) {

            flags.layer2ResonanceDetected =
                true;


            addLog(
                "持ち帰った神鋼鉱から異常な振動を検出しました。"
            );


            addLog(
                "最深部で観測された反応と同一の波形を示しています。"
            );
        }
    }


    if (
        flags.layer2ResonanceDetected &&

        returnedGodSteel >=
        LAYER2_RESEARCH_REQUIREMENT
    ) {

        if (
            !flags.layer2ResearchStarted
        ) {

            flags.layer2ResearchStarted =
                true;


            addLog(
                "神鋼鉱の共鳴反応について研究が開始されました。"
            );


            addLog(
                "反応源へ接続できる可能性があります。"
            );
        }
    }


    if (
        flags.layer2ResearchStarted &&

        returnedGodSteel >=
        LAYER2_REQUIREMENTS_REVEAL
    ) {

        if (
            !flags.layer2RequirementsKnown
        ) {

            flags.layer2RequirementsKnown =
                true;


            addLog(
                "異常反応の解析が完了しました。"
            );


            addLog(
                "反応源への接続に必要な条件が判明しました。"
            );
        }
    }


    updateDepthObservationUI();

    updateBaseTicker(
        true
    );
}


// ========================================
// 第2層接続可能判定
// ========================================

function canAttemptLayer2Connection() {

    if (
        !game.progressFlags
            .layer2RequirementsKnown
    ) {

        return false;
    }


    const godSteel =
        game.warehouse.ores
            .godSteel || 0;


    return (
        godSteel >=
        LAYER2_UNLOCK_GODSTEEL &&

        game.money >=
        LAYER2_UNLOCK_MONEY
    );
}


// ========================================
// 第2層接続試行
// ========================================

function attemptLayer2Connection() {

    if (!game.baseOpen) {

        return;
    }


    if (
        !game.progressFlags
            .layer2RequirementsKnown
    ) {

        return;
    }


    if (
        !canAttemptLayer2Connection()
    ) {

        addLog(
            "接続に必要な資源が不足しています。"
        );


        setBaseMessage(
            "未確認領域への接続条件を満たしていません。"
        );


        return;
    }


    game.progressFlags
        .layer2Attempted = true;


    addLog(
        "未確認領域への接続条件を満たしました。"
    );


    addLog(
        "この先の領域は現在開発中です。"
    );


    addLog(
        "神鋼鉱と資金は消費されませんでした。"
    );


    setBaseMessage(
        "必要条件は満たされています。しかし、この先の領域は現在開発中です。素材と資金は消費されません。"
    );


    updateDepthObservationUI();

    updateBaseTicker(
        true
    );
}


// ========================================
// 開発モードUI
// ========================================

function createDevUI() {

    if (!DEV_MODE) {

        return;
    }


    if (
        document.getElementById(
            "devOverlay"
        )
    ) {

        return;
    }


    const overlay =
        createOverlay(
            "devOverlay"
        );


    overlay.style.zIndex =
        "17000";


    const box =
        createModalWindow();


    box.id =
        "devWindow";


    box.style.width =
        "min(620px, calc(100% - 40px))";


    overlay.appendChild(box);

    document.body.appendChild(
        overlay
    );
}


// ========================================
// 開発画面
// ========================================

function openDevMenu() {

    if (
        !DEV_MODE ||
        !game.baseOpen
    ) {

        return;
    }


    closeWarehouse();

    closeShop();

    closeForge();

    closeBaseUpgrade();

    closeWorkshop();

    closeArchive();


    game.devOpen = true;


    updateDevUI();


    showOverlay(
        "devOverlay"
    );
}


// ========================================
// 開発画面閉じる
// ========================================

function closeDevMenu() {

    hideOverlay(
        "devOverlay"
    );


    game.devOpen = false;
}


// ========================================
// 開発画面更新
// ========================================

function updateDevUI() {

    if (!DEV_MODE) {

        return;
    }


    const box =
        document.getElementById(
            "devWindow"
        );


    if (!box) {

        return;
    }


    box.innerHTML = "";


    box.appendChild(
        createTitle("開発")
    );


    const warning =
        document.createElement(
            "div"
        );


    warning.textContent =
        "開発専用機能です。正式版では削除されます。";


    Object.assign(
        warning.style,
        {
            marginBottom: "12px",
            padding: "8px",
            background:
                "rgba(120,35,35,0.24)",
            border:
                "1px solid #754545",
            borderRadius: "4px",
            color: "#efb0b0",
            fontSize: "12px"
        }
    );


    box.appendChild(warning);


    const resourcePanel =
        document.createElement(
            "div"
        );


    resourcePanel.className =
        "dev-panel";


    const resourceTitle =
        document.createElement(
            "div"
        );


    resourceTitle.textContent =
        "【 テスト資源 】";


    resourceTitle.style.fontWeight =
        "bold";


    resourceTitle.style.marginBottom =
        "8px";


    resourcePanel.appendChild(
        resourceTitle
    );


    const oreButton =
        document.createElement(
            "button"
        );


    oreButton.textContent =
        "全鉱石を999個取得";


    oreButton.onclick =
        function(event) {

            event.stopPropagation();

            devGiveAllOres();
        };


    resourcePanel.appendChild(
        oreButton
    );


    box.appendChild(
        resourcePanel
    );


    const progressPanel =
        document.createElement(
            "div"
        );


    progressPanel.className =
        "dev-panel";


    const progressTitle =
        document.createElement(
            "div"
        );


    progressTitle.textContent =
        "【 進行テスト 】";


    progressTitle.style.fontWeight =
        "bold";


    progressTitle.style.marginBottom =
        "8px";


    progressPanel.appendChild(
        progressTitle
    );


    const mineButton =
        document.createElement(
            "button"
        );


    mineButton.textContent =
        "通常鉱山Lv100まで開放";


    mineButton.style.marginRight =
        "7px";


    mineButton.onclick =
        function(event) {

            event.stopPropagation();

            devUnlockAllMineLevels();
        };


    const layerButton =
        document.createElement(
            "button"
        );


    layerButton.textContent =
        "全5層を開発用開放";


    layerButton.onclick =
        function(event) {

            event.stopPropagation();

            devUnlockAllLayers();
        };


    progressPanel.appendChild(
        mineButton
    );


    progressPanel.appendChild(
        layerButton
    );


    box.appendChild(
        progressPanel
    );


    const mapPanel =
        document.createElement(
            "div"
        );


    mapPanel.className =
        "dev-panel";


    const mapTitle =
        document.createElement(
            "div"
        );


    mapTitle.textContent =
        "【 地図テスト 】";


    mapTitle.style.fontWeight =
        "bold";


    mapTitle.style.marginBottom =
        "8px";


    mapPanel.appendChild(
        mapTitle
    );


    const mapButton =
        document.createElement(
            "button"
        );


    mapButton.textContent =
        game.dev.fullMapReveal
            ?
            "地図全表示：ON"
            :
            "地図全表示：OFF";


    mapButton.onclick =
        function(event) {

            event.stopPropagation();

            devToggleFullMap();
        };


    mapPanel.appendChild(
        mapButton
    );


    box.appendChild(
        mapPanel
    );


    const layerPanel =
        document.createElement(
            "div"
        );


    layerPanel.className =
        "dev-panel";


    const layerTitle =
        document.createElement(
            "div"
        );


    layerTitle.textContent =
        "【 階層アクセス確認 】";


    layerTitle.style.fontWeight =
        "bold";


    layerTitle.style.marginBottom =
        "8px";


    layerPanel.appendChild(
        layerTitle
    );


    for (
        let level = 1;
        level <= MAX_WORLD_LAYER;
        level++
    ) {

        const data =
            getWorldLayerData(
                level
            );


        const row =
            document.createElement(
                "div"
            );


        row.className =
            "dev-layer";


        const info =
            document.createElement(
                "span"
            );


        info.textContent =
            "第" +
            level +
            "層　" +
            data.name +
            (
                data.implemented
                    ?
                    "　[実装済]"
                    :
                    "　[未実装]"
            );


        const button =
            document.createElement(
                "button"
            );


        button.textContent =
            "確認";


        button.disabled =
            level > 1 &&
            !game.dev
                .allLayersUnlocked;


        button.onclick =
            function(event) {

                event.stopPropagation();

                devAccessLayer(
                    level
                );
            };


        row.appendChild(info);

        row.appendChild(button);

        layerPanel.appendChild(row);
    }


    box.appendChild(
        layerPanel
    );


    const close =
        document.createElement(
            "button"
        );


    close.textContent =
        "閉じる";


    close.style.marginTop =
        "7px";


    close.onclick =
        function(event) {

            event.stopPropagation();

            closeDevMenu();
        };


    box.appendChild(close);
}


// ========================================
// 開発：全鉱石
// ========================================

function devGiveAllOres() {

    if (!DEV_MODE) {

        return;
    }


    ORE_TYPES.forEach(
        function(type) {

            game.warehouse.ores[
                type.id
            ] =
                DEV_ORE_AMOUNT;


            game.records.ores[
                type.id
            ].discovered =
                true;
        }
    );


    addLog(
        "【開発】全鉱石を999個に設定しました。"
    );


    updateLayer2Progress();

    updateAllBaseWindows();

    updateDevUI();
}


// ========================================
// 開発：通常鉱山全開放
// ========================================

function devUnlockAllMineLevels() {

    if (!DEV_MODE) {

        return;
    }


    game.maxUnlockedMineLevel =
        MAX_MINE_LEVEL;


    game.selectedMineLevel =
        MAX_MINE_LEVEL;


    game.progressFlags
        .layer2AnomalyDetected =
        true;


    addLog(
        "【開発】通常鉱山Lv100まで開放しました。"
    );


    updateLayer2Progress();

    updateAllBaseWindows();

    updateDevUI();

    updateBaseTicker(
        true
    );
}


// ========================================
// 開発：全階層開放
// ========================================

function devUnlockAllLayers() {

    if (!DEV_MODE) {

        return;
    }


    game.dev.allLayersUnlocked =
        true;


    addLog(
        "【開発】第1～第5層を開発用に開放しました。"
    );


    addLog(
        "【開発】未実装階層は枠のみ確認できます。"
    );


    updateDevUI();
}


// ========================================
// 開発：地図全表示
// ========================================

function devToggleFullMap() {

    if (!DEV_MODE) {

        return;
    }


    game.dev.fullMapReveal =
        !game.dev.fullMapReveal;


    if (
        game.dev.fullMapReveal
    ) {

        devRevealCurrentMap();


        addLog(
            "【開発】地図全表示をONにしました。"
        );

    } else {

        addLog(
            "【開発】地図全表示をOFFにしました。"
        );
    }


    render();

    updateDevUI();
}


// ========================================
// 開発：現在地図全表示
// ========================================

function devRevealCurrentMap() {

    if (
        !DEV_MODE ||
        game.map.length === 0
    ) {

        return;
    }


    for (
        let y = 0;
        y < MAP_SIZE;
        y++
    ) {

        for (
            let x = 0;
            x < MAP_SIZE;
            x++
        ) {

            if (
                game.explored[y]
            ) {

                game.explored[y][x] =
                    true;
            }
        }
    }


    game.ores.forEach(
        function(ore) {

            ore.discovered = true;
        }
    );


    game.returnPoint.found =
        true;


    game.stairs.found =
        true;


    if (
        game.treasureChest.exists
    ) {

        game.treasureChest.found =
            true;
    }


    if (
        game.randomEvent.exists
    ) {

        if (
            game.randomEvent.type !==
            "rockfall"
        ) {

            game.randomEvent.found =
                true;
        }
    }
}


// ========================================
// 開発：階層アクセス
// ========================================

function devAccessLayer(level) {

    if (!DEV_MODE) {

        return;
    }


    const data =
        getWorldLayerData(
            level
        );


    if (!data) {

        return;
    }


    if (
        level > 1 &&
        !game.dev
            .allLayersUnlocked
    ) {

        addLog(
            "【開発】先に全階層を開放してください。"
        );

        return;
    }


    if (level === 1) {

        game.world.currentLayer =
            1;


        updateBaseTicker(
            true
        );


        closeDevMenu();


        setBaseMessage(
            "第1層「通常鉱山」は実装済みです。"
        );


        addLog(
            "【開発】第1層「通常鉱山」を確認しました。"
        );


        return;
    }


    // ====================================
    // 未実装層の演出確認用
    //
    // この開発確認では一時的に
    // currentLayerを変更して
    // 電光掲示板演出も確認できる。
    //
    // 実際の探索移動は行わない。
    // ====================================

    game.world.currentLayer =
        level;


    updateBaseTicker(
        true
    );


    addLog(
        "【開発】第" +
        level +
        "層「" +
        data.name +
        "」を選択しました。"
    );


    addLog(
        "この領域は現在開発中です。"
    );


    setBaseMessage(
        "第" +
        level +
        "層「" +
        data.name +
        "」は現在開発中です。電光掲示板の演出のみ確認できます。"
    );


    updateDevUI();
}


// ========================================
// セーブデータ作成
// ========================================

function createSaveData() {

    const warehouseOres =
        createEmptyOreStorage();


    ORE_TYPES.forEach(
        function(type) {

            warehouseOres[
                type.id
            ] =
                Number(
                    game.warehouse.ores[
                        type.id
                    ] || 0
                );
        }
    );


    return {

        version:
            SAVE_VERSION,

        savedAt:
            new Date().toISOString(),

        money:
            game.money,

        maxUnlockedMineLevel:
            game.maxUnlockedMineLevel,

        selectedMineLevel:
            game.selectedMineLevel,

        pickaxeLevel:
            game.pickaxe.level,

        baseLevel:
            game.base.level,

        playerHp:
            game.player.hp,

        playerMaxHp:
            game.player.maxHp,

        warehouseOres:
            warehouseOres,

        inventoryItems: {

            detector:
                Number(
                    game.inventory.items
                        .detector || 0
                ),

            returnFeather:
                Number(
                    game.inventory.items
                        .returnFeather || 0
                ),

            potion:
                Number(
                    game.inventory.items
                        .potion || 0
                ),

            food:
                Number(
                    game.inventory.items
                        .food || 0
                ),

            healthBoost:
                Number(
                    game.inventory.items
                        .healthBoost || 0
                )
        },

        world: {

            currentLayer: 1,

            maxUnlockedLayer:
                game.world
                    .maxUnlockedLayer
        },

        progressFlags: {

            layer2ExistenceHint:
                game.progressFlags
                    .layer2ExistenceHint,

            layer2AnomalyDetected:
                game.progressFlags
                    .layer2AnomalyDetected,

            layer2ResonanceDetected:
                game.progressFlags
                    .layer2ResonanceDetected,

            layer2ResearchStarted:
                game.progressFlags
                    .layer2ResearchStarted,

            layer2RequirementsKnown:
                game.progressFlags
                    .layer2RequirementsKnown,

            layer2Attempted:
                game.progressFlags
                    .layer2Attempted
        },

        records:
            JSON.parse(
                JSON.stringify(
                    game.records
                )
            )
    };
}


// ========================================
// セーブ
// ========================================

function saveGame() {

    if (!game.baseOpen) {

        addLog(
            "セーブは拠点で行ってください。"
        );

        return;
    }


    try {

        localStorage.setItem(

            SAVE_KEY,

            JSON.stringify(
                createSaveData()
            )
        );


        addLog(
            "ゲームをセーブしました。"
        );


        setBaseMessage(
            "記録端末に現在の状態を保存しました。"
        );


        updateBaseUI();

    } catch (error) {

        console.error(error);


        addLog(
            "セーブに失敗しました。"
        );


        setBaseMessage(
            "記録端末への保存に失敗しました。"
        );
    }
}


// ========================================
// セーブ有無
// ========================================

function hasSaveData() {

    try {

        return (
            localStorage.getItem(
                SAVE_KEY
            ) !== null
        );

    } catch (error) {

        return false;
    }
}


// ========================================
// 数値補正
// ========================================

function clampNumber(
    value,
    min,
    max,
    fallback
) {

    const number =
        Number(value);


    if (
        !Number.isFinite(
            number
        )
    ) {

        return fallback;
    }


    return Math.max(
        min,
        Math.min(
            max,
            number
        )
    );
}


// ========================================
// 安全な個数
// ========================================

function getSafeAmount(
    value,
    fallback
) {

    const number =
        Number(value);


    if (
        !Number.isFinite(
            number
        )
    ) {

        return fallback;
    }


    return Math.max(
        0,
        Math.floor(number)
    );
}


// ========================================
// 図鑑データ復元
// ========================================

function restoreRecords(
    savedRecords
) {

    game.records.ores =
        createOreRecords();


    game.records.items =
        createItemRecords();


    if (
        !savedRecords ||
        typeof savedRecords !==
        "object"
    ) {

        ORE_TYPES.forEach(
            function(type) {

                const amount =
                    game.warehouse.ores[
                        type.id
                    ] || 0;


                if (amount > 0) {

                    game.records.ores[
                        type.id
                    ].discovered =
                        true;


                    game.records.ores[
                        type.id
                    ].returned =
                        amount;
                }
            }
        );


        registerCurrentlyOwnedItems();

        return;
    }


    const savedOres =
        savedRecords.ores || {};


    ORE_TYPES.forEach(
        function(type) {

            const source =
                savedOres[
                    type.id
                ] || {};


            game.records.ores[
                type.id
            ].discovered =
                Boolean(
                    source.discovered
                );


            game.records.ores[
                type.id
            ].mined =
                getSafeAmount(
                    source.mined,
                    0
                );


            game.records.ores[
                type.id
            ].returned =
                getSafeAmount(
                    source.returned,
                    0
                );
        }
    );


    const savedItems =
        savedRecords.items || {};


    ITEM_DATA.forEach(
        function(item) {

            const source =
                savedItems[
                    item.id
                ] || {};


            game.records.items[
                item.id
            ].discovered =
                Boolean(
                    source.discovered
                );


            game.records.items[
                item.id
            ].acquired =
                getSafeAmount(
                    source.acquired,
                    0
                );
        }
    );


    registerCurrentlyOwnedItems();
}


// ========================================
// 進行フラグ復元
// ========================================

function restoreProgressFlags(
    savedFlags
) {

    game.progressFlags = {

        layer2ExistenceHint: true,

        layer2AnomalyDetected: false,

        layer2ResonanceDetected: false,

        layer2ResearchStarted: false,

        layer2RequirementsKnown: false,

        layer2Attempted: false
    };


    if (
        savedFlags &&
        typeof savedFlags ===
        "object"
    ) {

        game.progressFlags
            .layer2AnomalyDetected =
            Boolean(
                savedFlags
                    .layer2AnomalyDetected
            );


        game.progressFlags
            .layer2ResonanceDetected =
            Boolean(
                savedFlags
                    .layer2ResonanceDetected
            );


        game.progressFlags
            .layer2ResearchStarted =
            Boolean(
                savedFlags
                    .layer2ResearchStarted
            );


        game.progressFlags
            .layer2RequirementsKnown =
            Boolean(
                savedFlags
                    .layer2RequirementsKnown
            );


        game.progressFlags
            .layer2Attempted =
            Boolean(
                savedFlags
                    .layer2Attempted
            );
    }
}


// ========================================
// ロード
// ========================================

function loadGame() {

    let raw = null;


    try {

        raw =
            localStorage.getItem(
                SAVE_KEY
            );

    } catch (error) {

        console.error(error);


        addLog(
            "セーブデータを読み込めませんでした。"
        );

        return;
    }


    if (!raw) {

        addLog(
            "セーブデータがありません。"
        );


        setBaseMessage(
            "記録端末にセーブデータがありません。"
        );

        return;
    }


    let data = null;


    try {

        data =
            JSON.parse(raw);

    } catch (error) {

        console.error(error);


        addLog(
            "セーブデータが破損しています。"
        );

        return;
    }


    if (
        !data ||
        typeof data !==
        "object"
    ) {

        addLog(
            "セーブデータが不正です。"
        );

        return;
    }


    game.money =
        Math.max(
            0,
            Number(data.money) || 0
        );


    game.maxUnlockedMineLevel =
        Math.floor(
            clampNumber(
                data.maxUnlockedMineLevel,
                1,
                MAX_MINE_LEVEL,
                1
            )
        );


    game.selectedMineLevel =
        Math.floor(
            clampNumber(
                data.selectedMineLevel,
                1,
                game.maxUnlockedMineLevel,
                1
            )
        );


    game.currentMineLevel =
        game.selectedMineLevel;


    game.pickaxe.level =
        Math.floor(
            clampNumber(
                data.pickaxeLevel,
                1,
                PICKAXE_MAX_LEVEL,
                1
            )
        );


    game.base.level =
        Math.floor(
            clampNumber(
                data.baseLevel,
                1,
                BASE_MAX_LEVEL,
                1
            )
        );


    game.player.maxHp =
        Math.max(
            1,
            Number(
                data.playerMaxHp
            ) || 10
        );


    game.player.maxHp =
        Math.round(
            game.player.maxHp *
            100
        ) / 100;


    game.player.hp =
        clampNumber(
            data.playerHp,
            0,
            game.player.maxHp,
            game.player.maxHp
        );


    game.player.hp =
        Math.round(
            game.player.hp *
            100
        ) / 100;


    const loadedOres =
        data.warehouseOres || {};


    ORE_TYPES.forEach(
        function(type) {

            game.warehouse.ores[
                type.id
            ] =
                getSafeAmount(
                    loadedOres[
                        type.id
                    ],
                    0
                );
        }
    );


    const items =
        data.inventoryItems || {};


    game.inventory.items.detector =
        getSafeAmount(
            items.detector,
            0
        );


    game.inventory.items.returnFeather =
        getSafeAmount(
            items.returnFeather,
            0
        );


    game.inventory.items.potion =
        getSafeAmount(
            items.potion,
            0
        );


    game.inventory.items.food =
        getSafeAmount(
            items.food,
            0
        );


    game.inventory.items.healthBoost =
        getSafeAmount(
            items.healthBoost,
            0
        );


    game.world.currentLayer = 1;

    game.world.maxUnlockedLayer = 1;


    restoreRecords(
        data.records
    );


    restoreProgressFlags(
        data.progressFlags
    );


    game.dev.allLayersUnlocked =
        false;


    game.dev.fullMapReveal =
        false;


    clearExpeditionBag();


    game.map = [];

    game.explored = [];

    game.ores = [];


    game.treasureChest.exists =
        false;


    game.treasureChest.found =
        false;


    game.randomEvent.exists =
        false;


    game.randomEvent.found =
        false;


    game.randomEvent.type =
        null;


    stopKeyRepeat();


    game.dead = false;

    game.mining = false;

    game.pendingDangerOre = null;

    game.inventoryOpen = false;

    game.warehouseOpen = false;

    game.shopOpen = false;

    game.forgeOpen = false;

    game.baseUpgradeOpen = false;

    game.workshopOpen = false;

    game.archiveOpen = false;

    game.devOpen = false;

    game.deathWarningOpen = false;

    game.returnConfirmOpen = false;

    game.featherConfirmOpen = false;

    game.stairConfirmOpen = false;


    closeInventory();

    closeWarehouse();

    closeShop();

    closeForge();

    closeBaseUpgrade();

    closeWorkshop();

    closeArchive();

    closeDevMenu();

    hideDeathWarning();

    hideReturnConfirm();

    hideFeatherConfirm();

    hideStairConfirm();


    updateLayer2Progress();


    addLog(
        "セーブデータをロードしました。"
    );


    showBase(
        "記録端末からデータを復元しました。"
    );


    updateAllBaseWindows();

    updateBaseTicker(
        true
    );
}


// ========================================
// データ初期化
// ========================================

function resetSaveData() {

    if (!game.baseOpen) {

        return;
    }


    const confirmed =
        window.confirm(
            "セーブデータを削除し、ゲームを初期状態に戻しますか？\nこの操作は取り消せません。"
        );


    if (!confirmed) {

        return;
    }


    try {

        localStorage.removeItem(
            SAVE_KEY
        );

    } catch (error) {

        console.error(error);
    }


    window.location.reload();
}


// ========================================
// 拠点メッセージ
// ========================================

function setBaseMessage(
    message
) {

    const element =
        document.getElementById(
            "baseMessage"
        );


    if (element) {

        element.textContent =
            message || "";
    }
}


// ========================================
// 現在鉱山データ
// ========================================

function getCurrentMineData() {

    return (
        MINE_LEVEL_DATA[
            game.currentMineLevel
        ] ||
        MINE_LEVEL_DATA[1]
    );
}


// ========================================
// 鉱石抽選
// ========================================

function selectOreTypeForCurrentMine() {

    const mineData =
        getCurrentMineData();


    let totalWeight = 0;


    mineData.oreTable.forEach(
        function(entry) {

            totalWeight +=
                entry.weight;
        }
    );


    let roll =
        Math.random() *
        totalWeight;


    for (
        let i = 0;
        i < mineData.oreTable.length;
        i++
    ) {

        const entry =
            mineData.oreTable[i];


        roll -=
            entry.weight;


        if (roll < 0) {

            return (
                getOreTypeById(
                    entry.id
                ) ||
                ORE_TYPES[0]
            );
        }
    }


    return ORE_TYPES[0];
}


// ========================================
// 探索バッグ初期化
// ========================================

function clearExpeditionBag() {

    ORE_TYPES.forEach(
        function(type) {

            game.expeditionBag[
                type.id
            ] = 0;
        }
    );
}


// ========================================
// 次鉱山Lv
// ========================================

function getNextUnlockMineLevel() {

    const next =
        game.maxUnlockedMineLevel +
        1;


    if (
        next > MAX_MINE_LEVEL
    ) {

        return null;
    }


    return next;
}


// ========================================
// 解放条件取得
// ========================================

function getMineUnlockData(level) {

    return (
        MINE_UNLOCK_DATA[
            level
        ] || null
    );
}


// ========================================
// 鉱山解放可能判定
// ========================================

function canUnlockMineLevel(level) {

    if (
        level !==
        game.maxUnlockedMineLevel + 1
    ) {

        return false;
    }


    if (
        level > MAX_MINE_LEVEL
    ) {

        return false;
    }


    return canPayRequirement(
        getMineUnlockData(
            level
        )
    );
}


// ========================================
// 鉱山解放
// ========================================

function unlockMineLevel(level) {

    if (
        !game.baseOpen ||
        !canUnlockMineLevel(level)
    ) {

        return;
    }


    const data =
        getMineUnlockData(
            level
        );


    payRequirement(data);


    game.maxUnlockedMineLevel =
        level;


    game.selectedMineLevel =
        level;


    addLog(
        "鉱山Lv" +
        level +
        "を解放しました！"
    );


    ORE_TYPES
        .filter(
            function(type) {

                return (
                    type.unlockLevel ===
                    level
                );
            }
        )
        .forEach(
            function(type) {

                addLog(
                    type.name +
                    "が出現するようになりました！"
                );
            }
        );


    if (
        level === MAX_MINE_LEVEL
    ) {

        addLog(
            "鉱山Lv100に到達しました！"
        );


        updateLayer2Progress();
    }


    updateAllBaseWindows();
}


// ========================================
// 必要素材表示
// ========================================

function getRequirementTextFromData(
    data
) {

    const parts = [];


    if (
        data.money !== undefined
    ) {

        parts.push(
            data.money + "G"
        );
    }


    for (
        const [oreId, amount]
        of Object.entries(
            data.ores || {}
        )
    ) {

        const type =
            getOreTypeById(
                oreId
            );


        if (type) {

            parts.push(
                type.name +
                "×" +
                amount
            );
        }
    }


    return (
        "必要：" +
        parts.join(" / ")
    );
}


// ========================================
// 所持素材表示
// ========================================

function getOwnedTextFromData(
    data
) {

    const parts = [];


    if (
        data.money !== undefined
    ) {

        parts.push(
            game.money + "G"
        );
    }


    for (
        const oreId
        of Object.keys(
            data.ores || {}
        )
    ) {

        const type =
            getOreTypeById(
                oreId
            );


        if (type) {

            parts.push(
                type.name +
                "×" +
                (
                    game.warehouse.ores[
                        oreId
                    ] || 0
                )
            );
        }
    }


    return (
        "現在：" +
        parts.join(" / ")
    );
}


function getUnlockRequirementText(
    level
) {

    const data =
        getMineUnlockData(
            level
        );


    if (!data) {

        return "";
    }


    return getRequirementTextFromData(
        data
    );
}


function getOwnedRequirementText(
    level
) {

    const data =
        getMineUnlockData(
            level
        );


    if (!data) {

        return "";
    }


    return getOwnedTextFromData(
        data
    );
}


// ========================================
// 支払い可能判定
// ========================================

function canPayRequirement(data) {

    if (!data) {

        return false;
    }


    if (
        data.money !== undefined &&
        game.money < data.money
    ) {

        return false;
    }


    for (
        const [oreId, amount]
        of Object.entries(
            data.ores || {}
        )
    ) {

        if (
            (
                game.warehouse.ores[
                    oreId
                ] || 0
            ) <
            amount
        ) {

            return false;
        }
    }


    return true;
}


// ========================================
// 支払い
// ========================================

function payRequirement(data) {

    if (
        data.money !== undefined
    ) {

        game.money -=
            data.money;
    }


    for (
        const [oreId, amount]
        of Object.entries(
            data.ores || {}
        )
    ) {

        game.warehouse.ores[
            oreId
        ] -=
            amount;
    }
}


// ========================================
// ツルハシ強化
// ========================================

function canUpgradePickaxe() {

    return canPayRequirement(
        getPickaxeUpgradeData(
            game.pickaxe.level + 1
        )
    );
}


function upgradePickaxe() {

    if (
        !game.baseOpen ||
        !game.forgeOpen
    ) {

        return;
    }


    const nextLevel =
        game.pickaxe.level + 1;


    const data =
        getPickaxeUpgradeData(
            nextLevel
        );


    if (
        !data ||
        !canUpgradePickaxe()
    ) {

        return;
    }


    payRequirement(data);


    game.pickaxe.level =
        nextLevel;


    addLog(
        "ツルハシをLv" +
        nextLevel +
        "へ強化しました！ 採掘力：" +
        getMiningPower(
            nextLevel
        )
    );


    updateAllBaseWindows();
}


function getPickaxeRequirementText() {

    const data =
        getPickaxeUpgradeData(
            game.pickaxe.level + 1
        );


    if (!data) {

        return "";
    }


    return getRequirementTextFromData(
        data
    );
}


function getPickaxeOwnedText() {

    const data =
        getPickaxeUpgradeData(
            game.pickaxe.level + 1
        );


    if (!data) {

        return "";
    }


    return getOwnedTextFromData(
        data
    );
}


// ========================================
// 拠点強化
// ========================================

function canUpgradeBase() {

    return canPayRequirement(
        getBaseUpgradeData(
            game.base.level + 1
        )
    );
}


function upgradeBase() {

    if (
        !game.baseOpen ||
        !game.baseUpgradeOpen
    ) {

        return;
    }


    const nextLevel =
        game.base.level + 1;


    const data =
        getBaseUpgradeData(
            nextLevel
        );


    if (
        !data ||
        !canUpgradeBase()
    ) {

        return;
    }


    payRequirement(data);


    game.base.level =
        nextLevel;


    game.player.maxHp +=
        BASE_HP_GAIN;


    game.player.hp +=
        BASE_HP_GAIN;


    addLog(
        "拠点をLv" +
        nextLevel +
        "へ強化しました！ 最大HP +" +
        BASE_HP_GAIN
    );


    updateAllBaseWindows();
}


function getBaseRequirementText() {

    const data =
        getBaseUpgradeData(
            game.base.level + 1
        );


    if (!data) {

        return "";
    }


    return getRequirementTextFromData(
        data
    );
}


function getBaseOwnedText() {

    const data =
        getBaseUpgradeData(
            game.base.level + 1
        );


    if (!data) {

        return "";
    }


    return getOwnedTextFromData(
        data
    );
}


// ========================================
// クラフト
// ========================================

function getCraftRecipe(id) {

    return CRAFT_RECIPES.find(
        function(recipe) {

            return recipe.id === id;
        }
    );
}


function isCraftRecipeUnlocked(
    recipe
) {

    if (!recipe) {

        return false;
    }


    return (
        game.base.level >=
        recipe.unlockBaseLevel &&

        game.maxUnlockedMineLevel >=
        recipe.unlockMineLevel
    );
}


function getCraftUnlockText(
    recipe
) {

    if (
        isCraftRecipeUnlocked(
            recipe
        )
    ) {

        return "解放済み";
    }


    const conditions = [];


    if (
        recipe.unlockBaseLevel > 1
    ) {

        conditions.push(
            "拠点Lv" +
            recipe.unlockBaseLevel
        );
    }


    if (
        recipe.unlockMineLevel > 1
    ) {

        conditions.push(
            "鉱山Lv" +
            recipe.unlockMineLevel +
            "解放"
        );
    }


    return (
        "解放条件：" +
        conditions.join(" / ")
    );
}


function canCraftItem(id) {

    const recipe =
        getCraftRecipe(id);


    if (
        !recipe ||
        !isCraftRecipeUnlocked(
            recipe
        )
    ) {

        return false;
    }


    return canPayRequirement({
        ores: recipe.ores
    });
}


function craftItem(id) {

    if (
        !game.baseOpen ||
        !game.workshopOpen
    ) {

        return;
    }


    const recipe =
        getCraftRecipe(id);


    if (
        !recipe ||
        !canCraftItem(id)
    ) {

        return;
    }


    payRequirement({
        ores: recipe.ores
    });


    addInventoryItem(
        recipe.id,
        recipe.amount
    );


    addLog(
        recipe.name +
        "を" +
        recipe.amount +
        "個作成しました。"
    );


    updateAllBaseWindows();

    updateInventoryUI();
}


// ========================================
// クラフト必要素材
// ========================================

function getCraftRequirementText(
    recipe
) {

    return getRequirementTextFromData({
        ores: recipe.ores
    });
}


// ========================================
// 拠点系更新
// ========================================

function updateAllBaseWindows() {

    updateLayer2Progress();

    updateBaseUI();

    updateWarehouseUI();

    updateShopUI();

    updateForgeUI();

    updateBaseUpgradeUI();

    updateWorkshopUI();

    updateArchiveUI();

    updateDevUI();

    updateStatusUI();

    updateBaseTicker(
        false
    );
}


// ========================================
// 拠点ボタンデザイン
// ========================================

function styleBaseFacilityButton(
    button
) {

    Object.assign(
        button.style,
        {
            minWidth: "96px",
            padding: "8px 13px",

            background:
                "linear-gradient(#3b4046, #24282d)",

            color: "#f1f1f1",

            border:
                "1px solid #737a82",

            borderRadius: "5px",

            boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.08)",

            fontWeight: "bold",

            cursor: "pointer",

            fontSize: "13px"
        }
    );
}


// ========================================
// 拠点UI
// ========================================

function createBaseUI() {

    if (
        document.getElementById(
            "baseOverlay"
        )
    ) {

        return;
    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "baseOverlay";


    Object.assign(
        overlay.style,
        {
            display: "none",

            position: "fixed",

            inset: "0",

            background:
                "radial-gradient(circle at center, rgba(47,53,59,0.95), rgba(7,9,11,0.99))",

            zIndex: "15000",

            alignItems: "center",

            justifyContent: "center",

            padding: "12px",

            boxSizing: "border-box"
        }
    );


    const box =
        document.createElement(
            "div"
        );


    Object.assign(
        box.style,
        {
            width:
                "min(660px, 100%)",

            maxHeight:
                "90vh",

            overflowY: "auto",

            background:
                "linear-gradient(180deg, #252a30, #101215)",

            color: "#f2f2f2",

            border:
                "1px solid #646b73",

            borderRadius: "7px",

            boxShadow:
                "0 15px 45px rgba(0,0,0,0.75)",

            textAlign: "center",

            fontSize: "13px"
        }
    );


    const header =
        document.createElement(
            "div"
        );


    Object.assign(
        header.style,
        {
            padding:
                "12px 16px 10px",

            background:
                "linear-gradient(180deg, #363d45, #242a30)",

            borderBottom:
                "1px solid #777f87"
        }
    );


    const title =
        document.createElement(
            "h2"
        );


    title.textContent =
        "◆ 採 掘 拠 点 ◆";


    Object.assign(
        title.style,
        {
            margin: "0",

            letterSpacing: "3px",

            fontSize: "21px",

            color: "#f1c66a",

            textShadow:
                "0 2px 2px #000"
        }
    );


    const subtitle =
        document.createElement(
            "div"
        );


    subtitle.textContent =
        "MINING OPERATIONS BASE";


    Object.assign(
        subtitle.style,
        {
            marginTop: "3px",

            fontSize: "9px",

            letterSpacing: "2px",

            color: "#9ca4ad"
        }
    );


    header.appendChild(title);

    header.appendChild(subtitle);

    box.appendChild(header);


    const body =
        document.createElement(
            "div"
        );


    body.style.padding =
        "13px";


    // ====================================
    // ステータス
    // ====================================

    const statusPanel =
        document.createElement(
            "div"
        );


    Object.assign(
        statusPanel.style,
        {
            padding: "10px",

            marginBottom: "10px",

            border:
                "1px solid #565d64",

            borderRadius: "5px",

            background:
                "rgba(8,10,12,0.58)"
        }
    );


    const statusTitle =
        document.createElement(
            "div"
        );


    statusTitle.textContent =
        "【 拠点ステータス 】";


    statusTitle.style.marginBottom =
        "6px";


    statusTitle.style.fontWeight =
        "bold";


    statusTitle.style.color =
        "#aeb7c0";


    const playerInfo =
        document.createElement(
            "div"
        );


    playerInfo.id =
        "basePlayerInfo";


    const baseInfo =
        document.createElement(
            "div"
        );


    baseInfo.id =
        "baseLevelInfo";


    const pickaxeInfo =
        document.createElement(
            "div"
        );


    pickaxeInfo.id =
        "basePickaxeInfo";


    const moneyInfo =
        document.createElement(
            "div"
        );


    moneyInfo.id =
        "baseMoneyInfo";


    Object.assign(
        moneyInfo.style,
        {
            marginTop: "5px",

            color: "#f1c66a",

            fontWeight: "bold"
        }
    );


    statusPanel.appendChild(
        statusTitle
    );

    statusPanel.appendChild(
        playerInfo
    );

    statusPanel.appendChild(
        baseInfo
    );

    statusPanel.appendChild(
        pickaxeInfo
    );

    statusPanel.appendChild(
        moneyInfo
    );


    body.appendChild(
        statusPanel
    );


    // ====================================
    // 拠点メッセージ
    // ====================================

    const message =
        document.createElement(
            "div"
        );


    message.id =
        "baseMessage";


    Object.assign(
        message.style,
        {
            padding: "7px 10px",

            marginBottom: "10px",

            background: "#101317",

            borderLeft:
                "3px solid #d0a652",

            color: "#d7dce1",

            textAlign: "left",

            fontSize: "12px"
        }
    );


    body.appendChild(message);


    // ====================================
    // STEP 4-4
    // 電光掲示板
    // ====================================

    const tickerBoard =
        document.createElement(
            "div"
        );


    tickerBoard.id =
        "baseTickerBoard";


    const tickerScreen =
        document.createElement(
            "div"
        );


    tickerScreen.id =
        "baseTickerScreen";


    const tickerText =
        document.createElement(
            "div"
        );


    tickerText.id =
        "baseTickerText";


    tickerText.textContent =
        "◆　GOOD LUCK, MINER.　本日も安全な採掘を。　◆";


    const tickerCrack =
        document.createElement(
            "div"
        );


    tickerCrack.id =
        "baseTickerCrack";


    tickerScreen.appendChild(
        tickerText
    );


    tickerBoard.appendChild(
        tickerScreen
    );


    tickerBoard.appendChild(
        tickerCrack
    );


    body.appendChild(
        tickerBoard
    );


    // ====================================
    // 深度観測
    // ====================================

    const depthBox =
        document.createElement(
            "div"
        );


    depthBox.id =
        "depthObservationBox";


    Object.assign(
        depthBox.style,
        {
            padding: "9px 11px",

            marginBottom: "10px",

            background:
                "rgba(24,18,37,0.78)",

            border:
                "1px solid #564576",

            borderRadius: "5px",

            textAlign: "left"
        }
    );


    body.appendChild(depthBox);


    // ====================================
    // 施設
    // ====================================

    const facilities =
        document.createElement(
            "div"
        );


    Object.assign(
        facilities.style,
        {
            padding: "10px",

            marginBottom: "10px",

            border:
                "1px solid #555c64",

            borderRadius: "5px",

            background:
                "rgba(30,34,39,0.78)"
        }
    );


    const facilitiesTitle =
        document.createElement(
            "div"
        );


    facilitiesTitle.textContent =
        "【 施 設 区 画 】";


    facilitiesTitle.style.marginBottom =
        "8px";


    facilitiesTitle.style.fontWeight =
        "bold";


    facilitiesTitle.style.letterSpacing =
        "1px";


    const facilityButtons =
        document.createElement(
            "div"
        );


    Object.assign(
        facilityButtons.style,
        {
            display: "flex",

            justifyContent: "center",

            gap: "7px",

            flexWrap: "wrap"
        }
    );


    const facilityData = [

        [
            "倉庫",
            openWarehouse
        ],

        [
            "ショップ",
            openShop
        ],

        [
            "鍛冶屋",
            openForge
        ],

        [
            "拠点強化",
            openBaseUpgrade
        ],

        [
            "工房",
            openWorkshop
        ],

        [
            "資料室",
            openArchive
        ]
    ];


    if (DEV_MODE) {

        facilityData.push(
            [
                "開発",
                openDevMenu
            ]
        );
    }


    facilityData.forEach(
        function(data) {

            const button =
                document.createElement(
                    "button"
                );


            button.textContent =
                data[0];


            styleBaseFacilityButton(
                button
            );


            if (
                data[0] === "開発"
            ) {

                button.style.borderColor =
                    "#9a5555";


                button.style.color =
                    "#ffbaba";
            }


            button.onclick =
                function(event) {

                    event.stopPropagation();

                    data[1]();
                };


            facilityButtons.appendChild(
                button
            );
        }
    );


    facilities.appendChild(
        facilitiesTitle
    );


    facilities.appendChild(
        facilityButtons
    );


    body.appendChild(
        facilities
    );


    // ====================================
    // 記録端末
    // ====================================

    const savePanel =
        document.createElement(
            "div"
        );


    Object.assign(
        savePanel.style,
        {
            padding: "9px",

            marginBottom: "10px",

            background:
                "rgba(13,22,24,0.85)",

            border:
                "1px solid #3d6669",

            borderRadius: "5px"
        }
    );


    const saveTitle =
        document.createElement(
            "div"
        );


    saveTitle.textContent =
        "【 記 録 端 末 】";


    Object.assign(
        saveTitle.style,
        {
            marginBottom: "7px",

            color: "#8fd5d5",

            fontWeight: "bold",

            letterSpacing: "1px"
        }
    );


    const saveMenu =
        document.createElement(
            "div"
        );


    Object.assign(
        saveMenu.style,
        {
            display: "flex",

            justifyContent: "center",

            gap: "7px",

            flexWrap: "wrap"
        }
    );


    const saveButton =
        document.createElement(
            "button"
        );


    saveButton.textContent =
        "セーブ";


    styleBaseFacilityButton(
        saveButton
    );


    saveButton.onclick =
        function(event) {

            event.stopPropagation();

            saveGame();
        };


    const loadButton =
        document.createElement(
            "button"
        );


    loadButton.id =
        "loadGameButton";


    loadButton.textContent =
        "ロード";


    styleBaseFacilityButton(
        loadButton
    );


    loadButton.onclick =
        function(event) {

            event.stopPropagation();

            loadGame();
        };


    const resetButton =
        document.createElement(
            "button"
        );


    resetButton.id =
        "resetSaveButton";


    resetButton.textContent =
        "データ初期化";


    styleBaseFacilityButton(
        resetButton
    );


    resetButton.style.borderColor =
        "#814b4b";


    resetButton.onclick =
        function(event) {

            event.stopPropagation();

            resetSaveData();
        };


    saveMenu.appendChild(
        saveButton
    );

    saveMenu.appendChild(
        loadButton
    );

    saveMenu.appendChild(
        resetButton
    );


    savePanel.appendChild(
        saveTitle
    );

    savePanel.appendChild(
        saveMenu
    );


    body.appendChild(
        savePanel
    );


    // ====================================
    // 鉱山管制
    // ====================================

    const controlPanel =
        document.createElement(
            "div"
        );


    Object.assign(
        controlPanel.style,
        {
            padding: "10px",

            background:
                "rgba(24,24,18,0.88)",

            border:
                "1px solid #746a46",

            borderRadius: "5px"
        }
    );


    const controlTitle =
        document.createElement(
            "div"
        );


    controlTitle.textContent =
        "【 鉱 山 管 制 】";


    Object.assign(
        controlTitle.style,
        {
            marginBottom: "8px",

            color: "#e0c779",

            fontWeight: "bold",

            letterSpacing: "1px"
        }
    );


    const unlockBox =
        document.createElement(
            "div"
        );


    unlockBox.id =
        "mineUnlockBox";


    Object.assign(
        unlockBox.style,
        {
            padding: "9px",

            marginBottom: "10px",

            border:
                "1px solid #655d43",

            borderRadius: "5px",

            background: "#151510"
        }
    );


    const selectTitle =
        document.createElement(
            "h3"
        );


    selectTitle.textContent =
        "探索先選択";


    Object.assign(
        selectTitle.style,
        {
            margin: "8px 0",

            fontSize: "14px"
        }
    );


    const selector =
        document.createElement(
            "div"
        );


    Object.assign(
        selector.style,
        {
            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            gap: "9px",

            marginBottom: "9px"
        }
    );


    const left =
        document.createElement(
            "button"
        );


    left.id =
        "mineLevelPrevious";


    left.textContent = "◀";


    Object.assign(
        left.style,
        {
            width: "42px",

            height: "35px",

            fontSize: "17px"
        }
    );


    left.onclick =
        function(event) {

            event.stopPropagation();

            changeSelectedMineLevel(
                -1
            );
        };


    const display =
        document.createElement(
            "div"
        );


    display.id =
        "selectedMineLevelDisplay";


    Object.assign(
        display.style,
        {
            minWidth: "155px",

            padding: "7px 13px",

            background: "#090b0d",

            border:
                "1px solid #8b8055",

            borderRadius: "5px",

            color: "#f2d47d",

            fontSize: "18px",

            fontWeight: "bold",

            letterSpacing: "1px"
        }
    );


    const right =
        document.createElement(
            "button"
        );


    right.id =
        "mineLevelNext";


    right.textContent = "▶";


    Object.assign(
        right.style,
        {
            width: "42px",

            height: "35px",

            fontSize: "17px"
        }
    );


    right.onclick =
        function(event) {

            event.stopPropagation();

            changeSelectedMineLevel(
                1
            );
        };


    selector.appendChild(left);

    selector.appendChild(display);

    selector.appendChild(right);


    const startButton =
        document.createElement(
            "button"
        );


    startButton.id =
        "startSelectedMineButton";


    Object.assign(
        startButton.style,
        {
            padding: "9px 23px",

            fontSize: "15px",

            fontWeight: "bold",

            color: "#18130a",

            background:
                "linear-gradient(#f0cf76, #b88c32)",

            border:
                "1px solid #f5d987",

            borderRadius: "6px",

            boxShadow:
                "0 3px 12px rgba(0,0,0,0.5)",

            cursor: "pointer"
        }
    );


    startButton.onclick =
        function(event) {

            event.stopPropagation();

            startMineFromBase(
                game.selectedMineLevel
            );
        };


    const unlockInfo =
        document.createElement(
            "div"
        );


    unlockInfo.id =
        "baseUnlockInfo";


    Object.assign(
        unlockInfo.style,
        {
            marginTop: "8px",

            fontSize: "11px",

            color: "#aaa"
        }
    );


    controlPanel.appendChild(
        controlTitle
    );

    controlPanel.appendChild(
        unlockBox
    );

    controlPanel.appendChild(
        selectTitle
    );

    controlPanel.appendChild(
        selector
    );

    controlPanel.appendChild(
        startButton
    );

    controlPanel.appendChild(
        unlockInfo
    );


    body.appendChild(
        controlPanel
    );


    box.appendChild(body);

    overlay.appendChild(box);

    document.body.appendChild(
        overlay
    );
}


// ========================================
// 深度観測UI
// ========================================

function updateDepthObservationUI() {

    const box =
        document.getElementById(
            "depthObservationBox"
        );


    if (!box) {

        return;
    }


    box.innerHTML = "";


    const title =
        document.createElement(
            "div"
        );


    title.textContent =
        "【 深 度 観 測 】";


    Object.assign(
        title.style,
        {
            marginBottom: "6px",

            color: "#b5a2ff",

            fontWeight: "bold",

            letterSpacing: "1px"
        }
    );


    box.appendChild(title);


    const flags =
        game.progressFlags;


    if (
        !flags.layer2AnomalyDetected
    ) {

        const text =
            document.createElement(
                "div"
            );


        text.textContent =
            "深部より微弱な異常反応を検出しています。";


        box.appendChild(text);


        const sub =
            document.createElement(
                "div"
            );


        sub.textContent =
            "反応源：不明";


        sub.style.marginTop =
            "3px";


        sub.style.fontSize =
            "11px";


        sub.style.color =
            "#777f89";


        box.appendChild(sub);

        return;
    }


    const status =
        document.createElement(
            "div"
        );


    status.textContent =
        "未確認領域";


    status.style.fontWeight =
        "bold";


    status.style.color =
        "#d1c5ff";


    box.appendChild(status);


    if (
        !flags.layer2ResonanceDetected
    ) {

        const text =
            document.createElement(
                "div"
            );


        text.textContent =
            "鉱山最深部から未知の空間反応を検出しています。";


        text.style.marginTop =
            "4px";


        box.appendChild(text);


        const sub =
            document.createElement(
                "div"
            );


        sub.textContent =
            "解析方法：不明";


        sub.style.marginTop =
            "3px";


        sub.style.color =
            "#85808d";


        box.appendChild(sub);

        return;
    }


    if (
        !flags.layer2ResearchStarted
    ) {

        const text =
            document.createElement(
                "div"
            );


        text.textContent =
            "神鋼鉱と未知の反応源が共鳴しています。";


        text.style.marginTop =
            "4px";


        box.appendChild(text);


        const sub =
            document.createElement(
                "div"
            );


        sub.textContent =
            "より多くの神鋼鉱を観測する必要があります。";


        sub.style.marginTop =
            "3px";


        sub.style.color =
            "#aaa";


        box.appendChild(sub);

        return;
    }


    if (
        !flags.layer2RequirementsKnown
    ) {

        const text =
            document.createElement(
                "div"
            );


        text.textContent =
            "異常反応研究を進行中。神鋼鉱を利用することで反応源への接続が可能と推測されます。";


        text.style.marginTop =
            "4px";


        box.appendChild(text);


        const sub =
            document.createElement(
                "div"
            );


        sub.textContent =
            "必要条件：解析中";


        sub.style.marginTop =
            "4px";


        sub.style.color =
            "#b5a2ff";


        box.appendChild(sub);

        return;
    }


    const text =
        document.createElement(
            "div"
        );


    text.textContent =
        "解析完了。反応源への接続装置を起動できます。";


    text.style.marginTop =
        "4px";


    box.appendChild(text);


    const requirement =
        document.createElement(
            "div"
        );


    requirement.textContent =
        "必要：神鋼鉱×" +
        LAYER2_UNLOCK_GODSTEEL +
        " / " +
        LAYER2_UNLOCK_MONEY +
        "G";


    Object.assign(
        requirement.style,
        {
            marginTop: "6px",

            color: "#d2c8ff",

            fontWeight: "bold"
        }
    );


    box.appendChild(
        requirement
    );


    const owned =
        document.createElement(
            "div"
        );


    owned.textContent =
        "現在：神鋼鉱×" +
        (
            game.warehouse.ores
                .godSteel || 0
        ) +
        " / " +
        game.money +
        "G";


    owned.style.marginTop =
        "3px";


    owned.style.fontSize =
        "11px";


    owned.style.color =
        "#aaa";


    box.appendChild(owned);


    const button =
        document.createElement(
            "button"
        );


    button.textContent =
        "接続を試みる";


    button.disabled =
        !canAttemptLayer2Connection();


    button.style.marginTop =
        "7px";


    button.onclick =
        function(event) {

            event.stopPropagation();

            attemptLayer2Connection();
        };


    box.appendChild(button);


    if (
        flags.layer2Attempted
    ) {

        const development =
            document.createElement(
                "div"
            );


        development.textContent =
            "この先の領域は現在開発中です。";


        Object.assign(
            development.style,
            {
                marginTop: "7px",

                color: "#d6aa72",

                fontSize: "11px"
            }
        );


        box.appendChild(
            development
        );
    }
}


// ========================================
// 拠点表示
// ========================================

function showBase(message) {

    stopKeyRepeat();


    closeInventory();

    closeWarehouse();

    closeShop();

    closeForge();

    closeBaseUpgrade();

    closeWorkshop();

    closeArchive();

    closeDevMenu();


    game.baseOpen = true;


    // ====================================
    // 開発メニューで2～5層演出確認中は
    // currentLayerを維持する。
    //
    // 通常プレイ時は1。
    // ====================================

    if (
        !DEV_MODE ||
        !game.dev.allLayersUnlocked
    ) {

        game.world.currentLayer = 1;
    }


    game.mining = false;

    game.pendingDangerOre = null;


    hideDeathWarning();

    hideReturnConfirm();

    hideFeatherConfirm();

    hideStairConfirm();


    updateLayer2Progress();


    setBaseMessage(
        message || ""
    );


    updateBaseUI();


    showOverlay(
        "baseOverlay"
    );


    updateStatusUI();

    updateBaseTicker(
        true
    );
}


// ========================================
// 拠点非表示
// ========================================

function hideBase() {

    hideOverlay(
        "baseOverlay"
    );


    game.baseOpen = false;
}


// ========================================
// 拠点更新
// ========================================

function updateBaseUI() {

    const player =
        document.getElementById(
            "basePlayerInfo"
        );


    if (player) {

        player.textContent =
            "隊員HP　" +
            formatHp(
                game.player.hp
            ) +
            " / " +
            formatHp(
                game.player.maxHp
            );
    }


    const base =
        document.getElementById(
            "baseLevelInfo"
        );


    if (base) {

        base.textContent =
            "拠点設備　Lv" +
            game.base.level +
            " / " +
            BASE_MAX_LEVEL;
    }


    const pickaxe =
        document.getElementById(
            "basePickaxeInfo"
        );


    if (pickaxe) {

        pickaxe.textContent =
            "採掘装備　ツルハシLv" +
            game.pickaxe.level +
            " / 採掘力 " +
            getMiningPower(
                game.pickaxe.level
            );
    }


    const money =
        document.getElementById(
            "baseMoneyInfo"
        );


    if (money) {

        money.textContent =
            "運用資金　" +
            game.money +
            " G";
    }


    const unlockInfo =
        document.getElementById(
            "baseUnlockInfo"
        );


    if (unlockInfo) {

        unlockInfo.textContent =
            "現在の探索許可範囲：鉱山Lv1 ～ Lv" +
            game.maxUnlockedMineLevel;
    }


    const load =
        document.getElementById(
            "loadGameButton"
        );


    if (load) {

        load.disabled =
            !hasSaveData();
    }


    const reset =
        document.getElementById(
            "resetSaveButton"
        );


    if (reset) {

        reset.disabled =
            !hasSaveData();
    }


    updateDepthObservationUI();

    updateMineUnlockUI();

    updateMineLevelSelectorUI();
}


// ========================================
// 鉱山Lv選択
// ========================================

function changeSelectedMineLevel(
    direction
) {

    game.selectedMineLevel =
        Math.max(
            1,
            Math.min(
                game.maxUnlockedMineLevel,
                game.selectedMineLevel +
                direction
            )
        );


    updateMineLevelSelectorUI();
}


// ========================================
// 鉱山Lv選択UI
// ========================================

function updateMineLevelSelectorUI() {

    game.selectedMineLevel =
        Math.max(
            1,
            Math.min(
                game.selectedMineLevel,
                game.maxUnlockedMineLevel
            )
        );


    const display =
        document.getElementById(
            "selectedMineLevelDisplay"
        );


    const left =
        document.getElementById(
            "mineLevelPrevious"
        );


    const right =
        document.getElementById(
            "mineLevelNext"
        );


    const start =
        document.getElementById(
            "startSelectedMineButton"
        );


    if (display) {

        display.textContent =
            "鉱山 Lv " +
            game.selectedMineLevel;
    }


    if (left) {

        left.disabled =
            game.selectedMineLevel <= 1;
    }


    if (right) {

        right.disabled =
            game.selectedMineLevel >=
            game.maxUnlockedMineLevel;
    }


    if (start) {

        start.textContent =
            "鉱山Lv" +
            game.selectedMineLevel +
            "へ探索";
    }
}


// ========================================
// 鉱山解放UI
// ========================================

function updateMineUnlockUI() {

    const box =
        document.getElementById(
            "mineUnlockBox"
        );


    if (!box) {

        return;
    }


    box.innerHTML = "";


    const next =
        getNextUnlockMineLevel();


    const title =
        document.createElement(
            "h3"
        );


    title.style.margin =
        "0 0 6px";


    title.style.fontSize =
        "14px";


    title.style.color =
        "#e2c875";


    if (next === null) {

        title.textContent =
            "通常鉱山 全区画解放済み";


        box.appendChild(title);


        const text =
            document.createElement(
                "div"
            );


        text.textContent =
            "鉱山Lv100まで探索できます。";


        box.appendChild(text);

        return;
    }


    title.textContent =
        "次区画：鉱山Lv" +
        next;


    box.appendChild(title);


    const need =
        document.createElement(
            "div"
        );


    need.textContent =
        getUnlockRequirementText(
            next
        );


    need.style.marginBottom =
        "4px";


    box.appendChild(need);


    const owned =
        document.createElement(
            "div"
        );


    owned.textContent =
        getOwnedRequirementText(
            next
        );


    owned.style.marginBottom =
        "7px";


    owned.style.fontSize =
        "11px";


    owned.style.color =
        "#aaa";


    box.appendChild(owned);


    const button =
        document.createElement(
            "button"
        );


    button.textContent =
        "鉱山Lv" +
        next +
        "を解放";


    button.disabled =
        !canUnlockMineLevel(
            next
        );


    button.onclick =
        function(event) {

            event.stopPropagation();

            unlockMineLevel(
                next
            );
        };


    box.appendChild(button);
}


// ========================================
// 鉱山入場
// ========================================

function startMineFromBase(level) {

    if (!game.baseOpen) {

        return;
    }


    if (
        game.warehouseOpen ||
        game.shopOpen ||
        game.forgeOpen ||
        game.baseUpgradeOpen ||
        game.workshopOpen ||
        game.archiveOpen ||
        game.devOpen
    ) {

        return;
    }


    if (
        level < 1 ||
        level >
        game.maxUnlockedMineLevel
    ) {

        return;
    }


    game.world.currentLayer = 1;

    game.currentMineLevel = level;

    game.selectedMineLevel = level;

    game.player.hp =
        game.player.maxHp;

    game.dead = false;

    game.mining = false;

    game.pendingDangerOre = null;


    clearExpeditionBag();

    hideBase();

    generateMineFloor();


    addLog(
        "鉱山Lv" +
        level +
        "へ入場しました。"
    );


    updateStatusUI();
}


// ========================================
// 資料室UI
// ========================================

function createArchiveUI() {

    if (
        document.getElementById(
            "archiveOverlay"
        )
    ) {

        return;
    }


    const overlay =
        createOverlay(
            "archiveOverlay"
        );


    overlay.style.zIndex =
        "16000";


    const box =
        createModalWindow();


    box.id =
        "archiveWindow";


    box.style.width =
        "min(650px, calc(100% - 40px))";


    overlay.appendChild(box);

    document.body.appendChild(
        overlay
    );
}


// ========================================
// 資料室を開く
// ========================================

function openArchive() {

    if (!game.baseOpen) {

        return;
    }


    closeWarehouse();

    closeShop();

    closeForge();

    closeBaseUpgrade();

    closeWorkshop();

    closeDevMenu();


    game.archiveOpen = true;


    updateArchiveUI();


    showOverlay(
        "archiveOverlay"
    );
}


// ========================================
// 資料室を閉じる
// ========================================

function closeArchive() {

    hideOverlay(
        "archiveOverlay"
    );


    game.archiveOpen = false;
}


// ========================================
// 資料室タブ
// ========================================

function setArchiveTab(tab) {

    game.archiveTab = tab;

    updateArchiveUI();
}


// ========================================
// 鉱石発見数
// ========================================

function getDiscoveredOreCount() {

    let count = 0;


    ORE_TYPES.forEach(
        function(type) {

            if (
                game.records.ores[
                    type.id
                ].discovered
            ) {

                count++;
            }
        }
    );


    return count;
}


// ========================================
// アイテム発見数
// ========================================

function getDiscoveredItemCount() {

    let count = 0;


    ITEM_DATA.forEach(
        function(item) {

            if (
                game.records.items[
                    item.id
                ].discovered
            ) {

                count++;
            }
        }
    );


    return count;
}


// ========================================
// 資料室更新
// ========================================

function updateArchiveUI() {

    const box =
        document.getElementById(
            "archiveWindow"
        );


    if (!box) {

        return;
    }


    box.innerHTML = "";


    box.appendChild(
        createTitle(
            "資料室"
        )
    );


    const layerRecord =
        document.createElement(
            "div"
        );


    Object.assign(
        layerRecord.style,
        {
            padding: "9px 10px",

            marginBottom: "11px",

            background:
                "rgba(20,17,30,0.7)",

            border:
                "1px solid #4c4265",

            borderRadius: "5px",

            textAlign: "left"
        }
    );


    const layerTitle =
        document.createElement(
            "div"
        );


    layerTitle.textContent =
        "領域記録";


    layerTitle.style.fontWeight =
        "bold";


    layerTitle.style.color =
        "#b9abed";


    layerRecord.appendChild(
        layerTitle
    );


    const layer1 =
        document.createElement(
            "div"
        );


    layer1.textContent =
        "第1層　通常鉱山";


    layer1.style.marginTop =
        "5px";


    layerRecord.appendChild(
        layer1
    );


    const layer2 =
        document.createElement(
            "div"
        );


    layer2.style.marginTop =
        "3px";


    layer2.style.color =
        "#777f89";


    if (
        game.progressFlags
            .layer2AnomalyDetected
    ) {

        layer2.textContent =
            "第2層　未確認領域";

    } else {

        layer2.textContent =
            "???　異常反応あり";
    }


    layerRecord.appendChild(
        layer2
    );


    if (
        DEV_MODE &&
        game.dev.allLayersUnlocked
    ) {

        const devInfo =
            document.createElement(
                "div"
            );


        devInfo.style.marginTop =
            "7px";


        devInfo.style.paddingTop =
            "6px";


        devInfo.style.borderTop =
            "1px dashed #574b6f";


        devInfo.style.color =
            "#b18b8b";


        devInfo.style.fontSize =
            "11px";


        devInfo.textContent =
            "【開発表示】旧坑道 / 無風回廊 / 残光遺跡 / 虚夜空間";


        layerRecord.appendChild(
            devInfo
        );
    }


    box.appendChild(
        layerRecord
    );


    const tabs =
        document.createElement(
            "div"
        );


    Object.assign(
        tabs.style,
        {
            display: "flex",

            justifyContent: "center",

            gap: "7px",

            marginBottom: "11px"
        }
    );


    const oreButton =
        document.createElement(
            "button"
        );


    oreButton.textContent =
        "鉱物図鑑 " +
        getDiscoveredOreCount() +
        "/" +
        ORE_TYPES.length;


    oreButton.disabled =
        game.archiveTab ===
        "ores";


    oreButton.onclick =
        function(event) {

            event.stopPropagation();

            setArchiveTab(
                "ores"
            );
        };


    const itemButton =
        document.createElement(
            "button"
        );


    itemButton.textContent =
        "アイテム図鑑 " +
        getDiscoveredItemCount() +
        "/" +
        ITEM_DATA.length;


    itemButton.disabled =
        game.archiveTab ===
        "items";


    itemButton.onclick =
        function(event) {

            event.stopPropagation();

            setArchiveTab(
                "items"
            );
        };


    tabs.appendChild(
        oreButton
    );

    tabs.appendChild(
        itemButton
    );


    box.appendChild(tabs);


    if (
        game.archiveTab ===
        "items"
    ) {

        renderItemArchive(box);

    } else {

        renderOreArchive(box);
    }


    const close =
        document.createElement(
            "button"
        );


    close.textContent =
        "閉じる";


    close.style.marginTop =
        "11px";


    close.onclick =
        function(event) {

            event.stopPropagation();

            closeArchive();
        };


    box.appendChild(close);
}


// ========================================
// 鉱物図鑑
// ========================================

function renderOreArchive(
    parent
) {

    const heading =
        document.createElement(
            "div"
        );


    heading.textContent =
        "【 通常鉱山 】";


    Object.assign(
        heading.style,
        {
            marginBottom: "8px",

            color: "#e1c46d",

            fontWeight: "bold"
        }
    );


    parent.appendChild(heading);


    ORE_TYPES.forEach(
        function(type) {

            const record =
                game.records.ores[
                    type.id
                ];


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "archive-record";


            if (
                !record.discovered
            ) {

                row.classList.add(
                    "archive-undiscovered"
                );


                row.textContent =
                    "???　未発見";


                parent.appendChild(row);

                return;
            }


            const title =
                document.createElement(
                    "div"
                );


            title.textContent =
                type.name;


            Object.assign(
                title.style,
                {
                    color: type.color,

                    fontWeight: "bold"
                }
            );


            row.appendChild(title);


            const info =
                document.createElement(
                    "div"
                );


            info.className =
                "archive-small";


            info.textContent =
                "基礎耐久：" +
                type.minHp +
                "～" +
                type.maxHp +
                "　売値：" +
                type.sellPrice +
                "G　出現：鉱山Lv" +
                type.unlockLevel +
                "～";


            row.appendChild(info);


            const stats =
                document.createElement(
                    "div"
                );


            stats.className =
                "archive-small";


            stats.textContent =
                "採掘成功：" +
                record.mined +
                "　累計持ち帰り：" +
                record.returned;


            row.appendChild(stats);


            parent.appendChild(row);
        }
    );


    const unknown =
        document.createElement(
            "div"
        );


    unknown.className =
        "archive-record archive-undiscovered";


    if (
        game.progressFlags
            .layer2AnomalyDetected
    ) {

        unknown.textContent =
            "【 未確認領域 】　鉱物データなし";

    } else {

        unknown.textContent =
            "【 ??? 】　データなし";
    }


    parent.appendChild(unknown);
}


// ========================================
// アイテム図鑑
// ========================================

function renderItemArchive(
    parent
) {

    const heading =
        document.createElement(
            "div"
        );


    heading.textContent =
        "【 通常鉱山由来 】";


    Object.assign(
        heading.style,
        {
            marginBottom: "8px",

            color: "#e1c46d",

            fontWeight: "bold"
        }
    );


    parent.appendChild(heading);


    ITEM_DATA.forEach(
        function(item) {

            const record =
                game.records.items[
                    item.id
                ];


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "archive-record";


            if (
                !record.discovered
            ) {

                row.classList.add(
                    "archive-undiscovered"
                );


                row.textContent =
                    "???　未発見";


                parent.appendChild(row);

                return;
            }


            const title =
                document.createElement(
                    "div"
                );


            title.textContent =
                item.name;


            title.style.fontWeight =
                "bold";


            title.style.color =
                "#d8dde1";


            row.appendChild(title);


            const description =
                document.createElement(
                    "div"
                );


            description.className =
                "archive-small";


            description.textContent =
                item.description;


            row.appendChild(
                description
            );


            const current =
                document.createElement(
                    "div"
                );


            current.className =
                "archive-small";


            current.textContent =
                "現在所持：" +
                (
                    game.inventory.items[
                        item.id
                    ] || 0
                ) +
                "　累計入手：" +
                record.acquired;


            row.appendChild(current);


            parent.appendChild(row);
        }
    );


    const unknown =
        document.createElement(
            "div"
        );


    unknown.className =
        "archive-record archive-undiscovered";


    if (
        game.progressFlags
            .layer2AnomalyDetected
    ) {

        unknown.textContent =
            "【 未確認領域 】　アイテムデータなし";

    } else {

        unknown.textContent =
            "【 ??? 】　データなし";
    }


    parent.appendChild(unknown);
}


// ========================================
// 倉庫UI
// ========================================

function createWarehouseUI() {

    if (
        document.getElementById(
            "warehouseOverlay"
        )
    ) {

        return;
    }


    const overlay =
        createOverlay(
            "warehouseOverlay"
        );


    overlay.style.zIndex =
        "16000";


    const box =
        createModalWindow();


    box.id =
        "warehouseWindow";


    overlay.appendChild(box);

    document.body.appendChild(
        overlay
    );
}


// ========================================
// 倉庫を開く
// ========================================

function openWarehouse() {

    if (!game.baseOpen) {

        return;
    }


    closeShop();

    closeForge();

    closeBaseUpgrade();

    closeWorkshop();

    closeArchive();

    closeDevMenu();


    game.warehouseOpen = true;


    updateWarehouseUI();


    showOverlay(
        "warehouseOverlay"
    );
}


// ========================================
// 倉庫を閉じる
// ========================================

function closeWarehouse() {

    hideOverlay(
        "warehouseOverlay"
    );


    game.warehouseOpen = false;
}


// ========================================
// 倉庫更新
// ========================================

function updateWarehouseUI() {

    const box =
        document.getElementById(
            "warehouseWindow"
        );


    if (!box) {

        return;
    }


    box.innerHTML = "";


    box.appendChild(
        createTitle(
            "倉庫"
        )
    );


    const description =
        document.createElement(
            "div"
        );


    description.textContent =
        "保管済みの鉱石は、鉱山で力尽きても失われません。";


    description.style.marginBottom =
        "13px";


    box.appendChild(
        description
    );


    ORE_TYPES.forEach(
        function(type) {

            const row =
                document.createElement(
                    "div"
                );


            Object.assign(
                row.style,
                {
                    display: "flex",

                    justifyContent:
                        "space-between",

                    padding: "5px 8px",

                    marginBottom: "3px",

                    background:
                        "rgba(0,0,0,0.15)",

                    borderRadius: "4px"
                }
            );


            const name =
                document.createElement(
                    "span"
                );


            name.textContent =
                type.name;


            const amount =
                document.createElement(
                    "span"
                );


            amount.textContent =
                game.warehouse.ores[
                    type.id
                ] || 0;


            amount.style.color =
                type.color;


            row.appendChild(name);

            row.appendChild(amount);

            box.appendChild(row);
        }
    );


    const close =
        document.createElement(
            "button"
        );


    close.textContent =
        "閉じる";


    close.style.marginTop =
        "11px";


    close.onclick =
        function(event) {

            event.stopPropagation();

            closeWarehouse();
        };


    box.appendChild(close);
}


// ========================================
// ショップUI
// ========================================

function createShopUI() {

    if (
        document.getElementById(
            "shopOverlay"
        )
    ) {

        return;
    }


    const overlay =
        createOverlay(
            "shopOverlay"
        );


    overlay.style.zIndex =
        "16000";


    const box =
        createModalWindow();


    box.id =
        "shopWindow";


    box.style.width =
        "min(600px, calc(100% - 40px))";


    overlay.appendChild(box);

    document.body.appendChild(
        overlay
    );
}


// ========================================
// ショップを開く
// ========================================

function openShop() {

    if (!game.baseOpen) {

        return;
    }


    closeWarehouse();

    closeForge();

    closeBaseUpgrade();

    closeWorkshop();

    closeArchive();

    closeDevMenu();


    game.shopOpen = true;


    updateShopUI();


    showOverlay(
        "shopOverlay"
    );
}


// ========================================
// ショップを閉じる
// ========================================

function closeShop() {

    hideOverlay(
        "shopOverlay"
    );


    game.shopOpen = false;
}


// ========================================
// ショップ更新
// ========================================

function updateShopUI() {

    const box =
        document.getElementById(
            "shopWindow"
        );


    if (!box) {

        return;
    }


    box.innerHTML = "";


    box.appendChild(
        createTitle(
            "ショップ"
        )
    );


    const money =
        document.createElement(
            "div"
        );


    money.textContent =
        "所持金：" +
        game.money +
        " G";


    money.style.fontWeight =
        "bold";


    money.style.color =
        "#f1c66a";


    money.style.marginBottom =
        "13px";


    box.appendChild(money);


    ORE_TYPES.forEach(
        function(type) {

            createShopOreRow(
                box,
                type
            );
        }
    );


    const buttons =
        document.createElement(
            "div"
        );


    Object.assign(
        buttons.style,
        {
            display: "flex",

            justifyContent: "center",

            gap: "8px",

            flexWrap: "wrap",

            marginTop: "13px"
        }
    );


    const sellAll =
        document.createElement(
            "button"
        );


    sellAll.textContent =
        "全鉱石をまとめて売る";


    sellAll.disabled =
        getWarehouseOreTotal() <= 0;


    sellAll.onclick =
        function(event) {

            event.stopPropagation();

            sellAllWarehouseOres();
        };


    const close =
        document.createElement(
            "button"
        );


    close.textContent = "閉じる";


    close.onclick =
        function(event) {

            event.stopPropagation();

            closeShop();
        };


    buttons.appendChild(sellAll);

    buttons.appendChild(close);

    box.appendChild(buttons);
}


// ========================================
// ショップ鉱石行
// ========================================

function createShopOreRow(
    parent,
    type
) {

    const amount =
        game.warehouse.ores[
            type.id
        ] || 0;


    const row =
        document.createElement(
            "div"
        );


    Object.assign(
        row.style,
        {
            display: "flex",

            justifyContent:
                "space-between",

            alignItems: "center",

            gap: "7px",

            padding: "6px",

            marginBottom: "4px",

            border:
                "1px solid #444",

            borderRadius: "4px",

            background:
                "rgba(0,0,0,0.14)"
        }
    );


    const info =
        document.createElement(
            "div"
        );


    info.textContent =
        type.name +
        " × " +
        amount +
        "　売値：" +
        type.sellPrice +
        "G";


    const buttons =
        document.createElement(
            "div"
        );


    buttons.style.display =
        "flex";


    buttons.style.gap =
        "4px";


    const one =
        document.createElement(
            "button"
        );


    one.textContent =
        "1個売る";


    one.disabled =
        amount <= 0;


    one.onclick =
        function(event) {

            event.stopPropagation();

            sellOre(
                type.id,
                1
            );
        };


    const all =
        document.createElement(
            "button"
        );


    all.textContent =
        "全部売る";


    all.disabled =
        amount <= 0;


    all.onclick =
        function(event) {

            event.stopPropagation();

            sellOre(
                type.id,
                amount
            );
        };


    buttons.appendChild(one);

    buttons.appendChild(all);

    row.appendChild(info);

    row.appendChild(buttons);

    parent.appendChild(row);
}


// ========================================
// 鉱石売却
// ========================================

function sellOre(
    oreId,
    amount
) {

    if (!game.shopOpen) {

        return;
    }


    const type =
        getOreTypeById(
            oreId
        );


    if (!type) {

        return;
    }


    const owned =
        game.warehouse.ores[
            oreId
        ] || 0;


    const sellAmount =
        Math.min(
            owned,
            Math.max(
                0,
                amount
            )
        );


    if (sellAmount <= 0) {

        return;
    }


    const earned =
        sellAmount *
        type.sellPrice;


    game.warehouse.ores[
        oreId
    ] -=
        sellAmount;


    game.money +=
        earned;


    addLog(
        type.name +
        "を" +
        sellAmount +
        "個売却しました。 +" +
        earned +
        "G"
    );


    updateAllBaseWindows();
}


// ========================================
// 倉庫鉱石総数
// ========================================

function getWarehouseOreTotal() {

    let total = 0;


    ORE_TYPES.forEach(
        function(type) {

            total +=
                game.warehouse.ores[
                    type.id
                ] || 0;
        }
    );


    return total;
}


// ========================================
// 全鉱石売却
// ========================================

function sellAllWarehouseOres() {

    if (!game.shopOpen) {

        return;
    }


    let totalSold = 0;

    let totalEarned = 0;


    ORE_TYPES.forEach(
        function(type) {

            const amount =
                game.warehouse.ores[
                    type.id
                ] || 0;


            totalSold += amount;


            totalEarned +=
                amount *
                type.sellPrice;


            game.warehouse.ores[
                type.id
            ] = 0;
        }
    );


    if (totalSold <= 0) {

        return;
    }


    game.money +=
        totalEarned;


    addLog(
        totalSold +
        "個の鉱石をまとめて売却しました。 +" +
        totalEarned +
        "G"
    );


    updateAllBaseWindows();
}


// ========================================
// 鍛冶屋UI
// ========================================

function createForgeUI() {

    if (
        document.getElementById(
            "forgeOverlay"
        )
    ) {

        return;
    }


    const overlay =
        createOverlay(
            "forgeOverlay"
        );


    overlay.style.zIndex =
        "16000";


    const box =
        createModalWindow();


    box.id =
        "forgeWindow";


    overlay.appendChild(box);

    document.body.appendChild(
        overlay
    );
}


// ========================================
// 鍛冶屋を開く
// ========================================

function openForge() {

    if (!game.baseOpen) {

        return;
    }


    closeWarehouse();

    closeShop();

    closeBaseUpgrade();

    closeWorkshop();

    closeArchive();

    closeDevMenu();


    game.forgeOpen = true;


    updateForgeUI();


    showOverlay(
        "forgeOverlay"
    );
}


// ========================================
// 鍛冶屋を閉じる
// ========================================

function closeForge() {

    hideOverlay(
        "forgeOverlay"
    );


    game.forgeOpen = false;
}


// ========================================
// 鍛冶屋更新
// ========================================

function updateForgeUI() {

    const box =
        document.getElementById(
            "forgeWindow"
        );


    if (!box) {

        return;
    }


    box.innerHTML = "";


    box.appendChild(
        createTitle(
            "鍛冶屋"
        )
    );


    const current =
        document.createElement(
            "div"
        );


    current.textContent =
        "ツルハシLv" +
        game.pickaxe.level +
        "　採掘力：" +
        getMiningPower(
            game.pickaxe.level
        );


    current.style.marginBottom =
        "12px";


    current.style.fontWeight =
        "bold";


    box.appendChild(current);

    const pickaxeCapInfo =
        document.createElement("div");

    pickaxeCapInfo.textContent =
        "現在の強化上限：Lv" +
        getCurrentPickaxeMaxLevel();

    pickaxeCapInfo.style.fontSize =
        "11px";

    pickaxeCapInfo.style.color =
        "#9ea8b2";

    pickaxeCapInfo.style.marginBottom =
        "10px";

    box.appendChild(
        pickaxeCapInfo
    );


    if (
        game.pickaxe.level >=
        getCurrentPickaxeMaxLevel()
    ) {

        const max =
            document.createElement(
                "div"
            );


        max.textContent =
            "ツルハシは最大Lvです。";


        box.appendChild(max);

    } else {

        const next =
            document.createElement(
                "div"
            );


        next.textContent =
            "強化後：Lv" +
            (
                game.pickaxe.level + 1
            ) +
            "　採掘力：" +
            getMiningPower(
                game.pickaxe.level + 1
            );


        next.style.marginBottom =
            "8px";


        box.appendChild(next);


        const need =
            document.createElement(
                "div"
            );


        need.textContent =
            getPickaxeRequirementText();


        box.appendChild(need);


        const owned =
            document.createElement(
                "div"
            );


        owned.textContent =
            getPickaxeOwnedText();


        owned.style.marginBottom =
            "12px";


        owned.style.color =
            "#aaa";


        box.appendChild(owned);


        const button =
            document.createElement(
                "button"
            );


        button.textContent =
            "ツルハシを強化";


        button.disabled =
            !canUpgradePickaxe();


        button.onclick =
            function(event) {

                event.stopPropagation();

                upgradePickaxe();
            };


        box.appendChild(button);
    }


    const close =
        document.createElement(
            "button"
        );


    close.textContent =
        "閉じる";


    close.style.marginLeft =
        "8px";


    close.onclick =
        function(event) {

            event.stopPropagation();

            closeForge();
        };


    box.appendChild(close);
}


// ========================================
// 拠点強化UI
// ========================================

function createBaseUpgradeUI() {

    if (
        document.getElementById(
            "baseUpgradeOverlay"
        )
    ) {

        return;
    }


    const overlay =
        createOverlay(
            "baseUpgradeOverlay"
        );


    overlay.style.zIndex =
        "16000";


    const box =
        createModalWindow();


    box.id =
        "baseUpgradeWindow";


    overlay.appendChild(box);

    document.body.appendChild(
        overlay
    );
}


// ========================================
// 拠点強化を開く
// ========================================

function openBaseUpgrade() {

    if (!game.baseOpen) {

        return;
    }


    closeWarehouse();

    closeShop();

    closeForge();

    closeWorkshop();

    closeArchive();

    closeDevMenu();


    game.baseUpgradeOpen = true;


    updateBaseUpgradeUI();


    showOverlay(
        "baseUpgradeOverlay"
    );
}


// ========================================
// 拠点強化を閉じる
// ========================================

function closeBaseUpgrade() {

    hideOverlay(
        "baseUpgradeOverlay"
    );


    game.baseUpgradeOpen = false;
}


// ========================================
// 拠点強化更新
// ========================================

function updateBaseUpgradeUI() {

    const box =
        document.getElementById(
            "baseUpgradeWindow"
        );


    if (!box) {

        return;
    }


    box.innerHTML = "";


    box.appendChild(
        createTitle(
            "拠点強化"
        )
    );


    const current =
        document.createElement(
            "div"
        );


    current.textContent =
        "拠点Lv" +
        game.base.level +
        " / " +
        BASE_MAX_LEVEL +
        "　最大HP：" +
        formatHp(
            game.player.maxHp
        );


    current.style.marginBottom =
        "12px";


    current.style.fontWeight =
        "bold";


    box.appendChild(current);


    const description =
        document.createElement(
            "div"
        );


    description.textContent =
        "拠点を強化すると最大HPが2増加します。";


    description.style.marginBottom =
        "12px";


    description.style.color =
        "#b8bec4";


    box.appendChild(description);


    if (
        game.base.level >=
        BASE_MAX_LEVEL
    ) {

        const max =
            document.createElement(
                "div"
            );


        max.textContent =
            "拠点は最大Lvです。";


        box.appendChild(max);

    } else {

        const need =
            document.createElement(
                "div"
            );


        need.textContent =
            getBaseRequirementText();


        box.appendChild(need);


        const owned =
            document.createElement(
                "div"
            );


        owned.textContent =
            getBaseOwnedText();


        owned.style.marginBottom =
            "12px";


        owned.style.color =
            "#aaa";


        box.appendChild(owned);


        const button =
            document.createElement(
                "button"
            );


        button.textContent =
            "拠点を強化";


        button.disabled =
            !canUpgradeBase();


        button.onclick =
            function(event) {

                event.stopPropagation();

                upgradeBase();
            };


        box.appendChild(button);
    }


    const close =
        document.createElement(
            "button"
        );


    close.textContent =
        "閉じる";


    close.style.marginLeft =
        "8px";


    close.onclick =
        function(event) {

            event.stopPropagation();

            closeBaseUpgrade();
        };


    box.appendChild(close);
}


// ========================================
// 工房UI
// ========================================

function createWorkshopUI() {

    if (
        document.getElementById(
            "workshopOverlay"
        )
    ) {

        return;
    }


    const overlay =
        createOverlay(
            "workshopOverlay"
        );


    overlay.style.zIndex =
        "16000";


    const box =
        createModalWindow();


    box.id =
        "workshopWindow";


    box.style.width =
        "min(600px, calc(100% - 40px))";


    overlay.appendChild(box);

    document.body.appendChild(
        overlay
    );
}


// ========================================
// 工房を開く
// ========================================

function openWorkshop() {

    if (!game.baseOpen) {

        return;
    }


    closeWarehouse();

    closeShop();

    closeForge();

    closeBaseUpgrade();

    closeArchive();

    closeDevMenu();


    game.workshopOpen = true;


    updateWorkshopUI();


    showOverlay(
        "workshopOverlay"
    );
}


// ========================================
// 工房を閉じる
// ========================================

function closeWorkshop() {

    hideOverlay(
        "workshopOverlay"
    );


    game.workshopOpen = false;
}


// ========================================
// 工房更新
// ========================================

function updateWorkshopUI() {

    const box =
        document.getElementById(
            "workshopWindow"
        );


    if (!box) {

        return;
    }


    box.innerHTML = "";


    box.appendChild(
        createTitle(
            "工房"
        )
    );


    const description =
        document.createElement(
            "div"
        );


    description.textContent =
        "進行に応じて新しいクラフトレシピが解放されます。";


    description.style.marginBottom =
        "13px";


    description.style.color =
        "#b8bec4";


    box.appendChild(description);


    CRAFT_RECIPES.forEach(
        function(recipe) {

            createCraftRecipeRow(
                box,
                recipe
            );
        }
    );


    const close =
        document.createElement(
            "button"
        );


    close.textContent =
        "閉じる";


    close.style.marginTop =
        "8px";


    close.onclick =
        function(event) {

            event.stopPropagation();

            closeWorkshop();
        };


    box.appendChild(close);
}


// ========================================
// クラフト行
// ========================================

function createCraftRecipeRow(
    parent,
    recipe
) {

    const unlocked =
        isCraftRecipeUnlocked(
            recipe
        );


    const row =
        document.createElement(
            "div"
        );


    Object.assign(
        row.style,
        {
            padding: "9px",

            marginBottom: "8px",

            border:
                unlocked
                    ?
                    "1px solid #555"
                    :
                    "1px solid #333",

            borderRadius: "5px",

            background:
                unlocked
                    ?
                    "rgba(0,0,0,0.17)"
                    :
                    "rgba(0,0,0,0.28)",

            opacity:
                unlocked
                    ?
                    "1"
                    :
                    "0.60",

            textAlign: "left"
        }
    );


    const header =
        document.createElement(
            "div"
        );


    Object.assign(
        header.style,
        {
            display: "flex",

            justifyContent:
                "space-between",

            alignItems: "center",

            gap: "8px"
        }
    );


    const title =
        document.createElement(
            "strong"
        );


    title.textContent =
        recipe.name +
        "　所持：" +
        (
            game.inventory.items[
                recipe.id
            ] || 0
        );


    const button =
        document.createElement(
            "button"
        );


    button.textContent =
        unlocked
            ?
            "1個作成"
            :
            "未解放";


    button.disabled =
        !canCraftItem(
            recipe.id
        );


    button.onclick =
        function(event) {

            event.stopPropagation();

            craftItem(
                recipe.id
            );
        };


    header.appendChild(title);

    header.appendChild(button);

    row.appendChild(header);


    const desc =
        document.createElement(
            "div"
        );


    desc.textContent =
        recipe.description;


    desc.style.marginTop =
        "5px";


    desc.style.fontSize =
        "12px";


    desc.style.color =
        "#bbb";


    row.appendChild(desc);


    const unlock =
        document.createElement(
            "div"
        );


    unlock.textContent =
        getCraftUnlockText(
            recipe
        );


    unlock.style.marginTop =
        "5px";


    unlock.style.fontSize =
        "12px";


    row.appendChild(unlock);


    if (unlocked) {

        const need =
            document.createElement(
                "div"
            );


        need.textContent =
            getCraftRequirementText(
                recipe
            );


        need.style.marginTop =
            "5px";


        need.style.fontSize =
            "12px";


        row.appendChild(need);


        const owned =
            document.createElement(
                "div"
            );


        owned.textContent =
            getOwnedTextFromData({
                ores: recipe.ores
            });


        owned.style.fontSize =
            "11px";


        owned.style.color =
            "#aaa";


        row.appendChild(owned);
    }


    parent.appendChild(row);
}


// ========================================
// ステータスUI
// ========================================

function createStatusUI() {

    let box =
        document.getElementById(
            "playerStatus"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );


        box.id =
            "playerStatus";


        if (
            mapElement &&
            mapElement.parentNode
        ) {

            mapElement.parentNode
                .insertBefore(
                    box,
                    mapElement
                );

        } else {

            document.body.appendChild(
                box
            );
        }
    }


    updateStatusUI();
}


// ========================================
// ステータス更新
// ========================================

function updateStatusUI() {

    const box =
        document.getElementById(
            "playerStatus"
        );


    if (!box) {

        return;
    }


    const equipment =
        "　拠点Lv" +
        game.base.level +
        "　ツルハシLv" +
        game.pickaxe.level +
        " / 採掘力" +
        getMiningPower(
            game.pickaxe.level
        );


    if (game.baseOpen) {

        box.textContent =
            "拠点　HP：" +
            formatHp(
                game.player.hp
            ) +
            "/" +
            formatHp(
                game.player.maxHp
            ) +
            equipment +
            "　所持金：" +
            game.money +
            "G";


        return;
    }


    box.textContent =
        "通常鉱山 Lv" +
        game.currentMineLevel +
        "　HP：" +
        formatHp(
            game.player.hp
        ) +
        "/" +
        formatHp(
            game.player.maxHp
        ) +
        equipment +
        "　所持金：" +
        game.money +
        "G";
}


// ========================================
// HP表示
// ========================================

function formatHp(value) {

    return Number(
        Number(value).toFixed(2)
    );
}


// ========================================
// フロア生成
// ========================================

function generateMineFloor() {

    generateRandomMap();

    placeReturnPoint();

    placeStairs();

    placeTreasureChest();

    placeRandomEvent();

    generateOres();


    if (
        TEST_FULL_MAP_REVEAL ||
        (
            DEV_MODE &&
            game.dev.fullMapReveal
        )
    ) {

        revealFullMapForTesting();

    } else {

        updateVision();
    }


    render();
}


// ========================================
// 全マップ開示
// ========================================

function revealFullMapForTesting() {

    for (
        let y = 0;
        y < MAP_SIZE;
        y++
    ) {

        for (
            let x = 0;
            x < MAP_SIZE;
            x++
        ) {

            game.explored[y][x] =
                true;
        }
    }


    game.ores.forEach(
        function(ore) {

            ore.discovered = true;
        }
    );


    game.returnPoint.found =
        true;


    game.stairs.found =
        true;


    if (
        game.treasureChest.exists
    ) {

        game.treasureChest.found =
            true;
    }


    if (
        game.randomEvent.exists
    ) {

        if (
            game.randomEvent.type !==
            "rockfall"
        ) {

            game.randomEvent.found =
                true;

        } else if (
            TEST_SHOW_ROCKFALL
        ) {

            game.randomEvent.found =
                true;
        }
    }
}


// ========================================
// ランダムマップ生成
// ========================================

function generateRandomMap() {

    game.map = [];

    game.explored = [];


    for (
        let y = 0;
        y < MAP_SIZE;
        y++
    ) {

        game.map[y] = [];

        game.explored[y] = [];


        for (
            let x = 0;
            x < MAP_SIZE;
            x++
        ) {

            game.map[y][x] =
                "wall";


            game.explored[y][x] =
                false;
        }
    }


    const startX =
        Math.floor(
            MAP_SIZE / 2
        );


    const startY =
        Math.floor(
            MAP_SIZE / 2
        );


    game.player.x = startX;

    game.player.y = startY;


    game.map[
        startY
    ][
        startX
    ] =
        "floor";


    const directions = [

        {
            x: 1,
            y: 0
        },

        {
            x: -1,
            y: 0
        },

        {
            x: 0,
            y: 1
        },

        {
            x: 0,
            y: -1
        }

    ];


    let x = startX;

    let y = startY;

    let floorCount = 1;


    const target =
        Math.floor(
            MAP_SIZE *
            MAP_SIZE *
            0.50
        );


    while (
        floorCount < target
    ) {

        const direction =
            directions[
                randomInt(
                    0,
                    directions.length - 1
                )
            ];


        const nx =
            x + direction.x;


        const ny =
            y + direction.y;


        if (
            nx <= 0 ||
            nx >= MAP_SIZE - 1 ||
            ny <= 0 ||
            ny >= MAP_SIZE - 1
        ) {

            continue;
        }


        x = nx;

        y = ny;


        if (
            game.map[y][x] ===
            "wall"
        ) {

            game.map[y][x] =
                "floor";


            floorCount++;
        }
    }
}


// ========================================
// 床候補
// ========================================

function getFloorCandidates(
    minimumDistance
) {

    const result = [];


    for (
        let y = 1;
        y < MAP_SIZE - 1;
        y++
    ) {

        for (
            let x = 1;
            x < MAP_SIZE - 1;
            x++
        ) {

            if (
                game.map[y][x] !==
                "floor"
            ) {

                continue;
            }


            if (
                x === game.player.x &&
                y === game.player.y
            ) {

                continue;
            }


            const distance =
                Math.abs(
                    x -
                    game.player.x
                ) +
                Math.abs(
                    y -
                    game.player.y
                );


            if (
                distance <
                minimumDistance
            ) {

                continue;
            }


            result.push({
                x: x,
                y: y
            });
        }
    }


    return result;
}


// ========================================
// 帰還地点配置
// ========================================

function placeReturnPoint() {

    const candidates =
        getFloorCandidates(7);


    const point =
        candidates.length > 0
            ?
            candidates[
                randomInt(
                    0,
                    candidates.length - 1
                )
            ]
            :
            {
                x: game.player.x,
                y: game.player.y
            };


    game.returnPoint.x =
        point.x;


    game.returnPoint.y =
        point.y;


    game.returnPoint.found =
        false;
}


// ========================================
// 階段配置
// ========================================

function placeStairs() {

    const candidates =
        getFloorCandidates(6)
            .filter(
                function(point) {

                    return !(
                        point.x ===
                        game.returnPoint.x &&

                        point.y ===
                        game.returnPoint.y
                    );
                }
            );


    const point =
        candidates.length > 0
            ?
            candidates[
                randomInt(
                    0,
                    candidates.length - 1
                )
            ]
            :
            {
                x: game.player.x,
                y: game.player.y
            };


    game.stairs.x =
        point.x;


    game.stairs.y =
        point.y;


    game.stairs.found =
        false;
}


// ========================================
// 宝箱配置
// ========================================

function placeTreasureChest() {

    game.treasureChest.exists =
        false;


    game.treasureChest.found =
        false;


    if (
        Math.random() >=
        TREASURE_CHEST_SPAWN_RATE
    ) {

        return;
    }


    const candidates =
        getFloorCandidates(4)
            .filter(
                function(point) {

                    const isReturn =
                        point.x ===
                        game.returnPoint.x &&

                        point.y ===
                        game.returnPoint.y;


                    const isStair =
                        point.x ===
                        game.stairs.x &&

                        point.y ===
                        game.stairs.y;


                    return (
                        !isReturn &&
                        !isStair
                    );
                }
            );


    if (
        candidates.length === 0
    ) {

        return;
    }


    const point =
        candidates[
            randomInt(
                0,
                candidates.length - 1
            )
        ];


    game.treasureChest.x =
        point.x;


    game.treasureChest.y =
        point.y;


    game.treasureChest.exists =
        true;


    game.treasureChest.found =
        false;
}


// ========================================
// ランダムイベント配置
// ========================================

function placeRandomEvent() {

    game.randomEvent.exists =
        false;


    game.randomEvent.found =
        false;


    game.randomEvent.type =
        null;


    if (
        Math.random() >=
        RANDOM_EVENT_SPAWN_RATE
    ) {

        return;
    }


    const candidates =
        getFloorCandidates(4)
            .filter(
                function(point) {

                    const isReturn =
                        point.x ===
                        game.returnPoint.x &&

                        point.y ===
                        game.returnPoint.y;


                    const isStair =
                        point.x ===
                        game.stairs.x &&

                        point.y ===
                        game.stairs.y;


                    const isTreasure =
                        game.treasureChest.exists &&

                        point.x ===
                        game.treasureChest.x &&

                        point.y ===
                        game.treasureChest.y;


                    return (
                        !isReturn &&
                        !isStair &&
                        !isTreasure
                    );
                }
            );


    if (
        candidates.length === 0
    ) {

        return;
    }


    const point =
        candidates[
            randomInt(
                0,
                candidates.length - 1
            )
        ];


    game.randomEvent.x =
        point.x;


    game.randomEvent.y =
        point.y;


    game.randomEvent.exists =
        true;


    game.randomEvent.found =
        false;


    const roll =
        Math.random();


    if (roll < 0.30) {

        game.randomEvent.type =
            "healing";

    } else if (
        roll < 0.60
    ) {

        game.randomEvent.type =
            "rockfall";

    } else if (
        roll < 0.80
    ) {

        game.randomEvent.type =
            "supply";

    } else {

        game.randomEvent.type =
            "oreVein";
    }
}


// ========================================
// 鉱石生成
// ========================================

function generateOres() {

    game.ores = [];


    const candidates = [];


    for (
        let y = 1;
        y < MAP_SIZE - 1;
        y++
    ) {

        for (
            let x = 1;
            x < MAP_SIZE - 1;
            x++
        ) {

            if (
                game.map[y][x] !==
                "floor"
            ) {

                continue;
            }


            if (
                x === game.player.x &&
                y === game.player.y
            ) {

                continue;
            }


            if (
                x ===
                game.returnPoint.x &&

                y ===
                game.returnPoint.y
            ) {

                continue;
            }


            if (
                x === game.stairs.x &&
                y === game.stairs.y
            ) {

                continue;
            }


            if (
                game.treasureChest.exists &&

                x ===
                game.treasureChest.x &&

                y ===
                game.treasureChest.y
            ) {

                continue;
            }


            if (
                game.randomEvent.exists &&

                x ===
                game.randomEvent.x &&

                y ===
                game.randomEvent.y
            ) {

                continue;
            }


            candidates.push({
                x: x,
                y: y
            });
        }
    }


    shuffle(candidates);


    const mineData =
        getCurrentMineData();


    const amount =
        Math.min(
            mineData.oreCount,
            candidates.length
        );


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const type =
            selectOreTypeForCurrentMine();


        const baseHp =
            randomInt(
                type.minHp,
                type.maxHp
            );


        const maxHp =
            Math.max(
                1,
                Math.round(
                    baseHp *
                    mineData
                        .durabilityMultiplier
                )
            );


        game.ores.push({

            x:
                candidates[i].x,

            y:
                candidates[i].y,

            id:
                type.id,

            name:
                type.name,

            level: 1,

            hp:
                maxHp,

            maxHp:
                maxHp,

            discovered:
                false,

            detected:
                false,

            inspected:
                false
        });
    }
}


// ========================================
// 視野更新
// ========================================

function updateVision() {

    if (
        DEV_MODE &&
        game.dev.fullMapReveal
    ) {

        devRevealCurrentMap();

        return;
    }


    for (
        let y = 0;
        y < MAP_SIZE;
        y++
    ) {

        for (
            let x = 0;
            x < MAP_SIZE;
            x++
        ) {

            if (
                Math.abs(
                    x -
                    game.player.x
                ) <=
                VISION_RADIUS &&

                Math.abs(
                    y -
                    game.player.y
                ) <=
                VISION_RADIUS
            ) {

                game.explored[y][x] =
                    true;
            }
        }
    }


    discoverNearbyOres();

    discoverNearbyReturnPoint();

    discoverNearbyStairs();

    discoverNearbyTreasureChest();

    discoverNearbyRandomEvent();
}


// ========================================
// 鉱石発見
// ========================================

function discoverNearbyOres() {

    game.ores.forEach(
        function(ore) {

            if (
                Math.abs(
                    ore.x -
                    game.player.x
                ) <=
                VISION_RADIUS &&

                Math.abs(
                    ore.y -
                    game.player.y
                ) <=
                VISION_RADIUS
            ) {

                if (
                    !ore.discovered
                ) {

                    ore.discovered =
                        true;


                    addLog(
                        "鉱物を発見しました。"
                    );
                }
            }
        }
    );
}


// ========================================
// 帰還地点発見
// ========================================

function discoverNearbyReturnPoint() {

    if (
        game.returnPoint.found
    ) {

        return;
    }


    if (
        Math.abs(
            game.returnPoint.x -
            game.player.x
        ) <=
        VISION_RADIUS &&

        Math.abs(
            game.returnPoint.y -
            game.player.y
        ) <=
        VISION_RADIUS
    ) {

        game.returnPoint.found =
            true;
    }
}


// ========================================
// 階段発見
// ========================================

function discoverNearbyStairs() {

    if (
        game.stairs.found
    ) {

        return;
    }


    if (
        Math.abs(
            game.stairs.x -
            game.player.x
        ) <=
        VISION_RADIUS &&

        Math.abs(
            game.stairs.y -
            game.player.y
        ) <=
        VISION_RADIUS
    ) {

        game.stairs.found =
            true;
    }
}


// ========================================
// 宝箱発見
// ========================================

function discoverNearbyTreasureChest() {

    if (
        !game.treasureChest.exists ||
        game.treasureChest.found
    ) {

        return;
    }


    if (
        Math.abs(
            game.treasureChest.x -
            game.player.x
        ) <=
        VISION_RADIUS &&

        Math.abs(
            game.treasureChest.y -
            game.player.y
        ) <=
        VISION_RADIUS
    ) {

        game.treasureChest.found =
            true;


        addLog(
            "宝箱を発見しました！"
        );
    }
}


// ========================================
// ランダムイベント発見
// ========================================

function discoverNearbyRandomEvent() {

    if (
        !game.randomEvent.exists ||
        game.randomEvent.found
    ) {

        return;
    }


    if (
        game.randomEvent.type ===
        "rockfall" &&

        !TEST_SHOW_ROCKFALL
    ) {

        return;
    }


    if (
        Math.abs(
            game.randomEvent.x -
            game.player.x
        ) <=
        VISION_RADIUS &&

        Math.abs(
            game.randomEvent.y -
            game.player.y
        ) <=
        VISION_RADIUS
    ) {

        game.randomEvent.found =
            true;


        if (
            game.randomEvent.type ===
            "healing"
        ) {

            addLog(
                "癒やしの泉を発見しました。"
            );

        } else if (
            game.randomEvent.type ===
            "supply"
        ) {

            addLog(
                "補給箱を発見しました！"
            );

        } else if (
            game.randomEvent.type ===
            "oreVein"
        ) {

            addLog(
                "豊かな鉱脈を発見しました！"
            );
        }
    }
}


// ========================================
// 移動
// ========================================

function movePlayer(
    dx,
    dy
) {

    if (
        game.baseOpen ||
        game.dead ||
        game.deathWarningOpen ||
        game.returnConfirmOpen ||
        game.featherConfirmOpen ||
        game.stairConfirmOpen ||
        game.mining ||
        game.inventoryOpen
    ) {

        return;
    }


    const nx =
        game.player.x + dx;


    const ny =
        game.player.y + dy;


    if (
        nx < 0 ||
        nx >= MAP_SIZE ||
        ny < 0 ||
        ny >= MAP_SIZE
    ) {

        return;
    }


    if (
        game.map[ny][nx] ===
        "wall"
    ) {

        addLog(
            "壁があるため進めません。"
        );

        return;
    }


    game.player.x = nx;

    game.player.y = ny;


    if (
        !TEST_FULL_MAP_REVEAL
    ) {

        updateVision();
    }


    checkAutomaticRandomEvent();


    if (game.dead) {

        return;
    }


    render();
}


// ========================================
// 現在マス操作
// ========================================

function interactWithCurrentTile() {

    if (
        game.returnPoint.found &&

        game.player.x ===
        game.returnPoint.x &&

        game.player.y ===
        game.returnPoint.y
    ) {

        showReturnConfirm();

        return true;
    }


    if (
        game.stairs.found &&

        game.player.x ===
        game.stairs.x &&

        game.player.y ===
        game.stairs.y
    ) {

        showStairConfirm();

        return true;
    }


    if (
        game.treasureChest.exists &&

        game.treasureChest.found &&

        game.player.x ===
        game.treasureChest.x &&

        game.player.y ===
        game.treasureChest.y
    ) {

        openTreasureChest();

        return true;
    }


    if (
        game.randomEvent.exists &&

        game.randomEvent.found &&

        game.player.x ===
        game.randomEvent.x &&

        game.player.y ===
        game.randomEvent.y
    ) {

        if (
            game.randomEvent.type ===
            "healing"
        ) {

            useHealingPoint();

            return true;
        }


        if (
            game.randomEvent.type ===
            "supply"
        ) {

            openSupplyBox();

            return true;
        }


        if (
            game.randomEvent.type ===
            "oreVein"
        ) {

            collectOreVein();

            return true;
        }
    }


    return false;
}


// ========================================
// 宝箱
// ========================================

function openTreasureChest() {

    if (
        !game.treasureChest.exists
    ) {

        return;
    }


    if (
        game.player.x !==
        game.treasureChest.x ||

        game.player.y !==
        game.treasureChest.y
    ) {

        return;
    }


    game.treasureChest.exists =
        false;


    const roll =
        Math.random();


    if (
        roll <
        TREASURE_EXPLOSION_RATE
    ) {

        triggerTreasureExplosion();

        return;
    }


    if (roll < 0.50) {

        const minMoney =
            50 +
            game.currentMineLevel *
            20;


        const maxMoney =
            150 +
            game.currentMineLevel *
            60;


        const money =
            randomInt(
                minMoney,
                maxMoney
            );


        game.money += money;


        addLog(
            "宝箱を開けました！"
        );


        addLog(
            money +
            "Gを入手しました。"
        );


        render();

        return;
    }


    if (roll < 0.80) {

        const itemRoll =
            Math.random();


        let itemId =
            "potion";


        let itemName =
            "回復薬";


        if (itemRoll < 0.45) {

            itemId =
                "potion";

            itemName =
                "回復薬";

        } else if (
            itemRoll < 0.75
        ) {

            itemId =
                "detector";

            itemName =
                "探知機";

        } else if (
            itemRoll < 0.95
        ) {

            itemId =
                "returnFeather";

            itemName =
                "帰還の羽";

        } else {

            itemId =
                "healthBoost";

            itemName =
                "体力強化";
        }


        addInventoryItem(
            itemId,
            1
        );


        addLog(
            "宝箱を開けました！"
        );


        addLog(
            itemName +
            "を1個入手しました。"
        );


        render();

        return;
    }


    const available =
        getAvailableOreTypes(
            game.currentMineLevel
        );


    const type =
        available[
            randomInt(
                0,
                available.length - 1
            )
        ];


    const amount =
        Math.random() < 0.20
            ?
            2
            :
            1;


    addOreAmountToExpeditionBag(
        type.id,
        amount
    );


    addLog(
        "宝箱を開けました！"
    );


    addLog(
        type.name +
        "を" +
        amount +
        "個入手しました。"
    );


    render();
}


// ========================================
// 宝箱爆発
// ========================================

function triggerTreasureExplosion() {

    const damage =
        Math.max(
            TREASURE_EXPLOSION_DAMAGE_MIN,

            Math.round(
                game.player.maxHp *
                TREASURE_EXPLOSION_DAMAGE_PERCENT *
                100
            ) / 100
        );


    applyDamage(
        damage,
        "宝箱を開けた瞬間、爆発しました！"
    );
}


// ========================================
// 自動イベント
// ========================================

function checkAutomaticRandomEvent() {

    if (
        !game.randomEvent.exists
    ) {

        return;
    }


    if (
        game.player.x !==
        game.randomEvent.x ||

        game.player.y !==
        game.randomEvent.y
    ) {

        return;
    }


    if (
        game.randomEvent.type ===
        "rockfall"
    ) {

        triggerRockfall();
    }
}


// ========================================
// 落石
// ========================================

function triggerRockfall() {

    if (
        !game.randomEvent.exists ||

        game.randomEvent.type !==
        "rockfall"
    ) {

        return;
    }


    const damage =
        Math.max(
            ROCKFALL_DAMAGE_MIN,

            Math.round(
                game.player.maxHp *
                ROCKFALL_DAMAGE_PERCENT *
                100
            ) / 100
        );


    applyDamage(
        damage,
        "突然、落石が発生しました！"
    );
}


// ========================================
// 共通ダメージ
// ========================================

function applyDamage(
    damage,
    message
) {

    game.player.hp -= damage;


    game.player.hp =
        Math.round(
            game.player.hp *
            100
        ) / 100;


    if (
        game.player.hp < 0
    ) {

        game.player.hp = 0;
    }


    addLog(message);


    addLog(
        damage +
        "ダメージを受けました。"
    );


    if (
        game.player.hp <= 0
    ) {

        game.dead = true;


        addLog(
            "HPが0になり、力尽きました。"
        );


        render();


        setTimeout(
            handleDeath,
            700
        );


        return;
    }


    render();
}


// ========================================
// 癒やしの泉
// ========================================

function useHealingPoint() {

    if (
        !game.randomEvent.exists ||

        game.randomEvent.type !==
        "healing"
    ) {

        return;
    }


    if (
        game.player.hp >=
        game.player.maxHp
    ) {

        addLog(
            "HPはすでに満タンです。"
        );

        return;
    }


    const amount =
        Math.max(
            HEALING_POINT_MIN,

            Math.round(
                game.player.maxHp *
                HEALING_POINT_PERCENT *
                100
            ) / 100
        );


    const before =
        game.player.hp;


    game.player.hp =
        Math.min(
            game.player.maxHp,
            game.player.hp +
            amount
        );


    game.player.hp =
        Math.round(
            game.player.hp *
            100
        ) / 100;


    const healed =
        Math.round(
            (
                game.player.hp -
                before
            ) *
            100
        ) / 100;


    game.randomEvent.exists =
        false;


    addLog(
        "癒やしの泉を利用しました。"
    );


    addLog(
        "HPが" +
        healed +
        "回復しました。"
    );


    render();
}


// ========================================
// 補給箱
// ========================================

function openSupplyBox() {

    if (
        !game.randomEvent.exists ||

        game.randomEvent.type !==
        "supply"
    ) {

        return;
    }


    const amount =
        randomInt(1, 2);


    const roll =
        Math.random();


    let itemId =
        "potion";


    let itemName =
        "回復薬";


    if (roll < 0.45) {

        itemId =
            "potion";

        itemName =
            "回復薬";

    } else if (
        roll < 0.75
    ) {

        itemId =
            "detector";

        itemName =
            "探知機";

    } else {

        itemId =
            "returnFeather";

        itemName =
            "帰還の羽";
    }


    addInventoryItem(
        itemId,
        amount
    );


    game.randomEvent.exists =
        false;


    addLog(
        "補給箱を開けました！"
    );


    addLog(
        itemName +
        "を" +
        amount +
        "個入手しました。"
    );


    render();
}


// ========================================
// 鉱脈
// ========================================

function collectOreVein() {

    if (
        !game.randomEvent.exists ||

        game.randomEvent.type !==
        "oreVein"
    ) {

        return;
    }


    const available =
        getAvailableOreTypes(
            game.currentMineLevel
        );


    if (
        available.length === 0
    ) {

        return;
    }


    const type =
        available[
            randomInt(
                0,
                available.length - 1
            )
        ];


    const amount =
        randomInt(2, 4);


    addOreAmountToExpeditionBag(
        type.id,
        amount
    );


    game.randomEvent.exists =
        false;


    addLog(
        "鉱脈を採取しました！"
    );


    addLog(
        type.name +
        "を" +
        amount +
        "個入手しました。"
    );


    render();
}


// ========================================
// 指定位置鉱石
// ========================================

function getOreAt(
    x,
    y
) {

    return game.ores.find(
        function(ore) {

            return (
                ore.x === x &&
                ore.y === y
            );
        }
    );
}


// ========================================
// 採掘致死判定
// ========================================

function willMiningBeFatal() {

    return (
        game.player.hp -
        MINING_HP_COST <=
        0
    );
}


// ========================================
// 採掘
// ========================================

function mineOre(ore) {

    if (
        game.baseOpen ||
        game.dead ||
        game.mining ||
        game.inventoryOpen ||
        game.deathWarningOpen ||
        game.returnConfirmOpen ||
        game.featherConfirmOpen ||
        game.stairConfirmOpen
    ) {

        return;
    }


    if (
        !ore ||
        !ore.discovered
    ) {

        return;
    }


    if (
        willMiningBeFatal()
    ) {

        showDeathWarning(
            ore
        );

        return;
    }


    performMiningHit(
        ore,
        false
    );
}


// ========================================
// 採掘ヒット
// ========================================

function performMiningHit(
    ore,
    fatal
) {

    if (
        !ore ||
        game.mining
    ) {

        return;
    }


    inspectOre(ore);


    game.mining = true;


    if (fatal) {

        if (!devInfiniteHealth_STEP413()) {
            game.player.hp = 0;
        } else {
            game.player.hp = game.player.maxHp;
        }

    } else {

        if (!devInfiniteHealth_STEP413()) {
            game.player.hp -=
                MINING_HP_COST;


            game.player.hp =
                Math.round(
                    game.player.hp *
                    100
                ) / 100;
        } else {
            game.player.hp = game.player.maxHp;
        }
    }


    const power =
        getMiningPower(
            game.pickaxe.level
        );


    if (devInfiniteMining_STEP413()) {
        ore.hp = 0;
    } else {
        ore.hp -= power;
    }


    if (ore.hp < 0) {

        ore.hp = 0;
    }


    addLog(
        ore.name +
        "　耐久 " +
        ore.hp +
        "/" +
        ore.maxHp +
        "　(-" +
        power +
        ")"
    );


    if (
        ore.hp <= 0
    ) {

        addOreToExpeditionBag(
            ore
        );


        recordOreMined(
            ore.id,
            1
        );


        addLog(
            ore.name +
            "を1個入手しました。"
        );


        const index =
            game.ores.indexOf(
                ore
            );


        if (index !== -1) {

            game.ores.splice(
                index,
                1
            );
        }
    }


    if (fatal) {

        game.dead = true;


        addLog(
            "HPが0になり、力尽きました。"
        );


        render();


        setTimeout(
            handleDeath,
            700
        );


        return;
    }


    render();


    setTimeout(
        function() {

            game.mining = false;
        },
        250
    );
}


// ========================================
// 鉱石鑑定
// ========================================

function inspectOre(ore) {

    if (!ore) {

        return;
    }


    if (
        !ore.inspected
    ) {

        ore.inspected = true;


        registerOreDiscovery(
            ore.id
        );


        addLog(
            "鑑定： " +
            ore.name +
            " Lv" +
            ore.level +
            "　耐久 " +
            ore.hp +
            "/" +
            ore.maxHp
        );
    }
}


// ========================================
// 探索バッグへ鉱石追加
// ========================================

function addOreToExpeditionBag(
    ore
) {

    addOreAmountToExpeditionBag(
        ore.id,
        1
    );
}


// ========================================
// 探索バッグへ指定数追加
// ========================================

function addOreAmountToExpeditionBag(
    oreId,
    amount
) {

    game.expeditionBag[
        oreId
    ] =
        (
            game.expeditionBag[
                oreId
            ] || 0
        ) +
        amount;
}


// ========================================
// 死亡
// ========================================

function handleDeath() {

    stopKeyRepeat();


    let lost = 0;


    ORE_TYPES.forEach(
        function(type) {

            lost +=
                game.expeditionBag[
                    type.id
                ] || 0;


            game.expeditionBag[
                type.id
            ] = 0;
        }
    );


    if (lost > 0) {

        addLog(
            "探索バッグの鉱石をすべて失いました。"
        );

    } else {

        addLog(
            "失った鉱石はありませんでした。"
        );
    }


    game.player.hp =
        game.player.maxHp;


    game.dead = false;

    game.mining = false;

    game.pendingDangerOre = null;


    showBase(
        "力尽きて拠点へ戻りました。探索バッグの鉱石は失われました。"
    );
}


// ========================================
// 探索バッグ総数
// ========================================

function getExpeditionBagTotal() {

    let total = 0;


    ORE_TYPES.forEach(
        function(type) {

            total +=
                game.expeditionBag[
                    type.id
                ] || 0;
        }
    );


    return total;
}


// ========================================
// バッグ → 倉庫
// ========================================

function transferBagToWarehouse() {

    let total = 0;


    ORE_TYPES.forEach(
        function(type) {

            const amount =
                game.expeditionBag[
                    type.id
                ] || 0;


            total += amount;


            if (amount > 0) {

                game.warehouse.ores[
                    type.id
                ] =
                    (
                        game.warehouse.ores[
                            type.id
                        ] || 0
                    ) +
                    amount;


                recordOreReturned(
                    type.id,
                    amount
                );
            }


            game.expeditionBag[
                type.id
            ] = 0;
        }
    );


    return total;
}


// ========================================
// 正常帰還
// ========================================

function handleSuccessfulReturn(
    method
) {

    stopKeyRepeat();


    const total =
        transferBagToWarehouse();


    if (
        method === "feather"
    ) {

        addLog(
            "帰還の羽で拠点へ帰還しました。"
        );

    } else {

        addLog(
            "拠点へ無事に帰還しました。"
        );
    }


    if (total > 0) {

        addLog(
            "倉庫へ鉱石を" +
            total +
            "個保管しました。"
        );

    } else {

        addLog(
            "持ち帰った鉱石はありません。"
        );
    }


    game.player.hp =
        game.player.maxHp;


    game.dead = false;

    game.mining = false;

    game.pendingDangerOre = null;


    updateLayer2Progress();


    showBase(
        "無事に帰還しました。"
    );
}


// ========================================
// 帰還確認UI
// ========================================

function createReturnConfirmUI() {

    createConfirmModal(
        "returnConfirmOverlay",
        "帰還ポイント",
        "returnConfirmText",
        "探索を続ける",
        cancelReturn,
        "帰還する",
        confirmReturn,
        "Enter：帰還　 / 　Space：閉じる"
    );
}


// ========================================
// 帰還確認表示
// ========================================

function showReturnConfirm() {

    if (
        game.returnConfirmOpen
    ) {

        return;
    }


    stopKeyRepeat();


    game.returnConfirmOpen =
        true;


    const text =
        document.getElementById(
            "returnConfirmText"
        );


    if (text) {

        text.textContent =
            "探索バッグの鉱石 " +
            getExpeditionBagTotal() +
            "個を持って帰還しますか？";
    }


    showOverlay(
        "returnConfirmOverlay"
    );
}


// ========================================
// 帰還確認非表示
// ========================================

function hideReturnConfirm() {

    hideOverlay(
        "returnConfirmOverlay"
    );


    game.returnConfirmOpen =
        false;
}


// ========================================
// 帰還キャンセル
// ========================================

function cancelReturn() {

    hideReturnConfirm();

    render();
}


// ========================================
// 帰還決定
// ========================================

function confirmReturn() {

    hideReturnConfirm();


    handleSuccessfulReturn(
        "returnPoint"
    );
}


// ========================================
// 帰還の羽確認UI
// ========================================

function createFeatherConfirmUI() {

    createConfirmModal(
        "featherConfirmOverlay",
        "帰還の羽",
        "featherConfirmText",
        "やめる",
        cancelFeatherReturn,
        "帰還する",
        confirmFeatherReturn
    );
}


// ========================================
// 帰還の羽使用
// ========================================

function useReturnFeather() {

    if (
        game.baseOpen ||
        game.dead
    ) {

        return;
    }


    if (
        game.inventory.items
            .returnFeather <= 0
    ) {

        addLog(
            "帰還の羽を持っていません。"
        );

        return;
    }


    closeInventory();

    stopKeyRepeat();


    game.featherConfirmOpen =
        true;


    const text =
        document.getElementById(
            "featherConfirmText"
        );


    if (text) {

        text.textContent =
            "帰還の羽を1個使用して帰還しますか？";
    }


    showOverlay(
        "featherConfirmOverlay"
    );
}


// ========================================
// 羽確認非表示
// ========================================

function hideFeatherConfirm() {

    hideOverlay(
        "featherConfirmOverlay"
    );


    game.featherConfirmOpen =
        false;
}


// ========================================
// 羽帰還キャンセル
// ========================================

function cancelFeatherReturn() {

    hideFeatherConfirm();

    render();
}


// ========================================
// 羽帰還決定
// ========================================

function confirmFeatherReturn() {

    if (
        game.inventory.items
            .returnFeather <= 0
    ) {

        hideFeatherConfirm();

        return;
    }


    game.inventory.items
        .returnFeather--;


    hideFeatherConfirm();


    addLog(
        "帰還の羽を使用しました。"
    );


    handleSuccessfulReturn(
        "feather"
    );
}


// ========================================
// 階段確認UI
// ========================================

function createStairConfirmUI() {

    createConfirmModal(
        "stairConfirmOverlay",
        "階段",
        "stairConfirmText",
        "この階に残る",
        cancelStair,
        "次の階へ",
        confirmStair,
        "Enter：次の階へ　 / 　Space：閉じる"
    );
}


// ========================================
// 階段確認表示
// ========================================

function showStairConfirm() {

    if (
        game.stairConfirmOpen
    ) {

        return;
    }


    stopKeyRepeat();


    game.stairConfirmOpen =
        true;


    const next =
        game.currentMineLevel + 1;


    const text =
        document.getElementById(
            "stairConfirmText"
        );


    const button =
        document.querySelector(
            "#stairConfirmOverlay .confirm-primary"
        );


    if (
        next > MAX_MINE_LEVEL
    ) {

        if (text) {

            text.textContent =
                "ここが通常鉱山の最深部です。";
        }


        if (button) {

            button.disabled = true;
        }

    } else if (
        next >
        game.maxUnlockedMineLevel
    ) {

        if (text) {

            text.textContent =
                "鉱山Lv" +
                next +
                "はまだ解放されていません。";
        }


        if (button) {

            button.disabled = true;
        }

    } else {

        if (text) {

            text.textContent =
                "鉱山Lv" +
                next +
                "へ進みますか？";
        }


        if (button) {

            button.disabled = false;
        }
    }


    showOverlay(
        "stairConfirmOverlay"
    );
}


// ========================================
// 階段確認非表示
// ========================================

function hideStairConfirm() {

    hideOverlay(
        "stairConfirmOverlay"
    );


    game.stairConfirmOpen =
        false;
}


// ========================================
// 階段キャンセル
// ========================================

function cancelStair() {

    hideStairConfirm();

    render();
}


// ========================================
// 階段決定
// ========================================

function confirmStair() {

    const next =
        game.currentMineLevel + 1;


    if (
        next >
        game.maxUnlockedMineLevel ||

        next >
        MAX_MINE_LEVEL
    ) {

        return;
    }


    hideStairConfirm();


    game.currentMineLevel =
        next;


    game.selectedMineLevel =
        next;


    game.mining = false;


    generateMineFloor();


    addLog(
        "鉱山Lv" +
        next +
        "へ進みました。"
    );
}


// ========================================
// 死亡警告UI
// ========================================

function createDeathWarningUI() {

    createConfirmModal(
        "deathWarningOverlay",
        "採掘を続けますか？",
        "deathWarningText",
        "やめる",
        cancelDangerMining,
        "採掘を続ける",
        continueDangerMining
    );
}


// ========================================
// 死亡警告表示
// ========================================

function showDeathWarning(ore) {

    stopKeyRepeat();


    game.pendingDangerOre = ore;

    game.deathWarningOpen = true;


    const text =
        document.getElementById(
            "deathWarningText"
        );


    if (text) {

        text.textContent =
            "残りHP " +
            formatHp(
                game.player.hp
            ) +
            "。次の採掘で力尽きます。";
    }


    showOverlay(
        "deathWarningOverlay"
    );


    addLog(
        "警告：次の採掘を行うと力尽きます。"
    );
}


// ========================================
// 死亡警告非表示
// ========================================

function hideDeathWarning() {

    hideOverlay(
        "deathWarningOverlay"
    );


    game.deathWarningOpen =
        false;
}


// ========================================
// 危険採掘キャンセル
// ========================================

function cancelDangerMining() {

    game.pendingDangerOre = null;


    hideDeathWarning();


    addLog(
        "採掘を中止しました。"
    );


    render();
}


// ========================================
// 危険採掘続行
// ========================================

function continueDangerMining() {

    const ore =
        game.pendingDangerOre;


    game.pendingDangerOre = null;


    hideDeathWarning();


    if (
        ore &&
        game.ores.includes(
            ore
        )
    ) {

        performMiningHit(
            ore,
            true
        );
    }
}


// ========================================
// 回復薬
// ========================================

function usePotion() {

    if (
        game.baseOpen ||
        game.dead ||
        game.mining
    ) {

        return;
    }


    if (
        game.inventory.items
            .potion <= 0
    ) {

        addLog(
            "回復薬を持っていません。"
        );

        return;
    }


    if (
        game.player.hp >=
        game.player.maxHp
    ) {

        addLog(
            "HPはすでに満タンです。"
        );

        return;
    }


    const before =
        game.player.hp;


    game.inventory.items
        .potion--;


    game.player.hp =
        Math.min(
            game.player.maxHp,

            game.player.hp +
            POTION_HEAL_AMOUNT
        );


    game.player.hp =
        Math.round(
            game.player.hp *
            100
        ) / 100;


    const healed =
        Math.round(
            (
                game.player.hp -
                before
            ) *
            100
        ) / 100;


    addLog(
        "回復薬を使用しました。HPが" +
        healed +
        "回復しました。"
    );


    render();
}


// ========================================
// 体力強化
// ========================================

function useHealthBoost() {

    if (
        game.baseOpen ||
        game.dead ||
        game.mining
    ) {

        return;
    }


    if (
        game.inventory.items
            .healthBoost <= 0
    ) {

        addLog(
            "体力強化を持っていません。"
        );

        return;
    }


    game.inventory.items
        .healthBoost--;


    game.player.maxHp +=
        HEALTH_BOOST_AMOUNT;


    game.player.hp +=
        HEALTH_BOOST_AMOUNT;


    addLog(
        "最大HPが" +
        HEALTH_BOOST_AMOUNT +
        "増加しました。"
    );


    render();
}


// ========================================
// 探知機
// ========================================

function useDetector() {

    if (
        game.baseOpen ||
        game.dead
    ) {

        return;
    }


    if (
        game.inventory.items
            .detector <= 0
    ) {

        addLog(
            "探知機を持っていません。"
        );

        return;
    }


    game.inventory.items
        .detector--;


    const cx =
        game.player.x;


    const cy =
        game.player.y;


    const detectedNames =
        new Set();


    for (
        let y =
            cy -
            DETECTOR_RADIUS;

        y <=
        cy +
        DETECTOR_RADIUS;

        y++
    ) {

        for (
            let x =
                cx -
                DETECTOR_RADIUS;

            x <=
            cx +
            DETECTOR_RADIUS;

            x++
        ) {

            if (
                x < 0 ||
                x >= MAP_SIZE ||
                y < 0 ||
                y >= MAP_SIZE
            ) {

                continue;
            }


            game.explored[y][x] =
                true;
        }
    }


    game.ores.forEach(
        function(ore) {

            if (
                Math.abs(
                    ore.x - cx
                ) <=
                DETECTOR_RADIUS &&

                Math.abs(
                    ore.y - cy
                ) <=
                DETECTOR_RADIUS
            ) {

                if (
                    !ore.discovered
                ) {

                    ore.detected =
                        true;


                    detectedNames.add(
                        ore.name
                    );
                }
            }
        }
    );


    addLog(
        "探知機を使用しました。"
    );


    addLog(
        "周囲15×15マスを探知しました。"
    );


    if (
        detectedNames.size === 0
    ) {

        addLog(
            "この範囲に未発見の鉱物はありません。"
        );

    } else {

        detectedNames.forEach(
            function(name) {

                addLog(
                    name +
                    "を探知しました。"
                );
            }
        );
    }


    render();
}


// ========================================
// インベントリUI
// ========================================

function createInventoryUI() {

    let button =
        document.getElementById(
            "inventoryButton"
        );


    if (!button) {

        button =
            document.createElement(
                "button"
            );


        button.id =
            "inventoryButton";


        button.textContent =
            "インベントリ";


        document.body.appendChild(
            button
        );
    }


    let box =
        document.getElementById(
            "inventoryWindow"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );


        box.id =
            "inventoryWindow";


        Object.assign(
            box.style,
            {
                display: "none",

                position: "fixed",

                left: "50%",

                top: "50%",

                transform:
                    "translate(-50%, -50%)",

                zIndex: "9999",

                background: "#151515",

                color: "white",

                padding: "18px",

                minWidth: "300px",

                maxHeight: "80vh",

                overflowY: "auto",

                border:
                    "1px solid #555"
            }
        );


        document.body.appendChild(
            box
        );
    }


    button.onclick =
        function(event) {

            event.stopPropagation();


            if (
                game.inventoryOpen
            ) {

                closeInventory();

            } else {

                openInventory();
            }
        };


    box.onclick =
        function(event) {

            event.stopPropagation();
        };


    updateInventoryUI();
}


// ========================================
// インベントリを開く
// ========================================

function openInventory() {

    if (
        game.baseOpen ||
        game.dead
    ) {

        return;
    }


    game.inventoryOpen = true;


    updateInventoryUI();


    const box =
        document.getElementById(
            "inventoryWindow"
        );


    if (box) {

        box.style.display =
            "block";
    }
}


// ========================================
// インベントリ閉じる
// ========================================

function closeInventory() {

    game.inventoryOpen = false;


    const box =
        document.getElementById(
            "inventoryWindow"
        );


    if (box) {

        box.style.display =
            "none";
    }
}


// ========================================
// インベントリ更新
// ========================================

function updateInventoryUI() {

    const box =
        document.getElementById(
            "inventoryWindow"
        );


    if (!box) {

        return;
    }


    box.innerHTML = "";


    box.appendChild(
        createTitle(
            "インベントリ"
        )
    );


    const status =
        document.createElement(
            "div"
        );


    status.textContent =
        "HP " +
        formatHp(
            game.player.hp
        ) +
        "/" +
        formatHp(
            game.player.maxHp
        ) +
        "　採掘力 " +
        getMiningPower(
            game.pickaxe.level
        );


    status.style.marginBottom =
        "10px";


    status.style.color =
        "#bfc6cc";


    box.appendChild(status);


    const bagTitle =
        document.createElement(
            "h3"
        );


    bagTitle.textContent =
        "探索バッグ";


    box.appendChild(
        bagTitle
    );


    ORE_TYPES.forEach(
        function(type) {

            const line =
                document.createElement(
                    "div"
                );


            Object.assign(
                line.style,
                {
                    display: "flex",

                    justifyContent:
                        "space-between",

                    gap: "10px"
                }
            );


            const name =
                document.createElement(
                    "span"
                );


            name.textContent =
                type.name;


            const amount =
                document.createElement(
                    "span"
                );


            amount.textContent =
                game.expeditionBag[
                    type.id
                ] || 0;


            amount.style.color =
                type.color;


            line.appendChild(name);

            line.appendChild(amount);

            box.appendChild(line);
        }
    );


    const warning =
        document.createElement(
            "div"
        );


    warning.textContent =
        "※探索バッグの鉱石は、力尽きると失われます。";


    warning.style.marginTop =
        "8px";


    warning.style.fontSize =
        "11px";


    warning.style.color =
        "#d6a5a5";


    box.appendChild(warning);


    const itemTitle =
        document.createElement(
            "h3"
        );


    itemTitle.textContent =
        "アイテム";


    box.appendChild(
        itemTitle
    );


    addItemRow(
        box,
        "探知機",
        game.inventory.items.detector,
        useDetector
    );


    addItemRow(
        box,
        "帰還の羽",
        game.inventory.items.returnFeather,
        useReturnFeather
    );


    addItemRow(
        box,
        "回復薬",
        game.inventory.items.potion,
        usePotion
    );


    addItemRow(
        box,
        "体力強化",
        game.inventory.items.healthBoost,
        useHealthBoost
    );


    const close =
        document.createElement(
            "button"
        );


    close.textContent =
        "閉じる";


    close.style.marginTop =
        "12px";


    close.onclick =
        function(event) {

            event.stopPropagation();

            closeInventory();
        };


    box.appendChild(close);
}


// ========================================
// アイテム行
// ========================================

function addItemRow(
    parent,
    name,
    amount,
    callback
) {

    const row =
        document.createElement(
            "div"
        );


    Object.assign(
        row.style,
        {
            display: "flex",

            justifyContent:
                "space-between",

            alignItems: "center",

            gap: "8px",

            marginBottom: "6px"
        }
    );


    const text =
        document.createElement(
            "span"
        );


    text.textContent =
        name +
        "：" +
        amount;


    const button =
        document.createElement(
            "button"
        );


    button.textContent =
        "使用";


    button.disabled =
        amount <= 0;


    button.onclick =
        function(event) {

            event.stopPropagation();

            callback();
        };


    row.appendChild(text);

    row.appendChild(button);

    parent.appendChild(row);
}


// ========================================
// マップ描画
// ========================================

function renderMap() {

    if (!mapElement) {

        return;
    }


    mapElement.innerHTML = "";


    for (
        let y = 0;
        y < MAP_SIZE;
        y++
    ) {

        for (
            let x = 0;
            x < MAP_SIZE;
            x++
        ) {

            const tile =
                document.createElement(
                    "div"
                );


            tile.className =
                "tile";


            if (
                !game.explored[y][x]
            ) {

                tile.classList.add(
                    "hidden"
                );


                mapElement.appendChild(
                    tile
                );


                continue;
            }


            if (
                game.map[y][x] ===
                "wall"
            ) {

                tile.classList.add(
                    "wall"
                );


                tile.textContent = "■";

            } else {

                tile.classList.add(
                    "floor"
                );


                tile.textContent = "・";


                tile.style.background =
                    "#3a3d42";


                tile.style.color =
                    "#d7d9dc";
            }


            const isPlayer =
                x === game.player.x &&
                y === game.player.y;


            const isReturn =
                game.returnPoint.found &&

                x ===
                game.returnPoint.x &&

                y ===
                game.returnPoint.y;


            const isStair =
                game.stairs.found &&

                x === game.stairs.x &&

                y === game.stairs.y;


            const isTreasure =
                game.treasureChest.exists &&

                game.treasureChest.found &&

                x ===
                game.treasureChest.x &&

                y ===
                game.treasureChest.y;


            const isHealing =
                game.randomEvent.exists &&

                game.randomEvent.found &&

                game.randomEvent.type ===
                "healing" &&

                x ===
                game.randomEvent.x &&

                y ===
                game.randomEvent.y;


            const isSupply =
                game.randomEvent.exists &&

                game.randomEvent.found &&

                game.randomEvent.type ===
                "supply" &&

                x ===
                game.randomEvent.x &&

                y ===
                game.randomEvent.y;


            const isOreVein =
                game.randomEvent.exists &&

                game.randomEvent.found &&

                game.randomEvent.type ===
                "oreVein" &&

                x ===
                game.randomEvent.x &&

                y ===
                game.randomEvent.y;


            const isRockfall =
                TEST_SHOW_ROCKFALL &&

                game.randomEvent.exists &&

                game.randomEvent.type ===
                "rockfall" &&

                x ===
                game.randomEvent.x &&

                y ===
                game.randomEvent.y;


            if (isReturn) {

                tile.textContent = "帰";

                tile.style.color =
                    "#ffd84d";

                tile.style.fontWeight =
                    "bold";

                tile.style.cursor =
                    "pointer";


                tile.onclick =
                    function(event) {

                        event.stopPropagation();


                        if (
                            game.player.x === x &&
                            game.player.y === y
                        ) {

                            showReturnConfirm();
                        }
                    };
            }


            if (isStair) {

                tile.textContent = "階";

                tile.style.color =
                    "#67e667";

                tile.style.fontWeight =
                    "bold";

                tile.style.cursor =
                    "pointer";


                tile.onclick =
                    function(event) {

                        event.stopPropagation();


                        if (
                            game.player.x === x &&
                            game.player.y === y
                        ) {

                            showStairConfirm();
                        }
                    };
            }


            if (isTreasure) {

                tile.textContent = "宝";

                tile.style.color =
                    "#5ad7ff";

                tile.style.fontWeight =
                    "bold";

                tile.style.cursor =
                    "pointer";


                tile.onclick =
                    function(event) {

                        event.stopPropagation();


                        if (
                            game.player.x === x &&
                            game.player.y === y
                        ) {

                            openTreasureChest();
                        }
                    };
            }


            if (isHealing) {

                tile.textContent = "癒";

                tile.style.color =
                    "#67ff9a";

                tile.style.fontWeight =
                    "bold";

                tile.style.cursor =
                    "pointer";


                tile.onclick =
                    function(event) {

                        event.stopPropagation();


                        if (
                            game.player.x === x &&
                            game.player.y === y
                        ) {

                            useHealingPoint();
                        }
                    };
            }


            if (isSupply) {

                tile.textContent = "補";

                tile.style.color =
                    "#ffb65a";

                tile.style.fontWeight =
                    "bold";

                tile.style.cursor =
                    "pointer";


                tile.onclick =
                    function(event) {

                        event.stopPropagation();


                        if (
                            game.player.x === x &&
                            game.player.y === y
                        ) {

                            openSupplyBox();
                        }
                    };
            }


            if (isOreVein) {

                tile.textContent = "脈";

                tile.style.color =
                    "#d98cff";

                tile.style.fontWeight =
                    "bold";

                tile.style.cursor =
                    "pointer";


                tile.onclick =
                    function(event) {

                        event.stopPropagation();


                        if (
                            game.player.x === x &&
                            game.player.y === y
                        ) {

                            collectOreVein();
                        }
                    };
            }


            if (isRockfall) {

                tile.textContent = "落";

                tile.style.color =
                    "#ff7043";

                tile.style.fontWeight =
                    "bold";
            }


            const ore =
                getOreAt(
                    x,
                    y
                );


            if (
                ore &&
                ore.discovered
            ) {

                tile.textContent = "鉱";

                tile.style.cursor =
                    "pointer";


                if (
                    ore.inspected
                ) {

                    const type =
                        getOreTypeById(
                            ore.id
                        );


                    if (type) {

                        tile.style.color =
                            type.color;


                        tile.style.fontWeight =
                            "bold";
                    }
                }


                tile.onclick =
                    function(event) {

                        event.stopPropagation();

                        mineOre(ore);
                    };
            }


            if (isPlayer) {

                tile.classList.add(
                    "player"
                );


                if (
                    !isReturn &&
                    !isStair &&
                    !isTreasure &&
                    !isHealing &&
                    !isSupply &&
                    !isOreVein &&
                    !isRockfall
                ) {

                    tile.textContent = "●";
                }
            }


            mapElement.appendChild(
                tile
            );
        }
    }
}


// ========================================
// ミニマップ
// ========================================

function renderMinimap() {

    if (!minimapElement) {

        return;
    }


    minimapElement.innerHTML = "";


    minimapElement.style
        .gridTemplateColumns =
        "repeat(20, 1fr)";


    for (
        let y = 0;
        y < MAP_SIZE;
        y++
    ) {

        for (
            let x = 0;
            x < MAP_SIZE;
            x++
        ) {

            const tile =
                document.createElement(
                    "div"
                );


            tile.className =
                "mini-tile";


            if (
                game.explored[y][x]
            ) {

                tile.classList.add(
                    "explored"
                );


                if (
                    game.map[y][x] ===
                    "wall"
                ) {

                    tile.classList.add(
                        "mini-wall"
                    );
                }
            }


            if (
                game.returnPoint.found &&

                x ===
                game.returnPoint.x &&

                y ===
                game.returnPoint.y
            ) {

                tile.style.background =
                    "#ffd84d";
            }


            if (
                game.stairs.found &&

                x ===
                game.stairs.x &&

                y ===
                game.stairs.y
            ) {

                tile.style.background =
                    "#67e667";
            }


            if (
                game.treasureChest.exists &&

                game.treasureChest.found &&

                x ===
                game.treasureChest.x &&

                y ===
                game.treasureChest.y
            ) {

                tile.style.background =
                    "#5ad7ff";
            }


            if (
                game.randomEvent.exists &&

                game.randomEvent.found &&

                x ===
                game.randomEvent.x &&

                y ===
                game.randomEvent.y
            ) {

                if (
                    game.randomEvent.type ===
                    "healing"
                ) {

                    tile.style.background =
                        "#67ff9a";

                } else if (
                    game.randomEvent.type ===
                    "supply"
                ) {

                    tile.style.background =
                        "#ffb65a";

                } else if (
                    game.randomEvent.type ===
                    "oreVein"
                ) {

                    tile.style.background =
                        "#d98cff";

                } else if (
                    game.randomEvent.type ===
                    "rockfall" &&

                    TEST_SHOW_ROCKFALL
                ) {

                    tile.style.background =
                        "#ff7043";
                }
            }


            const ore =
                getOreAt(
                    x,
                    y
                );


            if (
                ore &&
                ore.inspected
            ) {

                const type =
                    getOreTypeById(
                        ore.id
                    );


                if (type) {

                    tile.style.background =
                        type.color;
                }
            }


            if (
                x === game.player.x &&
                y === game.player.y
            ) {

                tile.classList.add(
                    "current"
                );
            }


            minimapElement.appendChild(
                tile
            );
        }
    }
}


// ========================================
// 描画
// ========================================

function render() {

    renderMap();

    renderMinimap();

    updateInventoryUI();

    updateStatusUI();
}


// ========================================
// ログ
// ========================================

function addLog(text) {

    game.logs.push(text);


    if (!logElement) {

        return;
    }


    const line =
        document.createElement(
            "div"
        );


    line.textContent = text;


    logElement.appendChild(line);


    while (
        logElement.children.length > 10
    ) {

        logElement.removeChild(
            logElement.firstChild
        );
    }


    logElement.scrollTop =
        logElement.scrollHeight;
}


// ========================================
// 汎用確認画面
// ========================================

function createConfirmModal(
    id,
    titleText,
    textId,
    cancelText,
    cancelCallback,
    confirmText,
    confirmCallback,
    keyGuideText
) {

    if (
        document.getElementById(
            id
        )
    ) {

        return;
    }


    const overlay =
        createOverlay(id);


    const box =
        createModalWindow();


    box.appendChild(
        createTitle(
            titleText
        )
    );


    const text =
        document.createElement(
            "div"
        );


    text.id = textId;


    text.style.marginBottom =
        "14px";


    box.appendChild(text);


    const row =
        createButtonRow();


    row.appendChild(
        createButton(
            cancelText,
            cancelCallback
        )
    );


    const confirm =
        createButton(
            confirmText,
            confirmCallback
        );


    confirm.classList.add(
        "confirm-primary"
    );


    row.appendChild(confirm);

    box.appendChild(row);


    if (keyGuideText) {

        const guide =
            document.createElement(
                "div"
            );


        guide.className =
            "confirm-key-guide";


        guide.textContent =
            keyGuideText;


        box.appendChild(guide);
    }


    overlay.appendChild(box);

    document.body.appendChild(
        overlay
    );
}


// ========================================
// 汎用オーバーレイ
// ========================================

function createOverlay(id) {

    const overlay =
        document.createElement(
            "div"
        );


    overlay.id = id;


    Object.assign(
        overlay.style,
        {
            display: "none",

            position: "fixed",

            inset: "0",

            background:
                "rgba(0,0,0,0.68)",

            zIndex: "12000",

            alignItems: "center",

            justifyContent: "center",

            padding: "10px",

            boxSizing: "border-box"
        }
    );


    return overlay;
}


// ========================================
// 汎用ウィンドウ
// ========================================

function createModalWindow() {

    const box =
        document.createElement(
            "div"
        );


    Object.assign(
        box.style,
        {
            background: "#171717",

            color: "white",

            border:
                "1px solid #777",

            borderRadius: "7px",

            padding: "16px",

            width:
                "min(430px, calc(100% - 30px))",

            maxHeight: "83vh",

            overflowY: "auto",

            boxSizing: "border-box",

            textAlign: "center",

            fontSize: "13px"
        }
    );


    return box;
}


// ========================================
// 汎用タイトル
// ========================================

function createTitle(text) {

    const title =
        document.createElement(
            "h2"
        );


    title.textContent = text;


    title.style.marginTop = "0";


    return title;
}


// ========================================
// 汎用ボタン行
// ========================================

function createButtonRow() {

    const row =
        document.createElement(
            "div"
        );


    Object.assign(
        row.style,
        {
            display: "flex",

            gap: "8px",

            justifyContent: "center",

            flexWrap: "wrap"
        }
    );


    return row;
}


// ========================================
// 汎用ボタン
// ========================================

function createButton(
    text,
    callback
) {

    const button =
        document.createElement(
            "button"
        );


    button.textContent = text;


    button.onclick =
        function(event) {

            event.stopPropagation();

            callback();
        };


    return button;
}


// ========================================
// オーバーレイ表示
// ========================================

function showOverlay(id) {

    const overlay =
        document.getElementById(
            id
        );


    if (overlay) {

        overlay.style.display =
            "flex";
    }
}


// ========================================
// オーバーレイ非表示
// ========================================

function hideOverlay(id) {

    const overlay =
        document.getElementById(
            id
        );


    if (overlay) {

        overlay.style.display =
            "none";
    }
}


// ========================================
// キーボード操作
// ========================================

document.addEventListener(
    "keydown",

    function(event) {

        // ====================================
        // 開発
        // ====================================

        if (game.devOpen) {

            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                closeDevMenu();
            }


            return;
        }


        // ====================================
        // 資料室
        // ====================================

        if (game.archiveOpen) {

            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                closeArchive();
            }


            return;
        }


        // ====================================
        // 工房
        // ====================================

        if (game.workshopOpen) {

            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                closeWorkshop();
            }


            return;
        }


        // ====================================
        // 拠点強化
        // ====================================

        if (
            game.baseUpgradeOpen
        ) {

            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                closeBaseUpgrade();
            }


            return;
        }


        // ====================================
        // 鍛冶屋
        // ====================================

        if (game.forgeOpen) {

            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                closeForge();
            }


            return;
        }


        // ====================================
        // ショップ
        // ====================================

        if (game.shopOpen) {

            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                closeShop();
            }


            return;
        }


        // ====================================
        // 倉庫
        // ====================================

        if (game.warehouseOpen) {

            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                closeWarehouse();
            }


            return;
        }


        // ====================================
        // 拠点
        // ====================================

        if (game.baseOpen) {

            if (
                event.key ===
                "ArrowLeft"
            ) {

                event.preventDefault();

                changeSelectedMineLevel(
                    -1
                );
            }


            if (
                event.key ===
                "ArrowRight"
            ) {

                event.preventDefault();

                changeSelectedMineLevel(
                    1
                );
            }


            return;
        }


        // ====================================
        // 階段確認
        // Enter = 次へ
        // Space = 閉じる
        // ====================================

        if (
            game.stairConfirmOpen
        ) {

            if (
                event.repeat
            ) {

                return;
            }


            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();


                const next =
                    game.currentMineLevel +
                    1;


                if (
                    next <=
                    game.maxUnlockedMineLevel &&

                    next <=
                    MAX_MINE_LEVEL
                ) {

                    confirmStair();
                }


                return;
            }


            if (
                event.key === " " ||
                event.code === "Space"
            ) {

                event.preventDefault();

                cancelStair();

                return;
            }


            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                cancelStair();

                return;
            }


            return;
        }


        // ====================================
        // 羽確認
        // ====================================

        if (
            game.featherConfirmOpen
        ) {

            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                cancelFeatherReturn();
            }


            return;
        }


        // ====================================
        // 帰還確認
        // Enter = 帰還
        // Space = 閉じる
        // ====================================

        if (
            game.returnConfirmOpen
        ) {

            if (
                event.repeat
            ) {

                return;
            }


            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                confirmReturn();

                return;
            }


            if (
                event.key === " " ||
                event.code === "Space"
            ) {

                event.preventDefault();

                cancelReturn();

                return;
            }


            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                cancelReturn();

                return;
            }


            return;
        }


        // ====================================
        // 死亡警告
        // ====================================

        if (
            game.deathWarningOpen
        ) {

            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                cancelDangerMining();
            }


            return;
        }


        // ====================================
        // インベントリ
        // ====================================

        if (
            game.inventoryOpen
        ) {

            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                closeInventory();
            }


            return;
        }


        if (game.dead) {

            return;
        }


        // ====================================
        // Enter
        // ====================================

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();


            if (
                event.repeat
            ) {

                return;
            }


            if (
                interactWithCurrentTile()
            ) {

                return;
            }


            const ore =
                getOreAt(
                    game.player.x,
                    game.player.y
                );


            if (
                ore &&
                ore.discovered
            ) {

                mineOre(ore);

            } else {

                addLog(
                    "ここには操作できるものがありません。"
                );
            }


            return;
        }


        if (event.repeat) {

            return;
        }


        let dx = 0;

        let dy = 0;


        if (
            event.key ===
            "ArrowUp" ||

            event.key === "w" ||

            event.key === "W"
        ) {

            dy = -1;

        } else if (
            event.key ===
            "ArrowDown" ||

            event.key === "s" ||

            event.key === "S"
        ) {

            dy = 1;

        } else if (
            event.key ===
            "ArrowLeft" ||

            event.key === "a" ||

            event.key === "A"
        ) {

            dx = -1;

        } else if (
            event.key ===
            "ArrowRight" ||

            event.key === "d" ||

            event.key === "D"
        ) {

            dx = 1;

        } else {

            return;
        }


        event.preventDefault();


        movePlayer(
            dx,
            dy
        );


        startKeyRepeat(
            dx,
            dy
        );
    }
);


// ========================================
// 連続移動
// ========================================

let moveTimer = null;


// ========================================
// 連続移動開始
// ========================================

function startKeyRepeat(
    dx,
    dy
) {

    stopKeyRepeat();


    moveTimer =
        setInterval(
            function() {

                movePlayer(
                    dx,
                    dy
                );
            },
            MOVE_REPEAT_DELAY
        );
}


// ========================================
// 連続移動停止
// ========================================

function stopKeyRepeat() {

    if (
        moveTimer !== null
    ) {

        clearInterval(
            moveTimer
        );


        moveTimer = null;
    }
}


// ========================================
// キーを離した時
// ========================================

document.addEventListener(
    "keyup",

    function(event) {

        const keys = [

            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",

            "w",
            "W",
            "a",
            "A",
            "s",
            "S",
            "d",
            "D"

        ];


        if (
            keys.includes(
                event.key
            )
        ) {

            stopKeyRepeat();
        }
    }
);


// ========================================
// インベントリ外クリック
// ========================================

document.addEventListener(
    "click",

    function(event) {

        if (
            !game.inventoryOpen
        ) {

            return;
        }


        const box =
            document.getElementById(
                "inventoryWindow"
            );


        const button =
            document.getElementById(
                "inventoryButton"
            );


        if (
            box &&
            box.contains(
                event.target
            )
        ) {

            return;
        }


        if (
            button &&
            button.contains(
                event.target
            )
        ) {

            return;
        }


        closeInventory();
    }
);


// ========================================
// 移動ボタン
// ========================================

function bindMoveButtons() {

    document
        .querySelectorAll(
            "[data-move]"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",

                    function() {

                        const direction =
                            button.dataset.move;


                        if (
                            direction === "up"
                        ) {

                            movePlayer(
                                0,
                                -1
                            );

                        } else if (
                            direction === "down"
                        ) {

                            movePlayer(
                                0,
                                1
                            );

                        } else if (
                            direction === "left"
                        ) {

                            movePlayer(
                                -1,
                                0
                            );

                        } else if (
                            direction === "right"
                        ) {

                            movePlayer(
                                1,
                                0
                            );
                        }
                    }
                );
            }
        );
}


// ========================================
// ランダム整数
// ========================================

function randomInt(
    min,
    max
) {

    return Math.floor(
        Math.random() *
        (
            max -
            min +
            1
        )
    ) + min;
}


// ========================================
// シャッフル
// ========================================

function shuffle(array) {

    for (
        let i =
            array.length - 1;

        i > 0;

        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        const temp =
            array[i];


        array[i] =
            array[j];


        array[j] =
            temp;
    }


    return array;
}

// ============================================================================
// STEP 4-5 : 第2層「旧坑道」
// ============================================================================
// BALANCE_NOTE:
// ここに置かれている数値は初期実装用の確定値。
// 実プレイで詰み・過剰な周回・極端な易化が確認された場合だけ調整する。
// ============================================================================

const LAYER2_MAX_FLOOR = 100;
const LAYER2_NORMAL_MAP_SIZE = 100;
const LAYER2_BOSS_MAP_SIZE = 20;
const LAYER2_CAMERA_RADIUS = 10; // 21×21
const LAYER2_HEALING_SPAWN_RATE = 0.40;
const LAYER2_HEALING_RESPAWN_RATE = 0.40;
const LAYER2_HEALING_CAP = 0.80;
const LAYER2_CORROSION_DAMAGE = 0.005;

const LAYER2_GAS_TABLE = [
    { min: 1,  max: 9,  rate: 0.008 },
    { min: 10, max: 19, rate: 0.012 },
    { min: 20, max: 29, rate: 0.018 },
    { min: 30, max: 39, rate: 0.025 },
    { min: 40, max: 49, rate: 0.035 },
    { min: 50, max: 59, rate: 0.050 },
    { min: 60, max: 69, rate: 0.070 },
    { min: 70, max: 79, rate: 0.100 },
    { min: 80, max: 89, rate: 0.150 },
    { min: 90, max: 99, rate: 0.200 }
];

const LAYER2_EVENT_RATES = {
    1:0.0030, 10:0.0045, 20:0.0060, 30:0.0080, 40:0.0100,
    50:0.0125, 60:0.0150, 70:0.0180, 80:0.0220, 90:0.0260
};

const LAYER2_ORE_DATA = [
    { id:'greenCorrosion', name:'緑蝕鉱', minHp:40,  maxHp:50,  sellPrice:220,   color:'#74c96b', layer2Min:1 },
    { id:'grayCrystal',    name:'灰晶鉱', minHp:72,  maxHp:88,  sellPrice:480,   color:'#b6b8bd', layer2Min:1 },
    { id:'blackMembrane',  name:'黒膜鉱', minHp:135, maxHp:165, sellPrice:1100,  color:'#696477', layer2Min:1 },
    { id:'deepBlueOre',    name:'深青鉱', minHp:235, maxHp:285, sellPrice:2400,  color:'#4e75d8', layer2Min:1 },
    { id:'sealedAirCrystal',name:'封気晶',minHp:410, maxHp:490, sellPrice:5500,  color:'#a7e2db', layer2Min:1 },
    { id:'zeroVeinCrystal',name:'零脈晶', minHp:730, maxHp:870, sellPrice:13000, color:'#d7f5ff', layer2Min:1 }
];

const LAYER2_ORE_DISTRIBUTIONS = [
    { min:1,  max:9,  w:[75,20,4,0.9,0.09,0.01] },
    { min:10, max:29, w:[50,35,12,2.5,0.45,0.05] },
    { min:30, max:39, w:[25,35,30,8,1.8,0.2] },
    { min:40, max:59, w:[10,20,35,28,6,1] },
    { min:60, max:79, w:[3,8,20,35,28,6] },
    { min:80, max:99, w:[1,3,8,20,38,30] }
];

const LAYER2_BOSSES = {
    10:{name:'閉塞鉄塊',maxHp:25000},20:{name:'緑蝕巨晶',maxHp:50000},30:{name:'黒殻鉱核',maxHp:100000},
    40:{name:'脈動晶塊',maxHp:180000},50:{name:'深層凝結核',maxHp:300000},60:{name:'封気巨晶',maxHp:480000},
    70:{name:'侵蝕鉱心',maxHp:750000},80:{name:'静止晶核',maxHp:1100000},90:{name:'虚脈鉱塊',maxHp:1600000},
    100:{name:'零風晶核',maxHp:2300000}
};

const LAYER2_STORY_ITEMS = {
    10:{id:'rustedWorkerPass',name:'錆びた作業員証',description:'腐食した作業員証。所属は読み取れないが、顔写真だけが不自然なほどきれいに残っている。'},
    20:{id:'brokenPortableTerminal',name:'破損した携帯端末',description:'通信履歴が残る古い携帯端末。宛先は欠損し、最後の通信だけ異様に長い。'},
    30:{id:'unfinishedWorkDiary',name:'書きかけの作業日誌',description:'点検記録から日常的な文章へ変化していく作業日誌。最後のページには日付がない。'},
    40:{id:'audioRecorder',name:'音声記録装置',description:'古い録音装置。大半は破損している。回収後、拠点の通信設備に説明のつかない雑音が混じり始める。'},
    50:{id:'fadedGroupPhoto',name:'色褪せた集合写真',description:'見覚えのない建物で撮影された集合写真。中央だけが不自然に色褪せている。'},
    60:{id:'unnamedAuthTag',name:'無記名の認証タグ',description:'旧坑道の規格ではない認証タグ。所有者名はなく、一部の端末だけが反応する。'},
    70:{id:'fragmentedCommLog',name:'断片化した通信記録',description:'大部分が欠落した通信記録。残った断片は、こちらへ向けて誰かを呼んでいるようにも読める。'},
    80:{id:'familiarIdTag',name:'見覚えのある識別票',description:'所有者名の一部が削れた識別票。理由のない既視感がある。裏面には数字列が刻まれている。'},
    90:{id:'sealedPersonalRecord',name:'封印された個人記録',description:'暗号化された個人記録。部分復元された内容は、この鉱山とは無関係な場所を指している。'},
    100:{id:'zeroWindRecord',name:'風速零点記録',description:'長時間にわたり風速0.00を記録した観測票。位置・気圧などの主要情報は欠落している。'}
};

const LAYER2_EQUIPMENT_DATA = [
    {id:'simpleFilterMask',name:'簡易濾過マスク',gasReduction:0.20,description:'旧坑道の有毒ガスによるダメージを20%軽減する。'},
    {id:'tunnelGasGear',name:'坑道用防毒装具',gasReduction:0.50,description:'旧坑道の有毒ガスによるダメージを50%軽減する。'},
    {id:'circulationProtection',name:'循環式防護装備',gasReduction:0.70,description:'旧坑道の有毒ガスによるダメージを70%軽減する。'},
    {id:'sealedPurificationArmor',name:'完全閉鎖型浄化装甲',gasReduction:1.00,description:'旧坑道の有毒ガスを完全に遮断する。'}
];

const LAYER2_EQUIPMENT_RECIPES = [
    {id:'simpleFilterMask',name:'簡易濾過マスク',ores:{greenCorrosion:25,grayCrystal:5},money:5000,requiredFloor:1},
    {id:'tunnelGasGear',name:'坑道用防毒装具',ores:{greenCorrosion:70,grayCrystal:45,blackMembrane:12},money:40000,requiredFloor:20},
    {id:'circulationProtection',name:'循環式防護装備',ores:{grayCrystal:120,blackMembrane:80,deepBlueOre:40,sealedAirCrystal:10},money:180000,requiredFloor:50},
    {id:'sealedPurificationArmor',name:'完全閉鎖型浄化装甲',ores:{blackMembrane:180,deepBlueOre:150,sealedAirCrystal:100,zeroVeinCrystal:40},money:800000,requiredFloor:80}
];

function ensureLayer2DataStructures(){
    WORLD_LAYER_DATA[2].implemented=true;
    LAYER2_ORE_DATA.forEach(function(o){
        if(!ORE_TYPES.some(function(x){return x.id===o.id;})){
            ORE_TYPES.push({id:o.id,name:o.name,unlockLevel:9999,minHp:o.minHp,maxHp:o.maxHp,sellPrice:o.sellPrice,weight:0,color:o.color,worldLayer:2});
        }
        if(!(o.id in game.expeditionBag)) game.expeditionBag[o.id]=0;
        if(!(o.id in game.warehouse.ores)) game.warehouse.ores[o.id]=0;
        if(!game.records.ores[o.id]) game.records.ores[o.id]={discovered:false,mined:0,returned:0};
    });
    LAYER2_EQUIPMENT_DATA.forEach(function(i){
        if(!ITEM_DATA.some(function(x){return x.id===i.id;})) ITEM_DATA.push({id:i.id,name:i.name,description:i.description,worldLayer:2,equipment:true});
        if(!game.records.items[i.id]) game.records.items[i.id]={discovered:false,acquired:0};
        if(!(i.id in game.inventory.items)) game.inventory.items[i.id]=0;
    });
    Object.keys(LAYER2_STORY_ITEMS).forEach(function(f){
        var it=LAYER2_STORY_ITEMS[f];
        if(!ITEM_DATA.some(function(x){return x.id===it.id;})) ITEM_DATA.push({id:it.id,name:it.name,description:it.description,worldLayer:2,story:true});
        if(!game.records.items[it.id]) game.records.items[it.id]={discovered:false,acquired:0};
    });
    if(!game.layer2){
        game.layer2={};
    }
    var l=game.layer2;
    if(typeof l.unlocked!=='boolean') l.unlocked=false;
    if(!Number.isFinite(l.currentFloor)) l.currentFloor=1;
    if(!Number.isFinite(l.maxReachedFloor)) l.maxReachedFloor=1;
    if(!Number.isFinite(l.selectedCheckpoint)) l.selectedCheckpoint=1;
    if(!l.checkpoints) l.checkpoints={1:true};
    if(!l.gates) l.gates={};
    if(!l.bosses) l.bosses={};
    if(!l.storyItems) l.storyItems={};
    if(!l.equipmentOwned) l.equipmentOwned={};
    if(!('equippedGasProtection' in l)) l.equippedGasProtection=null;
    if(!l.status) l.status={corrosion:0,unease:0};
    if(!l.floorRuntime) l.floorRuntime={};
    if(!('audioInterferenceUnlocked' in l)) l.audioInterferenceUnlocked=false;
    if(!('layer3RecipeKnown' in l)) l.layer3RecipeKnown=false;
    if(!('layer3KeyCrafted' in l)) l.layer3KeyCrafted=false;
    if(!('warehouseTab' in l)) l.warehouseTab=1;
    if(!('shopTab' in l)) l.shopTab=1;
    if(!('workshopTab' in l)) l.workshopTab='consumables';
}

function getLayer2OreType(id){ return LAYER2_ORE_DATA.find(function(x){return x.id===id;})||null; }
function getLayer2Equipment(id){ return LAYER2_EQUIPMENT_DATA.find(function(x){return x.id===id;})||null; }
function isLayer2Active(){ return game.world.currentLayer===2 && !game.baseOpen; }
function getLayer2MapSize(){ return game.layer2.floorRuntime.mapSize||LAYER2_NORMAL_MAP_SIZE; }
function isLayer2BossFloor(f){ return f%10===0; }
function isLayer2GateFloor(f){ return f%10===9; }
function getLayer2GasRate(f){ if(isLayer2BossFloor(f)) return 0; var r=LAYER2_GAS_TABLE.find(function(x){return f>=x.min&&f<=x.max;}); return r?r.rate:0; }
function getLayer2GasReduction(){ var e=getLayer2Equipment(game.layer2.equippedGasProtection); return e?e.gasReduction:0; }
function getLayer2EventRate(f){ var keys=[90,80,70,60,50,40,30,20,10,1]; for(var i=0;i<keys.length;i++){if(f>=keys[i])return LAYER2_EVENT_RATES[keys[i]];} return 0.003; }

function layer2WeightedOre(f){
    var d=LAYER2_ORE_DISTRIBUTIONS.find(function(x){return f>=x.min&&f<=x.max;})||LAYER2_ORE_DISTRIBUTIONS[0];
    var total=d.w.reduce(function(a,b){return a+b;},0),r=Math.random()*total,c=0;
    for(var i=0;i<d.w.length;i++){c+=d.w[i];if(r<=c)return LAYER2_ORE_DATA[i];}
    return LAYER2_ORE_DATA[0];
}

function layer2CreateGrid(size,fill){ var a=[]; for(var y=0;y<size;y++){a[y]=[];for(var x=0;x<size;x++)a[y][x]=fill;} return a; }
function layer2CarveRect(map,x,y,w,h){ for(var yy=y;yy<y+h;yy++)for(var xx=x;xx<x+w;xx++)if(map[yy]&&xx>=0&&xx<map.length)map[yy][xx]='floor'; }
function layer2CarveCorridor(map,a,b){ var x=a.x,y=a.y; while(x!==b.x){map[y][x]='floor';x+=x<b.x?1:-1;} while(y!==b.y){map[y][x]='floor';y+=y<b.y?1:-1;} map[y][x]='floor'; }
function layer2FloorTiles(map){ var a=[];for(var y=1;y<map.length-1;y++)for(var x=1;x<map.length-1;x++)if(map[y][x]==='floor')a.push({x:x,y:y});return a; }
function layer2Neighbors(x,y,size){return [{x:x+1,y:y},{x:x-1,y:y},{x:x,y:y+1},{x:x,y:y-1}].filter(function(p){return p.x>=0&&p.y>=0&&p.x<size&&p.y<size;});}
function layer2Distances(map,start){var size=map.length,q=[start],dist={};dist[start.x+','+start.y]=0;for(var qi=0;qi<q.length;qi++){var p=q[qi],d=dist[p.x+','+p.y];layer2Neighbors(p.x,p.y,size).forEach(function(n){var k=n.x+','+n.y;if(map[n.y][n.x]!=='wall'&&!(k in dist)){dist[k]=d+1;q.push(n);}});}return dist;}
function layer2Farthest(map,start,forbidden){var ds=layer2Distances(map,start),best=start,bd=-1;Object.keys(ds).forEach(function(k){var sp=k.split(','),p={x:+sp[0],y:+sp[1]};if(forbidden&&forbidden(p))return;if(ds[k]>bd){bd=ds[k];best=p;}});return best;}
function layer2Reachable(map,a,b){return (b.x+','+b.y) in layer2Distances(map,a);}

function generateLayer2NormalMap(floor){
    var size=LAYER2_NORMAL_MAP_SIZE,map=layer2CreateGrid(size,'wall'),rooms=[];
    var roomCount=randomInt(14,20),attempt=0;
    while(rooms.length<roomCount&&attempt<500){attempt++;var w=randomInt(6,13),h=randomInt(5,11),x=randomInt(2,size-w-3),y=randomInt(2,size-h-3);var ok=rooms.every(function(r){return x+w+2<r.x||r.x+r.w+2<x||y+h+2<r.y||r.y+r.h+2<y;});if(!ok)continue;layer2CarveRect(map,x,y,w,h);rooms.push({x:x,y:y,w:w,h:h,cx:Math.floor(x+w/2),cy:Math.floor(y+h/2)});}
    if(rooms.length<2){layer2CarveRect(map,45,45,10,10);layer2CarveRect(map,10,10,10,10);rooms=[{x:45,y:45,w:10,h:10,cx:50,cy:50},{x:10,y:10,w:10,h:10,cx:15,cy:15}];}
    rooms.sort(function(a,b){return a.cx-b.cx;});
    for(var i=1;i<rooms.length;i++)layer2CarveCorridor(map,{x:rooms[i-1].cx,y:rooms[i-1].cy},{x:rooms[i].cx,y:rooms[i].cy});
    for(var e=0;e<Math.max(3,Math.floor(rooms.length/3));e++){var a=rooms[randomInt(0,rooms.length-1)],b=rooms[randomInt(0,rooms.length-1)];if(a!==b)layer2CarveCorridor(map,{x:a.cx,y:a.cy},{x:b.cx,y:b.cy});}
    var start={x:rooms[0].cx,y:rooms[0].cy};
    var stairs=layer2Farthest(map,start,function(p){return Math.abs(p.x-start.x)+Math.abs(p.y-start.y)<35;});
    var retreatCandidates=layer2FloorTiles(map).filter(function(p){return Math.abs(p.x-start.x)+Math.abs(p.y-start.y)>20&&Math.abs(p.x-stairs.x)+Math.abs(p.y-stairs.y)>15;});
    shuffle(retreatCandidates);var retreat=retreatCandidates[0]||start;
    var gateSwitch=null;
    if(isLayer2GateFloor(floor)){
        var sw=layer2FloorTiles(map).filter(function(p){return Math.abs(p.x-stairs.x)+Math.abs(p.y-stairs.y)>25&&Math.abs(p.x-start.x)+Math.abs(p.y-start.y)>10;});shuffle(sw);gateSwitch=sw[0]||start;
    }
    return {map:map,rooms:rooms,start:start,stairs:stairs,retreat:retreat,switchPos:gateSwitch,mapSize:size};
}

function generateLayer2BossMap(floor){
    var size=LAYER2_BOSS_MAP_SIZE,map=layer2CreateGrid(size,'wall');
    // U字型の固定空間。中央縦路をボスが塞ぎ、奥に物語箱と階段。
    layer2CarveRect(map,3,2,14,16);
    layer2CarveRect(map,6,5,8,10);
    for(var y=2;y<=17;y++){map[y][3]='floor';map[y][16]='floor';}
    for(var x=3;x<=16;x++){map[17][x]='floor';map[2][x]='floor';}
    for(var y2=2;y2<=17;y2++)map[y2][10]='floor';
    return {map:map,rooms:[],start:{x:10,y:16},stairs:{x:10,y:2},retreat:null,switchPos:null,bossPos:{x:10,y:8},storyPos:{x:10,y:4},mapSize:size};
}

function initLayer2BossState(floor){
    var d=LAYER2_BOSSES[floor]; if(!d)return null;
    if(!game.layer2.bosses[floor]) game.layer2.bosses[floor]={remainingHp:d.maxHp,firstDefeated:false,rewardReady:false};
    return game.layer2.bosses[floor];
}

function enterLayer2Floor(floor,fromCheckpoint){
    ensureLayer2DataStructures();
    floor=Math.max(1,Math.min(LAYER2_MAX_FLOOR,Math.floor(floor)));
    game.world.currentLayer=2;game.layer2.currentFloor=floor;game.layer2.maxReachedFloor=Math.max(game.layer2.maxReachedFloor,floor);game.dead=false;game.mining=false;game.pendingDangerOre=null;game.layer2.status={corrosion:0,unease:0};
    var built=isLayer2BossFloor(floor)?generateLayer2BossMap(floor):generateLayer2NormalMap(floor);
    game.map=built.map;game.explored=layer2CreateGrid(built.mapSize,false);game.player.x=built.start.x;game.player.y=built.start.y;
    game.layer2.floorRuntime={mapSize:built.mapSize,rooms:built.rooms,start:built.start,stairs:built.stairs,retreat:built.retreat,switchPos:built.switchPos,healing:null,treasure:null,bossPos:built.bossPos||null,storyPos:built.storyPos||null,gasAnnounced:false};
    game.stairs={x:built.stairs.x,y:built.stairs.y,found:false};
    game.returnPoint=built.retreat?{x:built.retreat.x,y:built.retreat.y,found:false}:{x:0,y:0,found:false};
    game.treasureChest={x:0,y:0,exists:false,found:false};game.randomEvent={x:0,y:0,exists:false,found:false,type:null};game.ores=[];
    if(isLayer2BossFloor(floor)){
        game.layer2.checkpoints[floor]=true;initLayer2BossState(floor);spawnLayer2BossOre(floor);
    }else{
        generateLayer2Ores(floor,built.rooms);
        if(Math.random()<LAYER2_HEALING_SPAWN_RATE) respawnLayer2HealingPoint(true);
    }
    updateLayer2Vision();render();
    addLog('旧坑道 '+floor+'Fへ入場しました。');
    if(isLayer2BossFloor(floor)) addLog('有毒ガス反応は検出されない。');
    else {addLog('警告：この区画から有毒ガス反応を検出。');game.layer2.floorRuntime.gasAnnounced=true;}
    if(isLayer2GateFloor(floor)&&!isLayer2GateOpen(floor)) addLog('階段区画の制御ゲートは閉鎖されています。');
    updateStatusUI();
}

function generateLayer2Ores(floor,rooms){
    var candidates=[];
    rooms.forEach(function(r){for(var y=r.y+1;y<r.y+r.h-1;y++)for(var x=r.x+1;x<r.x+r.w-1;x++){if(Math.random()<0.12)candidates.push({x:x,y:y});}});
    shuffle(candidates);var count=Math.min(candidates.length,randomInt(28,42));
    for(var i=0;i<count;i++){
        var p=candidates[i];if((p.x===game.player.x&&p.y===game.player.y)||(p.x===game.stairs.x&&p.y===game.stairs.y)||(game.returnPoint&&p.x===game.returnPoint.x&&p.y===game.returnPoint.y))continue;
        var t=layer2WeightedOre(floor),hp=randomInt(t.minHp,t.maxHp);
        game.ores.push({x:p.x,y:p.y,id:t.id,name:t.name,level:floor,hp:hp,maxHp:hp,discovered:false,inspected:false,detected:false,worldLayer:2});
    }
}

function spawnLayer2BossOre(floor){
    var b=LAYER2_BOSSES[floor],s=initLayer2BossState(floor),p=game.layer2.floorRuntime.bossPos;if(!b||!s||!p)return;
    if(s.firstDefeated&&s.remainingHp<=0)s.remainingHp=Math.max(1,Math.ceil(b.maxHp*0.10));
    if(s.remainingHp>0)game.ores.push({x:p.x,y:p.y,id:'layer2Boss'+floor,name:s.firstDefeated?'弱体化した'+b.name:b.name,level:floor,hp:s.remainingHp,maxHp:s.firstDefeated?Math.ceil(b.maxHp*0.10):b.maxHp,discovered:true,inspected:true,boss:true,bossFloor:floor,worldLayer:2});
}

function updateLayer2Vision(){
    var size=getLayer2MapSize(),r=VISION_RADIUS;
    for(var y=Math.max(0,game.player.y-r);y<=Math.min(size-1,game.player.y+r);y++)for(var x=Math.max(0,game.player.x-r);x<=Math.min(size-1,game.player.x+r);x++)game.explored[y][x]=true;
    game.ores.forEach(function(o){if(Math.abs(o.x-game.player.x)<=r&&Math.abs(o.y-game.player.y)<=r)o.discovered=true;});
    var rt=game.layer2.floorRuntime;
    if(rt.retreat&&Math.abs(rt.retreat.x-game.player.x)<=r&&Math.abs(rt.retreat.y-game.player.y)<=r)game.returnPoint.found=true;
    if(Math.abs(rt.stairs.x-game.player.x)<=r&&Math.abs(rt.stairs.y-game.player.y)<=r)game.stairs.found=true;
    if(rt.healing&&Math.abs(rt.healing.x-game.player.x)<=r&&Math.abs(rt.healing.y-game.player.y)<=r)rt.healing.found=true;
    if(rt.switchPos&&Math.abs(rt.switchPos.x-game.player.x)<=r&&Math.abs(rt.switchPos.y-game.player.y)<=r)rt.switchFound=true;
}

function isLayer2GateOpen(floor){return !!game.layer2.gates[floor];}
function layer2InteractionBlocked(){return game.layer2.status.unease>0;}
function layer2UneaseText(){return '不穏：残り'+game.layer2.status.unease+'行動';}

function layer2ApplyDamage(amount,text){
    amount=Math.max(0,amount);game.player.hp=Math.max(0,Math.round((game.player.hp-amount)*100)/100);if(text)addLog(text+'（-'+formatHp(amount)+' HP）');if(game.player.hp<=0){layer2Die(text||'旧坑道で力尽きた。');return true;}return false;
}
function layer2Die(reason){if(game.dead)return;game.dead=true;game.player.hp=0;if(reason)addLog(reason);addLog('HPが0になり、力尽きました。');render();setTimeout(handleDeath,500);}

function layer2TriggerTrap(){
    var f=game.layer2.currentFloor;
    if(f>=90&&f<=99&&Math.random()<0.0003){
        if(Math.random()<0.5){var d=game.player.maxHp*(0.75+Math.random()*0.20);return layer2ApplyDamage(d,'深層断裂に巻き込まれた。');}
        var d2=game.player.maxHp*(0.80+Math.random()*0.20);layer2TryCollapseTerrain();return layer2ApplyDamage(d2,'圧壊が発生した。周囲の地形が崩れた。');
    }
    if(Math.random()>=getLayer2EventRate(f))return false;
    var r=Math.random();
    if(r<0.38){return layer2ApplyDamage(game.player.maxHp*(0.15+Math.random()*0.10),'落石が直撃した。');}
    if(r<0.58){return layer2ApplyDamage(game.player.maxHp*(0.40+Math.random()*0.20),'崩落に巻き込まれた。');}
    if(r<0.80){
        if(layer2ApplyDamage(game.player.maxHp*(0.30+Math.random()*0.15),'強酸が噴き出した。'))return true;
        var n=randomInt(10,50);game.layer2.status.corrosion=Math.max(game.layer2.status.corrosion,n);addLog('状態異常「腐食」：残り'+game.layer2.status.corrosion+'行動');return false;
    }
    var u=randomInt(8,12);game.layer2.status.unease=Math.max(game.layer2.status.unease,u);addLog('得体の知れない不穏さに包まれた。 '+layer2UneaseText());return false;
}

function layer2TryCollapseTerrain(){
    var rt=game.layer2.floorRuntime,size=getLayer2MapSize(),critical=[rt.start,rt.stairs,rt.retreat,rt.switchPos,rt.healing].filter(Boolean);
    var choices=layer2Neighbors(game.player.x,game.player.y,size).filter(function(p){return game.map[p.y][p.x]==='floor'&&!critical.some(function(c){return c.x===p.x&&c.y===p.y;});});shuffle(choices);
    choices.slice(0,3).forEach(function(p){var old=game.map[p.y][p.x];game.map[p.y][p.x]='wall';if(!layer2Reachable(game.map,{x:game.player.x,y:game.player.y},rt.stairs)||(rt.retreat&&!layer2Reachable(game.map,{x:game.player.x,y:game.player.y},rt.retreat)))game.map[p.y][p.x]=old;});
}

function layer2TickStatuses(){
    if(game.layer2.status.corrosion>0){game.layer2.status.corrosion--;if(layer2ApplyDamage(game.player.maxHp*LAYER2_CORROSION_DAMAGE,'腐食が身体を蝕む。'))return true;}
    if(game.layer2.status.unease>0)game.layer2.status.unease--;
    return false;
}
function layer2ApplyGas(){
    var rate=getLayer2GasRate(game.layer2.currentFloor);if(rate<=0)return false;var effective=rate*(1-getLayer2GasReduction());if(effective<=0)return false;
    return layer2ApplyDamage(game.player.maxHp*effective,'有毒ガスによるダメージ。');
}
function layer2AfterAction(opts){opts=opts||{};if(opts.trap!==false&&layer2TriggerTrap())return;if(layer2TickStatuses())return;if(opts.gas!==false)layer2ApplyGas();if(!game.dead){updateLayer2Vision();render();}}

function moveLayer2Player(dx,dy){
    if(game.baseOpen||game.dead||game.deathWarningOpen||game.returnConfirmOpen||game.featherConfirmOpen||game.stairConfirmOpen||game.mining||game.inventoryOpen)return;
    var nx=game.player.x+dx,ny=game.player.y+dy,size=getLayer2MapSize();if(nx<0||ny<0||nx>=size||ny>=size)return;if(game.map[ny][nx]==='wall'){addLog('壁があるため進めません。');return;}
    var boss=game.ores.find(function(o){return o.boss&&o.x===nx&&o.y===ny;});if(boss){addLog('巨大な鉱塊が進路を塞いでいる。');return;}
    game.player.x=nx;game.player.y=ny;updateLayer2Vision();layer2AfterAction({trap:true,gas:true});
}

function layer2CurrentSpecial(){
    var rt=game.layer2.floorRuntime,x=game.player.x,y=game.player.y;
    if(rt.healing&&rt.healing.exists&&x===rt.healing.x&&y===rt.healing.y)return 'healing';
    if(rt.switchPos&&x===rt.switchPos.x&&y===rt.switchPos.y)return 'switch';
    if(rt.storyPos&&x===rt.storyPos.x&&y===rt.storyPos.y&&isLayer2BossCleared(game.layer2.currentFloor)&&!game.layer2.storyItems[game.layer2.currentFloor])return 'story';
    return null;
}
function interactLayer2CurrentTile(){
    var sp=layer2CurrentSpecial();if(sp==='healing'){useLayer2HealingPoint();return true;}if(sp==='switch'){operateLayer2Switch();return true;}if(sp==='story'){collectLayer2StoryItem();return true;}
    if(game.returnPoint.found&&game.player.x===game.returnPoint.x&&game.player.y===game.returnPoint.y){if(layer2InteractionBlocked()){addLog('不穏のため帰還操作ができない。 '+layer2UneaseText());return true;}showReturnConfirm();return true;}
    if(game.stairs.found&&game.player.x===game.stairs.x&&game.player.y===game.stairs.y){showStairConfirm();return true;}return false;
}

function useLayer2HealingPoint(){
    var h=game.layer2.floorRuntime.healing;if(!h||!h.exists||game.player.x!==h.x||game.player.y!==h.y)return;
    var beforeHp=game.player.hp,hadStatus=game.layer2.status.corrosion>0||game.layer2.status.unease>0,cap=game.player.maxHp*LAYER2_HEALING_CAP;
    if(game.player.hp<cap)game.player.hp=Math.min(cap,game.player.hp+game.player.maxHp*0.35);
    game.layer2.status.corrosion=0;game.layer2.status.unease=0;h.exists=false;addLog('旧坑道の淡い光に触れた。');if(game.player.hp>beforeHp)addLog('HPが'+formatHp(game.player.hp-beforeHp)+'回復した。');if(hadStatus)addLog('状態異常が解除された。');if(game.player.hp===beforeHp&&!hadStatus)addLog('身体に変化はない。');
    var guaranteed=beforeHp>=cap&&!hadStatus;if(guaranteed||Math.random()<LAYER2_HEALING_RESPAWN_RATE){respawnLayer2HealingPoint(false);addLog('坑道のどこかで微かな光を感じた……。');}
    render(); // 回復地点使用はガス免除
}
function respawnLayer2HealingPoint(initial){
    var rt=game.layer2.floorRuntime,tiles=layer2FloorTiles(game.map).filter(function(p){return Math.abs(p.x-game.player.x)+Math.abs(p.y-game.player.y)>8&&!(p.x===rt.stairs.x&&p.y===rt.stairs.y)&&(!rt.retreat||p.x!==rt.retreat.x||p.y!==rt.retreat.y)&&(!rt.switchPos||p.x!==rt.switchPos.x||p.y!==rt.switchPos.y);});shuffle(tiles);var p=tiles[0];if(p)rt.healing={x:p.x,y:p.y,exists:true,found:false};else rt.healing=null;
}
function operateLayer2Switch(){
    var f=game.layer2.currentFloor;if(!isLayer2GateFloor(f))return;if(layer2InteractionBlocked()){addLog('不穏のため制御スイッチを操作できない。 '+layer2UneaseText());return;}if(isLayer2GateOpen(f)){addLog('制御信号はすでにONになっている。');return;}game.layer2.gates[f]=true;addLog('制御スイッチを操作した。');addLog('制御信号ON。階段区画のゲートが開いた。');layer2AfterAction({trap:false,gas:true});
}
function isLayer2BossCleared(f){var s=game.layer2.bosses[f];return !!(s&&s.firstDefeated&&s.remainingHp<=0);}

function mineLayer2Ore(ore){
    if(game.baseOpen||game.dead||game.mining||game.inventoryOpen||game.deathWarningOpen||game.returnConfirmOpen||game.featherConfirmOpen||game.stairConfirmOpen||!ore||!ore.discovered)return;
    game.mining=true;inspectOre(ore);if(!devInfiniteHealth_STEP413())game.player.hp=Math.max(0,Math.round((game.player.hp-MINING_HP_COST)*100)/100);else game.player.hp=game.player.maxHp;var power=getMiningPower(game.pickaxe.level);ore.hp=devInfiniteMining_STEP413()?0:Math.max(0,ore.hp-power);addLog(ore.name+'　耐久 '+ore.hp+'/'+ore.maxHp+'　(-'+(devInfiniteMining_STEP413()?'∞':power)+')');
    if(ore.boss){var bs=initLayer2BossState(ore.bossFloor);bs.remainingHp=ore.hp;}
    if(ore.hp<=0){
        if(ore.boss){handleLayer2BossDestroyed(ore);}else{addOreToExpeditionBag(ore);recordOreMined(ore.id,1);addLog(ore.name+'を1個入手しました。');}
        var idx=game.ores.indexOf(ore);if(idx>=0)game.ores.splice(idx,1);
    }
    if(game.player.hp<=0){game.mining=false;layer2Die('採掘の負荷に耐えられなかった。');return;}
    game.mining=false;layer2AfterAction({trap:true,gas:true});
}

function handleLayer2BossDestroyed(ore){
    var f=ore.bossFloor,b=LAYER2_BOSSES[f],s=initLayer2BossState(f),first=!s.firstDefeated;s.remainingHp=0;
    if(first){s.firstDefeated=true;addLog(b.name+'を破壊した。');addLog('奥の区画への経路が開いた。');}
    else{addLog(ore.name+'を再び破壊した。');grantLayer2BossRepeatReward(f);}
}
function grantLayer2BossRepeatReward(f){var scale=f/10;var money=Math.floor(15000*scale*scale);game.money+=money;var maxIndex=Math.min(5,Math.floor((f-1)/15)+1);for(var i=0;i<=maxIndex;i++){var amt=randomInt(1,Math.max(2,Math.ceil(scale/2)));addOreAmountToExpeditionBag(LAYER2_ORE_DATA[i].id,amt);}addLog('再結晶した鉱塊から'+money+'G相当の資源を回収した。');}

function collectLayer2StoryItem(){
    var f=game.layer2.currentFloor,it=LAYER2_STORY_ITEMS[f];if(!it||game.layer2.storyItems[f])return;game.layer2.storyItems[f]=true;registerItemDiscovery(it.id,true);addLog('シナリオ品「'+it.name+'」を回収した。');addLog(it.description);
    if(f===40){game.layer2.audioInterferenceUnlocked=true;addLog('……拠点設備に微弱な通信ノイズが混入した。');}
    if(f===100){game.layer2.layer3RecipeKnown=true;addLog('風速零点記録から、新たな接続条件を解析できそうだ。');}
    render();
}

function useLayer2Potion(){
    if(game.inventory.items.potion<=0){addLog('回復薬を持っていません。');return;}if(game.player.hp>=game.player.maxHp){addLog('HPはすでに満タンです。');return;}
    var b=game.player.hp;game.inventory.items.potion--;game.player.hp=Math.min(game.player.maxHp,game.player.hp+POTION_HEAL_AMOUNT);addLog('回復薬を使用しました。HPが'+formatHp(game.player.hp-b)+'回復しました。');layer2AfterAction({trap:false,gas:true});
}

function getLayer2GateStatusText(){var f=game.layer2.currentFloor;if(!isLayer2GateFloor(f))return '';return isLayer2GateOpen(f)?'OPEN / 制御信号ON':'LOCKED / 制御信号OFF';}

function showLayer2StairConfirm(){
    if(game.stairConfirmOpen)return;var f=game.layer2.currentFloor;if(layer2InteractionBlocked()){addLog('不穏のため階段を使用できない。 '+layer2UneaseText());return;}
    if(isLayer2GateFloor(f)&&!isLayer2GateOpen(f)){addLog('LOCKED / 制御信号OFF / 周辺区画にある制御スイッチを探してください。');return;}
    if(isLayer2BossFloor(f)&&!isLayer2BossCleared(f)){addLog('巨大な鉱塊が進路を塞いでいる。');return;}
    if(isLayer2BossFloor(f)&&!game.layer2.storyItems[f]){addLog('奥に未回収の記録が残されている。');return;}
    stopKeyRepeat();game.stairConfirmOpen=true;var text=document.getElementById('stairConfirmText'),button=document.querySelector('#stairConfirmOverlay .confirm-primary');if(f>=100){if(text)text.textContent='旧坑道の最深部です。';if(button)button.disabled=true;}else{if(text)text.textContent='旧坑道 '+(f+1)+'Fへ進みますか？';if(button)button.disabled=false;}showOverlay('stairConfirmOverlay');
}
function confirmLayer2Stair(){var f=game.layer2.currentFloor;if(f>=100)return;hideStairConfirm();enterLayer2Floor(f+1,false);}

function renderLayer2Map(){
    if(!mapElement)return;var rt=game.layer2.floorRuntime,size=getLayer2MapSize(),rad=LAYER2_CAMERA_RADIUS,minX=Math.max(0,game.player.x-rad),maxX=Math.min(size-1,game.player.x+rad),minY=Math.max(0,game.player.y-rad),maxY=Math.min(size-1,game.player.y+rad),cols=maxX-minX+1;mapElement.innerHTML='';mapElement.style.gridTemplateColumns='repeat('+cols+', 1fr)';
    for(var y=minY;y<=maxY;y++)for(var x=minX;x<=maxX;x++){
        var t=document.createElement('div');t.className='tile';var explored=game.explored[y]&&game.explored[y][x];if(!explored){t.classList.add('hidden');mapElement.appendChild(t);continue;}
        if(game.map[y][x]==='wall'){t.classList.add('wall');t.textContent='■';}else{t.classList.add('floor');t.textContent='・';}
        var ore=getOreAt(x,y);if(ore&&ore.discovered){t.textContent=ore.boss?'巨':'鉱';t.style.cursor='pointer';var ty=getOreTypeById(ore.id);if(ty)t.style.color=ty.color;if(ore.boss)t.style.color='#ffcf66';t.onclick=function(o){return function(ev){ev.stopPropagation();mineOre(o);};}(ore);}
        if(rt.retreat&&game.returnPoint.found&&x===rt.retreat.x&&y===rt.retreat.y){t.textContent='帰';t.style.color='#ffd84d';t.style.fontWeight='bold';}
        if(game.stairs.found&&x===rt.stairs.x&&y===rt.stairs.y){t.textContent=isLayer2GateFloor(game.layer2.currentFloor)&&!isLayer2GateOpen(game.layer2.currentFloor)?'門':'階';t.style.color=isLayer2GateFloor(game.layer2.currentFloor)&&!isLayer2GateOpen(game.layer2.currentFloor)?'#ef6a62':'#67e667';t.style.fontWeight='bold';}
        if(rt.healing&&rt.healing.exists&&rt.healing.found&&x===rt.healing.x&&y===rt.healing.y){t.textContent='癒';t.style.color='#73ff9b';t.style.fontWeight='bold';}
        if(rt.switchPos&&rt.switchFound&&x===rt.switchPos.x&&y===rt.switchPos.y){t.textContent='制';t.style.color=isLayer2GateOpen(game.layer2.currentFloor)?'#74ff8a':'#ffca63';t.style.fontWeight='bold';}
        if(rt.storyPos&&isLayer2BossCleared(game.layer2.currentFloor)&&!game.layer2.storyItems[game.layer2.currentFloor]&&x===rt.storyPos.x&&y===rt.storyPos.y){t.textContent='記';t.style.color='#9bd5ff';t.style.fontWeight='bold';}
        if(x===game.player.x&&y===game.player.y){t.classList.add('player');if(!ore)t.textContent='●';}
        mapElement.appendChild(t);
    }
}

function renderLayer2Minimap(){
    if(!minimapElement)return;var size=getLayer2MapSize();minimapElement.innerHTML='';minimapElement.style.gridTemplateColumns='repeat('+size+', 1fr)';minimapElement.style.maxWidth='320px';
    for(var y=0;y<size;y++)for(var x=0;x<size;x++){var t=document.createElement('div');t.className='mini-tile';if(game.explored[y]&&game.explored[y][x]){t.classList.add('explored');if(game.map[y][x]==='wall')t.classList.add('mini-wall');}if(x===game.player.x&&y===game.player.y)t.classList.add('current');minimapElement.appendChild(t);}
}

function getLayer2CheckpointFloors(){var a=[1];for(var f=10;f<=100;f+=10)if(game.layer2.checkpoints[f])a.push(f);return a;}
function changeLayer2Checkpoint(dir){var a=getLayer2CheckpointFloors(),idx=a.indexOf(game.layer2.selectedCheckpoint);if(idx<0)idx=0;idx=Math.max(0,Math.min(a.length-1,idx+dir));game.layer2.selectedCheckpoint=a[idx];updateLayer2BasePanel();}
function startLayer2FromBase(){if(!game.baseOpen||!game.layer2.unlocked)return;game.player.hp=game.player.maxHp;clearExpeditionBag();hideBase();enterLayer2Floor(game.layer2.selectedCheckpoint||1,true);}

function updateLayer2BasePanel(){
    var depth=document.getElementById('depthObservationBox');if(!depth)return;var old=document.getElementById('layer2BasePanel');if(old)old.remove();if(!game.layer2.unlocked)return;
    var p=document.createElement('div');p.id='layer2BasePanel';Object.assign(p.style,{marginTop:'10px',padding:'9px',border:'1px solid #46565a',borderRadius:'5px',background:'rgba(6,18,20,.55)'});
    var t=document.createElement('div');t.textContent='【旧坑道 探索地点】';t.style.fontWeight='bold';t.style.color='#a9eef1';p.appendChild(t);
    var row=document.createElement('div');Object.assign(row.style,{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginTop:'7px'});var l=document.createElement('button');l.textContent='◀';l.onclick=function(e){e.stopPropagation();changeLayer2Checkpoint(-1);};var d=document.createElement('span');d.textContent=game.layer2.selectedCheckpoint===1?'旧坑道入口':'第'+(game.layer2.selectedCheckpoint/10)+'中継点（'+game.layer2.selectedCheckpoint+'F）';var r=document.createElement('button');r.textContent='▶';r.onclick=function(e){e.stopPropagation();changeLayer2Checkpoint(1);};row.append(l,d,r);p.appendChild(row);
    var b=document.createElement('button');b.textContent='旧坑道へ探索';b.style.marginTop='7px';b.onclick=function(e){e.stopPropagation();startLayer2FromBase();};p.appendChild(b);depth.parentNode.insertBefore(p,depth.nextSibling);
}

function attemptRealLayer2Connection(){
    if(!game.baseOpen||!game.progressFlags.layer2RequirementsKnown)return;
    if(game.layer2.unlocked){setBaseMessage('第2層「旧坑道」への接続は確立されています。');updateLayer2BasePanel();return;}
    if(!canAttemptLayer2Connection()){addLog('接続に必要な資源が不足しています。');setBaseMessage('未確認領域への接続条件を満たしていません。');return;}
    game.warehouse.ores.godSteel-=LAYER2_UNLOCK_GODSTEEL;game.money-=LAYER2_UNLOCK_MONEY;game.progressFlags.layer2Attempted=true;game.layer2.unlocked=true;game.world.maxUnlockedLayer=Math.max(game.world.maxUnlockedLayer,2);game.layer2.checkpoints[1]=true;game.layer2.selectedCheckpoint=1;
    addLog('神鋼鉱100個と1000000Gを消費しました。');addLog('未確認領域への接続に成功しました。');addLog('第2層「旧坑道」が解放されました。');setBaseMessage('第2層「旧坑道」への接続を確立しました。');updateAllBaseWindows();updateLayer2BasePanel();
}

function layer2CanCraftEquipment(recipe){if(!game.layer2.unlocked||game.layer2.maxReachedFloor<recipe.requiredFloor||game.layer2.equipmentOwned[recipe.id])return false;if(game.money<recipe.money)return false;return Object.keys(recipe.ores).every(function(id){return (game.warehouse.ores[id]||0)>=recipe.ores[id];});}
function craftLayer2Equipment(id){var r=LAYER2_EQUIPMENT_RECIPES.find(function(x){return x.id===id;});if(!r||!layer2CanCraftEquipment(r))return;Object.keys(r.ores).forEach(function(k){game.warehouse.ores[k]-=r.ores[k];});game.money-=r.money;game.layer2.equipmentOwned[id]=true;game.inventory.items[id]=1;game.layer2.equippedGasProtection=id;registerItemDiscovery(id,true);addLog(r.name+'を作成し、装備しました。');updateAllBaseWindows();}
function equipLayer2GasItem(id){if(!game.layer2.equipmentOwned[id])return;game.layer2.equippedGasProtection=id;addLog(getLayer2Equipment(id).name+'を装備しました。');updateInventoryUI();updateStatusUI();}

function createLayer2TabBar(parent,current,onchange){if(!game.layer2.unlocked)return;var bar=document.createElement('div');Object.assign(bar.style,{display:'flex',gap:'6px',marginBottom:'10px'});[[1,'通常鉱山'],[2,'旧坑道']].forEach(function(x){var b=document.createElement('button');b.textContent=x[1];b.disabled=current===x[0];b.onclick=function(e){e.stopPropagation();onchange(x[0]);};bar.appendChild(b);});parent.appendChild(bar);}

// ---- 既存関数を安全にラップ ----
const _l2_movePlayer=movePlayer;
movePlayer=function(dx,dy){if(isLayer2Active())return moveLayer2Player(dx,dy);return _l2_movePlayer(dx,dy);};
const _l2_interact=interactWithCurrentTile;
interactWithCurrentTile=function(){if(isLayer2Active())return interactLayer2CurrentTile();return _l2_interact();};
const _l2_mineOre=mineOre;
mineOre=function(ore){if(isLayer2Active())return mineLayer2Ore(ore);return _l2_mineOre(ore);};
const _l2_usePotion=usePotion;
usePotion=function(){if(isLayer2Active())return useLayer2Potion();return _l2_usePotion();};
const _l2_showStair=showStairConfirm;
showStairConfirm=function(){if(isLayer2Active())return showLayer2StairConfirm();return _l2_showStair();};
const _l2_confirmStair=confirmStair;
confirmStair=function(){if(isLayer2Active())return confirmLayer2Stair();return _l2_confirmStair();};
const _l2_renderMap=renderMap;
renderMap=function(){if(isLayer2Active())return renderLayer2Map();return _l2_renderMap();};
const _l2_renderMinimap=renderMinimap;
renderMinimap=function(){if(isLayer2Active())return renderLayer2Minimap();return _l2_renderMinimap();};
const _l2_updateVision=updateVision;
updateVision=function(){if(isLayer2Active())return updateLayer2Vision();return _l2_updateVision();};
const _l2_reveal=revealFullMapForTesting;
revealFullMapForTesting=function(){if(isLayer2Active()){var size=getLayer2MapSize();for(var y=0;y<size;y++)for(var x=0;x<size;x++)game.explored[y][x]=true;game.ores.forEach(function(o){o.discovered=true;});game.returnPoint.found=true;game.stairs.found=true;if(game.layer2.floorRuntime.healing)game.layer2.floorRuntime.healing.found=true;if(game.layer2.floorRuntime.switchPos)game.layer2.floorRuntime.switchFound=true;render();return;}return _l2_reveal();};

const _l2_attempt=attemptLayer2Connection;
attemptLayer2Connection=function(){ensureLayer2DataStructures();return attemptRealLayer2Connection();};

const _l2_getTickerState=getBaseTickerState;
getBaseTickerState=function(){if(game.layer2&&game.layer2.unlocked)return 'layer2';return _l2_getTickerState();};
const _l2_getTickerMessages=getBaseTickerMessages;
getBaseTickerMessages=function(state){
    if(state==='layer2'&&game.layer2&&game.layer2.unlocked){
        if(game.layer2.audioInterferenceUnlocked){
            return [
                'GOOD LUCK, MINER.　本日も安全な採掘を。','旧坑道区域　安全確認：██％','おはよう','今日そっち雨降ってる？','コーヒー買ってきたよ','聞こえ――','帰還地点を確認してください。','……返事、した？','G□□D LUCK, M▩NER.','███から微弱な音声信号を受信'
            ];
        }
        return ['GOOD LUCK, MINER.　本日も安全な採掘を。','旧坑道区域の有毒ガス濃度を監視しています。','防護装備を確認してから探索してください。','成果よりも無事な帰還を優先してください。','未登録設備には触れないでください。','帰還地点の確認を忘れずに。'];
    }
    return _l2_getTickerMessages(state);
};

const _l2_updateBaseUI=updateBaseUI;
updateBaseUI=function(){_l2_updateBaseUI();ensureLayer2DataStructures();updateLayer2BasePanel();};

const _l2_updateDepth=updateDepthObservationUI;
updateDepthObservationUI=function(){
    ensureLayer2DataStructures();
    if(game.layer2.unlocked){var box=document.getElementById('depthObservationBox');if(!box)return;box.innerHTML='';var title=document.createElement('div');title.textContent='【 深 度 観 測 】';Object.assign(title.style,{marginBottom:'6px',color:'#b5a2ff',fontWeight:'bold',letterSpacing:'1px'});box.appendChild(title);var t=document.createElement('div');t.textContent='第2層「旧坑道」への接続を維持しています。';box.appendChild(t);var sub=document.createElement('div');sub.style.marginTop='4px';sub.style.fontSize='11px';sub.style.color='#aaa';sub.textContent='到達深度：'+game.layer2.maxReachedFloor+'F';box.appendChild(sub);if(game.layer2.layer3RecipeKnown){var k=document.createElement('div');k.style.marginTop='7px';k.style.color='#d7cdfd';k.textContent='風速零点記録を解析中。次の接続経路に必要な情報を確認しています。';box.appendChild(k);}return;}
    return _l2_updateDepth();
};

const _l2_updateStatus=updateStatusUI;
updateStatusUI=function(){_l2_updateStatus();if(!isLayer2Active())return;var el=document.getElementById('playerStatus');if(!el)return;var eq=getLayer2Equipment(game.layer2.equippedGasProtection);el.textContent='第2層 旧坑道 '+game.layer2.currentFloor+'F　HP：'+formatHp(game.player.hp)+'/'+formatHp(game.player.maxHp)+'　採掘力：'+getMiningPower(game.pickaxe.level)+(eq?'　防護：'+eq.name:'　防護：なし')+(game.layer2.status.corrosion>0?'　腐食:'+game.layer2.status.corrosion:'')+(game.layer2.status.unease>0?'　不穏:'+game.layer2.status.unease:'')+'　所持金：'+game.money+'G';};

const _l2_updateInventory=updateInventoryUI;
updateInventoryUI=function(){
    if(!game.layer2.unlocked)return _l2_updateInventory();var box=document.getElementById('inventoryWindow');if(!box)return;box.innerHTML='';box.appendChild(createTitle('インベントリ'));
    var st=document.createElement('div');st.textContent='HP '+formatHp(game.player.hp)+'/'+formatHp(game.player.maxHp)+'　採掘力 '+getMiningPower(game.pickaxe.level);st.style.marginBottom='10px';box.appendChild(st);
    var bt=document.createElement('h3');bt.textContent='探索バッグ';box.appendChild(bt);ORE_TYPES.filter(function(o){return !o.worldLayer||o.worldLayer===game.world.currentLayer;}).forEach(function(type){var line=document.createElement('div');line.textContent=type.name+'：'+(game.expeditionBag[type.id]||0);line.style.color=type.color;box.appendChild(line);});
    var it=document.createElement('h3');it.textContent='アイテム';box.appendChild(it);addItemRow(box,'探知機',game.inventory.items.detector,useDetector);addItemRow(box,'帰還の羽',game.inventory.items.returnFeather,useReturnFeather);addItemRow(box,'回復薬',game.inventory.items.potion,usePotion);addItemRow(box,'体力強化',game.inventory.items.healthBoost,useHealthBoost);
    var et=document.createElement('h3');et.textContent='探索装備';box.appendChild(et);LAYER2_EQUIPMENT_DATA.forEach(function(e){if(!game.layer2.equipmentOwned[e.id])return;var row=document.createElement('div');Object.assign(row.style,{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'5px'});var tx=document.createElement('span');tx.textContent=e.name+'（ガス-'+Math.round(e.gasReduction*100)+'%）';var b=document.createElement('button');b.textContent=game.layer2.equippedGasProtection===e.id?'装備中':'装備';b.disabled=game.layer2.equippedGasProtection===e.id;b.onclick=function(ev){ev.stopPropagation();equipLayer2GasItem(e.id);};row.append(tx,b);box.appendChild(row);});
    var c=document.createElement('button');c.textContent='閉じる';c.style.marginTop='12px';c.onclick=function(e){e.stopPropagation();closeInventory();};box.appendChild(c);
};

const _l2_updateWarehouse=updateWarehouseUI;
updateWarehouseUI=function(){
    if(!game.layer2.unlocked)return _l2_updateWarehouse();var box=document.getElementById('warehouseWindow');if(!box)return;box.innerHTML='';box.appendChild(createTitle('倉庫'));createLayer2TabBar(box,game.layer2.warehouseTab,function(v){game.layer2.warehouseTab=v;updateWarehouseUI();});var desc=document.createElement('div');desc.textContent='保管済みの鉱石は、探索で力尽きても失われません。';desc.style.marginBottom='13px';box.appendChild(desc);ORE_TYPES.filter(function(o){return game.layer2.warehouseTab===1?!o.worldLayer:o.worldLayer===2;}).forEach(function(type){var r=document.createElement('div');Object.assign(r.style,{display:'flex',justifyContent:'space-between',padding:'5px 8px',marginBottom:'3px',background:'rgba(0,0,0,.15)',borderRadius:'4px'});var n=document.createElement('span');n.textContent=type.name;var a=document.createElement('span');a.textContent=game.warehouse.ores[type.id]||0;a.style.color=type.color;r.append(n,a);box.appendChild(r);});var c=document.createElement('button');c.textContent='閉じる';c.style.marginTop='11px';c.onclick=function(e){e.stopPropagation();closeWarehouse();};box.appendChild(c);
};

const _l2_updateShop=updateShopUI;
updateShopUI=function(){
    if(!game.layer2.unlocked)return _l2_updateShop();var box=document.getElementById('shopWindow');if(!box)return;box.innerHTML='';box.appendChild(createTitle('ショップ'));createLayer2TabBar(box,game.layer2.shopTab,function(v){game.layer2.shopTab=v;updateShopUI();});var m=document.createElement('div');m.textContent='所持金：'+game.money+' G';m.style.marginBottom='12px';box.appendChild(m);ORE_TYPES.filter(function(o){return game.layer2.shopTab===1?!o.worldLayer:o.worldLayer===2;}).forEach(function(type){createShopOreRow(box,type);});var c=document.createElement('button');c.textContent='閉じる';c.style.marginTop='10px';c.onclick=function(e){e.stopPropagation();closeShop();};box.appendChild(c);
};

const _l2_updateWorkshop=updateWorkshopUI;
updateWorkshopUI=function(){
    if(!game.layer2.unlocked)return _l2_updateWorkshop();var box=document.getElementById('workshopWindow');if(!box)return;box.innerHTML='';box.appendChild(createTitle('工房'));var tabs=document.createElement('div');Object.assign(tabs.style,{display:'flex',gap:'6px',marginBottom:'10px'});[['consumables','消耗品'],['equipment','探索装備']].forEach(function(x){var b=document.createElement('button');b.textContent=x[1];b.disabled=game.layer2.workshopTab===x[0];b.onclick=function(e){e.stopPropagation();game.layer2.workshopTab=x[0];updateWorkshopUI();};tabs.appendChild(b);});box.appendChild(tabs);
    if(game.layer2.workshopTab==='consumables'){CRAFT_RECIPES.forEach(function(r){if(!r.worldLayer)createCraftRecipeRow(box,r);});}else{LAYER2_EQUIPMENT_RECIPES.forEach(function(r){var row=document.createElement('div');Object.assign(row.style,{padding:'9px',marginBottom:'8px',border:'1px solid #555',borderRadius:'5px',background:'rgba(0,0,0,.17)'});var h=document.createElement('div');h.style.fontWeight='bold';h.textContent=r.name+(game.layer2.equipmentOwned[r.id]?'　【作成済み】':'');row.appendChild(h);var e=getLayer2Equipment(r.id),d=document.createElement('div');d.textContent=e.description;d.style.fontSize='12px';d.style.marginTop='4px';row.appendChild(d);var req=document.createElement('div');req.style.fontSize='11px';req.style.marginTop='5px';req.textContent='必要：'+Object.keys(r.ores).map(function(k){var o=getOreTypeById(k);return o.name+'×'+r.ores[k];}).join(' / ')+' / '+r.money+'G　（到達'+r.requiredFloor+'F）';row.appendChild(req);var b=document.createElement('button');b.textContent=game.layer2.equipmentOwned[r.id]?'作成済み':'作成';b.disabled=!layer2CanCraftEquipment(r);b.style.marginTop='6px';b.onclick=function(ev){ev.stopPropagation();craftLayer2Equipment(r.id);};row.appendChild(b);box.appendChild(row);});}
    var c=document.createElement('button');c.textContent='閉じる';c.style.marginTop='8px';c.onclick=function(e){e.stopPropagation();closeWorkshop();};box.appendChild(c);
};

// 保存・復元
const _l2_createSave=createSaveData;
createSaveData=function(){ensureLayer2DataStructures();var d=_l2_createSave();d.world.maxUnlockedLayer=game.world.maxUnlockedLayer;d.layer2=JSON.parse(JSON.stringify({unlocked:game.layer2.unlocked,currentFloor:game.layer2.currentFloor,maxReachedFloor:game.layer2.maxReachedFloor,selectedCheckpoint:game.layer2.selectedCheckpoint,checkpoints:game.layer2.checkpoints,gates:game.layer2.gates,bosses:game.layer2.bosses,storyItems:game.layer2.storyItems,equipmentOwned:game.layer2.equipmentOwned,equippedGasProtection:game.layer2.equippedGasProtection,audioInterferenceUnlocked:game.layer2.audioInterferenceUnlocked,layer3RecipeKnown:game.layer2.layer3RecipeKnown,layer3KeyCrafted:game.layer2.layer3KeyCrafted}));LAYER2_EQUIPMENT_DATA.forEach(function(e){d.inventoryItems[e.id]=game.inventory.items[e.id]||0;});return d;};
const _l2_loadGame=loadGame;
loadGame=function(){_l2_loadGame();ensureLayer2DataStructures();try{var raw=localStorage.getItem(SAVE_KEY),d=raw?JSON.parse(raw):null;if(d&&d.layer2){Object.assign(game.layer2,d.layer2);game.world.maxUnlockedLayer=Math.max(game.world.maxUnlockedLayer,game.layer2.unlocked?2:1);LAYER2_EQUIPMENT_DATA.forEach(function(e){game.inventory.items[e.id]=game.layer2.equipmentOwned[e.id]?1:0;});}}catch(e){console.error(e);}game.world.currentLayer=1;updateAllBaseWindows();updateLayer2BasePanel();};

// 第2層開放前は第2層鉱石を図鑑件数に数えない表示にするため、資料室だけ簡易フィルタ。
const _l2_discoveredOreCount=getDiscoveredOreCount;
getDiscoveredOreCount=function(){if(game.layer2&&game.layer2.unlocked)return _l2_discoveredOreCount();var c=0;ORE_TYPES.filter(function(o){return !o.worldLayer;}).forEach(function(o){if(game.records.ores[o.id]&&game.records.ores[o.id].discovered)c++;});return c;};

// 開発モードから第2層へ実際に入れる。
const _l2_devAccess=devAccessLayer;
devAccessLayer=function(level){ensureLayer2DataStructures();if(level===2&&DEV_MODE&&game.dev.allLayersUnlocked){game.layer2.unlocked=true;game.world.maxUnlockedLayer=Math.max(game.world.maxUnlockedLayer,2);game.layer2.checkpoints[1]=true;game.layer2.selectedCheckpoint=1;closeDevMenu();hideBase();game.player.hp=game.player.maxHp;clearExpeditionBag();enterLayer2Floor(1,true);addLog('【開発】第2層「旧坑道」へ直接入場しました。');return;}return _l2_devAccess(level);};

ensureLayer2DataStructures();
updateLayer2BasePanel();

// ============================================================================
// STEP 4-5 補強パッチ
// ============================================================================

// 回復地点は「80%まで回復」とする。
useLayer2HealingPoint=function(){
    var h=game.layer2.floorRuntime.healing;if(!h||!h.exists||game.player.x!==h.x||game.player.y!==h.y)return;
    var beforeHp=game.player.hp,hadStatus=game.layer2.status.corrosion>0||game.layer2.status.unease>0,cap=Math.round(game.player.maxHp*LAYER2_HEALING_CAP*100)/100;
    if(game.player.hp<cap)game.player.hp=cap;
    game.layer2.status.corrosion=0;game.layer2.status.unease=0;h.exists=false;
    addLog('旧坑道の淡い光に触れた。');
    if(game.player.hp>beforeHp)addLog('HPが'+formatHp(game.player.hp-beforeHp)+'回復した。');
    if(hadStatus)addLog('状態異常が解除された。');
    if(game.player.hp===beforeHp&&!hadStatus)addLog('身体に変化はない。');
    var guaranteed=beforeHp>=cap&&!hadStatus;
    if(guaranteed||Math.random()<LAYER2_HEALING_RESPAWN_RATE){respawnLayer2HealingPoint(false);addLog('坑道のどこかで微かな光を感じた……。');}
    render();
};

function isLayer2BossInitiallyDefeated(f){var s=game.layer2.bosses[f];return !!(s&&s.firstDefeated);}

// ボス初回撃破後は、再結晶体が残っていても階段と物語箱を塞がない。
showLayer2StairConfirm=function(){
    if(game.stairConfirmOpen)return;var f=game.layer2.currentFloor;
    if(layer2InteractionBlocked()){addLog('不穏のため階段を使用できない。 '+layer2UneaseText());return;}
    if(isLayer2GateFloor(f)&&!isLayer2GateOpen(f)){addLog('LOCKED / 制御信号OFF / 周辺区画にある制御スイッチを探してください。');return;}
    if(isLayer2BossFloor(f)&&!isLayer2BossInitiallyDefeated(f)){addLog('巨大な鉱塊が進路を塞いでいる。');return;}
    if(isLayer2BossFloor(f)&&!game.layer2.storyItems[f]){addLog('奥に未回収の記録が残されている。');return;}
    stopKeyRepeat();game.stairConfirmOpen=true;var text=document.getElementById('stairConfirmText'),button=document.querySelector('#stairConfirmOverlay .confirm-primary');
    if(f>=100){if(text)text.textContent='旧坑道の最深部です。';if(button)button.disabled=true;}
    else{if(text)text.textContent='旧坑道 '+(f+1)+'Fへ進みますか？';if(button)button.disabled=false;}
    showOverlay('stairConfirmOverlay');
};
showStairConfirm=function(){if(isLayer2Active())return showLayer2StairConfirm();return _l2_showStair();};

layer2CurrentSpecial=function(){
    var rt=game.layer2.floorRuntime,x=game.player.x,y=game.player.y;
    if(rt.healing&&rt.healing.exists&&x===rt.healing.x&&y===rt.healing.y)return 'healing';
    if(rt.switchPos&&x===rt.switchPos.x&&y===rt.switchPos.y)return 'switch';
    if(rt.storyPos&&x===rt.storyPos.x&&y===rt.storyPos.y&&isLayer2BossInitiallyDefeated(game.layer2.currentFloor)&&!game.layer2.storyItems[game.layer2.currentFloor])return 'story';
    return null;
};

// 軽量ミニマップ：100×100のDOMを毎歩生成せずCanvasへ描画する。
renderLayer2Minimap=function(){
    if(!minimapElement)return;var size=getLayer2MapSize();minimapElement.innerHTML='';minimapElement.style.display='block';minimapElement.style.width='180px';minimapElement.style.height='180px';
    var canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;canvas.style.width='180px';canvas.style.height='180px';canvas.style.imageRendering='pixelated';var ctx=canvas.getContext('2d');
    ctx.fillStyle='#0a0c0e';ctx.fillRect(0,0,size,size);
    for(var y=0;y<size;y++)for(var x=0;x<size;x++){
        if(!game.explored[y]||!game.explored[y][x])continue;
        ctx.fillStyle=game.map[y][x]==='wall'?'#34383c':'#858b91';ctx.fillRect(x,y,1,1);
    }
    if(game.returnPoint.found){ctx.fillStyle='#ffd84d';ctx.fillRect(game.returnPoint.x,game.returnPoint.y,2,2);}
    if(game.stairs.found){ctx.fillStyle='#67e667';ctx.fillRect(game.stairs.x,game.stairs.y,2,2);}
    var rt=game.layer2.floorRuntime;if(rt.healing&&rt.healing.exists&&rt.healing.found){ctx.fillStyle='#67ff9a';ctx.fillRect(rt.healing.x,rt.healing.y,2,2);}if(rt.switchPos&&rt.switchFound){ctx.fillStyle='#ffca63';ctx.fillRect(rt.switchPos.x,rt.switchPos.y,2,2);}
    ctx.fillStyle='#ffffff';ctx.fillRect(game.player.x,game.player.y,2,2);minimapElement.appendChild(canvas);
};
renderMinimap=function(){if(isLayer2Active())return renderLayer2Minimap();minimapElement.style.display='grid';minimapElement.style.width='';minimapElement.style.height='';return _l2_renderMinimap();};

// 第2層での探知機は100×100座標系に対応。
function useLayer2Detector(){
    if(game.inventory.items.detector<=0){addLog('探知機を持っていません。');return;}game.inventory.items.detector--;var cx=game.player.x,cy=game.player.y,size=getLayer2MapSize(),names=new Set();
    for(var y=Math.max(0,cy-DETECTOR_RADIUS);y<=Math.min(size-1,cy+DETECTOR_RADIUS);y++)for(var x=Math.max(0,cx-DETECTOR_RADIUS);x<=Math.min(size-1,cx+DETECTOR_RADIUS);x++)game.explored[y][x]=true;
    game.ores.forEach(function(o){if(Math.abs(o.x-cx)<=DETECTOR_RADIUS&&Math.abs(o.y-cy)<=DETECTOR_RADIUS){o.discovered=true;o.detected=true;names.add(o.name);}});
    var rt=game.layer2.floorRuntime;if(rt.retreat&&Math.abs(rt.retreat.x-cx)<=DETECTOR_RADIUS&&Math.abs(rt.retreat.y-cy)<=DETECTOR_RADIUS)game.returnPoint.found=true;if(Math.abs(rt.stairs.x-cx)<=DETECTOR_RADIUS&&Math.abs(rt.stairs.y-cy)<=DETECTOR_RADIUS)game.stairs.found=true;if(rt.healing&&Math.abs(rt.healing.x-cx)<=DETECTOR_RADIUS&&Math.abs(rt.healing.y-cy)<=DETECTOR_RADIUS)rt.healing.found=true;if(rt.switchPos&&Math.abs(rt.switchPos.x-cx)<=DETECTOR_RADIUS&&Math.abs(rt.switchPos.y-cy)<=DETECTOR_RADIUS)rt.switchFound=true;
    addLog('探知機を使用しました。');addLog('周囲15×15マスを探知しました。');if(names.size===0)addLog('この範囲に未発見の鉱物はありません。');render();layer2AfterAction({trap:false,gas:true});
}
const _l2_useDetectorBase=useDetector;
useDetector=function(){if(isLayer2Active())return useLayer2Detector();return _l2_useDetectorBase();};

// 体力強化も第2層では1行動として扱う。
const _l2_useHealthBoostBase=useHealthBoost;
useHealthBoost=function(){
    if(!isLayer2Active())return _l2_useHealthBoostBase();
    if(game.inventory.items.healthBoost<=0){addLog('体力強化を持っていません。');return;}
    game.inventory.items.healthBoost--;game.player.maxHp+=HEALTH_BOOST_AMOUNT;game.player.hp+=HEALTH_BOOST_AMOUNT;addLog('最大HPが'+HEALTH_BOOST_AMOUNT+'増加しました。');layer2AfterAction({trap:false,gas:true});
};

// 開発用全表示も100×100へ対応。
const _l2_devReveal=devRevealCurrentMap;
devRevealCurrentMap=function(){
    if(isLayer2Active()){var size=getLayer2MapSize();for(var y=0;y<size;y++)for(var x=0;x<size;x++)game.explored[y][x]=true;game.ores.forEach(function(o){o.discovered=true;});game.returnPoint.found=true;game.stairs.found=true;var rt=game.layer2.floorRuntime;if(rt.healing)rt.healing.found=true;if(rt.switchPos)rt.switchFound=true;render();return;}
    return _l2_devReveal();
};

// 資料室：第2層解放前は内容を一切漏らさない。
const _l2_renderOreArchiveBase=renderOreArchive;
renderOreArchive=function(parent){
    var heading=document.createElement('div');heading.textContent='【 通常鉱山 】';Object.assign(heading.style,{marginBottom:'8px',color:'#e1c46d',fontWeight:'bold'});parent.appendChild(heading);
    ORE_TYPES.filter(function(t){return !t.worldLayer;}).forEach(function(type){
        var record=game.records.ores[type.id],row=document.createElement('div');row.className='archive-record';if(!record||!record.discovered){row.classList.add('archive-undiscovered');row.textContent='???　未発見';parent.appendChild(row);return;}
        var title=document.createElement('div');title.textContent=type.name;title.style.color=type.color;title.style.fontWeight='bold';row.appendChild(title);var info=document.createElement('div');info.className='archive-small';info.textContent='基礎耐久：'+type.minHp+'～'+type.maxHp+'　売値：'+type.sellPrice+'G　出現：鉱山Lv'+type.unlockLevel+'～';row.appendChild(info);var st=document.createElement('div');st.className='archive-small';st.textContent='採掘成功：'+record.mined+'　累計持ち帰り：'+record.returned;row.appendChild(st);parent.appendChild(row);
    });
    if(game.layer2.unlocked){var h=document.createElement('div');h.textContent='【 旧坑道 】';Object.assign(h.style,{margin:'15px 0 8px',color:'#8ed9d0',fontWeight:'bold'});parent.appendChild(h);LAYER2_ORE_DATA.forEach(function(o){var rec=game.records.ores[o.id],row=document.createElement('div');row.className='archive-record';if(!rec||!rec.discovered){row.classList.add('archive-undiscovered');row.textContent='???　未発見';parent.appendChild(row);return;}var t=document.createElement('div');t.textContent=o.name;t.style.color=o.color;t.style.fontWeight='bold';row.appendChild(t);var inf=document.createElement('div');inf.className='archive-small';inf.textContent='基礎耐久：'+o.minHp+'～'+o.maxHp+'　売値：'+o.sellPrice+'G';row.appendChild(inf);var st=document.createElement('div');st.className='archive-small';st.textContent='採掘成功：'+rec.mined+'　累計持ち帰り：'+rec.returned;row.appendChild(st);parent.appendChild(row);});}
    else{var u=document.createElement('div');u.className='archive-record archive-undiscovered';u.textContent=game.progressFlags.layer2AnomalyDetected?'【 未確認領域 】　鉱物データなし':'【 ??? 】　データなし';parent.appendChild(u);}
};

const _l2_renderItemArchiveBase=renderItemArchive;
renderItemArchive=function(parent){
    // 通常鉱山由来だけを先に表示
    var h=document.createElement('div');h.textContent='【 通常鉱山由来 】';Object.assign(h.style,{marginBottom:'8px',color:'#e1c46d',fontWeight:'bold'});parent.appendChild(h);
    ITEM_DATA.filter(function(i){return !i.worldLayer;}).forEach(function(item){var rec=game.records.items[item.id],row=document.createElement('div');row.className='archive-record';if(!rec||!rec.discovered){row.classList.add('archive-undiscovered');row.textContent='???　未発見';parent.appendChild(row);return;}var t=document.createElement('div');t.textContent=item.name;t.style.fontWeight='bold';row.appendChild(t);var d=document.createElement('div');d.className='archive-small';d.textContent=item.description;row.appendChild(d);var c=document.createElement('div');c.className='archive-small';c.textContent='現在所持：'+(game.inventory.items[item.id]||0)+'　累計入手：'+rec.acquired;row.appendChild(c);parent.appendChild(row);});
    if(!game.layer2.unlocked)return;
    var ehead=document.createElement('div');ehead.textContent='【 旧坑道・探索装備 】';Object.assign(ehead.style,{margin:'15px 0 8px',color:'#8ed9d0',fontWeight:'bold'});parent.appendChild(ehead);
    LAYER2_EQUIPMENT_RECIPES.forEach(function(r){var e=getLayer2Equipment(r.id),row=document.createElement('div');row.className='archive-record';var t=document.createElement('div');t.textContent=e.name+(game.layer2.equipmentOwned[r.id]?'　【作成済み】':'');t.style.fontWeight='bold';row.appendChild(t);var d=document.createElement('div');d.className='archive-small';d.textContent=e.description;row.appendChild(d);var req=document.createElement('div');req.className='archive-small';req.textContent='作成：'+Object.keys(r.ores).map(function(k){return getOreTypeById(k).name+'×'+r.ores[k];}).join(' / ')+' / '+r.money+'G';row.appendChild(req);parent.appendChild(row);});
    var shead=document.createElement('div');shead.textContent='【 旧坑道・記録品 】';Object.assign(shead.style,{margin:'15px 0 8px',color:'#9dbfdd',fontWeight:'bold'});parent.appendChild(shead);
    Object.keys(LAYER2_STORY_ITEMS).forEach(function(f){var it=LAYER2_STORY_ITEMS[f],owned=!!game.layer2.storyItems[f],row=document.createElement('div');row.className='archive-record'+(owned?'':' archive-undiscovered');if(!owned){row.textContent='???　未回収';}else{var t=document.createElement('div');t.textContent=it.name;t.style.fontWeight='bold';row.appendChild(t);var d=document.createElement('div');d.className='archive-small';d.textContent=it.description;row.appendChild(d);}parent.appendChild(row);});
};

// 資料室カウンターの総数も未解放層を含めない。
const _l2_updateArchiveBase=updateArchiveUI;
updateArchiveUI=function(){
    _l2_updateArchiveBase();var box=document.getElementById('archiveWindow');if(!box)return;var buttons=box.querySelectorAll('button');var normalOreTotal=ORE_TYPES.filter(function(o){return !o.worldLayer;}).length;var normalItemTotal=ITEM_DATA.filter(function(i){return !i.worldLayer;}).length;var oreTotal=normalOreTotal+(game.layer2.unlocked?LAYER2_ORE_DATA.length:0);var itemTotal=normalItemTotal+(game.layer2.unlocked?(LAYER2_EQUIPMENT_DATA.length+Object.keys(LAYER2_STORY_ITEMS).length):0);var oreCount=0;ORE_TYPES.filter(function(o){return !o.worldLayer||(game.layer2.unlocked&&o.worldLayer===2);}).forEach(function(o){if(game.records.ores[o.id]&&game.records.ores[o.id].discovered)oreCount++;});var itemCount=0;ITEM_DATA.filter(function(i){return !i.worldLayer||(game.layer2.unlocked&&i.worldLayer===2);}).forEach(function(i){if(game.records.items[i.id]&&game.records.items[i.id].discovered)itemCount++;});buttons.forEach(function(b){if(b.textContent.indexOf('鉱物図鑑')===0)b.textContent='鉱物図鑑 '+oreCount+'/'+oreTotal;if(b.textContent.indexOf('アイテム図鑑')===0)b.textContent='アイテム図鑑 '+itemCount+'/'+itemTotal;});
    var layerLines=box.querySelectorAll('div');if(game.layer2.unlocked){layerLines.forEach(function(d){if(d.textContent==='第2層　未確認領域'||d.textContent==='???　異常反応あり')d.textContent='第2層　旧坑道';});}
};

// セーブ復元補強：元のロード処理で未登録だった第2層鉱石を後から復元する。
const _l2_loadGame2=loadGame;
loadGame=function(){
    var raw=null;try{raw=localStorage.getItem(SAVE_KEY);}catch(e){}
    _l2_loadGame2();ensureLayer2DataStructures();
    try{var d=raw?JSON.parse(raw):null;if(d&&d.warehouseOres)LAYER2_ORE_DATA.forEach(function(o){game.warehouse.ores[o.id]=getSafeAmount(d.warehouseOres[o.id],0);});if(d&&d.records&&d.records.ores)LAYER2_ORE_DATA.forEach(function(o){var r=d.records.ores[o.id]||{};game.records.ores[o.id]={discovered:Boolean(r.discovered),mined:getSafeAmount(r.mined,0),returned:getSafeAmount(r.returned,0)};});if(d&&d.records&&d.records.items)LAYER2_EQUIPMENT_DATA.forEach(function(i){var r=d.records.items[i.id]||{};game.records.items[i.id]={discovered:Boolean(r.discovered),acquired:getSafeAmount(r.acquired,0)};});}catch(e){console.error(e);}
    updateAllBaseWindows();updateLayer2BasePanel();restartLayer2TickerIfNeeded();
};

// 第2層では掲示板を少しゆっくり流し、メッセージ間隔を広げる。
const _l2_updateTickerBase=updateBaseTicker;
updateBaseTicker=function(force){_l2_updateTickerBase(force);if(game.layer2&&game.layer2.unlocked){var text=document.getElementById('baseTickerText');if(text)text.style.animation='baseTickerScroll 17s linear forwards';}};
function restartLayer2TickerIfNeeded(){if(!game.layer2||!game.layer2.unlocked)return;if(baseTickerTimer!==null)clearInterval(baseTickerTimer);baseTickerTimer=setInterval(function(){if(game.baseOpen)updateBaseTicker(false);},15000);updateBaseTicker(true);}
const _l2_attempt2=attemptLayer2Connection;
attemptLayer2Connection=function(){var was=game.layer2&&game.layer2.unlocked;var r=_l2_attempt2();if(!was&&game.layer2.unlocked)restartLayer2TickerIfNeeded();return r;};

// ボス階描画の物語記録判定を初回撃破フラグ基準にする。
renderLayer2Map=function(){
    if(!mapElement)return;var rt=game.layer2.floorRuntime,size=getLayer2MapSize(),rad=LAYER2_CAMERA_RADIUS,minX=Math.max(0,game.player.x-rad),maxX=Math.min(size-1,game.player.x+rad),minY=Math.max(0,game.player.y-rad),maxY=Math.min(size-1,game.player.y+rad),cols=maxX-minX+1;mapElement.innerHTML='';mapElement.style.gridTemplateColumns='repeat('+cols+', 1fr)';
    for(var y=minY;y<=maxY;y++)for(var x=minX;x<=maxX;x++){
        var t=document.createElement('div');t.className='tile';var explored=game.explored[y]&&game.explored[y][x];if(!explored){t.classList.add('hidden');mapElement.appendChild(t);continue;}
        if(game.map[y][x]==='wall'){t.classList.add('wall');t.textContent='■';}else{t.classList.add('floor');t.textContent='・';}
        var ore=getOreAt(x,y);if(ore&&ore.discovered){t.textContent=ore.boss?'巨':'鉱';t.style.cursor='pointer';var ty=getOreTypeById(ore.id);if(ty)t.style.color=ty.color;if(ore.boss)t.style.color='#ffcf66';t.onclick=function(o){return function(ev){ev.stopPropagation();mineOre(o);};}(ore);}
        if(rt.retreat&&game.returnPoint.found&&x===rt.retreat.x&&y===rt.retreat.y){t.textContent='帰';t.style.color='#ffd84d';t.style.fontWeight='bold';}
        if(game.stairs.found&&x===rt.stairs.x&&y===rt.stairs.y){t.textContent=isLayer2GateFloor(game.layer2.currentFloor)&&!isLayer2GateOpen(game.layer2.currentFloor)?'門':'階';t.style.color=isLayer2GateFloor(game.layer2.currentFloor)&&!isLayer2GateOpen(game.layer2.currentFloor)?'#ef6a62':'#67e667';t.style.fontWeight='bold';}
        if(rt.healing&&rt.healing.exists&&rt.healing.found&&x===rt.healing.x&&y===rt.healing.y){t.textContent='癒';t.style.color='#73ff9b';t.style.fontWeight='bold';}
        if(rt.switchPos&&rt.switchFound&&x===rt.switchPos.x&&y===rt.switchPos.y){t.textContent='制';t.style.color=isLayer2GateOpen(game.layer2.currentFloor)?'#74ff8a':'#ffca63';t.style.fontWeight='bold';}
        if(rt.storyPos&&isLayer2BossInitiallyDefeated(game.layer2.currentFloor)&&!game.layer2.storyItems[game.layer2.currentFloor]&&x===rt.storyPos.x&&y===rt.storyPos.y){t.textContent='記';t.style.color='#9bd5ff';t.style.fontWeight='bold';}
        if(x===game.player.x&&y===game.player.y){t.classList.add('player');if(!ore)t.textContent='●';}
        mapElement.appendChild(t);
    }
};
renderMap=function(){if(isLayer2Active())return renderLayer2Map();return _l2_renderMap();};

// 旧坑道解放済みセーブを読み込んだ場合の表示更新。
ensureLayer2DataStructures();
if(game.layer2.unlocked)restartLayer2TickerIfNeeded();
updateLayer2BasePanel();

// ============================================================================
// STEP 4-5 最終調整
// ============================================================================

// 開放済みの9F系ゲートでは、使用済みスイッチを再配置しない。
const _l2_enterFloorFinal=enterLayer2Floor;
enterLayer2Floor=function(floor,fromCheckpoint){
    _l2_enterFloorFinal(floor,fromCheckpoint);
    if(isLayer2GateFloor(floor)&&isLayer2GateOpen(floor)){
        game.layer2.floorRuntime.switchPos=null;
        game.layer2.floorRuntime.switchFound=false;
        render();
    }
};

// 鉱石は部屋内で小さな塊になりやすい配置へ。
generateLayer2Ores=function(floor,rooms){
    var used=new Set(),nodes=[];
    rooms.forEach(function(r){
        var area=r.w*r.h,clusters=area>=90?randomInt(2,3):randomInt(1,2);
        for(var c=0;c<clusters;c++){
            var sx=randomInt(r.x+1,r.x+r.w-2),sy=randomInt(r.y+1,r.y+r.h-2),count=randomInt(2,5);
            for(var i=0;i<count;i++){
                var x=Math.max(r.x+1,Math.min(r.x+r.w-2,sx+randomInt(-2,2))),y=Math.max(r.y+1,Math.min(r.y+r.h-2,sy+randomInt(-2,2))),k=x+','+y;
                if(used.has(k))continue;if((x===game.player.x&&y===game.player.y)||(x===game.stairs.x&&y===game.stairs.y)||(game.returnPoint&&x===game.returnPoint.x&&y===game.returnPoint.y))continue;used.add(k);nodes.push({x:x,y:y});
            }
        }
    });
    shuffle(nodes);var cap=Math.min(nodes.length,randomInt(30,44));
    for(var n=0;n<cap;n++){var p=nodes[n],t=layer2WeightedOre(floor),hp=randomInt(t.minHp,t.maxHp);game.ores.push({x:p.x,y:p.y,id:t.id,name:t.name,level:floor,hp:hp,maxHp:hp,discovered:false,inspected:false,detected:false,worldLayer:2});}
};

// クリック操作も第1層同様に使えるようにする。
renderLayer2Map=function(){
    if(!mapElement)return;var rt=game.layer2.floorRuntime,size=getLayer2MapSize(),rad=LAYER2_CAMERA_RADIUS,minX=Math.max(0,game.player.x-rad),maxX=Math.min(size-1,game.player.x+rad),minY=Math.max(0,game.player.y-rad),maxY=Math.min(size-1,game.player.y+rad),cols=maxX-minX+1;mapElement.innerHTML='';mapElement.style.gridTemplateColumns='repeat('+cols+', 1fr)';
    for(var y=minY;y<=maxY;y++)for(var x=minX;x<=maxX;x++){
        var t=document.createElement('div');t.className='tile';var explored=game.explored[y]&&game.explored[y][x];if(!explored){t.classList.add('hidden');mapElement.appendChild(t);continue;}
        if(game.map[y][x]==='wall'){t.classList.add('wall');t.textContent='■';}else{t.classList.add('floor');t.textContent='・';}
        var isHere=x===game.player.x&&y===game.player.y,ore=getOreAt(x,y);
        if(ore&&ore.discovered){t.textContent=ore.boss?'巨':'鉱';t.style.cursor='pointer';var ty=getOreTypeById(ore.id);if(ty)t.style.color=ty.color;if(ore.boss)t.style.color='#ffcf66';t.onclick=function(o){return function(ev){ev.stopPropagation();mineOre(o);};}(ore);}
        if(rt.retreat&&game.returnPoint.found&&x===rt.retreat.x&&y===rt.retreat.y){t.textContent='帰';t.style.color='#ffd84d';t.style.fontWeight='bold';if(isHere){t.style.cursor='pointer';t.onclick=function(ev){ev.stopPropagation();if(layer2InteractionBlocked())addLog('不穏のため帰還操作ができない。 '+layer2UneaseText());else showReturnConfirm();};}}
        if(game.stairs.found&&x===rt.stairs.x&&y===rt.stairs.y){t.textContent=isLayer2GateFloor(game.layer2.currentFloor)&&!isLayer2GateOpen(game.layer2.currentFloor)?'門':'階';t.style.color=isLayer2GateFloor(game.layer2.currentFloor)&&!isLayer2GateOpen(game.layer2.currentFloor)?'#ef6a62':'#67e667';t.style.fontWeight='bold';if(isHere){t.style.cursor='pointer';t.onclick=function(ev){ev.stopPropagation();showLayer2StairConfirm();};}}
        if(rt.healing&&rt.healing.exists&&rt.healing.found&&x===rt.healing.x&&y===rt.healing.y){t.textContent='癒';t.style.color='#73ff9b';t.style.fontWeight='bold';if(isHere){t.style.cursor='pointer';t.onclick=function(ev){ev.stopPropagation();useLayer2HealingPoint();};}}
        if(rt.switchPos&&rt.switchFound&&x===rt.switchPos.x&&y===rt.switchPos.y){t.textContent='制';t.style.color=isLayer2GateOpen(game.layer2.currentFloor)?'#74ff8a':'#ffca63';t.style.fontWeight='bold';if(isHere){t.style.cursor='pointer';t.onclick=function(ev){ev.stopPropagation();operateLayer2Switch();};}}
        if(rt.storyPos&&isLayer2BossInitiallyDefeated(game.layer2.currentFloor)&&!game.layer2.storyItems[game.layer2.currentFloor]&&x===rt.storyPos.x&&y===rt.storyPos.y){t.textContent='箱';t.style.color='#9bd5ff';t.style.fontWeight='bold';if(isHere){t.style.cursor='pointer';t.onclick=function(ev){ev.stopPropagation();collectLayer2StoryItem();};}}
        if(isHere){t.classList.add('player');if(!ore&&t.textContent==='・')t.textContent='●';}
        mapElement.appendChild(t);
    }
};
renderMap=function(){if(isLayer2Active())return renderLayer2Map();return _l2_renderMap();};

// 第2層解放後のインベントリボタンを操作しやすい位置へ。
function applyLayer2InventoryButtonPosition(){var b=document.getElementById('inventoryButton');if(!b||!game.layer2||!game.layer2.unlocked)return;Object.assign(b.style,{position:'fixed',right:'18px',bottom:'18px',zIndex:'9000',minWidth:'128px',minHeight:'38px',fontWeight:'bold'});}
const _l2_updateInventoryPos=updateInventoryUI;
updateInventoryUI=function(){var r=_l2_updateInventoryPos();applyLayer2InventoryButtonPosition();return r;};
applyLayer2InventoryButtonPosition();

// ============================================================================
// STEP 4-5 DEV追加：任意階層ワープ
// ----------------------------------------------------------------------------
// 開発タブから任意の層・階層へ直接移動するためのテスト機能。
// ・第1層：通常鉱山 Lv1～100
// ・第2層：旧坑道 1F～100F
// ・第3～5層：未実装のため従来どおり演出確認のみ
// 通常の解放条件やチェックポイント進行とは独立したDEV専用移動。
// ============================================================================

function devWarpToFloor(layer, floor) {

    if (!DEV_MODE) {
        return;
    }

    layer = Number(layer);
    floor = Number(floor);

    if (!Number.isFinite(layer) || !Number.isFinite(floor)) {
        addLog("【開発】層と階層を正しく入力してください。");
        return;
    }

    layer = Math.floor(layer);
    floor = Math.floor(floor);

    if (layer < 1 || layer > MAX_WORLD_LAYER) {
        addLog("【開発】層は1～" + MAX_WORLD_LAYER + "で指定してください。");
        return;
    }

    // 第1層：通常鉱山 Lv1～100へ強制入場
    if (layer === 1) {

        floor = Math.max(1, Math.min(MAX_MINE_LEVEL, floor));

        // DEVワープは通常の解放条件を無視するが、
        // 通常UIで不整合が出ないよう最大解放Lvだけ引き上げる。
        game.maxUnlockedMineLevel =
            Math.max(
                game.maxUnlockedMineLevel,
                floor
            );

        game.world.currentLayer = 1;
        game.currentMineLevel = floor;
        game.selectedMineLevel = floor;

        game.player.hp = game.player.maxHp;
        game.dead = false;
        game.mining = false;
        game.pendingDangerOre = null;

        clearExpeditionBag();
        closeDevMenu();
        hideBase();

        generateMineFloor();

        addLog(
            "【開発ワープ】第1層「通常鉱山」Lv" +
            floor +
            "へ移動しました。"
        );

        updateStatusUI();
        return;
    }

    // 第2層：旧坑道 1F～100Fへ強制入場
    if (layer === 2) {

        ensureLayer2DataStructures();

        floor = Math.max(1, Math.min(100, floor));

        // DEVワープで到達したこと自体はテスト用に記録する。
        // ただし通常の9F系スイッチやボス討伐などは自動解除しない。
        game.layer2.unlocked = true;
        game.world.maxUnlockedLayer =
            Math.max(
                game.world.maxUnlockedLayer,
                2
            );

        game.layer2.maxReachedFloor =
            Math.max(
                game.layer2.maxReachedFloor || 1,
                floor
            );

        game.player.hp = game.player.maxHp;
        game.dead = false;
        game.mining = false;
        game.pendingDangerOre = null;

        clearExpeditionBag();
        closeDevMenu();
        hideBase();

        enterLayer2Floor(
            floor,
            true
        );

        addLog(
            "【開発ワープ】第2層「旧坑道」" +
            floor +
            "Fへ移動しました。"
        );

        updateStatusUI();
        return;
    }

    // 第3～5層はまだ実マップ未実装。
    addLog(
        "【開発】第" +
        layer +
        "層は現在未実装です。演出確認のみ行います。"
    );

    devAccessLayer(layer);
}


// ========================================
// DEVワープUIを開発画面へ追加
// ========================================

function appendDevWarpPanel() {

    if (!DEV_MODE) {
        return;
    }

    const box =
        document.getElementById(
            "devWindow"
        );

    if (!box) {
        return;
    }

    if (
        document.getElementById(
            "devWarpPanel"
        )
    ) {
        return;
    }

    const panel =
        document.createElement(
            "div"
        );

    panel.id = "devWarpPanel";
    panel.className = "dev-panel";


    const title =
        document.createElement(
            "div"
        );

    title.textContent =
        "【 任意階層ワープ 】";

    title.style.fontWeight =
        "bold";

    title.style.marginBottom =
        "8px";

    panel.appendChild(title);


    const guide =
        document.createElement(
            "div"
        );

    guide.textContent =
        "第1層＝鉱山Lv / 第2層＝旧坑道F。DEV専用で解放条件を無視します。";

    Object.assign(
        guide.style,
        {
            marginBottom: "8px",
            color: "#aeb6bd",
            fontSize: "11px",
            lineHeight: "1.45"
        }
    );

    panel.appendChild(guide);


    const controls =
        document.createElement(
            "div"
        );

    Object.assign(
        controls.style,
        {
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "7px"
        }
    );


    const layerLabel =
        document.createElement(
            "span"
        );

    layerLabel.textContent =
        "層";

    controls.appendChild(layerLabel);


    const layerSelect =
        document.createElement(
            "select"
        );

    layerSelect.id =
        "devWarpLayerSelect";

    for (
        let layer = 1;
        layer <= MAX_WORLD_LAYER;
        layer++
    ) {

        const data =
            getWorldLayerData(layer);

        const option =
            document.createElement(
                "option"
            );

        option.value =
            String(layer);

        option.textContent =
            "第" +
            layer +
            "層 " +
            (data ? data.name : "");

        if (
            layer ===
            game.world.currentLayer
        ) {
            option.selected = true;
        }

        layerSelect.appendChild(option);
    }

    Object.assign(
        layerSelect.style,
        {
            minHeight: "31px",
            padding: "4px 7px",
            color: "#e9edf1",
            background: "#24292e",
            border: "1px solid #5b636b",
            borderRadius: "4px"
        }
    );

    controls.appendChild(layerSelect);


    const floorLabel =
        document.createElement(
            "span"
        );

    floorLabel.textContent =
        "階層";

    controls.appendChild(floorLabel);


    const floorInput =
        document.createElement(
            "input"
        );

    floorInput.id =
        "devWarpFloorInput";

    floorInput.type =
        "number";

    floorInput.min = "1";
    floorInput.max = "100";
    floorInput.step = "1";

    if (
        game.world.currentLayer === 2 &&
        game.layer2
    ) {
        floorInput.value =
            String(
                game.layer2.currentFloor || 1
            );
    } else {
        floorInput.value =
            String(
                game.currentMineLevel || 1
            );
    }

    Object.assign(
        floorInput.style,
        {
            width: "74px",
            minHeight: "31px",
            padding: "4px 7px",
            color: "#e9edf1",
            background: "#1b1f23",
            border: "1px solid #5b636b",
            borderRadius: "4px"
        }
    );

    controls.appendChild(floorInput);


    const warpButton =
        document.createElement(
            "button"
        );

    warpButton.textContent =
        "移動";

    warpButton.onclick =
        function(event) {

            event.stopPropagation();

            devWarpToFloor(
                layerSelect.value,
                floorInput.value
            );
        };

    controls.appendChild(warpButton);


    layerSelect.onchange =
        function() {

            const layer =
                Number(
                    layerSelect.value
                );

            floorInput.disabled =
                layer >= 3;

            if (layer === 1) {
                floorInput.min = "1";
                floorInput.max =
                    String(MAX_MINE_LEVEL);
            }

            if (layer === 2) {
                floorInput.min = "1";
                floorInput.max = "100";
            }
        };


    layerSelect.dispatchEvent(
        new Event("change")
    );

    panel.appendChild(controls);


    // 「閉じる」ボタンの直前へ差し込む。
    const closeButton =
        Array.from(
            box.querySelectorAll("button")
        ).find(
            function(button) {
                return button.textContent === "閉じる";
            }
        );

    if (closeButton) {
        box.insertBefore(
            panel,
            closeButton
        );
    } else {
        box.appendChild(panel);
    }
}


// 既存の開発画面更新後にDEVワープ欄を追加する。
const _step45_updateDevUI =
    updateDevUI;

updateDevUI =
    function() {

        _step45_updateDevUI();
        appendDevWarpPanel();
    };



// ============================================================================
// STEP 4-6 : 第3～5層 初期実装
// ============================================================================

// ---------------------------------------------------------------------------
// 共通ヘルパー
// ---------------------------------------------------------------------------
function deepCloneSimple(v){ return JSON.parse(JSON.stringify(v)); }
function makeGrid(size,fill){ var a=[]; for(var y=0;y<size;y++){a[y]=[];for(var x=0;x<size;x++)a[y][x]=fill;}return a; }
function floorTiles(map){var r=[];for(var y=1;y<map.length-1;y++)for(var x=1;x<map.length-1;x++)if(map[y][x]==='floor')r.push({x:x,y:y});return r;}
function keyXY(p){return p.x+','+p.y;}
function carveRect(map,x,y,w,h){for(var yy=y;yy<y+h;yy++)for(var xx=x;xx<x+w;xx++)if(map[yy]&&map[yy][xx]!==undefined)map[yy][xx]='floor';}
function carveCorridor(map,a,b){var x=a.x,y=a.y;while(x!==b.x){map[y][x]='floor';x+=x<b.x?1:-1;}while(y!==b.y){map[y][x]='floor';y+=y<b.y?1:-1;}map[y][x]='floor';}
function buildRoomMap(size,roomMin,roomMax){
    var map=makeGrid(size,'wall'),rooms=[],target=randomInt(roomMin,roomMax),attempt=0;
    while(rooms.length<target&&attempt<1000){attempt++;var w=randomInt(6,14),h=randomInt(5,12),x=randomInt(2,size-w-3),y=randomInt(2,size-h-3);var ok=rooms.every(function(r){return x+w+2<r.x||r.x+r.w+2<x||y+h+2<r.y||r.y+r.h+2<y;});if(!ok)continue;carveRect(map,x,y,w,h);rooms.push({x:x,y:y,w:w,h:h,cx:Math.floor(x+w/2),cy:Math.floor(y+h/2)});}
    if(rooms.length<2){carveRect(map,2,2,10,8);carveRect(map,size-13,size-11,10,8);rooms=[{x:2,y:2,w:10,h:8,cx:7,cy:6},{x:size-13,y:size-11,w:10,h:8,cx:size-8,cy:size-7}];}
    for(var i=1;i<rooms.length;i++)carveCorridor(map,{x:rooms[i-1].cx,y:rooms[i-1].cy},{x:rooms[i].cx,y:rooms[i].cy});
    for(var e=0;e<Math.max(3,Math.floor(rooms.length/3));e++){var a=rooms[randomInt(0,rooms.length-1)],b=rooms[randomInt(0,rooms.length-1)];if(a!==b)carveCorridor(map,{x:a.cx,y:a.cy},{x:b.cx,y:b.cy});}
    return {map:map,rooms:rooms};
}
function bfsDistances(map,start){var q=[start],d={};d[keyXY(start)]=0;for(var qi=0;qi<q.length;qi++){var p=q[qi],dd=d[keyXY(p)],ns=[[1,0],[-1,0],[0,1],[0,-1]];for(var i=0;i<ns.length;i++){var n={x:p.x+ns[i][0],y:p.y+ns[i][1]},k=keyXY(n);if(n.y<0||n.y>=map.length||n.x<0||n.x>=map.length||map[n.y][n.x]==='wall'||d[k]!==undefined)continue;d[k]=dd+1;q.push(n);}}return d;}
function farthestFloor(map,start,avoidNear){var d=bfsDistances(map,start),best=start,bd=-1;Object.keys(d).forEach(function(k){var s=k.split(','),p={x:+s[0],y:+s[1]};if(avoidNear&&d[k]<avoidNear)return;if(d[k]>bd){bd=d[k];best=p;}});return best;}
function randomFloorFar(map,start,minDist){var d=bfsDistances(map,start),a=[];Object.keys(d).forEach(function(k){if(d[k]>=(minDist||0)){var s=k.split(',');a.push({x:+s[0],y:+s[1]});}});return a.length?a[randomInt(0,a.length-1)]:start;}
function setAllExplored(map,val){var e=[];for(var y=0;y<map.length;y++){e[y]=[];for(var x=0;x<map.length;x++)e[y][x]=val;}return e;}
function isLaterLayerActive(){return game.world.currentLayer>=3&&game.world.currentLayer<=5;}
function addPermanentOreType(o){
    if(!ORE_TYPES.some(function(x){return x.id===o.id;}))ORE_TYPES.push(o);
    if(game.expeditionBag[o.id]===undefined)game.expeditionBag[o.id]=0;
    if(game.warehouse.ores[o.id]===undefined)game.warehouse.ores[o.id]=0;
    if(!game.records.ores[o.id])game.records.ores[o.id]={discovered:false,mined:0,returned:0};
}
function addPermanentItemData(i){
    if(!ITEM_DATA.some(function(x){return x.id===i.id;}))ITEM_DATA.push(i);
    if(game.inventory.items[i.id]===undefined)game.inventory.items[i.id]=0;
    if(!game.records.items[i.id])game.records.items[i.id]={discovered:false,acquired:0};
}
function discoverPermanentItem(id){if(!game.records.items[id])game.records.items[id]={discovered:false,acquired:0};game.records.items[id].discovered=true;game.records.items[id].acquired=Math.max(1,game.records.items[id].acquired||0);}
function damageLaterLayer(amount,text){amount=Math.max(0,amount);game.player.hp=Math.max(0,Math.round((game.player.hp-amount)*100)/100);if(text)addLog(text+'（-'+formatHp(amount)+' HP）');if(game.player.hp<=0){game.dead=true;game.player.hp=0;render();setTimeout(handleDeath,350);return true;}return false;}

// ---------------------------------------------------------------------------
// 第3層：無風回廊
// ---------------------------------------------------------------------------
const LAYER3_SIZE=150;
const LAYER3_CAMERA_RADIUS=10;
const LAYER3_MAX_FLOOR=10;
const LAYER3_WIND_RATES=[0,0.030,0.035,0.040,0.045,0.050,0.055,0.060,0.065,0.070,0.080];
const LAYER3_FAKE_RATES=[0,0.03,0.05,0.07,0.10,0.13,0.16,0.20,0.24,0.28,0.32];
const LAYER3_BOSS_COUNTS=[0,3,4,5,6,7,8,9,10,12,15];
const LAYER3_BOSS_HP=[0,20000,28000,38000,50000,65000,85000,110000,145000,190000,250000];
const LAYER3_STORY=[null,
 {id:'noWindSheet',name:'無風観測票',description:'風が存在しないはずの場所で、複数の「風イベント」が記録されている。'},
 {id:'boundaryMeasure',name:'境界測定片',description:'境界測定値に、物理的には成立しない数値が混ざっている。'},
 {id:'responseRecord',name:'反応記録紙',description:'外部刺激に対する反応記録。対象名だけが消されている。'},
 {id:'callRecord',name:'欠損した呼出記録',description:'同一対象への呼びかけが繰り返され、応答欄の大半が空白になっている。'},
 {id:'syncData',name:'同期観測データ',description:'無関係な二地点の変化が、ほぼ同時に発生している。'},
 {id:'externalInterference',name:'外部干渉ログ',description:'回廊の外から来たとしか考えられない信号。発信源は「外部」とだけ記録されている。'},
 {id:'connectionTest',name:'接続試験記録',description:'接続実験の記録。接続先は欠落しているが、成功結果だけが残る。'},
 {id:'identityFragment',name:'識別照合片',description:'複数の識別情報を照合した断片。その一つだけ妙な既視感を覚える。'},
 {id:'boundaryCrossing',name:'境界越境報告',description:'対象が一時的に境界外へ出たという報告。直後の記録は欠落している。'},
 {id:'afterglowCoords',name:'残光座標記録',description:'回廊の外側にある別領域の座標。値は不安定だが、微かな光が継続している。'}
];
const LAYER3_ORES=[
 {id:'breezeShard',name:'微風のかけら',unlockLevel:1,minHp:6000,maxHp:6000,sellPrice:18000,weight:50,color:'#c6f8ff',worldLayer:3},
 {id:'windCrystal',name:'風の結晶',unlockLevel:1,minHp:18000,maxHp:18000,sellPrice:60000,weight:50,color:'#9ee7ff',worldLayer:3}
];
LAYER3_ORES.forEach(addPermanentOreType);
[
 {id:'windGuideLamp',name:'導風灯',description:'微風のかけらを1個消費し、一定歩数の間、ボス区画のおおよその方向を示す。',worldLayer:3},
 {id:'phaseRadar',name:'位相探知レーダー',description:'無風回廊の偽鉱石・偽宝箱を識別する。',worldLayer:3},
 {id:'boundaryAnchor',name:'境界留め',description:'回廊外追放を4回まで防ぐ。',worldLayer:3}
].forEach(addPermanentItemData);

function ensureLayer3(){
    if(!game.layer3)game.layer3={};var l=game.layer3;
    if(l.unlocked===undefined)l.unlocked=false;if(!l.currentFloor)l.currentFloor=1;if(!l.maxReachedFloor)l.maxReachedFloor=1;
    if(!l.checkpoints)l.checkpoints={1:true};if(!l.storyItems)l.storyItems={};if(!l.bosses)l.bosses={};
    if(!l.equipmentOwned)l.equipmentOwned={windGuideLamp:false,phaseRadar:false,boundaryAnchor:false};
    if(l.anchorCharges===undefined)l.anchorCharges=0;if(l.layer4KeyCrafted===undefined)l.layer4KeyCrafted=false;
    if(!l.temp)l.temp={tailwind:0,headwind:0,mapOff:0,chaos:0,warmShield:0,familiar:0,invincible:0,goodAmp:0,badReduce:0,bothAmp:0,guide:0};
    if(!l.runtime)l.runtime={};
}
function layer3OreChance(f){var a=[[98,2],[96,4],[93,7],[89,11],[84,16],[78,22],[70,30],[60,40],[50,50],[40,60]][f-1];return Math.random()*100<a[0]?LAYER3_ORES[0]:LAYER3_ORES[1];}
function layer3BossState(f){ensureLayer3();if(!game.layer3.bosses[f])game.layer3.bosses[f]={firstDefeated:false,hps:[]};var s=game.layer3.bosses[f],cnt=LAYER3_BOSS_COUNTS[f],hp=s.firstDefeated?Math.ceil(LAYER3_BOSS_HP[f]*0.10):LAYER3_BOSS_HP[f];if(s.hps.length!==cnt)s.hps=Array(cnt).fill(hp);return s;}
function generateLayer3Map(f){
    var built=buildRoomMap(LAYER3_SIZE,18,24),map=built.map,rooms=built.rooms,start={x:rooms[0].cx,y:rooms[0].cy},bossRoom=rooms[rooms.length-1];
    var stairs={x:bossRoom.cx,y:bossRoom.cy},d=bfsDistances(map,start);if(d[keyXY(stairs)]===undefined)carveCorridor(map,start,stairs);
    var escape=null;if(f>=6)escape=randomFloorFar(map,start,20);
    return {map:map,rooms:rooms,start:start,stairs:stairs,escape:escape,bossCenter:stairs};
}
function enterLayer3Floor(f){ensureLayer3();f=Math.max(1,Math.min(10,Math.floor(f)));game.world.currentLayer=3;game.layer3.currentFloor=f;game.layer3.maxReachedFloor=Math.max(game.layer3.maxReachedFloor,f);if(f>=2)game.layer3.checkpoints[f]=true;game.dead=false;game.mining=false;game.layer3.temp={tailwind:0,headwind:0,mapOff:0,chaos:0,warmShield:0,familiar:0,invincible:0,goodAmp:0,badReduce:0,bothAmp:0,guide:0};
    var b=generateLayer3Map(f);game.map=b.map;game.explored=makeGrid(LAYER3_SIZE,true);game.player.x=b.start.x;game.player.y=b.start.y;game.stairs={x:b.stairs.x,y:b.stairs.y,found:true};game.returnPoint=b.escape?{x:b.escape.x,y:b.escape.y,found:true}:{x:0,y:0,found:false};game.ores=[];
    var fakeRate=LAYER3_FAKE_RATES[f];for(var i=0;i<randomInt(24,34);i++){var p=randomFloorFar(game.map,b.start,8),t=layer3OreChance(f),fake=Math.random()<fakeRate;game.ores.push({x:p.x,y:p.y,id:t.id,name:t.name,level:f,hp:t.minHp,maxHp:t.minHp,discovered:true,inspected:false,worldLayer:3,fake:fake});}
    var bs=layer3BossState(f),center=b.bossCenter;for(var j=0;j<bs.hps.length;j++){var ang=(Math.PI*2*j)/bs.hps.length,rr=3+Math.floor(j/6),x=Math.max(1,Math.min(LAYER3_SIZE-2,center.x+Math.round(Math.cos(ang)*rr))),y=Math.max(1,Math.min(LAYER3_SIZE-2,center.y+Math.round(Math.sin(ang)*rr)));game.map[y][x]='floor';game.ores.push({x:x,y:y,id:'layer3Boss',name:bs.firstDefeated?'弱体化した結晶群':'回廊結晶群',level:f,hp:bs.hps[j],maxHp:bs.firstDefeated?Math.ceil(LAYER3_BOSS_HP[f]*0.10):LAYER3_BOSS_HP[f],discovered:true,inspected:true,boss:true,bossIndex:j,worldLayer:3});}
    game.layer3.runtime={size:LAYER3_SIZE,start:b.start,stairs:b.stairs,escape:b.escape,bossCenter:center,recovery:[],storyAvailable:false};
    for(var r=0;r<2;r++){var rp=randomFloorFar(game.map,b.start,15);game.layer3.runtime.recovery.push({x:rp.x,y:rp.y,exists:true});}
    render();addLog('第3層「無風回廊」 '+f+'Fへ入場しました。');if(f>=6)addLog('強風域：帰還の羽はボス区画以外では使用できません。');
}
function isLayer3BossRoom(){if(game.world.currentLayer!==3)return false;var c=game.layer3.runtime.bossCenter;return c&&Math.abs(game.player.x-c.x)<=8&&Math.abs(game.player.y-c.y)<=8;}
function tickLayer3Temp(){var t=game.layer3.temp;['tailwind','headwind','mapOff','chaos','familiar','invincible','guide'].forEach(function(k){if(t[k]>0)t[k]--;});}
function triggerLayer3Wind(){
    var f=game.layer3.currentFloor;if(Math.random()>=LAYER3_WIND_RATES[f])return;
    if(game.layer3.temp.warmShield>0){game.layer3.temp.warmShield=0;addLog('暖かい風の余韻が虚風を打ち消した。');return;}
    var r=Math.random();
    if(r<0.20){game.layer3.temp.mapOff=Math.max(game.layer3.temp.mapOff,randomInt(25,45));addLog('虚風：ミニマップ情報が途切れた。');}
    else if(r<0.38){game.layer3.temp.headwind=Math.max(game.layer3.temp.headwind,randomInt(20,35));addLog('逆風：導風灯の光が弱まった。');}
    else if(r<0.55){game.layer3.temp.chaos=Math.max(game.layer3.temp.chaos,randomInt(15,25));addLog('混沌の風：移動感覚が反転した。');}
    else if(r<0.698){game.layer3.temp.headwind=Math.max(game.layer3.temp.headwind,randomInt(20,35));addLog('重い逆風が身体を押し戻す。');}
    else if(r<0.700){if(game.layer3.anchorCharges>0){game.layer3.anchorCharges--;addLog('境界留めが回廊外追放を防いだ。残り'+game.layer3.anchorCharges+'回');}else{addLog('回廊の外側へ弾き出された。');game.dead=true;setTimeout(handleDeath,250);}}
    else if(r<0.80){game.layer3.temp.chaos=0;game.layer3.temp.headwind=0;game.layer3.temp.mapOff=0;game.layer3.temp.warmShield=1;addLog('暖かい風：悪い風が消え、次の虚風を一度防ぐ。');}
    else if(r<0.89){game.layer3.temp.familiar=Math.max(game.layer3.temp.familiar,randomInt(10,18));addLog('懐かしいにおい：危険な気配が分かる。');}
    else if(r<0.96){game.layer3.temp.tailwind=Math.max(game.layer3.temp.tailwind,randomInt(10,18));addLog('追風：導風灯の光が強くなった。');}
    else {game.layer3.temp.invincible=Math.max(game.layer3.temp.invincible,randomInt(2,4));addLog('無敵の風：周囲の通常鉱石が砕け散る。');collectLayer3NearbyOres();}
}
function collectLayer3NearbyOres(){var rem=[];game.ores.forEach(function(o){if(!o.boss&&Math.abs(o.x-game.player.x)<=1&&Math.abs(o.y-game.player.y)<=1&&!o.fake){addOreAmountToExpeditionBag(o.id,1);recordOreMined(o.id,1);addLog(o.name+'を風が回収した。');}else rem.push(o);});game.ores=rem;}
function moveLayer3(dx,dy){if(game.dead||game.baseOpen||game.inventoryOpen||game.mining)return;ensureLayer3();if(game.layer3.temp.chaos>0){dx=-dx;dy=-dy;}var nx=game.player.x+dx,ny=game.player.y+dy;if(nx<0||ny<0||nx>=LAYER3_SIZE||ny>=LAYER3_SIZE||game.map[ny][nx]==='wall')return;game.player.x=nx;game.player.y=ny;tickLayer3Temp();triggerLayer3Wind();if(game.dead)return;checkLayer3Tile();render();}
function checkLayer3Tile(){var rt=game.layer3.runtime;for(var i=0;i<rt.recovery.length;i++){var p=rt.recovery[i];if(p.exists&&p.x===game.player.x&&p.y===game.player.y){var cap=game.player.maxHp*0.5;if(game.player.hp<cap)game.player.hp=cap;p.exists=false;addLog('【静止点】HPが50%まで回復した。状態異常が解除された。');if(Math.random()<0.25){var np=randomFloorFar(game.map,rt.start,10);rt.recovery.push({x:np.x,y:np.y,exists:true});addLog('回廊のどこかで、風が途切れた……。');}}}
    if(rt.escape&&rt.escape.x===game.player.x&&rt.escape.y===game.player.y)showReturnConfirm();
    if(rt.stairs.x===game.player.x&&rt.stairs.y===game.player.y){if(!layer3BossCleared(game.layer3.currentFloor)){addLog('結晶群が出口を塞いでいる。');}else showStairConfirm();}
}
function layer3BossCleared(f){return !game.ores.some(function(o){return o.worldLayer===3&&o.boss;});}
function mineLayer3(ore){if(!ore||!ore.discovered||game.mining)return;if(ore.fake&&game.layer3.equipmentOwned.phaseRadar)addLog('異常反応を確認……。この鉱石は通常の構造と一致しない。');game.mining=true;var power=getMiningPower(game.pickaxe.level),cost=MINING_HP_COST*(game.layer3.temp.headwind>0?5:1);if(damageLaterLayer(cost,'採掘で体力を消耗した。')){game.mining=false;return;}if(devInfiniteMining_STEP413())ore.hp=0;else ore.hp-=power;if(ore.hp<0)ore.hp=0;addLog(ore.name+'　耐久 '+ore.hp+'/'+ore.maxHp+'　(-'+(devInfiniteMining_STEP413()?'∞':power)+')');if(ore.hp<=0){var idx=game.ores.indexOf(ore);if(idx>=0)game.ores.splice(idx,1);if(ore.boss){var s=layer3BossState(game.layer3.currentFloor);s.hps[ore.bossIndex]=0;if(layer3BossCleared(game.layer3.currentFloor)){s.firstDefeated=true;grantLayer3Story(game.layer3.currentFloor);addLog('回廊結晶群が崩壊した。階段への道が開いた。');}}else if(ore.fake){damageLaterLayer(game.player.maxHp*(0.25+Math.random()*0.15),'偽鉱石が爆発した。');}else{addOreAmountToExpeditionBag(ore.id,1);recordOreMined(ore.id,1);addLog(ore.name+'を1個入手しました。');}}triggerLayer3Wind();render();setTimeout(function(){game.mining=false;},120);}
function grantLayer3Story(f){if(game.layer3.storyItems[f])return;var it=LAYER3_STORY[f];game.layer3.storyItems[f]=true;discoverPermanentItem(it.id);addLog('シナリオ品「'+it.name+'」を回収した。');if(f===10)addLog('残光を示す座標が、次の接続先を指している。');}
function useWindGuideLamp(){ensureLayer3();if(!game.layer3.equipmentOwned.windGuideLamp){addLog('導風灯を所持していません。');return;}if((game.expeditionBag.breezeShard||0)<=0){addLog('微風のかけらがありません。');return;}game.expeditionBag.breezeShard--;var n=25;if(game.layer3.temp.tailwind>0)n=Math.ceil(n*1.75);if(game.layer3.temp.headwind>0)n=Math.max(5,Math.floor(n*0.6));game.layer3.temp.guide=n;addLog('導風灯を使用した。微風のかけら 残り：'+game.expeditionBag.breezeShard);}

// ---------------------------------------------------------------------------
// 第4層：残光遺跡
// ---------------------------------------------------------------------------
const LAYER4_SIZE=50;
const LAYER4_CAMERA_RADIUS=10;
const LAYER4_MAX_FLOOR=20;
const LAYER4_ORES=[
 {id:'afterglowStone',name:'残光石',unlockLevel:1,minHp:8000,maxHp:8000,sellPrice:25000,weight:50,color:'#ffe6a2',worldLayer:4},
 {id:'twilightCrystal',name:'薄明晶',unlockLevel:1,minHp:16000,maxHp:16000,sellPrice:60000,weight:40,color:'#d7d0ff',worldLayer:4},
 {id:'duskOre',name:'暮光鉱',unlockLevel:1,minHp:32000,maxHp:32000,sellPrice:140000,weight:30,color:'#c08bd8',worldLayer:4},
 {id:'shadowEaterCrystal',name:'影喰晶',unlockLevel:1,minHp:60000,maxHp:60000,sellPrice:320000,weight:20,color:'#83649c',worldLayer:4},
 {id:'hollowNightCrystal',name:'虚夜晶',unlockLevel:1,minHp:110000,maxHp:110000,sellPrice:800000,weight:10,color:'#5c6079',worldLayer:4}
];
LAYER4_ORES.forEach(addPermanentOreType);
[
 {id:'afterglowMeter',name:'残光計',description:'残り行動数を正確に表示する。',worldLayer:4},
 {id:'storedLight',name:'蓄光片',description:'残り行動数を30回復する。持ち込み上限10個。',worldLayer:4},
 {id:'afterglowStake',name:'残光杭',description:'残り0時に自動発動し40行動へ復帰。持ち込み上限3個。',worldLayer:4},
 {id:'afterglowAnalyzer',name:'残光解析器',description:'1回使い切りで鉱石の残耐久を解析する。持ち込み上限12個。',worldLayer:4},
 {id:'afterglowIdentifier',name:'残光識別器',description:'残光遺跡の偽鉱石・偽宝箱を恒久識別する。',worldLayer:4},
 {id:'nightVeil',name:'夜の帳',description:'光を完全に遮断する黒い薄膜状の物質。触れている間だけ、周囲の音が遠ざかる。',worldLayer:4},
 {id:'deathScythe',name:'シニガミのカマ',description:'カジノでのみ入手できる特殊景品。',worldLayer:4}
].forEach(addPermanentItemData);
const L4_BASE=[0,450,430,410,390,370,500,350,340,330,320,310,300,290,280,270,9999,260,235,210,9999];
const L4_CLUES=[
 '観測対象は、この領域内には存在しない。','外部からの刺激に対し、微弱な反応を確認。','地形情報は固定されていない。観測のたびに異なる構造を示す。','呼びかけに対する反応あり。意識的な応答かどうかは判定できない。','内部から外部を観測する試みは、すべて失敗。','この領域で記録された損傷と、観測対象の身体状態に一致は見られない。','この領域を物理的な「場所」と定義する前提そのものを再検討する必要がある。'
];
function ensureLayer4(){if(!game.layer4)game.layer4={};var l=game.layer4;if(l.unlocked===undefined)l.unlocked=false;if(!l.currentFloor)l.currentFloor=1;if(!l.maxReachedFloor)l.maxReachedFloor=1;if(!l.checkpoints)l.checkpoints={1:true};if(!l.clues)l.clues={};if(l.nightVeilObtained===undefined)l.nightVeilObtained=false;if(l.floor20Cleared===undefined)l.floor20Cleared=false;if(l.signboardBroken===undefined)l.signboardBroken=false;if(!l.equipmentOwned)l.equipmentOwned={afterglowMeter:false,afterglowIdentifier:false};if(!l.runtime)l.runtime={};if(l.layer5KeyCrafted===undefined)l.layer5KeyCrafted=false;}
function layer4OreType(f){var r=Math.random()*100;if(f<=5)return r<85?LAYER4_ORES[0]:r<98?LAYER4_ORES[1]:LAYER4_ORES[2];if(f<=10)return r<45?LAYER4_ORES[0]:r<80?LAYER4_ORES[1]:r<98?LAYER4_ORES[2]:LAYER4_ORES[3];if(f<=15)return r<15?LAYER4_ORES[0]:r<45?LAYER4_ORES[1]:r<80?LAYER4_ORES[2]:r<98?LAYER4_ORES[3]:LAYER4_ORES[4];return r<8?LAYER4_ORES[1]:r<30?LAYER4_ORES[2]:r<70?LAYER4_ORES[3]:LAYER4_ORES[4];}
function layer4Hardness(base){var r=Math.random();var m=r<0.35?0.35:r<0.80?1:r<0.97?3:r<0.995?10:15;return Math.max(1,Math.round(base*m));}
function generateLayer4Normal(f){var built=buildRoomMap(LAYER4_SIZE,10,15),start={x:built.rooms[0].cx,y:built.rooms[0].cy},stairs=farthestFloor(built.map,start,20);return {map:built.map,rooms:built.rooms,start:start,stairs:stairs};}
function enterLayer4Floor(f){ensureLayer4();f=Math.max(1,Math.min(20,Math.floor(f)));game.world.currentLayer=4;game.layer4.currentFloor=f;game.layer4.maxReachedFloor=Math.max(game.layer4.maxReachedFloor,f);if(f===6||f===16)game.layer4.checkpoints[f]=true;game.dead=false;game.mining=false;game.ores=[];
    if(f===6)return enterLayer4ClueFloor();if(f===16)return enterLayer4NightFloor();if(f===20)return enterLayer4FinalFloor();
    var b=generateLayer4Normal(f);game.map=b.map;game.explored=makeGrid(LAYER4_SIZE,false);game.player.x=b.start.x;game.player.y=b.start.y;game.stairs={x:b.stairs.x,y:b.stairs.y,found:false};game.returnPoint={x:0,y:0,found:false};var factor=1;game.layer4.runtime={size:LAYER4_SIZE,start:b.start,stairs:b.stairs,count:L4_BASE[f],baseCount:L4_BASE[f],callCooldown:randomInt(f<=5?60:f<=10?65:f<=15?70:80,f<=5?90:f<=10?100:f<=15?115:130),mapVisible:0,special:'normal',traps:{}};
    for(var i=0;i<randomInt(20,28);i++){var p=randomFloorFar(game.map,b.start,7),t=layer4OreType(f),hp=layer4Hardness(t.minHp),fake=Math.random()<(f<10?0.025:0.04);game.ores.push({x:p.x,y:p.y,id:t.id,name:t.name,level:f,hp:hp,maxHp:hp,discovered:false,inspected:false,worldLayer:4,fake:fake});}
    placeLayer4Traps(f);updateLayer4Vision();render();addLog('第4層「残光遺跡」 '+f+'Fへ入場しました。');
}
function placeLayer4Traps(f){var tiles=floorTiles(game.map),n=randomInt(5,8)+(f>=12?2:0);shuffle(tiles);for(var i=0;i<Math.min(n,tiles.length);i++){var r=Math.random(),kind=f>=17?(r<0.50?'small':r<0.90?'medium':'large'):(r<0.70?'small':r<0.97?'medium':'large');game.layer4.runtime.traps[keyXY(tiles[i])]=kind;}}
function layer4CountDown(n){var rt=game.layer4.runtime;if(rt.special==='night'||rt.special==='final')return false;rt.count-=n;if(rt.count<=0){var stakes=Math.min(3,game.inventory.items.afterglowStake||0);if(stakes>0){game.inventory.items.afterglowStake--;rt.count=40;addLog('残光杭が砕けた！ 残り行動数：40');return false;}rt.count=0;addLog('光が完全に消えた。');game.dead=true;setTimeout(handleDeath,250);return true;}return false;}
function layer4Trap(){var k=keyXY(game.player),kind=game.layer4.runtime.traps[k];if(!kind)return;delete game.layer4.runtime.traps[k];var n=kind==='small'?randomInt(10,15):kind==='medium'?randomInt(25,40):randomInt(50,80);if(game.layer4.equipmentOwned.afterglowMeter)addLog('光喰いの罠が発動した。残り行動数 -'+n);else addLog(kind==='small'?'光がわずかに弱まった。':kind==='medium'?'周囲の光が急速に失われた。':'光が大きく欠けた。何かが近づいている……');layer4CountDown(n);}
function layer4Call(){var rt=game.layer4.runtime;if(--rt.callCooldown>0)return;var f=game.layer4.currentFloor,early=['聞こえてる？','返事して','今日も反応があった'],mid=['こっちに戻ってきて','それ以上進まないで','もう時間がない'],late=['そこはあなたのいる場所じゃない','聞こえてるなら今すぐ止まって','私たちはずっと呼んでる'],arr=f<=5?early:f<=15?mid:late,msg=arr[randomInt(0,arr.length-1)];addLog('【残光】「'+msg+'」');rt.mapVisible=f<=5?25:f<=10?22:f<=15?20:randomInt(15,18);var r=Math.random();if(r<0.20){var plus=randomInt(10,25);rt.count+=plus;addLog('微かな光が戻った。残り行動数 +'+plus);}else if(r<0.30){game.player.hp=Math.min(game.player.maxHp,game.player.hp+game.player.maxHp*(0.20+Math.random()*0.10));addLog('身体に僅かな温かさを感じた。');}rt.callCooldown=randomInt(f<=5?60:f<=10?65:f<=15?70:80,f<=5?90:f<=10?100:f<=15?115:130);}
function updateLayer4Vision(){var r=VISION_RADIUS,size=game.layer4.runtime.size;for(var y=Math.max(0,game.player.y-r);y<=Math.min(size-1,game.player.y+r);y++)for(var x=Math.max(0,game.player.x-r);x<=Math.min(size-1,game.player.x+r);x++)game.explored[y][x]=true;game.ores.forEach(function(o){if(Math.abs(o.x-game.player.x)<=r&&Math.abs(o.y-game.player.y)<=r)o.discovered=true;});if(Math.abs(game.stairs.x-game.player.x)<=r&&Math.abs(game.stairs.y-game.player.y)<=r)game.stairs.found=true;}
function moveLayer4(dx,dy){if(game.dead||game.baseOpen||game.inventoryOpen||game.mining)return;var rt=game.layer4.runtime,nx=game.player.x+dx,ny=game.player.y+dy;if(nx<0||ny<0||nx>=rt.size||ny>=rt.size||game.map[ny][nx]==='wall')return;game.player.x=nx;game.player.y=ny;if(rt.special==='final')return moveLayer4FinalEvent();if(rt.special==='clue'){layer4CountDown(1);checkLayer4Clue();render();return;}if(rt.special==='night'){checkLayer4NightTrap();render();return;}if(layer4CountDown(1))return;layer4Trap();if(game.dead)return;layer4Call();if(rt.mapVisible>0)rt.mapVisible--;updateLayer4Vision();if(game.stairs.found&&game.player.x===game.stairs.x&&game.player.y===game.stairs.y)showStairConfirm();render();}
function mineLayer4(ore){if(!ore||game.mining)return;if(ore.fake&&game.layer4.equipmentOwned.afterglowIdentifier)addLog('異常反応を確認……。この鉱石は通常の構造と一致しない。');game.mining=true;if(layer4CountDown(1)){game.mining=false;return;}var power=getMiningPower(game.pickaxe.level);if(devInfiniteMining_STEP413())ore.hp=0;else ore.hp-=power;if(ore.hp<0)ore.hp=0;addLog(ore.name+'　耐久 '+ore.hp+'/'+ore.maxHp+'　(-'+(devInfiniteMining_STEP413()?'∞':power)+')');if(ore.hp<=0){var i=game.ores.indexOf(ore);if(i>=0)game.ores.splice(i,1);if(ore.fake)damageLaterLayer(game.player.maxHp*(0.40+Math.random()*0.20),'偽鉱石が爆発した。');else{addOreAmountToExpeditionBag(ore.id,1);recordOreMined(ore.id,1);addLog(ore.name+'を1個入手しました。');}}render();setTimeout(function(){game.mining=false;},100);}
function enterLayer4ClueFloor(){var size=30,map=makeGrid(size,'wall');carveRect(map,2,2,26,26);var start={x:15,y:26},stairs={x:15,y:3};game.map=map;game.explored=makeGrid(size,true);game.player.x=start.x;game.player.y=start.y;game.stairs={x:stairs.x,y:stairs.y,found:true};game.returnPoint={x:0,y:0,found:false};game.layer4.runtime={size:size,start:start,stairs:stairs,count:500,baseCount:500,mapVisible:999,special:'clue',cluePos:[]};var pts=[{x:5,y:5},{x:15,y:5},{x:25,y:5},{x:5,y:14},{x:25,y:14},{x:7,y:23},{x:23,y:23}];game.layer4.runtime.cluePos=pts;addLog('第4層「残光遺跡」 6Fへ入場しました。');var c=Object.keys(game.layer4.clues).filter(function(k){return game.layer4.clues[k];}).length;addLog(c?('すでに'+c+'つの手がかりを見つけている。 手がかり：'+c+' / 7'):'この階層には複数の記録片が残されているようだ。 手がかり：0 / 7');render();}
function checkLayer4Clue(){var rt=game.layer4.runtime;for(var i=0;i<rt.cluePos.length;i++){var p=rt.cluePos[i];if(p.x===game.player.x&&p.y===game.player.y&&!game.layer4.clues[i]){game.layer4.clues[i]=true;addLog('記録片：'+L4_CLUES[i]);var c=Object.keys(game.layer4.clues).filter(function(k){return game.layer4.clues[k];}).length;addLog('手がかり：'+c+' / 7');if(c===7){addLog('記録の照合が完了した。');addLog('この場所は、現実の地形として存在していない可能性が極めて高い。');addLog('――遠くで、重い錠の外れる音がした。');}return;}}if(game.player.x===rt.stairs.x&&game.player.y===rt.stairs.y){var c2=Object.keys(game.layer4.clues).filter(function(k){return game.layer4.clues[k];}).length;if(c2<7)addLog('7Fへの経路は閉ざされている。手がかり：'+c2+' / 7');else showStairConfirm();}}
function enterLayer4NightFloor(){var size=40,map=makeGrid(size,'wall');carveRect(map,2,2,36,36);for(var x=4;x<36;x+=6)for(var y=4;y<36;y++)if(y%9!==0)map[y][x]='wall';var start={x:3,y:36},goal={x:36,y:3};carveCorridor(map,start,goal);game.map=map;game.explored=makeGrid(size,false);game.player.x=start.x;game.player.y=start.y;game.stairs={x:goal.x,y:goal.y,found:true};game.returnPoint={x:0,y:0,found:false};game.layer4.runtime={size:size,start:start,stairs:goal,special:'night',nightTraps:{},treasure:[]};
    // 正規ルートを避けた危険地帯に不可視罠を置く。
    var d=bfsDistances(map,start),tiles=floorTiles(map).filter(function(p){return Math.abs(p.x-p.y)>5&&d[keyXY(p)]!==undefined;});shuffle(tiles);for(var i=0;i<Math.min(32,tiles.length);i++){var r=Math.random(),kind=r<0.48?'black':r<0.78?'erosion':r<0.95?'eater':'rift';game.layer4.runtime.nightTraps[keyXY(tiles[i])]=kind;}
    var treasures=[{x:8,y:8},{x:31,y:8},{x:8,y:30},{x:31,y:30},{x:20,y:10},{x:28,y:20}];game.layer4.runtime.treasure=treasures.map(function(p){return {x:p.x,y:p.y,opened:false};});game.layer4.runtime.veil={x:35,y:4};addLog('第4層「残光遺跡」 16Fへ入場しました。');addLog('【死神】反応なし。');render();}
function checkLayer4NightTrap(){var rt=game.layer4.runtime,k=keyXY(game.player),kind=rt.nightTraps[k];if(kind){delete rt.nightTraps[k];if(kind==='black')damageLaterLayer(game.player.maxHp*(0.40+Math.random()*0.15),'黒影が身体を覆った。');else if(kind==='erosion')damageLaterLayer(game.player.maxHp*(0.60+Math.random()*0.15),'暗蝕が身体を侵した。');else if(kind==='eater')damageLaterLayer(game.player.maxHp*(0.85+Math.random()*0.10),'夜喰いに身体を奪われかけた。');else{addLog('足元に、底のない夜が開いた。');game.player.hp=0;game.dead=true;setTimeout(handleDeath,250);return;}}
    for(var i=0;i<rt.treasure.length;i++){var t=rt.treasure[i];if(!t.opened&&t.x===game.player.x&&t.y===game.player.y){t.opened=true;var r=Math.random();if(r<0.50){game.inventory.items.storedLight=(game.inventory.items.storedLight||0)+randomInt(2,3);addLog('残夜の宝匣：蓄光片を入手した。');}else if(r<0.80){game.inventory.items.afterglowAnalyzer=(game.inventory.items.afterglowAnalyzer||0)+randomInt(2,4);addLog('残夜の宝匣：残光解析器を入手した。');}else if(r<0.95){game.inventory.items.afterglowStake=(game.inventory.items.afterglowStake||0)+1;addLog('残夜の宝匣：残光杭を入手した。');}else{game.inventory.items.afterglowStake=(game.inventory.items.afterglowStake||0)+1;game.expeditionBag.hollowNightCrystal=(game.expeditionBag.hollowNightCrystal||0)+randomInt(3,8);game.money+=1000000;addLog('残夜の宝匣：希少な資源を回収した。');}}
    if(rt.veil.x===game.player.x&&rt.veil.y===game.player.y&&!game.layer4.nightVeilObtained){game.layer4.nightVeilObtained=true;game.inventory.items.nightVeil=1;discoverPermanentItem('nightVeil');addLog('「夜の帳」を入手した。');addLog('――どこかで、閉ざされていた経路が開いた。');}
    if(game.player.x===rt.stairs.x&&game.player.y===rt.stairs.y){if(game.layer4.nightVeilObtained)showStairConfirm();else addLog('17Fへの経路は開かない。最奥に何かが残されている。');}}
}
function enterLayer4FinalFloor(){var size=90,map=makeGrid(size,'wall');for(var y=2;y<size-2;y++)map[y][45]='floor';var start={x:45,y:size-3},gate={x:45,y:2};game.map=map;game.explored=makeGrid(size,true);game.player.x=start.x;game.player.y=start.y;game.stairs={x:gate.x,y:gate.y,found:true};game.returnPoint={x:0,y:0,found:false};game.layer4.runtime={size:size,start:start,stairs:gate,special:'final',steps:0,events:{},choiceShown:false,collapse:false};if(game.layer4.floor20Cleared){game.player.y=8;for(var yy=9;yy<size-2;yy++)game.map[yy][45]='wall';addLog('……道の先は、もう残っていない。');}else addLog('第4層「残光遺跡」 20Fへ入場しました。');render();}
function layer4FinalMessage(step){var table={15:'【警告】管理区域外への進行を確認。帰還してください。',30:'【警告】未登録領域に接近しています。通常鉱山への帰還を推奨します。',44:'【警告】この先の安全は保証されません。探索を中止してください。',56:'【警告】……十分だ。戻れ。',66:'なぜ進む。ここから先へ行く必要はない。戻れ。',75:'【残光】「聞こえてる？」「そこはあなたのいる場所じゃない」「そこまで来たなら、あと少しだけ――」'};return table[step]||null;}
function moveLayer4FinalEvent(){var rt=game.layer4.runtime;rt.steps++;var m=layer4FinalMessage(rt.steps);if(m){addLog(m);if(rt.steps===75){addLog('【残光】「そこまで来たなら、あと少████――」');addLog('████████████████');addLog('それ以上、聞くな。');}}if(game.player.x===rt.stairs.x&&game.player.y===rt.stairs.y){showLayer4GateChoice();}render();}
function showLayer4GateChoice(){if(game.layer4.floor20Cleared){finishLayer4Floor20();return;}if(document.getElementById('layer4GateOverlay'))return;var ov=createOverlay('layer4GateOverlay'),box=createModalWindow();var h=document.createElement('h2');h.textContent='……最後に聞く。';var p=document.createElement('div');p.textContent='それでも進むのか？';p.style.marginBottom='15px';var row=document.createElement('div');row.style.display='flex';row.style.gap='10px';var go=document.createElement('button');go.textContent='進む';go.onclick=function(){hideOverlay('layer4GateOverlay');finishLayer4Floor20();};var back=document.createElement('button');back.textContent='戻る';back.onclick=function(){hideOverlay('layer4GateOverlay');startLayer4Collapse();};row.append(go,back);box.append(h,p,row);ov.appendChild(box);document.body.appendChild(ov);showOverlay('layer4GateOverlay');}
function startLayer4Collapse(){var rt=game.layer4.runtime;rt.collapse=true;addLog('【残光】「だめ」');addLog('【残光】「戻らないで」');addLog('【残光】「そっちじゃない」');addLog('入口側から空間が急速に崩れ始めた。');var y=rt.start.y;for(var yy=y;yy>game.player.y+2;yy--)game.map[yy][45]='wall';addLog('戻る道は、もう残っていない。');render();}
function finishLayer4Floor20(){game.layer4.floor20Cleared=true;game.layer4.signboardBroken=true;game.world.currentLayer=1;showBase('長い一本道の先のゲートを抜け、拠点へ戻りました。');if(baseTickerTimer!==null){clearInterval(baseTickerTimer);baseTickerTimer=null;}var board=document.getElementById('baseTickerBoard');if(board)board.classList.add('ticker-broken');addLog('――ガラスの砕ける音がした。');}

// ---------------------------------------------------------------------------
// 第5層：虚夜空間
// ---------------------------------------------------------------------------
const LAYER5_SIZE=50;
function ensureLayer5(){if(!game.layer5)game.layer5={};var l=game.layer5;if(l.unlocked===undefined)l.unlocked=false;if(!l.currentFloor)l.currentFloor=1001;if(!l.maxReachedFloor)l.maxReachedFloor=1001;if(!l.reached)l.reached={1001:true};if(l.cleared===undefined)l.cleared=false;if(!l.runtime)l.runtime={};}
function enterLayer5Floor(f){ensureLayer5();f=Math.max(1001,Math.min(1010,Math.floor(f)));game.world.currentLayer=5;game.layer5.currentFloor=f;game.layer5.maxReachedFloor=Math.max(game.layer5.maxReachedFloor,f);game.layer5.reached[f]=true;game.dead=false;game.mining=false;game.ores=[];if(f===1006)return enterLayer5Luck();if(f===1007)return enterLayer5Collapse();if(f===1008)return enterLayer5Truth();if(f===1009)return enterLayer5Trial();if(f===1010)return enterLayer5Finale();
    var b=generateLayer4Normal(1);game.map=b.map;game.explored=makeGrid(LAYER5_SIZE,false);game.player.x=b.start.x;game.player.y=b.start.y;game.stairs={x:b.stairs.x,y:b.stairs.y,found:false};game.returnPoint={x:0,y:0,found:false};game.layer5.runtime={size:LAYER5_SIZE,start:b.start,stairs:b.stairs,special:'normal',count:f===1004?300:null,gas:f===1002?0.015:0,wind:f===1003?0.012:0,anomaly:f===1005};
    // 見た目は通常鉱山の鉱石を配置（回収可能）
    for(var i=0;i<18;i++){var p=randomFloorFar(game.map,b.start,6),t=ORE_TYPES[randomInt(0,Math.min(6,ORE_TYPES.length-1))],hp=randomInt(Math.max(8,t.minHp||8),Math.max(12,t.maxHp||20));game.ores.push({x:p.x,y:p.y,id:t.id,name:t.name,level:f,hp:hp,maxHp:hp,discovered:false,inspected:false,worldLayer:5,glitch:f===1005&&Math.random()<0.25});}
    updateLayer5Vision();render();addLog('通常鉱山 '+f+'F');if(f===1002)addLog('……旧坑道で嗅いだような、僅かな刺激臭がする。');if(f===1003)addLog('空気が止まっている。それでも、どこかで風の音がする。');if(f===1004)addLog('残り行動：300');if(f===1005)addLog('地形の一部が、正しく存在していない。');
}
function updateLayer5Vision(){var rt=game.layer5.runtime,r=VISION_RADIUS;for(var y=Math.max(0,game.player.y-r);y<=Math.min(rt.size-1,game.player.y+r);y++)for(var x=Math.max(0,game.player.x-r);x<=Math.min(rt.size-1,game.player.x+r);x++)game.explored[y][x]=true;game.ores.forEach(function(o){if(Math.abs(o.x-game.player.x)<=r&&Math.abs(o.y-game.player.y)<=r)o.discovered=true;});if(Math.abs(game.stairs.x-game.player.x)<=r&&Math.abs(game.stairs.y-game.player.y)<=r)game.stairs.found=true;}
function moveLayer5(dx,dy){if(game.dead||game.baseOpen||game.inventoryOpen||game.mining)return;var rt=game.layer5.runtime,nx=game.player.x+dx,ny=game.player.y+dy;if(nx<0||ny<0||nx>=rt.size||ny>=rt.size||game.map[ny][nx]==='wall')return;game.player.x=nx;game.player.y=ny;if(rt.special==='luck'){if(game.stairs.found&&game.player.x===rt.stairs.x&&game.player.y===rt.stairs.y)showStairConfirm();render();return;}if(rt.special==='finale'){render();return;}if(rt.special==='collapse'){collapseLayer5Behind();updateLayer5Vision();if(game.player.x===rt.stairs.x&&game.player.y===rt.stairs.y)showStairConfirm();render();return;}if(rt.special==='truth'){truthLayerStep();updateLayer5Vision();if(game.player.x===rt.stairs.x&&game.player.y===rt.stairs.y)showStairConfirm();render();return;}if(rt.special==='trial'){trialLayerStep();if(game.dead)return;updateLayer5Vision();if(game.player.x===rt.stairs.x&&game.player.y===rt.stairs.y)showStairConfirm();render();return;}
    if(rt.count!==null){rt.count--;if(rt.count<=0){game.dead=true;addLog('残り行動：0');setTimeout(handleDeath,200);return;}if(rt.count%25===0)addLog('残り行動：'+rt.count);}if(rt.gas)damageLaterLayer(game.player.maxHp*rt.gas,'刺激性の気体が肺を焼く。');if(game.dead)return;if(rt.wind&&Math.random()<rt.wind)addLog('存在しないはずの風が通り抜けた。');if(rt.anomaly&&Math.random()<0.03)addLog('さっきまであった構造が一部欠落している。');updateLayer5Vision();if(game.stairs.found&&game.player.x===game.stairs.x&&game.player.y===game.stairs.y)showStairConfirm();render();}
function mineLayer5(ore){if(!ore||game.mining)return;if(game.layer5.currentFloor===1006)return mineLayer5LuckOre(ore);game.mining=true;if(ore.glitch&&Math.random()<0.45){addLog('鉱石に触れたが、操作が成立しない。');game.mining=false;return;}var power=getMiningPower(game.pickaxe.level);if(devInfiniteMining_STEP413())ore.hp=0;else ore.hp-=power;if(ore.hp<0)ore.hp=0;addLog(ore.name+'　耐久 '+ore.hp+'/'+ore.maxHp+'　(-'+(devInfiniteMining_STEP413()?'∞':power)+')');if(ore.hp<=0){var i=game.ores.indexOf(ore);if(i>=0)game.ores.splice(i,1);addOreAmountToExpeditionBag(ore.id,1);recordOreMined(ore.id,1);}render();setTimeout(function(){game.mining=false;},80);}
function enterLayer5Luck(){var size=25,map=makeGrid(size,'wall');carveRect(map,2,2,21,21);game.map=map;game.explored=makeGrid(size,true);game.player.x=12;game.player.y=20;game.returnPoint={x:0,y:0,found:false};game.stairs={x:12,y:3,found:false};game.layer5.runtime={size:size,start:{x:12,y:20},stairs:{x:12,y:3},special:'luck',wave:1,synced:false};spawnLuckWave();addLog('通常鉱山 1006F');addLog('採掘力が、この空間の規則に固定された。');render();}
const L5_LUCK_COUNTS=[0,2,3,5,8,13];
const L5_LUCK_VALUES=[[0],[50,500],[100,300,1000],[150,300,600,1000,1500],[200,400,700,1000,1300,1600,1800,2000],[250,400,600,900,1200,1500,1800,2000,2200,2300,2400,2450,2500]];
function spawnLuckWave(){var rt=game.layer5.runtime,w=rt.wave;game.ores=[];rt.synced=false;var vals=L5_LUCK_VALUES[w].slice();while(vals.length<L5_LUCK_COUNTS[w])vals.push(vals[vals.length-1]);shuffle(vals);for(var i=0;i<L5_LUCK_COUNTS[w];i++){var angle=(Math.PI*2*i)/L5_LUCK_COUNTS[w],x=12+Math.round(Math.cos(angle)*6),y=12+Math.round(Math.sin(angle)*6),hp=vals[i%vals.length];game.ores.push({x:x,y:y,id:'luckOre',name:'無名鉱',level:1006,hp:hp,maxHp:hp,initialHp:hp,discovered:true,inspected:true,worldLayer:5,luck:true});}addLog('鉱石が'+L5_LUCK_COUNTS[w]+'個現れた。採掘力：'+w);render();}
function mineLayer5LuckOre(ore){var rt=game.layer5.runtime;if(game.mining)return;game.mining=true;if(!rt.synced){rt.synced=true;var chosen=ore.initialHp;game.ores.forEach(function(o){o.hp=chosen;o.maxHp=chosen;});addLog('――鉱石群の硬度が同期した。');}var power=rt.wave;if(devInfiniteMining_STEP413())ore.hp=0;else ore.hp-=power;if(ore.hp<0)ore.hp=0;if(ore.hp%100===0||ore.hp<=0)addLog('無名鉱　耐久 '+ore.hp+'/'+ore.maxHp+'　(-'+(devInfiniteMining_STEP413()?'∞':power)+')');if(ore.hp<=0){game.ores=[];rt.wave++;if(rt.wave>5){game.stairs.found=true;addLog('最後の鉱石が砕けた。');addLog('……。');}else setTimeout(spawnLuckWave,120);}render();setTimeout(function(){game.mining=false;},35);}
function enterLayer5Collapse(){var b=generateLayer4Normal(1);game.map=b.map;game.explored=makeGrid(LAYER5_SIZE,false);game.player.x=b.start.x;game.player.y=b.start.y;game.stairs={x:b.stairs.x,y:b.stairs.y,found:true};game.returnPoint={x:0,y:0,found:false};var d=bfsDistances(game.map,b.start),safe={};Object.keys(d).forEach(function(k){safe[k]=true;});game.layer5.runtime={size:LAYER5_SIZE,start:b.start,stairs:b.stairs,special:'collapse',safeRoute:safe,trail:[]};addLog('通常鉱山 1007F');render();}
function collapseLayer5Behind(){var rt=game.layer5.runtime;rt.trail.push({x:game.player.x,y:game.player.y});if(rt.trail.length>8){var p=rt.trail.shift();if(keyXY(p)!==keyXY(rt.start)&&keyXY(p)!==keyXY(rt.stairs)){var ns=[[1,0],[-1,0],[0,1],[0,-1]],can=true;/* 正解ルートを壊さないため、床を視覚的消失扱いに留める */if(can){game.explored[p.y][p.x]=false;}}}if(Math.random()<0.12)addLog('……さっきまで、ここに道があったはずだ。');}
function enterLayer5Truth(){var b=generateLayer4Normal(1);game.map=b.map;game.explored=makeGrid(LAYER5_SIZE,false);game.player.x=b.start.x;game.player.y=b.start.y;game.stairs={x:b.stairs.x,y:b.stairs.y,found:true};game.returnPoint={x:0,y:0,found:false};game.layer5.runtime={size:LAYER5_SIZE,start:b.start,stairs:b.stairs,special:'truth',steps:0,nextMessage:20};addLog('通常鉱山 1008F');render();}
function truthLayerStep(){var rt=game.layer5.runtime;rt.steps++;if(rt.steps===20)addLog('「反応が上がっています」');if(rt.steps===45)addLog('「聞こえている可能性があります」');if(rt.steps===70)addLog('「もう少しです」');if(rt.steps===95)addLog('観測対象：反応あり　／　外部刺激への反応：微弱');if(rt.steps===120){addLog('この領域からの離脱には、最深部の境界を破壊する必要がある。');addLog('少し先に、境界へ到達する経路が存在する。');}}
function enterLayer5Trial(){var b=generateLayer4Normal(1);game.map=b.map;game.explored=makeGrid(LAYER5_SIZE,false);game.player.x=b.start.x;game.player.y=b.start.y;game.stairs={x:b.stairs.x,y:b.stairs.y,found:true};game.returnPoint={x:0,y:0,found:false};game.layer5.runtime={size:LAYER5_SIZE,start:b.start,stairs:b.stairs,special:'trial',steps:0,count:420};addLog('通常鉱山 1009F');addLog('これまでの環境反応が同時に検出された。');render();}
function trialLayerStep(){var rt=game.layer5.runtime;rt.steps++;rt.count--;if(rt.count<=0){game.dead=true;addLog('残り行動：0');setTimeout(handleDeath,200);return;}var zone=rt.steps<70?2:rt.steps<140?3:rt.steps<210?4:5;if(zone>=2&&Math.random()<0.35)damageLaterLayer(game.player.maxHp*0.01,'有毒ガス反応');if(game.dead)return;if(zone>=3&&Math.random()<0.02)triggerLayer3Wind();if(zone>=4&&Math.random()<0.015){var cut=randomInt(8,25);rt.count-=cut;addLog('光喰い反応：残り行動 -'+cut);}if(zone===5&&Math.random()<0.01)addLog('複数の異常が重なり、空間が大きく揺らいだ。');}
function enterLayer5Finale(){var size=35,map=makeGrid(size,'wall');for(var y=2;y<size-2;y++)map[y][17]='floor';carveRect(map,13,2,9,8);game.map=map;game.explored=makeGrid(size,true);game.player.x=17;game.player.y=size-3;game.stairs={x:17,y:4,found:true};game.returnPoint={x:0,y:0,found:false};game.layer5.runtime={size:size,start:{x:17,y:size-3},stairs:{x:17,y:4},special:'finale',truthShown:false,finalRock:{x:17,y:4,hp:7}};addLog('通常鉱山 1010F');addLog('ここには、もう鉱山の音がほとんど残っていない。');render();}
function triggerLayer5Finale(){if(game.layer5.cleared)return;addLog('ここまで掘ってきた場所は、現実の地形ではなかった。');addLog('外側には、ずっと呼びかけ続けている誰かがいる。');addLog('目の前に、境界のような何かがある。');}
function mineFinalBoundary(){var rt=game.layer5.runtime;if(game.player.x!==rt.finalRock.x||game.player.y!==rt.finalRock.y){addLog('もう少し近づく必要がある。');return;}if(rt.finalRock.hp===7)triggerLayer5Finale();rt.finalRock.hp--;if(rt.finalRock.hp>0){addLog('――――を叩いた。');return;}addLog('壁ではない何かが砕けた。');game.layer5.cleared=true;game.endgameUnlocked=true;game.layer4.signboardBroken=false;game.world.currentLayer=1;game.dead=false;game.mining=false;showBase('……目を開けた。');startBaseTicker();updateAllBaseWindows();}

// ---------------------------------------------------------------------------
// 接続アイテムとクラフト
// ---------------------------------------------------------------------------
function hasAllLayer2Story(){for(var f=10;f<=100;f+=10)if(!game.layer2.storyItems[f])return false;return true;}
function hasAllLayer3Story(){for(var f=1;f<=10;f++)if(!game.layer3.storyItems[f])return false;return true;}
function canCraftLayer3Key(){ensureLayer2DataStructures();return hasAllLayer2Story()&&(game.warehouse.ores.greenCorrosion||0)>=800&&(game.warehouse.ores.grayCrystal||0)>=700&&(game.warehouse.ores.blackFilm||0)>=600&&(game.warehouse.ores.deepBlue||0)>=500&&(game.warehouse.ores.sealedAir||0)>=400&&(game.warehouse.ores.zeroVein||0)>=250&&game.money>=10000000;}
function craftLayer3Key(){if(!canCraftLayer3Key())return;[['greenCorrosion',800],['grayCrystal',700],['blackFilm',600],['deepBlue',500],['sealedAir',400],['zeroVein',250]].forEach(function(x){game.warehouse.ores[x[0]]-=x[1];});game.money-=10000000;game.layer2.layer3KeyCrafted=true;ensureLayer3();game.layer3.unlocked=true;game.world.maxUnlockedLayer=Math.max(game.world.maxUnlockedLayer,3);addLog('「零風接続核」を作成した。第3層への接続が可能になった。');updateAllBaseWindows();}
function canCraftLayer4Key(){ensureLayer3();return hasAllLayer3Story()&&(game.warehouse.ores.breezeShard||0)>=2000&&(game.warehouse.ores.windCrystal||0)>=800&&(game.warehouse.ores.godSteel||0)>=100&&game.money>=50000000;}
function craftLayer4Key(){if(!canCraftLayer4Key())return;game.warehouse.ores.breezeShard-=2000;game.warehouse.ores.windCrystal-=800;game.warehouse.ores.godSteel-=100;game.money-=50000000;game.layer3.layer4KeyCrafted=true;ensureLayer4();game.layer4.unlocked=true;game.world.maxUnlockedLayer=Math.max(game.world.maxUnlockedLayer,4);addLog('「残光接続核」を作成した。第4層への接続が可能になった。');updateAllBaseWindows();}
// 夜断ちの楔：初期実装の確定レシピ
const LAYER5_KEY_MONEY = 5000000000;
const LAYER5_KEY_ORES = {
    // 第4層
    afterglowStone: 5000,
    twilightCrystal: 3500,
    duskOre: 2000,
    shadowEaterCrystal: 1200,
    hollowNightCrystal: 600,

    // 第3層
    breezeShard: 4000,
    windCrystal: 1500,

    // 第2層
    greenCorrosion: 3000,
    grayCrystal: 2500,
    blackMembrane: 2000,
    deepBlueOre: 1500,
    sealedAirCrystal: 1000,
    zeroVeinCrystal: 600,

    // 第1層
    iron: 5000,
    copper: 4000,
    silver: 3000,
    gold: 2500,
    platinum: 2000,
    mithril: 1500,
    orichalcum: 1200,
    adamantite: 1000,
    obsidianCrystal: 800,
    starSilver: 600,
    dragonCrystal: 450,
    heavenCrystal: 350,
    voidCrystal: 250,
    godSteel: 150
};

function canCraftLayer5Key(){
    ensureLayer4();
    if(!game.layer4.floor20Cleared) return false;
    if(!game.layer4.nightVeilObtained) return false;
    if((game.inventory.items.nightVeil||0)!==1) return false;
    if((game.inventory.items.deathScythe||0)<1) return false;
    if(game.money<LAYER5_KEY_MONEY) return false;
    return Object.entries(LAYER5_KEY_ORES).every(function(entry){
        return (game.warehouse.ores[entry[0]]||0)>=entry[1];
    });
}

function craftLayer5Key(){
    if(!canCraftLayer5Key()) return;
    Object.entries(LAYER5_KEY_ORES).forEach(function(entry){
        game.warehouse.ores[entry[0]]-=entry[1];
    });
    game.inventory.items.nightVeil=0;
    game.inventory.items.deathScythe--;
    game.money-=LAYER5_KEY_MONEY;
    game.layer4.layer5KeyCrafted=true;
    ensureLayer5();
    game.layer5.unlocked=true;
    game.world.maxUnlockedLayer=Math.max(game.world.maxUnlockedLayer,5);
    addLog('「夜断ちの楔」を作成した。第5層への接続が可能になった。');
    updateAllBaseWindows();
}

function getLayer5KeyRecipeText(){
    var names={
        afterglowStone:'残光石',twilightCrystal:'薄明晶',duskOre:'暮光鉱',shadowEaterCrystal:'影喰晶',hollowNightCrystal:'虚夜晶',
        breezeShard:'微風のかけら',windCrystal:'風の結晶',
        greenCorrosion:'緑蝕鉱',grayCrystal:'灰晶鉱',blackMembrane:'黒膜鉱',deepBlueOre:'深青鉱',sealedAirCrystal:'封気晶',zeroVeinCrystal:'零脈晶',
        iron:'鉄鉱石',copper:'銅鉱石',silver:'銀鉱石',gold:'金鉱石',platinum:'白金鉱石',mithril:'ミスリル鉱石',orichalcum:'オリハルコン鉱石',adamantite:'アダマンタイト鉱石',obsidianCrystal:'黒曜晶鉱',starSilver:'星銀鉱石',dragonCrystal:'竜晶鉱',heavenCrystal:'天晶鉱',voidCrystal:'虚空晶鉱',godSteel:'神鋼鉱'
    };
    var parts=['夜の帳×1','シニガミのカマ×1'];
    Object.entries(LAYER5_KEY_ORES).forEach(function(entry){parts.push((names[entry[0]]||entry[0])+'×'+entry[1]);});
    parts.push('5,000,000,000G');
    return parts.join(' ／ ');
}

// ---------------------------------------------------------------------------
// 共通関数ラップ
// ---------------------------------------------------------------------------
const _l345_movePlayer=movePlayer;
movePlayer=function(dx,dy){if(game.world.currentLayer===3)return moveLayer3(dx,dy);if(game.world.currentLayer===4)return moveLayer4(dx,dy);if(game.world.currentLayer===5)return moveLayer5(dx,dy);return _l345_movePlayer(dx,dy);};
const _l345_mineOre=mineOre;
mineOre=function(ore){if(game.world.currentLayer===3)return mineLayer3(ore);if(game.world.currentLayer===4)return mineLayer4(ore);if(game.world.currentLayer===5){if(game.layer5.currentFloor===1010&&game.layer5.runtime.finalRock&&game.player.x===game.layer5.runtime.finalRock.x&&game.player.y===game.layer5.runtime.finalRock.y)return mineFinalBoundary();return mineLayer5(ore);}return _l345_mineOre(ore);};
const _l345_confirmStair=confirmStair;
confirmStair=function(){if(game.world.currentLayer===3){hideStairConfirm();if(game.layer3.currentFloor<10)enterLayer3Floor(game.layer3.currentFloor+1);return;}if(game.world.currentLayer===4){hideStairConfirm();if(game.layer4.currentFloor<20)enterLayer4Floor(game.layer4.currentFloor+1);return;}if(game.world.currentLayer===5){hideStairConfirm();if(game.layer5.currentFloor<1010)enterLayer5Floor(game.layer5.currentFloor+1);return;}return _l345_confirmStair();};
const _l345_showStair=showStairConfirm;
showStairConfirm=function(){if(game.world.currentLayer>=3){if(game.stairConfirmOpen)return;game.stairConfirmOpen=true;var t=document.getElementById('stairConfirmText'),b=document.querySelector('#stairConfirmOverlay .confirm-primary');var next=game.world.currentLayer===3?(game.layer3.currentFloor+1):game.world.currentLayer===4?(game.layer4.currentFloor+1):(game.layer5.currentFloor+1);if(t)t.textContent=next+'Fへ進みますか？';if(b)b.disabled=(game.world.currentLayer===3&&game.layer3.currentFloor>=10)||(game.world.currentLayer===4&&game.layer4.currentFloor>=20)||(game.world.currentLayer===5&&game.layer5.currentFloor>=1010);showOverlay('stairConfirmOverlay');return;}return _l345_showStair();};
const _l345_useFeather=useReturnFeather;
useReturnFeather=function(){if(game.world.currentLayer===3&&game.layer3.currentFloor>=6&&!isLayer3BossRoom()){addLog('強風により帰還の羽を使用できない。');return;}if(game.world.currentLayer===4&&game.layer4.currentFloor===20)return;if(game.world.currentLayer===5&&game.layer5.currentFloor===1010)return;return _l345_useFeather();};
const _l345_handleDeath=handleDeath;
handleDeath=function(){if(game.world.currentLayer===3){var f=game.layer3.currentFloor;_l345_handleDeath();game.layer3.currentFloor=f;return;}if(game.world.currentLayer===4){var f4=game.layer4.currentFloor;_l345_handleDeath();game.layer4.currentFloor=f4;return;}if(game.world.currentLayer===5){var f5=game.layer5.currentFloor;_l345_handleDeath();game.layer5.currentFloor=f5;return;}return _l345_handleDeath();};

function renderCameraMapGeneric(size,rad,extra){if(!mapElement)return;var minX=Math.max(0,game.player.x-rad),maxX=Math.min(size-1,game.player.x+rad),minY=Math.max(0,game.player.y-rad),maxY=Math.min(size-1,game.player.y+rad);mapElement.innerHTML='';mapElement.style.gridTemplateColumns='repeat('+(maxX-minX+1)+', 1fr)';for(var y=minY;y<=maxY;y++)for(var x=minX;x<=maxX;x++){var t=document.createElement('div');t.className='tile';var explored=game.explored[y]&&game.explored[y][x];if(!explored){t.classList.add('hidden');mapElement.appendChild(t);continue;}if(game.map[y][x]==='wall'){t.classList.add('wall');t.textContent='■';}else{t.classList.add('floor');t.textContent='・';}var ore=getOreAt(x,y);if(ore&&ore.discovered){t.textContent=ore.boss?'◆':'鉱';var ot=getOreTypeById(ore.id);if(ot)t.style.color=ot.color;t.style.cursor='pointer';t.onclick=function(o){return function(e){e.stopPropagation();mineOre(o);};}(ore);}if(extra)extra(t,x,y);if(x===game.player.x&&y===game.player.y){t.classList.add('player');if(t.textContent==='・')t.textContent='●';}mapElement.appendChild(t);}}
const _l345_renderMap=renderMap;
renderMap=function(){if(game.world.currentLayer===3){return renderCameraMapGeneric(LAYER3_SIZE,LAYER3_CAMERA_RADIUS,function(t,x,y){var rt=game.layer3.runtime;if(rt.escape&&x===rt.escape.x&&y===rt.escape.y){t.textContent='帰';t.style.color='#ffd84d';}for(var i=0;i<rt.recovery.length;i++){var p=rt.recovery[i];if(p.exists&&p.x===x&&p.y===y){t.textContent='静';t.style.color='#bfffe0';}}if(x===rt.stairs.x&&y===rt.stairs.y){t.textContent='階';t.style.color='#67e667';}});}if(game.world.currentLayer===4){return renderCameraMapGeneric(game.layer4.runtime.size,LAYER4_CAMERA_RADIUS,function(t,x,y){var rt=game.layer4.runtime;if(rt.special==='clue'){for(var i=0;i<rt.cluePos.length;i++){var p=rt.cluePos[i];if(p.x===x&&p.y===y&&!game.layer4.clues[i]){t.textContent='記';t.style.color='#9bd5ff';}}}if(rt.special==='night'){for(var j=0;j<rt.treasure.length;j++){var q=rt.treasure[j];if(!q.opened&&q.x===x&&q.y===y){t.textContent='匣';t.style.color='#c3b2ff';}}if(rt.veil&&rt.veil.x===x&&rt.veil.y===y&&!game.layer4.nightVeilObtained){t.textContent='帳';t.style.color='#777';}}if(x===rt.stairs.x&&y===rt.stairs.y){t.textContent=rt.special==='final'?'門':'階';t.style.color='#67e667';}});}if(game.world.currentLayer===5){return renderCameraMapGeneric(game.layer5.runtime.size,10,function(t,x,y){var rt=game.layer5.runtime;if(game.layer5.currentFloor===1006&&game.stairs.found&&x===game.stairs.x&&y===game.stairs.y){t.textContent='階';t.style.color='#67e667';}else if(game.layer5.currentFloor===1010&&x===rt.finalRock.x&&y===rt.finalRock.y){t.textContent='？';t.style.color='#fff';t.style.cursor='pointer';t.onclick=function(e){e.stopPropagation();mineFinalBoundary();};}else if(x===rt.stairs.x&&y===rt.stairs.y){t.textContent='階';t.style.color='#67e667';}});}return _l345_renderMap();};

const _l345_renderMinimap=renderMinimap;
renderMinimap=function(){if(game.world.currentLayer===3&&game.layer3.temp.mapOff>0){if(minimapElement)minimapElement.innerHTML='';return;}if(game.world.currentLayer===4&&game.layer4.runtime.special==='normal'&&game.layer4.runtime.mapVisible<=0){if(minimapElement)minimapElement.innerHTML='';return;}if(game.world.currentLayer>=3){if(!minimapElement)return;var size=game.world.currentLayer===3?LAYER3_SIZE:game.world.currentLayer===4?game.layer4.runtime.size:game.layer5.runtime.size,scale=50;minimapElement.innerHTML='';minimapElement.style.gridTemplateColumns='repeat('+Math.min(size,50)+', 3px)';var step=Math.max(1,Math.ceil(size/50));for(var y=0;y<size;y+=step)for(var x=0;x<size;x+=step){var d=document.createElement('div');d.className='mini-tile';d.style.width='3px';d.style.height='3px';if(game.explored[y]&&game.explored[y][x])d.style.background=game.map[y][x]==='wall'?'#444':'#999';else d.style.background='#111';if(Math.abs(x-game.player.x)<step&&Math.abs(y-game.player.y)<step)d.style.background='#fff';minimapElement.appendChild(d);}return;}return _l345_renderMinimap();};

const _l345_updateStatus=updateStatusUI;
updateStatusUI=function(){_l345_updateStatus();var el=document.getElementById('playerStatus');if(!el)return;if(game.world.currentLayer===3){el.textContent='第3層 無風回廊 '+game.layer3.currentFloor+'F　HP：'+formatHp(game.player.hp)+'/'+formatHp(game.player.maxHp)+'　採掘力：'+getMiningPower(game.pickaxe.level)+(game.layer3.temp.chaos>0?'　混沌:'+game.layer3.temp.chaos:'')+'　所持金：'+game.money+'G';}if(game.world.currentLayer===4){var rt=game.layer4.runtime,c=game.layer4.equipmentOwned.afterglowMeter?rt.count:'???';el.textContent='第4層 残光遺跡 '+game.layer4.currentFloor+'F　HP：'+formatHp(game.player.hp)+'/'+formatHp(game.player.maxHp)+(rt.special==='night'?'　【死神】停止':rt.special==='final'?'':'　光が消えるまで残り：'+c)+'　所持金：'+game.money+'G';}if(game.world.currentLayer===5){var r5=game.layer5.runtime;el.textContent='第5層 虚夜空間 '+game.layer5.currentFloor+'F　HP：'+formatHp(game.player.hp)+'/'+formatHp(game.player.maxHp)+(r5.count!==undefined&&r5.count!==null?'　残り行動：'+r5.count:'')+'　所持金：'+game.money+'G';}};

const _l345_updateInventory=updateInventoryUI;
updateInventoryUI=function(){_l345_updateInventory();if(game.world.currentLayer===4&&game.layer4.currentFloor===20){var box=document.getElementById('inventoryWindow');if(box)box.style.display='none';} };
const _l345_openInventory=openInventory;
openInventory=function(){if(game.world.currentLayer===4&&game.layer4.currentFloor===20)return;if(game.world.currentLayer===5&&game.layer5.currentFloor===1010)return;return _l345_openInventory();};

// 深度観測：作成可能時のみ次接続を明示。
const _l345_depth=updateDepthObservationUI;
updateDepthObservationUI=function(){ensureLayer3();ensureLayer4();ensureLayer5();if(game.layer4.floor20Cleared&&!game.layer5.cleared){var box=document.getElementById('depthObservationBox');if(box){box.innerHTML='<div style="font-weight:bold;color:#b5a2ff">【 深 度 観 測 】</div><div style="margin-top:6px">████████████████</div><div>████……████████</div>'+(canCraftLayer5Key()?'<div style="margin-top:8px;color:#fff">工房にて「夜断ちの楔」の作成が可能です。</div>':'');}return;}if(game.layer3.unlocked&&!game.layer4.unlocked&&canCraftLayer4Key()){var b=document.getElementById('depthObservationBox');if(b)b.innerHTML='<div style="font-weight:bold;color:#b5a2ff">【 深 度 観 測 】</div><div style="margin-top:7px">接続経路を確認。工房にて「残光接続核」の作成が可能です。</div>';return;}if(game.layer2&&game.layer2.unlocked&&!game.layer3.unlocked&&canCraftLayer3Key()){var b2=document.getElementById('depthObservationBox');if(b2)b2.innerHTML='<div style="font-weight:bold;color:#b5a2ff">【 深 度 観 測 】</div><div style="margin-top:7px">接続経路を確認。工房にて「零風接続核」の作成が可能です。</div>';return;}return _l345_depth();};

// 工房に接続核を追加。
const _l345_workshop=updateWorkshopUI;
updateWorkshopUI=function(){_l345_workshop();var box=document.getElementById('workshopWindow');if(!box)return;function row(name,desc,can,fn){var d=document.createElement('div');d.style.cssText='padding:9px;margin-top:8px;border:1px solid #5b5666;border-radius:5px;background:rgba(30,20,45,.18)';var h=document.createElement('div');h.style.fontWeight='bold';h.textContent=name;var p=document.createElement('div');p.style.fontSize='11px';p.style.marginTop='4px';p.textContent=desc;var b=document.createElement('button');b.textContent='作成';b.disabled=!can;b.style.marginTop='6px';b.onclick=function(e){e.stopPropagation();fn();updateWorkshopUI();};d.append(h,p,b);var close=Array.from(box.querySelectorAll('button')).find(function(x){return x.textContent==='閉じる';});if(close)box.insertBefore(d,close);else box.appendChild(d);}ensureLayer3();ensureLayer4();ensureLayer5();if(game.layer2&&game.layer2.layer3RecipeKnown&&!game.layer3.unlocked)row('零風接続核','旧坑道の10個の記録品（非消費）＋旧坑道鉱石大量＋10,000,000G',canCraftLayer3Key(),craftLayer3Key);if(game.layer3.unlocked&&!game.layer4.unlocked)row('残光接続核','無風回廊の10個の記録品（非消費）＋微風2000＋風結晶800＋神鋼100＋50,000,000G',canCraftLayer4Key(),craftLayer4Key);if(game.layer4.floor20Cleared&&!game.layer5.unlocked)row('夜断ちの楔',getLayer5KeyRecipeText(),canCraftLayer5Key(),craftLayer5Key);};

// セーブ
const _l345_createSave=createSaveData;
createSaveData=function(){ensureLayer3();ensureLayer4();ensureLayer5();var d=_l345_createSave();d.layer3=deepCloneSimple(game.layer3);d.layer4=deepCloneSimple(game.layer4);d.layer5=deepCloneSimple(game.layer5);d.endgameUnlocked=!!game.endgameUnlocked;['windGuideLamp','phaseRadar','boundaryAnchor','afterglowMeter','storedLight','afterglowStake','afterglowAnalyzer','afterglowIdentifier','nightVeil','deathScythe'].forEach(function(id){d.inventoryItems[id]=game.inventory.items[id]||0;});return d;};
const _l345_load=loadGame;
loadGame=function(){_l345_load();ensureLayer3();ensureLayer4();ensureLayer5();try{var raw=localStorage.getItem(SAVE_KEY),d=raw?JSON.parse(raw):null;if(d){if(d.layer3)Object.assign(game.layer3,d.layer3);if(d.layer4)Object.assign(game.layer4,d.layer4);if(d.layer5)Object.assign(game.layer5,d.layer5);game.endgameUnlocked=!!d.endgameUnlocked;if(d.inventoryItems)['windGuideLamp','phaseRadar','boundaryAnchor','afterglowMeter','storedLight','afterglowStake','afterglowAnalyzer','afterglowIdentifier','nightVeil','deathScythe'].forEach(function(id){game.inventory.items[id]=getSafeAmount(d.inventoryItems[id],game.inventory.items[id]||0);});}}catch(e){console.error(e);}game.world.currentLayer=1;updateAllBaseWindows();};

// DEVワープを3～5層へ拡張。
const _l345_devWarp=devWarpToFloor;
devWarpToFloor=function(layer,floor){layer=Number(layer);floor=Number(floor);if(layer===3){ensureLayer3();game.layer3.unlocked=true;game.world.maxUnlockedLayer=Math.max(game.world.maxUnlockedLayer,3);closeDevMenu();hideBase();game.player.hp=game.player.maxHp;clearExpeditionBag();enterLayer3Floor(Math.max(1,Math.min(10,floor||1)));addLog('【開発ワープ】第3層「無風回廊」へ移動しました。');return;}if(layer===4){ensureLayer4();game.layer4.unlocked=true;game.world.maxUnlockedLayer=Math.max(game.world.maxUnlockedLayer,4);closeDevMenu();hideBase();game.player.hp=game.player.maxHp;clearExpeditionBag();enterLayer4Floor(Math.max(1,Math.min(20,floor||1)));addLog('【開発ワープ】第4層「残光遺跡」へ移動しました。');return;}if(layer===5){ensureLayer5();game.layer5.unlocked=true;game.world.maxUnlockedLayer=Math.max(game.world.maxUnlockedLayer,5);closeDevMenu();hideBase();game.player.hp=game.player.maxHp;clearExpeditionBag();var ff=Math.max(1001,Math.min(1010,floor<1000?1000+(floor||1):floor));enterLayer5Floor(ff);addLog('【開発ワープ】第5層「虚夜空間」へ移動しました。');return;}return _l345_devWarp(layer,floor);};

// DEVワープUIの入力範囲も切替。
const _l345_appendDev=appendDevWarpPanel;
appendDevWarpPanel=function(){_l345_appendDev();var sel=document.getElementById('devWarpLayerSelect'),inp=document.getElementById('devWarpFloorInput');if(!sel||!inp||sel.dataset.l345)return;sel.dataset.l345='1';sel.onchange=function(){var l=Number(sel.value);inp.disabled=false;if(l===1){inp.min='1';inp.max='100';inp.value=String(game.currentMineLevel||1);}else if(l===2){inp.min='1';inp.max='100';inp.value=String(game.layer2.currentFloor||1);}else if(l===3){inp.min='1';inp.max='10';inp.value=String(game.layer3.currentFloor||1);}else if(l===4){inp.min='1';inp.max='20';inp.value=String(game.layer4.currentFloor||1);}else{inp.min='1001';inp.max='1010';inp.value=String(game.layer5.currentFloor||1001);}};sel.dispatchEvent(new Event('change'));};

// 電光掲示板の進行メッセージを、現在の設計に合わせて差し替える。
BASE_TICKER_LAYER3_MESSAGES.splice(0,BASE_TICKER_LAYER3_MESSAGES.length,'……聞こえる？','今日も反応があった','返事して','こっちの声、届いてる？','呼びかけを続けます','外部反応を確認','聞こえているなら、何か反応して');
BASE_TICKER_LAYER4_MESSAGES.splice(0,BASE_TICKER_LAYER4_MESSAGES.length,'聞こえてる？','返事して','今日も反応があった','こっちに戻ってきて','それ以上進まないで','もう時間がない','そこはあなたのいる場所じゃない','聞こえてるなら今すぐ止まって','私たちはずっと呼んでる');
WORLD_LAYER_DATA[3].implemented=true;WORLD_LAYER_DATA[4].implemented=true;WORLD_LAYER_DATA[5].implemented=true;

// クリア後拠点表示切替用の土台。
if(game.endgameUnlocked===undefined)game.endgameUnlocked=false;
if(game.baseVisualMode===undefined)game.baseVisualMode='story';

ensureLayer3();ensureLayer4();ensureLayer5();


// ============================================================================
// STEP 4-7 : DEV成長最大化 + 夜断ちの楔レシピ確定
// ============================================================================

function devMaxPickaxe(){
    if(!DEV_MODE) return;
    var devPickaxeCap=getCurrentPickaxeMaxLevel();
    game.pickaxe.level=devPickaxeCap;
    addLog('【開発】ツルハシを現行上限Lv'+devPickaxeCap+'へ変更しました。採掘力：'+getMiningPower(game.pickaxe.level));
    updateAllBaseWindows();
    updateDevUI();
}

function devMaxBase(){
    if(!DEV_MODE) return;
    var oldLevel=Math.max(1,Number(game.base.level)||1);
    var gain=Math.max(0,BASE_MAX_LEVEL-oldLevel)*BASE_HP_GAIN;
    game.base.level=BASE_MAX_LEVEL;
    if(gain>0){
        game.player.maxHp=Math.round((game.player.maxHp+gain)*100)/100;
        game.player.hp=Math.min(game.player.maxHp,Math.round((game.player.hp+gain)*100)/100);
    }
    addLog('【開発】拠点を現行上限Lv'+BASE_MAX_LEVEL+'へ変更しました。');
    updateAllBaseWindows();
    updateDevUI();
}

function appendDevGrowthPanel(){
    if(!DEV_MODE) return;
    var box=document.getElementById('devWindow');
    if(!box||document.getElementById('devGrowthPanel')) return;
    var panel=document.createElement('div');
    panel.id='devGrowthPanel';
    panel.className='dev-panel';
    var title=document.createElement('div');
    title.textContent='【 成長テスト 】';
    title.style.fontWeight='bold';
    title.style.marginBottom='8px';
    panel.appendChild(title);

    var status=document.createElement('div');
    status.style.cssText='font-size:11px;color:#aeb6bd;margin-bottom:8px;line-height:1.5';
    status.textContent='拠点 Lv'+game.base.level+'/'+BASE_MAX_LEVEL+'　／　ツルハシ Lv'+game.pickaxe.level+'/'+getCurrentPickaxeMaxLevel()+'（採掘力 '+getMiningPower(game.pickaxe.level)+'）';
    panel.appendChild(status);

    var baseButton=document.createElement('button');
    baseButton.textContent='拠点Lvを最大';
    baseButton.disabled=game.base.level>=BASE_MAX_LEVEL;
    baseButton.style.marginRight='7px';
    baseButton.onclick=function(event){event.stopPropagation();devMaxBase();};
    panel.appendChild(baseButton);

    var pickButton=document.createElement('button');
    pickButton.textContent='採掘力を最大';
    pickButton.disabled=game.pickaxe.level>=getCurrentPickaxeMaxLevel();
    pickButton.onclick=function(event){event.stopPropagation();devMaxPickaxe();};
    panel.appendChild(pickButton);

    var closeButton=Array.from(box.querySelectorAll('button')).find(function(button){return button.textContent==='閉じる';});
    if(closeButton) box.insertBefore(panel,closeButton);
    else box.appendChild(panel);
}

const _step47_updateDevUI=updateDevUI;
updateDevUI=function(){
    _step47_updateDevUI();
    appendDevGrowthPanel();
};

// ============================================================================
// STEP 4-8：探索マップ自動ズーム廃止
// STEP 4-9：タイル倍率そのものを固定
const LATER_LAYER_TILE_SIZE = 24;

function applyFixedLaterLayerMapGrid(cols, rows) {
    if (!mapElement) return;

    mapElement.style.gridTemplateColumns =
        'repeat(' + cols + ', ' + LATER_LAYER_TILE_SIZE + 'px)';

    mapElement.style.gridAutoRows =
        LATER_LAYER_TILE_SIZE + 'px';

    mapElement.style.width =
        (cols * LATER_LAYER_TILE_SIZE) + 'px';

    mapElement.style.height =
        (rows * LATER_LAYER_TILE_SIZE) + 'px';

    mapElement.style.minWidth =
        (cols * LATER_LAYER_TILE_SIZE) + 'px';

    mapElement.style.maxWidth =
        (cols * LATER_LAYER_TILE_SIZE) + 'px';
}

function resetLaterLayerMapGrid() {
    if (!mapElement) return;

    mapElement.style.width = '';
    mapElement.style.height = '';
    mapElement.style.minWidth = '';
    mapElement.style.maxWidth = '';
    mapElement.style.gridAutoRows = '';
}

// STEP 4-8：探索マップ自動ズーム廃止
// 画面端でもカメラ表示マス数を固定し、タイル倍率を変化させない。
// ============================================================================
function getFixedCameraBounds(size, centerX, centerY, radius) {
    var viewSize = Math.min(size, radius * 2 + 1);
    var half = Math.floor(viewSize / 2);

    var minX = centerX - half;
    var minY = centerY - half;

    if (minX < 0) minX = 0;
    if (minY < 0) minY = 0;
    if (minX + viewSize > size) minX = size - viewSize;
    if (minY + viewSize > size) minY = size - viewSize;

    minX = Math.max(0, minX);
    minY = Math.max(0, minY);

    return {
        minX: minX,
        maxX: minX + viewSize - 1,
        minY: minY,
        maxY: minY + viewSize - 1,
        cols: viewSize,
        rows: viewSize
    };
}

renderLayer2Map = function() {
    if (!mapElement) return;

    var rt = game.layer2.floorRuntime;
    var size = getLayer2MapSize();
    var camera = getFixedCameraBounds(
        size,
        game.player.x,
        game.player.y,
        LAYER2_CAMERA_RADIUS
    );

    mapElement.innerHTML = '';
    applyFixedLaterLayerMapGrid(camera.cols, camera.rows);

    for (var y = camera.minY; y <= camera.maxY; y++) {
        for (var x = camera.minX; x <= camera.maxX; x++) {
            var t = document.createElement('div');
            t.className = 'tile';

            var explored = game.explored[y] && game.explored[y][x];
            if (!explored) {
                t.classList.add('hidden');
                mapElement.appendChild(t);
                continue;
            }

            if (game.map[y][x] === 'wall') {
                t.classList.add('wall');
                t.textContent = '■';
            } else {
                t.classList.add('floor');
                t.textContent = '・';
            }

            var ore = getOreAt(x, y);
            if (ore && ore.discovered) {
                t.textContent = ore.boss ? '巨' : '鉱';
                t.style.cursor = 'pointer';
                var ty = getOreTypeById(ore.id);
                if (ty) t.style.color = ty.color;
                if (ore.boss) t.style.color = '#ffcf66';
                t.onclick = (function(o) {
                    return function(ev) {
                        ev.stopPropagation();
                        mineOre(o);
                    };
                })(ore);
            }

            var isHere = x === game.player.x && y === game.player.y;

            if (rt.retreat && game.returnPoint.found && x === rt.retreat.x && y === rt.retreat.y) {
                t.textContent = '帰';
                t.style.color = '#ffd84d';
                t.style.fontWeight = 'bold';
                if (isHere) {
                    t.style.cursor = 'pointer';
                    t.onclick = function(ev) {
                        ev.stopPropagation();
                        showLayer2ReturnConfirm();
                    };
                }
            }

            if (game.stairs.found && x === rt.stairs.x && y === rt.stairs.y) {
                var gateLocked = isLayer2GateFloor(game.layer2.currentFloor) && !isLayer2GateOpen(game.layer2.currentFloor);
                t.textContent = gateLocked ? '門' : '階';
                t.style.color = gateLocked ? '#ef6a62' : '#67e667';
                t.style.fontWeight = 'bold';
                if (isHere) {
                    t.style.cursor = 'pointer';
                    t.onclick = function(ev) {
                        ev.stopPropagation();
                        showLayer2StairConfirm();
                    };
                }
            }

            if (rt.healing && rt.healing.exists && rt.healing.found && x === rt.healing.x && y === rt.healing.y) {
                t.textContent = '癒';
                t.style.color = '#73ff9b';
                t.style.fontWeight = 'bold';
                if (isHere) {
                    t.style.cursor = 'pointer';
                    t.onclick = function(ev) {
                        ev.stopPropagation();
                        useLayer2HealingPoint();
                    };
                }
            }

            if (rt.switchPos && rt.switchFound && x === rt.switchPos.x && y === rt.switchPos.y) {
                t.textContent = '制';
                t.style.color = isLayer2GateOpen(game.layer2.currentFloor) ? '#74ff8a' : '#ffca63';
                t.style.fontWeight = 'bold';
                if (isHere) {
                    t.style.cursor = 'pointer';
                    t.onclick = function(ev) {
                        ev.stopPropagation();
                        operateLayer2Switch();
                    };
                }
            }

            if (
                rt.storyPos &&
                isLayer2BossInitiallyDefeated(game.layer2.currentFloor) &&
                !game.layer2.storyItems[game.layer2.currentFloor] &&
                x === rt.storyPos.x &&
                y === rt.storyPos.y
            ) {
                t.textContent = '箱';
                t.style.color = '#9bd5ff';
                t.style.fontWeight = 'bold';
                if (isHere) {
                    t.style.cursor = 'pointer';
                    t.onclick = function(ev) {
                        ev.stopPropagation();
                        collectLayer2StoryItem();
                    };
                }
            }

            if (isHere) {
                t.classList.add('player');
                if (!ore && t.textContent === '・') t.textContent = '●';
            }

            mapElement.appendChild(t);
        }
    }
};

renderCameraMapGeneric = function(size, rad, extra) {
    if (!mapElement) return;

    var camera = getFixedCameraBounds(
        size,
        game.player.x,
        game.player.y,
        rad
    );

    mapElement.innerHTML = '';
    applyFixedLaterLayerMapGrid(camera.cols, camera.rows);

    for (var y = camera.minY; y <= camera.maxY; y++) {
        for (var x = camera.minX; x <= camera.maxX; x++) {
            var t = document.createElement('div');
            t.className = 'tile';

            var explored = game.explored[y] && game.explored[y][x];
            if (!explored) {
                t.classList.add('hidden');
                mapElement.appendChild(t);
                continue;
            }

            if (game.map[y][x] === 'wall') {
                t.classList.add('wall');
                t.textContent = '■';
            } else {
                t.classList.add('floor');
                t.textContent = '・';
            }

            var ore = getOreAt(x, y);
            if (ore && ore.discovered) {
                t.textContent = ore.boss ? '◆' : '鉱';
                var ot = getOreTypeById(ore.id);
                if (ot) t.style.color = ot.color;
                t.style.cursor = 'pointer';
                t.onclick = (function(o) {
                    return function(e) {
                        e.stopPropagation();
                        mineOre(o);
                    };
                })(ore);
            }

            if (extra) extra(t, x, y);

            if (x === game.player.x && y === game.player.y) {
                t.classList.add('player');
                if (t.textContent === '・') t.textContent = '●';
            }

            mapElement.appendChild(t);
        }
    }
};


// ============================================================================
// STEP 4-9：第3層 虚風頻度・ミニマップ・固定倍率の最終補正
// ============================================================================
function renderLayer3FullMinimap_STEP49() {
    if (!minimapElement) return;

    ensureLayer3();

    if (game.layer3.temp.mapOff > 0) {
        minimapElement.innerHTML = '';
        minimapElement.style.display = 'grid';
        return;
    }

    var size = LAYER3_SIZE;
    var maxCells = 50;
    var step = Math.max(1, Math.ceil(size / maxCells));
    var cols = Math.ceil(size / step);

    minimapElement.innerHTML = '';
    minimapElement.style.display = 'grid';
    minimapElement.style.gridTemplateColumns =
        'repeat(' + cols + ', 3px)';

    for (var y = 0; y < size; y += step) {
        for (var x = 0; x < size; x += step) {
            var d = document.createElement('div');
            d.className = 'mini-tile';
            d.style.width = '3px';
            d.style.height = '3px';

            // 第3層は未探索でも地形そのものは最初から見える。
            d.style.background =
                game.map[y][x] === 'wall'
                    ? '#444'
                    : '#999';

            if (
                Math.abs(x - game.player.x) < step &&
                Math.abs(y - game.player.y) < step
            ) {
                d.style.background = '#fff';
                d.classList.add('current');
            }

            minimapElement.appendChild(d);
        }
    }
}

const _step49_renderMinimap = renderMinimap;
renderMinimap = function() {
    if (game.world.currentLayer === 3) {
        return renderLayer3FullMinimap_STEP49();
    }

    return _step49_renderMinimap();
};

// 第1層へ戻った時は後半層用の固定サイズを解除する。
const _step49_renderMap = renderMap;
renderMap = function() {
    if (game.world.currentLayer === 1) {
        resetLaterLayerMapGrid();
    }

    return _step49_renderMap();
};


// ============================================================================
// STEP 4-10：探索インベントリボタン再配置
// ----------------------------------------------------------------------------
// ・画面右下の固定ボタンを廃止
// ・探索ステータス直下／マップ直上に専用アクションバーを配置
// ・ボタンを大きくし、探索中に押しやすくする
// ============================================================================
function placeInventoryButtonForExploration() {
    var button = document.getElementById("inventoryButton");
    if (!button || !mapElement || !mapElement.parentNode) return;

    var bar = document.getElementById("explorationActionBar");

    if (!bar) {
        bar = document.createElement("div");
        bar.id = "explorationActionBar";

        Object.assign(bar.style, {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            boxSizing: "border-box",
            margin: "4px 0 10px",
            padding: "6px 8px",
            background: "rgba(15,18,21,0.72)",
            border: "1px solid #454d55",
            borderRadius: "6px"
        });

        mapElement.parentNode.insertBefore(bar, mapElement);
    }

    if (button.parentNode !== bar) {
        bar.appendChild(button);
    }

    button.textContent = "🎒 インベントリ";

    Object.assign(button.style, {
        position: "static",
        right: "",
        bottom: "",
        left: "",
        top: "",
        zIndex: "",
        margin: "0",
        width: "min(240px, 100%)",
        minWidth: "190px",
        height: "48px",
        minHeight: "48px",
        padding: "0 20px",
        fontSize: "16px",
        fontWeight: "bold",
        letterSpacing: "0.03em",
        borderRadius: "7px",
        cursor: "pointer"
    });

    // 拠点画面中は探索用バーを隠す。
    bar.style.display = game.baseOpen ? "none" : "flex";
}

// 旧STEP 4-5の「右下固定」処理を、新しい探索HUD配置へ差し替える。
applyLayer2InventoryButtonPosition = function() {
    placeInventoryButtonForExploration();
};

// インベントリ更新時にも位置・サイズを維持。
const _step410_updateInventoryUI = updateInventoryUI;
updateInventoryUI = function() {
    var result = _step410_updateInventoryUI();
    placeInventoryButtonForExploration();
    return result;
};

// 描画更新時、拠点⇔探索の切替に合わせて表示状態も更新。
const _step410_render = render;
render = function() {
    var result = _step410_render();
    placeInventoryButtonForExploration();
    return result;
};

placeInventoryButtonForExploration();


// ============================================================================
// STEP 4-11：DEV「階層アクセス確認」→ 実際の解放状態テスト
// ----------------------------------------------------------------------------
// ・各層の「確認」ではなく、通常進行上も解放済みとして扱う
// ・上位層を直接解放した場合、前提となる下位層も順番に解放済みにする
// ・個別ボス、通常チェックポイント、宝箱などは勝手に全クリアしない
// ・第5層解放時のみ、通常前提となる第4層20F通過／掲示板破損を再現
// ============================================================================

function isLayerUnlockedForDev(level) {
    level = Number(level);

    if (level <= 1) return true;

    ensureLayer2DataStructures();
    ensureLayer3();
    ensureLayer4();
    ensureLayer5();

    if (level === 2) return !!game.layer2.unlocked;
    if (level === 3) return !!game.layer3.unlocked;
    if (level === 4) return !!game.layer4.unlocked;
    if (level === 5) return !!game.layer5.unlocked;

    return false;
}

function devUnlockLayerForTest(level) {
    if (!DEV_MODE) return;

    level = Math.max(1, Math.min(MAX_WORLD_LAYER, Math.floor(Number(level) || 1)));

    ensureLayer2DataStructures();
    ensureLayer3();
    ensureLayer4();
    ensureLayer5();

    // 第2層まで到達した直後の状態
    if (level >= 2) {
        game.layer2.unlocked = true;
        game.layer2.checkpoints[1] = true;
        game.layer2.selectedCheckpoint = game.layer2.selectedCheckpoint || 1;
        game.layer2.maxReachedFloor = Math.max(1, game.layer2.maxReachedFloor || 1);
        game.world.maxUnlockedLayer = Math.max(game.world.maxUnlockedLayer, 2);
    }

    // 第3層は零風接続核を作成し、接続が開いた直後として扱う
    if (level >= 3) {
        game.layer2.layer3RecipeKnown = true;
        game.layer2.layer3KeyCrafted = true;

        game.layer3.unlocked = true;
        game.layer3.checkpoints = game.layer3.checkpoints || {1:true};
        game.layer3.checkpoints[1] = true;
        game.world.maxUnlockedLayer = Math.max(game.world.maxUnlockedLayer, 3);
    }

    // 第4層は残光接続核を作成し、接続が開いた直後として扱う
    if (level >= 4) {
        game.layer3.layer4KeyCrafted = true;

        game.layer4.unlocked = true;
        game.layer4.checkpoints = game.layer4.checkpoints || {1:true};
        game.layer4.checkpoints[1] = true;
        game.world.maxUnlockedLayer = Math.max(game.world.maxUnlockedLayer, 4);
    }

    // 第5層は第4層20Fを抜け、夜断ちの楔で接続済みの状態を再現
    if (level >= 5) {
        game.layer4.floor20Cleared = true;
        game.layer4.signboardBroken = true;
        game.layer4.layer5KeyCrafted = true;

        // 夜の帳を一度取得した履歴は残るが、楔作成後なので現物は所持しない。
        game.layer4.nightVeilObtained = true;
        if (game.inventory && game.inventory.items) {
            game.inventory.items.nightVeil = 0;
        }

        game.layer5.unlocked = true;
        game.layer5.maxReachedFloor = Math.max(1001, game.layer5.maxReachedFloor || 1001);
        game.world.maxUnlockedLayer = Math.max(game.world.maxUnlockedLayer, 5);
    }

    // 「開発用アクセス許可」もONにしてDEVワープ等と矛盾しないようにする。
    game.dev.allLayersUnlocked = true;

    // 解放確認は拠点で行う。探索マップへは自動入場しない。
    game.world.currentLayer = 1;

    addLog(
        "【開発】第" + level + "層までを通常進行上も解放済みとして設定しました。"
    );

    setBaseMessage(
        "第" + level + "層までの解放状態を開発用に再現しました。"
    );

    updateLayer2Progress();
    updateAllBaseWindows();
    updateBaseTicker(true);
    updateDevUI();
}

function devUnlockAllLayers() {
    if (!DEV_MODE) return;

    devUnlockLayerForTest(MAX_WORLD_LAYER);

    addLog(
        "【開発】第1～第5層をすべて解放済みとして設定しました。"
    );
}

function upgradeDevLayerUnlockPanel_STEP411() {
    if (!DEV_MODE) return;

    var box = document.getElementById("devWindow");
    if (!box) return;

    // 上部の一括解放ボタンも「アクセス許可」ではなく実解放だと分かる文言へ。
    Array.from(box.querySelectorAll("button")).forEach(function(button) {
        if (
            button.textContent === "全5層を開発用開放" ||
            button.textContent === "全5層を開放"
        ) {
            button.textContent = "全5層を解放状態にする";
        }
    });

    var title = Array.from(box.querySelectorAll("div")).find(function(div) {
        return div.textContent === "【 階層アクセス確認 】";
    });

    if (!title) return;

    title.textContent = "【 階層解放テスト 】";

    var panel = title.parentNode;
    if (!panel) return;

    var rows = panel.querySelectorAll(".dev-layer");

    rows.forEach(function(row, index) {
        var level = index + 1;
        var button = row.querySelector("button");
        var info = row.querySelector("span");

        if (!button) return;

        var unlocked = isLayerUnlockedForDev(level);

        button.disabled = unlocked;
        button.textContent = unlocked ? "解放済" : "解放";

        button.onclick = function(event) {
            event.stopPropagation();
            devUnlockLayerForTest(level);
        };

        if (info) {
            var suffix = unlocked ? "　[解放済]" : "　[未解放]";
            // 既存の [実装済]/[未実装] 表示は残し、その後ろに解放状態を足す。
            if (!info.textContent.includes("[解放済]") &&
                !info.textContent.includes("[未解放]")) {
                info.textContent += suffix;
            }
        }
    });

    var note = document.getElementById("devLayerUnlockNote_STEP411");

    if (!note) {
        note = document.createElement("div");
        note.id = "devLayerUnlockNote_STEP411";
        note.style.cssText =
            "margin-top:8px;font-size:11px;color:#aeb6bd;line-height:1.5;";
        note.textContent =
            "上位層を解放すると前提の下位層も解放済みになります。個別ボスや通常チェックポイントは未攻略のままです。";
        panel.appendChild(note);
    }
}

const _step411_updateDevUI = updateDevUI;
updateDevUI = function() {
    var result = _step411_updateDevUI();
    upgradeDevLayerUnlockPanel_STEP411();
    return result;
};

// 既に開発画面が開いている場合にも即座に反映。
upgradeDevLayerUnlockPanel_STEP411();


// ============================================================================
// STEP 4-12：第3～5層 拠点探索画面
// ----------------------------------------------------------------------------
// 第3層以降に欠けていた正式な拠点探索UIを追加。
// ・第3層：到達済みチェックポイント（1～10F）
// ・第4層：入口 / 6F / 16F
// ・第5層：到達済み1001～1010F
// ============================================================================

function ensureAdvancedSortieSelections_STEP412() {
    ensureLayer3();
    ensureLayer4();
    ensureLayer5();

    var l3 = getLayer3SortieFloors_STEP412();
    if (!l3.includes(Number(game.layer3.selectedCheckpoint))) {
        game.layer3.selectedCheckpoint = l3[0] || 1;
    }

    var l4 = getLayer4SortieFloors_STEP412();
    if (!l4.includes(Number(game.layer4.selectedCheckpoint))) {
        game.layer4.selectedCheckpoint = l4[0] || 1;
    }

    var l5 = getLayer5SortieFloors_STEP412();
    if (!l5.includes(Number(game.layer5.selectedFloor))) {
        game.layer5.selectedFloor = l5[0] || 1001;
    }
}

function getLayer3SortieFloors_STEP412() {
    ensureLayer3();

    var floors = [1];

    Object.keys(game.layer3.checkpoints || {}).forEach(function(key) {
        var f = Number(key);
        if (
            game.layer3.checkpoints[key] &&
            f >= 2 &&
            f <= 10 &&
            floors.indexOf(f) < 0
        ) {
            floors.push(f);
        }
    });

    floors.sort(function(a, b) { return a - b; });
    return floors;
}

function getLayer4SortieFloors_STEP412() {
    ensureLayer4();

    var floors = [1];

    [6, 16].forEach(function(f) {
        if (game.layer4.checkpoints && game.layer4.checkpoints[f]) {
            floors.push(f);
        }
    });

    return floors;
}

function getLayer5SortieFloors_STEP412() {
    ensureLayer5();

    var floors = [];

    Object.keys(game.layer5.reached || {}).forEach(function(key) {
        var f = Number(key);

        if (
            game.layer5.reached[key] &&
            f >= 1001 &&
            f <= 1010 &&
            floors.indexOf(f) < 0
        ) {
            floors.push(f);
        }
    });

    if (floors.indexOf(1001) < 0) {
        floors.push(1001);
    }

    floors.sort(function(a, b) { return a - b; });
    return floors;
}

function moveSortieSelection_STEP412(layer, dir) {
    ensureAdvancedSortieSelections_STEP412();

    var floors;
    var prop;

    if (layer === 3) {
        floors = getLayer3SortieFloors_STEP412();
        prop = "selectedCheckpoint";
    } else if (layer === 4) {
        floors = getLayer4SortieFloors_STEP412();
        prop = "selectedCheckpoint";
    } else if (layer === 5) {
        floors = getLayer5SortieFloors_STEP412();
        prop = "selectedFloor";
    } else {
        return;
    }

    var state =
        layer === 3 ? game.layer3 :
        layer === 4 ? game.layer4 :
        game.layer5;

    var current = Number(state[prop]);
    var index = floors.indexOf(current);

    if (index < 0) index = 0;

    index += dir;

    if (index < 0) index = 0;
    if (index >= floors.length) index = floors.length - 1;

    state[prop] = floors[index];

    updateAdvancedLayerSortiePanels_STEP412();
}

function getSortieLabel_STEP412(layer, floor) {
    if (layer === 3) {
        return floor === 1
            ? "無風回廊入口（1F）"
            : "第" + floor + "階層チェックポイント";
    }

    if (layer === 4) {
        if (floor === 1) return "残光遺跡入口（1F）";
        if (floor === 6) return "第1中継点（6F）";
        if (floor === 16) return "第2中継点（16F）";
    }

    if (layer === 5) {
        return "通常鉱山 " + floor + "F";
    }

    return String(floor);
}

function startAdvancedLayerFromBase_STEP412(layer) {
    if (!game.baseOpen) return;

    ensureAdvancedSortieSelections_STEP412();

    if (layer === 3) {
        if (!game.layer3.unlocked) return;

        var f3 = Number(game.layer3.selectedCheckpoint || 1);
        if (getLayer3SortieFloors_STEP412().indexOf(f3) < 0) return;

        game.player.hp = game.player.maxHp;
        clearExpeditionBag();
        hideBase();
        enterLayer3Floor(f3);
        return;
    }

    if (layer === 4) {
        if (!game.layer4.unlocked) return;

        var f4 = Number(game.layer4.selectedCheckpoint || 1);
        if (getLayer4SortieFloors_STEP412().indexOf(f4) < 0) return;

        game.player.hp = game.player.maxHp;
        clearExpeditionBag();
        hideBase();
        enterLayer4Floor(f4);
        return;
    }

    if (layer === 5) {
        if (!game.layer5.unlocked) return;

        var f5 = Number(game.layer5.selectedFloor || 1001);
        if (getLayer5SortieFloors_STEP412().indexOf(f5) < 0) return;

        game.player.hp = game.player.maxHp;
        clearExpeditionBag();
        hideBase();
        enterLayer5Floor(f5);
    }
}

function createAdvancedSortiePanel_STEP412(layer, title, accent, currentFloor) {
    var panel = document.createElement("div");
    panel.id = "layer" + layer + "BasePanel_STEP412";

    Object.assign(panel.style, {
        marginTop: "10px",
        padding: "10px",
        border: "1px solid " + accent,
        borderRadius: "5px",
        background: "rgba(8,10,14,.62)"
    });

    var heading = document.createElement("div");
    heading.textContent = "【 " + title + " 探索地点 】";
    heading.style.fontWeight = "bold";
    heading.style.color = accent;
    panel.appendChild(heading);

    var selector = document.createElement("div");

    Object.assign(selector.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        marginTop: "8px"
    });

    var previous = document.createElement("button");
    previous.textContent = "◀";
    previous.style.minWidth = "42px";
    previous.style.height = "34px";
    previous.onclick = function(event) {
        event.stopPropagation();
        moveSortieSelection_STEP412(layer, -1);
    };

    var display = document.createElement("div");
    display.textContent = getSortieLabel_STEP412(layer, currentFloor);

    Object.assign(display.style, {
        minWidth: "210px",
        padding: "7px 12px",
        border: "1px solid #4c5661",
        borderRadius: "5px",
        background: "#090c10",
        textAlign: "center",
        fontWeight: "bold"
    });

    var next = document.createElement("button");
    next.textContent = "▶";
    next.style.minWidth = "42px";
    next.style.height = "34px";
    next.onclick = function(event) {
        event.stopPropagation();
        moveSortieSelection_STEP412(layer, 1);
    };

    var floors =
        layer === 3 ? getLayer3SortieFloors_STEP412() :
        layer === 4 ? getLayer4SortieFloors_STEP412() :
        getLayer5SortieFloors_STEP412();

    var index = floors.indexOf(Number(currentFloor));
    previous.disabled = index <= 0;
    next.disabled = index < 0 || index >= floors.length - 1;

    selector.appendChild(previous);
    selector.appendChild(display);
    selector.appendChild(next);
    panel.appendChild(selector);

    var start = document.createElement("button");
    start.textContent = title + "へ探索";

    Object.assign(start.style, {
        marginTop: "8px",
        minWidth: "190px",
        padding: "9px 18px",
        fontWeight: "bold"
    });

    start.onclick = function(event) {
        event.stopPropagation();
        startAdvancedLayerFromBase_STEP412(layer);
    };

    panel.appendChild(start);

    var sub = document.createElement("div");
    sub.style.cssText =
        "margin-top:6px;font-size:11px;color:#9aa1a8;";

    if (layer === 3) {
        sub.textContent =
            "到達済み階層の入口から再探索できます。";
    } else if (layer === 4) {
        sub.textContent =
            "取得済みの固定チェックポイントから再探索できます。";
    } else {
        sub.textContent =
            "一度到達した階層の入口から再探索できます。";
    }

    panel.appendChild(sub);

    return panel;
}

function updateAdvancedLayerSortiePanels_STEP412() {
    ensureAdvancedSortieSelections_STEP412();

    [3, 4, 5].forEach(function(layer) {
        var old =
            document.getElementById(
                "layer" + layer + "BasePanel_STEP412"
            );

        if (old) old.remove();
    });

    var depth = document.getElementById("depthObservationBox");
    if (!depth || !depth.parentNode) return;

    var anchor =
        document.getElementById("layer2BasePanel") || depth;

    function insertAfterAnchor(panel) {
        anchor.parentNode.insertBefore(panel, anchor.nextSibling);
        anchor = panel;
    }

    if (game.layer3.unlocked) {
        insertAfterAnchor(
            createAdvancedSortiePanel_STEP412(
                3,
                "無風回廊",
                "#9edfff",
                game.layer3.selectedCheckpoint || 1
            )
        );
    }

    if (game.layer4.unlocked) {
        insertAfterAnchor(
            createAdvancedSortiePanel_STEP412(
                4,
                "残光遺跡",
                "#d7bbff",
                game.layer4.selectedCheckpoint || 1
            )
        );
    }

    if (game.layer5.unlocked) {
        insertAfterAnchor(
            createAdvancedSortiePanel_STEP412(
                5,
                "虚夜空間",
                "#e7e7f3",
                game.layer5.selectedFloor || 1001
            )
        );
    }
}

// 拠点更新時に必ず第3～5層の探索UIも再構築する。
const _step412_updateBaseUI = updateBaseUI;
updateBaseUI = function() {
    var result = _step412_updateBaseUI();
    updateAdvancedLayerSortiePanels_STEP412();
    return result;
};

// 解放・ロード直後にも表示が確実に更新されるようにする。
const _step412_updateAllBaseWindows = updateAllBaseWindows;
updateAllBaseWindows = function() {
    var result = _step412_updateAllBaseWindows();
    updateAdvancedLayerSortiePanels_STEP412();
    return result;
};

updateAdvancedLayerSortiePanels_STEP412();


// ============================================================================
// STEP 4-13：DEV 採掘力∞ / 体力∞ + 初期化確認画面
// ============================================================================

function ensureDevInfiniteFlags_STEP413() {
    if (!game.dev) game.dev = {};
    if (game.dev.infiniteMining === undefined) game.dev.infiniteMining = false;
    if (game.dev.infiniteHealth === undefined) game.dev.infiniteHealth = false;
}

function devInfiniteMining_STEP413() {
    ensureDevInfiniteFlags_STEP413();
    return !!(DEV_MODE && game.dev.infiniteMining);
}

function devInfiniteHealth_STEP413() {
    ensureDevInfiniteFlags_STEP413();
    return !!(DEV_MODE && game.dev.infiniteHealth);
}

function toggleDevInfiniteMining_STEP413() {
    if (!DEV_MODE) return;
    ensureDevInfiniteFlags_STEP413();
    game.dev.infiniteMining = !game.dev.infiniteMining;
    addLog(
        game.dev.infiniteMining
            ? "【開発】採掘力∞をONにしました。通常の鉱石・ボス鉱石は一撃で破壊できます。"
            : "【開発】採掘力∞をOFFにしました。"
    );
    updateAllBaseWindows();
    updateDevUI();
}

function toggleDevInfiniteHealth_STEP413() {
    if (!DEV_MODE) return;
    ensureDevInfiniteFlags_STEP413();
    game.dev.infiniteHealth = !game.dev.infiniteHealth;

    if (game.dev.infiniteHealth) {
        game.dead = false;
        game.player.hp = game.player.maxHp;
    }

    addLog(
        game.dev.infiniteHealth
            ? "【開発】体力∞をONにしました。HPダメージを無効化します。"
            : "【開発】体力∞をOFFにしました。"
    );
    render();
    updateAllBaseWindows();
    updateDevUI();
}

function appendDevInfinitePanel_STEP413() {
    if (!DEV_MODE) return;
    ensureDevInfiniteFlags_STEP413();

    var box = document.getElementById("devWindow");
    if (!box || document.getElementById("devInfinitePanel_STEP413")) return;

    var panel = document.createElement("div");
    panel.id = "devInfinitePanel_STEP413";
    panel.className = "dev-panel";

    var title = document.createElement("div");
    title.textContent = "【 無限テスト 】";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "8px";
    panel.appendChild(title);

    var status = document.createElement("div");
    status.style.cssText =
        "font-size:11px;color:#aeb6bd;margin-bottom:8px;line-height:1.5;";
    status.innerHTML =
        "採掘力∞：<b>" + (game.dev.infiniteMining ? "ON" : "OFF") + "</b>" +
        "　／　体力∞：<b>" + (game.dev.infiniteHealth ? "ON" : "OFF") + "</b>";
    panel.appendChild(status);

    var miningButton = document.createElement("button");
    miningButton.textContent =
        game.dev.infiniteMining ? "採掘力∞をOFF" : "採掘力∞をON";
    miningButton.style.marginRight = "7px";
    miningButton.onclick = function(event) {
        event.stopPropagation();
        toggleDevInfiniteMining_STEP413();
    };
    panel.appendChild(miningButton);

    var hpButton = document.createElement("button");
    hpButton.textContent =
        game.dev.infiniteHealth ? "体力∞をOFF" : "体力∞をON";
    hpButton.onclick = function(event) {
        event.stopPropagation();
        toggleDevInfiniteHealth_STEP413();
    };
    panel.appendChild(hpButton);

    var note = document.createElement("div");
    note.style.cssText =
        "margin-top:7px;font-size:10px;color:#8f989f;line-height:1.5;";
    note.textContent =
        "体力∞はHPダメージのみ無効。残光0などHP以外の敗北条件は通常どおりです。";
    panel.appendChild(note);

    var closeButton = Array.from(box.querySelectorAll("button")).find(
        function(button) { return button.textContent === "閉じる"; }
    );

    if (closeButton) box.insertBefore(panel, closeButton);
    else box.appendChild(panel);
}

const _step413_updateDevUI = updateDevUI;
updateDevUI = function() {
    _step413_updateDevUI();
    appendDevInfinitePanel_STEP413();
};

// 共通ダメージ
const _step413_applyDamage = applyDamage;
applyDamage = function(damage, message) {
    if (devInfiniteHealth_STEP413()) {
        game.dead = false;
        game.player.hp = game.player.maxHp;
        if (message) addLog(message);
        addLog("【開発】体力∞によりHPダメージを無効化しました。");
        render();
        return false;
    }
    return _step413_applyDamage(damage, message);
};

// 第2層ダメージ
const _step413_layer2ApplyDamage = layer2ApplyDamage;
layer2ApplyDamage = function(amount, text) {
    if (devInfiniteHealth_STEP413()) {
        game.dead = false;
        game.player.hp = game.player.maxHp;
        if (text) addLog(text);
        addLog("【開発】体力∞によりHPダメージを無効化しました。");
        return false;
    }
    return _step413_layer2ApplyDamage(amount, text);
};

// 第3～5層ダメージ
const _step413_damageLaterLayer = damageLaterLayer;
damageLaterLayer = function(amount, text) {
    if (devInfiniteHealth_STEP413()) {
        game.dead = false;
        game.player.hp = game.player.maxHp;
        if (text) addLog(text);
        addLog("【開発】体力∞によりHPダメージを無効化しました。");
        return false;
    }
    return _step413_damageLaterLayer(amount, text);
};

// ---------------------------------------------------------------------------
// 初期化確認画面
// ---------------------------------------------------------------------------
function executeSaveReset_STEP413() {
    try {
        localStorage.removeItem(SAVE_KEY);
    } catch (error) {
        console.error(error);
    }
    window.location.reload();
}

function closeResetConfirm_STEP413() {
    var overlay = document.getElementById("resetConfirmOverlay_STEP413");
    if (overlay) overlay.remove();
}

function showResetConfirm_STEP413() {
    if (!game.baseOpen) return;

    closeResetConfirm_STEP413();

    var overlay = document.createElement("div");
    overlay.id = "resetConfirmOverlay_STEP413";

    Object.assign(overlay.style, {
        position: "fixed",
        inset: "0",
        zIndex: "99999",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,.72)"
    });

    var dialog = document.createElement("div");
    Object.assign(dialog.style, {
        width: "min(430px, calc(100vw - 32px))",
        padding: "20px",
        boxSizing: "border-box",
        background: "#11161b",
        border: "2px solid #8b4545",
        borderRadius: "8px",
        boxShadow: "0 12px 40px rgba(0,0,0,.65)",
        textAlign: "center"
    });

    var title = document.createElement("div");
    title.textContent = "データ初期化";
    Object.assign(title.style, {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#ffb2b2",
        marginBottom: "12px"
    });
    dialog.appendChild(title);

    var message = document.createElement("div");
    message.innerHTML =
        "セーブデータを初期化します。<br>" +
        "すべての進行状況が失われます。<br>" +
        "<b>この操作は元に戻せません。</b>";
    Object.assign(message.style, {
        lineHeight: "1.8",
        marginBottom: "18px"
    });
    dialog.appendChild(message);

    var buttons = document.createElement("div");
    Object.assign(buttons.style, {
        display: "flex",
        gap: "10px",
        justifyContent: "center"
    });

    var cancel = document.createElement("button");
    cancel.textContent = "キャンセル";
    Object.assign(cancel.style, {
        minWidth: "130px",
        padding: "10px 14px"
    });
    cancel.onclick = function(event) {
        event.stopPropagation();
        closeResetConfirm_STEP413();
    };

    var reset = document.createElement("button");
    reset.textContent = "初期化する";
    Object.assign(reset.style, {
        minWidth: "130px",
        padding: "10px 14px",
        borderColor: "#a94e4e",
        color: "#ffd0d0",
        fontWeight: "bold"
    });
    reset.onclick = function(event) {
        event.stopPropagation();
        executeSaveReset_STEP413();
    };

    buttons.appendChild(cancel);
    buttons.appendChild(reset);
    dialog.appendChild(buttons);
    overlay.appendChild(dialog);

    overlay.onclick = function(event) {
        if (event.target === overlay) closeResetConfirm_STEP413();
    };

    document.body.appendChild(overlay);
}

// 既存のブラウザconfirmではなく、ゲーム内確認画面へ置換。
resetSaveData = function() {
    showResetConfirm_STEP413();
};

ensureDevInfiniteFlags_STEP413();



// ============================================================================
// STEP 4-15：第2層 接続研究表示改善 ＋ 100F最深部を帰還ポイント化
// ============================================================================

// ---------------------------------------------------------------------------
// 第2層解放前：接続研究の進行状況を明示
// ---------------------------------------------------------------------------
function renderLayer2ConnectionResearch_STEP415() {
    var box = document.getElementById("depthObservationBox");
    if (!box) return;

    var flags = game.progressFlags || {};
    var record =
        game.records &&
        game.records.ores &&
        game.records.ores.godSteel
            ? game.records.ores.godSteel
            : null;

    var returned = record ? Number(record.returned || 0) : 0;

    box.innerHTML = "";

    var title = document.createElement("div");
    title.textContent = "【 深 度 観 測 】";
    Object.assign(title.style, {
        marginBottom: "7px",
        color: "#b5a2ff",
        fontWeight: "bold",
        letterSpacing: "1px"
    });
    box.appendChild(title);

    var status = document.createElement("div");
    status.style.fontWeight = "bold";
    status.style.color = "#d1c5ff";
    box.appendChild(status);

    var main = document.createElement("div");
    main.style.marginTop = "5px";
    box.appendChild(main);

    var sub = document.createElement("div");
    sub.style.marginTop = "5px";
    sub.style.fontSize = "11px";
    sub.style.color = "#a7adb5";
    box.appendChild(sub);

    // まだ最深部異常を確認していない。
    if (!flags.layer2AnomalyDetected) {
        status.textContent = "接続研究：未開始";
        main.textContent =
            "鉱山最深部から微弱な異常反応を検出しています。";
        sub.textContent =
            "まず通常鉱山の最深部を調査してください。";
        return;
    }

    // 神鋼鉱1個を持ち帰り、共鳴を確認する段階。
    if (!flags.layer2ResonanceDetected) {
        status.textContent =
            "共鳴確認：" +
            Math.min(returned, LAYER2_RESONANCE_REQUIREMENT) +
            " / " +
            LAYER2_RESONANCE_REQUIREMENT;

        main.textContent =
            "神鋼鉱と異常反応の共鳴を確認しています。";

        sub.textContent =
            "神鋼鉱を持ち帰ることで観測データを取得できます。";
        return;
    }

    // 累計10個までは研究開始用のデータ収集。
    if (!flags.layer2ResearchStarted) {
        status.textContent =
            "接続研究準備：" +
            Math.min(returned, LAYER2_RESEARCH_REQUIREMENT) +
            " / " +
            LAYER2_RESEARCH_REQUIREMENT;

        main.textContent =
            "神鋼鉱の共鳴データを収集中です。";

        sub.textContent =
            "累計" +
            LAYER2_RESEARCH_REQUIREMENT +
            "個の持ち帰りデータで接続研究を開始できます。";
        return;
    }

    // 10～29個：接続条件を解析中。
    if (!flags.layer2RequirementsKnown) {
        status.textContent =
            "接続研究：" +
            Math.min(returned, LAYER2_REQUIREMENTS_REVEAL) +
            " / " +
            LAYER2_REQUIREMENTS_REVEAL;

        main.textContent =
            "異常反応の接続条件を解析しています。";

        sub.textContent =
            "累計" +
            LAYER2_REQUIREMENTS_REVEAL +
            "個の神鋼鉱データで解析完了。";
        return;
    }

    // 解析完了：実際の接続資材を明示。
    status.textContent = "接続研究：完了";
    main.textContent =
        "反応源への接続条件を確認しました。";

    sub.remove();

    var oreOwned =
        game.warehouse &&
        game.warehouse.ores
            ? Number(game.warehouse.ores.godSteel || 0)
            : 0;

    var req = document.createElement("div");
    req.style.cssText =
        "margin-top:7px;line-height:1.7;font-size:12px;";

    req.innerHTML =
        "神鋼鉱：" +
        oreOwned +
        " / " +
        LAYER2_UNLOCK_GODSTEEL +
        "<br>" +
        "所持金：" +
        Number(game.money || 0).toLocaleString() +
        " / " +
        Number(LAYER2_UNLOCK_MONEY).toLocaleString() +
        " G";

    box.appendChild(req);

    var button = document.createElement("button");
    button.textContent = "旧坑道へ接続する";
    button.disabled = !canAttemptLayer2Connection();
    button.style.marginTop = "8px";

    button.onclick = function(event) {
        event.stopPropagation();
        attemptLayer2Connection();
    };

    box.appendChild(button);
}

const _step415_updateDepthObservationUI = updateDepthObservationUI;
updateDepthObservationUI = function() {
    ensureLayer2DataStructures();

    // 第2層解放前だけ新しい研究進捗表示を使う。
    // 解放後および第3層以降の深度観測は従来処理を維持。
    if (!game.layer2.unlocked) {
        return renderLayer2ConnectionResearch_STEP415();
    }

    return _step415_updateDepthObservationUI();
};


// ---------------------------------------------------------------------------
// 100F：階段の位置を「最深部帰還ポイント」として使用
// ---------------------------------------------------------------------------
function setupLayer2Floor100Return_STEP415() {
    if (
        !isLayer2Active() ||
        game.layer2.currentFloor !== 100 ||
        !game.layer2.floorRuntime
    ) {
        return;
    }

    var rt = game.layer2.floorRuntime;

    // ボス階の奥に元々存在した階段座標を、そのまま帰還地点へ転用。
    if (!rt.finalReturnPoint) {
        rt.finalReturnPoint = {
            x: rt.stairs.x,
            y: rt.stairs.y
        };
    }

    rt.retreat = {
        x: rt.finalReturnPoint.x,
        y: rt.finalReturnPoint.y
    };

    game.returnPoint = {
        x: rt.finalReturnPoint.x,
        y: rt.finalReturnPoint.y,
        found: false
    };

    // 内部の経路計算用に rt.stairs 座標は残すが、
    // 100Fでは階段オブジェクトとしては使用しない。
    game.stairs.found = false;

    updateLayer2Vision();
}

const _step415_enterLayer2Floor = enterLayer2Floor;
enterLayer2Floor = function(floor, fromCheckpoint) {
    var result =
        _step415_enterLayer2Floor(
            floor,
            fromCheckpoint
        );

    if (Number(floor) === 100) {
        setupLayer2Floor100Return_STEP415();
        render();
    }

    return result;
};


// 100F帰還地点では、記録品回収前の帰還を止める。
function tryLayer2Floor100Return_STEP415() {
    if (
        game.layer2.currentFloor !== 100 ||
        !game.returnPoint.found ||
        game.player.x !== game.returnPoint.x ||
        game.player.y !== game.returnPoint.y
    ) {
        return false;
    }

    if (layer2InteractionBlocked()) {
        addLog(
            "不穏のため帰還操作ができない。 " +
            layer2UneaseText()
        );
        return true;
    }

    if (!isLayer2BossInitiallyDefeated(100)) {
        addLog(
            "巨大な鉱塊が帰還地点への経路を塞いでいる。"
        );
        return true;
    }

    if (!game.layer2.storyItems[100]) {
        addLog(
            "奥に未回収の記録が残されている。"
        );
        return true;
    }

    showReturnConfirm();
    return true;
}

const _step415_interactLayer2CurrentTile =
    interactLayer2CurrentTile;

interactLayer2CurrentTile = function() {
    if (
        isLayer2Active() &&
        game.layer2.currentFloor === 100 &&
        game.player.x === game.returnPoint.x &&
        game.player.y === game.returnPoint.y
    ) {
        return tryLayer2Floor100Return_STEP415();
    }

    return _step415_interactLayer2CurrentTile();
};


// 100Fでは「階」表示を完全に隠し、「帰」だけ描画する。
// 元描画を使うことで固定カメラなど既存処理を維持。
const _step415_renderLayer2Map =
    renderLayer2Map;

renderLayer2Map = function() {
    if (
        game.layer2.currentFloor !== 100
    ) {
        return _step415_renderLayer2Map();
    }

    var oldStairFound =
        game.stairs.found;

    game.stairs.found = false;

    var result =
        _step415_renderLayer2Map();

    game.stairs.found =
        oldStairFound;

    // 「帰」タイルのクリック処理だけ100F専用条件に差し替える。
    if (
        mapElement &&
        game.returnPoint.found
    ) {
        var rt = game.layer2.floorRuntime;
        var camera = getFixedCameraBounds(
            getLayer2MapSize(),
            game.player.x,
            game.player.y,
            LAYER2_CAMERA_RADIUS
        );

        if (
            rt.retreat &&
            rt.retreat.x >= camera.minX &&
            rt.retreat.x <= camera.maxX &&
            rt.retreat.y >= camera.minY &&
            rt.retreat.y <= camera.maxY
        ) {
            var col =
                rt.retreat.x -
                camera.minX;

            var row =
                rt.retreat.y -
                camera.minY;

            var index =
                row * camera.cols +
                col;

            var tile =
                mapElement.children[index];

            if (
                tile &&
                game.player.x === rt.retreat.x &&
                game.player.y === rt.retreat.y
            ) {
                tile.onclick = function(event) {
                    event.stopPropagation();
                    tryLayer2Floor100Return_STEP415();
                };
            }
        }
    }

    return result;
};


// ミニマップも100Fでは緑の階段マークを出さない。
const _step415_renderLayer2Minimap =
    renderLayer2Minimap;

renderLayer2Minimap = function() {
    if (
        game.layer2.currentFloor !== 100
    ) {
        return _step415_renderLayer2Minimap();
    }

    var oldStairFound =
        game.stairs.found;

    game.stairs.found = false;

    var result =
        _step415_renderLayer2Minimap();

    game.stairs.found =
        oldStairFound;

    return result;
};


// 探知機・DEV全表示などで stairs.found がONになっても、
// 100Fの通常描画では階段として扱わない。
const _step415_showLayer2StairConfirm =
    showLayer2StairConfirm;

showLayer2StairConfirm = function() {
    if (
        isLayer2Active() &&
        game.layer2.currentFloor === 100
    ) {
        return tryLayer2Floor100Return_STEP415();
    }

    return _step415_showLayer2StairConfirm();
};



// ============================================================================
// STEP 4-16
// ・通常鉱山100Fの階段を廃止
// ・DEV鉱石付与を第2層接続研究の持ち帰り実績として扱う
// ・DEV接続研究の段階進行ボタン
// ・DEV専用「進行地点ワープ」
// ============================================================================


// ---------------------------------------------------------------------------
// 通常鉱山100F：階段なし
// ---------------------------------------------------------------------------
function removeLayer1Floor100Stairs_STEP416() {
    if (
        game.world.currentLayer === 1 &&
        Number(game.currentMineLevel) === 100
    ) {
        game.stairs.x = -999;
        game.stairs.y = -999;
        game.stairs.found = false;
    }
}

const _step416_generateMineFloor = generateMineFloor;
generateMineFloor = function() {
    var result = _step416_generateMineFloor();

    removeLayer1Floor100Stairs_STEP416();

    if (
        game.world.currentLayer === 1 &&
        Number(game.currentMineLevel) === 100
    ) {
        render();
    }

    return result;
};

const _step416_discoverNearbyStairs = discoverNearbyStairs;
discoverNearbyStairs = function() {
    if (
        game.world.currentLayer === 1 &&
        Number(game.currentMineLevel) === 100
    ) {
        game.stairs.found = false;
        return;
    }

    return _step416_discoverNearbyStairs();
};

const _step416_revealFullMapForTesting = revealFullMapForTesting;
revealFullMapForTesting = function() {
    var result = _step416_revealFullMapForTesting();

    removeLayer1Floor100Stairs_STEP416();

    return result;
};

const _step416_devRevealCurrentMap = devRevealCurrentMap;
devRevealCurrentMap = function() {
    var result = _step416_devRevealCurrentMap();

    removeLayer1Floor100Stairs_STEP416();

    return result;
};


// ---------------------------------------------------------------------------
// DEV：全鉱石付与を「持ち帰った」扱いにもする
// ---------------------------------------------------------------------------
const _step416_devGiveAllOres = devGiveAllOres;
devGiveAllOres = function() {
    _step416_devGiveAllOres();

    if (!DEV_MODE) return;

    ORE_TYPES.forEach(function(type) {
        if (!game.records.ores[type.id]) {
            game.records.ores[type.id] = {
                discovered: true,
                mined: 0,
                returned: 0
            };
        }

        game.records.ores[type.id].discovered = true;

        game.records.ores[type.id].returned =
            Math.max(
                Number(game.records.ores[type.id].returned || 0),
                DEV_ORE_AMOUNT
            );
    });

    // 神鋼鉱999個をDEVで所持した場合も、研究用の持ち帰りデータとして扱う。
    updateLayer2Progress();
    updateAllBaseWindows();
    updateDevUI();

    addLog(
        "【開発】付与した鉱石を累計持ち帰り実績として反映しました。"
    );
};


// ---------------------------------------------------------------------------
// DEV：第2層接続研究を任意段階まで進める
// ---------------------------------------------------------------------------
function devAdvanceLayer2Research_STEP416(stage) {
    if (!DEV_MODE) return;

    ensureLayer2DataStructures();

    if (!game.records.ores.godSteel) {
        game.records.ores.godSteel = {
            discovered: true,
            mined: 0,
            returned: 0
        };
    }

    var record = game.records.ores.godSteel;
    record.discovered = true;

    // DEV研究確認なので通常鉱山最深部到達も疑似的に満たす。
    game.maxUnlockedMineLevel =
        Math.max(
            Number(game.maxUnlockedMineLevel || 1),
            MAX_MINE_LEVEL
        );

    game.progressFlags.layer2AnomalyDetected = true;

    if (stage >= 1) {
        record.returned =
            Math.max(
                Number(record.returned || 0),
                LAYER2_RESONANCE_REQUIREMENT
            );
    }

    if (stage >= 2) {
        record.returned =
            Math.max(
                Number(record.returned || 0),
                LAYER2_RESEARCH_REQUIREMENT
            );
    }

    if (stage >= 3) {
        record.returned =
            Math.max(
                Number(record.returned || 0),
                LAYER2_REQUIREMENTS_REVEAL
            );
    }

    updateLayer2Progress();
    updateAllBaseWindows();
    updateDevUI();

    var labels = {
        1: "共鳴確認",
        2: "研究開始",
        3: "接続条件解析完了"
    };

    addLog(
        "【開発】第2層接続研究を「" +
        labels[stage] +
        "」まで進めました。"
    );
}

function appendLayer2ResearchDevButtons_STEP416() {
    if (!DEV_MODE) return;

    var box = document.getElementById("devWindow");
    if (!box) return;

    var old = document.getElementById(
        "devLayer2ResearchPanel_STEP416"
    );

    if (old) old.remove();

    var panel = document.createElement("div");
    panel.id = "devLayer2ResearchPanel_STEP416";
    panel.className = "dev-panel";

    var title = document.createElement("div");
    title.textContent = "【 第2層 接続研究テスト 】";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "8px";
    panel.appendChild(title);

    var info = document.createElement("div");
    var rec =
        game.records &&
        game.records.ores &&
        game.records.ores.godSteel
            ? Number(game.records.ores.godSteel.returned || 0)
            : 0;

    info.textContent =
        "神鋼鉱 累計持ち帰り：" + rec;

    info.style.cssText =
        "font-size:11px;color:#aeb6bd;margin-bottom:7px;";
    panel.appendChild(info);

    [
        [1, "共鳴確認まで進める"],
        [2, "研究開始まで進める"],
        [3, "接続条件解析まで進める"]
    ].forEach(function(data) {
        var b = document.createElement("button");
        b.textContent = data[1];
        b.style.margin = "0 6px 6px 0";
        b.onclick = function(event) {
            event.stopPropagation();
            devAdvanceLayer2Research_STEP416(data[0]);
        };
        panel.appendChild(b);
    });

    var note = document.createElement("div");
    note.textContent =
        "通常プレイの条件は変更せず、DEV時のみ研究段階を疑似進行できます。";
    note.style.cssText =
        "font-size:10px;color:#8f989f;margin-top:3px;";
    panel.appendChild(note);

    var closeButton =
        Array.from(box.querySelectorAll("button"))
            .find(function(button) {
                return button.textContent === "閉じる";
            });

    if (closeButton) {
        box.insertBefore(panel, closeButton);
    } else {
        box.appendChild(panel);
    }
}


// ---------------------------------------------------------------------------
// DEV専用アイテム：進行地点ワープ
// ---------------------------------------------------------------------------
function getCurrentMapSize_STEP416() {
    if (game.world.currentLayer === 1) {
        return MAP_SIZE;
    }

    if (
        game.world.currentLayer === 2 &&
        game.layer2 &&
        game.layer2.floorRuntime
    ) {
        return getLayer2MapSize();
    }

    if (
        game.world.currentLayer === 3 &&
        game.layer3 &&
        game.layer3.runtime
    ) {
        return game.layer3.runtime.size || LAYER3_SIZE;
    }

    if (
        game.world.currentLayer === 4 &&
        game.layer4 &&
        game.layer4.runtime
    ) {
        return game.layer4.runtime.size || LAYER4_SIZE;
    }

    if (
        game.world.currentLayer === 5 &&
        game.layer5 &&
        game.layer5.runtime
    ) {
        return game.layer5.runtime.size || LAYER5_SIZE;
    }

    return 0;
}

function getDevWarpTarget_STEP416() {
    var layer = game.world.currentLayer;

    if (layer === 1) {
        if (Number(game.currentMineLevel) === 100) {
            return {
                x: game.returnPoint.x,
                y: game.returnPoint.y,
                name: "帰還地点"
            };
        }

        return {
            x: game.stairs.x,
            y: game.stairs.y,
            name: "階段"
        };
    }

    if (layer === 2) {
        var f2 = Number(game.layer2.currentFloor);
        var rt2 = game.layer2.floorRuntime;

        if (f2 === 100) {
            return {
                x: game.returnPoint.x,
                y: game.returnPoint.y,
                name: "最深部帰還地点"
            };
        }

        // 9/19/.../99Fでゲート未開放なら、先に制御スイッチ側へ。
        if (
            isLayer2GateFloor(f2) &&
            !isLayer2GateOpen(f2) &&
            rt2.switchPos
        ) {
            return {
                x: rt2.switchPos.x,
                y: rt2.switchPos.y,
                name: "制御スイッチ"
            };
        }

        // ボスが残っている場合はボス前まで。奥の階段へは飛び越えない。
        var boss2 = game.ores.find(function(o) {
            return o.boss;
        });

        if (boss2) {
            return {
                x: boss2.x,
                y: boss2.y,
                name: "巨大鉱塊"
            };
        }

        return {
            x: game.stairs.x,
            y: game.stairs.y,
            name: "階段"
        };
    }

    if (layer === 3) {
        var boss3 = game.ores.find(function(o) {
            return o.worldLayer === 3 && o.boss;
        });

        if (boss3) {
            return {
                x: boss3.x,
                y: boss3.y,
                name: "回廊結晶群"
            };
        }

        return {
            x: game.layer3.runtime.stairs.x,
            y: game.layer3.runtime.stairs.y,
            name: "階段"
        };
    }

    if (layer === 4) {
        var rt4 = game.layer4.runtime;

        if (
            Number(game.layer4.currentFloor) === 16 &&
            rt4.veil &&
            !game.layer4.nightVeilObtained
        ) {
            return {
                x: rt4.veil.x,
                y: rt4.veil.y,
                name: "夜の帳"
            };
        }

        return {
            x: rt4.stairs.x,
            y: rt4.stairs.y,
            name:
                rt4.special === "final"
                    ? "最終ゲート"
                    : "階段"
        };
    }

    if (layer === 5) {
        var rt5 = game.layer5.runtime;

        if (
            Number(game.layer5.currentFloor) === 1006 &&
            !game.stairs.found &&
            game.ores.length > 0
        ) {
            var ore5 = game.ores[0];

            return {
                x: ore5.x,
                y: ore5.y,
                name: "現在の鉱石群"
            };
        }

        if (
            Number(game.layer5.currentFloor) === 1010 &&
            rt5.finalRock
        ) {
            return {
                x: rt5.finalRock.x,
                y: rt5.finalRock.y,
                name: "最深部"
            };
        }

        return {
            x: rt5.stairs.x,
            y: rt5.stairs.y,
            name: "階段"
        };
    }

    return null;
}

function getDevWarpBlockedKeys_STEP416() {
    var blocked = {};

    // ボス鉱石そのものは通過不可として扱う。
    (game.ores || []).forEach(function(ore) {
        if (ore && ore.boss) {
            blocked[ore.x + "," + ore.y] = true;
        }
    });

    return blocked;
}

function findNearestReachableToTarget_STEP416(target) {
    var size = getCurrentMapSize_STEP416();

    if (
        !target ||
        !size ||
        !game.map ||
        !game.map.length
    ) {
        return null;
    }

    var start = {
        x: game.player.x,
        y: game.player.y
    };

    var blocked = getDevWarpBlockedKeys_STEP416();
    var queue = [start];
    var head = 0;
    var visited = {};
    visited[start.x + "," + start.y] = true;

    var best = start;
    var bestDistance =
        Math.abs(start.x - target.x) +
        Math.abs(start.y - target.y);

    var directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ];

    while (head < queue.length) {
        var p = queue[head++];

        var d =
            Math.abs(p.x - target.x) +
            Math.abs(p.y - target.y);

        if (d < bestDistance) {
            best = p;
            bestDistance = d;

            if (bestDistance <= 1) {
                break;
            }
        }

        for (var i = 0; i < directions.length; i++) {
            var nx = p.x + directions[i][0];
            var ny = p.y + directions[i][1];

            if (
                nx < 0 ||
                ny < 0 ||
                nx >= size ||
                ny >= size
            ) {
                continue;
            }

            var key = nx + "," + ny;

            if (visited[key]) continue;
            if (blocked[key]) continue;

            if (
                !game.map[ny] ||
                game.map[ny][nx] === "wall"
            ) {
                continue;
            }

            visited[key] = true;
            queue.push({
                x: nx,
                y: ny
            });
        }
    }

    return best;
}

function useDevProgressWarp_STEP416() {
    if (!DEV_MODE || game.baseOpen || game.dead) {
        return;
    }

    // 本編演出でインベントリそのものを封じる階は対象外。
    if (
        game.world.currentLayer === 4 &&
        Number(game.layer4.currentFloor) === 20
    ) {
        return;
    }

    if (
        game.world.currentLayer === 5 &&
        Number(game.layer5.currentFloor) === 1010
    ) {
        return;
    }

    var target = getDevWarpTarget_STEP416();

    if (!target) {
        addLog(
            "【開発】この場所では進行地点を特定できません。"
        );
        return;
    }

    var point =
        findNearestReachableToTarget_STEP416(target);

    if (!point) {
        addLog(
            "【開発】進行地点付近へ移動できませんでした。"
        );
        return;
    }

    game.player.x = point.x;
    game.player.y = point.y;

    // DEV移動自体ではガス・罠・虚風・残光などの行動消費を発生させない。
    if (game.world.currentLayer === 1) {
        updateVision();
    } else if (game.world.currentLayer === 2) {
        updateLayer2Vision();
    } else if (game.world.currentLayer === 4) {
        updateLayer4Vision();
    } else if (game.world.currentLayer === 5) {
        updateLayer5Vision();
    }

    closeInventory();

    addLog(
        "【開発】" +
        target.name +
        "付近の到達可能地点へワープしました。"
    );

    render();
}

function appendDevProgressWarpItem_STEP416() {
    if (
        !DEV_MODE ||
        game.baseOpen ||
        (
            game.world.currentLayer === 4 &&
            Number(game.layer4.currentFloor) === 20
        ) ||
        (
            game.world.currentLayer === 5 &&
            Number(game.layer5.currentFloor) === 1010
        )
    ) {
        return;
    }

    var box =
        document.getElementById("inventoryWindow");

    if (!box) return;

    var old =
        document.getElementById(
            "devProgressWarpRow_STEP416"
        );

    if (old) old.remove();

    var row = document.createElement("div");
    row.id = "devProgressWarpRow_STEP416";

    Object.assign(row.style, {
        marginTop: "10px",
        padding: "9px",
        border: "1px solid #7661a8",
        borderRadius: "5px",
        background: "rgba(70,45,110,.16)"
    });

    var name = document.createElement("div");
    name.textContent = "DEV：進行地点ワープ　∞";
    name.style.fontWeight = "bold";
    name.style.color = "#d5c3ff";
    row.appendChild(name);

    var desc = document.createElement("div");
    desc.textContent =
        "現在地から到達可能な範囲で、階段・ボス・帰還地点などの進行地点付近へ移動する。";
    desc.style.cssText =
        "font-size:10px;color:#aaa;margin:4px 0 7px;";
    row.appendChild(desc);

    var button = document.createElement("button");
    button.textContent = "使用";
    button.onclick = function(event) {
        event.stopPropagation();
        useDevProgressWarp_STEP416();
    };
    row.appendChild(button);

    var closeButton =
        Array.from(box.querySelectorAll("button"))
            .find(function(button) {
                return button.textContent === "閉じる";
            });

    if (closeButton) {
        box.insertBefore(row, closeButton);
    } else {
        box.appendChild(row);
    }
}


// ---------------------------------------------------------------------------
// DEV UI / インベントリUIへ追加
// ---------------------------------------------------------------------------
const _step416_updateDevUI = updateDevUI;
updateDevUI = function() {
    var result = _step416_updateDevUI();

    appendLayer2ResearchDevButtons_STEP416();

    return result;
};

const _step416_updateInventoryUI = updateInventoryUI;
updateInventoryUI = function() {
    var result = _step416_updateInventoryUI();

    appendDevProgressWarpItem_STEP416();

    return result;
};


// 初回評価
removeLayer1Floor100Stairs_STEP416();



// ============================================================================
// STEP 4-17
// ・DEV階層解放/未解放を双方向切替
// ・上位層解放時は下位層を含め、その層まで全フロアクリア済みにする
// ・下位層を未解放に戻すと上位層も連動して未解放
// ・探索画面「鉱山から出る」を削除
// ・探索ステータスHUD大型化
// ・インベントリボタンを簡易ログ直下へ移動
// ・DEV時は配置型オブジェクトを全可視化
// ============================================================================


// ---------------------------------------------------------------------------
// DEV：階層進行状態の完全化 / リセット
// ---------------------------------------------------------------------------
function devRegisterStoryItem_STEP417(itemId) {
    if (!itemId) return;

    if (
        game.records &&
        game.records.items &&
        game.records.items[itemId]
    ) {
        game.records.items[itemId].discovered = true;
        game.records.items[itemId].acquired =
            Math.max(
                1,
                Number(game.records.items[itemId].acquired || 0)
            );
    }
}

function devCompleteLayer2_STEP417() {
    ensureLayer2DataStructures();

    game.layer2.unlocked = true;
    game.layer2.currentFloor = 100;
    game.layer2.maxReachedFloor = 100;
    game.layer2.selectedCheckpoint = 100;
    game.layer2.audioInterferenceUnlocked = true;
    game.layer2.layer3RecipeKnown = true;

    game.layer2.checkpoints = {1:true};
    game.layer2.gates = {};
    game.layer2.bosses = {};
    game.layer2.storyItems = {};

    for (var f = 9; f <= 99; f += 10) {
        game.layer2.gates[f] = true;
    }

    for (var bf = 10; bf <= 100; bf += 10) {
        game.layer2.checkpoints[bf] = true;

        var bossData = LAYER2_BOSSES[bf];
        game.layer2.bosses[bf] = {
            remainingHp: 0,
            firstDefeated: true,
            rewardReady: false
        };

        game.layer2.storyItems[bf] = true;

        if (LAYER2_STORY_ITEMS[bf]) {
            devRegisterStoryItem_STEP417(
                LAYER2_STORY_ITEMS[bf].id
            );
        }
    }

    game.world.maxUnlockedLayer =
        Math.max(game.world.maxUnlockedLayer, 2);
}

function devResetLayer2_STEP417() {
    ensureLayer2DataStructures();

    game.layer2.unlocked = false;
    game.layer2.currentFloor = 1;
    game.layer2.maxReachedFloor = 1;
    game.layer2.selectedCheckpoint = 1;
    game.layer2.checkpoints = {1:true};
    game.layer2.gates = {};
    game.layer2.bosses = {};
    game.layer2.storyItems = {};
    game.layer2.status = {corrosion:0, unease:0};
    game.layer2.floorRuntime = {};
    game.layer2.audioInterferenceUnlocked = false;
    game.layer2.layer3RecipeKnown = false;
    game.layer2.layer3KeyCrafted = false;

    if (game.progressFlags) {
        game.progressFlags.layer2ExistenceHint = false;
        game.progressFlags.layer2AnomalyDetected = false;
        game.progressFlags.layer2ResonanceDetected = false;
        game.progressFlags.layer2ResearchStarted = false;
        game.progressFlags.layer2RequirementsKnown = false;
        game.progressFlags.layer2Attempted = false;
    }
}

function devCompleteLayer3_STEP417() {
    ensureLayer3();

    game.layer3.unlocked = true;
    game.layer3.currentFloor = 10;
    game.layer3.maxReachedFloor = 10;
    game.layer3.selectedCheckpoint = 10;
    game.layer3.checkpoints = {};
    game.layer3.storyItems = {};
    game.layer3.bosses = {};

    for (var f = 1; f <= 10; f++) {
        game.layer3.checkpoints[f] = true;
        game.layer3.storyItems[f] = true;

        game.layer3.bosses[f] = {
            firstDefeated: true,
            hps: Array(LAYER3_BOSS_COUNTS[f]).fill(0)
        };

        if (LAYER3_STORY[f]) {
            devRegisterStoryItem_STEP417(
                LAYER3_STORY[f].id
            );
        }
    }

    game.world.maxUnlockedLayer =
        Math.max(game.world.maxUnlockedLayer, 3);
}

function devResetLayer3_STEP417() {
    ensureLayer3();

    game.layer3.unlocked = false;
    game.layer3.currentFloor = 1;
    game.layer3.maxReachedFloor = 1;
    game.layer3.selectedCheckpoint = 1;
    game.layer3.checkpoints = {1:true};
    game.layer3.storyItems = {};
    game.layer3.bosses = {};
    game.layer3.layer4KeyCrafted = false;
    game.layer3.runtime = {};
    game.layer3.temp = {
        tailwind:0,
        headwind:0,
        mapOff:0,
        chaos:0,
        warmShield:0,
        familiar:0,
        invincible:0,
        goodAmp:0,
        badReduce:0,
        bothAmp:0,
        guide:0
    };

    if (game.layer2) {
        game.layer2.layer3KeyCrafted = false;
    }
}

function devCompleteLayer4_STEP417() {
    ensureLayer4();

    game.layer4.unlocked = true;
    game.layer4.currentFloor = 20;
    game.layer4.maxReachedFloor = 20;
    game.layer4.selectedCheckpoint = 16;
    game.layer4.checkpoints = {
        1:true,
        6:true,
        16:true
    };

    game.layer4.clues = {};
    for (var i = 0; i < 7; i++) {
        game.layer4.clues[i] = true;
    }

    game.layer4.nightVeilObtained = true;
    game.layer4.floor20Cleared = true;
    game.layer4.signboardBroken = true;

    if (game.inventory && game.inventory.items) {
        game.inventory.items.nightVeil =
            Math.max(
                1,
                Number(game.inventory.items.nightVeil || 0)
            );
    }

    devRegisterStoryItem_STEP417("nightVeil");

    game.world.maxUnlockedLayer =
        Math.max(game.world.maxUnlockedLayer, 4);
}

function devResetLayer4_STEP417() {
    ensureLayer4();

    game.layer4.unlocked = false;
    game.layer4.currentFloor = 1;
    game.layer4.maxReachedFloor = 1;
    game.layer4.selectedCheckpoint = 1;
    game.layer4.checkpoints = {1:true};
    game.layer4.clues = {};
    game.layer4.nightVeilObtained = false;
    game.layer4.floor20Cleared = false;
    game.layer4.signboardBroken = false;
    game.layer4.layer5KeyCrafted = false;
    game.layer4.runtime = {};

    if (game.layer3) {
        game.layer3.layer4KeyCrafted = false;
    }

    if (
        game.inventory &&
        game.inventory.items
    ) {
        game.inventory.items.nightVeil = 0;
    }
}

function devCompleteLayer5_STEP417() {
    ensureLayer5();

    game.layer5.unlocked = true;
    game.layer5.currentFloor = 1010;
    game.layer5.maxReachedFloor = 1010;
    game.layer5.selectedFloor = 1010;
    game.layer5.reached = {};

    for (var f = 1001; f <= 1010; f++) {
        game.layer5.reached[f] = true;
    }

    game.layer5.cleared = true;
    game.endgameUnlocked = true;

    // 1010Fクリア後と同じく掲示板を修復。
    if (game.layer4) {
        game.layer4.layer5KeyCrafted = true;
        game.layer4.signboardBroken = false;
    }

    if (
        game.inventory &&
        game.inventory.items
    ) {
        game.inventory.items.nightVeil = 0;
    }

    game.world.maxUnlockedLayer = 5;
}

function devResetLayer5_STEP417() {
    ensureLayer5();

    game.layer5.unlocked = false;
    game.layer5.currentFloor = 1001;
    game.layer5.maxReachedFloor = 1001;
    game.layer5.selectedFloor = 1001;
    game.layer5.reached = {1001:true};
    game.layer5.cleared = false;
    game.layer5.runtime = {};
    game.endgameUnlocked = false;

    if (game.layer4) {
        game.layer4.layer5KeyCrafted = false;

        // 第4層が解放済みなら20Fクリア後の破損状態へ戻す。
        game.layer4.signboardBroken =
            !!(
                game.layer4.unlocked &&
                game.layer4.floor20Cleared
            );
    }
}

function devRecalculateMaxUnlockedLayer_STEP417() {
    var max = 1;

    if (game.layer2 && game.layer2.unlocked) max = 2;
    if (game.layer3 && game.layer3.unlocked) max = 3;
    if (game.layer4 && game.layer4.unlocked) max = 4;
    if (game.layer5 && game.layer5.unlocked) max = 5;

    game.world.maxUnlockedLayer = max;

    if (!game.dev) game.dev = {};
    game.dev.allLayersUnlocked = max >= 5;
}

function devSetLayerUnlocked_STEP417(level, unlocked) {
    if (!DEV_MODE) return;

    level = Math.max(
        2,
        Math.min(
            5,
            Math.floor(Number(level) || 2)
        )
    );

    ensureLayer2DataStructures();
    ensureLayer3();
    ensureLayer4();
    ensureLayer5();

    if (unlocked) {
        // 上位だけ解放して下位が未解放、という状態は作らない。
        if (level >= 2) devCompleteLayer2_STEP417();

        if (level >= 3) {
            game.layer2.layer3KeyCrafted = true;
            devCompleteLayer3_STEP417();
        }

        if (level >= 4) {
            game.layer3.layer4KeyCrafted = true;
            devCompleteLayer4_STEP417();
        }

        if (level >= 5) {
            game.layer4.layer5KeyCrafted = true;
            devCompleteLayer5_STEP417();
        }

        addLog(
            "【開発】第" +
            level +
            "層までを解放し、そこまでの全フロアをクリア済みにしました。"
        );
    } else {
        // 下位を閉じた場合、その先の上位層もすべて閉じる。
        if (level <= 5) devResetLayer5_STEP417();
        if (level <= 4) devResetLayer4_STEP417();
        if (level <= 3) devResetLayer3_STEP417();
        if (level <= 2) devResetLayer2_STEP417();

        addLog(
            "【開発】第" +
            level +
            "層以降を未解放状態へ戻しました。"
        );
    }

    devRecalculateMaxUnlockedLayer_STEP417();

    game.world.currentLayer = 1;
    game.dead = false;
    game.mining = false;

    if (game.baseOpen) {
        updateAllBaseWindows();
        updateBaseTicker(true);
    }

    updateDevUI();
    render();
}

function devUnlockLayerForTest(level) {
    if (!DEV_MODE) return;

    level = Math.max(
        1,
        Math.min(
            MAX_WORLD_LAYER,
            Math.floor(Number(level) || 1)
        )
    );

    if (level <= 1) {
        addLog("【開発】第1層は常時解放されています。");
        return;
    }

    devSetLayerUnlocked_STEP417(level, true);
}

function devUnlockAllLayers() {
    if (!DEV_MODE) return;
    devSetLayerUnlocked_STEP417(5, true);
}


// DEVワープでも解放関係を壊さない。
const _step417_devWarpToFloor = devWarpToFloor;
devWarpToFloor = function(layer, floor) {
    layer = Number(layer);

    if (
        DEV_MODE &&
        layer >= 2 &&
        layer <= 5 &&
        !isLayerUnlockedForDev(layer)
    ) {
        devSetLayerUnlocked_STEP417(layer, true);
    }

    return _step417_devWarpToFloor(layer, floor);
};


// ---------------------------------------------------------------------------
// DEV：階層解放画面を「解放 / 未解放」の切替にする
// ---------------------------------------------------------------------------
function upgradeDevLayerUnlockPanel_STEP417() {
    if (!DEV_MODE) return;

    var box = document.getElementById("devWindow");
    if (!box) return;

    var title =
        Array.from(
            box.querySelectorAll("div")
        ).find(function(div) {
            return div.textContent === "【 階層解放テスト 】";
        });

    if (!title) return;

    var panel = title.parentNode;
    if (!panel) return;

    var rows = panel.querySelectorAll(".dev-layer");

    rows.forEach(function(row, index) {
        var level = index + 1;
        var button = row.querySelector("button");
        var info = row.querySelector("span");

        if (!button) return;

        var unlocked =
            level === 1
                ? true
                : isLayerUnlockedForDev(level);

        if (level === 1) {
            button.disabled = true;
            button.textContent = "常時解放";
        } else {
            button.disabled = false;
            button.textContent =
                unlocked
                    ? "未解放に戻す"
                    : "解放＋全クリア";

            button.onclick = function(event) {
                event.stopPropagation();

                devSetLayerUnlocked_STEP417(
                    level,
                    !unlocked
                );
            };
        }

        if (info) {
            info.textContent =
                info.textContent
                    .replace(/\s*\[(?:解放済|未解放)\]\s*/g, "")
                    .trim() +
                (
                    unlocked
                        ? "　[解放済]"
                        : "　[未解放]"
                );
        }
    });

    var note =
        document.getElementById(
            "devLayerUnlockNote_STEP411"
        );

    if (note) {
        note.textContent =
            "解放するとその層までの全フロアをクリア済みにします。上位層の解放には下位層も自動で含まれ、下位層を未解放にすると上位層も連動して未解放になります。";
    }
}


// ---------------------------------------------------------------------------
// 探索HUD：HP / 残光 / 残り行動を見やすく大型化
// ---------------------------------------------------------------------------
function getExplorerHudData_STEP417() {
    var layer = Number(game.world.currentLayer || 1);

    if (layer === 1) {
        return {
            title:
                "第1層　通常鉱山　Lv" +
                game.currentMineLevel,
            special: "",
            sub:
                "採掘力 " +
                getMiningPower(game.pickaxe.level) +
                "　／　所持金 " +
                Number(game.money || 0).toLocaleString() +
                " G"
        };
    }

    if (layer === 2) {
        var eq =
            getLayer2Equipment(
                game.layer2.equippedGasProtection
            );

        var status = [];

        if (eq) status.push("防護 " + eq.name);
        if (game.layer2.status.corrosion > 0) {
            status.push(
                "腐食 " +
                game.layer2.status.corrosion
            );
        }
        if (game.layer2.status.unease > 0) {
            status.push(
                "不穏 " +
                game.layer2.status.unease
            );
        }

        return {
            title:
                "第2層　旧坑道　" +
                game.layer2.currentFloor +
                "F",
            special: "",
            sub:
                (
                    status.length
                        ? status.join("　／　") + "　／　"
                        : ""
                ) +
                "採掘力 " +
                getMiningPower(game.pickaxe.level) +
                "　／　所持金 " +
                Number(game.money || 0).toLocaleString() +
                " G"
        };
    }

    if (layer === 3) {
        var l3status = [];

        if (game.layer3.temp.chaos > 0) {
            l3status.push(
                "混沌 " +
                game.layer3.temp.chaos
            );
        }

        if (game.layer3.temp.mapOff > 0) {
            l3status.push(
                "地図消失 " +
                game.layer3.temp.mapOff
            );
        }

        return {
            title:
                "第3層　無風回廊　" +
                game.layer3.currentFloor +
                "F",
            special: "",
            sub:
                (
                    l3status.length
                        ? l3status.join("　／　") + "　／　"
                        : ""
                ) +
                "採掘力 " +
                getMiningPower(game.pickaxe.level) +
                "　／　所持金 " +
                Number(game.money || 0).toLocaleString() +
                " G"
        };
    }

    if (layer === 4) {
        var rt4 = game.layer4.runtime || {};
        var special = "";

        if (rt4.special === "night") {
            special = "【死神】反応なし";
        } else if (rt4.special !== "final") {
            var c =
                game.layer4.equipmentOwned.afterglowMeter
                    ? rt4.count
                    : "???";

            special =
                "光が消えるまで　" +
                c;
        }

        return {
            title:
                "第4層　残光遺跡　" +
                game.layer4.currentFloor +
                "F",
            special: special,
            sub:
                "採掘力 " +
                getMiningPower(game.pickaxe.level) +
                "　／　所持金 " +
                Number(game.money || 0).toLocaleString() +
                " G"
        };
    }

    if (layer === 5) {
        var rt5 = game.layer5.runtime || {};
        var special5 = "";

        if (
            rt5.count !== undefined &&
            rt5.count !== null
        ) {
            special5 =
                "残り行動　" +
                rt5.count;
        }

        return {
            title:
                "第5層　虚夜空間　" +
                game.layer5.currentFloor +
                "F",
            special: special5,
            sub:
                "採掘力 " +
                getMiningPower(game.pickaxe.level) +
                "　／　所持金 " +
                Number(game.money || 0).toLocaleString() +
                " G"
        };
    }

    return null;
}

function renderEnhancedExplorerStatus_STEP417() {
    var box =
        document.getElementById(
            "playerStatus"
        );

    if (!box) return;

    if (game.baseOpen) {
        box.style.fontSize = "13px";
        box.style.padding = "7px 10px";
        return;
    }

    var data =
        getExplorerHudData_STEP417();

    if (!data) return;

    var hp =
        Number(game.player.hp || 0);

    var maxHp =
        Math.max(
            1,
            Number(game.player.maxHp || 1)
        );

    var rate =
        Math.max(
            0,
            Math.min(
                100,
                hp / maxHp * 100
            )
        );

    box.innerHTML = "";

    Object.assign(
        box.style,
        {
            padding: "13px 15px",
            margin: "8px 0 10px",
            border: "2px solid #626c75",
            borderRadius: "8px",
            boxSizing: "border-box",
            fontSize: "14px",
            lineHeight: "1.35"
        }
    );

    var title =
        document.createElement("div");

    title.textContent = data.title;

    Object.assign(
        title.style,
        {
            fontSize: "18px",
            fontWeight: "800",
            letterSpacing: "0.04em",
            marginBottom: "7px"
        }
    );

    box.appendChild(title);

    var hpLine =
        document.createElement("div");

    hpLine.innerHTML =
        '<span style="font-size:13px;color:#b8c0c7">HP</span> ' +
        '<strong style="font-size:22px">' +
        formatHp(hp) +
        " / " +
        formatHp(maxHp) +
        "</strong>";

    box.appendChild(hpLine);

    var hpTrack =
        document.createElement("div");

    Object.assign(
        hpTrack.style,
        {
            width: "100%",
            height: "12px",
            margin: "6px 0 8px",
            background: "#0d1013",
            border: "1px solid #555e66",
            borderRadius: "999px",
            overflow: "hidden",
            boxSizing: "border-box"
        }
    );

    var hpFill =
        document.createElement("div");

    Object.assign(
        hpFill.style,
        {
            width: rate + "%",
            height: "100%",
            background:
                "linear-gradient(90deg,#78c987,#b6e38f)"
        }
    );

    hpTrack.appendChild(hpFill);
    box.appendChild(hpTrack);

    if (data.special) {
        var special =
            document.createElement("div");

        special.textContent = data.special;

        Object.assign(
            special.style,
            {
                fontSize: "21px",
                fontWeight: "900",
                margin: "4px 0 7px",
                letterSpacing: "0.025em"
            }
        );

        box.appendChild(special);
    }

    var sub =
        document.createElement("div");

    sub.textContent = data.sub;

    Object.assign(
        sub.style,
        {
            fontSize: "12px",
            color: "#aeb6bd"
        }
    );

    box.appendChild(sub);
}


// ---------------------------------------------------------------------------
// インベントリ：簡易ログ直下へ
// ---------------------------------------------------------------------------
function placeInventoryBelowLog_STEP417() {
    var button =
        document.getElementById(
            "inventoryButton"
        );

    var log =
        document.getElementById(
            "log"
        );

    if (
        !button ||
        !log ||
        !log.parentNode
    ) {
        return;
    }

    var bar =
        document.getElementById(
            "explorationActionBar"
        );

    if (!bar) {
        bar =
            document.createElement("div");

        bar.id =
            "explorationActionBar";
    }

    if (bar.parentNode !== log.parentNode) {
        log.parentNode.insertBefore(
            bar,
            log.nextSibling
        );
    } else if (
        log.nextSibling !== bar
    ) {
        log.parentNode.insertBefore(
            bar,
            log.nextSibling
        );
    }

    if (button.parentNode !== bar) {
        bar.appendChild(button);
    }

    Object.assign(
        bar.style,
        {
            display:
                game.baseOpen
                    ? "none"
                    : "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            boxSizing: "border-box",
            margin: "9px 0 10px",
            padding: "7px 8px",
            background: "rgba(15,18,21,.78)",
            border: "1px solid #454d55",
            borderRadius: "7px"
        }
    );

    button.textContent =
        "🎒 インベントリ";

    Object.assign(
        button.style,
        {
            position: "static",
            margin: "0",
            width: "min(360px, 100%)",
            minWidth: "220px",
            height: "52px",
            minHeight: "52px",
            padding: "0 22px",
            fontSize: "17px",
            fontWeight: "800",
            letterSpacing: "0.03em",
            borderRadius: "8px",
            cursor: "pointer"
        }
    );
}

placeInventoryButtonForExploration =
    placeInventoryBelowLog_STEP417;

applyLayer2InventoryButtonPosition =
    placeInventoryBelowLog_STEP417;


// ---------------------------------------------------------------------------
// 「鉱山から出る」ボタンを探索画面から削除
// ---------------------------------------------------------------------------
function removeObsoleteMineExitButton_STEP417() {
    Array.from(
        document.querySelectorAll("button")
    ).forEach(function(button) {
        var text =
            String(
                button.textContent || ""
            ).trim();

        if (
            text === "鉱山から出る" ||
            text === "鉱山を出る"
        ) {
            button.remove();
        }
    });
}


// ---------------------------------------------------------------------------
// DEV：配置型オブジェクト全可視化
// ※第2層のランダム発生型「落石」等は座標を持たないため対象外。
// ---------------------------------------------------------------------------
function devRevealPlacedObjects_STEP417() {
    if (
        !DEV_MODE ||
        game.baseOpen ||
        !game.map
    ) {
        return;
    }

    // DEV中は地形・配置物を確認できるよう探索済みにする。
    for (var y = 0; y < game.explored.length; y++) {
        if (!game.explored[y]) continue;

        for (
            var x = 0;
            x < game.explored[y].length;
            x++
        ) {
            game.explored[y][x] = true;
        }
    }

    (game.ores || []).forEach(function(ore) {
        ore.discovered = true;
    });

    if (game.returnPoint) {
        game.returnPoint.found = true;
    }

    if (
        game.stairs &&
        !(
            game.world.currentLayer === 1 &&
            Number(game.currentMineLevel) === 100
        )
    ) {
        game.stairs.found = true;
    }

    if (
        game.world.currentLayer === 2 &&
        game.layer2 &&
        game.layer2.floorRuntime
    ) {
        var rt2 =
            game.layer2.floorRuntime;

        if (rt2.healing) {
            rt2.healing.found = true;
        }

        if (rt2.switchPos) {
            rt2.switchFound = true;
        }
    }
}

function devMarkVisibleSpecialTiles_STEP417() {
    if (
        !DEV_MODE ||
        game.baseOpen ||
        !mapElement
    ) {
        return;
    }

    var layer =
        Number(game.world.currentLayer);

    if (
        layer < 3 ||
        layer > 5
    ) {
        return;
    }

    var size =
        layer === 3
            ? LAYER3_SIZE
            : layer === 4
                ? game.layer4.runtime.size
                : game.layer5.runtime.size;

    var radius =
        layer === 3
            ? LAYER3_CAMERA_RADIUS
            : layer === 4
                ? LAYER4_CAMERA_RADIUS
                : 10;

    var camera =
        getFixedCameraBounds(
            size,
            game.player.x,
            game.player.y,
            radius
        );

    function tileAt(x, y) {
        if (
            x < camera.minX ||
            x > camera.maxX ||
            y < camera.minY ||
            y > camera.maxY
        ) {
            return null;
        }

        var index =
            (y - camera.minY) *
            camera.cols +
            (x - camera.minX);

        return mapElement.children[index] || null;
    }

    // 偽鉱石
    (game.ores || []).forEach(function(ore) {
        if (!ore.fake) return;

        var tile =
            tileAt(ore.x, ore.y);

        if (!tile) return;

        tile.textContent = "偽";
        tile.style.color = "#ff77da";
        tile.style.fontWeight = "bold";
        tile.title = "【DEV】偽鉱石";
    });

    if (
        layer === 4 &&
        game.layer4 &&
        game.layer4.runtime
    ) {
        var rt =
            game.layer4.runtime;

        var traps =
            rt.special === "night"
                ? rt.nightTraps
                : rt.traps;

        Object.keys(traps || {}).forEach(function(key) {
            var sp = key.split(",");
            var x = Number(sp[0]);
            var y = Number(sp[1]);
            var tile = tileAt(x, y);

            if (!tile) return;

            // 鉱石等と重なった場合は文字を潰さずタイトルで併記。
            if (
                tile.textContent === "・" ||
                tile.textContent === "●"
            ) {
                tile.textContent = "罠";
                tile.style.color = "#ff6969";
                tile.style.fontWeight = "bold";
            }

            tile.title =
                (
                    tile.title
                        ? tile.title + " / "
                        : ""
                ) +
                "【DEV】配置罠：" +
                traps[key];
        });
    }
}


// ---------------------------------------------------------------------------
// 各UI更新ラップ
// ---------------------------------------------------------------------------
const _step417_updateStatusUI =
    updateStatusUI;

updateStatusUI = function() {
    var result =
        _step417_updateStatusUI();

    renderEnhancedExplorerStatus_STEP417();

    return result;
};


const _step417_updateInventoryUI =
    updateInventoryUI;

updateInventoryUI = function() {
    var result =
        _step417_updateInventoryUI();

    placeInventoryBelowLog_STEP417();
    removeObsoleteMineExitButton_STEP417();

    return result;
};


const _step417_updateDevUI =
    updateDevUI;

updateDevUI = function() {
    var result =
        _step417_updateDevUI();

    upgradeDevLayerUnlockPanel_STEP417();

    return result;
};


const _step417_render =
    render;

render = function() {
    devRevealPlacedObjects_STEP417();

    var result =
        _step417_render();

    renderEnhancedExplorerStatus_STEP417();
    placeInventoryBelowLog_STEP417();
    removeObsoleteMineExitButton_STEP417();
    devMarkVisibleSpecialTiles_STEP417();

    return result;
};


// 初回反映
removeObsoleteMineExitButton_STEP417();
placeInventoryBelowLog_STEP417();
upgradeDevLayerUnlockPanel_STEP417();



// ============================================================================
// STEP 4-18
// ・第2層ボス階：巨大鉱石破壊前は奥側区画へ進入不可（DEV含む）
// ・拠点にカジノ入口のみ追加（内容は後日実装）
// ============================================================================

// ---------------------------------------------------------------------------
// 第2層ボス階：巨大鉱石を無視した回り込みを禁止
// ---------------------------------------------------------------------------
function isLayer2BossBackAreaBlocked_STEP418(nx, ny) {
    if (
        !isLayer2Active() ||
        !isLayer2BossFloor(game.layer2.currentFloor) ||
        isLayer2BossCleared(game.layer2.currentFloor)
    ) {
        return false;
    }

    var rt = game.layer2.floorRuntime;

    if (!rt || !rt.bossPos) {
        return false;
    }

    // 固定ボス階では入口が下側、物語箱・階段がボスより上側にある。
    // 巨大鉱石を破壊するまでは、横道から回り込んでも奥側へ入れない。
    return ny < rt.bossPos.y;
}

const _step418_moveLayer2Player = moveLayer2Player;
moveLayer2Player = function(dx, dy) {
    if (
        !game.baseOpen &&
        !game.dead &&
        isLayer2Active() &&
        isLayer2BossFloor(game.layer2.currentFloor)
    ) {
        var nx = game.player.x + dx;
        var ny = game.player.y + dy;

        if (isLayer2BossBackAreaBlocked_STEP418(nx, ny)) {
            addLog('巨大な鉱塊が奥の区画への進路を封鎖している。');
            return;
        }
    }

    return _step418_moveLayer2Player(dx, dy);
};

// DEV「進行地点ワープ」でも未撃破ボスの奥へは行かない。
const _step418_getDevWarpTarget = getDevWarpTarget_STEP416;
getDevWarpTarget_STEP416 = function() {
    if (
        isLayer2Active() &&
        isLayer2BossFloor(game.layer2.currentFloor) &&
        !isLayer2BossCleared(game.layer2.currentFloor)
    ) {
        var rt = game.layer2.floorRuntime;

        if (rt && rt.bossPos) {
            return {
                x: rt.bossPos.x,
                y: rt.bossPos.y,
                name: '巨大鉱塊'
            };
        }
    }

    return _step418_getDevWarpTarget();
};

// 万一DEV操作などでボス奥にいる状態でも、通常移動でさらに奥へ進めないようにする。
const _step418_enterLayer2Floor = enterLayer2Floor;
enterLayer2Floor = function(floor, fromCheckpoint) {
    var result = _step418_enterLayer2Floor(floor, fromCheckpoint);

    if (
        isLayer2BossFloor(Number(floor)) &&
        !isLayer2BossCleared(Number(floor)) &&
        game.layer2.floorRuntime &&
        game.layer2.floorRuntime.start
    ) {
        var bp = game.layer2.floorRuntime.bossPos;
        if (bp && game.player.y < bp.y) {
            game.player.x = game.layer2.floorRuntime.start.x;
            game.player.y = game.layer2.floorRuntime.start.y;
            updateLayer2Vision();
            render();
        }
    }

    return result;
};


// ---------------------------------------------------------------------------
// カジノ：入口だけ先行実装
// ---------------------------------------------------------------------------
function closeCasino_STEP418() {
    var overlay = document.getElementById('casinoOverlay_STEP418');
    if (overlay) overlay.style.display = 'none';
}

function ensureCasinoUI_STEP418() {
    var overlay = document.getElementById('casinoOverlay_STEP418');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'casinoOverlay_STEP418';

    Object.assign(overlay.style, {
        position: 'fixed',
        inset: '0',
        zIndex: '9000',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,.72)'
    });

    var windowBox = document.createElement('div');
    Object.assign(windowBox.style, {
        width: 'min(560px, calc(100vw - 30px))',
        padding: '18px',
        boxSizing: 'border-box',
        background: '#121317',
        border: '1px solid #a88954',
        borderRadius: '8px',
        boxShadow: '0 15px 45px rgba(0,0,0,.65)',
        textAlign: 'center'
    });

    var title = document.createElement('div');
    title.textContent = '【 カ ジ ノ 】';
    Object.assign(title.style, {
        fontSize: '20px',
        fontWeight: 'bold',
        letterSpacing: '0.12em',
        color: '#e5c98e',
        marginBottom: '15px'
    });
    windowBox.appendChild(title);

    var message = document.createElement('div');
    message.innerHTML =
        'カジノは現在準備中です。<br>' +
        '<span style="font-size:11px;color:#969ca3">ゲーム内容・景品交換は後日実装予定。</span>';
    Object.assign(message.style, {
        lineHeight: '1.8',
        margin: '18px 0 20px'
    });
    windowBox.appendChild(message);

    var close = document.createElement('button');
    close.textContent = '拠点へ戻る';
    Object.assign(close.style, {
        minWidth: '170px',
        padding: '10px 18px',
        fontWeight: 'bold'
    });
    close.onclick = function(event) {
        event.stopPropagation();
        closeCasino_STEP418();
    };
    windowBox.appendChild(close);

    overlay.appendChild(windowBox);
    overlay.onclick = function(event) {
        if (event.target === overlay) closeCasino_STEP418();
    };

    document.body.appendChild(overlay);
    return overlay;
}

function openCasino_STEP418() {
    if (!game.baseOpen) return;

    var overlay = ensureCasinoUI_STEP418();
    overlay.style.display = 'flex';
}

function addCasinoFacilityButton_STEP418() {
    var depth = document.getElementById('depthObservationBox');
    if (!depth || !depth.parentNode) return;

    var facilityTitle = Array.from(
        depth.parentNode.querySelectorAll('div')
    ).find(function(div) {
        return div.textContent === '【 施 設 区 画 】';
    });

    if (!facilityTitle || !facilityTitle.parentNode) return;

    var buttons = facilityTitle.parentNode.children[1];
    if (!buttons) return;

    if (document.getElementById('casinoFacilityButton_STEP418')) return;

    var button = document.createElement('button');
    button.id = 'casinoFacilityButton_STEP418';
    button.textContent = 'カジノ';

    if (typeof styleBaseFacilityButton === 'function') {
        styleBaseFacilityButton(button);
    }

    button.style.borderColor = '#9b7b49';
    button.style.color = '#e5c98e';

    button.onclick = function(event) {
        event.stopPropagation();
        openCasino_STEP418();
    };

    // 開発ボタンがある場合はその直前。なければ末尾へ。
    var devButton = Array.from(buttons.querySelectorAll('button')).find(
        function(b) { return b.textContent === '開発'; }
    );

    if (devButton) {
        buttons.insertBefore(button, devButton);
    } else {
        buttons.appendChild(button);
    }
}

const _step418_updateBaseUI = updateBaseUI;
updateBaseUI = function() {
    var result = _step418_updateBaseUI();
    addCasinoFacilityButton_STEP418();
    return result;
};

ensureCasinoUI_STEP418();
addCasinoFacilityButton_STEP418();



// ============================================================================
// STEP 4-19：カジノ入口を黄色ネオン調へ
// ============================================================================
function ensureCasinoNeonStyle_STEP419() {
    if (document.getElementById("casinoNeonStyle_STEP419")) return;

    var style = document.createElement("style");
    style.id = "casinoNeonStyle_STEP419";

    style.textContent = `
        @keyframes casinoNeonBlink_STEP419 {
            0%, 72%, 100% {
                color: #fff3a0;
                border-color: #ffd92f;
                background: linear-gradient(180deg, #272100 0%, #151100 100%);
                box-shadow:
                    0 0 5px rgba(255, 221, 47, .75),
                    0 0 11px rgba(255, 198, 0, .45),
                    inset 0 0 8px rgba(255, 222, 50, .12);
                text-shadow:
                    0 0 4px #fff7b0,
                    0 0 9px #ffd500,
                    0 0 14px rgba(255, 185, 0, .8);
            }

            75% {
                color: #fffbd2;
                border-color: #fff27a;
                background: linear-gradient(180deg, #4c4000 0%, #211900 100%);
                box-shadow:
                    0 0 8px #fff27a,
                    0 0 18px #ffd500,
                    0 0 30px rgba(255, 184, 0, .9),
                    inset 0 0 12px rgba(255, 245, 130, .28);
                text-shadow:
                    0 0 5px #ffffff,
                    0 0 12px #fff15b,
                    0 0 22px #ffbd00;
            }

            77% {
                color: #b49b30;
                border-color: #77651f;
                background: linear-gradient(180deg, #171400 0%, #0c0a00 100%);
                box-shadow:
                    0 0 2px rgba(255, 213, 0, .2);
                text-shadow: none;
            }

            79% {
                color: #fffbd2;
                border-color: #fff27a;
                background: linear-gradient(180deg, #554700 0%, #241b00 100%);
                box-shadow:
                    0 0 9px #fff27a,
                    0 0 20px #ffd500,
                    0 0 34px rgba(255, 184, 0, .95),
                    inset 0 0 12px rgba(255, 245, 130, .3);
                text-shadow:
                    0 0 5px #ffffff,
                    0 0 13px #fff15b,
                    0 0 24px #ffbd00;
            }

            82% {
                color: #fff3a0;
                border-color: #ffd92f;
                background: linear-gradient(180deg, #272100 0%, #151100 100%);
                box-shadow:
                    0 0 5px rgba(255, 221, 47, .75),
                    0 0 11px rgba(255, 198, 0, .45),
                    inset 0 0 8px rgba(255, 222, 50, .12);
                text-shadow:
                    0 0 4px #fff7b0,
                    0 0 9px #ffd500,
                    0 0 14px rgba(255, 185, 0, .8);
            }
        }

        #casinoFacilityButton_STEP418 {
            min-width: 126px !important;
            font-weight: 900 !important;
            letter-spacing: .13em !important;
            border-width: 2px !important;
            border-style: solid !important;
            border-radius: 7px !important;
            color: #fff3a0 !important;
            border-color: #ffd92f !important;
            background: linear-gradient(180deg, #272100 0%, #151100 100%) !important;
            box-shadow:
                0 0 5px rgba(255, 221, 47, .75),
                0 0 11px rgba(255, 198, 0, .45),
                inset 0 0 8px rgba(255, 222, 50, .12) !important;
            text-shadow:
                0 0 4px #fff7b0,
                0 0 9px #ffd500,
                0 0 14px rgba(255, 185, 0, .8) !important;
            animation: casinoNeonBlink_STEP419 7.2s infinite !important;
        }

        #casinoFacilityButton_STEP418:hover {
            transform: translateY(-1px) scale(1.025);
            filter: brightness(1.18);
        }

        #casinoFacilityButton_STEP418:active {
            transform: translateY(0) scale(.99);
        }
    `;

    document.head.appendChild(style);
}

function applyCasinoNeonButton_STEP419() {
    ensureCasinoNeonStyle_STEP419();

    var button = document.getElementById("casinoFacilityButton_STEP418");
    if (!button) return;

    button.textContent = "★ カジノ ★";
    button.title = "カジノ";
}

const _step419_updateBaseUI = updateBaseUI;
updateBaseUI = function() {
    var result = _step419_updateBaseUI();
    applyCasinoNeonButton_STEP419();
    return result;
};

ensureCasinoNeonStyle_STEP419();
applyCasinoNeonButton_STEP419();


// ============================================================================
// STEP 4-20：カジノコイン / コイン交換所 / 景品交換所の土台
// ============================================================================
const CASINO_COIN_PRICE_STEP420 = 1000;
const CASINO_COIN_INITIAL_CAP_STEP420 = 100;

function ensureCasinoData_STEP420() {
    if (!game.casino) game.casino = {};

    if (!Number.isFinite(Number(game.casino.coins))) {
        game.casino.coins = 0;
    }

    if (!Number.isFinite(Number(game.casino.coinCap))) {
        game.casino.coinCap = CASINO_COIN_INITIAL_CAP_STEP420;
    }

    game.casino.coins = Math.max(0, Math.floor(Number(game.casino.coins) || 0));
    game.casino.coinCap = Math.max(
        CASINO_COIN_INITIAL_CAP_STEP420,
        Math.floor(Number(game.casino.coinCap) || CASINO_COIN_INITIAL_CAP_STEP420)
    );

    if (game.casino.coins > game.casino.coinCap) {
        game.casino.coins = game.casino.coinCap;
    }
}

function getCasinoCoinBuyable_STEP420() {
    ensureCasinoData_STEP420();

    var byMoney = Math.floor(Number(game.money || 0) / CASINO_COIN_PRICE_STEP420);
    var byCapacity = Math.max(0, game.casino.coinCap - game.casino.coins);

    return Math.max(0, Math.min(byMoney, byCapacity));
}

function buyCasinoCoins_STEP420(amount) {
    ensureCasinoData_STEP420();

    amount = Math.max(0, Math.floor(Number(amount) || 0));

    if (amount <= 0) return;

    var buyable = getCasinoCoinBuyable_STEP420();

    if (buyable <= 0) {
        if (game.casino.coins >= game.casino.coinCap) {
            addLog('カジノコインの所持上限に達している。');
        } else {
            addLog('カジノコインを購入するGが足りない。');
        }
        renderCasinoContents_STEP420();
        return;
    }

    var actual = Math.min(amount, buyable);
    var cost = actual * CASINO_COIN_PRICE_STEP420;

    game.money -= cost;
    game.casino.coins += actual;

    addLog(
        'カジノコインを' +
        actual +
        '枚購入した。 (-' +
        cost.toLocaleString() +
        'G)'
    );

    updateAllBaseWindows();
    renderCasinoContents_STEP420();
}

function createCasinoPanel_STEP420(titleText) {
    var panel = document.createElement('div');
    Object.assign(panel.style, {
        marginTop: '12px',
        padding: '13px',
        border: '1px solid #7b682b',
        borderRadius: '7px',
        background: 'rgba(44,36,3,.32)',
        textAlign: 'left'
    });

    var title = document.createElement('div');
    title.textContent = titleText;
    Object.assign(title.style, {
        fontSize: '15px',
        fontWeight: '900',
        color: '#ffe56b',
        letterSpacing: '.06em',
        marginBottom: '9px',
        textShadow: '0 0 7px rgba(255,214,0,.45)'
    });
    panel.appendChild(title);

    return panel;
}

function renderCasinoContents_STEP420() {
    ensureCasinoData_STEP420();

    var overlay = ensureCasinoUI_STEP418();
    if (!overlay) return;

    var windowBox = overlay.firstElementChild;
    if (!windowBox) return;

    // タイトル以外を再構築。
    while (windowBox.children.length > 1) {
        windowBox.removeChild(windowBox.lastChild);
    }

    var balance = document.createElement('div');
    balance.innerHTML =
        '<div style="font-size:12px;color:#b9b1a0">CASINO COIN</div>' +
        '<div style="font-size:28px;font-weight:900;color:#ffe66a;text-shadow:0 0 10px rgba(255,213,0,.55)">' +
        game.casino.coins.toLocaleString() +
        ' <span style="font-size:14px">/ ' +
        game.casino.coinCap.toLocaleString() +
        ' 枚</span></div>';
    balance.style.margin = '4px 0 12px';
    windowBox.appendChild(balance);

    // ------------------------------------------------------------
    // コイン交換所
    // ------------------------------------------------------------
    var exchange = createCasinoPanel_STEP420('【 コイン交換所 】');

    var rate = document.createElement('div');
    rate.innerHTML =
        '交換レート：<b>1コイン = ' +
        CASINO_COIN_PRICE_STEP420.toLocaleString() +
        'G</b><br>' +
        '<span style="font-size:11px;color:#a6a08f">現在の所持上限：' +
        game.casino.coinCap.toLocaleString() +
        '枚</span>';
    rate.style.lineHeight = '1.65';
    exchange.appendChild(rate);

    var currentMoney = document.createElement('div');
    currentMoney.textContent =
        '所持金：' + Number(game.money || 0).toLocaleString() + 'G';
    currentMoney.style.cssText =
        'margin-top:6px;font-size:12px;color:#c7cbd0;';
    exchange.appendChild(currentMoney);

    var buttonRow = document.createElement('div');
    Object.assign(buttonRow.style, {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '7px',
        marginTop: '10px'
    });

    function addBuyButton(label, amountGetter) {
        var b = document.createElement('button');
        b.textContent = label;
        b.style.minWidth = '92px';
        b.style.padding = '8px 10px';
        b.onclick = function(event) {
            event.stopPropagation();
            buyCasinoCoins_STEP420(amountGetter());
        };
        buttonRow.appendChild(b);
        return b;
    }

    addBuyButton('1枚購入', function() { return 1; });
    addBuyButton('10枚購入', function() { return 10; });
    addBuyButton('上限まで購入', function() {
        return getCasinoCoinBuyable_STEP420();
    });

    exchange.appendChild(buttonRow);

    var buyableText = document.createElement('div');
    buyableText.textContent =
        '現在購入可能：最大 ' +
        getCasinoCoinBuyable_STEP420().toLocaleString() +
        '枚';
    buyableText.style.cssText =
        'margin-top:8px;font-size:11px;color:#9fa5aa;';
    exchange.appendChild(buyableText);

    windowBox.appendChild(exchange);

    // ------------------------------------------------------------
    // 景品交換所
    // ------------------------------------------------------------
    var prizes = createCasinoPanel_STEP420('【 景品交換所 】');

    var prizeMessage = document.createElement('div');
    prizeMessage.innerHTML =
        '景品は現在準備中です。<br>' +
        '<span style="font-size:11px;color:#9fa5aa">今後、シニガミのカマやカジノコイン所持上限を拡張する景品などを追加予定。</span>';
    prizeMessage.style.lineHeight = '1.7';
    prizes.appendChild(prizeMessage);

    windowBox.appendChild(prizes);

    // 遊戯エリアはまだ準備中。
    var games = createCasinoPanel_STEP420('【 遊 戯 】');
    var gameMessage = document.createElement('div');
    gameMessage.textContent = 'ゲームは現在準備中です。';
    gameMessage.style.color = '#a9a9a9';
    games.appendChild(gameMessage);
    windowBox.appendChild(games);

    var close = document.createElement('button');
    close.textContent = '拠点へ戻る';
    Object.assign(close.style, {
        minWidth: '170px',
        padding: '10px 18px',
        marginTop: '16px',
        fontWeight: 'bold'
    });
    close.onclick = function(event) {
        event.stopPropagation();
        closeCasino_STEP418();
    };
    windowBox.appendChild(close);
}

const _step420_openCasino = openCasino_STEP418;
openCasino_STEP418 = function() {
    _step420_openCasino();
    renderCasinoContents_STEP420();
};

// セーブ / ロード
const _step420_createSaveData = createSaveData;
createSaveData = function() {
    ensureCasinoData_STEP420();
    var data = _step420_createSaveData();
    data.casino = deepCloneSimple(game.casino);
    return data;
};

const _step420_loadGame = loadGame;
loadGame = function() {
    _step420_loadGame();

    ensureCasinoData_STEP420();

    try {
        var raw = localStorage.getItem(SAVE_KEY);
        var data = raw ? JSON.parse(raw) : null;

        if (data && data.casino) {
            Object.assign(game.casino, data.casino);
        }
    } catch (error) {
        console.error(error);
    }

    ensureCasinoData_STEP420();
    updateAllBaseWindows();
};

ensureCasinoData_STEP420();


// ============================================================================
// STEP 4-21：カジノボタン反応修正
// ============================================================================

function forceBindCasinoButton_STEP421() {
    var button =
        document.getElementById(
            "casinoFacilityButton_STEP418"
        );

    if (!button) return;

    // 既存onclickが他の更新処理で消えても、毎回ここで再結線する。
    button.onclick = function(event) {
        event.stopPropagation();

        if (typeof openCasino === "function") {
            openCasino();
            return;
        }

        if (typeof showCasinoWindow_STEP420 === "function") {
            showCasinoWindow_STEP420();
            return;
        }

        if (typeof openCasinoWindow_STEP420 === "function") {
            openCasinoWindow_STEP420();
            return;
        }

        addLog(
            "【カジノ】画面を開く処理が見つかりません。"
        );
    };
}


// 拠点UI更新後に必ず再結線
const _step421_updateBaseUI =
    updateBaseUI;

updateBaseUI = function() {
    var result =
        _step421_updateBaseUI();

    forceBindCasinoButton_STEP421();

    return result;
};


// 全拠点ウィンドウ更新後にも再結線
const _step421_updateAllBaseWindows =
    updateAllBaseWindows;

updateAllBaseWindows = function() {
    var result =
        _step421_updateAllBaseWindows();

    forceBindCasinoButton_STEP421();

    return result;
};


// 初回
forceBindCasinoButton_STEP421();



// ============================================================================
// STEP 4-22：カジノボタン実関数へ直結
// ============================================================================
function forceBindCasinoButton_STEP422() {
    var button =
        document.getElementById(
            "casinoFacilityButton_STEP418"
        );

    if (!button) return;

    button.onclick = function(event) {
        event.preventDefault();
        event.stopPropagation();

        // 実際に存在するカジノ表示関数へ直接接続。
        openCasino_STEP418();
    };
}

const _step422_updateBaseUI = updateBaseUI;
updateBaseUI = function() {
    var result = _step422_updateBaseUI();
    forceBindCasinoButton_STEP422();
    return result;
};

const _step422_updateAllBaseWindows = updateAllBaseWindows;
updateAllBaseWindows = function() {
    var result = _step422_updateAllBaseWindows();
    forceBindCasinoButton_STEP422();
    return result;
};

// 初回も結線
forceBindCasinoButton_STEP422();



// ============================================================================
// STEP 4-23：カジノ入口を完全独立化
// ・baseOpenガードに依存しない
// ・専用オーバーレイを直接生成/表示
// ・documentのキャプチャ段階でもクリックを捕捉
// ============================================================================

function openCasinoDirect_STEP423() {
    ensureCasinoData_STEP420();

    var overlay = ensureCasinoUI_STEP418();

    if (!overlay) {
        addLog("【カジノ】画面の生成に失敗しました。");
        return;
    }

    // 既存の準備中画面を、現在のコイン交換所UIへ作り直す。
    renderCasinoContents_STEP420();

    // 他処理やCSSに負けないよう、表示状態を明示固定。
    overlay.style.setProperty("display", "flex", "important");
    overlay.style.setProperty("visibility", "visible", "important");
    overlay.style.setProperty("opacity", "1", "important");
    overlay.style.setProperty("pointer-events", "auto", "important");
    overlay.style.setProperty("z-index", "100000", "important");

    // 念のためbody直下に戻す。
    if (overlay.parentNode !== document.body) {
        document.body.appendChild(overlay);
    }
}

function bindCasinoButtonHard_STEP423() {
    var button =
        document.getElementById(
            "casinoFacilityButton_STEP418"
        );

    if (!button) return;

    button.disabled = false;
    button.style.pointerEvents = "auto";

    button.onclick = function(event) {
        event.preventDefault();
        event.stopPropagation();
        openCasinoDirect_STEP423();
    };
}

// ボタンが再生成・onclick上書きされても必ず拾う。
if (!window.__casinoDocumentCapture_STEP423) {
    window.__casinoDocumentCapture_STEP423 = true;

    document.addEventListener(
        "click",
        function(event) {
            var target =
                event.target &&
                event.target.closest
                    ? event.target.closest(
                        "#casinoFacilityButton_STEP418"
                    )
                    : null;

            if (!target) return;

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            openCasinoDirect_STEP423();
        },
        true
    );
}

const _step423_updateBaseUI = updateBaseUI;
updateBaseUI = function() {
    var result = _step423_updateBaseUI();
    bindCasinoButtonHard_STEP423();
    return result;
};

const _step423_updateAllBaseWindows = updateAllBaseWindows;
updateAllBaseWindows = function() {
    var result = _step423_updateAllBaseWindows();
    bindCasinoButtonHard_STEP423();
    return result;
};

bindCasinoButtonHard_STEP423();


// ============================================================================
// STEP 4-24：ショップ販売/売却 + カジノ景品交換所
// ============================================================================

const SHOP_RETURN_FEATHER_PRICE_STEP424 = 1000;

const CASINO_PRIZES_STEP424 = [
    {id:'goldenCompass', name:'黄金のコンパス', price:100, kind:'consumable', description:'現在地から階段などの進行地点までのルートを黄色く光らせる。'},
    {id:'simpleExplosive', name:'簡易型爆薬', price:10, kind:'consumable', description:'選択した鉱物の耐久を1,000減らす。'},
    {id:'highExplosive', name:'高性能爆薬', price:50, kind:'consumable', description:'選択した鉱物の耐久を10,000減らす。'},
    {id:'megaExplosive', name:'特大設置型爆薬', price:250, kind:'consumable', description:'通常鉱物を即時破壊する。ボスには使用不可。所持数に実質上限なし。'},
    {id:'smallCoinPurse', name:'小さながま口', price:100, kind:'cap', cap:500, description:'カジノコインの所持上限を500枚に上げる。'},
    {id:'familiarBox', name:'見覚えのある箱', price:500, kind:'cap', cap:2000, requiredCap:500, description:'カジノコインの所持上限を2,000枚に上げる。'},
    {id:'guardedStorage', name:'警備員つき簡易保管庫', price:2000, kind:'cap', cap:10000000, requiredCap:2000, description:'カジノコインの所持上限を10,000,000枚に上げる。'}
];

function ensureCasinoPrizeData_STEP424(){
    ensureCasinoData_STEP420();
    if(!game.casino.items) game.casino.items={};
    ['goldenCompass','simpleExplosive','highExplosive','megaExplosive'].forEach(function(id){
        game.casino.items[id]=Math.max(0,Math.floor(Number(game.casino.items[id]||0)));
    });
    if(!game.casinoRuntime) game.casinoRuntime={};
    if(!Number.isFinite(Number(game.casinoRuntime.megaUsedThisExpedition))) game.casinoRuntime.megaUsedThisExpedition=0;
    if(!Array.isArray(game.casinoRuntime.compassPath)) game.casinoRuntime.compassPath=[];
    if(!game.casinoRuntime.compassFloorKey) game.casinoRuntime.compassFloorKey='';
    if(!game.casinoRuntime.pendingExplosive) game.casinoRuntime.pendingExplosive='';
}

function getCasinoPrize_STEP424(id){
    return CASINO_PRIZES_STEP424.find(function(p){return p.id===id;})||null;
}

function buyCasinoPrize_STEP424(id){
    ensureCasinoPrizeData_STEP424();
    var p=getCasinoPrize_STEP424(id);
    if(!p)return;
    if(game.casino.coins<p.price){addLog('カジノコインが足りない。');renderCasinoContents_STEP420();return;}
    if(p.kind==='cap'){
        if(game.casino.coinCap>=p.cap){addLog(p.name+'はすでに適用済みです。');return;}
        if(p.requiredCap&&game.casino.coinCap<p.requiredCap){addLog('先に前段階のコインケースが必要です。');return;}
        game.casino.coins-=p.price;
        game.casino.coinCap=p.cap;
        addLog(p.name+'を交換した。カジノコイン所持上限が'+p.cap.toLocaleString()+'枚になった。');
    }else{
        game.casino.coins-=p.price;
        game.casino.items[p.id]=(game.casino.items[p.id]||0)+1;
        addLog(p.name+'を1個交換した。');
    }
    updateAllBaseWindows();
    renderCasinoContents_STEP420();
}

function createCasinoPrizeRow_STEP424(parent,p){
    var row=document.createElement('div');
    Object.assign(row.style,{padding:'9px',marginBottom:'7px',border:'1px solid #655720',borderRadius:'5px',background:'rgba(20,18,5,.35)'});
    var top=document.createElement('div');
    Object.assign(top.style,{display:'flex',justifyContent:'space-between',gap:'10px',alignItems:'center'});
    var left=document.createElement('div');
    left.innerHTML='<b>'+p.name+'</b><div style="font-size:11px;color:#aaa;margin-top:3px">'+p.description+'</div>';
    var right=document.createElement('div');
    right.style.textAlign='right';
    var price=document.createElement('div');price.textContent=p.price.toLocaleString()+' COIN';price.style.color='#ffe66a';price.style.fontWeight='bold';
    var b=document.createElement('button');b.style.marginTop='5px';
    if(p.kind==='cap'&&game.casino.coinCap>=p.cap){b.textContent='交換済み';b.disabled=true;}
    else if(p.kind==='cap'&&p.requiredCap&&game.casino.coinCap<p.requiredCap){b.textContent='前段階が必要';b.disabled=true;}
    else{b.textContent='交換';b.disabled=game.casino.coins<p.price;b.onclick=function(e){e.stopPropagation();buyCasinoPrize_STEP424(p.id);};}
    right.append(price,b);top.append(left,right);row.appendChild(top);parent.appendChild(row);
}

const _step424_renderCasinoContents = renderCasinoContents_STEP420;
renderCasinoContents_STEP420=function(){
    ensureCasinoPrizeData_STEP424();
    _step424_renderCasinoContents();
    var overlay=ensureCasinoUI_STEP418(); if(!overlay)return;
    var box=overlay.firstElementChild;if(!box)return;
    var panels=Array.from(box.children).filter(function(el){return el.firstElementChild&&/^【/.test(el.firstElementChild.textContent||'');});
    var prizes=panels.find(function(el){return (el.firstElementChild.textContent||'').indexOf('景品交換所')>=0;});
    if(prizes){while(prizes.children.length>1)prizes.removeChild(prizes.lastChild);CASINO_PRIZES_STEP424.forEach(function(p){createCasinoPrizeRow_STEP424(prizes,p);});}
    var games=panels.find(function(el){return (el.firstElementChild.textContent||'').indexOf('遊 戯')>=0;});
    if(games&&games.children.length>1){games.children[1].textContent='ゲームはこれから追加予定です。カジノ自体はゲーム開始時から利用できます。';}
};

// ----------------------------------------------------------------------------
// ショップ：販売 / 売却
// ----------------------------------------------------------------------------
function buyShopReturnFeather_STEP424(){
    if(!game.shopOpen)return;
    if(game.money<SHOP_RETURN_FEATHER_PRICE_STEP424){addLog('所持金が足りません。');return;}
    game.money-=SHOP_RETURN_FEATHER_PRICE_STEP424;
    game.inventory.items.returnFeather=(game.inventory.items.returnFeather||0)+1;
    addLog('帰還の羽を1個購入した。 (-1,000G)');
    updateAllBaseWindows();updateShopUI();
}

function createShopModeTabs_STEP424(box){
    if(!game.shopMode_STEP424)game.shopMode_STEP424='buy';
    var tabs=document.createElement('div');Object.assign(tabs.style,{display:'flex',gap:'7px',marginBottom:'12px'});
    [['buy','販売'],['sell','売却']].forEach(function(x){var b=document.createElement('button');b.textContent=x[1];b.disabled=game.shopMode_STEP424===x[0];b.onclick=function(e){e.stopPropagation();game.shopMode_STEP424=x[0];updateShopUI();};tabs.appendChild(b);});
    box.appendChild(tabs);
}

function renderShopBuy_STEP424(box){
    var row=document.createElement('div');Object.assign(row.style,{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'10px',padding:'10px',border:'1px solid #555',borderRadius:'5px',background:'rgba(0,0,0,.16)'});
    var info=document.createElement('div');info.innerHTML='<b>帰還の羽</b><div style="font-size:11px;color:#aaa;margin-top:3px">探索中に拠点へ帰還できる。　所持：'+(game.inventory.items.returnFeather||0)+'</div>';
    var right=document.createElement('div');right.style.textAlign='right';var price=document.createElement('div');price.textContent='1,000G';price.style.color='#f1c66a';price.style.fontWeight='bold';var b=document.createElement('button');b.textContent='購入';b.disabled=game.money<SHOP_RETURN_FEATHER_PRICE_STEP424;b.style.marginTop='5px';b.onclick=function(e){e.stopPropagation();buyShopReturnFeather_STEP424();};right.append(price,b);row.append(info,right);box.appendChild(row);
}

function getShopSellLayers_STEP424(){
    var a=[1];if(game.layer2&&game.layer2.unlocked)a.push(2);if(game.layer3&&game.layer3.unlocked)a.push(3);if(game.layer4&&game.layer4.unlocked)a.push(4);return a;
}
function renderShopSell_STEP424(box){
    var layers=getShopSellLayers_STEP424();if(!layers.includes(Number(game.shopSellLayer_STEP424)))game.shopSellLayer_STEP424=layers[0];
    if(layers.length>1){var tabs=document.createElement('div');Object.assign(tabs.style,{display:'flex',gap:'5px',flexWrap:'wrap',marginBottom:'9px'});layers.forEach(function(l){var names={1:'通常鉱山',2:'旧坑道',3:'無風回廊',4:'残光遺跡'};var b=document.createElement('button');b.textContent=names[l];b.disabled=Number(game.shopSellLayer_STEP424)===l;b.onclick=function(e){e.stopPropagation();game.shopSellLayer_STEP424=l;updateShopUI();};tabs.appendChild(b);});box.appendChild(tabs);}
    ORE_TYPES.filter(function(o){return Number(o.worldLayer||1)===Number(game.shopSellLayer_STEP424||1);}).forEach(function(type){createShopOreRow(box,type);});
    var all=document.createElement('button');all.textContent='表示中の鉱石をまとめて売る';all.style.marginTop='8px';all.onclick=function(e){e.stopPropagation();var ids=ORE_TYPES.filter(function(o){return Number(o.worldLayer||1)===Number(game.shopSellLayer_STEP424||1);});ids.forEach(function(t){var amt=game.warehouse.ores[t.id]||0;if(amt>0)sellOre(t.id,amt);});};box.appendChild(all);
}

updateShopUI=function(){
    var box=document.getElementById('shopWindow');if(!box)return;box.innerHTML='';box.appendChild(createTitle('ショップ'));createShopModeTabs_STEP424(box);
    var m=document.createElement('div');m.textContent='所持金：'+Number(game.money||0).toLocaleString()+' G';m.style.cssText='font-weight:bold;color:#f1c66a;margin-bottom:12px';box.appendChild(m);
    if(game.shopMode_STEP424==='buy')renderShopBuy_STEP424(box);else renderShopSell_STEP424(box);
    var c=document.createElement('button');c.textContent='閉じる';c.style.marginTop='12px';c.onclick=function(e){e.stopPropagation();closeShop();};box.appendChild(c);
};

// ----------------------------------------------------------------------------
// 黄金のコンパス
// ----------------------------------------------------------------------------
function currentFloorKey_STEP424(){
    var l=Number(game.world.currentLayer||1);var f=l===1?game.currentMineLevel:l===2?game.layer2.currentFloor:l===3?game.layer3.currentFloor:l===4?game.layer4.currentFloor:game.layer5.currentFloor;return l+':'+f;
}
function getCompassTarget_STEP424(){
    if(typeof getDevWarpTarget_STEP416==='function')return getDevWarpTarget_STEP416();
    return game.stairs?{x:game.stairs.x,y:game.stairs.y,name:'階段'}:null;
}
function buildCompassPath_STEP424(target){
    if(!target||!game.map)return[];var h=game.map.length,w=game.map[0]?game.map[0].length:0;if(!w)return[];
    var q=[{x:game.player.x,y:game.player.y}],head=0,prev={},seen={};seen[game.player.x+','+game.player.y]=true;var end=null,dirs=[[1,0],[-1,0],[0,1],[0,-1]];
    var blocked={};(game.ores||[]).forEach(function(o){if(o.boss)blocked[o.x+','+o.y]=true;});
    while(head<q.length){var p=q[head++];var d=Math.abs(p.x-target.x)+Math.abs(p.y-target.y);if(d<=1||(!blocked[p.x+','+p.y]&&p.x===target.x&&p.y===target.y)){end=p;break;}
        for(var i=0;i<4;i++){var nx=p.x+dirs[i][0],ny=p.y+dirs[i][1],k=nx+','+ny;if(nx<0||ny<0||nx>=w||ny>=h||seen[k]||game.map[ny][nx]==='wall'||blocked[k])continue;seen[k]=true;prev[k]=p;q.push({x:nx,y:ny});}}
    if(!end)return[];var path=[];var cur=end;while(cur){path.push({x:cur.x,y:cur.y});if(cur.x===game.player.x&&cur.y===game.player.y)break;cur=prev[cur.x+','+cur.y];}path.reverse();return path;
}
function useGoldenCompass_STEP424(){
    ensureCasinoPrizeData_STEP424();if(game.baseOpen){addLog('探索中に使用してください。');return;}if((game.casino.items.goldenCompass||0)<=0){addLog('黄金のコンパスを持っていません。');return;}
    var target=getCompassTarget_STEP424();var path=buildCompassPath_STEP424(target);if(path.length<=1){addLog('進行地点へのルートを特定できない。');return;}
    game.casino.items.goldenCompass--;game.casinoRuntime.compassPath=path;game.casinoRuntime.compassFloorKey=currentFloorKey_STEP424();
    path.forEach(function(p){if(game.explored&&game.explored[p.y])game.explored[p.y][p.x]=true;});
    addLog('黄金のコンパスが進行地点への道を示した。');closeInventory();render();
}
function decorateCompassPath_STEP424(){
    ensureCasinoPrizeData_STEP424();if(game.baseOpen||game.casinoRuntime.compassFloorKey!==currentFloorKey_STEP424()||!mapElement)return;
    var set={};game.casinoRuntime.compassPath.forEach(function(p){set[p.x+','+p.y]=true;});var layer=Number(game.world.currentLayer||1),cam;
    if(layer===1){cam={minX:0,minY:0,cols:MAP_SIZE,maxX:MAP_SIZE-1,maxY:MAP_SIZE-1};}
    else{var size=layer===2?getLayer2MapSize():layer===3?LAYER3_SIZE:layer===4?game.layer4.runtime.size:game.layer5.runtime.size;var rad=layer===2?LAYER2_CAMERA_RADIUS:layer===3?LAYER3_CAMERA_RADIUS:layer===4?LAYER4_CAMERA_RADIUS:10;cam=getFixedCameraBounds(size,game.player.x,game.player.y,rad);}
    Object.keys(set).forEach(function(k){var s=k.split(','),x=+s[0],y=+s[1];if(x<cam.minX||x>cam.maxX||y<cam.minY||y>cam.maxY)return;var idx=(y-cam.minY)*cam.cols+(x-cam.minX),t=mapElement.children[idx];if(t){t.style.boxShadow='inset 0 0 0 2px #ffe544, 0 0 8px #ffd900';t.style.backgroundColor='#5b5318';}});
}

// ----------------------------------------------------------------------------
// 爆薬
// ----------------------------------------------------------------------------
function selectCasinoExplosive_STEP424(id){
    ensureCasinoPrizeData_STEP424();if(game.baseOpen){addLog('探索中に使用してください。');return;}if((game.casino.items[id]||0)<=0){addLog('アイテムを持っていません。');return;}
    
    game.casinoRuntime.pendingExplosive=id;var p=getCasinoPrize_STEP424(id);addLog(p.name+'を選択した。使用する鉱物をクリックしてください。');closeInventory();
}
function destroyOreByExplosive_STEP424(ore){
    var layer=Number(game.world.currentLayer||1),idx;
    if(layer===1){addOreToExpeditionBag(ore);recordOreMined(ore.id,1);addLog(ore.name+'を1個入手しました。');idx=game.ores.indexOf(ore);if(idx>=0)game.ores.splice(idx,1);return;}
    if(layer===2){if(ore.boss)handleLayer2BossDestroyed(ore);else{addOreToExpeditionBag(ore);recordOreMined(ore.id,1);addLog(ore.name+'を1個入手しました。');}idx=game.ores.indexOf(ore);if(idx>=0)game.ores.splice(idx,1);return;}
    if(layer===3){idx=game.ores.indexOf(ore);if(idx>=0)game.ores.splice(idx,1);if(ore.boss){var s=layer3BossState(game.layer3.currentFloor);s.hps[ore.bossIndex]=0;if(layer3BossCleared(game.layer3.currentFloor)){s.firstDefeated=true;grantLayer3Story(game.layer3.currentFloor);addLog('回廊結晶群が崩壊した。階段への道が開いた。');}}else if(ore.fake){damageLaterLayer(game.player.maxHp*(0.25+Math.random()*0.15),'偽鉱石が爆発した。');}else{addOreAmountToExpeditionBag(ore.id,1);recordOreMined(ore.id,1);addLog(ore.name+'を1個入手しました。');}return;}
    if(layer===4){idx=game.ores.indexOf(ore);if(idx>=0)game.ores.splice(idx,1);if(ore.fake)damageLaterLayer(game.player.maxHp*(0.40+Math.random()*0.20),'偽鉱石が爆発した。');else{addOreAmountToExpeditionBag(ore.id,1);recordOreMined(ore.id,1);addLog(ore.name+'を1個入手しました。');}return;}
    if(layer===5){idx=game.ores.indexOf(ore);if(idx>=0)game.ores.splice(idx,1);if(game.layer5.currentFloor===1006){var rt=game.layer5.runtime;game.ores=[];rt.wave++;if(rt.wave>5){game.stairs.found=true;addLog('最後の鉱石が砕けた。');}else setTimeout(spawnLuckWave,120);}else{addOreAmountToExpeditionBag(ore.id,1);recordOreMined(ore.id,1);}return;}
}
function applySelectedExplosive_STEP424(ore){
    ensureCasinoPrizeData_STEP424();var id=game.casinoRuntime.pendingExplosive;if(!id)return false;if(!ore)return true;
    if(Number(game.world.currentLayer)===5&&Number(game.layer5.currentFloor)===1010){addLog('ここでは爆薬を使用できない。');game.casinoRuntime.pendingExplosive='';return true;}
    if(id==='megaExplosive'&&ore.boss){addLog('特大設置型爆薬はボス鉱物には使用できない。');return true;}
    if((game.casino.items[id]||0)<=0){game.casinoRuntime.pendingExplosive='';return true;}
    
    if(Number(game.world.currentLayer)===4&&game.layer4.runtime.special!=='night'&&game.layer4.runtime.special!=='final'){if(layer4CountDown(1)){game.casinoRuntime.pendingExplosive='';return true;}}
    game.casino.items[id]--;game.casinoRuntime.pendingExplosive='';var damage=id==='simpleExplosive'?1000:id==='highExplosive'?10000:Infinity;
    var before=ore.hp;ore.hp=damage===Infinity?0:Math.max(0,ore.hp-damage);if(ore.boss&&Number(game.world.currentLayer)===2){var bs=initLayer2BossState(ore.bossFloor);bs.remainingHp=ore.hp;}
    addLog(getCasinoPrize_STEP424(id).name+'を使用。'+ore.name+'の耐久 '+before+' → '+ore.hp+'。');if(ore.hp<=0)destroyOreByExplosive_STEP424(ore);
    if(Number(game.world.currentLayer)===2)layer2AfterAction({trap:false,gas:true});else if(Number(game.world.currentLayer)===3)triggerLayer3Wind();render();return true;
}
const _step424_mineOre=mineOre;
mineOre=function(ore){if(game.casinoRuntime&&game.casinoRuntime.pendingExplosive){if(applySelectedExplosive_STEP424(ore))return;}return _step424_mineOre(ore);};

// 探索開始ごとに特大爆薬使用回数と一時選択をリセット。
const _step424_hideBase=hideBase;
hideBase=function(){ensureCasinoPrizeData_STEP424();game.casinoRuntime.megaUsedThisExpedition=0;game.casinoRuntime.pendingExplosive='';game.casinoRuntime.compassPath=[];game.casinoRuntime.compassFloorKey='';return _step424_hideBase();};

// ----------------------------------------------------------------------------
// インベントリへカジノ景品を追加
// ----------------------------------------------------------------------------
function appendCasinoItemsToInventory_STEP424(){
    ensureCasinoPrizeData_STEP424();var box=document.getElementById('inventoryWindow');if(!box||game.baseOpen)return;
    var old=document.getElementById('casinoItemsPanel_STEP424');if(old)old.remove();
    var panel=document.createElement('div');panel.id='casinoItemsPanel_STEP424';panel.style.cssText='margin-top:11px;padding:9px;border:1px solid #756522;border-radius:6px;background:rgba(50,40,5,.18)';
    var h=document.createElement('div');h.textContent='【 カジノ景品 】';h.style.cssText='font-weight:bold;color:#ffe56b;margin-bottom:7px';panel.appendChild(h);
    function row(name,count,fn,disabledText){var r=document.createElement('div');r.style.cssText='display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:5px';var s=document.createElement('span');s.textContent=name+'：'+count;var b=document.createElement('button');b.textContent=disabledText||'使用';b.disabled=count<=0||!!disabledText;b.onclick=function(e){e.stopPropagation();fn();};r.append(s,b);panel.appendChild(r);}
    row('黄金のコンパス',game.casino.items.goldenCompass,useGoldenCompass_STEP424);
    row('簡易型爆薬',game.casino.items.simpleExplosive,function(){selectCasinoExplosive_STEP424('simpleExplosive');});
    row('高性能爆薬',game.casino.items.highExplosive,function(){selectCasinoExplosive_STEP424('highExplosive');});
    row('特大設置型爆薬',game.casino.items.megaExplosive,function(){selectCasinoExplosive_STEP424('megaExplosive');});
    var close=Array.from(box.querySelectorAll('button')).find(function(x){return x.textContent==='閉じる';});if(close)box.insertBefore(panel,close);else box.appendChild(panel);
}
const _step424_updateInventoryUI=updateInventoryUI;
updateInventoryUI=function(){var r=_step424_updateInventoryUI();appendCasinoItemsToInventory_STEP424();return r;};

// ルート光表示を最終render後に重ねる。
const _step424_render=render;
render=function(){var r=_step424_render();decorateCompassPath_STEP424();return r;};

// カジノは最初から利用可能：ボタンを常時有効化。
function ensureCasinoAlwaysAvailable_STEP424(){var b=document.getElementById('casinoFacilityButton_STEP418');if(b){b.disabled=false;b.style.display='';b.style.pointerEvents='auto';}}
const _step424_updateBaseUI=updateBaseUI;
updateBaseUI=function(){var r=_step424_updateBaseUI();ensureCasinoAlwaysAvailable_STEP424();return r;};

ensureCasinoPrizeData_STEP424();
ensureCasinoAlwaysAvailable_STEP424();


// ============================================================================
// STEP 4-25：王道3リールスロット + カジノスクロール
//             + DEV所持金MAX/コインMAX + 基本UI快適化
// ============================================================================

const DEV_MAX_MONEY_STEP425 = Number.MAX_SAFE_INTEGER;

const CASINO_SLOT_SYMBOLS_STEP425 = [
    {id:'cherry', symbol:'🍒', label:'チェリー', weight:30},
    {id:'lemon', symbol:'🍋', label:'レモン', weight:25},
    {id:'bell', symbol:'🔔', label:'ベル', weight:20},
    {id:'bar', symbol:'BAR', label:'BAR', weight:15},
    {id:'seven', symbol:'7', label:'7', weight:10}
];

function ensureCasinoSlotData_STEP425() {
    ensureCasinoPrizeData_STEP424();

    if (!game.casino.slot) game.casino.slot = {};

    var slot = game.casino.slot;

    if (![1,5,10].includes(Number(slot.bet))) slot.bet = 1;
    if (!Array.isArray(slot.lastResult) || slot.lastResult.length !== 3) {
        slot.lastResult = ['cherry','lemon','bell'];
    }

    ['spins','totalBet','totalPaid','bestWin'].forEach(function(key) {
        slot[key] = Math.max(0, Math.floor(Number(slot[key] || 0)));
    });

    if (!game.casinoRuntime) game.casinoRuntime = {};
    if (typeof game.casinoRuntime.slotSpinning !== 'boolean') {
        game.casinoRuntime.slotSpinning = false;
    }
}

function getCasinoSlotSymbol_STEP425(id) {
    return CASINO_SLOT_SYMBOLS_STEP425.find(function(s) {
        return s.id === id;
    }) || CASINO_SLOT_SYMBOLS_STEP425[0];
}

function randomCasinoSlotSymbol_STEP425() {
    var total = CASINO_SLOT_SYMBOLS_STEP425.reduce(function(sum, s) {
        return sum + s.weight;
    }, 0);

    var r = Math.random() * total;

    for (var i = 0; i < CASINO_SLOT_SYMBOLS_STEP425.length; i++) {
        r -= CASINO_SLOT_SYMBOLS_STEP425[i].weight;
        if (r < 0) return CASINO_SLOT_SYMBOLS_STEP425[i].id;
    }

    return 'cherry';
}

function getCasinoSlotMultiplier_STEP425(result) {
    var a = result[0];
    var b = result[1];
    var c = result[2];

    if (a === b && b === c) {
        if (a === 'seven') return 100;
        if (a === 'bar') return 30;
        if (a === 'bell') return 15;
        if (a === 'lemon') return 8;
        if (a === 'cherry') return 5;
    }

    var cherries = result.filter(function(id) {
        return id === 'cherry';
    }).length;

    if (cherries === 2) return 2;

    return 0;
}

function setCasinoSlotBet_STEP425(bet) {
    ensureCasinoSlotData_STEP425();

    bet = Number(bet);

    if (![1,5,10].includes(bet)) return;
    if (game.casinoRuntime.slotSpinning) return;

    game.casino.slot.bet = bet;
    renderCasinoContents_STEP420();
}

function updateSlotReelVisual_STEP425(result) {
    for (var i = 0; i < 3; i++) {
        var reel = document.getElementById('casinoSlotReel_STEP425_' + i);
        if (!reel) continue;

        var s = getCasinoSlotSymbol_STEP425(result[i]);
        reel.textContent = s.symbol;

        if (s.id === 'bar') {
            reel.style.fontSize = '27px';
            reel.style.letterSpacing = '-1px';
        } else if (s.id === 'seven') {
            reel.style.fontSize = '46px';
            reel.style.color = '#ff5555';
            reel.style.textShadow = '0 0 10px rgba(255,70,70,.8)';
        } else {
            reel.style.fontSize = '39px';
            reel.style.color = '';
            reel.style.textShadow = '';
        }
    }
}

function finishCasinoSlotSpin_STEP425(result, bet) {
    ensureCasinoSlotData_STEP425();

    var slot = game.casino.slot;
    var multiplier = getCasinoSlotMultiplier_STEP425(result);
    var payout = bet * multiplier;

    var capacity = Math.max(0, game.casino.coinCap - game.casino.coins);
    var credited = Math.min(payout, capacity);

    game.casino.coins += credited;
    slot.lastResult = result.slice();
    slot.spins++;
    slot.totalBet += bet;
    slot.totalPaid += credited;
    slot.bestWin = Math.max(slot.bestWin, credited);

    game.casinoRuntime.slotSpinning = false;

    if (multiplier > 0) {
        addLog(
            '【スロット】' +
            result.map(function(id) {
                return getCasinoSlotSymbol_STEP425(id).symbol;
            }).join(' ') +
            '　×' + multiplier +
            '　' + credited.toLocaleString() + 'コイン獲得！'
        );

        if (credited < payout) {
            addLog(
                'カジノコイン所持上限のため、' +
                (payout - credited).toLocaleString() +
                'コイン分は受け取れなかった。'
            );
        }
    } else {
        addLog('【スロット】ハズレ。');
    }

    updateAllBaseWindows();
    renderCasinoContents_STEP420();
}

function spinCasinoSlot_STEP425() {
    ensureCasinoSlotData_STEP425();

    if (game.casinoRuntime.slotSpinning) return;

    var bet = Number(game.casino.slot.bet || 1);

    if (game.casino.coins < bet) {
        addLog('スロットを回すカジノコインが足りない。');
        renderCasinoContents_STEP420();
        return;
    }

    game.casino.coins -= bet;
    game.casinoRuntime.slotSpinning = true;

    renderCasinoContents_STEP420();

    var ticks = 0;
    var timer = setInterval(function() {
        ticks++;

        updateSlotReelVisual_STEP425([
            randomCasinoSlotSymbol_STEP425(),
            randomCasinoSlotSymbol_STEP425(),
            randomCasinoSlotSymbol_STEP425()
        ]);

        if (ticks >= 11) {
            clearInterval(timer);

            var result = [
                randomCasinoSlotSymbol_STEP425(),
                randomCasinoSlotSymbol_STEP425(),
                randomCasinoSlotSymbol_STEP425()
            ];

            updateSlotReelVisual_STEP425(result);

            setTimeout(function() {
                finishCasinoSlotSpin_STEP425(result, bet);
            }, 260);
        }
    }, 70);
}

function createCasinoSlotPanel_STEP425() {
    ensureCasinoSlotData_STEP425();

    var slot = game.casino.slot;
    var panel = createCasinoPanel_STEP420('【 王 道 ス ロ ッ ト 】');
    panel.id = 'casinoSlotPanel_STEP425';

    var intro = document.createElement('div');
    intro.textContent = '3リール・1ライン。BETしたコイン数に応じて配当も増加します。';
    intro.style.cssText =
        'font-size:11px;color:#b9b4a6;margin-bottom:10px;line-height:1.5;';
    panel.appendChild(intro);

    var machine = document.createElement('div');
    Object.assign(machine.style, {
        padding: '13px',
        border: '2px solid #c6a32b',
        borderRadius: '9px',
        background: 'linear-gradient(180deg,#211b05,#0e0d08)',
        boxShadow: 'inset 0 0 18px rgba(255,205,30,.12), 0 0 13px rgba(255,205,30,.15)'
    });

    var reels = document.createElement('div');
    Object.assign(reels.style, {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px'
    });

    slot.lastResult.forEach(function(id, index) {
        var reel = document.createElement('div');
        reel.id = 'casinoSlotReel_STEP425_' + index;

        Object.assign(reel.style, {
            height: '76px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid #d6b847',
            borderRadius: '8px',
            background: 'linear-gradient(180deg,#f7f1d2,#d5c889)',
            color: '#151515',
            fontWeight: '1000',
            fontSize: '39px',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 14px rgba(0,0,0,.28)'
        });

        reels.appendChild(reel);
    });

    machine.appendChild(reels);
    panel.appendChild(machine);

    setTimeout(function() {
        updateSlotReelVisual_STEP425(slot.lastResult);
    }, 0);

    var betTitle = document.createElement('div');
    betTitle.textContent = 'BET';
    betTitle.style.cssText =
        'margin-top:11px;font-size:11px;color:#b9b4a6;font-weight:bold;';
    panel.appendChild(betTitle);

    var betRow = document.createElement('div');
    Object.assign(betRow.style, {
        display: 'flex',
        gap: '7px',
        flexWrap: 'wrap',
        marginTop: '6px'
    });

    [1,5,10].forEach(function(bet) {
        var b = document.createElement('button');
        b.textContent = bet + ' COIN';
        b.disabled =
            game.casinoRuntime.slotSpinning ||
            Number(slot.bet) === bet;

        Object.assign(b.style, {
            minWidth: '92px',
            minHeight: '36px',
            fontWeight: 'bold'
        });

        b.onclick = function(event) {
            event.stopPropagation();
            setCasinoSlotBet_STEP425(bet);
        };

        betRow.appendChild(b);
    });

    panel.appendChild(betRow);

    var spin = document.createElement('button');
    spin.textContent =
        game.casinoRuntime.slotSpinning
            ? 'SPINNING...'
            : '★ SPIN ★';

    spin.disabled =
        game.casinoRuntime.slotSpinning ||
        game.casino.coins < slot.bet;

    Object.assign(spin.style, {
        width: '100%',
        minHeight: '48px',
        marginTop: '10px',
        fontSize: '17px',
        fontWeight: '900',
        letterSpacing: '.08em',
        color: '#fff3a0',
        border: '2px solid #ffd92f',
        background: 'linear-gradient(180deg,#473900,#201800)',
        boxShadow: '0 0 10px rgba(255,210,30,.25)'
    });

    spin.onclick = function(event) {
        event.stopPropagation();
        spinCasinoSlot_STEP425();
    };

    panel.appendChild(spin);

    var pay = document.createElement('div');
    pay.innerHTML =
        '<b>配当</b><br>' +
        '🍒🍒：×2　／　🍒🍒🍒：×5　／　🍋🍋🍋：×8<br>' +
        '🔔🔔🔔：×15　／　BAR BAR BAR：×30　／　' +
        '<span style="color:#ff7070;font-weight:bold">777：×100</span>';

    pay.style.cssText =
        'margin-top:10px;padding:8px;border-top:1px dashed #6d602c;' +
        'font-size:11px;line-height:1.7;color:#d3cdbb;';
    panel.appendChild(pay);

    var stats = document.createElement('div');
    stats.textContent =
        'PLAY ' + slot.spins.toLocaleString() +
        '　／　BET累計 ' + slot.totalBet.toLocaleString() +
        '　／　払出累計 ' + slot.totalPaid.toLocaleString() +
        '　／　最高 ' + slot.bestWin.toLocaleString();

    stats.style.cssText =
        'margin-top:7px;font-size:10px;color:#8f959b;text-align:center;';
    panel.appendChild(stats);

    return panel;
}


// カジノ「遊戯」欄をスロット実機に置換。
const _step425_renderCasinoContents = renderCasinoContents_STEP420;
renderCasinoContents_STEP420 = function() {
    ensureCasinoSlotData_STEP425();
    _step425_renderCasinoContents();

    var overlay = ensureCasinoUI_STEP418();
    if (!overlay) return;

    var box = overlay.firstElementChild;
    if (!box) return;

    var panels = Array.from(box.children).filter(function(el) {
        return el.firstElementChild &&
            /^【/.test(el.firstElementChild.textContent || '');
    });

    var games = panels.find(function(el) {
        return (el.firstElementChild.textContent || '')
            .indexOf('遊 戯') >= 0;
    });

    if (games) {
        var slotPanel = createCasinoSlotPanel_STEP425();
        games.replaceWith(slotPanel);
    }

    applyCasinoScrollFix_STEP425();
};


// ---------------------------------------------------------------------------
// カジノ画面：スクロール修正
// ---------------------------------------------------------------------------
function applyCasinoScrollFix_STEP425() {
    var overlay = ensureCasinoUI_STEP418();
    if (!overlay) return;

    var box = overlay.firstElementChild;
    if (!box) return;

    Object.assign(overlay.style, {
        overflowY: 'auto',
        overflowX: 'hidden',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '16px 8px',
        boxSizing: 'border-box',
        overscrollBehavior: 'contain'
    });

    Object.assign(box.style, {
        maxHeight: 'calc(100vh - 32px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        margin: '0 auto',
        scrollbarGutter: 'stable',
        WebkitOverflowScrolling: 'touch'
    });
}


// ---------------------------------------------------------------------------
// DEV：所持金MAX / カジノコインMAX
// ---------------------------------------------------------------------------
function devSetMoneyMax_STEP425() {
    if (!DEV_MODE) return;

    game.money = DEV_MAX_MONEY_STEP425;

    addLog(
        '【開発】所持金を最大値 ' +
        DEV_MAX_MONEY_STEP425.toLocaleString() +
        'G にしました。'
    );

    updateAllBaseWindows();
    updateDevUI();
}

function devSetCasinoCoinsMax_STEP425() {
    if (!DEV_MODE) return;

    ensureCasinoData_STEP420();
    game.casino.coins = game.casino.coinCap;

    addLog(
        '【開発】カジノコインを現在の所持上限 ' +
        game.casino.coinCap.toLocaleString() +
        '枚まで補充しました。'
    );

    updateAllBaseWindows();
    updateDevUI();

    if (
        document.getElementById('casinoOverlay_STEP418') &&
        document.getElementById('casinoOverlay_STEP418').style.display !== 'none'
    ) {
        renderCasinoContents_STEP420();
    }
}

function appendDevCurrencyPanel_STEP425() {
    if (!DEV_MODE) return;

    var box = document.getElementById('devWindow');
    if (!box) return;

    var old = document.getElementById('devCurrencyPanel_STEP425');
    if (old) old.remove();

    ensureCasinoData_STEP420();

    var panel = document.createElement('div');
    panel.id = 'devCurrencyPanel_STEP425';
    panel.className = 'dev-panel';

    var title = document.createElement('div');
    title.textContent = '【 所持資源テスト 】';
    title.style.cssText = 'font-weight:bold;margin-bottom:8px;';
    panel.appendChild(title);

    var status = document.createElement('div');
    status.innerHTML =
        '所持金：<b>' +
        Number(game.money || 0).toLocaleString() +
        'G</b><br>' +
        'カジノコイン：<b>' +
        game.casino.coins.toLocaleString() +
        ' / ' +
        game.casino.coinCap.toLocaleString() +
        '枚</b>';

    status.style.cssText =
        'font-size:11px;color:#aeb6bd;line-height:1.6;margin-bottom:8px;';
    panel.appendChild(status);

    var money = document.createElement('button');
    money.textContent = '所持金をMAX';
    money.style.margin = '0 7px 6px 0';
    money.disabled = game.money >= DEV_MAX_MONEY_STEP425;
    money.onclick = function(event) {
        event.stopPropagation();
        devSetMoneyMax_STEP425();
    };
    panel.appendChild(money);

    var coin = document.createElement('button');
    coin.textContent = 'コインをMAX';
    coin.style.marginBottom = '6px';
    coin.disabled = game.casino.coins >= game.casino.coinCap;
    coin.onclick = function(event) {
        event.stopPropagation();
        devSetCasinoCoinsMax_STEP425();
    };
    panel.appendChild(coin);

    var note = document.createElement('div');
    note.textContent =
        'コインMAXは現在の所持上限まで補充します。上限自体は景品交換で拡張してください。';
    note.style.cssText =
        'font-size:10px;color:#8f989f;margin-top:2px;line-height:1.5;';
    panel.appendChild(note);

    var close = Array.from(box.querySelectorAll('button')).find(function(b) {
        return b.textContent === '閉じる';
    });

    if (close) box.insertBefore(panel, close);
    else box.appendChild(panel);
}

const _step425_updateDevUI = updateDevUI;
updateDevUI = function() {
    var result = _step425_updateDevUI();
    appendDevCurrencyPanel_STEP425();
    return result;
};


// ---------------------------------------------------------------------------
// ショップ / 倉庫 / インベントリ：共通の視認性・操作性改善
// ---------------------------------------------------------------------------
function polishUtilityWindow_STEP425(id) {
    var box = document.getElementById(id);
    if (!box) return;

    Object.assign(box.style, {
        width: 'min(680px, calc(100vw - 28px))',
        maxWidth: '680px',
        maxHeight: 'calc(100vh - 50px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        scrollbarGutter: 'stable',
        lineHeight: '1.45'
    });

    Array.from(box.querySelectorAll('button')).forEach(function(button) {
        button.style.minHeight = '35px';
        button.style.padding = '7px 11px';
        button.style.fontSize = '12px';
    });

    Array.from(box.children).forEach(function(child) {
        if (
            child.tagName === 'DIV' &&
            child.style.display === 'flex'
        ) {
            child.style.alignItems = 'center';
            child.style.gap = child.style.gap || '10px';
            child.style.minHeight = '32px';
        }
    });

    var close = Array.from(box.querySelectorAll('button')).find(function(b) {
        return b.textContent === '閉じる';
    });

    if (close) {
        Object.assign(close.style, {
            position: 'sticky',
            bottom: '0',
            zIndex: '5',
            width: '100%',
            minHeight: '42px',
            marginTop: '12px',
            background: '#252a2f',
            borderTop: '1px solid #596069'
        });
    }
}

function polishAllUtilityWindows_STEP425() {
    polishUtilityWindow_STEP425('shopWindow');
    polishUtilityWindow_STEP425('warehouseWindow');
    polishUtilityWindow_STEP425('inventoryWindow');
}

const _step425_updateShopUI = updateShopUI;
updateShopUI = function() {
    var result = _step425_updateShopUI();
    polishUtilityWindow_STEP425('shopWindow');
    return result;
};

const _step425_updateWarehouseUI = updateWarehouseUI;
updateWarehouseUI = function() {
    var result = _step425_updateWarehouseUI();
    polishUtilityWindow_STEP425('warehouseWindow');
    return result;
};

const _step425_updateInventoryUI = updateInventoryUI;
updateInventoryUI = function() {
    var result = _step425_updateInventoryUI();
    polishUtilityWindow_STEP425('inventoryWindow');
    return result;
};


// 初回
ensureCasinoSlotData_STEP425();
applyCasinoScrollFix_STEP425();
polishAllUtilityWindows_STEP425();



// ============================================================================
// STEP 4-26：スロット当選演出
// ・小当たり：WIN! + リール発光
// ・中当たり：BIG WIN! + 強いネオン点滅
// ・777：JACKPOT!! + 金色フラッシュ + 払出表示
// ============================================================================

function ensureSlotWinEffectStyle_STEP426() {
    if (document.getElementById('slotWinEffectStyle_STEP426')) return;

    var style = document.createElement('style');
    style.id = 'slotWinEffectStyle_STEP426';

    style.textContent = `
        @keyframes slotReelWinPulse_STEP426 {
            0%   { transform: scale(1); box-shadow: inset 0 0 14px rgba(0,0,0,.28), 0 0 0 rgba(255,220,70,0); }
            35%  { transform: scale(1.055); box-shadow: inset 0 0 10px rgba(0,0,0,.18), 0 0 18px rgba(255,220,70,.95), 0 0 34px rgba(255,175,0,.65); }
            65%  { transform: scale(1.02); box-shadow: inset 0 0 12px rgba(0,0,0,.2), 0 0 10px rgba(255,220,70,.75); }
            100% { transform: scale(1); box-shadow: inset 0 0 14px rgba(0,0,0,.28), 0 0 0 rgba(255,220,70,0); }
        }

        @keyframes slotWinTextPop_STEP426 {
            0%   { opacity: 0; transform: scale(.55) rotate(-3deg); }
            35%  { opacity: 1; transform: scale(1.13) rotate(1deg); }
            55%  { transform: scale(.98); }
            100% { opacity: 1; transform: scale(1); }
        }

        @keyframes slotBigWinBlink_STEP426 {
            0%, 100% { filter: brightness(1); }
            20% { filter: brightness(1.85); }
            35% { filter: brightness(.8); }
            50% { filter: brightness(2.1); }
            68% { filter: brightness(1); }
        }

        @keyframes slotJackpotFlash_STEP426 {
            0%   { background: rgba(255,215,0,0); }
            12%  { background: rgba(255,235,120,.92); }
            22%  { background: rgba(255,190,0,.18); }
            35%  { background: rgba(255,245,180,.88); }
            48%  { background: rgba(255,170,0,.12); }
            62%  { background: rgba(255,238,120,.7); }
            100% { background: rgba(0,0,0,.6); }
        }

        @keyframes slotJackpotText_STEP426 {
            0%   { opacity: 0; transform: scale(.35) rotate(-8deg); letter-spacing: .02em; }
            28%  { opacity: 1; transform: scale(1.22) rotate(2deg); letter-spacing: .10em; }
            48%  { transform: scale(.96) rotate(-1deg); }
            68%  { transform: scale(1.08); }
            100% { transform: scale(1); letter-spacing: .08em; }
        }

        .slot-win-reel-step426 {
            animation: slotReelWinPulse_STEP426 .7s ease-in-out 2;
            border-color: #fff16a !important;
        }

        .slot-big-win-panel-step426 {
            animation: slotBigWinBlink_STEP426 .72s ease-in-out 2;
        }

        #slotWinOverlay_STEP426 {
            position: fixed;
            inset: 0;
            z-index: 120000;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            background: rgba(0,0,0,.38);
        }

        #slotWinOverlay_STEP426 .slot-win-card-step426 {
            min-width: min(520px, calc(100vw - 40px));
            padding: 22px 28px;
            box-sizing: border-box;
            text-align: center;
            border: 3px solid #ffe356;
            border-radius: 15px;
            background:
                radial-gradient(circle at 50% 20%, rgba(255,216,60,.26), transparent 52%),
                linear-gradient(180deg, #2b2105 0%, #100d05 100%);
            box-shadow:
                0 0 18px rgba(255,221,65,.85),
                0 0 48px rgba(255,170,0,.55),
                inset 0 0 22px rgba(255,220,90,.13);
        }

        #slotWinOverlay_STEP426 .slot-win-title-step426 {
            color: #fff4a8;
            font-size: clamp(30px, 7vw, 56px);
            line-height: 1;
            font-weight: 1000;
            text-shadow:
                0 0 5px #fff,
                0 0 13px #ffd900,
                0 0 28px #ff9d00;
            animation: slotWinTextPop_STEP426 .48s ease-out both;
        }

        #slotWinOverlay_STEP426 .slot-win-pay-step426 {
            margin-top: 12px;
            font-size: clamp(20px, 4vw, 31px);
            font-weight: 900;
            color: #ffffff;
            text-shadow: 0 0 9px rgba(255,210,40,.75);
        }

        #slotWinOverlay_STEP426.jackpot-step426 {
            pointer-events: none;
            animation: slotJackpotFlash_STEP426 2.25s ease-out both;
        }

        #slotWinOverlay_STEP426.jackpot-step426 .slot-win-card-step426 {
            border-width: 4px;
            background:
                radial-gradient(circle, rgba(255,225,90,.38), rgba(90,50,0,.26) 46%, rgba(8,8,5,.96) 78%);
            box-shadow:
                0 0 25px #fff8a5,
                0 0 65px #ffd000,
                0 0 105px rgba(255,130,0,.75),
                inset 0 0 35px rgba(255,235,130,.23);
        }

        #slotWinOverlay_STEP426.jackpot-step426 .slot-win-title-step426 {
            color: #fff9be;
            animation: slotJackpotText_STEP426 .95s cubic-bezier(.2,.8,.2,1) both;
        }

        #slotWinOverlay_STEP426 .slot-win-sub-step426 {
            margin-top: 8px;
            color: #e7dba5;
            font-size: 13px;
            font-weight: bold;
        }
    `;

    document.head.appendChild(style);
}

function clearSlotWinEffect_STEP426() {
    var old = document.getElementById('slotWinOverlay_STEP426');
    if (old) old.remove();

    var panel = document.getElementById('casinoSlotPanel_STEP425');
    if (panel) panel.classList.remove('slot-big-win-panel-step426');

    for (var i = 0; i < 3; i++) {
        var reel = document.getElementById('casinoSlotReel_STEP425_' + i);
        if (reel) reel.classList.remove('slot-win-reel-step426');
    }
}

function showSlotWinEffect_STEP426(result, multiplier, credited) {
    ensureSlotWinEffectStyle_STEP426();
    clearSlotWinEffect_STEP426();

    if (!multiplier || multiplier <= 0) return;

    var tier =
        multiplier >= 100 ? 'jackpot' :
        multiplier >= 15 ? 'big' :
        'small';

    for (var i = 0; i < 3; i++) {
        var reel = document.getElementById('casinoSlotReel_STEP425_' + i);
        if (reel) {
            // CSSアニメを確実に再スタート。
            void reel.offsetWidth;
            reel.classList.add('slot-win-reel-step426');
        }
    }

    var panel = document.getElementById('casinoSlotPanel_STEP425');
    if (panel && tier !== 'small') {
        panel.classList.add('slot-big-win-panel-step426');
    }

    var overlay = document.createElement('div');
    overlay.id = 'slotWinOverlay_STEP426';

    if (tier === 'jackpot') {
        overlay.classList.add('jackpot-step426');
    }

    var card = document.createElement('div');
    card.className = 'slot-win-card-step426';

    var title = document.createElement('div');
    title.className = 'slot-win-title-step426';
    title.textContent =
        tier === 'jackpot'
            ? 'JACKPOT!!'
            : tier === 'big'
                ? 'BIG WIN!'
                : 'WIN!';

    card.appendChild(title);

    var pay = document.createElement('div');
    pay.className = 'slot-win-pay-step426';
    pay.textContent =
        '+' + Number(credited || 0).toLocaleString() +
        ' COIN';
    card.appendChild(pay);

    var sub = document.createElement('div');
    sub.className = 'slot-win-sub-step426';
    sub.textContent =
        result.map(function(id) {
            return getCasinoSlotSymbol_STEP425(id).symbol;
        }).join(' ') +
        '　×' + multiplier;
    card.appendChild(sub);

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    var duration =
        tier === 'jackpot'
            ? 2350
            : tier === 'big'
                ? 1450
                : 950;

    setTimeout(function() {
        if (overlay.parentNode) overlay.remove();

        if (panel) {
            panel.classList.remove('slot-big-win-panel-step426');
        }

        for (var i = 0; i < 3; i++) {
            var reel = document.getElementById('casinoSlotReel_STEP425_' + i);
            if (reel) reel.classList.remove('slot-win-reel-step426');
        }
    }, duration);
}


// STEP4-25の払出処理後に演出を追加。
const _step426_finishCasinoSlotSpin =
    finishCasinoSlotSpin_STEP425;

finishCasinoSlotSpin_STEP425 = function(result, bet) {
    ensureCasinoSlotData_STEP425();

    var multiplier =
        getCasinoSlotMultiplier_STEP425(result);

    var beforeCoins =
        Number(game.casino.coins || 0);

    var ret =
        _step426_finishCasinoSlotSpin(
            result,
            bet
        );

    var afterCoins =
        Number(game.casino.coins || 0);

    var credited =
        Math.max(
            0,
            afterCoins - beforeCoins
        );

    if (multiplier > 0) {
        // 元処理でカジノUIが再描画された後に発火。
        requestAnimationFrame(function() {
            showSlotWinEffect_STEP426(
                result,
                multiplier,
                credited
            );
        });
    }

    return ret;
};

ensureSlotWinEffectStyle_STEP426();



// ============================================================================
// STEP 4-27：カジノメイン「すごろく」初期実装
// 固定骨格90マス / 5区画 / 内容ランダム / 分岐 / 精算 / 勝負 / 裏ルート
// ============================================================================

const SUGOROKU_LENGTH_STEP427 = 240;

const SUGOROKU_ZONES_STEP427 = [
    {from:1,   to:48,  name:'入口街', icon:'Ⅰ', danger:1},
    {from:49,  to:96,  name:'歓楽街', icon:'Ⅱ', danger:2},
    {from:97,  to:144, name:'賭博街', icon:'Ⅲ', danger:3},
    {from:145, to:192, name:'裏通り', icon:'Ⅳ', danger:4},
    {from:193, to:240, name:'黄金街', icon:'Ⅴ', danger:5}
];

const SUGOROKU_FIXED_STEP427 = {
    12:'treasure',
    24:'duel',
    36:'event',
    48:'settle',

    49:'branch',
    60:'treasure',
    72:'duel',
    84:'shop',
    96:'settle',

    97:'branch',
    108:'treasure',
    120:'duel',
    132:'event',
    144:'settle',

    145:'branch',
    156:'treasure',
    168:'duel',
    180:'shop',
    192:'settle',

    193:'branch',
    204:'treasure',
    216:'duel',
    228:'event',
    240:'goal'
};

function ensureSugorokuData_STEP427() {
    ensureCasinoData_STEP420();

    if (!game.casino.sugoroku) {
        game.casino.sugoroku = {};
    }

    var s = game.casino.sugoroku;

    if (!Number.isFinite(Number(s.plays))) s.plays = 0;
    if (!Number.isFinite(Number(s.wins))) s.wins = 0;
    if (!Number.isFinite(Number(s.totalProfit))) s.totalProfit = 0;
    if (!Number.isFinite(Number(s.bestPayout))) s.bestPayout = 0;
    if (!s.run) s.run = null;

    if (
        s.run &&
        (
            !Array.isArray(s.run.board) ||
            s.run.board.length !== SUGOROKU_LENGTH_STEP427 + 1
        )
    ) {
        s.run.board = buildSugorokuBoard_STEP427();
        s.run.pos = Math.min(
            Math.max(0, Number(s.run.pos || 0)),
            SUGOROKU_LENGTH_STEP427 - 1
        );
        s.run.lastMessage =
            '盤面拡張アップデートを適用しました。現在位置から続行します。';
        s.run.lastTone = 'info';
    }

    s.plays = Math.max(0, Math.floor(Number(s.plays) || 0));
    s.wins = Math.max(0, Math.floor(Number(s.wins) || 0));
    s.totalProfit = Math.floor(Number(s.totalProfit) || 0);
    s.bestPayout = Math.max(0, Math.floor(Number(s.bestPayout) || 0));
}

function getSugorokuAvailableMultipliers_STEP427() {
    ensureCasinoData_STEP420();

    var list = [1];

    if (game.casino.coinCap >= 500) list.push(5);
    if (game.casino.coinCap >= 2000) list.push(20);
    if (game.casino.coinCap >= 10000000) {
        list.push(100);
        list.push(500);
    }

    return list;
}

function getSugorokuEntryFee_STEP427(multiplier) {
    return 20 * Number(multiplier || 1);
}

function getSugorokuZone_STEP427(pos) {
    pos = Math.max(1, Number(pos || 1));

    for (var i = 0; i < SUGOROKU_ZONES_STEP427.length; i++) {
        var z = SUGOROKU_ZONES_STEP427[i];

        if (pos >= z.from && pos <= z.to) {
            return z;
        }
    }

    return SUGOROKU_ZONES_STEP427[SUGOROKU_ZONES_STEP427.length - 1];
}

function sugorokuRandomType_STEP427(pos) {
    var zone = getSugorokuZone_STEP427(pos);
    var r = Math.random() * 100;

    // 後半ほど損失・勝負が増える。
    var tables = {
        1: [
            ['gain',48], ['event',22], ['treasure',12],
            ['loss',8], ['duel',5], ['warp',5]
        ],
        2: [
            ['gain',38], ['event',20], ['treasure',12],
            ['loss',14], ['duel',9], ['warp',5], ['shop',2]
        ],
        3: [
            ['gain',30], ['event',19], ['treasure',10],
            ['loss',18], ['duel',13], ['warp',6],
            ['shop',3], ['bankrupt',1]
        ],
        4: [
            ['gain',26], ['event',17], ['treasure',9],
            ['loss',22], ['duel',15], ['warp',6],
            ['shop',3], ['bankrupt',2]
        ],
        5: [
            ['gain',24], ['event',15], ['treasure',8],
            ['loss',25], ['duel',16], ['warp',6],
            ['shop',3], ['bankrupt',3]
        ]
    };

    var table = tables[zone.danger];
    var acc = 0;

    for (var i = 0; i < table.length; i++) {
        acc += table[i][1];

        if (r < acc) return table[i][0];
    }

    return 'gain';
}

function buildSugorokuBoard_STEP427() {
    var board = [{type:'start', label:'START'}];

    for (var pos = 1; pos <= SUGOROKU_LENGTH_STEP427; pos++) {
        var type =
            SUGOROKU_FIXED_STEP427[pos] ||
            sugorokuRandomType_STEP427(pos);

        board.push({
            pos: pos,
            type: type,
            label: type
        });
    }

    return board;
}

function getSugorokuTypeInfo_STEP427(type) {
    var map = {
        start:    {icon:'★', name:'スタート'},
        gain:     {icon:'＋', name:'利益'},
        loss:     {icon:'－', name:'損失'},
        event:    {icon:'？', name:'イベント'},
        duel:     {icon:'⚔', name:'勝負'},
        treasure: {icon:'宝', name:'宝箱'},
        shop:     {icon:'店', name:'盤上ショップ'},
        warp:     {icon:'↕', name:'ワープ'},
        bankrupt: {icon:'☠', name:'破産'},
        branch:   {icon:'分', name:'分岐'},
        settle:   {icon:'精', name:'精算所'},
        goal:     {icon:'冠', name:'ゴール'}
    };

    return map[type] || map.event;
}

function startSugoroku_STEP427(multiplier) {
    ensureSugorokuData_STEP427();

    if (game.casino.sugoroku.run) return;

    multiplier = Number(multiplier || 1);

    if (getSugorokuAvailableMultipliers_STEP427().indexOf(multiplier) < 0) {
        return;
    }

    var fee = getSugorokuEntryFee_STEP427(multiplier);

    if (game.casino.coins < fee) {
        addLog('すごろくの参加料が足りない。');
        renderCasinoContents_STEP420();
        return;
    }

    game.casino.coins -= fee;

    game.casino.sugoroku.plays++;

    game.casino.sugoroku.run = {
        multiplier: multiplier,
        entryFee: fee,
        pos: 0,
        board: buildSugorokuBoard_STEP427(),
        pending: 0,
        secured: 0,
        greed: 0,
        rolls: 0,
        routeMode: 'normal',
        routeUntil: 0,
        blackInvitation: false,
        boardItems: {
            reroll: 0,
            goldChip: 0,
            riskyInsurance: 0
        },
        prompt: null,
        lastDice: null,
        lastMessage: 'ゲーム開始。まずはサイコロを振ろう。',
        finished: false
    };

    addLog(
        '【すごろく】×' +
        multiplier +
        'テーブル開始。参加料 ' +
        fee.toLocaleString() +
        'コイン。'
    );

    updateAllBaseWindows();
    renderCasinoContents_STEP420();
}

function getSugorokuGainRange_STEP427(run) {
    var zone = getSugorokuZone_STEP427(run.pos);
    var base = {
        1:[1,2],
        2:[1,4],
        3:[3,8],
        4:[5,15],
        5:[10,30]
    }[zone.danger];

    var routeBonus =
        run.routeMode === 'risk' ? 1.7 :
        run.routeMode === 'under' ? 4.0 :
        1;

    return [
        Math.floor(base[0] * run.multiplier * routeBonus),
        Math.floor(base[1] * run.multiplier * routeBonus)
    ];
}

function sugorokuRandomInt_STEP427(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

function applySugorokuGain_STEP427(run, amount, label) {
    amount = Math.max(0, Math.floor(Number(amount) || 0));

    if (run.boardItems.goldChip > 0) {
        amount *= 3;
        run.boardItems.goldChip--;
        label += '（金色のチップ ×3）';
    }

    run.pending += amount;

    run.lastMessage =
        label +
        '　未確定 +' +
        amount.toLocaleString() +
        'コイン';
}

function applySugorokuLoss_STEP427(run, amount, label) {
    amount = Math.max(0, Math.floor(Number(amount) || 0));

    if (run.boardItems.riskyInsurance > 0) {
        run.boardItems.riskyInsurance--;

        if (Math.random() < 0.5) {
            run.lastMessage =
                '怪しい保険証が損失を消した！';
            return;
        }

        amount *= 2;
        label += '（怪しい保険証が裏目に出た）';
    }

    var actual = Math.min(run.pending, amount);

    run.pending -= actual;

    run.lastMessage =
        label +
        '　未確定 -' +
        actual.toLocaleString() +
        'コイン';
}

function resolveSugorokuEvent_STEP427(run) {
    var zone = getSugorokuZone_STEP427(run.pos);
    var roll = Math.random();

    if (roll < 0.18) {
        var gain =
            sugorokuRandomInt_STEP427(2, 5) *
            zone.danger *
            run.multiplier;

        applySugorokuGain_STEP427(
            run,
            gain,
            '落とし物を拾った。'
        );

    } else if (roll < 0.34) {
        var pct = 0.08 + zone.danger * 0.03;
        var loss = Math.ceil(run.pending * pct);

        applySugorokuLoss_STEP427(
            run,
            loss,
            '酔っ払いに絡まれた。'
        );

    } else if (roll < 0.47) {
        run.pos = Math.max(0, run.pos - sugorokuRandomInt_STEP427(1, 4));
        run.lastMessage = '人混みに押し戻された。数マス後退。';

    } else if (roll < 0.59) {
        run.pos = Math.min(
            SUGOROKU_LENGTH_STEP427 - 1,
            run.pos + sugorokuRandomInt_STEP427(2, 5)
        );
        run.lastMessage = '近道を見つけた。前進！';

    } else if (roll < 0.70) {
        run.boardItems.reroll++;
        run.lastMessage = '「裏面のあるコイン」を拾った。イベントを1回引き直せる。';

    } else if (roll < 0.79) {
        run.boardItems.goldChip++;
        run.lastMessage = '「金色のチップ」を拾った。次のコイン獲得が×3。';

    } else if (roll < 0.87) {
        run.boardItems.riskyInsurance++;
        run.lastMessage = '「怪しい保険証」を拾った。次の損失が0か×2になる。';

    } else if (roll < 0.94) {
        run.blackInvitation = true;
        run.lastMessage = '黒い招待状を拾った……裏賭場への道が開くかもしれない。';

    } else {
        var gamble =
            Math.max(
                run.multiplier * 20,
                Math.floor(run.pending * 0.25)
            );

        run.prompt = {
            type: 'eventGamble',
            amount: gamble
        };

        run.lastMessage =
            '怪しい男が「預ければ倍にする」と言っている。';
    }
}

function resolveSugorokuTreasure_STEP427(run) {
    var r = Math.random();

    if (r < 0.55) {
        var range = getSugorokuGainRange_STEP427(run);
        var amount =
            sugorokuRandomInt_STEP427(
                range[1],
                Math.max(range[1], range[1] * 3)
            );

        applySugorokuGain_STEP427(
            run,
            amount,
            '宝箱からコインが出た！'
        );

    } else if (r < 0.72) {
        run.boardItems.goldChip++;
        run.lastMessage = '宝箱から「金色のチップ」を入手した。';

    } else if (r < 0.86) {
        run.boardItems.reroll++;
        run.lastMessage = '宝箱から「裏面のあるコイン」を入手した。';

    } else if (r < 0.96) {
        run.blackInvitation = true;
        run.lastMessage = '宝箱の底に「黒い招待状」が入っていた。';

    } else {
        run.pending *= 2;
        run.pending = Math.floor(run.pending);
        run.lastMessage = '大当たり宝箱！ 未確定コインが2倍になった！';
    }
}

function resolveSugorokuWarp_STEP427(run) {
    var forward = Math.random() < 0.62;
    var dist = sugorokuRandomInt_STEP427(2, 7);

    if (forward) {
        run.pos = Math.min(
            SUGOROKU_LENGTH_STEP427 - 1,
            run.pos + dist
        );

        run.lastMessage =
            'ワープ！ ' +
            dist +
            'マス先へ飛ばされた。';

    } else {
        run.pos = Math.max(0, run.pos - dist);

        run.lastMessage =
            '逆ワープ…… ' +
            dist +
            'マス戻された。';
    }
}

function resolveSugorokuShop_STEP427(run) {
    run.prompt = {
        type: 'shop'
    };

    run.lastMessage =
        '盤上ショップだ。未確定コインでアイテムを買える。';
}

function resolveSugorokuNode_STEP427(run) {
    if (!run || run.finished) return;

    var node = run.board[run.pos];

    if (!node) return;

    var type = node.type;

    // 危険/裏ルート中は普通マスの中身を一時補正。
    if (
        run.routeUntil >= run.pos &&
        ['gain','loss','event','duel','treasure'].indexOf(type) >= 0
    ) {
        if (run.routeMode === 'risk') {
            if (type === 'gain' && Math.random() < 0.28) type = 'duel';
            if (type === 'event' && Math.random() < 0.25) type = 'loss';
        }

        if (run.routeMode === 'under') {
            if (type === 'gain' && Math.random() < 0.35) type = 'treasure';
            if (type === 'event' && Math.random() < 0.35) type = 'duel';
            if (Math.random() < 0.035) type = 'bankrupt';
        }
    }

    if (type === 'gain') {
        var range = getSugorokuGainRange_STEP427(run);

        applySugorokuGain_STEP427(
            run,
            sugorokuRandomInt_STEP427(range[0], range[1]),
            '利益マス。'
        );

    } else if (type === 'loss') {
        var zone = getSugorokuZone_STEP427(run.pos);
        var minPct = 0.05 + zone.danger * 0.04;
        var maxPct = 0.12 + zone.danger * 0.075;
        var pct = minPct + Math.random() * (maxPct - minPct);

        if (run.routeMode === 'risk') pct *= 1.35;
        if (run.routeMode === 'under') pct *= 2.5;

        applySugorokuLoss_STEP427(
            run,
            Math.ceil(run.pending * pct),
            '損失マス。'
        );

    } else if (type === 'event') {
        resolveSugorokuEvent_STEP427(run);

    } else if (type === 'treasure') {
        resolveSugorokuTreasure_STEP427(run);

    } else if (type === 'warp') {
        resolveSugorokuWarp_STEP427(run);

    } else if (type === 'duel') {
        run.prompt = {
            type: 'duel'
        };

        run.lastMessage =
            '勝負マス！ 未確定コインの何%を賭ける？';

    } else if (type === 'shop') {
        resolveSugorokuShop_STEP427(run);

    } else if (type === 'bankrupt') {
        run.pending = 0;
        run.lastMessage =
            '☠ 破産！ 未確定コインをすべて失った。';

    } else if (type === 'branch') {
        run.prompt = {
            type: 'branch'
        };

        run.lastMessage =
            '分岐だ。次の区画のルートを選ぼう。';

    } else if (type === 'settle') {
        run.prompt = {
            type: 'settle'
        };

        run.lastMessage =
            '精算所に到着。ここで利益を確定できる。';

    } else if (type === 'goal') {
        run.prompt = {
            type: 'goal'
        };

        run.lastMessage =
            '黄金街の出口に到着した。最後の選択だ。';
    }

    if (
        run.routeUntil > 0 &&
        run.pos >= run.routeUntil &&
        !run.prompt
    ) {
        run.routeMode = 'normal';
        run.routeUntil = 0;
    }
}

function rollSugorokuDice_STEP427() {
    ensureSugorokuData_STEP427();

    var run = game.casino.sugoroku.run;

    if (
        !run ||
        run.finished ||
        run.prompt
    ) {
        return;
    }

    var dice =
        sugorokuRandomInt_STEP427(1, 6);

    run.lastDice = dice;
    run.rolls++;

    run.pos =
        Math.min(
            SUGOROKU_LENGTH_STEP427,
            run.pos + dice
        );

    run.lastMessage =
        'サイコロは ' +
        dice +
        '。' +
        run.pos +
        'マス目へ進んだ。';

    resolveSugorokuNode_STEP427(run);

    renderCasinoContents_STEP420();
}

function chooseSugorokuBranch_STEP427(mode) {
    var run = game.casino.sugoroku.run;
    if (!run || !run.prompt || run.prompt.type !== 'branch') return;

    var length = 14;

    if (mode === 'safe') {
        run.routeMode = 'safe';
        run.routeUntil = Math.min(SUGOROKU_LENGTH_STEP427 - 1, run.pos + length);
        run.lastMessage =
            '安全ルートを選択。報酬は控えめだが事故が少ない。';

    } else if (mode === 'risk') {
        run.routeMode = 'risk';
        run.routeUntil = Math.min(SUGOROKU_LENGTH_STEP427 - 1, run.pos + length);
        run.lastMessage =
            '危険ルートを選択。報酬も損失も大きくなる。';

    } else if (mode === 'under' && run.blackInvitation) {
        run.routeMode = 'under';
        run.routeUntil = Math.min(SUGOROKU_LENGTH_STEP427 - 1, run.pos + 14);
        run.blackInvitation = false;
        run.lastMessage =
            '黒い招待状を渡した。裏賭場ルートへ入った……。';
    }

    run.prompt = null;
    renderCasinoContents_STEP420();
}

function getSugorokuGoalGreedMultiplier_STEP427(run) {
    var table = [1, 1.25, 1.5, 2, 3];

    return table[
        Math.min(4, Math.max(0, run.greed))
    ];
}

function finishSugoroku_STEP427(extraPendingMultiplier, label, countWin) {
    ensureSugorokuData_STEP427();

    var s = game.casino.sugoroku;
    var run = s.run;

    if (!run) return;

    var extra =
        Math.floor(
            run.pending *
            Number(extraPendingMultiplier || 1)
        );

    var payout =
        Math.max(
            0,
            Math.floor(run.secured + extra)
        );

    var room =
        Math.max(
            0,
            game.casino.coinCap - game.casino.coins
        );

    var credited =
        Math.min(
            payout,
            room
        );

    game.casino.coins += credited;

    var profit =
        credited - run.entryFee;

    s.totalProfit += profit;
    s.bestPayout =
        Math.max(
            s.bestPayout,
            credited
        );

    if (countWin) s.wins++;

    addLog(
        '【すごろく】' +
        label +
        '　' +
        credited.toLocaleString() +
        'コイン獲得。収支 ' +
        (profit >= 0 ? '+' : '') +
        profit.toLocaleString() +
        '。'
    );

    if (credited < payout) {
        addLog(
            'コイン所持上限のため ' +
            (payout - credited).toLocaleString() +
            'コインは受け取れなかった。'
        );
    }

    s.run = null;

    updateAllBaseWindows();
    renderCasinoContents_STEP420();
}

function settleSugoroku_STEP427(action) {
    var run = game.casino.sugoroku.run;

    if (!run || !run.prompt || run.prompt.type !== 'settle') return;

    if (action === 'bank') {
        run.secured += run.pending;
        run.pending = 0;
        run.greed = 0;
        run.lastMessage =
            '未確定コインをすべて確定した。';

    } else if (action === 'skip') {
        run.greed =
            Math.min(4, run.greed + 1);

        run.lastMessage =
            '精算を見送った。ゴール倍率が上昇！';

    } else if (action === 'quit') {
        run.prompt = null;

        finishSugoroku_STEP427(
            1,
            '途中精算して終了。',
            true
        );

        return;
    }

    run.prompt = null;
    renderCasinoContents_STEP420();
}

function resolveSugorokuDuel_STEP427(pct) {
    var run = game.casino.sugoroku.run;

    if (!run || !run.prompt || run.prompt.type !== 'duel') return;

    pct = Number(pct);

    var stake =
        Math.max(
            run.multiplier,
            Math.floor(
                run.pending * pct
            )
        );

    stake =
        Math.min(
            run.pending,
            stake
        );

    if (stake <= 0) {
        run.prompt = null;
        run.lastMessage =
            '賭けられる未確定コインがない。勝負は流れた。';
        renderCasinoContents_STEP420();
        return;
    }

    var player =
        sugorokuRandomInt_STEP427(1, 6) +
        sugorokuRandomInt_STEP427(1, 6);

    var dealer =
        sugorokuRandomInt_STEP427(1, 6) +
        sugorokuRandomInt_STEP427(1, 6);

    if (player > dealer) {
        run.pending += stake;
        run.lastMessage =
            '勝負勝利！ ' +
            player +
            ' vs ' +
            dealer +
            '　+' +
            stake.toLocaleString();

    } else if (player < dealer) {
        applySugorokuLoss_STEP427(
            run,
            stake,
            '勝負敗北。 ' +
            player +
            ' vs ' +
            dealer
        );

    } else {
        run.lastMessage =
            '引き分け。 ' +
            player +
            ' vs ' +
            dealer;
    }

    run.prompt = null;
    renderCasinoContents_STEP420();
}

function resolveSugorokuEventGamble_STEP427(accept) {
    var run = game.casino.sugoroku.run;

    if (
        !run ||
        !run.prompt ||
        run.prompt.type !== 'eventGamble'
    ) {
        return;
    }

    var amount =
        Math.min(
            run.pending,
            run.prompt.amount
        );

    if (!accept || amount <= 0) {
        run.lastMessage =
            '怪しい男を無視した。';
    } else {
        run.pending -= amount;

        if (Math.random() < 0.55) {
            run.pending += amount * 2;
            run.lastMessage =
                '本当に倍になった！ +' +
                amount.toLocaleString() +
                'コイン';
        } else {
            run.lastMessage =
                '男は消えた…… -' +
                amount.toLocaleString() +
                'コイン';
        }
    }

    run.prompt = null;
    renderCasinoContents_STEP420();
}

function buySugorokuBoardItem_STEP427(id) {
    var run = game.casino.sugoroku.run;

    if (!run || !run.prompt || run.prompt.type !== 'shop') return;

    var offers = {
        goldChip: {
            price: 8 * run.multiplier,
            name: '金色のチップ'
        },
        reroll: {
            price: 6 * run.multiplier,
            name: '裏面のあるコイン'
        },
        riskyInsurance: {
            price: 4 * run.multiplier,
            name: '怪しい保険証'
        }
    };

    var item = offers[id];

    if (!item || run.pending < item.price) {
        run.lastMessage =
            '未確定コインが足りない。';
        renderCasinoContents_STEP420();
        return;
    }

    run.pending -= item.price;
    run.boardItems[id]++;
    run.lastMessage =
        item.name +
        'を購入した。 -' +
        item.price.toLocaleString();

    renderCasinoContents_STEP420();
}

function leaveSugorokuShop_STEP427() {
    var run = game.casino.sugoroku.run;

    if (!run || !run.prompt || run.prompt.type !== 'shop') return;

    run.prompt = null;
    run.lastMessage =
        '盤上ショップを出た。';

    renderCasinoContents_STEP420();
}

function resolveSugorokuGoal_STEP427(mode) {
    var run = game.casino.sugoroku.run;

    if (!run || !run.prompt || run.prompt.type !== 'goal') return;

    var greed =
        getSugorokuGoalGreedMultiplier_STEP427(run);

    run.prompt = null;

    if (mode === 'safe') {
        finishSugoroku_STEP427(
            greed * 1.2,
            '安全出口からゴール。',
            true
        );

    } else if (mode === 'gold') {
        if (Math.random() < 0.58) {
            finishSugoroku_STEP427(
                greed * 2,
                '黄金ゲート突破！',
                true
            );
        } else {
            run.pending =
                Math.floor(
                    run.pending * 0.5
                );

            finishSugoroku_STEP427(
                greed,
                '黄金ゲートで失敗。未確定の半分を失って帰還。',
                true
            );
        }

    } else if (mode === 'under' && run.routeMode === 'under') {
        var p =
            Math.random();

        if (p < 0.52) {
            finishSugoroku_STEP427(
                greed * 3,
                '裏ゴール突破！',
                true
            );
        } else {
            run.pending = 0;

            finishSugoroku_STEP427(
                1,
                '裏ゴールで敗北。確定分だけ持ち帰った。',
                false
            );
        }
    }
}

function createSugorokuPrompt_STEP427(run) {
    if (!run.prompt) return null;

    var p = document.createElement('div');

    Object.assign(p.style, {
        marginTop: '10px',
        padding: '10px',
        border: '1px solid #b98c3b',
        borderRadius: '7px',
        background: 'rgba(56,34,4,.42)'
    });

    var title = document.createElement('div');
    title.style.cssText =
        'font-weight:900;color:#ffd96a;margin-bottom:8px;';

    var row = document.createElement('div');
    row.style.cssText =
        'display:flex;gap:7px;flex-wrap:wrap;';

    function addButton(label, fn, disabled) {
        var b = document.createElement('button');
        b.textContent = label;
        b.disabled = !!disabled;
        b.style.minHeight = '36px';
        b.onclick = function(event) {
            event.stopPropagation();
            fn();
        };
        row.appendChild(b);
    }

    if (run.prompt.type === 'branch') {
        title.textContent = 'ルート選択';

        addButton(
            '安全路　安全★★★★☆ / 報酬★★☆☆☆',
            function() {
                chooseSugorokuBranch_STEP427('safe');
            }
        );

        addButton(
            '危険路　安全★★☆☆☆ / 報酬★★★★☆',
            function() {
                chooseSugorokuBranch_STEP427('risk');
            }
        );

        if (run.blackInvitation) {
            addButton(
                '黒い招待状：裏賭場へ',
                function() {
                    chooseSugorokuBranch_STEP427('under');
                }
            );
        }

    } else if (run.prompt.type === 'settle') {
        title.textContent = '精算所';

        addButton(
            '未確定を確定して続行',
            function() {
                settleSugoroku_STEP427('bank');
            }
        );

        addButton(
            '精算せず続行（倍率UP）',
            function() {
                settleSugoroku_STEP427('skip');
            }
        );

        addButton(
            'ここで終了',
            function() {
                settleSugoroku_STEP427('quit');
            }
        );

    } else if (run.prompt.type === 'duel') {
        title.textContent = 'サイコロ勝負';

        addButton(
            '10% BET',
            function() {
                resolveSugorokuDuel_STEP427(0.10);
            }
        );

        addButton(
            '25% BET',
            function() {
                resolveSugorokuDuel_STEP427(0.25);
            }
        );

        addButton(
            '50% BET',
            function() {
                resolveSugorokuDuel_STEP427(0.50);
            }
        );

    } else if (run.prompt.type === 'eventGamble') {
        title.textContent = '怪しい取引';

        addButton(
            '預ける',
            function() {
                resolveSugorokuEventGamble_STEP427(true);
            }
        );

        addButton(
            '無視する',
            function() {
                resolveSugorokuEventGamble_STEP427(false);
            }
        );

    } else if (run.prompt.type === 'shop') {
        title.textContent = '盤上ショップ';

        var mult = run.multiplier;

        addButton(
            '金色のチップ ' +
            (8 * mult).toLocaleString(),
            function() {
                buySugorokuBoardItem_STEP427('goldChip');
            },
            run.pending < 8 * mult
        );

        addButton(
            '裏面のあるコイン ' +
            (6 * mult).toLocaleString(),
            function() {
                buySugorokuBoardItem_STEP427('reroll');
            },
            run.pending < 6 * mult
        );

        addButton(
            '怪しい保険証 ' +
            (4 * mult).toLocaleString(),
            function() {
                buySugorokuBoardItem_STEP427('riskyInsurance');
            },
            run.pending < 4 * mult
        );

        addButton(
            '店を出る',
            leaveSugorokuShop_STEP427
        );

    } else if (run.prompt.type === 'goal') {
        title.textContent =
            'ゴール選択　現在の欲張り倍率 ×' +
            getSugorokuGoalGreedMultiplier_STEP427(run);

        addButton(
            '安全出口（さらに×1.2）',
            function() {
                resolveSugorokuGoal_STEP427('safe');
            }
        );

        addButton(
            '黄金ゲート（成功×2 / 失敗50%損失）',
            function() {
                resolveSugorokuGoal_STEP427('gold');
            }
        );

        if (run.routeMode === 'under') {
            addButton(
                '裏ゴール（成功×3 / 失敗未確定0）',
                function() {
                    resolveSugorokuGoal_STEP427('under');
                }
            );
        }
    }

    p.appendChild(title);
    p.appendChild(row);

    return p;
}

function createSugorokuBoardView_STEP427(run) {
    var wrap = document.createElement('div');

    Object.assign(wrap.style, {
        marginTop: '10px',
        maxHeight: '330px',
        overflowY: 'auto',
        padding: '8px',
        border: '1px solid #474137',
        borderRadius: '7px',
        background: '#0d0f11'
    });

    var grid = document.createElement('div');

    Object.assign(grid.style, {
        display: 'grid',
        gridTemplateColumns: 'repeat(10, minmax(34px, 1fr))',
        gap: '4px'
    });

    for (var p = 1; p <= SUGOROKU_LENGTH_STEP427; p++) {
        var node = run.board[p];
        var info = getSugorokuTypeInfo_STEP427(node.type);
        var cell = document.createElement('div');

        var current = p === run.pos;
        var passed = p < run.pos;

        Object.assign(cell.style, {
            minHeight: '38px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            border: current
                ? '2px solid #fff08a'
                : '1px solid #45484c',
            borderRadius: '5px',
            background: current
                ? 'rgba(255,211,54,.25)'
                : passed
                    ? 'rgba(79,85,90,.22)'
                    : 'rgba(25,28,31,.9)',
            boxShadow: current
                ? '0 0 12px rgba(255,210,40,.65)'
                : 'none',
            fontWeight: current ? '900' : '700',
            fontSize: '11px'
        });

        var pos = document.createElement('div');
        pos.textContent = p;
        pos.style.cssText =
            'font-size:8px;color:#80868d;line-height:1;';
        cell.appendChild(pos);

        var icon = document.createElement('div');
        icon.textContent =
            current
                ? '●'
                : info.icon;
        icon.title = info.name;

        Object.assign(icon.style, {
            marginTop: '3px',
            fontSize: current ? '16px' : '12px',
            color: current ? '#ffe66a' : '#c8cdd2'
        });

        cell.appendChild(icon);
        grid.appendChild(cell);
    }

    wrap.appendChild(grid);

    return wrap;
}

function createSugorokuPanel_STEP427() {
    ensureSugorokuData_STEP427();

    var data = game.casino.sugoroku;
    var panel = createCasinoPanel_STEP420('【 カ ジ ノ す ご ろ く 】');
    panel.id = 'casinoSugorokuPanel_STEP427';

    var intro = document.createElement('div');
    intro.innerHTML =
        'カジノのメインゲーム。<b>長く遊ぶほど大きく稼げるが、欲張れば未確定コインを失う。</b><br>' +
        '<span style="font-size:10px;color:#9ea3a8">固定された盤面の骨格に、マス内容が毎回ランダム配置されます。</span>';

    intro.style.cssText =
        'font-size:11px;color:#c7c4b9;line-height:1.6;margin-bottom:9px;';
    panel.appendChild(intro);

    if (!data.run) {
        var mults =
            getSugorokuAvailableMultipliers_STEP427();

        var selectTitle = document.createElement('div');
        selectTitle.textContent = 'テーブルを選択';
        selectTitle.style.cssText =
            'font-size:12px;font-weight:bold;margin-bottom:7px;';
        panel.appendChild(selectTitle);

        var buttons = document.createElement('div');
        buttons.style.cssText =
            'display:flex;gap:7px;flex-wrap:wrap;';

        mults.forEach(function(mult) {
            var fee = getSugorokuEntryFee_STEP427(mult);
            var b = document.createElement('button');

            b.innerHTML =
                '<b>×' + mult + '</b><br>' +
                '<span style="font-size:10px">参加 ' +
                fee.toLocaleString() +
                ' COIN</span>';

            b.disabled =
                game.casino.coins < fee;

            Object.assign(b.style, {
                minWidth: '96px',
                minHeight: '48px'
            });

            b.onclick = function(event) {
                event.stopPropagation();
                startSugoroku_STEP427(mult);
            };

            buttons.appendChild(b);
        });

        panel.appendChild(buttons);

        var stats = document.createElement('div');
        stats.textContent =
            'PLAY ' + data.plays.toLocaleString() +
            '　／　完走 ' + data.wins.toLocaleString() +
            '　／　累計収支 ' +
            (data.totalProfit >= 0 ? '+' : '') +
            data.totalProfit.toLocaleString() +
            '　／　最高払出 ' +
            data.bestPayout.toLocaleString();

        stats.style.cssText =
            'margin-top:9px;font-size:10px;color:#8f959b;';
        panel.appendChild(stats);

        return panel;
    }

    var run = data.run;
    var zone =
        getSugorokuZone_STEP427(
            Math.max(1, run.pos)
        );

    var hud = document.createElement('div');

    hud.innerHTML =
        '<div style="font-size:13px;font-weight:900;color:#ffe66a">' +
        zone.icon + ' ' + zone.name +
        '　' + run.pos + ' / ' +
        SUGOROKU_LENGTH_STEP427 +
        'マス</div>' +
        '<div style="margin-top:5px">' +
        '確定 <b style="color:#9ee7b2">' +
        run.secured.toLocaleString() +
        '</b>　／　未確定 <b style="color:#ffd36a;font-size:17px">' +
        run.pending.toLocaleString() +
        '</b> COIN' +
        '</div>' +
        '<div style="font-size:10px;color:#9ea3a8;margin-top:3px">' +
        'テーブル ×' + run.multiplier +
        '　／　欲張り倍率 ×' +
        getSugorokuGoalGreedMultiplier_STEP427(run) +
        '　／　サイコロ ' + run.rolls + '回' +
        (run.routeMode === 'under'
            ? '　／　<span style="color:#d78cff">裏賭場</span>'
            : run.routeMode === 'risk'
                ? '　／　危険ルート'
                : '') +
        '</div>';

    Object.assign(hud.style, {
        padding: '9px',
        border: '1px solid #62582d',
        borderRadius: '7px',
        background: 'rgba(28,24,5,.42)'
    });

    panel.appendChild(hud);

    var message = document.createElement('div');
    message.textContent = run.lastMessage || '';
    message.style.cssText =
        'margin-top:8px;padding:8px;background:#101316;border-radius:5px;' +
        'font-size:11px;line-height:1.5;min-height:18px;';
    panel.appendChild(message);

    var itemLine = document.createElement('div');

    itemLine.innerHTML =
        '盤上品：裏面コイン ' +
        run.boardItems.reroll +
        '　／　金色チップ ' +
        run.boardItems.goldChip +
        '　／　怪しい保険 ' +
        run.boardItems.riskyInsurance +
        (run.blackInvitation
            ? '　／　<b style="color:#d78cff">黒い招待状</b>'
            : '');

    itemLine.style.cssText =
        'margin-top:6px;font-size:10px;color:#9ea3a8;';
    panel.appendChild(itemLine);

    panel.appendChild(
        createSugorokuBoardView_STEP427(run)
    );

    var prompt =
        createSugorokuPrompt_STEP427(run);

    if (prompt) {
        panel.appendChild(prompt);
    } else {
        var action = document.createElement('div');

        action.style.cssText =
            'display:flex;gap:8px;align-items:center;margin-top:10px;flex-wrap:wrap;';

        var dice = document.createElement('div');
        dice.textContent =
            run.lastDice
                ? '🎲 ' + run.lastDice
                : '🎲 -';

        Object.assign(dice.style, {
            minWidth: '64px',
            fontSize: '20px',
            fontWeight: '900',
            textAlign: 'center'
        });

        action.appendChild(dice);

        var roll = document.createElement('button');
        roll.textContent = '🎲 サイコロを振る';
        Object.assign(roll.style, {
            flex: '1',
            minWidth: '180px',
            minHeight: '46px',
            fontSize: '15px',
            fontWeight: '900'
        });

        roll.onclick = function(event) {
            event.stopPropagation();
            rollSugorokuDice_STEP427();
        };

        action.appendChild(roll);

        panel.appendChild(action);
    }

    var hint = document.createElement('div');
    hint.textContent =
        '※カジノ画面を閉じても、このすごろくの途中状態は保持されます。';

    hint.style.cssText =
        'margin-top:7px;font-size:9px;color:#747b82;text-align:center;';
    panel.appendChild(hint);

    return panel;
}


// カジノ画面へすごろくを追加。
// スロットの直後、景品交換所より前に置く。
const _step427_renderCasinoContents =
    renderCasinoContents_STEP420;

renderCasinoContents_STEP420 = function() {
    ensureSugorokuData_STEP427();

    _step427_renderCasinoContents();

    var overlay =
        ensureCasinoUI_STEP418();

    if (!overlay) return;

    var box =
        overlay.firstElementChild;

    if (!box) return;

    var old =
        document.getElementById(
            'casinoSugorokuPanel_STEP427'
        );

    if (old) old.remove();

    var slot =
        document.getElementById(
            'casinoSlotPanel_STEP425'
        );

    var sugoroku =
        createSugorokuPanel_STEP427();

    if (slot && slot.parentNode === box) {
        box.insertBefore(
            sugoroku,
            slot.nextSibling
        );
    } else {
        var close =
            Array.from(
                box.querySelectorAll('button')
            ).find(function(b) {
                return b.textContent === '閉じる';
            });

        if (close) {
            box.insertBefore(
                sugoroku,
                close
            );
        } else {
            box.appendChild(sugoroku);
        }
    }

    applyCasinoScrollFix_STEP425();
};


// 初回
ensureSugorokuData_STEP427();



// ============================================================================
// STEP 4-28：すごろくプレイテスト調整
// ・90→240マスへ拡張（実ゲーム時間を増加）
// ・直近ログを大きく、＋ / － / EVENT / ITEM / DANGER で色分け
// ・盤上アイテム欄を独立した見やすいバーへ
// ・勝負マスに「賭けない」を追加
// ============================================================================

function setSugorokuTone_STEP428(run, tone) {
    if (!run) return;
    run.lastTone = tone || 'info';
}

function inferSugorokuTone_STEP428(run) {
    if (!run) return 'info';

    if (run.lastTone) {
        var t = run.lastTone;
        run.lastTone = null;
        return t;
    }

    var msg = String(run.lastMessage || '');

    if (
        msg.indexOf('破産') >= 0 ||
        msg.indexOf('敗北') >= 0 ||
        msg.indexOf('失った') >= 0 ||
        msg.indexOf('戻された') >= 0 ||
        msg.indexOf('後退') >= 0 ||
        msg.indexOf(' -') >= 0 ||
        msg.indexOf('－') >= 0
    ) {
        return 'minus';
    }

    if (
        msg.indexOf('拾った') >= 0 ||
        msg.indexOf('入手') >= 0 ||
        msg.indexOf('招待状') >= 0 ||
        msg.indexOf('チップ') >= 0 ||
        msg.indexOf('保険証') >= 0
    ) {
        return 'item';
    }

    if (
        msg.indexOf('+') >= 0 ||
        msg.indexOf('＋') >= 0 ||
        msg.indexOf('勝利') >= 0 ||
        msg.indexOf('倍になった') >= 0 ||
        msg.indexOf('大当たり') >= 0
    ) {
        return 'plus';
    }

    if (
        msg.indexOf('怪しい') >= 0 ||
        msg.indexOf('勝負') >= 0 ||
        msg.indexOf('裏賭場') >= 0
    ) {
        return 'danger';
    }

    return 'event';
}


// 利益・損失は明確に＋ / －扱い
const _step428_applySugorokuGain =
    applySugorokuGain_STEP427;

applySugorokuGain_STEP427 = function(run, amount, label) {
    var result =
        _step428_applySugorokuGain(
            run,
            amount,
            label
        );

    setSugorokuTone_STEP428(run, 'plus');
    return result;
};


const _step428_applySugorokuLoss =
    applySugorokuLoss_STEP427;

applySugorokuLoss_STEP427 = function(run, amount, label) {
    var before = run ? run.pending : 0;

    var result =
        _step428_applySugorokuLoss(
            run,
            amount,
            label
        );

    if (run) {
        setSugorokuTone_STEP428(
            run,
            run.pending < before
                ? 'minus'
                : 'item'
        );
    }

    return result;
};


// 勝負を辞退する
function skipSugorokuDuel_STEP428() {
    var run =
        game.casino &&
        game.casino.sugoroku
            ? game.casino.sugoroku.run
            : null;

    if (
        !run ||
        !run.prompt ||
        run.prompt.type !== 'duel'
    ) {
        return;
    }

    run.prompt = null;
    run.lastMessage =
        '勝負を見送った。コインの変動はなし。';
    setSugorokuTone_STEP428(run, 'event');

    renderCasinoContents_STEP420();
}


// STEP4-27のプロンプトに「賭けない」を追加
const _step428_createSugorokuPrompt =
    createSugorokuPrompt_STEP427;

createSugorokuPrompt_STEP427 = function(run) {
    var panel =
        _step428_createSugorokuPrompt(run);

    if (
        !panel ||
        !run ||
        !run.prompt ||
        run.prompt.type !== 'duel'
    ) {
        return panel;
    }

    var rows =
        Array.from(panel.querySelectorAll('div'));

    var row =
        rows.find(function(div) {
            return (
                div.style &&
                div.style.display === 'flex' &&
                div.querySelector('button')
            );
        });

    if (!row) return panel;

    var skip =
        document.createElement('button');

    skip.textContent =
        '賭けない';

    Object.assign(skip.style, {
        minHeight: '36px',
        borderColor: '#59636d',
        color: '#c7cdd2'
    });

    skip.onclick = function(event) {
        event.stopPropagation();
        skipSugorokuDuel_STEP428();
    };

    row.appendChild(skip);

    return panel;
};


function getSugorokuLogStyle_STEP428(tone) {
    var styles = {
        plus: {
            badge: '＋',
            label: 'PLUS',
            color: '#9ff0b0',
            border: '#3f8f55',
            bg: 'rgba(35,95,53,.28)'
        },
        minus: {
            badge: '－',
            label: 'MINUS',
            color: '#ff9d9d',
            border: '#a54d4d',
            bg: 'rgba(110,38,38,.30)'
        },
        item: {
            badge: '◆',
            label: 'ITEM',
            color: '#9ddcff',
            border: '#447f9f',
            bg: 'rgba(34,72,96,.30)'
        },
        danger: {
            badge: '!',
            label: 'DANGER',
            color: '#e0a2ff',
            border: '#7e4ca0',
            bg: 'rgba(75,35,95,.31)'
        },
        event: {
            badge: '?',
            label: 'EVENT',
            color: '#ffe18b',
            border: '#977e38',
            bg: 'rgba(91,73,24,.28)'
        },
        info: {
            badge: 'i',
            label: 'INFO',
            color: '#c3ccd4',
            border: '#56616a',
            bg: 'rgba(55,63,70,.30)'
        }
    };

    return styles[tone] || styles.info;
}


function createSugorokuReadableLog_STEP428(run) {
    var tone =
        inferSugorokuTone_STEP428(run);

    // 描画後も同じ色を維持できるよう保持
    run.displayTone = tone;

    var style =
        getSugorokuLogStyle_STEP428(tone);

    var box =
        document.createElement('div');

    box.id =
        'sugorokuReadableLog_STEP428';

    Object.assign(box.style, {
        marginTop: '10px',
        padding: '11px 12px',
        border: '2px solid ' + style.border,
        borderRadius: '8px',
        background: style.bg,
        boxSizing: 'border-box'
    });

    var top =
        document.createElement('div');

    top.innerHTML =
        '<span style="' +
        'display:inline-flex;align-items:center;justify-content:center;' +
        'min-width:26px;height:26px;border-radius:6px;' +
        'font-size:20px;font-weight:1000;margin-right:7px;' +
        'background:' + style.border + ';color:#fff">' +
        style.badge +
        '</span>' +
        '<b style="font-size:12px;letter-spacing:.08em;color:' +
        style.color + '">' +
        style.label +
        '</b>';

    box.appendChild(top);

    var message =
        document.createElement('div');

    message.textContent =
        run.lastMessage || '';

    Object.assign(message.style, {
        marginTop: '8px',
        fontSize: '14px',
        fontWeight: '750',
        lineHeight: '1.55',
        color: '#eef1f3'
    });

    box.appendChild(message);

    return box;
}


function createSugorokuReadableItems_STEP428(run) {
    var box =
        document.createElement('div');

    box.id =
        'sugorokuReadableItems_STEP428';

    Object.assign(box.style, {
        marginTop: '8px',
        padding: '9px 10px',
        border: '1px solid #505861',
        borderRadius: '8px',
        background: 'rgba(18,22,26,.92)'
    });

    var title =
        document.createElement('div');

    title.textContent =
        '盤上アイテム';

    title.style.cssText =
        'font-size:11px;font-weight:900;color:#aeb7c0;' +
        'margin-bottom:7px;letter-spacing:.05em;';

    box.appendChild(title);

    var row =
        document.createElement('div');

    Object.assign(row.style, {
        display: 'flex',
        gap: '7px',
        flexWrap: 'wrap'
    });

    function chip(label, count, accent) {
        var c =
            document.createElement('div');

        c.innerHTML =
            '<span style="font-size:11px;color:#b8bec4">' +
            label +
            '</span> ' +
            '<b style="font-size:16px;color:' +
            accent +
            '">' +
            count +
            '</b>';

        Object.assign(c.style, {
            padding: '6px 9px',
            border: '1px solid #454e56',
            borderRadius: '7px',
            background: '#11161a',
            minWidth: '88px',
            boxSizing: 'border-box'
        });

        row.appendChild(c);
    }

    chip(
        '裏面コイン',
        run.boardItems.reroll,
        '#9ddcff'
    );

    chip(
        '金色チップ',
        run.boardItems.goldChip,
        '#ffe275'
    );

    chip(
        '怪しい保険',
        run.boardItems.riskyInsurance,
        '#d9a5ff'
    );

    var invitation =
        document.createElement('div');

    invitation.innerHTML =
        '<span style="font-size:11px;color:#b8bec4">黒い招待状</span> ' +
        '<b style="font-size:15px;color:' +
        (run.blackInvitation ? '#e2a6ff' : '#666') +
        '">' +
        (run.blackInvitation ? '所持' : 'なし') +
        '</b>';

    Object.assign(invitation.style, {
        padding: '6px 9px',
        border: run.blackInvitation
            ? '1px solid #8758a6'
            : '1px solid #454e56',
        borderRadius: '7px',
        background: run.blackInvitation
            ? 'rgba(74,35,89,.34)'
            : '#11161a',
        minWidth: '110px',
        boxSizing: 'border-box'
    });

    row.appendChild(invitation);
    box.appendChild(row);

    return box;
}


// すごろく画面生成後、旧ログ/持ち物1行を新UIに差し替える
const _step428_createSugorokuPanel =
    createSugorokuPanel_STEP427;

createSugorokuPanel_STEP427 = function() {
    var panel =
        _step428_createSugorokuPanel();

    var data =
        game.casino &&
        game.casino.sugoroku;

    var run =
        data ? data.run : null;

    if (!panel || !run) {
        return panel;
    }

    // STEP4-27の旧ログを探して削除
    Array.from(panel.children).forEach(function(child) {
        var txt =
            String(child.textContent || '');

        if (
            child.id !== 'sugorokuReadableLog_STEP428' &&
            (
                txt === String(run.lastMessage || '') ||
                txt.indexOf('盤上品：裏面コイン') === 0
            )
        ) {
            child.remove();
        }
    });

    // HUDの直後へログ→持ち物の順に配置
    var hud =
        panel.children[1] || null;

    var log =
        createSugorokuReadableLog_STEP428(run);

    var items =
        createSugorokuReadableItems_STEP428(run);

    if (hud && hud.nextSibling) {
        panel.insertBefore(
            items,
            hud.nextSibling
        );

        panel.insertBefore(
            log,
            items
        );
    } else {
        panel.appendChild(log);
        panel.appendChild(items);
    }

    // 盤面を少し高くして240マスでも確認しやすく
    var boardCandidates =
        Array.from(panel.querySelectorAll('div'));

    var boardWrap =
        boardCandidates.find(function(div) {
            return (
                div.style &&
                div.style.maxHeight === '330px' &&
                div.style.overflowY === 'auto'
            );
        });

    if (boardWrap) {
        boardWrap.style.maxHeight = '400px';
    }

    return panel;
};


// イベント発生時、直接メッセージを書き換える結果も視覚分類
const _step428_resolveSugorokuEvent =
    resolveSugorokuEvent_STEP427;

resolveSugorokuEvent_STEP427 = function(run) {
    var beforePending =
        Number(run.pending || 0);

    var beforePos =
        Number(run.pos || 0);

    var beforeItems = {
        reroll: run.boardItems.reroll,
        goldChip: run.boardItems.goldChip,
        riskyInsurance: run.boardItems.riskyInsurance,
        invite: run.blackInvitation
    };

    var result =
        _step428_resolveSugorokuEvent(run);

    if (run.pending > beforePending) {
        setSugorokuTone_STEP428(run, 'plus');

    } else if (run.pending < beforePending || run.pos < beforePos) {
        setSugorokuTone_STEP428(run, 'minus');

    } else if (
        run.boardItems.reroll > beforeItems.reroll ||
        run.boardItems.goldChip > beforeItems.goldChip ||
        run.boardItems.riskyInsurance > beforeItems.riskyInsurance ||
        (!beforeItems.invite && run.blackInvitation)
    ) {
        setSugorokuTone_STEP428(run, 'item');

    } else if (run.prompt) {
        setSugorokuTone_STEP428(run, 'danger');

    } else {
        setSugorokuTone_STEP428(run, 'event');
    }

    return result;
};



// ============================================================================
// STEP 4-29：景品所持ルール整理 + すごろく帰還券
// ----------------------------------------------------------------------------
// ・通常消耗品は所持数ほぼ無制限
// ・「上限」は所持制限ではなく景品側の購入制限として別管理する方針
// ・恒久品（コインケース等）は従来どおり一度きり
// ・すごろく用「帰還券」を景品交換所へ追加
// ============================================================================

const CASINO_PRIZES_EXTRA_STEP429 = [
    {
        id:'sugorokuReturnTicket',
        name:'帰還券',
        price:250,
        kind:'consumable',
        description:'すごろく中いつでも使用可能。確定コイン100%＋未確定コイン50%を持ち帰って即終了する。'
    }
];

function ensureCasinoPrizeData_STEP429() {
    ensureCasinoPrizeData_STEP424();

    if (!game.casino.items) {
        game.casino.items = {};
    }

    [
        'sugorokuReturnTicket'
    ].forEach(function(id) {
        game.casino.items[id] =
            Math.max(
                0,
                Math.floor(
                    Number(
                        game.casino.items[id] || 0
                    )
                )
            );
    });
}

const _step429_getCasinoPrize =
    getCasinoPrize_STEP424;

getCasinoPrize_STEP424 = function(id) {
    var base =
        _step429_getCasinoPrize(id);

    if (base) return base;

    return (
        CASINO_PRIZES_EXTRA_STEP429.find(
            function(p) {
                return p.id === id;
            }
        ) || null
    );
};


// ---------------------------------------------------------------------------
// 景品交換所：追加景品 + 所持数表示
// ---------------------------------------------------------------------------
function createCasinoPrizeRow_STEP429(
    parent,
    prize
) {
    ensureCasinoPrizeData_STEP429();

    var row =
        document.createElement('div');

    Object.assign(
        row.style,
        {
            padding: '10px',
            marginBottom: '7px',
            border: '1px solid #655720',
            borderRadius: '6px',
            background: 'rgba(20,18,5,.35)'
        }
    );

    var top =
        document.createElement('div');

    Object.assign(
        top.style,
        {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px'
        }
    );

    var left =
        document.createElement('div');

    var owned =
        prize.kind === 'consumable'
            ? Number(
                game.casino.items[prize.id] || 0
            )
            : null;

    left.innerHTML =
        '<b>' +
        prize.name +
        '</b>' +
        (
            owned !== null
                ? '<span style="margin-left:8px;color:#ffe66a;font-size:11px">所持 ' +
                  owned.toLocaleString() +
                  '</span>'
                : ''
        ) +
        '<div style="font-size:11px;color:#aaa;margin-top:4px;line-height:1.5">' +
        prize.description +
        '</div>' +
        (
            prize.kind === 'consumable'
                ? '<div style="font-size:10px;color:#747b82;margin-top:3px">所持上限：実質なし</div>'
                : ''
        );

    var right =
        document.createElement('div');

    right.style.textAlign = 'right';

    var price =
        document.createElement('div');

    price.textContent =
        prize.price.toLocaleString() +
        ' COIN';

    Object.assign(
        price.style,
        {
            color: '#ffe66a',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
        }
    );

    var button =
        document.createElement('button');

    button.textContent = '交換';

    button.disabled =
        game.casino.coins <
        prize.price;

    button.style.marginTop = '6px';

    button.onclick = function(event) {
        event.stopPropagation();

        buyCasinoPrize_STEP424(
            prize.id
        );
    };

    right.appendChild(price);
    right.appendChild(button);

    top.appendChild(left);
    top.appendChild(right);
    row.appendChild(top);
    parent.appendChild(row);
}

function appendExtraCasinoPrizes_STEP429() {
    ensureCasinoPrizeData_STEP429();

    var overlay =
        ensureCasinoUI_STEP418();

    if (!overlay) return;

    var box =
        overlay.firstElementChild;

    if (!box) return;

    var panels =
        Array.from(
            box.children
        ).filter(function(el) {
            return (
                el.firstElementChild &&
                /^【/.test(
                    el.firstElementChild.textContent || ''
                )
            );
        });

    var prizes =
        panels.find(function(el) {
            return (
                el.firstElementChild.textContent || ''
            ).indexOf('景品交換所') >= 0;
        });

    if (!prizes) return;

    var old =
        document.getElementById(
            'casinoExtraPrizeGroup_STEP429'
        );

    if (old) old.remove();

    var group =
        document.createElement('div');

    group.id =
        'casinoExtraPrizeGroup_STEP429';

    var title =
        document.createElement('div');

    title.textContent =
        '【 すごろく用景品 】';

    title.style.cssText =
        'margin:11px 0 7px;color:#d9c6ff;font-weight:900;font-size:12px;';

    group.appendChild(title);

    CASINO_PRIZES_EXTRA_STEP429.forEach(
        function(prize) {
            createCasinoPrizeRow_STEP429(
                group,
                prize
            );
        }
    );

    prizes.appendChild(group);
}


// ---------------------------------------------------------------------------
// すごろく：帰還券
// ---------------------------------------------------------------------------
function useSugorokuReturnTicket_STEP429() {
    ensureCasinoPrizeData_STEP429();
    ensureSugorokuData_STEP427();

    var run =
        game.casino.sugoroku.run;

    if (!run) return;

    if (
        Number(
            game.casino.items.sugorokuReturnTicket || 0
        ) <= 0
    ) {
        run.lastMessage =
            '帰還券を持っていない。';

        setSugorokuTone_STEP428(
            run,
            'event'
        );

        renderCasinoContents_STEP420();
        return;
    }

    if (!run.returnTicketConfirm) {
        run.returnTicketConfirm = true;

        run.lastMessage =
            '帰還券を使いますか？ 確定分100%＋未確定分50%を持ち帰って終了します。';

        setSugorokuTone_STEP428(
            run,
            'danger'
        );

        renderCasinoContents_STEP420();
        return;
    }

    game.casino.items.sugorokuReturnTicket--;

    run.returnTicketConfirm = false;
    run.prompt = null;

    finishSugoroku_STEP427(
        0.5,
        '帰還券で途中脱出。',
        false
    );
}

function cancelSugorokuReturnTicket_STEP429() {
    var run =
        game.casino &&
        game.casino.sugoroku
            ? game.casino.sugoroku.run
            : null;

    if (!run) return;

    run.returnTicketConfirm = false;

    run.lastMessage =
        '帰還券の使用を取りやめた。';

    setSugorokuTone_STEP428(
        run,
        'event'
    );

    renderCasinoContents_STEP420();
}


function createSugorokuReturnTicketBar_STEP429(run) {
    ensureCasinoPrizeData_STEP429();

    var box =
        document.createElement('div');

    box.id =
        'sugorokuReturnTicketBar_STEP429';

    Object.assign(
        box.style,
        {
            marginTop: '9px',
            padding: '9px 10px',
            border: '1px solid #5d486f',
            borderRadius: '8px',
            background: 'rgba(55,31,70,.27)'
        }
    );

    var top =
        document.createElement('div');

    Object.assign(
        top.style,
        {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '9px',
            flexWrap: 'wrap'
        }
    );

    var owned =
        Number(
            game.casino.items.sugorokuReturnTicket || 0
        );

    var info =
        document.createElement('div');

    info.innerHTML =
        '<b style="color:#e1c7ff">帰還券</b> ' +
        '<span style="color:#aaa">所持</span> ' +
        '<b style="font-size:16px">' +
        owned.toLocaleString() +
        '</b>' +
        '<div style="font-size:10px;color:#9b91a3;margin-top:2px">いつでも脱出：確定100%＋未確定50%</div>';

    top.appendChild(info);

    var buttons =
        document.createElement('div');

    buttons.style.cssText =
        'display:flex;gap:6px;flex-wrap:wrap;';

    var use =
        document.createElement('button');

    use.textContent =
        run.returnTicketConfirm
            ? '本当に使用する'
            : '帰還券で脱出';

    use.disabled =
        owned <= 0;

    if (run.returnTicketConfirm) {
        use.style.borderColor = '#d783ff';
        use.style.color = '#f0d4ff';
    }

    use.onclick = function(event) {
        event.stopPropagation();

        useSugorokuReturnTicket_STEP429();
    };

    buttons.appendChild(use);

    if (run.returnTicketConfirm) {
        var cancel =
            document.createElement('button');

        cancel.textContent =
            'キャンセル';

        cancel.onclick = function(event) {
            event.stopPropagation();

            cancelSugorokuReturnTicket_STEP429();
        };

        buttons.appendChild(cancel);
    }

    top.appendChild(buttons);
    box.appendChild(top);

    return box;
}


// すごろく画面に帰還券バーを常時表示
const _step429_createSugorokuPanel =
    createSugorokuPanel_STEP427;

createSugorokuPanel_STEP427 = function() {
    var panel =
        _step429_createSugorokuPanel();

    var run =
        game.casino &&
        game.casino.sugoroku
            ? game.casino.sugoroku.run
            : null;

    if (!panel || !run) {
        return panel;
    }

    var old =
        document.getElementById(
            'sugorokuReturnTicketBar_STEP429'
        );

    if (old) old.remove();

    var bar =
        createSugorokuReturnTicketBar_STEP429(
            run
        );

    // 見やすいログ/持ち物バーの下に配置
    var items =
        panel.querySelector(
            '#sugorokuReadableItems_STEP428'
        );

    if (items) {
        items.insertAdjacentElement(
            'afterend',
            bar
        );
    } else {
        panel.appendChild(bar);
    }

    return panel;
};


// カジノ描画の最後に追加景品を差し込む
const _step429_renderCasinoContents =
    renderCasinoContents_STEP420;

renderCasinoContents_STEP420 = function() {
    ensureCasinoPrizeData_STEP429();

    var result =
        _step429_renderCasinoContents();

    appendExtraCasinoPrizes_STEP429();

    return result;
};


// 初回
ensureCasinoPrizeData_STEP429();



// ============================================================================
// STEP 4-30：拠点「設定」 + アイテム名ホバー詳細表示
// ============================================================================

function ensureGameSettings_STEP430() {
    if (!game.settings) {
        game.settings = {};
    }

    if (
        typeof game.settings.itemHoverDetails !== 'boolean'
    ) {
        // デフォルトON
        game.settings.itemHoverDetails = true;
    }
}


// ---------------------------------------------------------------------------
// アイテム詳細データ
// ---------------------------------------------------------------------------
const ITEM_DETAILS_STEP430 = {
    '探知機':
        '周囲の鉱石や探索対象を探知するための基本アイテム。',
    '帰還の羽':
        '探索中に使用すると拠点へ帰還する。探索バッグ内の未保管鉱石は失わず持ち帰れる。',
    '回復薬':
        'HPを回復する。状態異常は治療しない。',
    '体力強化':
        '最大HPを強化するためのアイテム。',

    '簡易濾過マスク':
        '第2層「旧坑道」の有毒ガスダメージを20%軽減する探索装備。',
    '坑道用防毒装具':
        '第2層「旧坑道」の有毒ガスダメージを50%軽減する探索装備。',
    '循環式防護装備':
        '第2層「旧坑道」の有毒ガスダメージを70%軽減する探索装備。',
    '完全閉鎖型浄化装甲':
        '第2層「旧坑道」の有毒ガスダメージを100%無効化する探索装備。罠や強酸は防げない。',

    '位相探知レーダー':
        '第3層「無風回廊」で偽鉱石・偽宝箱を判別する。第4層では正常に機能しない。',
    '導風灯':
        '微風のかけらを1個消費し、一定歩数のあいだボス方向の目安を示す。',
    '境界留め':
        '第3層の「回廊外追放」を防ぐための消耗品。',

    '残光計':
        '第4層「残光遺跡」で残り行動数を正確に表示する恒久装備。',
    '蓄光片':
        '第4層の残り行動数を30回復する消耗品。',
    '残光杭':
        '第4層で残り行動数が0になった際、自動消費して40まで復帰する。',
    '残光解析器':
        '第4層の鉱石に使用すると、その鉱石の現在耐久値を一度だけ確認できる。',
    '残光識別器':
        '第4層の偽鉱石・偽宝箱を判別できる恒久装備。',

    '黄金のコンパス':
        '使用した階で、現在地から階段・進行地点までのルートを黄色く発光表示する消耗品。',
    '簡易型爆薬':
        '選択した鉱物の耐久を1,000減少させる。所持数は実質無制限。',
    '高性能爆薬':
        '選択した鉱物の耐久を10,000減少させる。所持数は実質無制限。',
    '特大設置型爆薬':
        '通常鉱物を即時破壊する強力な爆薬。ボス鉱物には使用できない。所持数は実質無制限。',

    '小さながま口':
        'カジノコインの所持上限を100枚から500枚へ引き上げる恒久景品。',
    '見覚えのある箱':
        'カジノコインの所持上限を2,000枚へ引き上げる恒久景品。',
    '警備員つき簡易保管庫':
        'カジノコインの所持上限を10,000,000枚へ引き上げる恒久景品。',

    '帰還券':
        'カジノすごろく中いつでも使用可能。確定コイン100%＋未確定コイン50%を持ち帰って即終了する。',
    'イカサマサイコロ':
        'カジノすごろくで、次のサイコロの出目を1～6から指定できる消耗品。',
    '保険証':
        'カジノすごろくで、次に受けるコイン損失を50%軽減する消耗品。',
    '強制停止券':
        'カジノすごろくで、移動途中の好きなマスに強制停止できる消耗品。',
    '倍賭け札':
        'カジノすごろくで、次に発生する報酬と損失を両方2倍にする消耗品。',
    '黄金の鍵':
        'カジノすごろくで、次に止まった宝箱の報酬ランクを1段階上げる消耗品。',
    '幸運のお守り':
        'カジノすごろくの一部の最悪クラスイベント発生率をわずかに下げる恒久景品。',
    '高級サイコロケース':
        'カジノすごろくへの専用アイテム持ち込み枠を2枠から3枠へ拡張する恒久景品。',
    '勝負師の鞄':
        'カジノすごろくへの専用アイテム持ち込み枠を3枠から5枠へ拡張する恒久景品。',

    '裏面のあるコイン':
        'すごろく盤上限定品。イベント結果を一度だけ引き直すための特殊アイテム。',
    '金色のチップ':
        'すごろく盤上限定品。次に獲得するコインを3倍にする。',
    '怪しい保険証':
        'すごろく盤上限定品。次の損失を0にするか、逆に2倍にしてしまう。',
    '黒い招待状':
        'すごろく盤上限定品。分岐から高配当・高危険度の裏賭場ルートへ入れる。',

    'シニガミのカマ':
        '第5層への接続に必要となる重要なカジノ景品。売却不可。',
    '夜の帳':
        '第4層16Fで得られる重要物。第5層接続アイテム「夜断ちの楔」の材料。',
    '零風接続核':
        '第3層「無風回廊」への接続を開く重要アイテム。',
    '残光接続核':
        '第4層「残光遺跡」への接続を開く重要アイテム。',
    '夜断ちの楔':
        '第5層「虚夜空間」への接続を開く最終接続アイテム。'
};


// 鉱石も名称にカーソルを置いた時に簡易情報を表示。
function getItemDetailText_STEP430(name) {
    if (ITEM_DETAILS_STEP430[name]) {
        return ITEM_DETAILS_STEP430[name];
    }

    if (
        typeof ORE_TYPES !== 'undefined'
    ) {
        var ore =
            ORE_TYPES.find(function(type) {
                return type.name === name;
            });

        if (ore) {
            var parts = [];

            if (
                ore.maxHp !== undefined &&
                ore.maxHp !== null
            ) {
                parts.push(
                    '基準耐久：' +
                    Number(ore.maxHp).toLocaleString()
                );
            }

            if (
                ore.sellPrice !== undefined &&
                ore.sellPrice !== null
            ) {
                parts.push(
                    '売値：' +
                    Number(ore.sellPrice).toLocaleString() +
                    'G'
                );
            }

            return (
                parts.length
                    ? parts.join(' / ')
                    : '採掘で入手できる鉱石。'
            );
        }
    }

    return '';
}


// ---------------------------------------------------------------------------
// カスタムツールチップ
// ---------------------------------------------------------------------------
function ensureItemTooltip_STEP430() {
    var tooltip =
        document.getElementById(
            'itemTooltip_STEP430'
        );

    if (tooltip) return tooltip;

    tooltip =
        document.createElement('div');

    tooltip.id =
        'itemTooltip_STEP430';

    Object.assign(
        tooltip.style,
        {
            position: 'fixed',
            zIndex: '200000',
            display: 'none',
            maxWidth: '340px',
            padding: '9px 11px',
            boxSizing: 'border-box',
            border: '1px solid #7c858d',
            borderRadius: '7px',
            background: 'rgba(10,13,16,.97)',
            boxShadow: '0 7px 24px rgba(0,0,0,.58)',
            color: '#e7ebee',
            fontSize: '12px',
            lineHeight: '1.55',
            pointerEvents: 'none'
        }
    );

    document.body.appendChild(tooltip);

    return tooltip;
}

function hideItemTooltip_STEP430() {
    var tooltip =
        document.getElementById(
            'itemTooltip_STEP430'
        );

    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

function showItemTooltip_STEP430(
    element,
    detail,
    event
) {
    ensureGameSettings_STEP430();

    if (
        !game.settings.itemHoverDetails ||
        !detail
    ) {
        hideItemTooltip_STEP430();
        return;
    }

    var tooltip =
        ensureItemTooltip_STEP430();

    var itemName =
        element.dataset.itemNameStep430 ||
        '';

    tooltip.innerHTML =
        (
            itemName
                ? '<div style="font-weight:900;color:#ffe18a;margin-bottom:4px">' +
                  itemName +
                  '</div>'
                : ''
        ) +
        '<div>' +
        detail +
        '</div>';

    tooltip.style.display =
        'block';

    moveItemTooltip_STEP430(event);
}

function moveItemTooltip_STEP430(event) {
    var tooltip =
        document.getElementById(
            'itemTooltip_STEP430'
        );

    if (
        !tooltip ||
        tooltip.style.display === 'none' ||
        !event
    ) {
        return;
    }

    var gap = 14;
    var x = event.clientX + gap;
    var y = event.clientY + gap;

    var rect =
        tooltip.getBoundingClientRect();

    if (
        x + rect.width >
        window.innerWidth - 8
    ) {
        x =
            event.clientX -
            rect.width -
            gap;
    }

    if (
        y + rect.height >
        window.innerHeight - 8
    ) {
        y =
            event.clientY -
            rect.height -
            gap;
    }

    tooltip.style.left =
        Math.max(8, x) + 'px';

    tooltip.style.top =
        Math.max(8, y) + 'px';
}


// 主要UIに出ているアイテム名を自動検出して詳細対象にする。
function decorateItemNames_STEP430(root) {
    if (!root) return;

    var names =
        Object.keys(ITEM_DETAILS_STEP430);

    if (
        typeof ORE_TYPES !== 'undefined'
    ) {
        ORE_TYPES.forEach(function(type) {
            if (
                names.indexOf(type.name) < 0
            ) {
                names.push(type.name);
            }
        });
    }

    var elements =
        Array.from(
            root.querySelectorAll(
                'span, div, b, strong'
            )
        );

    elements.forEach(function(el) {
        if (
            el.children.length > 0 ||
            el.dataset.itemDetailStep430
        ) {
            return;
        }

        var txt =
            String(
                el.textContent || ''
            ).trim();

        if (!txt) return;

        var matched =
            names.find(function(name) {
                return (
                    txt === name ||
                    txt.indexOf(name + ' ') === 0 ||
                    txt.indexOf(name + '：') === 0 ||
                    txt.indexOf(name + ' ×') === 0 ||
                    txt.indexOf(name + '（') === 0
                );
            });

        if (!matched) return;

        var detail =
            getItemDetailText_STEP430(
                matched
            );

        if (!detail) return;

        el.dataset.itemDetailStep430 =
            detail;

        el.dataset.itemNameStep430 =
            matched;

        el.style.cursor =
            'help';

        el.style.textDecoration =
            'underline dotted rgba(220,225,230,.35)';

        el.style.textUnderlineOffset =
            '3px';
    });
}

function decorateAllItemWindows_STEP430() {
    [
        'shopWindow',
        'warehouseWindow',
        'inventoryWindow',
        'workshopWindow',
        'archiveWindow',
        'casinoOverlay_STEP418'
    ].forEach(function(id) {
        var root =
            document.getElementById(id);

        if (root) {
            decorateItemNames_STEP430(
                root
            );
        }
    });
}


// document側で一括処理するので、後から生成されたアイテム行でも動く。
if (!window.__itemTooltipEvents_STEP430) {
    window.__itemTooltipEvents_STEP430 = true;

    document.addEventListener(
        'mouseover',
        function(event) {
            var target =
                event.target &&
                event.target.closest
                    ? event.target.closest(
                        '[data-item-detail-step430]'
                    )
                    : null;

            if (!target) return;

            showItemTooltip_STEP430(
                target,
                target.dataset.itemDetailStep430,
                event
            );
        },
        true
    );

    document.addEventListener(
        'mousemove',
        function(event) {
            moveItemTooltip_STEP430(
                event
            );
        },
        true
    );

    document.addEventListener(
        'mouseout',
        function(event) {
            var target =
                event.target &&
                event.target.closest
                    ? event.target.closest(
                        '[data-item-detail-step430]'
                    )
                    : null;

            if (!target) return;

            var related =
                event.relatedTarget;

            if (
                related &&
                target.contains(related)
            ) {
                return;
            }

            hideItemTooltip_STEP430();
        },
        true
    );
}


// ---------------------------------------------------------------------------
// 設定画面
// ---------------------------------------------------------------------------
function ensureSettingsUI_STEP430() {
    if (
        document.getElementById(
            'settingsOverlay_STEP430'
        )
    ) {
        return;
    }

    var overlay =
        createOverlay(
            'settingsOverlay_STEP430'
        );

    overlay.style.zIndex =
        '19000';

    var box =
        createModalWindow();

    box.id =
        'settingsWindow_STEP430';

    Object.assign(
        box.style,
        {
            width: 'min(560px, calc(100% - 34px))',
            maxHeight: 'calc(100vh - 44px)',
            overflowY: 'auto'
        }
    );

    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

function openSettings_STEP430() {
    if (!game.baseOpen) return;

    ensureGameSettings_STEP430();
    ensureSettingsUI_STEP430();

    hideItemTooltip_STEP430();

    // 他の拠点施設と重ならないように閉じる。
    if (typeof closeShop === 'function') closeShop();
    if (typeof closeWarehouse === 'function') closeWarehouse();
    if (typeof closeForge === 'function') closeForge();
    if (typeof closeBaseUpgrade === 'function') closeBaseUpgrade();
    if (typeof closeWorkshop === 'function') closeWorkshop();
    if (typeof closeArchive === 'function') closeArchive();
    if (typeof closeDevMenu === 'function') closeDevMenu();

    updateSettingsUI_STEP430();

    showOverlay(
        'settingsOverlay_STEP430'
    );
}

function closeSettings_STEP430() {
    hideOverlay(
        'settingsOverlay_STEP430'
    );

    hideItemTooltip_STEP430();
}

function toggleItemHoverDetails_STEP430() {
    ensureGameSettings_STEP430();

    game.settings.itemHoverDetails =
        !game.settings.itemHoverDetails;

    hideItemTooltip_STEP430();

    updateSettingsUI_STEP430();

    addLog(
        'アイテム詳細表示を ' +
        (
            game.settings.itemHoverDetails
                ? 'ON'
                : 'OFF'
        ) +
        ' にしました。'
    );
}

function updateSettingsUI_STEP430() {
    ensureGameSettings_STEP430();
    ensureSettingsUI_STEP430();

    var box =
        document.getElementById(
            'settingsWindow_STEP430'
        );

    if (!box) return;

    box.innerHTML = '';

    box.appendChild(
        createTitle('設定')
    );

    var intro =
        document.createElement('div');

    intro.textContent =
        'ゲーム画面の表示・操作に関する設定を変更できます。';

    intro.style.cssText =
        'margin-bottom:13px;font-size:11px;color:#aeb5bb;';

    box.appendChild(intro);

    var row =
        document.createElement('div');

    Object.assign(
        row.style,
        {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            padding: '12px',
            border: '1px solid #515b64',
            borderRadius: '7px',
            background: 'rgba(17,21,25,.82)'
        }
    );

    var info =
        document.createElement('div');

    info.innerHTML =
        '<b>アイテム詳細表示</b>' +
        '<div style="font-size:11px;color:#9fa7ae;margin-top:4px;line-height:1.5">' +
        'アイテム名にカーソルを合わせた時、効果や用途の説明を表示します。' +
        '</div>';

    row.appendChild(info);

    var toggle =
        document.createElement('button');

    toggle.textContent =
        game.settings.itemHoverDetails
            ? 'ON'
            : 'OFF';

    Object.assign(
        toggle.style,
        {
            minWidth: '86px',
            minHeight: '40px',
            fontWeight: '900',
            fontSize: '15px',
            borderColor:
                game.settings.itemHoverDetails
                    ? '#5da874'
                    : '#785555',
            color:
                game.settings.itemHoverDetails
                    ? '#aef0be'
                    : '#d3a2a2'
        }
    );

    toggle.onclick = function(event) {
        event.stopPropagation();

        toggleItemHoverDetails_STEP430();
    };

    row.appendChild(toggle);
    box.appendChild(row);

    var defaultInfo =
        document.createElement('div');

    defaultInfo.textContent =
        'デフォルト：ON';

    defaultInfo.style.cssText =
        'margin-top:7px;font-size:10px;color:#777f86;';

    box.appendChild(defaultInfo);

    var close =
        document.createElement('button');

    close.textContent = '閉じる';

    Object.assign(
        close.style,
        {
            width: '100%',
            minHeight: '42px',
            marginTop: '14px'
        }
    );

    close.onclick = function(event) {
        event.stopPropagation();

        closeSettings_STEP430();
    };

    box.appendChild(close);
}


// ---------------------------------------------------------------------------
// 拠点に設定ボタンを追加
// ---------------------------------------------------------------------------
function ensureBaseSettingsButton_STEP430() {
    if (!game.baseOpen) return;

    var existing =
        document.getElementById(
            'settingsFacilityButton_STEP430'
        );

    if (existing) return;

    var title =
        Array.from(
            document.querySelectorAll('div')
        ).find(function(el) {
            return (
                String(
                    el.textContent || ''
                ).trim() ===
                '【 施 設 区 画 】'
            );
        });

    if (!title) return;

    var facilityPanel =
        title.parentNode;

    if (!facilityPanel) return;

    var buttonArea =
        Array.from(
            facilityPanel.children
        ).find(function(el) {
            return (
                el !== title &&
                el.querySelector &&
                el.querySelector('button')
            );
        });

    if (!buttonArea) return;

    var button =
        document.createElement('button');

    button.id =
        'settingsFacilityButton_STEP430';

    button.textContent =
        '設定';

    styleBaseFacilityButton(
        button
    );

    button.style.borderColor =
        '#607486';

    button.style.color =
        '#c5d9e8';

    button.onclick = function(event) {
        event.stopPropagation();

        openSettings_STEP430();
    };

    buttonArea.appendChild(button);
}


// ---------------------------------------------------------------------------
// 主要UI更新時に詳細対象を再付与
// ---------------------------------------------------------------------------
const _step430_updateShopUI =
    updateShopUI;

updateShopUI = function() {
    var result =
        _step430_updateShopUI();

    decorateAllItemWindows_STEP430();

    return result;
};


const _step430_updateWarehouseUI =
    updateWarehouseUI;

updateWarehouseUI = function() {
    var result =
        _step430_updateWarehouseUI();

    decorateAllItemWindows_STEP430();

    return result;
};


const _step430_updateInventoryUI =
    updateInventoryUI;

updateInventoryUI = function() {
    var result =
        _step430_updateInventoryUI();

    decorateAllItemWindows_STEP430();

    return result;
};


const _step430_updateWorkshopUI =
    updateWorkshopUI;

updateWorkshopUI = function() {
    var result =
        _step430_updateWorkshopUI();

    decorateAllItemWindows_STEP430();

    return result;
};


const _step430_updateArchiveUI =
    updateArchiveUI;

updateArchiveUI = function() {
    var result =
        _step430_updateArchiveUI();

    decorateAllItemWindows_STEP430();

    return result;
};


const _step430_renderCasinoContents =
    renderCasinoContents_STEP420;

renderCasinoContents_STEP420 = function() {
    var result =
        _step430_renderCasinoContents();

    decorateAllItemWindows_STEP430();

    return result;
};


const _step430_updateBaseUI =
    updateBaseUI;

updateBaseUI = function() {
    var result =
        _step430_updateBaseUI();

    ensureBaseSettingsButton_STEP430();

    return result;
};


const _step430_updateAllBaseWindows =
    updateAllBaseWindows;

updateAllBaseWindows = function() {
    var result =
        _step430_updateAllBaseWindows();

    ensureBaseSettingsButton_STEP430();
    decorateAllItemWindows_STEP430();

    return result;
};


// 初回
ensureGameSettings_STEP430();
ensureSettingsUI_STEP430();
ensureBaseSettingsButton_STEP430();
decorateAllItemWindows_STEP430();



// ============================================================================
// STEP 4-31：帰還券ナーフ
// ・価格 100 COIN は据え置き
// ・確定コイン 100% は維持
// ・未確定コイン持ち帰り 80% → 50%
// 精算所を飛ばす判断に明確な代償を持たせる。
// ============================================================================



// ============================================================================
// STEP 4-32：カジノ経済再調整
// ============================================================================

const CASINO_PRIZES_BALANCE_STEP432 = [
    {id:'sugorokuDoubleBet', name:'倍賭け札', price:100, kind:'consumable', description:'すごろくで次に発生する報酬と損失を両方2倍にする。'},
    {id:'sugorokuInsurance', name:'保険証', price:200, kind:'consumable', description:'すごろくで次に受けるコイン損失を50%軽減する。'},
    {id:'sugorokuForceStop', name:'強制停止券', price:300, kind:'consumable', description:'すごろくで移動途中の好きなマスに強制停止できる。'},
    {id:'sugorokuGoldenKey', name:'黄金の鍵', price:350, kind:'consumable', description:'すごろくで次に止まった宝箱の報酬ランクを1段階上げる。'},
    {id:'sugorokuCheatDice', name:'イカサマサイコロ', price:500, kind:'consumable', description:'すごろくで次のサイコロの出目を1～6から指定できる。'},
    {id:'luckyCharm', name:'幸運のお守り', price:10000, kind:'permanent', description:'すごろくの一部の最悪クラスイベント発生率をわずかに下げる恒久景品。'},
    {id:'premiumDiceCase', name:'高級サイコロケース', price:25000, kind:'permanent', description:'すごろくへの専用アイテム持ち込み枠を2枠から3枠へ拡張する恒久景品。'},
    {id:'gamblerBag', name:'勝負師の鞄', price:75000, kind:'permanent', description:'すごろくへの専用アイテム持ち込み枠を3枠から5枠へ拡張する恒久景品。'},
    {id:'reaperScythe', name:'シニガミのカマ', price:1000000, kind:'unique', description:'？？？'}
];

function ensureCasinoBalancePrizeData_STEP432() {
    ensureCasinoPrizeData_STEP429();

    if (!game.casino.items) game.casino.items = {};

    [
        'sugorokuDoubleBet',
        'sugorokuInsurance',
        'sugorokuForceStop',
        'sugorokuGoldenKey',
        'sugorokuCheatDice'
    ].forEach(function(id) {
        game.casino.items[id] =
            Math.max(0, Math.floor(Number(game.casino.items[id] || 0)));
    });

    [
        'luckyCharm',
        'premiumDiceCase',
        'gamblerBag',
        'reaperScythe'
    ].forEach(function(id) {
        game.casino.items[id] = !!game.casino.items[id];
    });
}

const _step432_getCasinoPrize = getCasinoPrize_STEP424;

getCasinoPrize_STEP424 = function(id) {
    var base = _step432_getCasinoPrize(id);
    if (base) return base;

    return CASINO_PRIZES_BALANCE_STEP432.find(function(p) {
        return p.id === id;
    }) || null;
};

function buyCasinoPrize_STEP432(id) {
    ensureCasinoBalancePrizeData_STEP432();

    var prize = CASINO_PRIZES_BALANCE_STEP432.find(function(p) {
        return p.id === id;
    });
    if (!prize) return;

    if (prize.kind !== 'consumable' && game.casino.items[id]) {
        addLog(prize.name + 'はすでに取得済みです。');
        renderCasinoContents_STEP420();
        return;
    }

    if (game.casino.coins < prize.price) {
        addLog('カジノコインが足りない。');
        renderCasinoContents_STEP420();
        return;
    }

    game.casino.coins -= prize.price;

    if (prize.kind === 'consumable') {
        game.casino.items[id] = Number(game.casino.items[id] || 0) + 1;
    } else {
        game.casino.items[id] = true;
    }

    addLog('景品交換：' + prize.name + ' を入手した。');
    updateAllBaseWindows();
    renderCasinoContents_STEP420();
}

function createCasinoPrizeRow_STEP432(parent, prize) {
    ensureCasinoBalancePrizeData_STEP432();

    var row = document.createElement('div');
    Object.assign(row.style, {
        padding:'10px',
        marginBottom:'7px',
        border:'1px solid #655720',
        borderRadius:'6px',
        background:'rgba(20,18,5,.35)'
    });

    var top = document.createElement('div');
    Object.assign(top.style, {
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center',
        gap:'12px'
    });

    var left = document.createElement('div');
    var ownedText = '';

    if (prize.kind === 'consumable') {
        ownedText =
            '<span style="margin-left:8px;color:#ffe66a;font-size:11px">所持 ' +
            Number(game.casino.items[prize.id] || 0).toLocaleString() +
            '</span>';
    } else {
        ownedText =
            '<span style="margin-left:8px;color:' +
            (game.casino.items[prize.id] ? '#9fe5aa' : '#888') +
            ';font-size:11px">' +
            (game.casino.items[prize.id] ? '取得済み' : '未取得') +
            '</span>';
    }

    left.innerHTML =
        '<b>' + prize.name + '</b>' +
        ownedText +
        '<div style="font-size:11px;color:#aaa;margin-top:4px;line-height:1.5">' +
        prize.description +
        '</div>' +
        (prize.kind === 'consumable'
            ? '<div style="font-size:10px;color:#747b82;margin-top:3px">所持上限：実質なし</div>'
            : '<div style="font-size:10px;color:#747b82;margin-top:3px">一度きりの景品</div>');

    var right = document.createElement('div');
    right.style.textAlign = 'right';

    var price = document.createElement('div');
    price.textContent = prize.price.toLocaleString() + ' COIN';
    Object.assign(price.style, {
        color:'#ffe66a',
        fontWeight:'bold',
        whiteSpace:'nowrap'
    });

    var button = document.createElement('button');
    button.textContent =
        prize.kind === 'consumable'
            ? '交換'
            : (game.casino.items[prize.id] ? '取得済み' : '交換');

    button.disabled =
        game.casino.coins < prize.price ||
        (prize.kind !== 'consumable' && game.casino.items[prize.id]);

    button.style.marginTop = '6px';

    button.onclick = function(event) {
        event.stopPropagation();
        buyCasinoPrize_STEP432(prize.id);
    };

    right.appendChild(price);
    right.appendChild(button);

    top.appendChild(left);
    top.appendChild(right);
    row.appendChild(top);
    parent.appendChild(row);
}

const _step432_appendExtraCasinoPrizes = appendExtraCasinoPrizes_STEP429;

appendExtraCasinoPrizes_STEP429 = function() {
    _step432_appendExtraCasinoPrizes();
    ensureCasinoBalancePrizeData_STEP432();

    var overlay = ensureCasinoUI_STEP418();
    if (!overlay) return;

    var box = overlay.firstElementChild;
    if (!box) return;

    var panels = Array.from(box.children).filter(function(el) {
        return el.firstElementChild &&
            /^【/.test(el.firstElementChild.textContent || '');
    });

    var prizes = panels.find(function(el) {
        return (el.firstElementChild.textContent || '').indexOf('景品交換所') >= 0;
    });

    if (!prizes) return;

    var old = document.getElementById('casinoBalancePrizeGroup_STEP432');
    if (old) old.remove();

    var group = document.createElement('div');
    group.id = 'casinoBalancePrizeGroup_STEP432';

    var title = document.createElement('div');
    title.textContent = '【 すごろく攻略・高額景品 】';
    title.style.cssText =
        'margin:13px 0 7px;color:#ffd98a;font-weight:900;font-size:12px;';

    group.appendChild(title);

    CASINO_PRIZES_BALANCE_STEP432.forEach(function(prize) {
        createCasinoPrizeRow_STEP432(group, prize);
    });

    prizes.appendChild(group);
};

ITEM_DETAILS_STEP430['倍賭け札'] =
    'カジノすごろくで、次に発生する報酬と損失を両方2倍にする消耗品。';
ITEM_DETAILS_STEP430['保険証'] =
    'カジノすごろくで、次に受けるコイン損失を50%軽減する消耗品。';
ITEM_DETAILS_STEP430['強制停止券'] =
    'カジノすごろくで、移動途中の好きなマスに強制停止できる消耗品。';
ITEM_DETAILS_STEP430['黄金の鍵'] =
    'カジノすごろくで、次に止まった宝箱の報酬ランクを1段階上げる消耗品。';
ITEM_DETAILS_STEP430['イカサマサイコロ'] =
    'カジノすごろくで、次のサイコロの出目を1～6から指定できる消耗品。';
ITEM_DETAILS_STEP430['幸運のお守り'] =
    'カジノすごろくの一部の最悪クラスイベント発生率をわずかに下げる恒久景品。';
ITEM_DETAILS_STEP430['高級サイコロケース'] =
    'カジノすごろくへの専用アイテム持ち込み枠を2枠から3枠へ拡張する恒久景品。';
ITEM_DETAILS_STEP430['勝負師の鞄'] =
    'カジノすごろくへの専用アイテム持ち込み枠を3枠から5枠へ拡張する恒久景品。';
ITEM_DETAILS_STEP430['シニガミのカマ'] =
    '用途不明。';

ensureCasinoBalancePrizeData_STEP432();



// ============================================================================
// STEP 4-33：シニガミのカマ説明非公開
// ・景品交換所では名称と価格のみ明示
// ・説明は「？？？」
// ・ホバー詳細も「用途不明。」
// ・第5層接続に必要であることはUI上で伏せる
// ============================================================================



// ============================================================================
// STEP 4-34：第4層20F → 夜断ちの楔 → 第5層 接続導線完成
// ============================================================================

// 正式な「シニガミのカマ」所持判定。
// STEP4-32以降のカジノ景品 reaperScythe を本編素材として扱い、
// 旧実装 deathScythe も互換用として認識する。
function hasReaperScythe_STEP434() {
    var casinoOwned =
        !!(
            game.casino &&
            game.casino.items &&
            game.casino.items.reaperScythe
        );

    var legacyOwned =
        !!(
            game.inventory &&
            game.inventory.items &&
            Number(game.inventory.items.deathScythe || 0) > 0
        );

    return casinoOwned || legacyOwned;
}

function consumeReaperScythe_STEP434() {
    if (
        game.casino &&
        game.casino.items &&
        game.casino.items.reaperScythe
    ) {
        game.casino.items.reaperScythe = false;
        return true;
    }

    if (
        game.inventory &&
        game.inventory.items &&
        Number(game.inventory.items.deathScythe || 0) > 0
    ) {
        game.inventory.items.deathScythe--;
        return true;
    }

    return false;
}


// 夜断ちの楔の正式条件。
// 第4層20F完了後に初めてカマの用途が工房側で判明する。
canCraftLayer5Key = function() {
    ensureLayer4();

    if (!game.layer4.floor20Cleared) return false;
    if (!game.layer4.nightVeilObtained) return false;

    if (
        !game.inventory ||
        !game.inventory.items ||
        Number(game.inventory.items.nightVeil || 0) < 1
    ) {
        return false;
    }

    if (!hasReaperScythe_STEP434()) return false;

    if (Number(game.money || 0) < LAYER5_KEY_MONEY) {
        return false;
    }

    return Object.entries(
        LAYER5_KEY_ORES
    ).every(function(entry) {
        return (
            Number(
                game.warehouse.ores[entry[0]] || 0
            ) >= entry[1]
        );
    });
};


// 楔作成。
// カマと夜の帳は消費、全27鉱石と50億Gも消費。
// 完成後は既存の第5層探索UIを正式解放。
craftLayer5Key = function() {
    if (!canCraftLayer5Key()) {
        addLog(
            '「夜断ちの楔」の作成条件を満たしていない。'
        );
        return;
    }

    Object.entries(
        LAYER5_KEY_ORES
    ).forEach(function(entry) {
        game.warehouse.ores[entry[0]] -=
            entry[1];
    });

    game.inventory.items.nightVeil--;

    if (!consumeReaperScythe_STEP434()) {
        return;
    }

    game.money -= LAYER5_KEY_MONEY;

    game.layer4.layer5KeyCrafted = true;

    ensureLayer5();

    game.layer5.unlocked = true;
    game.layer5.currentFloor = 1001;
    game.layer5.maxReachedFloor =
        Math.max(
            1001,
            Number(
                game.layer5.maxReachedFloor || 1001
            )
        );

    if (!game.layer5.reached) {
        game.layer5.reached = {};
    }

    game.layer5.reached[1001] = true;
    game.layer5.selectedFloor = 1001;

    game.world.maxUnlockedLayer =
        Math.max(
            Number(game.world.maxUnlockedLayer || 1),
            5
        );

    addLog(
        '「夜断ちの楔」を作成した。'
    );

    addLog(
        '深度観測装置の表示が一瞬だけ暗転した。'
    );

    addLog(
        '未登録領域への接続を確認。'
    );

    setBaseMessage(
        '接続先の座標を取得できません。探索経路のみ確立されています。'
    );

    updateAllBaseWindows();
    updateBaseTicker(true);
};


// ---------------------------------------------------------------------------
// 夜断ちの楔：材料一覧UI
// ---------------------------------------------------------------------------

const LAYER5_KEY_NAMES_STEP434 = {
    afterglowStone:'残光石',
    twilightCrystal:'薄明晶',
    duskOre:'暮光鉱',
    shadowEaterCrystal:'影喰晶',
    hollowNightCrystal:'虚夜晶',

    breezeShard:'微風のかけら',
    windCrystal:'風の結晶',

    greenCorrosion:'緑蝕鉱',
    grayCrystal:'灰晶鉱',
    blackMembrane:'黒膜鉱',
    deepBlueOre:'深青鉱',
    sealedAirCrystal:'封気晶',
    zeroVeinCrystal:'零脈晶',

    iron:'鉄鉱石',
    copper:'銅鉱石',
    silver:'銀鉱石',
    gold:'金鉱石',
    platinum:'白金鉱石',
    mithril:'ミスリル鉱石',
    orichalcum:'オリハルコン鉱石',
    adamantite:'アダマンタイト鉱石',
    obsidianCrystal:'黒曜晶鉱',
    starSilver:'星銀鉱石',
    dragonCrystal:'竜晶鉱',
    heavenCrystal:'天晶鉱',
    voidCrystal:'虚空晶鉱',
    godSteel:'神鋼鉱'
};

function createLayer5KeyRequirementLine_STEP434(
    name,
    current,
    required
) {
    var ok =
        Number(current) >= Number(required);

    var row =
        document.createElement('div');

    Object.assign(
        row.style,
        {
            display:'grid',
            gridTemplateColumns:'minmax(130px,1fr) auto',
            gap:'10px',
            padding:'5px 7px',
            marginTop:'3px',
            borderRadius:'4px',
            background:
                ok
                    ? 'rgba(50,100,65,.13)'
                    : 'rgba(95,45,45,.13)'
        }
    );

    var left =
        document.createElement('div');

    left.textContent = name;

    left.style.color =
        ok ? '#b7d9c0' : '#d6b5b5';

    var right =
        document.createElement('div');

    right.innerHTML =
        '<b style="color:' +
        (
            ok
                ? '#9be1aa'
                : '#ff9b9b'
        ) +
        '">' +
        Number(current).toLocaleString() +
        '</b>' +
        '<span style="color:#858c92"> / ' +
        Number(required).toLocaleString() +
        '</span>';

    row.appendChild(left);
    row.appendChild(right);

    return row;
}


function createLayer5KeyWorkshopPanel_STEP434() {
    if (
        !game.layer4 ||
        !game.layer4.floor20Cleared ||
        game.layer5.unlocked
    ) {
        return null;
    }

    var panel =
        document.createElement('div');

    panel.id =
        'layer5KeyWorkshopPanel_STEP434';

    Object.assign(
        panel.style,
        {
            padding:'11px',
            marginTop:'10px',
            border:'1px solid #655978',
            borderRadius:'7px',
            background:'rgba(28,20,42,.30)'
        }
    );

    var title =
        document.createElement('div');

    title.textContent =
        '【 夜断ちの楔 】';

    title.style.cssText =
        'font-weight:900;color:#d8c4ff;font-size:14px;margin-bottom:4px;';

    panel.appendChild(title);

    var intro =
        document.createElement('div');

    intro.textContent =
        '20Fで観測された接続反応を固定するための楔。必要素材が判明した。';

    intro.style.cssText =
        'font-size:11px;color:#aab0b6;line-height:1.5;margin-bottom:8px;';

    panel.appendChild(intro);


    // 特殊素材
    var specialTitle =
        document.createElement('div');

    specialTitle.textContent =
        '特殊素材';

    specialTitle.style.cssText =
        'font-weight:bold;color:#c9b8df;margin-top:5px;';

    panel.appendChild(specialTitle);

    panel.appendChild(
        createLayer5KeyRequirementLine_STEP434(
            '夜の帳',
            Number(
                game.inventory.items.nightVeil || 0
            ),
            1
        )
    );

    panel.appendChild(
        createLayer5KeyRequirementLine_STEP434(
            'シニガミのカマ',
            hasReaperScythe_STEP434() ? 1 : 0,
            1
        )
    );


    // 鉱石を階層ごとに分ける
    [
        {
            title:'第4層素材',
            ids:[
                'afterglowStone',
                'twilightCrystal',
                'duskOre',
                'shadowEaterCrystal',
                'hollowNightCrystal'
            ]
        },
        {
            title:'第3層素材',
            ids:[
                'breezeShard',
                'windCrystal'
            ]
        },
        {
            title:'第2層素材',
            ids:[
                'greenCorrosion',
                'grayCrystal',
                'blackMembrane',
                'deepBlueOre',
                'sealedAirCrystal',
                'zeroVeinCrystal'
            ]
        },
        {
            title:'第1層素材',
            ids:[
                'iron',
                'copper',
                'silver',
                'gold',
                'platinum',
                'mithril',
                'orichalcum',
                'adamantite',
                'obsidianCrystal',
                'starSilver',
                'dragonCrystal',
                'heavenCrystal',
                'voidCrystal',
                'godSteel'
            ]
        }
    ].forEach(function(group) {
        var heading =
            document.createElement('div');

        heading.textContent =
            group.title;

        heading.style.cssText =
            'font-weight:bold;color:#c9b8df;margin-top:10px;';

        panel.appendChild(heading);

        group.ids.forEach(function(id) {
            panel.appendChild(
                createLayer5KeyRequirementLine_STEP434(
                    LAYER5_KEY_NAMES_STEP434[id] || id,
                    Number(
                        game.warehouse.ores[id] || 0
                    ),
                    Number(
                        LAYER5_KEY_ORES[id] || 0
                    )
                )
            );
        });
    });


    var moneyTitle =
        document.createElement('div');

    moneyTitle.textContent =
        '資金';

    moneyTitle.style.cssText =
        'font-weight:bold;color:#c9b8df;margin-top:10px;';

    panel.appendChild(moneyTitle);

    panel.appendChild(
        createLayer5KeyRequirementLine_STEP434(
            '所持金',
            Number(game.money || 0),
            LAYER5_KEY_MONEY
        )
    );


    var button =
        document.createElement('button');

    button.textContent =
        canCraftLayer5Key()
            ? '夜断ちの楔を作成'
            : '素材不足';

    button.disabled =
        !canCraftLayer5Key();

    Object.assign(
        button.style,
        {
            width:'100%',
            minHeight:'44px',
            marginTop:'11px',
            fontWeight:'900',
            fontSize:'14px'
        }
    );

    button.onclick = function(event) {
        event.stopPropagation();

        craftLayer5Key();
        updateWorkshopUI();
    };

    panel.appendChild(button);

    return panel;
}


// STEP4-5由来の簡易「夜断ちの楔」行を消して、
// 詳細な材料一覧へ置換。
const _step434_updateWorkshopUI =
    updateWorkshopUI;

updateWorkshopUI = function() {
    var result =
        _step434_updateWorkshopUI();

    var box =
        document.getElementById(
            'workshopWindow'
        );

    if (!box) return result;

    var old =
        document.getElementById(
            'layer5KeyWorkshopPanel_STEP434'
        );

    if (old) old.remove();

    // 旧簡易行を名前で特定して削除。
    Array.from(
        box.children
    ).forEach(function(child) {
        if (
            child.id !==
                'layer5KeyWorkshopPanel_STEP434' &&
            child.querySelector
        ) {
            var first =
                child.querySelector('div');

            if (
                first &&
                first.textContent === '夜断ちの楔'
            ) {
                child.remove();
            }
        }
    });

    var panel =
        createLayer5KeyWorkshopPanel_STEP434();

    if (panel) {
        var close =
            Array.from(
                box.querySelectorAll('button')
            ).find(function(button) {
                return (
                    button.textContent === '閉じる'
                );
            });

        if (close) {
            box.insertBefore(
                panel,
                close
            );
        } else {
            box.appendChild(panel);
        }
    }

    if (
        typeof decorateAllItemWindows_STEP430 ===
        'function'
    ) {
        decorateAllItemWindows_STEP430();
    }

    return result;
};


// ---------------------------------------------------------------------------
// 深度観測
// 楔未完成：壊れた表示。
// 条件全部達成時だけ工房への案内。
// 楔完成後：既存の第5層探索UIへ任せる。
// ---------------------------------------------------------------------------
const _step434_updateDepthObservationUI =
    updateDepthObservationUI;

updateDepthObservationUI = function() {
    ensureLayer4();
    ensureLayer5();

    if (
        game.layer4.floor20Cleared &&
        !game.layer5.unlocked
    ) {
        var box =
            document.getElementById(
                'depthObservationBox'
            );

        if (!box) return;

        box.innerHTML = '';

        var title =
            document.createElement('div');

        title.textContent =
            '【 深 度 観 測 】';

        title.style.cssText =
            'font-weight:bold;color:#b5a2ff;';

        box.appendChild(title);

        var broken =
            document.createElement('div');

        broken.innerHTML =
            '<div style="margin-top:7px;letter-spacing:1px">████████████████</div>' +
            '<div>████……████████</div>';

        box.appendChild(broken);

        if (canCraftLayer5Key()) {
            var ready =
                document.createElement('div');

            ready.textContent =
                '接続固定に必要な条件が揃っています。工房を確認してください。';

            ready.style.cssText =
                'margin-top:8px;color:#e5dcff;font-weight:bold;';

            box.appendChild(ready);
        }

        return;
    }

    return _step434_updateDepthObservationUI();
};


// カジノでカマを取得した後でも、交換所では用途を伏せたまま。
// 工房が第4層20F後にのみ用途を明かす。
if (
    typeof ITEM_DETAILS_STEP430 !==
    'undefined'
) {
    ITEM_DETAILS_STEP430['シニガミのカマ'] =
        '用途不明。';
}


// 初期整合性
ensureLayer4();
ensureLayer5();



// ============================================================================
// STEP 4-35：通常プレイ開始前 修正セット
// 1. 倉庫：未発見鉱石を非表示
// 2. DEV_MODE=trueだけでは地図全開示しない
// 3. DEV：進行地点ワープを通常インベントリから除去
// 4. 「探索」表記へ統一
// 5. ショップ購入/売却：1 / 10 / 100 / 全部
// 6. 宝箱：解放済み階層までの鉱石だけ抽選
// ============================================================================

devRevealPlacedObjects_STEP417 = function() {
    if (
        !DEV_MODE ||
        !game.dev ||
        !game.dev.fullMapReveal ||
        game.baseOpen ||
        !game.map
    ) {
        return;
    }

    for (var y = 0; y < game.explored.length; y++) {
        if (!game.explored[y]) continue;

        for (var x = 0; x < game.explored[y].length; x++) {
            game.explored[y][x] = true;
        }
    }

    (game.ores || []).forEach(function(ore) {
        ore.discovered = true;
    });

    if (game.returnPoint) {
        game.returnPoint.found = true;
    }

    if (
        game.stairs &&
        !(
            game.world.currentLayer === 1 &&
            Number(game.currentMineLevel) === 100
        )
    ) {
        game.stairs.found = true;
    }

    if (
        game.world.currentLayer === 2 &&
        game.layer2 &&
        game.layer2.floorRuntime
    ) {
        var rt2 = game.layer2.floorRuntime;

        if (rt2.healing) {
            rt2.healing.found = true;
        }

        if (rt2.switchPos) {
            rt2.switchFound = true;
        }
    }
};

appendDevProgressWarpItem_STEP416 = function() {
    var old =
        document.getElementById(
            "devProgressWarpRow_STEP416"
        );

    if (old) {
        old.remove();
    }
};

function isOreDiscovered_STEP435(type) {
    if (!type) return false;

    var record =
        game.records &&
        game.records.ores
            ? game.records.ores[type.id]
            : null;

    return !!(
        record &&
        record.discovered
    );
}

function getUnlockedOreLayers_STEP435() {
    var layers = [1];

    if (game.layer2 && game.layer2.unlocked) {
        layers.push(2);
    }

    if (game.layer3 && game.layer3.unlocked) {
        layers.push(3);
    }

    if (game.layer4 && game.layer4.unlocked) {
        layers.push(4);
    }

    return layers;
}

function getOreLayer_STEP435(type) {
    return Number(type.worldLayer || 1);
}

updateWarehouseUI = function() {
    var box =
        document.getElementById(
            "warehouseWindow"
        );

    if (!box) return;

    box.innerHTML = "";
    box.appendChild(
        createTitle("倉庫")
    );

    var description =
        document.createElement("div");

    description.textContent =
        "一度発見した鉱石のみ表示されます。保管済みの鉱石は、探索で力尽きても失われません。";

    description.style.cssText =
        "margin-bottom:13px;font-size:11px;color:#aeb5bb;line-height:1.5;";

    box.appendChild(description);

    var unlocked =
        getUnlockedOreLayers_STEP435();

    var names = {
        1: "通常鉱山",
        2: "旧坑道",
        3: "無風回廊",
        4: "残光遺跡"
    };

    var anyShown = false;

    unlocked.forEach(function(layer) {
        var types =
            ORE_TYPES.filter(function(type) {
                return (
                    getOreLayer_STEP435(type) === layer &&
                    isOreDiscovered_STEP435(type)
                );
            });

        if (types.length <= 0) {
            return;
        }

        anyShown = true;

        var heading =
            document.createElement("div");

        heading.textContent =
            "【 " + names[layer] + " 】";

        heading.style.cssText =
            "margin:10px 0 6px;font-weight:bold;color:#d9c67b;";

        box.appendChild(heading);

        types.forEach(function(type) {
            var row =
                document.createElement("div");

            Object.assign(row.style, {
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 8px",
                marginBottom: "3px",
                background: "rgba(0,0,0,.15)",
                borderRadius: "4px"
            });

            var name =
                document.createElement("span");

            name.textContent =
                type.name;

            var amount =
                document.createElement("span");

            amount.textContent =
                Number(
                    game.warehouse.ores[type.id] || 0
                ).toLocaleString();

            amount.style.color =
                type.color;

            row.appendChild(name);
            row.appendChild(amount);
            box.appendChild(row);
        });
    });

    if (!anyShown) {
        var empty =
            document.createElement("div");

        empty.textContent =
            "まだ発見した鉱石はありません。";

        empty.style.cssText =
            "padding:14px;text-align:center;color:#858c92;font-size:12px;";

        box.appendChild(empty);
    }

    var close =
        document.createElement("button");

    close.textContent = "閉じる";
    close.style.marginTop = "11px";

    close.onclick = function(event) {
        event.stopPropagation();
        closeWarehouse();
    };

    box.appendChild(close);

    if (
        typeof decorateAllItemWindows_STEP430 ===
        "function"
    ) {
        decorateAllItemWindows_STEP430();
    }
};

function buyShopReturnFeather_STEP435(amount) {
    if (!game.shopOpen) return;

    amount =
        Math.max(
            0,
            Math.floor(
                Number(amount) || 0
            )
        );

    var affordable =
        Math.floor(
            Number(game.money || 0) /
            SHOP_RETURN_FEATHER_PRICE_STEP424
        );

    var buyAmount =
        Math.min(
            amount,
            affordable
        );

    if (buyAmount <= 0) {
        addLog(
            "所持金が足りません。"
        );
        return;
    }

    var cost =
        buyAmount *
        SHOP_RETURN_FEATHER_PRICE_STEP424;

    game.money -= cost;

    game.inventory.items.returnFeather =
        Number(
            game.inventory.items.returnFeather || 0
        ) + buyAmount;

    addLog(
        "帰還の羽を" +
        buyAmount.toLocaleString() +
        "個購入した。 (-" +
        cost.toLocaleString() +
        "G)"
    );

    updateAllBaseWindows();
    updateShopUI();
}

renderShopBuy_STEP424 = function(box) {
    var row =
        document.createElement("div");

    Object.assign(row.style, {
        padding: "10px",
        border: "1px solid #555",
        borderRadius: "5px",
        background: "rgba(0,0,0,.16)"
    });

    var info =
        document.createElement("div");

    info.innerHTML =
        "<b>帰還の羽</b>" +
        '<div style="font-size:11px;color:#aaa;margin-top:3px">' +
        "探索中に拠点へ帰還できる。　所持：" +
        Number(
            game.inventory.items.returnFeather || 0
        ).toLocaleString() +
        "</div>" +
        '<div style="font-size:11px;color:#f1c66a;margin-top:4px">' +
        "1個 1,000G" +
        "</div>";

    row.appendChild(info);

    var buttons =
        document.createElement("div");

    buttons.style.cssText =
        "display:flex;gap:6px;flex-wrap:wrap;margin-top:9px;";

    var affordable =
        Math.floor(
            Number(game.money || 0) /
            SHOP_RETURN_FEATHER_PRICE_STEP424
        );

    [
        {label:"1個", amount:1},
        {label:"10個", amount:10},
        {label:"100個", amount:100},
        {label:"全部", amount:affordable}
    ].forEach(function(data) {
        var button =
            document.createElement("button");

        button.textContent =
            data.label;

        button.disabled =
            affordable <= 0 ||
            (
                data.label !== "全部" &&
                affordable < data.amount
            );

        button.onclick = function(event) {
            event.stopPropagation();

            buyShopReturnFeather_STEP435(
                data.amount
            );
        };

        buttons.appendChild(button);
    });

    row.appendChild(buttons);
    box.appendChild(row);
};

createShopOreRow = function(
    parent,
    type
) {
    var amount =
        Number(
            game.warehouse.ores[type.id] || 0
        );

    var row =
        document.createElement("div");

    Object.assign(row.style, {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "9px",
        padding: "7px",
        marginBottom: "4px",
        border: "1px solid #444",
        borderRadius: "4px",
        background: "rgba(0,0,0,.14)",
        flexWrap: "wrap"
    });

    var info =
        document.createElement("div");

    info.textContent =
        type.name +
        " × " +
        amount.toLocaleString() +
        "　売値：" +
        Number(type.sellPrice).toLocaleString() +
        "G";

    var buttons =
        document.createElement("div");

    buttons.style.cssText =
        "display:flex;gap:4px;flex-wrap:wrap;";

    [
        {label:"1個", amount:1},
        {label:"10個", amount:10},
        {label:"100個", amount:100},
        {label:"全部", amount:amount}
    ].forEach(function(data) {
        var button =
            document.createElement("button");

        button.textContent =
            data.label;

        button.disabled =
            amount <= 0 ||
            (
                data.label !== "全部" &&
                amount < data.amount
            );

        button.onclick = function(event) {
            event.stopPropagation();

            sellOre(
                type.id,
                data.amount
            );
        };

        buttons.appendChild(button);
    });

    row.appendChild(info);
    row.appendChild(buttons);
    parent.appendChild(row);
};

renderShopSell_STEP424 = function(box) {
    var layers =
        getShopSellLayers_STEP424();

    if (
        !layers.includes(
            Number(game.shopSellLayer_STEP424)
        )
    ) {
        game.shopSellLayer_STEP424 =
            layers[0];
    }

    if (layers.length > 1) {
        var tabs =
            document.createElement("div");

        Object.assign(tabs.style, {
            display:"flex",
            gap:"5px",
            flexWrap:"wrap",
            marginBottom:"9px"
        });

        var names = {
            1:"通常鉱山",
            2:"旧坑道",
            3:"無風回廊",
            4:"残光遺跡"
        };

        layers.forEach(function(layer) {
            var button =
                document.createElement("button");

            button.textContent =
                names[layer];

            button.disabled =
                Number(
                    game.shopSellLayer_STEP424
                ) === layer;

            button.onclick = function(event) {
                event.stopPropagation();

                game.shopSellLayer_STEP424 =
                    layer;

                updateShopUI();
            };

            tabs.appendChild(button);
        });

        box.appendChild(tabs);
    }

    var visible =
        ORE_TYPES.filter(function(type) {
            return (
                Number(type.worldLayer || 1) ===
                    Number(
                        game.shopSellLayer_STEP424 || 1
                    ) &&
                isOreDiscovered_STEP435(type)
            );
        });

    visible.forEach(function(type) {
        createShopOreRow(
            box,
            type
        );
    });

    if (visible.length === 0) {
        var empty =
            document.createElement("div");

        empty.textContent =
            "この階層で発見済みの鉱石はありません。";

        empty.style.cssText =
            "padding:12px;color:#858c92;font-size:11px;";

        box.appendChild(empty);
    }

    var all =
        document.createElement("button");

    all.textContent =
        "表示中の鉱石を全部売る";

    all.disabled =
        !visible.some(function(type) {
            return (
                Number(
                    game.warehouse.ores[type.id] || 0
                ) > 0
            );
        });

    all.style.marginTop =
        "8px";

    all.onclick = function(event) {
        event.stopPropagation();

        visible.forEach(function(type) {
            var amount =
                Number(
                    game.warehouse.ores[type.id] || 0
                );

            if (amount > 0) {
                sellOre(
                    type.id,
                    amount
                );
            }
        });
    };

    box.appendChild(all);
};

function getTreasureOreCandidates_STEP435() {
    var maxLayer = 1;

    if (game.layer2 && game.layer2.unlocked) {
        maxLayer = 2;
    }

    if (game.layer3 && game.layer3.unlocked) {
        maxLayer = 3;
    }

    if (game.layer4 && game.layer4.unlocked) {
        maxLayer = 4;
    }

    return ORE_TYPES.filter(function(type) {
        var layer =
            Number(type.worldLayer || 1);

        if (layer > maxLayer) {
            return false;
        }

        if (layer === 1) {
            return (
                Number(type.unlockLevel || 1) <=
                Number(game.currentMineLevel || 1)
            );
        }

        return true;
    });
}

openTreasureChest = function() {
    if (!game.treasureChest.exists) {
        return;
    }

    if (
        game.player.x !== game.treasureChest.x ||
        game.player.y !== game.treasureChest.y
    ) {
        return;
    }

    game.treasureChest.exists = false;

    var roll = Math.random();

    if (
        roll <
        TREASURE_EXPLOSION_RATE
    ) {
        triggerTreasureExplosion();
        return;
    }

    if (roll < 0.50) {
        var minMoney =
            50 +
            game.currentMineLevel * 20;

        var maxMoney =
            150 +
            game.currentMineLevel * 60;

        var money =
            randomInt(
                minMoney,
                maxMoney
            );

        game.money += money;

        addLog(
            "宝箱を開けました！"
        );

        addLog(
            money +
            "Gを入手しました。"
        );

        render();
        return;
    }

    if (roll < 0.80) {
        var itemRoll =
            Math.random();

        var itemId =
            "potion";

        var itemName =
            "回復薬";

        if (itemRoll < 0.45) {
            itemId = "potion";
            itemName = "回復薬";

        } else if (
            itemRoll < 0.75
        ) {
            itemId = "detector";
            itemName = "探知機";

        } else if (
            itemRoll < 0.95
        ) {
            itemId = "returnFeather";
            itemName = "帰還の羽";

        } else {
            itemId = "healthBoost";
            itemName = "体力強化";
        }

        addInventoryItem(
            itemId,
            1
        );

        addLog(
            "宝箱を開けました！"
        );

        addLog(
            itemName +
            "を1個入手しました。"
        );

        render();
        return;
    }

    var available =
        getTreasureOreCandidates_STEP435();

    if (available.length <= 0) {
        game.money += 100;

        addLog(
            "宝箱を開けました！"
        );

        addLog(
            "100Gを入手しました。"
        );

        render();
        return;
    }

    var type =
        available[
            randomInt(
                0,
                available.length - 1
            )
        ];

    var amount =
        Math.random() < 0.20
            ? 2
            : 1;

    addOreAmountToExpeditionBag(
        type.id,
        amount
    );

    registerOreDiscovery(
        type.id
    );

    addLog(
        "宝箱を開けました！"
    );

    addLog(
        type.name +
        "を" +
        amount +
        "個入手しました。"
    );

    render();
};

