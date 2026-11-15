import {encounterName} from './encounter-copy.js?v=0.6.140';
import {entityText} from './entity-copy.js?v=0.6.140';
import {text as t,getUILocale,formatNumber} from './i18n.js?v=0.6.140';
import {copySpan} from './locale-controls.js?v=0.6.140';
import {enemyTraitText} from './raid-info-ui.js?v=0.6.140';
import{enchantmentById}from './enchantments.js?v=0.6.140';
import {mountBattleParty,updateBattleParty}from './party-ui.js?v=0.6.140';
import{frameStaticPortrait}from './portrait-frame.js?v=0.6.140';
import {pixelFacilityProduct} from './pixel-product-art.js?v=0.6.140';
import {getCatalog} from './engine.js?v=0.6.140';
import{generatedEnemySource,enemyVisualKind,enemyPortraitKind}from './enemy-art.js?v=0.6.140';
import{generatedHeroSource,playerVisualKind}from './hero-art.js?v=0.6.140';
import{mountPhaserDuel}from './phaser-duel-scene.js?v=0.6.140';
import{duelSnapshot}from './duel-motion.js?v=0.6.140';
import {battleFood,potionCapacity}from './meals.js?v=0.6.140';
import {mealEffectText}from './meal-ui.js?v=0.6.140';
import {battlePressure,pressuredAttack}from './battle-pressure.js?v=0.6.140';
import {forestChiefPortrait} from './forest-chief-art.js?v=0.6.140';
import {pixelBattlePortrait} from './pixel-battle-art.js?v=0.6.140';
import { getPlayerStrike } from './engine.js?v=0.6.140';
import {routeById}from './routes.js?v=0.6.140';
import { equipmentMaterial } from './visual-design.js?v=0.6.140';
import { battleSound } from "./presentation.js?v=0.6.140";
import { getStats, getFoodHealing, getCombatPreview } from "./engine.js?v=0.6.140";
import { icon } from "./icons.js?v=0.6.140";

const views = new WeakMap();
const number = (value) =>
  formatNumber(Number(value), { maximumFractionDigits: 2 });
const ratio = (value, maximum) => Math.max(0, Math.min(1, value / maximum));

function portrait(side, symbol, sigil = "") {
  return `<div class="battle-portrait" aria-hidden="true">
    <div class="battle-breath"><div class="battle-strike" data-battle="${side}-strike"><div class="battle-recoil" data-battle="${side}-recoil"><div class="battle-avatar">${side === "player" ? '<img class="fighter-illustration pixel-fighter" data-battle="player-illustration" src="./assets/guardian.svg" alt="">' : '<img class="fighter-illustration pixel-fighter" data-battle="enemy-illustration" src="./assets/wolf.svg" alt="">'}${sigil}</div></div></div></div>
    <div class="battle-effects"><svg class="battle-shield-spark" data-battle="${side}-shield-spark" viewBox="0 0 80 90"><path d="M40 4 72 16v34Q68 72 40 85 12 72 8 50V16Z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M40 17v51M18 35h44" stroke="currentColor" stroke-width="2"/></svg><i class="battle-guard-ring" data-battle="${side}-guard-ring"></i><i class="battle-projectile" data-battle="${side}-projectile"></i><i class="battle-impact" data-battle="${side}-impact"></i><i class="battle-slash" data-battle="${side}-slash"></i><i class="battle-heal-ring" data-battle="${side}-heal-ring"></i>${Array.from({ length: 6 }, (_, index) => `<i class="battle-heal-particle" data-battle="${side}-particle-${index}"></i>`).join("")}</div>
  </div>`;
}

