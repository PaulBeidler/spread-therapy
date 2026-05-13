import { useState, useCallback, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Module00 from "./modules/Module00.jsx";
import Module01 from "./modules/Module01.jsx";
import Module02 from "./modules/Module02.jsx";
import Module03 from "./modules/Module03.jsx";
import Module04 from "./modules/Module04.jsx";
import Module05 from "./modules/Module05.jsx";
import Module06 from "./modules/Module06.jsx";
import Module07 from "./modules/Module07.jsx";
import Coach from "./Coach.jsx";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const T = {
  bg:"#0c0c10",surface:"rgba(255,255,255,0.025)",border:"rgba(255,255,255,0.07)",
  gold:"#c9a84c",goldDim:"rgba(201,168,76,0.12)",goldBorder:"rgba(201,168,76,0.25)",
  text:"#f0ede8",mid:"#888",dim:"#444",green:"#22c55e",blue:"#4a9eff",
  purple:"#a855f7",orange:"#f97316",red:"#ef4444",amber:"#f59e0b",teal:"#06b6d4",
};

const QUIZ_PROMPT=`You are the Spread Therapy options knowledge assessment engine.
Generate exactly ONE multiple choice question about options trading.
DIFFICULTY SCALE (1-10):
1-2: Pure basics, 3-4: Intermediate basics, 5-6: Mechanics, 7-8: Advanced, 9-10: Expert
DOMAINS: basics, pricing, greeks, spreads, assignment, tax, risk_management, strategy
TICKER ROTATION: Use a DIFFERENT ticker every question from:
RUTW,NVDA,AAPL,RTX,IONQ,XSP,TSLA,AMD,LMT,PLTR,RUT,AMZN,INTC,CAT,COIN,GOOGL,AVGO,META,MSFT,SPY
NEVER use MU. Use the ticker specified in the request.
Respond ONLY with valid JSON:
{"question":"string","options":["A. ...","B. ...","C. ...","D. ..."],"correct":"A","domain":"string","difficulty":5,"explanation":"string","concept":"string","ticker":"string"}`;

const TICKER_POOL=["RUTW","NVDA","AAPL","RTX","IONQ","XSP","TSLA","AMD","LMT","PLTR","RUT","AMZN","INTC","CAT","COIN","GOOGL","AVGO","META","MSFT","SPY"];
const DOMAINS=["basics","pricing","greeks","spreads","assignment","tax","risk_management","strategy"];
const TOTAL_Q=15;

const TYPE_COLOR={covered_call:T.green,bull_put:T.blue,bear_call:T.purple,naked_put:T.orange,leap:T.gold,wheel:T.teal};
const TYPE_LABEL={covered_call:"Covered Call",bull_put:"Bull Put",bear_call:"Bear Call",naked_put:"Naked Put",leap:"LEAP Shield",wheel:"Wheel"};
const HEALTH_COLOR={green:T.green,yellow:T.amber,red:T.red};

const fmtK=(n)=>{if(n==null)return"—";const abs=Math.abs(n);const s=abs>=10000?`${(abs/1000).toFixed(0)}K`:abs>=1000?`${(abs/1000).toFixed(1)}K`:`${abs}`;return n>=0?`+$${s}`:`-$${s}`;};
const fmtFull=(n)=>{if(n==null)return"—";const abs=Math.abs(Math.round(n)).toLocaleString();return n>=0?`+$${abs}`:`-$${abs}`;};

function updateAbility(a,d,c){const p=1/(1+Math.exp(-(a-d)));return a+0.5*((c?1:0)-p);}
function abilityToScore(a){return Math.max(0,Math.min(100,Math.round(((a+3)/6)*100)));}
function nextDiff(a){return Math.max(1,Math.min(10,Math.round(a+5)));}
function getLevel(s){
  if(s<30)return{label:"Beginner",color:T.blue,icon:"◎"};
  if(s<55)return{label:"Developing",color:T.green,icon:"◑"};
  if(s<75)return{label:"Intermediate",color:T.gold,icon:"◕"};
  if(s<90)return{label:"Advanced",color:T.orange,icon:"●"};
  return{label:"Expert",color:T.purple,icon:"★"};
}

async function genQuestion(difficulty,domain,history,tickerIdx){
  const ticker=TICKER_POOL[tickerIdx%TICKER_POOL.length];
  const used=history.map(h=>h.ticker).filter(Boolean);
  const histStr=history.length>0?`\nDo NOT repeat: ${history.map(h=>h.concept).join(", ")}\nUsed tickers: ${used.join(", ")}`:"";
  const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:QUIZ_PROMPT,messages:[{role:"user",content:`Difficulty ${difficulty}, domain: ${domain}, ticker: ${ticker}.${histStr}`}]})});
  const data=await res.json();
  return JSON.parse((data.content?.[0]?.text||"").replace(/```json|```/g,"").trim());
}

