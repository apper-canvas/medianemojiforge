import { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Circle, Rect, Line } from 'react-konva'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Canvas = ({ 
  emoji,
  activeTool = 'select',
  brushSize = 10,
  selectedColor = '#FF6B6B',
  selectedLayerId,
  onEmojiUpdate,
  className = '' 
}) => {
  const [stageScale, setStageScale] = useState(1)
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 })
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState([])
  const [showGrid, setShowGrid] = useState(true)
  const [canvasSize] = useState({ width: 400, height: 400 })
  const [emojiSize] = useState({ width: 128, height: 128 })
  
  const stageRef = useRef()
  const isPaint = useRef(false)

  const canvasCenter = {
    x: (canvasSize.width - emojiSize.width) / 2,
    y: (canvasSize.height - emojiSize.height) / 2
  }

  useEffect(() => {
    // Initialize with a basic emoji if none exists
    if (!emoji || !emoji.layers || emoji.layers.length === 0) {
      const defaultEmoji = {
        id: 'default',
        name: 'New Emoji',
        width: emojiSize.width,
        height: emojiSize.height,
        backgroundColor: '#FFE66D',
        layers: [
          {
            id: 'background',
            type: 'shape',
            visible: true,
            opacity: 1,
            name: 'Background',
            elements: [
              {
                type: 'circle',
                fill: '#FFE66D',
                stroke: '#2A2D3A',
                strokeWidth: 2,
                points: [{ x: 64, y: 64, radius: 60 }]
              }
            ],
            transform: { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 }
          }
        ]
      }
      onEmojiUpdate?.(defaultEmoji)
    }
  }, [emoji, onEmojiUpdate, emojiSize])

  const handleWheel = (e) => {
    e.evt.preventDefault()
    
    const scaleBy = 1.05
    const stage = e.target.getStage()
    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy
    const clampedScale = Math.max(0.1, Math.min(5, newScale))

    setStageScale(clampedScale)
    
    if (pointer) {
      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      }

      const newPos = {
        x: pointer.x - mousePointTo.x * clampedScale,
        y: pointer.y - mousePointTo.y * clampedScale,
      }
      
      setStagePosition(newPos)
    }
  }

  const handleMouseDown = (e) => {
    if (activeTool === 'select') return
    
    isPaint.current = true
    setIsDrawing(true)
    
    const stage = e.target.getStage()
    const point = stage.getPointerPosition()
    const relativePoint = {
      x: (point.x - stagePosition.x - canvasCenter.x) / stageScale,
      y: (point.y - stagePosition.y - canvasCenter.y) / stageScale
    }

    if (activeTool === 'brush') {
      setCurrentPath([relativePoint.x, relativePoint.y])
    }
  }

  const handleMouseMove = (e) => {
    if (!isPaint.current) return
    
    const stage = e.target.getStage()
    const point = stage.getPointerPosition()
    const relativePoint = {
      x: (point.x - stagePosition.x - canvasCenter.x) / stageScale,
      y: (point.y - stagePosition.y - canvasCenter.y) / stageScale
    }

    if (activeTool === 'brush') {
      setCurrentPath(prev => [...prev, relativePoint.x, relativePoint.y])
    }
  }

  const handleMouseUp = () => {
    if (!isPaint.current) return
    
    isPaint.current = false
    setIsDrawing(false)
    
    if (activeTool === 'brush' && currentPath.length > 0) {
      // Add the drawn path to the selected layer
      const newElement = {
        type: 'path',
        fill: 'none',
        stroke: selectedColor,
        strokeWidth: brushSize,
        points: currentPath
      }
      
      // Update emoji with new element
      // This would typically update through the parent component
      setCurrentPath([])
    }
  }

  const resetView = () => {
    setStageScale(1)
    setStagePosition({ x: 0, y: 0 })
  }

  const zoomIn = () => {
    setStageScale(prev => Math.min(5, prev * 1.2))
  }

  const zoomOut = () => {
    setStageScale(prev => Math.max(0.1, prev / 1.2))
  }

  const renderGridPattern = () => {
    if (!showGrid) return null
    
    const gridLines = []
    const gridSize = 20
    const gridColor = 'rgba(255, 255, 255, 0.1)'
    
    // Vertical lines
    for (let i = 0; i <= canvasSize.width; i += gridSize) {
      gridLines.push(
        <Line
          key={`v-${i}`}
          points={[i, 0, i, canvasSize.height]}
          stroke={gridColor}
          strokeWidth={1}
        />
      )
    }
    
    // Horizontal lines
    for (let i = 0; i <= canvasSize.height; i += gridSize) {
      gridLines.push(
        <Line
          key={`h-${i}`}
          points={[0, i, canvasSize.width, i]}
          stroke={gridColor}
          strokeWidth={1}
        />
      )
    }
    
    return gridLines
  }

  const renderEmojiElements = () => {
    if (!emoji?.layers) return null
    
    return emoji.layers.map(layer => {
      if (!layer.visible) return null
      
      return layer.elements?.map((element, index) => {
        const key = `${layer.id}-${index}`
        const commonProps = {
          key,
          opacity: layer.opacity,
          x: canvasCenter.x + (element.points?.[0]?.x || 0),
          y: canvasCenter.y + (element.points?.[0]?.y || 0)
        }

        switch (element.type) {
          case 'circle':
            return (
              <Circle
                {...commonProps}
                radius={element.points?.[0]?.radius || 30}
                fill={element.fill}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
              />
            )
          case 'rect':
            return (
              <Rect
                {...commonProps}
                width={element.points?.[0]?.width || 60}
                height={element.points?.[0]?.height || 60}
                fill={element.fill}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
              />
            )
          case 'path':
            return (
              <Line
                {...commonProps}
                points={element.points || []}
                fill={element.fill}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
                lineCap="round"
                lineJoin="round"
              />
            )
          default:
            return null
        }
      })
    })
  }

  return (
    <div className={`relative bg-background rounded-lg overflow-hidden ${className}`}>
      {/* Canvas Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button
          onClick={() => setShowGrid(!showGrid)}
          variant={showGrid ? 'primary' : 'ghost'}
          size="sm"
          icon="Grid3X3"
        />
        <Button
          onClick={zoomOut}
          variant="ghost"
          size="sm"
          icon="ZoomOut"
        />
        <Button
          onClick={resetView}
          variant="ghost"
          size="sm"
          icon="Maximize2"
        />
        <Button
          onClick={zoomIn}
          variant="ghost"
          size="sm"
          icon="ZoomIn"
        />
      </div>

      {/* Zoom Info */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-surface/80 backdrop-blur-sm rounded px-3 py-1 text-sm text-white">
          {Math.round(stageScale * 100)}%
        </div>
      </div>

      {/* Canvas */}
      <div className="canvas-container w-full h-full flex items-center justify-center">
        <Stage
          ref={stageRef}
          width={canvasSize.width}
          height={canvasSize.height}
          scaleX={stageScale}
          scaleY={stageScale}
          x={stagePosition.x}
          y={stagePosition.y}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          className="cursor-crosshair"
        >
          <Layer>
            {/* Grid */}
            {renderGridPattern()}
            
            {/* Emoji Bounds */}
            <Rect
              x={canvasCenter.x}
              y={canvasCenter.y}
              width={emojiSize.width}
              height={emojiSize.height}
              stroke="rgba(255, 107, 107, 0.5)"
              strokeWidth={2}
              dash={[5, 5]}
              fill="transparent"
            />
            
            {/* Emoji Elements */}
            {renderEmojiElements()}
            
            {/* Current Drawing Path */}
            {isDrawing && currentPath.length > 0 && (
              <Line
                points={currentPath.map((point, i) => 
                  i % 2 === 0 ? point + canvasCenter.x : point + canvasCenter.y
                )}
                stroke={selectedColor}
                strokeWidth={brushSize}
                lineCap="round"
                lineJoin="round"
              />
            )}
          </Layer>
        </Stage>
      </div>

      {/* Canvas Info */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-surface/80 backdrop-blur-sm rounded px-3 py-2 text-sm text-white space-y-1">
          <div>Tool: <span className="capitalize text-secondary">{activeTool}</span></div>
          <div>Size: {emojiSize.width}×{emojiSize.height}</div>
        </div>
      </div>
    </div>
  )
}

export default Canvas