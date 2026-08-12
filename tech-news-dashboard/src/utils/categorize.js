export const CATEGORIES = [
  "AI",
  "Programming",
  "Startups",
  "Cybersecurity",
  "Cloud",
  "Mobile",
  "Web Dev",
];

const KEYWORDS = {
  AI: ["ai", "artificial intelligence", "machine learning", "llm", "gpt", "neural", "chatbot", "openai", "anthropic", "claude", "gemini", "model"],
  Programming: ["programming", "language", "compiler", "rust", "python", "golang", " go ", "typescript", "javascript", "code", "algorithm", "developer", "sdk", "library", "framework"],
  Startups: ["startup", "funding", "raises", "seed round", "series a", "series b", "venture", "acquire", "acquisition", "ipo", "valuation"],
  Cybersecurity: ["security", "breach", "vulnerability", "exploit", "hack", "malware", "ransomware", "cve", "phishing", "encryption"],
  Cloud: ["cloud", "aws", "azure", "gcp", "kubernetes", "docker", "serverless", "infrastructure", "devops"],
  Mobile: ["ios", "android", "iphone", "app store", "mobile", "flutter", "swift", "kotlin"],
  "Web Dev": ["react", "vue", "css", "html", "web dev", "browser", "frontend", "front-end", "next.js", "vite", "tailwind"],
};

/** Cheap heuristic categorizer: scans title (+ optional summary) for keyword hits. */
export function categorize(title = "", summary = "") {
  const text = `${title} ${summary}`.toLowerCase();
  for (const category of CATEGORIES) {
    if (KEYWORDS[category].some((kw) => text.includes(kw))) {
      return category;
    }
  }
  return "General";
}
