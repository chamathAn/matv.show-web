"use client"

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import React from 'react'

export default function SignIn() {
    const handleSignIn = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "http://localhost:3001/",
        })
    }
  return (
    <div>
        <Button onClick={handleSignIn}>Sign In</Button>
    </div>
  )
}
