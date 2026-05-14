import { useState, useEffect, useRef } from "react";

const SECTIONS = [
  {
    id: "opening",
    eyebrow: null,
    title: "Spreads",
    body: [
      "The problem with selling a single option is that it ties up your entire account for one position. A naked put on a $500 stock requires $50,000 in collateral. Your account is frozen around a single bet.",
      "Spreads solve that problem. By buying a cheaper option alongside the one you sell, you cap your maximum loss — and your broker only requires collateral equal to that capped loss. Suddenly you can run 40 positions where you could only run one.",
      "Understanding spreads is the difference between trading options occasionally and building a systematic income engine.",
    ],
  },
  {
    id: "why_spreads",
    eyebrow: "The Core Question",
    title: "Why Not Just Sell Naked Options?",
    pullquote: "A naked put on a $500 stock requires $50,000 in collateral. A bull put spread on the same stock requires $1,000.",
    body: [
      "If selling options generates income, why add the complexity of buying another option at the same time? Doesn't that reduce your premium?",
      "Yes. It does. You collect less. But consider what you gain.",
      "When you sell a naked put, your broker requires collateral equal to the full obligation — potentially the entire value of the shares you might be forced to buy. On a $500 stock, that is $50,000 in buying power tied up for one position.",
      "When you sell a put spread, your maximum loss is capped at the difference between strikes. A $480/$470 bull put spread has a maximum loss of $1,000 — the $10 difference times 100 shares. Your broker only requires $1,000 in collateral, not $48,000.",
      "The premium you collect is lower. But you can run 40 or 50 of these positions for the same capital that one naked put would require. The income potential from 50 efficient positions far exceeds the income from one inefficient one.",
      "This is capital efficiency. Spreads are not a compromise. They are a structural upgrade.",
    ],
  },
  {
    id: "bull_put",
    eyebrow: "Strategy One",
    title: "The Bull Put Spread",
    body: [
      "A bull put spread is the primary income engine in the Spread Therapy framework. You sell a put at a higher strike and buy a put at a lower strike, both on the same underlying and expiration.",
      "Example: RUTW (RUT index) is trading at 2,881. You sell the 2,735 put and buy the 2,715 put, both expiring in 45 days. You collect $1.20 in net credit — $120 per contract.",
      "Your maximum profit is $120 — the full credit, kept if the index stays above 2,735 at expiration. If RUTW stays above 2,735 for 45 days, you keep the $120 and the trade closes automatically. That is the entire outcome.",
      "Your maximum loss is $1,880 — the $20 spread width ($2,000) minus the $120 credit received.",
      "Your probability of profit is approximately 80% — because your short strike at 2,735 is about 5% below the current price, corresponding to a delta of roughly 0.20.",
      "You are bullish on the market. You want it to stay above 2,735. The market's natural upward drift is working in your favor.",
    ],
  },
  {
    id: "bear_call",
    eyebrow: "Strategy Two",
    title: "The Bear Call Spread",
    body: [
      "A bear call spread is the mirror image. You sell a call at a lower strike and buy a call at a higher strike. You profit if the market stays below your short call strike.",
      "Example: RUTW is trading at 2,881 after two consecutive up days. You sell the 3,090 call and buy the 3,110 call, both expiring in 38 days. You collect $0.80 in net credit — $80 per contract. If RUTW stays below 3,090, you keep the $80. Your maximum loss is $1,920.",
      "The Spread Therapy framework treats bear calls as opportunistic — not systematic. You only enter them after two or more consecutive up days when the market is clearly extended.",
      "Why the asymmetry? Markets spend more time going up than going down. Bull puts work with the natural drift. Bear calls fight against it. The edge is smaller and the timing requirements are stricter.",
      "The framework caps bear call positions at two simultaneously. It is a satellite strategy around the bull put core.",
    ],
  },
  {
    id: "ivr",
    eyebrow: "Volatility Context",
    title: "IV Rank — When to Sell Premium",
    body: [
      "Before evaluating any specific trade, the framework checks the volatility environment. Implied volatility rank (IVR) measures where current implied volatility sits relative to its range over the past year. An IVR of 40% means implied volatility is higher than 40% of all readings from the past year.",
      "For premium sellers, high IVR is favorable. When volatility is elevated, options are more expensive — you collect more premium for the same strike distance. When volatility is low, options are cheaper and premium is thin.",
      "IVR also predicts mean reversion. Elevated volatility tends to fall back toward average over time. When you sell options during high IVR, you benefit twice: from time decay and from volatility compression.",
      "The framework requires IVR above 25% and prefers above 40%. The VIX range of 16–25 for bull puts is not arbitrary. Below 16, premium is too thin. Above 25, volatility is spiking and the market is in stress — not the right time to be selling premium aggressively.",
    ],
  },
  {
    id: "framework_criteria",
    eyebrow: "The Scoring Framework",
    title: "Every Criterion, Grouped by Purpose",
    body: [
      "The framework scores every potential trade before entry. The criteria fall into three tiers: hard stops that disqualify a trade immediately, quality filters that determine whether the trade is worth taking, and timing signals that determine when to enter.",
    ],
  },
  {
    id: "lessons",
    eyebrow: "Hard-Won Rules",
    title: "What the Framework Learned",
    pullquote: "The RUTW 2770/2750 trade entered at 1.9% OTM on a gap-up morning. It violated three rules simultaneously and barely survived.",
    body: [
      "Every rule in the framework was written in response to a real experience. Here are the ones that matter most for spread sellers.",
      "Never enter on a gap-up morning. When the market opens significantly higher, put premiums have already compressed. The buffer you thought you were buying has shrunk. You are getting less premium for less protection — a double penalty. Wait for a flat or down day.",
      "Five percent OTM is the effective minimum, not 3%. The 2770/2750 RUTW trade entered at 1.9% OTM — a rule violation that nearly turned into a loss despite a favorable delta. A small market drop threatened the entire position. Five percent gives you real room.",
      "Never roll losers into more risk. If a position is losing, the instinct is to roll to a wider or further-out spread to recover. This almost always results in taking on more risk than you should. Close losers. Do not compound them.",
      "Close at 50% profit. The final half of the potential profit requires far more risk and time than the first half. Closing at 50% and redeploying capital is almost always a better use of your account than riding a winner all the way to expiration.",
      "Close at 21 DTE. Gamma risk accelerates dramatically in the final three weeks. A position that was comfortable at 30 DTE can deteriorate rapidly at 15 DTE. The framework closes at 21 DTE regardless of P&L — it is not a suggestion.",
    ],
  },
  {
    id: "index_advantage",
    eyebrow: "Instrument Choice",
    title: "Why Index Spreads Beat Single-Stock Spreads",
    body: [
      "You can sell spreads on individual stocks. The framework strongly prefers index spreads. Here is why.",
      "Earnings risk does not exist for index options. A single stock can gap 20% on an earnings surprise. An index containing 2,000 companies absorbs any single company's news without flinching.",
      "European exercise style means no early assignment risk on index options. Ever. The clean management profile of European-style options is a significant operational advantage for systematic spread sellers.",
      "Tax treatment under Section 1256 applies to index options (RUT, XSP, RUTW) but not to ETF options (SPY, QQQ, IWM). The 60/40 long-term/short-term split results in an effective rate of approximately 19% versus 32% for short-term gains. On a $30,000 income goal, this difference is worth about $3,900 per year.",
      "Diversification means index moves are smoother and more predictable than single-stock moves. The tail risk that devastates a single-stock spread — one bad headline, one sector rotation — is absorbed into the broader index.",
      "Always prefer RUTW or XSP over QQQ or SPY. Always prefer RUT over IWM. The instrument choice is a free upgrade.",
    ],
  },
  {
    id: "closing",
    eyebrow: null,
    title: "The Engine",
    body: [
      "Bull put spreads are the engine of this framework. Not because they always win — they do not. They win approximately 80% of the time when entries follow the rules. The 20% of losses are managed, capped, and absorbed without threatening the account.",
      "The power is in the repetition. A systematic spread seller who follows the framework — entering at 5%+ OTM on down days, closing at 50% profit, respecting the 21 DTE rule — runs 8 to 12 positions per month. Even at an 80% win rate with proper position sizing, the math is compelling.",
      "The RUTW bull put campaign in this portfolio has maintained a consistent win rate across dozens of trades. No single trade was dramatic. The engine just ran. That is the point.",
    ],
    cta: true,
  },
];

