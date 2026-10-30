import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

test('Play with a Dove mode controls and elements in App.tsx', () => {
  const appTsx = fs.readFileSync(path.join(ROOT, 'src/App.tsx'), 'utf-8');

  // Must include btn-dove-mode right next to btn-side-toggle
  assert.ok(appTsx.includes('id="btn-dove-mode"'), 'Missing #btn-dove-mode button');
  assert.ok(appTsx.includes('id="btn-side-toggle"'), 'Missing #btn-side-toggle button');

  // Verify btn-dove-mode comes immediately around btn-side-toggle
  const sideToggleIdx = appTsx.indexOf('id="btn-side-toggle"');
  const doveModeIdx = appTsx.indexOf('id="btn-dove-mode"');
  assert.ok(doveModeIdx > sideToggleIdx, 'btn-dove-mode should be placed next to btn-side-toggle');
  assert.ok(doveModeIdx - sideToggleIdx < 500, 'btn-dove-mode should be directly adjacent to btn-side-toggle');

  // Dove defeat overlay and controls
  assert.ok(appTsx.includes('id="dove-defeat-overlay"'), 'Missing #dove-defeat-overlay');
  assert.ok(appTsx.includes('id="btn-dove-retry"'), 'Missing #btn-dove-retry');
  assert.ok(appTsx.includes('id="btn-dove-exit"'), 'Missing #btn-dove-exit');
  assert.ok(appTsx.includes('id="dove-toast"'), 'Missing #dove-toast');
});

test('Play with a Dove logic in wizardChessEngine.js', () => {
  const engine = fs.readFileSync(path.join(ROOT, 'src/wizardChessEngine.js'), 'utf-8');

  // State & 3D Dove model
  assert.ok(engine.includes('createDove3DModel'), 'Missing createDove3DModel');
  assert.ok(engine.includes('spawnPoopOnBoard'), 'Missing spawnPoopOnBoard');
  assert.ok(engine.includes('toppleAllWhitePieces'), 'Missing toppleAllWhitePieces');
  assert.ok(engine.includes('triggerDoveRage'), 'Missing triggerDoveRage');
  assert.ok(engine.includes('getDoveMovesForPiece'), 'Missing getDoveMovesForPiece');
  assert.ok(engine.includes('toggleDoveMode'), 'Missing toggleDoveMode');

  // Verification of Pigeon quote
  assert.ok(
    engine.includes('O POMBO ENLOUQUECEU') || engine.includes('O pombo'),
    'Pigeon rage toast missing'
  );
});

test('Dove predator devour and head poop mechanics', () => {
  const engine = fs.readFileSync(path.join(ROOT, 'src/wizardChessEngine.js'), 'utf-8');

  // Devour within 2 squares radius
  assert.ok(engine.includes('inDoveRadius'), 'Missing inDoveRadius check');
  assert.ok(engine.includes('startDoveDevourPieceSequence'), 'Missing startDoveDevourPieceSequence');
  assert.ok(engine.includes('executeDoveMoveNearPredatorZone'), 'Missing executeDoveMoveNearPredatorZone');
  assert.ok(engine.includes('Math.max(Math.abs(toR - doveR), Math.abs(toC - doveC)) <= 2') ||
            engine.includes('Math.max(Math.abs(tr - doveR), Math.abs(tc - doveC)) <= 2'),
            'Missing 2-square radius calculation');

  // Eat dove -> poop on piece head
  assert.ok(engine.includes('executeAttackDoveThenPoopOnHead'), 'Missing executeAttackDoveThenPoopOnHead');
  assert.ok(engine.includes('createHeadPoopMesh'), 'Missing createHeadPoopMesh');
  assert.ok(engine.includes('startPoopOnHeadSequence'), 'Missing startPoopOnHeadSequence');
  assert.ok(engine.includes('startHumiliatedPieceTopple'), 'Missing startHumiliatedPieceTopple');
  assert.ok(engine.includes('isDoveTarget'), 'Missing isDoveTarget');

  // Highlights
  assert.ok(engine.includes('0xb5179e'), 'Missing purple highlight for dove target');
  assert.ok(engine.includes('0xf4a261'), 'Missing amber highlight for devour zone');
  assert.ok(engine.includes('0xe63946'), 'Missing red highlight for forbidden legal move');
});

test('Hidden hints, zero instructions and Show UI button in Dove Mode', () => {
  const appTsx = fs.readFileSync(path.join(ROOT, 'src/App.tsx'), 'utf-8');
  const engine = fs.readFileSync(path.join(ROOT, 'src/wizardChessEngine.js'), 'utf-8');

  // btn-show-ui exists directly below btn-hide-ui and is disabled in initial markup
  assert.ok(appTsx.includes('id="btn-show-ui"'), 'Missing #btn-show-ui');
  const hideIdx = appTsx.indexOf('id="btn-hide-ui"');
  const showIdx = appTsx.indexOf('id="btn-show-ui"');
  assert.ok(showIdx > hideIdx, '#btn-show-ui must be placed below #btn-hide-ui');
  assert.ok(showIdx - hideIdx < 300, '#btn-show-ui should be right below #btn-hide-ui');
  assert.ok(appTsx.includes('id="btn-show-ui"') && appTsx.includes('disabled'), '#btn-show-ui must be disabled by default');

  // Selection ring is maintained on selected piece in doveMode
  assert.ok(
    engine.includes('squareHighlightsGroup.add(selMesh);') &&
    engine.includes('color: 0xf5d76e'),
    'Selection ring must be rendered on selected piece'
  );

  // Movement hints and suggestions hidden by default in doveMode unless doveHintsVisible
  assert.ok(
    engine.includes('if (doveMode) {') &&
    engine.includes('if (!doveHintsVisible) {') &&
    engine.includes('toggleDoveHints'),
    'Movement hints must be hidden by default in doveMode and enabled via toggleDoveHints/Show UI'
  );

  // Zero instructions / spoilers
  assert.ok(!engine.includes('Faça SOMENTE movimentos errados'), 'Should not give instructions on how to play');
  assert.ok(!appTsx.includes('Você cometeu o erro proibido de'), 'Defeat overlay should not explain the rules');
});

test('Local 2-Player multiplayer on same PC in normal mode', () => {
  const appTsx = fs.readFileSync(path.join(ROOT, 'src/App.tsx'), 'utf-8');
  const engine = fs.readFileSync(path.join(ROOT, 'src/wizardChessEngine.js'), 'utf-8');

  // btn-game-mode in App.tsx
  assert.ok(appTsx.includes('id="btn-game-mode"'), 'Missing #btn-game-mode button');

  // Local game mode support in engine
  assert.ok(engine.includes("gameMode === 'local'"), 'Engine must support local 2-player mode');
  assert.ok(engine.includes('toggleGameMode'), 'Missing toggleGameMode implementation');
  assert.ok(engine.includes('2 Jogadores (Local)'), 'Missing 2 Jogadores status label');
  assert.ok(
    engine.includes("const viewSide = gameMode === 'local' ? 'w' :"),
    'Camera must orient to White in local mode'
  );
});