function createView(dialog) {
  dialog.setAttribute("aria-labelledby", "battle-title");
  dialog.innerHTML = `
    <section class="battle-scene">
      <header class="battle-heading">
        <div><span class="battle-wave" data-battle="wave"></span><h2 id="battle-title">${copySpan("battle.title")}</h2></div>
        <span class="battle-state" data-battle="state"></span><button class="button small muted" data-command="abandon-menu">${copySpan("battle.abandon")}</button>
      </header><p data-battle="magic-readout" class="magic-battle-readout" hidden></p>
      <div class="battle-field"><div class="boss-arrival" data-battle="boss-arrival" aria-hidden="true"><small>${copySpan("battle.bossArrival")}</small><strong data-battle="boss-arrival-name"></strong></div>
        <article class="battle-fighter battle-player" data-battle="player-card">
          ${portrait("player", "shield", `<span class="battle-sigil">${icon("flame")}</span>`)}
          <div class="battle-party" data-battle="party"></div><h3>${copySpan("battle.player")}</h3>
          <div class="battle-health-value"><strong data-battle="player-hp"></strong><span>/ <span data-battle="player-max"></span></span></div>
          <div class="battle-health-track" data-battle="player-health" role="progressbar" aria-label="${t("battle.playerHp")}" data-ui-aria="battle.playerHp" aria-valuemin="0"><i data-battle="player-bar"></i></div>
          <div class="battle-attributes"><span>${icon("sword")}${copySpan("battle.attack")} <b data-battle="player-attack"></b></span><span>${icon("shield")}${copySpan("battle.defense")} <b data-battle="player-defense"></b></span></div>
          <div class="battle-damage" data-battle="outgoing-formula"><span>${copySpan("battle.outgoing")}</span><strong data-battle="outgoing"></strong></div>
          <div class="battle-feedback-row" aria-hidden="true"><span class="battle-feedback" data-battle="player-damage-feedback"></span><span class="battle-feedback" data-effect="heal" data-battle="player-heal-feedback"></span></div>
        </article>
        <div class="battle-versus" aria-hidden="true">${icon("sword")}<span>VS</span></div>
        <article class="battle-fighter battle-enemy" data-battle="enemy-card">
          ${portrait("enemy", "skull")}
          <h3 data-battle="enemy-name"></h3>
          <div class="battle-health-value"><strong data-battle="enemy-hp"></strong><span>/ <span data-battle="enemy-max"></span></span></div>
          <div class="battle-health-track" data-battle="enemy-health" role="progressbar" aria-label="${t("battle.enemyHp")}" data-ui-aria="battle.enemyHp" aria-valuemin="0"><i data-battle="enemy-bar"></i></div>
          <div class="battle-attributes"><span>${icon("sword")}${copySpan("battle.attack")} <b data-battle="enemy-attack"></b></span><span>${icon("shield")}${copySpan("battle.defense")} <b data-battle="enemy-defense"></b></span></div>
          <div class="battle-damage" data-battle="incoming-formula"><span>${copySpan("battle.incoming")}</span><strong data-battle="incoming"></strong></div>
          <div class="battle-feedback-row" aria-hidden="true"><span class="battle-feedback" data-battle="enemy-damage-feedback"></span></div>
        </article>
      </div>
      <p class="battle-equipment-note" data-battle="equipment-readout"></p><p class="battle-pressure-note" data-battle="pressure-state"></p><p class="battle-meal-note" data-battle="meal-state"></p><div class="meal-buttons battle-meal-buttons"><button class="button small gold-outline" data-use-meal="fish_meal" data-battle="fish-button"></button><button class="button small gold-outline" data-use-meal="egg_meal" data-battle="egg-button"></button></div>
      <div class="battle-rhythm"><div><span>${copySpan("battle.nextRound")}</span><b data-battle="round-time"></b></div><div class="battle-round-track"><i data-battle="round-bar"></i></div></div>
      <div class="battle-facilities" aria-label="${t("battle.supportAria")}" data-ui-aria="battle.supportAria"><div class="battle-facility guardhouse" data-battle="guardhouse-sign" hidden><span class="battle-facility-art" data-battle="guardhouse-art"></span><span>${copySpan("battle.guardhouse")}<small data-battle="support-value"></small></span></div><div class="battle-facility archery" data-battle="archery-sign" hidden><span class="battle-facility-art" data-battle="archery-art"></span><span>${copySpan("battle.archery")}<small data-battle="ranged-value"></small></span></div><div class="battle-facility infirmary" data-battle="infirmary-sign" hidden><span class="battle-facility-art" data-battle="infirmary-art"></span><span>${copySpan("battle.infirmary")}<small data-battle="treatment-value"></small></span></div></div>
    </section>
    <section class="battle-supplies" aria-label="${t("battle.recoveryAria")}" data-ui-aria="battle.recoveryAria">
      <span class="battle-food-icon" data-battle="food-icon">${icon("food")}</span>
      <div class="battle-food-count"><span>${copySpan("battle.food")}</span><strong data-battle="food"></strong><small>${copySpan("battle.unit")}</small></div>
      <div class="battle-food-rule" data-battle="food-rule"></div>
    </section>
    <footer class="battle-footer">
      <div class="battle-controls">
        <button type="button" class="battle-save" data-command="save-menu" aria-label="${t("battle.save")}" data-ui-aria="battle.save" title="${t("battle.saveMenu")}" data-ui-title="battle.saveMenu">${icon("save")}</button>
        <button type="button" class="battle-pause" data-command="pause" autofocus><span data-battle="pause-icon">${icon("pause")}</span><span data-battle="play-icon">${icon("play")}</span><span data-battle="pause-label"></span></button>
      </div>
    </footer>`;
  const elements = Object.fromEntries(
    [...dialog.querySelectorAll("[data-battle]")].map((element) => [
      element.dataset.battle,
      element,
    ]),
  );
  const view = {
    dialog,
    elements,
    pause: dialog.querySelector('[data-command="pause"]'),
    previous: null,
    animations: new Map(),
    paused: false,
    suspended: false,
    motionPaused: true,
    listening: false,
    document: dialog.ownerDocument,
    reducedMotion: dialog.ownerDocument.defaultView?.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ),
  };
  view.onVisibility = () => syncMotion(view);
  view.onReducedMotion = () => syncMotion(view);
  view.onClose = () => suspendBattle(dialog);
  mountBattleParty(dialog.querySelector('[data-battle="party"]'));
  view.duel=mountPhaserDuel(dialog.querySelector('.battle-field'));
  views.set(dialog, view);
  return view;
}

