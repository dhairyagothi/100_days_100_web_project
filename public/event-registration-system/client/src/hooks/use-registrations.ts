import { useMutation, useQuery } from "@tanstack/react-query";
import { api, type RegistrationInput, buildUrl } from "@shared/routes";
import { useAuth } from "./use-auth";

export function useCreateRegistration() {
  return useMutation({
    mutationFn: async (data: RegistrationInput) => {
      const validated = api.registrations.create.input.parse(data);
      const res = await fetch(api.registrations.create.path, {
        method: api.registrations.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.registrations.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to register");
      }
      return api.registrations.create.responses[201].parse(await res.json());
    }
  });
}

export function useAdminRegistrations(params?: { search?: string; college?: string; domain?: 'Tech' | 'Non-Tech' }) {
  const { getToken, logout } = useAuth();
  
  return useQuery({
    queryKey: [api.registrations.list.path, params],
    queryFn: async () => {
      const token = getToken();
      if (!token) throw new Error("Unauthorized");
      
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.college) searchParams.append('college', params.college);
      if (params?.domain) searchParams.append('domain', params.domain);
      
      const qs = searchParams.toString();
      const url = qs ? `${api.registrations.list.path}?${qs}` : api.registrations.list.path;
      
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          logout();
          throw new Error("Session expired");
        }
        throw new Error("Failed to fetch registrations");
      }
      
      return api.registrations.list.responses[200].parse(await res.json());
    },
    // Only run if we have a token
    enabled: !!getToken(),
  });
}

export function useAnalytics() {
  const { getToken, logout } = useAuth();
  
  return useQuery({
    queryKey: [api.analytics.get.path],
    queryFn: async () => {
      const token = getToken();
      if (!token) throw new Error("Unauthorized");
      
      const res = await fetch(api.analytics.get.path, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          logout();
          throw new Error("Session expired");
        }
        throw new Error("Failed to fetch analytics");
      }
      
      return api.analytics.get.responses[200].parse(await res.json());
    },
    enabled: !!getToken(),
  });
}
