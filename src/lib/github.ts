export interface GitHubStats {
  stars: number;
  forks: number;
  openIssues: number;
  pullRequests: number;
}

export interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

const REPO_OWNER = "dhairyagothi";
const REPO_NAME = "100_days_100_web_project";

export async function getRepoStats(): Promise<GitHubStats> {
  try {
    const [repoRes, prRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`, { next: { revalidate: 3600 } }),
      fetch(`https://api.github.com/search/issues?q=repo:${REPO_OWNER}/${REPO_NAME}+type:pr+state:open`, { next: { revalidate: 3600 } })
    ]);

    if (!repoRes.ok || !prRes.ok) throw new Error("Stats fetch failed");

    const repoData = await repoRes.json();
    const prData = await prRes.json();

    return {
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      openIssues: repoData.open_issues_count - prData.total_count,
      pullRequests: prData.total_count,
    };
  } catch (error) {
    console.error("Error fetching repo stats:", error);
    return { stars: 0, forks: 0, openIssues: 0, pullRequests: 0 };
  }
}

export async function getContributors(): Promise<Contributor[]> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=100`,
      { next: { revalidate: 86400 } }
    );

    if (!response.ok) throw new Error("Failed to fetch contributors");

    return await response.json();
  } catch (error) {
    console.error("Error fetching contributors:", error);
    return [];
  }
}
