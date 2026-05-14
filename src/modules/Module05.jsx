import { useState, useEffect, useRef } from "react";

const SECTIONS = [
  {
    id: "opening",
    eyebrow: null,
    title: "Margin, Collateral & Capital Efficiency",
    body: [
      "Most traders think of their account balance as a single number. It is not. It is a collection of available resources — cash, margin, collateral — each with different rules about how it can be used.",
      "Understanding these distinctions is not academic. It determines how many positions you can run simultaneously, how much income you can generate from a given account size, and how close to the edge you are operating.",
      "This module explains the mechanics of margin and collateral, then shows you how to think about capital efficiency as a systematic spread seller.",
    ],
  },
  {
    id: "cash_margin",
    eyebrow: "The Foundation",
    title: "Cash vs Margin",
    body: [
      "A cash account holds the money you deposited and nothing more. You can only buy securities up to the value of your cash. You cannot sell naked options or spreads that require collateral backing beyond your deposit.",
      "A margin account allows your broker to extend buying power beyond your cash — typically two to four times your account value for stock purchases. For options, the broker uses your account as collateral to back your obligations.",
      "The important distinction for spread sellers: you are almost certainly not borrowing money when you use margin for options. You are using your account as collateral infrastructure. Your broker is not sending you borrowed cash — it is designating a portion of your account as backing for your open obligations.",
      "This is why the Spread Therapy framework requires a margin account. Not to borrow money and amplify gains, but to access the collateral mechanism that makes spread trading possible.",
    ],
  },
  {
    id: "buying_power",
    eyebrow: "How It Works",
    title: "Buying Power Reduction",
    pullquote: "When you sell a spread, your broker reduces your buying power by the maximum possible loss — not the full value of the underlying.",
    body: [
      "When you open an options position, your broker reserves a portion of your account as collateral. This reservation is called the buying power reduction (BPR) — sometimes called the margin requirement.",
      "For a naked put, the BPR is substantial. Your broker calculates the worst-case scenario — you are forced to buy shares at the strike price — and reserves capital accordingly. On a $500 stock with a $470 put, the BPR might be $4,700 to $6,000 or more.",
      "For a bull put spread, the BPR is exactly the maximum loss — the spread width minus the premium received. A $480/$470 bull put spread with a $1.60 credit has a maximum loss of $840. That is your BPR. That is all that is reserved.",
      "This is the capital efficiency argument for spreads in concrete numbers. The same trade idea — bullish on a stock near $480 — requires $4,700+ in collateral as a naked put versus $840 as a spread. You can run five spreads for the same capital as one naked put, generating five times the income potential.",
    ],
  },
  {
    id: "available_collateral",
    eyebrow: "Your Account",
    title: "How Much Collateral Do You Have?",
    body: [
      "Your available collateral is not simply your account value. It is your account value minus what is already reserved for open positions.",
      "If your account is worth $117,000 and you have $9,500 in buying power reduction from open spreads, your remaining available collateral is approximately $107,500. That is what you can deploy for new positions.",
      "The framework limits each new position to 5% of account value for a moderate risk profile. On a $117,000 account, that is $5,850 per position. This ensures that no single losing trade can materially damage the account.",
      "A $10-wide spread with a maximum loss of $1,000 uses $1,000 in BPR — well within the 5% limit. In practice, 8 to 12 active positions is the comfortable operating range for a systematic spread seller.",
    ],
  },
  {
    id: "pdt",
    eyebrow: "One Rule Worth Knowing",
    title: "The Pattern Day Trader Rule",
    body: [
      "In the United States, if your account holds less than $25,000, you are limited to three day trades — opening and closing a position on the same day — within any five-business-day period.",
      "For systematic spread sellers holding positions for 30 to 45 days, this rule is almost never relevant. Closing a position opened weeks ago is not a day trade.",
      "Where it matters for capital management: if you need to close a position urgently and reopen a replacement the same day, that counts as two day trades. Know your count. Track it in your daily check.",
    ],
  },
  {
    id: "overextension",
    eyebrow: "The Risk",
    title: "How to Overextend",
    pullquote: "Having buying power available is not permission to use it. Capital efficiency means optimizing, not maximizing.",
    body: [
      "The most common mistake among systematic spread sellers is confusing available buying power with permission to deploy it all.",
      "A margin account might show $361,000 in buying power — as the current portfolio does. The vast majority of that is margin capacity, not free capital. Treating it as deployable buying power would mean taking on positions 3x to 4x what is appropriate for the underlying account value.",
      "The framework's 5% per trade rule exists precisely to prevent this. On a $117,000 account, 5% is $5,850. Even if the brokerage shows $361,000 in buying power, you make decisions based on the $117,000 account value — not the margin ceiling.",
      "A second protection: maximum two bear call positions simultaneously. Bear calls fight against the market's natural upward drift. Running more than two means you are increasingly positioned against the dominant trend.",
      "What overextension looks like in practice: you have 15 positions open, the market drops 2% in a day, and suddenly three positions are approaching your delta threshold simultaneously. You need to close them — but closing three positions at a loss consumes capital you were counting on for new entries. The account freezes. You cannot manage and you cannot redeploy. That is the margin trap.",
    ],
  },
  {
    id: "leap_collateral",
    eyebrow: "Special Case",
    title: "The LEAP Crash Shield",
    body: [
      "The RUT 2350/2150 LEAP put spread is a special case worth understanding separately. It was entered for a debit of $2,836 — you paid for it rather than collecting premium.",
      "This position has no BPR in the traditional sense — you have already paid the maximum loss upfront. What it does require is $2,836 that is no longer available for other purposes.",
      "The LEAP is funded through spread premiums — 2 to 3 RUTW bull put spreads cover the cost. The framework treats it as Tier 4: a set-and-forget position that holds for 13 months unless a crash triggers its maximum payout of approximately $20,000.",
      "The capital logic: $2,836 in exchange for a potential $20,000 payout if the market falls 24% or more. That payout funds aggressive re-entry precisely when volatility is highest and premiums are richest — the ideal moment to be a seller.",
    ],
  },
  {
    id: "practical",
    eyebrow: "Putting It Together",
    title: "Managing Capital Across Multiple Positions",
    body: [
      "A well-managed spread account at any given time might look like this: three to four bull put spreads on RUT at different expirations, one bear call spread if market conditions warrant, one or two covered calls on stocks held long-term, and a LEAP crash shield running in the background.",
      "Each position has a BPR. The sum of all BPRs should be well within your available collateral — ideally using no more than 30 to 40% of your account value in total BPR. This leaves room for new opportunities and for managing existing positions without margin pressure.",
      "When a position deteriorates and you need to close it, you want the buying power to open a replacement without waiting. Overextended accounts cannot do this. They are stuck managing problems without the capital to pursue opportunities.",
      "The rule of thumb: if closing your worst-performing position would create meaningful relief, you are probably overextended. A well-managed account can absorb a position closing without noticing the capital impact.",
    ],
  },
  {
    id: "closing",
    eyebrow: null,
    title: "Efficiency Is the Edge",
    body: [
      "Larger accounts do not have better strategies. They just have more room to run the same strategy more times.",
      "The framework scales identically from $10,000 to $1,000,000. The percentage rules, the strike distance requirements, the delta limits — all of them are expressed as percentages precisely so they apply at any account size.",
      "What changes with account size is how many simultaneous positions you can run comfortably and how much absolute income you generate. The return percentage is similar at every size.",
      "Build the discipline at whatever size you are at now. The mechanics are identical when the account grows.",
    ],
    cta: true,
  },
];

