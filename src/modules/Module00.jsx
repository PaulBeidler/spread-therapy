import { useState, useEffect, useRef } from "react";

// ── CONTENT ───────────────────────────────────────────────────────────────────
const CHECKLIST_ITEMS = [
  { id: "broker", label: "Choose a broker", detail: "Any broker that offers options trading at spread level. Verify they support defined-risk spreads before opening an account." },
  { id: "fund", label: "Fund your account", detail: "Deposit your starting capital. Give yourself room — the minimum account balance and your actual trading capital are two different numbers." },
  { id: "margin", label: "Apply for a margin account", detail: "This is not about borrowing money. It is the infrastructure your broker needs to hold collateral for spread positions." },
  { id: "level", label: "Apply for spread-level options approval", detail: "Answer the questionnaire honestly and confidently. You have a plan, you understand the risks, and you are here to learn." },
  { id: "paper", label: "Paper trade first", detail: "Trade with real prices, no real money. Build a track record before risking capital. Spread Therapy supports this in Learning mode." },
  { id: "quiz", label: "Take the knowledge assessment", detail: "Know your gaps before your first real trade. The framework will tell you which strategies you are ready for." },
];

const SECTIONS = [
  {
    id: "opening",
    eyebrow: null,
    title: "What Do You Actually Need?",
    body: [
      "Before the philosophy. Before the mechanics. Before the first trade — there is a practical question that deserves a direct answer.",
      "What do you actually need to get started trading options?",
      "Not in theory. Not aspirationally. Right now, given your situation — what does your broker require, how much money makes sense, and what do you need to know before you deposit a dollar?",
      "This module answers those questions plainly.",
    ],
  },
  {
    id: "three",
    eyebrow: "The Three Requirements",
    title: "Every Broker Asks for the Same Three Things",
    body: [
      "The specific names vary by platform. The minimums differ. The paperwork looks different. But every broker that offers options trading requires the same three things — and understanding why each exists matters more than knowing the exact number.",
    ],
  },
  {
    id: "money",
    eyebrow: "Requirement One",
    title: "A Minimum Account Balance",
    pullquote: "The minimum to open the account and the capital you actually deploy are two different numbers.",
    body: [
      "Every broker requires a minimum balance to open a margin account with options trading. This number varies — typically somewhere between $2,000 and $5,000 depending on the platform. Some brokers have lower minimums; a few have higher ones.",
      "The important distinction: this is the minimum to have the account, not the minimum to trade sensibly. You can have $2,000 in an account and risk $100 on a trade. That is legal. Whether it is wise depends on your situation.",
      "Check your specific broker's current requirements before opening an account. These numbers change, and what matters is the current policy of the platform you choose.",
    ],
  },
  {
    id: "margin",
    eyebrow: "Requirement Two",
    title: "A Margin Account",
    body: [
      "The word margin carries baggage. It sounds like borrowed money, like leverage, like risk you did not ask for.",
      "For spread trading, margin means something more specific and less frightening: it is the infrastructure your broker uses to hold collateral against your open positions. When you sell a spread, your broker sets aside a portion of your account as collateral — not to lend it out, but to guarantee that your obligation is covered.",
      "Most spread traders never actually borrow against their margin. They simply need the account type to be eligible for the positions they want to take.",
      "A cash account — the simpler alternative — limits what options strategies are available to you. For covered calls and basic options buying, a cash account may be sufficient. For spreads, which are the systematic income engine this framework is built around, you will need margin.",
      "Apply for a margin account. Understand what it is. Use it as collateral infrastructure, not as borrowed capital.",
    ],
  },
  {
    id: "level",
    eyebrow: "Requirement Three",
    title: "The Right Options Approval Level",
    body: [
      "Every broker uses a tier system to approve traders for progressively more complex options strategies. The names differ across platforms — some call them levels, some call them tiers, some use descriptive labels like Basic and Advanced. The structure is the same everywhere.",
      "The progression typically looks like this: the first tier allows covered calls and basic strategies. The second tier adds the ability to buy puts and calls outright. The third tier — the one you need — unlocks defined-risk spreads.",
      "To get approved, your broker will ask about your investing experience, your income, your net worth, and your understanding of options risk. Answer honestly. If you have done any options trading at all, or if you have studied the subject seriously, say so. If you have a plan and understand that spreads involve defined, bounded risk, say that too.",
      "Approval is not a test of your net worth. It is a test of whether you understand what you are doing. If you have read this far, you are already ahead of most applicants.",
    ],
  },
  {
    id: "howmuch",
    eyebrow: "The Honest Conversation",
    title: "How Much Money Do You Actually Need?",
    pullquote: "You don't need a fortune. The framework scales. What you need is enough that a single loss doesn't change your life.",
    body: [
      "The minimum account balance gets you in the door. But trading sensibly requires more than the minimum. Here is an honest breakdown of what different account sizes make possible.",
    ],
  },
  {
    id: "pdt",
    eyebrow: "One Rule Worth Knowing",
    title: "The Pattern Day Trader Rule",
    body: [
      "In the United States, if your account holds less than $25,000, you are subject to the Pattern Day Trader rule. This limits you to three day trades — opening and closing a position on the same day — within any five-business-day period.",
      "For a spread seller who holds positions for 30 to 45 days, this rule rarely matters. You are not day trading. You open a position, you manage it over weeks, you close it when the framework says to.",
      "But it is worth knowing the rule exists. If you ever need to close a position quickly — because delta has spiked, because the market moved unexpectedly, because a rule violation demands immediate action — you want to know in advance whether you have day trades available.",
      "Know your count. It costs nothing to track it, and it could matter on the one day it matters most.",
    ],
  },
  {
    id: "scale",
    eyebrow: "The Good News",
    title: "The Framework Scales",
    body: [
      "A $10,000 account and a $100,000 account use exactly the same rules. The same scoring framework. The same OTM requirements. The same 50% profit target and 21 DTE close discipline.",
      "The only difference is position size. At $10,000, a 5% maximum risk per trade means $500 per position. At $100,000, it means $5,000. The percentage is identical. The discipline is identical. The process is identical.",
      "This matters because it means you can learn the system at whatever scale you can afford, and the knowledge transfers completely as your account grows. You are not learning a different skill at a larger account. You are running the same system with larger numbers.",
      "Start where you are. The framework works at every size.",
    ],
  },
  {
    id: "before",
    eyebrow: "Before You Deposit",
    title: "Six Things to Do First",
    body: [
      "There is no rush. The market will be open tomorrow, and next week, and next month. The traders who succeed are not the ones who started fastest. They are the ones who started most prepared.",
      "Work through this checklist before your first real trade. Each item exists for a reason.",
    ],
    checklist: true,
  },
  {
    id: "closing",
    eyebrow: null,
    title: "You Are More Ready Than You Think",
    body: [
      "The barrier to options trading is not capital. It is knowledge. And knowledge is exactly what this platform is designed to give you.",
      "You now know what your broker requires, why each requirement exists, and what account size makes sense for what you want to do. That puts you ahead of most people who open an options account.",
      "The next step is understanding what you are actually trading — and why it works.",
    ],
    cta: true,
  },
];

