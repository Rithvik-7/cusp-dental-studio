"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Download, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { clinic, treatments } from "@/lib/clinic";

function indiaNow() {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const part = (type: string) => parts.find(p => p.type === type)?.value ?? "00";
  return { date: `${part("year")}-${part("month")}-${part("day")}`, minutes: Number(part("hour")) * 60 + Number(part("minute")) };
}
function offsetDate(value: string, days: number) { const d = new Date(`${value}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10); }
export function slotsFor(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return [];
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  if (!Number.isFinite(day) || day === 0) return [];
  const [start, end] = day === 6 ? clinic.hours.saturday : clinic.hours.weekdays;
  const now = indiaNow();
  return Array.from({ length: end - start }, (_, i) => `${String(start + i).padStart(2, "0")}:00`).filter(time => date !== now.date || Number(time.slice(0, 2)) * 60 > now.minutes);
}
const dateLabel = (date: string) => date ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`)) : "";
export function Booking({ open, onOpenChange, initialTreatment }: { open: boolean; onOpenChange: (value: boolean) => void; initialTreatment: string }) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState(initialTreatment || "unsure");
  const [date, setDate] = useState(""); const [time, setTime] = useState("");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const today = indiaNow().date; const latest = offsetDate(today, 60);
  const quickDates = Array.from({ length: 9 }, (_, i) => offsetDate(today, i + 1)).filter(d => slotsFor(d).length > 0).slice(0, 6);
  const serviceName = treatments.find(t => t.id === service)?.title || "Help me choose";
  useEffect(() => { if (open) { setService(initialTreatment || "unsure"); setStep(0); setErrors({}); } }, [open, initialTreatment]);
  useEffect(() => { if (open) heading.current?.focus(); }, [step, open]);
  function next() {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!date || date < today || date > latest) e.date = "Choose a date within the next 60 days.";
      else if (!slotsFor(date).length) e.date = "No preferred times on this date. Choose another day.";
      if (!time || !slotsFor(date).includes(time)) e.time = "Select a preferred time.";
    }
    if (step === 2) {
      if (name.trim().length < 2) e.name = "Enter your name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Enter a valid email address.";
      if (phone && !/^(?:\+91)?[6-9]\d{9}$/.test(phone.replace(/[ ()-]/g, ""))) e.phone = "Enter a 10-digit Indian mobile number, or leave this blank.";
    }
    setErrors(e); if (Object.keys(e).length === 0) setStep(s => s + 1);
  }
  function download() {
    const text = `CUSP DENTAL STUDIO — VISIT PLAN\n\nDemonstration only. No appointment has been booked.\n\nTreatment: ${serviceName}\nPreferred date: ${dateLabel(date)}\nPreferred time: ${time} IST\nName: ${name.trim()}\nEmail: ${email.trim()}${phone ? `\nPhone: ${phone}` : ""}\n\nGenerated locally. Nothing was sent to a clinic.`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" })); const a = document.createElement("a"); a.href = url; a.download = "cusp-visit-plan.txt"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="cusp-dialog booking-dialog">
    <div className="dialog-kicker"><CalendarDays size={18}/> Your first step</div>
    <DialogTitle className="dialog-title" ref={heading} tabIndex={-1}>{["Let’s find your starting point.", "A time that works for you.", "A few details, then you’re set.", "Take one last look.", "Your visit plan is ready."][step]}</DialogTitle>
    <DialogDescription className="dialog-description">{step === 4 ? "This preview stays on your device. No appointment has been booked and nothing was sent." : "Explore the appointment preview. No payment or commitment."}</DialogDescription>
    {step < 4 && <div className="booking-progress" aria-label={`Step ${step + 1} of 4`}>{["Care", "Time", "Details", "Review"].map((label, i) => <span key={label} className={i <= step ? "reached" : ""}><b>{i < step ? <Check size={12}/> : i + 1}</b>{label}</span>)}</div>}
    <form noValidate onSubmit={e => { e.preventDefault(); next(); }}>
      {step === 0 && <fieldset className="booking-choices"><legend className="sr-only">Choose a treatment</legend>{[{ id: "unsure", title: "Help me choose" }, ...treatments].map(t => <label key={t.id} className={service === t.id ? "chosen" : ""}><input type="radio" name="treatment" value={t.id} checked={service === t.id} onChange={() => setService(t.id)}/><span>{t.title}</span><span className="choice-dot"/></label>)}</fieldset>}
      {step === 1 && <div className="booking-fields">
        <label htmlFor="visit-date">Preferred date <span>All times are India Standard Time</span></label>
        <div className="quick-dates" role="group" aria-label="Upcoming visit dates">{quickDates.map(d => <button type="button" className={d === date ? "selected" : ""} aria-pressed={d === date} aria-label={dateLabel(d)} key={d} onClick={() => { setDate(d); setTime(""); setErrors({}); }}><span>{new Intl.DateTimeFormat("en-IN", { weekday: "short", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`))}</span><strong>{Number(d.slice(-2))}</strong></button>)}</div>
        <input id="visit-date" type="date" min={today} max={latest} value={date} onInput={e => { setDate(e.currentTarget.value); setTime(""); setErrors({}); }} onChange={e => { setDate(e.target.value); setTime(""); setErrors({}); }} aria-invalid={!!errors.date} aria-describedby="date-error"/>
        <p className="field-error" id="date-error">{errors.date}</p>
        <fieldset><legend>Preferred time</legend><div className="time-grid">{slotsFor(date).map(t => <button className={time === t ? "selected" : ""} type="button" key={t} onClick={() => setTime(t)} aria-pressed={time === t}>{t}</button>)}</div>{!date && <p className="muted">Choose a date to see time preferences.</p>}{date && slotsFor(date).length === 0 && <p className="muted">No times on this date. Sundays are closed; try a future weekday.</p>}</fieldset>
        <p className="field-error" role="alert">{errors.time}</p><p className="fine-print">Preferred times are not confirmed appointment availability.</p>
      </div>}
      {step === 2 && <div className="booking-fields"><label htmlFor="visitor-name">Your name</label><input id="visitor-name" autoComplete="name" value={name} maxLength={100} onChange={e => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby="name-error" placeholder="Full name"/><p id="name-error" className="field-error">{errors.name}</p><label htmlFor="visitor-email">Email address</label><input id="visitor-email" type="email" autoComplete="email" value={email} maxLength={180} onChange={e => setEmail(e.target.value)} aria-invalid={!!errors.email} aria-describedby="email-error" placeholder="you@example.com"/><p id="email-error" className="field-error">{errors.email}</p><label htmlFor="visitor-phone">Mobile number <span>Optional</span></label><input id="visitor-phone" type="tel" autoComplete="tel" value={phone} maxLength={18} onChange={e => setPhone(e.target.value)} aria-invalid={!!errors.phone} aria-describedby="phone-error" placeholder="10-digit mobile number"/><p id="phone-error" className="field-error">{errors.phone}</p></div>}
      {(step === 3 || step === 4) && <div className="booking-summary">{step === 4 && <div className="success-icon"><Check/></div>}<dl><div><dt>Treatment</dt><dd>{serviceName}</dd></div><div><dt>Preferred visit</dt><dd>{dateLabel(date)}<br/>{time} IST</dd></div><div><dt>Your details</dt><dd>{name}<br/>{email}{phone && <><br/>{phone}</>}</dd></div></dl>{step === 3 && <button className="text-button" type="button" onClick={() => setStep(0)}><Pencil size={15}/> Edit request</button>}</div>}
      <div className="dialog-actions">{step > 0 && step < 4 && <button type="button" className="btn btn-quiet" onClick={() => setStep(step - 1)}><ArrowLeft size={17}/> Back</button>}{step < 4 ? <button className="btn btn-primary" type="submit">{step === 3 ? "Create my visit plan" : "Continue"}<ArrowRight size={17}/></button> : <><button type="button" className="btn btn-quiet" onClick={() => onOpenChange(false)}>Done</button><button type="button" className="btn btn-primary" onClick={download}><Download size={17}/> Save visit plan</button></>}</div>
    </form>
  </DialogContent></Dialog>;
}