function setText(element, value) {
  const text = String(value);
  if (element.textContent !== text) element.textContent = text;
}

function updateHealth(elements, side, hp, maxHp) {
  setText(elements[`${side}-hp`], number(hp));
  setText(elements[`${side}-max`], number(maxHp));
  elements[`${side}-bar`].style.transform = `scaleX(${ratio(hp, maxHp)})`;
  elements[`${side}-health`].setAttribute("aria-valuenow", hp);
  elements[`${side}-health`].setAttribute("aria-valuemax", maxHp);
  elements[`${side}-card`].classList.toggle(
    "battle-critical",
    ratio(hp, maxHp) <= 0.3,
  );
}

function clearFeedback(view) {
  for (const name of [
    "player-damage-feedback",
    "player-heal-feedback",
    "enemy-damage-feedback",
  ])
    setText(view.elements[name], "");
}

function cancelAnimations(view) {
  for (const animation of view.animations.values()) animation.cancel();
  view.animations.clear();
}

function listenForMotionChanges(view) {
  if (view.listening) return;
  view.document.addEventListener("visibilitychange", view.onVisibility);
  view.reducedMotion?.addEventListener("change", view.onReducedMotion);
  view.dialog.addEventListener("close", view.onClose);
  view.listening = true;
}

function syncMotion(view) {
  const reduced =
    Boolean(view.reducedMotion?.matches) || view.effectsEnabled === false;
  view.motionPaused =
    view.paused ||
    view.suspended ||
    view.document.hidden ||
    !view.dialog.open ||
    reduced;
  view.dialog.classList.toggle("battle-motion-paused", view.motionPaused);
  view.dialog.classList.toggle("battle-reduced-motion", reduced);
  if (reduced) cancelAnimations(view);
  for (const animation of view.animations.values()) {
    if (view.motionPaused) animation.pause();
    else if (animation.playState === "paused") animation.play();
  }
}

