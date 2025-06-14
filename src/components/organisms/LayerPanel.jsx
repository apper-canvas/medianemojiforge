import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import LayerItem from '@/components/molecules/LayerItem'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { layerService } from '@/services'

const LayerPanel = ({ 
  selectedLayerId,
  onLayerSelect,
  onLayerUpdate,
  className = '' 
}) => {
  const [layers, setLayers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    loadLayers()
  }, [])

  const loadLayers = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await layerService.getAll()
      setLayers(result)
    } catch (err) {
      setError(err.message || 'Failed to load layers')
      toast.error('Failed to load layers')
    } finally {
      setLoading(false)
    }
  }

  const handleAddLayer = async () => {
    try {
      const newLayer = {
        type: 'shape',
        visible: true,
        opacity: 1,
        name: `Layer ${layers.length + 1}`,
        elements: [],
        transform: { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 }
      }
      
      const created = await layerService.create(newLayer)
      setLayers(prev => [...prev, created])
      onLayerSelect?.(created.id)
      toast.success('Layer added')
    } catch (err) {
      toast.error('Failed to add layer')
    }
  }

  const handleToggleVisibility = async (layerId) => {
    try {
      const layer = layers.find(l => l.id === layerId)
      if (!layer) return

      const updated = await layerService.update(layerId, { 
        visible: !layer.visible 
      })
      
      setLayers(prev => prev.map(l => 
        l.id === layerId ? updated : l
      ))
      onLayerUpdate?.(updated)
    } catch (err) {
      toast.error('Failed to update layer')
    }
  }

  const handleDeleteLayer = async (layerId) => {
    try {
      await layerService.delete(layerId)
      setLayers(prev => prev.filter(l => l.id !== layerId))
      
      if (selectedLayerId === layerId) {
        const remainingLayers = layers.filter(l => l.id !== layerId)
        onLayerSelect?.(remainingLayers[0]?.id || null)
      }
      
      toast.success('Layer deleted')
    } catch (err) {
      toast.error('Failed to delete layer')
    }
  }

  const handleUpdateOpacity = async (layerId, opacity) => {
    try {
      const updated = await layerService.update(layerId, { opacity })
      setLayers(prev => prev.map(l => 
        l.id === layerId ? updated : l
      ))
      onLayerUpdate?.(updated)
    } catch (err) {
      toast.error('Failed to update opacity')
    }
  }

  if (loading) {
    return (
      <div className={`bg-surface rounded-lg shadow-panel p-4 ${className}`}>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-600 rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      animate={{ width: collapsed ? 60 : 280 }}
      className={`bg-surface rounded-lg shadow-panel flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-600 flex items-center justify-between">
        {!collapsed && (
          <h3 className="font-display text-lg text-white">Layers</h3>
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
          {/* Actions */}
          <div className="p-3 border-b border-gray-600">
            <Button
              onClick={handleAddLayer}
              size="sm"
              icon="Plus"
              className="w-full"
            >
              Add Layer
            </Button>
          </div>

          {/* Layers List */}
          <div className="flex-1 overflow-y-auto p-3">
            {error && (
              <div className="text-center py-8">
                <ApperIcon name="AlertCircle" size={48} className="mx-auto text-error mb-4" />
                <p className="text-error mb-4">{error}</p>
                <Button onClick={loadLayers} size="sm" variant="outline">
                  Retry
                </Button>
              </div>
            )}

            {!error && layers.length === 0 && (
              <div className="text-center py-8">
                <ApperIcon name="Layers" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-400 mb-4">No layers yet</p>
                <Button onClick={handleAddLayer} size="sm">
                  Create First Layer
                </Button>
              </div>
            )}

            <AnimatePresence>
              <div className="space-y-2">
                {layers.map((layer, index) => (
                  <motion.div
                    key={layer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <LayerItem
                      layer={layer}
                      isSelected={selectedLayerId === layer.id}
                      onSelect={() => onLayerSelect?.(layer.id)}
                      onToggleVisibility={handleToggleVisibility}
                      onDelete={handleDeleteLayer}
                      onUpdateOpacity={handleUpdateOpacity}
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </div>
        </>
      )}
    </motion.div>
  )
}

export default LayerPanel