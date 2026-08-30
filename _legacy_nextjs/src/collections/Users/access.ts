import type { Access } from 'payload'

export const adminOnly: Access = ({ req }) => {
  return req.user?.role === 'admin'
}

export const providerOwn: Access = ({ req }) => {
  if (req.user?.role === 'admin') return true
  return {
    id: {
      equals: req.user?.id,
    },
  }
}

export const publicReadApproved: Access = ({ req }) => {
  if (req.user?.role === 'admin') return true
  return true
}
