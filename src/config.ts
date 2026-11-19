/**
 * A project as shown on the /projects page.
 * `cover` is the path to a real screenshot in /public — leave it empty and the
 * card renders its placeholder instead, at the same dimensions.
 */
export type FeaturedProject = {
  name: string;
  description: string;
  link: string;
  tags: string[];
  cover: string;
  /**
   * "cover" (default) fills the plate and crops — right for app screenshots.
   * "contain" fits the whole image in — use for diagrams, where cropping an
   * edge would lop off part of the flow.
   */
  coverFit?: 'cover' | 'contain';
  /**
   * Tailwind aspect class for the plate, when the cover's own ratio is far from
   * the card default (e.g. a wide DAG strip). Omit to use the card's ratio.
   */
  coverRatio?: string;
  /**
   * Let the card end just under its cover instead of stretching to the grid
   * row and pinning text to the bottom. For covers far shorter than the row.
   */
  compact?: boolean;
  /**
   * Tool logos pinned to the card's bottom edge, each in an identical square
   * box. Setting these replaces the card's text `tags` row, so `name` carries
   * the alt text that row used to convey. Paths are case-sensitive on the
   * deploy host.
   */
  logos?: { src: string; name: string }[];
};

/** One card on the /skills page. */
export type SkillGroup = {
  name: string;
  blurb: string;
  /** `icon` is a path in /public; see `skillGroups` for how it changes rendering. */
  items: { label: string; icon?: string }[];
};

