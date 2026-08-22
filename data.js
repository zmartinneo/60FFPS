/*
 * 60FPS editorial and market snapshot data.
 *
 * Public-market fields are refreshed by scripts/refresh-market-data.mjs when
 * FINNHUB_API_KEY is configured in GitHub Actions. Editorial content, Treasury
 * yields, private-market values, and curated links are intentionally reviewed
 * and edited by people in this file.
 */
window.DATA = {
  meta: {
    publicMarket: {
      label: 'Initial snapshot · refresh not configured',
      asOf: 'Initial repository snapshot',
      refreshedAt: null,
      provider: 'Awaiting scheduled refresh'
    },
    privateMarket: {
      label: 'Editorially maintained',
      coverage: 'Reported private-market valuations with dated source links',
      lastReviewed: '2025-10-01'
    },
    curatedLinks: {
      label: 'Curated reading',
      lastReviewed: '2025-10-01'
    }
  },
  mag10: [
    { sym:'NVDA', name:'NVIDIA Corp.', sub:'AI hardware & data centers', price:124.50, chg:3.4, bio:'NVIDIA builds graphics processors and AI accelerators that power global data centers, generative AI training, and gaming.' },
    { sym:'AAPL', name:'Apple Inc.', sub:'Consumer electronics', price:214.20, chg:-1.1, bio:'Apple designs consumer electronics, software, and services including iPhone, Mac, iPad, and wearables.' },
    { sym:'MSFT', name:'Microsoft Corp.', sub:'Cloud & software', price:445.10, chg:1.5, bio:'Microsoft builds enterprise software, Windows, the Azure cloud platform, and AI tooling via its OpenAI partnership.' },
    { sym:'AMZN', name:'Amazon.com Inc.', sub:'E-commerce & AWS', price:186.40, chg:1.8, bio:'Amazon runs e-commerce logistics, AWS cloud infrastructure, streaming, and a large advertising business.' },
    { sym:'GOOGL', name:'Alphabet Inc.', sub:'Search & cloud', price:178.20, chg:-0.5, bio:'Alphabet operates Google Search, YouTube, Android, Google Cloud, and the Gemini model family.' },
    { sym:'META', name:'Meta Platforms', sub:'Social & ads', price:502.30, chg:2.2, bio:'Meta runs Facebook, Instagram, and WhatsApp, funds open-weight Llama models, and invests heavily in AI infrastructure.' },
    { sym:'TSLA', name:'Tesla Inc.', sub:'EVs & energy', price:248.90, chg:7.2, bio:'Tesla builds electric vehicles, battery storage, solar hardware, and autonomy software.' },
    { sym:'AVGO', name:'Broadcom Inc.', sub:'Semis & networking', price:168.10, chg:2.9, bio:'Broadcom supplies custom silicon, networking chips, and infrastructure software to hyperscale data centers.' },
    { sym:'LLY', name:'Eli Lilly', sub:'Pharmaceuticals', price:850.40, chg:0.8, bio:'Eli Lilly develops treatments in metabolic disease, oncology, neuroscience, and immunology.' },
    { sym:'TSM', name:'TSMC', sub:'Semiconductor foundry', price:172.80, chg:1.9, bio:'Taiwan Semiconductor is the largest dedicated foundry, manufacturing leading-edge chips for NVIDIA, Apple, and AMD.' }
  ],
  bonds: [
    { sym:'US02Y', name:'US Treasury 2-Year', sub:'Short-end sovereign', yield:4.05, chg:-0.02, isYield:true, bio:'Two-year note. Most sensitive to Federal Reserve policy expectations.' },
    { sym:'US05Y', name:'US Treasury 5-Year', sub:'Belly of the curve', yield:4.12, chg:-0.03, isYield:true, bio:'Five-year note. Mid-curve benchmark for auto loans and corporate issuance.' },
    { sym:'US10Y', name:'US Treasury 10-Year', sub:'Global benchmark', yield:4.28, chg:-0.04, isYield:true, bio:'Ten-year note. Anchors mortgage rates and equity discount rates worldwide.' },
    { sym:'US30Y', name:'US Treasury 30-Year', sub:'Long-duration sovereign', yield:4.52, chg:-0.03, isYield:true, bio:'Thirty-year bond. Reflects long-run inflation and term-premium expectations.' },
    { sym:'AGG', name:'iShares Core US Aggregate', sub:'Broad IG bond fund', price:97.20, chg:0.3, bio:'Broad investment-grade index: Treasuries, agencies, corporates, and MBS.' },
    { sym:'BND', name:'Vanguard Total Bond', sub:'Total bond market', price:72.40, chg:0.2, bio:'Total US dollar-denominated investment-grade bond market.' },
    { sym:'LQD', name:'iShares IG Corporate', sub:'Investment-grade credit', price:108.10, chg:0.4, bio:'Liquid investment-grade corporate bonds.' },
    { sym:'HYG', name:'iShares High Yield', sub:'High-yield credit', price:76.80, chg:0.6, bio:'High-yield corporate bonds; a read on credit risk appetite.' },
    { sym:'TLT', name:'iShares 20+ Yr Treasury', sub:'Long duration', price:92.30, chg:-0.5, bio:'Long-dated Treasuries; high sensitivity to rate moves.' },
    { sym:'TIP', name:'iShares TIPS', sub:'Inflation-protected', price:106.50, chg:0.1, bio:'Treasury inflation-protected securities; principal adjusts with CPI.' }
  ],
  em: [
    { sym:'EEM', name:'iShares MSCI Emerging Markets', sub:'Broad EM', price:42.10, chg:0.9, bio:'Broad emerging-markets equity benchmark.' },
    { sym:'VWO', name:'Vanguard FTSE EM', sub:'Broad EM (ex-Korea)', price:44.80, chg:0.8, bio:'Broad EM tracker using the FTSE classification.' },
    { sym:'FXI', name:'iShares China Large-Cap', sub:'China', price:27.90, chg:-1.2, bio:'Large-cap Chinese equities listed in Hong Kong.' },
    { sym:'INDA', name:'iShares MSCI India', sub:'India', price:52.60, chg:0.4, bio:'Indian large- and mid-cap equities.' },
    { sym:'EWZ', name:'iShares MSCI Brazil', sub:'Brazil', price:28.40, chg:1.6, bio:'Brazilian equities; commodity- and rate-sensitive.' },
    { sym:'EWY', name:'iShares MSCI South Korea', sub:'South Korea', price:63.20, chg:1.1, bio:'Korean equities, heavily weighted to semiconductors.' },
    { sym:'EWT', name:'iShares MSCI Taiwan', sub:'Taiwan', price:49.70, chg:1.4, bio:'Taiwanese equities, dominated by TSMC.' },
    { sym:'EWW', name:'iShares MSCI Mexico', sub:'Mexico', price:55.30, chg:0.2, bio:'Mexican equities; nearshoring and USMCA exposure.' },
    { sym:'EZA', name:'iShares MSCI South Africa', sub:'South Africa', price:46.90, chg:-0.3, bio:'South African equities; miners and financials.' },
    { sym:'VNM', name:'VanEck Vietnam', sub:'Vietnam', price:13.10, chg:0.7, bio:'Vietnamese equities; manufacturing relocation beneficiary.' }
  ],
  indexes: [
    { sym:'SPY', name:'S&P 500', sub:'US large cap (ETF proxy)', price:5450, chg:0.6, bio:'500 large US companies; the default US equity benchmark.' },
    { sym:'QQQ', name:'Nasdaq-100', sub:'US tech-heavy (ETF proxy)', price:19120, chg:1.1, bio:'100 largest non-financial Nasdaq companies.' },
    { sym:'DIA', name:'Dow Jones Industrial', sub:'30 blue chips (ETF proxy)', price:39800, chg:0.2, bio:'Price-weighted index of 30 large US companies.' },
    { sym:'IWM', name:'Russell 2000', sub:'US small cap (ETF proxy)', price:2080, chg:-0.4, bio:'Roughly 2,000 US small-cap companies.' },
    { sym:'EFA', name:'MSCI EAFE', sub:'Developed ex-US (ETF proxy)', price:78.50, chg:0.3, bio:'Developed markets outside North America.' },
    { sym:'VGK', name:'FTSE Europe', sub:'Europe (ETF proxy)', price:67.20, chg:0.1, bio:'Developed European equities.' },
    { sym:'EWJ', name:'MSCI Japan', sub:'Japan (ETF proxy)', price:70.10, chg:0.8, bio:'Japanese large- and mid-cap equities.' },
    { sym:'VXX', name:'VIX (short-term futures)', sub:'Volatility (ETN proxy)', price:14.20, chg:-3.1, bio:'Expected 30-day S&P 500 volatility.' }
  ],
  llm: [
    { name:'OpenAI', valB:500, round:'Secondary sale', leads:'Thrive, SoftBank, Dragoneer', asOf:'Oct 2025', sourceLabel:'OpenAI newsroom', source:'https://openai.com/news/' },
    { name:'Anthropic', valB:183, round:'Series F, $13B', leads:'ICONIQ, Fidelity, Lightspeed', asOf:'Sep 2025', sourceLabel:'Anthropic newsroom', source:'https://www.anthropic.com/news' },
    { name:'xAI', valB:200, round:'Reported raise', leads:'Valor, Fidelity, QIA (reported)', asOf:'Late 2025', sourceLabel:'xAI newsroom', source:'https://x.ai/news' },
    { name:'Safe Superintelligence', valB:32, round:'$2B raise', leads:'Greenoaks', asOf:'Apr 2025', sourceLabel:'SSI website', source:'https://ssi.inc' },
    { name:'Mistral AI', valB:13.8, round:'Series C, €1.7B', leads:'ASML', asOf:'Sep 2025', sourceLabel:'Mistral newsroom', source:'https://mistral.ai/news' },
    { name:'Thinking Machines', valB:12, round:'Seed, $2B', leads:'a16z', asOf:'Jul 2025', sourceLabel:'Thinking Machines website', source:'https://thinkingmachines.ai' },
    { name:'Perplexity', valB:20, round:'$200M raise', leads:'Institutional Venture Partners (reported)', asOf:'Sep 2025', sourceLabel:'Perplexity hub', source:'https://www.perplexity.ai/hub' },
    { name:'Cohere', valB:6.8, round:'$500M raise', leads:'Radical, Inovia', asOf:'Aug 2025', sourceLabel:'Cohere blog', source:'https://cohere.com/blog' }
  ],
  news: {
    mag10: [['Prof G Markets — YouTube','https://www.youtube.com/@ProfGMarkets/videos'],['Reuters — Technology','https://www.reuters.com/technology/'],['Google News — Magnificent Seven','https://news.google.com/search?q=%22magnificent+seven%22+stocks']],
    bonds: [['US Treasury daily yield curve','https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve'],['FRED — 10Y yield','https://fred.stlouisfed.org/series/DGS10'],['Google News — Treasury yields','https://news.google.com/search?q=treasury+yields']],
    em: [['Reuters — Emerging markets','https://www.reuters.com/markets/emerging/'],['IMF — WEO','https://www.imf.org/en/Publications/WEO'],['Google News — emerging markets','https://news.google.com/search?q=emerging+markets']],
    indexes: [['Reuters — Markets','https://www.reuters.com/markets/'],['CBOE — VIX','https://www.cboe.com/tradable_products/vix/'],['Google News — stock market today','https://news.google.com/search?q=stock+market+today']],
    llm: [['Google News — AI funding round','https://news.google.com/search?q=AI+startup+valuation+funding+round'],['Crunchbase News — AI','https://news.crunchbase.com/sections/ai/'],['The Information — AI','https://www.theinformation.com/ai']]
  }
};
