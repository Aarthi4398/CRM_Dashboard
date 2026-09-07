type BuildContentSecurityPolicyOptions = {
  development?: boolean;
};

export function buildContentSecurityPolicy(
  options: BuildContentSecurityPolicyOptions = {},
): string {
  const development = options.development ?? process.env.NODE_ENV === "development";

  const styleDirectives = development
    ? [
      "style-src 'self' 'unsafe-inline'",
      "style-src-attr 'unsafe-inline'",
      "style-src-elem 'self' 'unsafe-inline'",
    ]
    : [
      "style-src 'self'",
      "style-src-attr 'unsafe-inline'",
      "style-src-elem 'self'",
    ];

  const connectSrc = development
    ? "connect-src 'self' ws://localhost:* wss://localhost:* http://localhost:* https://localhost:*"
    : "connect-src 'self'";

  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    ...styleDirectives,
    "img-src 'self' data: blob: https://nextjs-demo.tailadmin.com",
    "media-src 'self' data: blob:",
    "font-src 'self' data:",
    connectSrc,
    "frame-src https://www.openstreetmap.org https://www.google.com https://maps.google.com https://www.youtube.com https://www.youtube-nocookie.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join("; ");
}

export function getContentSecurityPolicy(): string {
  return buildContentSecurityPolicy();
}

/** Production CSP snapshot for tests and documentation. */
export const productionContentSecurityPolicy = buildContentSecurityPolicy({ development: false });

/** @deprecated Use getContentSecurityPolicy() so dev/prod policies stay in sync. */
export const contentSecurityPolicy = getContentSecurityPolicy();

export function getSecurityHeaders() {
  return [
    { key: "Content-Security-Policy", value: getContentSecurityPolicy() },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), geolocation=()" },
  ] as const;
}

export const securityHeaders = getSecurityHeaders();
