const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── In-memory storage ─────────────────────────────────────────────
let state = {
  score: 0,
  events: [],
  fails: 0,
  suspicious: 0,
  blockedTxns: 0,
  locations: ['Mumbai'],
  txnHistory: [],
  scoreHistory: []
};

// ── AI Explanation Engine (rule-based) ───────────────────────────
function getAIExplanation(type, state) {
  const { score, fails, suspicious, locations, txnHistory } = state;
  const avgTxn = txnHistory.length
    ? Math.round(txnHistory.reduce((a, b) => a + b, 0) / txnHistory.length)
    : 0;

  const rules = [
    { condition: fails >= 3,           reason: `🔴 Brute-force pattern: ${fails} failed logins suggest credential stuffing attack.` },
    { condition: locations.length > 2, reason: `🌍 Geo-anomaly: Account accessed from ${locations.length} different locations in one session.` },
    { condition: type === 'txn_high' && score > 50, reason: `💸 High-value transaction (avg ₹${avgTxn.toLocaleString('en-IN')}) during elevated risk session triggers fraud flag.` },
    { condition: suspicious >= 3,      reason: `⚡ Escalation active: ${suspicious} suspicious events detected — risk multiplier applied.` },
    { condition: type === 'login_diff', reason: `📍 New location login detected. Geo-mismatch with established baseline (${locations[0]}).` },
    { condition: type === 'fail_login', reason: `🚫 Failed authentication attempt #${fails}. May indicate account takeover attempt.` },
    { condition: score > 70,            reason: `🤖 Automated lockdown threshold crossed. Transaction blocking & OTP enforcement now active.` },
    { condition: score > 40 && score <= 70, reason: `📈 Risk trajectory rising. Behavioral deviation from baseline detected across multiple signals.` },
  ];

  const matched = rules.filter(r => r.condition).map(r => r.reason);
  if (matched.length === 0) return 'ℹ️ Activity within normal parameters. No anomalies detected.';
  return matched[matched.length - 1]; // most relevant last-matched rule
}

// ── POST /event ───────────────────────────────────────────────────
app.post('/event', (req, res) => {
  const { type, label, delta = 0, isSus = false, amount = 0, location = null } = req.body;

  if (isSus) state.suspicious++;
  if (type === 'fail_login') state.fails++;
  if (amount > 0) state.txnHistory.push(amount);
  if (location && !state.locations.includes(location)) state.locations.push(location);

  let effectiveDelta = delta;
  if (isSus && state.suspicious >= 3) effectiveDelta = Math.round(delta * 1.5);

  state.score = Math.min(100, state.score + effectiveDelta);
  console.log('Score:', state.score, 'Delta:', effectiveDelta);
  state.scoreHistory.push(state.score);
  if (state.scoreHistory.length > 10) state.scoreHistory.shift();

  if (type === 'txn_high' && state.score >= 70) state.blockedTxns++;

  const aiReason = getAIExplanation(type, state);

  const event = {
    id: Date.now(),
    type,
    label,
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    timestamp: new Date().toISOString(),
    score: state.score,
    aiReason
  };

  state.events.unshift(event);
  if (state.events.length > 50) state.events.pop();

  res.json({ success: true, score: state.score, aiReason, event });
});

// ── GET /risk ─────────────────────────────────────────────────────
app.get('/risk', (req, res) => {
  let status = 'LOW';
  if (state.score > 70) status = 'HIGH';
  else if (state.score > 30) status = 'MEDIUM';

  const aiReason = getAIExplanation('state_check', state);

  res.json({
    score: state.score,
    fails: state.fails,
    suspicious: state.suspicious,
    blockedTxns: state.blockedTxns,
    locations: state.locations,
    scoreHistory: state.scoreHistory,
    totalEvents: state.events.length,
    riskLevel: status,
    aiReason
  });
});

// ── GET /logs ─────────────────────────────────────────────────────
app.get('/logs', (req, res) => {
  res.json({ events: state.events, total: state.events.length });
});

// ── POST /reset ───────────────────────────────────────────────────
app.post('/reset', (req, res) => {
  state = { score: 0, events: [], fails: 0, suspicious: 0, blockedTxns: 0, locations: ['Mumbai'], txnHistory: [], scoreHistory: [] };
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ TrustGuard AI running on port ${PORT}`);
});
