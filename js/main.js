// Theme is applied early by an inline script in <head> (avoids a white flash).
const root = document.documentElement

// Use the text cursor only while the mouse is selecting page content.
let selectingPointer = null
const finishTextSelection = () => {
  selectingPointer = null
  root.classList.remove('is-selecting-text')
}
document.addEventListener('pointerdown', (e) => {
  if (e.pointerType !== 'mouse' || e.button !== 0) return
  if (!e.target.closest('main, .sections-wrap')) return
  if (e.target.closest('a, button, summary, input, textarea, select, [contenteditable]')) return
  selectingPointer = e.pointerId
})
document.addEventListener('selectionchange', () => {
  if (selectingPointer === null) return
  const selection = window.getSelection()
  root.classList.toggle('is-selecting-text', !!selection && !selection.isCollapsed)
})
document.addEventListener('pointermove', (e) => {
  if (e.pointerId === selectingPointer && !(e.buttons & 1)) finishTextSelection()
}, { passive: true })
document.addEventListener('pointerup', finishTextSelection)
document.addEventListener('pointercancel', finishTextSelection)
document.addEventListener('dragstart', finishTextSelection)
window.addEventListener('blur', finishTextSelection)

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

const nav = document.querySelector('.nav')
const navToggle = document.querySelector('.nav-toggle')
const bannerPicture = document.querySelector('.hero-banner picture')
const sectionsInner = document.querySelector('.sections-inner')
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

const closeNav = () => {
  nav.classList.remove('is-open')
  navToggle.setAttribute('aria-expanded', 'false')
  navToggle.setAttribute('aria-label', 'Open navigation')
}
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open')
  navToggle.setAttribute('aria-expanded', String(open))
  navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation')
  updateNavMarker()
})
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target)) closeNav()
})
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('is-open')) {
    closeNav()
    navToggle.focus()
  }
})

// ---- Scroll details ----
const onScroll = () => {
  const y = window.scrollY
  topBtn.classList.toggle('is-visible', y > 600)
  if (bannerPicture && !reduceMotion.matches) {
    const offset = Math.min(y, bannerPicture.offsetHeight) * 0.12
    bannerPicture.style.transform = `translate3d(0, ${offset}px, 0)`
  }
  if (sectionsInner && window.innerWidth > 1100) {
    const contentTop = sectionsInner.getBoundingClientRect().top + parseFloat(getComputedStyle(sectionsInner).paddingTop)
    const inset = parseFloat(getComputedStyle(nav).top)
    const bottomLimit = Math.max(inset, window.innerHeight - nav.offsetHeight - inset)
    const top = Math.min(Math.max(inset, contentTop), bottomLimit)
    nav.style.transform = `translate3d(0, ${top - inset}px, 0)`
  } else {
    nav.style.removeProperty('transform')
  }
}
window.addEventListener('scroll', onScroll, { passive: true })
window.addEventListener('resize', onScroll)
window.addEventListener('load', onScroll)
onScroll()

// ---- Nav: highlight current page / section ----
const navLinks = [...document.querySelectorAll('.nav-links a')]
const navLinksContainer = document.querySelector('.nav-links')
function updateNavMarker() {
  const active = navLinks.find((a) => a.classList.contains('is-active'))
  navLinksContainer.style.setProperty('--active-opacity', active?.offsetHeight ? '1' : '0')
  if (!active?.offsetHeight) return
  navLinksContainer.style.setProperty('--active-top', `${active.offsetTop}px`)
  navLinksContainer.style.setProperty('--active-height', `${active.offsetHeight}px`)
}
const page = document.body.dataset.page
navLinks.forEach((a) => {
  if (a.dataset.page && a.dataset.page === page) a.classList.add('is-active')
  a.addEventListener('click', closeNav)
})
window.addEventListener('resize', updateNavMarker)
document.fonts.ready.then(() => {
  onScroll()
  updateNavMarker()
})
updateNavMarker()

const sectionLinks = navLinks.filter((a) => a.hash && document.querySelector(a.hash))
if (sectionLinks.length) {
  let clickedSection = null
  const updateActiveSection = () => {
    const marker = Math.min(120, window.innerHeight * 0.2)
    let active = null
    for (const a of sectionLinks) {
      if (document.querySelector(a.hash).getBoundingClientRect().top <= marker) active = a
    }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      active = sectionLinks.at(-1)
    }
    if (clickedSection) active = clickedSection
    sectionLinks.forEach((a) => {
      a.classList.toggle('is-active', a === active)
      if (a === active) a.setAttribute('aria-current', 'location')
      else a.removeAttribute('aria-current')
    })
    updateNavMarker()
  }
  window.addEventListener('scroll', updateActiveSection, { passive: true })
  window.addEventListener('resize', updateActiveSection)
  window.addEventListener('load', updateActiveSection)
  sectionLinks.forEach((a) => a.addEventListener('click', () => {
    clickedSection = a
    updateActiveSection()
  }))
  const followReading = () => { clickedSection = null }
  window.addEventListener('wheel', followReading, { passive: true })
  window.addEventListener('touchmove', followReading, { passive: true })
  document.addEventListener('pointerdown', (e) => {
    if (!nav.contains(e.target)) followReading()
  })
  document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) followReading()
  })
  updateActiveSection()
}

// ---- Sections enter gently as they come into view ----
if (!reduceMotion.matches) {
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.remove('is-pending')
      reveal.unobserve(entry.target)
    })
  }, { rootMargin: '0px 0px 40px 0px' })
  document.querySelectorAll('.section').forEach((section) => {
    section.classList.add('is-pending')
    reveal.observe(section)
  })
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
