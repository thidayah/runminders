import AuthLayout from '@/components/ui/AuthLayout'
import LoginForm from '@/components/auth/LoginForm'
import Layout from "@/components/layout/Layout"

export default function Login() {
  return (
    // <Layout>
      <AuthLayout
        title="Welcome Back!"
        subtitle="Masuk ke akun Anda"
      >
        <LoginForm />
      </AuthLayout>
    // </Layout>
  )
}