// Theme is applied early by an inline script in <head> (avoids a white flash).
const root = document.documentElement

const ICONS = {
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
}

const isDark = () => root.getAttribute('data-theme') === 'dark'

// ---- Floating buttons: back-to-top + theme toggle ----
const floatBtns = document.createElement('div')
floatBtns.className = 'float-btns'

const topBtn = document.createElement('button')
topBtn.className = 'float-btn back-to-top'
topBtn.setAttribute('aria-label', 'Back to top')
topBtn.innerHTML = ICONS.up
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))

const themeBtn = document.createElement('button')
themeBtn.className = 'float-btn'
const renderThemeBtn = () => {
  themeBtn.innerHTML = isDark() ? ICONS.sun : ICONS.moon
  themeBtn.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode')
}
themeBtn.addEventListener('click', () => {
  const next = isDark() ? 'light' : 'dark'
  root.setAttribute('data-theme', next)
  localStorage.setItem('theme', next)
  renderThemeBtn()
})
renderThemeBtn()

// Follow the OS theme while the user hasn't picked one explicitly
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (localStorage.getItem('theme')) return
  root.setAttribute('data-theme', e.matches ? 'dark' : 'light')
  renderThemeBtn()
})

floatBtns.append(topBtn, themeBtn)
document.body.appendChild(floatBtns)

// ---- Nav: solid background after scrolling past the banner ----
const nav = document.querySelector('.nav')
const banner = document.querySelector('.hero-banner')

const onScroll = () => {
  const y = window.scrollY
  if (nav && banner) {
    nav.classList.toggle('is-scrolled', y > banner.offsetHeight - nav.offsetHeight)
  }
  topBtn.classList.toggle('is-visible', y > 600)
}
window.addEventListener('scroll', onScroll, { passive: true })
onScroll()

// ---- Nav: highlight current page / section ----
const navLinks = [...document.querySelectorAll('.nav-links a')]
const page = document.body.dataset.page
navLinks.forEach((a) => {
  if (a.dataset.page && a.dataset.page === page) a.classList.add('is-active')
})

const sectionLinks = navLinks.filter((a) => a.hash && document.querySelector(a.hash))
if (sectionLinks.length) {
  const setActive = (id) => {
    sectionLinks.forEach((a) => a.classList.toggle('is-active', a.hash === `#${id}`))
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
  }, { rootMargin: '-40% 0px -55% 0px' })
  sectionLinks.forEach((a) => observer.observe(document.querySelector(a.hash)))
}

// ---- Email: assembled at runtime to keep it away from naive scrapers ----
document.querySelectorAll('[data-email-user]').forEach((a) => {
  const addr = `${a.dataset.emailUser}@${a.dataset.emailDomain}`
  a.href = `mailto:${addr}`
})

// ---- Article: table of contents + reading progress ----
const article = document.querySelector('.article')
if (article) {
  const headings = [...article.querySelectorAll('section > h2, section > h3')]
  if (headings.length > 3) {
    const toc = document.createElement('nav')
    toc.className = 'toc'
    toc.setAttribute('aria-label', 'Table of contents')
    toc.innerHTML = `<p class="toc-title">${article.lang?.startsWith('zh') || root.lang.startsWith('zh') ? '目录' : 'Contents'}</p>`
    const list = document.createElement('ol')

    headings.forEach((h, i) => {
      if (!h.id) h.id = `sec-${i + 1}`
      const li = document.createElement('li')
      li.className = `toc-${h.tagName.toLowerCase()}`
      li.innerHTML = `<a href="#${h.id}">${h.textContent}</a>`
      list.appendChild(li)
    })
    toc.appendChild(list)
    article.querySelector('.article-header')?.after(toc)

    const tocLinks = [...toc.querySelectorAll('a')]
    const tocObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        tocLinks.forEach((a) => a.classList.toggle('is-active', a.hash === `#${e.target.id}`))
      })
    }, { rootMargin: '0px 0px -75% 0px' })
    headings.forEach((h) => tocObserver.observe(h))
  }

  const bar = document.createElement('div')
  bar.className = 'reading-progress'
  document.body.appendChild(bar)
  const updateProgress = () => {
    const rect = article.getBoundingClientRect()
    const total = rect.height - window.innerHeight
    const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1
    bar.style.transform = `scaleX(${p})`
  }
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress)
  updateProgress()
}
