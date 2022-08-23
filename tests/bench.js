const { performance } = require("node:perf_hooks");

// This library...
const bcrypt_rsjs = require("..");

// The competition...
const bcrypt = require("bcrypt"); // Uses C
const bcryptjs = require("bcryptjs"); // Pure node

const hash_tests = {
  password: "MyPassw0rd?",
  cases: [
    {n: 1_000_000, r: 6},
    {n: 1_000, r: 12},
    {n: 10, r: 15},
  ],
};

console.log(`Testing hash functions...`);
for (let {n, r} of hash_tests.cases) {
  // bcrypt-rsjs -> hash
  let start = performance.now();
  for (let i = 0; i < n; i++) {
    bcrypt_rsjs.hash(hash_tests.password, r);
  }
  let end = performance.now();
  let diff = end - start;
  let per = diff / n;
  console.log(`| bcrypt-rsjs | hash | ${n} | ${r} | ${per} ms/hash |`)

  // bcrypt -> hash
  start = performance.now();
  for (let i = 0; i < n; i++) {
    bcrypt.hashSync(hash_tests.password, r);
  }
  end = performance.now();
  diff = end - start;
  per = diff / n;
  console.log(`| bcrypt | hash | ${n} | ${r} | ${per} ms/hash |`)

  // bcrypt-js -> hash
  start = performance.now();
  for (let i = 0; i < hash_tests.n; i++) {
    bcryptjs.hashSync(hash_tests.password, r);
  }
  end = performance.now();
  diff = end - start;
  per = diff / n;
  console.log(`| bcryptjs | hash | ${n} | ${r} | ${per} ms/hash |`)
}

