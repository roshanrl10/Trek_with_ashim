import api from './axios'

export const getSettings = async () => {
  const { data } = await api.get('/settings')
  return data
}

export const updateSettings = async (formData) => {
  const { data } = await api.put('/settings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const getAbout = async () => {
  const { data } = await api.get('/about')
  return data
}

export const updateAbout = async (formData) => {
  const { data } = await api.put('/about', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}