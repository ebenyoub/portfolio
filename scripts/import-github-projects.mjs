#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const requireFromBackend = createRequire(path.join(rootDir, "portfolio_backend", "package.json"));
const mysql = requireFromBackend("mysql2/promise");
const dotenv = requireFromBackend("dotenv");

dotenv.config({ path: path.join(rootDir, "portfolio_backend", ".env") });

const args = process.argv.slice(2);

const getArgValue = (name) => {
  const index = args.indexOf(name);
  if (index === -1) return null;

  return args[index + 1] ?? null;
};

const hasFlag = (name) => args.includes(name);

const githubOwner = getArgValue("--account") ?? getArgValue("--owner") ?? process.env.GITHUB_USERNAME ?? process.env.GITHUB_OWNER;
const githubToken = process.env.GITHUB_TOKEN ?? null;
const applyChanges = hasFlag("--apply");
const reportDir = path.resolve(rootDir, getArgValue("--report-dir") ?? "reports");
const cacheDirArg = getArgValue("--cache-dir");
const cacheDir = cacheDirArg
  ? path.resolve(process.cwd(), cacheDirArg)
  : null;
const placeholderImageUrl = "/project-images/github-project-placeholder.svg";
const markerStart = "-- BEGIN AUTO-GENERATED GITHUB PROJECT IMPORT";
const markerEnd = "-- END AUTO-GENERATED GITHUB PROJECT IMPORT";

const knownProjects = {
  libft: {
    title: "Libft",
    patterns: [/^libft$/i, /(^|[-_])libft($|[-_])/i],
    description: "Bibliotheque de fonctions C usuelles recreees dans le cadre du cursus 42.",
    context: "Projet du cursus 42 identifie par le nom du depot et son code C.",
    objective: "Recreer des fonctions standard de la libc et organiser une bibliotheque C reutilisable.",
    learned_skills: ["C", "Gestion de la memoire", "Makefile", "Tests unitaires"],
    challenges: "Maintenir un comportement coherent avec les fonctions standard tout en gerant les allocations et les cas limites.",
    solution: "Le depot est structure autour de fonctions C et d'un Makefile, ce qui permet une compilation reproductible de la bibliotheque.",
  },
  ft_printf: {
    title: "ft_printf",
    patterns: [/ft[-_]?printf/i, /printf/i],
    description: "Reimplementation partielle de printf en C.",
    context: "Projet du cursus 42 identifie par le nom du depot et son code C.",
    objective: "Reproduire le comportement attendu de printf pour les conversions gerees par le projet.",
    learned_skills: ["C", "Fonctions variadiques", "Parsing", "Formatage de chaine"],
    challenges: "Traiter les formats et conversions sans perdre en lisibilite ni en robustesse.",
    solution: "L'implementation s'appuie sur un parsing explicite des formats et des fonctions specialisees par conversion.",
  },
  get_next_line: {
    title: "Get Next Line",
    patterns: [/get[-_]?next[-_]?line/i, /^gnl$/i],
    description: "Fonction C permettant de lire un fichier ligne par ligne.",
    context: "Projet du cursus 42 identifie par le nom du depot et son code C.",
    objective: "Lire progressivement un descripteur de fichier et retourner la prochaine ligne disponible.",
    learned_skills: ["C", "Descripteurs de fichiers", "Buffers", "Gestion de la memoire"],
    challenges: "Conserver l'etat de lecture entre deux appels et gerer correctement les fins de fichier.",
    solution: "Le projet isole la gestion du buffer et du stockage intermediaire pour restituer une ligne complete a chaque appel.",
  },
  born2beroot: {
    title: "Born2beroot",
    patterns: [/born[-_]?2[-_]?be[-_]?root/i, /born2beroot/i],
    description: "Configuration d'un environnement serveur Linux securise.",
    context: "Projet d'administration systeme du cursus 42 identifie par le nom du depot.",
    objective: "Installer, configurer et documenter une machine virtuelle Linux avec des regles de securite.",
    learned_skills: ["Linux", "Virtualisation", "Securite systeme", "Shell"],
    challenges: "Appliquer une configuration systeme stricte et verifier les services attendus.",
    solution: "Le depot sert de support de documentation et de suivi pour la configuration systeme realisee.",
  },
  push_swap: {
    title: "Push_swap",
    patterns: [/push[-_]?swap/i],
    description: "Algorithme de tri en C avec un jeu d'instructions limite.",
    context: "Projet algorithmique du cursus 42 identifie par le nom du depot et son code C.",
    objective: "Trier une pile d'entiers avec un nombre reduit d'operations autorisees.",
    learned_skills: ["C", "Algorithmique", "Structures de donnees", "Optimisation"],
    challenges: "Reduire le nombre d'operations tout en couvrant les cas limites d'entree.",
    solution: "Le projet combine parsing, validation des donnees et strategie de tri adaptee aux contraintes du sujet.",
  },
  pipex: {
    title: "Pipex",
    patterns: [/pipex/i],
    description: "Reproduction simplifiee du fonctionnement des pipes shell en C.",
    context: "Projet Unix du cursus 42 identifie par le nom du depot et son code C.",
    objective: "Executer des commandes en chaine avec redirections et communication par pipe.",
    learned_skills: ["C", "Processus Unix", "Pipes", "Redirections"],
    challenges: "Coordonner fork, execve, pipe et gestion d'erreurs sans fuite de descripteurs.",
    solution: "Le code separe la resolution des commandes, la creation des pipes et l'execution des processus enfants.",
  },
  philosophers: {
    title: "Philosophers",
    patterns: [/philosophers?/i, /^philo$/i],
    description: "Simulation concurrente du probleme des philosophes en C.",
    context: "Projet de programmation concurrente du cursus 42 identifie par le nom du depot et son code C.",
    objective: "Simuler plusieurs philosophes partageant des ressources avec des contraintes de temps.",
    learned_skills: ["C", "Threads", "Mutex", "Synchronisation"],
    challenges: "Eviter les interblocages et proteger les donnees partagees.",
    solution: "Le projet s'appuie sur une synchronisation explicite des ressources et un suivi des temps d'action.",
  },
  minishell: {
    title: "Minishell",
    patterns: [/mini[-_]?shell/i],
    description: "Shell Unix minimal implemente en C.",
    context: "Projet systeme du cursus 42 identifie par le nom du depot et son code C.",
    objective: "Construire un interpreteur de commandes avec parsing, redirections, pipes et commandes internes.",
    learned_skills: ["C", "Parsing", "Processus Unix", "Signaux"],
    challenges: "Parser correctement les entrees utilisateur et reproduire les comportements shell attendus.",
    solution: "L'architecture separe les etapes de parsing, d'expansion et d'execution des commandes.",
  },
  cub3d: {
    title: "Cub3d",
    patterns: [/cub3d/i, /cube3d/i],
    description: "Moteur de rendu 3D par raycasting en C.",
    context: "Projet graphique du cursus 42 identifie par le nom du depot et son code C.",
    objective: "Afficher une vue 3D a partir d'une carte 2D en utilisant le raycasting.",
    learned_skills: ["C", "Raycasting", "MiniLibX", "Gestion de la memoire"],
    challenges: "Calculer les distances, collisions et textures en conservant un rendu stable.",
    solution: "Le projet combine parsing de carte, boucle de rendu et calculs de raycasting.",
  },
  netpractice: {
    title: "NetPractice",
    patterns: [/net[-_]?practice/i],
    description: "Exercices de configuration reseau et d'adressage IP.",
    context: "Projet reseau du cursus 42 identifie par le nom du depot.",
    objective: "Resoudre des configurations reseau en appliquant les notions d'adressage, masques et routage.",
    learned_skills: ["Reseau", "TCP/IP", "Sous-reseaux", "Routage"],
    challenges: "Verifier la coherence des plages IP, passerelles et routes.",
    solution: "Le depot documente les configurations et corrections liees aux exercices reseau.",
  },
  inception: {
    title: "Inception",
    patterns: [/inception/i],
    description: "Infrastructure Docker Compose composee de plusieurs services.",
    context: "Projet DevOps du cursus 42 identifie par le nom du depot et ses fichiers Docker.",
    objective: "Construire une infrastructure conteneurisee reproductible avec Docker Compose.",
    learned_skills: ["Docker", "Docker Compose", "Linux", "Administration de services"],
    challenges: "Orchestrer plusieurs services avec volumes, reseaux et variables d'environnement.",
    solution: "L'architecture repose sur des Dockerfiles et un fichier Compose pour separer les services.",
  },
  webserv: {
    title: "Webserv",
    patterns: [/webserv/i],
    description: "Serveur HTTP implemente en C++.",
    context: "Projet reseau du cursus 42 identifie par le nom du depot et son code C++.",
    objective: "Construire un serveur HTTP compatible avec les comportements attendus par le sujet.",
    learned_skills: ["C++", "HTTP", "Sockets", "Parsing"],
    challenges: "Gerer les connexions, requetes, reponses et fichiers de configuration.",
    solution: "Le projet structure la gestion reseau, le parsing HTTP et la generation des reponses.",
  },
  ft_irc: {
    title: "IRC",
    patterns: [/ft[-_]?irc/i, /^irc$/i],
    description: "Serveur IRC implemente en C++.",
    context: "Projet reseau du cursus 42 identifie par le nom du depot et son code C++.",
    objective: "Implementer un serveur IRC capable de gerer des clients, canaux et messages.",
    learned_skills: ["C++", "Sockets", "Protocole IRC", "Programmation reseau"],
    challenges: "Maintenir l'etat des connexions et appliquer correctement les commandes du protocole.",
    solution: "Le code separe la gestion des clients, des canaux et des commandes du protocole IRC.",
  },
};

