/* Meu Chat — 38-codigos.js · 🧪 MEUS CÓDIGOS (17/11)
   Igual ao playground do jurídico original: cada código que a IA fizer tem o botão 💾 Guardar.
   Ficam aqui, com nome, e vão para a nuvem (com o login, aparecem em qualquer aparelho).
   Abrir = abre no ▶ playground (ver funcionando e mexer). Nada some sem você confirmar. */
(function (MC) {
  'use strict';
  const E = MC.esc;
  const EXT = { html: 'html', htm: 'html', tsx: 'tsx', jsx: 'jsx', js: 'js', javascript: 'js', ts: 'ts', css: 'css', python: 'py', py: 'py', json: 'json', md: 'md', sh: 'sh', bash: 'sh', sql: 'sql' };
  const todos = async () => (await MC.banco.kv('codigos', {})) || {};
  async function gravar(m, id) { await MC.banco.kvSet('codigos', m); if (MC.nuvem && MC.nuvem.marcar) MC.nuvem.marcar('codigo', id); }
  function tituloDe(lang, cod) {
    const t = (/<title>([^<]{2,80})<\/title>/i.exec(cod) || /^\s*(?:\/\/|#|<!--)\s*(.{3,60})/m.exec(cod) || [])[1];
    return (t || ('Código ' + (lang || '') + ' de ' + new Date().toLocaleDateString('pt-BR'))).trim();
  }
  async function guardar(lang, cod, sugestao) {
    const nome = prompt('💾 Nome para guardar este código:', sugestao || tituloDe(lang, cod)); if (nome == null) return null;
    const m = await todos(), id = MC.uid();
    m[id] = { id, nome: nome.trim() || 'Código', lang: lang || '', codigo: cod, criado: Date.now(), atualizado: Date.now() };
    await gravar(m, id); MC.aviso('💾 Guardado em 🧪 Meus códigos' + (MC.nuvem && MC.nuvem.logado && MC.nuvem.logado() ? ' (e vai para a nuvem)' : ''), 'ok');
    return id;
  }
  async function pintar() {
    const el = MC.$('#codigos-corpo'); if (!el) return;
    const busca = (MC.$('#cod-busca') && MC.$('#cod-busca').value || '').toLowerCase();
    const l = Object.values(await todos()).filter((c) => !busca || (c.nome + ' ' + c.codigo).toLowerCase().includes(busca)).sort((a, b) => (b.atualizado || 0) - (a.atualizado || 0));
    el.innerHTML = l.length ? l.map((c) => '<div class="cod-item" data-id="' + E(c.id) + '"><div style="flex:1;min-width:0"><b>' + E(c.nome) + '</b><div class="pequeno mudo">' + E(c.lang || 'texto') + ' · ' + String(c.codigo || '').split('\n').length + ' linhas · ' + new Date(c.atualizado || c.criado).toLocaleDateString('pt-BR') + '</div></div>' +
      '<button class="ic" data-c="abrir" title="Abrir no playground">▶</button><button class="ic" data-c="chat" title="Colocar na caixa para a IA continuar">💬</button><button class="ic" data-c="copiar" title="Copiar">📋</button><button class="ic" data-c="baixar" title="Baixar">⤓</button><button class="ic" data-c="nome" title="Mudar o nome">✏️</button><button class="ic" data-c="apagar" title="Apagar">🗑</button></div>').join('')
      : '<p class="mudo pequeno">' + (busca ? 'Nada com "' + E(busca) + '".' : 'Nenhum código guardado ainda. Nos blocos de código das respostas, toque em 💾 Guardar.') + '</p>';
  }
  async function clique(e) {
    const b = e.target.closest('[data-c]'); if (!b) return;
    const id = b.closest('[data-id]').dataset.id, m = await todos(), c = m[id]; if (!c) return;
    const a = b.dataset.c;
    if (a === 'abrir') { MC.fecharPaineis(); MC.previa.abrir(c.lang || 'html', c.codigo, id); }
    if (a === 'chat') { MC.fecharPaineis(); const ent = MC.$('#entrada'); ent.value += (ent.value ? '\n\n' : '') + 'Este é o meu código "' + c.nome + '":\n```' + (c.lang || '') + '\n' + c.codigo + '\n```\n'; ent.dispatchEvent(new Event('input')); ent.focus(); }
    if (a === 'copiar') MC.copiar(c.codigo);
    if (a === 'baixar') MC.baixar(c.nome.replace(/[^\wÀ-ÿ.-]+/g, '-') + '.' + (EXT[c.lang] || 'txt'), c.codigo);
    if (a === 'nome') { const n = prompt('Novo nome:', c.nome); if (n && n.trim()) { c.nome = n.trim(); c.atualizado = Date.now(); await gravar(m, id); pintar(); } }
    if (a === 'apagar') { if (!confirm('Apagar "' + c.nome + '" dos seus códigos (aqui e na nuvem)?\n\nDica: antes, toque em ⤓ para baixar uma cópia.')) return; delete m[id]; await gravar(m, id); pintar(); }
  }
  // o playground salvou uma mudança: atualiza o código guardado
  async function atualizar(id, codigo) { const m = await todos(); if (!m[id]) return false; m[id].codigo = codigo; m[id].atualizado = Date.now(); await gravar(m, id); return true; }
  async function abrir() { await pintar(); MC.abrirPainel('painel-codigos'); }
  document.addEventListener('DOMContentLoaded', () => {
    const b = MC.$('#bt-codigos'); if (b) b.onclick = abrir;
    const c = MC.$('#codigos-corpo'); if (c) c.onclick = clique;
    const s = MC.$('#cod-busca'); if (s) s.oninput = pintar;
    MC.on && MC.on('codigos', pintar);
  });
  MC.codigos = { guardar, abrir, pintar, atualizar, todos };
})(window.MC);
