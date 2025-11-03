export default function SocialButton({ provider }) {
  const providers = {
    google: {
      name: 'Google',
      icon: '🔍',
      color: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
      url: '/auth/google'
    },
    facebook: {
      name: 'Facebook', 
      icon: '📘',
      color: 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700',
      url: '/auth/facebook'
    }
  }

  const providerConfig = providers[provider]

  return (
    <button
      type="button"
      onClick={() => window.location.href = providerConfig.url}
      className={`w-full inline-flex justify-center items-center gap-3 py-3 px-4 border rounded-lg font-medium transition-colors duration-200 cursor-pointer ${providerConfig.color}`}
    >
      <span className="text-lg">{providerConfig.icon}</span>
      <span>{providerConfig.name}</span>
    </button>
  )
}