const NEXT_MODULES = [
  { id: "pricing", label: "Module 6", title: "Pricing & Control", desc: "What your positions are worth and how to read them in real time.", recommended: true },
  { id: "philosophy", label: "Module 7", title: "Philosophy & Temperament", desc: "Why this approach works psychologically, and who it is for.", recommended: false },
  { id: "quiz", label: "Assessment", title: "Take the Quiz", desc: "Test your capital management knowledge.", recommended: false },
];

function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf;
    const update = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { update(); raf = null; }); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

function useSectionProgress() {
  const [activeIndex, setActiveIndex] = useState(0);
  const refs = useRef([]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach(entry => { if (entry.isIntersecting) { const idx = refs.current.indexOf(entry.target); if (idx >= 0) setActiveIndex(idx); } }); },
      { threshold: 0.3 }
    );
    refs.current.forEach(el => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return { activeIndex, refs };
}

function FadeSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Module05({ onBack, onNavigate }) {
  const progress = useReadingProgress();
  const { activeIndex, refs } = useSectionProgress();
  const [accountSize, setAccountSize] = useState(50000);
  const [positions, setPositions] = useState(8);
  const maxPerTrade = Math.round(accountSize * 0.05);
  const totalBPR = positions * 1000;
  const pctUsed = Math.round((totalBPR / accountSize) * 100);

  return (
    <div className="st-margin" style={{ minHeight: "100vh", background: "#09090d", color: "#e8e4df", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", maxWidth: 680, margin: "0 auto" }}>

      <div role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress" style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 100, background: "rgba(255,255,255,0.04)" }}>
        <div style={{ height: "100%", background: "#f97316", width: `${progress}%`, transition: "width 0.1s linear" }} />
      </div>

      <div style={{ position: "fixed", top: 16, left: 16, right: 16, zIndex: 99, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {onBack && (
          <button onClick={onBack} aria-label="Back to Learn Hub" style={{ background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "6px 14px", cursor: "pointer", color: "#f97316", fontSize: 12, fontFamily: "inherit", letterSpacing: 1 }}>← Back</button>
        )}
        <div style={{ background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f97316" }} />
          <span style={{ fontSize: 10, color: "#f97316", letterSpacing: 2 }}>MODULE 05</span>
        </div>
      </div>

      <div style={{ padding: "80px 32px 64px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <FadeSection>
          <div style={{ fontSize: 10, color: "#f97316", letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>Spread Therapy · Capital Efficiency</div>
        </FadeSection>
        <FadeSection delay={100}>
          <h1 style={{ fontSize: "clamp(30px, 6vw, 48px)", fontWeight: "normal", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24, color: "#f5f1eb" }}>Margin, Collateral<br />&amp; Capital Efficiency</h1>
        </FadeSection>
        <FadeSection delay={200}>
          <p style={{ fontSize: 18, color: "#777", lineHeight: 1.7, fontStyle: "italic", maxWidth: 480, borderLeft: "2px solid rgba(249,115,22,0.3)", paddingLeft: 20 }}>
            Your brokerage shows one number. Behind it are several different resources with different rules. Understanding them changes how you build a portfolio.
          </p>
        </FadeSection>
        <FadeSection delay={300}>
          <div style={{ display: "flex", gap: 20, marginTop: 32, flexWrap: "wrap" }}>
            {[["8 min read", "◷"], ["Module 5 of 7", "◎"], ["Essential", "◈"]].map(([label, icon]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: "#444" }}>{icon}</span>
                <span style={{ fontSize: 11, color: "#444", letterSpacing: 1 }}>{label}</span>
              </div>
            ))}
          </div>
        </FadeSection>
      </div>

      <FadeSection>
        <div style={{ padding: "32px 32px 0" }}>
          <div style={{ background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 10, color: "#f97316", letterSpacing: 2, marginBottom: 20 }}>INTERACTIVE · PORTFOLIO CAPACITY CALCULATOR</div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 8 }}>Account size: ${accountSize.toLocaleString()}</div>
              <input type="range" min="5000" max="500000" step="5000" value={accountSize} onChange={e => setAccountSize(Number(e.target.value))} aria-label="Account size" style={{ width: "100%", accentColor: "#f97316" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 8 }}>Active positions: {positions} (assuming $1,000 BPR each)</div>
              <input type="range" min="1" max="20" value={positions} onChange={e => setPositions(Number(e.target.value))} aria-label="Number of active positions" style={{ width: "100%", accentColor: "#f97316" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { label: "Max per trade (5%)", value: `$${maxPerTrade.toLocaleString()}`, color: "#c9a84c" },
                { label: "Total BPR", value: `$${totalBPR.toLocaleString()}`, color: pctUsed > 40 ? "#ef4444" : "#22c55e" },
                { label: "% of account", value: `${pctUsed}%`, color: pctUsed > 40 ? "#ef4444" : pctUsed > 25 ? "#f59e0b" : "#22c55e" },
              ].map(card => (
                <div key={card.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "#444", letterSpacing: 1, marginBottom: 8 }}>{card.label.toUpperCase()}</div>
                  <div style={{ fontSize: 18, fontFamily: "monospace", color: card.color, marginBottom: 4 }}>{card.value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, fontSize: 12, color: pctUsed > 40 ? "#ef4444" : "#555", lineHeight: 1.6, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 12 }}>
              {pctUsed > 40 ? "⚠ Over 40% of account in BPR — consider reducing positions." : pctUsed > 25 ? "Moderate utilization. Room for new opportunities." : "Well within range. Plenty of capacity remaining."}
            </div>
          </div>
        </div>
      </FadeSection>

      <div style={{ padding: "0 32px 80px" }}>
        {SECTIONS.map((section, si) => (
          <FadeSection key={section.id} delay={si * 40}>
            <div ref={el => refs.current[si] = el} style={{ padding: "48px 0", borderBottom: si < SECTIONS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>

              {section.eyebrow && (
                <div style={{ fontSize: 10, color: "#f97316", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>{section.eyebrow}</div>
              )}

              {section.title !== "Margin, Collateral & Capital Efficiency" && (
                <h2 style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: "normal", lineHeight: 1.2, letterSpacing: "-0.01em", color: "#f0ede8", marginBottom: 24 }}>{section.title}</h2>
              )}

              {section.pullquote && (
                <div style={{ margin: "0 0 28px", padding: "18px 22px", background: "rgba(249,115,22,0.05)", borderLeft: "3px solid #f97316", borderRadius: "0 8px 8px 0" }}>
                  <p style={{ fontSize: 17, color: "#f97316", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>"{section.pullquote}"</p>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {section.body.map((para, pi) => (
                  <p key={pi} style={{ fontSize: 16, lineHeight: 1.85, color: pi === 0 ? "#c8c4be" : "#888", margin: 0 }}>{para}</p>
                ))}
              </div>

              {section.id === "leap_collateral" && (
                <FadeSection delay={100}>
                  <div style={{ marginTop: 28, background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 2, marginBottom: 16 }}>RUT LEAP 2350/2150 — CAPITAL PROFILE</div>
                    {[
                      { label: "Cost paid (max loss)", value: "$2,836", color: "#ef4444" },
                      { label: "BPR", value: "$0 (paid upfront)", color: "#888" },
                      { label: "Maximum payout", value: "~$20,000", color: "#22c55e" },
                      { label: "Trigger", value: "RUT below 2,150 at Jun 2027", color: "#888" },
                      { label: "Required drop", value: "~24% from entry", color: "#888" },
                      { label: "Funded by", value: "2–3 RUTW bull put spreads", color: "#c9a84c" },
                    ].map((row, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                        <span style={{ fontSize: 12, color: "#555" }}>{row.label}</span>
                        <span style={{ fontSize: 12, color: row.color, fontFamily: "monospace" }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </FadeSection>
              )}

              {section.cta && (
                <div style={{ marginTop: 44 }}>
                  <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 18 }}>Continue to the next module</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {NEXT_MODULES.map(mod => (
                      <button key={mod.id} onClick={() => onNavigate?.(mod.id)} aria-label={`Go to ${mod.title}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderRadius: 10, cursor: "pointer", background: mod.recommended ? "rgba(249,115,22,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${mod.recommended ? "rgba(249,115,22,0.35)" : "rgba(255,255,255,0.06)"}`, textAlign: "left", fontFamily: "inherit", transition: "all 0.18s", outline: "none", width: "100%" }}>
                        <div>
                          <div style={{ fontSize: 9, color: mod.recommended ? "#f97316" : "#444", letterSpacing: 2, marginBottom: 4 }}>{mod.label}{mod.recommended && " · RECOMMENDED"}</div>
                          <div style={{ fontSize: 15, color: mod.recommended ? "#f0ede8" : "#888" }}>{mod.title}</div>
                          <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>{mod.desc}</div>
                        </div>
                        <span style={{ fontSize: 18, color: mod.recommended ? "#f97316" : "#333" }}>→</span>
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "#444", marginTop: 14, fontStyle: "italic" }}>
                    Most readers continue to Module 6 — understanding the Greeks gives you real-time control over your positions.
                  </p>
                </div>
              )}
            </div>
          </FadeSection>
        ))}
      </div>

      <div style={{ position: "fixed", left: "max(16px, calc(50% - 380px))", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 6, opacity: 0.3 }}>
        {SECTIONS.map((s, i) => (
          <div key={s.id} style={{ width: 3, height: i <= activeIndex ? 18 : 7, background: "#f97316", borderRadius: 2, transition: "height 0.3s ease", opacity: i <= activeIndex ? 1 : 0.3 }} />
        ))}
      </div>

      <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 9, color: "#222", letterSpacing: 2 }}>SPREAD THERAPY · MODULE 05</div>
        <div style={{ fontSize: 9, color: "#222" }}>Not financial advice</div>
      </div>

      <style>{`
        .st-margin * { box-sizing: border-box; }
        .st-margin p, .st-margin h1, .st-margin h2, .st-margin button { margin: 0; }
        .st-margin button:focus-visible { outline: 2px solid #f97316; outline-offset: 2px; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
