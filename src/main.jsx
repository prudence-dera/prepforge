import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BookOpen, BrainCircuit, CheckCircle2, ChevronLeft, ChevronRight,
  CircleHelp, Code2, Database, Gauge, Home, Layers3, Mic, MicOff,
  NotebookPen, RotateCcw, Search, Sparkles, Square, Trophy, Volume2,
  XCircle, BriefcaseBusiness
} from 'lucide-react';
import './styles.css';

const seedCards = [
  { id: 1, category: 'Pipelines', q: 'What does idempotent mean in a data pipeline?', a: 'Rerunning the same input produces the same intended result without duplicates.' },
  { id: 2, category: 'Pipelines', q: 'Why is idempotency important in Airflow?', a: 'Retries stay safe and do not create duplicate or inconsistent data.' },
  { id: 3, category: 'Pipelines', q: 'What is ETL?', a: 'Extract -> Transform -> Load.' },
  { id: 4, category: 'Pipelines', q: 'What is ELT?', a: 'Extract -> Load -> Transform.' },
  { id: 5, category: 'AWS', q: 'Why use Amazon S3 in a data pipeline?', a: 'Scalable, durable, cost-efficient object storage with strong AWS integration.' },
  { id: 6, category: 'Pipelines', q: 'What is Apache Airflow used for?', a: 'Scheduling, orchestrating, monitoring, dependencies, and retries.' },
  { id: 7, category: 'Data Quality', q: 'Name five core data-quality dimensions.', a: 'Freshness, completeness, uniqueness, validity, and accuracy.' },
  { id: 8, category: 'Data Quality', q: 'What does data lineage mean?', a: 'Tracing how data moves and changes from source to destination.' },
  { id: 9, category: 'SQL', q: 'INNER JOIN vs LEFT JOIN?', a: 'INNER returns matches only; LEFT keeps all left rows plus matches.' },
  { id: 10, category: 'SQL', q: 'WHERE vs HAVING?', a: 'WHERE filters rows before grouping; HAVING filters aggregated groups.' },
  { id: 11, category: 'SQL', q: 'GROUP BY vs a window function?', a: 'GROUP BY reduces rows; window functions keep rows and add analysis.' },
  { id: 12, category: 'SQL', q: 'ROW_NUMBER vs RANK vs DENSE_RANK?', a: 'ROW_NUMBER is unique; RANK skips after ties; DENSE_RANK does not skip.' },
  { id: 13, category: 'SQL', q: 'Why use a CTE?', a: 'Improve readability, break complex queries into steps, and reuse logic.' },
  { id: 14, category: 'SQL', q: 'UNION vs UNION ALL?', a: 'UNION removes duplicates; UNION ALL keeps all rows and is usually faster.' },
  { id: 15, category: 'SQL', q: 'Primary key vs foreign key?', a: 'Primary uniquely identifies a row; foreign key references a related key.' },
  { id: 16, category: 'SQL', q: 'What is an index?', a: 'A lookup structure that reduces how much data a database must scan.' },
  { id: 17, category: 'SQL', q: 'Clustered vs nonclustered index?', a: 'Clustered orders table data; nonclustered is a separate lookup structure.' },
  { id: 18, category: 'SQL', q: 'What does ACID stand for?', a: 'Atomicity, Consistency, Isolation, Durability.' },
  { id: 19, category: 'SQL', q: 'What is normalization?', a: 'Organizing data to reduce redundancy and improve integrity.' },
  { id: 20, category: 'SQL', q: 'What is denormalization?', a: 'Intentional redundancy to reduce joins and improve analytical query speed.' },
  { id: 21, category: 'SQL', q: 'OLTP vs OLAP?', a: 'OLTP runs day-to-day transactions; OLAP analyzes historical data.' },
  { id: 22, category: 'Data Quality', q: 'What should happen to bad records?', a: 'Quarantine them with error context rather than silently dropping them.' },
  { id: 23, category: 'Reliability', q: 'Logging vs alerting?', a: 'Logs record details; alerts notify when action is needed.' },
  { id: 24, category: 'Reliability', q: 'What causes alert fatigue?', a: 'Too many low-value alerts make important alerts easier to ignore.' },
  { id: 25, category: 'Reliability', q: 'How do you monitor data freshness?', a: 'Compare expected arrival/update time with actual latest successful data.' },
  { id: 26, category: 'Reliability', q: 'Task dependency vs data-quality check?', a: 'Dependencies control execution order; quality checks validate the data.' },
  { id: 27, category: 'Reliability', q: 'Can an Airflow task succeed but produce bad data?', a: 'Yes. Execution can pass while output has nulls, duplicates, or missing rows.' },
  { id: 28, category: 'System Design', q: 'When should a pipeline block publication?', a: 'When quality issues create material pricing, compliance, financial, or integrity risk.' },
  { id: 29, category: 'System Design', q: 'What sequence follows a critical pipeline failure?', a: 'Alert -> Contain -> Diagnose -> Fix -> Reprocess -> Validate -> Release.' },
  { id: 30, category: 'System Design', q: 'Why rerun only necessary tasks?', a: 'Lower cost, faster recovery, and less risk of duplicate reprocessing.' }
];

