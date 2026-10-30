import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

test('Vercel configuration and production readiness', () => {
  // vercel.json exists and has correct framework, outputDirectory and rewrites
  const vercelPath = path.join(ROOT, 'vercel.json');
  assert.ok(fs.existsSync(vercelPath), 'vercel.json must exist in root');
  const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
  assert.equal(vercelConfig.framework, 'vite');
  assert.equal(vercelConfig.outputDirectory, 'dist');
  assert.ok(Array.isArray(vercelConfig.rewrites), 'rewrites array must exist');
  assert.equal(vercelConfig.rewrites[0].destination, '/index.html');

  // package.json build script
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'));
  assert.ok(pkg.scripts.build, 'build script must exist in package.json');

  // favicon and index.html
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
  assert.ok(indexHtml.includes('/favicon.svg'), 'index.html must reference favicon');
  assert.ok(fs.existsSync(path.join(ROOT, 'public/favicon.svg')), 'public/favicon.svg must exist');

  // All 7 3D assets in public/assets/glb/
  const glbDir = path.join(ROOT, 'public/assets/glb');
  const expectedGlb = [
    'bishop_white.glb.gz.b64',
    'king_white.glb.gz.b64',
    'knight_white.glb.gz.b64',
    'option8_cathedral.glb.gz.b64',
    'pawn_white.glb.gz.b64',
    'queen_white.glb.gz.b64',
    'rook_white.glb.gz.b64'
  ];
  for (const f of expectedGlb) {
    assert.ok(fs.existsSync(path.join(glbDir, f)), `Asset public/assets/glb/${f} must exist`);
  }
});
