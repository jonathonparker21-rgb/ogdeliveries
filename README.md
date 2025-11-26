# ogdeliveries
OG Deliveries website

## Deploying to Cloudflare Pages

This project is a static site. The included `wrangler.toml` points Pages to the current directory for its assets, so you can deploy with:

```sh
wrangler pages deploy .
```

If you prefer the Pages dashboard, create a new project, select this repository, and set the build output directory to `.`. Either method avoids the "Missing entry-point to Worker script or to assets directory" error by giving Pages a clear assets path.
