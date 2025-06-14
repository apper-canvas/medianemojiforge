import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { emojiService } from '@/services'

const TopToolbar = ({ 
  emoji,
  onEmojiUpdate,
  onNewEmoji,
  onShowTemplates,
  onExport,
  className = '' 
}) => {
  const [emojiName, setEmojiName] = useState(emoji?.name || 'Untitled')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!emoji) return
    
    setIsSaving(true)
    try {
      const updatedEmoji = { ...emoji, name: emojiName }
      
      if (emoji.id && emoji.id !== 'default') {
        await emojiService.update(emoji.id, updatedEmoji)
        toast.success('Emoji saved successfully')
      } else {
        const saved = await emojiService.create(updatedEmoji)
        onEmojiUpdate?.(saved)
        toast.success('Emoji created successfully')
      }
      
      setShowSaveDialog(false)
    } catch (err) {
      toast.error('Failed to save emoji')
    } finally {
      setIsSaving(false)
    }
  }

  const handleNew = () => {
    if (confirm('Create a new emoji? Unsaved changes will be lost.')) {
      onNewEmoji?.()
    }
  }

  const handleExport = async () => {
    if (!emoji) return
    
    try {
      const result = await emojiService.export(emoji, 128)
      
      // Create download link
      const link = document.createElement('a')
      link.href = result.dataUrl
      link.download = result.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Emoji exported successfully')
      onExport?.(result)
    } catch (err) {
      toast.error('Failed to export emoji')
    }
  }

  return (
    <div className={`bg-surface rounded-lg shadow-panel ${className}`}>
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left Section - Branding */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Smile" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl text-white">EmojiForge</h1>
              <p className="text-xs text-gray-400">Create • Customize • Express</p>
            </div>
          </div>
        </div>

        {/* Center Section - Emoji Name */}
        <div className="flex-1 max-w-md mx-8">
          <Input
            value={emojiName}
            onChange={(e) => setEmojiName(e.target.value)}
            placeholder="Emoji name..."
            className="text-center"
          />
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onShowTemplates}
            variant="ghost"
            size="sm"
            icon="Grid2X2"
          >
            Templates
          </Button>
          
          <Button
            onClick={handleNew}
            variant="ghost"
            size="sm"
            icon="Plus"
          >
            New
          </Button>
          
          <Button
            onClick={() => setShowSaveDialog(true)}
            variant="secondary"
            size="sm"
            icon="Save"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          
          <Button
            onClick={handleExport}
            variant="accent"
            size="sm"
            icon="Download"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSaveDialog(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-medium text-white mb-4">Save Emoji</h3>
            
            <div className="space-y-4">
              <Input
                label="Emoji Name"
                value={emojiName}
                onChange={(e) => setEmojiName(e.target.value)}
                placeholder="Enter emoji name..."
              />
              
              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => setShowSaveDialog(false)}
                  variant="ghost"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  size="sm"
                  disabled={isSaving || !emojiName.trim()}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default TopToolbar