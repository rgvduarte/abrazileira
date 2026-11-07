# Publicação — GitHub Pages + domínios

O site público vive em `docs/` (HTML/CSS estático, sem build).

## 1. Ativar o GitHub Pages (uma vez)

1. GitHub → repositório `abrazileira` → **Settings → Pages**.
2. **Source:** *Deploy from a branch*.
3. **Branch:** o branch publicado (ex.: `main`) · pasta **`/docs`** → **Save**.
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

O GitHub Pages só aceita um domínio por site. O `.pt` faz um redirecionamento 301:

1. Adicionar `abrazileira.pt` ao Cloudflare (plano Free) e trocar os *nameservers* no registo `.pt` (ex.: no registrar onde foi comprado) para os indicados pelo Cloudflare.
2. DNS: `A @ 192.0.2.1` e `CNAME www abrazileira.pt`, ambos **com proxy ligado** (nuvem laranja).
3. **Rules → Redirect Rules → Create:** quando *Hostname* contém `abrazileira.pt` →
   *Dynamic* `concat("https://abrazileira.com", http.request.uri.path)` · **301** · *Preserve query string*.

Alternativa sem Cloudflare: usar o reencaminhamento de URL do próprio registrar `.pt` (301 para `https://abrazileira.com`).
