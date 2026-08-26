/**
 * Sign in — the error states, isolated.
 *
 * Small on purpose. Validation styling is hard to judge inside a busy screen:
 * this one shows a field at rest, focused, invalid with a message, and
 * disabled while submitting, plus the form-level error that sits above them.
 */
import { useState, type FormEvent } from "react"
import { KeyRoundIcon, MailIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Icon } from "@/components/ui/icon"
import { Link } from "@/components/ui/link"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TextField } from "@/components/ui/text-field"
import { Toaster, toast } from "@/components/ui/toast"

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function AuthTemplate() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const emailError =
    submitted && !isEmail(email)
      ? email.length === 0
        ? "Enter your email address."
        : "That does not look like an email address."
      : undefined
  const passwordError =
    submitted && password.length < 8
      ? "Passwords are at least 8 characters."
      : undefined

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    if (!isEmail(email) || password.length < 8) return

    setPending(true)
    setFormError(null)
    setTimeout(() => {
      setPending(false)
      // Always fails, so the form-level error is visible without a backend.
      setFormError("We could not sign you in. Check your password and retry.")
    }, 1200)
  }

  return (
    <div className="bg-m3-surface-container-low text-foreground flex min-h-full items-center justify-center p-m3-lg">
      <div className="flex w-full max-w-md flex-col gap-m3-lg">
        <div className="flex flex-col items-center gap-m3-sm">
          <span className="flex size-14 items-center justify-center rounded-m3-lg bg-m3-primary text-m3-on-primary">
            <Icon size="lg">
              <MailIcon />
            </Icon>
          </span>
          <h1 className="text-m3-headline-md">materialcn</h1>
          <p className="text-m3-body-md text-m3-on-surface-variant">
            Sign in to continue to your workspace.
          </p>
        </div>

        <Card>
          <Tabs defaultValue="signin">
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>
                Use the email your workspace was created with.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-m3-lg">
              <TabsList variant="segmented" className="w-full">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Create account</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="flex flex-col gap-m3-lg">
                {formError ? (
                  <Alert severity="error">
                    <AlertTitle>Sign-in failed</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                ) : null}

                {/* A real form element, so Enter submits and password
                    managers recognise the pair. */}
                <form
                  className="flex flex-col gap-m3-lg"
                  noValidate
                  onSubmit={onSubmit}
                >
                  <TextField
                    label="Email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onValueChange={setEmail}
                    disabled={pending}
                    error={emailError}
                    leading={<MailIcon />}
                  />
                  <TextField
                    label="Password"
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onValueChange={setPassword}
                    disabled={pending}
                    error={passwordError}
                    supportingText={
                      passwordError ? undefined : "At least 8 characters."
                    }
                  />

                  <div className="flex flex-wrap items-center justify-between gap-m3-md">
                    <Field orientation="horizontal" className="w-auto">
                      <Checkbox
                        id="auth-remember"
                        checked={remember}
                        onCheckedChange={setRemember}
                      />
                      <FieldLabel htmlFor="auth-remember">
                        Keep me signed in
                      </FieldLabel>
                    </Field>
                    <Link href="#">Forgot password?</Link>
                  </div>

                  <Button type="submit" loading={pending} className="w-full">
                    Sign in
                  </Button>
                </form>

                <div className="flex items-center gap-m3-md">
                  <Separator className="flex-1" decorative />
                  <span className="text-m3-label-md text-m3-on-surface-variant">
                    or
                  </span>
                  <Separator className="flex-1" decorative />
                </div>

                <div className="flex flex-col gap-m3-sm">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      toast.add({
                        description: "Opening your identity provider…",
                        timeout: 4000,
                      })
                    }
                  >
                    <KeyRoundIcon />
                    Continue with SSO
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="flex flex-col gap-m3-lg">
                <TextField label="Full name" autoComplete="name" />
                <TextField label="Work email" autoComplete="email" />
                <TextField
                  label="Password"
                  autoComplete="new-password"
                  supportingText="At least 8 characters, one of them a number."
                />
                <Field>
                  <div className="flex items-start gap-m3-md">
                    <Checkbox id="auth-terms" />
                    <div className="flex flex-col gap-m3-xs">
                      <FieldLabel htmlFor="auth-terms">
                        I agree to the terms
                      </FieldLabel>
                      <FieldDescription>
                        You can read them in full at any time.
                      </FieldDescription>
                    </div>
                  </div>
                </Field>
                <Button
                  className="w-full"
                  onClick={() =>
                    toast.add({
                      description: "Check your inbox to confirm",
                      timeout: 5000,
                    })
                  }
                >
                  Create account
                </Button>
              </TabsContent>
            </CardContent>

            <CardFooter className="justify-center">
              <p className="text-m3-body-sm text-m3-on-surface-variant">
                Trouble signing in? <Link href="#">Contact support</Link>.
              </p>
            </CardFooter>
          </Tabs>
        </Card>
      </div>

      <Toaster />
    </div>
  )
}
