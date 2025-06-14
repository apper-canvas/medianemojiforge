import layerData from '../mockData/layer.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class LayerService {
  constructor() {
    this.layers = [...layerData]
  }

  async getAll() {
    await delay(150)
    return [...this.layers]
  }

  async getById(id) {
    await delay(100)
    const layer = this.layers.find(item => item.id === id)
    return layer ? { ...layer } : null
  }

  async create(layer) {
    await delay(200)
    const newLayer = {
      ...layer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    this.layers.push(newLayer)
    return { ...newLayer }
  }

  async update(id, data) {
    await delay(150)
    const index = this.layers.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Layer not found')
    
    this.layers[index] = { ...this.layers[index], ...data }
    return { ...this.layers[index] }
  }

  async delete(id) {
    await delay(150)
    const index = this.layers.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Layer not found')
    
    const deleted = this.layers.splice(index, 1)[0]
    return { ...deleted }
  }

  async reorder(layerIds) {
    await delay(200)
    // Simulate reordering layers
    return layerIds.map(id => this.layers.find(layer => layer.id === id))
  }
}

export default new LayerService()