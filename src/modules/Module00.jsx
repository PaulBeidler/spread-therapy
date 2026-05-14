import { useState, useEffect, useRef, useCallback } from "react";

const CHECKLIST_ITEMS = [
  { id: "broker", label: "Choose a broker", detail: "Any broker that offers options trading with spread approval. Verify they support defined-risk spreads before opening an account — not all do.", logistical: true },
  { id: "fund", label: "Fund your account", detail: "Deposit your starting capital. The minimum to open the account and the capital you actually deploy are two different numbers. Give yourself room.", logistical: true },
  { id: "margin", label: "Apply for a margin account", detail: "This is not about borrowing money. It is the infrastructure your broker needs to hold collateral for spread positions.", logistical: true },
  { id: "level", label: "Apply for spread-level options approval", detail: "Answer the questionnaire honestly and confidently. You have a plan, you understand the risks, and you are here to learn. That is what they want to hear.", logistical: true },
  { id: "paper", label: "Paper trade first", detail: "Trade with real prices, no real money. Build a track record before risking capital. Know what you are doing before you do it with real consequences.", logistical: false },
  { id: "quiz", label: "Take the knowledge assessment", detail: "Know your gaps before your first real trade. The framework will tell you which strategies you are ready for and which need more preparation.", logistical: false },
];

const SECTIONS = [
  {
    id: "opening",
    eyebrow: null,
    title: "Three things. That is all.",
    body: [
      "Every broker that offers options trading requires the same three things: a minimum account balance, a margin account, and spread-level options approval.",
      "The specific numbers vary. The paperwork looks different. The platform names change. But the three requirements are universal — and understanding why each one exists matters more than memorizing any particular threshold.",
      "This module covers the requirements, has an honest conversation about how much money you actually need, and gives you a checklist to work through before your first real trade.",
    ],
  },
  {
    id: "money",
    eyebrow: "Requirement One",
    title: "A Minimum Account Balance",
    pullquote: "The minimum to open the account and the capital you actually deploy are two different numbers. Know which one you are talking about.",
    body: [
      "Every broker requires a minimum balance to open a margin account with options trading. This number varies — typically somewhere between $2,000 and $5,000 depending on the platform. Some brokers have lower minimums; a few have higher ones.",
      "The important distinction: this is the minimum to have the account, not the minimum to trade sensibly. You can have $2,000 in an account and risk $100 on a trade. That is legal. Whether it is wise depends on your situation.",
      "Check your specific broker's current requirements before opening an account. These numbers change, and what matters is the current policy of the platform you choose — not any number you read in a module written at a specific point in time.",
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
      "A cash account limits what options strategies are available to you. For covered calls and basic options buying, a cash account may be sufficient. For spreads — the systematic income engine this framework is built around — you need margin.",
      "Apply for a margin account. Understand what it is. Use it as collateral infrastructure, not as borrowed capital.",
    ],
  },
  {
    id: "level",
    eyebrow: "Requirement Three",
    title: "The Right Options Approval Level",
    body: [
      "Every broker uses a tier system to approve traders for progressively more complex options strategies. The names differ across platforms. The structure is the same everywhere.",
      "The progression typically looks like this: the first tier allows covered calls and basic strategies. The second tier adds the ability to buy puts and calls outright. The third tier — the one you need — unlocks defined-risk spreads.",
      "To get approved, your broker will ask about your investing experience, your income, your net worth, and your understanding of options risk. Answer honestly. If you have done any options trading at all, or if you have studied the subject seriously, say so. If you have a plan and understand that spreads involve defined, bounded risk, say that too.",
      "Approval is not a test of your net worth. It is a test of whether you understand what you are doing. If you have read this far, you are already ahead of most applicants.",
    ],
  },
  {
    id: "howmuch",
    eyebrow: "The Honest Conversation",
    title: "How Much Money Do You Actually Need?",
    pullquote: "The framework works at any size. What matters is that a single loss does not change your life.",
    body: [
      "The minimum account balance gets you in the door. Trading sensibly requires more than the minimum. Here is an honest breakdown of what different account sizes make possible — and what you should actually do at each level.",
    ],
  },
  {
    id: "pdt",
    eyebrow: "One Rule Worth Knowing",
    title: "The Pattern Day Trader Rule",
    body: [
      "In the United States, if your account holds less than $25,000, you are limited to three day trades — opening and closing a position on the same day — within any five-business-day period.",
      "For a spread seller who holds positions for 30 to 45 days, this rule rarely matters. You are not day trading. You open a position, you manage it over weeks, you close it when the framework says to.",
      "But know the rule exists. If you ever need to close a position quickly — because delta has spiked, because the market moved unexpectedly, because a rule violation demands immediate action — you want to know in advance whether you have day trades available.",
      "Know your count. It costs nothing to track it.",
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
      "There is no rush. The market will be open tomorrow, and next week, and next month. The traders who succeed are not the ones who started fastest — they are the ones who started most prepared.",
      "Work through this checklist. The first four are logistical — account setup. The last two are knowledge. Both matter.",
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
      "Most readers continue to Module 1 — Stocks. If you already understand stocks and want to get to the options mechanics quickly, start with Module 2.",
    ],
    cta: true,
  },
];

