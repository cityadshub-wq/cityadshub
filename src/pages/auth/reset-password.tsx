import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Send, ArrowLeft } from 'lucide-react'
import { Button, Input, Card } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { SEO } from '@/components/shared/seo'

const resetSchema = z.object({
  email: z.string().email('Invalid email'),
})

type ResetForm = z.infer<typeof resetSchema>

export function ResetPasswordPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()

  const { register, handleSubmit, formState: { errors } } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = async (data: ResetForm) => {
    setLoading(true)
    setError(null)
    const { error } = await resetPassword(data.email)
    if (error) setError(error)
    else setSent(true)
    setLoading(false)
  }

  return (
    <>
      <SEO title="Reset Password" description="Reset your City Ads Hub password." />

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
            <h1 className="text-2xl font-bold text-dark-navy">Reset Password</h1>
            <p className="text-gray-500 mt-1">We'll send you a reset link</p>
          </div>

          <Card>
            {sent ? (
              <div className="text-center py-4">
                <div className="h-12 w-12 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
                  <Send className="h-6 w-6 text-green" />
                </div>
                <h3 className="font-semibold text-dark-navy mb-2">Check Your Email</h3>
                <p className="text-sm text-gray-500 mb-6">We've sent a password reset link to your email.</p>
                <Link to="/auth/login"><Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Login</Button></Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input id="email" label="Email Address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
                {error && <div className="text-sm p-3 rounded-lg bg-red-50 text-red-600">{error}</div>}
                <Button type="submit" className="w-full" size="lg" loading={loading}>
                  <Send className="mr-2 h-4 w-4" /> Send Reset Link
                </Button>
              </form>
            )}
          </Card>

          <p className="text-center text-sm text-gray-500 mt-6">
            <Link to="/auth/login" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to login
            </Link>
          </p>
        </motion.div>
      </section>
    </>
  )
}
