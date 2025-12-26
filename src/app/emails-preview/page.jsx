'use client'

import { useState } from 'react'
import { VerificationEmail } from '@/components/emails/VerificationEmail'
import { WelcomeEmail } from '@/components/emails/WelcomeEmail'
import { ResetPasswordEmail } from '@/components/emails/ResetPasswordEmail'
import Button from '@/components/ui/Button'
import { Icon } from '@iconify/react'

export default function EmailPreviewPage() {
  const [selectedEmail, setSelectedEmail] = useState('verification')
  const [previewMode, setPreviewMode] = useState('desktop') // 'desktop', 'mobile', 'html'
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    verificationToken: '5171b31a19aeacc1231d359d507870358a30ab51c40b35fcbdb1ab41bdcbf284',
    resetToken: 'abc123def456ghi789jkl012mno345pqr678'
  })

  // Generate email content
  const getEmailContent = () => {
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${formData.verificationToken}`
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${formData.resetToken}`

    switch (selectedEmail) {
      case 'verification':
        return VerificationEmail({
          fullName: formData.fullName,
          verificationLink
        })
      case 'welcome':
        return WelcomeEmail({
          fullName: formData.fullName,
          toEmail: formData.email
        })
      case 'reset':
        return ResetPasswordEmail({
          fullName: formData.fullName,
          resetLink
        })
      default:
        return { html: '', text: '' }
    }
  }

  const emailContent = getEmailContent()

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Templates Preview</h1>
          <p className="text-gray-600">Preview dan test email templates yang digunakan di aplikasi</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Email Type Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Type</h2>
              <div className="space-y-3">
                {[
                  { id: 'verification', label: 'Verification Email', icon: 'mdi:email-check' },
                  { id: 'welcome', label: 'Welcome Email', icon: 'mdi:party-popper' },
                  { id: 'reset', label: 'Reset Password', icon: 'mdi:lock-reset' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedEmail(type.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      selectedEmail === type.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon icon={type.icon} className="w-5 h-5 mr-3" />
                    <span className="font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Mode */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview Mode</h2>
              <div className="space-y-3">
                {[
                  { id: 'desktop', label: 'Desktop', icon: 'mdi:monitor' },
                  { id: 'mobile', label: 'Mobile', icon: 'mdi:cellphone' },
                  { id: 'html', label: 'HTML Source', icon: 'mdi:code-tags' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setPreviewMode(mode.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      previewMode === mode.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon icon={mode.icon} className="w-5 h-5 mr-3" />
                    <span className="font-medium">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Data */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Data</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Token
                  </label>
                  <input
                    type="text"
                    value={formData.verificationToken}
                    onChange={(e) => setFormData({...formData, verificationToken: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reset Token
                  </label>
                  <input
                    type="text"
                    value={formData.resetToken}
                    onChange={(e) => setFormData({...formData, resetToken: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    const blob = new Blob([emailContent.html], { type: 'text/html' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${selectedEmail}-email.html`
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                >
                  <Icon icon="mdi:download" className="w-5 h-5 mr-2" />
                  Download HTML
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    navigator.clipboard.writeText(emailContent.html)
                    alert('HTML copied to clipboard!')
                  }}
                >
                  <Icon icon="mdi:content-copy" className="w-5 h-5 mr-2" />
                  Copy HTML
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    navigator.clipboard.writeText(emailContent.text)
                    alert('Text version copied to clipboard!')
                  }}
                >
                  <Icon icon="mdi:text" className="w-5 h-5 mr-2" />
                  Copy Text Version
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Preview Header */}
              <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold capitalize">
                    {selectedEmail.replace('_', ' ')} Email Preview
                  </h2>
                  <p className="text-sm text-gray-300">
                    {selectedEmail === 'verification' && 'Sent when user registers'}
                    {selectedEmail === 'welcome' && 'Sent after email verification'}
                    {selectedEmail === 'reset' && 'Sent when user requests password reset'}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm px-3 py-1 bg-gray-700 rounded-full">
                    {previewMode === 'desktop' ? '600px' : previewMode === 'mobile' ? '375px' : 'Source'}
                  </span>
                </div>
              </div>

              {/* Preview Content */}
              <div className="p-4 bg-gray-100 min-h-[600px] flex items-center justify-center">
                {previewMode === 'html' ? (
                  <div className="w-full">
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-t-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="ml-2 text-sm">email-template.html</span>
                      </div>
                    </div>
                    <pre className="bg-gray-800 text-green-400 p-4 rounded-b-lg overflow-auto max-h-[500px] text-sm">
                      {emailContent.html}
                    </pre>
                  </div>
                ) : (
                  <div 
                    className={`bg-white rounded-lg shadow-inner overflow-auto ${
                      previewMode === 'desktop' ? 'w-full max-w-[600px]' : 'w-[375px]'
                    }`}
                  >
                    <div dangerouslySetInnerHTML={{ __html: emailContent.html }} />
                  </div>
                )}
              </div>

              {/* Preview Footer */}
              <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Subject:</span>{' '}
                    {selectedEmail === 'verification' && 'Verifikasi Email Anda'}
                    {selectedEmail === 'welcome' && `Selamat Datang di ${process.env.APP_NAME || 'Runminders'}!`}
                    {selectedEmail === 'reset' && `Reset Password - ${process.env.APP_NAME || 'Runminders'}`}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      From: {process.env.EMAIL_FROM_NAME} &lt;{process.env.EMAIL_FROM_EMAIL}&gt;
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Icon icon="mdi:information" className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Email Details</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium capitalize">{selectedEmail}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Recipient:</span>
                    <span>{formData.email}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Status:</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Active</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Icon icon="mdi:email-fast" className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Send Test</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Send a test email to verify the template
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => alert('Test email would be sent to ' + formData.email)}
                >
                  Send Test Email
                </Button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Icon icon="mdi:eye" className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Preview Help</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-500 mr-2" />
                    <span>Links are functional in preview</span>
                  </li>
                  <li className="flex items-center">
                    <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-500 mr-2" />
                    <span>Test responsive design</span>
                  </li>
                  <li className="flex items-center">
                    <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-500 mr-2" />
                    <span>Copy HTML for debugging</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}