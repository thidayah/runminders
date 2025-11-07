import AuthLayout from '@/components/ui/AuthLayout'
import RegisterForm from '@/components/auth/RegisterForm'
import Layout from "@/components/layout/Layout"

export default function Register() {
  return (
    <Layout>
      <AuthLayout
        title="Hello Everyone!"
        subtitle="Buat akun Anda untuk bergabung bersama kami"
      >
        <RegisterForm />
      </AuthLayout>
    </Layout>
  )
}