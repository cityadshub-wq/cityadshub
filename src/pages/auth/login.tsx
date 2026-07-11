import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button, Input, Card } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { SEO } from '@/components/shared/seo'
import { setRememberMe } from '@/lib/supabase'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signIn, signInWithMagicLink } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError(null)
    setRememberMe(remember)
    const { error } = await signIn(data.email, data.password)
    if (error) setError(error)
    else navigate('/client/dashboard')
    setLoading(false)
  }

  const handleMagicLink = async () => {
    const email = (document.getElementById('email') as HTMLInputElement)?.value
    if (!email) { setError('Enter your email first'); return }
    setLoading(true)
    setError(null)
    const { error } = await signInWithMagicLink(email)
    if (error) setError(error)
    else setError('Magic link sent! Check your email.')
    setLoading(false)
  }

  return (
    <>
      <SEO title="Sign In" description="Sign in to your City Ads Hub account." />

      <section className="min-h-screen flex items-center justify-center pt-16 pb-12 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md px-4"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">CA</span>
              </div>
              <span className="text-xl font-bold text-dark-navy">City<span className="text-primary">Ads</span></span>
            </Link>
            <h1 className="text-2xl font-bold text-dark-navy">Welcome Back</h1>
            <p className="text-gray-500 mt-1">Sign in to your account</p>
          </div>

          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input id="email" label="Email Address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />

              <div className="relative">
                <Input
                  id="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded border-gray-300" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <Link to="/auth/reset-password" className="text-primary hover:underline">Forgot password?</Link>
              </div>

              {error && (
                <div className={`text-sm p-3 rounded-lg ${error.includes('sent') || error.includes('Check') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">or</span></div>
              </div>

              <Button type="button" variant="outline" className="w-full" onClick={handleMagicLink} disabled={loading}>
                <ArrowRight className="mr-2 h-4 w-4" /> Send Magic Link
              </Button>
            </form>
          </Card>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account? <Link to="/auth/register" className="text-primary font-semibold hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </section>
    </>
  )
}
