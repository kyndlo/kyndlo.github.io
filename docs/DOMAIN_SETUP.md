# fiveorbit.studio hosting

Configured October 8, 2026. Registrar: Spaceship. DNS provider: Cloudflare, Free plan.

Nameservers: razvan.ns.cloudflare.com and sneh.ns.cloudflare.com.

DNS-only A records at the apex: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153. DNS-only CNAME www → kyndlo.github.io.

GitHub Pages repository: kyndlo/kyndlo.github.io, main branch, root directory. Custom domain and CNAME: fiveorbit.studio.

The rebuilt website and analytics were published in commit 5c8566c. Both Cloudflare and Google public resolvers return the GitHub A records. Cloudflare is active. GitHub approved the certificate and HTTPS enforcement is enabled. HTTPS returns 200 for the root; www redirects to https://fiveorbit.studio/. Cloudflare DNSSEC is enabled and its matching DS record (key tag 2371, algorithm 13, digest type 2) is saved at Spaceship; final DS propagation is pending. No old-domain redirect has been configured.
