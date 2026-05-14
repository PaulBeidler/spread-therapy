import { useState, useEffect, useRef } from "react";

const SECTIONS = [
  {
    id: "opening",
    eyebrow: null,
    title: "Pricing & Control",
    body: [
      "When you sell a put and collect $500 in premium, what actually happened to your account? Where did the money go? Why doesn't your balance look different?",
      "And when the stock starts moving — toward your strike or away from it — what is actually happening to your position? How do you know if you are winning or losing?",
      "This module answers those questions first. The Greeks come after, because they only make sense once you understand what they are describing.",
    ],
  },
  {
    id: "premium_paradox",
    eyebrow: "The First Surprise",
    title: "You Collected $500. Your Balance Didn't Change.",
    pullquote: "The premium appears in your buying power. The contract appears as a liability. They offset. Your net account value barely moves.",
    body: [
      "When you sell a put option and collect $500 in premium, your brokerage does two things simultaneously.",
      "First, it credits your buying power with $500. That money is real — it is sitting there. Second, it records the open put contract as a position with negative value. At the moment you sell, that contract is worth approximately what you just collected for it — about $500.",
      "So your buying power goes up $500. Your open position is worth negative $500. Net effect on your total account value: roughly zero.",
      "This confuses new traders. They sold something and collected money. Why didn't their account grow?",
      "The answer is that you have not yet earned that premium. You have received it as a deposit — an advance payment for a service you have not yet completed. The service is: accepting the obligation to buy shares at the strike price if the stock falls there. Until expiration — or until you close the position — that obligation remains on your books.",
      "The premium becomes truly yours as time passes and the option loses value. When you close the position by buying back the contract at a lower price, the difference is your realized profit.",
    ],
  },
  {
    id: "movement",
    eyebrow: "As the Stock Moves",
    title: "Toward the Strike or Away From It",
    body: [
      "Once you have an open position, the stock starts moving. Every move changes the value of your contract.",
      "If you sold a put with a $450 strike and the stock is at $500, you want the stock to stay above $450 — ideally to go higher. As the stock rises, your put becomes less valuable (it is further out of the money). You could buy it back for less than you sold it for. That difference is profit.",
      "If the stock falls toward $450, your put becomes more valuable — more expensive to buy back. Your position is moving against you. At $450 exactly, your put is at the money. Below $450, it is in the money and you face potential assignment.",
      "The reverse is true for calls. For short puts, up is good. For short calls, down is good. Movement away from your strike is profit. Movement toward your strike is risk.",
    ],
  },
  {
    id: "reading",
    eyebrow: "Reading Your Position",
    title: "What the Numbers Actually Mean",
    body: [
      "Your brokerage shows you several numbers for an open position. Here is what they actually mean.",
      "The mark price is the current midpoint between what buyers are willing to pay and what sellers are asking. This is the most accurate estimate of what your position is worth right now.",
      "Your cost basis for a short option is the credit you received when you opened the position. If you sold a put for $5.09 and the current mark is $3.00, you are up $2.09 per share — $209 per contract. You could close for a profit right now.",
      "Unrealized P&L is the difference between what you sold it for and what it would cost to buy it back today. Positive means you are winning. Negative means you are losing. Neither is permanent until you close.",
      "The percentage return is unrealized P&L divided by the credit received. When this reaches 50%, the framework says to close. You have captured half the maximum possible profit while eliminating the remaining risk.",
    ],
  },
  {
    id: "control",
    eyebrow: "The Most Important Insight",
    title: "You Can Always Change Your Mind",
    pullquote: "Sold means buy to close. Bought means sell to close. You are never locked in.",
    body: [
      "This is the insight that separates options traders from gamblers: you are never obligated to hold a position until expiration.",
      "If you sold a put and the trade is going well — the stock is rising, the put is losing value — you can buy it back at any time. You do not have to wait for expiration to claim your profit.",
      "If you sold a put and the trade is going against you — the stock is falling, the put is gaining value — you can buy it back and accept a loss. A controlled loss now is almost always better than a catastrophic loss at expiration.",
      "The mechanism is simple. Whatever you did to open the position, you do the opposite to close it. Sold a put? Buy it back. Bought a call? Sell it. The market is open. Your position has a price. You can transact at any time.",
      "This control is what makes options a management tool rather than a bet. Every position has an exit. Every loss has a limit. Every trade can be corrected.",
    ],
  },
  {
    id: "bid_ask",
    eyebrow: "Practical Detail",
    title: "The Bid/Ask Spread",
    body: [
      "Every option has two prices: the bid (what buyers will pay) and the ask (what sellers are asking). The difference between them is the bid/ask spread.",
      "When you sell an option, you receive the bid price — the lower number. When you buy an option back to close, you pay the ask price — the higher number. The market maker captures the difference.",
      "For liquid options on major indices, this spread is small — a few cents. For thinly traded single-stock options, it can be wide — sometimes a dollar or more. Wide spreads mean your entry and exit prices are significantly worse than the mark price suggests.",
      "This is another advantage of index options. RUTW and XSP options are extremely liquid with tight bid/ask spreads. When placing orders, use limit orders set near the midpoint of the bid/ask. Do not use market orders on options — you will almost always get a worse fill.",
    ],
  },
  {
    id: "greeks_intro",
    eyebrow: "Now the Greeks Make Sense",
    title: "Greeks Are the Vocabulary of Price Movement",
    body: [
      "The Greeks are not mysterious mathematical abstractions. They are answers to specific practical questions about how your position's price will change.",
      "Delta answers: if the stock moves $1 right now, how much does my option price change? A delta of 0.20 means a $1 move in the stock changes the option price by about $0.20. For a short put, delta tells you your directional exposure — and your probability of expiring in the money.",
      "Theta answers: if one day passes with nothing else changing, how much does my option lose in time value? For a short option, theta is positive — you earn it daily. This is your income.",
      "Vega answers: if implied volatility increases by one percentage point, how much does my option price change? For short options, vega is negative — rising volatility hurts you by making your position more expensive to close.",
      "Gamma answers: how fast is delta itself changing? High gamma near expiration means delta can swing rapidly. This is why the framework closes positions at 21 DTE — gamma accelerates and positions become harder to manage.",
      "Rho answers: how sensitive is the option to interest rate changes? For short-dated spreads, rho is small and rarely matters.",
    ],
  },
  {
    id: "greeks_practical",
    eyebrow: "Using the Greeks",
    title: "What to Watch and What to Ignore",
    body: [
      "Not all Greeks matter equally for spread sellers.",
      "Delta is your primary risk gauge. Check it when you enter and monitor it as the position develops. Above 0.25, the framework says evaluate immediately. Above 0.35, close regardless of P&L.",
      "Theta is your daily confirmation that the trade is working. A short put with $2.00 of daily theta decay is earning $200 per day purely from time passing.",
      "Vega is your volatility exposure. When you enter during elevated VIX (16-25 for the framework's target range), you collect richer premium. If volatility drops after entry, your position gains value even if the stock doesn't move. If volatility spikes, your position deteriorates even if the stock stays still.",
      "Gamma is your warning system near expiration. When DTE falls below 21, gamma spikes and positions can deteriorate rapidly. The framework closes at 21 DTE precisely because of empirical experience with how fast things can change in the final weeks.",
      "Rho: ignore it. Interest rate sensitivity on 30-45 DTE spreads is minimal.",
    ],
  },
  {
    id: "practical_example",
    eyebrow: "A Real Position, Explained",
    title: "IONQ — What the Numbers Are Saying",
    body: [
      "Consider the IONQ $55 put from the current portfolio. Sold for $5.09, currently marked at $5.28. IONQ is trading near $55.",
      "What does this mean? The position was sold for $509 per contract. It currently costs $528 to buy back. The position is losing $19 — a small loss but moving in the wrong direction.",
      "The delta is 0.39. This is above the framework's hard stop of 0.25. It means there is roughly a 39% chance the stock falls below $55 by expiration — not comfortable odds for a short put seller.",
      "The correct action, per the framework: close immediately. Not because the loss is catastrophic — it is not — but because the delta violation means the position is outside the acceptable risk range. The framework is clear: a position above 0.35 delta is closed regardless of P&L.",
      "This is what pricing and control means in practice. You understand what your position is worth. You understand what the Greeks are telling you. And you have the control to act on that information before the situation deteriorates further.",
    ],
  },
  {
    id: "closing",
    eyebrow: null,
    title: "The Market Is Open",
    body: [
      "Every trading day, your positions have prices. Those prices are telling you something. The Greeks are the vocabulary for understanding what they are saying.",
      "A rising delta is saying: your risk is increasing. A shrinking theta ratio is saying: time decay is no longer working as hard for you. A widening bid/ask is saying: this option is becoming less liquid and harder to exit cleanly.",
      "None of these signals require you to act immediately. But all of them deserve your attention. And when the framework says to act — 50% profit, 21 DTE, delta above 0.35 — you have the tools to act decisively.",
      "The market is always open. Your exit is always available. Use it.",
    ],
    cta: true,
  },
];

