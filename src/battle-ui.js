import { equipmentMaterial } from './visual-design.js?v=0.3.9';
import { battleSound } from "./presentation.js?v=0.3.9";
import { getStats, getFoodHealing, getCombatPreview } from "./engine.js?v=0.3.9";
import { icon } from "./icons.js?v=0.3.9";

const views = new WeakMap();
const number = (value) =>
  Number(value).toLocaleString("ja-JP", { maximumFractionDigits: 2 });
const ratio = (value, maximum) => Math.max(0, Math.min(1, value / maximum));

function portrait(side, symbol, sigil = "") {
  return `<div class="battle-portrait" aria-hidden="true">
    <div class="battle-breath"><div class="battle-strike" data-battle="${side}-strike"><div class="battle-recoil" data-battle="${side}-recoil"><div class="battle-avatar">${side === "player" ? '<img class="fighter-illustration" src="./assets/guardian.svg" alt="">' : '<img class="fighter-illustration" data-battle="enemy-illustration" src="./assets/wolf.svg" alt="">'}${sigil}</div></div></div></div>
    <div class="battle-effects"><svg class="battle-shield-spark" data-battle="${side}-shield-spark" viewBox="0 0 80 90"><path d="M40 4 72 16v34Q68 72 40 85 12 72 8 50V16Z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M40 17v51M18 35h44" stroke="currentColor" stroke-width="2"/></svg><i class="battle-guard-ring" data-battle="${side}-guard-ring"></i><i class="battle-projectile" data-battle="${side}-projectile"></i><i class="battle-impact" data-battle="${side}-impact"></i><i class="battle-slash" data-battle="${side}-slash"></i><i class="battle-heal-ring" data-battle="${side}-heal-ring"></i>${Array.from({ length: 6 }, (_, index) => `<i class="battle-heal-particle" data-battle="${side}-particle-${index}"></i>`).join("")}</div>
  </div>`;
}

