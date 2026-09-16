"use client";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { asset } from "@/lib/clinic";

export function ToothExplorer({ expanded = false }: { expanded?: boolean }) {
  const [reveal, setReveal] = useState(50); const [layer, setLayer] = useState(0); const [playing, setPlaying] = useState(false);
  const drag = useRef(false); const direction = useRef(1);
  const descriptions = [
    { title: "Enamel", text: "The hard outer covering on the crown of a tooth.", position: [63, 18] },
    { title: "Dentin", text: "The layer beneath enamel and the root’s outer covering.", position: [66, 38] },
    { title: "Pulp", text: "Soft tissue at the centre, containing nerves and blood vessels.", position: [50, 35] },
  ];
  useEffect(() => { if (!playing) return; const id = setInterval(() => setReveal(value => { if (value >= 96) direction.current = -1; if (value <= 4) direction.current = 1; return Math.max(0, Math.min(100, value + direction.current)); }), 40); return () => clearInterval(id); }, [playing]);
  const change = (value: number) => { setPlaying(false); setReveal(Math.max(0, Math.min(100, value))); };
  function pointer(e: PointerEvent<HTMLDivElement>) { const r = e.currentTarget.getBoundingClientRect(); change((e.clientX - r.left) / r.width * 100); }
  return <div className={`explorer ${expanded ? "expanded-explorer" : ""}`}><div className="explorer-visual"><div className="explorer-top"><span>01 / Tooth anatomy</span><span>Interactive view</span></div>
    <div className="tooth-compare" role="slider" tabIndex={0} aria-label="Reveal tooth interior" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(reveal)} aria-valuetext={`${Math.round(reveal)} percent interior revealed`} onKeyDown={e => { if (["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp", "Home", "End"].includes(e.key)) { e.preventDefault(); change(e.key === "Home" ? 0 : e.key === "End" ? 100 : reveal + (["ArrowLeft", "ArrowDown"].includes(e.key) ? -5 : 5)); } }} onPointerDown={e => { drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); pointer(e); }} onPointerMove={e => { if (drag.current) pointer(e); }} onPointerUp={e => { drag.current = false; if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); }} onPointerCancel={() => { drag.current = false; }}>
      <div className="tooth-layer tooth-exterior" style={{ backgroundImage: `url(${asset("tooth-explorer.png")})` }}/><div className="tooth-layer tooth-interior" style={{ backgroundImage: `url(${asset("tooth-explorer.png")})`, clipPath: `inset(0 ${100 - reveal}% 0 0)` }}/>
      {reveal > 70 && <span className="anatomy-marker" style={{ left: `${descriptions[layer].position[0]}%`, top: `${descriptions[layer].position[1]}%` }}>{layer + 1}</span>}
      <span className="compare-divider" style={{ left: `${reveal}%` }}><span><ArrowLeft size={16}/><ArrowRight size={16}/></span></span><span className="compare-label left">Inside</span><span className="compare-label right">Outside</span>
    </div><div className="explorer-controls"><button className="icon-btn" onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause tooth scan" : "Play tooth scan"}>{playing ? <Pause size={17}/> : <Play size={17}/>}</button><input type="range" min="0" max="100" value={reveal} onChange={e => change(Number(e.target.value))} aria-label="Tooth reveal amount"/><button className="icon-btn" onClick={() => { change(50); setLayer(0); }} aria-label="Reset tooth explorer"><RotateCcw size={17}/></button></div></div>
    <div className="explorer-information"><p className="section-label">A closer look</p><h3>More than<br/>meets the eye.</h3><p className="muted">Drag across the tooth to explore what’s beneath the surface.</p><div className="layer-buttons" role="group" aria-label="Tooth layers">{descriptions.map((item, i) => <button key={item.title} className={layer === i ? "active" : ""} aria-pressed={layer === i} onClick={() => { setLayer(i); change(100); }}><span>0{i + 1}</span>{item.title}<ChevronRight size={16}/></button>)}</div><p className="layer-description" aria-live="polite"><strong>{descriptions[layer].title}.</strong> {descriptions[layer].text}</p><a className="source-link" href="https://www.mouthhealthy.org/all-topics-a-z/tooth" target="_blank" rel="noreferrer">Anatomy guide · American Dental Association <ArrowUpRight size={13}/></a><p className="fine-print">Simplified educational illustration. Not a patient result or treatment prediction.</p></div>
  </div>;
}