const repositoryProfiles = {
  retrospective_backend: {
    title: "Retrospective Backend",
    description: "API REST TypeScript pour une application de retrospective, avec authentification, gestion de profil, recuperation de mot de passe et sessions par code.",
    tech_stack: ["TypeScript", "Express", "MySQL", "JWT", "Socket.IO", "Nodemailer", "Winston"],
    context: "Backend d'une application de retrospective analyse a partir des routes Express, des controleurs d'authentification et des controleurs de session du depot.",
    objective: "Fournir une API pour inscrire, connecter et authentifier les utilisateurs, gerer les profils et creer ou rejoindre des sessions de retrospective.",
    learned_skills: ["API REST Express", "Authentification JWT", "MySQL2", "Gestion de sessions", "Envoi d'emails", "Journalisation applicative"],
    challenges: "Coordonner l'authentification, les sessions courtes par code, la persistance MySQL et les retours d'erreurs de l'API.",
    solution: "Le serveur separe les routes d'authentification, les controleurs de session, le middleware JWT et les utilitaires de logs/email.",
  },
  retrospective_frontend: {
    title: "Retrospective Frontend",
    description: "Frontend React/TypeScript pour une application de retrospective, avec pages d'authentification, profil et gestion de sessions.",
    tech_stack: ["React", "TypeScript", "Vite", "React Router", "Tailwind CSS", "Socket.IO Client", "React Hook Form", "Styled Components"],
    context: "Interface frontend associee au projet de retrospective, analysee a partir des routes React, pages d'authentification, contexte utilisateur et pages de session.",
    objective: "Permettre aux utilisateurs de s'inscrire, se connecter, consulter leur profil et acceder aux sessions de retrospective.",
    learned_skills: ["React Router", "Context API", "Formulaires React", "Integration API", "Interface TypeScript", "Temps reel avec Socket.IO"],
    challenges: "Organiser les routes privees, l'etat d'authentification, les notifications et l'acces aux sessions depuis une interface React.",
    solution: "Le frontend regroupe les providers d'authentification et de notifications autour d'un routage React avec pages dediees aux workflows utilisateur.",
  },
  booking_room: {
    title: "Booking Room",
    description: "Application de reservation de salles avec frontend React/TypeScript et backend PHP organise autour de controleurs, modeles et routeur dynamique.",
    tech_stack: ["React", "TypeScript", "Vite", "PHP", "React Router", "Tailwind CSS", "Zod"],
    context: "Projet full-stack analyse a partir du frontend React, du routeur PHP et des controleurs utilisateur, salle et reservation.",
    objective: "Proposer une interface de consultation et de gestion de reservation avec une API PHP cote serveur.",
    learned_skills: ["React Router", "Validation Zod", "API PHP", "Architecture MVC simple", "Routing backend", "Separation frontend/backend"],
    challenges: "Faire cohabiter un frontend Vite et une API PHP locale avec des routes et modeles dedies.",
    solution: "Le projet separe les pages React, les composants UI et un backend PHP avec routeur dynamique, controleurs et modeles.",
  },
  atelier_dein: {
    title: "Atelier Dein",
    description: "Application PHP MVC de gestion de medias, utilisateurs et emprunts, avec espace d'administration et base MySQL.",
    tech_stack: ["PHP", "MySQL", "MVC", "PDO", "HTML", "CSS", "JavaScript"],
    context: "Application PHP analysee a partir des controleurs admin/media/emprunt, des modeles, du routeur et des scripts SQL de medias.",
    objective: "Gerer un catalogue de livres, films et jeux, les utilisateurs, les genres et les emprunts de medias.",
    learned_skills: ["Architecture MVC", "Routing PHP", "PDO/MySQL", "Authentification", "CRUD admin", "Gestion d'uploads"],
    challenges: "Structurer une application PHP avec plusieurs entites metier, droits d'administration, emprunts et relations de genres.",
    solution: "Le code organise les responsabilites en controleurs, modeles, vues, helpers et scripts SQL d'initialisation.",
  },
};

