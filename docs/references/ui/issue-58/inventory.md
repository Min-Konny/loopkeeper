# LoopKeeper ビジュアル更新の現状調査

基準は統合ブランチのコミット `62986372cbaba2f9be4babc539881bd6f50bea55`（v0.6.140）。撮影は日本語、Chromium、1280×720 と 1920×1080。各例の表示値はエンジンで読み込める検証用セーブの値。

| 対象 | 現行の情報・操作・状態 | 実装 |
| --- | --- | --- |
| #4 タイトル | 世界観背景、タイトル、続きから、新しい挑戦、設定、実績、保存状況、バージョン。空の状態では続きから無効。保存ありでは世代と到達を表示し、上書き前に確認がある。 | title-screen.js, title-state.js, title-screen.css |
| #5 / #51 拠点 | 村の風景、世代、拠点HP、時間操作、次の敵の肖像・名前・WAVE・能力・残り時間、装備導線、行動予約の番号・作業名・編集、現在の作業と進捗、目標、施設数・備え。空・実行中・予約あり・戦役クリアで表示が分岐。 | main.js renderVillageDashboard, village-dashboard.js/.css, village-scene.js |
| #6 作業・行動予約 | 採集と訓練、解放済みの技能と作業、1回の確定産出量と所要時間、技能経験値、実行・予約・反復などの実在する操作。予約には件数上限、編集・条件・停止理由がある。作業者の頭数やランダムな産出量の範囲はこの画面の情報にない。 | main.js renderGather/renderQueue, work-view.js 系, queue-* |
| #7 村・建築 | 解放条件つきの施設一覧、現在の段階、材料コスト、建築／強化操作、条件不足の説明。施設の解放前は左ナビに出ない。 | main.js renderCraft の village 分岐, facility-cards.css |
| #8 装備・持ち物 | 現行の「状態・装備」ダイアログと別導線の「持ち物」。能力値、装備選択、アクセサリ・ビルド、在庫カテゴリーと数量。工房は別画面。 | main.js openInformation/renderSurvivor, gear-ui.js, inventory-ui.js |
| #9 仲間・育成 | 「状態・装備」内の仲間の装備・育成欄。弓使い・魔法使いは各到達WAVEで加入、能力値、初期／所持装備、専用訓練。未加入時は条件表示。資源担当の人員は別機能。 | main.js renderSurvivor, gear-ui.js, party-ui.js, party.js |
| #10 探索・ルート | 外交画面内の開拓地／地域カード。解放条件、危険、主な報酬、詳細、挑戦／管理。未解放・攻略済みの区分。地図ナビは実装されていない。 | main.js renderDiplomacy, routes-ui.js |
| #11 襲撃・戦闘 | 戦闘ダイアログに戦闘風景、プレイヤーと参加中の仲間、敵、HPなどの戦況、戦闘ログ、時間・保存・撤退操作。襲撃と地域戦で撤退表示が変わる。 | main.js syncBattleDialog, battle-ui.js, party-ui.js |
| #12 オーグメント選択 | 候補名、効果・区分、選ぶ操作と条件を満たす場合の引き直し・除外。候補のある状態でダイアログが開く。 | main.js renderScreen, augments-ui.js, mvp-engine.js |
| #13 継承・転生準備 | 実際の転生準備ダイアログ。継承ポイント、カテゴリ、段階と費用、配分の見直し、次の命を始める操作。継承準備と通常プレイの状態で編集可否が変わる。 | main.js renderScreen, legacy-planner.js, inheritance-map*.js |
| #14 世代リザルト | 終了ダイアログ。生存時間、到達WAVE、継承点、技能成果、比較（比較対象がある場合）、次の命への導線。戦役完遂では記録と追加進行の分岐がある。 | main.js showDeath, run-results-ui.js, frontier-finish.js |
| #15 記録・実績 | 「記録」ダイアログ内の実績、クリア記録、報告、チャレンジ、イベント履歴。該当記録がない状態は空表示。設定は別ダイアログ。 | main.js renderJournal/renderScreen, replay-achievements-ui.js, clear-history-ui.js |
| #53 共通外枠 | 実装中のヘッダー、左ナビ、資源表示、メニュー操作。施設、外交、人員の各入口は解放状態に従う。戦闘と世代終了などには既存ダイアログが重なる。 | main.js renderNavigation/renderControls, camp-space.css, dashboard.css |

目標画像で使うラベル・数値・ボタンは、各スクリーンショットの状態に限定する。