const ACCOUNT_TIERS = [
  { range: "$2,000–$4,999", color: "#4a9eff", reality: "You can trade. Positions are small. One loss is meaningful.", recommendation: "Paper trade until profitable for 30 days, then go live with single positions only." },
  { range: "$5,000–$9,999", color: "#22c55e", reality: "Breathing room. Two to three positions simultaneously. The framework begins to show its edge.", recommendation: "Start live with one position at a time. Add a second only after three consecutive winners." },
  { range: "$10,000–$24,999", color: "#c9a84c", reality: "The framework works well here. Multiple positions, proper diversification, meaningful income possible.", recommendation: "Run two to four simultaneous positions. Follow full position-sizing rules — 5% max risk per trade." },
  { range: "$25,000+", color: "#f97316", reality: "PDT rule irrelevant. Full strategy available. Tier 1 covered calls generate serious income.", recommendation: "Full framework. Diversify across sectors. Consider adding covered calls on conviction stock holdings." },
];

const NEXT_MODULES = [
  { id: "stocks", label: "Module 1", title: "Stocks", desc: "What to own, why it matters, and how to build a position.", recommended: true },
  { id: "options", label: "Module 2", title: "Options", desc: "Puts, calls, and why the contract is your most powerful tool.", recommended: false },
  { id: "philosophy", label: "Module 7", title: "Philosophy & Temperament", desc: "Why options — and the real trades that built this framework.", recommended: false },
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

function usePersistedChecklist(key) {
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key) || "{}"); }
    catch { return {}; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(checked)); } catch {}
  }, [checked, key]);
  const toggle = useCallback((id) => setChecked(prev => ({ ...prev, [id]: !prev[id] })), []);
  return [checked, toggle];
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

function ChecklistItem({ item, checked, onToggle }) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      aria-label={`${item.label}: ${item.detail}`}
      onClick={() => onToggle(item.id)}
      onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); onToggle(item.id); } }}
      style={{ display: "flex", alignItems: "flex-start", gap: 16, width: "100%", padding: "16px 18px", borderRadius: 10, cursor: "pointer", background: checked ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${checked ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.06)"}`, marginBottom: 8, transition: "all 0.2s", fontFamily: "inherit", textAlign: "left", outline: "none" }}
    >
      <div style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", marginTop: 1, background: checked ? "#22c55e" : "transparent", border: `1.5px solid ${checked ? "#22c55e" : "rgba(255,255,255,0.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
        {checked && <span style={{ fontSize: 11, color: "#000", fontWeight: "bold" }}>✓</span>}
      </div>
      <div>
        <div style={{ fontSize: 14, color: checked ? "#22c55e" : "#d0ccc8", marginBottom: 4, transition: "color 0.2s" }}>{item.label}</div>
        <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{item.detail}</div>
      </div>
    </button>
  );
}

