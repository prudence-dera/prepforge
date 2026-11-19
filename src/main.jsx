import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BookOpen, BrainCircuit, CheckCircle2, ChevronLeft, ChevronRight,
  CircleHelp, Code2, Database, Gauge, Home, Layers3, Mic, MicOff,
  NotebookPen, RotateCcw, Search, Sparkles, Square, Trophy, Volume2,
  XCircle, BriefcaseBusiness
} from 'lucide-react';
import './styles.css';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';
import nlp from 'compromise';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

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
        {view === 'resume' && <ResumeReviewer />}
        {view === 'quiz' && <Quiz cards={cards} ratings={ratings} setRatings={setRatings} />}
        {view === 'voice' && <VoiceInterview sessions={sessions} setSessions={setSessions} />}
        {view === 'travelers' && <TravelersPrep />}
        {view === 'progress' && <Progress cards={cards} ratings={ratings} sessions={sessions} />}
        {view === 'portfolio' && <Portfolio />}
      </main>
    </div>
  );
}

function Sidebar({ view, setView }) {
  const items = [
    ['dashboard', Home, 'Dashboard'], ['flashcards', Layers3, 'Flashcards'], ['notes', NotebookPen, 'Notes'],
    ['resume', NotebookPen, 'Resume Reviewer'], ['quiz', CircleHelp, 'Quiz'], ['voice', Mic, 'Voice Interview'], ['travelers', BriefcaseBusiness, 'Travelers Prep'], ['progress', Gauge, 'Progress'], ['portfolio', BriefcaseBusiness, 'Portfolio']
  ];
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark">PF</div><div><strong>PrepForge</strong><span>Build. Practice. Master.</span></div></div>
    <nav>{items.map(([id, Icon, label]) => <button key={id} className={view === id ? 'active' : ''} onClick={() => setView(id)}><Icon size={18} /><span>{label}</span></button>)}</nav>
    <div className="sidebar-foot"><Sparkles size={16} /><span>Travelers Data Engineer track</span></div>
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
      return { cat, total: relevant.length, pct: relevant.length ? Math.round(known / relevant.length * 100) : 0 };
    }).filter(x => x.total > 0);
  }, [cards, ratings]);
  return <>
    <Header eyebrow="Interview readiness" title="Your study command center" subtitle="Turn interview prep into a repeatable system: learn, practice aloud, measure, and improve." />
    <section className="hero-card">
      <div><span className="pill">March 2027 target</span><h2>{progress}% of core cards mastered</h2><p>Focus on weak topics first, then practice explaining them aloud in interview mode.</p><div className="hero-actions"><button onClick={() => setView('flashcards')}>Review cards</button><button className="secondary" onClick={() => setView('voice')}>Start voice interview</button></div></div>
      <div className="ring" style={{ '--p': `${progress * 3.6}deg` }}><div><strong>{progress}%</strong><span>mastered</span></div></div>
    </section>
    <section className="stats-grid">
      <Stat icon={Layers3} label="Flashcards" value={cards.length} hint={`${needsReview} marked review`} />
      <Stat icon={CheckCircle2} label="Mastered" value={mastered} hint="Known cards" />
      <Stat icon={Mic} label="Voice sessions" value={sessions.length} hint="Practice attempts" />
      <Stat icon={Trophy} label="Target" value="Mar '27" hint="Interview-ready" />
    </section>
    <section className="section-block"><div className="section-title"><div><span className="eyebrow">Category progress</span><h2>What to work on next</h2></div></div><div className="category-grid">{categoryStats.map(x => <div className="category-card" key={x.cat}><div className="category-row"><span>{x.cat}</span><strong>{x.pct}%</strong></div><div className="bar"><span style={{ width: `${x.pct}%` }} /></div><small>{x.total} cards</small></div>)}</div></section>
  </>
}

function Stat({ icon: Icon, label, value, hint }) { return <div className="stat-card"><Icon size={20} /><span>{label}</span><strong>{value}</strong><small>{hint}</small></div> }

function Flashcards({ cards, setCards, ratings, setRatings }) {
  const [cat, setCat] = useState('All'); const [search, setSearch] = useState(''); const [idx, setIdx] = useState(0); const [flipped, setFlipped] = useState(false); const [showForm, setShowForm] = useState(false);
  const filtered = cards.filter(c => (cat === 'All' || c.category === cat) && (c.q.toLowerCase().includes(search.toLowerCase()) || c.a.toLowerCase().includes(search.toLowerCase())));
  useEffect(() => { setIdx(0); setFlipped(false); }, [cat, search]);
  const card = filtered[idx];
  function rate(v) { if (!card) return; setRatings({ ...ratings, [card.id]: v }); setFlipped(false); setIdx((idx + 1) % filtered.length); }
  return <>
    <Header eyebrow="Active recall" title="Flashcards" subtitle="Review what matters, mark weak areas, and come back to them more often." />
    <div className="toolbar"><div className="search"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cards..." /></div><select value={cat} onChange={e => setCat(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select><button onClick={() => setShowForm(!showForm)}>+ Add card</button></div>
    {showForm && <CardForm onAdd={(c) => { setCards([...cards, { ...c, id: Date.now() }]); setShowForm(false) }} />}
    {card ? <div className="flash-wrap"><div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}><div className="flash-top"><span>{card.category}</span><small>{idx + 1} / {filtered.length}</small></div><h2>{flipped ? card.a : card.q}</h2><p>{flipped ? 'Tap to see question' : 'Tap to reveal answer'}</p></div><div className="flash-controls"><button className="icon-btn" onClick={() => { setIdx((idx - 1 + filtered.length) % filtered.length); setFlipped(false) }}><ChevronLeft /></button><button className="review" onClick={() => rate('review')}><XCircle size={18} /> Need review</button><button className="known" onClick={() => rate('known')}><CheckCircle2 size={18} /> Know it</button><button className="icon-btn" onClick={() => { setIdx((idx + 1) % filtered.length); setFlipped(false) }}><ChevronRight /></button></div><div className="rating-line">Status: <strong>{ratings[card.id] || 'unreviewed'}</strong></div></div> : <div className="empty">No cards match this filter.</div>}
  </>
}