const FRAMEWORK_CRITERIA = {
  hardStops: [
    { criterion: "Delta", requirement: "≤0.20 ideal, hard stop at 0.25", weight: 30, why: "Primary risk gauge. Above 0.25 = less than 75% probability of profit. Above 0.35 = close immediately." },
    { criterion: "DTE at Entry", requirement: "≥35 days", weight: 15, why: "Gamma explodes near expiration. Close at 21 DTE to avoid unmanageable risk." },
    { criterion: "OTM Distance", requirement: "≥5% (bull put) · ≥7% (bear call)", weight: 20, why: "Buffer between market and your strike. Below 5%, a single bad day threatens the position." },
  ],
  qualityFilters: [
    { criterion: "Reward/Risk Ratio", requirement: "≥20% minimum · ≥25% preferred", weight: 15, why: "Premium collected ÷ maximum loss. Below 20%, the compensation is inadequate." },
    { criterion: "IVR", requirement: "≥25% minimum · ≥40% preferred", weight: 10, why: "High IVR = richer premium + mean reversion tailwind. Below 25%, premium is too thin." },
    { criterion: "Spread Width", requirement: "≥$10", weight: 5, why: "Narrow spreads have poor reward/risk ratios. Wider spreads collect meaningful premium." },
  ],
  timing: [
    { criterion: "Entry Day", requirement: "Down/flat day (bull put) · 2+ up days (bear call)", weight: 5, why: "Enters when premium is richest. Gap-up mornings compress put premiums dangerously." },
  ],
};

