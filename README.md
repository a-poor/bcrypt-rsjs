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
bcrypt.compare(my_password, hash); // true

// Validate a password
bcrypt.compare(not_my_password, hash); // false
```
