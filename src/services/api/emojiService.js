import emojiData from '../mockData/emoji.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class EmojiService {
  constructor() {
    this.emojis = [...emojiData]
  }

  async getAll() {
    await delay(200)
    return [...this.emojis]
  }

  async getById(id) {
    await delay(150)
    const emoji = this.emojis.find(item => item.id === id)
    return emoji ? { ...emoji } : null
  }

  async create(emoji) {
    await delay(300)
    const newEmoji = {
      ...emoji,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    this.emojis.push(newEmoji)
    return { ...newEmoji }
  }

  async update(id, data) {
    await delay(250)
    const index = this.emojis.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Emoji not found')
    
    this.emojis[index] = { ...this.emojis[index], ...data }
    return { ...this.emojis[index] }
  }

  async delete(id) {
    await delay(200)
    const index = this.emojis.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Emoji not found')
    
    const deleted = this.emojis.splice(index, 1)[0]
    return { ...deleted }
  }

  async export(emoji, size = 128) {
    await delay(500)
    // Simulate export process
    return {
      dataUrl: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA${size}AAAA${size}CAYAAAACqjH1AAAAA...`,
      filename: `${emoji.name || 'custom-emoji'}-${size}x${size}.png`,
      size: size
    }
  }
}

export default new EmojiService()