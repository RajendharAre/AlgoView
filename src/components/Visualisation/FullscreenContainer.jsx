import { useState, useEffect } from 'react'
import { Minimize2 } from 'lucide-react'

const FullscreenContainer = ({ children, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={exitFullscreen}
          className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors shadow-lg"
          aria-label="Exit fullscreen"
        >
          <Minimize2 size={20} />
        </button>
      </div>
      <div className="h-full">
        {children}
      </div>
    </div>
  )
}

export default FullscreenContainer