import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const PreviewPanel = ({ 
  emoji,
  onExport,
  className = '' 
}) => {
  const [exportSize, setExportSize] = useState(128)
  const [showOnDark, setShowOnDark] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const previewSizes = [
    { size: 16, label: '16px' },
    { size: 32, label: '32px' },
    { size: 64, label: '64px' },
    { size: 128, label: '128px' }
  ]

  const exportSizes = [16, 32, 64, 128, 256]

  const handleExport = () => {
    onExport?.({
      emoji,
      size: exportSize,
      format: 'png'
    })
  }

  return (
    <motion.div
      animate={{ width: collapsed ? 60 : 280 }}
      className={`bg-surface rounded-lg shadow-panel flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-600 flex items-center justify-between">
        {!collapsed && (
          <h3 className="font-display text-lg text-white">Preview</h3>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 text-gray-400 hover:text-white transition-colors"
        >
          <ApperIcon name={collapsed ? 'ChevronLeft' : 'ChevronRight'} size={16} />
        </button>
      </div>

      {!collapsed && (
        <>
          {/* Multi-size Preview */}
          <div className="p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-300">Live Preview</h4>
                <button
                  onClick={() => setShowOnDark(!showOnDark)}
                  className={`
                    px-2 py-1 rounded text-xs transition-colors
                    ${showOnDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}
                  `}
                >
                  {showOnDark ? 'Dark' : 'Light'}
                </button>
              </div>

              <div 
                className={`
                  rounded-lg p-4 grid grid-cols-2 gap-4
                  ${showOnDark ? 'bg-gray-900' : 'bg-white'}
                `}
              >
                {previewSizes.map(({ size, label }) => (
                  <div key={size} className="text-center">
                    <div className="flex items-center justify-center mb-2" style={{ height: size + 16 }}>
                      <div
                        className="rounded border border-gray-300"
                        style={{
                          width: size,
                          height: size,
                          backgroundColor: emoji?.backgroundColor || '#4ECDC4'
                        }}
                      />
                    </div>
                    <span className={`text-xs ${showOnDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emoji Info */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Emoji Info</h4>
              <div className="bg-background/50 rounded p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white">{emoji?.name || 'Untitled'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Size:</span>
                  <span className="text-white">{emoji?.width || 128}×{emoji?.height || 128}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Layers:</span>
                  <span className="text-white">{emoji?.layers?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="p-4 border-t border-gray-600 space-y-4">
            <h4 className="text-sm font-medium text-gray-300">Export</h4>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Export Size</label>
              <div className="grid grid-cols-3 gap-2">
                {exportSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setExportSize(size)}
                    className={`
                      px-2 py-1 text-xs rounded transition-colors
                      ${exportSize === size 
                        ? 'bg-primary text-white' 
                        : 'bg-background/50 text-gray-300 hover:text-white'
                      }
                    `}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleExport}
              icon="Download"
              className="w-full"
              variant="accent"
            >
              Export PNG
            </Button>
          </div>
        </>
      )}
    </motion.div>
  )
}

export default PreviewPanel