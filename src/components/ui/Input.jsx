'use client'

import { forwardRef } from 'react'

const Input = forwardRef(({
  type = 'text',
  className = '',
  error,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      <input
        ref={ref}
        type={type}
        className={`
          w-full px-4 py-2.5 rounded-lg border 
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-primary focus:ring-primary'
          }
          focus:ring-1 focus:ring-opacity-20 focus:outline-none
          transition-colors duration-200
          placeholder:text-gray-400
          disabled:bg-gray-200
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input