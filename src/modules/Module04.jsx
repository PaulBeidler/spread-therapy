import { useState, useEffect, useRef } from "react";

const TIERS = [
  { num: 1, label: "Covered Calls", role: "Systematic monthly income from shares you already own", frequency: "Every month", color: "#22c55e", otm: "Far OTM from cost basis", example: "MU $1,000 Call · Oct 16 · 157 DTE" },
  { num: 2, label: "Bull Put Spreads", role: "Index premium income — the primary income engine", frequency: "When conditions pass the framework", color: "#4a9eff", otm: "5%+ minimum", example: "RUTW 2735/2715 · 45 DTE" },
  { num: 3, label: "Bear Call Spreads", role: "Tactical hedge after extended rallies", frequency: "After 2+ consecutive up days only", color: "#a855f7", otm: "7%+ preferred", example: "RUTW 3080/3100 · Jun 18" },
  { num: 4, label: "LEAP Crash Shield", role: "Offensive capital for crash re-entry", frequency: "Hold continuously for 12–15 months", color: "#c9a84c", otm: "~18–20% from current price", example: "RUT 2350/2150 · Jun 2027" },
];

const SECTIONS = [
  {
    id: "opening",
    eyebrow: null,
    title: "How It All Works Together",
    body: [
      "Each module so far has described one piece of the framework. This module shows you how the pieces fit together into a single coherent system.",
      "The system has four tiers. Each tier has a role. Each role has a frequency. Understanding the relationship between them is what separates a trader who occasionally sells options from one who runs a systematic income engine.",
      "The analogy that helps most people: think of your portfolio as a business. The stocks are your inventory — assets you hold because you believe in their long-term value. The covered calls are your operating revenue — regular income generated from assets you already own. The spreads are your trading desk — systematic income from market conditions. The crash shield is your business continuity plan — funded insurance that turns a disaster into an opportunity.",
    ],
  },
  {
    id: "tier1",
    eyebrow: "Tier 1 — The Foundation",
    title: "Stocks and Covered Calls",
    pullquote: "The covered call engine generates more income than multiple spread campaigns combined. It runs every month without requiring new decisions.",
    body: [
      "The foundation of the portfolio is long stock — shares you own and intend to hold for the long term because you believe in the underlying company or sector.",
      "Against those shares, you sell covered calls every month. The call gives someone the right to buy your shares at a specified price above the current market. You collect premium for that right. If the stock stays below the strike, the call expires worthless and you keep the premium. Next month, you do it again.",
      "The MU campaign illustrates this clearly. Shares bought in July 2024 at an average of $121. Covered calls sold every month since. The options activity alone has generated thousands in premium across 47 legs. The shares have appreciated from $121 to $787. The true campaign P&L — shares plus options — is over $55,000.",
      "This is the engine. It requires one decision per month: where to set the strike. Everything else is mechanical. The premium arrives, the call either expires or gets rolled, and the cycle repeats.",
      "Tier 1 works best on stocks with liquid options markets, moderate implied volatility, and a long-term bullish thesis you genuinely hold. MU and RTX are in this portfolio for a reason — not because they are the best covered call candidates in the abstract, but because the conviction to hold them long-term already exists.",
    ],
  },
  {
    id: "tier2",
    eyebrow: "Tier 2 — The Income Engine",
    title: "Bull Put Spreads on Indices",
    body: [
      "The second tier runs independently of the stocks you own. Bull put spreads on RUTW or XSP generate income from the market's natural upward drift — without requiring you to own the underlying.",
      "The logic: sell a put spread below the current market level on a down day. Collect premium. Wait for time decay to erode the spread's value. Close at 50% profit or at 21 DTE. Repeat.",
      "The key structural advantage over Tier 1: bull put spreads do not require owning shares. They use collateral — buying power reduction — rather than capital. A $10-wide spread on RUTW might use $850 in BPR against a $117,000 account. Multiple spreads can run simultaneously without meaningfully depleting the capital available for shares.",
      "Tier 2 is systematic — not opportunistic. You enter whenever conditions pass the framework: down day entry, VIX in range, delta 0.15-0.20, 5%+ OTM, IVR above 25%. If conditions do not pass, you wait. There is always another day.",
      "The target cadence is two to four RUTW or XSP spreads per month, each at 30-45 DTE, closed at 50% profit. At this cadence, Tier 2 alone can generate $1,500-3,000 per month on a $100,000+ account — depending on market conditions and IVR.",
    ],
  },
  {
    id: "tier3",
    eyebrow: "Tier 3 — The Tactical Overlay",
    title: "Bear Call Spreads",
    body: [
      "Bear call spreads are not a systematic strategy. They are a tactical overlay — entered only when specific conditions exist that make them sensible.",
      "Those conditions: two or more consecutive up days, market at an elevated short-term reading, implied volatility stable or falling. When these align, selling a call spread above the market captures premium from a potential pause or pullback.",
      "The important distinction from Tier 2: bear calls fight against the market's natural upward trend. Bull puts work with it. This is why the framework limits bear calls to two simultaneous positions and requires 7%+ OTM — you need a larger buffer when the structural edge is against you.",
      "The current RUTW 3080/3100 bear call spread entered after three consecutive up days illustrates the opportunistic nature of Tier 3. It is not a core position. It is a tactical hedge against an extended market.",
      "Tier 3 should never feel like a routine trade. Every bear call entry should feel like a deliberate, conditions-based decision — not a habit.",
    ],
  },
  {
    id: "tier4",
    eyebrow: "Tier 4 — The Crash Shield",
    title: "The LEAP Put Spread",
    pullquote: "This is not insurance. It is offensive capital — ammunition for the moment when everyone else is selling and premiums are at their richest.",
    body: [
      "The crash shield sits outside the income framework entirely. It is not generating income. It is not producing theta. It is a debit position — you paid for it.",
      "The RUT 2350/2150 LEAP put spread entered May 2026 for $2,836. It expires June 2027. It pays approximately $20,000 if RUT falls to or below 2,150 — a drop of roughly 24% from entry.",
      "Why hold a position that costs money and generates no income? Because this portfolio is 100% bullish by design. Without a hedge, a 25-30% market crash would crush every position simultaneously — the stock holdings, the bull put spreads, everything. The portfolio would have no dry powder to exploit the dip.",
      "The LEAP solves this. In a crash, when everyone else is panicking, the LEAP pays $20,000. That $20,000 funds aggressive re-entry into bull put spreads at exactly the moment when IVR is at 80%+ and premiums are the richest they will ever be. The crash becomes an offensive opportunity.",
      "This is why the framework calls it offensive capital, not defensive insurance. The goal is not to avoid the crash. The goal is to be positioned to profit from it.",
      "The LEAP is funded naturally — 2-3 RUTW bull put spreads cover its $2,836 cost. Tier 2 pays for Tier 4. The system funds itself.",
    ],
  },
  {
    id: "simultaneously",
    eyebrow: "The Key Insight",
    title: "All Four Tiers Run at the Same Time",
    body: [
      "The most important thing to understand about this framework is that the four tiers are not alternatives to each other. They run simultaneously.",
      "Right now, the portfolio holds MU shares with a covered call (Tier 1), two bull put spreads (Tier 2), one bear call spread (Tier 3), and the LEAP crash shield (Tier 4). These positions are not competing. They are complementary.",
      "Tier 1 requires owning shares — capital allocation. Tier 2 requires buying power reduction — collateral. Tier 3 is opportunistic and capped at two positions. Tier 4 is a one-time purchase that sits untouched.",
      "The practical result: a $117,000 account running all four tiers simultaneously has roughly $9,500 in total BPR from options positions. The overwhelming majority of the account value remains in shares and cash. The income from options activity layers on top of the long-term equity appreciation.",
      "This is the complete picture. Not options instead of stocks. Not spreads instead of covered calls. Everything together, each serving its role.",
    ],
  },
  {
    id: "income_goal",
    eyebrow: "The Target",
    title: "Building Toward $30,000 per Year",
    body: [
      "The goal of this portfolio is $30,000 per year in options income — $2,500 per month — to fund private school tuition for three children.",
      "Here is how the four tiers contribute toward that goal on a $117,000 account:",
      "Tier 1 — covered calls on MU and RTX — generates $800-1,500 per month depending on strikes selected and market conditions. This alone covers 30-60% of the monthly goal.",
      "Tier 2 — two to four RUTW/XSP bull put spreads per month — generates $600-1,200 per month at the framework's target credits and win rate.",
      "Tier 3 — bear calls when conditions warrant — adds $200-400 in opportunistic months. Not reliable enough to count on.",
      "Tier 4 — the LEAP — contributes nothing monthly. Its contribution is potential: $20,000 in the event of a crash, deployed at the best possible moment.",
      "Total realistic monthly range: $1,600-3,100. The $2,500 target is achievable in most months without requiring perfect conditions.",
    ],
  },
  {
    id: "decision_hierarchy",
    eyebrow: "The Daily Practice",
    title: "How to Think About Your Portfolio",
    body: [
      "When you sit down to evaluate your portfolio each day, the framework suggests a specific order of operations.",
      "First, check Tier 1. Are any covered calls at risk of assignment? Are any approaching 21 DTE? Is there a roll to consider? The covered call engine must run smoothly before anything else.",
      "Second, check Tier 2. Do any bull put spreads need attention — delta spike, approaching 50% profit, approaching 21 DTE? Are conditions right to open a new one?",
      "Third, check Tier 3. Is the market extended enough to consider a bear call? Are existing bear calls still appropriate given market conditions?",
      "Fourth, confirm Tier 4. Is the LEAP in place? Has the market dropped enough to warrant evaluating the position? Mostly: set and forget.",
      "Fifth, check the pre-trade checklist before any new entry. Every single time. The checklist exists because in the moment, the temptation to skip steps feels harmless. It almost never is.",
      "This order of operations takes five minutes on a calm day. The structure ensures nothing critical is missed.",
    ],
  },
  {
    id: "closing",
    eyebrow: null,
    title: "The System Is the Edge",
    body: [
      "Individual trades do not create wealth. Systems do.",
      "Any single bull put spread might lose. Any single covered call might get called away at an inconvenient time. Any bear call might face an unexpected surge. These are not failures — they are the cost of operating the system.",
      "The system's edge comes from doing the right things consistently over hundreds of trades. From never rolling losers. From always closing at 50% profit. From entering only when conditions pass the framework. From using index options instead of ETFs. From running four tiers simultaneously so income arrives from multiple sources.",
      "The MU campaign proves this. No single leg was extraordinary. Forty-seven legs of disciplined execution built a $55,000 true P&L that the brokerage never showed.",
      "That is the system working.",
    ],
    cta: true,
  },
];

