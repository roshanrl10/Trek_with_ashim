import Navbar from './Navbar'
import Footer from './Footer'

// Every page gets wrapped in this
// children = whatever page is currently active
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar always at the top */}
      <Navbar />

      {/* Main content — flex-1 makes it fill the available space */}
      {/* This pushes the footer to the bottom even on short pages */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer always at the bottom */}
      <Footer />
    </div>
  )
}

export default Layout