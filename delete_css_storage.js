const fs = require('fs')

// delete community-solid-server storage
// as it adds new account on every test
fs.rmSync('./community-solid-server', { recursive: true, force: true });