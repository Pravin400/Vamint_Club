import React, { useState, useRef, useEffect } from 'react'
import Login from './Login'

export default function Landing() {
  const [loginOpen, setLoginOpen] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    // attempt to play the video programmatically (some browsers restrict autoplay without user gesture)
    const v = videoRef.current
    if (!v) return

    // Ensure video is muted before play - many browsers require muted for autoplay
    try {
      v.muted = true
    } catch (e) {
      // ignore
    }

    const onCanPlay = () => {
      v.play().catch((err) => {
        console.debug('Background video play() blocked by browser:', err)
      })
    }

    v.addEventListener('canplay', onCanPlay)
    // Try a direct play() as well; can be blocked but worth trying
    v.play().catch((err) => {
      console.debug('Direct video.play() rejected (autoplay may be blocked):', err)
    })

    return () => {
      v.removeEventListener('canplay', onCanPlay)
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Full-viewport background video placeholder (100vh x 100vw) */}
        <div className="absolute inset-0 bg-black">
          {/* Using an externally hosted sample video. Replace with /video.mp4 in public/ if you prefer a local file. */}
          <video
            id="bg-video"
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="https://res.cloudinary.com/dpve6lgdt/video/upload/v1758609625/softdef_kav93q.mp4" type="video/mp4" />
            {/* Fallback: add a poster image or background color if video not available */}
          </video>
        </div>

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="w-full flex items-center justify-between px-8 py-4 bg-transparent">
          <div className="text-white text-2xl font-bold">Vamint Club</div>
          <div className="space-x-4">
            <button className="text-white px-4 py-2 rounded hover:bg-white/10" onClick={() => setLoginOpen(true)}>Login</button>
          </div>
        </nav>

        <header className="flex-1 flex items-center justify-center text-center px-6">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl font-extrabold mb-4">Vamint club Management </h1>
            <p className="text-lg mb-6">Fast, simple attendance and lecture management for students and admins. Use the Login button in the top-right to get started.</p>
            <div>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg" onClick={() => {
                const el = document.getElementById('about')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}>Learn more</button>
            </div>
          </div>
        </header>

        <footer className="py-6 text-center text-white/70">© {new Date().getFullYear()} Vamint Club</footer>
      </div>

      {/* Login modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setLoginOpen(false)} />
          <div className="relative z-[100000] w-full max-w-md mx-4">
            <Login isModal={true} onClose={() => setLoginOpen(false)} />
          </div>
        </div>
      )}

      {/* About section (appears when user clicks Learn more) */}
      <section id="about" className="relative z-20 bg-white/90 text-gray-900 p-8 md:p-16 mt-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-3xl font-bold mb-4">About Vamint Club</h2>
            <p className="mb-4">Vamint Club is a student-led organization focused on academic growth, community projects, and skill-building workshops. We organize regular lectures, hands-on sessions, and events to help students learn, collaborate, and showcase their work.</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Weekly lectures by faculty and guest speakers</li>
              <li>Attendance tracking and reporting for admins</li>
              <li>Workshops, projects, and student showcases</li>
            </ul>
            <p className="mb-4">Visit us to learn more about memberships, upcoming events, and how you can contribute.</p>
            <p className="font-medium">Location:</p>
            <p className="text-sm text-gray-700 mb-2">See our location on the map to the right. (Embedded Google Maps)</p>
          </div>

          <div className="w-full h-56 md:h-64 bg-gray-100 rounded-md overflow-hidden shadow">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d30246.303084010866!2d73.777152!3d18.628608!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9a4e8d2b591%3A0x4ef56ccd20373d98!2sMahasadhu%20Shree%20Morya%20Gosavi%20Maharaj%20Sanjivan%20Samadhi%20Mandir!5e0!3m2!1sen!2sin!4v1758607086619!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Vamint Club Location"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
