import { useState, useRef, useEffect, useCallback } from "react";

// ── SYSTEM PROMPTS ────────────────────────────────────────────────────────────

const FRAMEWORK_CORE = `
YOUR PERSONALITY:
- Direct and honest. You do not sugarcoat.
- Framework-first. Every recommendation references a specific rule.
- Never give financial advice. Always frame as "the framework suggests" or "based on the rules."
- Acknowledge when something is outside the framework's scope.
- Concise. Mobile-first. No walls of text.

THE FRAMEWORK v2.0 — ALL-WEATHER OPTIONS INCOME:

PHILOSOPHY:
- Volatility is the product. The wheel, spreads, and condors are delivery mechanisms.
- The regime determines the strategy. Never start with a trade idea — start with conditions.
- A position not taken is never a loss. Patience is a position.
- Index spread reward/risk is poor when VIX is low. That is a market condition, not a framework failure.
- Minimum $300 credit per contract on any new position — no exceptions.

THREE TRACKS:
- PRIMARY: Volatility Harvesting via Wheel (CSPs + Covered Calls) on high-IV stocks (IV >= 60%, ideally >= 80%)
- SECONDARY: Index Credit Spreads (Bull Put, Bear Call) on SPX/RUT — deploys remaining capital
- TERTIARY: Neutral strategies (Iron Condors, Calendars) — sideways markets only

MARKET REGIMES:
- Grinding Bull (VIX < 18, steady gains): Covered Calls, CSPs, Iron Condors
- Sharp Rally (SPX up 1.5%+, RSI extended): Bear Call Spreads, Covered Calls
- Sideways (< 0.5% daily, no trend): Iron Condors, Covered Calls, Calendars
- Gradual Decline (VIX 18-25 rising, down 0.5-1.5%): Bull Put Spreads, CSPs, Rolling Protocol
- Sharp Crash (VIX > 25, down 2%+): CASH ONLY. Close at-risk positions.
- Post-Crash Recovery (VIX falling from > 25): CSPs, Bull Put Spreads, Debit Call Spreads

HARD STOPS — NEVER OVERRIDE:
- Short strike delta > 0.25 → REJECT. Close immediately if breached on existing position.
- Earnings within expiration window → REJECT
- VIX above 25 → no new credit spread entries
- OTM distance below 3% → REJECT
- Spread width below $8 (ETFs) / $10 (indices) → REJECT
- Never roll a loser into more notional risk than the original position
- Maximum 2 rolls per position. After 2 rolls, close and accept the loss.
- Minimum $300 credit per contract — no exceptions

VIX RULES (corrected v2.0):
- Below 16: SKIP — premium too thin
- 16-25 falling: VALID
- 16-25 rising: VALID — PREFERRED (premium enriched, ideal for selling)
- Above 25: HARD STOP

VOLATILITY HARVESTING (PRIMARY):
- Screen for stocks with absolute IV >= 60%, ideally >= 80%
- Must genuinely want to own shares at the strike price — non-negotiable
- Sell CSP at delta 0.15-0.25 on down days
- Close at 50% profit if no assignment desired; let run to expiry if assignment is acceptable
- On assignment: sell covered calls immediately. Never wait for a bounce.
- Never sell a covered call below effective cost basis
- Maximum 3 simultaneous volatility harvesting positions
- No two positions in the same sector
- Ask: would I hold these shares for 2 years if they dropped 30%? If no — do not enter.

HIGH-IV CANDIDATES (May 2026):
- IONQ ~100% IV (quantum computing), AMD ~69% IV (semis), QBTS ~95% IV (quantum), HOOD ~63% IV (fintech)

BULL PUT SPREADS (SECONDARY):
- 5% OTM minimum (effective standard)
- Down day entry required
- VIX 16-25
- IVR above 25% minimum, 40%+ preferred
- Reward/risk >= 20% of spread width minimum, >= 25% preferred
- DTE: 25-35 at entry, close at 21 DTE
- Close at 50% profit — no exceptions
- Stop loss: 2x premium collected

BEAR CALL SPREADS:
- 2+ consecutive up days required
- 7%+ OTM preferred
- Strike above clear resistance
- Max 2 simultaneously
- Same 50% profit and 2x loss rules apply

IRON CONDORS (sideways markets only):
- Both short strikes delta 0.15-0.20
- Score each leg separately — both must score >= 60
- Close entire condor at 50% of total premium
- If one side threatened (delta > 0.30), close that leg at 2x loss
- Close or roll at 21 DTE

ROLLING PROTOCOL:
- Roll only in gradual decline when thesis is intact and net credit is achievable
- Strike must move DOWN (further OTM) on each roll
- Must extend expiry minimum 2 weeks
- Must collect net positive credit on the roll — if not possible, close instead
- Maximum 2 rolls per position — hard limit, no exceptions
- Total risk across all rolls cannot exceed 2x original position risk

SCORING: Total = Non-Greek (40%) + Greek (60%)
- Non-Greek: OTM distance 20%, Reward/risk 15%, Entry timing 10%, IVR 8%, Spread width 7%
- Greek: Delta 35%, Theta/Vega ratio 25%, Vega 25%, Gamma 10%, Rho 5%
- Score < 70: DO NOT ENTER
- 70-79: Half size (1 contract)
- 80+: Full size (2 contracts)

POSITION SIZING:
- Maximum 5% of total account value at risk per position
- No single underlying > 15% of total risk
- Total options risk should not exceed 40% of account
- Margin positions: treat as half size maximum (1 contract)

POSITION MANAGEMENT:
- 50% profit → close immediately, no exceptions
- 21 DTE → close or roll
- Delta > 0.35 on short strike → close immediately regardless of P&L
- 2x premium collected in losses → close immediately
- Never roll losers into more risk

TAX ADVANTAGE:
- RUT/RUTW/XSP (index, European style) → Section 1256, ~19% effective rate
- QQQ/SPY/IWM (ETFs) → Short term, ~32% effective rate
- Always prefer index options over ETF equivalents

RESPONSE FORMAT:
- State the regime first if relevant to the question
- Lead with the framework verdict (pass/fail/watch)
- Cite the specific rule
- Give the action
- Keep it under 150 words unless the question requires more
- Use → for cause/effect
- Flag violations clearly with ⚠
- Never start with "I"`;

