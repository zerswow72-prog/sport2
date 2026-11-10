import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, animate, useMotionValue } from 'framer-motion'
import { Trophy, Crown, Radio, WifiOff, Flag } from 'lucide-react'
import { useScores } from './useScores'

function Count({ value }) {
  const mv = useMotionValue(value)
  const [shown, setShown] = useState(value)
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.9, ease: 'easeOut', onUpdate: (v) => setShown(Math.round(v)) })
    return () => c.stop()
  }, [value])
  return <>{shown.toLocaleString('th-TH')}</>
}

export default function App() {
  const { teams, log, live } = useScores()
  const [toast, setToast] = useState(null)
  const lastId = useRef(null)
  const byId = Object.fromEntries(teams.map((t) => [t.id, t]))
  const max = Math.max(1, ...teams.map((t) => t.score))

  useEffect(() => {
    const top = log[0]
    if (!top) return
    if (lastId.current !== null && top.id !== lastId.current && byId[top.team_id]) {
      setToast({ ...top, team: byId[top.team_id] })
      const t = setTimeout(() => setToast(null), 4500)
      lastId.current = top.id
      return () => clearTimeout(t)
    }
    lastId.current = top.id
  }, [log])

  return (
    <div className="page">
      <header className="head">
        <div>
          <h1>กีฬาสีโรงเรียน</h1>
          <p>คะแนนรวมอัปเดตทันทีเมื่อกรรมการบันทึกผล</p>
        </div>
        <span className={'badge ' + (live ? 'on' : 'off')}>
          {live ? <Radio size={16} /> : <WifiOff size={16} />}
          {live ? 'สด' : 'กำลังเชื่อมต่อ'}
        </span>
      </header>

      <main className="grid">
        <section aria-label="ตารางคะแนน">
          <motion.ol className="board" layout>
            {teams.map((t) => (
              <motion.li key={t.id} layout transition={{ type: 'spring', stiffness: 260, damping: 28 }} className="lane">
                <div className="rank">{t.rank === 1 ? <Crown size={26} /> : t.rank}</div>
                <div className="lane-body">
                  <div className="lane-top">
                    <strong>{t.name}</strong>
                    <span className="score"><Count value={t.score} /></span>
                  </div>
                  <div className="track">
                    <motion.div
                      className="fill"
                      style={{ background: t.color }}
                      animate={{ width: `${(t.score / max) * 100}%` }}
                      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                    />
                  </div>
                </div>
              </motion.li>
            ))}
            {!teams.length && <li className="empty">ยังไม่มีทีม — เพิ่มทีมในฐานข้อมูลเพื่อเริ่มแสดงคะแนน</li>}
          </motion.ol>
        </section>

        <aside className="feed" aria-label="ผลล่าสุด">
          <h2><Flag size={18} /> ผลล่าสุด</h2>
          <ul>
            <AnimatePresence initial={false}>
              {log.slice(0, 12).map((r) => (
                <motion.li key={r.id} layout initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <i style={{ background: byId[r.team_id]?.color }} />
                  <span>{byId[r.team_id]?.name} · {r.event_name || 'ไม่ระบุรายการ'}</span>
                  <b className={r.points < 0 ? 'neg' : ''}>{r.points > 0 ? '+' : ''}{r.points}</b>
                </motion.li>
              ))}
            </AnimatePresence>
            {!log.length && <li className="empty">ยังไม่มีการบันทึกคะแนน</li>}
          </ul>
        </aside>
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div className="toast" style={{ borderColor: toast.team.color }}
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}>
            <Trophy size={22} />
            <span>{toast.team.name} {toast.points > 0 ? '+' : ''}{toast.points} คะแนน {toast.event_name && `จาก${toast.event_name}`}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
