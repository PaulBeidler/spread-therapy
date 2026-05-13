import { useState, useEffect, useRef } from "react";

const SECTIONS = [
  {
    id: "opening",
    eyebrow: null,
    title: "Stocks",
    subtitle: "What you own, why it matters, and how to think about it before options enter the picture.",
    body: [
      "Before spreads. Before covered calls. Before Greeks. There is the question of what you own and why.",
      "Options trading built on top of a weak stock foundation is like installing a sophisticated alarm system in a house with no walls. The mechanics might work perfectly, and nothing will be protected.",
      "This module covers the stock side — how to evaluate what to own, how to build a position over time, and what the tax rules say about selling. These are not options concepts. They are the foundation that options sit on top of.",
    ],
  },
  {
    id: "what_you_own",
    eyebrow: "The Basics",
    title: "What a Share Actually Is",
    body: [
      "When you buy a share of stock, you own a fractional interest in a business. Not a number on a screen. Not a ticker symbol. A piece of a company with real assets, real employees, real customers, and real earnings.",
      "This sounds obvious. It is not obvious to most people who trade stocks. Most retail traders treat shares like chips in a casino — things to buy when they expect the price to go up and sell when they expect it to go down.",
      "Long-term investing is different. You buy a share because you believe the business will be worth more in the future than it is today. You hold it through volatility because you understand that short-term price movements are noise around a long-term signal.",
      "The distinction matters for options trading specifically. The Spread Therapy framework sells covered calls on MU and RTX because there is a genuine long-term conviction about those businesses — not just a short-term price opinion. That conviction is what allows you to hold through a stock trading against you while the options work in your favor.",
    ],
  },
  {
    id: "evaluation",
    eyebrow: "Choosing What to Own",
    title: "How to Evaluate a Stock",
    body: [
      "Stock evaluation is a vast field with entire careers built around it. This module offers a practical framework for the kind of evaluation relevant to options traders — specifically, how to think about stocks you might want to own long-term and sell covered calls against.",
      "The first question is the business itself. Does this company have a durable competitive advantage? Can it raise prices without losing customers? Is the industry growing or shrinking? Are the people running it competent and aligned with shareholders?",
      "The second question is valuation. Even a great business can be a terrible investment at the wrong price. A stock trading at 50 times earnings requires extraordinary growth to justify that multiple. A stock trading at 15 times earnings with solid fundamentals has a much more forgiving entry point.",
      "The third question is for options traders specifically: does this stock have liquid options? Tight bid/ask spreads on monthly options? Reasonable implied volatility — not so low that premiums are thin, not so high that the stock is genuinely dangerous to own?",
      "MU is a semiconductor company in a cyclical industry with real competitive advantages in memory technology. RTX is a defense contractor with long-duration government contracts. Both have liquid options markets, reasonable implied volatility, and businesses worth holding through market cycles.",
    ],
  },
  {
    id: "dca",
    eyebrow: "Building a Position",
    title: "Dollar-Cost Averaging",
    pullquote: "DCA does not guarantee a profit. It guarantees that you will not buy everything at the worst possible price.",
    body: [
      "Dollar-cost averaging is the practice of buying a fixed dollar amount of a stock at regular intervals, regardless of price. When the stock is expensive, you buy fewer shares. When it is cheap, you buy more.",
      "The MU position in this portfolio was built exactly this way. Twelve shares in July 2024 at $133. Eighteen shares at $132. Forty shares at $121. One share at $101. Eleven shares at $97. Over time, the average cost settled at $121 per share — not the high, not the low, but a reasonable average across different market conditions.",
      "DCA is not an optimization strategy. You will not buy at the exact bottom. You will not avoid every overpayment. What you will do is avoid the single worst outcome — deploying your entire intended position at a peak before a significant decline.",
      "For covered call sellers, DCA has an additional advantage: you are continuously adding to the position that generates covered call income. More shares means more contracts you can sell. The income engine grows with the position.",
      "The practical cadence: decide how much you want to own in total. Divide it into four to six tranches. Buy one tranche when conditions feel right — stock down on a red day, market in a correction, sector under pressure. Buy the next tranche a few weeks or months later. Repeat until the full position is built.",
    ],
  },
  {
    id: "timing",
    eyebrow: "When to Buy",
    title: "Market Timing Is Not What You Think",
    body: [
      "You cannot consistently time the market. Nobody can. Studies spanning decades consistently show that professional fund managers with unlimited research resources cannot reliably predict short-term market movements.",
      "What you can do is be opportunistic about entry points. There is a difference between trying to call the exact bottom — which is impossible — and being patient enough to buy during fear rather than euphoria.",
      "Practical entry discipline: buy on red days, not green ones. Buy when a sector is out of favor, not when it is leading the market. Buy when the news is bad and the stock has already fallen, not when everything looks rosy and the price reflects perfection.",
      "MU is a semiconductor stock. Semiconductors are cyclical — they go through boom and bust cycles as supply and demand for chips oscillates. The best time to buy MU is when the cycle is in a downturn and analysts are writing negative reports. That is when the stock is cheap. That is when the long-term entry is favorable.",
      "This patience is easier to maintain if you genuinely believe in the business. If you are buying MU purely because you think the price will go up next month, every red day feels like a reason to sell. If you are buying because you believe in the long-term demand for memory semiconductors, every red day looks like a better entry point.",
    ],
  },
  {
    id: "cost_basis",
    eyebrow: "Your Foundation Number",
    title: "Cost Basis and Why It Matters",
    body: [
      "Your cost basis is the average price you paid for your shares, including all commissions. It is the number that determines your taxable gain when you eventually sell.",
      "For covered call sellers, cost basis matters for a second reason: it determines how much upside you have before a covered call creates a problem. If your cost basis on MU is $121 and you sell a $1,000 call, you have enormous room — the stock would need to run 726% before your shares get called away at a loss relative to current value.",
      "If your cost basis were $800 and you sold the same $1,000 call, the picture is different. The stock running to $1,000 means your shares get called away at a $200 gain — fine, but much less dramatic than the gain available to someone who bought at $121.",
      "This is why building a position through DCA at favorable prices matters so much for covered call sellers. Your low cost basis gives you enormous flexibility in selecting strikes. You can sell calls far out of the money — giving the stock room to run — while still collecting meaningful premium.",
      "Track your cost basis carefully. Your brokerage shows it, but the number can be distorted by various adjustments. Knowing your true average cost, including all purchases and adjustments, tells you the real story of your position.",
    ],
  },
  {
    id: "tax",
    eyebrow: "The Tax Rules",
    title: "What You Need to Know Before You Sell",
    pullquote: "Holding period determines whether your gain is taxed at long-term or short-term rates. The difference can be substantial.",
    body: [
      "When you sell a stock for more than you paid, you owe taxes on the gain. The rate depends on how long you held the stock.",
      "Short-term capital gains apply to stocks held for one year or less. They are taxed as ordinary income — the same rate as your salary. Depending on your tax bracket, this can be 22%, 24%, 32%, or higher.",
      "Long-term capital gains apply to stocks held for more than one year. The rates are 0%, 15%, or 20% depending on your income. For most investors in the 32% ordinary income bracket, the difference between long-term and short-term rates is roughly 12-17 percentage points on every dollar of gain.",
      "For a stock that has appreciated significantly — MU from $121 to $787, an unrealized gain of $66,600 — the tax impact of selling prematurely is enormous. The difference between long-term and short-term treatment on a $66,600 gain at a 15% vs 32% rate is over $11,000.",
      "The practical implication: think carefully before selling a long-term holding to chase a short-term opportunity. The after-tax math often makes the trade look much less attractive.",
    ],
  },
  {
    id: "wash_sale",
    eyebrow: "A Critical Rule",
    title: "The Wash Sale Rule",
    body: [
      "The wash sale rule is one of the most commonly misunderstood tax rules in investing. Getting it wrong can cost you a significant deduction.",
      "The rule: if you sell a security at a loss and buy the same or a substantially identical security within 30 days before or after the sale, you cannot claim the loss for tax purposes. The loss is deferred — added to the cost basis of the replacement shares — until you eventually sell the replacement.",
      "The practical trigger: you sell a stock at a loss to harvest the tax deduction, then buy it back quickly because you still like the business. The IRS says you cannot have both the tax loss and the repurchased position. You must wait 31 days before buying back.",
      "For options traders, the wash sale rule has additional complexity. Buying a call option on a stock you just sold at a loss — within the 30-day window — may trigger the wash sale rule because the call gives you exposure to the same stock. The IRS considers this a substantially identical security in some circumstances.",
      "The safe approach: if you sell a stock at a loss and want to stay in the trade, either wait 31 days before repurchasing or use an ETF or index to maintain market exposure during the waiting period without triggering the rule.",
      "The wash sale rule does not eliminate your loss — it defers it. The deferred loss adds to the cost basis of your replacement shares, reducing the taxable gain when you eventually sell them. But the timing of the deduction matters for tax planning purposes.",
    ],
  },
  {
    id: "stocks_options",
    eyebrow: "Connecting to Options",
    title: "What Your Stock Position Means for Options",
    body: [
      "Once you own shares, options become tools for managing that position — not separate bets on top of it.",
      "Covered calls reduce your cost basis over time. Every premium collected lowers the effective price you paid for the shares. After the MU campaign, the effective cost basis on those shares — after accounting for all premiums collected — is significantly below the nominal $121 average purchase price.",
      "This cost basis reduction is one of the most powerful arguments for systematic covered call selling. You are not giving up upside for premium. You are collecting income that reduces your break-even and improves your overall return in every scenario except a large, rapid stock appreciation.",
      "The one risk: if the stock surges dramatically, your covered call caps your participation above the strike. The MU $1,000 call means that if MU goes to $1,200 before October, your upside is capped at $1,000 per share. You still make an extraordinary return — but not as much as a pure stock holder.",
      "This is the covered call tradeoff: regular income and reduced cost basis in exchange for capped upside on dramatic moves. For most long-term holders, it is a favorable tradeoff most of the time. The key is selling strikes far enough out of the money that the cap feels comfortable given your outlook.",
    ],
  },
  {
    id: "closing",
    eyebrow: null,
    title: "Own What You Understand",
    body: [
      "The single best piece of stock advice that applies to options traders: only own stocks you understand well enough to buy more of when they fall.",
      "If a stock drops 20% and your instinct is to sell, you did not have the conviction to own it in the first place. Selling covered calls on a stock you would sell during a pullback is dangerous — you are generating options income while hoping the stock does not test your conviction.",
      "The stocks in this portfolio — MU, RTX, PLTR, TSLL — are held because of a genuine view on the underlying business. The covered calls are written against that genuine long-term conviction. When MU fell from its highs, the response was to roll the call, not to sell the shares.",
      "Build your stock positions with the same care you bring to your options framework. They are the foundation. Options are the engine. The engine only runs as well as the foundation allows.",
    ],
    cta: true,
  },
];