const technicalTopicHints = new Set([
  "api",
  "backend",
  "cli",
  "docker",
  "express",
  "frontend",
  "fullstack",
  "mysql",
  "node",
  "react",
  "typescript",
  "vite",
]);

const ignoredNamePatterns = [
  /(^|[-_])test(s)?($|[-_])/i,
  /^test/i,
  /(^|[-_])tmp($|[-_])/i,
  /(^|[-_])sandbox($|[-_])/i,
  /hello[-_]?world/i,
  /(^|[-_])draft($|[-_])/i,
  /(^|[-_])piscine($|[-_])/i,
  /(^|[-_])exam($|[-_])/i,
  /^runtrack\d*$/i,
  /^ranktrack\d*$/i,
  /^classes[-_]?php$/i,
  /^bbt$/i,
  /^memory$/i,
  /^fansite$/i,
  /^welcome[-_]?to[-_]?docker$/i,
  /portfolio/i,
];

const defaultDisplaySettings = {
  show_cover: true,
  show_gallery: false,
  show_presentation: true,
  show_context: true,
  show_objective: true,
  show_challenges: true,
  show_solution: true,
  show_learned_skills: true,
};

const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

const readJsonIfExists = async (filePath) => {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return null;
  }
};

const readTextIfExists = async (filePath) => {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
};

const cacheFile = (repo, suffix) => cacheDir ? path.join(cacheDir, `${repo.name}-${suffix}`) : null;

const normalizeText = (value) => value
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]/g, "");

const normalizeGithubUrl = (value) => {
  if (!value) return "";

  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`.replace(/\/$/, "").toLowerCase();
  } catch {
    return value.trim().replace(/\/$/, "").toLowerCase();
  }
};

const toSqlString = (value) => {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "''")}'`;
};

const toSqlJson = (value) => {
  if (value === null || value === undefined) return "NULL";
  return `CAST(${toSqlString(JSON.stringify(value))} AS JSON)`;
};

const cleanNullableText = (value) => {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/\s+/g, " ").trim();
  return cleaned.length > 0 ? cleaned : null;
};

const truncate = (value, max) => {
  if (!value || value.length <= max) return value;
  return `${value.slice(0, max - 3).trim()}...`;
};

const isHttpUrl = (value) => {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const stripMarkdown = (value) => value
  .replace(/```[\s\S]*?```/g, " ")
  .replace(/`([^`]+)`/g, "$1")
  .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
  .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
  .replace(/^#{1,6}\s+/gm, "")
  .replace(/^[-*+]\s+/gm, "")
  .replace(/\s+/g, " ")
  .trim();

const firstReadmeSentence = (readme) => {
  const cleaned = stripMarkdown(readme);
  if (!cleaned) return null;

  const sentence = cleaned.split(/(?<=[.!?])\s+/)[0] ?? cleaned;
  return truncate(sentence, 300);
};

const canonicalProjectKey = (name) => {
  const normalized = normalizeText(name);
  const raw = name.toLowerCase();

  for (const [key, definition] of Object.entries(knownProjects)) {
    if (definition.patterns.some((pattern) => pattern.test(raw) || pattern.test(normalized))) {
      return key;
    }
  }

  return normalized;
};

const getKnownDefinition = (repoName) => knownProjects[canonicalProjectKey(repoName)] ?? null;

const getRepositoryProfile = (repoName) => repositoryProfiles[repoName.toLowerCase().replace(/-/g, "_")] ?? null;

const githubFetch = async (url, options = {}) => {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-github-importer",
    ...options.headers,
  };

  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 403 && response.headers.get("x-ratelimit-remaining") === "0") {
    const reset = Number(response.headers.get("x-ratelimit-reset")) * 1000;
    const waitMs = Math.max(reset - Date.now(), 1000);
    throw new Error(`GitHub API rate limit reached. Retry after ${Math.ceil(waitMs / 1000)}s or provide GITHUB_TOKEN.`);
  }

  if (response.status === 404) return null;

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API error ${response.status} for ${url}: ${body.slice(0, 300)}`);
  }

  return response;
};

