import { useState, useEffect, useRef } from "react";

// ── CONTENT ───────────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "opening",
    eyebrow: null,
    title: "Why Options?",
    subtitle: "A different question deserves a different answer.",
    body: [
      "Most people who discover options trading ask the wrong question first. They ask: will this make me more money?",
      "That question has an honest answer, and the honest answer is: sometimes yes, sometimes no, and often it depends on things you cannot control.",
      "But there is a better question. And it leads somewhere more interesting.",
      "The better question is: what do you actually want from your money? Not in the abstract. Not in theory. Right now, given your life, your age, your obligations, your fears — what do you want?",
      "Options do not give you a better answer to the wrong question. They give you tools to pursue the right answer to the right one.",
    ],
  },
  {
    id: "buyhold",
    eyebrow: "The Case Against Complexity",
    title: "Buy and Hold Is Not Wrong",
    body: [
      "Let's be honest about something that most options educators will not say: buying and holding a diversified portfolio, patiently, through corrections and crashes, is a perfectly good strategy. For many people it is the right strategy.",
      "Markets go up over time. Those who are patient, who dollar-cost average through sell-offs, who resist the urge to react — they tend to do well. This is not a myth. It is one of the most robust findings in the history of finance.",
      "If someone told you to put your money in a broad index fund and check back in thirty years, that is not bad advice. It is, for a certain kind of person in a certain kind of situation, excellent advice.",
      "We are not here to argue against that. We are here to argue that you are a person, not a strategy.",
    ],
  },
  {
    id: "mu_cat",
    eyebrow: "Two Stories",
    title: "The MU Story and the CAT Story",
    pullquote: "Made $577. Lost $16,523 I never knew I was losing.",
    body: [
      "Consider two real campaigns from the same portfolio, running at roughly the same time.",
      "The MU campaign began in July 2024 with shares purchased at an average cost of $121. Over the following ten months, covered calls were sold systematically — forty-seven legs across rolls, expirations, spreads, and one iron condor that taught an expensive lesson. The shares are now worth $765. The options activity generated thousands in premium. The true campaign P&L, the number the brokerage never shows, is over $55,000.",
      "The CAT campaign ended differently. Cash-secured puts led to buying shares at prices higher than necessary. Covered calls capped the upside. When CAT ran from $740 to $911, the portfolio watched from the sidelines. The options activity generated $577. The opportunity cost was $16,523.",
      "Both campaigns used the same strategies. Both were reasonable at the time. In retrospect, simple buy-and-hold would have outperformed both.",
      "So why options at all?",
    ],
  },
  {
    id: "context",
    eyebrow: "The Context That Matters",
    title: "We Didn't Know",
    body: [
      "In the summer of 2024, the AI trade was real but its trajectory was genuinely uncertain. Semiconductor stocks had run hard. CAT — indirectly tied to AI infrastructure through equipment demand for new data centers — was trading at prices that reflected significant optimism. Skepticism was reasonable. Caution was defensible.",
      "Nobody knew that these stocks would continue to surge. The analysts who predicted a correction were not fools. The people who sold covered calls to generate income from positions they intended to hold long-term were not making mistakes.",
      "They were managing risk under uncertainty. That is all any of us can do.",
      "The point is not that options would have been better than buy-and-hold in these cases. In retrospect, they were not. The point is that the decision to use options was rational given what was known at the time — and that is the only standard by which any decision can be fairly judged.",
      "Buy-and-hold requires certainty that the future will be good. Options allow you to act intelligently when you are not certain.",
    ],
  },
  {
    id: "philosophy",
    eyebrow: "The Core Idea",
    title: "Managing Risk Is Not Avoiding It",
    pullquote: "Instead of either avoiding risk or accepting it blindly — we can manage it.",
    body: [
      "Most investors operate in one of two modes. Either they avoid risk — keeping money in cash, bonds, stable assets — or they accept it, buying stocks and hoping for the best. These are both legitimate choices. But they are not the only choices.",
      "Options introduce a third mode: management.",
      "To manage risk is to understand what you are actually exposed to, to decide deliberately how much of that exposure you want to carry, to collect compensation for carrying it, and to retain the ability to change your mind.",
      "When you sell a put, you are not gambling. You are saying: I am willing to buy this stock at this price if it falls to here. Someone else is paying you for that commitment. You know exactly what the worst case looks like. You have made a deliberate, bounded, compensated decision.",
      "That is fundamentally different from simply holding a stock and hoping. Both involve risk. Only one involves management.",
    ],
  },
  {
    id: "tools",
    eyebrow: "What Options Actually Provide",
    title: "Tools for Every Market",
    body: [
      "A rising market rewards patience. Options allow you to add income to patience — selling covered calls against shares you already own, collecting premium while the stock climbs.",
      "A flat market punishes patience. Options allow you to generate income from inaction — selling puts and spreads on stocks that aren't moving, harvesting premium from time and volatility.",
      "A falling market destroys passive portfolios. Options allow you to protect, hedge, and even profit — buying puts, constructing crash shields, positioning for re-entry exactly when everyone else is panicking.",
      "A volatile market creates anxiety. Options allow you to understand it — because volatility is not the enemy of options traders. It is the raw material.",
      "No single stock strategy works in all four environments. Options give you a different tool for each.",
    ],
  },
  {
    id: "people",
    eyebrow: "The Human Side of the Trade",
    title: "Two People, One Trade",
    pullquote: "Every option trade requires someone on the other side. That person is not your enemy.",
    body: [
      "Here is something the financial media never explains clearly: every options trade is a transaction between two people with different needs.",
      "When you sell a put on a stock you want to own at a lower price, someone else is buying that put. That person may think the stock is going to fall. Or they may own the stock and want downside protection. Or they may be a fund manager managing regulatory requirements you will never fully understand.",
      "They are not wrong and you are not right. You have different situations, different timelines, different needs. The CBOE exists precisely to connect people like you with people like them, so that each can pursue their own strategy.",
      "Consider: a twenty-three-year-old with no dependents and a high risk tolerance has a completely different relationship with volatility than a sixty-year-old preparing to retire in three years. Both of them can use options. Both of them should. And when they trade with each other, both of them benefit.",
      "Options are not a zero-sum game dressed up in complexity. They are a mechanism for matching people who have different things to offer each other.",
    ],
  },
  {
    id: "individual",
    eyebrow: "The Spread Therapy Philosophy",
    title: "There Is No Strategy for Everyone",
    body: [
      "Buy-and-hold is one strategy applied the same way by everyone. That is both its strength and its limitation. It does not ask who you are. It does not care about your income, your obligations, your timeline, your temperament.",
      "Options ask all of those questions. And they provide different answers for different people.",
      "If you are cautious, options let you define exactly how much risk you carry. If you are aggressive, options let you amplify. If you need income now, options let you generate it. If you are patient, options let you be compensated for your patience. If you are wrong, options let you correct your position — not erase the mistake, but change your exposure before it becomes a catastrophe.",
      "This is what we mean when we say options are tools for managing risk. Not a magic system. Not a guaranteed edge. Tools. The same way a hammer is a tool — powerful in the hands of someone who understands it, dangerous in the hands of someone who does not.",
      "Spread Therapy exists to make sure you are the former.",
    ],
  },
  {
    id: "closing",
    eyebrow: null,
    title: "Ready to Begin?",
    body: [
      "You have now read the philosophy. The rest is mechanics — and the mechanics matter enormously. But you will learn them differently now, because you understand what they are for.",
      "They are not tricks. They are not secrets. They are instruments of precision that allow you to act deliberately in a world that does not cooperate with anyone's plans.",
      "Let's build your foundation.",
    ],
    cta: true,
  },
];