const NEXT_MODULES = [
  { id: "together", label: "Module 4", title: "How It All Works Together", desc: "Stocks, covered calls, and spreads running simultaneously.", recommended: true },
  { id: "margin", label: "Module 5", title: "Margin & Capital Efficiency", desc: "How collateral works and how to manage multiple positions.", recommended: false },
  { id: "quiz", label: "Assessment", title: "Take the Quiz", desc: "Test your spread mechanics knowledge.", recommended: false },
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

export default function Module03({ onBack, onNavigate }) {
  const progress = useReadingProgress();
  const { activeIndex, refs } = useSectionProgress();
  const [nakedCollateral, setNakedCollateral] = useState(500);
  const [spreadWidth, setSpreadWidth] = useState(10);
  const collateralNaked = nakedCollateral * 100;
  const collateralSpread = spreadWidth * 100;
  const efficiency = Math.round(collateralNaked / collateralSpread);

  return (
    <div className="st-spreads" style={{ minHeight: "100vh", background: "#09090d", color: "#e8e4df", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", maxWidth: 680, margin: "0 auto" }}>

      <div role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress" style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 100, background: "rgba(255,255,255,0.04)" }}>
        <div style={{ height: "100%", background: "#c9a84c", width: `${progress}%`, transition: "width 0.1s linear" }} />
      </div>

      <div style={{ position: "fixed", top: 16, left: 16, right: 16, zIndex: 99, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {onBack && (
          <button onClick={onBack} aria-label="Back to Learn Hub" style={{ background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "6px 14px", cursor: "pointer", color: "#c9a84c", fontSize: 12, fontFamily: "inherit", letterSpacing: 1 }}>← Back</button>
        )}
        <div style={{ background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a84c" }} />
          <span style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 2 }}>MODULE 03</span>
        </div>
      </div>

      <div style={{ padding: "80px 32px 64px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <FadeSection>
          <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>Spread Therapy · Spreads</div>
        </FadeSection>
        <FadeSection delay={100}>
          <h1 style={{ fontSize: "clamp(36px, 8vw, 56px)", fontWeight: "normal", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24, color: "#f5f1eb" }}>Spreads</h1>
        </FadeSection>
        <FadeSection delay={200}>
          <p style={{ fontSize: 18, color: "#777", lineHeight: 1.7, fontStyle: "italic", maxWidth: 480, borderLeft: "2px solid rgba(201,168,76,0.3)", paddingLeft: 20 }}>
            Two options. One position. The structure that makes systematic income possible without tying up your entire account.
          </p>
        </FadeSection>
        <FadeSection delay={300}>
          <div style={{ display: "flex", gap: 20, marginTop: 32, flexWrap: "wrap" }}>
            {[["12 min read", "◷"], ["Module 3 of 7", "◎"], ["Core Strategy", "◈"]].map(([label, icon]) => (
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
          <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 2, marginBottom: 20 }}>INTERACTIVE · NAKED PUT vs SPREAD COLLATERAL</div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 8 }}>Stock price: ${nakedCollateral}</div>
              <input type="range" min="50" max="1000" step="10" value={nakedCollateral} onChange={e => setNakedCollateral(Number(e.target.value))} aria-label="Stock price" style={{ width: "100%", accentColor: "#c9a84c" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 8 }}>Spread width: ${spreadWidth}</div>
              <input type="range" min="5" max="50" step="5" value={spreadWidth} onChange={e => setSpreadWidth(Number(e.target.value))} aria-label="Spread width" style={{ width: "100%", accentColor: "#c9a84c" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { label: "Naked put collateral", value: `$${collateralNaked.toLocaleString()}`, color: "#ef4444", note: "Full stock value" },
                { label: "Spread collateral", value: `$${collateralSpread.toLocaleString()}`, color: "#22c55e", note: `$${spreadWidth} wide × 100` },
                { label: "Efficiency gain", value: `${efficiency}×`, color: "#c9a84c", note: "More positions possible" },
              ].map(card => (
                <div key={card.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "#444", letterSpacing: 1, marginBottom: 8 }}>{card.label.toUpperCase()}</div>
                  <div style={{ fontSize: 18, fontFamily: "monospace", color: card.color, marginBottom: 4 }}>{card.value}</div>
                  <div style={{ fontSize: 10, color: "#333" }}>{card.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeSection>

      <div style={{ padding: "0 32px 80px" }}>
        {SECTIONS.map((section, si) => (
          <FadeSection key={section.id} delay={si * 40}>
            <div ref={el => refs.current[si] = el} style={{ padding: "48px 0", borderBottom: si < SECTIONS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>

              {section.eyebrow && (
                <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>{section.eyebrow}</div>
              )}

              {section.title !== "Spreads" && (
                <h2 style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: "normal", lineHeight: 1.2, letterSpacing: "-0.01em", color: "#f0ede8", marginBottom: 24 }}>{section.title}</h2>
              )}

              {section.pullquote && (
                <div style={{ margin: "0 0 28px", padding: "18px 22px", background: "rgba(201,168,76,0.05)", borderLeft: "3px solid #c9a84c", borderRadius: "0 8px 8px 0" }}>
                  <p style={{ fontSize: 17, color: "#c9a84c", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>"{section.pullquote}"</p>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {section.body.map((para, pi) => (
                  <p key={pi} style={{ fontSize: 16, lineHeight: 1.85, color: pi === 0 ? "#c8c4be" : "#888", margin: 0 }}>{para}</p>
                ))}
              </div>

              {section.id === "framework_criteria" && (
                <FadeSection delay={100}>
                  <div style={{ marginTop: 28 }}>
                    {[
                      { tier: "HARD STOPS", color: "#ef4444", items: FRAMEWORK_CRITERIA.hardStops, note: "Any violation disqualifies the trade immediately." },
                      { tier: "QUALITY FILTERS", color: "#c9a84c", items: FRAMEWORK_CRITERIA.qualityFilters, note: "All should pass before entry." },
                      { tier: "TIMING", color: "#06b6d4", items: FRAMEWORK_CRITERIA.timing, note: "Entry conditions for each strategy type." },
                    ].map(group => (
                      <div key={group.tier} style={{ marginBottom: 24 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${group.color}30` }}>
                          <div style={{ fontSize: 9, color: group.color, letterSpacing: 2 }}>{group.tier}</div>
                          <div style={{ fontSize: 10, color: "#444", fontStyle: "italic" }}>{group.note}</div>
                        </div>
                        {group.items.map((row, i) => (
                          <div key={i} style={{ padding: "12px 0", borderBottom: i < group.items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                              <span style={{ fontSize: 13, color: "#ccc" }}>{row.criterion}</span>
                              <span style={{ fontSize: 11, color: group.color, fontFamily: "monospace" }}>{row.weight}% weight</span>
                            </div>
                            <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{row.requirement}</div>
                            <div style={{ fontSize: 10, color: "#444" }}>{row.why}</div>
                          </div>
                        ))}
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
                      <button key={mod.id} onClick={() => onNavigate?.(mod.id)} aria-label={`Go to ${mod.title}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderRadius: 10, cursor: "pointer", background: mod.recommended ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${mod.recommended ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.06)"}`, textAlign: "left", fontFamily: "inherit", transition: "all 0.18s", outline: "none", width: "100%" }}>
                        <div>
                          <div style={{ fontSize: 9, color: mod.recommended ? "#c9a84c" : "#444", letterSpacing: 2, marginBottom: 4 }}>{mod.label}{mod.recommended && " · RECOMMENDED"}</div>
                          <div style={{ fontSize: 15, color: mod.recommended ? "#f0ede8" : "#888" }}>{mod.title}</div>
                          <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>{mod.desc}</div>
                        </div>
                        <span style={{ fontSize: 18, color: mod.recommended ? "#c9a84c" : "#333" }}>→</span>
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "#444", marginTop: 14, fontStyle: "italic" }}>
                    Most readers continue to Module 4 to see how stocks, covered calls, and spreads run together as a system.
                  </p>
                </div>
              )}
            </div>
          </FadeSection>
        ))}
      </div>

      <div style={{ position: "fixed", left: "max(16px, calc(50% - 380px))", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 6, opacity: 0.3 }}>
        {SECTIONS.map((s, i) => (
          <div key={s.id} style={{ width: 3, height: i <= activeIndex ? 18 : 7, background: "#c9a84c", borderRadius: 2, transition: "height 0.3s ease", opacity: i <= activeIndex ? 1 : 0.3 }} />
        ))}
      </div>

      <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 9, color: "#222", letterSpacing: 2 }}>SPREAD THERAPY · MODULE 03</div>
        <div style={{ fontSize: 9, color: "#222" }}>Not financial advice</div>
      </div>

      <style>{`
        .st-spreads * { box-sizing: border-box; }
        .st-spreads p, .st-spreads h1, .st-spreads h2, .st-spreads button { margin: 0; }
        .st-spreads button:focus-visible { outline: 2px solid #c9a84c; outline-offset: 2px; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
