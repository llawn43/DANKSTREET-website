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

## 1. Turn on GitHub Pages — DONE

Pages is enabled from branch `main`, folder `/ (root)`, and the site is live at:

https://llawn43.github.io/DANKSTREET-website/

It is served by GitHub and no longer depends on your machine. Everything below is
only needed for the custom domain.

(For reference, the setting lives at repo **Settings** to **Pages** to **Build and
deployment**. The repo must stay public for Pages on a free account.)

## 2. Do not set the custom domain before the domain resolves

Learned the hard way on 2026-08-04. Entering a domain under **Settings** to
**Pages** to **Custom domain** commits a `CNAME` file, and from that moment Pages
**stops serving the github.io URL** and 301-redirects it to your custom domain:

```
HTTP/1.1 301 Moved Permanently
Location: http://dankstreetmusic.com/
```

If that domain is not registered yet, the redirect goes nowhere and the site is
unreachable at *both* addresses, even though the build is perfectly fine. GitHub
shows a DNS warning when you save but still saves it.

So the order matters: **register the domain and get DNS resolving first**, then
attach it in GitHub. If you ever need to undo it, delete the `CNAME` file from the
branch and push — that clears the custom domain and the github.io URL starts
working again within about a minute.

## 3. Verify the domain (recommended, do before step 4)

This stops anyone else from ever attaching your domain to their repo.

Go to your GitHub **profile** settings to **Pages** to **Add a domain**. GitHub
gives you a `TXT` record to add at your registrar, then you click verify.

## 4. Point the domain at GitHub

**Do not hand-create a `CNAME` file.** Setting the domain in the UI makes GitHub
commit that file for you, and a hand-made one that disagrees will break the build.

Per step 2, do these in this order:

1. Register `dankstreetmusic.com` at your registrar.
2. At the registrar's DNS panel, add the records below.
3. Confirm they resolve (the `Resolve-DnsName` checks further down).
4. Only then: repo **Settings** to **Pages** to **Custom domain**, type
   `dankstreetmusic.com`, click **Save**.

For the apex domain (`dankstreetmusic.com`) add all four `A` records on name `@`:

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
Resolve-DnsName dankstreetmusic.com -Type A
Resolve-DnsName www.dankstreetmusic.com -Type CNAME
```

5. Once the certificate is issued (can take up to 24h), tick **Enforce HTTPS**
   on the Pages settings screen.

6. Run `git pull` locally to bring down the `CNAME` commit GitHub made, otherwise
   your next push will conflict.

If you register at Cloudflare, set the record's proxy status to **DNS only** (grey
cloud) for setup. If you later turn proxying on, set SSL/TLS mode to **Full** —
the default Flexible mode causes a redirect loop against GitHub Pages.

## 5. Update the absolute URLs

These three lines in `index.html` currently point at the github.io host and are
the only places the hostname is hardcoded anywhere in the site:

- `<link rel="canonical" href="..." />`
- `<meta property="og:url" content="..." />`
- `<meta property="og:image" content="..." />`

They become `https://dankstreetmusic.com/` and
`https://dankstreetmusic.com/assets/img/og-cover.jpg`. They must stay absolute
because social scrapers do not run JS and do not resolve relative URLs.

Leave them on github.io until the domain actually resolves — pointing `og:image`
at a dead host breaks link previews in the meantime.

Commit and push, then paste the domain into
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
