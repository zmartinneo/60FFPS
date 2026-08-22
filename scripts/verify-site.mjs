#!/usr/bin/env node
/**
 * Verify 60FPS data integrity.
 * Validates structure, required fields, and data constraints.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dir, '../data.js');

// Load data
let DATA;
try {
  const code = fs.readFileSync(dataPath, 'utf-8');
  // Extract DATA object from window.DATA = {...}
  const match = code.match(/window\.DATA\s*=\s*(\{[\s\S]*\})\s*;/);
  if (!match) throw new Error('Could not parse DATA object');
  eval(`DATA = ${match[1]}`);
} catch (err) {
  console.error(`❌ Failed to load data.js: ${err.message}`);
  process.exit(1);
}

const errors = [];
const warnings = [];

/**
 * Validate asset objects (mag10, bonds, em, indexes, llm)
 */
function validateAssets(group, assets) {
  if (!Array.isArray(assets)) {
    errors.push(`${group}: not an array`);
    return;
  }

  assets.forEach((asset, i) => {
    const prefix = `${group}[${i}]`;

    // Required fields
    const required = ['sym', 'name', 'sub', 'chg', 'bio'];
    required.forEach(field => {
      if (!(field in asset)) {
        errors.push(`${prefix}: missing required field "${field}"`);
      }
    });

    // Price or yield (mutually exclusive)
    const hasPrice = 'price' in asset;
    const hasYield = 'yield' in asset;
    if (!hasPrice && !hasYield) {
      errors.push(`${prefix}: must have "price" or "yield"`);
    }
    if (hasPrice && hasYield && !asset.isYield) {
      warnings.push(`${prefix}: has both price and yield`);
    }

    // Validate types
    if (asset.sym && typeof asset.sym !== 'string') {
      errors.push(`${prefix}.sym: expected string, got ${typeof asset.sym}`);
    }
    if (asset.name && typeof asset.name !== 'string') {
      errors.push(`${prefix}.name: expected string, got ${typeof asset.name}`);
    }
    if (typeof asset.chg !== 'number') {
      errors.push(`${prefix}.chg: expected number, got ${typeof asset.chg}`);
    }
    if (hasPrice && typeof asset.price !== 'number') {
      errors.push(`${prefix}.price: expected number, got ${typeof asset.price}`);
    }
    if (hasYield && typeof asset.yield !== 'number') {
      errors.push(`${prefix}.yield: expected number, got ${typeof asset.yield}`);
    }

    // Yield constraints
    if (hasYield) {
      if (asset.yield < 0 || asset.yield > 20) {
        warnings.push(`${prefix}.yield: unusual value ${asset.yield}%`);
      }
    }

    // Price constraints
    if (hasPrice && asset.price < 0) {
      errors.push(`${prefix}.price: negative price ${asset.price}`);
    }

    // Bio length
    if (!asset.bio || asset.bio.length < 10) {
      warnings.push(`${prefix}.bio: suspiciously short`);
    }
  });
}

/**
 * Validate LLM company data
 */
function validateLLM(llm) {
  if (!Array.isArray(llm)) {
    errors.push(`llm: not an array`);
    return;
  }

  llm.forEach((company, i) => {
    const prefix = `llm[${i}]`;
    const required = ['name', 'valB', 'round', 'leads', 'asOf', 'sourceLabel', 'source'];
    
    required.forEach(field => {
      if (!(field in company)) {
        errors.push(`${prefix}: missing required field "${field}"`);
      }
    });

    if (typeof company.valB !== 'number' || company.valB < 0) {
      errors.push(`${prefix}.valB: expected non-negative number, got ${company.valB}`);
    }

    if (!company.source || !company.source.startsWith('http')) {
      errors.push(`${prefix}.source: invalid URL`);
    }
  });
}

/**
 * Validate news blocks
 */
