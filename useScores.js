import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from './supabase'

export function useScores() {
  const [teams, setTeams] = useState([])
  const [log, setLog] = useState([])
  const [live, setLive] = useState(false)

  const load = useCallback(async () => {
    const [t, l] = await Promise.all([
      supabase.from('teams').select('*').order('id'),
      supabase.from('score_log').select('*').order('created_at', { ascending: false }),
    ])
    if (t.data) setTeams(t.data)
    if (l.data) setLog(l.data)
  }, [])

  useEffect(() => {
    load()
    const ch = supabase
      .channel('scores')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'score_log' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, load)
      .subscribe((s) => setLive(s === 'SUBSCRIBED'))
    return () => supabase.removeChannel(ch)
  }, [load])

  const ranked = useMemo(() => {
    const sums = {}
    log.forEach((r) => (sums[r.team_id] = (sums[r.team_id] || 0) + r.points))
    const list = teams.map((t) => ({ ...t, score: sums[t.id] || 0 })).sort((a, b) => b.score - a.score)
    return list.map((t, i) => ({ ...t, rank: i && t.score === list[i - 1].score ? list[i - 1].rank : i + 1 }))
  }, [teams, log])

  return { teams: ranked, log, live }
}
