import DOMPurify from "dompurify";

export const trustedPolicy =
  window.trustedTypes?.createPolicy("app-policy", {
    createHTML: (input) => DOMPurify.sanitize(input),
  });

export function sanitizeHTML(html) {
  return trustedPolicy
    ? trustedPolicy.createHTML(html)
    : DOMPurify.sanitize(html);
}