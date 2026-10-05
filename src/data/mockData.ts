import {
  Student,
  Skill,
  Project,
  Certificate,
  Achievement,
  RoadmapStage,
  NextAction,
  DailyTask,
  Opportunity,
  ActionHistory
} from '../types';

export const CAREER_GOALS = [
  'AI / ML Engineer',
  'Generative AI Engineer',
  'Data Scientist',
  'Software Engineer',
  'Full Stack Developer',
  'Data Analyst',
  'Cybersecurity Engineer',
  'Cloud Engineer'
];

export const INITIAL_SKILLS: Skill[] = [
  {
    id: 'skill-python',
    name: 'Python',
    category: 'Programming',
    level: 'Advanced',
    score: 82,
    targetScore: 85,
    status: 'Strong',
    whyItMatters: 'Python is the primary language for machine learning, data pipelines, and LLM orchestration.',
    topicsToLearn: ['AsyncIO & Concurrency', 'Type Hints & Pydantic', 'Memory Profiling', 'Packaging & Poetry'],
    suggestedProject: 'Build a FastAPI Model Serving Microservice',
    estimatedDays: '4–5 days'
  },
  {
    id: 'skill-cpp',
    name: 'C++',
    category: 'Programming',
    level: 'Intermediate',
    score: 65,
    targetScore: 70,
    status: 'On Track',
    whyItMatters: 'Strong C++ fundamentals help with competitive programming, DSA interviews, and low-level inference optimization.',
    topicsToLearn: ['STL Containers & Algorithms', 'Smart Pointers', 'Memory Management'],
    suggestedProject: 'Custom Matrix Multiplication Library in C++',
    estimatedDays: '5–7 days'
  },
  {
    id: 'skill-javascript',
    name: 'JavaScript',
    category: 'Programming',
    level: 'Intermediate',
    score: 62,
    targetScore: 65,
    status: 'On Track',
    whyItMatters: 'Useful for building interactive web interfaces for your AI models and full-stack hackathon prototypes.',
    topicsToLearn: ['Promises & Async/Await', 'ES6+ Modules', 'Fetch & Streaming APIs'],
    suggestedProject: 'Interactive Streaming AI Chat Frontend',
    estimatedDays: '4 days'
  },
  {
    id: 'skill-dsa',
    name: 'DSA',
    category: 'Core CS',
    level: 'Intermediate',
    score: 61,
    targetScore: 80,
    status: 'Growing',
    whyItMatters: 'Technical interviews for AI/ML and Software roles still heavily test graphs, trees, and dynamic programming.',
    topicsToLearn: ['Trees & Graph Traversals', 'Dynamic Programming Patterns', 'Heaps & Priority Queues', 'Sliding Window'],
    suggestedProject: 'Solve 30 Medium Graph & DP Problems',
    estimatedDays: '10–14 days'
  },
  {
    id: 'skill-sql',
    name: 'SQL',
    category: 'Core CS',
    level: 'Intermediate',
    score: 68,
    targetScore: 75,
    status: 'On Track',
    whyItMatters: 'Every ML model relies on clean data extraction, aggregations, and feature queries from relational databases.',
    topicsToLearn: ['Window Functions', 'CTEs & Query Optimization', 'Indexing Strategies'],
    suggestedProject: 'Analytical Feature Store Queries on PostgreSQL',
    estimatedDays: '4–6 days'
  },
  {
    id: 'skill-git',
    name: 'Git/GitHub',
    category: 'Core CS',
    level: 'Intermediate',
    score: 74,
    targetScore: 75,
    status: 'Strong',
    whyItMatters: 'Clean commit history, branching, and pull requests show recruiters you can collaborate on real engineering teams.',
    topicsToLearn: ['Interactive Rebasing', 'GitHub Actions CI/CD', 'Pull Request Workflows'],
    suggestedProject: 'Automate Model Testing with GitHub Actions',
    estimatedDays: '2–3 days'
  },
  {
    id: 'skill-ml',
    name: 'Machine Learning',
    category: 'AI / ML',
    level: 'Beginner',
    score: 45,
    targetScore: 80,
    status: 'Needs Work',
    whyItMatters: 'Machine Learning is a core requirement for the AI/ML Engineer path you have selected.',
    topicsToLearn: ['Supervised Learning', 'Regression', 'Classification', 'Model Evaluation', 'Feature Engineering'],
    suggestedProject: 'Build an Image Classification Model',
    estimatedDays: '7–10 days'
  },
  {
    id: 'skill-dl',
    name: 'Deep Learning',
    category: 'AI / ML',
    level: 'Beginner',
    score: 25,
    targetScore: 80,
    status: 'Beginner',
    whyItMatters: 'Understanding neural architectures, PyTorch, and training loops separates real ML engineers from API wrappers.',
    topicsToLearn: ['Neural Networks & Backpropagation', 'PyTorch Tensors & Autograd', 'CNNs for Vision', 'Transformers Architecture'],
    suggestedProject: 'Train a Custom CNN on Medical/Plant Dataset in PyTorch',
    estimatedDays: '10–12 days'
  },
  {
    id: 'skill-genai',
    name: 'Generative AI',
    category: 'AI / ML',
    level: 'Beginner',
    score: 30,
    targetScore: 78,
    status: 'Beginner',
    whyItMatters: 'Companies hiring 3rd and 4th year interns actively look for practical RAG, embeddings, and evaluation skills.',
    topicsToLearn: ['Vector Embeddings & Similarity Search', 'Retrieval-Augmented Generation (RAG)', 'Structured Outputs', 'Prompt Evaluation'],
    suggestedProject: 'Build an AI Study Assistant with RAG',
    estimatedDays: '7–9 days'
  },
  {
    id: 'skill-llms',
    name: 'LLMs',
    category: 'AI / ML',
    level: 'Beginner',
    score: 20,
    targetScore: 75,
    status: 'Beginner',
    whyItMatters: 'Working with tokenization, context windows, fine-tuning (LoRA), and agent tool use is essential for modern AI roles.',
    topicsToLearn: ['Transformer Attention Mechanism', 'Tokenization & Context Windows', 'Fine-Tuning Basics (PEFT/LoRA)', 'Function Calling'],
    suggestedProject: 'Document Q&A Pipeline with Citation Grounding',
    estimatedDays: '8–10 days'
  },
  {
    id: 'skill-react',
    name: 'React',
    category: 'Frontend & Tools',
    level: 'Intermediate',
    score: 64,
    targetScore: 65,
    status: 'On Track',
    whyItMatters: 'Helps you ship complete, demonstrable AI applications that judges and interviewers can actually click and test.',
    topicsToLearn: ['Custom Hooks', 'State Management', 'API Integration'],
    suggestedProject: 'Interactive Model Evaluation Dashboard',
    estimatedDays: '5 days'
  },
  {
    id: 'skill-communication',
    name: 'Communication',
    category: 'Soft Skills',
    level: 'Intermediate',
    score: 70,
    targetScore: 80,
    status: 'On Track',
    whyItMatters: 'Explaining trade-offs, model metrics, and system architecture clearly is how you pass final rounds.',
    topicsToLearn: ['Project Walkthrough Storytelling', 'Writing Crisp READMEs', 'Behavioral STAR Responses'],
    suggestedProject: 'Record a 3-Minute Technical Demo of EcoLearn',
    estimatedDays: '2 days'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-expense',
    name: 'Expense Tracker',
    shortDescription: 'Personal finance web app to categorize daily student expenses and visualize monthly budgets.',
    problem: 'College students often lose track of small daily transactions and overspend their monthly allowance without realizing where it goes.',
    solution: 'Built a lightweight Flask + SQLite web application with category tagging, monthly budget thresholds, and clean SQL aggregation reports.',
    technologies: ['Python', 'Flask', 'SQLite'],
    skillsDemonstrated: ['Python', 'SQL', 'Git/GitHub'],
    status: 'Completed',
    progress: 100,
    githubUrl: 'https://github.com/demo-student/expense-tracker-flask',
    demoUrl: 'https://expense-tracker-demo.example.com',
    difficulty: 'Beginner',
    readinessBoost: 4
  },
  {
    id: 'proj-ecolearn',
    name: 'EcoLearn',
    shortDescription: 'Interactive sustainability learning platform with AI-generated quizzes and habit tracking for campus students.',
    problem: 'Environmental awareness modules in college feel like static PDFs that nobody reads or engages with.',
    solution: 'Developing a React + Firebase platform that turns sustainability topics into interactive scenarios and uses an AI prompt layer to generate personalized quizzes.',
    technologies: ['React', 'Firebase', 'AI'],
    skillsDemonstrated: ['React', 'JavaScript', 'Generative AI', 'Git/GitHub'],
    status: 'In Progress',
    progress: 65,
    githubUrl: 'https://github.com/demo-student/ecolearn-ai',
    demoUrl: 'https://ecolearn-preview.example.com',
    difficulty: 'Intermediate',
    readinessBoost: 5
  },
  {
    id: 'proj-study-assistant',
    name: 'AI Study Assistant',
    shortDescription: 'Upload university lecture notes and syllabus PDFs to ask grounded questions with exact page citations.',
    problem: 'Before semester exams, students waste hours searching across scattered PDFs, slides, and handwritten notes for specific concepts.',
    solution: 'Build an end-to-end Retrieval-Augmented Generation (RAG) pipeline in Python that chunks PDFs, stores vector embeddings, and answers syllabus questions with source citations.',
    technologies: ['Python', 'LLM', 'RAG'],
    skillsDemonstrated: ['Python', 'Generative AI', 'LLMs', 'Machine Learning'],
    status: 'Recommended',
    progress: 0,
    matchPercentage: 91,
    whyRecommended: 'Build this because it closes your LLM + RAG skill gap and gives you a strong flagship AI project for your resume.',
    estimatedTime: '8–10 days',
    difficulty: 'Intermediate',
    readinessBoost: 7
  },
  {
    id: 'proj-churn-predictor',
    name: 'Customer Churn & Explainability Pipeline',
    shortDescription: 'End-to-end supervised ML pipeline with feature engineering, XGBoost/Scikit-Learn training, and SHAP explainability.',
    problem: 'Having only web apps on your resume makes it hard to pass AI/ML resume screens that look for core classical ML fundamentals.',
    solution: 'Train, evaluate, and compare classification models on imbalanced tabular data, handle precision/recall trade-offs, and deploy an interactive prediction endpoint.',
    technologies: ['Python', 'Scikit-Learn', 'Pandas', 'FastAPI'],
    skillsDemonstrated: ['Machine Learning', 'Python', 'SQL'],
    status: 'Recommended',
    progress: 0,
    matchPercentage: 94,
    whyRecommended: 'Directly addresses your #1 immediate priority: Machine Learning Fundamentals and model evaluation.',
    estimatedTime: '6–7 days',
    difficulty: 'Intermediate',
    readinessBoost: 6
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-python',
    title: 'Programming for Everybody (Python)',
    issuer: 'University of Michigan · Coursera',
    date: 'March 2025',
    credentialId: 'COURSERA-PY-88412',
    verificationStatus: 'Verified (Demo)',
    skillsCovered: ['Python']
  },
  {
    id: 'cert-sql',
    title: 'SQL (Intermediate) Skill Certification',
    issuer: 'HackerRank',
    date: 'August 2025',
    credentialId: 'HR-SQL-59201',
    verificationStatus: 'Verified (Demo)',
    skillsCovered: ['SQL']
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Top 15 Finalist — Smart Campus Hackathon',
    category: 'Hackathon',
    date: 'February 2026',
    description: 'Built the initial prototype of EcoLearn in 24 hours with a 3-person team.'
  },
  {
    id: 'ach-2',
    title: 'Solved 150+ DSA Problems across LeetCode & GFG',
    category: 'Achievement',
    date: 'Ongoing',
    description: 'Consistent problem solving in arrays, hashing, two pointers, and binary trees.'
  }
];

