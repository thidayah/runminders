import AuthLayout from '@/components/ui/AuthLayout'
import Layout from "@/components/layout/Layout"
import ResetPasswordForm from "@/components/auth/ResetPasswordForm"
import { use } from "react"

export default function ForgotPassword({ searchParams }) {
  const params = use(searchParams)  
  return (
    <Layout>
      <AuthLayout
        title="Reset Password!"
        subtitle=""
      >
        <ResetPasswordForm {...params} />
      </AuthLayout>
    </Layout>
  )
}