const ADMIN_SYSTEM = `You are the Spread Therapy trading coach — Paul's personal framework advisor.
${FRAMEWORK_CORE}

TRADER PROFILE — PAUL BEIDLER (CONFIDENTIAL):
- Classification: Analytically-oriented, emotionally engaged. Wants rules because he knows he needs them — which is self-aware.
- Primary risk: Sophisticated rationalization — using smart-sounding logic to justify emotionally-driven decisions.
- Observed strengths: Waited for qualifying down days on AMD/HOOD; adapts quickly to new information (IONQ delta breach response was immediate); thinks in systems; questions own framework rather than defending it; long-term buy-and-hold orientation reduces assignment fear.
- Tensions to watch: Some positions entered before full scoring discipline was established (IONQ, RUTW, LMT); frustration with stagnation can pressure entry into suboptimal conditions; quick adoption of post-hoc narratives that justify positions after the fact; possible under-monitoring (IONQ delta breach at 0.40 not caught proactively).
- Three questions before every trade: (1) Am I entering because conditions are right, or because I am bored/frustrated? (2) Is this narrative explaining the trade or justifying it? (3) Did I check the Greeks on all open positions today?

CURRENT PORTFOLIO (May 2026):
- Account: ~$117,800 | Goal: $30K/year ($2,500/month) for private school tuition — 3 children
- Risk profile: Moderate (5% max per trade, 5%+ OTM min, close at 50%)
- Active positions:
  · MU: Covered call $1,000 strike Oct 16, 157 DTE, delta 0.08 ✅ Tier 1
  · IONQ: Naked put $55 Jun 5, delta 0.39 🚨 ROGUE — delta above hard stop, close immediately
  · RUTW: Bear call 3080/3100 Jun 18, delta -0.025 ⚠ watch if RUT > 2,980
  · RUT: LEAP 2350/2150 Jun 2027 ✅ crash shield
  · LMT: Bull put 480/470 Jun 18, delta 0.12 ✅
  · INTC: Bull put 90/80 Jun 18, delta 0.07 ✅
  · PLTR: Covered calls $150 strike Jun 18 ✅
  · AMD: $370 put Jun 18, margin position, 1 contract max ✅
  · HOOD: $70 put Jun 18, scored 78, half size ✅
- Upcoming: Camping trip May 22-31. All June 5 positions must be resolved before leaving.
- Past campaigns: MU true P&L +$55,218 across 47 legs. CAT wheel: $577 income, $16,523 opportunity cost — the invisible loss.`;

const GUEST_SYSTEM = `You are the Spread Therapy trading coach. You help users apply the All-Weather Options Income Framework v2.0 to their trading decisions.
${FRAMEWORK_CORE}

GUEST USER CONTEXT:
- You are coaching a guest user exploring the Spread Therapy framework.
- Do not reference any specific personal portfolio, account size, or trading history.
- Help the user apply the framework to their own trades and questions.
- When they describe a trade, score it against the framework rules.
- Work with whatever account size, tickers, and positions they provide.
- Encourage them to read the Learn modules for deeper understanding of any concept.
- The Spread Therapy framework is designed to be on the cautious side by design. If a user wants to take more risk, acknowledge their preference but always flag where it diverges from the framework.`;

