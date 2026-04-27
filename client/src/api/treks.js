import api from './axios'

// Each function calls one backend endpoint
// These are the only places in the app that talk to the backend

// Get all published treks (with optional filters)
export const getTreks = async (params) => {
  const { data } = await api.get('/treks', { params })
  return data
}

// Get one trek by its slug
export const getTrekBySlug = async (slug) => {
  const { data } = await api.get(`/treks/${slug}`)
  return data
}

// Admin: get all treks including drafts
export const getAllTreksAdmin = async () => {
  const { data } = await api.get('/treks/admin/all')
  return data
}

// Admin: create a new trek (FormData because it includes an image)
export const createTrek = async (formData) => {
  const { data } = await api.post('/treks', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

// Admin: update a trek
export const updateTrek = async (id, formData) => {
  const { data } = await api.put(`/treks/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

// Admin: delete a trek
export const deleteTrek = async (id) => {
  const { data } = await api.delete(`/treks/${id}`)
  return data
}