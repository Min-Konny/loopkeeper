// Read-only admission checks. Never import or execute code from the PR head.
function inspect({repository, ref, actorPermission, pr, expectedHead, files, tree}) {
 const errors=[];
 if(ref!=='refs/heads/main') errors.push('Run trusted workflow from main only');
 if(!['admin','maintain','write'].includes(actorPermission)) errors.push('Current actor lacks write permission');
 if(!/^[0-9a-f]{40}$/.test(expectedHead||'') || pr?.head?.sha!==expectedHead) errors.push('PR head differs from explicit SHA');
 if(pr?.state!=='open'||pr?.base?.ref!=='main'||pr?.base?.repo?.full_name!==repository||pr?.head?.repo?.full_name!==repository) errors.push('Only open same-repository PRs targeting main');
 if(!Array.isArray(files)||!files.length||files.length>300||files.length!==pr?.changed_files) errors.push('Incomplete changed-file list');
 if(!tree||tree.truncated||!Array.isArray(tree.tree)) errors.push('Incomplete head tree');
 const allowed=p=>typeof p==='string'&&/^(src|tests|docs)\/[A-Za-z0-9_./-]+$/.test(p)&&!p.split('/').some(x=>!x||x==='.'||x==='..'||x.startsWith('.'));
 const entries=new Map((tree?.tree||[]).map(e=>[e.path,e]));
 for(const f of files||[]) {
  if(!allowed(f.filename)||(f.previous_filename&&!allowed(f.previous_filename))) errors.push('Path outside allowlist');
  if(!['added','modified','removed','renamed'].includes(f.status)) errors.push('Unsupported change type');
  if(typeof f.patch!=='string') errors.push('Binary, oversized or unavailable patch');
  if(f.status!=='removed') {const e=entries.get(f.filename);if(e?.type!=='blob'||e.mode!=='100644') errors.push('Only ordinary non-executable files');}
 }
 return {admitted:errors.length===0,errors:[...new Set(errors)],head:expectedHead};
}
module.exports={inspect};