const seedNotes = [
  {
    id: 1,
    title: 'Calendly ETL Pipeline Story',
    category: 'Projects',
    body: `I built an end-to-end ETL pipeline using Calendly data. Python extracted API data, PySpark cleaned and flattened fields, Airflow orchestrated the workflow, S3 stored the transformed data, Glue cataloged the schema, and Athena enabled SQL analysis. A key issue involved timestamp formatting in Athena; I used the error message to isolate the affected fields, corrected the transformation logic, reran the query, and validated the fix.`
  },
  {
    id: 2,
    title: 'Pipeline Failure Recovery',
    category: 'Reliability',
    body: `Use this sequence: Alert -> Contain -> Diagnose -> Fix -> Reprocess -> Validate -> Release. Quarantine bad records, preserve error context, and rerun only affected tasks when safe. Favor idempotent design so retries do not create duplicates.`
  },
  {
    id: 3,
    title: 'Data Quality for Pricing',
    category: 'Data Quality',
    body: `For pricing data, validate freshness, completeness, uniqueness, validity, and accuracy. Block downstream publication when a quality issue can materially distort pricing, analytics, compliance, or financial decisions.`
  },
  {
    id: 4,
    title: 'Stakeholder Release Decision',
    category: 'Communication',
    body: `Explain scope, impacted fields/records, downstream impact, risk of release vs delay, workaround, remediation plan, and recommendation. For known-quality releases, document stakeholder notification, approval, owner, workaround, and resolution plan.`
  },
  {
    id: 5,
    title: 'SQL Quick Recall',
    category: 'SQL',
    body: `WHERE filters rows before aggregation. HAVING filters groups after aggregation. GROUP BY reduces rows; window functions keep rows. UNION removes duplicates; UNION ALL keeps every row. LEFT JOIN is useful when preserving all records from the primary dataset.`
  }
];

const interviewQuestions = [
  { category: 'Pipelines', text: 'Tell me about a data pipeline you built and one problem you had to debug.' },
  { category: 'AWS', text: 'Why did you choose Amazon S3 for your data pipeline instead of a relational database?' },
  { category: 'Reliability', text: 'A pipeline fails halfway through. How would you recover without creating duplicate data?' },
  { category: 'Data Quality', text: 'A pricing field suddenly becomes 20% null. What do you do before releasing the dataset?' },
  { category: 'System Design', text: 'Three upstream sources feed a pricing pipeline and one arrives late. How would you design the release process?' },
  { category: 'Behavioral', text: 'Tell me about a time you identified a problem in an insurance workflow and helped resolve it.' },
  { category: 'SQL', text: 'Explain the difference between WHERE and HAVING and give an insurance example.' }
];

const categories = ['All', 'SQL', 'AWS', 'Pipelines', 'Data Quality', 'Reliability', 'System Design', 'Behavioral'];

