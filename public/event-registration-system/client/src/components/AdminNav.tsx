import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, LayoutDashboard, ArrowLeft } from "lucide-react";

export function AdminNav() {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-display font-bold text-lg text-primary">Zenith Admin</span>
          <nav className="flex items-center gap-2">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground" data-testid="link-dashboard">
                <LayoutDashboard className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" data-testid="link-reg-portal">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Registration Portal
              </Button>
            </Link>
          </nav>
        </div>
        <Button variant="ghost" size="sm" onClick={() => logout()} className="text-muted-foreground shrink-0" data-testid="button-logout">
          <LogOut className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
