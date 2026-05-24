export async function fetchRepoStats() {
    try {
        const owner = window.REPO_OWNER || 'dhairyagothi';
        const name = window.REPO_NAME || '100_days_100_web_project';
        const [repoRes, prRes] = await Promise.all([
            fetch(`https://api.github.com/repos/${owner}/${name}`),
            fetch(`https://api.github.com/search/issues?q=repo:${owner}/${name}+type:pr+state:open`)
        ]);
        if (!repoRes.ok || !prRes.ok) throw new Error("Stats fetch failed");
        const repo = await repoRes.json();
        const prs  = await prRes.json();

        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = Number(val).toLocaleString();
        };
        set('starCount',  repo.stargazers_count);
        set('forkCount',  repo.forks_count);
        set('issueCount', repo.open_issues_count - prs.total_count);
        set('prCount',    prs.total_count);
    } catch (e) {
        console.warn("GitHub stats unavailable:", e.message);
    }
}
