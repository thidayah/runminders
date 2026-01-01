/**
 * Format date to Indonesian format
 * @param {string} dateString - Date string (YYYY-MM-DD)
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    
    // Check if date is valid
    if (isNaN(date.getTime())) return '-'
    
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return '-'
  }
}

/**
 * Format time to Indonesian format
 * @param {string} timeString - Time string (HH:MM:SS)
 * @returns {string} Formatted time
 */
export const formatTime = (timeString) => {
  if (!timeString) return '-'
  
  try {
    const [hours, minutes] = timeString.split(':')
    
    // Add timezone (WIB = Western Indonesian Time)
    return `${hours}:${minutes} WIB`
  } catch (error) {
    console.error('Error formatting time:', error)
    return '-'
  }
}

/**
 * Format currency to Indonesian Rupiah
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'Rp 0'
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

/**
 * Format number with thousand separator
 * @param {number} number - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '0'
  
  return new Intl.NumberFormat('id-ID').format(number)
}

/**
 * Get relative time (e.g., "2 hari lagi", "1 minggu lalu")
 * @param {string} dateString - Date string
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays > 0) {
    return `${diffDays} hari lagi`
  } else if (diffDays === 0) {
    return 'Hari ini'
  } else {
    return `${Math.abs(diffDays)} hari yang lalu`
  }
}