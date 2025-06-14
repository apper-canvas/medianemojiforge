import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import TopToolbar from '@/components/organisms/TopToolbar'
import ToolPanel from '@/components/organisms/ToolPanel'
import Canvas from '@/components/organisms/Canvas'
import ColorPicker from '@/components/molecules/ColorPicker'
import LayerPanel from '@/components/organisms/LayerPanel'
import PreviewPanel from '@/components/organisms/PreviewPanel'
import TemplateGallery from '@/components/organisms/TemplateGallery'
import ApperIcon from '@/components/ApperIcon'

const Editor = () => {
  const [emoji, setEmoji] = useState(null)
  const [activeTool, setActiveTool] = useState('select')
  const [selectedColor, setSelectedColor] = useState('#FF6B6B')
  const [brushSize, setBrushSize] = useState(10)
  const [selectedLayerId, setSelectedLayerId] = useState(null)
  const [showTemplateGallery, setShowTemplateGallery] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Initialize with welcome state
    if (!emoji) {
      setShowTemplateGallery(true)
    }
  }, [emoji])

  const handleNewEmoji = () => {
    const newEmoji = {
      id: 'new',
      name: 'New Emoji',
      width: 128,
      height: 128,
      backgroundColor: '#FFE66D',
      layers: []
    }
    setEmoji(newEmoji)
    setSelectedLayerId(null)
    toast.success('New emoji created')
  }

  const handleTemplateSelect = (template) => {
    if (template.baseEmoji) {
      setEmoji(template.baseEmoji)
      if (template.baseEmoji.layers?.length > 0) {
        setSelectedLayerId(template.baseEmoji.layers[0].id)
      }
    } else {
      handleNewEmoji()
    }
    setShowTemplateGallery(false)
  }

  const handleEmojiUpdate = (updatedEmoji) => {
    setEmoji(updatedEmoji)
  }

  const handleLayerUpdate = (updatedLayer) => {
    if (!emoji) return
    
    const updatedEmoji = {
      ...emoji,
      layers: emoji.layers.map(layer => 
        layer.id === updatedLayer.id ? updatedLayer : layer
      )
    }
    setEmoji(updatedEmoji)
  }

  const handleExport = async (options) => {
    setLoading(true)
    try {
      // Export logic would be handled by the service
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate export
      toast.success(`Emoji exported as ${options.size}x${options.size} PNG`)
    } catch (err) {
      toast.error('Export failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Toolbar */}
      <TopToolbar
        emoji={emoji}
        onEmojiUpdate={handleEmojiUpdate}
        onNewEmoji={handleNewEmoji}
        onShowTemplates={() => setShowTemplateGallery(true)}
        onExport={handleExport}
        className="flex-shrink-0"
      />

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Left Panel - Tools */}
        <div className="flex flex-col gap-4">
          <ToolPanel
            activeTool={activeTool}
            onToolChange={setActiveTool}
            brushSize={brushSize}
            onBrushSizeChange={setBrushSize}
            className="flex-shrink-0"
          />
          
          <ColorPicker
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
            className="flex-shrink-0"
          />
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 flex flex-col">
          {emoji ? (
            <Canvas
              emoji={emoji}
              activeTool={activeTool}
              brushSize={brushSize}
              selectedColor={selectedColor}
              selectedLayerId={selectedLayerId}
              onEmojiUpdate={handleEmojiUpdate}
              className="flex-1"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex items-center justify-center bg-surface/20 rounded-lg border-2 border-dashed border-gray-600"
            >
              <div className="text-center space-y-4">
                <ApperIcon name="Palette" size={64} className="mx-auto text-gray-400" />
                <div>
                  <h2 className="text-xl font-display text-white mb-2">
                    Welcome to EmojiForge
                  </h2>
                  <p className="text-gray-400 mb-6">
                    Create custom emojis with our intuitive editor
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowTemplateGallery(true)}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-full font-medium shadow-button"
                  >
                    Choose Template or Start Fresh
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Panel - Layers & Preview */}
        <div className="flex flex-col gap-4">
          <LayerPanel
            selectedLayerId={selectedLayerId}
            onLayerSelect={setSelectedLayerId}
            onLayerUpdate={handleLayerUpdate}
            className="flex-1"
          />
          
          <PreviewPanel
            emoji={emoji}
            onExport={handleExport}
            className="flex-shrink-0"
          />
        </div>
      </div>

      {/* Template Gallery Modal */}
      <TemplateGallery
        isOpen={showTemplateGallery}
        onClose={() => setShowTemplateGallery(false)}
        onSelectTemplate={handleTemplateSelect}
      />

      {/* Loading Overlay */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        >
          <div className="bg-surface rounded-lg p-6 flex items-center gap-4">
            <div className="animate-spin">
              <ApperIcon name="Loader2" size={24} className="text-primary" />
            </div>
            <span className="text-white">Processing...</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Editor