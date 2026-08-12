/**
 * GitHub's official trending page has no public API, so we approximate
 * "trending" using the search API: repositories created in the last
 * 7 days, ranked by stars. "Growth today" is shown as an honest average
 * (stars accumulated / days since creation) rather than a fabricated
 * live delta, since GitHub's REST API doesn't expose per-day star deltas.
 */
export async function fetchGithubTrending(limit = 12) {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const url = `https://api.github.com/search/repositories?q=created:>${since}&sort=stars&order=desc&per_page=${limit}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) throw new Error(`GitHub search failed: ${res.status}`);
    const data = await res.json();

    return (data.items || []).map((repo) => {
      const createdMs = new Date(repo.created_at).getTime();
      const ageDays = Math.max(1, (Date.now() - createdMs) / (1000 * 60 * 60 * 24));
      return {
        id: `gh-${repo.id}`,
        name: repo.name,
        fullName: repo.full_name,
        url: repo.html_url,
        description: repo.description || "No description provided.",
        language: repo.language || "Unknown",
        stars: repo.stargazers_count,
        avgStarsPerDay: Math.round((repo.stargazers_count / ageDays) * 10) / 10,
        owner: repo.owner?.login,
        avatar: repo.owner?.avatar_url,
      };
    });
  } catch (err) {
    console.error("GitHub trending fetch failed:", err);
    return [];
  }
}
