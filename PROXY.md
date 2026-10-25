# Setting up a CORS proxy for eperiodica-explorer

## Contents

- [What works without a proxy?](#what-works-without-a-proxy)
- [Your own proxy with Cloudflare Workers](#your-own-proxy-with-cloudflare-workers)
  - [Deploy in the Cloudflare dashboard](#deploy-in-the-cloudflare-dashboard)
  - [Deploy with Wrangler](#deploy-with-wrangler)
- [Entering the proxy in the tool](#entering-the-proxy-in-the-tool)

For security reasons (CORS), e-periodica allows web pages to load IIIF manifests, and the image server of ETH Library allows page images, but the OAI-PMH interface is blocked for browser scripts. A CORS proxy forwards these requests and thereby unlocks all functions of the tool. Back to the [README](README.md).

## What works without a proxy?

| Content | without proxy | with proxy |
|---|---|---|
| Article details, preview, page selection, IIIF manifest, page images | yes | yes |
| Full text by text recognition (plain text, hOCR, PAGE XML) | yes | yes |
| DOI as input, DataCite metadata | yes | yes |
| Metadata as JSON/CSV, RIS, BibTeX | from DataCite (or simplified from IIIF) | Dublin Core from OAI-PMH |
| Metadata as XML (Dublin Core) | as a direct link | yes, also in the ZIP |
| Harvest a collection, check count, current platform details | no (links to the OAI interface; set list as snapshot) | yes |

PDFs cannot be downloaded even with a proxy, as e-periodica delivers them only after a verification in the browser; the tool links to them.

## Your own proxy with Cloudflare Workers

Public proxies see all requests and are often throttled, so for regular use run your own. The folder [`proxy/`](proxy/) contains a minimal [Cloudflare Worker](https://developers.cloudflare.com/workers/) that only forwards requests to `www.e-periodica.ch` and to the e-periodica images on `iiif.library.ethz.ch`. All other addresses are rejected, so it cannot be misused as an open proxy. The free Cloudflare plan is sufficient for normal use.

### Deploy in the Cloudflare dashboard

1. Create a free Cloudflare account.
2. Create a new worker (Workers & Pages → Create → Worker) and deploy it.
3. Click «Edit code», replace the code with the contents of [`proxy/worker.js`](proxy/worker.js) and click «Deploy».

The worker address looks like `https://eperiodica-cors-proxy.<your-subdomain>.workers.dev`. Opening it without parameters returns «Nur e-periodica erlaubt» – that is expected.

### Deploy with Wrangler

1. Create a free Cloudflare account and install Node.js.
2. In the `proxy/` folder, run `npx wrangler login` and then `npx wrangler deploy`. Wrangler prints the worker address.

## Entering the proxy in the tool

Open «Settings» in the tool and enter

```
https://eperiodica-cors-proxy.<your-subdomain>.workers.dev/?url={url}
```

as the proxy address, then click «Test proxy». `{url}` is replaced by the encoded e-periodica address; without `{url}`, the address is appended. The proxy address is stored only in your browser.
