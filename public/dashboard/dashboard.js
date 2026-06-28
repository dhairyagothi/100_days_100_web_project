// ============================================
// REAL-TIME DASHBOARD - Issue #8866
// ============================================

class Dashboard {
  constructor() {
    this.charts = {};
    this.updateInterval = 60000; // 60 seconds
    this.init();
  }

  async init() {
    await this.fetchData();
    this.initCharts();
    this.startAutoRefresh();
    this.updateLastUpdated();
  }

  async fetchData() {
    try {
      // Using GitHub API (public data)
      const repo = 'dhairyagothi/100_days_100_web_project';
      
      const [repoData, issuesData, pullsData] = await Promise.all([
        fetch(`https://api.github.com/repos/${repo}`).then(r => r.json()),
        fetch(`https://api.github.com/repos/${repo}/issues?state=open&per_page=1`).then(r => r.headers),
        fetch(`https://api.github.com/repos/${repo}/pulls?state=open&per_page=1`).then(r => r.headers)
      ]);

      // Update stats
      document.getElementById('stars').textContent = repoData.stargazers_count || '—';
      document.getElementById('forks').textContent = repoData.forks_count || '—';
      document.getElementById('issues').textContent = issuesData.get('Link')?.match(/page=(\d+)/)?.[1] || '—';
      document.getElementById('prs').textContent = pullsData.get('Link')?.match(/page=(\d+)/)?.[1] || '—';

      // Sample data for charts
      this.chartData = {
        activity: [12, 18, 15, 22, 30, 25, 20, 28, 35, 40, 38, 45, 42, 50],
        categories: {
          'Tools': 87,
          'Games': 66,
          'UI': 29,
          'Website': 24,
          'API': 18,
          'AI': 13
        },
        techStacks: {
          'JavaScript': 156,
          'CSS': 148,
          'HTML': 142,
          'React': 45,
          'Python': 30,
          'TypeScript': 25
        },
        difficulty: {
          'Beginner': 80,
          'Intermediate': 70,
          'Advanced': 68
        },
        topProjects: [
          { name: 'Analog Clock', views: 450 },
          { name: 'Custom Scroll Bar', views: 380 },
          { name: 'To-Do List', views: 350 },
          { name: 'Progress Bar', views: 320 },
          { name: 'Digital Clock', views: 290 }
        ]
      };

      this.updateTopProjects();
      this.updateCharts();

    } catch (error) {
      console.warn('Error fetching data:', error);
      this.useFallbackData();
    }
  }

  useFallbackData() {
    this.chartData = {
      activity: Array.from({ length: 14 }, () => Math.floor(Math.random() * 30) + 10),
      categories: {
        'Tools': 87,
        'Games': 66,
        'UI': 29,
        'Website': 24,
        'API': 18,
        'AI': 13
      },
      techStacks: {
        'JavaScript': 156,
        'CSS': 148,
        'HTML': 142,
        'React': 45,
        'Python': 30,
        'TypeScript': 25
      },
      difficulty: {
        'Beginner': 80,
        'Intermediate': 70,
        'Advanced': 68
      },
      topProjects: [
        { name: 'Analog Clock', views: 450 },
        { name: 'Custom Scroll Bar', views: 380 },
        { name: 'To-Do List', views: 350 }
      ]
    };
    this.updateTopProjects();
    this.updateCharts();
  }

  initCharts() {
    const ctx1 = document.getElementById('activityChart').getContext('2d');
    this.charts.activity = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: Array.from({ length: 14 }, (_, i) => `Day ${i + 1}`),
        datasets: [{
          label: 'Activity',
          data: this.chartData.activity,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          x: { ticks: { color: '#64748b' } },
          y: { ticks: { color: '#64748b' } }
        }
      }
    });

    const ctx2 = document.getElementById('categoryChart').getContext('2d');
    this.charts.category = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: Object.keys(this.chartData.categories),
        datasets: [{
          data: Object.values(this.chartData.categories),
          backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#3b82f6']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right', labels: { color: '#94a3b8' } }
        }
      }
    });

    const ctx3 = document.getElementById('techStackChart').getContext('2d');
    this.charts.techStack = new Chart(ctx3, {
      type: 'bar',
      data: {
        labels: Object.keys(this.chartData.techStacks),
        datasets: [{
          label: 'Projects',
          data: Object.values(this.chartData.techStacks),
          backgroundColor: '#8b5cf6',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          x: { ticks: { color: '#64748b' } },
          y: { ticks: { color: '#64748b' } }
        }
      }
    });

    const ctx4 = document.getElementById('difficultyChart').getContext('2d');
    this.charts.difficulty = new Chart(ctx4, {
      type: 'bar',
      data: {
        labels: Object.keys(this.chartData.difficulty),
        datasets: [{
          label: 'Projects',
          data: Object.values(this.chartData.difficulty),
          backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          x: { ticks: { color: '#64748b' } },
          y: { ticks: { color: '#64748b' } }
        }
      }
    });
  }

  updateCharts() {
    if (this.charts.activity) {
      this.charts.activity.data.datasets[0].data = this.chartData.activity;
      this.charts.activity.update();
    }
    // Update other charts as needed
  }

  updateTopProjects() {
    const container = document.getElementById('topProjectsList');
    container.innerHTML = this.chartData.topProjects.map((p, i) => `
      <div class="project-item">
        <span class="project-name">${i + 1}. ${p.name}</span>
        <span class="project-views">👁️ ${p.views} views</span>
      </div>
    `).join('');
  }

  startAutoRefresh() {
    setInterval(() => {
      this.fetchData();
      this.updateLastUpdated();
    }, this.updateInterval);
  }

  updateLastUpdated() {
    const now = new Date();
    document.getElementById('lastUpdated').textContent = 
      `Last updated: ${now.toLocaleTimeString()}`;
  }
}

// ── Initialize Dashboard ──
document.addEventListener('DOMContentLoaded', () => {
  const dashboard = new Dashboard();
});