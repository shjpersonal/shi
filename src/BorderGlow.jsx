import { useRef } from 'react'
import './BorderGlow.css'

export default function BorderGlow({ children, className = '' }) {
  const cardRef = useRef(null)
  const handlePointerMove = (event) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`)
    card.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`)
  }
  return <article ref={cardRef} onPointerMove={handlePointerMove} className={`profile-glass-card ${className}`.trim()}>{children}</article>
}
