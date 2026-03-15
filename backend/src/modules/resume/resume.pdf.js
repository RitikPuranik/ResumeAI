/**
 * Generates ATS-friendly PDF from resume data
 * Uses puppeteer to render HTML → PDF
 * company fields are optional — if empty, they are simply not rendered
 */
export const generatePdf = async (resume) => {
  const { default: puppeteer } = await import('puppeteer')
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  const page    = await browser.newPage()

  const html = buildResumeHtml(resume)
  await page.setContent(html, { waitUntil: 'networkidle0' })

  const pdf = await page.pdf({ format: 'A4', margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } })
  await browser.close()
  return pdf
}

const buildResumeHtml = (resume) => {
  const { personalInfo: p, workExperience, education, skills, projects, certifications } = resume

  const bulletList = (items) => items?.map(i => `<li>${i}</li>`).join('') || ''
  const tagList    = (items) => items?.map(i => `<span class="tag">${i}</span>`).join('') || ''

  // Only render company line if it has a value
  const companyLine = (company, location, start, end, current) => {
    const parts = [company, location].filter(Boolean).join(' | ')
    const dates = `${start} – ${current ? 'Present' : end}`
    return parts ? `<div class="subtitle">${parts} &nbsp;|&nbsp; ${dates}</div>` : `<div class="subtitle">${dates}</div>`
  }

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; font-size: 11px; color: #222; line-height: 1.5; }
  h1 { font-size: 22px; font-weight: bold; }
  h2 { font-size: 13px; border-bottom: 1px solid #333; padding-bottom: 2px; margin: 14px 0 6px; text-transform: uppercase; letter-spacing: 1px; }
  h3 { font-size: 12px; font-weight: bold; }
  .contact { font-size: 10px; color: #555; margin-top: 4px; }
  .subtitle { color: #555; font-size: 10px; margin-bottom: 4px; }
  ul { padding-left: 16px; margin-top: 4px; }
  li { margin-bottom: 2px; }
  .tag { background: #eee; padding: 1px 6px; border-radius: 3px; font-size: 10px; margin-right: 4px; display: inline-block; margin-bottom: 3px; }
  .entry { margin-bottom: 10px; }
</style>
</head><body>
<h1>${p.fullName}</h1>
<div class="contact">${[p.email, p.phone, p.location, p.linkedin, p.github, p.portfolio].filter(Boolean).join(' | ')}</div>
${p.summary ? `<p style="margin-top:8px">${p.summary}</p>` : ''}

${workExperience?.length ? `<h2>Work Experience</h2>${workExperience.map(w => `
  <div class="entry">
    <h3>${w.jobTitle}</h3>
    ${companyLine(w.company, w.location, w.startDate, w.endDate, w.current)}
    <ul>${bulletList(w.description)}</ul>
  </div>`).join('')}` : ''}

${education?.length ? `<h2>Education</h2>${education.map(e => `
  <div class="entry">
    <h3>${e.degree}${e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ''}</h3>
    ${companyLine(e.institution, e.company, e.startDate, e.endDate, false)}
    ${e.grade ? `<div>Grade: ${e.grade}</div>` : ''}
  </div>`).join('')}` : ''}

${(skills?.technical?.length || skills?.tools?.length || skills?.soft?.length) ? `
<h2>Skills</h2>
${skills.technical?.length ? `<div><strong>Technical:</strong> ${tagList(skills.technical)}</div>` : ''}
${skills.tools?.length     ? `<div><strong>Tools:</strong> ${tagList(skills.tools)}</div>` : ''}
${skills.soft?.length      ? `<div><strong>Soft Skills:</strong> ${tagList(skills.soft)}</div>` : ''}
${skills.languages?.length ? `<div><strong>Languages:</strong> ${tagList(skills.languages)}</div>` : ''}` : ''}

${projects?.length ? `<h2>Projects</h2>${projects.map(proj => `
  <div class="entry">
    <h3>${proj.title}${proj.company ? ` <span style="font-weight:normal;color:#555;">@ ${proj.company}</span>` : ''}</h3>
    ${proj.techStack?.length ? `<div class="subtitle">${proj.techStack.join(', ')}</div>` : ''}
    <ul>${bulletList(proj.description)}</ul>
    ${proj.liveUrl ? `<div><a href="${proj.liveUrl}">Live</a></div>` : ''}
  </div>`).join('')}` : ''}

${certifications?.length ? `<h2>Certifications</h2>${certifications.map(c => `
  <div class="entry">
    <h3>${c.name}</h3>
    ${companyLine(c.issuingBody, '', c.issueDate, c.expiryDate, false)}
  </div>`).join('')}` : ''}

</body></html>`
}
