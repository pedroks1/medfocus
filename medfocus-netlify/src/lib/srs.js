export function applySM2(prev, q) {
  let { ease = 2.5, intervalDays = 0, reps = 0, lapses = 0 } = prev || {}
  if (q < 3) {
    reps = 0
    lapses += 1
    intervalDays = 1
  } else {
    reps += 1
    ease = ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    if (ease < 1.3) ease = 1.3
    if (reps === 1) intervalDays = 1
    else if (reps === 2) intervalDays = 6
    else intervalDays = Math.round(intervalDays * ease)
  }
  const due = new Date()
  due.setDate(due.getDate() + intervalDays)
  return { ease, intervalDays, reps, lapses, dueAt: due.toISOString() }
}
