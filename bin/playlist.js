#!/usr/bin/env node

const script = require('../index.js');

script.playlist({}, null, (err, callback) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(callback);
});
