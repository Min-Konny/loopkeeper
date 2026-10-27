import {questReward} from './quest-rewards.js?v=0.6.94';
export const PROGRESSION_QUESTS=[
 {id:'frontier_wave_12',name:'最初の関門を越える',description:'通常の襲撃を12波まで突破する。',kind:'wave',target:12,stage:'中盤の整備',tab:'gather'},
 {id:'specialist_stage_2',name:'得意な仕事を育てる',description:'専門施設のいずれかをIIへ増築する。',kind:'specialist',target:2,stage:'中盤の整備',tab:'village'},
 {id:'outposts_3',name:'開拓の足場を築く',description:'異なる3地域で拠点の守護者を倒す。',kind:'outposts',target:3,stage:'中盤の整備',tab:'trade'},
 {id:'frontier_wave_24',name:'後半の前線へ',description:'通常の襲撃を24波まで突破する。',kind:'wave',target:24,stage:'後半の開拓',tab:'gather'},
 {id:'outposts_8',name:'広がる開拓網',description:'異なる8地域で拠点の守護者を倒す。',kind:'outposts',target:8,stage:'後半の開拓',tab:'trade'},
 {id:'first_accessory',name:'次の命に道具を残す',description:'アクセサリーを初めて永久解放する。装備セットから使う。',kind:'accessories',target:1,stage:'中盤の整備',tab:'craft'},
 {id:'accessories_3',name:'周回の選択肢を広げる',description:'異なるアクセサリーを3種類永久解放する。再製作は不要。',kind:'accessories',target:3,stage:'後半の開拓',tab:'craft'},
].map(q=>({...q,reward:questReward(q.id),trigger:{event:'profile_progress'},once:'save_profile_history',claim:'automatic',persistentAcrossRespec:true}));
export const QUEST_ORDER=['first_weapon','first_meal','first_tower','first_iron_smelting','first_iron_equipment','first_queue_completion','first_worker_purchase','first_accessory','first_steel_equipment','first_facility_level_2','first_diplomacy_resolution','first_synergy','frontier_wave_12','specialist_stage_2','outposts_3','first_silver_equipment','first_mithril_equipment','accessories_3','frontier_wave_24','outposts_8','first_diamond_equipment','first_orichalcum_equipment'];
export const questStage=q=>q.stage||(QUEST_ORDER.indexOf(q.id)<7?'序盤の備え':['first_mithril_equipment','first_diamond_equipment'].includes(q.id)?'後半の開拓':q.id==='first_orichalcum_equipment'?'最終素材への到達':'中盤の整備');
