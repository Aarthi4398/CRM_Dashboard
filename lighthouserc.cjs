module.exports = {
  ci: {
    collect: {
      startServerCommand: "npx next start --port 3000",
      startServerReadyPattern: "Ready",
      url: ["http://localhost:3000/dashboard", "http://localhost:3000/contacts"],
      numberOfRuns: 1,
      settings: { preset: "desktop" },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.35 }],
        "categories:accessibility": ["error", { minScore: 0.8 }],
        "categories:best-practices": ["warn", { minScore: 0.7 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
    },
  },
};
