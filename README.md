# spotify-to-jekyll-action

Turn a Spotify playlist into a Jekyll post.


<!-- START GENERATED DOCUMENTATION -->

## Set up the workflow

To use this action, create a new workflow in `.github/workflows` and modify it as needed:

```yml
# on: [push]

jobs:
  spotify_to_jekyll:
    runs-on: ubuntu-latest
    name: Save Spotify playlist and thumbnail
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Fetch playlist
        uses: katydecorah/spotify-to-jekyll-action@v5.0.0
        env:
          SpotifyClientID: ${{ secrets.SpotifyClientID }}
          SpotifyClientSecret: ${{ secrets.SpotifyClientSecret}}
          SpotifyUser: ${{ secrets.SpotifyUser }}
          ImgDir: img/playlists
          UpdateDataFile: playlists.yml
      - name: Commit files
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A && git commit -m "🎵 ${{ env.playlist }}"
          git push "https://${GITHUB_ACTOR}:${{secrets.GITHUB_TOKEN}}@github.com/${GITHUB_REPOSITORY}.git" HEAD:${GITHUB_REF}
```<!-- END GENERATED DOCUMENTATION -->
