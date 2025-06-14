import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

const Layout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <motion.main 
        className="flex-1 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
    </div>
  )
}

export default Layout