const fetchJson = async (url) => {
  const response = await githubFetch(url);
  if (!response) return null;
  return response.json();
};

const parseNextLink = (linkHeader) => {
  if (!linkHeader) return null;

  const links = linkHeader.split(",").map((part) => part.trim());
  const next = links.find((part) => part.includes('rel="next"'));
  if (!next) return null;

  const match = next.match(/<([^>]+)>/);
  return match?.[1] ?? null;
};

const fetchPaginatedJson = async (initialUrl) => {
  const results = [];
  let nextUrl = initialUrl;

  while (nextUrl) {
    const response = await githubFetch(nextUrl);
    if (!response) break;
    const page = await response.json();
    results.push(...page);
    nextUrl = parseNextLink(response.headers.get("link"));
  }

  return results;
};

const fetchRepositories = async () => {
  if (cacheDir) {
    const repos = await readJsonIfExists(path.join(cacheDir, "repos.json"));
    if (!Array.isArray(repos)) {
      throw new Error(`Cache invalide: ${path.join(cacheDir, "repos.json")} est absent ou illisible.`);
    }

    return repos;
  }

  if (!githubOwner && !githubToken) {
    throw new Error("Missing GitHub account. Use --account <username> or set GITHUB_USERNAME. Use GITHUB_TOKEN for private repositories.");
  }

  if (githubToken && !githubOwner) {
    return fetchPaginatedJson("https://api.github.com/user/repos?visibility=all&affiliation=owner,collaborator&sort=updated&per_page=100");
  }

  const publicRepos = await fetchPaginatedJson(`https://api.github.com/users/${encodeURIComponent(githubOwner)}/repos?type=owner&sort=updated&per_page=100`);

  if (!githubToken) {
    return publicRepos;
  }

  const accessibleRepos = await fetchPaginatedJson("https://api.github.com/user/repos?visibility=all&affiliation=owner,collaborator&sort=updated&per_page=100");
  const byId = new Map(publicRepos.map((repo) => [repo.id, repo]));

  for (const repo of accessibleRepos) {
    if (repo.owner?.login?.toLowerCase() === githubOwner.toLowerCase()) {
      byId.set(repo.id, repo);
    }
  }

  return [...byId.values()];
};

const decodeBase64 = (value) => Buffer.from(value.replace(/\n/g, ""), "base64").toString("utf8");

const fetchReadme = async (repo) => {
  if (cacheDir) {
    return await readTextIfExists(cacheFile(repo, "README.md"))
      ?? await readTextIfExists(cacheFile(repo, "readme.md"))
      ?? "";
  }

  const data = await fetchJson(`https://api.github.com/repos/${repo.full_name}/readme`);
  if (data?.content) return decodeBase64(data.content);

  const fallback = await fetchJson(repo.contents_url.replace("{+path}", "README.md"));
  return fallback?.content ? decodeBase64(fallback.content) : "";
};

const fetchRepoTree = async (repo) => {
  if (cacheDir) {
    const data = await readJsonIfExists(cacheFile(repo, "tree.json"));
    return data?.tree ?? [];
  }

  if (!repo.default_branch) return [];

  const data = await fetchJson(`https://api.github.com/repos/${repo.full_name}/git/trees/${encodeURIComponent(repo.default_branch)}?recursive=1`);
  if (!data?.tree || data.truncated) return data?.tree ?? [];

  return data.tree;
};

const fetchLanguages = async (repo) => {
  if (cacheDir) {
    return repo.language ? { [repo.language]: 1 } : {};
  }

  const data = await fetchJson(repo.languages_url);
  return data ?? {};
};

const fetchTextFile = async (repo, filePath) => {
  if (cacheDir) {
    if (filePath === "package.json") {
      return await readTextIfExists(cacheFile(repo, "package.json"));
    }

    return null;
  }

  const data = await fetchJson(repo.contents_url.replace("{+path}", encodeURIComponent(filePath).replace(/%2F/g, "/")));
  if (!data?.content || data.size > 250000) return null;
  return decodeBase64(data.content);
};

const extractPackageTechnologies = async (repo, tree) => {
  const packagePaths = tree
    .filter((item) => item.type === "blob" && item.path.endsWith("package.json"))
    .map((item) => item.path)
    .slice(0, 4);

  const technologies = new Set();

  for (const packagePath of packagePaths) {
    const content = await fetchTextFile(repo, packagePath);
    if (!content) continue;

    try {
      const packageJson = JSON.parse(content);
      const dependencies = {
        ...(packageJson.dependencies ?? {}),
        ...(packageJson.devDependencies ?? {}),
      };
      const names = Object.keys(dependencies);

      const dependencyMap = {
        "@vitejs/plugin-react": "Vite",
        "vite": "Vite",
        "react": "React",
        "react-dom": "React",
        "react-router-dom": "React Router",
        "redux": "Redux",
        "@reduxjs/toolkit": "Redux Toolkit",
        "express": "Express",
        "mysql2": "MySQL",
        "mongoose": "MongoDB",
        "tailwindcss": "Tailwind CSS",
        "zod": "Zod",
        "typescript": "TypeScript",
        "next": "Next.js",
        "socket.io": "Socket.IO",
        "socket.io-client": "Socket.IO",
      };

      for (const dependencyName of names) {
        if (dependencyMap[dependencyName]) {
          technologies.add(dependencyMap[dependencyName]);
        }
      }
    } catch {
      continue;
    }
  }

  return [...technologies];
};

