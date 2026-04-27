import api from './axios'

export const getGallery = async (params) => {
  const { data } = await api.get('/gallery', { params })
  return data
}

export const getFeatured = async () => {
  const { data } = await api.get('/gallery/featured')
  return data
}

export const uploadMedia = async (formData) => {
  const { data } = await api.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const deleteMedia = async (id) => {
  const { data } = await api.delete(`/gallery/${id}`)
  return data
}