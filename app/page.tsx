"use client";

import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, Clock3,
  MapPin, Menu, MessageCircle, Moon, Phone, Star, Sun, X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

const services = [
  { n:"01", title:"Teeth whitening", copy:"Professional-grade whitening with a naturally bright finish.", price:"from ₹8,900", featured:true },
  { n:"02", title:"Clear aligners", copy:"A straighter smile, planned digitally and discreetly.", price:"from ₹89,000" },
  { n:"03", title:"Dental implants", copy:"Permanent, natural-looking tooth replacement.", price:"from ₹35,000" },
  { n:"04", title:"Root canal therapy", copy:"Gentle treatment with focused same-day relief.", price:"from ₹6,500" },
  { n:"05", title:"Cosmetic veneers", copy:"Hand-shaded porcelain designed around your features.", price:"from ₹18,000" },
  { n:"06", title:"Pediatric dentistry", copy:"Patient, judgment-free care for growing smiles.", price:"from ₹900" },
];

const plans = [
  { name:"Essential care", price:"₹1,499", unit:"/ month", items:["Two dental exams a year","Professional cleaning","Digital X-rays"], tone:"plain" },
  { name:"Complete care", price:"₹2,499", unit:"/ month", items:["Everything in Essential","Annual whitening credit","Priority appointments"], tone:"lime", tag:"Most chosen" },
  { name:"Smile makeover", price:"Custom", unit:"plan", items:["Full cosmetic consultation","Digital smile preview","Concierge scheduling"], tone:"blue" },
];

const reviews = [
  { quote:"The first dental appointment I didn't spend the whole week dreading.", name:"Amara W.", treatment:"Restorative care" },
  { quote:"Every step of my aligner plan was clear, calm and beautifully handled.", name:"Tobias L.", treatment:"Clear aligners" },
  { quote:"It felt considered from the welcome desk to the final result.", name:"Reina O.", treatment:"Smile design" },
];

function BeforeAfter({ label, accent }:{ label:string; accent:string }) {
  const [value,setValue] = useState(53);
  return (
    <article className="result-card">
      <div className="result-visual" style={{"--reveal":`${value}%`,"--result-accent":accent} as React.CSSProperties}>
        <div className="result-before"><span>Before</span><b>{label}</b></div>
        <div className="result-after"><span>After</span><b>{label}</b></div>
        <div className="slider-line" style={{left:`${value}%`}}><i>↔</i></div>
        <input aria-label={`Compare before and after ${label}`} type="range" min="8" max="92" value={value} onChange={(e)=>setValue(Number(e.target.value))} />
      </div>
      <p>Demo visualization <span>Drag to compare</span></p>
    </article>
  );
}

