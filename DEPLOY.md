# Publicação — GitHub Pages + domínios

O site público vive em `docs/` (HTML/CSS estático, sem build).

## 1. Ativar o GitHub Pages (uma vez)

1. GitHub → repositório `abrazileira` → **Settings → Pages**.
2. **Source:** *Deploy from a branch*.
3. **Branch:** `gd/awesome-cerf-baxxba` (o branch atual do repositório; passa a `main` quando houver) · pasta **`/docs`** → **Save**.
4. Em 1–2 minutos fica online em `https://rgvduarte.github.io/abrazileira/`.

Todos os links internos são relativos, por isso o site funciona tanto neste endereço
de pré-visualização como no domínio final.

## 2. Ligar `abrazileira.com` (domínio principal, Cloudflare)

No Cloudflare → `abrazileira.com` → **DNS → Records** (proxy **desligado** — nuvem cinzenta — para o GitHub emitir o certificado HTTPS):

| Tipo  | Nome  | Valor                  |
|-------|-------|------------------------|
| A     | `@`   | `185.199.108.153`      |
| A     | `@`   | `185.199.109.153`      |
| A     | `@`   | `185.199.110.153`      |
| A     | `@`   | `185.199.111.153`      |
| AAAA  | `@`   | `2606:50c0:8000::153`  |
| AAAA  | `@`   | `2606:50c0:8001::153`  |
| AAAA  | `@`   | `2606:50c0:8002::153`  |
| AAAA  | `@`   | `2606:50c0:8003::153`  |
| CNAME | `www` | `rgvduarte.github.io`  |

Depois:

1. GitHub → **Settings → Pages → Custom domain:** `abrazileira.com` → **Save**.
2. Esperar o check de DNS ficar verde e ligar **Enforce HTTPS**.
3. Criar o ficheiro `docs/CNAME` com o conteúdo `abrazileira.com` (o GitHub cria-o sozinho ao gravar o passo 1).
4. Recomendado: verificar o domínio na conta (GitHub → *Settings* da conta → *Pages* → *Add a domain*),
   para impedir que outra conta o reclame.

> Não criar o `CNAME` antes de o DNS estar configurado: o endereço `github.io` passaria a redirecionar
> para um domínio que ainda não responde.

## 3. `abrazileira.pt` → redireciona para `abrazileira.com`

O GitHub Pages só aceita um domínio por site. O `.pt` (registado no dominios.pt) passa a ter DNS no Cloudflare,
que responde com um redirecionamento 301 com HTTPS. **A ordem importa:** a DNS.PT só aceita nameservers que já respondam pela zona.

1. Cloudflare → **Add a domain** → `abrazileira.pt` → plano **Free** → anotar os 2 nameservers indicados.
2. Cloudflare → `abrazileira.pt` → **DNS → Records → Import** → `dns/abrazileira.pt.zone`, com **"Proxy imported DNS records" ligado** (nuvem laranja).
3. Cloudflare → `abrazileira.pt` → **Rules → Redirect Rules → Create rule**:
   - *Custom filter expression*: `(http.host eq "abrazileira.pt") or (http.host eq "www.abrazileira.pt")`
   - *Then*: **Dynamic** · `concat("https://abrazileira.com", http.request.uri.path)` · **301** · *Preserve query string* ligado → **Deploy**.
4. dominios.pt → `abrazileira.pt` → **Servidores de Nome** → *Usar nameservers personalizados* → DNS 1 e DNS 2 = os do Cloudflare,
   apagar DNS 3–5 → **Alterar Nameservers**. Pode demorar até 24 h; o Cloudflare envia email quando a zona fica ativa.

## 4. Email `inn@abrazileira.com` (contacto da lista de espera / RGPD)

O endereço aparece publicamente na nota de privacidade, por isso tem de receber mensagens:

1. Cloudflare → `abrazileira.com` → **Email → Email Routing → Get started**.
2. **Custom address:** `inn` → **Destination:** o teu email pessoal → confirmar o email de verificação.
3. Aceitar os registos MX/TXT que o Cloudflare propõe (não colidem com os registos do GitHub Pages).

## 5. Lista de espera (Supabase)

As inscrições ficam no projeto Supabase **A Brazileira** — ver `supabase/README.md`.
