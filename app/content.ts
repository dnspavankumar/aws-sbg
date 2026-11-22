// All club information lives here so it can be updated without touching layout code.
//
// Photos: drop an image into /public/team/ (e.g. /public/team/ruthwik.jpg) and set `photo: "/team/ruthwik.jpg"`.
// Until a photo is set, an oval placeholder with the member's initials is shown.
//
// Links: leave a URL as "" until the official one is confirmed. Empty links render as clearly marked
// "coming soon" placeholders instead of broken or invented URLs.

export const club = {
  name: "AWS Student Builder Group – BVRIT",
  tagline: "Learn. Build. Innovate.",
  about: [
    "A student-driven technology community at BVRIT focused on cloud computing, AWS technologies, hands-on learning, open-source contributions and collaborative project building.",
    "We aim to create an environment where students can explore new technologies, develop practical skills, collaborate on real-world projects and grow as future technology professionals.",
  ],
};

export const links = {
  joinForm: "", // Official recruitment Google Form URL
  instagram: "",
  linkedin: "",
  github: "",
};

export type Person = { name: string; role: string; photo?: string };

export const team: (Person & { featured?: boolean })[] = [
  { name: "Ruthwik", role: "President", featured: true },
  { name: "D.N.S. Pavan Kumar", role: "Technical Lead" },
  { name: "Shyam", role: "Marketing & Social Media Lead" },
  { name: "G. Rishikesh", role: "Logistics & Operations Lead" },
  { name: "Pavani", role: "Creative Lead" },
  { name: "Sanjana", role: "PR & Sponsorship Lead" },
];

export const mentor: Person & { department: string; description: string } = {
  name: "L. Pallavi Ma'am",
  role: "Associate Head of Department (Associate HOD)",
  department: "Computer Science Department, BVRIT",
  description: "Guiding our community towards technical growth, collaboration and meaningful learning experiences.",
};

export type ObjectiveIcon = "cloud" | "build" | "collab" | "career";

export const objectives: { title: string; description: string; icon: ObjectiveIcon }[] = [
  { title: "Cloud Learning", description: "Build practical knowledge of AWS and cloud computing.", icon: "cloud" },
  { title: "Hands-on Building", description: "Encourage students to work on real-world projects and technical challenges.", icon: "build" },
  { title: "Open Source & Collaboration", description: "Promote open-source contributions, teamwork and knowledge sharing.", icon: "collab" },
  { title: "Career Development", description: "Help students develop industry-relevant skills and prepare for internships and placement opportunities.", icon: "career" },
];

export const vision =
  "Our vision is to create a community of confident student builders who turn ideas into real-world solutions through cloud technology, collaboration and continuous learning — while helping students become industry-ready and better prepared for internships and placements.";

export const featuredEvent = {
  title: "Club Inauguration & Cloud Workshop",
  statuses: ["Upcoming", "Tentative"],
  when: "Tentatively December 2026",
  theme: "Cloud Computing & AWS – From Fundamentals to Hands-on Building.",
  details: [
    { label: "Date", value: "To be announced" },
    { label: "Proposed month", value: "December 2026" },
    { label: "Duration", value: "2 Days" },
    { label: "Format", value: "In-person workshop" },
    { label: "Venue", value: "To be announced" },
    { label: "Expected attendance", value: "20–30 students" },
    { label: "Organised by", value: "AWS Student Builder Group – BVRIT" },
    { label: "Faculty mentor", value: "L. Pallavi Ma'am" },
  ],
  days: [
    {
      label: "Day 1",
      title: "Club Inauguration & Cloud Fundamentals",
      theme: "Understanding the Cloud, the Community and the Vision.",
      sessions: [
        "Club inauguration and introduction",
        "Introduction to AWS Student Builder Group",
        "Vision, objectives and upcoming community activities",
        "Introduction to cloud computing",
        "How cloud services work",
        "Introduction to AWS and its global infrastructure",
        "Overview of EC2, S3, RDS, IAM and Lambda",
        "Open-source contributions and collaborative project building",
        "Q&A and closing",
      ],
    },
    {
      label: "Day 2",
      title: "Hands-on AWS Workshop",
      theme: "Learn by Building – Exploring AWS in Practice.",
      sessions: [
        "AWS Management Console introduction",
        "AWS account setup and navigation",
        "Amazon EC2: Launching a virtual server and hosting a simple application",
        "Amazon S3: Understanding cloud storage and uploading objects",
        "Amazon RDS: Introduction to managed relational databases",
        "Understanding application deployment and cloud architecture",
        "Q&A and closing",
      ],
    },
  ],
};

export const roadmap = [
  { when: "December 2026", activity: "Club Inauguration & Cloud Workshop" },
  { when: "Upcoming Months", activity: "Technical workshops and learning sessions" },
  { when: "Upcoming Semesters", activity: "Hackathons and collaborative project building" },
  { when: "Throughout the Year", activity: "Cloud challenges, open-source contributions and community activities" },
];

export const departments = [
  "Event Management",
  "Operations",
  "Sponsorship",
  "Logistics",
  "Media (Video Editors)",
  "Technical",
  "Marketing",
  "Design",
];
