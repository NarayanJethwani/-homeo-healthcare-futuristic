#!/usr/bin/env node
/**
 * Automated Vercel Deployment Cleanup Tool
 * Safely deletes inactive preview/historical deployments across projects in the team
 * while strictly protecting the current active Production deployment.
 * 
 * Usage:
 *   VERCEL_TOKEN=your_token node scripts/cleanVercelDeployments.mjs
 *   or:
 *   node scripts/cleanVercelDeployments.mjs <your_token>
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

const TEAM_ID = 'team_ZhrJkrr9f4uqE7jVuS10Tvj0';
const PROJECT_IDS = [
  'prj_FbN7qTZgw2fnvmITBSUjZdDFiK2s', // homeo-healthcare-futuristic
  'prj_Jz3hpMJJo0Jg3aNz2rlVn1ZbBUxk'  // homeo-healthcare-portal
];

function getVercelToken() {
  if (process.argv[2]) {
    return process.argv[2].trim();
  }
  if (process.env.VERCEL_TOKEN) {
    return process.env.VERCEL_TOKEN.trim();
  }

  // Check com.vercel.cli/auth.json
  const cliAuthPath = path.join(os.homedir(), 'Library', 'Application Support', 'com.vercel.cli', 'auth.json');
  if (fs.existsSync(cliAuthPath)) {
    try {
      const auth = JSON.parse(fs.readFileSync(cliAuthPath, 'utf8'));
      if (auth.token) return auth.token;
    } catch (e) {
      // ignore
    }
  }

  const vercelGlobalAuth = path.join(os.homedir(), '.vercel', 'auth.json');
  if (fs.existsSync(vercelGlobalAuth)) {
    try {
      const auth = JSON.parse(fs.readFileSync(vercelGlobalAuth, 'utf8'));
      if (auth.token) return auth.token;
    } catch (e) {
      // ignore
    }
  }

  return null;
}

async function cleanProject(token, projectId) {
  console.log(`\n==================================================`);
  console.log(`🔍 Inspecting Project: ${projectId}...`);
  console.log(`==================================================`);

  // Fetch deployments for this project
  const listUrl = `https://api.vercel.com/v6/deployments?teamId=${TEAM_ID}&projectId=${projectId}&limit=100`;
  const res = await fetch(listUrl, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`❌ Failed to fetch deployments for project ${projectId}:`, err);
    return;
  }

  const data = await res.json();
  const deployments = data.deployments || [];
  console.log(`Found ${deployments.length} deployments in total.`);

  if (deployments.length === 0) {
    console.log(`✅ No deployments found to clean.`);
    return;
  }

  // Find the latest active production deployment
  let productionDeployment = deployments.find(d => d.target === 'production' && d.state === 'READY');
  if (!productionDeployment) {
    productionDeployment = deployments.find(d => d.target === 'production');
  }

  if (productionDeployment) {
    console.log(`🛡️  PROTECTED PRODUCTION DEPLOYMENT: ${productionDeployment.uid} (${productionDeployment.url}) created at ${new Date(productionDeployment.created).toISOString()}`);
  } else {
    console.log(`⚠️  No production deployment found. Will protect the newest deployment.`);
    productionDeployment = deployments[0];
    console.log(`🛡️  PROTECTED DEPLOYMENT: ${productionDeployment.uid} (${productionDeployment.url})`);
  }

  // Deployments to delete
  const toDelete = deployments.filter(d => d.uid !== productionDeployment.uid);
  console.log(`🧹 Deployments to delete: ${toDelete.length}`);

  let deletedCount = 0;
  let failedCount = 0;

  for (const dep of toDelete) {
    const isPreview = dep.target !== 'production' ? '[PREVIEW]' : '[OLD PROD]';
    const dateStr = new Date(dep.created).toLocaleDateString();
    process.stdout.write(`   Deleting ${isPreview} ${dep.uid} (${dateStr} - ${dep.url || 'no-url'})... `);

    try {
      const delRes = await fetch(`https://api.vercel.com/v13/deployments/${dep.uid}?teamId=${TEAM_ID}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (delRes.ok) {
        deletedCount++;
        console.log(`✅ Deleted`);
      } else {
        const errJson = await delRes.json().catch(() => ({}));
        failedCount++;
        console.log(`❌ Failed: ${errJson.error?.message || delRes.statusText}`);
      }
    } catch (e) {
      failedCount++;
      console.log(`❌ Error: ${e.message}`);
    }

    // Small throttle to avoid hitting Vercel rate limits
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\n🎉 Project ${projectId} cleanup summary:`);
  console.log(`   - Deleted: ${deletedCount}`);
  console.log(`   - Protected/Retained: 1`);
  console.log(`   - Errors: ${failedCount}`);
}

async function main() {
  const token = getVercelToken();
  if (!token) {
    console.error(`\n❌ Error: Vercel Token not found.`);
    console.error(`Please provide a Vercel token by either:`);
    console.error(`  1. Running: node scripts/cleanVercelDeployments.mjs <YOUR_VERCEL_TOKEN>`);
    console.error(`  2. Setting: export VERCEL_TOKEN="your_token"`);
    console.error(`  3. Or logging in via CLI: npx vercel login\n`);
    process.exit(1);
  }

  console.log(`🚀 Starting Vercel Function Storage Cleanup for Team: ${TEAM_ID}`);
  for (const projectId of PROJECT_IDS) {
    await cleanProject(token, projectId);
  }
  console.log(`\n✨ All projects processed successfully! Your Vercel Function Storage has been freed.`);
}

main().catch(console.error);