const NEXT_MODULES = [
  { id: "philosophy", label: "Module 7", title: "Philosophy & Temperament", desc: "Why this approach works psychologically, and who it is for.", recommended: true },
  { id: "together", label: "Module 4", title: "How It All Works Together", desc: "Review how the four tiers run as one system.", recommended: false },
  { id: "quiz", label: "Assessment", title: "Take the Quiz", desc: "Test your pricing and Greeks knowledge.", recommended: false },
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

export default function Module06({ onBack, onNavigate }) {
  const progress = useReadingProgress();
  const { activeIndex, refs } = useSectionProgress();
  const [premium, setPremium] = useState(509);

  return (
    <div className="st-pricing" style={{ minHeight: "100vh", background: "#09090d", color: "#e8e4df", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", maxWidth: 680, margin: "0 auto" }}>

      <div role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress" style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 100, background: "rgba(255,255,255,0.04)" }}>
        <div style={{ height: "100%", background: "#f59e0b", width: `${progress}%`, transition: "width 0.1s linear" }} />
      </div>

      <div style={{ position: "fixed", top: 16, left: 16, right: 16, zIndex: 99, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {onBack && (
          <button onClick={onBack} aria-label="Back to Learn Hub" style={{ background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "6px 14px", cursor: "pointer", color: "#f59e0b", fontSize: 12, fontFamily: "inherit", letterSpacing: 1 }}>← Back</button>
        )}
        <div style={{ background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b" }} />
          <span style={{ fontSize: 10, color: "#f59e0b", letterSpacing: 2 }}>MODULE 06</span>
        </div>
      </div>

      <div style={{ padding: "80px 32px 64px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <FadeSection>
          <div style={{ fontSize: 10, color: "#f59e0b", letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>Spread Therapy · Pricing & Control</div>
        </FadeSection>
        <FadeSection delay={100}>
          <h1 style={{ fontSize: "clamp(36px, 8vw, 52px)", fontWeight: "normal", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24, color: "#f5f1eb" }}>Pricing &<br />Control</h1>
        </FadeSection>
        <FadeSection delay={200}>
          <p style={{ fontSize: 18, color: "#777", lineHeight: 1.7, fontStyle: "italic", maxWidth: 480, borderLeft: "2px solid rgba(245,158,11,0.3)", paddingLeft: 20 }}>
            You collected premium. Your balance didn't move. The stock is moving. Here is what is actually happening — and what you can do about it.
          </p>
        </FadeSection>
        <FadeSection delay={300}>
          <div style={{ display: "flex", gap: 20, marginTop: 32, flexWrap: "wrap" }}>
            {[["10 min read", "◷"], ["Module 6 of 7", "◎"], ["Essential", "◈"]].map(([label, icon]) => (
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
          <div style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 10, color: "#f59e0b", letterSpacing: 2, marginBottom: 20 }}>INTERACTIVE · WHAT HAPPENS WHEN YOU SELL A PUT</div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 8 }}>Premium collected: ${premium}</div>
              <input type="range" min="100" max="2000" value={premium} onChange={e => setPremium(Number(e.target.value))} aria-label="Premium collected" style={{ width: "100%", accentColor: "#f59e0b" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { label: "Buying power", value: `+$${premium}`, color: "#22c55e", note: "Added immediately" },
                { label: "Contract value", value: `-$${premium}`, color: "#ef4444", note: "Liability on books" },
                { label: "Net account change", value: "~$0", color: "#888", note: "They offset" },
              ].map(card => (
                <div key={card.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "#444", letterSpacing: 1, marginBottom: 8 }}>{card.label.toUpperCase()}</div>
                  <div style={{ fontSize: 18, fontFamily: "monospace", color: card.color, marginBottom: 4 }}>{card.value}</div>
                  <div style={{ fontSize: 10, color: "#333" }}>{card.note}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, fontSize: 12, color: "#555", lineHeight: 1.6, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 14 }}>
              At 50% profit, your contract costs ~${Math.round(premium * 0.5)} to buy back — you keep the other ${Math.round(premium * 0.5)} as realized profit.
            </div>
          </div>
        </div>
      </FadeSection>

      <div style={{ padding: "0 32px 80px" }}>
        {SECTIONS.map((section, si) => (
          <FadeSection key={section.id} delay={si * 40}>
            <div ref={el => refs.current[si] = el} style={{ padding: "48px 0", borderBottom: si < SECTIONS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>

              {section.eyebrow && (
                <div style={{ fontSize: 10, color: "#f59e0b", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>{section.eyebrow}</div>
              )}

              {section.title !== "Pricing & Control" && (
                <h2 style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: "normal", lineHeight: 1.2, letterSpacing: "-0.01em", color: "#f0ede8", marginBottom: 24 }}>{section.title}</h2>
              )}

              {section.pullquote && (
                <div style={{ margin: "0 0 28px", padding: "18px 22px", background: "rgba(245,158,11,0.05)", borderLeft: "3px solid #f59e0b", borderRadius: "0 8px 8px 0" }}>
                  <p style={{ fontSize: 17, color: "#f59e0b", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>"{section.pullquote}"</p>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {section.body.map((para, pi) => (
                  <p key={pi} style={{ fontSize: 16, lineHeight: 1.85, color: pi === 0 ? "#c8c4be" : "#888", margin: 0 }}>{para}</p>
                ))}
              </div>

              {section.id === "greeks_intro" && (
                <FadeSection delay={100}>
                  <div style={{ marginTop: 28, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ fontSize: 10, color: "#555", letterSpacing: 2 }}>THE GREEKS — PLAIN ENGLISH</div>
                    </div>
                    {[
                      { greek: "Delta", question: "Stock moves $1 — how much does my option change?", forSeller: "Directional risk. Hard stop at 0.25. Close at 0.35.", color: "#4a9eff" },
                      { greek: "Theta", question: "One day passes — how much do I earn?", forSeller: "Daily income. Higher = better for sellers.", color: "#22c55e" },
                      { greek: "Vega", question: "Volatility rises 1% — what happens?", forSeller: "Negative for sellers. VIX spike hurts your position.", color: "#f59e0b" },
                      { greek: "Gamma", question: "How fast is delta changing?", forSeller: "Warning at 21 DTE. Accelerates rapidly near expiry.", color: "#ef4444" },
                      { greek: "Rho", question: "Interest rates change — does it matter?", forSeller: "Ignore for short-dated spreads.", color: "#555" },
                    ].map((row, i) => (
                      <div key={i} style={{ padding: "14px 20px", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontSize: 13, color: row.color, fontFamily: "monospace", width: 60 }}>{row.greek}</span>
                          <span style={{ fontSize: 12, color: "#777" }}>{row.question}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#444", paddingLeft: 70 }}>→ {row.forSeller}</div>
                      </div>
                    ))}
                  </div>
                </FadeSection>
              )}

              {section.id === "practical_example" && (
                <FadeSection delay={100}>
                  <div style={{ marginTop: 28, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 10, color: "#ef4444", letterSpacing: 2, marginBottom: 16 }}>REAL EXAMPLE — IONQ $55 PUT</div>
                    {[
                      { label: "Sold for", value: "$5.09 ($509/contract)", color: "#22c55e" },
                      { label: "Current mark", value: "$5.28 ($528/contract)", color: "#ef4444" },
                      { label: "Unrealized P&L", value: "–$19", color: "#ef4444" },
                      { label: "Current delta", value: "0.39 ⚠ ABOVE HARD STOP", color: "#ef4444" },
                      { label: "Action required", value: "Close immediately", color: "#ef4444" },
                      { label: "Why", value: "Delta above 0.35 = close regardless of P&L", color: "#888" },
                    ].map((row, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                        <span style={{ fontSize: 12, color: "#555" }}>{row.label}</span>
                        <span style={{ fontSize: 12, color: row.color, fontFamily: i < 5 ? "monospace" : "inherit" }}>{row.value}</span>
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
                      <button key={mod.id} onClick={() => onNavigate?.(mod.id)} aria-label={`Go to ${mod.title}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderRadius: 10, cursor: "pointer", background: mod.recommended ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${mod.recommended ? "rgba(245,158,11,0.35)" : "rgba(255,255,255,0.06)"}`, textAlign: "left", fontFamily: "inherit", transition: "all 0.18s", outline: "none", width: "100%" }}>
                        <div>
                          <div style={{ fontSize: 9, color: mod.recommended ? "#f59e0b" : "#444", letterSpacing: 2, marginBottom: 4 }}>{mod.label}{mod.recommended && " · RECOMMENDED"}</div>
                          <div style={{ fontSize: 15, color: mod.recommended ? "#f0ede8" : "#888" }}>{mod.title}</div>
                          <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>{mod.desc}</div>
                        </div>
                        <span style={{ fontSize: 18, color: mod.recommended ? "#f59e0b" : "#333" }}>→</span>
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "#444", marginTop: 14, fontStyle: "italic" }}>
                    Most readers finish with Module 7 — the philosophical foundation that sustains this practice over years.
                  </p>
                </div>
              )}
            </div>
          </FadeSection>
        ))}
      </div>

      <div style={{ position: "fixed", left: "max(16px, calc(50% - 380px))", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 6, opacity: 0.3 }}>
        {SECTIONS.map((s, i) => (
          <div key={s.id} style={{ width: 3, height: i <= activeIndex ? 18 : 7, background: "#f59e0b", borderRadius: 2, transition: "height 0.3s ease", opacity: i <= activeIndex ? 1 : 0.3 }} />
        ))}
      </div>

      <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 9, color: "#222", letterSpacing: 2 }}>SPREAD THERAPY · MODULE 06</div>
        <div style={{ fontSize: 9, color: "#222" }}>Not financial advice</div>
      </div>

      <style>{`
        .st-pricing * { box-sizing: border-box; }
        .st-pricing p, .st-pricing h1, .st-pricing h2, .st-pricing button { margin: 0; }
        .st-pricing button:focus-visible { outline: 2px solid #f59e0b; outline-offset: 2px; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