export default function Module00({ onBack, onNavigate }) {
  const progress = useReadingProgress();
  const { activeIndex, refs } = useSectionProgress();
  const [checked, toggleCheck] = usePersistedChecklist("st-getting-started-checklist");

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const logisticalDone = ["broker", "fund", "margin", "level"].every(id => checked[id]);

  return (
    <div className="st-getting-started" style={{ minHeight: "100vh", background: "#09090d", color: "#e8e4df", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", maxWidth: 680, margin: "0 auto", position: "relative" }}>

      <div role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress" style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 100, background: "rgba(255,255,255,0.04)" }}>
        <div style={{ height: "100%", background: "#4a9eff", width: `${progress}%`, transition: "width 0.1s linear" }} />
      </div>

      <div style={{ position: "fixed", top: 16, left: 16, right: 16, zIndex: 99, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {onBack && (
          <button onClick={onBack} aria-label="Back to Learn Hub" style={{ background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "6px 14px", cursor: "pointer", color: "#777", fontSize: 12, fontFamily: "inherit" }}>← Back</button>
        )}
        <div style={{ background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4a9eff" }} />
          <span style={{ fontSize: 10, color: "#4a9eff", letterSpacing: 2 }}>BEFORE YOU BEGIN</span>
        </div>
      </div>

      <div style={{ padding: "80px 32px 64px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <FadeSection>
          <div style={{ fontSize: 10, color: "#4a9eff", letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>Spread Therapy · Getting Started</div>
        </FadeSection>
        <FadeSection delay={100}>
          <h1 style={{ fontSize: "clamp(32px, 7vw, 52px)", fontWeight: "normal", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24, color: "#f5f1eb" }}>Before You Begin</h1>
        </FadeSection>
        <FadeSection delay={200}>
          <p style={{ fontSize: 18, color: "#777", lineHeight: 1.7, fontStyle: "italic", maxWidth: 480, borderLeft: "2px solid rgba(74,158,255,0.3)", paddingLeft: 20 }}>
            Three requirements. An honest conversation about money. And six things to do before your first real trade.
          </p>
        </FadeSection>
        <FadeSection delay={300}>
          <div style={{ display: "flex", gap: 20, marginTop: 32 }}>
            {[["5 min read", "◷"], ["Platform agnostic", "◎"], ["Start here", "◈"]].map(([label, icon]) => (
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
                <div style={{ fontSize: 10, color: "#4a9eff", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>{section.eyebrow}</div>
              )}

              <h2 style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: "normal", lineHeight: 1.2, letterSpacing: "-0.01em", color: "#f0ede8", marginBottom: 24 }}>{section.title}</h2>

              {section.pullquote && (
                <div style={{ margin: "0 0 28px", padding: "18px 22px", background: "rgba(74,158,255,0.05)", borderLeft: "3px solid #4a9eff", borderRadius: "0 8px 8px 0" }}>
                  <p style={{ fontSize: 17, color: "#4a9eff", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>"{section.pullquote}"</p>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {section.body.map((para, pi) => (
                  <p key={pi} style={{ fontSize: 16, lineHeight: 1.85, color: pi === 0 ? "#c8c4be" : "#888", margin: 0 }}>{para}</p>
                ))}
              </div>

              {section.id === "opening" && (
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

              {section.id === "level" && (
                <FadeSection delay={100}>
                  <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { tier: "Tier 1", label: "Covered calls · Basic strategies", color: "#4a9eff", yours: false },
                      { tier: "Tier 2", label: "Buying puts and calls outright", color: "#22c55e", yours: false },
                      { tier: "Tier 3", label: "Defined-risk spreads", color: "#c9a84c", yours: true },
                    ].map(t => (
                      <div key={t.tier} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", borderRadius: 8, background: t.yours ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${t.yours ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.05)"}` }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 11, color: t.color, letterSpacing: 1 }}>{t.tier}</span>
                          <span style={{ fontSize: 13, color: t.yours ? "#d0ccc8" : "#555", marginLeft: 12 }}>{t.label}</span>
                        </div>
                        {t.yours && (
                          <span style={{ fontSize: 9, color: "#c9a84c", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", padding: "2px 10px", borderRadius: 10, letterSpacing: 1, flexShrink: 0 }}>YOU NEED THIS</span>
                        )}
                      </div>
                    ))}
                  </div>
                </FadeSection>
              )}

              {section.id === "howmuch" && (
                <FadeSection delay={100}>
                  <div style={{ margin: "28px 0" }}>
                    {ACCOUNT_TIERS.map((tier, i) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", borderBottom: i < ACCOUNT_TIERS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", padding: "16px 0", gap: 16, alignItems: "start" }}>
                        <div style={{ fontSize: 13, color: tier.color, fontFamily: "monospace" }}>{tier.range}</div>
                        <div>
                          <div style={{ fontSize: 13, color: "#777", lineHeight: 1.6, marginBottom: 6 }}>{tier.reality}</div>
                          <div style={{ fontSize: 12, color: tier.color, lineHeight: 1.5, fontStyle: "italic" }}>{tier.recommendation}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 13, color: "#444", fontStyle: "italic", lineHeight: 1.6 }}>
                    These ranges reflect the practical reality of running a systematic income framework. Your broker's minimum account balance is a floor — not a recommendation.
                  </p>
                </FadeSection>
              )}

              {section.checklist && (
                <FadeSection delay={100}>
                  <div style={{ marginTop: 28 }} role="group" aria-label="Getting started checklist">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                      <span style={{ fontSize: 10, color: "#555", letterSpacing: 2 }}>YOUR PROGRESS</span>
                      <span style={{ fontSize: 10, color: checkedCount === CHECKLIST_ITEMS.length ? "#22c55e" : "#555" }}>{checkedCount} / {CHECKLIST_ITEMS.length} complete</span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 2, height: 2, marginBottom: 20 }}>
                      <div style={{ background: "#22c55e", height: 2, borderRadius: 2, width: `${(checkedCount / CHECKLIST_ITEMS.length) * 100}%`, transition: "width 0.4s ease" }} />
                    </div>

                    <div style={{ fontSize: 10, color: "#444", letterSpacing: 1, marginBottom: 10 }}>ACCOUNT SETUP — DO THESE FIRST</div>
                    {CHECKLIST_ITEMS.filter(i => i.logistical).map(item => (
                      <ChecklistItem key={item.id} item={item} checked={!!checked[item.id]} onToggle={toggleCheck} />
                    ))}

                    <div style={{ fontSize: 10, color: logisticalDone ? "#4a9eff" : "#333", letterSpacing: 1, margin: "16px 0 10px", transition: "color 0.3s" }}>
                      {logisticalDone ? "ACCOUNT READY — NOW BUILD YOUR KNOWLEDGE" : "ONCE YOUR ACCOUNT IS SET UP"}
                    </div>
                    {CHECKLIST_ITEMS.filter(i => !i.logistical).map(item => (
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

              {section.cta && (
                <div style={{ marginTop: 44 }}>
                  <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 18 }}>Continue to the next module</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {NEXT_MODULES.map(mod => (
                      <button key={mod.id} onClick={() => onNavigate?.(mod.id)} aria-label={`Go to ${mod.title}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderRadius: 10, cursor: "pointer", background: mod.recommended ? "rgba(74,158,255,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${mod.recommended ? "rgba(74,158,255,0.35)" : "rgba(255,255,255,0.06)"}`, textAlign: "left", fontFamily: "inherit", transition: "all 0.18s", outline: "none", width: "100%" }}>
                        <div>
                          <div style={{ fontSize: 9, color: mod.recommended ? "#4a9eff" : "#444", letterSpacing: 2, marginBottom: 4 }}>{mod.label}{mod.recommended && " · RECOMMENDED"}</div>
                          <div style={{ fontSize: 15, color: mod.recommended ? "#f0ede8" : "#888" }}>{mod.title}</div>
                          <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>{mod.desc}</div>
                        </div>
                        <span style={{ fontSize: 18, color: mod.recommended ? "#4a9eff" : "#333" }}>→</span>
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "#444", marginTop: 14, fontStyle: "italic" }}>
                    Already own stocks? Skip to Module 2. Want the philosophical foundation first? Try Module 7.
                  </p>
                </div>
              )}
            </div>
          </FadeSection>
        ))}
      </div>

      <div style={{ position: "fixed", left: "max(16px, calc(50% - 380px))", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 6, opacity: 0.3 }}>
        {SECTIONS.map((s, i) => (
          <div key={s.id} style={{ width: 3, height: i <= activeIndex ? 18 : 7, background: "#4a9eff", borderRadius: 2, transition: "height 0.3s ease", opacity: i <= activeIndex ? 1 : 0.3 }} />
        ))}
      </div>

      <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 9, color: "#222", letterSpacing: 2 }}>SPREAD THERAPY · BEFORE YOU BEGIN</div>
        <div style={{ fontSize: 9, color: "#222" }}>Not financial advice</div>
      </div>

      <style>{`
        .st-getting-started * { box-sizing: border-box; }
        .st-getting-started p, .st-getting-started h1, .st-getting-started h2, .st-getting-started button { margin: 0; }
        .st-getting-started button:focus-visible { outline: 2px solid #4a9eff; outline-offset: 2px; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
