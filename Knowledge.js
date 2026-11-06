// Offline "brain" for the chatbot. Works with no server.
// It reads your info from data.js, so editing data.js updates the answers too.
const norm = q => q.toLowerCase().replace(/[^a-z0-9+#.\s]/g, " ").replace(/\s+/g, " ").trim();
const pick = a => a[Math.floor(Math.random() * a.length)];
const strip = s => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const GLOSSARY = {
  react: "React is a JavaScript library for building user interfaces from reusable components. Arpit used it for the frontend of his Resume Analysis App.",
  flask: "Flask is a lightweight Python framework for building web backends and APIs. Arpit's Resume Analysis App uses Flask for its backend.",
  python: "Python is a beginner-friendly programming language used for web backends, automation, data and AI. Arpit used it for his Hotel Reservation System and the Flask backend.",
  node: "Node.js lets you run JavaScript outside the browser, for servers and tools. Arpit's GitHub Analyser & Enhancer runs on it.",
  html: "HTML is the markup language that gives a web page its structure: headings, paragraphs, links, images and forms.",
  css: "CSS controls how a web page looks: colours, fonts, spacing and layout, including responsive layouts for phones.",
  javascript: "JavaScript is the language that makes web pages interactive. This whole portfolio, including the games and this chatbot, is written in it.",
  api: "An API is a way for programs to talk to each other. For example, Arpit's GitHub Analyser uses the GitHub API to fetch repository data.",
  git: "Git is a version-control tool that tracks changes to code, so you can go back in time and collaborate safely.",
  github: "GitHub is a website that hosts Git repositories, so developers can share code and work together. Arpit's projects are all there.",
  vercel: "Vercel is a hosting platform that deploys websites straight from GitHub. This portfolio is meant to be hosted on it.",
  frontend: "Frontend development is building the part of a website or app that users see and click: layouts, styling and interactions. It's Arpit's focus.",
  backend: "The backend is the behind-the-scenes part of an app: servers, databases and logic. Arpit has worked on backends with Flask and Node.js.",
  oop: "Object-oriented programming organises code into classes and objects. Arpit's Hotel Reservation System is built this way, with Room and Reservation classes.",
  json: "JSON is a simple text format for storing and sending data. Arpit's Hotel Reservation System saves its data in a JSON file.",
  genai: "Generative AI is AI that creates things like text or images. Arpit's Resume Analysis App was built for a GenAI hackathon.",
  ai: "AI (artificial intelligence) is software that learns or reasons in ways that look intelligent. Arpit's Resume Analysis App was built for a GenAI hackathon.",
  ecs: "ECS here means Electronics & Computer Science, the course Arpit is in. He's in his third year.",
  tailwind: "Tailwind CSS is a styling toolkit that uses small utility classes directly in your HTML.",
  typescript: "TypeScript is JavaScript with types, which helps catch bugs before the code runs."
};
GLOSSARY.nodejs = GLOSSARY.node; GLOSSARY.js = GLOSSARY.javascript; GLOSSARY.fullstack =
  "Full-stack means working on both the frontend (what users see) and the backend (servers and data).";

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs. 🐛",
  "There are 10 kinds of people: those who understand binary and those who don't.",
  "A CSS developer walks into a bar and immediately tries to centre everything. 😅",
  "Why did the developer go broke? He used up all his cache.",
  "I would tell you a UDP joke, but you might not get it."
];

const projectText = p =>
  `${p.title} (${p.cat})\n${p.desc}\nTech: ${p.tags.join(", ")}` +
  (p.code ? `\nCode: ${p.code}` : "") + (p.live ? `\nLive: ${p.live}` : "");
const mail = () => `Email Arpit at ${EMAIL}, or message him on LinkedIn: ${LINKEDIN}`;
const NOT_SHARED = "Arpit hasn't shared that on this site. You can ask him directly: " ;

// Each intent: keywords (multi-word phrases score higher) and an answer.
// Earlier intents win ties, so more specific ones come first.
const INTENTS = [
  {k:["hi","hello","hey","hii","hola","namaste","yo","good morning","good evening","good afternoon"], short:true,
    a:()=>pick(["Hey! 👋","Hello! 😊","Hi there! 🙌"])+" I'm Arpit's assistant. Ask about his skills, projects, studies or how to contact him. Or try a joke!"},
  {k:["thanks","thank","thx","thank you","appreciate","cool","nice","great","awesome"], short:true, a:()=>"You're welcome! 😊 Anything else you'd like to know?"},
  {k:["bye","goodbye","cya","see you","later","good night"], short:true, a:()=>"Bye! 👋 Thanks for visiting Arpit's portfolio."},
  {k:["how are you","how r u","whats up","what s up","how is it going"], a:()=>"Doing great, thanks for asking! 😄 How can I help you today?"},
  {k:["joke","funny","laugh","humor","humour","make me laugh"], a:()=>pick(JOKES)},
  {k:["hire","hiring","internship","intern","opening","available","availability","freelance","collaborate","collaboration","opportunity","recruit","work with","open to work"],
    a:()=>"Yes! Arpit is a third-year student looking for internships and collaborations. "+mail()},
  {k:["contact","email","mail","reach","message","connect","phone","number","get in touch","call"], a:()=>mail()},
  {k:["github","repo","repos","repository","repositories","source code","git"], a:()=>"Arpit's code is on GitHub: "+GITHUB},
  {k:["linkedin"], a:()=>"Arpit's LinkedIn: "+LINKEDIN},
  {k:["resume","cv","curriculum"], a:()=>"There's no downloadable resume on this site yet. Ask Arpit for it by email: "+EMAIL},
  {k:["study","studying","college","student","degree","ecs","education","branch","course","university","graduate","graduation","semester","third year","3rd year","year"],
    a:()=>"Arpit is a third-year Electronics & Computer Science (ECS) student."},
  {k:["skill","skills","tech","technologies","tech stack","stack","languages","tools","expertise","proficient","good at","know"],
    a:()=>"Arpit works with: "+skills.join(", ")+". His focus is frontend development, and he has also built backends with Flask and Node.js."},
  {k:["project","projects","built","build","made","created","developed","apps","portfolio work","your work","his work"],
    a:()=>"Arpit has built "+projects.length+" projects:\n"+projects.map(p=>"• "+p.title+" – "+p.desc).join("\n")+"\n\nAsk me about any of them for details."},
  {k:["this website","this site","how was this","made this","built this","website built","vercel","deploy","deployed","theme","design"],
    a:()=>"This site is built with plain HTML, CSS and JavaScript (no framework), split into separate files, and hosted on Vercel. It includes a project filter, two games and this chatbot."},
  {k:["game","games","play","fun","bored","tic","memory","tic tac toe"], a:()=>"Open the Play section for Tic-Tac-Toe (vs the computer) and Memory Match. 🎮"},
  {k:["where","location","city","live","based","country","address","from"], a:()=>NOT_SHARED+EMAIL},
  {k:["age","old","hobby","hobbies","family","married","girlfriend","boyfriend","birthday","salary","ctc","pay","expected","religion","marks","cgpa","grades","percentage"], a:()=>NOT_SHARED+EMAIL},
  {k:["strength","strengths","why","best","unique","special","why hire","why should"],
    a:()=>"Arpit is a third-year student who already ships working projects: a React + Flask app, a Node.js tool using the GitHub API, and a Python system. He builds responsive, accessible interfaces and keeps learning. See his GitHub: "+GITHUB},
  {k:["goal","goals","future","plan","plans","dream","aspire","learning","learn","next"],
    a:()=>"Arpit wants to keep building and learning, and is looking for internships and collaborations in frontend development."},
  {k:["role","job","profile","profession","designation","what does arpit do","what do you do","does he do"],
    a:()=>"Arpit is a frontend developer and a third-year ECS student. He builds fast, responsive interfaces."},
  {k:["who are you","are you real","are you human","robot","chatbot","bot","assistant","claude","gpt"],
    a:()=>"I'm a small assistant built into this site. I answer questions about Arpit and some general tech topics."},
  {k:["who is arpit","who is he","who is arpit anand singh","arpit","about arpit","about him","about you","introduce","intro","yourself","who","name","tell me about"],
    a:()=>"Arpit Anand Singh is a third-year Electronics & Computer Science student and frontend developer. He has built a resume analysis app, a GitHub repo analyser and a hotel reservation system. Ask me about his skills, projects or how to contact him."},
  {k:["help","options","menu","what can i ask","can you do","capabilities","commands"],
    a:()=>"You can ask me about:\n• Arpit's skills, projects, studies\n• Details of a project (e.g. \"hotel project\")\n• Contact, GitHub, LinkedIn, hiring\n• Terms like React, Flask or API\n• A joke 😄"}
];

function score(q, tokens, kw){
  if (kw.includes(" ")) return q.includes(kw) ? 2 : 0;
  return tokens.some(t => t === kw || (kw.length >= 5 && t.startsWith(kw))) ? 1 : 0;
}

function projectMatch(q, tokens){
  let best = null, top = 0;
  for (const p of projects){
    let s = 0;
    const titleWords = norm(p.title).split(" ").filter(w => w.length > 3 && !["github","system","resume"].includes(w));
    titleWords.forEach(w => { if (tokens.includes(w)) s += 2; });
    (p.aka || []).forEach(a => { if (a.includes(" ") ? q.includes(a) : tokens.includes(a)) s += 2; });
    if (s > top){ top = s; best = p; }
  }
  return top >= 2 ? best : null;
}

function techMatch(tokens){
  const found = new Set();
  for (const p of projects) for (const tag of p.tags){
    const t = strip(tag);
    if (tokens.some(w => { const x = strip(w); return x.length >= 3 && (x === t || (t.endsWith("js") && t.slice(0, -2) === x)); })) found.add(tag);
  }
  return [...found];
}

function localAnswer(raw){
  const q = norm(raw), tokens = q.split(" ").filter(Boolean);
  if (!tokens.length) return "Type a question and I'll do my best! 🙂";

  // 1. "What is X?" style questions
  if (/^(what|whats|what s|explain|define|meaning of|tell me about|how does|why)\b/.test(q)){
    const term = tokens.find(w => GLOSSARY[strip(w)] && w !== "ai" || (w === "ai" && /\bwhat (is|s) ai\b|explain ai|define ai/.test(q)));
    if (term && !/\b(your|his|arpit|you)\b/.test(q)) return GLOSSARY[strip(term)];
  }
  // 2. A specific project
  const p = projectMatch(q, tokens);
  if (p) return projectText(p);
  // 3. A technology Arpit used
  const tech = techMatch(tokens);
  if (tech.length){
    const t = tech[0];
    const list = projects.filter(x => x.tags.includes(t)).map(x => x.title);
    return `Yes! Arpit has used ${t} in: ${list.join(", ")}.`;
  }
  // 4. Everything else: best-scoring intent
  let best = null, top = 0;
  for (const it of INTENTS){
    if (it.short && tokens.length > 4) continue;
    const s = it.k.reduce((n, kw) => n + score(q, tokens, kw), 0);
    if (s > top){ top = s; best = it; }
  }
  if (best) return best.a();
  // 5. Single glossary word, e.g. just "react"
  const g = tokens.find(w => GLOSSARY[strip(w)]);
  if (g) return GLOSSARY[strip(g)];
  return "I don't have a good answer to that one yet. I can talk about Arpit's skills, projects, studies and contact details, explain terms like React or Flask, or tell a joke. For anything else, "+mail().replace(/^E/, "e");
}