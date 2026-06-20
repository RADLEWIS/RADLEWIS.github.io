const btn = document.createElement('button')
btn.textContent = '🌙'
btn.className = 'theme-toggle'
btn.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;background:var(--color-card-bg);border:1px solid var(--color-border);border-radius:50%;width:2.5rem;height:2.5rem;cursor:pointer;font-size:1.1rem;transition:transform 0.2s;'
btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.1)')
btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)')

btn.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark')
  btn.textContent = isDark ? '🌙' : '☀️'
  localStorage.setItem('theme', isDark ? 'light' : 'dark')
})

const saved = localStorage.getItem('theme')
if (saved === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark')
  btn.textContent = '☀️'
}

document.body.appendChild(btn)