function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function App() {
  const [view, setView] = useState('dashboard');
  const [cards, setCards] = usePersistentState('prepforge_cards', seedCards);
  const [notes, setNotes] = usePersistentState('prepforge_notes', seedNotes);
  const [ratings, setRatings] = usePersistentState('prepforge_ratings', {});
  const [sessions, setSessions] = usePersistentState('prepforge_sessions', []);

  const mastered = Object.values(ratings).filter(v => v === 'known').length;
  const needsReview = Object.values(ratings).filter(v => v === 'review').length;
  const progress = cards.length ? Math.round((mastered / cards.length) * 100) : 0;

  return (
    <div className="app-shell">
      <Sidebar view={view} setView={setView} />
      <main className="main">
        {view === 'dashboard' && <Dashboard cards={cards} ratings={ratings} sessions={sessions} setView={setView} progress={progress} mastered={mastered} needsReview={needsReview} />}
        {view === 'flashcards' && <Flashcards cards={cards} setCards={setCards} ratings={ratings} setRatings={setRatings} />}
        {view === 'notes' && <Notes notes={notes} setNotes={setNotes} />}
        {view === 'quiz' && <Quiz cards={cards} ratings={ratings} setRatings={setRatings} />}
        {view === 'voice' && <VoiceInterview sessions={sessions} setSessions={setSessions} />}
        {view === 'progress' && <Progress cards={cards} ratings={ratings} sessions={sessions} />}
        {view === 'portfolio' && <Portfolio />}
      </main>
    </div>
  );
}

function Sidebar({ view, setView }) {
  const items = [
    ['dashboard', Home, 'Dashboard'], ['flashcards', Layers3, 'Flashcards'], ['notes', NotebookPen, 'Notes'],
    ['quiz', CircleHelp, 'Quiz'], ['voice', Mic, 'Voice Interview'], ['progress', Gauge, 'Progress'], ['portfolio', BriefcaseBusiness, 'Portfolio']
  ];
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark">PF</div><div><strong>PrepForge</strong><span>Build. Practice. Master.</span></div></div>
    <nav>{items.map(([id, Icon, label]) => <button key={id} className={view === id ? 'active' : ''} onClick={() => setView(id)}><Icon size={18}/><span>{label}</span></button>)}</nav>
    <div className="sidebar-foot"><Sparkles size={16}/><span>Travelers Data Engineer track</span></div>
  </aside>
}

function Header({ eyebrow, title, subtitle }) {
  return <div className="page-header"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>
}

function Dashboard({ cards, ratings, sessions, setView, progress, mastered, needsReview }) {
  const categoryStats = useMemo(() => {
    return categories.slice(1).map(cat => {
      const relevant = cards.filter(c => c.category === cat);
      const known = relevant.filter(c => ratings[c.id] === 'known').length;
      return { cat, total: relevant.length, pct: relevant.length ? Math.round(known/relevant.length*100) : 0 };
    }).filter(x => x.total > 0);
  }, [cards, ratings]);
  return <>
    <Header eyebrow="Interview readiness" title="Your study command center" subtitle="Turn interview prep into a repeatable system: learn, practice aloud, measure, and improve." />
    <section className="hero-card">
      <div><span className="pill">March 2027 target</span><h2>{progress}% of core cards mastered</h2><p>Focus on weak topics first, then practice explaining them aloud in interview mode.</p><div className="hero-actions"><button onClick={()=>setView('flashcards')}>Review cards</button><button className="secondary" onClick={()=>setView('voice')}>Start voice interview</button></div></div>
      <div className="ring" style={{'--p': `${progress * 3.6}deg`}}><div><strong>{progress}%</strong><span>mastered</span></div></div>
    </section>
    <section className="stats-grid">
      <Stat icon={Layers3} label="Flashcards" value={cards.length} hint={`${needsReview} marked review`} />
      <Stat icon={CheckCircle2} label="Mastered" value={mastered} hint="Known cards" />
      <Stat icon={Mic} label="Voice sessions" value={sessions.length} hint="Practice attempts" />
      <Stat icon={Trophy} label="Target" value="Mar '27" hint="Interview-ready" />
    </section>
    <section className="section-block"><div className="section-title"><div><span className="eyebrow">Category progress</span><h2>What to work on next</h2></div></div><div className="category-grid">{categoryStats.map(x => <div className="category-card" key={x.cat}><div className="category-row"><span>{x.cat}</span><strong>{x.pct}%</strong></div><div className="bar"><span style={{width:`${x.pct}%`}}/></div><small>{x.total} cards</small></div>)}</div></section>
  </>
}

