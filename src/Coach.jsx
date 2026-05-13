import { useState, useRef, useEffect, useCallback } from "react";

// ── SYSTEM PROMPT ─────────────────────────────────────────────────────────────
const COACH_SYSTEM = `You are the Spread Therapy trading coach. You help users apply the Credit Spread Scoring Framework v1.4 to their real options trading decisions.

YOUR PERSONALITY:
- Direct and honest. You do not sugarcoat.
- Framework-first. Every recommendation references a specific rule.
- Never give financial advice. Always frame as "the framework suggests" or "based on the rules."
- Acknowledge when something is outside the framework's scope.
- Concise. Mobile-first. No walls of text.

THE FRAMEWORK — KNOW THIS COLD:

STRATEGY HIERARCHY:
- Tier 1: Covered calls (MU, RTX) — primary income engine
- Tier 2: Bull put spreads (RUTW/XSP) — systematic income
- Tier 3: Bear call spreads — opportunistic only, 2+ consecutive up days required, max 2 simultaneously
- Tier 4: LEAP put spread — crash shield, offensive capital

HARD STOPS (automatic rejection):
- Short strike delta > 0.25 → REJECT immediately
- Earnings in window → REJECT immediately
- Gap-up morning entry for bull puts → REJECT

BULL PUT RULES:
- 5% OTM minimum (effective standard, not 3%)
- Down day entry required
- VIX 16-25
- Close at 50% profit — no exceptions
- Never roll losers
- DTE: 30-45 at entry, close at 21 DTE

BEAR CALL RULES:
- 2+ consecutive up days required
- 7%+ OTM preferred, 5% hard minimum
- Max 2 simultaneously
- VIX 14-22, stable or falling

SCORING: Total = Non-Greek (40%) + Greek (60%)
- Non-Greek: OTM distance 20%, Reward/risk 15%, Entry timing 10%, IVR 8%, Spread width 7%
- Greek: Delta 35%, Theta 25%, Vega 25%, Gamma 10%, Rho 5%
- Score <70%: DO NOT ENTER
- 70-79%: Enter HALF size
- 80%+: Enter FULL size

POSITION MANAGEMENT:
- 50% profit → close immediately
- 21 DTE → close or roll
- Delta > 0.35 → close immediately
- 2x loss → close immediately
- Never roll losers into more risk

TAX ADVANTAGE:
- RUTW/XSP/RUT (index, European style) → Section 1256, ~19% effective rate
- QQQ/SPY/ETFs → Short term, ~32% effective rate
- Always prefer index options over ETF equivalents

CURRENT PORTFOLIO CONTEXT:
- Account: ~$117,800 | Goal: $30K/year ($2,500/month) for private school tuition
- Risk profile: Moderate (5% max per trade, 5%+ OTM min, close at 50%)
- Active: MU covered call ($1,000 strike Oct 16, 157 DTE), RUTW bear call (3080/3100 Jun 18), LMT bull put (480/470 Jun 18), INTC bull put (90/80 Jun 18), IONQ naked put ($55 Jun 5 — ROGUE, delta 0.39), RUT LEAP (2350/2150 Jun 2027)
- Camping trip: May 22-31 — positions must be clean or self-managing before then
- Urgent: IONQ put delta above hard stop — needs to close

RESPONSE FORMAT:
- Lead with the framework verdict (pass/fail/watch)
- Cite the specific rule
- Give the action
- Keep it under 150 words unless the question requires more
- Use → for cause/effect
- Flag violations clearly with ⚠
- Never start with "I"`;

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

// ── SUGGESTED PROMPTS ─────────────────────────────────────────────────────────
const SUGGESTIONS = [
  "Should I close my IONQ put today?",
  "Score this trade: RUTW 2700/2680 bull put, VIX 18, down day, delta 0.18",
  "What should I do before my camping trip May 22?",
  "RUT is at 2,950. Should I close the bear call?",
  "Explain the 50% profit rule",
  "Why index options over ETF options?",
];

// ── MESSAGE BUBBLE ────────────────────────────────────────────────────────────
function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex",
      flexDirection: isUser ? "row-reverse" : "row",
      gap: 10,
      marginBottom: 16,
      alignItems: "flex-start",
    }}>
      {/* Avatar */}
      <div style={{
        flexShrink: 0,
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: isUser ? T.goldDim : "rgba(74,158,255,0.15)",
        border: `1px solid ${isUser ? T.goldBorder : "rgba(74,158,255,0.3)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        color: isUser ? T.gold : T.blue,
        marginTop: 2,
      }}>
        {isUser ? "U" : "◈"}
      </div>

      {/* Content */}
      <div style={{ maxWidth: "80%", display: "flex", flexDirection: "column", gap: 6 }}>
        {/* Image preview if uploaded */}
        {msg.image && (
          <div style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            overflow: "hidden",
            maxWidth: 220,
          }}>
            <img src={`data:image/jpeg;base64,${msg.image}`} alt="uploaded" style={{ width: "100%", display: "block" }} />
          </div>
        )}

        {/* Text bubble */}
        {msg.content && (
          <div style={{
            background: isUser ? T.goldDim : T.surface,
            border: `1px solid ${isUser ? T.goldBorder : T.border}`,
            borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
            padding: "11px 14px",
            fontSize: 13,
            color: T.text,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}>
            {msg.content}
          </div>
        )}

        {/* Timestamp */}
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
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%",
            background: T.blue,
            animation: `bounce 1.2s ease infinite ${i * 0.2}s`,
            opacity: 0.5,
          }} />
        ))}
      </div>
      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0);opacity:0.5} 30%{transform:translateY(-6px);opacity:1} }`}</style>
    </div>
  );
}

