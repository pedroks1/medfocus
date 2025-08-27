import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { applySM2 } from '../lib/srs'

export default function Flashcards(){
  const [session, setSession] = useState(null)
  const [decks, setDecks] = useState([])
  const [selectedDeck, setSelectedDeck] = useState('')
  const [todayCards, setTodayCards] = useState([])
  const [current, setCurrent] = useState(null)
  const [importPreview, setImportPreview] = useState([])
  const [importOk, setImportOk] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=> setSession(data.session))
    supabase.auth.onAuthStateChange((_event, sess)=> setSession(sess))
    loadDecks()
  },[])

  async function loadDecks(){
    const { data } = await supabase.from('decks').select('*').order('created_at', { ascending: false })
    setDecks(data||[])
    if (data && data[0]) setSelectedDeck(data[0].id)
  }

  async function loadToday(){
    if(!session){ setMsg('Faça login para estudar.'); return }
    // busca cards de um deck, checa progressos due <= agora
    const { data: cards } = await supabase.from('cards').select('id, front, back').eq('deck_id', selectedDeck).limit(200)
    const nowISO = new Date().toISOString()

    // pega progresso do usuário
    const { data: prog } = await supabase.from('card_progress')
      .select('*')
      .eq('user_id', session.user.id)
      .lte('due_at', nowISO)

    const dueSet = new Set((prog||[]).map(p => p.card_id))
    // incluir novos cards se não tiver progresso (primeiro contato)
    const list = (cards||[]).filter(c => dueSet.has(c.id) || !(prog||[]).find(p => p.card_id === c.id)).slice(0, 20)
    setTodayCards(list)
    setCurrent(list[0] || null)
  }

  async function answer(q){
    if(!current) return
    // busca progresso atual
    const { data: prev } = await supabase.from('card_progress')
      .select('*').eq('user_id', session.user.id).eq('card_id', current.id).maybeSingle()

    const next = applySM2(prev, q)
    await supabase.from('card_progress').upsert({
      user_id: session.user.id,
      card_id: current.id,
      ease: next.ease,
      interval_days: next.intervalDays,
      reps: next.reps,
      lapses: next.lapses,
      last_review_at: new Date().toISOString(),
      due_at: next.dueAt
    })
    // avança
    const left = todayCards.filter(c => c.id !== current.id)
    setTodayCards(left)
    setCurrent(left[0] || null)
  }

  function onImportFile(e){
    const file = e.target.files?.[0]
    if(!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        // aceita CSV simples: "front,back" por linha
        const text = String(reader.result)
        const rows = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
        const parsed = rows.map(line => {
          const [front, back] = line.split(',')
          return { front: (front||'').trim(), back: (back||'').trim() }
        }).filter(x => x.front && x.back)
        setImportPreview(parsed)
        setImportOk(true)
      } catch (err){ alert('Arquivo inválido.') }
    }
    reader.readAsText(file)
  }

  async function confirmImport(){
    if(!selectedDeck){ alert('Crie ou selecione um deck.'); return }
    const payload = importPreview.map(x => ({ deck_id: selectedDeck, front: x.front, back: x.back }))
    const { error } = await supabase.from('cards').insert(payload)
    if(error){ alert(error.message); return }
    setImportPreview([]); setImportOk(false)
    await loadDecks()
    alert('Importado! Agora clique em Estudar Hoje.')
  }

  async function createDeck(){
    const title = prompt('Nome do deck:')
    if(!title) return
    const { error } = await supabase.from('decks').insert({ title })
    if(error) alert(error.message)
    await loadDecks()
  }

  return (
    <div className="grid2">
      <div className="card">
        <h2>Importar cartas</h2>
        <p>Formato rápido: CSV com <code>frente,verso</code> por linha. Exemplo:<br/>
        <code>IECA: mecanismo de ação?,Inibe ECA → ↓Ang II; ↑bradicinina</code></p>
        <div className="row">
          <select className="select" value={selectedDeck} onChange={e=>setSelectedDeck(e.target.value)}>
            {decks.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
          </select>
          <button className="btn secondary" onClick={createDeck}>Novo deck</button>
        </div>
        <hr/>
        <input type="file" accept=".csv,text/csv" onChange={onImportFile} />
        {importPreview.length>0 && (
          <div className="card" style={{marginTop:12}}>
            <h3>Pré-visualização ({importPreview.length})</h3>
            <ul>
              {importPreview.slice(0,5).map((c,i)=>(<li key={i}><b>{c.front}</b> — {c.back}</li>))}
            </ul>
            <button className="btn" onClick={confirmImport} disabled={!importOk}>Confirmar importação</button>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Estudar Hoje</h2>
        <div className="row">
          <button className="btn" onClick={loadToday}>Carregar sessão</button>
        </div>
        {current ? (
          <div className="card" style={{marginTop:12}}>
            <div style={{fontSize:18, marginBottom:8}}>{current.front}</div>
            <details><summary>Mostrar resposta</summary><div style={{marginTop:6}}>{current.back}</div></details>
            <div className="row" style={{marginTop:12, flexWrap:'wrap'}}>
              {[0,1,2,3,4,5].map(q => (
                <button key={q} className="btn secondary" onClick={()=>answer(q)}>{q}</button>
              ))}
            </div>
            <p><small className="muted">0 = errei feio • 3 = ok • 5 = muito fácil</small></p>
          </div>
        ) : (
          <p><small className="muted">Sem cartas carregadas ainda.</small></p>
        )}
        <p><small className="muted">{msg}</small></p>
      </div>
    </div>
  )
}
