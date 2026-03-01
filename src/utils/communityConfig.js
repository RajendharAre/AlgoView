/**
 * Community Resources Configuration
 * Curated list of developer communities across platforms
 */

export const communityConfig = [
  // ── Discord ────────────────────────────────────────────
  {
    id: 'reactiflux',
    name: 'Reactiflux',
    platform: 'Discord',
    category: 'Frontend',
    description: 'The largest React community on Discord. Get help with React, React Native, Redux, and related libraries from over 200k members.',
    members: '230K+',
    url: 'https://discord.gg/reactiflux',
    tags: ['React', 'Redux', 'Next.js'],
  },
  {
    id: 'tailwind-css',
    name: 'Tailwind CSS',
    platform: 'Discord',
    category: 'Frontend',
    description: 'Official Tailwind CSS Discord server. Discuss utility-first CSS, share designs, and get help with configuration.',
    members: '90K+',
    url: 'https://tailwindcss.com/discord',
    tags: ['CSS', 'Tailwind', 'Design'],
  },
  {
    id: 'typescript-community',
    name: 'TypeScript Community',
    platform: 'Discord',
    category: 'Frontend',
    description: 'Active TypeScript community for discussing types, generics, and best practices with fellow TS developers.',
    members: '55K+',
    url: 'https://discord.gg/typescript',
    tags: ['TypeScript', 'JavaScript'],
  },
  {
    id: 'devcord',
    name: 'Devcord',
    platform: 'Discord',
    category: 'General',
    description: 'A friendly community for developers of all skill levels. Get code reviews, career advice, and project feedback.',
    members: '30K+',
    url: 'https://discord.gg/devcord',
    tags: ['Networking', 'Code Review', 'Career'],
  },
  {
    id: 'python-discord',
    name: 'Python',
    platform: 'Discord',
    category: 'Backend',
    description: 'Official Python Discord community. Discuss Python development, get help with projects, and participate in events.',
    members: '380K+',
    url: 'https://discord.gg/python',
    tags: ['Python', 'Django', 'Flask'],
  },
  {
    id: 'the-coding-den',
    name: 'The Coding Den',
    platform: 'Discord',
    category: 'General',
    description: 'Welcoming community for coding newcomers and experts alike. Mentorship programs and daily challenges.',
    members: '100K+',
    url: 'https://discord.gg/code',
    tags: ['Beginner', 'Mentorship', 'Challenges'],
  },

  // ── Reddit ─────────────────────────────────────────────
  {
    id: 'r-webdev',
    name: 'r/webdev',
    platform: 'Reddit',
    category: 'Frontend',
    description: 'Subreddit for web developers to share articles, tutorials, tools, and discuss industry trends.',
    members: '2.1M+',
    url: 'https://reddit.com/r/webdev',
    tags: ['Web Dev', 'Frontend', 'Backend'],
  },
  {
    id: 'r-reactjs',
    name: 'r/reactjs',
    platform: 'Reddit',
    category: 'Frontend',
    description: 'The React subreddit. Latest news, tutorials, open-source projects, and discussions about React ecosystem.',
    members: '400K+',
    url: 'https://reddit.com/r/reactjs',
    tags: ['React', 'Next.js', 'Hooks'],
  },
  {
    id: 'r-programming',
    name: 'r/programming',
    platform: 'Reddit',
    category: 'General',
    description: 'One of the largest programming communities. Cross-language discussions, industry news, and technical deep-dives.',
    members: '6.2M+',
    url: 'https://reddit.com/r/programming',
    tags: ['General', 'News', 'Discussion'],
  },
  {
    id: 'r-learnprogramming',
    name: 'r/learnprogramming',
    platform: 'Reddit',
    category: 'General',
    description: 'A subreddit for learning programming. Ask questions, share resources, and get mentorship from experienced developers.',
    members: '4.5M+',
    url: 'https://reddit.com/r/learnprogramming',
    tags: ['Beginner', 'Learning', 'Mentorship'],
  },
  {
    id: 'r-devops',
    name: 'r/devops',
    platform: 'Reddit',
    category: 'DevOps',
    description: 'Discussion hub for DevOps practices, CI/CD pipelines, cloud infrastructure, and container orchestration.',
    members: '310K+',
    url: 'https://reddit.com/r/devops',
    tags: ['DevOps', 'CI/CD', 'Cloud'],
  },
  {
    id: 'r-node',
    name: 'r/node',
    platform: 'Reddit',
    category: 'Backend',
    description: 'Node.js community on Reddit. Discuss server-side JavaScript, APIs, packages, and deployment strategies.',
    members: '210K+',
    url: 'https://reddit.com/r/node',
    tags: ['Node.js', 'Express', 'APIs'],
  },

  // ── GitHub ─────────────────────────────────────────────
  {
    id: 'github-reactjs',
    name: 'facebook/react',
    platform: 'GitHub',
    category: 'Frontend',
    description: 'Official React repository. Follow discussions, contribute to issues, and stay on top of the latest RFC proposals.',
    members: '230K+ stars',
    url: 'https://github.com/facebook/react',
    tags: ['React', 'Open Source', 'Meta'],
  },
  {
    id: 'github-nodejs',
    name: 'nodejs/node',
    platform: 'GitHub',
    category: 'Backend',
    description: 'Node.js core repository. Participate in the direction of the runtime, report bugs, and contribute code.',
    members: '108K+ stars',
    url: 'https://github.com/nodejs/node',
    tags: ['Node.js', 'Open Source', 'Runtime'],
  },
  {
    id: 'github-awesome-selfhosted',
    name: 'awesome-selfhosted',
    platform: 'GitHub',
    category: 'DevOps',
    description: 'Curated list of self-hosted software. Discover alternatives to cloud services you can run yourself.',
    members: '200K+ stars',
    url: 'https://github.com/awesome-selfhosted/awesome-selfhosted',
    tags: ['Self-Hosted', 'Open Source', 'DevOps'],
  },
  {
    id: 'github-first-contributions',
    name: 'first-contributions',
    platform: 'GitHub',
    category: 'Open Source',
    description: 'Beginner-friendly repo to make your first open-source contribution. Step-by-step guides for Git workflow.',
    members: '45K+ stars',
    url: 'https://github.com/firstcontributions/first-contributions',
    tags: ['Beginner', 'Open Source', 'Git'],
  },
  {
    id: 'github-free-programming',
    name: 'free-programming-books',
    platform: 'GitHub',
    category: 'General',
    description: 'Massive list of free learning resources — books, courses, interactive tutorials, podcasts, and more.',
    members: '340K+ stars',
    url: 'https://github.com/EbookFoundation/free-programming-books',
    tags: ['Books', 'Free', 'Learning'],
  },

  // ── Stack Overflow ─────────────────────────────────────
  {
    id: 'so-javascript',
    name: 'JavaScript',
    platform: 'Stack Overflow',
    category: 'Frontend',
    description: 'Most active tag on Stack Overflow. Find answers to JS questions, learn patterns, and help other developers.',
    members: '2.5M+ questions',
    url: 'https://stackoverflow.com/questions/tagged/javascript',
    tags: ['JavaScript', 'Q&A'],
  },
  {
    id: 'so-python',
    name: 'Python',
    platform: 'Stack Overflow',
    category: 'Backend',
    description: 'Second most popular tag. Get solutions for Python problems from data science to web backends.',
    members: '2.2M+ questions',
    url: 'https://stackoverflow.com/questions/tagged/python',
    tags: ['Python', 'Q&A'],
  },
  {
    id: 'so-react',
    name: 'React',
    platform: 'Stack Overflow',
    category: 'Frontend',
    description: 'All React-related Q&A on Stack Overflow. From hooks to performance optimization and SSR.',
    members: '450K+ questions',
    url: 'https://stackoverflow.com/questions/tagged/reactjs',
    tags: ['React', 'Q&A'],
  },

  // ── Telegram ───────────────────────────────────────────
  {
    id: 'tg-webdevs',
    name: 'Web Developers Hub',
    platform: 'Telegram',
    category: 'Frontend',
    description: 'Active Telegram group for web developers sharing resources, job postings, and technical discussions.',
    members: '45K+',
    url: 'https://t.me/AskWebDevs',
    tags: ['Web Dev', 'Jobs', 'Resources'],
  },
  {
    id: 'tg-javascript',
    name: 'JavaScript Daily',
    platform: 'Telegram',
    category: 'Frontend',
    description: 'Daily JavaScript tips, news, and curated articles delivered to your Telegram.',
    members: '60K+',
    url: 'https://t.me/AskJS',
    tags: ['JavaScript', 'Tips', 'News'],
  },
  {
    id: 'tg-devops-eng',
    name: 'DevOps Engineers',
    platform: 'Telegram',
    category: 'DevOps',
    description: 'Telegram community for DevOps professionals discussing Kubernetes, Docker, Terraform, and cloud platforms.',
    members: '35K+',
    url: 'https://t.me/devops_eng',
    tags: ['DevOps', 'Kubernetes', 'Docker'],
  },

  // ── Dev.to / Hashnode ──────────────────────────────────
  {
    id: 'devto',
    name: 'DEV Community',
    platform: 'Dev.to',
    category: 'General',
    description: 'One of the largest developer blogging platforms. Write articles, join challenges, and engage with millions of devs.',
    members: '1M+ members',
    url: 'https://dev.to',
    tags: ['Blogging', 'Articles', 'Community'],
  },
  {
    id: 'hashnode',
    name: 'Hashnode',
    platform: 'Hashnode',
    category: 'General',
    description: 'Free blogging platform for developers with a built-in community. Own your content with custom domains.',
    members: '500K+ bloggers',
    url: 'https://hashnode.com',
    tags: ['Blogging', 'Writing', 'Community'],
  },

  // ── Open Source ────────────────────────────────────────
  {
    id: 'os-good-first-issue',
    name: 'Good First Issues',
    platform: 'GitHub',
    category: 'Open Source',
    description: 'Aggregator for beginner-friendly open-source issues across thousands of repos. Perfect for first-time contributors.',
    members: 'N/A',
    url: 'https://goodfirstissue.dev',
    tags: ['Open Source', 'Beginner', 'Contributing'],
  },
  {
    id: 'os-up-for-grabs',
    name: 'Up For Grabs',
    platform: 'GitHub',
    category: 'Open Source',
    description: 'Projects with curated tasks specifically for new contributors. Filter by language and difficulty.',
    members: 'N/A',
    url: 'https://up-for-grabs.net',
    tags: ['Open Source', 'Projects', 'Contributing'],
  },
];

/**
 * Get unique platforms from community data
 */
export function getCommunityPlatforms() {
  const platforms = [...new Set(communityConfig.map(c => c.platform))];
  return ['All', ...platforms.sort()];
}

/**
 * Get unique categories from community data
 */
export function getCommunityCategories() {
  const categories = [...new Set(communityConfig.map(c => c.category))];
  return ['All', ...categories.sort()];
}

/**
 * Filter communities by search, platform, and category
 */
export function filterCommunities({ communities, searchQuery, platform, category }) {
  return communities.filter(item => {
    // Search filter
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.platform.toLowerCase().includes(q) ||
        item.tags.some(tag => tag.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    // Platform filter
    if (platform && platform !== 'All' && item.platform !== platform) {
      return false;
    }

    // Category filter
    if (category && category !== 'All' && item.category !== category) {
      return false;
    }

    return true;
  });
}