const detectTechnologies = async (repo, languages, topics, tree, readme) => {
  const technologies = new Set();

  if (repo.language) technologies.add(repo.language);

  Object.keys(languages)
    .sort((a, b) => languages[b] - languages[a])
    .slice(0, 4)
    .forEach((language) => technologies.add(language));

  const paths = tree.map((item) => item.path.toLowerCase());
  const readmeLower = readme.toLowerCase();

  if (paths.some((item) => item.endsWith("makefile") || item.includes("/makefile"))) technologies.add("Makefile");
  if (paths.some((item) => item.endsWith("dockerfile"))) technologies.add("Docker");
  if (paths.some((item) => item.endsWith("docker-compose.yml") || item.endsWith("docker-compose.yaml"))) technologies.add("Docker Compose");
  if (paths.some((item) => item.endsWith("tsconfig.json"))) technologies.add("TypeScript");
  if (paths.some((item) => item.endsWith("vite.config.ts") || item.endsWith("vite.config.js"))) technologies.add("Vite");
  if (paths.some((item) => item.endsWith(".c"))) technologies.add("C");
  if (paths.some((item) => item.endsWith(".cpp") || item.endsWith(".hpp"))) technologies.add("C++");
  if (paths.some((item) => item.endsWith(".py"))) technologies.add("Python");
  if (paths.some((item) => item.endsWith(".sh"))) technologies.add("Shell");
  if (paths.some((item) => item.endsWith(".conf"))) technologies.add("Configuration");

  for (const topic of topics) {
    if (technicalTopicHints.has(topic.toLowerCase())) {
      technologies.add(topic.replace(/-/g, " "));
    }
  }

  for (const keyword of ["react", "express", "mysql", "docker", "typescript", "tailwind", "socket.io", "minilibx"]) {
    if (readmeLower.includes(keyword)) {
      const label = {
        react: "React",
        express: "Express",
        mysql: "MySQL",
        docker: "Docker",
        typescript: "TypeScript",
        tailwind: "Tailwind CSS",
        "socket.io": "Socket.IO",
        minilibx: "MiniLibX",
      }[keyword];
      technologies.add(label);
    }
  }

  const packageTechnologies = await extractPackageTechnologies(repo, tree);
  packageTechnologies.forEach((technology) => technologies.add(technology));

  return [...technologies].filter(Boolean).slice(0, 10);
};

