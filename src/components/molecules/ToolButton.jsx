import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const ToolButton = ({ 
  icon, 
  label, 
  isActive = false, 
  onClick, 
  disabled = false,
  tooltip,
  className = ''
}) => {
  return (
    <div className="relative group">
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.05, brightness: disabled ? 1 : 1.1 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onClick={onClick}
        disabled={disabled}
        className={`
          p-3 rounded-lg transition-all duration-150 relative overflow-hidden
          ${isActive 
            ? 'bg-primary text-white shadow-lg' 
            : 'bg-surface/80 text-gray-300 hover:text-white hover:bg-surface'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
      >
        {isActive && (
          <motion.div
            layoutId="activeToolBg"
            className="absolute inset-0 bg-primary rounded-lg"
            initial={false}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        
        <div className="relative z-10 flex flex-col items-center gap-1">
          <ApperIcon name={icon} size={20} />
          {label && (
            <span className="text-xs font-medium">{label}</span>
          )}
        </div>
      </motion.button>
      
      {tooltip && (
        <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 
                        bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          {tooltip}
        </div>
      )}
    </div>
  )
}

export default ToolButton