#!/usr/bin/env node
/**
 * Refresh market data from Finnhub API.
 * Updates public-market fields in data.js with live prices and changes.
 * Runs on schedule via GitHub Actions with FINNHUB_API_KEY.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dir, '../data.js');
const apiKey = process.env.FINNHUB_API_KEY;

if (!apiKey) {
  console.error('❌ FINNHUB_API_KEY not set. Exiting.');
  process.exit(1);
}

const API_BASE = 'https://finnhub.io/api/v1';
const RATE_LIMIT_MS = 100; // Finnhub free tier: ~10 req/sec

/**
 * Fetch quote data from Finnhub
 */
async function fetchQuote(symbol) {
  const url = `${API_BASE}/quote?symbol=${symbol}&token=${apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const data = await res.json();
    
    if (data.c === undefined) {
      console.warn(`⚠️  ${symbol}: no quote data`);
      return null;
    }
    
    return {
      price: data.c,           // current price
      change: data.d ?? 0,     // absolute change
      changePercent: data.dp ?? 0  // percent change
    };
  } catch (err) {
    console.error(`❌ ${symbol}: ${err.message}`);
    return null;
  }
}

/**
 * Fetch all quotes with rate limiting
 */
async function fetchAllQuotes(symbols) {
  const results = {};
  
  for (const sym of symbols) {
    const quote = await fetchQuote(sym);
    if (quote) {
      results[sym] = quote;
    }
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_MS));
  }
  
  return results;
}

/**
 * Load and parse data.js
 */
function loadData() {
  const code = fs.readFileSync(dataPath, 'utf-8');
  const match = code.match(/window\.DATA\s*=\s*(\{[\s\S]*\})\s*;/);
  if (!match) throw new Error('Could not parse DATA object');
  
  let DATA;
  eval(`DATA = ${match[1]}`);
  return DATA;
}

/**
 * Update asset prices and changes
 */
function updateAssets(data, quotes) {
  const groups = ['mag10', 'bonds', 'em', 'indexes'];
  let updated = 0;
  
  groups.forEach(group => {
    (data[group] || []).forEach(asset => {
      if (asset.isYield) return; // Skip yields (bonds)
      
      if (quotes[asset.sym]) {
        const quote = quotes[asset.sym];
        asset.price = quote.price;
        asset.chg = quote.changePercent;
        updated++;
        console.log(`✅ ${asset.sym}: $${quote.price.toFixed(2)} (${quote.changePercent >= 0 ? '+' : ''}${quote.changePercent.toFixed(2)}%)`);
      }
    });
  });
  
  return updated;
}

/**
 * Update metadata timestamps
 */
function updateMetadata(data) {
  data.meta.publicMarket.refreshedAt = Date.now();
  data.meta.publicMarket.asOf = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/New_York'
  }) + ' ET';
  data.meta.publicMarket.label = `Market snapshot · ${data.meta.publicMarket.asOf}`;
  data.meta.publicMarket.provider = 'Finnhub';
}

/**
 * Save updated data.js
 */
function saveData(data) {
  const json = JSON.stringify(data, null, 2);
  const content = `/*
 * 60FPS editorial and market snapshot data.
 *
 * Public-market fields are refreshed by scripts/refresh-market-data.mjs when
 * FINNHUB_API_KEY is configured in GitHub Actions. Editorial content, Treasury
 * yields, private-market values, and curated links are intentionally reviewed
 * and edited by people in this file.
 */
window.DATA = ${json};
`;
  
  fs.writeFileSync(dataPath, content, 'utf-8');
  console.log(`\n✅ Updated data.js`);
}

/**
 * Main flow
 */
async function main() {
  console.log('\n📊 Refreshing market data from Finnhub...\n');
  
  try {
    const data = loadData();
    
    // Collect all symbols (exclude yields)
    const symbols = [];
    ['mag10', 'bonds', 'em', 'indexes'].forEach(group => {
      (data[group] || []).forEach(asset => {
        if (!asset.isYield) symbols.push(asset.sym);
      });
    });
    
    console.log(`Fetching ${symbols.length} quotes...`);
    const quotes = await fetchAllQuotes(symbols);
    
    const updated = updateAssets(data, quotes);
    updateMetadata(data);
    saveData(data);
    
    console.log(`\n✅ Refresh complete: ${updated}/${symbols.length} assets updated`);
    process.exit(0);
  } catch (err) {
    console.error(`\n❌ Refresh failed: ${err.message}`);
    process.exit(1);
  }
}

main();