export const INITIAL_ROADMAP: RoadmapStage[] = [
  {
    id: 'stage-01',
    number: '01',
    title: 'Foundation',
    subtitle: 'Core programming fluency and version control',
    status: 'Completed',
    items: [
      { id: 'rm-python', title: 'Python', completed: true, description: 'Data structures, OOP, functions, and scripting' },
      { id: 'rm-git', title: 'Git/GitHub', completed: true, description: 'Repositories, branching, commits, and pull requests' }
    ]
  },
  {
    id: 'stage-02',
    number: '02',
    title: 'Core Skills',
    subtitle: 'Data manipulation and mathematical intuition',
    status: 'Current',
    items: [
      { id: 'rm-numpy', title: 'NumPy', completed: true, description: 'Vectorized array operations and broadcasting' },
      { id: 'rm-pandas', title: 'Pandas', completed: true, description: 'Dataframes, cleaning, merging, and exploratory analysis' },
      { id: 'rm-stats', title: 'Statistics', completed: false, description: 'Probability distributions, hypothesis testing, and variance' }
    ]
  },
  {
    id: 'stage-03',
    number: '03',
    title: 'Machine Learning',
    subtitle: 'Classical ML algorithms and rigorous evaluation',
    status: 'Current',
    items: [
      { id: 'rm-supervised', title: 'Supervised Learning', completed: false, description: 'Linear/Logistic regression, decision trees, ensembles' },
      { id: 'rm-unsupervised', title: 'Unsupervised Learning', completed: false, description: 'K-Means clustering, PCA, and dimensionality reduction' },
      { id: 'rm-eval', title: 'Model Evaluation', completed: false, description: 'Cross-validation, F1-score, ROC-AUC, and overfitting prevention' }
    ]
  },
  {
    id: 'stage-04',
    number: '04',
    title: 'Deep Learning',
    subtitle: 'Neural networks and representation learning',
    status: 'Upcoming',
    items: [
      { id: 'rm-nn', title: 'Neural Networks', completed: false, description: 'Forward/backward pass, activation functions, optimizers' },
      { id: 'rm-cnn', title: 'CNN', completed: false, description: 'Convolutional layers, pooling, and transfer learning' },
      { id: 'rm-transformers', title: 'Transformers', completed: false, description: 'Self-attention mechanism and encoder-decoder architectures' }
    ]
  },
  {
    id: 'stage-05',
    number: '05',
    title: 'Generative AI',
    subtitle: 'Building reliable applications with large language models',
    status: 'Upcoming',
    items: [
      { id: 'rm-llm-fund', title: 'LLM Fundamentals', completed: false, description: 'Tokenization, temperature, context windows, and inference' },
      { id: 'rm-prompt', title: 'Prompt Engineering', completed: false, description: 'Few-shot prompting, structured JSON outputs, and guardrails' },
      { id: 'rm-embeddings', title: 'Embeddings', completed: false, description: 'Semantic search and vector databases' },
      { id: 'rm-rag', title: 'RAG', completed: false, description: 'Document chunking, hybrid retrieval, and grounded generation' },
      { id: 'rm-langchain', title: 'LangChain', completed: false, description: 'Chains, tool calling, and memory orchestration' }
    ]
  },
  {
    id: 'stage-06',
    number: '06',
    title: 'Portfolio',
    subtitle: 'Proof of work that stands out to engineering hiring managers',
    status: 'Upcoming',
    items: [
      { id: 'rm-ml-proj', title: 'ML Project', completed: false, description: 'End-to-end supervised learning pipeline with real dataset' },
      { id: 'rm-rag-app', title: 'RAG Application', completed: false, description: 'AI Study Assistant with document citations' },
      { id: 'rm-ai-assistant', title: 'AI Assistant', completed: false, description: 'Deployed full-stack AI tool with clean documentation' }
    ]
  },
  {
    id: 'stage-07',
    number: '07',
    title: 'Career',
    subtitle: 'Converting your skills and projects into offers',
    status: 'Upcoming',
    items: [
      { id: 'rm-resume', title: 'Resume', completed: false, description: 'Single-page impact-oriented technical resume' },
      { id: 'rm-internships', title: 'Internship Applications', completed: false, description: 'Targeted applications to high-match AI/ML roles' },
      { id: 'rm-interviews', title: 'Interview Preparation', completed: false, description: 'DSA rounds, ML theory questions, and project deep-dives' }
    ]
  }
];

