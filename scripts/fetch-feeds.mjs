// Fetch Medium / note RSS and GitHub org stats at build time.
// On any failure the previous src/data/*.json is kept (static fallback).
import { readFile, writeFile } from 'node:fs/promises';

const UA = 'Mozilla/5.0 (compatible; furuhashilab-site-build)';
const out = (n) => new URL(`../src/data/${n}.json`, import.meta.url);

const decode = (s) =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
   .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
const tag = (x, t) => { const m = x.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)); return m ? decode(m[1]) : ''; };

async function rss(url, limit = 6) {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`${url} -> ${r.status}`);
  const xml = await r.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, limit).map(([, it]) => {
    const html = tag(it, 'content:encoded') || tag(it, 'description');
    const img = (html.match(/<img[^>]+src="([^"]+)"/) || [])[1] || (it.match(/<media:thumbnail[^>]+url="([^"]+)"/) || [])[1] || '';
    return {
      title: tag(it, 'title'),
      url: tag(it, 'link').split('?')[0],
      date: new Date(tag(it, 'pubDate')).toISOString().slice(0, 10),
      image: img,
    };
  });
}

async function github() {
  const h = { 'User-Agent': UA, Accept: 'application/vnd.github+json', ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) };
  const org = await (await fetch('https://api.github.com/orgs/furuhashilab', { headers: h })).json();
  if (!org.public_repos) throw new Error('github org fetch failed');
  let repos = [];
  for (let p = 1; p <= 6; p++) {
    const r = await fetch(`https://api.github.com/orgs/furuhashilab/repos?per_page=100&page=${p}&sort=pushed`, { headers: h });
    const a = await r.json();
    if (!Array.isArray(a)) throw new Error('github repos fetch failed');
    repos = repos.concat(a);
    if (a.length < 100) break;
  }
  const own = repos.filter((r) => !r.fork);
  const personal = /^(\d{4}gsc|\d{4}_?gsc|Hackathon|Hachathon|sotsuron)/i;
  return {
    fetchedAt: new Date().toISOString(),
    publicRepos: org.public_repos,
    followers: org.followers,
    // Student-named repos are counted, never listed individually.
    thesisRepos: own.filter((r) => /^\d{4}gsc/i.test(r.name)).length,
    hackathonRepos: own.filter((r) => /^hac?kathon/i.test(r.name)).length,
    featured: own.filter((r) => !personal.test(r.name) && r.description)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || (a.pushed_at < b.pushed_at ? 1 : -1))
      .slice(0, 6)
      .map((r) => ({ name: r.name, url: r.html_url, description: r.description, stars: r.stargazers_count, pushed: r.pushed_at.slice(0, 10), language: r.language })),
  };
}

for (const [name, fn] of [
  ['medium', () => rss('https://medium.com/feed/furuhashilab')],
  ['note', () => rss('https://note.com/mapconcierge/rss')],
  ['github', github],
]) {
  try {
    const data = await fn();
    await writeFile(out(name), JSON.stringify(data, null, 2) + '\n');
    console.log(`[feeds] ${name}: updated`);
  } catch (e) {
    console.warn(`[feeds] ${name}: FAILED (${e.message}) - keeping previous data`);
    try { await readFile(out(name)); } catch { await writeFile(out(name), name === 'github' ? '{}\n' : '[]\n'); }
  }
}
