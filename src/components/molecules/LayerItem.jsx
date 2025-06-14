import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Slider from '@/components/atoms/Slider'

const LayerItem = ({ 
  layer, 
  isSelected = false, 
  onSelect, 
  onToggleVisibility, 
  onDelete,
  onUpdateOpacity,
  className = '' 
}) => {
  const [showControls, setShowControls] = useState(false)

  return (
    <motion.div
      layout
      className={`
        bg-surface/50 rounded-lg border-2 transition-all cursor-pointer
        ${isSelected ? 'border-primary bg-surface' : 'border-transparent hover:border-gray-600'}
        ${className}
      `}
      onClick={onSelect}
      onHoverStart={() => setShowControls(true)}
      onHoverEnd={() => setShowControls(false)}
    >
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleVisibility?.(layer.id)
              }}
              className={`
                p-1 rounded transition-colors
                ${layer.visible ? 'text-white hover:text-gray-300' : 'text-gray-500 hover:text-gray-400'}
              `}
            >
              <ApperIcon name={layer.visible ? 'Eye' : 'EyeOff'} size={16} />
            </button>
            
            <div>
              <p className="text-sm font-medium text-white">
                {layer.name || `Layer ${layer.id}`}
              </p>
              <p className="text-xs text-gray-400 capitalize">
                {layer.type}
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: showControls || isSelected ? 1 : 0,
              scale: showControls || isSelected ? 1 : 0.9
            }}
            className="flex items-center gap-1"
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(layer.id)
              }}
              className="p-1 text-gray-400 hover:text-error transition-colors"
            >
              <ApperIcon name="Trash2" size={14} />
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={false}
          animate={{ 
            height: isSelected ? 'auto' : 0,
            opacity: isSelected ? 1 : 0
          }}
          className="overflow-hidden"
        >
          <div className="pt-3 mt-3 border-t border-gray-600">
            <Slider
              label="Opacity"
              value={Math.round(layer.opacity * 100)}
              onChange={(value) => onUpdateOpacity?.(layer.id, value / 100)}
              min={0}
              max={100}
              showValue={true}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default LayerItem