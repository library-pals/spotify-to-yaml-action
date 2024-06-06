# spotify-to-yaml-action

Export a Spotify playlist to Yaml.

This workflow can:

- Export your public Spotify playlist.
  - [Example workflow](#set-up-the-workflow)
- Automatically export last season's playlists.
  - [Seasonal set up](#seasonal-set-up)
  - [Example seasonal workflow](#additional-example-workflows)

## Set up

To connect your Spotify account to this workflow, set the following [secrets to your repository](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository). You can find these values from the [Spotify API dashboard](https://developer.spotify.com/dashboard):

- `SpotifyClientID`
- `SpotifyClientSecret`

## Seasonal set up

To take part in season playlist export, you will need to name your Spotify playlists with the following pattern: `YYYY {season}`. If you use different names for the seasons, you can use the `season-names` [action input](#action-options) to reflect that. Examples:

- `2021 Fall`
- `2021/2022 Winter`
- `2022 Spring`
- `2022 Summer`

<!-- START GENERATED DOCUMENTATION -->

## Set up the workflow

To use this action, create a new workflow in `.github/workflows` and modify it as needed:

```yml
name: Save Spotify playlist

on:
  workflow_dispatch:
    inputs:
      playlist-name:
        description: Your Spotify playlist name that you want to export. Required for non-seasonal playlist export.
        required: true
        type: string

permissions:
  contents: write

jobs:
  spotify-to-yaml:
    runs-on: ubuntu-latest
    name: Save Spotify playlist and thumbnail
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Save the playlist
        uses: library-pals/spotify-to-yaml-action@v8.2.0
        with:
          spotify-username: "katydecorah"
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

### Additional example workflows

<details>
<summary>Save seasonal or any playlist</summary>

```yml
name: Save seasonal or any playlist

on:
  # Run every three months on the 20th to get the seasonal playlist
  schedule:
    - cron: "00 01 20 Mar,Jun,Sep,Dec *"
  # Run on demand to get any playlist
  workflow_dispatch:
    inputs:
      playlist-name:
        description: Your Spotify playlist name that you want to export.
        type: string

permissions:
  contents: write

jobs:
  spotify-to-yaml:
    runs-on: ubuntu-latest
    name: Save Spotify playlist and thumbnail
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Save the playlist
        uses: library-pals/spotify-to-yaml-action@v8.2.0
        with:
          spotify-username: "katydecorah"
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

</details>

## Action options

- `spotify-username`: Required. Your Spotify username.

- `filename`: The YAML file to write your playlists. Default: `_data/playlists.yml`.

- `season-names`: The season names in order by the season that ends in March, June, September, and then December. Default: `Winter,Spring,Summer,Fall`.

## Trigger the action

To trigger the action, [create a workflow dispatch event](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event) with the following body parameters:

```js
{
  "ref": "main", // Required. The git reference for the workflow, a branch or tag name.
  "inputs": {
    "playlist-name": "", // Required. Your Spotify playlist name that you want to export. Required for non-seasonal playlist export.
  }
}
```

<!-- END GENERATED DOCUMENTATION -->
