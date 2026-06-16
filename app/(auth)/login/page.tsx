import { Suspense } from 'react'
import { getAsset } from '@/lib/assets'
import LoginForm from './login-form'

export default async function LoginPage() {
  const bg = await getAsset('login-bg')
  return (
    <Suspense>
      <LoginForm bg={bg} />
    </Suspense>
  )
}
