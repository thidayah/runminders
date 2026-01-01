'use client'

import { useState, useEffect } from 'react'
import { 
  getAuthData, 
  getUser, 
  getToken, 
  isAuthenticated,
  clearAuthData 
} from '@/lib/auth-storage'

export function useAuth() {
  const [auth, setAuth] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  })

  useEffect(() => {
    const checkAuth = () => {
      const user = getUser()
      const token = getToken()
      const authenticated = isAuthenticated()
      
      setAuth({
        user,
        token,
        isAuthenticated: authenticated,
        isLoading: false
      })
    }
    
    checkAuth()
    
    // Listen for storage changes (in case of logout from another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'runminders_auth' || e.key === null) {
        checkAuth()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const logout = () => {
    clearAuthData()
    setAuth({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    })
    // Optionally redirect to login
    window.location.href = '/login'
  }

  return {
    ...auth,
    logout
  }
}