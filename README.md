# ogdeliveries
OG Deliveries website

## Deploying to Cloudflare Pages

This project is a static site. The included `wrangler.toml` points Pages to the current directory for its assets and defines the worker entrypoint via `main = "./workers-site/index.js"`, so you can deploy with either of the following **supported** commands:

```sh
# Deploy the Worker-backed static site
npm run deploy:worker

# Deploy to Cloudflare Pages with the same assets bucket (default npm run deploy)
npm run deploy
```

If you prefer the Pages dashboard, create a new project, select this repository, set the build output directory to `.`, and use `npm run deploy` (or `wrangler pages deploy .`) for the deployment command. Either method avoids the "Missing entry-point to Worker script or to assets directory" error by giving Pages a clear assets path.

### If you see `Workers Sites does not support uploading versions through wrangler versions upload`

That error appears when using the deprecated `wrangler versions upload` command, which is not supported for Workers Sites. Switch to one of the supported deploy commands above instead of `wrangler versions upload`.

These commands bundle the static assets and worker entrypoint correctly, bypassing the `wrangler versions upload` limitation.

## Publishing the site to GitHub

If you do not see these files on GitHub, the repository likely has no remote configured. Add your GitHub remote, then push the branch:

```sh
# replace the URL with your GitHub repo
git remote add origin https://github.com/<your-username>/<your-repo>.git

# push the current branch (work) to GitHub
git push -u origin work
```

If you prefer a `main` branch on GitHub, rename the branch locally before pushing:

```sh
git branch -m main
git push -u origin main
```
