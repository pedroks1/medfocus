export const handler = async (event) => {
  try {
    const payload = event.body ? JSON.parse(event.body) : null
    // TODO: validar assinatura e consultar status na API do MP
    // Atualizar Supabase (precisaria usar service role via REST ou edge function)
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    }
  } catch (e){
    return { statusCode: 400, body: JSON.stringify({ error: e.message }) }
  }
}
