# Deploying DANK STREET

The site is a static folder with no build step, so hosting is just "serve these
files". These instructions cover GitHub Pages, which serves straight from the
repo you already push to.

Repo: https://github.com/llawn43/DANKSTREET-website (branch `main`)

## Already done in the repo

- `.nojekyll` so GitHub serves the files as-is instead of running them through Jekyll.
- All asset paths are relative, so the site works both at a `/DANKSTREET-website/`
  subpath and later at a domain root without any changes.
- `canonical`, `og:url`, and `og:image` are absolute (scrapers can't resolve
  relative URLs). They currently point at the github.io address — step 5 below
  swaps them to the real domain.

## 1. Turn on GitHub Pages

1. Go to the repo, then **Settings** to **Pages** (under "Code and automation").
2. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
3. Set the branch to `main` and the folder to `/ (root)`. Click **Save**.

The repo must be public for Pages on a free account. It already is.

## 2. Confirm it works

Give it 1-2 minutes for the first build, then open:

https://llawn43.github.io/DANKSTREET-website/

Click every nav tab, confirm the Spotify embeds load, and turn the Sound toggle
on. If assets 404, the branch or folder in step 1 is wrong.

At this point the site is live in the cloud and no longer depends on your
machine. Everything below is only needed for the custom domain.

## 3. Verify the domain (recommended, do before step 4)

This stops anyone else from ever attaching your domain to their repo.

Go to your GitHub **profile** settings to **Pages** to **Add a domain**. GitHub
gives you a `TXT` record to add at your registrar, then you click verify.

## 4. Point the domain at GitHub

**Do not hand-create a `CNAME` file.** Setting the domain in the UI makes GitHub
commit that file for you, and a hand-made one that disagrees will break the build.

1. Repo **Settings** to **Pages** to **Custom domain**. Type the domain, click **Save**.
2. At your registrar's DNS panel, add the records for your chosen setup.

For an apex domain (`dankstreet.com`) add all four `A` records on name `@`:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Optionally add the matching `AAAA` records on `@` for IPv6:

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

For a `www` subdomain, add one `CNAME` record on name `www` pointing to:

```
llawn43.github.io
```

Note that value has no repository name on the end. If your registrar already
created a default/parking `A` record, delete it first.

GitHub auto-redirects between apex and `www` as long as both are configured, so
setting up both is worth the extra two minutes.

DNS can take up to 24 hours to propagate, though it is usually minutes. Check it
from PowerShell with:

```powershell
Resolve-DnsName dankstreet.com -Type A
Resolve-DnsName www.dankstreet.com -Type CNAME
```

3. Once the certificate is issued (can take up to 24h), tick **Enforce HTTPS**
   on the Pages settings screen.

4. Run `git pull` locally to bring down the `CNAME` commit GitHub made, otherwise
   your next push will conflict.

## 5. Update the absolute URLs

In `index.html`, change these three to the live domain:

- `<link rel="canonical" href="..." />`
- `<meta property="og:url" content="..." />`
- `<meta property="og:image" content="..." />`

The og:image must stay a full absolute URL ending in `/assets/img/og-cover.jpg`.
Commit and push. Then paste the domain into
https://developers.facebook.com/tools/debug/ and hit **Scrape Again** so the
link preview refreshes instead of serving a cached miss.

## Publishing updates after launch

```powershell
cd "C:/Users/lukel/OneDrive/Documents/Automation/1_Output/ArtistOS/draft/dank-street-site"
git add -A
git commit -m "describe the change"
git push
```

Pages rebuilds within about a minute. There is no build step, so what you push is
exactly what ships. Hard-refresh (Ctrl+F5) if you don't see a CSS change.

## Known limitation to decide on

The Merch email form has no backend. With `merch.endpoint` empty in `content.js`
it opens the visitor's mail app pre-addressed to `dankstreets@gmail.com`, which
works but loses anyone without a configured mail client. Before pushing merch
hard, sign up for Formspree, Mailchimp, or Buttondown and paste the POST URL into
`merch.endpoint` — the form already handles the real submit path, so that one
value is the whole change.
