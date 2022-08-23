const { performance } = require("node:perf_hooks");

const bcryptrsjs = require(".."); // This library - uses Rust
const bcrypt = require("bcrypt"); // Uses C
const bcryptjs = require("bcryptjs"); // Pure node


const password = "MyPassw0rd?";
const rounds = [
  { c: 8, n: 1_000 },
  { c: 12, n: 100 },
  { c: 16, n: 10 },
];


const roundTo = (n, p) => Math.round(n * Math.pow(10, p)) / Math.pow(10, p);

function testHashSync(impl, cost, n) {
  const start = performance.now();
  for (let i = 0; i < n; i++) {
    _ = impl.hashSync(password, cost);
  }
  const end = performance.now();
  return end - start;
}

async function testHashAsync(impl, cost, n) {
  const start = performance.now();
  const ps = [];
  for (let i = 0; i < n; i++) {
    ps.push(impl.hash(password, cost));
  }
  await Promise.all(ps);
  const end = performance.now();
  return end - start;
}


function runSyncHashTest() {
  console.log("Starting sync tests");

  // Store the results
  const res = [];

  // Test bcrypt/sync
  let t;
  for (let r of rounds) {
    console.log(`> lib=bcrypt       sync=true n=${r.n} cost=${r.c}`);
    t = testHashSync(bcrypt, r.c, r.n);
    res.push({
      name: "bcrypt",
      sync: true,
      cost: r.c,
      n: r.n,
      time: t,
      timePer: t / r.n,
    });

    // Test bcrypt-js/sync
    console.log(`> lib=bcrypt-js    sync=true n=${r.n} cost=${r.c}`);
    t = testHashSync(bcryptjs, r.c, r.n);
    res.push({
      name: "bcryptjs",
      sync: true,
      cost: r.c,
      n: r.n,
      time: t,
      timePer: t / r.n,
    });

    // Test bcrypt-rs-js/sync
    console.log(`> lib=bcrypt-rs-js sync=true n=${r.n} cost=${r.c}`);
    t = testHashSync(bcryptrsjs, r.c, r.n);
    res.push({
      name: "bcrypt-rsjs",
      sync: true,
      cost: r.c,
      n: r.n,
      time: t,
      timePer: t / r.n,
    });
  }

  // Print the results
  console.log('| name | cost | n tests | time (ms) | time/hash (ms) |');
  console.log('| ---- | ----:| -------:| ---------:| --------------:|');
  for (let r of res) {
    console.log(`| ${r.name} | ${r.cost} | ${r.n} | ${roundTo(r.time, 2)} | ${roundTo(r.timePer, 2)} |`);
  }
  console.log();
  console.log("Sync tests complete.");
}

async function runAsyncHashTest() {
  console.log("Running async tests...");

  // Store the results
  const res = [];

  // Test bcrypt/async
  let t;
  for (let r of rounds) {
    console.log(`> lib=bcrypt       sync=false n=${r.n} cost=${r.c}`);
    t = await testHashAsync(bcrypt, r.c, r.n);
    res.push({
      name: "bcrypt",
      sync: false,
      cost: r.c,
      n: r.n,
      time: t,
      timePer: t / r.n,
    });

    // Test bcrypt-js/sync
    console.log(`> lib=bcrypt-js    sync=false n=${r.n} cost=${r.c}`);
    t = await testHashAsync(bcryptjs, r.c, r.n);
    res.push({
      name: "bcryptjs",
      sync: false,
      cost: r.c,
      n: r.n,
      time: t,
      timePer: t / r.n,
    });

    // Test bcrypt-rs-js/sync
    console.log(`> lib=bcrypt-rs-js sync=false n=${r.n} cost=${r.c}`);
    t = await testHashAsync(bcryptrsjs, r.c, r.n);
    res.push({
      name: "bcrypt-rsjs",
      sync: false,
      cost: r.c,
      n: r.n,
      time: t,
      timePer: t / r.n,
    });
  }

  // Print the results
  console.log();
  console.log('| name | cost | n tests | time (ms) | time/hash (ms) |');
  console.log('| ---- | ----:| -------:| ---------:| --------------:|');
  for (let r of res) {
    console.log(`| ${r.name} | ${r.cost} | ${r.n} | ${roundTo(r.time, 2)} | ${roundTo(r.timePer, 2)} |`);
  }
  console.log();
  console.log("Async tests complete.");
}


async function main() {
  await runAsyncHashTest();
  runSyncHashTest();
}
main();
