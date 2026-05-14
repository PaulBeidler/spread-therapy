import { useState, useEffect, useRef } from "react";

const SECTIONS = [
  {
    id: "opening",
    eyebrow: null,
    title: "Philosophy & Temperament",
    body: [
      "Most people who discover options trading ask the wrong question first. They ask: will this make me more money?",
      "That question has an honest answer. The honest answer is: sometimes yes, sometimes no, and often it depends on things you cannot control.",
      "The better question is: what do you actually want from your money? Not in the abstract. Not in theory. Right now, given your life, your age, your obligations, your fears — what do you want?",
      "Options do not give you a better answer to the wrong question. They give you tools to pursue the right answer to the right one.",
    ],
  },
  {
    id: "buyhold",
    eyebrow: "The Case Against Complexity",
    title: "Buy and Hold Is Not Wrong",
    body: [
      "Let us be clear about something most options educators will not say: buying and holding a diversified portfolio, patiently, through corrections and crashes, is a perfectly good strategy. For many people it is the right strategy.",
      "Markets go up over time. Those who are patient, who dollar-cost average through sell-offs, who resist the urge to react — they tend to do well. This is not a myth. It is one of the most robust findings in the history of finance.",
      "If someone told you to put your money in a broad index fund and check back in thirty years, that is not bad advice. It is, for a certain kind of person in a certain kind of situation, excellent advice.",
      "We are not here to argue against that. We are here to argue that you are a person, not a strategy. And what happened next proves why that distinction matters.",
    ],
  },
  {
    id: "mu_story",
    eyebrow: "The First Campaign",
    title: "MU — Patience, Then Options",
    body: [
      "The MU campaign began the way Module 1 says it should: with patience. Shares were purchased a few at a time through dollar-cost averaging. Twelve shares here. Eighteen there. Forty on a red day when the semiconductor sector was out of favor. Over months, the position grew until there were enough shares to write covered calls.",
      "The average cost basis settled at $121. The entry was deliberate, disciplined, and driven by genuine conviction about the long-term demand for memory technology. Options were added on top of a position that already existed at a price the investor had chosen.",
      "Then MU surged. The covered calls — which had been generating steady income — were suddenly in danger of being breached. The stock was running past the strikes.",
      "This is the moment most covered call sellers panic. They let the shares get called away, take the profit, and start over. Or they freeze and watch the position move against them.",
      "Instead, the calls were rolled. Up and out — to higher strikes, further expirations. It cost premium to roll. It felt uncomfortable. But it preserved the position. The shares stayed in the portfolio as MU climbed from $121 toward $787.",
      "Forty-seven option legs. Rolls, expirations, adjustments. The total campaign P&L — including stock appreciation and all premiums collected — exceeded $55,000. Your brokerage never shows you that number. It shows you the stock price and a column of individual trade confirmations. You have to add it yourself.",
    ],
  },
  {
    id: "cat_story",
    eyebrow: "The Second Campaign",
    title: "CAT — The Wheel Gone Wrong",
    pullquote: "Made $577 in options income. Lost $16,523 I never knew I was losing. The strategy worked exactly as designed.",
    body: [
      "The CAT campaign began the way the internet says it should: with a cash-secured put. The wheel strategy. Sell a put on a stock you would be happy to own. If it stays above the strike, keep the premium. If it falls below, get assigned and start selling calls.",
      "The put was assigned at an unfavorable strike — not a price chosen through conviction and patience, but a price set by the options market, by implied volatility and time decay and the mechanics of a contract. From day one, the position was at a cost basis that conviction did not support.",
      "Then CAT surged. From $740 to $911. And every covered call sold against those wheel-assigned shares capped the move.",
      "Here is what that actually felt like: every morning, you open the account. CAT is at $820. Your calls cap you at $770. The stock is up another $8 overnight. Your P&L is flat. The next morning, $835. Your cap is still $770. You have owned this stock through a $95 move and captured none of it. You did everything right. You sold the puts. You took assignment. You sold the calls. The wheel turned. And the result was worse — substantially worse — than doing nothing.",
      "Total options income from the entire CAT campaign: $577.",
      "Opportunity cost from capped upside on a stock that ran 23%: $16,523.",
      "The wheel worked mechanically. Every step executed as designed. Puts were sold, shares were assigned, calls were written. The strategy did exactly what it was supposed to do. And it was the wrong strategy for a stock with that much momentum, entered at a price that conviction did not support.",
    ],
  },
  {
    id: "uncertainty",
    eyebrow: "What It Feels Like",
    title: "Uncertainty Is Not a Concept. It Is a Tuesday.",
    body: [
      "You open the account. CAT is at $835. Your calls cap you at $770. The stock is up again. Your P&L is flat. You did everything right yesterday and the day before. You are doing everything right today. And the result is the same: flat.",
      "You do not know if CAT will keep running. Nobody does. The analysts who cover it professionally disagree with each other. The market is pricing in optimism about infrastructure spending that may or may not materialize. The Fed may move. The sector may rotate. A competitor may announce something.",
      "You have a position. It has rules. You follow them. And then you close the laptop and go to work and come home and open it again the next morning and do it again.",
      "That is what uncertainty actually is. Not a philosophical condition. Not a risk factor in a prospectus. A Tuesday. And then a Wednesday. And then another Tuesday.",
      "The traders who survive this are not the ones who find a way to eliminate the uncertainty. They are the ones who build a framework robust enough to function inside it — and then follow the framework on the days when following it feels pointless.",
    ],
  },
  {
    id: "iron_condor",
    eyebrow: "The Turn",
    title: "The Trade That Built the Framework",
    body: [
      "Somewhere in the middle of the MU campaign, an insight formed: spreads were a more efficient way to leverage the volatility of an asset already owned. Instead of tying up all available capital in covered calls on one stock, defined-risk spreads could generate income from the same volatility with a fraction of the capital at risk.",
      "The insight was correct. The execution was not.",
      "The iron condor entered on MU had strikes that were too aggressive — too close to the current price, leaving insufficient buffer for a stock that moved as much as MU did. And the position size was too large. Too many contracts for the account. What would later become the 5% rule was violated before the rule existed.",
      "What was needed in that moment was an objective voice. Not a guru. Not a course. A voice saying: your delta is too high. Your width is too narrow. You are risking 12% of your account on one position. Close the excess contracts. Widen the strikes. Respect the buffer.",
      "That voice did not exist. No broker provides it. No YouTube channel provides it in real time, for your specific position, with your specific account size. No friend has both the knowledge and the willingness to say: this trade violates three rules simultaneously.",
      "Finding no coach, I built one.",
    ],
  },
  {
    id: "origin",
    eyebrow: "The Framework",
    title: "Every Rule Is Autobiographical",
    body: [
      "Spread Therapy is the framework I needed in the summer of 2024. The scoring system. The hard stops. The position-sizing rules. The management cadence. The entry criteria that would have prevented the CAT wheel from ever starting.",
      "The 5% OTM minimum exists because of the RUTW 2770/2750 trade that entered at 1.9% OTM and nearly failed. The position-sizing rule exists because of MU. The close-at-50%-profit rule exists because of trades where profits were watched evaporating over days that should have been closed in hours. The hard stop on delta exists because of IONQ.",
      "The framework is not theoretical. It is not derived from a textbook. It is the accumulated scar tissue of a real portfolio, organized into rules that prevent the same mistakes from happening twice.",
      "And the question it answers is not 'will options make you more money?' It is: 'given that you have decided to use options, how do you avoid the specific mistakes that destroy accounts?'",
    ],
  },
  {
    id: "dealer",
    eyebrow: "Capital Efficiency",
    title: "Think Like a Dealer, Not a Buyer",
    pullquote: "The same capital that lets you buy one car to use could let you purchase ten cars to sell to others. Now you are a dealer.",
    body: [
      "Spreads are the right tool. But why?",
      "Suppose you want to buy a car. You leverage the capital you have to qualify for a loan. The vehicle adds value to your life — it gets you to work, it drives your children to school. You have deployed capital into one asset. You hope it appreciates. The capital is committed.",
      "Now imagine a different scenario. You do not plan to use the vehicle. You plan to sell it. You lock in a purchase price and you have already locked in a sale. You are risking less capital per transaction, which allows you to scale. The same capital that would let you buy one vehicle to drive could let you purchase ten vehicles to sell to others.",
      "Now you are a dealer. You are not in the transportation business. You are in the transaction business.",
      "Credit spreads work the same way. Instead of tying up $50,000 in collateral to sell one naked put — buying one car to drive — you tie up $1,000 per spread and run fifty positions. More transactions. More business. More opportunities for your edge to compound.",
    ],
  },
  {
    id: "efficiency_tradeoff",
    eyebrow: "The Honest Tradeoff",
    title: "Efficiency Is Not Free",
    body: [
      "Transacting more business is not automatically better. It will not necessarily make you richer. Trading spreads does not mean being right no longer matters. It is still better to be right.",
      "But there are structural advantages to capital efficiency.",
      "Diversification: credit spreads tie up less capital than naked puts. Instead of selling one put on one stock, you can sell spreads on four different underlyings with the same collateral. One bad earnings report does not destroy your month.",
      "Concentration when you have conviction: you can also sell four spreads on the same underlying. If you believe the Russell 2000 is not going to fall 5% in the next 30 days, you can express that belief four times instead of once.",
      "The honest tradeoff: if you are right, efficiency makes you richer faster. If you are wrong, efficiency makes you poorer faster. Spreads do not eliminate the need to be right. They amplify the consequences — in both directions.",
      "So the question becomes: do you have a framework that helps you be right more often than you are wrong? If yes, capital efficiency is your greatest advantage. If no, it is a loaded weapon pointed at your account.",
      "That is why the framework comes first. Not the trades. The framework.",
    ],
  },
  {
    id: "closing",
    eyebrow: null,
    title: "You Have Everything You Need",
    body: [
      "Seven modules. A philosophy built on real trades — some that worked brilliantly, some that failed instructively. A framework that exists because no one else was going to build it for you.",
      "You understand stocks as a foundation. Options as tools. Spreads as capital efficiency. The Greeks as a dashboard. Position sizing as survival. And now the why behind all of it.",
      "What remains is practice. Paper trade until the rules feel automatic. Take the assessment to find your gaps. Then — when the checklist is complete, when the knowledge is internalized, when you trust the process because you understand it — deploy real capital.",
      "Not with hope. With preparation. Not with excitement. With discipline. Not because options will make you rich. Because you have built something most traders never build: a system that tells you what to do, when to do it, and when to stop.",
      "The market will be open tomorrow. You are ready for it.",
    ],
    cta: true,
  },
];

