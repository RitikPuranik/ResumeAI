import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Trash2, Save, FileText, Upload, Download, Eye, EyeOff, Loader2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { resumeAPI } from '../../api/resume';
import { Spinner } from '../../components/ui';

/* ─── Helpers ─────────────────────────────────────────────────────── */
function safeArr(v) { return Array.isArray(v) ? v : []; }
function safeStr(v) { return typeof v === 'string' ? v : ''; }
function joinArr(a) { return Array.isArray(a) ? a.join(', ') : typeof a === 'string' ? a : ''; }
function splitCSV(s) { return (typeof s === 'string' ? s : '').split(',').map(x => x.trim()).filter(Boolean); }

/* ─── Template HTML renderers ─────────────────────────────────────── */
function renderClassic(d) {
  const p = d.personalInfo || {}; const sk = d.skills || {};
  return `<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Times New Roman',serif;font-size:11px;color:#1a1a1a;background:#fff;line-height:1.5}.page{padding:40px 48px;max-width:800px;margin:0 auto}.header{text-align:center;border-bottom:2.5px solid #1e40af;padding-bottom:12px;margin-bottom:18px}.name{font-size:26px;font-weight:bold;color:#0f172a;letter-spacing:1px}.contact{font-size:10px;color:#475569;margin-top:5px}.contact span{margin:0 6px}.st{font-size:12px;font-weight:bold;color:#1e40af;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid #bfdbfe;padding-bottom:3px;margin-bottom:10px}.sec{margin-bottom:16px}.eh{display:flex;justify-content:space-between;align-items:baseline}.et{font-weight:bold;font-size:11.5px}.ed{font-size:10px;color:#64748b}.es{font-style:italic;color:#475569;font-size:10.5px}.bul{margin-left:16px;margin-top:4px}.bul li{margin-bottom:2px}.skw{display:flex;flex-wrap:wrap;gap:4px}.sk{background:#eff6ff;color:#1e40af;padding:2px 8px;border-radius:10px;font-size:9.5px;border:1px solid #bfdbfe}.sum{color:#374151;font-size:10.5px;line-height:1.6}</style><div class="page"><div class="header"><div class="name">${safeStr(p.fullName)||'Your Name'}</div><div class="contact">${[p.email&&`<span>✉ ${p.email}</span>`,p.phone&&`<span>📞 ${p.phone}</span>`,p.location&&`<span>📍 ${p.location}</span>`,p.linkedin&&`<span>🔗 ${p.linkedin}</span>`,p.github&&`<span>💻 ${p.github}</span>`].filter(Boolean).join('')}</div></div>${safeStr(p.summary)?`<div class="sec"><div class="st">Summary</div><div class="sum">${p.summary}</div></div>`:''} ${safeArr(d.workExperience).filter(w=>w.jobTitle).length?`<div class="sec"><div class="st">Work Experience</div>${safeArr(d.workExperience).filter(w=>w.jobTitle).map(w=>`<div style="margin-bottom:10px"><div class="eh"><span class="et">${w.jobTitle}</span><span class="ed">${w.startDate||''}${w.endDate||w.current?` – ${w.current?'Present':w.endDate}`:''}</span></div><div class="es">${[w.company,w.location].filter(Boolean).join(' · ')}</div>${safeArr(w.description).filter(Boolean).length?`<ul class="bul">${w.description.filter(Boolean).map(b=>`<li>${b}</li>`).join('')}</ul>`:''}</div>`).join('')}</div>`:''} ${safeArr(d.education).filter(e=>e.degree).length?`<div class="sec"><div class="st">Education</div>${safeArr(d.education).filter(e=>e.degree).map(e=>`<div style="display:flex;justify-content:space-between;margin-bottom:6px"><div><div class="et">${e.degree}${e.fieldOfStudy?` in ${e.fieldOfStudy}`:''}</div><div class="es">${e.institution}${e.grade?` · ${e.grade}`:''}</div></div><span class="ed">${e.startDate||''}${e.endDate?` – ${e.endDate}`:''}</span></div>`).join('')}</div>`:''} ${[...safeArr(sk.technical),...safeArr(sk.tools),...safeArr(sk.soft),...safeArr(sk.languages)].filter(Boolean).length?`<div class="sec"><div class="st">Skills</div><div class="skw">${[...safeArr(sk.technical),...safeArr(sk.tools),...safeArr(sk.soft),...safeArr(sk.languages)].filter(Boolean).map(s=>`<span class="sk">${s}</span>`).join('')}</div></div>`:''} ${safeArr(d.projects).filter(p=>p.title).length?`<div class="sec"><div class="st">Projects</div>${safeArr(d.projects).filter(p=>p.title).map(p=>`<div style="margin-bottom:8px"><div class="eh"><span class="et">${p.title}</span>${p.liveUrl?`<a href="${p.liveUrl}" style="font-size:9px;color:#6366f1">${p.liveUrl}</a>`:''}</div>${safeArr(p.techStack).length?`<div style="font-size:9.5px;color:#6366f1;margin-top:1px">${p.techStack.join(', ')}</div>`:''} ${safeArr(p.description).filter(Boolean).length?`<ul class="bul">${p.description.filter(Boolean).map(b=>`<li>${b}</li>`).join('')}</ul>`:''}</div>`).join('')}</div>`:''} ${safeArr(d.certifications).filter(c=>c.name).length?`<div class="sec"><div class="st">Certifications</div>${safeArr(d.certifications).filter(c=>c.name).map(c=>`<div style="display:flex;justify-content:space-between;margin-bottom:4px"><div><div class="et">${c.name}</div>${c.issuingBody?`<div class="es">${c.issuingBody}</div>`:''}</div>${c.issueDate?`<span class="ed">${c.issueDate}</span>`:''}</div>`).join('')}</div>`:''}</div>`;
}