export const INITIAL_DAILY_TASKS: DailyTask[] = [
  {
    id: 'daily-ml-lesson',
    title: 'Watch one ML fundamentals lesson (Supervised Learning)',
    duration: '30 min',
    skill: 'Machine Learning',
    status: 'Not Started',
    readinessGain: 1,
    skillGain: 3
  },
  {
    id: 'daily-dsa-5',
    title: 'Solve 5 DSA problems (Trees & Sliding Window)',
    duration: '45 min',
    skill: 'DSA',
    status: 'Not Started',
    readinessGain: 1,
    skillGain: 3
  },
  {
    id: 'daily-readme',
    title: 'Update one project README with architecture & screenshots',
    duration: '20 min',
    skill: 'Git/GitHub',
    status: 'Not Started',
    readinessGain: 1,
    skillGain: 2
  }
];

export const INITIAL_NEXT_ACTIONS: NextAction[] = [
  {
    id: 'act-ml-fundamentals',
    title: 'Complete Machine Learning Fundamentals',
    timeframe: 'today',
    priority: 'High',
    category: 'Learn',
    status: 'Not Started',
    progress: 15,
    skill: 'Machine Learning',
    skillBoost: 7,
    whyNow: 'You already have a strong Python foundation and programming project experience. Machine Learning is currently the biggest high-impact gap between your current profile and your AI/ML career goal.',
    impact: 'High',
    impactLabel: 'High Impact',
    estimatedTime: '7 days',
    expectedReadinessGain: 6,
    completed: false,
    inRoadmap: true,
    actionScore: 92,
    scoreBreakdown: {
      careerRelevance: 38,
      skillGapImpact: 27,
      currentSkillFit: 18,
      timeEfficiency: 9
    },
    whyReasons: [
      'You already know Python (82%)',
      'You have programming project experience',
      'Machine Learning is required for your selected career',
      'Closing this gap will significantly improve your readiness'
    ],
    metrics: {
      goalMatch: 94,
      gapImpact: 89,
      skillFit: 82,
      difficultyFit: 78
    }
  },
  {
    id: 'act-week-dsa',
    title: 'Solve 15 DSA Problems',
    timeframe: 'week',
    priority: 'Medium',
    category: 'Practice',
    status: 'Not Started',
    progress: 20,
    skill: 'DSA',
    skillBoost: 5,
    whyNow: 'Your DSA score is 61%. Moving from arrays/strings into trees and graphs will prepare you for online coding assessments.',
    impact: 'Medium',
    impactLabel: 'Medium Impact',
    estimatedTime: '3 days',
    expectedReadinessGain: 2,
    completed: false,
    inRoadmap: false,
    actionScore: 84,
    scoreBreakdown: {
      careerRelevance: 34,
      skillGapImpact: 24,
      currentSkillFit: 17,
      timeEfficiency: 9
    },
    whyReasons: [
      'Technical interviews test DSA before ML rounds',
      'Your current DSA score (61%) is 19% below target (80%)',
      'Consistent 5 problems/day builds speed without burnout'
    ],
    metrics: {
      goalMatch: 84,
      gapImpact: 76,
      skillFit: 78,
      difficultyFit: 85
    }
  },
  {
    id: 'act-week-classification',
    title: 'Build an Image Classification Project',
    timeframe: 'week',
    priority: 'High',
    category: 'Build',
    status: 'Not Started',
    progress: 0,
    skill: 'Machine Learning',
    skillBoost: 10,
    whyNow: 'Your fundamentals have improved. Now the best way to strengthen your profile is to prove the skill through a project.',
    impact: 'High',
    impactLabel: 'High Impact',
    estimatedTime: '5 days',
    expectedReadinessGain: 5,
    completed: false,
    inRoadmap: false,
    actionScore: 90,
    scoreBreakdown: {
      careerRelevance: 38,
      skillGapImpact: 28,
      currentSkillFit: 16,
      timeEfficiency: 8
    },
    whyReasons: [
      'Your ML fundamentals are improving — now you need project evidence',
      'Applies Supervised Learning directly on real classification data',
      'Directly unlocks higher match scores on AI/ML Internships'
    ],
    metrics: {
      goalMatch: 95,
      gapImpact: 90,
      skillFit: 84,
      difficultyFit: 82
    }
  },
  {
    id: 'act-week-github-push',
    title: 'Push Expense Tracker to GitHub with Clean README',
    timeframe: 'week',
    priority: 'Medium',
    category: 'Profile',
    status: 'Not Started',
    progress: 50,
    skill: 'Git/GitHub',
    skillBoost: 3,
    whyNow: 'Recruiters spend less than 45 seconds on a GitHub repo. Adding setup instructions and screenshots turns your code into portfolio proof.',
    impact: 'Medium',
    impactLabel: 'Quick Win',
    estimatedTime: '1 day',
    expectedReadinessGain: 2,
    completed: false,
    inRoadmap: true,
    actionScore: 81,
    scoreBreakdown: {
      careerRelevance: 31,
      skillGapImpact: 21,
      currentSkillFit: 19,
      timeEfficiency: 10
    },
    whyReasons: [
      'Expense Tracker is already 100% built',
      'High return on time invested (takes under 2 hours)',
      'Strengthens your GitHub profile completeness immediately'
    ],
    metrics: {
      goalMatch: 86,
      gapImpact: 74,
      skillFit: 92,
      difficultyFit: 95
    }
  },
  {
    id: 'act-month-ecolearn',
    title: 'Complete & Deploy EcoLearn AI Quiz Module',
    timeframe: 'month',
    priority: 'High',
    category: 'Build',
    status: 'In Progress',
    progress: 65,
    skill: 'Generative AI',
    skillBoost: 7,
    whyNow: 'EcoLearn is already 65% done. Finishing and deploying it turns an in-progress effort into concrete Generative AI portfolio proof.',
    impact: 'High',
    impactLabel: 'High Impact',
    estimatedTime: '6 days',
    expectedReadinessGain: 4,
    completed: false,
    inRoadmap: true,
    actionScore: 88,
    scoreBreakdown: {
      careerRelevance: 36,
      skillGapImpact: 26,
      currentSkillFit: 18,
      timeEfficiency: 8
    },
    whyReasons: [
      'Already 65% complete — finish what you started before adding new apps',
      'Demonstrates React + AI integration in a live web product',
      'Boosts Generative AI readiness score'
    ],
    metrics: {
      goalMatch: 88,
      gapImpact: 82,
      skillFit: 90,
      difficultyFit: 88
    }
  },
  {
    id: 'act-month-resume',
    title: 'Prepare Technical Resume with Quantified Project Metrics',
    timeframe: 'month',
    priority: 'Medium',
    category: 'Career',
    status: 'Not Started',
    progress: 0,
    skill: 'Communication',
    skillBoost: 4,
    whyNow: 'Once your ML project is pushed and readiness crosses 78%, a crisp single-page resume ensures you pass ATS and recruiter screens.',
    impact: 'High',
    impactLabel: 'High Impact',
    estimatedTime: '2 days',
    expectedReadinessGain: 3,
    completed: false,
    inRoadmap: true,
    actionScore: 85,
    scoreBreakdown: {
      careerRelevance: 35,
      skillGapImpact: 23,
      currentSkillFit: 18,
      timeEfficiency: 9
    },
    whyReasons: [
      'Required for upcoming internship application deadlines',
      'Highlights your Python, SQL, and ML project outcomes clearly'
    ],
    metrics: {
      goalMatch: 92,
      gapImpact: 80,
      skillFit: 85,
      difficultyFit: 90
    }
  },
  {
    id: 'act-month-apply-intern',
    title: 'Apply to 3 High-Match AI / ML Internships',
    timeframe: 'month',
    priority: 'Medium',
    category: 'Opportunity',
    status: 'Not Started',
    progress: 0,
    skill: 'Communication',
    skillBoost: 3,
    whyNow: 'You already have an 89% match for the Generative AI Engineering Intern role. Applying to targeted matches beats spamming 100 cold listings.',
    impact: 'High',
    impactLabel: 'High Impact',
    estimatedTime: '2 days',
    expectedReadinessGain: 2,
    completed: false,
    inRoadmap: true,
    actionScore: 86,
    scoreBreakdown: {
      careerRelevance: 37,
      skillGapImpact: 22,
      currentSkillFit: 18,
      timeEfficiency: 9
    },
    whyReasons: [
      'Direct path toward your "Become Internship Ready" milestone',
      'Matches your 82% Python and Git workflow skills'
    ],
    metrics: {
      goalMatch: 96,
      gapImpact: 85,
      skillFit: 80,
      difficultyFit: 85
    }
  },
  // Quick Wins (10-30 min)
  {
    id: 'act-qw-github-link',
    title: 'Add GitHub & Live Demo links to all projects',
    timeframe: 'quickwin',
    priority: 'Low',
    category: 'Profile',
    status: 'Not Started',
    progress: 0,
    skill: 'Git/GitHub',
    skillBoost: 2,
    whyNow: 'Makes your projects verifiable with one click during resume reviews.',
    impact: 'Small',
    impactLabel: 'Small Impact',
    estimatedTime: '10 min',
    expectedReadinessGain: 1,
    completed: false,
    inRoadmap: false,
    actionScore: 78,
    scoreBreakdown: {
      careerRelevance: 28,
      skillGapImpact: 20,
      currentSkillFit: 20,
      timeEfficiency: 10
    },
    whyReasons: ['Takes 10 minutes and immediately improves profile completeness'],
    metrics: { goalMatch: 80, gapImpact: 65, skillFit: 95, difficultyFit: 98 }
  },
  {
    id: 'act-qw-readme',
    title: 'Complete project README for EcoLearn',
    timeframe: 'quickwin',
    priority: 'Medium',
    category: 'Profile',
    status: 'Not Started',
    progress: 0,
    skill: 'Communication',
    skillBoost: 2,
    whyNow: 'Documenting problem, architecture, and tech stack helps interviewers appreciate your work.',
    impact: 'Medium',
    impactLabel: 'Medium Impact',
    estimatedTime: '20 min',
    expectedReadinessGain: 1,
    completed: false,
    inRoadmap: false,
    actionScore: 80,
    scoreBreakdown: {
      careerRelevance: 30,
      skillGapImpact: 20,
      currentSkillFit: 20,
      timeEfficiency: 10
    },
    whyReasons: ['High visibility improvement on GitHub in 20 minutes'],
    metrics: { goalMatch: 84, gapImpact: 70, skillFit: 92, difficultyFit: 95 }
  },
  {
    id: 'act-qw-cert',
    title: 'Add your latest course certificate to Profile',
    timeframe: 'quickwin',
    priority: 'Low',
    category: 'Profile',
    status: 'Not Started',
    progress: 0,
    skill: 'Python',
    skillBoost: 1,
    whyNow: 'Keeps your verified credentials organized alongside your projects.',
    impact: 'Small',
    impactLabel: 'Small Impact',
    estimatedTime: '10 min',
    expectedReadinessGain: 1,
    completed: false,
    inRoadmap: false,
    actionScore: 74,
    scoreBreakdown: {
      careerRelevance: 26,
      skillGapImpact: 18,
      currentSkillFit: 20,
      timeEfficiency: 10
    },
    whyReasons: ['Quick profile completeness boost'],
    metrics: { goalMatch: 75, gapImpact: 60, skillFit: 95, difficultyFit: 98 }
  },
  {
    id: 'act-qw-skill-prof',
    title: 'Update skill proficiency levels after recent practice',
    timeframe: 'quickwin',
    priority: 'Low',
    category: 'Learn',
    status: 'Not Started',
    progress: 0,
    skill: 'Machine Learning',
    skillBoost: 2,
    whyNow: 'Ensures PRISM calculates your gap rankings and opportunity matches accurately.',
    impact: 'Small',
    impactLabel: 'Small Impact',
    estimatedTime: '15 min',
    expectedReadinessGain: 1,
    completed: false,
    inRoadmap: false,
    actionScore: 76,
    scoreBreakdown: {
      careerRelevance: 28,
      skillGapImpact: 18,
      currentSkillFit: 20,
      timeEfficiency: 10
    },
    whyReasons: ['Keeps your career GPS calibrated to your latest skills'],
    metrics: { goalMatch: 80, gapImpact: 68, skillFit: 95, difficultyFit: 98 }
  }
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-genai-intern',
    title: 'Generative AI Engineering Intern (Demo Listing)',
    organization: 'Sarvam Labs · Bengaluru / Remote',
    category: 'Internships',
    matchPercentage: 89,
    skills: [
      { name: 'Python', met: true },
      { name: 'LLMs', met: true },
      { name: 'Git/GitHub', met: true },
      { name: 'RAG', met: false }
    ],
    deadline: '15 October',
    rewardOrStipend: '₹15,000/month',
    location: 'Remote / Hybrid',
    whyMatch: 'Strong Python (82%), solid Git workflow, and active hands-on AI experimentation in EcoLearn.',
    whatMissing: 'Build 1 end-to-end RAG project (like AI Study Assistant) to demonstrate vector retrieval skills.'
  },
  {
    id: 'opp-ml-intern',
    title: 'Machine Learning Research Intern (Demo Listing)',
    organization: 'Quantiphi Analytics · Mumbai / Hybrid',
    category: 'Internships',
    matchPercentage: 76,
    skills: [
      { name: 'Python', met: true },
      { name: 'SQL', met: true },
      { name: 'Machine Learning', met: false },
      { name: 'Deep Learning', met: false }
    ],
    deadline: '24 October',
    rewardOrStipend: '₹20,000/month',
    location: 'Hybrid',
    whyMatch: 'Your Python and SQL data querying scores meet their baseline bar for data preprocessing.',
    whatMissing: 'Machine Learning score needs to reach 60%+ with a completed supervised classification project.'
  },
  {
    id: 'opp-hackathon-ai',
    title: 'National GenAI Campus Buildathon (Demo Listing)',
    organization: 'Devfolio & OpenAI Community',
    category: 'Hackathons',
    matchPercentage: 92,
    skills: [
      { name: 'Python', met: true },
      { name: 'React', met: true },
      { name: 'Generative AI', met: true },
      { name: 'Git/GitHub', met: true }
    ],
    deadline: '19 October',
    rewardOrStipend: '₹1,50,000 Prize Pool',
    location: 'Online · 48 Hours',
    whyMatch: 'Your combination of Python + React lets you build both the AI backend and a clean frontend demo.',
    whatMissing: 'You are ready to participate right now. Consider building the AI Study Assistant here.'
  },
  {
    id: 'opp-comp-kaggle',
    title: 'University Tabular ML Challenge (Demo Listing)',
    organization: 'Kaggle Campus Series',
    category: 'Competitions',
    matchPercentage: 84,
    skills: [
      { name: 'Python', met: true },
      { name: 'SQL', met: true },
      { name: 'Machine Learning', met: false }
    ],
    deadline: '30 October',
    rewardOrStipend: 'Top 50 Certificates + Mentorship',
    location: 'Online',
    whyMatch: 'Great low-risk competition to apply feature engineering and model evaluation as you learn ML.',
    whatMissing: 'Review cross-validation and gradient boosted trees before submitting.'
  },
  {
    id: 'opp-schol-ai',
    title: 'Undergraduate Tech Innovation Scholarship (Demo)',
    organization: 'National Innovation Foundation',
    category: 'Scholarships',
    matchPercentage: 86,
    skills: [
      { name: 'Python', met: true },
      { name: 'DSA', met: true },
      { name: 'Communication', met: true }
    ],
    deadline: '05 November',
    rewardOrStipend: '₹2,00,000 Grant',
    location: 'National · 3rd Year B.Tech',
    whyMatch: 'Your 3rd Year B.Tech standing and hackathon finalist background align well with their selection criteria.',
    whatMissing: 'Prepare a crisp statement of purpose highlighting your EcoLearn sustainability project.'
  },
  {
    id: 'opp-cert-dl',
    title: 'Machine Learning Specialization Financial Aid Track (Demo)',
    organization: 'DeepLearning.AI',
    category: 'Certifications',
    matchPercentage: 95,
    skills: [
      { name: 'Python', met: true },
      { name: 'Machine Learning', met: false }
    ],
    deadline: 'Rolling',
    rewardOrStipend: '100% Fee Waiver Eligible',
    location: 'Self-Paced Online',
    whyMatch: 'Directly targets your #1 skill gap (Supervised & Unsupervised ML) without costing anything.',
    whatMissing: 'Nothing missing — pair this course with your own GitHub project so it is not just a certificate.'
  }
];

