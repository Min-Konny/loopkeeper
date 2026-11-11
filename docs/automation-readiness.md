# 自動開発の準備と起動条件

この変更は準備段階。Claude実装・自動PR作成・merge・Pages配信をまだ有効にしない。

## 現状

- Loopkeeperはmainを基準にした静的HTML/JavaScript。package.json/yarnはない。
- Node.js 24で `node --test tests/*.test.mjs` を実行する。Minsaiのyarnコマンドを流用しない。
- source-testsはsecretを持たないPR用の通常回帰試験。PR自身がテストを変更できるので独立受入判定ではない。
- Issue formと `scripts/factory/validate-task.mjs task.json` で、目的・SHA・担当・対象・受入条件を明記する。形式検査は許可確認の代わりではない。

## 一工程の流れ

1. Dotが元依頼・最新制限・既存担当・未push差分を照合し、Issueに最小工程を定義。
2. 同一ファイルは一担当。非公開試作/素材を勝手に取り込まない。
3. 承認済みIssueだけClaudeが専用branchで編集し、draft PRを作る。
4. 正確なHEAD SHAで通常回帰を確認。別のクリーンな実行環境で基準検証器を読み取り専用にし、秘密なしで独立受入。
5. レポートはPRの自由文artifactを信用せず、実行ID・SHA・結果の対応を照合。UIやGPU検証は別工程。
6. merge/Pages反映は実際の許可と検証に従う。この仕組みが自動実行することはない。

## Claudeを有効にする前の未完了事項

- 対象repoに対するClaude接続と認証の適用範囲をユーザーが確認。MinsaiのOAuth tokenを読み出す/転用しない。秘密は会話・コード・ログに出さない。
- GitHub書込み権限とPR作成権限を確認し、必要な承認後に最小権限で設定。API課金への自動fallbackはしない。
- 公開repoなので、Issue作成者ではなく起動した人の現行write/maintain/admin権限を検査。ownerによる当該Issue承認を確認し、外部ユーザーがラベルを付けられないだけに依存しない。
- repo全体を同時1工程に制限し、同じIssueの再ラベルで再実行しない。実行済みSHA/PR/runを永続化して照合。
- Claude実装用runnerとPR検証用runnerを分離。self-hosted WindowsはPRコードを実行しない。
- `.github/**`, 認証、権限、配備、依存追加、外部通信、バイナリ素材、セーブ/バランス変更は既定対象外。必要なら工程ごとの明示許可。
- 工程終了後のgit差分で許可ファイル外変更を検査し、push前に拒否する。プロンプトだけの禁止はセキュリティ境界ではない。
- 実際に指定Issueが1回だけ起動し、draft PRが返り、独立検証できた時点で稼働確認とする。

## 検証の範囲

この準備コードのテスト成功を、ゲーム本体の全試験合格や自動開発の稼働成功と呼ばない。
