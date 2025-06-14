import { motion } from 'framer-motion'

const Slider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  disabled = false,
  className = ''
}) => {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-300">{label}</label>
          {showValue && (
            <span className="text-sm text-secondary font-mono">{value}</span>
          )}
        </div>
      )}
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange?.(parseFloat(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #4ECDC4 0%, #4ECDC4 ${percentage}%, #4B5563 ${percentage}%, #4B5563 100%)`
          }}
        />
        
        <motion.div
          className="absolute top-1/2 w-4 h-4 bg-secondary rounded-full shadow-lg pointer-events-none transform -translate-y-1/2"
          style={{ left: `calc(${percentage}% - 8px)` }}
          whileHover={{ scale: 1.2 }}
        />
      </div>
    </div>
  )
}

export default Slider