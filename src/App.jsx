import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import ScrollProgress from './components/ScrollProgress'
import SignalBands from './components/SignalBands'
import Hero from './sections/Hero'
import About from './sections/About'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Education from './sections/Education'
import Contact from './sections/Contact'

export default function App() {
  return (
    <div className="min-h-screen overflow-x-clip bg-bg text-text">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <SignalBands />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
      <div aria-hidden="true" className="grain" />
      <Cursor />
    </div>
  )
}
