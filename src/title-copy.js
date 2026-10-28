// UI locale is independent of game IDs and save migrations. Only complete
// Japanese title copy is shipped; future languages must supply this dictionary.
export const UI_LOCALE_KEY = 'loopkeeper-ui-locale-v1';
export const SUPPORTED_LOCALES = Object.freeze(['ja']);
const ja = Object.freeze({
  'title.tagline':'幾度倒れても、夜明けへ。',
  'title.menu':'タイトルメニュー',
  'title.description':'小さな野営地から、36波の先へ。\nこの世代の経験を、次の力に。',
  'title.continue':'つづきから', 'title.new':'はじめから',
  'title.settings':'設定', 'title.achievements':'実績',
  'title.record':'第{generation}世代 · 通常最高 {wave} 波',
  'title.resumeHint':'記録を引き継ぎ、一時停止で開きます。',
  'title.emptyHint':'最初の野営地から、新しい挑戦を始めます。',
  'title.backupHint':'保存に問題があります。つづきからでバックアップを確認できます。',
  'title.corruptHint':'保存を読み取れません。元のデータは新規開始時に別途保管します。',
  'title.storageError':'保存領域にアクセスできません。ブラウザーの保存設定を確認してください。',
  'title.busy':'別のタブでプレイ中です。そのタブを閉じてから操作してください。',
  'title.error':'処理できませんでした。記録を確認し、もう一度お試しください。',
  'title.loadError':'ゲームを読み込めませんでした。通信を確認して再読み込みしてください。',
  'title.loading':'野営地を開いています…', 'title.retry':'再読み込み',
  'title.close':'閉じる', 'title.cancel':'キャンセル', 'title.save':'設定を保存',
  'title.saved':'設定を保存しました。',
  'title.resetHeading':'新しい挑戦を始めますか？',
  'title.resetBody':'世代・継承ポイント・装備・施設・解放・進行記録を最初からやり直します。解除済みのリプレイ実績と表示・音量設定は残ります。直前の挑戦は保存メニューから復元できます。',
  'title.corruptReset':'読み取れない記録から実績を復元することはできません。元のデータは別途保管します。',
  'title.resetAck':'失われる進行を確認しました',
  'title.resetConfirm':'新しい挑戦を始める',
  'title.settingsHint':'音量と表示の設定です。進行とオフライン設定は変わりません。',
  'title.settingsUnavailable':'記録の復元が必要です。つづきから開き、保存状態を確認してから設定してください。',
  'settings.sound':'効果音', 'settings.music':'音楽', 'settings.ambient':'環境音',
  'settings.effects':'演出を表示', 'settings.hiddenPause':'画面を離れたら一時停止',
  'title.achievementUnavailable':'この記録から実績を読み取れません。元の保存データは変更しません。',
  'title.return':'保存してタイトルへ',
  'title.returnFailed':'保存できなかったため、タイトルには戻りませんでした。ゲームは一時停止中です。保存メニューを確認してください。',
});
export function readUILocale(storage){try{return SUPPORTED_LOCALES.includes(storage.getItem(UI_LOCALE_KEY))?storage.getItem(UI_LOCALE_KEY):'ja';}catch{return 'ja';}}
export function writeUILocale(storage,locale){if(!SUPPORTED_LOCALES.includes(locale))throw Error('Unsupported locale');storage.setItem(UI_LOCALE_KEY,locale);}
export function titleText(key,values={},locale='ja'){
  if(!SUPPORTED_LOCALES.includes(locale))locale='ja';
  const template=ja[key];if(template===undefined)throw Error('Missing title copy: '+key);
  return template.replace(/\{(\w+)\}/g,(_,key)=>String(values[key]??'{'+key+'}'));
}