const classifyRepo = (repo, readme, tree, languages) => {
  if (repo.fork) {
    return { selected: false, reason: "Fork ignore pour eviter d'integrer un projet non original." };
  }

  const repoName = repo.name.toLowerCase();
  const repoDescription = (repo.description ?? "").toLowerCase();
  const readmeText = stripMarkdown(readme).toLowerCase();

  if (getRepositoryProfile(repo.name)) {
    return { selected: true, reason: "Projet applicatif structure et pertinent pour le portfolio." };
  }

  if (ignoredNamePatterns.some((pattern) => pattern.test(repoName))) {
    return { selected: false, reason: "Depot identifie comme test, exercice ponctuel, depot vide ou site statique peu pertinent." };
  }

  if (repoDescription.includes("exercice") || readmeText.includes("exercice")) {
    return { selected: false, reason: "Depot presente comme une serie d'exercices, peu pertinent comme projet portfolio." };
  }

  const files = tree.filter((item) => item.type === "blob").map((item) => item.path.toLowerCase());
  const jobExerciseFiles = files.filter((file) => /^jour\d+\/job\d+\//.test(file));
  if (jobExerciseFiles.length >= 10) {
    return { selected: false, reason: "Structure de depot d'exercices jour/job, exclue du portfolio public." };
  }

  const hasFiles = tree.some((item) => item.type === "blob");
  const hasCode = tree.some((item) => item.type === "blob" && /\.(c|h|cpp|hpp|js|jsx|ts|tsx|py|go|rs|java|php|sh|yml|yaml|json)$/i.test(item.path));
  const hasReadme = stripMarkdown(readme).length >= 80;
  const languageCount = Object.keys(languages).length;
  const knownDefinition = getKnownDefinition(repo.name);

  if (!hasFiles && repo.size === 0 && !hasReadme) {
    return { selected: false, reason: "Depot vide ou sans contenu exploitable." };
  }

  if (knownDefinition && (hasCode || hasReadme || repo.size > 0)) {
    return { selected: true, reason: "Projet technique prioritaire reconnu." };
  }

  if (!hasCode && !hasReadme && languageCount === 0) {
    return { selected: false, reason: "Pas assez de code, README ou langage detecte." };
  }

  const hasTechnicalTopic = (repo.topics ?? []).some((topic) => technicalTopicHints.has(topic.toLowerCase()));
  const hasProjectStructure = tree.some((item) => /(^|\/)(src|app|server|client|backend|frontend|docker-compose\.ya?ml|makefile|package\.json)$/i.test(item.path));

  if (hasTechnicalTopic || hasProjectStructure || languageCount > 0) {
    return { selected: true, reason: "Depot technique exploitable pour un portfolio." };
  }

  return { selected: false, reason: "Pertinence portfolio insuffisante d'apres les metadonnees disponibles." };
};

const buildProjectPayload = (repo, readme, technologies) => {
  const repositoryProfile = getRepositoryProfile(repo.name);
  if (repositoryProfile) {
    return {
      title: repositoryProfile.title,
      description: repositoryProfile.description,
      tech_stack: truncate(repositoryProfile.tech_stack.join(", "), 255),
      github_url: repo.html_url,
      demo_url: isHttpUrl(repo.homepage) ? cleanNullableText(repo.homepage) : null,
      image_url: placeholderImageUrl,
      context: repositoryProfile.context,
      objective: repositoryProfile.objective,
      learned_skills: repositoryProfile.learned_skills,
      technical_stack: repositoryProfile.tech_stack,
      gallery_images: [],
      display_settings: defaultDisplaySettings,
      challenges: repositoryProfile.challenges,
      solution: repositoryProfile.solution,
    };
  }

  const knownDefinition = getKnownDefinition(repo.name);
  const description = cleanNullableText(repo.description)
    ?? firstReadmeSentence(readme)
    ?? knownDefinition?.description
    ?? `Depot technique ${repo.name}.`;

  const title = knownDefinition?.title ?? repo.name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  const learnedSkills = knownDefinition?.learned_skills ?? technologies.slice(0, 6);
  const techStack = technologies.length > 0 ? technologies.join(", ") : null;

  return {
    title,
    description: truncate(description, 1000),
    tech_stack: truncate(techStack, 255),
    github_url: repo.html_url,
    demo_url: isHttpUrl(repo.homepage) ? cleanNullableText(repo.homepage) : null,
    image_url: placeholderImageUrl,
    context: knownDefinition?.context ?? `Depot GitHub technique analyse depuis le compte ${repo.owner.login}.`,
    objective: knownDefinition?.objective ?? truncate(description, 1000),
    learned_skills: learnedSkills.length > 0 ? learnedSkills : [],
    technical_stack: technologies,
    gallery_images: [],
    display_settings: defaultDisplaySettings,
    challenges: knownDefinition?.challenges ?? null,
    solution: knownDefinition?.solution ?? null,
  };
};

const getDbConfig = () => {
  const envHost = process.env.DB_HOST;
  const isDockerServiceHost = envHost === "db";

  return {
    host: process.env.DB_IMPORT_HOST ?? (isDockerServiceHost ? "localhost" : envHost ?? "localhost"),
    port: Number(process.env.DB_IMPORT_PORT ?? (isDockerServiceHost ? "3308" : process.env.DB_PORT ?? "3308")),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "root",
    database: process.env.DB_NAME ?? "portfolio_db",
  };
};

const getExistingProjects = async (connection) => {
  const [rows] = await connection.query("SELECT * FROM projects ORDER BY id ASC");
  return rows;
};

const detectDuplicate = (payload, repo, existingProjects) => {
  const repoUrl = normalizeGithubUrl(repo.html_url);
  const payloadKey = canonicalProjectKey(payload.title);
  const repoKey = canonicalProjectKey(repo.name);

  const sameUrl = existingProjects.find((project) => normalizeGithubUrl(project.github_url) === repoUrl);
  if (sameUrl) {
    return {
      type: "same_github_url",
      project: sameUrl,
      reason: `Meme URL GitHub que le projet existant "${sameUrl.title}".`,
    };
  }

  const sameCanonicalProject = existingProjects.find((project) => {
    const titleKey = canonicalProjectKey(project.title);
    return titleKey === payloadKey || titleKey === repoKey;
  });

  if (sameCanonicalProject) {
    return {
      type: "same_project_name",
      project: sameCanonicalProject,
      reason: `Projet equivalent detecte: depot "${repo.name}" et projet existant "${sameCanonicalProject.title}".`,
    };
  }

  return null;
};

const mergeProjectForUpdate = (existingProject, payload, duplicateType) => {
  const sameUrl = duplicateType === "same_github_url";

  return {
    title: existingProject.title || payload.title,
    description: existingProject.description || payload.description,
    tech_stack: existingProject.tech_stack || payload.tech_stack,
    github_url: sameUrl || !existingProject.github_url ? payload.github_url : existingProject.github_url,
    demo_url: existingProject.demo_url || payload.demo_url,
    image_url: existingProject.image_url || payload.image_url,
    context: existingProject.context || payload.context,
    objective: existingProject.objective || payload.objective,
    learned_skills: existingProject.learned_skills || JSON.stringify(payload.learned_skills),
    technical_stack: existingProject.technical_stack || JSON.stringify(payload.technical_stack),
    gallery_images: existingProject.gallery_images || JSON.stringify(payload.gallery_images),
    display_settings: existingProject.display_settings || JSON.stringify(payload.display_settings),
    challenges: existingProject.challenges || payload.challenges,
    solution: existingProject.solution || payload.solution,
  };
};

const insertProject = async (connection, payload) => {
  const [result] = await connection.query(
    `INSERT INTO projects (
      title,
      description,
      tech_stack,
      github_url,
      demo_url,
      image_url,
      context,
      objective,
      learned_skills,
      technical_stack,
      gallery_images,
      display_settings,
      challenges,
      solution
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CAST(? AS JSON), CAST(? AS JSON), CAST(? AS JSON), CAST(? AS JSON), ?, ?)`,
    [
      payload.title,
      payload.description,
      payload.tech_stack,
      payload.github_url,
      payload.demo_url,
      payload.image_url,
      payload.context,
      payload.objective,
      JSON.stringify(payload.learned_skills),
      JSON.stringify(payload.technical_stack),
      JSON.stringify(payload.gallery_images),
      JSON.stringify(payload.display_settings),
      payload.challenges,
      payload.solution,
    ],
  );

  return result.insertId;
};

const updateProject = async (connection, id, payload) => {
  await connection.query(
    `UPDATE projects
    SET
      title = ?,
      description = ?,
      tech_stack = ?,
      github_url = ?,
      demo_url = ?,
      image_url = ?,
      context = ?,
      objective = ?,
      learned_skills = CAST(? AS JSON),
      technical_stack = CAST(? AS JSON),
      gallery_images = CAST(? AS JSON),
      display_settings = CAST(? AS JSON),
      challenges = ?,
      solution = ?
    WHERE id = ?`,
    [
      payload.title,
      payload.description,
      payload.tech_stack,
      payload.github_url,
      payload.demo_url,
      payload.image_url,
      payload.context,
      payload.objective,
      typeof payload.learned_skills === "string" ? payload.learned_skills : JSON.stringify(payload.learned_skills),
      typeof payload.technical_stack === "string" ? payload.technical_stack : JSON.stringify(payload.technical_stack),
      typeof payload.gallery_images === "string" ? payload.gallery_images : JSON.stringify(payload.gallery_images),
      typeof payload.display_settings === "string" ? payload.display_settings : JSON.stringify(payload.display_settings),
      payload.challenges,
      payload.solution,
      id,
    ],
  );
};

const buildInitSqlBlock = (projects) => {
  if (projects.length === 0) {
    return `${markerStart}\n-- Aucun projet GitHub importe.\n${markerEnd}`;
  }

  const blocks = projects.map(({ payload }) => {
    const normalizedTitle = normalizeText(payload.title);
    return `
SET @project_id := (
  SELECT id FROM projects
  WHERE
    github_url = ${toSqlString(payload.github_url)}
    OR LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]', '')) = ${toSqlString(normalizedTitle)}
  LIMIT 1
);

INSERT INTO projects (
  title,
  description,
  tech_stack,
  github_url,
  demo_url,
  image_url,
  context,
  objective,
  learned_skills,
  technical_stack,
  gallery_images,
  display_settings,
  challenges,
  solution
)
SELECT
  ${toSqlString(payload.title)},
  ${toSqlString(payload.description)},
  ${toSqlString(payload.tech_stack)},
  ${toSqlString(payload.github_url)},
  ${toSqlString(payload.demo_url)},
  ${toSqlString(payload.image_url)},
  ${toSqlString(payload.context)},
  ${toSqlString(payload.objective)},
  ${toSqlJson(payload.learned_skills)},
  ${toSqlJson(payload.technical_stack)},
  ${toSqlJson(payload.gallery_images)},
  ${toSqlJson(payload.display_settings)},
  ${toSqlString(payload.challenges)},
  ${toSqlString(payload.solution)}
WHERE @project_id IS NULL;

SET @project_id := COALESCE(@project_id, LAST_INSERT_ID());

UPDATE projects
SET
  description = COALESCE(description, ${toSqlString(payload.description)}),
  tech_stack = COALESCE(tech_stack, ${toSqlString(payload.tech_stack)}),
  github_url = COALESCE(github_url, ${toSqlString(payload.github_url)}),
  demo_url = COALESCE(demo_url, ${toSqlString(payload.demo_url)}),
  image_url = COALESCE(image_url, ${toSqlString(payload.image_url)}),
  context = COALESCE(context, ${toSqlString(payload.context)}),
  objective = COALESCE(objective, ${toSqlString(payload.objective)}),
  learned_skills = COALESCE(learned_skills, ${toSqlJson(payload.learned_skills)}),
  technical_stack = COALESCE(technical_stack, ${toSqlJson(payload.technical_stack)}),
  gallery_images = COALESCE(gallery_images, ${toSqlJson(payload.gallery_images)}),
  display_settings = COALESCE(display_settings, ${toSqlJson(payload.display_settings)}),
  challenges = COALESCE(challenges, ${toSqlString(payload.challenges)}),
  solution = COALESCE(solution, ${toSqlString(payload.solution)})
WHERE id = @project_id;`.trim();
  });

  return `${markerStart}\n${blocks.join("\n\n")}\n${markerEnd}`;
};

const syncInitSql = async (projects) => {
  const initPath = path.join(rootDir, "db", "init.sql");
  const currentSql = await fs.readFile(initPath, "utf8");
  const generatedBlock = buildInitSqlBlock(projects);

  if (currentSql.includes(markerStart) && currentSql.includes(markerEnd)) {
    const pattern = new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`);
    await fs.writeFile(initPath, currentSql.replace(pattern, generatedBlock));
    return;
  }

  const insertionPoint = currentSql.indexOf("\n--\n-- Table structure for table `users`");
  if (insertionPoint === -1) {
    await fs.writeFile(initPath, `${currentSql.trim()}\n\n${generatedBlock}\n`);
    return;
  }

  const nextSql = `${currentSql.slice(0, insertionPoint).trim()}\n\n${generatedBlock}\n${currentSql.slice(insertionPoint)}`;
  await fs.writeFile(initPath, nextSql);
};

const analyzeRepositories = async (repos, existingProjects) => {
  const scanned = [];
  const retained = [];
  const ignored = [];
  const duplicates = [];

  for (const repo of repos) {
    const readme = await fetchReadme(repo);
    await sleep(80);
    const languages = await fetchLanguages(repo);
    await sleep(80);
    const tree = await fetchRepoTree(repo);
    await sleep(80);
    const topics = repo.topics ?? [];
    const technologies = await detectTechnologies(repo, languages, topics, tree, readme);
    const classification = classifyRepo(repo, readme, tree, languages);

    const metadata = {
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      readme_excerpt: truncate(firstReadmeSentence(readme), 500),
      language: repo.language,
      languages: Object.keys(languages),
      topics,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      github_url: repo.html_url,
      fork: repo.fork,
      archived: repo.archived,
      size: repo.size,
    };

    scanned.push(metadata);

    if (!classification.selected) {
      ignored.push({
        repo: metadata,
        reason: classification.reason,
      });
      continue;
    }

    const payload = buildProjectPayload(repo, readme, technologies);
    const duplicate = detectDuplicate(payload, repo, existingProjects);

    const retainedProject = {
      repo: metadata,
      reason: classification.reason,
      payload,
      duplicate,
      action: duplicate ? "update_or_skip_duplicate" : "insert",
    };

    if (duplicate) {
      duplicates.push({
        repo: metadata,
        existing_project: {
          id: duplicate.project.id,
          title: duplicate.project.title,
          github_url: duplicate.project.github_url,
        },
        type: duplicate.type,
        reason: duplicate.reason,
      });
    }

    retained.push(retainedProject);
  }

  return { scanned, retained, ignored, duplicates };
};

const writeReports = async (analysis, applySummary) => {
  await fs.mkdir(reportDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const ownerLabel = githubOwner ?? "token-user";
  const baseName = `github-import-${ownerLabel}-${timestamp}`;
  const jsonPath = path.join(reportDir, `${baseName}.json`);
  const mdPath = path.join(reportDir, `${baseName}.md`);

  const report = {
    generated_at: new Date().toISOString(),
    github_account: githubOwner,
    apply: applyChanges,
    scanned_count: analysis.scanned.length,
    retained_count: analysis.retained.length,
    ignored_count: analysis.ignored.length,
    duplicate_count: analysis.duplicates.length,
    scanned_repositories: analysis.scanned,
    retained_projects: analysis.retained.map((item) => ({
      repository: item.repo.full_name,
      reason: item.reason,
      action: item.action,
      payload: item.payload,
      duplicate: item.duplicate ? {
        type: item.duplicate.type,
        existing_project_id: item.duplicate.project.id,
        existing_project_title: item.duplicate.project.title,
        reason: item.duplicate.reason,
      } : null,
    })),
    ignored_projects: analysis.ignored.map((item) => ({
      repository: item.repo.full_name,
      reason: item.reason,
    })),
    duplicates: analysis.duplicates,
    apply_summary: applySummary,
  };

  const lines = [
    "# Rapport import GitHub",
    "",
    `Compte GitHub: ${githubOwner ?? "token authenticated user"}`,
    `Mode: ${applyChanges ? "apply" : "dry-run"}`,
    `Repositories scannes: ${analysis.scanned.length}`,
    `Projets retenus: ${analysis.retained.length}`,
    `Projets ignores: ${analysis.ignored.length}`,
    `Doublons detectes: ${analysis.duplicates.length}`,
    "",
    "## Repositories trouves",
    "",
    ...analysis.scanned.map((repo) => `- ${repo.full_name} | ${repo.language ?? "n/a"} | ${repo.github_url} | cree: ${repo.created_at} | modifie: ${repo.updated_at}`),
    "",
    "## Projets retenus",
    "",
    ...analysis.retained.map((item) => `- ${item.payload.title} (${item.repo.full_name}) | action: ${item.action} | ${item.reason}`),
    "",
    "## Projets ignores",
    "",
    ...analysis.ignored.map((item) => `- ${item.repo.full_name}: ${item.reason}`),
    "",
    "## Doublons detectes",
    "",
    ...(analysis.duplicates.length > 0
      ? analysis.duplicates.map((item) => `- ${item.repo.full_name} -> ${item.existing_project.title} (#${item.existing_project.id}): ${item.reason}`)
      : ["- Aucun"]),
    "",
    "## Application",
    "",
    ...(applySummary
      ? [
          `- Ajoutes: ${applySummary.added.map((item) => item.title).join(", ") || "aucun"}`,
          `- Mis a jour: ${applySummary.updated.map((item) => item.title).join(", ") || "aucun"}`,
          `- Ignored duplicates: ${applySummary.skipped_duplicates.map((item) => item.title).join(", ") || "aucun"}`,
          `- db/init.sql synchronise: ${applySummary.init_sql_synced ? "oui" : "non"}`,
        ]
      : ["- Aucune modification: dry-run."]),
    "",
  ];

  await fs.writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  await fs.writeFile(mdPath, `${lines.join("\n")}\n`);

  return { jsonPath, mdPath };
};

const applyAnalysis = async (connection, analysis) => {
  const added = [];
  const updated = [];
  const skippedDuplicates = [];
  const initSqlProjects = [];

  for (const item of analysis.retained) {
    if (!item.duplicate) {
      const id = await insertProject(connection, item.payload);
      added.push({ id, title: item.payload.title, github_url: item.payload.github_url });
      initSqlProjects.push({ payload: item.payload });
      continue;
    }

    if (item.duplicate.type === "same_github_url") {
      const mergedPayload = mergeProjectForUpdate(item.duplicate.project, item.payload, item.duplicate.type);
      await updateProject(connection, item.duplicate.project.id, mergedPayload);
      updated.push({
        id: item.duplicate.project.id,
        title: item.duplicate.project.title,
        github_url: mergedPayload.github_url,
        reason: item.duplicate.reason,
      });
      initSqlProjects.push({ payload: item.payload });
      continue;
    }

    skippedDuplicates.push({
      id: item.duplicate.project.id,
      title: item.duplicate.project.title,
      repository: item.repo.full_name,
      reason: item.duplicate.reason,
    });
  }

  await syncInitSql(initSqlProjects);

  return {
    added,
    updated,
    skipped_duplicates: skippedDuplicates,
    init_sql_synced: true,
    sql_operations: {
      inserts: added.length,
      updates: updated.length,
    },
  };
};

const main = async () => {
  const repos = await fetchRepositories();
  const dbConfig = getDbConfig();
  const connection = await mysql.createConnection(dbConfig);

  try {
    const existingProjects = await getExistingProjects(connection);
    const analysis = await analyzeRepositories(repos, existingProjects);
    let applySummary = null;

    if (applyChanges) {
      applySummary = await applyAnalysis(connection, analysis);
    }

    const reportPaths = await writeReports(analysis, applySummary);

    console.log(JSON.stringify({
      mode: applyChanges ? "apply" : "dry-run",
      github_account: githubOwner,
      scanned: analysis.scanned.length,
      retained: analysis.retained.length,
      ignored: analysis.ignored.length,
      duplicates: analysis.duplicates.length,
      report_markdown: path.relative(rootDir, reportPaths.mdPath),
      report_json: path.relative(rootDir, reportPaths.jsonPath),
      apply_summary: applySummary,
    }, null, 2));
  } finally {
    await connection.end();
  }
};

main().catch((error) => {
  console.error(error?.stack || error?.message || error);
  if (Array.isArray(error?.errors)) {
    for (const innerError of error.errors) {
      console.error(innerError?.stack || innerError?.message || innerError);
    }
  }
  process.exitCode = 1;
});