/** Clear transient effects and document listeners when the caller closes the dialog. */
export function suspendBattle(dialog) {
  const view = views.get(dialog);
  if (!view) return;
  view.duel?.suspend();
  view.suspended = true;
  view.previous = null;
  cancelAnimations(view);
  clearFeedback(view);
  if (view.listening) {
    view.document.removeEventListener("visibilitychange", view.onVisibility);
    view.reducedMotion?.removeEventListener("change", view.onReducedMotion);
    view.dialog.removeEventListener("close", view.onClose);
    view.listening = false;
  }
  syncMotion(view);
}

function animate(view, name, frames, duration = 400, delay = 0) {
  if(view.duel?.ready&&/^(player|enemy)-(strike|recoil|impact|slash|projectile|guard-ring|shield-spark|particle|heal-ring)/.test(name))return;
  const element = view.elements[name];
  if (view.motionPaused || typeof element?.animate !== "function") return;
  view.animations.get(name)?.cancel();
  const animation = element.animate(frames, {
    duration,
    delay,
    easing: "cubic-bezier(.2,.65,.25,1)",
  });
  view.animations.set(name, animation);
  animation.onfinish = () => {
    if (view.animations.get(name) === animation) view.animations.delete(name);
  };
}

function feedback(view, side, effect, text) {
  const name = `${side}-${effect}-feedback`;
  setText(view.elements[name], text);
  animate(
    view,
    name,
    [
      { opacity: 0, transform: "translateY(9px) scale(.93)" },
      { opacity: 1, transform: "translateY(0) scale(1)", offset: 0.18 },
      { opacity: 1, transform: "translateY(-5px)", offset: 0.7 },
      { opacity: 0, transform: "translateY(-14px)" },
    ],
    950,
  );
}

function strike(view, attacker, target) {
  const direction = attacker === "player" ? 1 : -1;
  animate(
    view,
    `${attacker}-strike`,
    [
      { transform: "translateX(0) rotate(0)" },
      {
        transform: `translateX(${-direction * 5}px) rotate(${-direction * 4}deg)`,
        offset: 0.2,
      },
      {
        transform: `translateX(${direction * 19}px) rotate(${direction * 5}deg)`,
        offset: 0.42,
      },
      { transform: "translateX(0) rotate(0)" },
    ],
    520,
  );
  animate(
    view,
    `${target}-recoil`,
    [
      { transform: "translateX(0)" },
      {
        transform: `translateX(${direction * 7}px) rotate(${direction * 3}deg)`,
        offset: 0.2,
      },
      { transform: `translateX(${-direction * 3}px)`, offset: 0.5 },
      { transform: "translateX(0)" },
    ],
    360,
    100,
  );
  animate(
    view,
    `${target}-impact`,
    [
      { opacity: 0, transform: "scale(.8)" },
      { opacity: 0.9, transform: "scale(1)", offset: 0.15 },
      { opacity: 0, transform: "scale(1.32)" },
    ],
    520,
    95,
  );
  const angle = direction * -38;
  animate(
    view,
    `${target}-slash`,
    [
      {
        opacity: 0,
        transform: `translate(-50%,-50%) rotate(${angle}deg) scaleX(.05)`,
      },
      {
        opacity: 1,
        transform: `translate(-50%,-50%) rotate(${angle}deg) scaleX(1)`,
        offset: 0.22,
      },
      {
        opacity: 0,
        transform: `translate(-50%,-50%) rotate(${angle - direction * 12}deg) scaleX(1.15)`,
      },
    ],
    380,
    100,
  );
}

