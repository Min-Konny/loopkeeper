// Static, action-specific silhouettes. No state, timers, or gameplay values.
const basket='<path d="M78 57h60l-8 22H86Z" fill="#b28a54" stroke="#e5c793" stroke-width="3"/><path d="M88 58q0-31 40 0M82 66h53M89 74h43" fill="none" stroke="#725334" stroke-width="3"/>';
const fruit='<g fill="#eab15e" stroke="#663e29" stroke-width="2"><path d="M91 53c-15-18 9-26 15-18 14-10 28 9 10 23Z"/><circle cx="127" cy="52" r="11"/></g><path d="M105 36l3-10m-1 5q-3-13-17-10 1 13 17 10" fill="#94b578" stroke="#567355" stroke-width="2"/>';
const leaves='<g fill="#92b878" stroke="#385f48" stroke-width="2"><path d="M109 61Q76 61 73 29q31 0 36 32Z"/><path d="M108 60Q95 29 113 10q19 23-5 50Z"/><path d="M108 61q0-34 38-33-5 32-38 33Z"/></g><path d="M86 38l26 35m1-48-2 48m23-35-23 35" stroke="#d8dfac" stroke-width="3"/><path d="M100 62h20l-3 8h-15Z" fill="#d6a362"/><path d="M106 70l-8 11m15-11 10 9" stroke="#85a66d" stroke-width="4"/>';
const targets={
  gather_food: basket+fruit,
  gather_herbs: leaves,
  gather_herb_patch: '<path d="M69 73q38-15 88 0" stroke="#879866" stroke-width="5"/>'+'<g transform="translate(33 15) scale(.78)">'+leaves+'</g><g transform="translate(5 24) scale(.65)">'+leaves+'</g><g transform="translate(76 32) scale(.5)">'+leaves+'</g>',
  gather_highland_food: '<path d="M65 51 91 9l23 27 16-21 33 43Z" fill="#819796"/><path d="m91 9-10 18 13-6 10 4Zm39 6-8 12 11-3 7 4Z" fill="#dae0cc"/><g transform="translate(4 10) scale(.9)">'+basket+fruit+'</g>',
  chop_hardwood: '<path d="M106 76V30m0 16-22-16m22 17 24-20" stroke="#9a734c" stroke-width="12"/><path d="M64 32q-9-22 17-25 11-12 25 0 31-15 40 15 17 31-17 35H83q-29-2-19-25Z" fill="#7c986d" stroke="#afbd86" stroke-width="3"/>',
  chop_ancient_tree: '<path d="M77 81q20-11 17-36L78 24m17 24 12-37m-8 43 42-25M93 71l40 10m-40-10L69 78" fill="none" stroke="#9a7954" stroke-width="14" stroke-linecap="round"/><path d="M71 25q-9-19 16-19h24q20-7 28 11 27-2 22 19-4 16-30 11l-22-11-31 6Z" fill="#66795d"/><path d="M100 45q13 4 7 16" fill="none" stroke="#3b493a" stroke-width="5"/>',
};
export function actionTarget(actionId){const target=targets[actionId];return target?'<g class="work-target" data-action-art="'+actionId+'">'+target+'</g>':'';}