function validateNews(news) {
  if (typeof news !== 'object' || !news) {
    errors.push(`news: not an object`);
    return;
  }

  const expected = ['mag10', 'bonds', 'em', 'indexes', 'llm'];
  expected.forEach(key => {
    if (!(key in news)) {
      errors.push(`news.${key}: missing`);
      return;
    }

    if (!Array.isArray(news[key])) {
      errors.push(`news.${key}: not an array`);
      return;
    }

    news[key].forEach((link, i) => {
      if (!Array.isArray(link) || link.length !== 2) {
        errors.push(`news.${key}[${i}]: expected [title, url], got ${JSON.stringify(link)}`);
        return;
      }

      const [title, url] = link;
      if (typeof title !== 'string' || title.length === 0) {
        errors.push(`news.${key}[${i}][0]: invalid title`);
      }
      if (typeof url !== 'string' || !url.startsWith('http')) {
        errors.push(`news.${key}[${i}][1]: invalid URL`);
      }
    });
  });
}

/**
 * Validate metadata
 */
function validateMeta(meta) {
  if (typeof meta !== 'object' || !meta) {
    errors.push(`meta: not an object`);
    return;
  }

  const expected = ['publicMarket', 'privateMarket', 'curatedLinks'];
  expected.forEach(key => {
    if (!(key in meta)) {
      errors.push(`meta.${key}: missing`);
    }
  });

  if (meta.publicMarket) {
    const pm = meta.publicMarket;
    if ('refreshedAt' in pm && pm.refreshedAt !== null && typeof pm.refreshedAt !== 'number') {
      errors.push(`meta.publicMarket.refreshedAt: expected null or timestamp`);
    }
  }
}

/**
 * Cross-validation: symbol uniqueness
 */
function validateSymbolUniqueness() {
  const groups = ['mag10', 'bonds', 'em', 'indexes'];
  const seen = new Map();

  groups.forEach(group => {
    (DATA[group] || []).forEach(asset => {
      if (asset.sym) {
        if (seen.has(asset.sym)) {
          errors.push(`Duplicate symbol "${asset.sym}" in ${group} and ${seen.get(asset.sym)}`);
        } else {
          seen.set(asset.sym, group);
        }
      }
    });
  });
}

/**
 * Cross-validation: HTML references
 */
function validateHTMLReferences() {
  const htmlPath = path.join(__dir, '../index.html');
  let html;
  try {
    html = fs.readFileSync(htmlPath, 'utf-8');
  } catch (err) {
    errors.push(`Could not read index.html: ${err.message}`);
    return;
  }

  // Check for grid/list element IDs
  const grids = ['grid-mag10', 'grid-bonds', 'grid-em', 'grid-indexes', 'llm-table'];
  grids.forEach(id => {
    if (!html.includes(`id="${id}"`)) {
      errors.push(`index.html: missing element with id="${id}"`);
    }
  });

  // Check for chart canvases
  const charts = ['dashboardChart', 'mag10Chart', 'curveChart', 'emChart', 'llmChart', 'detailChart'];
  charts.forEach(id => {
    if (!html.includes(`id="${id}"`)) {
      errors.push(`index.html: missing canvas with id="${id}"`);
    }
  });

  // Check news blocks
  const newsBlocks = ['news-mag10', 'news-bonds', 'news-em', 'news-indexes', 'news-llm'];
  newsBlocks.forEach(id => {
    if (!html.includes(`id="${id}"`)) {
      errors.push(`index.html: missing element with id="${id}"`);
    }
  });
}

// Run validations
console.log('\n📋 Validating 60FPS data structure...\n');

validateMeta(DATA.meta);
validateAssets('mag10', DATA.mag10);
validateAssets('bonds', DATA.bonds);
validateAssets('em', DATA.em);
validateAssets('indexes', DATA.indexes);
validateLLM(DATA.llm);
validateNews(DATA.news);
validateSymbolUniqueness();
validateHTMLReferences();

// Report
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All validations passed!\n');
  process.exit(0);
}

if (errors.length > 0) {
  console.log(`❌ Errors (${errors.length}):`);
  errors.forEach(e => console.log(`   ${e}`));
}

if (warnings.length > 0) {
  console.log(`\n⚠️  Warnings (${warnings.length}):`);
  warnings.forEach(w => console.log(`   ${w}`));
}

console.log();
process.exit(errors.length > 0 ? 1 : 0);