export default function Home() {
  const [dark,setDark] = useState(false);
  const [menuOpen,setMenuOpen] = useState(false);
  const [progress,setProgress] = useState(0);
  const [review,setReview] = useState(0);
  const [sent,setSent] = useState(false);

  useEffect(()=>{
    setDark(document.documentElement.dataset.theme === "dark");
    const onScroll=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;setProgress(max>0?(window.scrollY/max)*100:0)};
    onScroll();window.addEventListener("scroll",onScroll,{passive:true});
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);
  useEffect(()=>{document.documentElement.dataset.theme=dark?"dark":"light";localStorage.setItem("cusp-theme",dark?"dark":"light")},[dark]);
  const nav=["About","Services","Results","Pricing","Reviews"];
  const submit=(e:FormEvent)=>{e.preventDefault();setSent(true)};

  return (
    <main>
      <header className="site-nav">
        <div className="progress" style={{width:`${progress}%`}} />
        <a className="brand" href="#top" aria-label="Cusp Dental Studio home"><span className="brand-mark">C</span><span>Cusp <em>Dental Studio</em></span></a>
        <nav className="desktop-nav" aria-label="Primary navigation">{nav.map(i=><a key={i} href={`#${i.toLowerCase()}`}>{i}</a>)}</nav>
        <div className="nav-actions">
          <button className="icon-button" onClick={()=>setDark(!dark)} aria-label="Toggle color theme">{dark?<Sun size={17}/>:<Moon size={17}/>}</button>
          <a className="button button-dark desktop-cta" href="#contact">Book a visit <ArrowUpRight size={16}/></a>
          <button className="icon-button menu-button" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Open navigation menu">{menuOpen?<X/>:<Menu/>}</button>
        </div>
        {menuOpen&&<nav className="mobile-nav" aria-label="Mobile navigation">{nav.map(i=><a key={i} onClick={()=>setMenuOpen(false)} href={`#${i.toLowerCase()}`}>{i}</a>)}<a onClick={()=>setMenuOpen(false)} href="#contact">Book a visit</a></nav>}
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Modern dentistry · Bengaluru</p>
          <h1>Your smile,<br/><em>rebuilt</em> with<br/>intention.</h1>
          <p className="hero-intro">Precision dentistry in a calm, design-led practice—because excellent care should feel as considered as the result.</p>
          <div className="hero-actions"><a className="button button-lime" href="#contact">Book a consultation <ArrowUpRight size={18}/></a><a className="text-link" href="#results">See our work <ArrowDownRight size={17}/></a></div>
          <div className="trust-row"><div className="avatars" aria-hidden="true"><span>AM</span><span>TS</span><span>RK</span></div><p><strong>8,400+</strong> smiles treated<br/><span>4.9 average patient rating</span></p></div>
        </div>
        <div className="hero-stage">
          <img className="hero-tooth" src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/hero-origami-tooth.png`} alt="Faceted white ceramic tooth on a chrome pedestal with a silver orbit"/>
          <div className="satisfaction-card"><strong>98%</strong><span>Patient<br/>satisfaction</span></div>
          <a className="round-cta" href="#contact" aria-label="Book your visit"><span>BOOK YOUR VISIT · BOOK YOUR VISIT · </span><ArrowUpRight/></a>
        </div>
      </section>

      <div className="marquee" aria-label="Clinic highlights"><div>INVISALIGN CERTIFIED <i>✦</i> SAME-DAY EMERGENCY CARE <i>✦</i> 5-STAR RATED <i>✦</i> DIGITAL X-RAYS <i>✦</i> INSURANCE FRIENDLY <i>✦</i> INVISALIGN CERTIFIED <i>✦</i> SAME-DAY EMERGENCY CARE <i>✦</i></div></div>

      <section className="section services" id="services">
        <div className="section-head"><p className="eyebrow">Care, considered</p><h2>Everything your smile needs.<br/><em>Nothing it doesn&apos;t.</em></h2><p>From preventive care to full smile restoration, every treatment begins with a clear plan and an honest conversation.</p></div>
        <div className="service-grid">{services.map(s=><article key={s.n} className={`service-card ${s.featured?"featured":""}`}><div><span className="service-number">{s.n}</span><ArrowUpRight/></div><h3>{s.title}</h3><p>{s.copy}</p><strong>{s.price}</strong></article>)}</div>
      </section>

      <section className="about section" id="about">
        <div className="stats"><article><strong>12<sup>+</sup></strong><span>Years of focused practice</span></article><article><strong>8.4<sup>k</sup></strong><span>Smiles treated</span></article><article><strong>98<sup>%</sup></strong><span>Patient satisfaction</span></article></div>
        <div className="about-copy"><p className="eyebrow">Why Cusp</p><h2>Clinical precision.<br/><em>Human warmth.</em></h2><p>We designed Cusp around a simple belief: people make better care decisions when they feel heard. Your treatment plan is transparent, your questions are welcome, and your time is respected.</p><div className="doctors"><article><b>Dr. Maya Okonkwo</b><span>Lead dentist</span></article><article><b>Dr. Elias Bergström</b><span>Orthodontics</span></article><article><b>Dr. Priya Nandakumar</b><span>Pediatric care</span></article></div></div>
      </section>

      <section className="section results" id="results">
        <div className="section-head horizontal"><div><p className="eyebrow">Results</p><h2>Subtle work.<br/><em>Visible confidence.</em></h2></div><p>Use the sliders to explore representative treatment outcomes. These are clearly marked demo visuals for this fictional practice.</p></div>
        <div className="results-grid"><BeforeAfter label="Smile alignment" accent="#eaff55"/><BeforeAfter label="Whitening plan" accent="#ff9f7a"/></div>
      </section>

      <section className="section pricing" id="pricing">
        <div className="section-head"><p className="eyebrow">Memberships</p><h2>Predictable care,<br/><em>without surprises.</em></h2></div>
        <div className="pricing-grid">{plans.map(p=><article key={p.name} className={`plan ${p.tone}`}>{p.tag&&<span className="plan-tag">{p.tag}</span>}<h3>{p.name}</h3><p className="plan-price">{p.price}<small>{p.unit}</small></p><ul>{p.items.map(i=><li key={i}><Check size={16}/>{i}</li>)}</ul><a href="#contact">Choose this plan <ArrowUpRight size={16}/></a></article>)}</div>
      </section>

      <section className="reviews section" id="reviews">
        <div className="review-visual"><span>“</span><div className="review-stars" aria-label="Five stars">{[1,2,3,4,5].map(n=><Star key={n} size={17} fill="currentColor"/>)}</div></div>
        <div className="review-copy"><p className="eyebrow">Patient notes</p><blockquote>{reviews[review].quote}</blockquote><div className="review-meta"><p><strong>{reviews[review].name}</strong><span>{reviews[review].treatment}</span></p><div><button onClick={()=>setReview((review+reviews.length-1)%reviews.length)} aria-label="Previous review"><ArrowLeft/></button><button onClick={()=>setReview((review+1)%reviews.length)} aria-label="Next review"><ArrowRight/></button></div></div></div>
      </section>

      <section className="location section">
        <div className="map-card"><div className="map-grid"/><div className="map-pin"><MapPin/></div><span>12 Harbour Lane<br/>Indiranagar, Bengaluru</span></div>
        <div className="location-copy"><p className="eyebrow">Visit the studio</p><h2>Care that fits<br/><em>your week.</em></h2><div className="location-list"><p><Clock3/><span><b>Mon–Fri</b> 8:00–19:00<br/><b>Saturday</b> 9:00–14:00</span></p><p><Phone/><span>+91 00000 00000<br/>hello@cusp-demo.test</span></p></div><a className="text-link" href="#contact">Plan your visit <ArrowDownRight size={17}/></a></div>
      </section>

      <section className="contact section" id="contact">
        <div><p className="eyebrow">Start a conversation</p><h2>Your next smile<br/>starts <em>here.</em></h2><p>This is a fictional portfolio demo. Replace the practice details before using it for a real clinic.</p></div>
        {sent?<div className="success"><Check/><h3>Thanks—that&apos;s the demo flow.</h3><p>No information was sent or stored.</p><button onClick={()=>setSent(false)}>Return to the form</button></div>:<form onSubmit={submit}><label>Name<input name="name" required placeholder="Your name"/></label><label>Email<input name="email" type="email" required placeholder="you@example.com"/></label><label>How can we help?<textarea name="message" required placeholder="Tell us what you would like to improve"/></label><button className="button button-lime" type="submit">Request a consultation <ArrowUpRight size={18}/></button></form>}
      </section>

      <footer><a className="brand" href="#top"><span className="brand-mark">C</span><span>Cusp <em>Dental Studio</em></span></a><p>Fictional dental practice demo · Bengaluru</p><nav>{nav.map(i=><a key={i} href={`#${i.toLowerCase()}`}>{i}</a>)}</nav><span>Design demo · 2026</span></footer>
      <a className="whatsapp-float" href="#contact" aria-label="Open the demo contact form"><MessageCircle/></a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"Dentist",name:"Cusp Dental Studio",description:"Fictional premium dental clinic portfolio demo",address:{"@type":"PostalAddress",streetAddress:"12 Harbour Lane",addressLocality:"Bengaluru",addressCountry:"IN"},telephone:"+91 00000 00000",priceRange:"₹₹"})}}/>
    </main>
  );
}
