import { useMutation } from "@tanstack/react-query";
import { api, type LoginRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export function useAuth() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const login = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const validated = api.auth.login.input.parse(data);
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid credentials");
        throw new Error("Login failed");
      }
      return api.auth.login.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      localStorage.setItem("admin_token", data.token);
      toast({ title: "Welcome back", description: "Successfully logged in." });
      setLocation("/admin/dashboard");
    },
    onError: (error: Error) => {
      toast({ 
        title: "Login Failed", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const logout = () => {
    localStorage.removeItem("admin_token");
    setLocation("/admin/login");
    toast({ title: "Logged out", description: "You have been securely logged out." });
  };

  const getToken = () => localStorage.getItem("admin_token");
  const isAuthenticated = () => !!getToken();

  return {
    login,
    logout,
    getToken,
    isAuthenticated
  };
}
