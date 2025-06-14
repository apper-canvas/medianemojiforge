import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import TemplateCard from '@/components/molecules/TemplateCard'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { templateService } from '@/services'

const TemplateGallery = ({ 
  isOpen, 
  onClose, 
  onSelectTemplate,
  className = '' 
}) => {
  const [templates, setTemplates] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'faces', label: 'Faces' },
    { id: 'animals', label: 'Animals' },
    { id: 'objects', label: 'Objects' },
    { id: 'gestures', label: 'Gestures' }
  ]

  useEffect(() => {
    if (isOpen) {
      loadTemplates()
    }
  }, [isOpen])

  useEffect(() => {
    filterTemplates()
  }, [templates, searchQuery, selectedCategory])

  const loadTemplates = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await templateService.getAll()
      setTemplates(result)
    } catch (err) {
      setError(err.message || 'Failed to load templates')
      toast.error('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const filterTemplates = () => {
    let filtered = templates

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    setFilteredTemplates(filtered)
  }

  const handleSelectTemplate = (template) => {
    onSelectTemplate?.(template)
    onClose?.()
    toast.success(`Template "${template.name}" loaded`)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className={`
            bg-surface rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] 
            flex flex-col overflow-hidden ${className}
          `}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl text-white">Choose Template</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                      ${selectedCategory === category.id
                        ? 'bg-primary text-white'
                        : 'bg-background/50 text-gray-300 hover:text-white'
                      }
                    `}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-600 rounded-lg mb-3" />
                    <div className="h-4 bg-gray-600 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-600 rounded w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <ApperIcon name="AlertCircle" size={48} className="mx-auto text-error mb-4" />
                <p className="text-error mb-4">{error}</p>
                <Button onClick={loadTemplates} variant="outline">
                  Try Again
                </Button>
              </div>
            )}

            {!loading && !error && filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <ApperIcon name="Search" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-400 mb-2">No templates found</p>
                <p className="text-sm text-gray-500">
                  Try adjusting your search or category filter
                </p>
              </div>
            )}

            {!loading && !error && filteredTemplates.length > 0 && (
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TemplateCard
                      template={template}
                      onSelect={handleSelectTemplate}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-600 flex justify-between items-center">
            <p className="text-sm text-gray-400">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
            </p>
            
            <div className="flex gap-3">
              <Button onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button onClick={() => handleSelectTemplate({ name: 'Blank Canvas', baseEmoji: null })}>
                Start from Scratch
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TemplateGallery