function createView(dialog) {
  dialog.setAttribute("aria-labelledby", "battle-title");
  dialog.innerHTML = `
    <section class="battle-scene">
      <header class="battle-heading">
        <div><span class="battle-wave" data-battle="wave"></span><h2 id="battle-title">野営地を防衛中</h2></div>
        <span class="battle-state" data-battle="state"></span>
      </header>
      <div class="battle-field"><div class="boss-arrival" data-battle="boss-arrival" aria-hidden="true"><small>強敵襲来</small><strong data-battle="boss-arrival-name"></strong></div>
        <article class="battle-fighter battle-player" data-battle="player-card">
          ${portrait("player", "shield", `<span class="battle-sigil">${icon("flame")}</span>`)}
          <h3>灯守</h3>
          <div class="battle-health-value"><strong data-battle="player-hp"></strong><span>/ <span data-battle="player-max"></span></span></div>
          <div class="battle-health-track" data-battle="player-health" role="progressbar" aria-label="灯守の体力" aria-valuemin="0"><i data-battle="player-bar"></i></div>
          <div class="battle-attributes"><span>${icon("sword")}攻撃 <b data-battle="player-attack"></b></span><span>${icon("shield")}防御 <b data-battle="player-defense"></b></span></div>
          <div class="battle-damage" data-battle="outgoing-formula"><span>与える一撃</span><strong data-battle="outgoing"></strong></div>
          <div class="battle-feedback-row" aria-hidden="true"><span class="battle-feedback" data-battle="player-damage-feedback"></span><span class="battle-feedback" data-effect="heal" data-battle="player-heal-feedback"></span></div>
        </article>
        <div class="battle-versus" aria-hidden="true">${icon("sword")}<span>VS</span></div>
        <article class="battle-fighter battle-enemy" data-battle="enemy-card">
          ${portrait("enemy", "skull")}
          <h3 data-battle="enemy-name"></h3>
          <div class="battle-health-value"><strong data-battle="enemy-hp"></strong><span>/ <span data-battle="enemy-max"></span></span></div>
          <div class="battle-health-track" data-battle="enemy-health" role="progressbar" aria-label="敵の体力" aria-valuemin="0"><i data-battle="enemy-bar"></i></div>
          <div class="battle-attributes"><span>${icon("sword")}攻撃 <b data-battle="enemy-attack"></b></span><span>${icon("shield")}防御 <b data-battle="enemy-defense"></b></span></div>
          <div class="battle-damage" data-battle="incoming-formula"><span>次の被害</span><strong data-battle="incoming"></strong></div>
          <div class="battle-feedback-row" aria-hidden="true"><span class="battle-feedback" data-battle="enemy-damage-feedback"></span></div>
        </article>
      </div>
      <div class="battle-rhythm"><div><span>次の攻防</span><b data-battle="round-time"></b></div><div class="battle-round-track"><i data-battle="round-bar"></i></div></div>
      <div class="battle-facilities" aria-label="村の戦闘支援"><div class="battle-facility guardhouse" data-battle="guardhouse-sign" hidden><svg viewBox="0 0 60 48" aria-hidden="true"><path d="M12 43V12H18V7H26V12H34V7H42V12H48V43Z" fill="#69816a"/><path d="M24 43V26Q30 17 36 26V43" fill="#22382e"/><path d="M10 14H50M9 43H51" stroke="#c2c790" stroke-width="3"/><path d="M17 22H23M37 22H43" stroke="#e8d99b" stroke-width="4"/></svg><span>衛兵詰所<small data-battle="support-value"></small></span></div><div class="battle-facility archery" data-battle="archery-sign" hidden><svg viewBox="0 0 60 48" aria-hidden="true"><path d="M14 43V18h32v25Z" fill="#7f9275"/><path d="M8 19 30 4 52 19Z" fill="#5b8275"/><path d="M21 23q20 7 0 17V23m0 8h27m-5-5 5 5-5 5" fill="none" stroke="#e1c483" stroke-width="2"/></svg><span>弓塔<small data-battle="ranged-value"></small></span></div><div class="battle-facility infirmary" data-battle="infirmary-sign" hidden><svg viewBox="0 0 60 48" aria-hidden="true"><path d="M12 23H48V43H12Z" fill="#819d86"/><path d="M6 24 30 5 54 24Z" fill="#567e76"/><path d="M26 24H34V29H39V37H34V42H26V37H21V29H26Z" fill="#e1dfbd"/></svg><span>救護所<small data-battle="treatment-value"></small></span></div></div>
    </section>
    <section class="battle-supplies" aria-label="戦闘中の回復">
      <span class="battle-food-icon" data-battle="food-icon">${icon("food")}</span>
      <div class="battle-food-count"><span>食料</span><strong data-battle="food"></strong><small>個</small></div>
      <div class="battle-food-rule" data-battle="food-rule"></div>
    </section>
    <footer class="battle-footer">
      <div class="battle-controls">
        <button type="button" class="battle-save" data-command="save-menu" aria-label="戦闘を保存" title="保存メニュー">${icon("save")}</button>
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
  const outgoing = Math.max(1, stats.attack - enemy.defense);

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
  dialog.dataset.chapter = String(Math.ceil(enemy.wave / 3));
  view.effectsEnabled = state.settings.effectsEnabled;
  view.paused = paused;
  view.suspended = false;
  listenForMotionChanges(view);
  syncMotion(view);
  dialog.classList.toggle("battle-is-paused", paused);
  dialog.classList.toggle("battle-is-boss",!!enemy.isBoss);
  setText(el['boss-arrival-name'],enemy.name);
  if (view.arrivalPending && !view.motionPaused) {
    view.arrivalPending=false;
    animate(view,'boss-arrival',[{opacity:0,transform:'translateY(14px) scale(.92)'},{opacity:1,transform:'translateY(0) scale(1)',offset:.2},{opacity:1,transform:'translateY(0) scale(1)',offset:.65},{opacity:0,transform:'translateY(-12px) scale(1.03)'}],1600);
    animate(view,'enemy-card',[{filter:'brightness(.6)',transform:'translateX(18px)'},{filter:'brightness(1.35)',offset:.4},{filter:'brightness(1)',transform:'translateX(0)'}],1000);
  }
  setText(
    el.wave,
    `第 ${enemy.wave} 波${enemy.isBoss ? " · BOSS" : ""}${enemy.invasion ? " · 国家軍が加勢" : ""}`,
  );
  setText(el.state, paused ? "時間停止中" : "自動戦闘");
  setText(
    el["enemy-name"],
    enemy.name + (enemy.trait ? " · " + getCombatPreview(state).trait : ""),
  );
  const portraitId = enemy.trait === "flying" ? "winged" : enemy.isBoss
    ? "boss"
    : ["wolf", "raider", "boss", "knight", "giant"][
        Math.min(enemy.wave - 1, 4)
      ];
  const portraitSrc = `./assets/${portraitId}.svg`;
  if (el["enemy-illustration"].getAttribute("src") !== portraitSrc)
    el["enemy-illustration"].setAttribute("src", portraitSrc);

  updateHealth(el, "player", run.hp, stats.maxHp);
  updateHealth(el, "enemy", enemy.hp, enemy.maxHp);
  setText(el["player-attack"], number(stats.attack));
  setText(el["player-defense"], number(stats.defense));
  setText(el["enemy-attack"], number(enemy.attack));
  setText(el["enemy-defense"], number(enemy.defense));
  setText(
    el.outgoing,
    number(outgoing) +
      (stats.support
        ? ` +${number(Math.max(1, stats.support - enemy.defense))} 支援`
        : ""),
  );
  const preview = getCombatPreview(state);
  el['guardhouse-sign'].hidden = stats.support <= 0;
  el['archery-sign'].hidden = (stats.ranged || 0) <= 0;
  setText(el['ranged-value'], `${number((stats.ranged || 0)*(enemy.trait==='flying'?2.5:1))}${enemy.trait==='flying'?' · 対空':''}`);
  el['infirmary-sign'].hidden = !state.run.facilities.infirmary;
  setText(el['support-value'], `支援 ${number(stats.support)}`);
  setText(el['treatment-value'], `処置 残り${preview.charges}回`);
  setText(el.incoming, number(preview.packet));
  el["outgoing-formula"].title =
    `攻撃 ${number(stats.attack)} − 敵の防御 ${number(enemy.defense)}（最低1ダメージ）`;
  el["incoming-formula"].title =
    `${preview.trait}：${preview.hits.map(number).join(" + ")}（各攻撃から防御を減算、最低1）`;
  const remaining = Math.max(0, 1.5 - run.combatTimer);
  setText(el["round-time"], `${remaining.toFixed(1)} 秒`);
  el["round-bar"].style.transform = `scaleX(${ratio(run.combatTimer, 1.5)})`;
  setText(el.food, number(run.resources.food));
  setText(
    el["food-rule"],
    run.resources.food > 0
      ? `低HP・致死予測で1食 · ${getFoodHealing(state)}回復${state.version === 2 ? " · 救護 " + getCombatPreview(state).charges + "回" : ""}`
      : "食料なし · 自動回復できません",
  );
  el["food-rule"].classList.toggle(
    "battle-food-empty",
    run.resources.food === 0,
  );
  el["pause-icon"].hidden = paused;
  el["play-icon"].hidden = !paused;
  setText(el["pause-label"], paused ? "戦闘を再開" : "一時停止");
  view.pause.setAttribute(
    "aria-label",
    paused ? "戦闘を再開" : "戦闘を一時停止",
  );

  if (
    continuing &&
    run.elapsed > previous.elapsed &&
    !paused &&
    !view.document.hidden
  ) {
    const enemyLoss = previous.enemyHp - enemy.hp;
    const hpChange = run.hp - previous.hp;
    const foodUsed = previous.food - run.resources.food;
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
          feedback(view, "player", "heal", `食料 −${number(foodUsed)}`);
      }
      if (treatmentUsed > 0) {
        heal(view);
        animate(view,'infirmary-sign',[{boxShadow:'0 0 0 transparent',filter:'brightness(1)'},{boxShadow:'0 0 24px #9de4c5',filter:'brightness(1.6)',offset:.3},{boxShadow:'0 0 0 transparent',filter:'brightness(1)'}],800);
        feedback(view,'player','heal','救護所の処置');
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
    food: run.resources.food,
    charges: preview.charges,
  };
}
