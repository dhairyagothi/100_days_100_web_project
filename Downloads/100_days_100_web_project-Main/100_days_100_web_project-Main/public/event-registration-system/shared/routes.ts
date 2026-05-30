import { z } from 'zod';
import { insertRegistrationSchema, insertUserSchema, registrations } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/admin/login' as const,
      input: insertUserSchema,
      responses: {
        200: z.object({ token: z.string() }),
        401: errorSchemas.unauthorized,
      },
    },
  },
  registrations: {
    create: {
      method: 'POST' as const,
      path: '/api/register' as const,
      input: insertRegistrationSchema.extend({
        domain: z.enum(['Tech', 'Non-Tech']),
        email: z.string().email(),
      }),
      responses: {
        201: z.custom<typeof registrations.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/registrations' as const,
      input: z.object({
        search: z.string().optional(),
        college: z.string().optional(),
        domain: z.enum(['Tech', 'Non-Tech']).optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof registrations.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
  },
  analytics: {
    get: {
      method: 'GET' as const,
      path: '/api/analytics' as const,
      responses: {
        200: z.object({
          totalRegistrations: z.number(),
          domainSplit: z.object({
            tech: z.number(),
            nonTech: z.number(),
          }),
          dailyRegistrations: z.array(z.object({
            date: z.string(),
            count: z.number(),
          })),
        }),
        401: errorSchemas.unauthorized,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type LoginRequest = z.infer<typeof api.auth.login.input>;
export type RegistrationInput = z.infer<typeof api.registrations.create.input>;
