# fiveorbit.studio hosting

Configured October 8, 2026. Registrar: Spaceship. DNS provider: Cloudflare, Free plan.

Nameservers: razvan.ns.cloudflare.com and sneh.ns.cloudflare.com.

DNS-only A records at the apex: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153. DNS-only CNAME www → kyndlo.github.io.

GitHub Pages repository: kyndlo/kyndlo.github.io, main branch, root directory. Custom domain and CNAME: fiveorbit.studio.

The rebuilt website and analytics were published in commit 5c8566c. Both Cloudflare and Google public resolvers return the GitHub A records. GitHub requested a TLS certificate; HTTPS enforcement can be enabled once issuance finishes. Cloudflare activation and DNSSEC restoration must be verified after propagation. No old-domain redirect has been configured.
