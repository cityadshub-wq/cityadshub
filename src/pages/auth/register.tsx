import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'
import { Button, Input, Card } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { SEO } from '@/components/shared/seo'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    setError(null)
    const { error } = await signUp(data.email, data.password, data.fullName)
    if (error) setError(error)
    else navigate('/auth/login')
    setLoading(false)
  }

  return (
    <>
      <SEO title="Create Account" description="Create your City Ads Hub account." />

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
            <h1 className="text-2xl font-bold text-dark-navy">Create Account</h1>
            <p className="text-gray-500 mt-1">Join City Ads Hub today</p>
          </div>

          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input id="fullName" label="Full Name" placeholder="John Doe" error={errors.fullName?.message} {...register('fullName')} />
              <Input id="email" label="Email Address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
              <Input id="password" label="Password" type="password" placeholder="Create a password" error={errors.password?.message} {...register('password')} />
              <Input id="confirmPassword" label="Confirm Password" type="password" placeholder="Confirm your password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />

              {error && <div className="text-sm p-3 rounded-lg bg-red-50 text-red-600">{error}</div>}

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                <UserPlus className="mr-2 h-4 w-4" /> Create Account
              </Button>
            </form>
          </Card>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account? <Link to="/auth/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </section>
    </>
  )
}