const NEXT_MODULES = [
  { id: "options", label: "Module 2", title: "Options", desc: "Puts, calls, and why the contract is your most powerful tool." },
  { id: "together", label: "Module 4", title: "How It All Works Together", desc: "Stocks, covered calls, and spreads running simultaneously." },
  { id: "quiz", label: "Assessment", title: "Take the Quiz", desc: "Test your knowledge before your next trade." },
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
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function SpreadTherapyStocks({ onBack }) {
  const progress = useReadingProgress();
  const [selectedNext, setSelectedNext] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#09090d", color: "#e8e4df", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", maxWidth: 680, margin: "0 auto" }}>

      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 100, background: "rgba(255,255,255,0.04)" }}>
        <div style={{ height: "100%", background: "#22c55e", width: `${progress}%`, transition: "width 0.1s linear" }} />
      </div>

      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 99, background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
        <span style={{ fontSize: 10, color: "#22c55e", letterSpacing: 2 }}>MODULE 01</span>
      </div>

      {onBack && (
        <div style={{ padding: "16px 32px 0", position: "sticky", top: 0, zIndex: 50, background: "rgba(9,9,13,0.95)", backdropFilter: "blur(12px)" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#22c55e", fontSize: 14, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1 }}>← Back to Learn Hub</button>
        </div>
      )}

      <div style={{ padding: "60px 32px 64px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <FadeSection>
          <div style={{ fontSize: 10, color: "#22c55e", letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>Spread Therapy · Stocks</div>
        </FadeSection>
        <FadeSection delay={100}>
          <h1 style={{ fontSize: "clamp(36px, 8vw, 56px)", fontWeight: "normal", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24, color: "#f5f1eb" }}>Stocks</h1>
        </FadeSection>
        <FadeSection delay={200}>
          <p style={{ fontSize: 18, color: "#777", lineHeight: 1.7, fontStyle: "italic", maxWidth: 480, borderLeft: "2px solid rgba(34,197,94,0.3)", paddingLeft: 20 }}>
            What you own, why it matters, and how to build a position before options enter the picture.
          </p>
        </FadeSection>
        <FadeSection delay={300}>
          <div style={{ display: "flex", gap: 20, marginTop: 32, flexWrap: "wrap" }}>
            {[["8 min read","◷"],["Module 1 of 7","◎"],["Foundation","◈"]].map(([label,icon])=>(
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: "#444" }}>{icon}</span>
                <span style={{ fontSize: 11, color: "#444", letterSpacing: 1 }}>{label}</span>
              </div>
            ))}
          </div>
        </FadeSection>
      </div>

      <div style={{ padding: "0 32px 80px" }}>
        {SECTIONS.map((section, si) => (
          <FadeSection key={section.id} delay={si * 40}>
            <div style={{ padding: "48px 0", borderBottom: si < SECTIONS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>

              {section.eyebrow && (
                <div style={{ fontSize: 10, color: "#22c55e", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>{section.eyebrow}</div>
              )}

              {section.title !== "Stocks" && (
                <h2 style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: "normal", lineHeight: 1.2, letterSpacing: "-0.01em", color: "#f0ede8", marginBottom: 24 }}>{section.title}</h2>
              )}

              {section.pullquote && (
                <div style={{ margin: "0 0 28px", padding: "18px 22px", background: "rgba(34,197,94,0.05)", borderLeft: "3px solid #22c55e", borderRadius: "0 8px 8px 0" }}>
                  <p style={{ fontSize: 17, color: "#22c55e", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>"{section.pullquote}"</p>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {section.body.map((para, pi) => (
                  <p key={pi} style={{ fontSize: 16, lineHeight: 1.85, color: pi === 0 ? "#c8c4be" : "#888", margin: 0 }}>{para}</p>
                ))}
              </div>

              {/* Tax rate comparison */}
              {section.id === "tax" && (
                <FadeSection delay={100}>
                  <div style={{ marginTop: 28, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ fontSize: 10, color: "#555", letterSpacing: 2 }}>CAPITAL GAINS TAX RATES (32% BRACKET)</div>
                    </div>
                    {[
                      { type: "Short-term (≤1 year)", rate: "~32%", color: "#ef4444", note: "Taxed as ordinary income" },
                      { type: "Long-term (>1 year)", rate: "15%", color: "#22c55e", note: "Preferred capital gains rate" },
                      { type: "Index options (1256)", rate: "~19%", color: "#c9a84c", note: "60/40 LT/ST blend — automatic" },
                      { type: "Roth IRA gains", rate: "0%", color: "#a855f7", note: "Tax-free growth forever" },
                    ].map((row, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <div>
                          <div style={{ fontSize: 12, color: "#ccc" }}>{row.type}</div>
                          <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>{row.note}</div>
                        </div>
                        <div style={{ fontSize: 20, fontFamily: "monospace", color: row.color }}>{row.rate}</div>
                      </div>
                    ))}
                  </div>
                </FadeSection>
              )}

              {/* Wash sale summary */}
              {section.id === "wash_sale" && (
                <FadeSection delay={100}>
                  <div style={{ marginTop: 28, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 10, color: "#ef4444", letterSpacing: 2, marginBottom: 14 }}>WASH SALE RULE — KEY FACTS</div>
                    {[
                      "Sell at a loss and buy the same stock within 30 days → loss is disallowed",
                      "The 30-day window runs both before AND after the sale",
                      "Buying a call option on the same stock may also trigger the rule",
                      "The loss is deferred, not eliminated — it adds to your cost basis",
                      "Safe move: wait 31 days, or hold an ETF in the meantime",
                    ].map((fact, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <span style={{ color: "#ef4444", fontSize: 10, flexShrink: 0, marginTop: 3 }}>◆</span>
                        <span style={{ fontSize: 12, color: "#777", lineHeight: 1.5 }}>{fact}</span>
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
                      <button key={mod.id} onClick={() => setSelectedNext(mod.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderRadius: 10, cursor: "pointer", background: selectedNext === mod.id ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${selectedNext === mod.id ? "rgba(34,197,94,0.35)" : "rgba(255,255,255,0.06)"}`, textAlign: "left", fontFamily: "inherit", transition: "all 0.18s" }}>
                        <div>
                          <div style={{ fontSize: 9, color: selectedNext === mod.id ? "#22c55e" : "#444", letterSpacing: 2, marginBottom: 4 }}>{mod.label}</div>
                          <div style={{ fontSize: 15, color: selectedNext === mod.id ? "#f0ede8" : "#888" }}>{mod.title}</div>
                          <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>{mod.desc}</div>
                        </div>
                        <span style={{ fontSize: 18, color: selectedNext === mod.id ? "#22c55e" : "#333" }}>→</span>
                      </button>
                    ))}
                  </div>
                  {selectedNext && (
                    <button style={{ width: "100%", marginTop: 14, padding: "15px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, color: "#22c55e", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Continue →</button>
                  )}
                </div>
              )}
            </div>
          </FadeSection>
        ))}
      </div>

      <div style={{ position: "fixed", left: "max(16px, calc(50% - 380px))", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 6, opacity: 0.3 }}>
        {SECTIONS.map((s, i) => (
          <div key={s.id} style={{ width: 3, height: progress > (i / SECTIONS.length) * 100 ? 18 : 7, background: "#22c55e", borderRadius: 2, transition: "height 0.3s ease", opacity: progress > (i / SECTIONS.length) * 100 ? 1 : 0.3 }} />
        ))}
      </div>

      <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 9, color: "#222", letterSpacing: 2 }}>SPREAD THERAPY · MODULE 01</div>
        <div style={{ fontSize: 9, color: "#222" }}>Not financial advice</div>
      </div>

      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } html { scroll-behavior: smooth; } body { background: #09090d; } p, h1, h2, button { margin: 0; } button { outline: none; } @media (max-width: 600px) { div[style*="padding: 60px 32px"] { padding: 40px 20px 48px !important; } div[style*="padding: 0 32px 80px"] { padding: 0 20px 60px !important; } }`}</style>
    </div>
  );
}
