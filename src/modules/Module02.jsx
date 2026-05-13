import { useState, useEffect, useRef } from "react";

const SECTIONS = [
  {
    id: "opening",
    eyebrow: null,
    title: "Options",
    subtitle: "A contract is not a stock. Understanding the difference changes everything.",
    body: [
      "When you buy a share of stock, you own something. A piece of a company. If the company does well, your piece is worth more. If it does poorly, less. Simple.",
      "An option is different. An option is a contract between two people. One person has a right. The other has an obligation. And someone gets paid for taking on that obligation.",
      "That payment — the premium — is the engine of everything we do.",
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
    title: "Bullish and Bearish",
    pullquote: "Calls are bullish. Puts are bearish. But selling reverses the direction.",
    body: [
      "If you buy a call, you are bullish — you want the stock to go up.",
      "If you buy a put, you are bearish — you want the stock to go down.",
      "But selling reverses everything. If you sell a call, you want the stock to stay below the strike — you are neutral to bearish. If you sell a put, you want the stock to stay above the strike — you are neutral to bullish.",
      "This is one of the most important insights in options trading: the same instrument can express completely opposite views depending on whether you are buying or selling it.",
      "Spread Therapy is primarily a selling framework. We sell puts when we are bullish. We sell calls when we think the market is extended. We collect premium and let time work in our favor.",
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
    id: "naked_covered",
    eyebrow: "Covered vs Naked",
    title: "Covered and Naked",
    body: [
      "A covered call is an option sold against shares you already own. If you own 100 shares of RTX and sell a call, the worst case is that your shares get called away at the strike price. You are covered — the shares back the obligation.",
      "A naked option is sold without that backing. A naked put obligates you to buy shares if the stock falls to the strike. You need the cash or margin to do that. A naked call — selling a call without owning the shares — has theoretically unlimited risk if the stock surges.",
      "The Spread Therapy framework strongly prefers covered positions and defined-risk spreads over naked options. Not because naked options are always wrong, but because spreads use far less collateral and cap your maximum loss precisely.",
    ],
  },
  {
    id: "american_european",
    eyebrow: "Exercise Style",
    title: "American vs European — Why It Matters",
    pullquote: "European-style options cannot be exercised early. This is a significant advantage for spread sellers.",
    body: [
      "Every option has an exercise style — the rules that govern when the buyer can use their right.",
      "American-style options can be exercised at any time before expiration. If you sell a covered call on MU and the stock surges, the buyer can exercise their right to buy your shares immediately — not just at expiration. This creates assignment risk that you need to monitor.",
      "European-style options can only be exercised at expiration. They cannot be exercised early under any circumstances. This means no surprise assignments. No waking up to find your shares called away. You manage the position on your schedule, not the buyer's.",
      "Most single stock and ETF options (MU, RTX, QQQ, SPY) are American style.",
      "Most index options (RUT, SPX, XSP, RUTW) are European style.",
      "This is one of the primary reasons the Spread Therapy framework prefers index options. Beyond the tax advantage, European style means clean, predictable management — no early assignment risk, ever.",
    ],
  },
  {
    id: "assignment_prob",
    eyebrow: "A Common Fear",
    title: "Will I Get Assigned?",
    pullquote: "Assignment before expiration is rare. Here is when it actually happens — and when it almost never does.",
    body: [
      "New options sellers often fear assignment. They imagine selling a covered call and having their shares yanked away at the worst possible moment.",
      "Here is the reality: early assignment on out-of-the-money options is extremely rare. Consider this scenario — you sold a covered call on a stock with a $510 strike, 45 days to expiration, and the stock is currently at $500. Are you likely to get assigned?",
      "Almost certainly not. Here is why: the buyer paid a premium for that call. If they exercise it now, they buy your shares at $510 — but the stock is only worth $500. They would immediately lose money. A rational buyer never exercises an out-of-the-money option early.",
      "Early assignment almost only happens in two specific situations: first, when a call is deep in the money and the remaining time value is nearly zero — the buyer has nothing to lose by exercising. Second, around ex-dividend dates on American-style options, when capturing the dividend is worth more than the remaining time value.",
      "For the strategies in this framework — selling options that are at least 5% out of the money with 30 or more days to expiration — early assignment is not a practical concern. If you use index options, it is impossible.",
    ],
  },
  {
    id: "delta_prob",
    eyebrow: "Delta as Probability",
    title: "Delta Tells You the Odds",
    body: [
      "Delta is formally defined as how much the option price changes when the underlying moves by $1. But it has a second meaning that is more useful for spread sellers: delta approximates the probability that the option expires in the money.",
      "A delta of 0.20 on a short put means roughly a 20% chance the stock falls below your strike by expiration. Equivalently, it means roughly an 80% probability of profit.",
      "This is why the Spread Therapy framework uses delta as its primary hard stop. A short put with delta above 0.25 has less than 75% probability of profit — not enough margin for the risk being taken.",
      "When you choose a strike, you are choosing your probability of success. A 0.15 delta gives you an 85% chance. A 0.10 delta gives you a 90% chance. The tradeoff is premium — lower probability of loss means lower premium collected.",
      "The framework targets the 0.15 to 0.20 delta range as the sweet spot: high enough probability to sleep well, low enough to collect meaningful premium.",
    ],
  },
  {
    id: "expiration",
    eyebrow: "Time",
    title: "Expiration and Time Decay",
    body: [
      "Every option has an expiration date. After that date, the option is worthless if it has not been exercised. This expiration is what creates time value — and time value is what option sellers harvest.",
      "An option's price has two components: intrinsic value (how far in the money it is) and time value (the possibility that it could move further). As expiration approaches, time value decays. This decay — theta — is the seller's daily income.",
      "Time decay is not linear. It accelerates in the final weeks before expiration. An option with 45 days left loses value slowly at first, then faster and faster. This is why the framework closes positions at 50% profit or at 21 days to expiration — both capture the best part of the decay curve without the elevated risk near expiration.",
      "You do not have to wait for expiration. Most options positions are closed well before then. You opened by selling, so you close by buying back — at a lower price if the trade went your way.",
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
  { id: "spreads", label: "Module 3", title: "Spreads", desc: "Why spreads beat naked options on every dimension that matters." },
  { id: "pricing", label: "Module 6", title: "Pricing & Control", desc: "What your position is worth and how to read it in real time." },
  { id: "quiz", label: "Assessment", title: "Take the Quiz", desc: "Test your options knowledge before your next trade." },
];

function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return progress;
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
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

export default function SpreadTherapyOptions() {
  const progress = useReadingProgress();
  const [selectedNext, setSelectedNext] = useState(null);
  const [activeCallout, setActiveCallout] = useState(null);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#09090d",
      color: "#e8e4df",
      fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif",
      maxWidth: 680,
      margin: "0 auto",
      position: "relative",
    }}>

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 100, background: "rgba(255,255,255,0.04)" }}>
        <div style={{ height: "100%", background: "#06b6d4", width: `${progress}%`, transition: "width 0.1s linear" }} />
      </div>

      {/* Module pill */}
      <div style={{
        position: "fixed", top: 16, right: 16, zIndex: 99,
        background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "6px 14px",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#06b6d4" }} />
        <span style={{ fontSize: 10, color: "#06b6d4", letterSpacing: 2 }}>MODULE 02</span>
      </div>

      {/* Hero */}
      <div style={{ padding: "80px 32px 64px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <FadeSection>
          <div style={{ fontSize: 10, color: "#06b6d4", letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>
            Spread Therapy · Options
          </div>
        </FadeSection>
        <FadeSection delay={100}>
          <h1 style={{ fontSize: "clamp(36px, 8vw, 56px)", fontWeight: "normal", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24, color: "#f5f1eb" }}>
            Options
          </h1>
        </FadeSection>
        <FadeSection delay={200}>
          <p style={{ fontSize: 18, color: "#777", lineHeight: 1.7, fontStyle: "italic", maxWidth: 480, borderLeft: "2px solid rgba(6,182,212,0.3)", paddingLeft: 20 }}>
            A contract between two people. One has a right. The other has an obligation. And someone gets paid.
          </p>
        </FadeSection>
        <FadeSection delay={300}>
          <div style={{ display: "flex", gap: 20, marginTop: 32, flexWrap: "wrap" }}>
            {[["10 min read", "◷"], ["Module 2 of 7", "◎"], ["Foundation", "◈"]].map(([label, icon]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: "#444" }}>{icon}</span>
                <span style={{ fontSize: 11, color: "#444", letterSpacing: 1 }}>{label}</span>
              </div>
            ))}
          </div>
        </FadeSection>
      </div>

      {/* Quick reference cards */}
      <FadeSection>
        <div style={{ padding: "32px 32px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "CALL", color: "#22c55e", buy: "Right to BUY at strike", sell: "Obligation to SELL at strike", bullbear: "Buy = Bullish · Sell = Neutral/Bearish" },
            { label: "PUT", color: "#ef4444", buy: "Right to SELL at strike", sell: "Obligation to BUY at strike", bullbear: "Buy = Bearish · Sell = Neutral/Bullish" },
          ].map(card => (
            <div key={card.label} style={{ background: `${card.color}08`, border: `1px solid ${card.color}25`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: card.color, letterSpacing: 3, marginBottom: 12 }}>{card.label}</div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>
                <span style={{ color: "#555" }}>Buy: </span>{card.buy}
              </div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 10 }}>
                <span style={{ color: "#555" }}>Sell: </span>{card.sell}
              </div>
              <div style={{ fontSize: 10, color: card.color, borderTop: `1px solid ${card.color}20`, paddingTop: 8 }}>{card.bullbear}</div>
            </div>
          ))}
        </div>
      </FadeSection>

      {/* Content */}
      <div style={{ padding: "0 32px 80px" }}>
        {SECTIONS.map((section, si) => (
          <FadeSection key={section.id} delay={si * 40}>
            <div style={{ padding: "48px 0", borderBottom: si < SECTIONS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>

              {section.eyebrow && (
                <div style={{ fontSize: 10, color: "#06b6d4", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>
                  {section.eyebrow}
                </div>
              )}

              {section.title !== "Options" && (
                <h2 style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: "normal", lineHeight: 1.2, letterSpacing: "-0.01em", color: "#f0ede8", marginBottom: 24 }}>
                  {section.title}
                </h2>
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

              {/* Assignment probability interactive */}
              {section.id === "assignment_prob" && (
                <FadeSection delay={100}>
                  <div style={{ marginTop: 28, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 16 }}>ASSIGNMENT RISK BY SCENARIO</div>
                    {[
                      { scenario: "5%+ OTM, 30+ DTE, American style", risk: "Very Low", color: "#22c55e", pct: 5, note: "Buyer loses money exercising early" },
                      { scenario: "Near the money, 5–10 DTE, American style", risk: "Moderate", color: "#f59e0b", pct: 45, note: "Time value nearly gone — monitor closely" },
                      { scenario: "Deep ITM, near ex-dividend date", risk: "High", color: "#ef4444", pct: 80, note: "Dividend capture makes early exercise rational" },
                      { scenario: "Any position, European style (RUT/XSP)", risk: "Zero", color: "#06b6d4", pct: 0, note: "Early assignment is contractually impossible" },
                    ].map((row, i) => (
                      <div key={i} style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 12, color: "#777" }}>{row.scenario}</span>
                          <span style={{ fontSize: 11, color: row.color, fontFamily: "monospace" }}>{row.risk}</span>
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 2, height: 3, marginBottom: 4 }}>
                          <div style={{ background: row.color, height: 3, width: `${row.pct}%`, borderRadius: 2 }} />
                        </div>
                        <div style={{ fontSize: 10, color: "#444" }}>{row.note}</div>
                      </div>
                    ))}
                  </div>
                </FadeSection>
              )}

              {/* Delta probability table */}
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

              {/* CTA */}
              {section.cta && (
                <div style={{ marginTop: 44 }}>
                  <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 18 }}>Where would you like to go next?</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {NEXT_MODULES.map(mod => (
                      <button key={mod.id} onClick={() => setSelectedNext(mod.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderRadius: 10, cursor: "pointer", background: selectedNext === mod.id ? "rgba(6,182,212,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${selectedNext === mod.id ? "rgba(6,182,212,0.35)" : "rgba(255,255,255,0.06)"}`, textAlign: "left", fontFamily: "inherit", transition: "all 0.18s" }}>
                        <div>
                          <div style={{ fontSize: 9, color: selectedNext === mod.id ? "#06b6d4" : "#444", letterSpacing: 2, marginBottom: 4 }}>{mod.label}</div>
                          <div style={{ fontSize: 15, color: selectedNext === mod.id ? "#f0ede8" : "#888" }}>{mod.title}</div>
                          <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>{mod.desc}</div>
                        </div>
                        <span style={{ fontSize: 18, color: selectedNext === mod.id ? "#06b6d4" : "#333" }}>→</span>
                      </button>
                    ))}
                  </div>
                  {selectedNext && (
                    <button style={{ width: "100%", marginTop: 14, padding: "15px", background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: 10, color: "#06b6d4", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                      Continue →
                    </button>
                  )}
                </div>
              )}
            </div>
          </FadeSection>
        ))}
      </div>

      {/* Side progress */}
      <div style={{ position: "fixed", left: "max(16px, calc(50% - 380px))", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 6, opacity: 0.3 }}>
        {SECTIONS.map((s, i) => (
          <div key={s.id} style={{ width: 3, height: progress > (i / SECTIONS.length) * 100 ? 18 : 7, background: "#06b6d4", borderRadius: 2, transition: "height 0.3s ease", opacity: progress > (i / SECTIONS.length) * 100 ? 1 : 0.3 }} />
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 9, color: "#222", letterSpacing: 2 }}>SPREAD THERAPY · MODULE 02</div>
        <div style={{ fontSize: 9, color: "#222" }}>Not financial advice</div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #09090d; }
        p, h1, h2, button { margin: 0; }
        button { outline: none; }
        @media (max-width: 600px) {
          div[style*="padding: 80px 32px"] { padding: 56px 20px 48px !important; }
          div[style*="padding: 0 32px 80px"] { padding: 0 20px 60px !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
