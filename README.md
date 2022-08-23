# bcrypt-rsjs

_created by Austin Poor_

A [bcrypt](https://en.wikipedia.org/wiki/Bcrypt) library for Node.js, written in Rust and [Neon](https://neon-bindings.com/) - designed to replace [bcrypt](https://www.npmjs.com/package/bcrypt), which uses C++.

## Example

```js
const bcrypt = require('bcrypt-rsjs');

const my_password = 'Passw0rd';
const not_my_password = 'tell everyone';

// Hash a password
await bcrypt.hash(my_password);
// $2b$12$MF80o/X4kYVqS4psVu/eKO46fFm5hk6nhqwEykw/joHmR3A0DBX4q

// Hash a password with a custom cost
await bcrypt.hash(my_password, 8);
// $2b$08$zMIjSo9Gd62jtXlHR4eCkullNag4WFpK798jrpytD8Mb/dbW75Nk.

// Validate a password
await bcrypt.compare(my_password, hash);
// true

// Validate a password
await bcrypt.compare(not_my_password, hash);
// false
```

## Benchmarks

Benchmarks were run for `bcrypt-rsjs` (this library), [bcrypt](https://www.npmjs.com/package/bcrypt) (uses C++), and [bcryptjs](https://www.npmjs.com/package/bcryptjs) (which is pure js).

Based on the results below, `bcrypt-rsjs` has comparable performance to the C++ library. Tests can be rerun via `npm run bench`.

### Sync Hash Benchmark

*Runs `n` hashes in sequential order.*

| name | func | cost | n tests | time (ms) | time/hash (ms) |
| ---- | ----- | ----:| -------:| ---------:| --------------:|
| `bcrypt` | `hashSync` | 8 | 1,000 | 12,061.86 | 12.06 |
| `bcryptjs` | `hashSync` | 8 | 1,000 | 16,220.78 | 16.22 |
| `bcrypt-rsjs` | `hashSync` | 8 | 1,000 | 12,717.00 | 12.72 |
| `bcrypt` | `hashSync` | 12 | 100 | 19,437.58 | 194.38 |
| `bcryptjs` | `hashSync` | 12 | 100 | 25,373.67 | 253.74 |
| `bcrypt-rsjs` | `hashSync` | 12 | 100 | 19,902.50 | 199.03 |
| `bcrypt` | `hashSync` | 16 | 10 | 30,637.60 | 3,063.76 |
| `bcryptjs` | `hashSync` | 16 | 10 | 39,685.47 | 3,968.55 |
| `bcrypt-rsjs` | `hashSync` | 16 | 10 | 31,941.44 | 3,194.14 |


### Async Hash Benchmark

*Runs `n` hashes simultaneously, via `Promise.all(hashes)`.*

| name | func | cost | n tests | time (ms) | time/hash (ms) |
| ---- | ----- | ----:| -------:| ---------:| --------------:|
| `bcrypt` | `hash` | 8 | 1,000 | 3,283.85 | 3.28 |
| `bcryptjs` | `hash` | 8 | 1,000 | 15,711.48 | 15.71 |
| `bcrypt-rsjs` | `hash` | 8 | 1,000 | 3,316.77 | 3.32 |
| `bcrypt` | `hash` | 12 | 100 | 5,126.82 | 51.27 |
| `bcryptjs` | `hash` | 12 | 100 | 24,846.76 | 248.47 |
| `bcrypt-rsjs` | `hash` | 12 | 100 | 5,245.11 | 52.45 |
| `bcrypt` | `hash` | 16 | 10 | 9733.09 | 973.31 |
| `bcryptjs` | `hash` | 16 | 10 | 39,921.91 | 3,992.19 |
| `bcrypt-rsjs` | `hash` | 16 | 10 | 9,994.12 | 999.41 |

