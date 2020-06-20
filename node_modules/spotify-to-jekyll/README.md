# spotify-to-jekyll

Turn a Spotify playlist into a Jekyll post.

## Set up

1. Create a [Spotify app](https://developer.spotify.com/dashboard/applications).
2. From terminal, export the following variables using the information from your Spotify app:

```
echo "export SpotifyClientID=0000ffff0000ffff0000ffff0000ffff0000ffff" >> ~/.bash_profile
echo "export SpotifyClientSecret=0000ffff0000ffff0000ffff0000ffff0000ffff" >> ~/.bash_profile
```

Install the app:

```
npm install spotify-to-jekyll
```

Open the directory you wish to download the Spotify playlist and run in terminal:

```
spotify-to-jekyll <playlist-id>
```

You can find your playlist's ID in its URL.

## Notes

There are a few assumptions made about how playlists are named in Spotify and the Jekyll structure.

- Spotify playlists are named `YYYY season`. For example: `2018 Summer` and `2018/2019 Winter`. You can [manipulate the ingested playlist name in the `formatTracks` function](https://github.com/katydecorah/spotify-to-jekyll/blob/fc88b4eff599074ebae58fa3dd8e574761edb050/index.js#L44-L47).
- Jekyll posts are in `playlists/_posts/`. You can [change that in the `createPost` function](https://github.com/katydecorah/spotify-to-jekyll/blob/fc88b4eff599074ebae58fa3dd8e574761edb050/index.js#L69).
- Images are in `img/playlists/` directories. You can [change that in the `buildPost` function](https://github.com/katydecorah/spotify-to-jekyll/blob/fc88b4eff599074ebae58fa3dd8e574761edb050/index.js#L84) and [`saveImage` function](https://github.com/katydecorah/spotify-to-jekyll/blob/fc88b4eff599074ebae58fa3dd8e574761edb050/index.js#L123).
