# 60FPS Intelligence

This repository is a **static, GitHub Pages-ready market-intelligence site**. It distinguishes between a repository-owned public-market snapshot, editorially maintained private-market records, and curated outbound reading links. The browser receives no market-data API key.

> **Editorial boundary.** The LLM-company table reflects last-reported private-market valuations from press coverage through roughly late 2025. Every entry includes an `asOf` field and an outbound source/newsroom link. Review and update those entries manually in `data/data.js`; they are not a live private-market feed.

| Content | Location | How it is updated | Public presentation |
| --- | --- | --- | --- |
| Public equity and ETF prices | `data/data.js` | Scheduled repository job, if a provider key is configured | Dated **market snapshot** |
| Treasury yield curve | `data/data.js` | Editorial update | Dated reference figure |
| LLM private-market table | `data/data.js` → `DATA.llm` | Editorial review | Reported valuation with `asOf` and source link |
| Page-specific news blocks | `data/data.js` → `DATA.news` | Editorial curation | **Curated reading & sources**, not a live feed |

## Local preview

No package installation is required. Open `index.html` in a browser, or serve the folder with any static-file server. Before opening a pull request, run:

```bash
node scripts/verify-site.mjs
```

The verification script checks that the page loads the external data file, that no deprecated demo-data language remains, and that every LLM record has the required dated source fields.

## Set up automatic public-market snapshots

The workflow at `.github/workflows/refresh-and-deploy.yml` runs on weekday evenings at **22:20 UTC**, can be started manually, and uses the quote provider only in the GitHub-hosted job. To enable it:

1. Create an API key with your selected Finnhub plan.
2. In the GitHub repository, add an Actions repository secret named `FINNHUB_API_KEY` under **Settings → Secrets and variables → Actions**.
3. Push the repository to the `main` branch. If the default branch has a different name, update the branch in the workflow.
4. Run **Actions → Refresh market snapshot and deploy Pages → Run workflow** once, leaving the refresh toggle enabled.

The updater changes only `price` and `chg` for public market records. It deliberately leaves Treasury yields, LLM valuations, source links, and curated news untouched. It refuses to write a new snapshot unless at least 80% of the configured public quotes are valid, reducing the chance that a partial provider error overwrites the prior snapshot.

GitHub scheduled workflows use POSIX cron and run from the default branch; the workflow’s scheduled run is configured in UTC. GitHub also supports repository secrets as workflow environment variables, keeping the provider key out of the page source. [1] [2]

## Deploy to GitHub Pages

The same workflow validates and deploys the site after pushes to `main`, manual runs, and scheduled refreshes. In the repository, open **Settings → Pages**, set the source to **GitHub Actions**, then push the files. The workflow packages the static files and deploys them using the official Pages actions. GitHub’s Pages documentation specifies the required deployment permissions and environment configuration used in the included workflow. [3]

## Editorial maintenance

To update a private LLM-company entry, edit an object in `DATA.llm` while retaining all seven required fields:

```js
{
  name: 'Company',
  valB: 12.3,
  round: 'Latest round description',
  leads: 'Lead investor(s)',
  asOf: 'Mon YYYY',
  sourceLabel: 'Publisher or newsroom',
  source: 'https://publisher.example/article-or-newsroom'
}
```

To revise a news block, edit the applicable `DATA.news` list. Each entry is a simple `[label, url]` pair. The site intentionally does not try to fetch external news in the browser, so the visible list stays controllable and deployable from a static repository.

## Repository layout

```text
.
├── index.html                         # UI and rendering logic
├── data/data.js                       # Public snapshot + editorial data
├── scripts/refresh-market-data.mjs    # Server-side-only public quote updater
├── scripts/verify-site.mjs            # Contract and wording checks
└── .github/workflows/
    └── refresh-and-deploy.yml         # Refresh, validate, commit, and Pages deploy
```

## References

[1]: https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onschedule "GitHub Docs — Workflow syntax: schedule"
[2]: https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions "GitHub Docs — Using secrets in GitHub Actions"
[3]: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages "GitHub Docs — Using custom workflows with GitHub Pages"