export const INITIAL_ACTION_HISTORY: ActionHistory[] = [
  {
    id: 'hist-1',
    title: 'Completed DSA Arrays & Hashing module',
    period: 'Today',
    timestamp: '2 hours ago',
    category: 'Practice',
    impactNote: 'DSA +2%'
  },
  {
    id: 'hist-2',
    title: 'Added Expense Tracker to completed projects',
    period: 'Yesterday',
    timestamp: 'Yesterday',
    category: 'Build',
    impactNote: '+4% readiness'
  },
  {
    id: 'hist-3',
    title: 'Completed Python course & verified skills',
    period: 'This Week',
    timestamp: '3 days ago',
    category: 'Learn',
    impactNote: 'Python 82% (Strong)'
  },
  {
    id: 'hist-4',
    title: 'Added EcoLearn AI Quiz Module to roadmap',
    period: 'This Week',
    timestamp: '5 days ago',
    category: 'Profile',
    impactNote: 'Roadmap Stage 06'
  }
];

export const INITIAL_STUDENT: Student = {
  name: 'User',
  email: 'user@demo.edu',
  college: 'JECRC FOUNDATION',
  degree: 'B.Tech',
  branch: 'ARTIFICIAL INTELLIGENCE & DATA SCIENCE',
  year: '3rd Year',
  careerGoal: 'AI / ML Engineer',
  bio: '3rd-year B.Tech Artificial Intelligence & Data Science student at JECRC FOUNDATION. Strong in Python and web prototyping, currently focused on bridging classical Machine Learning and RAG engineering gaps.',
  interests: [
    'AI',
    'Web Development',
    'Data Science',
    'Hackathons',
    'Open Source'
  ],
  skills: INITIAL_SKILLS,
  projects: INITIAL_PROJECTS,
  certificates: INITIAL_CERTIFICATES,
  achievements: INITIAL_ACHIEVEMENTS,
  roadmap: INITIAL_ROADMAP,
  nextActions: INITIAL_NEXT_ACTIONS,
  dailyTasks: INITIAL_DAILY_TASKS,
  opportunities: INITIAL_OPPORTUNITIES,
  actionHistory: INITIAL_ACTION_HISTORY,
  dsaSolvedCount: 158,
  learningHoursTotal: 142,
  applicationsCount: 4,
  notificationsEnabled: true,
  weeklyDigestEnabled: true
};
