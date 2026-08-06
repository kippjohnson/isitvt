# Publish IS IT VT? with GitHub Pages

This folder is the complete static website. It does not need Node, npm, a database, or a GitHub Actions build. Publish the files in this folder at the root of a GitHub repository.

## 1. Verify the domain first

After registering `isitvt.com`, GitHub recommends verifying it before attaching it to a repository. In your personal GitHub settings, open **Pages**, add `isitvt.com` as a verified domain, and create the TXT record GitHub gives you at your DNS provider. Keep that TXT record after verification.

## 2. Create the repository

1. Sign in to GitHub and create a new repository. `isitvt` is a good repository name.
2. Make the repository public if you use GitHub Free. GitHub Pages from private repositories requires an eligible paid plan.
3. Upload the **contents** of this folder to the repository root. Do not upload only the ZIP file and do not add an extra `isitvt-github-pages` folder level.
4. Commit the uploaded files to the `main` branch.

The repository root should contain `index.html`, `styles.css`, `CNAME`, `.nojekyll`, and the image/metadata files. macOS Finder normally hides `.nojekyll`; after uploading, confirm that it appears in the GitHub file list. If it is missing, use **Add file → Create new file** on GitHub, name the file `.nojekyll`, and commit the empty file.

## 3. Enable GitHub Pages

1. Open the repository's **Settings**.
2. Select **Pages** under **Code and automation**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and `/(root)`, then select **Save**.
5. Wait for GitHub to show the published `github.io` address. Test that address before changing DNS.

## 4. Attach isitvt.com

Return to the repository's **Settings → Pages** page:

1. Enter `isitvt.com` under **Custom domain** and save it.
2. Only after the domain is attached in GitHub, configure the DNS records below.

The included `CNAME` file also declares `isitvt.com` as the site's custom domain. Do not rename it or add `https://` to its contents.

## 5. Configure DNS

Remove old records that point the domain to the Mac or the previous host, then create these four `A` records for the apex domain:

| Type | Name/host | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

Also create this record so `www.isitvt.com` redirects correctly:

| Type | Name/host | Value |
| --- | --- | --- |
| CNAME | `www` | `YOUR-GITHUB-USERNAME.github.io` |

Replace `YOUR-GITHUB-USERNAME` with the GitHub account that owns the repository. Do not include the repository name in this DNS target.

Do not use wildcard DNS records. DNS changes can take up to 24 hours to propagate.

## 6. Turn on HTTPS

When the DNS check succeeds, return to **Settings → Pages** and select **Enforce HTTPS**. Certificate issuance can take some time after DNS changes.

## Updating the site later

Upload the replacement static files to the same repository root and commit them to `main`. Keep `CNAME` and `.nojekyll`. GitHub Pages will redeploy automatically.

## Files specific to GitHub Pages

- `CNAME` associates the deployment with `isitvt.com`.
- `.nojekyll` tells GitHub Pages to publish the static files directly without Jekyll processing.
- `404.html` supplies the site's not-found page.
