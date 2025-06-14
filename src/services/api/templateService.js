import templateData from '../mockData/template.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class TemplateService {
  constructor() {
    this.templates = [...templateData]
  }

  async getAll() {
    await delay(200)
    return [...this.templates]
  }

  async getById(id) {
    await delay(150)
    const template = this.templates.find(item => item.id === id)
    return template ? { ...template } : null
  }

  async getByCategory(category) {
    await delay(200)
    return this.templates.filter(template => template.category === category)
  }

  async search(query) {
    await delay(250)
    const searchLower = query.toLowerCase()
    return this.templates.filter(template => 
      template.name.toLowerCase().includes(searchLower) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  async getFeatured() {
    await delay(150)
    return this.templates.filter(template => template.featured)
  }
}

export default new TemplateService()