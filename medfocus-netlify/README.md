# MedFocus (Netlify)

Projeto pronto para publicar no Netlify: React (Vite) + Supabase (Auth/DB) + Flashcards SRS + Simulados.
Inclui função serverless (stub) para webhook do Mercado Pago.

## Passo a passo (sem pular)
1. **Baixe o ZIP** e extraia a pasta `medfocus-netlify`.
2. Abra um terminal nessa pasta e rode:
   ```bash
   npm install
   npm run dev
   ```
   Abra `http://localhost:5173`.

3. Crie um projeto no **Supabase** e copie:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Crie um arquivo `.env` na raiz e cole (troque os valores):
   ```env
   VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   VITE_SUPABASE_ANON_KEY=seu-anon-key
   ```

5. No painel do Supabase → **SQL Editor**: crie as tabelas colando o conteúdo de `supabase/001_schema.sql` e depois `supabase/002_rls.sql`.
   - Crie usuários em **Authentication → Users** (ex.: emerson@example.com e pedro@example.com).
   - Pegue os **UUIDs** desses usuários e rode `supabase/003_seed_admins.sql` trocando os IDs.
   - (Opcional) rode `supabase/004_test_data.sql` para exemplos.

6. Teste login no app (menu no canto superior direito). Depois vá em **Flashcards** e **Simulados**.

7. **Publicar no Netlify**:
   - Crie um site novo e **importe o repositório** ou suba esse projeto.
   - Em **Site settings → Environment variables**, adicione:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Deploy.

8. **(Opcional) Mercado Pago**:
   - Crie um plano de assinatura no painel e use o **link do plano** no botão da Home.
   - Quando quiser automatizar: configure webhook apontando para `/.netlify/functions/mercadopago-webhook` e adapte a função em `netlify/functions/mercadopago-webhook.js`.

## Observações
- Este projeto faz chamadas diretas ao Supabase (client-side). Ative **RLS** (já configurado no SQL) para segurança por usuário.
- Para conteúdo, use o **Table Editor** no Supabase: `decks`, `cards`, `questions`.