function guard(view, hasShield) {
  if (hasShield) animate(view,'player-shield-spark',[{opacity:0,transform:'translate(-50%,-50%) scale(.7)'},{opacity:.9,transform:'translate(-50%,-50%) scale(1)',offset:.3},{opacity:0,transform:'translate(-50%,-50%) scale(1.16)'}],550,150);
  animate(view, 'player-guard-ring', [
    {opacity:0,transform:'scale(.85)'},
    {opacity:.85,transform:'scale(1)',offset:.25},
    {opacity:0,transform:'scale(1.12)'},
  ], 550, 160);
}
function supportShot(view, source = "guardhouse-sign") {
  animate(view, source, [{filter:'brightness(1)'},{filter:'brightness(1.7)',offset:.3},{filter:'brightness(1)'}], 550);
  animate(view, 'enemy-projectile', [
    {opacity:0,transform:'translateX(-110px)'},
    {opacity:1,transform:'translateX(-45px)',offset:.3},
    {opacity:0,transform:'translateX(20px)'},
  ], 450);
}
function heal(view) {
  animate(
    view,
    "player-heal-ring",
    [
      { opacity: 0, transform: "scale(.75)" },
      { opacity: 0.85, transform: "scale(1)", offset: 0.2 },
      { opacity: 0, transform: "scale(1.35)" },
    ],
    750,
    110,
  );
  for (let index = 0; index < 6; index += 1) {
    const x = (index - 2.5) * 17;
    animate(
      view,
      `player-particle-${index}`,
      [
        { opacity: 0, transform: `translate(${x}px,28px) scale(.5)` },
        {
          opacity: 1,
          transform: `translate(${x * 1.12}px,0) scale(1)`,
          offset: 0.25,
        },
        {
          opacity: 0,
          transform: `translate(${x * 0.65}px,${-58 - index * 5}px) scale(.35)`,
        },
      ],
      740,
      100 + index * 45,
    );
  }
  animate(
    view,
    "food-icon",
    [
      { opacity: 0.35, filter: "brightness(1.8)" },
      { opacity: 1, filter: "brightness(1)" },
    ],
    650,
  );
}

