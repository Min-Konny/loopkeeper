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

## 初回CIで確認した既存不具合

main `0b15f74` は266件中4件失敗。4言語導入前のテスト期待値2件を現行文書に合わせ、engine→log表示→reason表示→engineの循環参照を依存なしのログmetadataモジュールへ分離した。ゲーム計算・保存内容・翻訳fallback仕様は変更しない。
修正後は307件合格。入口モジュールを変える6件の独立Nodeプロセス検証とmetadata非永続化検証を追加。通常のブラウザー画面・実機・Pages配信はこの試験の範囲外。

## 読み取り専用preflight

`factory-preflight.yml` は main 上の手動実行のみ。現在の再実行者を含む起動者write権限、同一repoのopen PR、main基準、明示HEAD SHA、固定baseSHA...headSHA比較による全変更ファイル（300件超は拒否）、通常blob modeを確認し、最後にHEAD/baseの変化を再確認する。src/tests/docs以外、renameによる範囲逸脱、symlink、submodule、実行属性、binary/省略patch、途中欠落は拒否。
PRのcheckout・コード実行・依存install・artifact消費・botコメント・秘密参照は一切しない。したがってPR側のinstallが検証器を上書きしたり、任意レポートをbot経由で公開する経路はない。これは形式・範囲の事前確認で、コード内容の安全性や機能の受入を証明しない。21件のfail-closed/正常系テスト付き。main未mergeの段階ではmanual workflow実行は未確認。

Claudeの実行器はまだ存在しない。認証を入れただけで自動開発は開始しない。公式ActionのOAuth方式を選ぶ場合、本人が対象repo限定でClaude Appを設定し、`claude setup-token` の値をGitHub Actionsの `CLAUDE_CODE_OAUTH_TOKEN` secretへ直接登録する。会話への貼付・他repo secretの読み出し・API課金への切替はしない。実行器の書込権限、repo全体のqueue/重複防止、独立検証、1件の実証は別の未完了工程。

## キュー部品（実行器未接続）

`scripts/factory/queue.cjs` は1repo・1state branchを唯一の状態保存先とするキュー部品。Git commitを親SHA固定で作り、force=falseのref更新で競合する兄弟commitの片方だけを反映する。plan/base/policy digestと承認根拠、依存、送信前intentを保持。同じ計画の再enqueueは重複作成しない。reserved/admitted/running/review/uncertainを区別し、結果不明・時間経過から再送/再予約を行わない。known blockedは独立工程を解放でき、復帰には回復根拠が必要。消えたstateを空queue扱いしない。

承認根拠は信頼済み調整者が供給するもので、Issue本文が自称できる承認ではない。現実の外部実行はこの部品に含まれない。送信前予約の成功を確認してから1回だけ呼び出し、結果不明なら予約を残して公式履歴を照合する必要がある。外部呼出とのexactly-onceを保証しない。

ローカルの実Gitオブジェクト/atomic ref更新による再起動・stale writer拒否と、モックAPIのnon-force/未知結果伝播を検証。GitHub上のstate branch作成・保護・常駐consumer・実Claude送信は未実装/未実証。権限設定前に、state branchを誰が書けるか、唯一consumer、未知結果の回復手順を確定する。読み書き権限を増やさずにこのPRだけで常時自動運転になるものではない。

## Consumerと秘密なし往復試験

`consumer.cjs` は信頼済み調整者の入口。保護された設定由来の `SnapshotPolicy` が正確な承認snapshotと承認者の現行write権限を確認してから予約し、限定payloadをworkerへ1回だけ渡す。Issue本文/label/任意artifactでadapterや権限を決めない。実作業開始の観測、同turnの完了、別のtrusted verifierによるrepo/task/intent/plan/head一致を経てverifiedに進む。worker自身の『PASS』は無視する。新しい制限はactive taskをpolicy-holdにし、勝手に予約解除しない。

mock worker/verifierで両repoの「承認→予約→受付→完了review→別検証→verified」を往復。競合consumer、タイムアウト、予約後crash、別turn/別task/旧SHA、承認失効を負例検証。これは実Claude呼出ではない。queue用credentialをworker payloadへ含めない契約をテストするが、同一JavaScript processはcredential隔離の境界ではない。実runner導入時はcoordinator・worker・verifierのOS/runner分離が必須。

残る実運用設定は (1) trusted main上の承認catalogと唯一consumerの配置 (2) state branchの限定書込権限と変更保護 (3) repo限定Claude App/OAuth secret、workerにqueue/配備credentialを渡さないrunner分離 (4) artifact用read-only経路と独立verifier (5) 対象1件の実送信・公式turn/PR/CI照合。現PRはこれらの設定を変更しない。workflowに秘密を入れる前に実行器adapterと最小権限を確定する。

consumer各stepと予約後の送信直前に、現在のtrusted catalog revisionを読み直して承認取消を反映する。最後の読取直後の権限変更まで原子的に防ぐものではなく、実実行環境側の権限失効制御も必要。`verifier.read` は既存の信頼済み検証結果を読むだけの契約で、有料実行・新規検証開始をしない。並行consumerの重複readは許容し、検証runの起動・冪等性は別のtrusted schedulerで実装する。

## 公式検証run readerと隔離の未解決点

`github-run-reader.cjs` はcoordinator保存のsubject→run/attempt receiptと公式GitHub APIを照合する。repo、workflow ID/path、固定trusted source SHA、main、workflow_dispatch、起動者、subject digestを含むrun title、必須jobの成功が揃わない限りpassedにしない。PR任意artifactは一切読まない。完了前はpendingとしてreviewに留める。profileのindependent指定は運用者が実隔離を確認して設定する前提で、文字列自体が隔離を証明するものではない。

実APIから取得した成功run42960952427（通常pull_request CI）が独立検証として拒否される負例を確認した。これは本物の独立受入runの成功ではない。実trusted verifier workflowとsubject receipt発行はまだ未接続。

現在のcloudはDocker/Podmanなし。既存bwrapで全namespace/network分離を試すと `Failed to create NETLINK_ROUTE socket: Operation not permitted`。隔離を弱めたfallback、権限設定変更、ホスト上での未信頼コード実行はしない。したがってcredential付き実workerはここでは起動しない。正式に隔離を提供するrunnerで、network/filesystem/credential境界を負例テストしてから接続する必要がある。ユーザーが現段階でsecretを貼る必要はない。

実getJobs adapterは指定attemptの公式endpointを全ページ取得する必要がある。job確認後にrun再読し途中rerunを拒否する。trusted workflowがsubject titleだけでなく、そのHEADを実際に検証していることも配置時の受入条件。
