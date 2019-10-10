'use strict';

const playlist = require('../index.js');
const test = require('tape');

const res = require('./fixtures/response.json');

const formatted = {
  name: '2017/2018 Winter',
  formatted_name: '2017-2018-winter',
  url:
    'https://open.spotify.com/user/katydecorah/playlist/0EXTe6h9sAjUkX1kwpE2y3',
  tracks: [
    {
      name: 'Black Willow - Single Version',
      artist: 'Loma',
      album: 'Black Willow'
    },
    { name: 'Trophy Daughter', artist: 'Sur Back', album: 'Kitsch' },
    { name: 'Truth Hurts', artist: 'Lizzo', album: 'Truth Hurts' },
    { name: 'Fleas', artist: 'Babeo Baggins', album: 'Fleas' },
    { name: 'Night Shift', artist: 'Lucy Dacus', album: 'Night Shift' },
    { name: '4EVA', artist: 'Lapalux, Talvi', album: 'Ruinism' },
    { name: 'Breezeblocks', artist: 'alt-J', album: 'An Awesome Wave' }
  ],
  image:
    'https://mosaic.scdn.co/640/3cb9a164c04b6fe71198fcbe544bfebfdde8ffc845d842893fc343bff9d0a7e7362dec10c33de4d08ca9f28e0a6a923a969f3975a752b20fea5a254bec76e692ec570600aef07eef4919509b3c80d479'
};

test('[buildPost]', assert => {
  assert.equal(
    playlist.buildPost(formatted),
    '---\ntitle: 2017/2018 Winter\nspotify: https://open.spotify.com/user/katydecorah/playlist/0EXTe6h9sAjUkX1kwpE2y3\nimage: img/playlists/2017-2018-winter.png\npermalink: /playlists/2017-2018-winter/\n---\n\n[Listen on Spotify](https://open.spotify.com/user/katydecorah/playlist/0EXTe6h9sAjUkX1kwpE2y3)\n\n* Black Willow - Single Version, Loma\n* Trophy Daughter, Sur Back\n* Truth Hurts, Lizzo\n* Fleas, Babeo Baggins\n* Night Shift, Lucy Dacus\n* 4EVA, Lapalux, Talvi\n* Breezeblocks, alt-J\n'
  );
  assert.end();
});

test('[getTracks]', assert => {
  assert.deepEqual(playlist.getTracks(res.tracks), [
    {
      name: 'Black Willow - Single Version',
      artist: 'Loma',
      album: 'Black Willow'
    },
    { name: 'Trophy Daughter', artist: 'Sur Back', album: 'Kitsch' },
    { name: 'Truth Hurts', artist: 'Lizzo', album: 'Truth Hurts' },
    { name: 'Fleas', artist: 'Babeo Baggins', album: 'Fleas' },
    { name: 'Night Shift', artist: 'Lucy Dacus', album: 'Night Shift' },
    { name: '4EVA', artist: 'Lapalux, Talvi', album: 'Ruinism' },
    { name: 'Breezeblocks', artist: 'alt-J', album: 'An Awesome Wave' }
  ]);
  assert.end();
});

test('[formatTracks]', assert => {
  return playlist.formatTracks(res).then(d => {
    assert.deepEqual(d, formatted);
    assert.end();
  });
});
