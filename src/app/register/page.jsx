import AuthLayout from '@/components/ui/AuthLayout'
import RegisterForm from '@/components/auth/RegisterForm'

export default function Register() {
  return (
    <AuthLayout
      title="Hello Everyone!"
      subtitle="Buat akun Anda untuk bergabung bersama kami"
    >
      <RegisterForm />
    </AuthLayout>
  )
}