function CardForm({ onAdd }) {
  const [q, setQ] = useState(''); const [a, setA] = useState(''); const [category, setCategory] = useState('SQL');
  return <div className="inline-form"><select value={category} onChange={e => setCategory(e.target.value)}>{categories.slice(1).map(c => <option key={c}>{c}</option>)}</select><input value={q} onChange={e => setQ(e.target.value)} placeholder="Question" /><input value={a} onChange={e => setA(e.target.value)} placeholder="Answer" /><button disabled={!q || !a} onClick={() => onAdd({ q, a, category })}>Save</button></div>
}

function Notes({ notes, setNotes }) {
  const [selected, setSelected] = useState(notes[0]?.id); const [search, setSearch] = useState('');
  const filtered = notes.filter(n => (n.title + n.body + n.category).toLowerCase().includes(search.toLowerCase())); const note = notes.find(n => n.id === selected) || filtered[0];
  function update(field, value) { setNotes(notes.map(n => n.id === note.id ? { ...n, [field]: value } : n)); }
  function add() { const n = { id: Date.now(), title: 'New note', category: 'General', body: '' }; setNotes([...notes, n]); setSelected(n.id); }
  return <>
    <Header eyebrow="Interview notebook" title="Notes" subtitle="Keep full answers, project stories, troubleshooting patterns, and concepts in one place." />
    <div className="notes-layout"><aside className="notes-list"><div className="search"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes..." /></div><button className="new-note" onClick={add}>+ New note</button>{filtered.map(n => <button key={n.id} className={note?.id === n.id ? 'selected' : ''} onClick={() => setSelected(n.id)}><span>{n.category}</span><strong>{n.title}</strong></button>)}</aside>{note && <article className="note-editor"><input className="note-title" value={note.title} onChange={e => update('title', e.target.value)} /><input className="note-category" value={note.category} onChange={e => update('category', e.target.value)} /><textarea value={note.body} onChange={e => update('body', e.target.value)} /><small>Saved automatically in this browser.</small></article>}</div>
  </>
}


const resumeRoleProfiles = {
  'Data Engineer': ['Python', 'SQL', 'AWS', 'ETL', 'ELT', 'Amazon S3', 'Airflow', 'PySpark', 'Data Quality', 'APIs', 'Git', 'CI/CD', 'Terraform', 'Docker'],
  'AI / ML Engineer': ['Python', 'Machine Learning', 'PyTorch', 'scikit-learn', 'NLP', 'Computer Vision', 'LLMs', 'RAG', 'AWS', 'APIs', 'Docker', 'Git'],
  'Cloud Engineer': ['AWS', 'Amazon S3', 'AWS Glue', 'Athena', 'IAM', 'Lambda', 'Terraform', 'Docker', 'CI/CD', 'Monitoring', 'APIs', 'Python', 'SQL'],
  'General Technical': ['Python', 'SQL', 'Git', 'APIs', 'AWS', 'Testing', 'CI/CD', 'Docker']
};

const resumeSkillAliases = {
  'Python': ['python'],
  'SQL': ['sql', 'mysql', 'postgresql', 'sql server', 't-sql'],
  'AWS': ['aws', 'amazon web services'],
  'Amazon S3': ['amazon s3', 's3'],
  'AWS Glue': ['aws glue', 'glue crawler', 'glue'],
  'Athena': ['athena'],
  'IAM': ['iam', 'identity and access management'],
  'Lambda': ['aws lambda', 'lambda'],
  'ETL': ['etl', 'extract transform load'],
  'ELT': ['elt', 'extract load transform'],
  'Airflow': ['airflow', 'apache airflow'],
  'PySpark': ['pyspark', 'spark'],
  'Data Quality': ['data quality', 'data validation', 'quality checks', 'data integrity'],
  'Data Governance': ['data governance', 'governance', 'data lineage'],
  'APIs': ['api', 'apis', 'rest api', 'restful'],
  'Git': ['git', 'github'],
  'CI/CD': ['ci/cd', 'continuous integration', 'continuous delivery', 'continuous deployment'],
  'Terraform': ['terraform', 'infrastructure as code', 'iac'],
  'Docker': ['docker', 'containerization', 'containerized'],
  'Kubernetes': ['kubernetes', 'k8s'],
  'Testing': ['unit test', 'unit testing', 'integration test', 'test automation', 'automated testing'],
  'Monitoring': ['monitoring', 'observability', 'cloudwatch', 'alerting'],
  'Machine Learning': ['machine learning', 'ml model', 'supervised learning', 'unsupervised learning'],
  'PyTorch': ['pytorch', 'torch'],
  'scikit-learn': ['scikit-learn', 'sklearn'],
  'NLP': ['nlp', 'natural language processing', 'transformers'],
  'Computer Vision': ['computer vision', 'opencv', 'image classification'],
  'LLMs': ['llm', 'large language model', 'large language models', 'generative ai', 'genai'],
  'RAG': ['rag', 'retrieval augmented generation', 'retrieval-augmented generation']
};

const resumeActionVerbs = ['built', 'developed', 'designed', 'implemented', 'automated', 'optimized', 'improved', 'reduced', 'increased', 'created', 'deployed', 'migrated', 'engineered', 'analyzed', 'led', 'managed', 'streamlined', 'integrated', 'validated', 'orchestrated', 'monitored', 'resolved', 'troubleshot'];
const weakResumePhrases = ['responsible for', 'helped with', 'worked on', 'assisted with', 'duties included', 'tasked with'];