const ACCOUNT_TIERS = [
  { range: "$2,000–$4,999", color: "#4a9eff", reality: "You can trade. Positions are small. One loss is meaningful. Start with paper trading.", recommendation: "Learning mode first" },
  { range: "$5,000–$9,999", color: "#22c55e", reality: "Breathing room. 2–3 positions simultaneously. The framework begins to show its edge.", recommendation: "Ready to begin" },
  { range: "$10,000–$24,999", color: "#c9a84c", reality: "The framework works well here. Multiple positions, proper diversification, meaningful income possible.", recommendation: "Good starting point" },
  { range: "$25,000+", color: "#f97316", reality: "PDT rule irrelevant. Full strategy available. Tier 1 covered calls generate serious income.", recommendation: "Full framework" },
];

// ── UTILITIES ─────────────────────────────────────────────────────────────────
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

// ── CHECKLIST ITEM ─────────────────────────────────────────────────────────────
function ChecklistItem({ item, checked, onToggle }) {
  return (
    <div
      onClick={() => onToggle(item.id)}
      style={{
        display: "flex", alignItems: "flex-start", gap: 16,
        padding: "16px 18px", borderRadius: 10, cursor: "pointer",
        background: checked ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${checked ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.06)"}`,
        marginBottom: 8, transition: "all 0.2s",
      }}
    >
      <div style={{
        flexShrink: 0, width: 22, height: 22, borderRadius: "50%", marginTop: 1,
        background: checked ? "#22c55e" : "transparent",
        border: `1.5px solid ${checked ? "#22c55e" : "rgba(255,255,255,0.15)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s",
      }}>
        {checked && <span style={{ fontSize: 11, color: "#000", fontWeight: "bold" }}>✓</span>}
      </div>
      <div>
        <div style={{ fontSize: 14, color: checked ? "#22c55e" : "#d0ccc8", marginBottom: 4, transition: "color 0.2s" }}>
          {item.label}
        </div>
        <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{item.detail}</div>
      </div>
    </div>
  );
}

// ── ACCOUNT TIER TABLE ────────────────────────────────────────────────────────
function AccountTierTable() {
  return (
    <div style={{ margin: "28px 0" }}>
      {ACCOUNT_TIERS.map((tier, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "140px 1fr",
          borderBottom: i < ACCOUNT_TIERS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
          padding: "16px 0", gap: 16, alignItems: "start",
        }}>
          <div>
            <div style={{ fontSize: 13, color: tier.color, fontFamily: "monospace", marginBottom: 4 }}>{tier.range}</div>
            <div style={{ display: "inline-block", fontSize: 9, color: tier.color, background: `${tier.color}15`, border: `1px solid ${tier.color}30`, borderRadius: 10, padding: "2px 8px", letterSpacing: 1 }}>
              {tier.recommendation}
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#777", lineHeight: 1.6 }}>{tier.reality}</div>
        </div>
      ))}
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function SpreadTherapyGettingStarted({ onBack }) {
  const progress = useReadingProgress();
  const [checked, setChecked] = useState({});
  const [selectedNext, setSelectedNext] = useState(null);

  const toggleCheck = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const checkedCount = Object.values(checked).filter(Boolean).length;

  const NEXT_MODULES = [
    { id: "stocks", label: "Module 1", title: "Stocks", desc: "How to evaluate, buy, and hold for the long term." },
    { id: "options", label: "Module 2", title: "Options", desc: "Puts, calls, and why the contract is your most powerful tool." },
    { id: "philosophy", label: "Module 7", title: "Options Philosophy", desc: "Why options — and why they are not for everyone in the same way." },
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

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 100, background: "rgba(255,255,255,0.04)" }}>
        <div style={{ height: "100%", background: "#4a9eff", width: `${progress}%`, transition: "width 0.1s linear" }} />
      </div>

      {/* Module pill */}
      <div style={{
        position: "fixed", top: 16, right: 16, zIndex: 99,
        background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20, padding: "6px 14px",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4a9eff" }} />
        <span style={{ fontSize: 10, color: "#4a9eff", letterSpacing: 2 }}>BEFORE YOU BEGIN</span>
      </div>

      {/* ── HERO ── */}
      <div style={{ padding: "80px 32px 64px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <FadeSection>
          <div style={{ fontSize: 10, color: "#4a9eff", letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>
            Spread Therapy · Getting Started
          </div>
        </FadeSection>
        <FadeSection delay={100}>
          <h1 style={{
            fontSize: "clamp(32px, 7vw, 52px)",
            fontWeight: "normal", lineHeight: 1.1,
            letterSpacing: "-0.02em", marginBottom: 24, color: "#f5f1eb",
          }}>
            What Do You<br />Actually Need?
          </h1>
        </FadeSection>
        <FadeSection delay={200}>
          <p style={{
            fontSize: 18, color: "#777", lineHeight: 1.7, fontStyle: "italic",
            maxWidth: 480, borderLeft: "2px solid rgba(74,158,255,0.3)", paddingLeft: 20,
          }}>
            Three requirements. An honest conversation about money. And six things to do before your first real trade.
          </p>
        </FadeSection>
        <FadeSection delay={300}>
          <div style={{ display: "flex", gap: 20, marginTop: 32 }}>
            {[["5 min read", "◷"], ["Platform agnostic", "◎"], ["Before Module 1", "◈"]].map(([label, icon]) => (
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
          <FadeSection key={section.id} delay={si * 40}>
            <div style={{
              padding: "48px 0",
              borderBottom: si < SECTIONS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}>

              {section.eyebrow && (
                <div style={{ fontSize: 10, color: "#4a9eff", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>
                  {section.eyebrow}
                </div>
              )}

              {section.title !== "What Do You Actually Need?" && (
                <h2 style={{
                  fontSize: "clamp(20px, 4vw, 28px)", fontWeight: "normal",
                  lineHeight: 1.2, letterSpacing: "-0.01em",
                  color: "#f0ede8", marginBottom: 24,
                }}>
                  {section.title}
                </h2>
              )}

              {section.pullquote && (
                <div style={{ margin: "0 0 28px", padding: "18px 22px", background: "rgba(74,158,255,0.05)", borderLeft: "3px solid #4a9eff", borderRadius: "0 8px 8px 0" }}>
                  <p style={{ fontSize: 17, color: "#4a9eff", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>
                    "{section.pullquote}"
                  </p>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {section.body.map((para, pi) => (
                  <p key={pi} style={{ fontSize: 16, lineHeight: 1.85, color: pi === 0 ? "#c8c4be" : "#888", margin: 0 }}>
                    {para}
                  </p>
                ))}
              </div>

              {/* Account tier table */}
              {section.id === "howmuch" && (
                <FadeSection delay={100}>
                  <AccountTierTable />
                  <p style={{ fontSize: 13, color: "#444", fontStyle: "italic", lineHeight: 1.6 }}>
                    These ranges reflect the practical reality of running a systematic income framework. Your broker's minimum account balance is a floor — not a recommendation.
                  </p>
                </FadeSection>
              )}

              {/* Approval tier visual */}
              {section.id === "level" && (
                <FadeSection delay={100}>
                  <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { tier: "Tier 1", label: "Covered calls · Basic strategies", color: "#4a9eff", yours: false },
                      { tier: "Tier 2", label: "Buying puts and calls outright", color: "#22c55e", yours: false },
                      { tier: "Tier 3", label: "Defined-risk spreads", color: "#c9a84c", yours: true },
                    ].map(t => (
                      <div key={t.tier} style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "13px 16px", borderRadius: 8,
                        background: t.yours ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.02)",
                        border: `1px solid ${t.yours ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.05)"}`,
                      }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 11, color: t.color, letterSpacing: 1 }}>{t.tier}</span>
                          <span style={{ fontSize: 13, color: t.yours ? "#d0ccc8" : "#555", marginLeft: 12 }}>{t.label}</span>
                        </div>
                        {t.yours && (
                          <span style={{ fontSize: 9, color: "#c9a84c", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", padding: "2px 10px", borderRadius: 10, letterSpacing: 1, flexShrink: 0 }}>
                            YOU NEED THIS
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </FadeSection>
              )}

              {/* Three requirements visual */}
              {section.id === "three" && (
                <FadeSection delay={100}>
                  <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {[
                      { num: "1", label: "Minimum balance", icon: "◈" },
                      { num: "2", label: "Margin account", icon: "◉" },
                      { num: "3", label: "Spread approval", icon: "◎" },
                    ].map(r => (
                      <div key={r.num} style={{ padding: "18px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, textAlign: "center" }}>
                        <div style={{ fontSize: 24, color: "#4a9eff", marginBottom: 8 }}>{r.icon}</div>
                        <div style={{ fontSize: 9, color: "#4a9eff", letterSpacing: 2, marginBottom: 6 }}>REQ. {r.num}</div>
                        <div style={{ fontSize: 12, color: "#777", lineHeight: 1.4 }}>{r.label}</div>
                      </div>
                    ))}
                  </div>
                </FadeSection>
              )}

              {/* Checklist */}
              {section.checklist && (
                <FadeSection delay={100}>
                  <div style={{ marginTop: 28 }}>
                    {/* Progress */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                      <span style={{ fontSize: 10, color: "#555", letterSpacing: 2 }}>YOUR PROGRESS</span>
                      <span style={{ fontSize: 10, color: checkedCount === CHECKLIST_ITEMS.length ? "#22c55e" : "#555" }}>
                        {checkedCount} / {CHECKLIST_ITEMS.length} complete
                      </span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 2, height: 2, marginBottom: 20 }}>
                      <div style={{
                        background: "#22c55e", height: 2, borderRadius: 2,
                        width: `${(checkedCount / CHECKLIST_ITEMS.length) * 100}%`,
                        transition: "width 0.4s ease",
                      }} />
                    </div>
                    {CHECKLIST_ITEMS.map(item => (
                      <ChecklistItem key={item.id} item={item} checked={!!checked[item.id]} onToggle={toggleCheck} />
                    ))}
                    {checkedCount === CHECKLIST_ITEMS.length && (
                      <div style={{ marginTop: 16, padding: "14px 18px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 10, textAlign: "center" }}>
                        <div style={{ fontSize: 13, color: "#22c55e" }}>You are ready to trade.</div>
                        <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>All prerequisites complete. The framework is yours to use.</div>
                      </div>
                    )}
                  </div>
                </FadeSection>
              )}

              {/* CTA */}
              {section.cta && (
                <div style={{ marginTop: 44 }}>
                  <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 18 }}>
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
                          background: selectedNext === mod.id ? "rgba(74,158,255,0.08)" : "rgba(255,255,255,0.02)",
                          border: `1px solid ${selectedNext === mod.id ? "rgba(74,158,255,0.35)" : "rgba(255,255,255,0.06)"}`,
                          textAlign: "left", fontFamily: "inherit", transition: "all 0.18s",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 9, color: selectedNext === mod.id ? "#4a9eff" : "#444", letterSpacing: 2, marginBottom: 4 }}>{mod.label}</div>
                          <div style={{ fontSize: 15, color: selectedNext === mod.id ? "#f0ede8" : "#888" }}>{mod.title}</div>
                          <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>{mod.desc}</div>
                        </div>
                        <span style={{ fontSize: 18, color: selectedNext === mod.id ? "#4a9eff" : "#333" }}>→</span>
                      </button>
                    ))}
                  </div>
                  {selectedNext && (
                    <button style={{
                      width: "100%", marginTop: 14, padding: "15px",
                      background: "rgba(74,158,255,0.1)", border: "1px solid rgba(74,158,255,0.3)",
                      borderRadius: 10, color: "#4a9eff", fontSize: 14, cursor: "pointer",
                      fontFamily: "inherit", letterSpacing: 0.5, transition: "all 0.2s",
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

      {/* Side progress indicators */}
      <div style={{
        position: "fixed", left: "max(16px, calc(50% - 380px))", top: "50%",
        transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 6, opacity: 0.3,
      }}>
        {SECTIONS.map((s, i) => (
          <div key={s.id} style={{
            width: 3, height: progress > (i / SECTIONS.length) * 100 ? 18 : 7,
            background: "#4a9eff", borderRadius: 2,
            transition: "height 0.3s ease",
            opacity: progress > (i / SECTIONS.length) * 100 ? 1 : 0.3,
          }} />
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 9, color: "#222", letterSpacing: 2 }}>SPREAD THERAPY · BEFORE YOU BEGIN</div>
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
          div[style*="padding: 24px 32px"] { padding: 20px !important; }
          div[style*="grid-template-columns: 1fr 1fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 140px 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
