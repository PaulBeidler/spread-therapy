import { useState, useEffect, useRef } from "react";

const SECTIONS = [
  {
    id: "opening",
    eyebrow: null,
    title: "Options",
    body: [
      "There is a difference between owning something, being obliged to own it, and having the option of maybe owning it.",
      "Owning something means that thing is your responsibility. It is tied to you. You maintain it, you worry about it, you benefit from it, you suffer when it declines. Ownership is a commitment.",
      "Having the option to own it is different. That is freedom. You can purchase the thing — giving up the right to not own it — or you can purchase the right to purchase it. The latter means two things: you keep more of your money, and you keep your freedom.",
      "A third possibility: you can, without owning the thing, be contractually obliged to own it later. There is no freedom in that obligation. But you can get paid to take it on.",
      "These three relationships — ownership, freedom, obligation — are the entire foundation of options trading.",
    ],
  },
  {
    id: "not_better",
    eyebrow: "A Necessary Clarification",
    title: "None of These Is Better",
    pullquote: "The option to buy or sell a thing is not better than buying or selling it. It is also not worse. But it is different — and that difference is everything.",
    body: [
      "The option to buy or sell a thing is not better than buying or selling that thing. The option is also not worse than owning it. Owning stock is not inferior to trading options on it.",
      "But two things are true. The option exists. And it is different.",
      "Different means it has different properties, different costs, different risks, and different uses. This module explores those differences. It does not rank them. The framework uses both stocks and options because they serve different purposes — not because one is better than the other.",
    ],
  },
  {
    id: "calls",
    eyebrow: "The Two Types",
    title: "Calls and Puts",
    body: [
      "There are only two kinds of options. Everything else is a combination of these two.",
      "A call option gives the buyer the right to purchase a stock at a specific price — the strike price — before a specific date. If you own a call on NVDA with a $1,000 strike and NVDA goes to $1,100, you can buy it at $1,000. That right is valuable.",
      "A put option gives the buyer the right to sell a stock at the strike price before expiration. If you own a put on AAPL with a $200 strike and AAPL falls to $160, you can sell it at $200. That right is also valuable.",
      "In both cases, the buyer pays a premium for the right. The seller collects that premium and takes on the obligation.",
    ],
  },
  {
    id: "bullbear",
    eyebrow: "Direction",
    title: "Selling Reverses Everything",
    pullquote: "The same instrument can express completely opposite views depending on whether you are buying or selling it.",
    body: [
      "Calls are bullish when you buy them — you want the stock to rise. Puts are bearish when you buy them — you want the stock to fall. But selling reverses everything, and that reversal is the non-obvious insight that makes this framework work.",
      "If you sell a call, you want the stock to stay below the strike — you are neutral to bearish. If you sell a put, you want the stock to stay above the strike — you are neutral to bullish.",
      "Spread Therapy is primarily a selling framework. We sell puts when we are bullish. We sell calls when we think the market is extended. We collect premium and let time work in our favor.",
      "This means we profit when the stock does nothing, moves slightly in our direction, or even moves slightly against us — as long as it does not breach our strike. We do not need to be right about direction. We need to be right about boundaries.",
    ],
  },
  {
    id: "buyer_seller",
    eyebrow: "The Asymmetry",
    title: "Buyer vs Seller",
    body: [
      "When you buy an option, your maximum loss is the premium you paid. Your potential gain is theoretically unlimited (for calls) or very large (for puts). You are paying for the possibility of an outsized return.",
      "When you sell an option, your maximum gain is the premium you collected. Your potential loss is much larger — potentially the full value of the stock for a naked put, or the difference between strikes for a spread. You are collecting income in exchange for taking on a defined risk.",
      "Most retail traders buy options. Most professional traders sell them. This is not a coincidence. Options are priced to compensate sellers for the risk they are taking. Over time, implied volatility tends to exceed realized volatility — meaning options are usually slightly overpriced relative to how much the stock actually moves.",
      "This structural edge belongs to the seller. We are on the right side of that trade.",
    ],
  },
  {
    id: "american_european",
    eyebrow: "Exercise Style",
    title: "American vs European — Why It Matters",
    pullquote: "European-style options cannot be exercised early. This is a significant operational advantage for spread sellers.",
    body: [
      "Every option has an exercise style — the rules that govern when the buyer can use their right.",
      "American-style options can be exercised at any time before expiration. If you sell a covered call on MU and the stock surges, the buyer can exercise their right to buy your shares immediately — not just at expiration. This creates assignment risk you need to monitor.",
      "European-style options can only be exercised at expiration. They cannot be exercised early under any circumstances. This means no surprise assignments. No waking up to find your shares called away. You manage the position on your schedule, not the buyer's.",
      "Most single stock and ETF options (MU, RTX, QQQ, SPY) are American style. Most index options (RUT, SPX, XSP, RUTW) are European style.",
      "This is one of the primary reasons the Spread Therapy framework prefers index options. Beyond the tax advantage, European style means clean, predictable management — no early assignment risk, ever.",
    ],
  },
  {
    id: "assignment_prob",
    eyebrow: "A Common Fear",
    title: "Will I Get Assigned?",
    pullquote: "For the strategies in this framework — selling options 5%+ out of the money with 30+ days to expiration — early assignment is not a practical concern.",
    body: [
      "New options sellers often fear assignment. They imagine selling a covered call and having their shares yanked away at the worst possible moment. Here is the short answer: in this framework, it almost never happens. If you use index options, it is contractually impossible.",
      "Here is why. You sold a covered call with a $510 strike, 45 days to expiration, and the stock is currently at $500. The buyer paid a premium for that call. If they exercise it now, they buy your shares at $510 — but the stock is only worth $500. They immediately lose money. A rational buyer never exercises an out-of-the-money option early.",
      "Early assignment almost only happens in two specific situations: when a call is deep in the money and the remaining time value is nearly zero, or around ex-dividend dates on American-style options when capturing the dividend is worth more than the remaining time value.",
      "Neither situation applies to the strategies in this framework. You sell options at least 5% out of the money with 30 or more days to expiration. The time value alone makes early exercise irrational.",
    ],
  },
  {
    id: "delta_prob",
    eyebrow: "Delta as Probability",
    title: "Delta Tells You the Odds",
    body: [
      "Delta is formally defined as how much the option price changes when the underlying moves by $1. But it has a second meaning that is more useful for spread sellers: delta approximates the probability that the option expires in the money.",
      "A concrete example: MU is trading at $120 and you sell the $110 put at 0.16 delta. That delta tells you there is roughly a 16% chance MU falls below $110 by expiration — and an 84% chance it does not. You collect the premium and keep it 84% of the time.",
      "This is why the Spread Therapy framework uses delta as its primary strike selection tool. A short put with delta above 0.25 has less than 75% probability of profit — not enough margin for the risk being taken.",
      "When you choose a strike, you are choosing your probability of success. The framework targets the 0.15 to 0.20 delta range: high enough probability to sleep well, low enough to collect meaningful premium.",
    ],
  },
  {
    id: "expiration",
    eyebrow: "Time",
    title: "The Pleasant Impermanence",
    pullquote: "Not everything has to last forever. And temporary things are less costly.",
    body: [
      "Every option has an expiration date. After that date, the contract ceases to exist. This is one of the most important differences between options and stocks — and one of the least discussed.",
      "Stocks create the illusion of permanence. Liquidity makes it feel like you can sell anything at any time. But sometimes ownership is more permanent than you planned. You hold something too long because you are too attached to it, or because selling triggers consequences you are not ready for.",
      "Options end on a date you chose. You enter a position knowing exactly when it expires. You are not married to it. You do not have to decide when to leave — the leaving is built into the structure.",
      "This temporality has a practical consequence: temporary things are less costly. An option costs a fraction of what the underlying stock costs. You can participate in the movement of a $500 stock for $3. You can generate income from a $200,000 index position with $2,000 of collateral.",
      "Time decay — theta — is the mechanical expression of this impermanence. As expiration approaches, the option's time value erodes. For buyers, this is a cost. For sellers, it is income. Every day that passes without the stock breaching your strike, the option is worth less — and since you sold it, less is better.",
      "Time decay accelerates in the final weeks before expiration. The framework's management rules — closing at 50% profit and at 21 DTE — are designed to capture the favorable part of the decay curve while avoiding the elevated risk that comes with holding positions too close to expiration.",
    ],
  },
  {
    id: "naked_covered",
    eyebrow: "The Bridge to Spreads",
    title: "Covered, Naked, and Why Spreads Exist",
    body: [
      "A covered call is an option sold against shares you already own. If you own 100 shares of RTX and sell a call, the worst case is that your shares get called away at the strike price. You are covered — the shares back the obligation.",
      "A naked option is sold without that backing. A naked put obligates you to buy shares if the stock falls to the strike. A naked call — selling a call without owning the shares — has theoretically unlimited risk if the stock surges.",
      "Spreads solve the naked risk problem. Instead of selling an option with unlimited or very large risk, you simultaneously buy a cheaper option further out of the money. This purchased option caps your maximum loss at the difference between the two strikes.",
      "The Spread Therapy framework strongly prefers covered positions and defined-risk spreads. Not because naked options are always wrong, but because spreads use far less collateral, cap your maximum loss precisely, and let you run multiple positions simultaneously.",
      "Module 3 covers spreads in full detail — how they work, why they are superior for most traders, and how to construct them.",
    ],
  },
  {
    id: "closing",
    eyebrow: null,
    title: "You Are Never Locked In",
    body: [
      "The single most important thing to understand about options: you can always change your mind.",
      "If you sold a put and the stock is falling, you can buy it back. Yes, at a higher price than you sold it — that is a loss. But it is a controlled loss, not a catastrophe. You are not obligated to hold until expiration.",
      "If you sold a call and the stock is surging, you can buy it back and roll to a higher strike. You maintain the position. You adapt.",
      "Options are not a bet you make and then watch helplessly. They are a position you manage. That management — knowing when to hold, when to close, when to roll — is the skill this framework teaches.",
    ],
    cta: true,
  },
];

