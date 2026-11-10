import { useEffect, useState } from 'react'
import { LogOut, Plus, Minus, Trash2, LogIn, ArrowLeft } from 'lucide-react'
import { supabase } from './supabase'
import { useScores } from './useScores'

const STEPS = [-5, -1, 1, 5, 10]

export default function Admin() {
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true) })
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])
  if (!ready) return null
  return session ? <Panel /> : <Login />
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setErr('อีเมลหรือรหัสผ่านไม่ถูกต้อง ลองตรวจสอบอีกครั้ง')
  }
  return (
    <div className="page narrow">
      <form className="card" onSubmit={submit}>
        <h1>เข้าสู่ระบบกรรมการ</h1>
        <input type="email" placeholder="อีเมล" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="รหัสผ่าน" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {err && <p className="err">{err}</p>}
        <button className="btn primary"><LogIn size={18} /> เข้าสู่ระบบ</button>
      </form>
    </div>
  )
}

function Panel() {
  const { teams, log } = useScores()
  const [eventName, setEventName] = useState('')
  const add = (team_id, points) =>
    supabase.from('score_log').insert({ team_id, points, event_name: eventName.trim() })
  const remove = (id) => supabase.from('score_log').delete().eq('id', id)
  const byId = Object.fromEntries(teams.map((t) => [t.id, t]))

  return (
    <div className="page narrow">
      <header className="head">
        <h1>บันทึกคะแนน</h1>
        <div className="row">
          <a className="btn" href="#"><ArrowLeft size={18} /> หน้าแสดงผล</a>
          <button className="btn" onClick={() => supabase.auth.signOut()}><LogOut size={18} /> ออกจากระบบ</button>
        </div>
      </header>

      <input className="event" placeholder="ชื่อรายการแข่งขัน เช่น วิ่งผลัด 4x100" value={eventName} onChange={(e) => setEventName(e.target.value)} />

      {teams.map((t) => (
        <div className="card team" key={t.id} style={{ borderLeftColor: t.color }}>
          <div className="lane-top"><strong>{t.name}</strong><span className="score">{t.score}</span></div>
          <div className="row wrap">
            {STEPS.map((s) => (
              <button key={s} className={'btn ' + (s < 0 ? 'danger' : 'primary')} onClick={() => add(t.id, s)}>
                {s < 0 ? <Minus size={16} /> : <Plus size={16} />}{Math.abs(s)}
              </button>
            ))}
          </div>
        </div>
      ))}

      <h2>ประวัติการบันทึก</h2>
      <ul className="history">
        {log.slice(0, 30).map((r) => (
          <li key={r.id}>
            <span>{byId[r.team_id]?.name} · {r.event_name || 'ไม่ระบุรายการ'}</span>
            <b>{r.points > 0 ? '+' : ''}{r.points}</b>
            <button className="icon" aria-label="ลบรายการนี้" onClick={() => remove(r.id)}><Trash2 size={16} /></button>
          </li>
        ))}
      </ul>
    </div>
  )
}