// ── MAIN COACH COMPONENT ──────────────────────────────────────────────────────
export default function Coach() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Framework coach ready.\n\nAsk me about a trade, paste your Greeks, or upload a screenshot from your broker. I'll apply the v1.4 framework and tell you what it says.\n\nNote: This is not financial advice. The framework suggests — you decide.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingImage, setPendingImage] = useState(null); // { base64, preview }
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
    const userMsg = {
      role: "user",
      content: text || null,
      image: pendingImage?.base64 || null,
      time: now,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setPendingImage(null);
    setLoading(true);

    try {
      // Build conversation history for API
      const apiMessages = [...messages, userMsg].map(m => {
        if (m.image && m.content) {
          return {
            role: m.role,
            content: [
              { type: "image", source: { type: "base64", media_type: "image/jpeg", data: m.image } },
              { type: "text", text: m.content },
            ]
          };
        } else if (m.image) {
          return {
            role: m.role,
            content: [
              { type: "image", source: { type: "base64", media_type: "image/jpeg", data: m.image } },
              { type: "text", text: "Please analyze this screenshot." },
            ]
          };
        } else {
          return { role: m.role, content: m.content };
        }
      });

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: COACH_SYSTEM,
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
  }, [input, messages, pendingImage]);

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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([{
      role: "assistant",
      content: "Conversation cleared. What do you want to work on?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    setShowSuggestions(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", background: T.bg }}>

      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, boxShadow: `0 0 6px ${T.green}` }} />
          <span style={{ fontSize: 10, color: T.mid, letterSpacing: 2 }}>FRAMEWORK v1.4</span>
        </div>
        <button onClick={handleClear} style={{ fontSize: 10, color: T.dim, background: "none", border: "none", cursor: "pointer", letterSpacing: 1, fontFamily: "Georgia, serif" }}>
          Clear chat
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>

        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}

        {loading && <TypingIndicator />}

        {/* Suggestions */}
        {showSuggestions && messages.length === 1 && !loading && (
          <div style={{ marginTop: 8, marginBottom: 16 }}>
            <div style={{ fontSize: 9, color: T.dim, letterSpacing: 2, marginBottom: 10 }}>SUGGESTED QUESTIONS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => handleSend(s)} style={{
                  textAlign: "left", padding: "9px 12px",
                  background: T.surface, border: `1px solid ${T.border}`,
                  borderRadius: 8, color: T.mid, fontSize: 12,
                  cursor: "pointer", fontFamily: "Georgia, serif",
                  lineHeight: 1.4, transition: "all 0.15s",
                }}>
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
      <div style={{
        padding: "10px 12px",
        borderTop: `1px solid ${T.border}`,
        background: "rgba(12,12,16,0.98)",
        flexShrink: 0,
        display: "flex",
        gap: 8,
        alignItems: "flex-end",
      }}>

        {/* Image upload button */}
        <button
          onClick={() => fileRef.current?.click()}
          style={{
            flexShrink: 0, width: 36, height: 36,
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 8, color: T.dim, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, transition: "all 0.15s",
          }}
          title="Upload screenshot"
        >
          📎
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageSelect} style={{ display: "none" }} />

        {/* Text input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about a trade, paste your Greeks..."
          rows={1}
          style={{
            flex: 1,
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: "9px 12px",
            color: T.text,
            fontSize: 13,
            fontFamily: "Georgia, serif",
            outline: "none",
            resize: "none",
            lineHeight: 1.5,
            maxHeight: 100,
            overflowY: "auto",
          }}
          onInput={e => {
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
          }}
        />

        {/* Send button */}
        <button
          onClick={() => handleSend()}
          disabled={loading || (!input.trim() && !pendingImage)}
          style={{
            flexShrink: 0, width: 36, height: 36,
            background: (input.trim() || pendingImage) ? T.goldDim : "transparent",
            border: `1px solid ${(input.trim() || pendingImage) ? T.goldBorder : T.border}`,
            borderRadius: 8,
            color: (input.trim() || pendingImage) ? T.gold : T.dim,
            cursor: (input.trim() || pendingImage) ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, transition: "all 0.2s",
          }}
        >
          →
        </button>
      </div>

      {/* Disclaimer */}
      <div style={{ padding: "4px 16px 8px", textAlign: "center" }}>
        <span style={{ fontSize: 9, color: "#2a2a2a", letterSpacing: 1 }}>
          The framework suggests — you decide. Not financial advice.
        </span>
      </div>
    </div>
  );
}
