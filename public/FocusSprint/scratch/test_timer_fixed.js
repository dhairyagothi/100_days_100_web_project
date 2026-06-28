const fs = require('fs');
const vm = require('vm');

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) { passed++; console.log(`  ✅ ${label}`); }
  else { failed++; console.error(`  ❌ ${label}`); }
}

const ctx = {
  console, Math, JSON, Array, Object, String, Number,
  mockNow: 1000000,
  mockIntervalFn: null,
  Date: {
    now: () => ctx.mockNow
  },
  setInterval: (fn, ms) => {
    ctx.mockIntervalFn = fn;
    return 123;
  },
  clearInterval: () => {
    ctx.mockIntervalFn = null;
  },
  assert,
};

vm.createContext(ctx);

// Load timer
vm.runInContext(fs.readFileSync('js/timer.js', 'utf8'), ctx, { filename: 'js/timer.js' });
console.log('✅ js/timer.js loaded');

vm.runInContext(`
  const timer = new FocusTimer();

  // Test 1: Config & Initial State
  timer.configure('Focus Segment', 25); // 25m = 1500s
  assert('Initial remainingSeconds is 1500', timer.state.remainingSeconds === 1500);
  assert('Initial durationMinutes is 25', timer.state.durationMinutes === 25);
  assert('Initial sessionName is Focus Segment', timer.state.sessionName === 'Focus Segment');

  // Test 2: Start Timer
  timer.start();
  assert('isRunning is true', timer.state.isRunning === true);
  assert('isPaused is false', timer.state.isPaused === false);
  assert('startedAt matches current time', timer.state.startedAt === 1000000);

  // Test 3: Normal Tick
  mockNow += 5000; // Pass 5 seconds (mockNow = 1005000)
  mockIntervalFn(); // trigger the tick
  assert('remainingSeconds decreased by 5', timer.state.remainingSeconds === 1495);
  assert('getProgress returns 0% (rounded)', timer.getProgress() === 0);

  // Test 4: Pause Timer
  timer.pause();
  assert('isPaused is true', timer.state.isPaused === true);
  assert('remainingSeconds is preserved at 1495', timer.state.remainingSeconds === 1495);
  assert('interval is cleared', mockIntervalFn === null);

  // Test 5: Time Pass While Paused (should not affect timer)
  mockNow += 10000; // Wait 10 seconds (mockNow = 1015000)
  assert('remainingSeconds still 1495 while paused', timer.state.remainingSeconds === 1495);

  // Test 6: Resume Timer
  timer.resume();
  assert('isPaused is false', timer.state.isPaused === false);
  assert('interval is active again', mockIntervalFn !== null);

  // Test 7: Tick After Resume
  mockNow += 2000; // Run for 2 seconds (mockNow = 1017000)
  mockIntervalFn(); // trigger the tick
  // Total elapsed = 5s (first run) + 2s (second run) = 7s. Remaining = 1500 - 7 = 1493
  assert('remainingSeconds correctly reflects accumulated + elapsed time', timer.state.remainingSeconds === 1493);

  // Test 8: Large jump (simulating background tab switch / sleep mode)
  mockNow += 60000; // Jump 60 seconds (mockNow = 1077000)
  mockIntervalFn(); // trigger tick
  // Total elapsed = 5s (first run) + 2s (second run) + 60s (jump) = 67s. Remaining = 1500 - 67 = 1433
  assert('remainingSeconds correctly catches up on large jump', timer.state.remainingSeconds === 1433);

  // Test 9: Run to completion
  mockNow += 1433000; // Pass remaining 1433 seconds (mockNow = 2510000)
  let completeCalled = false;
  timer.on('complete', (data) => {
    completeCalled = true;
    assert('complete callback returns sessionName', data.name === 'Focus Segment');
    assert('complete callback returns durationMinutes', data.duration === 25);
  });
  mockIntervalFn(); // trigger tick
  assert('complete was triggered', completeCalled === true);
  assert('isRunning is false after completion', timer.state.isRunning === false);
  assert('remainingSeconds is 0', timer.state.remainingSeconds === 0);

  // Test 10: Reset
  timer.configure('Another Session', 10); // 600s
  timer.start();
  mockNow += 1000;
  mockIntervalFn();
  assert('Running session shows remainingSeconds = 599', timer.state.remainingSeconds === 599);
  timer.reset();
  assert('After reset isRunning is false', timer.state.isRunning === false);
  assert('After reset remainingSeconds is totalSeconds (600)', timer.state.remainingSeconds === 600);
`, ctx, { filename: 'test' });

console.log(`\n${'='.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
else console.log('\n✅ ALL TIMER VERIFICATION TESTS PASSED');