function resumeHasSkill(text, skill) {
  const aliases = resumeSkillAliases[skill] || [skill.toLowerCase()];
  const normalized = text.toLowerCase();

  return aliases.some(alias => {
    const escaped = alias
      .toLowerCase()
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const pattern = new RegExp(
      `(^|[^a-z0-9+#])${escaped}(?=$|[^a-z0-9+#])`,
      'i'
    );

    return pattern.test(normalized);
  });
}

const jobStopWords = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into',
  'your', 'you', 'our', 'are', 'will', 'have', 'has', 'had',
  'job', 'role', 'work', 'working', 'team', 'including',
  'required', 'preferred', 'qualification', 'qualifications',
  'experience', 'years', 'ability', 'skills', 'strong',
  'responsibilities', 'responsibility', 'position',
  'like', 'high', 'often', 'typically', 'through', 'ongoing',
  'accurate', 'timely', 'related', 'field', 'assets'
]);

function extractJobKeywords(text) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9+#&/\-\s]+/g, ' ')
    .split(/\s+/)
    .filter(word =>
      word.length >= 3 &&
      !jobStopWords.has(word) &&
      !/^\d+$/.test(word)
    );

  const counts = {};

  words.forEach(word => {
    counts[word] = (counts[word] || 0) + 1;
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}

const jobPhraseEdgeWords = new Set([
  'the', 'a', 'an', 'and', 'each', 'all', 'other',
  'their', 'our', 'your', 'this', 'that',
  'these', 'those', 'certain', 'relevant',
  'future', 'entire'
]);
const jobPhraseNoiseWords = new Set([
  'you', 'll', 'we', 'us',
  'position', 'remote', 'team',
  'environment', 'growing',
  'company', 'organization',
  'employee', 'employees',
  'manager', 'managers',
  'operations',
  'accountability', 'performance', 'expectations',
  'coaching', 'opportunities', 'professional',
  'growth', 'oriented', 'environment', 'clear'
]);


function extractJobPhrases(text) {
  const nounPhrases = nlp(text)
    .nouns()
    .out('array')
    .map(phrase => {
      const words = phrase
        .toLowerCase()
        .replace(/[^a-z0-9+#&/.\-\s]+/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
        .filter(word => word !== 's');

      while (words.length && jobPhraseEdgeWords.has(words[0])) {
        words.shift();
      }

      while (
        words.length &&
        jobPhraseEdgeWords.has(words[words.length - 1])
      ) {
        words.pop();
      }

      return words.join(' ');
    })
    .filter(Boolean)
    .filter(phrase => {
      const words = phrase
        .toLowerCase()
        .replace(/-/g, ' ')
        .replace(/[^a-z0-9+#\s]/g, ' ')
        .split(/\s+/)
        .filter(Boolean);

      if (words.length < 2 || words.length > 6) return false;

      const meaningfulWords = words.filter(
        word =>
          !jobStopWords.has(word) &&
          !jobPhraseNoiseWords.has(word)
      );

      return meaningfulWords.length >= 2;
    });

  return [...new Set(nounPhrases)].slice(0, 30);
}

function resumeMatchesRequirement(resumeText, requirement) {
  const normalizeJobLanguage = value =>
    value
      .toLowerCase()
      .replace(/\bregulatory\b/g, 'regulation')
      .replace(/\bregulations\b/g, 'regulation')
      .replace(/\bguidelines\b/g, 'guideline')
      .replace(/\bapplications\b/g, 'application')
      .replace(/\bdecisions\b/g, 'decision')
      .replace(/\bstatements\b/g, 'statement')
      .replace(/\bprograms\b/g, 'program');

  const normalizedResume = normalizeJobLanguage(resumeText);

  const requirementWords = normalizeJobLanguage(requirement)
    .replace(/[^a-z0-9+#&/\-\s]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter(word =>
      word.length >= 3 &&
      !jobStopWords.has(word) &&
      !jobPhraseEdgeWords.has(word)
    );

  if (!requirementWords.length) return false;

  const matchedWords = requirementWords.filter(word => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    return new RegExp(
      `(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`,
      'i'
    ).test(normalizedResume);
  });

  if (requirementWords.length === 1) {
    return matchedWords.length === 1;
  }

  const requiredMatches = Math.max(
    2,
    Math.ceil(requirementWords.length * 0.6)
  );

  return matchedWords.length >= requiredMatches;
}

function dedupeJobRequirements(requirements) {
  const normalize = phrase =>
    phrase
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\bstatements\b/g, 'statement')
      .replace(/\bapplications\b/g, 'application')
      .replace(/\bdecisions\b/g, 'decision')
      .replace(/\s+/g, ' ')
      .trim();

  const kept = [];

  for (const requirement of requirements) {
    const words = normalize(requirement).split(' ').filter(Boolean);

    const duplicateIndex = kept.findIndex(existing => {
      const existingWords = normalize(existing).split(' ').filter(Boolean);
      const existingSet = new Set(existingWords);
      const currentSet = new Set(words);

      const currentInsideExisting =
        words.every(word => existingSet.has(word));

      const existingInsideCurrent =
        existingWords.every(word => currentSet.has(word));

      return currentInsideExisting || existingInsideCurrent;
    });

    if (duplicateIndex === -1) {
      kept.push(requirement);
    } else {
      const existingWordCount =
        normalize(kept[duplicateIndex]).split(' ').length;

      if (words.length > existingWordCount) {
        kept[duplicateIndex] = requirement;
      }
    }
  }

return kept;
}
function analyzeResumeText(text, targetRole, jobDescription = '') {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const lines = trimmed.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  const targetSkills =
    targetRole === 'Custom Job'
      ? dedupeJobRequirements(extractJobPhrases(jobDescription)).slice(0, 15)
      : resumeRoleProfiles[targetRole] || resumeRoleProfiles['General Technical'];
  const allSkills = Object.keys(resumeSkillAliases);
  const detectedSkills = allSkills.filter(skill => resumeHasSkill(trimmed, skill));
  const matchedSkills = targetSkills.filter(skill =>
    targetRole === 'Custom Job'
      ? resumeMatchesRequirement(trimmed, skill)
      : resumeHasSkill(trimmed, skill)
  );

  const missingSkills = targetSkills.filter(skill =>
    targetRole === 'Custom Job'
      ? !resumeMatchesRequirement(trimmed, skill)
      : !resumeHasSkill(trimmed, skill)
  );
  const metricMatches = trimmed.match(/(?:\$\s?\d[\d,.]*|\b(?:\d+(?:\.\d+)?|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)\+?\s?(?:%|x|k|m|million|thousand|hours?|days?|weeks?|months?|years?)\b)/gi) || [];
  const actionLines = lines.filter(line => resumeActionVerbs.some(v => new RegExp(`^(?:[-*•]\\s*)?${v}\\b`, 'i').test(line)));
  const actionVerbMatches = resumeActionVerbs.filter(v =>
    new RegExp(`\\b${v}\\b`, 'i').test(trimmed)
  );

  const actionSignalCount = Math.max(actionLines.length, actionVerbMatches.length);
  const weakLines = lines.filter(line => weakResumePhrases.some(p => line.toLowerCase().includes(p)));
  const sections = {
    experience: /\b(experience|professional experience|work experience)\b/i.test(trimmed),
    skills: /\b(skills|technical skills|technologies)\b/i.test(trimmed),
    education: /\b(education|academic)\b/i.test(trimmed),
    projects: /\b(projects|technical projects|selected projects)\b/i.test(trimmed)
  };
  const sectionCount = Object.values(sections).filter(Boolean).length;
  const lengthScore = words.length >= 250 && words.length <= 1100 ? 20 : words.length >= 150 && words.length <= 1400 ? 14 : 8;
  const sectionScore = Math.round(sectionCount / 4 * 20);
  const skillScore = Math.round(matchedSkills.length / Math.max(1, targetSkills.length) * 20);
  const metricsScore = Math.min(20, metricMatches.length * 4);
  const actionScore = Math.min(20, actionSignalCount * 4);
  const score = targetRole === 'Custom Job'
    ? Math.max(
      1,
      Math.min(
        100,
        Math.round(
          (matchedSkills.length / Math.max(1, targetSkills.length)) * 50 +
          Math.min(15, metricMatches.length * 3) +
          Math.min(15, actionSignalCount * 3) +
          Math.round((sectionCount / 4) * 10) +
          (words.length >= 250 && words.length <= 1100 ? 10 : 5)
        )
      )
    )
    : Math.max(
      1,
      Math.min(
        100,
        lengthScore + sectionScore + skillScore + metricsScore + actionScore
      )
    );

  const strengths = [];
  if (matchedSkills.length >= 6) {
    strengths.push(
      targetRole === 'Custom Job'
        ? `Strong job alignment: ${matchedSkills.length} job requirements detected in the resume.`
        : `Strong technical alignment for ${targetRole}: ${matchedSkills.length} target skills detected.`
    );
  }
  else if (matchedSkills.length) {
    strengths.push(
      targetRole === 'Custom Job'
        ? `${matchedSkills.length} job requirements are already visible in the resume.`
        : `${matchedSkills.length} target-role skills are already visible in the resume.`
    );
  };
  if (metricMatches.length >= 3) strengths.push(`${metricMatches.length} measurable results or scale indicators detected.`);
  if (actionSignalCount >= 3) strengths.push('Several lines begin with strong action-oriented language.');
  if (sections.experience && sections.skills && sections.education) strengths.push('Core resume sections are clearly represented.');
  if (!strengths.length) strengths.push('The resume provides enough material to start a focused revision pass.');

  const opportunities = [];
  if (missingSkills.length) {
    opportunities.push(
      targetRole === 'Custom Job'
        ? `Add evidence for relevant job requirements you genuinely have but are not currently showing: ${missingSkills.slice(0, 6).join(', ')}${missingSkills.length > 6 ? '...' : ''}`
        : `Add evidence for relevant skills you genuinely have but are not currently showing: ${missingSkills.slice(0, 6).join(', ')}${missingSkills.length > 6 ? '...' : ''}`
    );
  }
  if (metricMatches.length < 3) opportunities.push('Add measurable outcomes where possible: time saved, quality improvement, SLA, volume, accuracy, cost, or delivery speed.');
  if (actionSignalCount < 3) opportunities.push('Start more accomplishment bullets with clear action verbs such as Built, Automated, Improved, Deployed, or Resolved.');
  if (weakLines.length) opportunities.push(`Replace passive phrasing in ${weakLines.length} line${weakLines.length === 1 ? '' : 's'} such as “responsible for” with ownership + outcome language.`);
  if (!sections.projects && targetRole !== 'Custom Job') {
    opportunities.push(
      'Consider a Projects section when technical projects provide stronger evidence than job titles alone.'
    );
  }
  if (words.length < 250) opportunities.push('The resume appears brief; make sure your strongest technical work and results are represented.');
  if (words.length > 1100) opportunities.push('The resume is text-heavy; prioritize the most role-relevant evidence and remove repetition.');

  const bulletCandidates = [...weakLines, ...lines.filter(l => /^[-*•]/.test(l))].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3);
  const accomplishmentPrompts = (bulletCandidates.length ? bulletCandidates : lines.slice(0, 3)).map(line => ({
    original: line,
    prompt: 'Strengthen with: Action + what you changed/built + tools/technical method + measurable result or business impact. Do not invent a metric—use one you can defend in an interview.'
  }));

  return { score, words: words.length, detectedSkills, matchedSkills, missingSkills, metrics: metricMatches.length, actionLines: actionSignalCount, weakLines: weakLines.length, strengths, opportunities, accomplishmentPrompts };
}

function ResumeReviewer() {
  const [targetRole, setTargetRole] = useState('Data Engineer');
  const [resumeText, setResumeText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');

  async function loadResumeFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileError('');
    setFileName('');

    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!['txt', 'md', 'pdf', 'docx'].includes(extension)) {
      setFileError('Please upload a .txt, .md, .pdf, or .docx resume.');
      return;
    }

    try {
      let content = '';

      if (extension === 'txt' || extension === 'md') {
        content = await file.text();
      }

      if (extension === 'pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const pages = [];

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const textContent = await page.getTextContent();

          const pageText = textContent.items
            .map(item => ('str' in item ? item.str : ''))
            .filter(text => text.trim())
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();

          pages.push(pageText);

        }

        content = pages.join('\n\n');
      }

      if (extension === 'docx') {
        const arrayBuffer = await file.arrayBuffer();

        const result = await mammoth.extractRawText({
          arrayBuffer
        });

        content = result.value;
      }

      if (!content.trim()) {
        setFileError(
          'PrepForge could not detect readable text in this file. If this is a scanned PDF, paste the resume text instead.'
        );
        return;
      }

      setResumeText(content);
      setFileName(file.name);
      setAnalysis(null);
    } catch (error) {
      console.error('Resume file error:', error);
      setFileError(
        'PrepForge could not read that file. Please try another file or paste the resume text.'
      );
    }
  }


  function runAnalysis() {
    if (!resumeText.trim()) return;
    console.log('Custom job keywords:', extractJobKeywords(jobDescription));
    console.log('Custom job phrases:', extractJobPhrases(jobDescription));
    setAnalysis(analyzeResumeText(resumeText, targetRole, jobDescription));
  }

  function clearResume() { setResumeText(''); setAnalysis(null); setFileName(''); setFileError(''); }

  return <>
    <Header eyebrow="Career readiness" title="Resume Reviewer" subtitle="Review the evidence your resume presents for a target technical role. PrepForge analyzes locally in your browser and gives transparent, structured feedback." />
    <div className="resume-toolbar">
      <label className="role-select"><span>Target role</span><select value={targetRole} onChange={e => { setTargetRole(e.target.value); setAnalysis(null) }}> <option value="Custom Job">Custom Job Description</option>{Object.keys(resumeRoleProfiles).map(role => <option key={role}>{role}</option>)}</select></label>
      <label className="upload-resume"><Layers3 size={18} /><span>{fileName || 'Upload resume (.PDF, .DOCX, .TXT, .MD)'}</span><input type="file" accept=".txt,.md,.pdf,.docx,text/plain,text/markdown,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={loadResumeFile} /></label>
      <button className="ghost" onClick={clearResume}>Clear</button>
    </div>
    {targetRole === 'Custom Job' && (
      <div className="custom-job-section">
        <label>
          <span>Job title</span>
          <input
            type="text"
            value={jobTitle}
            onChange={e => {
              setJobTitle(e.target.value);
              setAnalysis(null);
            }}
            placeholder="Example: Mortgage Underwriter"
          />
        </label>

        <label>
          <span>Job description</span>
          <textarea
            value={jobDescription}
            onChange={e => {
              setJobDescription(e.target.value);
              setAnalysis(null);
            }}
            placeholder="Paste the full job description here..."
          />
        </label>
      </div>
    )}
    {fileError && <div className="resume-alert">{fileError}</div>}
    <div className="resume-layout">
      <section className="resume-editor-card">
        <div className="resume-editor-head"><div><span className="eyebrow">Resume text</span><h2>Paste or upload your resume</h2></div><span>{resumeText.trim() ? `${resumeText.trim().split(/\s+/).length} words` : 'Not analyzed yet'}</span></div>
        <textarea value={resumeText} onChange={e => { setResumeText(e.target.value); setAnalysis(null) }} placeholder="Paste your resume text here. PrepForge does not automatically save this text to localStorage." />
        <div className="hero-actions"><button disabled={!resumeText.trim()} onClick={runAnalysis}><Sparkles size={18} /> Analyze resume</button></div>
        <div className="privacy-note"><strong>Privacy-first V1.2</strong><span>The resume text stays in this browser session and is not sent to an AI service. This is a transparent readiness review, not a proprietary ATS score.</span></div>
      </section>

      <section className="resume-results-card">
        {!analysis ? <div className="resume-empty"><NotebookPen size={36} /><h3>Ready when you are</h3><p>Paste your resume, choose a target role, and run the reviewer. You’ll get skill evidence, accomplishment signals, and concrete revision priorities.</p></div> : <>
          <div className="resume-score-row"><div className="resume-score"><strong>{analysis.score}</strong><span>/100</span></div><div><span className="eyebrow">PrepForge readiness signal</span><h2>
            {targetRole === 'Custom Job'
              ? (jobTitle || 'Custom Job')
              : targetRole}
          </h2><p>
              {targetRole === 'Custom Job'
                ? `${analysis.matchedSkills.length} of ${analysis.matchedSkills.length + analysis.missingSkills.length} job requirements detected in the resume.`
                : `${analysis.matchedSkills.length} of ${resumeRoleProfiles[targetRole].length} target skills detected in the resume text.`}
            </p></div></div>
          <div className="resume-mini-stats">
            <div>
              <strong>
                {targetRole === 'Custom Job'
                  ? analysis.matchedSkills.length
                  : analysis.detectedSkills.length}
              </strong>
              <span>
                {targetRole === 'Custom Job'
                  ? 'job requirements matched'
                  : 'technical skills'}
              </span>
            </div>

            <div>
              <strong>{analysis.metrics}</strong>
              <span>measurable signals</span>
            </div>

            <div>
              <strong>{analysis.actionLines}</strong>
              <span>action-led lines</span>
            </div>

            <div>
              <strong>{analysis.words}</strong>
              <span>words</span>
            </div>
          </div>
        </>}
      </section>
    </div>

    {analysis && <>
      <div className="resume-panel-grid">
        <section className="resume-panel">
          <span className="eyebrow">Evidence detected</span>

          <h2>
            {targetRole === 'Custom Job'
              ? 'Job requirements detected'
              : 'Technical skills'}
          </h2>

          <div className="skill-cloud">
            {(targetRole === 'Custom Job'
              ? analysis.matchedSkills
              : analysis.detectedSkills
            ).length ? (
              (targetRole === 'Custom Job'
                ? analysis.matchedSkills
                : analysis.detectedSkills
              ).map(skill => (
                <span className="skill-chip matched" key={skill}>
                  {skill}
                </span>
              ))
            ) : (
              <span className="muted">
                {targetRole === 'Custom Job'
                  ? 'No clear matches to the selected job requirements were detected yet.'
                  : 'No technical skills from the current dictionary were detected.'}
              </span>
            )}
          </div>
        </section>

        <section className="resume-panel">
          <span className="eyebrow">Evidence gaps</span>
          <h2>
            {targetRole === 'Custom Job'
              ? 'Job requirements not detected'
              : 'Target skills not detected'}
          </h2>

          <p className="muted small-copy">
            {targetRole === 'Custom Job'
              ? 'This does not mean you lack these qualifications. It means PrepForge did not find clear evidence for these job requirements in the resume.'
              : 'This does not mean you lack these skills. It means PrepForge did not find clear evidence for them in the pasted resume.'}
          </p>

          <div className="skill-cloud">
            {analysis.missingSkills.length ? (
              analysis.missingSkills.map(skill => (
                <span className="skill-chip missing" key={skill}>
                  {skill}
                </span>
              ))
            ) : (
              <span className="skill-chip matched">Strong role coverage</span>
            )}
          </div>
        </section>
      </div>
      <div className="resume-panel-grid">
        <section className="resume-panel"><span className="eyebrow">What is working</span><h2>Strengths</h2><ul className="resume-list">{analysis.strengths.map(item => <li key={item}><CheckCircle2 size={17} /><span>{item}</span></li>)}</ul></section>
        <section className="resume-panel"><span className="eyebrow">Highest-value revisions</span><h2>Opportunities</h2><ul className="resume-list opportunity">{analysis.opportunities.map(item => <li key={item}><Sparkles size={17} /><span>{item}</span></li>)}</ul></section>
      </div>
      <section className="resume-panel accomplishment-panel"><span className="eyebrow">Accomplishment builder</span><h2>Turn responsibilities into evidence</h2><p className="muted">PrepForge will not invent results. Use these prompts to strengthen real accomplishments you can explain in an interview.</p><div className="accomplishment-list">{analysis.accomplishmentPrompts.map((item, i) => <div key={i}><span>Current line</span><p>{item.original}</p><strong>{item.prompt}</strong></div>)}</div></section>
      <div className="callout"><Sparkles size={20} /><div><strong>Next milestone: Custom Job Track</strong><p>The next feature will let you paste a real job description and compare its requirements directly against this resume analysis, then generate targeted flashcards and interview practice.</p></div></div>
    </>}
  </>
}

function Quiz({ cards, ratings, setRatings }) {
  const pool = useMemo(() => [...cards].sort((a, b) => (ratings[a.id] === 'review' ? -1 : 1) - (ratings[b.id] === 'review' ? -1 : 1)).slice(0, 10), [cards, ratings]);
  const [idx, setIdx] = useState(0); const [revealed, setRevealed] = useState(false); const q = pool[idx];
  return <>
    <Header eyebrow="Retrieval practice" title="Quiz mode" subtitle="Explain the answer before revealing it. Prioritize concepts you marked for review." />
    <div className="quiz-card"><span className="pill">{q?.category}</span><h2>{q?.q}</h2>{revealed ? <div className="quiz-answer"><span>Strong answer</span><p>{q?.a}</p></div> : <p className="muted">Say your answer out loud before revealing it.</p>}<div className="hero-actions"><button onClick={() => setRevealed(!revealed)}>{revealed ? 'Hide answer' : 'Reveal answer'}</button><button className="secondary" onClick={() => { setIdx((idx + 1) % pool.length); setRevealed(false) }}>Next question</button></div></div>
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
  const [qIdx, setQIdx] = useState(0);
  const [mode, setMode] = useState('nervous');
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [manual, setManual] = useState('');
  const [result, setResult] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [prepLeft, setPrepLeft] = useState(null);
  const recognitionRef = useRef(null);
  const prepTimerRef = useRef(null);
  const question = interviewQuestions[qIdx];
  const modeConfig = interviewModes[mode];
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  useEffect(() => () => {
    if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    recognitionRef.current?.stop();
  }, []);

  function speak() {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(question.text);
    u.rate = modeConfig.speechRate;
    window.speechSynthesis.speak(u);
  }

  function start() {
    if (!SpeechRecognition) { setListening(false); return; }
    const r = new SpeechRecognition();
    r.continuous = true;
    r.interimResults = true;
    r.lang = 'en-US';
    r.onresult = e => {
      let t = '';
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript + ' ';
      setTranscript(t.trim());
    };
    r.onend = () => setListening(false);
    r.start();
    recognitionRef.current = r;
    setListening(true);
  }

  function beginAnswer() {
    if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    const seconds = modeConfig.prepSeconds;
    if (seconds <= 0) { start(); return; }
    let remaining = seconds;
    setPrepLeft(remaining);
    prepTimerRef.current = setInterval(() => {
      remaining -= 1;
      setPrepLeft(remaining);
      if (remaining <= 0) {
        clearInterval(prepTimerRef.current);
        prepTimerRef.current = null;
        setPrepLeft(null);
        start();
      }
    }, 1000);
  }

  function cancelPrep() {
    if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    prepTimerRef.current = null;
    setPrepLeft(null);
  }

  function stop() { recognitionRef.current?.stop(); setListening(false); }
  const answer = (transcript || manual).trim();

  function score() {
    const words = answer.split(/\s+/).filter(Boolean);
    const filler = (answer.match(/\b(um|uh|like|you know|basically|actually)\b/gi) || []).length;
    const practiceScore = Math.max(1, Math.min(10, Math.round((Math.min(words.length, 120) / 120) * 5 + (filler === 0 ? 3 : Math.max(0, 3 - filler)) + (words.length >= 45 ? 2 : 1))));
    const session = { id: Date.now(), question: question.text, category: question.category, words: words.length, filler, score: practiceScore, mode: modeConfig.label, date: new Date().toISOString() };
    setSessions([session, ...sessions]);
    return session;
  }

  function finish() { if (!answer) return; setResult(score()); }

  function next() {
    cancelPrep();
    stop();
    setQIdx((qIdx + 1) % interviewQuestions.length);
    setTranscript('');
    setManual('');
    setResult(null);
    setShowHint(false);
  }

  function changeMode(nextMode) {
    cancelPrep();
    stop();
    setMode(nextMode);
    setResult(null);
    setShowHint(false);
  }

  return <>
    <Header eyebrow="Speak it, don't just study it" title="Voice interview" subtitle="Choose the level of support you need, then practice answering aloud. V1 captures your transcript and measurable speaking signals locally in the browser." />

    <div className="mode-picker" role="group" aria-label="Interview mode">
      {Object.entries(interviewModes).map(([key, item]) => <button key={key} className={`mode-btn ${mode === key ? 'active' : ''}`} onClick={() => changeMode(key)}>{item.label}</button>)}
    </div>
    <div className="mode-note"><Sparkles size={17} /><div><strong>{modeConfig.label}</strong><span>{modeConfig.description}</span></div></div>

    <div className="voice-grid">
      <section className="interviewer-card">
        <div className="avatar"><BrainCircuit size={32} /></div>
        <span className="eyebrow">Mock interviewer | {question.category}</span>
        <h2>{question.text}</h2>
        <div className="interviewer-actions">
          <button className="secondary speak" onClick={speak}><Volume2 size={18} /> Repeat question</button>
          {mode !== 'pressure' && <button className="ghost" onClick={() => setShowHint(!showHint)}>{showHint ? 'Hide hint' : 'Give me a hint'}</button>}
        </div>
        {showHint && mode !== 'pressure' && <div className="hint-box"><strong>Answer guide</strong><ul>{(interviewHints[question.category] || []).map(h => <li key={h}>{h}</li>)}</ul></div>}
      </section>

      <section className="answer-card">
        <div className="answer-head"><h3>Your answer</h3><span>{SpeechRecognition ? 'Voice available' : 'Type fallback'}</span></div>
        {prepLeft !== null && <div className="prep-banner"><strong>{prepLeft}</strong><div><b>Use this thinking time.</b><span>Pick your main point and one example. Recording starts automatically at zero.</span></div><button className="ghost" onClick={cancelPrep}>Cancel</button></div>}
        <textarea value={transcript || manual} onChange={e => { setTranscript(''); setManual(e.target.value) }} placeholder="Your transcript will appear here, or type your answer if voice recognition is unavailable..." />
        <div className="voice-actions">
          {listening ? <button className="danger" onClick={stop}><Square size={17} /> Stop</button> : <button onClick={beginAnswer} disabled={prepLeft !== null}><Mic size={17} /> {modeConfig.prepSeconds ? `Start with ${modeConfig.prepSeconds}s prep` : 'Start speaking'}</button>}
          <button className="secondary" disabled={!answer} onClick={finish}>Evaluate answer</button>
          <button className="ghost" onClick={next}>Next question</button>
        </div>
        {result && <div className="feedback"><div><strong>{result.score}/10</strong><span>practice score</span></div><p><b>{result.words} words</b> | {result.filler} filler-word matches. {mode === 'nervous' ? 'Good practice. Focus on finishing one clear thought at a time; pauses are okay.' : 'Aim for a clear 60-90 second response with a direct answer, evidence/example, and business impact.'}</p></div>}
      </section>
    </div>

    <div className="callout"><MicOff size={20} /><div><strong>Privacy-first V1</strong><p>Audio is not stored by PrepForge. Browser speech-recognition support varies. A later version can add secure realtime AI interviewing and adaptive follow-up questions.</p></div></div>
  </>
}

function Progress({ cards, ratings, sessions }) {
  const known = cards.filter(c => ratings[c.id] === 'known').length; const review = cards.filter(c => ratings[c.id] === 'review').length; const unreviewed = cards.length - known - review;
  const avg = sessions.length ? Math.round(sessions.reduce((a, b) => a + b.score, 0) / sessions.length * 10) / 10 : 0;
  return <>
    <Header eyebrow="Measure improvement" title="Progress" subtitle="See what you know, what needs work, and how often you're practicing aloud." />
    <div className="stats-grid"><Stat icon={CheckCircle2} label="Known" value={known} hint="Flashcards" /><Stat icon={XCircle} label="Review" value={review} hint="Needs reinforcement" /><Stat icon={RotateCcw} label="Unreviewed" value={unreviewed} hint="Not rated yet" /><Stat icon={Mic} label="Voice average" value={avg || '-'} hint={`${sessions.length} sessions`} /></div>
    <section className="section-block"><div className="section-title"><div><span className="eyebrow">Recent voice practice</span><h2>Session history</h2></div></div><div className="session-list">{sessions.length ? sessions.slice(0, 8).map(s => <div className="session-row" key={s.id}><div><span>{s.category}{s.mode ? ` | ${s.mode}` : ''}</span><strong>{s.question}</strong></div><div><b>{s.score}/10</b><small>{s.words} words</small></div></div>) : <div className="empty">No voice sessions yet. Start one from Voice Interview.</div>}</div></section>
  </>
}

function Portfolio() {
  return <>
    <Header eyebrow="Built to share" title="Portfolio-ready project" subtitle="PrepForge is designed to be useful to you first-and strong enough to showcase publicly." />
    <section className="portfolio-hero"><div><span className="pill">Personal AI learning product</span><h2>PrepForge</h2><p>A study and interview-practice platform combining flashcards, notes, active recall, progress tracking, and voice mock interviews.</p></div><div className="stack"><span>React</span><span>Vite</span><span>Web Speech API</span><span>LocalStorage</span><span>Responsive UI</span></div></section>
    <div className="share-grid"><Share icon={Code2} title="GitHub" text="Show architecture, README, screenshots, features, roadmap, and clean source code." /><Share icon={Layers3} title="LinkedIn" text="Feature it as a project focused on AI-assisted interview preparation and learning analytics." /><Share icon={BriefcaseBusiness} title="Handshake" text="Add it as a technical project demonstrating product thinking, frontend engineering, and AI roadmap design." /></div>
    <section className="section-block"><div className="section-title"><div><span className="eyebrow">Project story</span><h2>What makes it portfolio-worthy</h2></div></div><div className="story-list"><p><b>Problem:</b> Interview knowledge was spread across chats, notes, and flashcards with limited speaking practice.</p><p><b>Solution:</b> A single app that turns interview material into structured study, active recall, voice rehearsal, and progress signals.</p><p><b>Next:</b> Add authentication, cloud sync, secure AI voice interviewing, adaptive spaced repetition, and analytics.</p></div></section>
  </>
}

function Share({ icon: Icon, title, text }) { return <div className="share-card"><Icon size={24} /><h3>{title}</h3><p>{text}</p></div> }



const travelersQuestions = [
  {
    id: 1,
    day: 'Monday',
    category: 'SQL & Data Quality',
    question: 'How would you use ROW_NUMBER() to identify the latest record for each insurance policy?',
    answer: 'Use ROW_NUMBER() OVER (PARTITION BY policy_id ORDER BY updated_at DESC), then filter for row number 1. Validate uniqueness and handle timestamp ties.'
  },
  {
    id: 2,
    day: 'Tuesday',
    category: 'AWS & Pipelines',
    question: 'What would you do if an external API stopped responding during your daily AWS ETL pipeline?',
    answer: 'Check logs and API status, use bounded retries with backoff, monitor failures, preserve idempotency, validate completeness, and notify stakeholders if recovery is delayed.'
  },
  {
    id: 3,
    day: 'Thursday',
    category: 'System Design & Reliability',
    question: 'How would you design a reliable pipeline for processing insurance policy and premium data?',
    answer: 'Use secure ingestion, validation, durable storage, orchestration, monitoring, retries, data quality checks, access controls, and recovery procedures.'
  },
  {
    id: 4,
    day: 'Saturday',
    category: 'Behavioral & Insurance',
    question: 'Tell me about a time you identified and resolved a data quality or process issue in insurance operations.',
    answer: 'Use STAR: describe the situation, your responsibility, the actions you personally took, and a measurable result.'
  }
];

function TravelersPrep() {

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long'
  });

  const dailyQuestion =
    travelersQuestions.find(q => q.day === today) ||
    travelersQuestions[0];

  const [answer, setAnswer] = useState('');

  const [savedAnswers, setSavedAnswers] = usePersistentState(
    'prepforge_travelers_answers',
    []
  );

  function saveAnswer() {
    if (!answer.trim()) return;

    const newEntry = {
      id: Date.now(),

      questionId: dailyQuestion.id,
      question: dailyQuestion.question,
      answer: answer.trim(),
      date: new Date().toISOString()
    };

    setSavedAnswers([newEntry, ...savedAnswers]);
    setAnswer('');
    alert('Interview answer saved successfully!');
  }

  return (

    <div className="page">
      <Header
        eyebrow="CAREER DEVELOPMENT"
        title="Travelers Interview Prep"
        subtitle="Data Engineer I • Target: March 2027"
      />

      <div className="panel" style={{ padding: 24 }}>
        <h2>Welcome to Your Interview Prep!</h2>
        <p>
          Practice SQL, Python, AWS, data pipelines,
          system design, and behavioral interview questions.
        </p>

        <h3>Weekly Practice Schedule</h3>
        <ul>
          <li>Monday — SQL, Python & Data Quality</li>
          <li>Tuesday — AWS, APIs & Cloud Pipelines</li>
          <li>Thursday — System Design & Incident Resolution</li>
          <li>Saturday — Behavioral & Mock Interviews</li>
        </ul>



        <div style={{ marginTop: 30 }}>

          <h3>{dailyQuestion.day} — {dailyQuestion.category}</h3>

          <p>{dailyQuestion.question}</p>



          <p><strong>Your Answer:</strong></p>

          <textarea
            placeholder="Type your interview answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}



            rows={5}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 8,
              marginTop: 10
            }}
          />

          <button
            onClick={saveAnswer}
            disabled={!answer.trim()}
            style={{ marginTop: 12 }}
          >
            Save Answer
          </button>


          <details style={{ marginTop: 20 }}>
            <summary style={{ cursor: 'pointer' }}>
              Reveal Suggested Answer
            </summary>

            <p>{dailyQuestion.answer}</p>
          </details>

        </div>

        <div style={{ marginTop: 30 }}>
          <h3>My Interview History ({savedAnswers.length})</h3>

          {savedAnswers.length === 0 ? (
            <p>No saved answers yet.</p>
          ) : (
            savedAnswers.map((entry) => (
              <div
                key={entry.id}
                className="panel"
                style={{ padding: 16, marginTop: 12 }}
              >
                <h4>{entry.question}</h4>
                <p>{entry.answer}</p>
                <small>
                  Saved: {new Date(entry.date).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>



      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
