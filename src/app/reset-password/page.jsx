import AuthLayout from '@/components/ui/AuthLayout'
import Layout from "@/components/layout/Layout"
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm"

export default function ForgotPassword() {
  return (
    <Layout>
      <AuthLayout
        title="Reset Password!"
        subtitle=""
      >
        <ForgotPasswordForm />
      </AuthLayout>
    </Layout>
  )
}