// ── READING PROGRESS ──────────────────────────────────────────────────────────
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

// ── FADE IN OBSERVER ──────────────────────────────────────────────────────────
function FadeSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function SpreadTherapyPhilosophy({ onBack }) {
  const progress = useReadingProgress();
  const [moduleComplete, setModuleComplete] = useState(false);
  const [selectedNext, setSelectedNext] = useState(null);

  const NEXT_MODULES = [
    { id: "pricing", label: "Module 6", title: "Pricing & Control", desc: "Understand what your position is worth — and how to change it." },
    { id: "spreads", label: "Module 3", title: "Spreads", desc: "Why spreads beat naked options on every dimension that matters." },
    { id: "quiz", label: "Assessment", title: "Take the Quiz", desc: "Find out where your knowledge gaps are before your next trade." },
  ];

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

      {/* Reading progress bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 100,
        background: "rgba(255,255,255,0.04)",
      }}>
        <div style={{
          height: "100%", background: "#c9a84c",
          width: `${progress}%`, transition: "width 0.1s linear",
        }} />
      </div>

      {/* Module nav pill */}
      <div style={{
        position: "fixed", top: 16, right: 16, zIndex: 99,
        background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20, padding: "6px 14px",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a84c" }} />
        <span style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 2 }}>MODULE 7</span>
      </div>

      {/* ── HERO ── */}
      <div style={{ padding: "80px 32px 64px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <FadeSection>
          <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>
            Spread Therapy · Options Philosophy
          </div>
        </FadeSection>
        <FadeSection delay={100}>
          <h1 style={{
            fontSize: "clamp(36px, 8vw, 56px)",
            fontWeight: "normal",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 24,
            color: "#f5f1eb",
          }}>
            Why Options?
          </h1>
        </FadeSection>
        <FadeSection delay={200}>
          <p style={{
            fontSize: 18, color: "#777", lineHeight: 1.7,
            fontStyle: "italic", maxWidth: 480,
            borderLeft: "2px solid rgba(201,168,76,0.3)",
            paddingLeft: 20,
          }}>
            Not because they always make more money. Because they give every person — regardless of age, risk tolerance, or financial situation — the tools to pursue their own strategy.
          </p>
        </FadeSection>

        {/* Estimated read */}
        <FadeSection delay={300}>
          <div style={{ display: "flex", gap: 20, marginTop: 32 }}>
            {[["7 min read", "◷"], ["Module 7 of 7", "◎"], ["Philosophy", "◈"]].map(([label, icon]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: "#444" }}>{icon}</span>
                <span style={{ fontSize: 11, color: "#444", letterSpacing: 1 }}>{label}</span>
              </div>
            ))}
          </div>
        </FadeSection>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: "0 32px 80px" }}>
        {SECTIONS.map((section, si) => (
          <FadeSection key={section.id} delay={si * 50}>
            <div style={{
              padding: "52px 0",
              borderBottom: si < SECTIONS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}>

              {/* Eyebrow */}
              {section.eyebrow && (
                <div style={{
                  fontSize: 10, color: "#c9a84c", letterSpacing: 3,
                  textTransform: "uppercase", marginBottom: 14,
                }}>
                  {section.eyebrow}
                </div>
              )}

              {/* Section title */}
              {section.title !== "Why Options?" && (
                <h2 style={{
                  fontSize: "clamp(22px, 5vw, 30px)",
                  fontWeight: "normal",
                  lineHeight: 1.2,
                  letterSpacing: "-0.01em",
                  color: "#f0ede8",
                  marginBottom: 28,
                }}>
                  {section.title}
                </h2>
              )}

              {/* Pull quote */}
              {section.pullquote && (
                <div style={{
                  margin: "0 0 32px",
                  padding: "20px 24px",
                  background: "rgba(201,168,76,0.05)",
                  borderLeft: "3px solid #c9a84c",
                  borderRadius: "0 8px 8px 0",
                }}>
                  <p style={{
                    fontSize: 18, color: "#c9a84c",
                    fontStyle: "italic", lineHeight: 1.5,
                    margin: 0,
                  }}>
                    "{section.pullquote}"
                  </p>
                </div>
              )}

              {/* Body paragraphs */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {section.body.map((para, pi) => (
                  <p key={pi} style={{
                    fontSize: 16, lineHeight: 1.85,
                    color: pi === 0 ? "#c8c4be" : "#888",
                    margin: 0,
                  }}>
                    {para}
                  </p>
                ))}
              </div>

              {/* CTA section */}
              {section.cta && (
                <div style={{ marginTop: 48 }}>
                  <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>
                    Where would you like to go next?
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {NEXT_MODULES.map(mod => (
                      <button
                        key={mod.id}
                        onClick={() => setSelectedNext(mod.id)}
                        style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "16px 20px", borderRadius: 10, cursor: "pointer",
                          background: selectedNext === mod.id ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${selectedNext === mod.id ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.07)"}`,
                          textAlign: "left", fontFamily: "inherit",
                          transition: "all 0.18s",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 9, color: selectedNext === mod.id ? "#c9a84c" : "#444", letterSpacing: 2, marginBottom: 4 }}>{mod.label}</div>
                          <div style={{ fontSize: 15, color: selectedNext === mod.id ? "#f0ede8" : "#888" }}>{mod.title}</div>
                          <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>{mod.desc}</div>
                        </div>
                        <span style={{ fontSize: 18, color: selectedNext === mod.id ? "#c9a84c" : "#333" }}>→</span>
                      </button>
                    ))}
                  </div>
                  {selectedNext && (
                    <button style={{
                      width: "100%", marginTop: 16, padding: "15px",
                      background: "rgba(201,168,76,0.12)",
                      border: "1px solid rgba(201,168,76,0.35)",
                      borderRadius: 10, color: "#c9a84c",
                      fontSize: 14, cursor: "pointer",
                      fontFamily: "inherit", letterSpacing: 0.5,
                      transition: "all 0.2s",
                    }}>
                      Continue →
                    </button>
                  )}
                </div>
              )}
            </div>
          </FadeSection>
        ))}
      </div>

      {/* ── SIDE DECORATION — desktop only ── */}
      <div style={{
        position: "fixed", left: "max(16px, calc(50% - 380px))", top: "50%",
        transform: "translateY(-50%)",
        display: "flex", flexDirection: "column", gap: 6,
        opacity: 0.3,
      }}>
        {SECTIONS.map((s, i) => (
          <div key={s.id} style={{
            width: 3, height: progress > (i / SECTIONS.length) * 100 ? 20 : 8,
            background: "#c9a84c",
            borderRadius: 2, transition: "height 0.3s ease",
            opacity: progress > (i / SECTIONS.length) * 100 ? 1 : 0.3,
          }} />
        ))}
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        padding: "24px 32px",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ fontSize: 9, color: "#222", letterSpacing: 2 }}>SPREAD THERAPY · MODULE 7</div>
        <div style={{ fontSize: 9, color: "#222" }}>Not financial advice</div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #09090d; }
        p { margin: 0; }
        h1, h2 { margin: 0; }
        button { outline: none; }

        @media (max-width: 600px) {
          div[style*="padding: 80px 32px"] { padding: 56px 20px 48px !important; }
          div[style*="padding: 0 32px 80px"] { padding: 0 20px 60px !important; }
          div[style*="padding: 24px 32px"] { padding: 20px !important; }
        }
      `}</style>
    </div>
  );
}