function renderModern(d) {
  const p = d.personalInfo || {}; const sk = d.skills || {};
  return `<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',Arial,sans-serif;font-size:11px;color:#1a1a1a;background:#fff}.layout{display:flex;min-height:100vh}.sidebar{width:220px;background:#4f46e5;color:#fff;padding:28px 18px;flex-shrink:0}.main{flex:1;padding:28px 24px}.av{width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:bold;margin:0 auto 14px}.sn{font-size:14px;font-weight:bold;text-align:center;line-height:1.3}.sc{margin-top:16px}.sci{font-size:9.5px;color:rgba(255,255,255,.85);margin-bottom:5px;word-break:break-all}.ss{margin-top:18px}.sti{font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,.6);margin-bottom:8px;border-bottom:1px solid rgba(255,255,255,.2);padding-bottom:3px}.stag{background:rgba(255,255,255,.15);padding:3px 8px;border-radius:10px;font-size:9.5px;margin:2px 2px;display:inline-block}.mt{font-size:12px;font-weight:bold;color:#4f46e5;text-transform:uppercase;letter-spacing:1px;border-left:3px solid #4f46e5;padding-left:8px;margin-bottom:10px}.ms{margin-bottom:18px}.ent{margin-bottom:10px}.eh{display:flex;justify-content:space-between}.etitle{font-weight:600;font-size:11px}.esub{color:#64748b;font-size:10px;font-style:italic}.edate{font-size:9.5px;color:#94a3b8;white-space:nowrap}.bul{margin-left:14px;margin-top:3px}.bul li{margin-bottom:2px;font-size:10.5px;color:#374151}</style><div class="layout"><div class="sidebar"><div class="av">${(p.fullName||'?')[0]?.toUpperCase()}</div><div class="sn">${safeStr(p.fullName)||'Your Name'}</div><div class="sc">${[p.email&&`<div class="sci">✉ ${p.email}</div>`,p.phone&&`<div class="sci">📞 ${p.phone}</div>`,p.location&&`<div class="sci">📍 ${p.location}</div>`,p.linkedin&&`<div class="sci">🔗 ${p.linkedin}</div>`,p.github&&`<div class="sci">💻 ${p.github}</div>`].filter(Boolean).join('')}</div>${[...safeArr(sk.technical),...safeArr(sk.tools)].filter(Boolean).length?`<div class="ss"><div class="sti">Skills</div>${[...safeArr(sk.technical),...safeArr(sk.tools)].filter(Boolean).map(s=>`<span class="stag">${s}</span>`).join('')}</div>`:''} ${safeArr(sk.languages).filter(Boolean).length?`<div class="ss"><div class="sti">Languages</div>${safeArr(sk.languages).filter(Boolean).map(s=>`<span class="stag">${s}</span>`).join('')}</div>`:''}</div><div class="main">${safeStr(p.summary)?`<div style="margin-bottom:16px;font-size:10.5px;color:#374151;line-height:1.6;padding-bottom:12px;border-bottom:1px solid #e2e8f0">${p.summary}</div>`:''} ${safeArr(d.workExperience).filter(w=>w.jobTitle).length?`<div class="ms"><div class="mt">Experience</div>${safeArr(d.workExperience).filter(w=>w.jobTitle).map(w=>`<div class="ent"><div class="eh"><div><div class="etitle">${w.jobTitle}</div><div class="esub">${[w.company,w.location].filter(Boolean).join(' · ')}</div></div><div class="edate">${w.startDate||''}${w.endDate||w.current?` – ${w.current?'Present':w.endDate}`:''}</div></div>${safeArr(w.description).filter(Boolean).length?`<ul class="bul">${w.description.filter(Boolean).map(b=>`<li>${b}</li>`).join('')}</ul>`:''}</div>`).join('')}</div>`:''} ${safeArr(d.education).filter(e=>e.degree).length?`<div class="ms"><div class="mt">Education</div>${safeArr(d.education).filter(e=>e.degree).map(e=>`<div class="ent"><div class="eh"><div><div class="etitle">${e.degree}${e.fieldOfStudy?` — ${e.fieldOfStudy}`:''}</div><div class="esub">${e.institution}${e.grade?` · ${e.grade}`:''}</div></div><div class="edate">${e.startDate||''}${e.endDate?` – ${e.endDate}`:''}</div></div></div>`).join('')}</div>`:''} ${safeArr(d.projects).filter(p=>p.title).length?`<div class="ms"><div class="mt">Projects</div>${safeArr(d.projects).filter(p=>p.title).map(p=>`<div class="ent"><div class="etitle">${p.title}${safeArr(p.techStack).length?` <span style="font-size:9.5px;color:#6366f1;font-weight:400">(${p.techStack.join(', ')})</span>`:''}</div>${safeArr(p.description).filter(Boolean).length?`<ul class="bul">${p.description.filter(Boolean).map(b=>`<li>${b}</li>`).join('')}</ul>`:''}</div>`).join('')}</div>`:''}</div></div>`;
}

