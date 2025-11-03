import { Icon } from "@iconify/react"

export default function SocialButton({ provider }) {
  const providers = {
    google: {
      name: 'Google',
      icon: 'devicon:google',
      color: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
      url: '/auth/google'
    },
    facebook: {
      name: 'Facebook', 
      icon: 'devicon:facebook',
      color: 'border-[#3d5a99] bg-[#3d5a99] text-white hover:bg-[#3d5a99]/90',
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
      <Icon icon={providerConfig.icon} width={20} height={20} />
      <span>{providerConfig.name}</span>
    </button>
  )
}