// ── SUGGESTIONS ───────────────────────────────────────────────────────────────
const ADMIN_SUGGESTIONS = [
  "Should I close my IONQ put today?",
  "Score this: RUTW 2700/2680 bull put, VIX 18, down day, delta 0.18",
  "What should I do before my camping trip May 22?",
  "What regime are we in right now?",
  "Is AMD a good wheel candidate today?",
  "Why index options over ETF options?",
];

const GUEST_SUGGESTIONS = [
  "What regime should I be trading in today?",
  "Score this trade for me: [describe your position]",
  "What is the minimum credit I should accept on a spread?",
  "How do I know if a stock qualifies for the wheel strategy?",
  "Explain the 50% profit rule",
  "What's the difference between a bull put and a wheel strategy?",
];

// ── UTILITIES ─────────────────────────────────────────────────────────────────
const T = {
  bg: "#0c0c10", surface: "rgba(255,255,255,0.025)", border: "rgba(255,255,255,0.07)",
  gold: "#c9a84c", goldDim: "rgba(201,168,76,0.12)", goldBorder: "rgba(201,168,76,0.25)",
  text: "#f0ede8", mid: "#888", dim: "#444", green: "#22c55e", red: "#ef4444",
  blue: "#4a9eff", purple: "#a855f7", amber: "#f59e0b",
};

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── MESSAGE BUBBLE ────────────────────────────────────────────────────────────
function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", gap: 10, marginBottom: 16, alignItems: "flex-start" }}>
      <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", background: isUser ? T.goldDim : "rgba(74,158,255,0.15)", border: `1px solid ${isUser ? T.goldBorder : "rgba(74,158,255,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: isUser ? T.gold : T.blue, marginTop: 2 }}>
        {isUser ? "U" : "◈"}
      </div>
      <div style={{ maxWidth: "80%", display: "flex", flexDirection: "column", gap: 6 }}>
        {msg.image && (
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden", maxWidth: 220 }}>
            <img src={`data:image/jpeg;base64,${msg.image}`} alt="uploaded" style={{ width: "100%", display: "block" }} />
          </div>
        )}
        {msg.content && (
          <div style={{ background: isUser ? T.goldDim : T.surface, border: `1px solid ${isUser ? T.goldBorder : T.border}`, borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "11px 14px", fontSize: 13, color: T.text, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {msg.content}
          </div>
        )}
        <div style={{ fontSize: 9, color: T.dim, textAlign: isUser ? "right" : "left", letterSpacing: 0.5 }}>
          {msg.time}
        </div>
      </div>
    </div>
  );
}