const NEXT_MODULES = [
  { id: "spreads", label: "Module 3", title: "Spreads", desc: "Why spreads beat naked options on every dimension that matters.", recommended: true },
  { id: "pricing", label: "Module 6", title: "Pricing & Control", desc: "What your position is worth and how to read it in real time.", recommended: false },
  { id: "quiz", label: "Assessment", title: "Take the Quiz", desc: "Test your options knowledge before your next trade.", recommended: false },
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

export default function Module02({ onBack, onNavigate }) {
  const progress = useReadingProgress();
  const { activeIndex, refs } = useSectionProgress();

  return (
    <div className="st-options" style={{ minHeight: "100vh", background: "#09090d", color: "#e8e4df", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", maxWidth: 680, margin: "0 auto", position: "relative" }}>

      <div role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress" style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 100, background: "rgba(255,255,255,0.04)" }}>
        <div style={{ height: "100%", background: "#06b6d4", width: `${progress}%`, transition: "width 0.1s linear" }} />
      </div>

      <div style={{ position: "fixed", top: 16, left: 16, right: 16, zIndex: 99, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {onBack && (
          <button onClick={onBack} aria-label="Back to Learn Hub" style={{ background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "6px 14px", cursor: "pointer", color: "#06b6d4", fontSize: 12, fontFamily: "inherit", letterSpacing: 1 }}>← Back</button>
        )}
        <div style={{ background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#06b6d4" }} />
          <span style={{ fontSize: 10, color: "#06b6d4", letterSpacing: 2 }}>MODULE 02</span>
        </div>
      </div>

      <div style={{ padding: "80px 32px 64px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <FadeSection>
          <div style={{ fontSize: 10, color: "#06b6d4", letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>Spread Therapy · Options</div>
        </FadeSection>
        <FadeSection delay={100}>
          <h1 style={{ fontSize: "clamp(36px, 8vw, 56px)", fontWeight: "normal", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24, color: "#f5f1eb" }}>Options</h1>
        </FadeSection>
        <FadeSection delay={200}>
          <p style={{ fontSize: 18, color: "#777", lineHeight: 1.7, fontStyle: "italic", maxWidth: 480, borderLeft: "2px solid rgba(6,182,212,0.3)", paddingLeft: 20 }}>
            Ownership, freedom, and obligation — three different relationships with the same thing.
          </p>
        </FadeSection>
        <FadeSection delay={300}>
          <div style={{ display: "flex", gap: 20, marginTop: 32, flexWrap: "wrap" }}>
            {[["12 min read", "◷"], ["Module 2 of 7", "◎"], ["Foundation", "◈"]].map(([label, icon]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: "#444" }}>{icon}</span>
                <span style={{ fontSize: 11, color: "#444", letterSpacing: 1 }}>{label}</span>
              </div>
            ))}
          </div>
        </FadeSection>
      </div>

      {/* Three relationships visual */}
      <FadeSection>
        <div style={{ padding: "32px 32px 0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "Ownership", icon: "◈", desc: "Responsibility. The thing is yours.", color: "#22c55e" },
            { label: "Freedom", icon: "◎", desc: "The right to choose. Not yet committed.", color: "#06b6d4" },
            { label: "Obligation", icon: "◉", desc: "A job. You get paid to take it on.", color: "#c9a84c" },
          ].map(r => (
            <div key={r.label} style={{ padding: "18px 14px", background: `${r.color}08`, border: `1px solid ${r.color}20`, borderRadius: 10, textAlign: "center" }}>
              <div style={{ fontSize: 24, color: r.color, marginBottom: 8 }}>{r.icon}</div>
              <div style={{ fontSize: 11, color: r.color, letterSpacing: 1, marginBottom: 6 }}>{r.label}</div>
              <div style={{ fontSize: 11, color: "#555", lineHeight: 1.4 }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </FadeSection>

      {/* Call/Put reference */}
      <FadeSection>
        <div style={{ padding: "20px 32px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "CALL", color: "#22c55e", buy: "Right to BUY at strike", sell: "Obligation to SELL at strike", bullbear: "Buy = Bullish · Sell = Neutral/Bearish" },
            { label: "PUT", color: "#ef4444", buy: "Right to SELL at strike", sell: "Obligation to BUY at strike", bullbear: "Buy = Bearish · Sell = Neutral/Bullish" },
          ].map(card => (
            <div key={card.label} style={{ background: `${card.color}08`, border: `1px solid ${card.color}25`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: card.color, letterSpacing: 3, marginBottom: 12 }}>{card.label}</div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}><span style={{ color: "#555" }}>Buy: </span>{card.buy}</div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 10 }}><span style={{ color: "#555" }}>Sell: </span>{card.sell}</div>
              <div style={{ fontSize: 10, color: card.color, borderTop: `1px solid ${card.color}20`, paddingTop: 8 }}>{card.bullbear}</div>
            </div>
          ))}
        </div>
      </FadeSection>

      <div style={{ padding: "0 32px 80px" }}>
        {SECTIONS.map((section, si) => (
          <FadeSection key={section.id} delay={si * 40}>
            <div ref={el => refs.current[si] = el} style={{ padding: "48px 0", borderBottom: si < SECTIONS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>

              {section.eyebrow && (
                <div style={{ fontSize: 10, color: "#06b6d4", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>{section.eyebrow}</div>
              )}

              {section.title !== "Options" && (
                <h2 style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: "normal", lineHeight: 1.2, letterSpacing: "-0.01em", color: "#f0ede8", marginBottom: 24 }}>{section.title}</h2>
              )}

              {section.pullquote && (
                <div style={{ margin: "0 0 28px", padding: "18px 22px", background: "rgba(6,182,212,0.05)", borderLeft: "3px solid #06b6d4", borderRadius: "0 8px 8px 0" }}>
                  <p style={{ fontSize: 17, color: "#06b6d4", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>"{section.pullquote}"</p>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {section.body.map((para, pi) => (
                  <p key={pi} style={{ fontSize: 16, lineHeight: 1.85, color: pi === 0 ? "#c8c4be" : "#888", margin: 0 }}>{para}</p>
                ))}
              </div>

              {section.id === "assignment_prob" && (
                <FadeSection delay={100}>
                  <div style={{ marginTop: 28, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 16 }}>ASSIGNMENT RISK BY SCENARIO</div>
                    {[
                      { scenario: "5%+ OTM, 30+ DTE, American style", risk: "Very Low", color: "#22c55e", pct: 5, note: "Buyer loses money exercising early" },
                      { scenario: "Near the money, 5–10 DTE, American style", risk: "Moderate", color: "#f59e0b", pct: 45, note: "Time value nearly gone — monitor closely" },
                      { scenario: "Deep ITM, near ex-dividend date", risk: "High", color: "#ef4444", pct: 80, note: "Dividend capture makes early exercise rational" },
                      { scenario: "Any position, European style (RUT/XSP/RUTW)", risk: "Zero", color: "#06b6d4", pct: 0, note: "Early assignment is contractually impossible" },
                    ].map((row, i) => (
                      <div key={i} style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 12, color: "#777" }}>{row.scenario}</span>
                          <span style={{ fontSize: 11, color: row.color, fontFamily: "monospace" }}>{row.risk}</span>
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 2, height: 3, marginBottom: 4 }}>
                          <div style={{ background: row.color, height: 3, width: `${Math.max(row.pct, 1)}%`, borderRadius: 2 }} />
                        </div>
                        <div style={{ fontSize: 10, color: "#444" }}>{row.note}</div>
                      </div>
                    ))}
                  </div>
                </FadeSection>
              )}

              {section.id === "delta_prob" && (
                <FadeSection delay={100}>
                  <div style={{ marginTop: 28, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ fontSize: 10, color: "#555", letterSpacing: 2 }}>DELTA → PROBABILITY OF PROFIT</div>
                    </div>
                    {[
                      { delta: "0.10", prob: "~90%", premium: "Low", color: "#22c55e", framework: false },
                      { delta: "0.15", prob: "~85%", premium: "Moderate", color: "#22c55e", framework: true },
                      { delta: "0.20", prob: "~80%", premium: "Good", color: "#c9a84c", framework: true },
                      { delta: "0.25", prob: "~75%", premium: "Higher", color: "#f59e0b", framework: false },
                      { delta: "0.30+", prob: "<70%", premium: "High", color: "#ef4444", framework: false },
                    ].map((row, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none", background: row.framework ? "rgba(201,168,76,0.04)" : "transparent" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 13, fontFamily: "monospace", color: row.color }}>Δ {row.delta}</span>
                          {row.framework && <span style={{ fontSize: 9, color: "#c9a84c", background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", padding: "1px 7px", borderRadius: 8, letterSpacing: 1 }}>TARGET</span>}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 12, color: row.color }}>{row.prob} profit</div>
                          <div style={{ fontSize: 10, color: "#444" }}>{row.premium} premium</div>
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
                      <button key={mod.id} onClick={() => onNavigate?.(mod.id)} aria-label={`Go to ${mod.title}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderRadius: 10, cursor: "pointer", background: mod.recommended ? "rgba(6,182,212,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${mod.recommended ? "rgba(6,182,212,0.35)" : "rgba(255,255,255,0.06)"}`, textAlign: "left", fontFamily: "inherit", transition: "all 0.18s", outline: "none", width: "100%" }}>
                        <div>
                          <div style={{ fontSize: 9, color: mod.recommended ? "#06b6d4" : "#444", letterSpacing: 2, marginBottom: 4 }}>{mod.label}{mod.recommended && " · RECOMMENDED"}</div>
                          <div style={{ fontSize: 15, color: mod.recommended ? "#f0ede8" : "#888" }}>{mod.title}</div>
                          <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>{mod.desc}</div>
                        </div>
                        <span style={{ fontSize: 18, color: mod.recommended ? "#06b6d4" : "#333" }}>→</span>
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "#444", marginTop: 14, fontStyle: "italic" }}>
                    Most readers continue to Module 3. Module 6 is useful if you want to understand pricing mechanics first.
                  </p>
                </div>
              )}
            </div>
          </FadeSection>
        ))}
      </div>

      <div style={{ position: "fixed", left: "max(16px, calc(50% - 380px))", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 6, opacity: 0.3 }}>
        {SECTIONS.map((s, i) => (
          <div key={s.id} style={{ width: 3, height: i <= activeIndex ? 18 : 7, background: "#06b6d4", borderRadius: 2, transition: "height 0.3s ease", opacity: i <= activeIndex ? 1 : 0.3 }} />
        ))}
      </div>

      <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 9, color: "#222", letterSpacing: 2 }}>SPREAD THERAPY · MODULE 02</div>
        <div style={{ fontSize: 9, color: "#222" }}>Not financial advice</div>
      </div>

      <style>{`
        .st-options * { box-sizing: border-box; }
        .st-options p, .st-options h1, .st-options h2, .st-options button { margin: 0; }
        .st-options button:focus-visible { outline: 2px solid #06b6d4; outline-offset: 2px; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
