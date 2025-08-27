import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [msg,setMsg]=useState('')

  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    setMsg(error ? error.message : 'Cadastro enviado! Verifique seu e-mail.')
  }
  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setMsg(error ? error.message : 'Entrou! Agora acesse o Painel.')
  }
  const signOut = async () => {
    await supabase.auth.signOut()
    setMsg('Saiu.')
  }

  return (
    <div className="card">
      <h2>Login</h2>
      <div className="row">
        <input className="input" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)}/>
        <input className="input" placeholder="senha" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
      </div>
      <div className="row" style={{marginTop:12}}>
        <button className="btn" onClick={signIn}>Entrar</button>
        <button className="btn secondary" onClick={signUp}>Cadastrar</button>
        <button className="btn secondary" onClick={signOut}>Sair</button>
      </div>
      {msg && <p><small className="muted">{msg}</small></p>}
      <p><small className="muted">Dica: crie os usuários no Supabase Authentication para usar como admin depois.</small></p>
    </div>
  )
}