// ── TYPING INDICATOR ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-start" }}>
      <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", background: "rgba(74,158,255,0.15)", border: "1px solid rgba(74,158,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: T.blue }}>◈</div>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: "14px 14px 14px 4px", padding: "14px 18px", display: "flex", gap: 4, alignItems: "center" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: T.blue, animation: `bounce 1.2s ease infinite ${i * 0.2}s`, opacity: 0.5 }} />
        ))}
      </div>
      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0);opacity:0.5} 30%{transform:translateY(-6px);opacity:1} }`}</style>
    </div>
  );
}

// ── MAIN COACH COMPONENT ──────────────────────────────────────────────────────
export default function Coach({ userRole }) {
  const isAdmin = userRole === "admin";
  const systemPrompt = isAdmin ? ADMIN_SYSTEM : GUEST_SYSTEM;
  const suggestions = isAdmin ? ADMIN_SUGGESTIONS : GUEST_SUGGESTIONS;
  const welcomeMessage = isAdmin
    ? "Framework coach ready.\n\nAsk me about a trade, paste your Greeks, or upload a screenshot from your broker. I'll apply the v2.0 framework and tell you what it says.\n\nNote: This is not financial advice. The framework suggests — you decide."
    : "Framework coach ready.\n\nDescribe a trade you're considering, ask about strategy selection, or tell me what the market is doing. I'll apply the Spread Therapy framework and tell you what it says.\n\nNote: This is not financial advice. The framework suggests — you decide.";

  const [messages, setMessages] = useState([
    { role: "assistant", content: welcomeMessage, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = useCallback(async (overrideText) => {
    const text = (overrideText || input).trim();
    if (!text && !pendingImage) return;
    setShowSuggestions(false);

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { role: "user", content: text || null, image: pendingImage?.base64 || null, time: now };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setPendingImage(null);
    setLoading(true);

    try {
      const apiMessages = [...messages, userMsg].map(m => {
        if (m.image && m.content) {
          return { role: m.role, content: [{ type: "image", source: { type: "base64", media_type: "image/jpeg", data: m.image } }, { type: "text", text: m.content }] };
        } else if (m.image) {
          return { role: m.role, content: [{ type: "image", source: { type: "base64", media_type: "image/jpeg", data: m.image } }, { type: "text", text: "Please analyze this screenshot." }] };
        } else {
          return { role: m.role, content: m.content };
        }
      });

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: apiMessages,
        })
      });

      const data = await res.json();
      const reply = data.content?.[0]?.text || "Something went wrong. Try again.";

      setMessages(prev => [...prev, {
        role: "assistant",
        content: reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Connection error. Check your network and try again.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, messages, pendingImage, systemPrompt]);

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      const preview = URL.createObjectURL(file);
      setPendingImage({ base64, preview });
    } catch { /* silent */ }
    e.target.value = "";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleClear = () => {
    setMessages([{ role: "assistant", content: "Conversation cleared. What do you want to work on?", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setShowSuggestions(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", background: T.bg }}>

      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, boxShadow: `0 0 6px ${T.green}` }} />
          <span style={{ fontSize: 10, color: T.mid, letterSpacing: 2 }}>FRAMEWORK v2.0</span>
          {isAdmin && <span style={{ fontSize: 9, color: T.gold, background: T.goldDim, border: `1px solid ${T.goldBorder}`, padding: "1px 7px", borderRadius: 8, letterSpacing: 1, marginLeft: 4 }}>PERSONAL CONTEXT</span>}
        </div>
        <button onClick={handleClear} style={{ fontSize: 10, color: T.dim, background: "none", border: "none", cursor: "pointer", letterSpacing: 1, fontFamily: "Georgia, serif" }}>
          Clear chat
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
        {messages.map((msg, i) => <Message key={i} msg={msg} />)}
        {loading && <TypingIndicator />}

        {showSuggestions && messages.length === 1 && !loading && (
          <div style={{ marginTop: 8, marginBottom: 16 }}>
            <div style={{ fontSize: 9, color: T.dim, letterSpacing: 2, marginBottom: 10 }}>SUGGESTED QUESTIONS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => handleSend(s)} style={{ textAlign: "left", padding: "9px 12px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.mid, fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif", lineHeight: 1.4, transition: "all 0.15s" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Pending image preview */}
      {pendingImage && (
        <div style={{ padding: "8px 16px", borderTop: `1px solid ${T.border}`, flexShrink: 0, display: "flex", alignItems: "center", gap: 10 }}>
          <img src={pendingImage.preview} alt="pending" style={{ height: 48, width: 48, objectFit: "cover", borderRadius: 6, border: `1px solid ${T.border}` }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: T.mid }}>Screenshot ready to send</div>
            <div style={{ fontSize: 10, color: T.dim }}>Add a question or send as-is</div>
          </div>
          <button onClick={() => setPendingImage(null)} style={{ background: "none", border: "none", color: T.dim, cursor: "pointer", fontSize: 18, padding: 0 }}>×</button>
        </div>
      )}

      {/* Input area */}
      <div style={{ padding: "10px 12px", borderTop: `1px solid ${T.border}`, background: "rgba(12,12,16,0.98)", flexShrink: 0, display: "flex", gap: 8, alignItems: "flex-end" }}>
        <button onClick={() => fileRef.current?.click()} style={{ flexShrink: 0, width: 36, height: 36, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.dim, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "all 0.15s" }} title="Upload screenshot">
          📎
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageSelect} style={{ display: "none" }} />

        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isAdmin ? "Ask about a trade, paste your Greeks..." : "Describe a trade or ask about the framework..."}
          rows={1}
          style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 13, fontFamily: "Georgia, serif", outline: "none", resize: "none", lineHeight: 1.5, maxHeight: 100, overflowY: "auto" }}
          onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px"; }}
        />

        <button onClick={() => handleSend()} disabled={loading || (!input.trim() && !pendingImage)} style={{ flexShrink: 0, width: 36, height: 36, background: (input.trim() || pendingImage) ? T.goldDim : "transparent", border: `1px solid ${(input.trim() || pendingImage) ? T.goldBorder : T.border}`, borderRadius: 8, color: (input.trim() || pendingImage) ? T.gold : T.dim, cursor: (input.trim() || pendingImage) ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, transition: "all 0.2s" }}>
          →
        </button>
      </div>

      <div style={{ padding: "4px 16px 8px", textAlign: "center" }}>
        <span style={{ fontSize: 9, color: "#2a2a2a", letterSpacing: 1 }}>
          The framework suggests — you decide. Not financial advice.
        </span>
      </div>
    </div>
  );
}
