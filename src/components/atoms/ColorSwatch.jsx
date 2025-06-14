import { motion } from 'framer-motion'

const ColorSwatch = ({ 
  color, 
  isSelected = false, 
  onClick, 
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick?.(color)}
      className={`
        ${sizes[size]} rounded-full border-2 cursor-pointer transition-all
        ${isSelected ? 'border-white shadow-lg' : 'border-gray-600 hover:border-gray-400'}
        ${className}
      `}
      style={{ backgroundColor: color }}
    >
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-full h-full rounded-full flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
        </motion.div>
      )}
    </motion.button>
  )
}

export default ColorSwatch