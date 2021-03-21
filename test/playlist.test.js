"use strict";

const playlist = require("../src/index.js");
const test = require("tape");

process.env.YEAR = 2019;

test("[learnPlaylistName], Summer", (assert) => {
  process.env.MONTH = 8;
  return playlist.learnPlaylistName().then((d) => {
    assert.deepEqual(d, `${process.env.YEAR} Summer`);
    assert.end();
  });
});

test("[learnPlaylistName], Fall", (assert) => {
  process.env.MONTH = 11;
  return playlist.learnPlaylistName().then((d) => {
    assert.deepEqual(d, `${process.env.YEAR} Fall`);
    assert.end();
  });
});

test("[learnPlaylistName], Winter", (assert) => {
  process.env.MONTH = 2;
  return playlist.learnPlaylistName().then((d) => {
    assert.deepEqual(d, `${process.env.YEAR - 1}/${process.env.YEAR} Winter`);
    assert.end();
  });
});

test("[learnPlaylistName], Spring", (assert) => {
  process.env.MONTH = 5;
  return playlist.learnPlaylistName().then((d) => {
    assert.deepEqual(d, `${process.env.YEAR} Spring`);
    assert.end();
  });
});
