# Supabase — lista de espera

Projeto Supabase **A Brazileira** (região UE, `eu-west-3` Paris), ref `hxwdnhprhjlqehgvmvct`.

- Tabela `public.waitlist` (email, idioma, data do consentimento). Sem acesso de leitura/escrita pela API pública.
- O site só pode chamar `POST /rest/v1/rpc/join_waitlist` com a chave *publishable* (pública por natureza).
  A função valida o email e o consentimento, ignora duplicados em silêncio e tem um travão global de 30 inscrições/minuto.
- Ver inscrições: Supabase → *Table Editor* → `waitlist` (ou exportar CSV).
- Pedidos RGPD (apagar/aceder): tratar a partir do contacto indicado na nota de privacidade.

As migrações em `migrations/` são o histórico do que foi aplicado.
