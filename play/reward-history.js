// A durable, idempotent ledger: only confirmed game rewards belong in earned history.
const REWARD_TYPES = new Set(['CHECKPOINT_REWARD', 'RECORD_REWARD', 'STREAK_REWARD']);
export function rememberReward(ledger, op, receivedAt) {
  if (!op || op.status !== 'SUCCEEDED' || !REWARD_TYPES.has(op.type) ||
      !op.operationId || !Number.isFinite(op.amount) || op.amount <= 0 || ledger[op.operationId]) return;
  const at = receivedAt ?? op.creditedAt ?? op.claimedAt ?? op.createdAt;
  if (!Number.isFinite(at)) return;
  ledger[op.operationId] = { id: op.operationId, type: op.type, amount: op.amount, receivedAt: at, checkpointId: op.rewardKey || null };
}
export function rewardHistoryView(ledger, checkpoints = []) {
  const items = Object.values(ledger || {}).sort((a, b) => b.receivedAt - a.receivedAt || b.id.localeCompare(a.id)).map(r => {
    const cp = checkpoints.find(c => c.id === r.checkpointId);
    const title = r.type === 'STREAK_REWARD' ? (r.checkpointId === 'streak_weekly' ? 'جایزهٔ حضور ۷روزه' : 'جایزهٔ روزانه') : r.type === 'RECORD_REWARD' ? 'جایزهٔ رکورد تازه' : cp ? `جایزهٔ نشان ${cp.title}` : 'جایزهٔ مرحله';
    return { ...r, title, receivedAt: new Date(r.receivedAt).toISOString() };
  });
  return { items, count: items.length, totalCoins: items.reduce((sum, r) => sum + r.amount, 0) };
}
