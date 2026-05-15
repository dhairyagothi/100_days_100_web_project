import { RegistrationForm } from "@/components/RegistrationForm";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background font-sans">

      {/* Mobile-only top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border/40 bg-card/80 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-primary"></span>
          <span className="font-display font-bold text-primary text-sm">Zenith 2026</span>
        </div>
        <Link href="/admin/login">
          <Button size="sm" variant="outline" data-testid="link-admin-mobile">
            <Shield className="w-3.5 h-3.5 mr-1.5" />
            Admin Access
          </Button>
        </Link>
      </div>

      {/* Main body */}
      <div className="flex flex-1">
        {/* Left Panel - visible only on large screens */}
        <div className="hidden lg:flex w-[45%] relative flex-col justify-between p-12 overflow-hidden bg-zinc-950 shrink-0">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop"
              alt="Conference Event"
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-purple-900/40 to-transparent mix-blend-multiply" />
            <div className="absolute inset-0 bg-zinc-950/50" />
          </div>
          <div className="relative z-10 text-white mt-8">
            <div className="inline-flex items-center rounded-full border border-purple-400/30 bg-purple-400/10 px-3 py-1 text-sm font-medium backdrop-blur-md mb-6">
              <span className="flex h-2 w-2 rounded-full bg-purple-400 mr-2"></span>
              Registrations Open
            </div>
            <h1 className="font-display text-5xl xl:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Welcome to <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-violet-400">
                Zenith 2026
              </span>
            </h1>
            <p className="text-lg xl:text-xl text-white/75 max-w-md font-medium leading-relaxed">
              Join students and professionals at the premier event. Secure your spot today.
            </p>
          </div>
          <div className="relative z-10 text-sm flex justify-between items-center">
            <p className="text-white/40">© 2026 Zenith Event. All rights reserved.</p>
            <Link href="/admin/login">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 bg-white/10 text-white backdrop-blur-md"
                data-testid="link-admin-desktop"
              >
                <Shield className="w-3.5 h-3.5 mr-1.5" />
                Admin Access
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-gradient-to-br from-background to-secondary/10">
          <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-6 lg:hidden text-center">
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Secure your spot</h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">Join the premier event of 2026.</p>
            </div>
            <RegistrationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
