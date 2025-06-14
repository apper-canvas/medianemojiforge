import Editor from '@/components/pages/Editor'

export const routes = {
  editor: {
    id: 'editor',
    label: 'Editor',
    path: '/editor',
    icon: 'Palette',
    component: Editor
  },
}

export const routeArray = Object.values(routes)
export default routes