export const siteConfig = {
  name: "Mihir Yanamandra",
  title: "Software & ML Engineer",
  description: "Portfolio website of Mihir Yanamandra",
  /** One line under the résumé headline. */
  tagline: "I build production ML systems, LLM applications, and the software that puts them in front of people.",
  /**
   * The stat band under the résumé hero. Every figure must trace to an
   * experience bullet or project below, worded no more strongly than it is there.
   */
  stats: [
    { value: "85.6M", label: "trip records behind a taxi-demand forecasting model" }, // RideOps AI
    { value: "<100 ms", label: "semantic entity search over vector embeddings" }, // TechTorch
    { value: "~60%", label: "lower LLM token costs through smart pre-filtering" }, // TechTorch
  ],
  /**
   * Per-route <title> and meta description. Set client-side on navigation, so
   * they reach users and Google (which renders JS) but NOT link-preview
   * crawlers, which only read the static index.html.
   */
  pageMeta: {
    home: {
      title: "Mihir Yanamandra: Software & ML Engineer",
      description:
        "Software and ML engineer building production ML systems, LLM applications and the services around them in Python, PyTorch, FastAPI, React and TypeScript.",
    },
    projects: {
      title: "Mihir Yanamandra's work!",
      description:
        "Software and ML engineering projects: a transformer that ranks SQL query plans, RAG and LLM-agent applications, demand forecasting over 85M trips, and event-streaming systems on Kafka and Spark.",
    },
    skills: {
      title: "Skills — Mihir Yanamandra",
      description:
        "The toolkit behind the work: Python, PyTorch and scikit-learn for models, FastAPI, React and TypeScript for software, plus the computer-science and ML fundamentals underneath them.",
    },
    notFound: {
      title: "Page not found — Mihir Yanamandra",
      description: "That page does not exist. Head back to the portfolio or the projects page.",
    },
  },
  /** Square face crop of `portrait` for the header avatar. */
  avatar: "/avatar.jpg",
  /** Portrait for the /projects page. Falls back to the placeholder plate if missing. */
  portrait: "/portrait.jpg",
  social: {
    email: "mihiryanamandra@gmail.com",
    universityEmail: "mihir.yanamandra@stonybrook.edu",
    linkedin: "https://www.linkedin.com/in/mihir-yanamandra-60358021b",
    calendar: "https://calendar.app.google/RQcvC6Kf1yH2BBE79",
    twitter: "",
    github: "https://github.com/MIHIRY",
    kaggle: "https://www.kaggle.com/mihiryanamandra",
  },
  // Every figure here is backed by an experience bullet or a project below.
  aboutMe: "Software and ML engineer building production systems around models: LLM-powered entity resolution, sub-100 ms semantic search, demand forecasting over 85M+ trip records, and RAG and LLM-agent applications. I work across the stack: Python, PyTorch and scikit-learn for the models; FastAPI, React and TypeScript for the services and interfaces; Docker, AWS and Spark to run them at scale. That includes a tree-aware transformer, LoRA-tuned on 35K query plans, that predicts which SQL execution plan will run faster, and LLM pre-filtering that cut token costs by ~60%.",
  /**
   * The résumé's short toolkit, grouped the way the About text is: models,
   * the software around them, and what runs them. The full set lives on /skills.
   */
  skills: [
    { group: "Models", items: ["PyTorch", "Scikit-learn", "XGBoost", "Transformers", "RAG"] },
    { group: "Services & interfaces", items: ["Python", "FastAPI", "React", "TypeScript"] },
    { group: "Infrastructure", items: ["Docker", "AWS", "PySpark", "MLflow"] },
  ],
  /**
   * Tech strip on the /projects page. Curated and ordered — not the same set as `skills`.
   * TechStrip's fluid font size is fitted to 14 items whose names total ~109
   * characters; past that the row wraps. This set is 108.
   */
  dataStack: [
    "Python",
    "PyTorch",
    "TensorFlow",
    "Scikit-learn",
    "XGBoost",
    "Transformers",
    "Claude API",
    "MLflow",
    "FastAPI",
    "React",
    "TypeScript",
    "Node.js",
    "Docker",
    "AWS",
  ],
  /**
   * The /skills page. Each group is one card.
   *
   * An item may carry an `icon` (a path in /public). Items with one render as
   * logo tiles, the rest as text pills underneath them.
   *
   * Keep the count at 13 (or 7, 19…): the last card spans the full row, which
   * only closes flush when the rest fill whole rows of both 2 and 3.
   */
  skillGroups: [
    {
      name: "Languages",
      blurb: "What the models, services and interfaces are written in.",
      items: [
        { label: "Python", icon: "/logo-python.png" }, { label: "SQL", icon: "/logo-sql.png" },
        { label: "TypeScript" }, { label: "Java" }, { label: "R" },
      ],
    },
    {
      name: "Machine Learning",
      blurb: "Training, tracking and evaluating models on production data.",
      items: [
        { label: "PyTorch" }, { label: "TensorFlow" }, { label: "Scikit-learn" },
        { label: "XGBoost" }, { label: "MLflow" },
      ],
    },
    {
      name: "LLMs & Applied AI",
      blurb: "Retrieval, fine-tuning and agent work on top of foundation models.",
      items: [
        { label: "RAG" }, { label: "LoRA" }, { label: "Transformers" },
        { label: "Claude API" }, { label: "Groq API" }, { label: "AI Agents" },
      ],
    },
    {
      name: "Software Engineering",
      blurb: "The services and interfaces that put models in front of people.",
      items: [
        { label: "FastAPI" }, { label: "React" }, { label: "Node.js" },
        { label: "Express.js" }, { label: "REST APIs" }, { label: "Tailwind CSS" },
      ],
    },
    {
      name: "Cloud & Deployment",
      blurb: "Running and shipping systems on managed infrastructure.",
      items: [
        { label: "AWS", icon: "/logo-aws.png" },
        { label: "Azure", icon: "/logo-azure.png" },
        { label: "Docker", icon: "/logo-docker.png" },
      ],
    },
    {
      name: "Distributed Computing",
      blurb: "Compute for workloads that outgrow a single machine.",
      items: [{ label: "Apache Spark", icon: "/logo-spark.png" }, { label: "Databricks", icon: "/logo-databricks.png" }, { label: "Hadoop", icon: "/logo-hadoop.png" }],
    },
    {
      name: "Databases",
      blurb: "Transactional and document stores behind the applications.",
      items: [{ label: "PostgreSQL", icon: "/logo-postgres.png" }, { label: "MySQL", icon: "/logo-mysql.png" }, { label: "MongoDB", icon: "/logo-mongo.png" }],
    },
    {
      name: "Data Infrastructure",
      blurb: "Feeding models clean, tested data, and storing what they produce.",
      items: [
        { label: "Snowflake", icon: "/logo-snowflake.png" },
        { label: "DuckDB", icon: "/logo-duckdb.png" },
        { label: "Apache Iceberg", icon: "/logo-iceberg.png" },
        { label: "Trino", icon: "/logo-trino.png" },
        { label: "Microsoft Fabric", icon: "/logo-microsoft-fabric.png" },
        { label: "Airflow", icon: "/logo-airflow.png" },
        { label: "dbt", icon: "/logo-dbt.png" },
        { label: "Great Expectations", icon: "/logo-great-expectations.png" },
      ],
    },
    {
      name: "Dashboards & Prototypes",
      blurb: "Getting a model's output in front of a stakeholder quickly.",
      items: [
        { label: "Streamlit", icon: "/logo-streamlit.png" }, { label: "Power BI", icon: "/logo-power-bi.png" }, { label: "Tableau", icon: "/logo-tableau.png" },
      ],
    },
    {
      name: "Version Control & Collaboration",
      blurb: "Managing code and working with others on it.",
      items: [{ label: "Git", icon: "/logo-git.png" }, { label: "GitHub", icon: "/logo-github.png" }],
    },
    {
      name: "Computer Science Concepts",
      blurb: "The fundamentals underneath the tools.",
      items: [
        { label: "Data Structures & Algorithms" }, { label: "Object-Oriented Programming" },
        { label: "System Design" }, { label: "Distributed Systems" }, { label: "Operating Systems" },
        { label: "DBMS" }, { label: "Computer Networks" }, { label: "HPC / MPI" },
      ],
    },
    {
      name: "ML & Statistics Concepts",
      blurb: "The statistical and modelling ideas the work rests on.",
      items: [
        { label: "Feature Engineering" }, { label: "Regression" }, { label: "Time Series" },
        { label: "Forecasting" }, { label: "PCA" }, { label: "Statistics" },
        { label: "Hypothesis Testing" }, { label: "Data Mining" }, { label: "Risk Modeling" },
      ],
    },
    {
      name: "Personal Development",
      blurb: "How I work with people, and keep getting better at it.",
      items: [
        { label: "Communication" }, { label: "Problem Solving" }, { label: "Ownership" },
        { label: "Collaboration" }, { label: "Leadership" }, { label: "Time Management" },
      ],
    },
  ] satisfies SkillGroup[],
  /**
   * Verifiable credentials for the /projects page card. Kept separate from
   * `certifications` below, which the home page renders with issuer/date/
   * description — fields a credential URL alone does not supply.
   */
  credentials: [
    {
      name: "The Rise of the AI Data Engineer Boot Camp",
      link: "https://learn.dataexpert.io/certification/mihiryanamandra89421/the-rise-of-the-ai-data-engineer-boot-camp-8b5975",
    },
    {
      name: "Google Advanced Data Analytics Professional Certificate",
      link: "https://www.credly.com/badges/93c20b6e-eff1-402a-bd27-cdc0f2bea81c/public_url",
    },
  ],
  /**
   * Reading list on the /projects page. Save covers to /public and point
   * `cover` at them; an empty string renders the placeholder plate instead.
   * The takeaways are drafts — rewrite them in your own words.
   */
  reading: [
    // `link` points at your own write-up for each book — the card only becomes
    // clickable once a url is set, so no dead links in the meantime.
    {
      title: "AI Engineering",
      author: "Chip Huyen",
      takeaway: "The hard part of AI isn’t making it work once. It’s knowing whether it works reliably.",
      cover: "/book-ai-engineering.jpg",
      link: "",
    },
    {
      title: "Fundamentals of Data Engineering",
      author: "Joe Reis & Matt Housley",
      takeaway: "Great data engineering is invisible: when the foundation is strong, everything built on top of it simply works.",
      cover: "/book-fundamentals-de.jpg",
      link: "",
    },
    {
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      takeaway: "A system isn’t truly well-designed when everything works; it’s well-designed when things fail and the system still works.",
      cover: "/book-ddia.jpg",
      link: "",
    },
  ],
  /** The four projects headlining the /projects page. */
  featuredProjects: [
    {
      name: "RideOps AI: Taxi Demand Forecasting",
      description:
        "Forecasts NYC Yellow Taxi demand by zone and hour with XGBoost across 85.6M trip records, flags anomalies, measures the impact of congestion pricing, and explains it through Claude-powered insights.",
      link: "https://github.com/MIHIRY/Rideops-AI",
      tags: ["XGBoost", "Python", "Claude API"],
      cover: "/nyc-taxi-demand.jpg",
    },
    {
      name: "Fraud Analytics Platform",
      description:
        "Fraud analytics over 6.3M PaySim transactions on Microsoft Fabric. PySpark ingests the raw data, versioned SQL models build a governed star schema, and a parameter-driven job runs full or incremental loads, gated by 52 automated tests.",
      link: "https://github.com/MIHIRY/microsoft-fabric-finance-lakehouse",
      tags: ["PySpark", "Microsoft Fabric", "Automated Testing"],
      cover: "/finance-lakehouse.jpg",
      coverFit: "contain",
    },
    {
      name: "Adaptive Query Ranker",
      description:
        "Tree-aware transformer that ranks SQL execution plans to predict the faster one, LoRA-tuned on 35K plan variants across 134 schemas.",
      link: "https://github.com/MIHIRY/Cross-Plan",
      tags: ["PyTorch", "Transformers", "LoRA"],
      // 1400x627 (2.23) in this slot's 21/9 (2.33) plate: ~4% side letterbox.
      cover: "/cross-plan.jpg",
      coverFit: "contain",
    },
    {
      name: "Connected-Car Telemetry Platform",
      description:
        "Ingests connected-car events, validates them, quarantines bad records and serves fleet-monitoring views. Containerized with Docker, orchestrated end to end.",
      link: "https://github.com/MIHIRY/-VEHICLE-TELEMETRY-PIPELINE",
      tags: ["Python", "Docker", "Data Quality"],
      cover: "/vehicle-telemetry.webp",
      // 1672x941 (1.78) diagram on transparency: "contain", so no stage is cropped off an edge.
      coverFit: "contain",
    },
  ] satisfies FeaturedProject[],
  /** Placeholders — same shape, so swapping in real data needs no layout change. */
  upcomingProjects: [
    {
      name: "RAGFlow: Research Paper Q&A",
      description:
        "Advanced RAG system for research paper comprehension, using vector embeddings and semantic search to query and summarize academic papers.",
      link: "https://github.com/MIHIRY/RagFlow",
      tags: ["Python", "LLM", "RAG"],
      cover: "/rag-pipeline.png",
      // Source is 1233x297 (4.15); a 4/1 plate fits it with ~4% letterbox.
      coverFit: "contain",
      coverRatio: "aspect-[2/1] lg:aspect-[4/1]",
      compact: true,
    },
    {
      name: "Terrorism Risk Forecasting",
      description:
        "Forecasts terrorism risk from 1970–2017 GTD incidents with logistic regression, random forest and time-series models, on an Airflow-orchestrated, quality-gated data layer.",
      link: "https://github.com/MIHIRY/Terrorism-Risk-Forecasting-using-R",
      tags: ["R", "Random Forest", "Time Series"],
      // 1143x708 (1.61) against a 16/10 plate — "cover" crops ~3px, so it fills.
      cover: "/terrorism-risk.jpg",
      // Cover is far shorter than the row, so the default bottom-pinned text
      // left an 85px gap under it. Sit the text just below the image instead.
      compact: true,
    },
    {
      name: "AI Project Copilot",
      description:
        "AI project discovery on Databricks. Spark ingests GitHub, EXA and OpenAlex; RAG search plus an agent-run roadmap.",
      link: "https://github.com/MIHIRY/databricks-ai-project-copilot-capstone",
      tags: ["RAG", "AI Agents", "Spark"],
      // 1200x630 (1.9) logo on white. "contain" (never crop a logo) on a
      // matching 19/10 plate, so no blue band frames the white artwork.
      cover: "/ai-copilot.webp",
      coverFit: "contain",
      coverRatio: "aspect-[19/10]",
    },
    {
      name: "Drive Failure Streaming Platform",
      description:
        "Backblaze drive telemetry streamed as Kafka events through Spark into Iceberg and served over Trino: 500K events, zero duplicates.",
      link: "https://github.com/MIHIRY/Drive-Telemetry-Lakehouse",
      tags: ["Kafka", "Spark Streaming", "Docker"],
      // 1500x641 (2.34) in a 9/4 (2.25) plate: ~4% letterbox top and bottom.
      cover: "/drive-telemetry.jpg",
      coverFit: "contain",
      coverRatio: "aspect-[2/1] lg:aspect-[9/4]",
    },
    {
      // Rendered in the tile the Databricks card vacated, not in the map's
      // own run of cells — see ProjectsPage.
      name: "Music Intelligence Platform",
      description:
        "Recommendation and analytics platform over 141M+ listens: trends, retention, discovery and loyalty signals feeding recommendations.",
      // No repo yet, so the card stays unclickable rather than carry a dead link.
      link: "",
      tags: ["Python", "Recommendations", "Docker"],
      // 2172x724 is exactly 3.0, so a 3/1 plate fits it edge to edge with no
      // letterbox at all — the image meets both sides of the card.
      cover: "/spotify.png",
      coverRatio: "aspect-[3/1]",
      compact: true,
    },
] satisfies FeaturedProject[],
  // ML and software work first; the systems projects follow. The résumé shows
  // only the first six, so keep the strongest at the top.
  projects: [
{
      name: "RideOps AI: Taxi Demand Forecasting",
      description:
        "Forecasts NYC Yellow Taxi demand at zone and hourly level with XGBoost across 85.6M trip records. Adds anomaly detection, congestion-pricing impact analysis and AI-generated demand insights through the Claude API.",
      link: "https://github.com/MIHIRY/Rideops-AI",
      skills: ["Python", "XGBoost", "Anomaly Detection", "Claude API", "Streamlit"],
    },
{
      name: "Adaptive Query Ranker: Learned SQL Plan Selection",
      description:
        "Tree-aware transformer model that ranks database query execution plans to predict which plan executes faster. Uses LoRA for parameter-efficient fine-tuning on 35K+ query plan variants across 134 schemas.",
      link: "https://github.com/MIHIRY/Cross-Plan",
      skills: ["Python", "PyTorch", "Transformers", "LoRA", "SQL"],
    },
{
      name: "RAGFlow: Research Paper Q&A",
      description:
        "Advanced RAG system for research paper comprehension using vector embeddings and semantic search to enable intelligent querying and summarization of academic papers.",
      link: "https://github.com/MIHIRY/RagFlow",
      skills: ["Python", "LLM", "RAG", "Embeddings"],
    },
{
      name: "FinanceIQ: AI-First Finance Analytics",
      description:
        "AI-first finance analytics over real SEC EDGAR filings for 24 public SaaS companies: a deterministic AI agent over Snowflake-hosted data, a Streamlit UI, and CI on every change.",
      link: "https://github.com/MIHIRY/FinanceIQ-AgentOS",
      skills: ["Python", "AI Agents", "LLM", "Streamlit", "CI"],
    },
{
      name: "ContextType: Adaptive Keyboard System",
      description:
        "Intelligent keyboard interface that provides context-aware text suggestions using LLM technology. Detects writing context (programming, email, chat) and delivers real-time next-word predictions.",
      link: "https://github.com/MIHIRY/HCI-",
      skills: ["React", "TypeScript", "Node.js", "Express.js", "Groq API", "Tailwind CSS"],
    },
{
      name: "LendingClub Credit Risk Model",
      description:
        "Calibrated XGBoost credit-risk model on 837K LendingClub loans (ROC-AUC 0.688), with a cost-based approval policy that saves $9.6M against baseline and an interactive Streamlit app.",
      link: "https://github.com/MIHIRY/lendingclub-credit-risk-analytics",
      skills: ["Python", "XGBoost", "Machine Learning", "Risk Modeling", "Streamlit"],
    },
{
      name: "Hate Speech Detection Using Different Models",
      description:
        "Hate speech detection system using a dataset of over 10,000 entries. Implemented and compared multiple models, including Logistic Regression, SVM, Random Forest, and BERT.",
      link: "https://github.com/MIHIRY/Hate-Speech-Recognition",
      skills: ["Python", "NLTK", "Pandas", "Machine Learning", "Deep Learning"],
    },
{
      name: "PC SKU Demand Forecasting",
      description:
        "Demand forecasting system for personal computer SKUs leveraging statistical and machine learning approaches to predict inventory requirements and optimize stock allocation.",
      link: "https://github.com/MIHIRY/-pc-sku-demand-forecasting",
      skills: ["Python", "Machine Learning", "Forecasting", "Time Series", "Jupyter"],
    },
{
      name: "Drive Failure Streaming Platform",
      description:
        "Event-driven system turning Backblaze hard-drive SMART data into live failure analytics. Telemetry is replayed as Avro events over Kafka, processed by Spark into Iceberg tables, served through Trino and visualised in a Streamlit dashboard, with Airflow scheduling and Great Expectations quality gates. Fully containerized; 500,582 events processed with 0 duplicates and 11/11 quality checks passing.",
      link: "https://github.com/MIHIRY/Drive-Telemetry-Lakehouse",
      skills: ["Kafka", "PySpark", "Apache Iceberg", "Trino", "Docker", "Airflow", "Streamlit"],
    },
{
      name: "Connected-Car Telemetry Platform",
      description:
        "Production-style system that ingests connected-car events, validates them, quarantines bad records and transforms the rest into fleet-monitoring views. Containerized with Docker and orchestrated with Airflow.",
      link: "https://github.com/MIHIRY/-VEHICLE-TELEMETRY-PIPELINE",
      skills: ["Python", "SQL", "Docker", "Airflow", "Snowflake", "Data Quality"],
    },
{
      name: "Parallel Frequent-Itemset Mining (MPI)",
      description:
        "Parallel association rule mining using Apriori, PCY, and SON algorithms with MPI across 10 processes on HPC clusters. Discovers frequently co-purchased product patterns in grocery transactions.",
      link: "https://github.com/MIHIRY/Large-Scale-Frequent-Items",
      skills: ["Python", "MPI", "HPC", "Parallel Algorithms"],
    },
{
      name: "Terrorism Risk Forecasting",
      description:
        "Analyzed global terrorism incidents from 1970–2017 using the Global Terrorism Database. Built predictive models with ANOVA, logistic regression, random forest, and time series forecasting.",
      link: "https://github.com/MIHIRY/Terrorism-Risk-Forecasting-using-R",
      skills: ["R", "Statistical Modeling", "Time Series", "Random Forest", "PCA"],
    },
{
      name: "Neural Networks for POS Tagging & Bigram Language Modeling",
      description:
        "Implements neural networks for Part-of-Speech (POS) tagging and Bigram Language Models to enhance NLP tasks. Explores feature engineering, pretrained embeddings, and deep learning architectures.",
      link: "https://github.com/MIHIRY/Neural-Networks-for-POS-Tagging-Bigram-Language-Modeling/tree/Publication-Certificate",
      skills: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
    },
{
      name: "Word Embeddings Analysis",
      description:
        "This project uses statistical methods such as co-occurrence counting, TF-IDF, and PMI to explore various distributional semantics techniques for analyzing word representations.",
      link: "https://github.com/MIHIRY/Natural-Language-Processing---Word-Embeddings-Analysis",
      skills: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
    }
  ],
  experience: [
    {
      company: "TechTorch",
      title: "Machine Learning Engineer Intern",
      focus: "LLM & ML Systems",
      dateRange: "June 2025 – August 2025",
      bullets: [
        "Designed LLM-powered entity resolution with multi-stage validation and similarity scoring.",
        "Built low-latency entity search using vector embeddings and semantic indexing (<100 ms lookup).",
        "Developed AI-driven merge recommendations with optimized feature engineering.",
        "Cut LLM token costs by ~60% and raised throughput through intelligent pre-filtering and performance tuning.",
        "Architected the scalable CRM data processing behind it, covering 1M+ records with strict data-quality controls.",
      ],
    },
    {
      company: "Apexon – Healthcare Project",
      title: "Software Engineer",
      focus: "Healthcare ML Data",
      dateRange: "May 2024 – July 2024",
      bullets: [
        "Delivered feature-engineered datasets for predictive healthcare models.",
        "Applied statistical validation and anomaly detection to guarantee model-grade data integrity.",
        "Built distributed PySpark and Delta processing for high-volume EHR and ICU data.",
        "Optimized storage and query performance for scalable healthcare analytics workloads.",
        "Built SQL analytical layers for clinical reporting and insight generation.",
      ],
    },
    {
      company: "DBQ Technologies (Client: Bankhaus Scheich)",
      title: "Machine Learning Engineer",
      focus: "Anomaly Detection & Forecasting",
      dateRange: "June 2022 – March 2024",
      bullets: [
        "Implemented ML-based anomaly detection and time-series forecasting for trading oversight.",
        "Applied statistical modeling to identify risk signals and trading-pattern deviations.",
        "Delivered real-time dashboards for liquidity and performance monitoring.",
        "Automated ingestion of multi-source financial trading data.",
        "Designed relational schemas for scalable, performant transaction processing.",
      ],
    },
    {
      company: "University Housing",
      title: "Resident Assistant (RA)",
      dateRange: "May 2025 – June 2026",
      bullets: [
        "Led operations for a 200+ resident community with structured escalation and governance workflows.",
        "Designed systematic communication and incident-tracking processes to improve operational efficiency.",
        "Applied data-driven feedback analysis to optimize engagement and retention strategies.",
        "Resolved high-sensitivity conflicts through structured decision-making and stakeholder alignment.",
        "Demonstrated leadership, ownership, and cross-functional coordination in a high-responsibility environment.",
      ],
    },
  ],
  education: [
    {
      school: "Stony Brook University — Stony Brook, NY",
      /** Compact form for the /projects education card. */
      shortName: "Stony Brook University",
      degree: "Master of Science in Data Science",
      dateRange: "Aug 2024 – Jun 2026",
      achievements: [
        "GPA: 3.84/4.0",
        "Relevant Coursework: Probability, Data Analysis, Natural Language Processing (NLP), Large Language Models, Statistical Learning and Computing (R Language)",
      ],
    },
    {
      school: "Gandhi Institute of Technology and Management (GITAM) — Visakhapatnam, India",
      shortName: "GITAM University",
      degree: "Bachelor of Technology in Computer Science and Engineering",
      dateRange: "Jun 2019 – Jul 2023",
      achievements: [
        "GPA: 3.43",
      ],
    },
  ],
  // ML first. Certificate titles are the issuers' own and stay verbatim.
  // `link` (optional) adds a "Verify ›" link; the URLs match `credentials` above.
  certifications: [
    {
      title: "Machine Learning Specialization",
      issuer: "Coursera — Stanford University",
      date: "2023",
      description: "Comprehensive training in machine learning algorithms and their applications",
    },
    {
      title: "Deep Learning Specialization",
      issuer: "Coursera — DeepLearning.AI",
      date: "2023",
      description: "Advanced study of neural networks and deep learning architectures",
    },
    {
      title: "The Rise of the AI Data Engineer Boot Camp",
      issuer: "DataExpert.io — Zach Wilson",
      date: "2026",
      description: "Applying AI and large language models to production data systems",
      link: "https://learn.dataexpert.io/certification/mihiryanamandra89421/the-rise-of-the-ai-data-engineer-boot-camp-8b5975",
    },
    {
      // Was only on the projects page. Its date is on the Credly badge, not here.
      title: "Google Advanced Data Analytics Professional Certificate",
      issuer: "Google",
      date: "",
      description: "Statistics, regression modelling and machine learning in Python",
      link: "https://www.credly.com/badges/93c20b6e-eff1-402a-bd27-cdc0f2bea81c/public_url",
    },
    {
      title: "Data Science Professional Certificate",
      issuer: "IBM",
      date: "2022",
      description: "Professional certification in data science methodologies and tools",
    },
    {
      title: "Python for Data Science",
      issuer: "DataCamp",
      date: "2022",
      description: "Mastery in Python programming for data analysis and visualization",
    },
  ],
  publications: [
    {
      title: "A Study of Hate Speech Detection Using Different Models",
      venue: "2nd International Conference on Data Science and Artificial Intelligence (ICDSAI)",
      link: "https://link.springer.com/chapter/10.1007/978-3-031-51167-7_9",
    },
    {
      title: "Study of Various Routing and their Security Challenges in Vehicular Ad Hoc Networks",
      venue: "3rd International Conference on Intelligent Systems and Sustainable Computing",
      link: "https://link.springer.com/chapter/10.1007/978-981-97-8355-7_34",
    },
  ],
  // An empty `link` renders the card unclickable, so no dead links until a post is up.
  blogs: [
    {
      title: "Knowledge Graph for Financial Chat Bot",
      description:
        "An exploration of implementing knowledge graphs to enhance the capabilities of financial chatbots, improving context understanding and response accuracy.",
      link: "",
    },
    {
      title: "What Makes Good In-Context Examples for GPT-3? (KNN)",
      description:
        "Analysis of effective in-context learning examples for GPT-3 using K-nearest neighbors approach to understand and optimize prompt engineering.",
      link: "",
    },
    {
      title: "REST: Retrieval-Based Speculative Decoding",
      description:
        "Deep dive into REST methodology for improving text generation through retrieval-based speculative decoding techniques.",
      link: "",
    },
  ],
};

/**
 * Blog posts that have somewhere to go. The Blogs section, and its entries in
 * the header and footer navs, all key off this, so a post appears in all three
 * the moment it gets a link and in none before.
 */
export const publishedBlogs = siteConfig.blogs.filter((blog) => blog.link);
