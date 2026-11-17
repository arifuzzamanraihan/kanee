// Every value below comes from Kaneeta Zahid's public LinkedIn profile.
export const profile = {
  name: "Kaneeta Zahid",
  firstName: "Kaneeta",
  headline:
    "Digital Ambassador Intern (NYLP) | McKinsey Forward Participant | Digital HR & AI Enthusiast | Aspire Leaders Program Alumna",
  headlineParts: [
    "Digital Ambassador Intern (NYLP)",
    "McKinsey Forward Participant",
    "Digital HR & AI Enthusiast",
    "Aspire Leaders Program Alumna",
  ],
  location: "Azad Kashmir, Pakistan",
  email: "kaneetazahid4@gmail.com",
  linkedin: "https://www.linkedin.com/in/kaneeta-zahid07/",
  linkedinLabel: "linkedin.com/in/kaneeta-zahid07",
  ebook: "https://bit.ly/4e2PHY0",
  tagline:
    "I studied how people work best together. Now I help bring young leaders together online.",
  roles: [
    "Digital HR & AI Enthusiast",
    "Digital Ambassador Intern at NYLP",
    "McKinsey Forward Participant",
    "Aspire Leaders Program Alumna",
  ],
  focus: [
    "Human Resources",
    "AI & Digital Tools",
    "Leadership & Youth Empowerment",
    "Business & Innovation",
    "Creative Problem Solving",
  ],
  followers: 1352,
  connections: 500,
}

export const about = {
  intro: [
    "I studied how people work best together. Now I help bring young leaders together online.",
    "As a Digital Ambassador at the National Youth Leadership Program, I connect with young changemakers and champion leadership opportunities. My foundation is a BS in Human Resource Management (2025) and the Aspire Leaders Program, an online leadership program founded by Harvard Business School faculty.",
  ],
  bringTitle: "What I bring:",
  bring: [
    "A people first mindset",
    "I guide people from confusion to confident decisions.",
    "I love exploring how AI can create better business solutions",
  ],
  outro:
    "I share what I'm learning about leadership, youth engagement, and AI. If you work in HR, youth programs I'd love to connect.",
}

export type TimelineItem = {
  title: string
  org: string
  meta: string
  place?: string
  note?: string
  bullets?: string[]
  skills?: string[]
  current?: boolean
}

export const work: TimelineItem[] = [
  {
    title: "Digital Ambassador Intern",
    org: "National Youth Leadership Programme (NYLP)",
    meta: "Current",
    note: "I connect with young changemakers and champion leadership opportunities.",
    current: true,
  },
  {
    title: "Forward Program Participant",
    org: "McKinsey.org Forward Program",
    meta: "Current",
    note: "Selected for the McKinsey.org Forward Program.",
    current: true,
  },
  {
    title: "Restaurant Supervisor",
    org: "Nur Tahara",
    meta: "Apr 2020 – Apr 2021 · 1 yr 1 mo",
    place: "Malaysia · On-site · Full-time",
    bullets: [
      "Looked after daily restaurant operations and made sure everything ran smoothly.",
      "Planned weekly stock and supplies.",
      "Checked in with staff, listened to their concerns, and supported them with tasks.",
      "Helped customers by handling their questions or issues in a polite way.",
      "Managed the cash counter and kept payments accurate.",
      "Coordinated orders so service stayed fast and organized.",
      "Report problems to the manager.",
    ],
    skills: ["Customer service", "Cash Handling"],
  },
]

export const education = [
  {
    school: "Mirpur University of Science & Technology (MUST)",
    degree: "Bachelor in Human Resource management",
    dates: "Nov 2021 – Aug 2025",
  },
  {
    school: "Aspire Institute",
    degree: "Aspire Leaders Program · Leadership",
    dates: "Oct 2025 – Dec 2025",
  },
  {
    school: "The Learners",
    degree: "Matric and FSC",
    dates: "May 2016 – May 2019",
  },
]

export const certifications = [
  {
    name: "Google Prompting Essentials",
    issuer: "Google",
    issued: "Aug 2026",
    id: "ZXTP8J3223NR",
    skills: ["Prompt Engineering", "AI Productivity"],
    description:
      "Earned the Google Prompting Essentials certificate through Coursera. This course helped me develop practical expertise in prompt engineering and strategic interaction with generative AI. Gained the ability to structure, refine, and evaluate prompts to unlock more effective AI-driven solutions, improve productivity, and support smarter decision-making in professional environments.",
  },
  {
    name: "Start Writing Prompts like a Pro",
    issuer: "Google",
    issued: "Aug 2026",
    id: "ONMOQLG9NAVU",
    skills: ["Prompt Writing", "Multimodal Prompting"],
    description:
      "Key learnings: Mastered the 5-part prompting framework: Task, Context, References, Evaluate, Iterate; learned to evaluate and refine AI outputs; gained skills in Prompt Engineering and AI Literacy.",
  },
]

export const skills = [
  "Critical Thinking",
  "Prompt Engineering",
  "AI Productivity",
  "AI Literacy",
  "Prompt Writing",
  "Multimodal Prompting",
  "Customer service",
  "Cash Handling",
  "Communication",
  "Inventory Management",
  "Employee support",
  "Active Listening",
  "Collaboration",
  "Performance management",
  "Conflict Resolution",
  "Customer Service",
  "Data entry",
  "MS excel",
  "HR Operations",
  "IBM SPSS",
  "Presentation Skills",
  "Team Leadership",
  "Management",
  "Professional Communication",
  "Human Resources (HR)",
  "Microsoft Office",
  "Team Building",
  "Canva",
]

export type Post = {
  summary: string
  reactions: number | null
  comments?: number
  featured?: boolean
}

export const posts: Post[] = [
  {
    summary:
      "Published first ebook 'The HR Prompt-to-Practice Playbook'. Free copy available.",
    reactions: 14,
    comments: 26,
    featured: true,
  },
  {
    summary:
      "Thrilled to be part of NYLP Digital IMUN 2026 as an Ambassador. Thanks to Khoja Sheraaz Ali and NYLP - Youth Initiative.",
    reactions: 17,
    comments: 6,
  },
  {
    summary:
      "Participated in Global Summit on Digital Literacy & Leadership 2026 organised by NYLP - Youth Initiative (with PISA, Digital Gravitas, Qalmi Official).",
    reactions: 18,
    comments: 8,
  },
  {
    summary:
      "Serving as Global Digital Ambassador for International Sustainable Tourism Conference (ISTC) 4.0 – 2026.",
    reactions: 12,
    comments: 8,
  },
  {
    summary:
      "Selected as Summit Delegate for Global Digital Literacy & Leadership Summit 2026.",
    reactions: 9,
    comments: 6,
  },
  {
    summary: "Selected as Digital Ambassador Intern at NYLP.",
    reactions: 7,
    comments: 6,
  },
  {
    summary: "30-Days Claude Challenge: motion graphic 'LIMITS → POSSIBILITIES'.",
    reactions: 3,
    comments: 2,
  },
  {
    summary: "Selected for McKinsey.org Forward Program.",
    reactions: 5,
    comments: 4,
  },
  {
    summary: "McKinsey Forward Learning webinar with Jonathan Steinbach.",
    reactions: 3,
  },
  {
    summary: "Attended HR Metrics session by PIPD (Zeeshan Subhan Bandesha).",
    reactions: null,
  },
]
