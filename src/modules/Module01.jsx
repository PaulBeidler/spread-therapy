import { useState, useEffect, useRef } from "react";

const SECTIONS = [
  {
    id: "opening",
    eyebrow: null,
    title: "Stocks",
    body: [
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
      "For an options trader, stock evaluation starts with a question most investors never ask: does this stock have a liquid options market? Tight bid/ask spreads on monthly options? Reasonable implied volatility — not so low that premiums are thin, not so high that the stock is genuinely dangerous to own?",
      "If the answer is no, the stock may be a fine investment but a poor candidate for this framework. Options income requires options liquidity. Check this first.",
      "Once liquidity is confirmed, the traditional questions matter. Does this company have a durable competitive advantage? Can it raise prices without losing customers? Is the industry growing or shrinking? Are the people running it competent and aligned with shareholders?",
      "Then valuation. Even a great business can be a terrible investment at the wrong price. A stock trading at 50 times earnings requires extraordinary growth to justify that multiple. A stock trading at 15 times earnings with solid fundamentals has a much more forgiving entry point.",
      "MU is a semiconductor company in a cyclical industry with real competitive advantages in memory technology. RTX is a defense contractor with long-duration government contracts. Both have liquid options markets, reasonable implied volatility, and businesses worth holding through market cycles. These are the stocks in this portfolio. Your stocks will be different — but the evaluation criteria are the same.",
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
    title: "Conviction Makes Patience Possible",
    body: [
      "The real secret to entry timing is not a technical indicator or a market signal. It is conviction about the business you are buying.",
      "If you genuinely believe in the long-term demand for memory semiconductors, every red day for MU looks like a better entry point — not a reason to panic. If you are buying purely because you think the price will go up next month, every red day feels like a reason to sell. Timing discipline is a byproduct of stock selection quality.",
      "You cannot consistently time the market. Nobody can. Studies spanning decades consistently show that professional fund managers with unlimited research resources cannot reliably predict short-term market movements.",
      "What you can do is be opportunistic about entry points. There is a difference between trying to call the exact bottom — which is impossible — and being patient enough to buy during fear rather than euphoria.",
      "Practical entry discipline: buy on red days, not green ones. Buy when a sector is out of favor, not when it is leading the market. Buy when the news is bad and the stock has already fallen, not when everything looks rosy and the price reflects perfection.",
    ],
  },
  {
    id: "cost_basis",
    eyebrow: "Your Foundation Number",
    title: "Cost Basis and Why It Matters",
    body: [
      "Your cost basis is the average price you paid for your shares. It is the number that determines your taxable gain when you eventually sell — and for covered call sellers, it determines something equally important: how much room you have between your shares and your strike price.",
      "If your cost basis on MU is $121 and you sell a $140 call, you have $19 of upside before your shares get called away. That is a 15.7% gain — meaningful, and it gives you a comfortable buffer. You can sell that call without anxiety.",
      "If your cost basis were $135 and you sold the same $140 call, you only have $5 of room. A quick move to $160 means your shares get called away at $140 and you miss $20 of upside beyond your strike. The higher your cost basis, the less flexibility you have in strike selection.",
      "This is why building a position through DCA at favorable prices matters so much for covered call sellers. A low cost basis gives you enormous flexibility. You can sell calls far out of the money — giving the stock room to run — while still collecting meaningful premium.",
      "Track your cost basis carefully. Your brokerage shows it, but the number can be distorted by various adjustments. Know your true average cost.",
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
      "Two additional tax treatments worth knowing: Section 1256 contracts — which include index options like RUT and XSP — receive automatic 60/40 treatment. Sixty percent of gains are taxed at long-term rates and 40% at short-term, regardless of holding period. This blended rate is approximately 19% for the 32% bracket, making index options tax-advantaged compared to equity options. And if you trade in a Roth IRA, gains are tax-free entirely.",
      "Think carefully before selling a long-term holding to chase a short-term opportunity. The after-tax math often makes the trade look much less attractive than the gross numbers suggest.",
    ],
  },
  {
    id: "wash_sale",
    eyebrow: "A Critical Rule",
    title: "The Wash Sale Rule",
    body: [
      "The wash sale rule is one of the most commonly misunderstood tax rules in investing. Getting it wrong can cost you a significant deduction.",
      "The rule: if you sell a security at a loss and buy the same or a substantially identical security within 30 days before or after the sale, you cannot claim the loss for tax purposes. The loss is deferred — added to the cost basis of the replacement shares — until you eventually sell them.",
      "The practical trigger: you sell a stock at a loss to harvest the tax deduction, then buy it back quickly because you still like the business. The IRS says you cannot have both the tax loss and the repurchased position. You must wait 31 days before buying back.",
      "For options traders, additional complexity: buying a call option on a stock you just sold at a loss — within the 30-day window — may trigger the wash sale rule because the call gives you exposure to the same stock.",
      "The safe approach: if you sell a stock at a loss and want to stay in the trade, either wait 31 days before repurchasing or use an ETF or index to maintain market exposure during the waiting period without triggering the rule.",
      "The wash sale rule does not eliminate your loss — it defers it. But the timing of the deduction matters for tax planning purposes.",
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
      "The one risk: if the stock surges dramatically, your covered call caps your participation above the strike. If you sold a $140 call and MU runs to $180, your upside is capped at $140 per share. You still make a solid return — but not as much as a pure stock holder.",
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
      "This is not abstract. It is the difference between a covered call strategy that compounds over years and one that blows up in the first correction. The trader who sells calls on a stock they believe in will roll the call and buy more shares on the dip. The trader who sells calls on a stock they are unsure about will panic-sell the shares and eat the options loss simultaneously.",
      "Build your stock positions with the same care you bring to your options framework. They are the foundation. Options are the engine. The engine only runs as well as the foundation allows.",
      "And remember: you do not need to own the same stocks as this portfolio. You need to own stocks you understand, believe in, and would buy more of at lower prices. Apply the evaluation criteria. Find your own conviction. Then let the options framework do its work.",
    ],
    cta: true,
  },
];

const NEXT_MODULES = [
  { id: "options", label: "Module 2", title: "Options", desc: "Puts, calls, and why the contract is your most powerful tool.", recommended: true },
  { id: "together", label: "Module 4", title: "How It All Works Together", desc: "Stocks, covered calls, and spreads running simultaneously.", recommended: false },
  { id: "quiz", label: "Assessment", title: "Take the Quiz", desc: "Test your knowledge before your next trade.", recommended: false },
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

export default function Module01({ onBack, onNavigate }) {
  const progress = useReadingProgress();
  const { activeIndex, refs } = useSectionProgress();

  return (
    <div className="st-stocks" style={{ minHeight: "100vh", background: "#09090d", color: "#e8e4df", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", maxWidth: 680, margin: "0 auto" }}>

      <div role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress" style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 100, background: "rgba(255,255,255,0.04)" }}>
        <div style={{ height: "100%", background: "#22c55e", width: `${progress}%`, transition: "width 0.1s linear" }} />
      </div>

      <div style={{ position: "fixed", top: 16, left: 16, right: 16, zIndex: 99, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {onBack && (
          <button onClick={onBack} aria-label="Back to Learn Hub" style={{ background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "6px 14px", cursor: "pointer", color: "#22c55e", fontSize: 12, fontFamily: "inherit", letterSpacing: 1 }}>← Back</button>
        )}
        <div style={{ background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ fontSize: 10, color: "#22c55e", letterSpacing: 2 }}>MODULE 01</span>
        </div>
      </div>

      <div style={{ padding: "80px 32px 64px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
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
            {[["8 min read", "◷"], ["Module 1 of 7", "◎"], ["Foundation", "◈"]].map(([label, icon]) => (
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
            <div ref={el => refs.current[si] = el} style={{ padding: "48px 0", borderBottom: si < SECTIONS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>

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

              {section.id === "tax" && (
                <FadeSection delay={100}>
                  <div style={{ marginTop: 28, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ fontSize: 10, color: "#555", letterSpacing: 2 }}>CAPITAL GAINS TAX RATES (32% BRACKET)</div>
                    </div>
                    {[
                      { type: "Short-term (≤1 year)", rate: "~32%", color: "#ef4444", note: "Taxed as ordinary income" },
                      { type: "Long-term (>1 year)", rate: "15%", color: "#22c55e", note: "Preferred capital gains rate" },
                      { type: "Section 1256 — index options", rate: "~19%", color: "#c9a84c", note: "60/40 LT/ST blend — automatic" },
                      { type: "Roth IRA gains", rate: "0%", color: "#a855f7", note: "Tax-free growth — no deductible losses" },
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

              {section.cta && (
                <div style={{ marginTop: 44 }}>
                  <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 18 }}>Continue to the next module</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {NEXT_MODULES.map(mod => (
                      <button key={mod.id} onClick={() => onNavigate?.(mod.id)} aria-label={`Go to ${mod.title}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderRadius: 10, cursor: "pointer", background: mod.recommended ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${mod.recommended ? "rgba(34,197,94,0.35)" : "rgba(255,255,255,0.06)"}`, textAlign: "left", fontFamily: "inherit", transition: "all 0.18s", outline: "none", width: "100%" }}>
                        <div>
                          <div style={{ fontSize: 9, color: mod.recommended ? "#22c55e" : "#444", letterSpacing: 2, marginBottom: 4 }}>{mod.label}{mod.recommended && " · RECOMMENDED"}</div>
                          <div style={{ fontSize: 15, color: mod.recommended ? "#f0ede8" : "#888" }}>{mod.title}</div>
                          <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>{mod.desc}</div>
                        </div>
                        <span style={{ fontSize: 18, color: mod.recommended ? "#22c55e" : "#333" }}>→</span>
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "#444", marginTop: 14, fontStyle: "italic" }}>
                    Most readers continue to Module 2. If you already understand options basics, skip to Module 4 to see how stocks and options work together.
                  </p>
                </div>
              )}
            </div>
          </FadeSection>
        ))}
      </div>

      <div style={{ position: "fixed", left: "max(16px, calc(50% - 380px))", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 6, opacity: 0.3 }}>
        {SECTIONS.map((s, i) => (
          <div key={s.id} style={{ width: 3, height: i <= activeIndex ? 18 : 7, background: "#22c55e", borderRadius: 2, transition: "height 0.3s ease", opacity: i <= activeIndex ? 1 : 0.3 }} />
        ))}
      </div>

      <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 9, color: "#222", letterSpacing: 2 }}>SPREAD THERAPY · MODULE 01</div>
        <div style={{ fontSize: 9, color: "#222" }}>Not financial advice</div>
      </div>

      <style>{`
        .st-stocks * { box-sizing: border-box; }
        .st-stocks p, .st-stocks h1, .st-stocks h2, .st-stocks button { margin: 0; }
        .st-stocks button:focus-visible { outline: 2px solid #22c55e; outline-offset: 2px; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
