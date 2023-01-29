# spotify-to-yaml-action

Export a seasonal Spotify playlist to YAML.

At the end of each season, the workflow will fetch last season's playlists, add the the contents to `_data/playlist.yml` and save the playlist thumbnail image to the repository.

## Set up

This workflow requires that you name your Spotify playlists using the following format: `YYYY {season}`. If you use different names for the seasons, you can use the `seasonNames` [action input](#action-options) to reflect that. Examples:

- `2021 Fall`
- `2021/2022 Winter`
- `2022 Spring`
- `2022 Summer`

You must also set the following [secrets to your repository](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository) to connect to Spotify. You can find these values from the [Spotify API dashboard](https://developer.spotify.com/dashboard):

- `SpotifyClientID`
- `SpotifyClientSecret`

<!-- START GENERATED DOCUMENTATION -->

## Set up the workflow

To use this action, create a new workflow in `.github/workflows` and modify it as needed:

```yml
name: Save Spotify playlist
on:
  schedule:
    - cron: "00 01 20 Mar,Jun,Sep,Dec *"
  workflow_dispatch: # enables run button on github.com

jobs:
  spotify_to_jekyll:
    runs-on: macOS-latest
    name: Save Spotify playlist and thumbnail
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Save the playlist
        uses: katydecorah/spotify-to-yaml-action@v7.1.0
        with:
          spotifyUser: "katydecorah"
        env:
          SpotifyClientID: ${{ secrets.SpotifyClientID }}
          SpotifyClientSecret: ${{ secrets.SpotifyClientSecret}}
          SpotifyUser: ${{ secrets.SpotifyUser }}
      - name: Save the thumbnail
        run: curl "${{ env.PlaylistImage }}" -o "img/playlists/${{ env.PlaylistImageOutput }}"
      - name: Commit files
        run: |
          git pull
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A && git commit -m "🎵 ${{ env.playlist }}"
          git push
```

## Action options

- `spotifyUser`: Required. Your Spotify username.
- `fileName`: The YAML file to write your playlists. Default: `_data/playlists.yml`.
- `seasonNames`: The season names in order by the season that ends in March, June, September, and then December. Default: `Winter,Spring,Summer,Fall`.
<!-- END GENERATED DOCUMENTATION -->
