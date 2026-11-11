# furuhashilab.com — 古橋研究室 公式サイト / Furuhashi Lab Website

## 概要 / Overview
青山学院大学 地球社会共生学部 古橋研究室の公式サイト。キャッチコピーは **「一億総伊能化 (Billions Inō-zation)」**。
学生（ゼミ志望者）と企業・自治体向けに、研究・活動・最新情報（Medium / note / GitHub）・SNS をまとめます。
Official site of Furuhashi Lab, Aoyama Gakuin University. Built with Astro, deployed by GitHub Actions to GitHub Pages.

- v0.7.0: 旧デザイン（[release](https://github.com/furuhashilab/www_furuhashiab_com/releases/tag/v0.7.0)）
- v0.8.0: 全面リニューアル（Astro, 日英, フィード自動取得）

## 使い方 / Usage
```bash
npm ci
npm run fetch   # Medium/note RSS と GitHub org 情報を src/data/*.json に取得（失敗時は既存JSONを保持）
npm run dev     # http://localhost:4321
npm run build   # dist/ に出力
```
- 文章は `src/i18n.ts`（日英）、レイアウトは `src/components/Home.astro`、デザインは `src/styles/global.css`
- `public/` の `docs/`, `pressrelease/`, `images/` 等は旧URLを維持するため配置（外部リンク切れ防止）
- `.github/workflows/deploy.yml`: push と毎日 06:00 JST に再ビルド・公開
- 地図: MapLibre GL JS（Globe/Web Mercator切替）, OpenFreeMap, 標高は Mapterhorn

## データソース・ライセンス / Data & License
- コード: CC0 / コンテンツ: CC BY 4.0
- 地図データ © OpenStreetMap contributors (ODbL), OpenFreeMap, Mapterhorn
- 「一億総伊能化」の定義・活動実績の出典: [Impress Internet Watch 2024-09-11](https://internet.watch.impress.co.jp/docs/column/chizu3/1621861.html)
- 学生個人名のリポジトリは件数のみ集計し、個別には掲載しません

## 著者 / Author
Taichi FURUHASHI (古橋大地), Aoyama Gakuin University

## 関連リンク / Links
[Medium](https://medium.com/furuhashilab) · [note](https://note.com/mapconcierge/m/mccb30c9c0673) · [GitHub](https://github.com/furuhashilab) · [X](https://x.com/furuhashilab) · [Instagram](https://www.instagram.com/furuhashilab/) · [YouTube](https://www.youtube.com/@furuhashilabs) · [Facebook](https://www.facebook.com/furuhashilab/)
