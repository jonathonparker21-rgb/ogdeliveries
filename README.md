# ogdeliveries
OG Deliveries website

## Deploying to Cloudflare Pages

This project is a static site. The included `wrangler.toml` points Cloudflare Pages to the current directory for its assets, so you can deploy with either of the following **supported** commands:

```sh
# Deploy to Cloudflare Pages (default npm run deploy)
npm run deploy

# Explicit Pages deploy command
npm run deploy:pages
```

If you prefer the Pages dashboard, create a new project, select this repository, set the build output directory to `.`, and use `npm run deploy` (or `wrangler pages deploy .`) for the deployment command. This avoids the deprecated `wrangler versions upload` workflow entirely.

### If you see `Workers Sites does not support uploading versions through wrangler versions upload`

That error appears when a Pages project or build command still calls the deprecated `wrangler versions upload` command. Update the project’s deploy command to `npm run deploy` (or `wrangler pages deploy .`) so the build uses the supported Pages deployment path.

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
