import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  iconPosition = 'left',
  disabled = false,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-button hover:brightness-110',
    secondary: 'bg-gradient-to-r from-secondary to-secondary/80 text-white shadow-button hover:brightness-110',
    accent: 'bg-gradient-to-r from-accent to-accent/80 text-gray-900 shadow-button hover:brightness-110',
    outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white',
    ghost: 'text-gray-300 hover:text-white hover:bg-white/10',
    danger: 'bg-gradient-to-r from-error to-error/80 text-white shadow-button hover:brightness-110'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  }

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      disabled={disabled}
      className={`
        rounded-full font-medium transition-all duration-150
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {icon && iconPosition === 'left' && (
          <ApperIcon name={icon} size={iconSizes[size]} />
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <ApperIcon name={icon} size={iconSizes[size]} />
        )}
      </div>
    </motion.button>
  )
}

export default Button