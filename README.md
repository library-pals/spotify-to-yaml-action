# spotify-to-yaml-action

Export a public Spotify playlist to YAML.

## Set up

To connect your Spotify account to this workflow, set the following [secrets to your repository](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository). You can find these values from the [Spotify API dashboard](https://developer.spotify.com/dashboard):

- `SpotifyClientID`
- `SpotifyClientSecret`

In your workflow, you can define `playlist-name` as a workflow dispatch input or an action input. If both are set, the workflow dispatch input will take precedence.

<!-- START GENERATED DOCUMENTATION -->

## Set up the workflow

To use this action, create a new workflow in `.github/workflows` and modify it as needed:

```yml
name: Save Spotify playlist

on:
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

### Additional example workflows

<details>
<summary>Export playlists on a schedule</summary>

```yml
name: Export playlists on a schedule
run-name: Export playlist ${{ inputs['playlist-name'] }}

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
      # For this Spotify user, they have a predicable schem for setting the playlist name
      # Examples: 2019/2020 Winter, 2020 Spring, 2020 Summer, 2020 Fall
      # This step sets the playlist name based on the current month when the workflow runs
      - name: Determine Playlist Name Based on Season
        run: |
          MONTH=$(date +%m)
          YEAR=$(date +%Y)
          case $MONTH in
            03)
              echo "PLAYLIST_NAME=$(($YEAR - 1))/${YEAR} Winter" >> $GITHUB_ENV
              ;;
            06)
              echo "PLAYLIST_NAME=${YEAR} Spring" >> $GITHUB_ENV
              ;;
            09)
              echo "PLAYLIST_NAME=${YEAR} Summer" >> $GITHUB_ENV
              ;;
            12)
              echo "PLAYLIST_NAME=${YEAR} Fall" >> $GITHUB_ENV
              ;;
          esac
      # This step saves the playlist using the determined name
      - name: Export the playlist
        uses: library-pals/spotify-to-yaml-action@v8.2.0
        with:
          spotify-username: "katydecorah"
          # If the playlist name is provided, use it
          # The workflow_dispatch input playlist-name takes precedence
          playlist-name: ${{ env.PLAYLIST_NAME }}
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

- `playlist-name`: Your Spotify playlist name that you want to export.

## Trigger the action

To trigger the action, [create a workflow dispatch event](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event) with the following body parameters:

```js
{
  "ref": "main", // Required. The git reference for the workflow, a branch or tag name.
  "inputs": {
    "playlist-name": "", // Your Spotify playlist name that you want to export.
  }
}
```

<!-- END GENERATED DOCUMENTATION -->
