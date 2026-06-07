import { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';

// ══════════════════════════════════════════════════════
const css = (strings, ...vals) => strings.reduce((a,s,i)=>a+s+(vals[i]??''),'');

// Inline style helpers
const S = {
  flex:(gap=0,dir='row',align='center',justify='flex-start')=>({display:'flex',flexDirection:dir,alignItems:align,justifyContent:justify,gap}),
  grid:(cols,gap=16)=>({display:'grid',gridTemplateColumns:cols,gap}),
  card:(extra={})=>({background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--r)',padding:'1.5rem',...extra}),
  mono:(size=13,color='var(--text2)')=>({fontFamily:'var(--mono)',fontSize:size,color,lineHeight:1.6}),
};

// ══════════════════════════════════════════════════════
//  HOOKS
// ══════════════════════════════════════════════════════
function useInView(threshold=0.15){
  const ref=useRef(null);
  const [vis,setVis]=useState(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting)setVis(true); },{threshold});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);
  return [ref,vis];
}

// ══════════════════════════════════════════════════════
//  COMPONENTS
// ══════════════════════════════════════════════════════

function FadeIn({children,delay=0,style={}}){
  const [ref,vis]=useInView();
  return(
    <div ref={ref} style={{opacity:vis?1:0,transform:vis?'translateY(0)':'translateY(28px)',
      transition:`opacity .6s ease ${delay}s, transform .6s ease ${delay}s`,...style}}>
      {children}
    </div>
  );
}

function Tag({color='var(--blue)',children}){
  return(
    <div style={{...S.flex(8),marginBottom:12}}>
      <div style={{width:20,height:1,background:color}}/>
      <span style={{fontFamily:'var(--mono)',fontSize:11,color,letterSpacing:'0.15em',textTransform:'uppercase'}}>
        {children}
      </span>
    </div>
  );
}

function SectionTitle({tag,title,desc,color='var(--blue)'}){
  return(
    <div style={{marginBottom:48}}>
      <Tag color={color}>{tag}</Tag>
      <h2 style={{fontFamily:'var(--display)',fontSize:'clamp(1.8rem,4vw,2.8rem)',fontWeight:800,color:'#fff',lineHeight:1.1,marginBottom:8}}>{title}</h2>
      {desc&&<p style={{color:'var(--text2)',maxWidth:560,fontSize:15}}>{desc}</p>}
    </div>
  );
}

// ── NAV ───────────────────────────────────────────────
function Nav(){
  const [active,setActive]=useState('hero');

  const items=[
    {id:'hero',label:'Главная'},{id:'theory',label:'Теория'},
    {id:'diagram',label:'Схема'},{id:'routing',label:'Маршруты'},
    {id:'notes',label:'Конспекты'}, // <-- Добавили сюда
    {id:'diag',label:'Диагностика'},
  ];
  
  const go=id=>{
    document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
    setActive(id);
  };
  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting)setActive(e.target.id); });
    },{threshold:0.4});
    items.forEach(({id})=>{ const el=document.getElementById(id); if(el)obs.observe(el); });
    return()=>obs.disconnect();
  },[]);
  return(
    <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,background:'rgba(8,12,20,0.88)',
      backdropFilter:'blur(12px)',borderBottom:'1px solid var(--border)',
      padding:'0 24px',display:'flex',alignItems:'center',gap:24,height:52}}>
      <div style={{fontFamily:'var(--display)',fontWeight:800,fontSize:15,color:'var(--blue2)',whiteSpace:'nowrap',letterSpacing:'0.05em'}}>
        ⬡ AlmaPC
      </div>
      <div style={{display:'flex',gap:2,overflowX:'auto',flex:1,scrollbarWidth:'none'}}>
        {items.map(({id,label})=>(
          <button key={id} onClick={()=>go(id)} style={{
            fontFamily:'var(--mono)',fontSize:12,color:active===id?'var(--blue2)':'var(--text3)',
            background:active===id?'rgba(59,130,246,0.1)':'transparent',
            border:'none',borderRadius:6,padding:'5px 12px',cursor:'pointer',whiteSpace:'nowrap',
            transition:'all .2s',
          }}>{label}</button>
        ))}
      </div>
    </nav>
  );
}

