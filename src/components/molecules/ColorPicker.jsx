import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ColorSwatch from '@/components/atoms/ColorSwatch'
import Slider from '@/components/atoms/Slider'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const ColorPicker = ({ 
  selectedColor = '#FF6B6B', 
  onColorChange, 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('swatches')
  const [customColor, setCustomColor] = useState(selectedColor)
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(100)
  const [lightness, setLightness] = useState(50)

  const presetColors = [
    '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#FFA502',
    '#EE5A6F', '#54A0FF', '#2A2D3A', '#FFFFFF', '#000000',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#FD79A8', '#6C5CE7', '#A29BFE', '#74B9FF', '#00CEC9'
  ]

  const recentColors = [
    '#FF6B6B', '#4ECDC4', '#FFE66D', '#2A2D3A'
  ]

  const tabs = [
    { id: 'swatches', label: 'Swatches', icon: 'Palette' },
    { id: 'custom', label: 'Custom', icon: 'Sliders' },
    { id: 'recent', label: 'Recent', icon: 'Clock' }
  ]

  const handleHSLChange = () => {
    const hslColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`
    setCustomColor(hslColor)
    onColorChange?.(hslColor)
  }

  return (
    <div className={`bg-surface rounded-lg p-4 space-y-4 ${className}`}>
      <div className="flex space-x-1 bg-background/50 rounded-lg p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md
              text-sm font-medium transition-all duration-200
              ${activeTab === tab.id 
                ? 'bg-primary text-white' 
                : 'text-gray-400 hover:text-white'
              }
            `}
          >
            <ApperIcon name={tab.icon} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'swatches' && (
          <motion.div
            key="swatches"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map(color => (
                <ColorSwatch
                  key={color}
                  color={color}
                  isSelected={selectedColor === color}
                  onClick={onColorChange}
                  size="lg"
                />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'custom' && (
          <motion.div
            key="custom"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value)
                  onColorChange?.(e.target.value)
                }}
                className="w-12 h-12 rounded-lg cursor-pointer"
              />
              <Input
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value)
                  onColorChange?.(e.target.value)
                }}
                placeholder="#FF6B6B"
                className="flex-1"
              />
            </div>

            <div className="space-y-3">
              <Slider
                label="Hue"
                value={hue}
                onChange={(value) => {
                  setHue(value)
                  handleHSLChange()
                }}
                min={0}
                max={360}
              />
              <Slider
                label="Saturation"
                value={saturation}
                onChange={(value) => {
                  setSaturation(value)
                  handleHSLChange()
                }}
                min={0}
                max={100}
              />
              <Slider
                label="Lightness"
                value={lightness}
                onChange={(value) => {
                  setLightness(value)
                  handleHSLChange()
                }}
                min={0}
                max={100}
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'recent' && (
          <motion.div
            key="recent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="flex gap-2">
              {recentColors.map(color => (
                <ColorSwatch
                  key={color}
                  color={color}
                  isSelected={selectedColor === color}
                  onClick={onColorChange}
                  size="lg"
                />
              ))}
            </div>
            <div className="text-sm text-gray-400 text-center py-4">
              Recent colors will appear here as you use them
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ColorPicker