function renderElegant(d) {
  const p = d.personalInfo || {}; const sk = d.skills || {};
  return `<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,'Times New Roman',serif;font-size:11px;color:#1c1917;background:#fdf8f0;line-height:1.6}.page{padding:44px 52px;max-width:800px;margin:0 auto}.hdr{text-align:center;padding-bottom:18px;margin-bottom:20px;border-bottom:2px solid #92400e}.name{font-size:28px;font-weight:bold;color:#1c1917;letter-spacing:2px;font-variant:small-caps}.contact{display:flex;justify-content:center;gap:14px;flex-wrap:wrap;margin-top:8px;font-size:9.5px;color:#57534e}.sec{margin-bottom:18px}.div{display:flex;align-items:center;gap:8px;margin-bottom:12px}.div::before,.div::after{content:'';flex:1;height:1px;background:#d4a96a}.st{font-size:13px;color:#92400e;letter-spacing:2px;text-transform:uppercase;text-align:center}.ent{margin-bottom:12px}.eh{display:flex;justify-content:space-between;align-items:baseline}.et{font-weight:bold;font-size:11.5px}.ed{font-size:9.5px;color:#78350f;font-style:italic}.es{font-size:10.5px;color:#57534e;font-style:italic;margin-top:1px}.bul{margin-left:16px;margin-top:4px}.bul li{margin-bottom:2px}.skr{display:flex;flex-wrap:wrap;justify-content:center;gap:6px}.sk{background:#fef3c7;color:#78350f;border:1px solid #d4a96a;padding:2px 10px;border-radius:20px;font-size:9.5px}</style><div class="page"><div class="hdr"><div class="name">${safeStr(p.fullName)||'Your Name'}</div>${safeStr(p.summary)?`<div style="font-size:10.5px;font-style:italic;margin-top:6px;color:#57534e">${p.summary.substring(0,120)}…</div>`:''}<div class="contact">${[p.email,p.phone,p.location,p.linkedin,p.github].filter(Boolean).join(' · ')}</div></div>${safeArr(d.workExperience).filter(w=>w.jobTitle).length?`<div class="sec"><div class="div"><span class="st">Experience</span></div>${safeArr(d.workExperience).filter(w=>w.jobTitle).map(w=>`<div class="ent"><div class="eh"><span class="et">${w.jobTitle}</span><span class="ed">${w.startDate||''}${w.endDate||w.current?` – ${w.current?'Present':w.endDate}`:''}</span></div><div class="es">${[w.company,w.location].filter(Boolean).join(', ')}</div>${safeArr(w.description).filter(Boolean).length?`<ul class="bul">${w.description.filter(Boolean).map(b=>`<li>${b}</li>`).join('')}</ul>`:''}</div>`).join('')}</div>`:''} ${safeArr(d.education).filter(e=>e.degree).length?`<div class="sec"><div class="div"><span class="st">Education</span></div>${safeArr(d.education).filter(e=>e.degree).map(e=>`<div class="ent"><div class="eh"><span class="et">${e.degree}${e.fieldOfStudy?` in ${e.fieldOfStudy}`:''}</span><span class="ed">${e.startDate||''}${e.endDate?` – ${e.endDate}`:''}</span></div><div class="es">${e.institution}${e.grade?` · ${e.grade}`:''}</div></div>`).join('')}</div>`:''} ${[...safeArr(sk.technical),...safeArr(sk.tools),...safeArr(sk.soft)].filter(Boolean).length?`<div class="sec"><div class="div"><span class="st">Skills</span></div><div class="skr">${[...safeArr(sk.technical),...safeArr(sk.tools),...safeArr(sk.soft)].filter(Boolean).map(s=>`<span class="sk">${s}</span>`).join('')}</div></div>`:''} ${safeArr(d.projects).filter(p=>p.title).length?`<div class="sec"><div class="div"><span class="st">Projects</span></div>${safeArr(d.projects).filter(p=>p.title).map(p=>`<div class="ent"><div class="et">${p.title}</div>${safeArr(p.techStack).length?`<div class="es">Tech: ${p.techStack.join(', ')}</div>`:''} ${safeArr(p.description).filter(Boolean).length?`<ul class="bul">${p.description.filter(Boolean).map(b=>`<li>${b}</li>`).join('')}</ul>`:''}</div>`).join('')}</div>`:''}</div>`;
}