// ── HERO ──────────────────────────────────────────────
function Hero(){
  const stats=[
    {val:'8',label:'VLAN сегментов'},
    {val:'6',label:'Серверов'},
    {val:'/24',label:'Подсети'},
    {val:'5',label:'Отделов'},
  ];
  const pills=['VLAN 802.1Q','Router-on-a-Stick','Static Routing','ACL Policies','DHCP/DNS','Firewall'];
  return(
    <section id="hero" style={{minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',
      padding:'80px 24px 48px',maxWidth:1100,margin:'0 auto'}}>
      <FadeIn>
        <Tag>Итоговый проект · Компьютерные сети</Tag>
        <h1 style={{fontFamily:'var(--display)',fontSize:'clamp(3rem,9vw,6.5rem)',fontWeight:800,
          lineHeight:1.02,color:'#fff',marginBottom:20}}>
          Корпоративная<br/>
          <span style={{
            backgroundImage:'linear-gradient(135deg,var(--blue2) 0%,var(--purple) 100%)',
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
          }}>сеть AlmaPC</span>
        </h1>
        <p style={{fontSize:17,color:'var(--text2)',maxWidth:560,marginBottom:32,lineHeight:1.7}}>
          Проектирование и реализация локальной вычислительной сети компании по производству ПК — VLAN, маршрутизация, безопасность.
        </p>
        <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:48}}>
          {pills.map(p=>(
            <span key={p} style={{fontFamily:'var(--mono)',fontSize:11,padding:'4px 12px',
              borderRadius:20,border:'1px solid var(--border2)',color:'var(--text2)',
              background:'var(--bg3)'}}>
              {p}
            </span>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',
          gap:1,border:'1px solid var(--border)',borderRadius:12,overflow:'hidden',maxWidth:640}}>
          {stats.map(({val,label})=>(
            <div key={label} style={{background:'var(--bg2)',padding:'20px 24px',borderRight:'1px solid var(--border)'}}>
              <div style={{fontFamily:'var(--display)',fontSize:28,fontWeight:800,color:'var(--blue2)',lineHeight:1,marginBottom:4}}>{val}</div>
              <div style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text3)'}}>{label}</div>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

// ── THEORY ────────────────────────────────────────────
const THEORY=[
  {icon:'🔀',color:'var(--blue)',title:'VLAN — виртуальные локальные сети',
   short:'Логическое разделение физической сети на изолированные сегменты. Трафик между VLAN не проходит без маршрутизатора.',
   detail:`<b>Стандарт IEEE 802.1Q</b> — к кадру Ethernet добавляется 4-байтовый тег с VLAN ID (12 бит = до 4094 VLAN).<br/><br/>
<b>Типы портов:</b><br/>
→ Access-порт: принадлежит одной VLAN, тег снимается перед отправкой устройству<br/>
→ Trunk-порт: передаёт трафик нескольких VLAN с тегами<br/><br/>
<b>Зачем нужны VLAN:</b><br/>
→ Безопасность: бухгалтерия не видит склад<br/>
→ Производительность: меньше широковещательный домен<br/>
→ Экономия: один коммутатор = много логических сетей`},
  {icon:'🔄',color:'var(--green)',title:'Принципы маршрутизации',
   short:'Маршрутизатор выбирает лучший путь для пакета по таблице маршрутов. Longest prefix match — более специфичный маршрут побеждает.',
   detail:`<b>Алгоритм пересылки пакета:</b><br/>
1. Читает IP-адрес назначения<br/>
2. Ищет совпадение в таблице маршрутов (longest prefix match)<br/>
3. Если найдено — пересылает на next-hop или интерфейс<br/>
4. Если нет — использует default route 0.0.0.0/0<br/>
5. Если нет default — ICMP Unreachable<br/><br/>
<b>Метрики маршрутов:</b> хопы, полоса пропускания, задержка, надёжность`},
  {icon:'🗺️',color:'var(--amber)',title:'Статическая маршрутизация',
   short:'Маршруты задаются вручную администратором. Нет автоматического обнаружения изменений топологии.',
   detail:`<b>Синтаксис Cisco IOS:</b><br/>
<code style="color:#6ee7b7">ip route [сеть] [маска] [next-hop | интерфейс] [AD]</code><br/><br/>
<b>Виды статических маршрутов:</b><br/>
→ Обычный: ip route 192.168.20.0 255.255.255.0 192.168.10.2<br/>
→ Default: ip route 0.0.0.0 0.0.0.0 203.0.113.1<br/>
→ Плавающий: с повышенным AD как резерв<br/><br/>
<b>Плюсы:</b> предсказуемость, нет нагрузки на CPU<br/>
<b>Минусы:</b> ручное обновление, не масштабируется`},
  {icon:'🌐',color:'var(--purple)',title:'Inter-VLAN Routing',
   short:'Трафик между VLAN должен проходить через маршрутизатор. Router-on-a-Stick: один физический порт + сабинтерфейсы.',
   detail:`<b>Router-on-a-Stick:</b><br/>
→ Один кабель от коммутатора к роутеру<br/>
→ Trunk-порт на коммутаторе<br/>
→ Сабинтерфейсы Gi0/0.10, Gi0/0.20...<br/>
→ Каждый — encapsulation dot1Q [VLAN-ID]<br/>
→ Каждый — шлюз своей подсети<br/><br/>
<b>Альтернатива — L3 коммутатор:</b><br/>
→ ip routing включить<br/>
→ SVI (switched virtual interfaces)<br/>
→ Быстрее, нет "hairpin" трафика`},
  {icon:'🛡️',color:'var(--teal)',title:'Политики доступа (ACL)',
   short:'Access Control Lists на маршрутизаторе или firewall ограничивают межсетевой трафик по правилам permit/deny.',
   detail:`<b>Правила AlmaPC:</b><br/>
→ IT-отдел (VLAN 40) → все VLAN ✓<br/>
→ Бухгалтерия → только файловый сервер и БД ✓<br/>
→ Гостевая сеть → только Интернет ✓<br/>
→ Management VLAN → только VLAN 40 ✓<br/><br/>
<b>Синтаксис Extended ACL:</b><br/>
<code style="color:#6ee7b7">ip access-list extended GUEST<br/>deny ip 192.168.70.0 0.0.0.255 192.168.0.0 0.0.255.255<br/>permit ip any any</code>`},
  {icon:'🔍',color:'var(--red)',title:'Диагностика сети',
   short:'Набор инструментов по уровням OSI: от физического кабеля до анализа приложений.',
   detail:`<b>Диагностика по уровням OSI:</b><br/>
→ L1 физика: кабели, индикаторы портов, show interfaces<br/>
→ L2 канал: show vlan brief, show mac address-table<br/>
→ L3 сеть: ping, traceroute, show ip route<br/>
→ L4+ транспорт: netstat, telnet, Wireshark<br/><br/>
<b>Cisco Packet Tracer:</b><br/>
→ Simulation Mode — пошаговое движение пакета<br/>
→ PDU Details — разбор по уровням OSI<br/>
→ Event List — фильтрация по протоколам`},
];

function TheoryCard({icon,color,title,short,detail,delay}){
  const [open,setOpen]=useState(false);
  const [ref,vis]=useInView();
  return(
    <div ref={ref} style={{
      background:'var(--bg2)',border:`1px solid ${open?color+'44':'var(--border)'}`,
      borderRadius:'var(--r)',padding:'1.5rem',
      opacity:vis?1:0,transform:vis?'translateY(0)':'translateY(24px)',
      transition:`opacity .5s ease ${delay}s, transform .5s ease ${delay}s, border-color .3s`,
      cursor:'pointer',
    }} onClick={()=>setOpen(o=>!o)}>
      <div style={{width:40,height:40,borderRadius:8,background:color+'22',
        display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,marginBottom:12}}>
        {icon}
      </div>
      <h3 style={{fontFamily:'var(--display)',fontSize:'0.95rem',fontWeight:700,color:'#fff',marginBottom:8,lineHeight:1.3}}>{title}</h3>
      <p style={{fontSize:13.5,color:'var(--text2)',lineHeight:1.6,marginBottom:12}}>{short}</p>
      {open&&(
        <div style={{background:'var(--bg3)',borderRadius:8,padding:'1rem',
          fontSize:13,color:'var(--text2)',lineHeight:1.75,borderTop:`1px solid ${color}33`,marginTop:8}}
          dangerouslySetInnerHTML={{__html:detail}}/>
      )}
      <div style={{fontFamily:'var(--mono)',fontSize:11,color,marginTop:8,userSelect:'none'}}>
        {open?'[ свернуть ↑ ]':'[ подробнее ↓ ]'}
      </div>
    </div>
  );
}

function Theory(){
  return(
    <section id="theory" style={{padding:'80px 24px',maxWidth:1100,margin:'0 auto'}}>
      <FadeIn>
        <SectionTitle tag="01 · Теория" title="Основные концепции" desc="Нажмите на карточку, чтобы раскрыть детальное объяснение темы." color="var(--blue)"/>
      </FadeIn>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:16}}>
        {THEORY.map((t,i)=><TheoryCard key={t.title} {...t} delay={i*0.07}/>)}
      </div>
    </section>
  );
}

// ── NETWORK DIAGRAM (SVG interactive) ─────────────────
const NODE_INFO={
  internet:{title:'🌐 Internet',color:'var(--blue)',body:'Глобальная сеть. Сотрудники AlmaPC получают доступ к интернету через провайдера. Весь входящий и исходящий трафик проходит через маршрутизатор и файрвол.'},
  router:  {title:'🔀 Router',color:'var(--blue2)',body:'Граничный маршрутизатор. Настроен по схеме Router-on-a-Stick: один физический интерфейс с сабинтерфейсами Gi0/0.10, Gi0/0.20... для каждой VLAN. WAN: 203.0.113.1/30'},
  fw:      {title:'🛡️ Firewall',color:'var(--red)',body:'Межсетевой экран. Stateful Inspection, NAT, ACL. Запрещает гостевой сети доступ к корпоративным ресурсам. Блокирует подозрительные соединения извне.'},
  core:    {title:'🔌 Core Switch L3',color:'var(--green)',body:'Центральный коммутатор. Trunk-порты к маршрутизатору передают тегированный трафик всех VLAN. Поддерживает STP против петель. Может выполнять inter-VLAN routing самостоятельно.'},
  v10:     {title:'VLAN 10 — Administration',color:'var(--purple)',body:'Подсеть: 192.168.10.0/24 · Шлюз: 192.168.10.1\nУстройства: ПК директора (.2), зам. (.3), менеджер (.4), принтер (.5)\nДоступ: полный к серверной зоне VLAN 60'},
  v20:     {title:'VLAN 20 — Accounting',color:'var(--amber)',body:'Подсеть: 192.168.20.0/24 · Шлюз: 192.168.20.1\nУстройства: 2 бухгалтера, сетевой принтер\nДоступ: только файловый сервер и база данных (ACL)'},
  v30:     {title:'VLAN 30 — Production',color:'var(--green)',body:'Подсеть: 192.168.30.0/24 · Шлюз: 192.168.30.1\nУстройства: ПК сотрудников, рабочие станции учёта заказов, терминалы\nДоступ: только система учёта заказов'},
  v40:     {title:'VLAN 40 — IT Department',color:'var(--blue)',body:'Подсеть: 192.168.40.0/24 · Шлюз: 192.168.40.1\nУстройства: сисадмин, программист, ноутбук\nДоступ: ко ВСЕМ VLAN включая Management (VLAN 99)'},
  v50:     {title:'VLAN 50 — Warehouse',color:'var(--teal)',body:'Подсеть: 192.168.50.0/24 · Шлюз: 192.168.50.1\nУстройства: ПК кладовщика, сканер, терминал, принтер накладных\nДоступ: только складская база данных'},
  v60:     {title:'VLAN 60 — Servers',color:'var(--red)',body:'Подсеть: 192.168.60.0/24 · Шлюз: 192.168.60.1\n📦 File Server (.10) · Web Server (.11)\n🔧 DHCP (.12) · DNS (.13) · Database (.14) · Backup (.15)'},
  v70:     {title:'VLAN 70 — Guest Wi-Fi',color:'var(--text3)',body:'Подсеть: 192.168.70.0/24 · Шлюз: 192.168.70.1\nУстройства: гостевые ноутбуки, смартфоны\nДоступ: ТОЛЬКО интернет. ACL запрещает 192.168.0.0/16'},
  v99:     {title:'VLAN 99 — Management',color:'var(--text3)',body:'Подсеть: 192.168.99.0/24\nОбъекты: все коммутаторы, роутер, AP\nПротоколы: SSH, SNMPv3, Syslog\nДоступ: только от VLAN 40 (IT-отдел)'},
};

function NetworkDiagram(){
  const [sel,setSel]=useState(null);
  const info=sel?NODE_INFO[sel]:null;

  const Nd=({id,x,y,w=180,h=48,color,label,sub})=>(
    <g onClick={()=>setSel(s=>s===id?null:id)} style={{cursor:'pointer'}}>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={sel===id?color+'22':'#0d1220'} stroke={sel===id?color:color+'66'} strokeWidth={sel===id?2:1.5}/>
      <text x={x+w/2} y={y+h/2-(sub?7:0)} textAnchor="middle" dominantBaseline="central" fill={sel===id?'#fff':'#e2e8f0'} fontFamily="'JetBrains Mono',monospace" fontSize={11} fontWeight={600}>{label}</text>
      {sub&&<text x={x+w/2} y={y+h/2+10} textAnchor="middle" dominantBaseline="central" fill="#475569" fontFamily="'JetBrains Mono',monospace" fontSize={9}>{sub}</text>}
    </g>
  );

  const Line=({x1,y1,x2,y2,dash=false,color='#3b82f666'})=>(
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5} strokeDasharray={dash?'4 3':'none'}/>
  );

  // Layout: viewBox 860 x 600
  const nodes=[
    {id:'internet',x:330,y:10, w:200,h:44,color:'#3b82f6',label:'🌐  INTERNET'},
    {id:'router',  x:305,y:80, w:250,h:48,color:'#60a5fa',label:'🔀  ROUTER',sub:'WAN: 203.0.113.1/30'},
    {id:'fw',      x:295,y:158,w:270,h:48,color:'#ef4444',label:'🛡️  FIREWALL',sub:'Stateful · NAT · ACL'},
    {id:'core',    x:270,y:236,w:320,h:48,color:'#10b981',label:'🔌  CORE SWITCH (L3)',sub:'Trunk: all VLANs'},
  ];
  const vlans=[
    {id:'v10',x:10, y:330,color:'#8b5cf6',label:'VLAN 10',sub:'Administration'},
    {id:'v20',x:130,y:330,color:'#f59e0b',label:'VLAN 20',sub:'Accounting'},
    {id:'v30',x:250,y:330,color:'#10b981',label:'VLAN 30',sub:'Production'},
    {id:'v40',x:370,y:330,color:'#3b82f6',label:'VLAN 40',sub:'IT Dept'},
    {id:'v50',x:490,y:330,color:'#14b8a6',label:'VLAN 50',sub:'Warehouse'},
    {id:'v70',x:610,y:330,color:'#64748b',label:'VLAN 70',sub:'Guest Wi-Fi'},
    {id:'v60',x:730,y:330,color:'#ef4444',label:'VLAN 60',sub:'Servers ⚡'},
    {id:'v99',x:300,y:440,color:'#475569',label:'VLAN 99',sub:'Management'},
  ];
  const vlanW=110, vlanH=52, vlanCX=id=>{ const v=vlans.find(v=>v.id===id); return v.x+vlanW/2; };

  return(
    <div>
      <svg width="100%" viewBox="0 0 860 510" style={{display:'block',overflow:'visible'}}>
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
            <path d="M2 2L8 5L2 8" fill="none" stroke="#3b82f6" strokeWidth={1.5} strokeLinecap="round"/>
          </marker>
          <marker id="arrg" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
            <path d="M2 2L8 5L2 8" fill="none" stroke="#475569" strokeWidth={1.5} strokeLinecap="round"/>
          </marker>
        </defs>
        {/* Backbone lines */}
        <line x1={430} y1={54} x2={430} y2={80} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#arr)"/>
        <line x1={430} y1={128} x2={430} y2={158} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#arr)"/>
        <line x1={430} y1={206} x2={430} y2={236} stroke="#ef4444" strokeWidth={1.5} markerEnd="url(#arr)"/>
        {/* Core to VLANs */}
        {vlans.map(v=>(
          <line key={v.id} x1={430} y1={284} x2={v.x+vlanW/2} y2={330}
            stroke={v.id==='v60'?'#ef444466':v.id==='v99'?'#47556944':'#47556944'}
            strokeWidth={v.id==='v60'?1.5:1} strokeDasharray="3 2"/>
        ))}
        {/* VLAN 99 branch */}
        <line x1={355} y1={382} x2={355} y2={440} stroke="#47556966" strokeWidth={1} strokeDasharray="2 3"/>
        {/* Servers sub-box */}
        <rect x={728} y={392} width={112} height={80} rx={6} fill="#1a0808" stroke="#7f1d1d" strokeWidth={1}/>
        <text x={784} y={410} textAnchor="middle" fill="#fca5a5" fontFamily="'JetBrains Mono',monospace" fontSize={9} fontWeight={600}>File · Web</text>
        <text x={784} y={424} textAnchor="middle" fill="#94a3b8" fontFamily="'JetBrains Mono',monospace" fontSize={9}>DHCP · DNS</text>
        <text x={784} y={438} textAnchor="middle" fill="#94a3b8" fontFamily="'JetBrains Mono',monospace" fontSize={9}>DB · Backup</text>
        <line x1={784} y1={382} x2={784} y2={392} stroke="#ef444466" strokeWidth={1} strokeDasharray="2 2"/>
        {/* Main nodes */}
        {nodes.map(n=><Nd key={n.id} {...n}/>)}
        {/* VLAN nodes */}
        {vlans.map(v=>(
          <g key={v.id} onClick={()=>setSel(s=>s===v.id?null:v.id)} style={{cursor:'pointer'}}>
            <rect x={v.x} y={v.y} width={vlanW} height={vlanH} rx={7} fill={sel===v.id?v.color+'22':'#0d1220'} stroke={sel===v.id?v.color:v.color+'77'} strokeWidth={sel===v.id?2:1.2}/>
            <text x={v.x+vlanW/2} y={v.y+19} textAnchor="middle" dominantBaseline="central" fill={sel===v.id?'#fff':'#e2e8f0'} fontFamily="'JetBrains Mono',monospace" fontSize={10.5} fontWeight={600}>{v.label}</text>
            <text x={v.x+vlanW/2} y={v.y+35} textAnchor="middle" dominantBaseline="central" fill="#64748b" fontFamily="'JetBrains Mono',monospace" fontSize={9}>{v.sub}</text>
          </g>
        ))}
      </svg>

      {/* Info panel */}
      {info&&(
        <div style={{marginTop:16,background:'var(--bg3)',border:`1px solid ${info.color}44`,
          borderRadius:10,padding:'1.25rem',animation:'fadeIn .2s ease'}}>
          <div style={{...S.flex(0,'row','center','space-between'),marginBottom:8}}>
            <div style={{fontFamily:'var(--display)',fontSize:'1rem',fontWeight:700,color:'#fff'}}>{info.title}</div>
            <button onClick={()=>setSel(null)} style={{background:'none',border:'none',color:'var(--text3)',cursor:'pointer',fontSize:18}}>✕</button>
          </div>
          <p style={{fontSize:13,color:'var(--text2)',lineHeight:1.75,whiteSpace:'pre-line'}}>{info.body}</p>
        </div>
      )}
    </div>
  );
}