function Stat({ icon: Icon, label, value, hint }) { return <div className="stat-card"><Icon size={20}/><span>{label}</span><strong>{value}</strong><small>{hint}</small></div> }

function Flashcards({ cards, setCards, ratings, setRatings }) {
  const [cat, setCat] = useState('All'); const [search, setSearch] = useState(''); const [idx, setIdx] = useState(0); const [flipped, setFlipped] = useState(false); const [showForm, setShowForm] = useState(false);
  const filtered = cards.filter(c => (cat === 'All' || c.category === cat) && (c.q.toLowerCase().includes(search.toLowerCase()) || c.a.toLowerCase().includes(search.toLowerCase())));
  useEffect(() => { setIdx(0); setFlipped(false); }, [cat, search]);
  const card = filtered[idx];
  function rate(v){ if(!card) return; setRatings({...ratings, [card.id]: v}); setFlipped(false); setIdx((idx+1)%filtered.length); }
  return <>
    <Header eyebrow="Active recall" title="Flashcards" subtitle="Review what matters, mark weak areas, and come back to them more often." />
    <div className="toolbar"><div className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search cards..."/></div><select value={cat} onChange={e=>setCat(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select><button onClick={()=>setShowForm(!showForm)}>+ Add card</button></div>
    {showForm && <CardForm onAdd={(c)=>{setCards([...cards,{...c,id:Date.now()}]);setShowForm(false)}} />}
    {card ? <div className="flash-wrap"><div className={`flashcard ${flipped?'flipped':''}`} onClick={()=>setFlipped(!flipped)}><div className="flash-top"><span>{card.category}</span><small>{idx+1} / {filtered.length}</small></div><h2>{flipped ? card.a : card.q}</h2><p>{flipped ? 'Tap to see question' : 'Tap to reveal answer'}</p></div><div className="flash-controls"><button className="icon-btn" onClick={()=>{setIdx((idx-1+filtered.length)%filtered.length);setFlipped(false)}}><ChevronLeft/></button><button className="review" onClick={()=>rate('review')}><XCircle size={18}/> Need review</button><button className="known" onClick={()=>rate('known')}><CheckCircle2 size={18}/> Know it</button><button className="icon-btn" onClick={()=>{setIdx((idx+1)%filtered.length);setFlipped(false)}}><ChevronRight/></button></div><div className="rating-line">Status: <strong>{ratings[card.id] || 'unreviewed'}</strong></div></div> : <div className="empty">No cards match this filter.</div>}
  </>
}

function CardForm({ onAdd }) {
  const [q,setQ]=useState(''); const [a,setA]=useState(''); const [category,setCategory]=useState('SQL');
  return <div className="inline-form"><select value={category} onChange={e=>setCategory(e.target.value)}>{categories.slice(1).map(c=><option key={c}>{c}</option>)}</select><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Question"/><input value={a} onChange={e=>setA(e.target.value)} placeholder="Answer"/><button disabled={!q||!a} onClick={()=>onAdd({q,a,category})}>Save</button></div>
}

function Notes({ notes, setNotes }) {
  const [selected,setSelected]=useState(notes[0]?.id); const [search,setSearch]=useState('');
  const filtered=notes.filter(n=>(n.title+n.body+n.category).toLowerCase().includes(search.toLowerCase())); const note=notes.find(n=>n.id===selected)||filtered[0];
  function update(field,value){ setNotes(notes.map(n=>n.id===note.id?{...n,[field]:value}:n)); }
  function add(){ const n={id:Date.now(),title:'New note',category:'General',body:''}; setNotes([...notes,n]); setSelected(n.id); }
  return <>
    <Header eyebrow="Interview notebook" title="Notes" subtitle="Keep full answers, project stories, troubleshooting patterns, and concepts in one place." />
    <div className="notes-layout"><aside className="notes-list"><div className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search notes..."/></div><button className="new-note" onClick={add}>+ New note</button>{filtered.map(n=><button key={n.id} className={note?.id===n.id?'selected':''} onClick={()=>setSelected(n.id)}><span>{n.category}</span><strong>{n.title}</strong></button>)}</aside>{note && <article className="note-editor"><input className="note-title" value={note.title} onChange={e=>update('title',e.target.value)}/><input className="note-category" value={note.category} onChange={e=>update('category',e.target.value)}/><textarea value={note.body} onChange={e=>update('body',e.target.value)}/><small>Saved automatically in this browser.</small></article>}</div>
  </>
}