const NEXT_MODULES = [
  { id: "margin", label: "Module 5", title: "Margin & Capital Efficiency", desc: "How collateral works and how to use it without overextending.", recommended: true },
  { id: "pricing", label: "Module 6", title: "Pricing & Control", desc: "What your positions are worth and how to read them.", recommended: false },
  { id: "quiz", label: "Assessment", title: "Take the Quiz", desc: "Test your framework integration knowledge.", recommended: false },
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

export default function Module04({ onBack, onNavigate }) {
  const progress = useReadingProgress();
  const { activeIndex, refs } = useSectionProgress();

  return (
    <div className="st-together" style={{ minHeight: "100vh", background: "#09090d", color: "#e8e4df", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", maxWidth: 680, margin: "0 auto" }}>

      <div role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress" style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 100, background: "rgba(255,255,255,0.04)" }}>
        <div style={{ height: "100%", background: "#a855f7", width: `${progress}%`, transition: "width 0.1s linear" }} />
      </div>

      <div style={{ position: "fixed", top: 16, left: 16, right: 16, zIndex: 99, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {onBack && (
          <button onClick={onBack} aria-label="Back to Learn Hub" style={{ background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "6px 14px", cursor: "pointer", color: "#a855f7", fontSize: 12, fontFamily: "inherit", letterSpacing: 1 }}>← Back</button>
        )}
        <div style={{ background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#a855f7" }} />
          <span style={{ fontSize: 10, color: "#a855f7", letterSpacing: 2 }}>MODULE 04</span>
        </div>
      </div>

      <div style={{ padding: "80px 32px 64px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <FadeSection>
          <div style={{ fontSize: 10, color: "#a855f7", letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>Spread Therapy · The System</div>
        </FadeSection>
        <FadeSection delay={100}>
          <h1 style={{ fontSize: "clamp(28px, 6vw, 48px)", fontWeight: "normal", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24, color: "#f5f1eb" }}>How It All<br />Works Together</h1>
        </FadeSection>
        <FadeSection delay={200}>
          <p style={{ fontSize: 18, color: "#777", lineHeight: 1.7, fontStyle: "italic", maxWidth: 480, borderLeft: "2px solid rgba(168,85,247,0.3)", paddingLeft: 20 }}>
            Four tiers. Four roles. One account. Running simultaneously.
          </p>
        </FadeSection>
        <FadeSection delay={300}>
          <div style={{ display: "flex", gap: 20, marginTop: 32, flexWrap: "wrap" }}>
            {[["10 min read", "◷"], ["Module 4 of 7", "◎"], ["Capstone", "◈"]].map(([label, icon]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: "#444" }}>{icon}</span>
                <span style={{ fontSize: 11, color: "#444", letterSpacing: 1 }}>{label}</span>
              </div>
            ))}
          </div>
        </FadeSection>
      </div>

      {/* Four-tier overview */}
      <FadeSection>
        <div style={{ padding: "32px 32px 0" }}>
          <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 16 }}>THE FOUR TIERS — AT A GLANCE</div>
          {TIERS.map((tier, i) => (
            <div key={i} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: `${tier.color}18`, border: `1px solid ${tier.color}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 13, color: tier.color, fontWeight: "bold" }}>{tier.num}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#f0ede8", marginBottom: 3 }}>{tier.label}</div>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>{tier.role}</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10, color: tier.color }}>{tier.frequency}</span>
                  <span style={{ fontSize: 10, color: "#444" }}>{tier.otm}</span>
                </div>
                <div style={{ fontSize: 10, color: "#333", marginTop: 4, fontFamily: "monospace" }}>{tier.example}</div>
              </div>
            </div>
          ))}
        </div>
      </FadeSection>

      <div style={{ padding: "0 32px 80px" }}>
        {SECTIONS.map((section, si) => (
          <FadeSection key={section.id} delay={si * 40}>
            <div ref={el => refs.current[si] = el} style={{ padding: "48px 0", borderBottom: si < SECTIONS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>

              {section.eyebrow && (
                <div style={{ fontSize: 10, color: "#a855f7", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>{section.eyebrow}</div>
              )}

              {section.title !== "How It All Works Together" && (
                <h2 style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: "normal", lineHeight: 1.2, letterSpacing: "-0.01em", color: "#f0ede8", marginBottom: 24 }}>{section.title}</h2>
              )}

              {section.pullquote && (
                <div style={{ margin: "0 0 28px", padding: "18px 22px", background: "rgba(168,85,247,0.05)", borderLeft: "3px solid #a855f7", borderRadius: "0 8px 8px 0" }}>
                  <p style={{ fontSize: 17, color: "#a855f7", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>"{section.pullquote}"</p>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {section.body.map((para, pi) => (
                  <p key={pi} style={{ fontSize: 16, lineHeight: 1.85, color: pi === 0 ? "#c8c4be" : "#888", margin: 0 }}>{para}</p>
                ))}
              </div>

              {section.id === "income_goal" && (
                <FadeSection delay={100}>
                  <div style={{ marginTop: 28, background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 2, marginBottom: 16 }}>MONTHLY INCOME BREAKDOWN — $117K ACCOUNT</div>
                    {[
                      { tier: "Tier 1 — Covered Calls", range: "$800–$1,500", color: "#22c55e", reliable: true },
                      { tier: "Tier 2 — Bull Put Spreads", range: "$600–$1,200", color: "#4a9eff", reliable: true },
                      { tier: "Tier 3 — Bear Calls", range: "$200–$400", color: "#a855f7", reliable: false },
                      { tier: "Tier 4 — LEAP Shield", range: "$0 monthly / $20K crash payout", color: "#c9a84c", reliable: false },
                    ].map((row, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                        <div>
                          <div style={{ fontSize: 12, color: row.color }}>{row.tier}</div>
                          {!row.reliable && <div style={{ fontSize: 10, color: "#444" }}>Opportunistic — not guaranteed monthly</div>}
                        </div>
                        <div style={{ fontSize: 13, fontFamily: "monospace", color: row.reliable ? "#f0ede8" : "#555" }}>{row.range}</div>
                      </div>
                    ))}
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, color: "#c9a84c" }}>Monthly target</span>
                      <span style={{ fontSize: 16, color: "#c9a84c", fontFamily: "monospace" }}>$2,500</span>
                    </div>
                  </div>
                </FadeSection>
              )}

              {section.id === "decision_hierarchy" && (
                <FadeSection delay={100}>
                  <div style={{ marginTop: 28, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 16 }}>DAILY REVIEW ORDER</div>
                    {[
                      { step: "1", label: "Tier 1", detail: "Covered calls — assignment risk, 21 DTE, roll needed?", color: "#22c55e" },
                      { step: "2", label: "Tier 2", detail: "Bull puts — 50% profit reached? Delta spike? New entry conditions?", color: "#4a9eff" },
                      { step: "3", label: "Tier 3", detail: "Bear calls — still appropriate? Market extended enough to add?", color: "#a855f7" },
                      { step: "4", label: "Tier 4", detail: "LEAP — in place? Market drop significant enough to evaluate?", color: "#c9a84c" },
                      { step: "5", label: "Pre-trade checklist", detail: "Run before every new entry. Every single time.", color: "#ef4444" },
                    ].map((row, i) => (
                      <div key={i} style={{ display: "flex", gap: 14, padding: "10px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "flex-start" }}>
                        <div style={{ flexShrink: 0, width: 24, height: 24, borderRadius: "50%", background: `${row.color}18`, border: `1px solid ${row.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: row.color, fontWeight: "bold" }}>{row.step}</div>
                        <div>
                          <div style={{ fontSize: 12, color: "#ccc", marginBottom: 2 }}>{row.label}</div>
                          <div style={{ fontSize: 11, color: "#555" }}>{row.detail}</div>
                        </div>
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
                      <button key={mod.id} onClick={() => onNavigate?.(mod.id)} aria-label={`Go to ${mod.title}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderRadius: 10, cursor: "pointer", background: mod.recommended ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${mod.recommended ? "rgba(168,85,247,0.35)" : "rgba(255,255,255,0.06)"}`, textAlign: "left", fontFamily: "inherit", transition: "all 0.18s", outline: "none", width: "100%" }}>
                        <div>
                          <div style={{ fontSize: 9, color: mod.recommended ? "#a855f7" : "#444", letterSpacing: 2, marginBottom: 4 }}>{mod.label}{mod.recommended && " · RECOMMENDED"}</div>
                          <div style={{ fontSize: 15, color: mod.recommended ? "#f0ede8" : "#888" }}>{mod.title}</div>
                          <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>{mod.desc}</div>
                        </div>
                        <span style={{ fontSize: 18, color: mod.recommended ? "#a855f7" : "#333" }}>→</span>
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "#444", marginTop: 14, fontStyle: "italic" }}>
                    Most readers continue to Module 5 — understanding collateral and capital efficiency is essential before running multiple positions.
                  </p>
                </div>
              )}
            </div>
          </FadeSection>
        ))}
      </div>

      <div style={{ position: "fixed", left: "max(16px, calc(50% - 380px))", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 6, opacity: 0.3 }}>
        {SECTIONS.map((s, i) => (
          <div key={s.id} style={{ width: 3, height: i <= activeIndex ? 18 : 7, background: "#a855f7", borderRadius: 2, transition: "height 0.3s ease", opacity: i <= activeIndex ? 1 : 0.3 }} />
        ))}
      </div>

      <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 9, color: "#222", letterSpacing: 2 }}>SPREAD THERAPY · MODULE 04</div>
        <div style={{ fontSize: 9, color: "#222" }}>Not financial advice</div>
      </div>

      <style>{`
        .st-together * { box-sizing: border-box; }
        .st-together p, .st-together h1, .st-together h2, .st-together button { margin: 0; }
        .st-together button:focus-visible { outline: 2px solid #a855f7; outline-offset: 2px; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