function DiagramSection(){
  return(
    <section id="diagram" style={{padding:'80px 24px',maxWidth:1100,margin:'0 auto'}}>
      <FadeIn>
        <SectionTitle tag="02 · Схема" title="Топология сети AlmaPC" desc="Кликайте на блоки для получения подробной информации. Красным выделена серверная зона." color="var(--green)"/>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div style={S.card()}>
          <NetworkDiagram/>
          <div style={{...S.flex(16,'row','center','flex-start'),flexWrap:'wrap',marginTop:20,paddingTop:16,borderTop:'1px solid var(--border)'}}>
            {[['var(--blue)','Внешняя сеть'],['var(--red)','Безопасность / Серверы'],['var(--green)','Ядро'],['var(--purple)','Пользователи']].map(([c,l])=>(
              <div key={l} style={{...S.flex(8)}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:c}}/>
                <span style={{fontSize:12,color:'var(--text3)',fontFamily:'var(--mono)'}}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

// ── ROUTING SECTION ────────────────────────────────────
const VLAN_TABLE=[
  {id:10,name:'Administration',net:'192.168.10.0/24',gw:'192.168.10.1',color:'#8b5cf6',devices:'ПК директора, зам., менеджер, принтер'},
  {id:20,name:'Accounting',    net:'192.168.20.0/24',gw:'192.168.20.1',color:'var(--amber)',devices:'2 бухгалтера, принтер'},
  {id:30,name:'Production',    net:'192.168.30.0/24',gw:'192.168.30.1',color:'var(--green)',devices:'ПК, рабочие станции, терминалы'},
  {id:40,name:'IT Department', net:'192.168.40.0/24',gw:'192.168.40.1',color:'var(--blue2)',devices:'Сисадмин, программист, ноутбук'},
  {id:50,name:'Warehouse',     net:'192.168.50.0/24',gw:'192.168.50.1',color:'var(--teal)',devices:'ПК кладовщика, сканер, принтер'},
  {id:60,name:'Servers',       net:'192.168.60.0/24',gw:'192.168.60.1',color:'var(--red)',devices:'File, Web, DHCP, DNS, DB, Backup'},
  {id:70,name:'Guest',         net:'192.168.70.0/24',gw:'192.168.70.1',color:'#64748b',devices:'Гостевые смартфоны, ноутбуки'},
  {id:99,name:'Management',    net:'192.168.99.0/24',gw:'192.168.99.1',color:'#e2e8f0',devices:'Управляющие интерфейсы свичей, AP'},
];

const CODE_BLOCKS=[
  {title:'Router-on-a-Stick (subinterfaces)',cmd:'show running-config interface Gi0/0',color:'var(--blue2)',code:`! Переход в привилегированный режим и глобальную конфигурацию
AlmaPC-Router> enable
AlmaPC-Router# configure terminal
AlmaPC-Router(config)# interface GigabitEthernet0/0
AlmaPC-Router(config-if)# description Trunk Link to Core-Switch
AlmaPC-Router(config-if)# no shutdown
AlmaPC-Router(config-if)# exit

! Настройка инкапсуляции dot1Q для подсети Администрации
AlmaPC-Router(config)# interface GigabitEthernet0/0.10
AlmaPC-Router(config-subif)# encapsulation dot1Q 10
AlmaPC-Router(config-subif)# ip address 192.168.10.1 255.255.255.0
AlmaPC-Router(config-subif)# exit

! Настройка инкапсуляции dot1Q для подсети Бухгалтерии
AlmaPC-Router(config)# interface GigabitEthernet0/0.20
AlmaPC-Router(config-subif)# encapsulation dot1Q 20
AlmaPC-Router(config-subif)# ip address 192.168.20.1 255.255.255.0
AlmaPC-Router(config-subif)# end
AlmaPC-Router# write memory`},
  {title:'Статические маршруты (Routing)',cmd:'show running-config | include ip route',color:'var(--green)',code:`AlmaPC-Router> enable
AlmaPC-Router# configure terminal

! Назначение основного шлюза по умолчанию (маршрут на провайдера)
AlmaPC-Router(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1

! Статическая привязка внутренних интерфейсов для подсетей
AlmaPC-Router(config)# ip route 192.168.10.0 255.255.255.0 GigabitEthernet0/0.10
AlmaPC-Router(config)# ip route 192.168.20.0 255.255.255.0 GigabitEthernet0/0.20
AlmaPC-Router(config)# ip route 192.168.60.0 255.255.255.0 GigabitEthernet0/0.60

! Резервный плавающий статический маршрут (Метрика / AD = 10)
AlmaPC-Router(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.5 10
AlmaPC-Router(config)# end
AlmaPC-Router# show ip route`},
  {title:'Коммутация VLAN & Trunking',cmd:'show vlan brief',color:'var(--amber)',code:`AlmaPC-Switch> enable
AlmaPC-Switch# configure terminal

! Создание и именование виртуальных сетей в базе данных свитча
AlmaPC-Switch(config)# vlan 10
AlmaPC-Switch(config-vlan)# name Administration
AlmaPC-Switch(config-vlan)# vlan 20
AlmaPC-Switch(config-vlan)# name Accounting
AlmaPC-Switch(config-vlan)# exit

! Перевод порта связи с роутером в режим магистрального транка
AlmaPC-Switch(config)# interface GigabitEthernet0/1
AlmaPC-Switch(config-if)# switchport mode trunk
AlmaPC-Switch(config-if)# switchport trunk allowed vlan 10,20,30,40,50,60,70,99
AlmaPC-Switch(config-if)# exit

! Настройка абонентского порта доступа под VLAN 10
AlmaPC-Switch(config)# interface FastEthernet0/1
AlmaPC-Switch(config-if)# switchport mode access
AlmaPC-Switch(config-if)# switchport access vlan 10
AlmaPC-Switch(config-if)# spanning-tree portfast
AlmaPC-Switch(config-if)# end`},
  {title:'Политики безопасности (Extended ACL)',cmd:'show access-lists',color:'var(--red)',code:`AlmaPC-Router> enable
AlmaPC-Router# configure terminal

! Создание расширенного листа контроля доступа для Гостей
AlmaPC-Router(config)# ip access-list extended GUEST-BLOCK
AlmaPC-Router(config-ext-nacl)# deny ip 192.168.70.0 0.0.0.255 192.168.0.0 0.0.255.255
AlmaPC-Router(config-ext-nacl)# permit ip any any
AlmaPC-Router(config-ext-nacl)# exit

! Привязка политики к интерфейсу Guest-сети на вход (inbound)
AlmaPC-Router(config)# interface GigabitEthernet0/0.70
AlmaPC-Router(config-if)# ip access-group GUEST-BLOCK in
AlmaPC-Router(config-if)# exit

! Ограничение Бухгалтерии: доступ только к серверам (VLAN 60)
AlmaPC-Router(config)# ip access-list extended ACCT-POLICY
AlmaPC-Router(config-ext-nacl)# permit ip 192.168.20.0 0.0.0.255 192.168.60.0 0.0.0.255
AlmaPC-Router(config-ext-nacl)# deny ip 192.168.20.0 0.0.0.255 192.168.0.0 0.0.255.255
AlmaPC-Router(config-ext-nacl)# permit ip any any
AlmaPC-Router(config-ext-nacl)# end`},
];

function Routing(){
  const [tab, setTab] = useState('matrix'); 
  const [selBlock, setSelBlock] = useState(0);
  const [showRouteTable, setShowRouteTable] = useState(false);
  const [copied, setCopied] = useState(false);

  const [srcVlan, setSrcVlan] = useState('10');
  const [destVlan, setDestVlan] = useState('60');
  const [traceLogs, setTraceLogs] = useState([]);
  const [isTracing, setIsTracing] = useState(false);
  
  const timeoutsRef = useRef([]);

  const copyCode = (text) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const executeTraceSim = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    setIsTracing(true);
    setTraceLogs([]);
    
    const src = VLAN_TABLE.find(v => v.id === parseInt(srcVlan));
    const dest = VLAN_TABLE.find(v => v.id === parseInt(destVlan));
    const targetIp = `192.168.${dest.id}.10`;

    const steps = [
      `AlmaPC-Terminal-Host_V${src.id}> ping ${targetIp}`,
      ` `,
      `Обмен пакетами с ${targetIp} по 32 байт данных:`
    ];

    let allowed = true;
    let reason = '';

    if (src.id === 70 && dest.id !== 70) {
      allowed = false;
      reason = 'guest-block';
    } else if (src.id === 20 && dest.id !== 60 && dest.id !== 20) {
      allowed = false;
      reason = 'acct-block';
    } else if (dest.id === 99 && src.id !== 40) {
      allowed = false;
      reason = 'mgmt-block';
    }

    if (allowed) {
      steps.push(`    Ответ от ${targetIp}: число байт=32 время<1мс TTL=63 (via Gi0/0.${dest.id})`);
      steps.push(`    Ответ от ${targetIp}: число байт=32 время<1мс TTL=63`);
      steps.push(`    Ответ от ${targetIp}: число байт=32 время<1мс TTL=63`);
      steps.push(`    Ответ от ${targetIp}: число байт=32 время<1мс TTL=63`);
      steps.push(` `);
      steps.push(`Статистика Ping для ${targetIp}:`);
      steps.push(`    Пакетов: отправлено = 4, получено = 4, потеряно = 0 (0% потерь)`);
      steps.push(`Приблизительное время приема-передачи в мс:`);
      steps.push(`    Минимальное = 0мс, Максимальное = 1мс, Среднее = 0мс`);
      steps.push(` `);
      steps.push(`[STATUS] SUCCESS: Связность между подсетями успешно подтверждена маршрутизатором.`);
    } else {
      steps.push(`    Ответ от ${src.gw}: Превышен интервал ожидания для запроса.`);
      if (reason === 'guest-block') {
        steps.push(`    [Cisco-ACL-Alert] Packet dropped by inbound policy GUEST-BLOCK on GigabitEthernet0/0.70`);
        steps.push(`    [Cisco-ACL-Alert] Rule matched: deny ip 192.168.70.0 0.0.0.255 192.168.0.0 0.0.255.255`);
        steps.push(`    Ответ от ${src.gw}: Заданный целевой узел недоступен (Destination Host Unreachable).`);
      } else if (reason === 'acct-block') {
        steps.push(`    [Cisco-ACL-Alert] Packet dropped by inbound policy ACCT-POLICY on GigabitEthernet0/0.20`);
        steps.push(`    [Cisco-ACL-Alert] Violation: Бухгалтерии строго запрещен доступ во внешние сегменты, кроме VLAN 60.`);
        steps.push(`    Ответ от ${src.gw}: Заданная сеть недоступна для текущего интерфейса.`);
      } else if (reason === 'mgmt-block') {
        steps.push(`    [Cisco-ACL-Alert] Packet dropped: Управление инфраструктурой доступно строго администраторам из IT-VLAN 40.`);
        steps.push(`    Ответ от ${src.gw}: Связь административно запрещена (Administratively Prohibited).`);
      }
      steps.push(`    Превышен интервал ожидания для запроса.`);
      steps.push(` `);
      steps.push(`Статистика Ping для ${targetIp}:`);
      steps.push(`    Пакетов: отправлено = 4, получено = 0, потеряно = 4 (100% потерь)`);
      steps.push(` `);
      steps.push(`[STATUS] CRITICAL: Доступ заблокирован правилами распределения политик безопасности (Extended ACL).`);
    }

    steps.forEach((stepText, index) => {
      const t = setTimeout(() => {
        setTraceLogs(prev => [...prev, stepText]);
        if (index === steps.length - 1) {
          setIsTracing(false);
        }
      }, index * 200);
      timeoutsRef.current.push(t);
    });
  };

  useEffect(() => {
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, []);

  return (
    <section id="routing" style={{padding:'80px 24px', maxWidth:1100, margin:'0 auto'}}>
      <FadeIn>
        <SectionTitle 
          tag="03 · Маршрутизация" 
          title="Инфраструктурный Консольный Центр" 
          desc="Интерактивный terminal управления распределением подсетей, базами команд Cisco IOS и симуляцией политик безопасности." 
          color="var(--amber)"
        />
      </FadeIn>

      <div style={{display:'flex', gap:8, marginBottom:24, overflowX:'auto', paddingBottom:4, scrollbarWidth:'none'}}>
        {[
          {id:'matrix', label:'📋 Матрица адресации подсетей'},
          {id:'cli', label:'💻 Cisco IOS Terminal Config'},
          {id:'trace', label:'⚡ Трассировка пакетов и ACL'}
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => { setTab(t.id); setTraceLogs([]); setIsTracing(false); }} 
            style={{
              fontFamily:'var(--mono)', fontSize:12, padding:'10px 18px', borderRadius:8,
              border:`1px solid ${tab===t.id?'var(--amber)':'var(--border)'}`,
              background:tab===t.id?'rgba(245,158,11,0.1)':'var(--bg2)',
              color:tab===t.id?'var(--amber)':'var(--text2)', cursor:'pointer',
              whiteSpace:'nowrap', transition:'all .2s'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ТАБ 1: МАТРИЦА АДРЕСАЦИИ */}
      {tab === 'matrix' && (
        <FadeIn>
          <div style={{background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r)', overflow:'hidden'}}>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:13, textAlign:'left'}}>
                <thead>
                  <tr style={{background:'var(--bg3)', borderBottom:'1px solid var(--border)'}}>
                    {['VLAN ID', 'Имя сегмента', 'CIDR подсеть', 'Шлюз (Gateway)', 'Обслуживаемые узлы и устройства'].map(h => (
                      <th key={h} style={{fontFamily:'var(--mono)', fontSize:11, textTransform:'uppercase', color:'var(--text3)', padding:'14px 16px', letterSpacing:'0.05em'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {VLAN_TABLE.map(v => (
                    <tr key={v.id} style={{borderBottom:'1px solid rgba(255,255,255,0.03)', transition:'background .2s'}} onMouseEnter={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.01)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                      <td style={{padding:'14px 16px'}}>
                        <span style={{fontFamily:'var(--mono)', fontSize:11, padding:'3px 8px', borderRadius:4, background:v.color+'18', color:v.color, fontWeight:700, border:`1px solid ${v.color}33`}}>
                          VLAN {v.id}
                        </span>
                      </td>
                      <td style={{padding:'14px 16px', color:'#fff', fontWeight:500}}>{v.name}</td>
                      <td style={{padding:'14px 16px', fontFamily:'var(--mono)', color:'var(--text2)'}}>{v.net}</td>
                      <td style={{padding:'14px 16px', fontFamily:'var(--mono)', color:'var(--blue2)'}}>{v.gw}</td>
                      <td style={{padding:'14px 16px', fontSize:12, color:'var(--text3)'}}>{v.devices}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      )}

      {/* ТАБ 2: CISCO IOS TERMINAL CONFIG (ТЕПЕРЬ СТАБИЛЬНЫЙ) */}
      {tab === 'cli' && (
        <FadeIn>
          <div style={{display:'flex', flexDirection:'column', gap:24, alignItems:'center'}}>
            
            {/* Консоль сверху по центру */}
            <div style={{
              background:'#040712', border:'1px solid var(--border2)', borderRadius:12, 
              overflow:'hidden', boxShadow:'0 25px 50px rgba(0,0,0,0.6)', width:'100%', maxWidth:850
            }}>
              <div style={{background:'#090d1a', borderBottom:'1px solid var(--border)', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <div style={{display:'flex', gap:6}}>
                  <div style={{width:10, height:10, borderRadius:'50%', background:'#ef4444'}} />
                  <div style={{width:10, height:10, borderRadius:'50%', background:'#f59e0b'}} />
                  <div style={{width:10, height:10, borderRadius:'50%', background:'#10b981'}} />
                </div>
                <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--text3)'}}>
                  {showRouteTable ? 'AlmaPC-Router# show ip route' : `AlmaPC-Router# ${CODE_BLOCKS[selBlock].cmd}`}
                </span>
                <button 
                  onClick={() => copyCode(showRouteTable ? 'show ip route content' : CODE_BLOCKS[selBlock].code)}
                  style={{fontFamily:'var(--mono)', fontSize:10, color:copied?'var(--green)':'var(--text2)', background:'none', border:'1px solid var(--border)', padding:'2px 8px', borderRadius:4, cursor:'pointer'}}
                >
                  {copied ? '✓ Скопировано' : 'Copy'}
                </button>
              </div>

              <div style={{padding:'24px', height:'400px', overflowY:'auto', scrollbarWidth:'thin', textAlign:'left'}}>
                <pre style={{margin:0, whiteSpace:'pre', fontFamily:'var(--mono)', fontSize:12.5, lineHeight:1.8}}>
                  {showRouteTable ? (
                    <code style={{color:'#00ff66'}}>
                      {`Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area 

Gateway of last resort is 203.0.113.1 to network 0.0.0.0

S* 0.0.0.0/0 [1/0] via 203.0.113.1 (WAN-Gateway)
C     192.168.10.0/24 is directly connected, GigabitEthernet0/0.10
L     192.168.10.1/32 is directly connected, GigabitEthernet0/0.10
C     192.168.20.0/24 is directly connected, GigabitEthernet0/0.20
L     192.168.20.1/32 is directly connected, GigabitEthernet0/0.20
C     192.168.30.0/24 is directly connected, GigabitEthernet0/0.30
C     192.168.40.0/24 is directly connected, GigabitEthernet0/0.40
C     192.168.60.0/24 is directly connected, GigabitEthernet0/0.40
S     203.0.113.4/30 [10/0] via 203.0.113.5 (Backup Link)`}
                    </code>
                  ) : (
                    <code>
                      {CODE_BLOCKS[selBlock].code.split('\n').map((line, i) => {
                        if (line.trim().startsWith('!')) return <div key={i} style={{color:'#475569', fontStyle:'italic'}}>{line}</div>;
                        let lineColor = '#fff'; 
                        if (line.includes('(config)#') || line.includes('(config-if)#') || line.includes('(config-subif)#') || line.includes('(config-vlan)#') || line.includes('(config-ext-nacl)#')) {
                          lineColor = '#60a5fa'; 
                        }
                        if (line.includes('deny')) lineColor = '#f87171'; 
                        if (line.includes('permit') || line.includes('no shutdown')) lineColor = '#34d399'; 
                        return <div key={i} style={{color:lineColor}}>{line}</div>;
                      })}
                    </code>
                  )}
                </pre>
              </div>
            </div>

            {/* Блок переключателей и кнопка снизу */}
            <div style={{
              display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center', width:'100%',
              borderTop:'1px solid rgba(255,255,255,0.04)', paddingTop:24
            }}>
              {CODE_BLOCKS.map((b, idx) => (
                <button
                  key={b.title}
                  onClick={() => {setSelBlock(idx); setShowRouteTable(false);}}
                  style={{
                    padding:'10px 16px', borderRadius:8, border:`1px solid ${selBlock===idx && !showRouteTable?'var(--blue2)':'var(--border)'}`,
                    background:selBlock===idx && !showRouteTable?'rgba(59,130,246,0.08)':'var(--bg2)',
                    textAlign:'left', cursor:'pointer', transition:'all .2s', color:selBlock===idx && !showRouteTable?'#fff':'var(--text2)'
                  }}
                >
                  <span style={{fontFamily:'var(--mono)', fontSize:11}}>{b.title}</span>
                </button>
              ))}

              <button
                onClick={() => setShowRouteTable(true)}
                style={{
                  padding:'10px 18px', borderRadius:8,
                  background: 'var(--green)',
                  color: '#020617',
                  border: 'none',
                  fontFamily:'var(--mono)', fontSize:11, fontWeight:700, cursor:'pointer',
                  transition: 'background 0.2s'
                }}
              >
                ⚡ Исполнить: show ip route
              </button>
            </div>

          </div>
        </FadeIn>
      )}

      {/* ТАБ 3: ТЕСТ ТРАССИРОВКИ */}
      {tab === 'trace' && (
        <FadeIn>
          <div style={{background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r)', padding:'24px'}}>
            <div style={{fontFamily:'var(--display)', fontSize:15, fontWeight:700, color:'#fff', marginBottom:16}}>
              🔬 Командный пульт сетевой диагностики и проверки политик безопасности
            </div>
            
            <div style={{display:'flex', flexWrap:'wrap', gap:16, marginBottom:24, alignItems:'flex-end'}}>
              <div style={{display:'flex', flexDirection:'column', gap:6}}>
                <label style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--text3)'}}>Узел-отправитель (Source Host VLAN):</label>
                <select 
                  value={srcVlan} 
                  disabled={isTracing}
                  onChange={(e) => {setSrcVlan(e.target.value); setTraceLogs([]);}}
                  style={{background:'var(--bg3)', border:'1px solid var(--border)', color:'#fff', padding:'8px 12px', borderRadius:6, fontFamily:'var(--mono)', fontSize:12, outline:'none'}}
                >
                  {VLAN_TABLE.map(v => <option key={v.id} value={v.id}>VLAN {v.id} — {v.name}</option>)}
                </select>
              </div>

              <div style={{fontFamily:'var(--mono)', color:'var(--text3)', fontSize:16, paddingBottom:8}}>➔</div>

              <div style={{display:'flex', flexDirection:'column', gap:6}}>
                <label style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--text3)'}}>Целевой IP (Destination Target):</label>
                <select 
                  value={destVlan} 
                  disabled={isTracing}
                  onChange={(e) => {setDestVlan(e.target.value); setTraceLogs([]);}}
                  style={{background:'var(--bg3)', border:'1px solid var(--border)', color:'#fff', padding:'8px 12px', borderRadius:6, fontFamily:'var(--mono)', fontSize:12, outline:'none'}}
                >
                  {VLAN_TABLE.map(v => <option key={v.id} value={v.id}>192.168.{v.id}.10 ({v.name})</option>)}
                </select>
              </div>

              <button
                onClick={executeTraceSim}
                disabled={isTracing}
                style={{
                  background: isTracing ? 'var(--border)' : 'var(--amber)',
                  color: isTracing ? 'var(--text3)' : '#000',
                  border: 'none', borderRadius:6, padding:'9px 20px', fontFamily:'var(--mono)', fontSize:12,
                  fontWeight:600, cursor: isTracing ? 'not-allowed' : 'pointer', transition:'all .2s'
                }}
              >
                {isTracing ? 'Выполнение Ping...' : 'Запустить трассировку трафика'}
              </button>
            </div>

            <div style={{
              background:'#040712', border:'1px solid var(--border2)', borderRadius:12, 
              overflow:'hidden', boxShadow:'0 25px 50px rgba(0,0,0,0.6)'
            }}>
              <div style={{background:'#090d1a', borderBottom:'1px solid var(--border)', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <div style={{display:'flex', gap:6}}>
                  <div style={{width:10, height:10, borderRadius:'50%', background:'#ef4444'}} />
                  <div style={{width:10, height:10, borderRadius:'50%', background:'#f59e0b'}} />
                  <div style={{width:10, height:10, borderRadius:'50%', background:'#10b981'}} />
                </div>
                <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--text3)'}}>
                  AlmaPC-Terminal-Client@Diagnostics: ~
                </span>
                <div style={{width:40}} />
              </div>

              <div style={{padding:'28px', height:'450px', overflowY:'auto', scrollbarWidth:'thin', background:'#02050f'}}>
                <pre style={{margin:0, whiteSpace:'pre-wrap', fontFamily:'var(--mono)', fontSize:12.5, lineHeight:1.8}}>
                  {traceLogs.length === 0 && (
                    <div style={{color:'var(--text3)', textAlign:'center', paddingTop:80, fontStyle:'italic'}}>
                      Microsoft Windows Like OS [Version 10.0.19045]<br/>
                      (c) Корпорация AlmaPC-Network, 2026. Все права защищены.<br/><br/>
                      Выберите узлы выше и нажмите «Запустить трассировку трафика» для отправки ICMP пакетов.
                    </div>
                  )}
                  <code>
                    {traceLogs.map((log, i) => {
                      let lineColor = '#fff';
                      if (log.startsWith('AlmaPC-Terminal-Host')) lineColor = '#60a5fa'; 
                      if (log.includes('время<1мс') || log.includes('SUCCESS')) lineColor = '#34d399'; 
                      if (log.includes('[Cisco-ACL-Alert]') || log.includes('CRITICAL') || log.includes('100% потерь')) lineColor = '#f87171'; 
                      if (log.includes('Статистика') || log.includes('Пакетов:')) lineColor = 'var(--text3)'; 
                      return <div key={i} style={{color:lineColor}}>{log}</div>;
                    })}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </FadeIn>
      )}
    </section>
  );
}

// ── NOTES / КОНСПЕКТЫ ──────────────────────────────────
const LECTURE_NOTES = [
  {
    id: 'vlan-opt',
    title: '1. Анализ и оптимизация VLAN',
    content: `<b>Сегментация и безопасность:</b> В AlmaPC разделение на 8 VLAN исключает перехват данных между критическими отделами (Бухгалтерия, Склад, Администрация). Гостевой Wi-Fi полностью изолирован.<br/><br/>
<b>Оптимизация широковещательного шторма:</b> Без VLAN бродкаст-трафик (ARP, DHCP) от 100+ устройств забивал бы сеть. Сейчас каждый отдел — это отдельный изолированный широковещательный домен.<br/><br/>
<b>Рекомендация по улучшению:</b> Для повышения отказоустойчивости вместо схемы <i>Router-on-a-Stick</i> (где роутер — единая точка отказа и узкое место) рекомендуется перенести маршрутизацию на уровень ядра сети — использовать <b>L3-коммутатор (Core Switch)</b> и настроить SVI (Switched Virtual Interfaces).`
  },
  {
    id: 'routing-principles',
    title: '2. Принципы маршрутизации',
    content: `<b>Как пакет находит путь:</b> Маршрутизатор работает на 3-м уровне модели OSI. При получении пакета он сверяет IP-адрес назначения со своей <b>таблицей маршрутизации (Routing Table)</b>.<br/><br/>
<b>Правило наилучшего совпадения (Longest Prefix Match):</b> Если в таблице есть несколько путей к хосту (например, 192.168.0.0/16 и 192.168.60.0/24), роутер выберет маршрут с более длинной маской (/24), так как он более точный.<br/><br/>
<b>Административное расстояние (AD):</b> Определяет степень доверия к источнику маршрута. Чем ниже AD, тем приоритетнее маршрут:
<br/>• Directly Connected (напрямую подключен) — <b>AD 0</b>
<br/>• Static Route (статический) — <b>AD 1</b>
<br/>• OSPF (динамический) — <b>AD 110</b>`
  },
  {
    id: 'static-routing',
    title: '3. Статическая IP-маршрутизация',
    content: `<b>Когда применять:</b> Статические маршруты идеальны для небольших сетей, тупиковых сегментов (Stub Networks) или жестко фиксированных каналов (как связь AlmaPC с провайдером).<br/><br/>
<b>Типы статических маршрутов в проекте:</b><br/>
1. <i>Маршрут по умолчанию (Default Route - 0.0.0.0/0):</i> Направляет весь неизвестный трафик в сторону Интернета через шлюз провайдера.<br/>
2. <i>Плавающий статический маршрут (Floating Static Route):</i> Резервный путь. Настраивается путем искусственного завышения AD (например, до 10 или 50). Пока основной линк активен (AD 1), резервный невидим в таблице маршрутов. При падении основного — плавающий маршрут автоматически активируется.`
  },
  {
    id: 'diag-methodology',
    title: '4. Методология поиска неисправностей',
    content: `<b>Метод «Снизу вверх» (Bottom-Up):</b> Диагностика начинается с физического уровня (L1) и идет к прикладному (L7). Самый надежный инженерный подход.<br/>
<i>Пример:</i> Проверить кабель → проверить линк на порту → проверить IP-адрес → проверить пинг до шлюза → проверить DNS.<br/><br/>
<b>Метод «Сверху вниз» (Top-Down):</b> Начинается с приложения (L7). Если веб-сайт не открывается, проверяем браузер, затем прокси, затем сетевой стек. Подходит, если сеть работает, но сбоит конкретный сервис.<br/><br/>
<b>Метод «Разделяй и властвуй» (Divide and Conquer):</b> Старт с середины (L3 - Сетевой уровень). Запускается <code>ping</code>. Если он идет — уровни L1-L3 исправны, проблема выше (L4-L7). Если пинга нет — проблема ниже (L1-L2). Экономит до 70% времени.`
  }
];

function Notes() {
  const [activeNote, setActiveNote] = useState(LECTURE_NOTES[0].id);

  return (
    <section id="notes" style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <FadeIn>
        <SectionTitle tag="03.5 · Дополнение" title="Конспекты лекций" desc="Теоретический базис по темам самостоятельной работы." color="var(--purple)" />
      </FadeIn>
      <FadeIn delay={0.1}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
          {LECTURE_NOTES.map(note => (
            <button
              key={note.id}
              onClick={() => setActiveNote(note.id)}
              style={{
                background: activeNote === note.id ? 'rgba(139,92,246,0.1)' : 'var(--bg2)',
                border: activeNote === note.id ? '1px solid var(--purple)' : '1px solid var(--border)',
                borderRadius: 8, padding: '16px', textAlign: 'left', cursor: 'pointer', transition: 'all .2s'
              }}
            >
              <div style={{ fontFamily: 'var(--display)', fontSize: 14, fontWeight: 700, color: activeNote === note.id ? '#fff' : 'var(--text2)' }}>
                {note.title}
              </div>
            </button>
          ))}
        </div>
        <div style={{ ...S.card(), background: 'var(--bg3)', minHeight: 180, borderLeft: '3px solid var(--purple)' }}>
          <div
            style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: LECTURE_NOTES.find(n => n.id === activeNote)?.content || '' }}
          />
        </div>
      </FadeIn>
    </section>
  );
}

// ── DIAGNOSTICS (NEW CENTERED TERMINAL INTERFACE) ───────────────
const TERMINAL_TABS = [
  {
    id: 'l1-l2',
    name: 'L1/L2 Физика и Канал',
    prompt: 'AlmaPC-Switch-Core#',
    output: `AlmaPC-Switch-Core# show interfaces status

Port      Name               Status       Vlan       Duplex  Speed Type
Gi0/1     Link to Router     connected    trunk      full    1000  1000BaseTX
Fa0/1     Director PC        connected    10         full     100  100BaseTX
Fa0/2     Accounting PC 1    connected    20         full     100  100BaseTX
Fa0/12    Server Room Link   connected    60         full     1000  1000BaseTX

AlmaPC-Switch-Core# show vlan brief

VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Fa0/20, Fa0/21, Fa0/22
10   Administration                   active    Fa0/1, Fa0/3, Fa0/4
20   Accounting                       active    Fa0/2, Fa0/5
40   IT_Department                    active    Fa0/8, Fa0/9
60   Servers                          active    Gi0/2, Fa0/12
99   Management                       active    CPU

AlmaPC-Switch-Core# show interfaces trunk

Port        Mode         Encapsulation  Status        Native vlan
Gi0/1       on           802.1q         trunking      1
Port        Vlans allowed on trunk
Gi0/1       10,20,30,40,50,60,70,99`,
    desc: 'Диагностика физических соединений, проверки статусов транков и корректности распределения портов по виртуальным сетям (VLAN).'
  },
  {
    id: 'l3-routing',
    name: 'L3 Сетевой уровень (IP)',
    prompt: 'AlmaPC-Router#',
    output: `AlmaPC-Router# show ip interface brief

Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     203.0.113.2     YES manual up                    up
GigabitEthernet0/1     unassigned      YES unset  up                    up
GigabitEthernet0/1.10  192.168.10.1    YES manual up                    up
GigabitEthernet0/1.20  192.168.20.1    YES manual up                    up
GigabitEthernet0/1.60  192.168.60.1    YES manual up                    up

AlmaPC-Router# show ip route
Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, O - OSPF, IA - OSPF inter area

Gateway of last resort is 203.0.113.1 to network 0.0.0.0

S* 0.0.0.0/0 [1/0] via 203.0.113.1 (Провайдер)
C    192.168.10.0/24 is directly connected, GigabitEthernet0/1.10
C    192.168.20.0/24 is directly connected, GigabitEthernet0/1.20
C    192.168.60.0/24 is directly connected, GigabitEthernet0/1.60`,
    desc: 'Проверка логической адресации роутера (Router-on-a-Stick). show ip route выводит полную таблицу продвижения пакетов.'
  },
  {
    id: 'dhcp-dns',
    name: 'DHCP & DNS',
    prompt: 'C:\\Users\\Sysadmin>',
    output: `C:\\Users\\Sysadmin> ipconfig /all

Windows IP Configuration
   Host Name . . . . . . . . . . . . : IT-Admin-PC
   Primary Dns Suffix  . . . . . . . : almapc.kz
   DHCP Enabled. . . . . . . . . . . : Yes

IPv4 Address. . . . . . . . . . . . : 192.168.40.15(Preferred)
Subnet Mask . . . . . . . . . . . . : 255.255.255.0
Default Gateway . . . . . . . . . . : 192.168.40.1
DHCP Server . . . . . . . . . . . . : 192.168.60.12
DNS Servers . . . . . . . . . . . . : 192.168.60.13

C:\\Users\\Sysadmin> nslookup file.almapc.kz
Server:  dns.almapc.kz
Address:  192.168.60.13

Name:    file.almapc.kz
Address:  192.168.60.10`,
    desc: 'Проверка получения сетевых настроек от DHCP-сервера компании и разрешения доменных имен внутренней зоны.'
  },
  {
    id: 'acl-fw',
    name: 'ACL & Firewall',
    prompt: 'AlmaPC-Router#',
    output: `AlmaPC-Router# show access-lists

Extended IP access list GUEST-BLOCK
    10 deny ip 192.168.70.0 0.0.0.255 192.168.0.0 0.0.255.255 (422 matches)
    20 permit ip any any (1840 matches)

Extended IP access list ACCT-POLICY
    10 permit ip 192.168.20.0 0.0.0.255 192.168.60.0 0.0.0.255 (98 matches)
    20 deny ip 192.168.20.0 0.0.0.255 192.168.0.0 0.0.255.255 (12 matches)
    30 permit ip any any (344 matches)

AlmaPC-Router#
! Заметка: Счетчик "matches" подтверждает, что правила работают и блокируют несанкционированные пакеты.`,
    desc: 'Анализ списков контроля доступа. Показывает, сколько пакетов попало под фильтрацию политик безопасности.'
  },
  {
    id: 'troubles',
    name: '⚠️ Типовые инциденты',
    prompt: 'Engineers-Logbook#',
    output: `[Инцидент #1] ПК не может получить сетевой адрес.
-> Причина: Неверный Access-vlan на порту коммутатора.
-> Решение: switchport access vlan [X] на интерфейсе.

[Инцидент #2] Пинг идет только внутри своей VLAN, другие недоступны.
-> Причина: Между роутером и свитчем не поднят Trunk, либо упал сабинтерфейс.
-> Решение: Проверить show interfaces trunk; поднять сабинтерфейсы командой no shutdown.

[Инцидент #3] Гостевые устройства сканируют серверную зону.
-> Причина: Ошибка в синтаксисе ACL или забыли применить команду ip access-group.
-> Решение: Применить ACL на входящий трафик сабинтерфейса: Gi0/1.70.`,
    desc: 'База знаний инженера техподдержки AlmaPC: симптомы, первопричины неисправностей и методы их устранения.'
  }
];

// ── ОБНОВЛЕННЫЙ КОМПОНЕНТ DIAGNOSTICS ──────────────────────────
function Diagnostics() {
  const [activeTab, setActiveTab] = useState(TERMINAL_TABS[0].id);
  const current = TERMINAL_TABS.find(t => t.id === activeTab) || TERMINAL_TABS[0];

  return (
    <section id="diag" style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <FadeIn>
        <SectionTitle 
          tag="04 · Диагностика" 
          title="Инструменты поиска неисправностей" 
          desc="Эмуляция вывода командной строки сетевого оборудования Cisco IOS и системных утилит Windows." 
          color="var(--red)" 
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
          
          {/* ОКНО ТЕРМИНАЛА: ШИРЕ И КРУПНЕЕ */}
          <div style={{
            background: '#040712', border: '1px solid var(--border2)', 
            borderRadius: 12, overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
            width: '100%', maxWidth: 950
          }}>
            <div style={{
              background: '#090d1a', padding: '14px 18px', 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text3)', margin: '0 auto', paddingRight: 30 }}>
                {current.id === 'dhcp-dns' ? 'cmd.exe' : 'Cisco IOS Terminal'}
              </div>
            </div>

            {/* ТЕКСТ КРУПНЕЕ И С УМНОЙ РАСКРАСКОЙ */}
            <div style={{ padding: '28px', height: '420px', overflowY: 'auto', scrollbarWidth: 'thin', background: '#02050f', textAlign: 'left' }}>
              <pre style={{
                fontFamily: 'var(--mono)', fontSize: 14, lineHeight: 1.8, 
                whiteSpace: 'pre', margin: 0
              }}>
                <code>
                  {current.output.split('\n').map((line, i) => {
                    // ЛОГИКА РАСЦВЕТКИ
                    let color = '#fff'; 
                    
                    if (current.id === 'dhcp-dns') {
                      // Windows CMD стиль
                      if (line.includes('>')) color = '#e2e8f0'; // Промпт
                      else color = '#a0aec0'; // Обычный вывод
                    } else if (current.id === 'troubles') {
                      if (line.startsWith('[')) color = 'var(--amber)';
                      else if (line.includes('->')) color = '#34d399';
                      else color = '#94a3b8';
                    } else {
                      // Cisco IOS стиль
                      if (line.includes('#')) color = '#60a5fa'; 
                      else if (line.includes('deny')) color = '#f87171';
                      else if (line.includes('permit') || line.includes('connected')) color = '#34d399';
                      else color = '#cbd5e1';
                    }
                    return <div key={i} style={{ color }}>{line}</div>;
                  })}
                </code>
              </pre>
            </div>
          </div>

          {/* ОПИСАНИЕ СЕССИИ */}
          <div style={{ 
            background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', 
            padding: '16px 20px', fontSize: 14, color: 'var(--text2)', 
            borderLeft: '3px solid var(--red)', width: '100%', maxWidth: 950, textAlign: 'left'
          }}>
            <strong style={{ color: '#fff', fontSize: 12, textTransform: 'uppercase', marginRight: 8 }}>Сессия:</strong> 
            {current.desc}
          </div>

          {/* ВКЛАДКИ СНИЗУ */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', width: '100%' }}>
            {TERMINAL_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  fontFamily: 'var(--mono)', fontSize: 12, padding: '10px 20px',
                  background: activeTab === tab.id ? 'rgba(239,68,68,0.1)' : 'var(--bg2)',
                  border: activeTab === tab.id ? '1px solid var(--red)' : '1px solid var(--border)',
                  color: activeTab === tab.id ? '#fff' : 'var(--text3)',
                  borderRadius: 8, cursor: 'pointer', transition: 'all .2s'
                }}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

// ── FOOTER ─────────────────────────────────────────────
function Footer(){
  return(
    <footer style={{textAlign:'center',padding:'48px 24px',borderTop:'1px solid var(--border)',
      color:'var(--text3)',fontFamily:'var(--mono)',fontSize:12}}>
      AlmaPC Network Project · Учебное задание · Компьютерные сети 2025
    </footer>
  );
}

// ── APP ────────────────────────────────────────────────
function App(){
  return(
    <>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-track{background:var(--bg)}
        ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px}
        button:focus{outline:2px solid var(--blue);outline-offset:2px}
        input:focus{outline:none}
        code{font-family:var(--mono);font-size:0.9em}
      `}
      </style>
      <Nav/>
      <Hero/>
      <Theory/>
      <DiagramSection/>
      <Routing/>
      <Notes/> {/* <-- Новый компонент конспектов */}
      <Diagnostics/> {/* <-- Обновленный CLI терминал */}
      <Footer/>
    </>
  );
}

// ══════════════════════════════════════════════════════

export default App;