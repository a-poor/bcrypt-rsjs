# bcrypt-rsjs

_created by Austin Poor_

A [bcrypt](https://en.wikipedia.org/wiki/Bcrypt) library for Node.js, written in Rust and [Neon](https://neon-bindings.com/) -- designed to replace [node-bcrypt-js](https://www.npmjs.com/package/bcrypt), which uses C.

## Example

```js
const bcrypt = require('bcrypt-rsjs');

const my_password = 'Passw0rd';
const not_my_password = 'tell everyone';

// Hash a password
const hash = bcrypt.hash(my_password);
console.log(hash);
// $2b$12$MF80o/X4kYVqS4psVu/eKO46fFm5hk6nhqwEykw/joHmR3A0DBX4q

// Hash a password with a custom cost
bcrypt.hash(my_password, 8);
// $2b$08$zMIjSo9Gd62jtXlHR4eCkullNag4WFpK798jrpytD8Mb/dbW75Nk.

// Validate a password
bcrypt.compare(my_password, hash);
// true

// Validate a password
bcrypt.compare(not_my_password, hash);
// false
```

## Benchmark

### Hash Benchmark

| Library | Function | # of Times Run | # of Rounds | Time |
| ------- | -------- | --------------:| -----------:| ---- |
| bcrypt-rsjs | hash | 1,000,000 | 6 | 3.1567075852000044 ms/hash |
| bcrypt | hash | 1,000,000 | 6 | 3.035969505900003 ms/hash |
| bcryptjs | hash | 1,000,000 | 6 | 5.300000309944153e-9 ms/hash |
| bcrypt-rsjs | hash | 1,000 | 12 | 198.82444259999693 ms/hash |
| bcrypt | hash | 1,000 | 12 | 191.76827099999787 ms/hash |
| bcryptjs | hash | 1,000 | 12 | 0.0000025999993085861207 ms/hash |
| bcrypt-rsjs | hash | 10 | 15 | 1590.2368800006807 ms/hash |
| bcrypt | hash | 10 | 15 | 1532.2505499996246 ms/hash |
| bcryptjs | hash | 10 | 15 | 0.00029999986290931704 ms/hash |

