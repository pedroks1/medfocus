import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Exams(){
  const [session, setSession] = useState(null)
  const [topic, setTopic] = useState('')
  const [qs, setQs] = useState([])
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=> setSession(data.session))
    supabase.auth.onAuthStateChange((_e, sess)=> setSession(sess))
  },[])

  async function start(){
    let query = supabase.from('questions').select('*').limit(50)
    if (topic) query = query.eq('topic', topic)
    const { data } = await query
    const chosen = (data||[]).sort(()=>Math.random()-0.5).slice(0, 10)
    setQs(chosen); setAnswers({}); setResult(null)
  }

  async function finish(){
    // computa score e breakdown por topic
    let right = 0, total = qs.length
    const byTopic = {}
    qs.forEach(q => {
      const ok = Number(answers[q.id]) === Number(q.correct_index)
      if (ok) right += 1
      const t = q.topic || 'Geral'
      byTopic[t] ??= { right:0, total:0 }
      byTopic[t].total += 1
      if (ok) byTopic[t].right += 1
    })
    const score = total ? Math.round((right/total)*100) : 0
    setResult({ score, breakdown: byTopic })
  }

  return (
    <div className="card">
      <h2>Simulado rápido (10 questões)</h2>
      <div className="row">
        <input className="input" placeholder="Filtrar por tema (ex.: Cardiologia)" value={topic} onChange={e=>setTopic(e.target.value)} />
        <button className="btn" onClick={start}>Iniciar</button>
        {qs.length>0 && <button className="btn secondary" onClick={finish}>Finalizar</button>}
      </div>
      {qs.map(q => (
        <div key={q.id} className="card">
          <div><b>{q.stem}</b></div>
          {q.choices.map((c, i) => (
            <label key={i} style={{display:'block', marginTop:6}}>
              <input type="radio" name={q.id} onChange={()=>setAnswers(a=>({...a, [q.id]: i}))} /> {c}
            </label>
          ))}
        </div>
      ))}
      {result && (
        <div className="card">
          <h3>Resultado</h3>
          <p>Score: <b>{result.score}%</b></p>
          <ul>
            {Object.entries(result.breakdown).map(([t, v]) => (
              <li key={t}>{t}: {v.right}/{v.total}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
