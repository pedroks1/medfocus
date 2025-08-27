import React from 'react'
export default function Dashboard(){
  return (
    <div className="grid2">
      <div className="card">
        <h2>Revisar agora (SRS)</h2>
        <p>Vá até Flashcards e clique em <kbd>Estudar Hoje</kbd>.</p>
        <a href="/flashcards" className="btn">Flashcards</a>
      </div>
      <div className="card">
        <h2>Fazer simulado</h2>
        <p>Monte uma prova por tema e veja sua análise por assunto.</p>
        <a href="/exams" className="btn">Simulados</a>
      </div>
    </div>
  )
}
