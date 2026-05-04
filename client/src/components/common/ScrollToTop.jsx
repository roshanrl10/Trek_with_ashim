import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scrolls to top of page every time the URL changes
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null // renders nothing — just a behavior
}

export default ScrollToTop