# 開拓地域の基本景観 — 0.6.105

深森の伐採拠点に針葉樹・丸太小屋・運搬そり、湿地奥地の薬草園に育苗室・薬草床・乾燥棚の専用景観を追加しました。

地域の基本景観は残り星見・氷冠の2地域。必要時読込と画像失敗時の代替表示を維持し、人口・収入・効果・難度・セーブ仕様は変更しません。

|ID|地域|基本画像|
|---|---|---|
|forest|森の伐採拠点|outpost-v1.png|
|quarry|峠の採掘拠点|outpost-quarry-v1.png|
|marsh|湿地の薬草園|outpost-marsh-v1.png|
|lake|湖畔の漁場|outpost-lake-v1.png|
|road|街道の仕事場|specialist-workhouse-v1.png|
|forest_depth|深森の伐採拠点|outpost-forest_depth-v1.png|
|quarry_depth|峠奥地の鉱山|outpost-quarry_depth-v1.png|
|marsh_depth|湿地奥地の薬草園|outpost-marsh_depth-v1.png|
|citadel|砦の交易拠点|outpost-citadel-v1.png|
|river|渓流の漁場|outpost-river-v1.png|
|forge|工房街の製錬所|workshop-v1.png|
|observatory|星見の宝石採掘場|outpost-v1.png|
|ice|氷冠の鉱山|outpost-v1.png|

地域の基本景観は11地域に用途を表す画像が対応（新規専用8、既存素材再利用3）。残りは星見・氷冠の2地域。地域別II/III、非鉄防具/盾等の未制作差分、人の長期評価と実機スマホ確認は別の残項目です。

各地域I/II/IIIは同じ地域基本画像を使用し、段階別専用アートが完成したとは扱いません。生成履歴・採用画像のSHA256・既存素材の再利用元はARTWORK-PROVENANCE.jsonに記録。原画像のbytesとalphaを保ち、既存絵を上書きしません。必要なカードだけで遅延読込し、失敗URL再要求防止と最終SVG代替表示を維持します。

検証は隔離ブラウザーの合成状態です。PC/390/320の表示・低モーション・解放前後・切替・人口配置・保存再読込・画像欠損・遅延読込・自動作業スクロールと予約編集を確認。実ユーザーセーブ、実機スマホや全編の人間プレイの検証とは区別します。利用可能な単体テストと構文/import監査、既存Pagesのビルド・公開後確認を行います。ゲーム計算・報酬・経済・解放条件・人口・セーブは不変です。
