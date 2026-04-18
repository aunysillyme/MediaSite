import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('skip')) {
      onDone()
      return
    }
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setVisible(false)
            setTimeout(onDone, 400)
          }, 200)
          return 100
        }
        return p + Math.random() * 15
      })
    }, 50)
    return () => clearInterval(interval)
  }, [onDone])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#0A0005',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Artist name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: 900,
              letterSpacing: '0.05em',
              color: '#FF6B00',
              textShadow: '0 0 40px #FF6B00, 0 0 80px #FF6B0088',
              marginBottom: '0.5rem',
            }}
          >
            AunySillyMe
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: '1rem',
              letterSpacing: '0.4em',
              color: '#7B00FF',
              textShadow: '0 0 20px #7B00FF',
              marginBottom: '3rem',
              textTransform: 'uppercase',
            }}
          >
            — The Venue —
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ width: '240px', position: 'relative' }}
          >
            <div
              style={{
                width: '100%',
                height: '2px',
                background: '#1a001a',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <motion.div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #FF6B00, #7B00FF)',
                  boxShadow: '0 0 12px #FF6B00',
                  borderRadius: '2px',
                  width: `${Math.min(progress, 100)}%`,
                }}
              />
            </div>
            <div
              style={{
                textAlign: 'center',
                marginTop: '0.75rem',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                color: '#555',
              }}
            >
              ENTERING THE VENUE...
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