const NEXT_MODULES = [
  { id: "getting-started", label: "Before You Begin", title: "Getting Started", desc: "The checklist, account setup, and everything before your first trade.", recommended: true },
  { id: "stocks", label: "Module 1", title: "Stocks", desc: "Begin the technical journey — what to own and why it matters.", recommended: false },
  { id: "quiz", label: "Assessment", title: "Take the Quiz", desc: "Find your knowledge gaps before your first real trade.", recommended: false },
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
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Module07({ onBack, onNavigate }) {
  const progress = useReadingProgress();
  const { activeIndex, refs } = useSectionProgress();

  return (
    <div className="st-philosophy" style={{ minHeight: "100vh", background: "#09090d", color: "#e8e4df", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", maxWidth: 680, margin: "0 auto", position: "relative" }}>

      <div role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress" style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 100, background: "rgba(255,255,255,0.04)" }}>
        <div style={{ height: "100%", background: "#c9a84c", width: `${progress}%`, transition: "width 0.1s linear" }} />
      </div>

      <div style={{ position: "fixed", top: 16, left: 16, right: 16, zIndex: 99, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {onBack && (
          <button onClick={onBack} aria-label="Back to Learn Hub" style={{ background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "6px 14px", cursor: "pointer", color: "#c9a84c", fontSize: 12, fontFamily: "inherit", letterSpacing: 1 }}>← Back</button>
        )}
        <div style={{ background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a84c" }} />
          <span style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 2 }}>MODULE 07</span>
        </div>
      </div>

      <div style={{ padding: "80px 32px 64px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <FadeSection>
          <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>Spread Therapy · Philosophy</div>
        </FadeSection>
        <FadeSection delay={100}>
          <h1 style={{ fontSize: "clamp(36px, 8vw, 56px)", fontWeight: "normal", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24, color: "#f5f1eb" }}>Philosophy &<br />Temperament</h1>
        </FadeSection>
        <FadeSection delay={200}>
          <p style={{ fontSize: 18, color: "#777", lineHeight: 1.7, fontStyle: "italic", maxWidth: 480, borderLeft: "2px solid rgba(201,168,76,0.3)", paddingLeft: 20 }}>
            Not because options always make more money. Because they give every person — regardless of situation — the tools to pursue their own strategy.
          </p>
        </FadeSection>
        <FadeSection delay={300}>
          <div style={{ display: "flex", gap: 20, marginTop: 32, flexWrap: "wrap" }}>
            {[["7 min read", "◷"], ["Module 7 of 7", "◎"], ["Philosophy", "◈"]].map(([label, icon]) => (
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
          <FadeSection key={section.id} delay={si * 50}>
            <div ref={el => refs.current[si] = el} style={{ padding: "52px 0", borderBottom: si < SECTIONS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>

              {section.eyebrow && (
                <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>{section.eyebrow}</div>
              )}

              {section.title !== "Philosophy & Temperament" && (
                <h2 style={{ fontSize: "clamp(22px, 5vw, 30px)", fontWeight: "normal", lineHeight: 1.2, letterSpacing: "-0.01em", color: "#f0ede8", marginBottom: 28 }}>{section.title}</h2>
              )}

              {section.pullquote && (
                <div style={{ margin: "0 0 32px", padding: "20px 24px", background: "rgba(201,168,76,0.05)", borderLeft: "3px solid #c9a84c", borderRadius: "0 8px 8px 0" }}>
                  <p style={{ fontSize: 18, color: "#c9a84c", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>"{section.pullquote}"</p>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {section.body.map((para, pi) => (
                  <p key={pi} style={{ fontSize: 16, lineHeight: 1.9, color: pi === 0 ? "#c8c4be" : "#888", margin: 0 }}>{para}</p>
                ))}
              </div>

              {section.id === "cat_story" && (
                <FadeSection delay={100}>
                  <div style={{ marginTop: 28, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 10, color: "#ef4444", letterSpacing: 2, marginBottom: 14 }}>THE CAT CAMPAIGN — FINAL LEDGER</div>
                    {[
                      { label: "Options income collected", value: "+$577", color: "#22c55e" },
                      { label: "CAT appreciation (uncapped)", value: "+$17,100", color: "#888", note: "$740 → $911 on 100 shares" },
                      { label: "CAT appreciation (captured)", value: "+$0", color: "#888", note: "Calls capped every dollar of the move" },
                      { label: "Opportunity cost", value: "-$16,523", color: "#ef4444" },
                      { label: "Net vs doing nothing", value: "-$15,946", color: "#ef4444" },
                    ].map((row, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                        <div>
                          <div style={{ fontSize: 12, color: "#777" }}>{row.label}</div>
                          {row.note && <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>{row.note}</div>}
                        </div>
                        <span style={{ fontSize: 14, color: row.color, fontFamily: "monospace", flexShrink: 0, marginLeft: 16 }}>{row.value}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 11, color: "#444", fontStyle: "italic", lineHeight: 1.6 }}>
                      The strategy worked exactly as designed. That was the problem.
                    </div>
                  </div>
                </FadeSection>
              )}

              {section.cta && (
                <div style={{ marginTop: 48 }}>
                  <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>Where would you like to go next?</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {NEXT_MODULES.map(mod => (
                      <button
                        key={mod.id}
                        onClick={() => onNavigate?.(mod.id)}
                        aria-label={`Go to ${mod.title}`}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderRadius: 10, cursor: "pointer", background: mod.recommended ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${mod.recommended ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.06)"}`, textAlign: "left", fontFamily: "inherit", transition: "all 0.18s", outline: "none", width: "100%" }}
                      >
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
                    You have completed all seven modules. Return to Getting Started to work through the setup checklist, or take the assessment to find your knowledge gaps.
                  </p>
                </div>
              )}
            </div>
          </FadeSection>
        ))}
      </div>

      <div style={{ position: "fixed", left: "max(16px, calc(50% - 380px))", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 6, opacity: 0.3 }}>
        {SECTIONS.map((s, i) => (
          <div key={s.id} style={{ width: 3, height: i <= activeIndex ? 20 : 8, background: "#c9a84c", borderRadius: 2, transition: "height 0.3s ease", opacity: i <= activeIndex ? 1 : 0.3 }} />
        ))}
      </div>

      <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 9, color: "#222", letterSpacing: 2 }}>SPREAD THERAPY · MODULE 07</div>
        <div style={{ fontSize: 9, color: "#222" }}>Not financial advice</div>
      </div>

      <style>{`
        .st-philosophy * { box-sizing: border-box; }
        .st-philosophy p, .st-philosophy h1, .st-philosophy h2, .st-philosophy button { margin: 0; }
        .st-philosophy button:focus-visible { outline: 2px solid #c9a84c; outline-offset: 2px; }
        html { scroll-behavior: smooth; }
        @media (max-width: 600px) {
          .st-philosophy { padding-left: 0 !important; padding-right: 0 !important; }
        }
      `}</style>
    </div>
  );
}
