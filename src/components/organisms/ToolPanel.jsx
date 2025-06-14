import { useState } from 'react'
import { motion } from 'framer-motion'
import ToolButton from '@/components/molecules/ToolButton'
import Slider from '@/components/atoms/Slider'
import ApperIcon from '@/components/ApperIcon'

const ToolPanel = ({ 
  activeTool = 'select', 
  onToolChange,
  brushSize = 10,
  onBrushSizeChange,
  className = '' 
}) => {
  const [collapsed, setCollapsed] = useState(false)

  const tools = [
    { id: 'select', icon: 'MousePointer2', label: 'Select', tooltip: 'Select and move objects' },
    { id: 'brush', icon: 'Brush', label: 'Brush', tooltip: 'Draw freehand' },
    { id: 'circle', icon: 'Circle', label: 'Circle', tooltip: 'Draw circles' },
    { id: 'rectangle', icon: 'Square', label: 'Rectangle', tooltip: 'Draw rectangles' },
    { id: 'line', icon: 'Minus', label: 'Line', tooltip: 'Draw straight lines' },
    { id: 'text', icon: 'Type', label: 'Text', tooltip: 'Add text' },
    { id: 'eraser', icon: 'Eraser', label: 'Eraser', tooltip: 'Erase parts of drawing' }
  ]

  return (
    <motion.div
      animate={{ width: collapsed ? 60 : 240 }}
      className={`bg-surface rounded-lg shadow-panel flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-600 flex items-center justify-between">
        {!collapsed && (
          <h3 className="font-display text-lg text-white">Tools</h3>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 text-gray-400 hover:text-white transition-colors"
        >
          <ApperIcon name={collapsed ? 'ChevronRight' : 'ChevronLeft'} size={16} />
        </button>
      </div>

      {/* Tools */}
      <div className="p-3 space-y-2 flex-1">
        {tools.map(tool => (
          <ToolButton
            key={tool.id}
            icon={tool.icon}
            label={!collapsed ? tool.label : undefined}
            isActive={activeTool === tool.id}
            onClick={() => onToolChange?.(tool.id)}
            tooltip={collapsed ? tool.tooltip : undefined}
            className="w-full justify-start"
          />
        ))}
      </div>

      {/* Tool Options */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border-t border-gray-600 space-y-4"
        >
          <h4 className="text-sm font-medium text-gray-300">Tool Options</h4>
          
          {(activeTool === 'brush' || activeTool === 'eraser') && (
            <Slider
              label="Size"
              value={brushSize}
              onChange={onBrushSizeChange}
              min={1}
              max={50}
              showValue={true}
            />
          )}

          {activeTool === 'brush' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Brush Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2 bg-background/50 rounded text-xs text-gray-300 hover:text-white transition-colors">
                  Round
                </button>
                <button className="p-2 bg-background/50 rounded text-xs text-gray-300 hover:text-white transition-colors">
                  Square
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

export default ToolPanel