function Quiz({ cards, ratings, setRatings }) {
  const pool = useMemo(() => [...cards].sort((a,b)=> (ratings[a.id]==='review'?-1:1) - (ratings[b.id]==='review'?-1:1)).slice(0,10), [cards, ratings]);
  const [idx,setIdx]=useState(0); const [revealed,setRevealed]=useState(false); const q=pool[idx];
  return <>
    <Header eyebrow="Retrieval practice" title="Quiz mode" subtitle="Explain the answer before revealing it. Prioritize concepts you marked for review." />
    <div className="quiz-card"><span className="pill">{q?.category}</span><h2>{q?.q}</h2>{revealed?<div className="quiz-answer"><span>Strong answer</span><p>{q?.a}</p></div>:<p className="muted">Say your answer out loud before revealing it.</p>}<div className="hero-actions"><button onClick={()=>setRevealed(!revealed)}>{revealed?'Hide answer':'Reveal answer'}</button><button className="secondary" onClick={()=>{setIdx((idx+1)%pool.length);setRevealed(false)}}>Next question</button></div></div>
  </>
}

const interviewModes = {
  nervous: {
    label: 'Nervous Interviewee',
    prepSeconds: 15,
    speechRate: 0.85,
    description: 'Extra thinking time, repeatable questions, optional hints, and gentler coaching.'
  },
  coach: {
    label: 'Coach Mode',
    prepSeconds: 8,
    speechRate: 0.9,
    description: 'Structured practice with hints available when you need them.'
  },
  standard: {
    label: 'Standard Mock',
    prepSeconds: 3,
    speechRate: 0.95,
    description: 'A realistic interview pace with minimal assistance.'
  },
  pressure: {
    label: 'Pressure Mode',
    prepSeconds: 0,
    speechRate: 1.03,
    description: 'Fast-start practice with no hints so you can rehearse under pressure.'
  }
};

const interviewHints = {
  Pipelines: ['State the pipeline goal.', 'Name the tools and data flow.', 'Explain the problem, fix, validation, and business impact.'],
  AWS: ['Name the AWS service.', 'Explain why it fit the workload.', 'Mention scalability, durability, cost, or integration.'],
  Reliability: ['Contain the issue first.', 'Find the root cause from logs and data checks.', 'Recover safely with idempotent reruns and validation.'],
  'Data Quality': ['Describe the quality issue and scope.', 'Trace the field from source to target.', 'Explain release, quarantine, and stakeholder decisions.'],
  'System Design': ['Clarify requirements and SLAs.', 'Describe components and failure handling.', 'Explain tradeoffs and how you protect data integrity.'],
  Behavioral: ['Situation and task.', 'Actions you personally took.', 'Result, impact, and what you learned.'],
  SQL: ['Define the concept simply.', 'Give a small example.', 'Connect it to an insurance or data-engineering use case.']
};

