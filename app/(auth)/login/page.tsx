"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Rocket, Github, Loader2, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LiquidMetalIconBadge } from "@/components/ui/liquid-metal-button";
import { InteractiveRobotSpline } from "@/components/ui/interactive-3d-robot";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleGoogleLogin = async () => {
    setIsLoading("google");
    setMessage(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
      setIsLoading(null);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading("github");
    setMessage(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
      setIsLoading(null);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading("email");
    setMessage(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Check your email for the magic link!" });
    }
    setIsLoading(null);
  };

  return (
    <>
      {/* Error/Success messages */}
      {(error || message) && (
        <div className={`p-4 rounded-xl text-sm ${error || message?.type === "error"
            ? "bg-rose-500/10 text-rose-300 border border-rose-300/25"
            : "bg-emerald-500/10 text-emerald-300 border border-emerald-300/25"
          }`}>
          {error === "auth_failed" ? "Authentication failed. Please try again." : message?.text}
        </div>
      )}

      {/* OAuth buttons */}
      <div className="space-y-3">
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading !== null}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-600/70 bg-zinc-950/80 px-4 py-3.5 text-sm font-medium text-[var(--color-text-primary)] transition-all hover:border-purple-500/50 hover:bg-zinc-900/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading === "google" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          Continue with Google
        </button>

        <button
          onClick={handleGithubLogin}
          disabled={isLoading !== null}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-600/70 bg-zinc-950/80 px-4 py-3.5 text-sm font-medium text-[var(--color-text-primary)] transition-all hover:border-purple-500/50 hover:bg-zinc-900/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading === "github" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Github className="h-5 w-5" />
          )}
          Continue with GitHub
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-[var(--color-border-default)]" />
        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">or</span>
        <div className="h-px flex-1 bg-[var(--color-border-default)]" />
      </div>

      {/* Email input */}
      <form onSubmit={handleEmailLogin} className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="h-12 w-full rounded-xl border border-zinc-600/70 bg-zinc-950/80 pl-12 pr-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading !== null || !email}
          className="h-12 w-full rounded-xl btn-primary text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading === "email" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Continue with Email"
          )}
        </button>
      </form>
    </>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-12 w-full rounded-xl bg-[var(--color-bg-card)]" />
      <div className="h-12 w-full rounded-xl bg-[var(--color-bg-card)]" />
      <div className="flex items-center gap-4 py-2">
        <div className="h-px flex-1 bg-[var(--color-border-default)]" />
        <div className="w-8 h-3 rounded bg-[var(--color-bg-card)]" />
        <div className="h-px flex-1 bg-[var(--color-border-default)]" />
      </div>
      <div className="h-12 w-full rounded-xl bg-[var(--color-bg-card)]" />
      <div className="h-12 w-full rounded-xl bg-[var(--color-bg-card)]" />
    </div>
  );
}

export default function LoginPage() {
  const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="flex min-h-screen items-center justify-center px-6 py-10 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md space-y-8"
          >
            {/* Back to home */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-purple-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>

            {/* Logo */}
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mb-5 inline-flex items-center justify-center rounded-full border border-zinc-600/70 bg-zinc-900/60 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-purple-500/90"
              >
                Auth Portal
              </motion.div>
              <motion.div
                className="relative mx-auto"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="absolute inset-0 mx-auto h-20 w-20 rounded-2xl bg-white/20 opacity-35 blur-2xl" />
                <div className="relative mx-auto w-fit">
                  <LiquidMetalIconBadge icon={<Rocket className="h-9 w-9 -rotate-45 transform" />} size={80} />
                </div>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 text-4xl font-extrabold text-[var(--color-text-primary)] heading-glow font-[family-name:var(--font-display)]"
              >
                Career<span className="text-purple-500">Pilot</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-2 text-[var(--color-text-secondary)]"
              >
                Your AI-powered job-hunting teammate
              </motion.p>
            </div>

            {/* Auth card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative space-y-5 rounded-[var(--radius-lg)] border border-zinc-500/55 bg-zinc-800/35 p-8 shadow-[0_0_38px_rgba(255,255,255,0.12)] backdrop-blur-2xl"
            >
              <div className="text-center">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                  Welcome <span className="text-purple-500">Back</span>
                </h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  Sign in to continue your job hunt
                </p>
              </div>

              <Suspense fallback={<LoginFormSkeleton />}>
                <LoginForm />
              </Suspense>
            </motion.div>

            {/* Footer text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center text-xs text-[var(--color-text-muted)]"
            >
              By continuing, you agree to CareerPilot&apos;s{" "}
              <a href="#" className="text-purple-500 hover:underline">Terms of Service</a> and{" "}
              <a href="#" className="text-purple-500 hover:underline">Privacy Policy</a>.
            </motion.p>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-center text-sm font-medium text-[var(--color-text-secondary)]"
            >
              &ldquo;You sleep. <span className="text-purple-500">CareerPilot hunts.</span>&rdquo;
            </motion.p>
          </motion.div>
        </div>

        <div className="relative hidden min-h-screen border-l border-zinc-800 lg:block">
          <InteractiveRobotSpline
            scene={ROBOT_SCENE_URL}
            className="absolute inset-0 z-0 filter-[brightness(1.2)_contrast(1.12)_saturate(1.1)]"
          />

          <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-black/55 via-black/15 to-black/45" />
          <div className="pointer-events-none absolute inset-0 z-15 bg-radial-[at_50%_40%] from-white/14 via-transparent to-transparent mix-blend-screen" />
          <div className="pointer-events-none absolute inset-0 z-20 flex items-start justify-center px-8 pt-24">
            <div className="max-w-2xl text-center text-white drop-shadow-lg">
              <h2 className="text-3xl font-bold lg:text-4xl">
                This is interactive 3d robot <span className="text-purple-500">Whobee</span>
              </h2>
              <p className="mt-4 text-zinc-200">
                Whobee helps you practice interviews, sharpen your profile, and navigate every step of your job hunt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
