import api from './axios'

export const getMessages = async () => {
  const { data } = await api.get('/contact')
  return data
}

export const markRead = async (id) => {
  const { data } = await api.patch('/contact/' + id + '/read')
  return data
}

export const markReplied = async (id) => {
  const { data } = await api.patch('/contact/' + id + '/replied')
  return data
}

export const deleteMessage = async (id) => {
  const { data } = await api.delete('/contact/' + id)
  return data
}