function renderCreative(d) {
  const p = d.personalInfo || {}; const sk = d.skills || {};
  return `<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',Arial,sans-serif;font-size:11px;color:#f1f5f9;background:#0f172a}.page{padding:32px 36px;max-width:800px;margin:0 auto}.hdr{border-left:4px solid #ec4899;padding-left:16px;margin-bottom:24px}.name{font-size:26px;font-weight:800;color:#fff}.contact{display:flex;flex-wrap:wrap;gap:10px;margin-top:6px}.cs{font-size:9.5px;color:#ec4899}.sum{font-size:10.5px;color:#94a3b8;margin-top:8px;line-height:1.6}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.sec{margin-bottom:20px}.st{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#ec4899;margin-bottom:10px}.card{background:#1e293b;border-radius:8px;padding:10px 12px;margin-bottom:8px}.ct{font-weight:700;color:#fff;font-size:11px}.cs2{font-size:9.5px;color:#94a3b8;margin-top:1px}.bul{margin-left:14px;margin-top:5px}.bul li{color:#cbd5e1;margin-bottom:2px;font-size:10px}.sk{display:inline-block;background:rgba(236,72,153,.15);border:1px solid rgba(236,72,153,.4);color:#f9a8d4;padding:2px 8px;border-radius:4px;font-size:9.5px;margin:2px}.fw{grid-column:1/-1}</style><div class="page"><div class="hdr"><div class="name">${safeStr(p.fullName)||'Your Name'}</div><div class="contact">${[p.email,p.phone,p.location,p.linkedin,p.github].filter(Boolean).map(v=>`<span class="cs">${v}</span>`).join('')}</div>${safeStr(p.summary)?`<div class="sum">${p.summary}</div>`:''}</div><div class="grid">${safeArr(d.workExperience).filter(w=>w.jobTitle).length?`<div class="sec fw"><div class="st">Experience</div>${safeArr(d.workExperience).filter(w=>w.jobTitle).map(w=>`<div class="card"><div class="ct">${w.jobTitle} <span style="font-size:9px;color:#ec4899;float:right">${w.startDate||''}${w.endDate||w.current?` – ${w.current?'Present':w.endDate}`:''}</span></div><div class="cs2">${[w.company,w.location].filter(Boolean).join(' · ')}</div>${safeArr(w.description).filter(Boolean).length?`<ul class="bul">${w.description.filter(Boolean).map(b=>`<li>${b}</li>`).join('')}</ul>`:''}</div>`).join('')}</div>`:''} ${safeArr(d.projects).filter(p=>p.title).length?`<div class="sec"><div class="st">Projects</div>${safeArr(d.projects).filter(p=>p.title).map(p=>`<div class="card"><div class="ct">${p.title}</div>${safeArr(p.techStack).length?`<div class="cs2">${p.techStack.join(' · ')}</div>`:''} ${safeArr(p.description).filter(Boolean).length?`<ul class="bul">${p.description.filter(Boolean).map(b=>`<li>${b}</li>`).join('')}</ul>`:''}</div>`).join('')}</div>`:''}<div>${safeArr(d.education).filter(e=>e.degree).length?`<div class="sec"><div class="st">Education</div>${safeArr(d.education).filter(e=>e.degree).map(e=>`<div class="card"><div class="ct">${e.degree}</div><div class="cs2">${e.institution}${e.grade?` · ${e.grade}`:''}</div><div class="cs2">${e.startDate||''}${e.endDate?` – ${e.endDate}`:''}</div></div>`).join('')}</div>`:''} ${[...safeArr(sk.technical),...safeArr(sk.tools),...safeArr(sk.soft)].filter(Boolean).length?`<div class="sec"><div class="st">Skills</div><div>${[...safeArr(sk.technical),...safeArr(sk.tools),...safeArr(sk.soft)].filter(Boolean).map(s=>`<span class="sk">${s}</span>`).join('')}</div></div>`:''}</div></div></div>`;
}

function renderCompact(d) {
  const p = d.personalInfo || {}; const sk = d.skills || {};
  return `<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:10.5px;color:#111;background:#fff;line-height:1.4}.page{padding:28px 36px;max-width:800px;margin:0 auto}.hdr{background:#065f46;color:#fff;padding:14px 20px;border-radius:6px;display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}.name{font-size:20px;font-weight:bold}.cr{font-size:9px;color:rgba(255,255,255,.85);text-align:right;line-height:1.8}.layout{display:grid;grid-template-columns:3fr 2fr;gap:16px}.sec{margin-bottom:12px}.st{font-size:10px;font-weight:bold;color:#065f46;text-transform:uppercase;letter-spacing:1px;border-bottom:1.5px solid #a7f3d0;padding-bottom:2px;margin-bottom:7px}.ent{margin-bottom:7px}.eh{display:flex;justify-content:space-between;align-items:baseline}.et{font-weight:bold;font-size:10.5px}.ed{font-size:9px;color:#065f46}.es{font-size:9.5px;color:#64748b}.bul{margin-left:12px;margin-top:2px}.bul li{font-size:9.5px;margin-bottom:1px}.sk{display:inline-block;background:#ecfdf5;border:1px solid #6ee7b7;color:#065f46;padding:1px 7px;border-radius:10px;font-size:9px;margin:1.5px}.sum{font-size:10px;color:#374151;line-height:1.5;margin-bottom:12px}</style><div class="page"><div class="hdr"><div><div class="name">${safeStr(p.fullName)||'Your Name'}</div></div><div class="cr">${[p.email,p.phone,p.location,p.linkedin].filter(Boolean).join('<br>')}</div></div>${safeStr(p.summary)?`<div class="sum">${p.summary}</div>`:''}<div class="layout"><div>${safeArr(d.workExperience).filter(w=>w.jobTitle).length?`<div class="sec"><div class="st">Experience</div>${safeArr(d.workExperience).filter(w=>w.jobTitle).map(w=>`<div class="ent"><div class="eh"><span class="et">${w.jobTitle}</span><span class="ed">${w.startDate||''}${w.current?' – Present':w.endDate?` – ${w.endDate}`:''}</span></div><div class="es">${[w.company,w.location].filter(Boolean).join(' · ')}</div>${safeArr(w.description).filter(Boolean).length?`<ul class="bul">${w.description.filter(Boolean).map(b=>`<li>${b}</li>`).join('')}</ul>`:''}</div>`).join('')}</div>`:''} ${safeArr(d.projects).filter(p=>p.title).length?`<div class="sec"><div class="st">Projects</div>${safeArr(d.projects).filter(p=>p.title).map(p=>`<div class="ent"><div class="et">${p.title}${safeArr(p.techStack).length?` — <span style="font-size:9px;color:#065f46;font-weight:400">${p.techStack.join(', ')}</span>`:''}</div>${safeArr(p.description).filter(Boolean).length?`<ul class="bul">${p.description.filter(Boolean).map(b=>`<li>${b}</li>`).join('')}</ul>`:''}</div>`).join('')}</div>`:''}</div><div>${safeArr(d.education).filter(e=>e.degree).length?`<div class="sec"><div class="st">Education</div>${safeArr(d.education).filter(e=>e.degree).map(e=>`<div class="ent"><div class="et">${e.degree}</div><div class="es">${e.institution}</div><div class="es">${e.startDate||''}${e.endDate?` – ${e.endDate}`:''} ${e.grade?`· ${e.grade}`:''}</div></div>`).join('')}</div>`:''} ${[...safeArr(sk.technical),...safeArr(sk.tools),...safeArr(sk.soft),...safeArr(sk.languages)].filter(Boolean).length?`<div class="sec"><div class="st">Skills</div><div>${[...safeArr(sk.technical),...safeArr(sk.tools),...safeArr(sk.soft),...safeArr(sk.languages)].filter(Boolean).map(s=>`<span class="sk">${s}</span>`).join('')}</div></div>`:''} ${safeArr(d.certifications).filter(c=>c.name).length?`<div class="sec"><div class="st">Certifications</div>${safeArr(d.certifications).filter(c=>c.name).map(c=>`<div class="ent"><div class="et">${c.name}</div>${c.issuingBody?`<div class="es">${c.issuingBody}</div>`:''} ${c.issueDate?`<div class="es">${c.issueDate}</div>`:''}</div>`).join('')}</div>`:''}</div></div></div>`;
}

