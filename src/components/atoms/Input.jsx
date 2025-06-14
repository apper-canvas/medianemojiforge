import { motion } from 'framer-motion'
import { useState } from 'react'

const Input = ({
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value && value.length > 0

  return (
    <div className={`relative ${className}`}>
      {label && (
        <motion.label
          animate={{
            y: isFocused || hasValue ? -12 : 8,
            scale: isFocused || hasValue ? 0.85 : 1,
            color: isFocused ? '#4ECDC4' : error ? '#EE5A6F' : '#9CA3AF'
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute left-3 pointer-events-none font-medium origin-left z-10"
        >
          {label}
        </motion.label>
      )}
      
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={!label ? placeholder : ''}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full px-3 py-3 bg-surface/50 border-2 rounded-lg
          text-white placeholder-gray-400 transition-all duration-200
          ${error 
            ? 'border-error focus:border-error' 
            : 'border-gray-600 focus:border-secondary'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          focus:outline-none focus:bg-surface/70
        `}
        {...props}
      />
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default Input