/** Update an existing combat dialog without replacing focused controls. The caller owns showModal/close. */
export function renderBattle(dialog, state) {
  if (!dialog) return;
  if (state.run.status !== "combat" || !state.run.enemy) {
    suspendBattle(dialog);
    return;
  }
  const view = views.get(dialog) || createView(dialog);
  const el = view.elements;
  const { run, settings } = state;
  const enemy = run.enemy;
  const stats = getStats(state);
  const weaponMaterial = equipmentMaterial(run.equipment.weapon);
  const shieldMaterial = equipmentMaterial(run.equipment.shield);
  dialog.style.setProperty('--weapon-glow',weaponMaterial.glow);
  dialog.style.setProperty('--shield-glow',shieldMaterial.glow);
  const paused = settings.paused;
  const playerStrike = getPlayerStrike(state);
  const outgoing = playerStrike.damage;

  const key = `${state.meta.generation}:${enemy.wave}:${enemy.name}:${enemy.maxHp}`;
  const previous = view.previous;
  const continuing =
    previous?.state === state &&
    previous.key === key &&
    previous.elapsed <= run.elapsed;

  if (!continuing) {
    cancelAnimations(view);
    clearFeedback(view);
    view.arrivalPending = enemy.isBoss;
  }
  dialog.dataset.chapter = String(Math.min(7,Math.ceil(enemy.wave / 3)));
  view.effectsEnabled = state.settings.effectsEnabled;
  view.paused = paused;
  view.suspended = false;
  listenForMotionChanges(view);
  syncMotion(view);
  dialog.classList.toggle("battle-is-paused", paused);
  updateBattleParty(el.party,state,!paused&&state.settings.effectsEnabled!==false);
  dialog.classList.toggle("battle-is-boss",!!enemy.isBoss);
  setText(el['boss-arrival-name'],encounterName(state,enemy));
  if (view.arrivalPending && !view.motionPaused) {
    view.arrivalPending=false;
    animate(view,'boss-arrival',[{opacity:0,transform:'translateY(14px) scale(.92)'},{opacity:1,transform:'translateY(0) scale(1)',offset:.2},{opacity:1,transform:'translateY(0) scale(1)',offset:.65},{opacity:0,transform:'translateY(-12px) scale(1.03)'}],1600);
    animate(view,'enemy-card',[{filter:'brightness(.6)',transform:'translateX(18px)'},{filter:'brightness(1.35)',offset:.4},{filter:'brightness(1)',transform:'translateX(0)'}],1000);
  }
  setText(
    el.wave,
    run.routes?.active ? t('battle.routeWave',{wave:run.wave}) : t('battle.wave',{wave:enemy.wave})+(enemy.isBoss?' · BOSS':'')+(enemy.invasion?' · '+t('battle.army'):''),
  );
  setText(el.state, paused ? t("battle.paused") : t("battle.auto"));
  setText(
    el["enemy-name"],
    encounterName(state,enemy) + (enemy.trait || enemy.pressure ? " · " + (getUILocale()==='ja'?getCombatPreview(state).trait:enemyTraitText(enemy)) : ""),
  );
  const portraitId = enemyPortraitKind(enemy);
  const regionArt=routeById(run.routes?.active?.id)?.image;
  const forestChief = enemy.id === "forest_chief" && enemy.isBoss && !run.routes?.active;
  const fallbackSrc = forestChief
    ? forestChiefPortrait()
    : pixelBattlePortrait(regionArt ? regionArt.split("/").pop().replace(".svg", "") : portraitId);
  const playerFallback=pixelBattlePortrait('player',run.equipment);
  view.failedPlayerArt??=new Set();
  const hero=generatedHeroSource(run.equipment),heroArt=hero&&!view.failedPlayerArt.has(hero)?hero:null;
  const playerSrc=heroArt||playerFallback;
  const generated=generatedEnemySource(portraitId,{regional:!!run.routes?.active,forestChief,routeId:run.routes?.active?.id,enemyId:enemy.id,isBoss:!!enemy.isBoss});
  view.failedEnemyArt??=new Set();
  const artSource=generated&&!view.failedEnemyArt.has(generated)?generated:null;
  const portraitSrc=artSource||fallbackSrc;
  view.duel.update(duelSnapshot(state,key,playerSrc,portraitSrc,!!artSource,forestChief?'wolf':enemyVisualKind(portraitId,run.routes?.active?.id,!run.routes?.active&&enemy.isBoss?enemy.id:null),!!heroArt,playerVisualKind(run.equipment)));
  const image=el['enemy-illustration'];
  image.classList.toggle('generated-enemy',!!artSource);
  image.onerror=()=>{if(artSource&&image.getAttribute('src')===artSource){view.failedEnemyArt.add(artSource);image.classList.remove('generated-enemy');image.setAttribute('src',fallbackSrc);frameStaticPortrait(image,false);view.duel.suspend();}};
  const equipmentText=['weapon','armor','shield'].map(slot=>{const item=run.equipment[slot],d=item&&getCatalog(state).RECIPES.find(r=>r.id===item.id);return t('battle.equipment',{slot:t('battle.slot.'+slot),name:item?(d?entityText('recipe',d):item.id):t('battle.none')});}).join(' / ');
  setText(el['equipment-readout'],equipmentText);
  const playerImage=el['player-illustration'];
  playerImage.setAttribute('title',equipmentText);
  playerImage.classList.toggle('generated-hero',!!heroArt);
  playerImage.onerror=()=>{if(heroArt&&playerImage.getAttribute('src')===heroArt){view.failedPlayerArt.add(heroArt);playerImage.classList.remove('generated-hero');playerImage.setAttribute('src',playerFallback);frameStaticPortrait(playerImage,false);view.duel.suspend();}};
  if(el["player-illustration"].getAttribute("src")!==playerSrc)el["player-illustration"].setAttribute("src",playerSrc);
  if (el["enemy-illustration"].getAttribute("src") !== portraitSrc)
    el["enemy-illustration"].setAttribute("src", portraitSrc);
  frameStaticPortrait(playerImage,!!heroArt);frameStaticPortrait(image,!!artSource);

  updateHealth(el, "player", run.hp, stats.maxHp);
  updateHealth(el, "enemy", enemy.hp, enemy.maxHp);
  setText(el["player-attack"], number(stats.attack));
  setText(el["player-defense"], number(stats.defense));
  setText(el["enemy-attack"], number(pressuredAttack(state,enemy)));
  const pressure=battlePressure(state);el['pressure-state'].hidden=!pressure.active;setText(el['pressure-state'],pressure.graceRemaining>0?t('battle.grace',{seconds:Math.ceil(pressure.graceRemaining)}):t('battle.growth',{multiplier:pressure.multiplier.toFixed(2),slow:pressure.slow?t('battle.slow'):''}));
  setText(el['meal-state'],mealEffectText(state)+(run.enchantment?.active?t('battle.enchantment',{name:entityText('resource',run.enchantment.active.id)}):''));for(const [id,key]of [['fish_meal','fish-button'],['egg_meal','egg-button']]){setText(el[key],t('battle.eat',{name:entityText('resource',id),count:run.resources[id]||0}));el[key].disabled=!(run.resources[id]>0);}
  setText(el["enemy-defense"], number(enemy.defense));
  setText(
    el.outgoing,
    number(outgoing) +
      (stats.support
        ? t('battle.extraSupport',{damage:number(Math.max(1, stats.support * (enemy.trait === 'flying' ? .5 : 1) - enemy.defense))})
        : ""),
  );
  const preview = getCombatPreview(state);
  if(el['magic-readout']){const m=run.magicState,visible=state.version===2&&m&&(state.meta.bestWave>=6||run.resources.spark_catalyst||run.resources.ward_essence);el['magic-readout'].hidden=!visible;if(visible)setText(el['magic-readout'],t('battle.magic',{mana:Math.floor(m.mana),casts:m.casts,detonations:m.detonations,catalysts:run.resources.spark_catalyst||0,wards:run.resources.ward_essence||0}));}
  for(const [key,id]of [['guardhouse','guardhouse'],['archery','archery_tower'],['infirmary','infirmary']]){const art=el[key+'-art'],level=run.facilities[id]||0;if(art&&art.getAttribute('data-level')!==String(level)){art.setAttribute('data-level',String(level));art.innerHTML=level?pixelFacilityProduct({facilityId:id,level}):'';}}
  el['guardhouse-sign'].hidden = stats.support <= 0;
  el['archery-sign'].hidden = (stats.ranged || 0) <= 0;
  setText(el['ranged-value'],number((stats.ranged||0)*(enemy.trait==='flying'?2.5:1))+(enemy.trait==='flying'?t('battle.antiAir'):''));
  el['infirmary-sign'].hidden = !state.run.facilities.infirmary;
  setText(el['support-value'],t('battle.supportValue',{value:number(stats.support)}));
  setText(el['treatment-value'],t('battle.treatments',{count:preview.charges}));
  setText(el.incoming, number(preview.packet));
  el["outgoing-formula"].title=t('battle.outgoingFormula',{attack:number(playerStrike.attack),armor:number(playerStrike.armor)});
  el["incoming-formula"].title=t('battle.incomingFormula',{trait:(getUILocale()==='ja'?getCombatPreview(state).trait:enemyTraitText(enemy)),hits:preview.hits.map(number).join(' + ')});
  const remaining = Math.max(0, 1.5 - run.combatTimer);
  setText(el["round-time"], t('battle.seconds',{seconds:remaining.toFixed(1)}));
  el["round-bar"].style.transform = `scaleX(${ratio(run.combatTimer, 1.5)})`;
  setText(el.food.previousElementSibling,state.version===2?t('battle.potions'):t('battle.food'));
  setText(el.food,state.version===2?`${battleFood(state)} / ${potionCapacity(state)}`:number(state.run.resources.food));
  setText(
    el["food-rule"],
    (state.version===2?battleFood(state):state.run.resources.food) > 0
      ? state.version===2&&preview.charges>0 ? t('battle.recoveryFirst',{healing:getFoodHealing(state)}) : t('battle.recoveryPotion',{healing:getFoodHealing(state)})
      : state.version===2&&preview.charges>0 ? t('battle.recoveryTreatment',{count:preview.charges}) : t('battle.recoveryEmpty'),
  );
  el["food-rule"].classList.toggle(
    "battle-food-empty",
    (state.version===2?battleFood(state):state.run.resources.food) === 0,
  );
  el["pause-icon"].hidden = paused;
  el["play-icon"].hidden = !paused;
  setText(el["pause-label"], paused ? t("battle.resume") : t("battle.pause"));
  view.pause.setAttribute(
    "aria-label",
    paused ? t("battle.resume") : t("battle.pauseAria"),
  );

  if (
    continuing &&
    run.elapsed > previous.elapsed &&
    !paused &&
    !view.document.hidden
  ) {
    const enemyLoss = previous.enemyHp - enemy.hp;
    const hpChange = run.hp - previous.hp;
    const foodUsed = previous.food - (state.version===2?battleFood(state):state.run.resources.food);
    const treatmentUsed = Math.max(0, (previous.charges ?? preview.charges) - preview.charges);
    if (enemyLoss > 0 || hpChange !== 0 || foodUsed > 0 || treatmentUsed > 0) {
      clearFeedback(view);
      if (enemyLoss > 0) {
        strike(view, "player", "enemy");
        if (stats.support > 0) supportShot(view);
        if (stats.ranged > 0) supportShot(view, "archery-sign");
        battleSound("hit");
        feedback(view, "enemy", "damage", `−${number(enemyLoss)} HP`);
      }
      // An enemy still present after a combat exchange has retaliated, even when food offsets its damage.
      if (enemyLoss > 0 || hpChange < 0) {
        strike(view, "enemy", "player");
        if (stats.defense > 0) guard(view,!!run.equipment.shield);
      }
      if (hpChange < 0)
        feedback(view, "player", "damage", `−${number(-hpChange)} HP`);
      if (hpChange > 0)
        feedback(view, "player", "heal", `＋${number(hpChange)} HP`);
      if (foodUsed > 0) {
        heal(view);
        battleSound("heal");
        if (hpChange <= 0)
          feedback(view, "player", "heal", t('battle.potionUsed',{count:number(foodUsed)}));
      }
      if (treatmentUsed > 0) {
        heal(view);
        animate(view,'infirmary-sign',[{boxShadow:'0 0 0 transparent',filter:'brightness(1)'},{boxShadow:'0 0 24px #9de4c5',filter:'brightness(1.6)',offset:.3},{boxShadow:'0 0 0 transparent',filter:'brightness(1)'}],800);
        feedback(view,'player','heal',t('battle.treatmentUsed'));
        battleSound('heal');
      }
    }
  }
  view.previous = {
    state,
    key,
    elapsed: run.elapsed,
    hp: run.hp,
    enemyHp: enemy.hp,
    food: (state.version===2?battleFood(state):state.run.resources.food),
    charges: preview.charges,
  };
}