const TEMPLATES = {
  classic:  { name: 'Classic',  render: renderClassic },
  modern:   { name: 'Modern',   render: renderModern },
  elegant:  { name: 'Elegant',  render: renderElegant },
  creative: { name: 'Creative', render: renderCreative },
  compact:  { name: 'Compact',  render: renderCompact },
};

/* ─── Sub-components ──────────────────────────────────────────────── */
const Section = ({ title, children, open, onToggle }) => (
  <div className="bg-white rounded-xl border border-cream-200 shadow-sm overflow-hidden">
    <button onClick={onToggle} className="w-full flex items-center justify-between p-4 text-left hover:bg-cream-50 transition-colors">
      <span className="font-semibold text-charcoal-800 text-sm">{title}</span>
      {open ? <ChevronUp size={16} className="text-sage-400" /> : <ChevronDown size={16} className="text-sage-400" />}
    </button>
    {open && <div className="px-4 pb-4 border-t border-cream-100 pt-4 space-y-3">{children}</div>}
  </div>
);

const F = ({ label, value, onChange, placeholder, type = 'text', required, multiline, rows = 3 }) => (
  <div>
    <label className="text-xs font-semibold text-sage-600 mb-1 block">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>
    {multiline
      ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className="w-full px-3 py-2.5 rounded-lg border border-cream-300 bg-white text-charcoal-800 placeholder-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-400 transition-all text-sm resize-none" />
      : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2.5 rounded-lg border border-cream-300 bg-white text-charcoal-800 placeholder-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-400 transition-all text-sm" />}
  </div>
);

const emptyExp  = () => ({ jobTitle: '', company: '', location: '', startDate: '', endDate: '', current: false, description: [''] });
const emptyEdu  = () => ({ degree: '', institution: '', fieldOfStudy: '', startDate: '', endDate: '', grade: '' });
const emptyProj = () => ({ title: '', company: '', techStack: '', liveUrl: '', description: [''] });
const emptyCert = () => ({ name: '', issuingBody: '', issueDate: '', expiryDate: '', credentialUrl: '' });

/* ─── Main ────────────────────────────────────────────────────────── */
export default function ResumeBuilder() {
  const navigate      = useNavigate();
  const [params]      = useSearchParams();
  const fileRef       = useRef(null);
  const tplId         = params.get('template') || 'classic';

  const [saving,          setSaving]         = useState(false);
  const [parsing,         setParsing]        = useState(false);
  const [showPreview,     setShowPreview]    = useState(true);
  const [activeTemplate,  setActiveTemplate] = useState(tplId in TEMPLATES ? tplId : 'classic');
  const [open, setOpen] = useState({ personal: true, work: false, edu: false, skills: false, projects: false, certs: false });
  const toggle = k => setOpen(p => ({ ...p, [k]: !p[k] }));

  const [title,    setTitle]    = useState('My Resume');
  const [personal, setPersonal] = useState({ fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '', summary: '' });
  const [work,     setWork]     = useState([emptyExp()]);
  const [edu,      setEdu]      = useState([emptyEdu()]);
  const [skills,   setSkills]   = useState({ technical: '', tools: '', soft: '', languages: '' });
  const [projects, setProjects] = useState([emptyProj()]);
  const [certs,    setCerts]    = useState([emptyCert()]);

  const setP = (k, v) => setPersonal(p => ({ ...p, [k]: v }));

  const resumeData = {
    personalInfo: personal,
    workExperience: work,
    education: edu,
    skills: { technical: splitCSV(skills.technical), tools: splitCSV(skills.tools), soft: splitCSV(skills.soft), languages: splitCSV(skills.languages) },
    projects: projects.map(p => ({ ...p, techStack: splitCSV(p.techStack) })),
    certifications: certs,
  };

  const previewHtml = TEMPLATES[activeTemplate].render(resumeData);

  /* PDF → AI parse */
  const handlePdfUpload = async (file) => {
    if (!file) return;
    setParsing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64 = e.target.result.split(',')[1];
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{ role: 'user', content: [
              { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
              { type: 'text', text: 'Extract all resume information and return ONLY valid JSON (no markdown, no explanation) matching this structure exactly: {"personalInfo":{"fullName":"","email":"","phone":"","location":"","linkedin":"","github":"","portfolio":"","summary":""},"workExperience":[{"jobTitle":"","company":"","location":"","startDate":"","endDate":"","current":false,"description":[""]}],"education":[{"degree":"","institution":"","fieldOfStudy":"","startDate":"","endDate":"","grade":""}],"skills":{"technical":[""],"tools":[""],"soft":[""],"languages":[""]},"projects":[{"title":"","company":"","techStack":[""],"liveUrl":"","description":[""]}],"certifications":[{"name":"","issuingBody":"","issueDate":"","expiryDate":"","credentialUrl":""}]}' }
            ]}]
          })
        });
        const data = await response.json();
        const text = (data.content || []).map(c => c.text || '').join('').replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(text);
        if (parsed.personalInfo) setPersonal(prev => ({ ...prev, ...parsed.personalInfo }));
        if (parsed.workExperience?.length) setWork(parsed.workExperience.map(w => ({ ...emptyExp(), ...w, description: w.description?.length ? w.description : [''] })));
        if (parsed.education?.length) setEdu(parsed.education.map(e => ({ ...emptyEdu(), ...e })));
        if (parsed.skills) setSkills({ technical: joinArr(parsed.skills.technical), tools: joinArr(parsed.skills.tools), soft: joinArr(parsed.skills.soft), languages: joinArr(parsed.skills.languages) });
        if (parsed.projects?.length) setProjects(parsed.projects.map(p => ({ ...emptyProj(), ...p, techStack: joinArr(p.techStack) })));
        if (parsed.certifications?.length) setCerts(parsed.certifications.map(c => ({ ...emptyCert(), ...c })));
        toast.success('✅ Resume parsed! Review and edit below.');
        setOpen({ personal: true, work: true, edu: true, skills: true, projects: true, certs: true });
      } catch (err) {
        toast.error('Could not parse PDF. Please fill in manually.');
      } finally {
        setParsing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  /* Download as PDF */
  const handleDownloadPdf = () => {
    const html = TEMPLATES[activeTemplate].render(resumeData);
    const blob = new Blob([`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${personal.fullName || 'Resume'}</title><style>@media print{body{margin:0}}</style></head><body>${html}</body></html>`], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) setTimeout(() => win.print(), 700);
    toast.success('Use browser Print → Save as PDF');
  };

  /* Save to backend */
  const handleSave = async () => {
    if (!personal.fullName.trim()) return toast.error('Full name is required');
    if (!personal.email.trim()) return toast.error('Email is required');
    setSaving(true);
    try {
      const payload = {
        title,
        personalInfo: personal,
        workExperience: work.filter(w => w.jobTitle).map(w => ({ ...w, description: w.description.filter(Boolean) })),
        education: edu.filter(e => e.degree && e.institution),
        skills: { technical: splitCSV(skills.technical), tools: splitCSV(skills.tools), soft: splitCSV(skills.soft), languages: splitCSV(skills.languages) },
        projects: projects.filter(p => p.title).map(p => ({ ...p, techStack: splitCSV(p.techStack), description: p.description.filter(Boolean) })),
        certifications: certs.filter(c => c.name),
      };
      const res = await resumeAPI.create(payload);
      const id = res.data?.data?._id || res.data?._id;
      toast.success('Resume saved!');
      navigate(id ? `/resumes/${id}` : '/resumes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal-800">Resume Builder</h1>
          <p className="text-xs text-sage-400">Live preview updates as you type</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="hidden md:flex items-center gap-1 bg-white border border-cream-200 rounded-lg p-1">
            {Object.entries(TEMPLATES).map(([id, tpl]) => (
              <button key={id} onClick={() => setActiveTemplate(id)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${activeTemplate === id ? 'bg-sage-500 text-white' : 'text-sage-600 hover:bg-cream-100'}`}>
                {tpl.name}
              </button>
            ))}
          </div>
          <button onClick={() => setShowPreview(v => !v)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-cream-200 rounded-lg text-xs font-medium text-sage-600 hover:bg-cream-50">
            {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>
          <button onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700">
            <Download size={13} /> PDF
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1.5 px-3 py-2 bg-sage-500 text-white rounded-lg text-xs font-medium hover:bg-sage-600 disabled:opacity-50">
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save
          </button>
        </div>
      </div>

      {/* Split layout */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Form panel */}
        <div className={`${showPreview ? 'w-[45%]' : 'w-full max-w-2xl mx-auto'} overflow-y-auto space-y-3 pb-6 pr-1`}>

          {/* Title */}
          <div className="bg-white rounded-xl border border-cream-200 p-4">
            <F label="Resume Title" value={title} onChange={setTitle} placeholder="e.g. Software Engineer Resume" />
          </div>

          {/* PDF import */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 p-4">
            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => handlePdfUpload(e.target.files?.[0])} />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                {parsing ? <Loader2 size={18} className="text-indigo-600 animate-spin" /> : <Sparkles size={18} className="text-indigo-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-indigo-800">Auto-fill from existing PDF resume</p>
                <p className="text-[10px] text-indigo-600 mt-0.5">AI extracts your info instantly</p>
              </div>
              <button onClick={() => fileRef.current?.click()} disabled={parsing}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5 flex-shrink-0">
                <Upload size={12} /> {parsing ? 'Parsing…' : 'Upload PDF'}
              </button>
            </div>
          </div>

          {/* Mobile template */}
          <div className="md:hidden flex gap-1 flex-wrap">
            {Object.entries(TEMPLATES).map(([id, tpl]) => (
              <button key={id} onClick={() => setActiveTemplate(id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${activeTemplate === id ? 'bg-sage-500 text-white border-sage-500' : 'bg-white text-sage-600 border-cream-300'}`}>
                {tpl.name}
              </button>
            ))}
          </div>

          {/* Personal */}
          <Section title="Personal Information" open={open.personal} onToggle={() => toggle('personal')}>
            <div className="grid grid-cols-2 gap-3">
              <F label="Full Name" value={personal.fullName} onChange={v => setP('fullName', v)} placeholder="Arjun Sharma" required />
              <F label="Email" value={personal.email} onChange={v => setP('email', v)} placeholder="arjun@email.com" type="email" required />
              <F label="Phone" value={personal.phone} onChange={v => setP('phone', v)} placeholder="+91 98765 43210" />
              <F label="Location" value={personal.location} onChange={v => setP('location', v)} placeholder="Mumbai, India" />
              <F label="LinkedIn" value={personal.linkedin} onChange={v => setP('linkedin', v)} placeholder="linkedin.com/in/arjun" />
              <F label="GitHub" value={personal.github} onChange={v => setP('github', v)} placeholder="github.com/arjun" />
            </div>
            <F label="Professional Summary" value={personal.summary} onChange={v => setP('summary', v)} placeholder="Brief 2–3 sentence professional summary…" multiline rows={3} />
          </Section>

          {/* Work */}
          <Section title={`Work Experience (${work.length})`} open={open.work} onToggle={() => toggle('work')}>
            {work.map((w, i) => (
              <div key={i} className="border border-cream-200 rounded-lg p-3 bg-cream-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-sage-500 uppercase tracking-wide">Experience {i + 1}</span>
                  {work.length > 1 && <button onClick={() => setWork(a => a.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-500"><Trash2 size={13} /></button>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <F label="Job Title" value={w.jobTitle} onChange={v => setWork(a => a.map((x, j) => j === i ? { ...x, jobTitle: v } : x))} placeholder="Software Engineer" required />
                  <F label="Company" value={w.company} onChange={v => setWork(a => a.map((x, j) => j === i ? { ...x, company: v } : x))} placeholder="Infosys" />
                  <F label="Location" value={w.location} onChange={v => setWork(a => a.map((x, j) => j === i ? { ...x, location: v } : x))} placeholder="Bangalore" />
                  <F label="Start Date" value={w.startDate} onChange={v => setWork(a => a.map((x, j) => j === i ? { ...x, startDate: v } : x))} placeholder="Jan 2022" />
                  {!w.current && <F label="End Date" value={w.endDate} onChange={v => setWork(a => a.map((x, j) => j === i ? { ...x, endDate: v } : x))} placeholder="Dec 2023" />}
                  <div className="flex items-center gap-2 pt-5">
                    <input type="checkbox" id={`curr-${i}`} checked={w.current} onChange={e => setWork(a => a.map((x, j) => j === i ? { ...x, current: e.target.checked } : x))} className="accent-sage-500" />
                    <label htmlFor={`curr-${i}`} className="text-xs text-sage-600">Currently here</label>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-sage-600 mb-2">Bullet Points</p>
                  {w.description.map((b, bi) => (
                    <div key={bi} className="flex gap-2 mb-1.5">
                      <input value={b} onChange={e => setWork(a => a.map((x, j) => j === i ? { ...x, description: x.description.map((d, k) => k === bi ? e.target.value : d) } : x))}
                        placeholder="Achieved…" className="flex-1 px-3 py-2 rounded-lg border border-cream-300 bg-white text-charcoal-800 placeholder-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-200 text-xs" />
                      {w.description.length > 1 && <button onClick={() => setWork(a => a.map((x, j) => j === i ? { ...x, description: x.description.filter((_, k) => k !== bi) } : x))} className="text-red-400"><Trash2 size={12} /></button>}
                    </div>
                  ))}
                  <button onClick={() => setWork(a => a.map((x, j) => j === i ? { ...x, description: [...x.description, ''] } : x))} className="text-[10px] text-sage-500 font-medium flex items-center gap-1 hover:text-sage-700">
                    <Plus size={11} /> Add bullet
                  </button>
                </div>
              </div>
            ))}
            <button onClick={() => setWork(a => [...a, emptyExp()])} className="w-full py-2 text-xs font-medium text-sage-500 border border-dashed border-sage-300 rounded-lg hover:bg-sage-50 flex items-center justify-center gap-1">
              <Plus size={13} /> Add Experience
            </button>
          </Section>

          {/* Education */}
          <Section title={`Education (${edu.length})`} open={open.edu} onToggle={() => toggle('edu')}>
            {edu.map((e, i) => (
              <div key={i} className="border border-cream-200 rounded-lg p-3 bg-cream-50/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-sage-500 uppercase tracking-wide">Education {i + 1}</span>
                  {edu.length > 1 && <button onClick={() => setEdu(a => a.filter((_, j) => j !== i))} className="text-red-400"><Trash2 size={13} /></button>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <F label="Degree" value={e.degree} onChange={v => setEdu(a => a.map((x, j) => j === i ? { ...x, degree: v } : x))} placeholder="B.Tech CS" required />
                  <F label="Institution" value={e.institution} onChange={v => setEdu(a => a.map((x, j) => j === i ? { ...x, institution: v } : x))} placeholder="IIT Mumbai" required />
                  <F label="Field of Study" value={e.fieldOfStudy} onChange={v => setEdu(a => a.map((x, j) => j === i ? { ...x, fieldOfStudy: v } : x))} placeholder="Computer Science" />
                  <F label="Grade / CGPA" value={e.grade} onChange={v => setEdu(a => a.map((x, j) => j === i ? { ...x, grade: v } : x))} placeholder="8.5 / 10" />
                  <F label="Start Year" value={e.startDate} onChange={v => setEdu(a => a.map((x, j) => j === i ? { ...x, startDate: v } : x))} placeholder="2018" />
                  <F label="End Year" value={e.endDate} onChange={v => setEdu(a => a.map((x, j) => j === i ? { ...x, endDate: v } : x))} placeholder="2022" />
                </div>
              </div>
            ))}
            <button onClick={() => setEdu(a => [...a, emptyEdu()])} className="w-full py-2 text-xs font-medium text-sage-500 border border-dashed border-sage-300 rounded-lg hover:bg-sage-50 flex items-center justify-center gap-1">
              <Plus size={13} /> Add Education
            </button>
          </Section>

          {/* Skills */}
          <Section title="Skills" open={open.skills} onToggle={() => toggle('skills')}>
            <p className="text-[10px] text-sage-400">Enter comma-separated values</p>
            <div className="grid grid-cols-2 gap-3">
              <F label="Technical Skills" value={skills.technical} onChange={v => setSkills(s => ({ ...s, technical: v }))} placeholder="React, Node.js, Python" />
              <F label="Tools & Platforms" value={skills.tools} onChange={v => setSkills(s => ({ ...s, tools: v }))} placeholder="Git, Docker, AWS" />
              <F label="Soft Skills" value={skills.soft} onChange={v => setSkills(s => ({ ...s, soft: v }))} placeholder="Leadership, Communication" />
              <F label="Languages" value={skills.languages} onChange={v => setSkills(s => ({ ...s, languages: v }))} placeholder="English, Hindi" />
            </div>
          </Section>

          {/* Projects */}
          <Section title={`Projects (${projects.length})`} open={open.projects} onToggle={() => toggle('projects')}>
            {projects.map((p, i) => (
              <div key={i} className="border border-cream-200 rounded-lg p-3 bg-cream-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-sage-500 uppercase tracking-wide">Project {i + 1}</span>
                  {projects.length > 1 && <button onClick={() => setProjects(a => a.filter((_, j) => j !== i))} className="text-red-400"><Trash2 size={13} /></button>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <F label="Title" value={p.title} onChange={v => setProjects(a => a.map((x, j) => j === i ? { ...x, title: v } : x))} placeholder="E-commerce App" required />
                  <F label="Tech Stack" value={p.techStack} onChange={v => setProjects(a => a.map((x, j) => j === i ? { ...x, techStack: v } : x))} placeholder="React, Node.js" />
                  <F label="Live URL" value={p.liveUrl} onChange={v => setProjects(a => a.map((x, j) => j === i ? { ...x, liveUrl: v } : x))} placeholder="https://myapp.com" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-sage-600 mb-2">Description Bullets</p>
                  {p.description.map((b, bi) => (
                    <input key={bi} value={b} onChange={e => setProjects(a => a.map((x, j) => j === i ? { ...x, description: x.description.map((d, k) => k === bi ? e.target.value : d) } : x))}
                      placeholder="Built feature that…" className="w-full px-3 py-2 mb-1.5 rounded-lg border border-cream-300 bg-white text-charcoal-800 placeholder-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-200 text-xs" />
                  ))}
                  <button onClick={() => setProjects(a => a.map((x, j) => j === i ? { ...x, description: [...x.description, ''] } : x))} className="text-[10px] text-sage-500 font-medium flex items-center gap-1 hover:text-sage-700">
                    <Plus size={11} /> Add bullet
                  </button>
                </div>
              </div>
            ))}
            <button onClick={() => setProjects(a => [...a, emptyProj()])} className="w-full py-2 text-xs font-medium text-sage-500 border border-dashed border-sage-300 rounded-lg hover:bg-sage-50 flex items-center justify-center gap-1">
              <Plus size={13} /> Add Project
            </button>
          </Section>

          {/* Certifications */}
          <Section title={`Certifications (${certs.length})`} open={open.certs} onToggle={() => toggle('certs')}>
            {certs.map((c, i) => (
              <div key={i} className="border border-cream-200 rounded-lg p-3 bg-cream-50/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-sage-500 uppercase tracking-wide">Cert {i + 1}</span>
                  {certs.length > 1 && <button onClick={() => setCerts(a => a.filter((_, j) => j !== i))} className="text-red-400"><Trash2 size={13} /></button>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <F label="Name" value={c.name} onChange={v => setCerts(a => a.map((x, j) => j === i ? { ...x, name: v } : x))} placeholder="AWS Solutions Architect" required />
                  <F label="Issuing Body" value={c.issuingBody} onChange={v => setCerts(a => a.map((x, j) => j === i ? { ...x, issuingBody: v } : x))} placeholder="Amazon" />
                  <F label="Issue Date" value={c.issueDate} onChange={v => setCerts(a => a.map((x, j) => j === i ? { ...x, issueDate: v } : x))} placeholder="Jan 2023" />
                  <F label="Expiry Date" value={c.expiryDate} onChange={v => setCerts(a => a.map((x, j) => j === i ? { ...x, expiryDate: v } : x))} placeholder="Jan 2026" />
                </div>
              </div>
            ))}
            <button onClick={() => setCerts(a => [...a, emptyCert()])} className="w-full py-2 text-xs font-medium text-sage-500 border border-dashed border-sage-300 rounded-lg hover:bg-sage-50 flex items-center justify-center gap-1">
              <Plus size={13} /> Add Certification
            </button>
          </Section>

          <button onClick={handleSave} disabled={saving} className="w-full py-3 bg-sage-500 text-white rounded-xl font-semibold text-sm hover:bg-sage-600 disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><FileText size={16} /> Save Resume</>}
          </button>
        </div>

        {/* Preview panel */}
        {showPreview && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-medium text-sage-500">Live Preview — {TEMPLATES[activeTemplate].name}</span>
              </div>
              <button onClick={handleDownloadPdf} className="text-xs text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1">
                <Download size={12} /> Save as PDF
              </button>
            </div>
            <div className="flex-1 bg-white rounded-xl border border-cream-200 shadow-md overflow-hidden">
              <iframe
                srcDoc={`<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0">${previewHtml}</body></html>`}
                className="w-full h-full border-0"
                style={{ minHeight: '600px' }}
                title="Resume Preview"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}