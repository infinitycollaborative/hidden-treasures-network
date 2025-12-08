'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plane, AlertCircle, GraduationCap, Users, Building2, Heart, Check } from 'lucide-react'
import { signUpWithEmail } from '@/lib/auth'
import { registerSchema, RegisterFormData } from '@/lib/validations'
import { UserRole } from '@/types'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedRole = searchParams.get('role') as UserRole | null

  const [step, setStep] = useState(preselectedRole ? 2 : 1)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(preselectedRole)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: (preselectedRole && preselectedRole !== 'admin' ? preselectedRole : undefined) as 'student' | 'mentor' | 'organization' | 'sponsor' | undefined,
    },
  })

  const roles = [
    {
      value: 'student' as UserRole,
      title: 'Student',
      description: 'Access mentorship and educational programs',
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      value: 'mentor' as UserRole,
      title: 'Mentor',
      description: 'Share your expertise with students',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      value: 'organization' as UserRole,
      title: 'Organization',
      description: 'Join the network and collaborate',
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      value: 'sponsor' as UserRole,
      title: 'Sponsor',
      description: 'Support aviation & STEM education',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ]

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    if (role !== 'admin') {
      setValue('role', role as 'student' | 'mentor' | 'organization' | 'sponsor')
    }
    setStep(2)
  }

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('')
      setIsLoading(true)

      await signUpWithEmail({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
        role: data.role,
        organizationName: data.organizationName,
        location: {
          city: data.city,
          state: data.state,
          country: data.country,
        },
      })

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-aviation-navy via-blue-900 to-aviation-navy py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Plane className="h-12 w-12 text-aviation-gold" />
            <div>
              <h1 className="font-heading text-3xl font-bold text-white">
                Hidden Treasures Network
              </h1>
            </div>
          </div>
          <p className="text-gray-300">Join the global aviation & STEM education movement</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-aviation-gold text-aviation-navy' : 'bg-gray-600 text-white'}`}>
              {step > 1 ? <Check className="h-5 w-5" /> : '1'}
            </div>
            <span className="text-white text-sm">Select Role</span>
          </div>
          <div className="w-16 h-1 bg-gray-600"></div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-aviation-gold text-aviation-navy' : 'bg-gray-600 text-white'}`}>
              2
            </div>
            <span className="text-white text-sm">Your Information</span>
          </div>
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Choose Your Role</CardTitle>
              <CardDescription className="text-center">
                Select the role that best describes you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {roles.map((role) => {
                  const Icon = role.icon
                  return (
                    <button
                      key={role.value}
                      onClick={() => handleRoleSelect(role.value)}
                      className="p-6 border-2 border-gray-200 rounded-lg hover:border-aviation-sky hover:shadow-lg transition-all text-left group"
                    >
                      <div className={`w-12 h-12 ${role.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-6 w-6 ${role.color}`} />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-aviation-navy mb-2">
                        {role.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{role.description}</p>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Registration Form */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Create Your Account
                {selectedRole && (
                  <Badge variant="outline" className="ml-3">
                    {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-center">
                Enter your information to get started
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Full Name *</Label>
                    <Input
                      id="displayName"
                      placeholder="John Doe"
                      {...register('displayName')}
                      disabled={isLoading}
                    />
                    {errors.displayName && (
                      <p className="text-sm text-red-600">{errors.displayName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      {...register('email')}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {selectedRole === 'organization' && (
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization Name</Label>
                    <Input
                      id="organizationName"
                      placeholder="Your Organization"
                      {...register('organizationName')}
                      disabled={isLoading}
                    />
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      {...register('city')}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      placeholder="State"
                      {...register('state')}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Country"
                      {...register('country')}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...register('password')}
                      disabled={isLoading}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      {...register('confirmPassword')}
                      disabled={isLoading}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  {!preselectedRole && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="flex-1 bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-center border-t pt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-aviation-sky hover:text-aviation-sky/80 font-semibold">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        )}

        <p className="mt-8 text-center text-sm text-gray-300">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-aviation-gold hover:text-aviation-gold/80">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-aviation-gold hover:text-aviation-gold/80">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
