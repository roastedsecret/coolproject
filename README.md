# joinkova.eu website

Static site for GitHub Pages. No build step: every file here is served as-is.

## Publishing on GitHub Pages
1. Put the contents of this folder at the root of a GitHub repository.
2. In the repository, open **Settings → Pages**, set the source to the main branch and the root folder.
3. The `CNAME` file already contains `joinkova.eu`. At your domain registrar, point joinkova.eu at GitHub Pages (four `A` records to GitHub's IPs, as listed in GitHub's "Managing a custom domain" docs), then tick **Enforce HTTPS** in Settings → Pages.

## When a new installer is ready
Edit the top of `assets/site.js`:
- `downloadUrl`: direct link to the installer, e.g. `https://github.com/<owner>/<repo>/releases/latest/download/Kova-Setup.exe`
- `version`, `fileSize`, `sha256`

Until `downloadUrl` is set, the download-starting page says the link isn't set up yet.

## Updating the status page
Edit `status.json` and commit. The page updates within a minute or two.

Each service's `status` is one of: `operational`, `degraded`, `outage`, `maintenance`.

To report an incident, add it to `incidents` (newest first):

```json
{
  "title": "Contracts not loading for some workspaces",
  "status": "investigating",
  "started": "2026-11-25T13:20:00+01:00",
  "updates": [
    { "time": "2026-11-25T13:25:00+01:00", "text": "We're looking into reports that contracts fail to open." }
  ]
}
```

Incident `status` is one of: `investigating`, `identified`, `monitoring`, `resolved`. When it's fixed, set it to `resolved`, add `"resolved": "<time>"` and a final update, and set the affected services back to `operational`. Also update `"updated"` at the top each time.

## Privacy
The site sets no cookies, stores nothing in the browser and loads nothing from third parties (fonts are in `assets/fonts`). Keep it that way, or the privacy policy and the "no cookie banner" decision need revisiting.

## Invite links (join page)
`join.html` (served at `joinkova.eu/join`) hands invite links to the Kova app. The invite token goes after the `#`, so it never reaches any server:

    https://joinkova.eu/join#<token>  →  opens kova://join?token=<token>

Test-build links (hardcoded in the app's test mode):
- Works: `https://joinkova.eu/join#xkzTQ68cLmpaqQmLq-0hq6_JiwwAu3ULpHoh3TcU_s0`
- Shows "expired": `https://joinkova.eu/join#zpuZCbOjHOhbGtZTMelWutb1XX16Pem-_ge3sFsGkqg`
