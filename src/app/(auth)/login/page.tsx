'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Chrome, Github, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleLogin = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(provider)
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      })
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      // We don't set loading to false here because we're redirecting
      // If there was an error that didn't redirect, we might want to reset it
      // But for OAuth, usually the user is taken away
      setTimeout(() => setIsLoading(null), 2000) 
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Background Gradients */}
      <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[100px] dark:bg-purple-900/20" />
      <div className="absolute -bottom-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[100px] dark:bg-blue-900/20" />

      <Card className="relative z-10 w-full max-w-md border-gray-200 bg-white/80 shadow-xl backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-base">
            Sign in to your account to continue your journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="relative h-12 w-full border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900 dark:hover:text-gray-50" 
            onClick={() => handleLogin('google')}
            disabled={!!isLoading}
          >
            {isLoading === 'google' ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Chrome className="mr-2 h-5 w-5 text-red-500" />
            )}
            <span className="font-medium">Sign in with Google</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="relative h-12 w-full border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900 dark:hover:text-gray-50" 
            onClick={() => handleLogin('github')}
            disabled={!!isLoading}
          >
            {isLoading === 'github' ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Github className="mr-2 h-5 w-5" />
            )}
            <span className="font-medium">Sign in with GitHub</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 dark:bg-gray-900">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Button variant="ghost" className="w-full text-xs text-muted-foreground" disabled>
                Email (Coming Soon)
             </Button>
             <Button variant="ghost" className="w-full text-xs text-muted-foreground" disabled>
                Phone (Coming Soon)
             </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-gray-100 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
          <div className="text-center text-xs text-gray-500">
            By clicking continue, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-gray-900 dark:hover:text-gray-50">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-gray-900 dark:hover:text-gray-50">
              Privacy Policy
            </Link>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
