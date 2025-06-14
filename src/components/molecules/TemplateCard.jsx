import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const TemplateCard = ({ 
  template, 
  onSelect, 
  className = '' 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect?.(template)}
      className={`
        bg-surface/80 rounded-lg p-4 cursor-pointer transition-all
        border-2 border-transparent hover:border-primary/50
        shadow-panel hover:shadow-lg
        ${className}
      `}
    >
      <div className="space-y-3">
        {/* Preview */}
        <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
          <div 
            className="w-16 h-16 rounded-full border-2 border-gray-600"
            style={{ backgroundColor: template.baseEmoji?.backgroundColor || '#4ECDC4' }}
          />
        </div>

        {/* Info */}
        <div>
          <h3 className="font-medium text-white text-sm mb-1">
            {template.name}
          </h3>
          <p className="text-xs text-gray-400 capitalize mb-2">
            {template.category}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {template.tags?.slice(0, 3).map(tag => (
              <span 
                key={tag}
                className="px-2 py-1 bg-background/50 text-xs text-gray-300 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Featured badge */}
        {template.featured && (
          <div className="absolute top-2 right-2">
            <div className="bg-accent text-gray-900 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <ApperIcon name="Star" size={12} />
              Featured
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default TemplateCard