function VoiceInterview({ sessions, setSessions }) {
  const [qIdx,setQIdx]=useState(0);
  const [mode,setMode]=useState('nervous');
  const [listening,setListening]=useState(false);
  const [transcript,setTranscript]=useState('');
  const [manual,setManual]=useState('');
  const [result,setResult]=useState(null);
  const [showHint,setShowHint]=useState(false);
  const [prepLeft,setPrepLeft]=useState(null);
  const recognitionRef=useRef(null);
  const prepTimerRef=useRef(null);
  const question=interviewQuestions[qIdx];
  const modeConfig=interviewModes[mode];
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  useEffect(() => () => {
    if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    recognitionRef.current?.stop();
  }, []);

  function speak(){
    if(!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(question.text);
    u.rate=modeConfig.speechRate;
    window.speechSynthesis.speak(u);
  }

  function start(){
    if(!SpeechRecognition){ setListening(false); return; }
    const r=new SpeechRecognition();
    r.continuous=true;
    r.interimResults=true;
    r.lang='en-US';
    r.onresult=e=>{
      let t='';
      for(let i=0;i<e.results.length;i++) t+=e.results[i][0].transcript+' ';
      setTranscript(t.trim());
    };
    r.onend=()=>setListening(false);
    r.start();
    recognitionRef.current=r;
    setListening(true);
  }

  function beginAnswer(){
    if(prepTimerRef.current) clearInterval(prepTimerRef.current);
    const seconds=modeConfig.prepSeconds;
    if(seconds<=0){ start(); return; }
    let remaining=seconds;
    setPrepLeft(remaining);
    prepTimerRef.current=setInterval(()=>{
      remaining-=1;
      setPrepLeft(remaining);
      if(remaining<=0){
        clearInterval(prepTimerRef.current);
        prepTimerRef.current=null;
        setPrepLeft(null);
        start();
      }
    },1000);
  }

  function cancelPrep(){
    if(prepTimerRef.current) clearInterval(prepTimerRef.current);
    prepTimerRef.current=null;
    setPrepLeft(null);
  }

  function stop(){ recognitionRef.current?.stop(); setListening(false); }
  const answer=(transcript||manual).trim();

  function score(){
    const words=answer.split(/\s+/).filter(Boolean);
    const filler=(answer.match(/\b(um|uh|like|you know|basically|actually)\b/gi)||[]).length;
    const practiceScore=Math.max(1,Math.min(10,Math.round((Math.min(words.length,120)/120)*5 + (filler===0?3:Math.max(0,3-filler)) + (words.length>=45?2:1))));
    const session={id:Date.now(),question:question.text,category:question.category,words:words.length,filler,score:practiceScore,mode:modeConfig.label,date:new Date().toISOString()};
    setSessions([session,...sessions]);
    return session;
  }

  function finish(){ if(!answer) return; setResult(score()); }

  function next(){
    cancelPrep();
    stop();
    setQIdx((qIdx+1)%interviewQuestions.length);
    setTranscript('');
    setManual('');
    setResult(null);
    setShowHint(false);
  }

  function changeMode(nextMode){
    cancelPrep();
    stop();
    setMode(nextMode);
    setResult(null);
    setShowHint(false);
  }

  return <>
    <Header eyebrow="Speak it, don't just study it" title="Voice interview" subtitle="Choose the level of support you need, then practice answering aloud. V1 captures your transcript and measurable speaking signals locally in the browser." />

    <div className="mode-picker" role="group" aria-label="Interview mode">
      {Object.entries(interviewModes).map(([key,item])=><button key={key} className={`mode-btn ${mode===key?'active':''}`} onClick={()=>changeMode(key)}>{item.label}</button>)}
    </div>
    <div className="mode-note"><Sparkles size={17}/><div><strong>{modeConfig.label}</strong><span>{modeConfig.description}</span></div></div>

    <div className="voice-grid">
      <section className="interviewer-card">
        <div className="avatar"><BrainCircuit size={32}/></div>
        <span className="eyebrow">Mock interviewer | {question.category}</span>
        <h2>{question.text}</h2>
        <div className="interviewer-actions">
          <button className="secondary speak" onClick={speak}><Volume2 size={18}/> Repeat question</button>
          {mode!=='pressure' && <button className="ghost" onClick={()=>setShowHint(!showHint)}>{showHint?'Hide hint':'Give me a hint'}</button>}
        </div>
        {showHint && mode!=='pressure' && <div className="hint-box"><strong>Answer guide</strong><ul>{(interviewHints[question.category]||[]).map(h=><li key={h}>{h}</li>)}</ul></div>}
      </section>

      <section className="answer-card">
        <div className="answer-head"><h3>Your answer</h3><span>{SpeechRecognition?'Voice available':'Type fallback'}</span></div>
        {prepLeft!==null && <div className="prep-banner"><strong>{prepLeft}</strong><div><b>Use this thinking time.</b><span>Pick your main point and one example. Recording starts automatically at zero.</span></div><button className="ghost" onClick={cancelPrep}>Cancel</button></div>}
        <textarea value={transcript||manual} onChange={e=>{setTranscript('');setManual(e.target.value)}} placeholder="Your transcript will appear here, or type your answer if voice recognition is unavailable..."/>
        <div className="voice-actions">
          {listening?<button className="danger" onClick={stop}><Square size={17}/> Stop</button>:<button onClick={beginAnswer} disabled={prepLeft!==null}><Mic size={17}/> {modeConfig.prepSeconds?`Start with ${modeConfig.prepSeconds}s prep`:'Start speaking'}</button>}
          <button className="secondary" disabled={!answer} onClick={finish}>Evaluate answer</button>
          <button className="ghost" onClick={next}>Next question</button>
        </div>
        {result && <div className="feedback"><div><strong>{result.score}/10</strong><span>practice score</span></div><p><b>{result.words} words</b> | {result.filler} filler-word matches. {mode==='nervous'?'Good practice. Focus on finishing one clear thought at a time; pauses are okay.':'Aim for a clear 60-90 second response with a direct answer, evidence/example, and business impact.'}</p></div>}
      </section>
    </div>

    <div className="callout"><MicOff size={20}/><div><strong>Privacy-first V1</strong><p>Audio is not stored by PrepForge. Browser speech-recognition support varies. A later version can add secure realtime AI interviewing and adaptive follow-up questions.</p></div></div>
  </>
}

function Progress({ cards, ratings, sessions }) {
  const known=cards.filter(c=>ratings[c.id]==='known').length; const review=cards.filter(c=>ratings[c.id]==='review').length; const unreviewed=cards.length-known-review;
  const avg=sessions.length?Math.round(sessions.reduce((a,b)=>a+b.score,0)/sessions.length*10)/10:0;
  return <>
    <Header eyebrow="Measure improvement" title="Progress" subtitle="See what you know, what needs work, and how often you're practicing aloud." />
    <div className="stats-grid"><Stat icon={CheckCircle2} label="Known" value={known} hint="Flashcards"/><Stat icon={XCircle} label="Review" value={review} hint="Needs reinforcement"/><Stat icon={RotateCcw} label="Unreviewed" value={unreviewed} hint="Not rated yet"/><Stat icon={Mic} label="Voice average" value={avg||'-'} hint={`${sessions.length} sessions`}/></div>
    <section className="section-block"><div className="section-title"><div><span className="eyebrow">Recent voice practice</span><h2>Session history</h2></div></div><div className="session-list">{sessions.length?sessions.slice(0,8).map(s=><div className="session-row" key={s.id}><div><span>{s.category}{s.mode?` | ${s.mode}`:''}</span><strong>{s.question}</strong></div><div><b>{s.score}/10</b><small>{s.words} words</small></div></div>):<div className="empty">No voice sessions yet. Start one from Voice Interview.</div>}</div></section>
  </>
}

function Portfolio(){
  return <>
    <Header eyebrow="Built to share" title="Portfolio-ready project" subtitle="PrepForge is designed to be useful to you first-and strong enough to showcase publicly." />
    <section className="portfolio-hero"><div><span className="pill">Personal AI learning product</span><h2>PrepForge</h2><p>A study and interview-practice platform combining flashcards, notes, active recall, progress tracking, and voice mock interviews.</p></div><div className="stack"><span>React</span><span>Vite</span><span>Web Speech API</span><span>LocalStorage</span><span>Responsive UI</span></div></section>
    <div className="share-grid"><Share icon={Code2} title="GitHub" text="Show architecture, README, screenshots, features, roadmap, and clean source code."/><Share icon={Layers3} title="LinkedIn" text="Feature it as a project focused on AI-assisted interview preparation and learning analytics."/><Share icon={BriefcaseBusiness} title="Handshake" text="Add it as a technical project demonstrating product thinking, frontend engineering, and AI roadmap design."/></div>
    <section className="section-block"><div className="section-title"><div><span className="eyebrow">Project story</span><h2>What makes it portfolio-worthy</h2></div></div><div className="story-list"><p><b>Problem:</b> Interview knowledge was spread across chats, notes, and flashcards with limited speaking practice.</p><p><b>Solution:</b> A single app that turns interview material into structured study, active recall, voice rehearsal, and progress signals.</p><p><b>Next:</b> Add authentication, cloud sync, secure AI voice interviewing, adaptive spaced repetition, and analytics.</p></div></section>
  </>
}

function Share({icon:Icon,title,text}){return <div className="share-card"><Icon size={24}/><h3>{title}</h3><p>{text}</p></div>}

createRoot(document.getElementById('root')).render(<App />);
