import CryptoJS from 'crypto-js'

const STORAGE_KEY = 'r_auth'
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_STORAGE_SECRET || 'runminders-secure-key-2025'

// Helper functions for encryption/decryption
function encryptData(data) {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString()
  } catch (error) {
    console.error('Encryption error:', error)
    return null
  }
}

function decryptData(encryptedData) {
  try {
    if (!encryptedData) return null
    
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8)
    
    if (!decryptedText) return null
    
    return JSON.parse(decryptedText)
  } catch (error) {
    console.error('Decryption error:', error)
    return null
  }
}

// Save authentication data (single encrypted item)
export function saveAuthData(token, userData, rememberMe = false) {
  try {
    const authData = {
      token,
      user: userData,
      timestamp: Date.now(),
      rememberMe
    }
    
    const encryptedData = encryptData(authData)
    if (!encryptedData) {
      throw new Error('Failed to encrypt auth data')
    }
    
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem(STORAGE_KEY, encryptedData)
    
    // If rememberMe is true, also store in localStorage and clear sessionStorage
    if (rememberMe) {
      sessionStorage.removeItem(STORAGE_KEY)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
    
    return true
  } catch (error) {
    console.error('Save auth data error:', error)
    return false
  }
}

// Get authentication data
export function getAuthData() {
  try {
    // Check sessionStorage first (for non-persistent login)
    let encryptedData = sessionStorage.getItem(STORAGE_KEY)
    
    // If not in sessionStorage, check localStorage (for persistent login)
    if (!encryptedData) {
      encryptedData = localStorage.getItem(STORAGE_KEY)
    }
    
    if (!encryptedData) return null
    
    const authData = decryptData(encryptedData)
    if (!authData) {
      // Corrupted data, clear it
      clearAuthData()
      return null
    }
    
    return authData
  } catch (error) {
    console.error('Get auth data error:', error)
    return null
  }
}

// Get only token
export function getToken() {
  const authData = getAuthData()
  return authData?.token || null
}

// Get only user data
export function getUser() {
  const authData = getAuthData()
  return authData?.user || null
}

// Check if user is authenticated
export function isAuthenticated() {
  const authData = getAuthData()
  if (!authData?.token) return false
  
  // Optional: Check token expiry if you have expiry time in token
  // For now, just check if token exists
  return true
}

// Check if it's persistent login (remember me)
export function isPersistentLogin() {
  const authData = getAuthData()
  return authData?.rememberMe || false
}

// Clear authentication data from both storages
export function clearAuthData() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Clear auth data error:', error)
    return false
  }
}

// Update user data (partial update)
export function updateUserData(updatedFields) {
  try {
    const authData = getAuthData()
    if (!authData) return false
    
    const newUserData = {
      ...authData.user,
      ...updatedFields
    }
    
    return saveAuthData(authData.token, newUserData, authData.rememberMe)
  } catch (error) {
    console.error('Update user data error:', error)
    return false
  }
}

// Get storage statistics (for debugging)
export function getStorageStats() {
  const stats = {
    hasLocalStorage: !!localStorage.getItem(STORAGE_KEY),
    hasSessionStorage: !!sessionStorage.getItem(STORAGE_KEY),
    totalSize: 0
  }
  
  try {
    const localData = localStorage.getItem(STORAGE_KEY)
    const sessionData = sessionStorage.getItem(STORAGE_KEY)
    
    if (localData) stats.totalSize += localData.length
    if (sessionData) stats.totalSize += sessionData.length
    
    stats.totalSizeKB = (stats.totalSize / 1024).toFixed(2) + ' KB'
  } catch (error) {
    console.error('Get storage stats error:', error)
  }
  
  return stats
}

// Migration helper (if changing storage structure in the future)
export function migrateOldStorage() {
  try {
    const oldKeys = ['auth_token', 'user']
    let migrated = false
    
    oldKeys.forEach(key => {
      // Check localStorage
      const oldLocalData = localStorage.getItem(key)
      if (oldLocalData) {
        localStorage.removeItem(key)
        migrated = true
      }
      
      // Check sessionStorage
      const oldSessionData = sessionStorage.getItem(key)
      if (oldSessionData) {
        sessionStorage.removeItem(key)
        migrated = true
      }
    })
    
    if (migrated) {
      console.log('Old storage data migrated successfully')
    }
    
    return migrated
  } catch (error) {
    console.error('Migration error:', error)
    return false
  }
}