const Tag=({label,color})=><span style={{fontSize:9,letterSpacing:1,color:color||T.gold,background:`${color||T.gold}18`,padding:"2px 8px",borderRadius:10,border:`1px solid ${color||T.gold}30`}}>{label}</span>;
const SectionHead=({title,color,count})=><div style={{fontSize:10,color:color||T.dim,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>{title}{count!=null?` · ${count}`:""}</div>;

// ── NEW CAMPAIGN FORM ─────────────────────────────────────────────────────────
const STRATEGIES=[
  {id:"covered_call",label:"Covered Call",icon:"📞",desc:"Own shares, sell calls above"},
  {id:"bull_put",label:"Bull Put Spread",icon:"🐂",desc:"Sell put spread below market"},
  {id:"bear_call",label:"Bear Call Spread",icon:"🐻",desc:"Sell call spread above market"},
  {id:"naked_put",label:"Naked Put",icon:"⚡",desc:"Sell put, accept assignment risk"},
  {id:"leap",label:"LEAP Shield",icon:"🛡",desc:"Debit put spread as crash hedge"},
  {id:"wheel",label:"The Wheel",icon:"🎡",desc:"Naked put → covered call cycle"},
];

function NewCampaignForm({userId,onSave,onCancel}){
  const [ticker,setTicker]=useState("");
  const [type,setType]=useState("");
  const [tier,setTier]=useState("");
  const [thesis,setThesis]=useState("");
  const [strikes,setStrikes]=useState("");
  const [dteApprox,setDteApprox]=useState("");
  const [otmPct,setOtmPct]=useState("");
  const [delta,setDelta]=useState("");
  const [netPremium,setNetPremium]=useState("");
  const [emotionOpen,setEmotionOpen]=useState("");
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState(null);

  const handleSave=async()=>{
    if(!ticker||!type){setError("Ticker and strategy are required.");return;}
    setSaving(true);setError(null);
    const{error}=await supabase.from("campaigns").insert({
      user_id:userId,
      ticker:ticker.toUpperCase(),
      type,
      tier:tier?parseInt(tier):null,
      thesis:thesis||null,
      strikes:strikes||null,
      dte_approx:dteApprox?parseInt(dteApprox):null,
      otm_pct:otmPct?parseFloat(otmPct):null,
      delta:delta?parseFloat(delta):null,
      net_premium:netPremium?parseFloat(netPremium):null,
      emotion_open:emotionOpen||null,
      health:"green",
      status:"active",
    });
    setSaving(false);
    if(error){setError(error.message);return;}
    onSave();
  };

  const inputStyle={width:"100%",boxSizing:"border-box",background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"11px 14px",color:T.text,fontSize:13,fontFamily:"Georgia,serif",outline:"none"};
  const labelStyle={fontSize:10,color:T.dim,letterSpacing:2,marginBottom:6,display:"block"};

  return(
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"Georgia,serif",maxWidth:480,margin:"0 auto"}}>
      <div style={{padding:"18px 18px 14px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,background:T.bg,zIndex:10}}>
        <button onClick={onCancel} style={{background:"none",border:"none",color:T.gold,fontSize:20,cursor:"pointer"}}>←</button>
        <div style={{fontSize:18,fontWeight:"bold"}}>Log a Campaign</div>
      </div>
      <div style={{padding:"20px 18px 100px"}}>

        <div style={{marginBottom:16}}>
          <label style={labelStyle}>TICKER</label>
          <input value={ticker} onChange={e=>setTicker(e.target.value.toUpperCase())} placeholder="e.g. RUTW, MU, LMT" style={inputStyle}/>
        </div>

        <div style={{marginBottom:16}}>
          <label style={labelStyle}>STRATEGY</label>
          {STRATEGIES.map(s=>(
            <button key={s.id} onClick={()=>setType(s.id)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"11px 14px",borderRadius:9,marginBottom:6,cursor:"pointer",background:type===s.id?T.goldDim:T.surface,border:`1px solid ${type===s.id?T.goldBorder:T.border}`,textAlign:"left",fontFamily:"Georgia,serif"}}>
              <span style={{fontSize:18}}>{s.icon}</span>
              <div>
                <div style={{fontSize:13,color:type===s.id?T.gold:"#ccc"}}>{s.label}</div>
                <div style={{fontSize:10,color:T.dim}}>{s.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          <div>
            <label style={labelStyle}>STRIKES / CALL</label>
            <input value={strikes} onChange={e=>setStrikes(e.target.value)} placeholder="e.g. 2735/2715" style={inputStyle}/>
          </div>
          <div>
            <label style={labelStyle}>DTE</label>
            <input type="number" value={dteApprox} onChange={e=>setDteApprox(e.target.value)} placeholder="45" style={inputStyle}/>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
          <div>
            <label style={labelStyle}>OTM %</label>
            <input type="number" value={otmPct} onChange={e=>setOtmPct(e.target.value)} placeholder="5.2" style={inputStyle}/>
          </div>
          <div>
            <label style={labelStyle}>DELTA</label>
            <input type="number" value={delta} onChange={e=>setDelta(e.target.value)} placeholder="0.18" style={inputStyle}/>
          </div>
          <div>
            <label style={labelStyle}>PREMIUM $</label>
            <input type="number" value={netPremium} onChange={e=>setNetPremium(e.target.value)} placeholder="290" style={inputStyle}/>
          </div>
        </div>

        <div style={{marginBottom:16}}>
          <label style={labelStyle}>TIER (optional)</label>
          <div style={{display:"flex",gap:8}}>
            {[["1","Covered Calls"],["2","Bull Puts"],["3","Bear Calls"],["4","LEAP"]].map(([t,l])=>(
              <button key={t} onClick={()=>setTier(tier===t?"":t)} style={{flex:1,padding:"9px 4px",background:tier===t?T.goldDim:T.surface,border:`1px solid ${tier===t?T.goldBorder:T.border}`,borderRadius:8,color:tier===t?T.gold:T.dim,fontSize:10,cursor:"pointer",fontFamily:"Georgia,serif"}}>
                <div>{t}</div>
                <div style={{fontSize:8,marginTop:2}}>{l}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{marginBottom:16}}>
          <label style={labelStyle}>YOUR THESIS (optional)</label>
          <textarea value={thesis} onChange={e=>setThesis(e.target.value)} placeholder="Why are you entering this campaign?" rows={3} style={{...inputStyle,resize:"none"}}/>
        </div>

        <div style={{marginBottom:20}}>
          <label style={labelStyle}>HOW DO YOU FEEL ENTERING THIS?</label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[["😊","Confident"],["😤","Cautious"],["😰","Uncertain"],["🤔","Mixed"],["😌","Calm"]].map(([emoji,label])=>(
              <button key={label} onClick={()=>setEmotionOpen(emotionOpen===label?"":label)} style={{padding:"7px 12px",borderRadius:20,background:emotionOpen===label?T.goldDim:T.surface,border:`1px solid ${emotionOpen===label?T.goldBorder:T.border}`,color:emotionOpen===label?T.gold:T.mid,fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif"}}>
                {emoji} {label}
              </button>
            ))}
          </div>
          <div style={{fontSize:10,color:T.dim,marginTop:6}}>We'll ask again at close. The comparison becomes data.</div>
        </div>

        {error&&<div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:12,color:T.red}}>{error}</div>}
      </div>

      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"rgba(12,12,16,0.97)",backdropFilter:"blur(12px)",borderTop:`1px solid ${T.border}`,padding:"14px 18px",display:"flex",gap:10}}>
        <button onClick={onCancel} style={{padding:"13px 18px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:9,color:T.dim,fontSize:13,cursor:"pointer",fontFamily:"Georgia,serif"}}>Cancel</button>
        <button onClick={handleSave} disabled={saving||!ticker||!type} style={{flex:1,padding:"13px",background:ticker&&type?"rgba(34,197,94,0.1)":"transparent",border:`1px solid ${ticker&&type?"rgba(34,197,94,0.3)":T.border}`,borderRadius:9,color:ticker&&type?T.green:T.dim,fontSize:13,cursor:ticker&&type?"pointer":"default",fontFamily:"Georgia,serif"}}>
          {saving?"Saving...":"Launch campaign ✓"}
        </button>
      </div>
    </div>
  );
}

// ── CAMPAIGN CARD ─────────────────────────────────────────────────────────────
function CampaignCard({c,onSelect}){
  const tc=TYPE_COLOR[c.type]||T.mid;
  const hc=HEALTH_COLOR[c.health]||T.mid;
  const pnl=c.true_pnl??c.net_premium;
  return(
    <div onClick={()=>onSelect(c)} style={{background:T.surface,border:`1px solid ${T.border}`,borderLeft:`3px solid ${tc}`,borderRadius:10,padding:"13px 14px",marginBottom:8,cursor:"pointer",position:"relative"}}>
      <div style={{position:"absolute",top:12,right:12,width:8,height:8,borderRadius:"50%",background:hc,boxShadow:c.health==="red"?`0 0 8px ${hc}`:"none"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginRight:18}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
            <span style={{fontSize:15,fontWeight:"bold",color:T.text}}>{c.ticker}</span>
            <Tag label={TYPE_LABEL[c.type]||c.type} color={tc}/>
            {c.tier==null&&c.type==="naked_put"&&<Tag label="ROGUE" color={T.red}/>}
          </div>
          <div style={{fontSize:11,color:T.dim}}>{c.strikes||c.current_call||"—"} · {c.dte_approx||"—"} DTE</div>
        </div>
        {pnl!=null&&<div style={{textAlign:"right"}}><div style={{fontSize:15,fontFamily:"monospace",color:pnl>=0?T.green:T.red}}>{fmtK(pnl)}</div><div style={{fontSize:9,color:T.dim}}>{c.true_pnl!=null?"true P&L":"net premium"}</div></div>}
      </div>
      <div style={{display:"flex",gap:14,marginTop:7}}>
        {c.delta!=null&&<span style={{fontSize:10,color:Math.abs(c.delta)>0.30?T.red:T.dim}}>Δ {Math.abs(c.delta).toFixed(3)}{Math.abs(c.delta)>0.30?" ⚠":""}</span>}
        {c.otm_pct&&<span style={{fontSize:10,color:T.dim}}>{c.otm_pct}% OTM</span>}
      </div>
      {c.alert&&<div style={{marginTop:8,padding:"6px 10px",background:`${hc}12`,borderRadius:6,fontSize:10,color:hc,lineHeight:1.4}}>{c.alert}</div>}
    </div>
  );
}

// ── CAMPAIGN DETAIL ───────────────────────────────────────────────────────────
function CampaignDetail({c,onBack,onClose}){
  const tc=TYPE_COLOR[c.type]||T.mid;
  const hc=HEALTH_COLOR[c.health]||T.mid;
  const pnl=c.true_pnl??c.net_premium;
  const [closing,setClosing]=useState(false);

  const handleClose=async()=>{
    setClosing(true);
    await supabase.from("campaigns").update({status:"closed",closed_at:new Date().toISOString()}).eq("id",c.id);
    setClosing(false);
    onClose();
  };

  return(
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"Georgia,serif",maxWidth:480,margin:"0 auto"}}>
      <div style={{padding:"18px 18px 14px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,background:T.bg,zIndex:10}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:T.gold,fontSize:20,cursor:"pointer"}}>←</button>
        <div><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18,fontWeight:"bold"}}>{c.ticker}</span><Tag label={TYPE_LABEL[c.type]||c.type} color={tc}/></div><div style={{fontSize:11,color:T.dim}}>{c.status} · added {new Date(c.created_at).toLocaleDateString()}</div></div>
      </div>
      <div style={{padding:"18px 18px 80px"}}>
        {pnl!=null&&<div style={{background:pnl>=0?"rgba(34,197,94,0.06)":"rgba(239,68,68,0.06)",border:`1px solid ${pnl>=0?T.green:T.red}30`,borderRadius:14,padding:"18px 20px",marginBottom:16,textAlign:"center"}}>
          <div style={{fontSize:11,color:T.dim,letterSpacing:2,marginBottom:4}}>{c.true_pnl!=null?"TRUE CAMPAIGN P&L":"NET PREMIUM"}</div>
          <div style={{fontSize:36,fontWeight:"bold",fontFamily:"monospace",color:pnl>=0?T.green:T.red}}>{fmtFull(pnl)}</div>
        </div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
          {[["DTE",c.dte_approx||"—"],["OTM",c.otm_pct?`${c.otm_pct}%`:"—"],["Delta",c.delta!=null?Math.abs(c.delta).toFixed(3):"—"],["Status",c.status]].map(([l,v])=>(
            <div key={l} style={{background:T.surface,borderRadius:8,padding:"10px 12px"}}><div style={{fontSize:9,color:T.dim,letterSpacing:2,marginBottom:3}}>{l}</div><div style={{fontSize:16,color:T.text,fontFamily:"monospace"}}>{v}</div></div>
          ))}
        </div>
        {c.thesis&&<div style={{borderLeft:`2px solid ${T.goldBorder}`,paddingLeft:12,marginBottom:16,fontSize:12,color:T.mid,fontStyle:"italic",lineHeight:1.5}}>"{c.thesis}"</div>}
        {c.alert&&<div style={{background:`${hc}10`,border:`1px solid ${hc}30`,borderRadius:10,padding:12,marginBottom:16}}><div style={{fontSize:10,color:hc,letterSpacing:2,marginBottom:4}}>ALERT</div><div style={{fontSize:12,color:hc,lineHeight:1.5}}>{c.alert}</div></div>}
        {c.status==="active"&&<button onClick={handleClose} disabled={closing} style={{width:"100%",padding:"13px",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:9,color:T.red,fontSize:13,cursor:"pointer",fontFamily:"Georgia,serif",marginTop:8}}>
          {closing?"Closing...":"Close this campaign"}
        </button>}
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({userId,onSelectCampaign,onNewCampaign}){
  const [campaigns,setCampaigns]=useState([]);
  const [loading,setLoading]=useState(true);
  const [tab,setTab]=useState("active");

  const loadCampaigns=useCallback(async()=>{
    setLoading(true);
    const{data}=await supabase.from("campaigns").select("*").eq("user_id",userId).order("created_at",{ascending:false});
    setCampaigns(data||[]);
    setLoading(false);
  },[userId]);

  useEffect(()=>{loadCampaigns();},[loadCampaigns]);

  const active=campaigns.filter(c=>c.status==="active");
  const closed=campaigns.filter(c=>c.status==="closed");
  const alerts=active.filter(c=>c.health!=="green");
  const healthy=active.filter(c=>c.health==="green");

  return(
    <div style={{paddingBottom:80}}>
      {/* Header */}
      <div style={{padding:"20px 18px 14px",background:`linear-gradient(180deg,${T.goldDim} 0%,transparent 100%)`,borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:22,fontWeight:"bold",letterSpacing:-0.5}}>Good morning.</div>
            <div style={{fontSize:11,color:T.dim,marginTop:1}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</div>
          </div>
          <button onClick={onNewCampaign} style={{padding:"8px 14px",background:T.goldDim,border:`1px solid ${T.goldBorder}`,borderRadius:20,color:T.gold,fontSize:11,cursor:"pointer",fontFamily:"Georgia,serif"}}>
            + Log trade
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${T.border}`}}>
        {[["active",`Active (${active.length})`],["closed",`Closed (${closed.length})`]].map(([id,l])=>(
          <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"11px 4px",fontSize:10,letterSpacing:1.5,textTransform:"uppercase",background:"none",border:"none",cursor:"pointer",color:tab===id?T.gold:T.dim,borderBottom:tab===id?`1px solid ${T.gold}`:"1px solid transparent",fontFamily:"Georgia,serif",transition:"all 0.2s"}}>{l}</button>
        ))}
      </div>

      <div style={{padding:"14px 16px"}}>
        {loading&&<div style={{textAlign:"center",padding:"40px 20px",color:T.dim,fontSize:13}}>Loading campaigns...</div>}

        {!loading&&tab==="active"&&<>
          {active.length===0?(
            <div style={{textAlign:"center",padding:"48px 20px"}}>
              <div style={{fontSize:36,marginBottom:16}}>◎</div>
              <div style={{fontSize:16,fontWeight:"bold",marginBottom:8}}>No active campaigns</div>
              <div style={{fontSize:13,color:T.dim,lineHeight:1.6,marginBottom:24}}>Log your first trade to start tracking your true P&L — the number your brokerage never shows you.</div>
              <button onClick={onNewCampaign} style={{padding:"13px 28px",background:T.goldDim,border:`1px solid ${T.goldBorder}`,borderRadius:10,color:T.gold,fontSize:14,cursor:"pointer",fontFamily:"Georgia,serif"}}>
                Log your first campaign →
              </button>
            </div>
          ):(
            <>
              {alerts.length>0&&<><SectionHead title="Needs Attention" color={T.red} count={alerts.length}/>{alerts.map(c=><CampaignCard key={c.id} c={c} onSelect={onSelectCampaign}/>)}<div style={{marginBottom:14}}/></>}
              {healthy.length>0&&<><SectionHead title="All Clear" color={T.green} count={healthy.length}/>{healthy.map(c=><CampaignCard key={c.id} c={c} onSelect={onSelectCampaign}/>)}</>}
              <button onClick={onNewCampaign} style={{width:"100%",marginTop:16,padding:"12px",background:"transparent",border:`1px dashed ${T.border}`,borderRadius:9,color:T.dim,fontSize:13,cursor:"pointer",fontFamily:"Georgia,serif"}}>+ Log another campaign</button>
            </>
          )}
        </>}

        {!loading&&tab==="closed"&&<>
          {closed.length===0?(
            <div style={{textAlign:"center",padding:"48px 20px",color:T.dim,fontSize:13}}>No closed campaigns yet.</div>
          ):(
            closed.map(c=><CampaignCard key={c.id} c={c} onSelect={onSelectCampaign}/>)
          )}
        </>}
      </div>
    </div>
  );
}

// ── QUIZ ──────────────────────────────────────────────────────────────────────
function Quiz(){
  const [phase,setPhase]=useState("intro");
  const [qNum,setQNum]=useState(0);
  const [current,setCurrent]=useState(null);
  const [next,setNext]=useState(null);
  const [loading,setLoading]=useState(false);
  const [selected,setSelected]=useState(null);
  const [revealed,setRevealed]=useState(false);
  const [ability,setAbility]=useState(0);
  const [history,setHistory]=useState([]);
  const [domainScores,setDomainScores]=useState(Object.fromEntries(DOMAINS.map(d=>[d,{correct:0,attempts:0}])));
  const [error,setError]=useState(null);
  const prefetchRef=useRef(null);
  const tickerIdx=useRef(0);

  const prefetchNext=useCallback((num,ab,hist,tIdx)=>{
    if(num>TOTAL_Q)return;
    const domain=DOMAINS[(num-1)%DOMAINS.length];
    setNext(null);
    const p=genQuestion(nextDiff(ab),domain,hist,tIdx).then(q=>{if(prefetchRef.current===p)setNext(q);}).catch(()=>{});
    prefetchRef.current=p;
  },[]);

  const loadQ=useCallback(async(num,ab,hist)=>{
    setLoading(true);setError(null);setSelected(null);setRevealed(false);setNext(null);
    try{
      const domain=DOMAINS[(num-1)%DOMAINS.length];
      const tIdx=tickerIdx.current;tickerIdx.current=tIdx+1;
      const q=await genQuestion(nextDiff(ab),domain,hist,tIdx);
      setCurrent(q);prefetchNext(num+1,ab,hist,tickerIdx.current);
    }catch{setError("Failed to load question. Try again.");}
    finally{setLoading(false);}
  },[prefetchNext]);

  const handleStart=()=>{tickerIdx.current=0;setPhase("quiz");setQNum(1);loadQ(1,0,[]);};
  const handleReveal=()=>{
    if(!selected||!current)return;
    setRevealed(true);
    const isCorrect=selected===current.correct;
    const newAb=updateAbility(ability,current.difficulty/2-2.5,isCorrect);
    const entry={concept:current.concept,domain:current.domain,difficulty:current.difficulty,ticker:current.ticker,correct:isCorrect};
    setAbility(newAb);
    const newHist=[...history,entry];setHistory(newHist);
    setDomainScores(prev=>({...prev,[current.domain]:{correct:prev[current.domain].correct+(isCorrect?1:0),attempts:prev[current.domain].attempts+1}}));
    prefetchNext(qNum+1,newAb,newHist,tickerIdx.current);
  };
  const handleNext=()=>{
    const n=qNum+1;
    if(n>TOTAL_Q){setPhase("result");return;}
    setQNum(n);setSelected(null);setRevealed(false);
    if(next){setCurrent(next);setNext(null);tickerIdx.current+=1;prefetchNext(n+1,ability,history,tickerIdx.current);}
    else loadQ(n,ability,history);
  };

  const score=abilityToScore(ability);
  const level=getLevel(score);
  const domainDisplay={basics:"Basics",pricing:"Pricing",greeks:"Greeks",spreads:"Spreads",assignment:"Assignment",tax:"Tax",risk_management:"Risk Mgmt",strategy:"Strategy"};

  if(phase==="intro")return(
    <div style={{padding:"24px 20px 80px"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:44,marginBottom:14}}>📊</div>
        <div style={{fontSize:22,fontWeight:"bold",marginBottom:8}}>Know your level.</div>
        <div style={{fontSize:13,color:T.dim,lineHeight:1.65,maxWidth:300,margin:"0 auto"}}>15 adaptive questions. AI-generated. Never the same quiz twice.</div>
      </div>
      {[["◎",T.blue,"Beginner","Sandbox mode."],["◑",T.green,"Developing","Paper trading."],["◕",T.gold,"Intermediate","Full platform."],["●",T.orange,"Advanced","All strategies."],["★",T.purple,"Expert","Framework contributor."]].map(([icon,color,label,desc])=>(
        <div key={label} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 12px",borderRadius:8,marginBottom:5,background:T.surface,border:`1px solid ${T.border}`}}>
          <span style={{fontSize:16,color}}>{icon}</span>
          <div><div style={{fontSize:12,color}}>{label}</div><div style={{fontSize:10,color:T.dim}}>{desc}</div></div>
        </div>
      ))}
      <button onClick={handleStart} style={{width:"100%",marginTop:24,padding:"15px",background:T.goldDim,border:`1px solid ${T.goldBorder}`,borderRadius:10,color:T.gold,fontSize:14,cursor:"pointer",fontFamily:"Georgia,serif"}}>Begin Assessment →</button>
    </div>
  );

  if(phase==="result")return(
    <div style={{padding:"0 0 60px"}}>
      <div style={{textAlign:"center",padding:"32px 20px 24px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{fontSize:72,fontWeight:"bold",fontFamily:"monospace",color:level.color,lineHeight:1}}>{score}</div>
        <div style={{fontSize:11,color:T.dim,marginBottom:16}}>out of 100</div>
        <div style={{display:"inline-flex",alignItems:"center",gap:10,background:`${level.color}15`,border:`1px solid ${level.color}40`,borderRadius:24,padding:"8px 20px"}}>
          <span style={{fontSize:18,color:level.color}}>{level.icon}</span>
          <span style={{fontSize:14,color:level.color}}>{level.label}</span>
        </div>
        <div style={{fontSize:12,color:T.dim,marginTop:12}}>{history.filter(h=>h.correct).length} of {TOTAL_Q} correct</div>
      </div>
      <div style={{padding:"20px"}}>
        <div style={{fontSize:10,color:T.dim,letterSpacing:2,marginBottom:12}}>BY DOMAIN</div>
        {Object.entries(domainScores).filter(([_,d])=>d.attempts>0).map(([domain,data])=>{
          const pct=Math.round((data.correct/data.attempts)*100);
          const bc=pct>=70?T.green:pct>=40?T.gold:T.red;
          return<div key={domain} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:T.mid}}>{domainDisplay[domain]}</span><span style={{fontSize:11,color:bc,fontFamily:"monospace"}}>{data.correct}/{data.attempts}</span></div>
            <div style={{background:"rgba(255,255,255,0.05)",borderRadius:2,height:2}}><div style={{background:bc,height:2,width:`${pct}%`,borderRadius:2}}/></div>
          </div>;
        })}
        <button onClick={()=>{setPhase("intro");setQNum(0);setCurrent(null);setNext(null);setSelected(null);setRevealed(false);setAbility(0);setHistory([]);setDomainScores(Object.fromEntries(DOMAINS.map(d=>[d,{correct:0,attempts:0}])));tickerIdx.current=0;}} style={{width:"100%",marginTop:16,padding:"12px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:8,color:T.dim,fontSize:13,cursor:"pointer",fontFamily:"Georgia,serif"}}>Retake assessment</button>
      </div>
    </div>
  );

  return(
    <div style={{padding:"18px 20px 80px"}}>
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:11,color:T.dim}}>Q {qNum} / {TOTAL_Q}</span><span style={{fontSize:11,color:level.color}}>{score}% · {level.label}</span></div>
        <div style={{background:"rgba(255,255,255,0.06)",borderRadius:2,height:2}}><div style={{background:level.color,height:2,width:`${(qNum/TOTAL_Q)*100}%`,transition:"width 0.5s ease",borderRadius:2}}/></div>
      </div>
      {loading&&<div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:28,marginBottom:14,animation:"spin 2s linear infinite"}}>◎</div><div style={{fontSize:12,color:T.dim}}>Calibrating to your level...</div><style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style></div>}
      {error&&<div style={{background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.18)",borderRadius:8,padding:14,textAlign:"center"}}><div style={{fontSize:12,color:T.red,marginBottom:10}}>{error}</div><button onClick={()=>loadQ(qNum,ability,history)} style={{padding:"9px 18px",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:6,color:T.red,fontSize:11,cursor:"pointer",fontFamily:"Georgia,serif"}}>Try again</button></div>}
      {!loading&&!error&&current&&<>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <span style={{fontSize:9,color:T.gold,background:T.goldDim,border:`1px solid ${T.goldBorder}`,padding:"2px 9px",borderRadius:8,letterSpacing:1}}>{current.domain?.replace("_"," ").toUpperCase()}</span>
          {current.ticker&&<span style={{fontSize:9,color:T.mid,background:T.surface,border:`1px solid ${T.border}`,padding:"2px 9px",borderRadius:8}}>{current.ticker}</span>}
        </div>
        <div style={{fontSize:14,color:T.text,lineHeight:1.7,marginBottom:20,padding:"16px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:10}}>{current.question}</div>
        <div style={{marginBottom:14}}>
          {current.options?.map(opt=>{
            const label=opt[0];
            let bg="transparent",border=T.border,color="#bbb";
            if(revealed){if(label===current.correct){bg="rgba(34,197,94,0.08)";border="rgba(34,197,94,0.35)";color=T.green;}else if(label===selected){bg="rgba(239,68,68,0.07)";border="rgba(239,68,68,0.25)";color=T.red;}else{color=T.dim;}}
            else if(selected===label){bg=T.goldDim;border=T.goldBorder;color=T.gold;}
            return<button key={label} onClick={()=>{if(!revealed)setSelected(label);}} disabled={revealed} style={{width:"100%",textAlign:"left",padding:"12px 14px",background:bg,border:`1px solid ${border}`,borderRadius:8,color,fontSize:13,cursor:revealed?"default":"pointer",fontFamily:"Georgia,serif",lineHeight:1.45,transition:"all 0.18s",marginBottom:7,display:"flex",gap:11}}>
              <span style={{flexShrink:0,width:20,height:20,borderRadius:"50%",background:revealed&&label===current.correct?T.green:revealed&&label===selected?T.red:"rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:"bold",color:(revealed&&(label===current.correct||label===selected))?"#000":color,marginTop:1}}>{label}</span>
              <span>{opt.slice(3)}</span>
            </button>;
          })}
        </div>
        {revealed&&<div style={{background:selected===current.correct?"rgba(34,197,94,0.05)":"rgba(239,68,68,0.05)",border:`1px solid ${selected===current.correct?"rgba(34,197,94,0.18)":"rgba(239,68,68,0.18)"}`,borderRadius:10,padding:14,marginBottom:12}}>
          <div style={{fontSize:11,color:selected===current.correct?T.green:T.red,fontWeight:"bold",marginBottom:5}}>{selected===current.correct?"✓ Correct":`✗ Incorrect — Answer: ${current.correct}`}</div>
          <div style={{fontSize:12,color:T.mid,lineHeight:1.6}}>{current.explanation}</div>
        </div>}
      </>}
      {!loading&&!error&&current&&<div style={{position:"fixed",bottom:60,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"rgba(12,12,16,0.97)",backdropFilter:"blur(12px)",borderTop:`1px solid ${T.border}`,padding:"12px 20px"}}>
        {!revealed
          ?<button onClick={handleReveal} disabled={!selected} style={{width:"100%",padding:"13px",background:selected?T.goldDim:"transparent",border:`1px solid ${selected?T.goldBorder:T.border}`,borderRadius:8,color:selected?T.gold:T.dim,fontSize:13,cursor:selected?"pointer":"default",fontFamily:"Georgia,serif"}}>{selected?"Confirm answer →":"Select an answer"}</button>
          :<button onClick={handleNext} style={{width:"100%",padding:"13px",background:T.goldDim,border:`1px solid ${T.goldBorder}`,borderRadius:8,color:T.gold,fontSize:13,cursor:"pointer",fontFamily:"Georgia,serif"}}>{qNum>=TOTAL_Q?"See results →":`Next (${qNum+1}/${TOTAL_Q}) →`}</button>
        }
      </div>}
    </div>
  );
}

// ── LEARN HUB ─────────────────────────────────────────────────────────────────
function LearnHub({onSelectModule}){
  const modules=[
    {id:"getting-started",label:"Before You Begin",desc:"Requirements, margin, approval levels.",color:T.blue,icon:"◈",time:"5 min",built:true},
    {id:"stocks",label:"Stocks",desc:"Evaluate, buy, hold. DCA, tax law.",color:T.green,icon:"◉",time:"8 min",built:true},
    {id:"options",label:"Options",desc:"Puts, calls, American vs European style.",color:T.teal,icon:"◎",time:"10 min",built:true},
    {id:"spreads",label:"Spreads",desc:"Bull/bear spreads, strike distance, IV.",color:T.gold,icon:"◑",time:"12 min",built:true},
    {id:"together",label:"How It All Works Together",desc:"Stocks + covered calls + spreads simultaneously.",color:T.purple,icon:"◕",time:"10 min",built:true},
    {id:"margin",label:"Margin & Capital Efficiency",desc:"Why spreads use less collateral.",color:T.orange,icon:"●",time:"8 min",built:true},
    {id:"pricing",label:"Pricing & Control",desc:"What your position is worth. How to change it.",color:T.amber,icon:"◆",time:"10 min",built:true},
    {id:"philosophy",label:"Options Philosophy",desc:"Why options. The MU story. The CAT story.",color:T.gold,icon:"★",time:"7 min",built:true},
  ];
  return(
    <div style={{padding:"18px 20px 80px"}}>
      <div style={{fontSize:12,color:T.dim,lineHeight:1.65,marginBottom:20}}>Seven modules. Start anywhere. The framework gets better the more you understand it.</div>
      {modules.map(m=>(
        <div key={m.id} onClick={()=>m.built&&onSelectModule(m.id)} style={{background:T.surface,border:`1px solid ${T.border}`,borderLeft:`3px solid ${m.color}`,borderRadius:10,padding:"14px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:m.built?"pointer":"default",opacity:m.built?1:0.5}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:18,color:m.color}}>{m.icon}</span>
            <div><div style={{fontSize:13,color:T.text}}>{m.label}</div><div style={{fontSize:11,color:T.dim,marginTop:2}}>{m.desc}</div></div>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:10,color:T.dim}}>◷ {m.time}</div>
            <div style={{fontSize:10,color:m.built?T.green:T.dim,marginTop:4}}>{m.built?"Available →":"Coming soon"}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function Login(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const handleLogin=async()=>{
    setLoading(true);setError(null);
    const{error}=await supabase.auth.signInWithPassword({email,password});
    if(error)setError("Invalid email or password.");
    setLoading(false);
  };
  return(
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"Georgia,serif",maxWidth:480,margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px"}}>
      <div style={{width:"100%",maxWidth:360}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontSize:10,color:T.gold,letterSpacing:4,textTransform:"uppercase",marginBottom:12}}>Spread Therapy</div>
          <div style={{fontSize:28,fontWeight:"bold",marginBottom:8}}>Welcome back.</div>
          <div style={{fontSize:13,color:T.dim,lineHeight:1.6}}>Trade with discipline. Not emotion.</div>
        </div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,color:T.dim,letterSpacing:2,marginBottom:7}}>EMAIL</div>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={{width:"100%",boxSizing:"border-box",background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"12px 14px",color:T.text,fontSize:14,fontFamily:"Georgia,serif",outline:"none"}}/>
        </div>
        <div style={{marginBottom:24}}>
          <div style={{fontSize:10,color:T.dim,letterSpacing:2,marginBottom:7}}>PASSWORD</div>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="••••••••" style={{width:"100%",boxSizing:"border-box",background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"12px 14px",color:T.text,fontSize:14,fontFamily:"Georgia,serif",outline:"none"}}/>
        </div>
        {error&&<div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:12,color:T.red}}>{error}</div>}
        <button onClick={handleLogin} disabled={loading||!email||!password} style={{width:"100%",padding:"14px",background:email&&password?T.goldDim:"transparent",border:`1px solid ${email&&password?T.goldBorder:T.border}`,borderRadius:10,color:email&&password?T.gold:T.dim,fontSize:14,cursor:email&&password?"pointer":"default",fontFamily:"Georgia,serif",transition:"all 0.2s"}}>
          {loading?"Signing in...":"Sign in →"}
        </button>
        <div style={{textAlign:"center",marginTop:24,fontSize:11,color:T.dim,lineHeight:1.6}}>
          Spread Therapy is currently invite-only.<br/>
          <span style={{color:"#333"}}>Request access: hello@spreadtherapy.com</span>
        </div>
      </div>
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App(){
  const [session,setSession]=useState(null);
  const [authLoading,setAuthLoading]=useState(true);
  const [screen,setScreen]=useState("home");
  const [selectedCampaign,setSelectedCampaign]=useState(null);
  const [navTab,setNavTab]=useState("home");
  const [activeModule,setActiveModule]=useState(null);
  const [showNewCampaign,setShowNewCampaign]=useState(false);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setSession(session);setAuthLoading(false);});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{setSession(session);});
    return()=>subscription.unsubscribe();
  },[]);

  const handleLogout=async()=>{await supabase.auth.signOut();setNavTab("home");setActiveModule(null);};

  if(authLoading)return<div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{fontSize:11,color:T.dim,letterSpacing:3}}>LOADING...</div></div>;
  if(!session)return<Login/>;

  const userId=session.user.id;
  const handleModuleBack=()=>setActiveModule(null);

  // Full screen: new campaign form
  if(showNewCampaign)return<NewCampaignForm userId={userId} onSave={()=>{setShowNewCampaign(false);}} onCancel={()=>setShowNewCampaign(false)}/>;

  // Full screen: campaign detail
  if(screen==="detail"&&selectedCampaign)return<CampaignDetail c={selectedCampaign} onBack={()=>{setScreen("home");setSelectedCampaign(null);}} onClose={()=>{setScreen("home");setSelectedCampaign(null);}}/>;

  // Full screen: module views
  if(navTab==="learn"&&activeModule==="getting-started")return<Module00 onBack={handleModuleBack}/>;
  if(navTab==="learn"&&activeModule==="stocks")return<Module01 onBack={handleModuleBack}/>;
  if(navTab==="learn"&&activeModule==="options")return<Module02 onBack={handleModuleBack}/>;
  if(navTab==="learn"&&activeModule==="spreads")return<Module03 onBack={handleModuleBack}/>;
  if(navTab==="learn"&&activeModule==="together")return<Module04 onBack={handleModuleBack}/>;
  if(navTab==="learn"&&activeModule==="margin")return<Module05 onBack={handleModuleBack}/>;
  if(navTab==="learn"&&activeModule==="pricing")return<Module06 onBack={handleModuleBack}/>;
  if(navTab==="learn"&&activeModule==="philosophy")return<Module07 onBack={handleModuleBack}/>;

  return(
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"Georgia,serif",maxWidth:480,margin:"0 auto"}}>
      <div style={{padding:"16px 20px 12px",borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,zIndex:20,background:"rgba(12,12,16,0.96)",backdropFilter:"blur(12px)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:9,color:T.gold,letterSpacing:4,textTransform:"uppercase",marginBottom:2}}>Spread Therapy</div>
          <div style={{fontSize:15,fontWeight:"bold"}}>{navTab==="home"?"Dashboard":navTab==="quiz"?"Knowledge Assessment":navTab==="learn"?"Learn Hub":"Coach"}</div>
        </div>
        <button onClick={handleLogout} style={{background:"none",border:"none",color:T.dim,fontSize:11,cursor:"pointer",fontFamily:"Georgia,serif"}}>Sign out</button>
      </div>
      <div>
        {navTab==="home"&&<Dashboard userId={userId} onSelectCampaign={(c)=>{setSelectedCampaign(c);setScreen("detail");}} onNewCampaign={()=>setShowNewCampaign(true)}/>}
        {navTab==="quiz"&&<Quiz/>}
        {navTab==="learn"&&<LearnHub onSelectModule={setActiveModule}/>}
        {navTab==="coach"&&<Coach/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"rgba(12,12,16,0.97)",backdropFilter:"blur(12px)",borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-around",padding:"10px 0 14px"}}>
        {[["home","◉","Dashboard"],["quiz","◎","Quiz"],["learn","◈","Learn"],["coach","◆","Coach"]].map(([id,icon,label])=>(
          <button key={id} onClick={()=>{setNavTab(id);if(id!=="learn")setActiveModule(null);}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 20px"}}>
            <span style={{fontSize:16,color:navTab===id?T.gold:T.dim}}>{icon}</span>
            <span style={{fontSize:9,letterSpacing:1,color:navTab===id?T.gold:T.dim}}>{label.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
