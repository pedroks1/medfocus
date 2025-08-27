import React from 'react'
export default function Home(){
  return (
    <div className="grid2">
      <div className="card">
        <h2>Flashcards com SRS</h2>
        <p>Repetição espaçada estilo Anki. Importe seu deck, estude diariamente, e deixe o algoritmo fazer a mágica.</p>
        <a href="/flashcards" className="btn">Ir para Flashcards</a>
      </div>
      <div className="card">
        <h2>Simulados com Analytics</h2>
        <p>Monte provas por tema e acompanhe seus pontos fortes e fracos por disciplina.</p>
        <a href="/exams" className="btn">Ir para Simulados</a>
      </div>
      <div className="card">
        <h3>Assinatura</h3>
        <p>Para publicar: coloque o link do seu plano do Mercado Pago abaixo (opcional):</p>
        <a className="btn secondary" href="#" onClick={(e)=>{e.preventDefault(); alert('Cole o link do plano do MP aqui no Home.jsx')}}>Assinar (Mensal)</a>
      </div>
    </div>
  )
}
