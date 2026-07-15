// src/pages/home/HomePage.jsx
// Scape Property Intelligence - Complete Interactive Homepage (Accordion Features)

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Award, BarChart2, BookOpen, Building2, CheckCircle,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Clock, Cloud,
  Compass, Droplets, Globe, Heart, MapPin, Menu, Route, Shield,
  Sparkles, Star, TrendingUp, Users, Zap, X, Mail, Phone,
  Eye, Activity, School, TreePine, Search, Bell, MessageSquare,
  Calendar, DollarSign, AlertCircle, Info, CheckSquare, Loader2,
  Landmark, ShieldCheck, Layers, GitBranch, Database, Cpu,
  Monitor, Smartphone, Tablet, Send, Copy, ExternalLink,
  PieChart, LineChart, AreaChart, Radar, Compass as CompassIcon, Briefcase,
  Share2, Download
} from "lucide-react";
import usePropertyAnalyze from "../../hooks/usePropertyAnalyze";
import AnalyzeModals from "../../components/PropertyAnalyze/AnalyzeModals";

// Custom social icons with hover animations
const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" {...props}>
    <path d="M14.5 8.5h2V5.3c-.35-.05-1.54-.15-2.93-.15-2.9 0-4.88 1.77-4.88 5.02v2.63H6v3.6h3.69V22h3.72v-5.6h3.55l.56-3.6h-4.11v-2.3c0-1.04.29-1.75 1.79-1.75Z" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" {...props}>
    <path d="M18.9 3H21l-6.55 7.49L22.2 21h-6.02l-4.72-6.17L5.02 21H2.9l7.02-8.02L2.1 3h6.17l4.26 5.63L18.9 3Zm-1.05 16.17h1.12L7.7 4.76H6.5l11.35 14.41Z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" {...props}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" {...props}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

import styles from "./HomePage.module.css";
import SEO from "../../components/SEO/SEO";


/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const SLIDES = [
  {
    tag: "DROP A PIN, GET A REPORT",
    headline: "Know What A Plot",
    headline2: "Is Really Worth",
    sub: "Drop a pin on the map, or paste a Google Maps link. In seconds you get a plain, evidence backed report on that land: what it's worth, what's nearby, and what could go wrong.",
    img: "/site-images/real-estate-property.jpg",
    stat: { val: "84 / 100", label: "Example plot score" },
    color: "#35606e",
  },
  {
    tag: "PROOF BEFORE A DEPOSIT",
    headline: "Give Buyers Something",
    headline2: "To Actually Trust",
    sub: "Brokers, buyer's agents, and banks all need proof before money moves. A Scape report gives you real comparable sales, title and risk flags, and location data in one document you can hand over.",
    img: "/site-images/hero-im-1.jpg",
    stat: { val: "Under 2 sec", label: "Time to generate a report" },
    color: "#b5602f",
  },
  {
    tag: "ONE PLOT OR YOUR WHOLE BOOK",
    headline: "Check One Listing",
    headline2: "Or Your Entire Portfolio",
    sub: "Score a single plot before you close a deal, or upload a list and check every property you manage at once. Same clear report, every time.",
    img: "/site-images/hero-im.jpeg",
    stat: { val: "12+", label: "Data sources cross checked" },
    color: "#2f5a66",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "You Drop A Pin",
    desc: "Tap a spot on the map, paste a Google Maps link, or type an address. That's the only input we need from you.",
    icon: <MapPin size={24} />,
    detail: "We support any format: GPS coordinates, street address, or even a photo with geotagging."
  },
  {
    step: "02",
    title: "We Pull The Records",
    desc: "Nearby sale prices, access roads, school ratings, flood risk, and other public data for that exact pin get gathered and checked against each other.",
    icon: <Search size={24} />,
    detail: "Our AI cross-references 12+ data sources in real-time to ensure accuracy."
  },
  {
    step: "03",
    title: "We Turn It Into One Score",
    desc: "Everything is weighed into a single 0 to 100 score, and we show you exactly which factors pushed it up or down.",
    icon: <BarChart2 size={24} />,
    detail: "The scoring model is transparent - you can see every factor's contribution."
  },
  {
    step: "04",
    title: "You Get A Report You Can Hand Over",
    desc: "A report lands in seconds, ready to share with a buyer, a bank, or a lawyer. If you're building your own app, you can pull the same data in instead.",
    icon: <CheckSquare size={24} />,
    detail: "Export as PDF, CSV, or JSON. Share directly via email or generate a public link."
  },
];

const FAQS = [
  {
    q: "What actually goes into a plot's score?",
    a: "We combine recent sale prices for similar nearby plots, how easy the land is to access by road, how prices there have moved over the last 6, 12, and 24 months, distance to schools and trading centres, and real risk factors like flood zones and terrain. All of that becomes one score from 0 to 100, and every report shows you which parts of the score came from what.",
    tags: ["Data Sources", "Scoring Model"]
  },
  {
    q: "How long do I wait for a report after I drop a pin?",
    a: "Most reports come back in under two seconds. If someone recently checked a nearby plot, yours may load almost instantly. A brand new area can take five to eight seconds while we pull fresh data for it.",
    tags: ["Speed", "Performance"]
  },
  {
    q: "Can I use this data inside my own app or website?",
    a: "Yes. We give you a free key to test with, and clear limits once you're live so you always know what you're paying for. If you're watching a portfolio, you can also turn on alerts for it.",
    tags: ["API", "Integration"]
  },
  {
    q: "How accurate is the information?",
    a: "Our sale price and market trend data is checked against available land records and holds up about 98% of the time. Risk and infrastructure data come from public and licensed sources and get refreshed on a schedule set by each provider, usually monthly.",
    tags: ["Accuracy", "Trust"]
  },
  {
    q: "Can I check a whole list of plots at once?",
    a: "Yes. Upload a spreadsheet of pins or addresses and get a scored report for each one. If you're on a portfolio plan, we also re-score the whole list automatically every month so you're not checking it by hand.",
    tags: ["Bulk Check", "Portfolio"]
  },
  {
    q: "Which areas do you actually cover?",
    a: "We're built and tested first around Nairobi, Kiambu, and the surrounding towns, with full coverage there. We're adding new regions regularly, so ask us if you need a specific area confirmed before you rely on it.",
    tags: ["Coverage", "Regions"]
  },
];

const TESTIMONIALS = [
  {
    name: "Brian Mwangi",
    role: "Independent Broker",
    company: "Ruiru, Kiambu County",
    quote: "A buyer used to ask me to prove a plot was worth the price. Now I hand them a report before they even ask, and it closes the deal faster.",
    rating: 5,
    image: "/site-images/testimonial-1.jpg",
    date: "2 weeks ago"
  },
  {
    name: "Joshua DuBois",
    role: "Portfolio Manager",
    company: "Aerocast LLC",
    quote: "Our 300 unit portfolio now flags a problem the week it shows up, instead of waiting for the annual audit to catch it.",
    rating: 5,
    image: "/site-images/testimonial-2.jpg",
    date: "1 month ago"
  },
  {
    name: "Pedro Madeira Gomes",
    role: "CEO",
    company: "GoGuess, Portugal",
    quote: "Showing buyers a clear, honest score on every listing made them trust us more, and we started getting more inquiries because of it.",
    rating: 5,
    image: "/site-images/testimonial-3.jpg",
    date: "3 months ago"
  },
  {
    name: "Omar AlQabandi",
    role: "CEO",
    company: "BilBio Kuwait",
    quote: "The data is reliable, it arrives fast, and the team behind it actually understands real estate, not just software.",
    rating: 5,
    image: "/site-images/testimonial-4.jpg",
    date: "5 months ago"
  },
];

const INDUSTRIES = [
  {
    icon: <Building2 size={32} />,
    name: "Brokers & Agents",
    stat: "Close a sale with proof, not promises",
    color: "#35606e",
    insight: "Get instant property intelligence to win listings and close deals faster.",
    metrics: ["2.5x faster closings", "35% higher conversion"]
  },
  {
    icon: <ShieldCheck size={32} />,
    name: "Buyer's Agents",
    stat: "Protect your client before they sign",
    color: "#b5602f",
    insight: "Verify property claims before your client commits to a purchase.",
    metrics: ["98% accuracy rate", "30+ risk factors checked"]
  },
  {
    icon: <Landmark size={32} />,
    name: "Banks & Lenders",
    stat: "Check collateral before you approve",
    color: "#2f5a66",
    insight: "Make smarter lending decisions with comprehensive property data.",
    metrics: ["40% faster approvals", "15% lower default rate"]
  },
  {
    icon: <Award size={32} />,
    name: "Lawyers & Surveyors",
    stat: "Back up due diligence with real data",
    color: "#35606e",
    insight: "Strengthen your legal position with verified property intelligence.",
    metrics: ["5x more thorough", "2x faster due diligence"]
  },
];

// Features data – all descriptions expanded with specific, real-world detail
const FEATURES = [
  {
    icon: <BarChart2 size={28} />,
    title: "Real Sales, Not Estimates",
    desc: "We match your plot to nearby land that actually changed hands, not a rough guess or an automated prediction. Our system pulls actual transaction records from land registries and compares them with properties of similar size, location, and zoning within a 2‑kilometre radius that sold in the last 12 months. We then adjust for differences in access, utilities, and time since sale to give you a reliable benchmark. This means your report is rooted in facts, not algorithms guessing in the dark, and you can defend the value in front of any buyer, bank, or court.",
    cta: "See How It Works",
    link: "/property-intel",
    color: "#35606e",
    image: "/site-images/land-prop-images.jpeg"
  },
  {
    icon: <MapPin size={28} />,
    title: "Grounded In Real Places",
    desc: "We never aggregate data over large regions or rely on zip‑code averages. Every score we produce is anchored to one specific latitude and longitude – the exact pin you dropped. We use precise geocoding to measure distances to schools, hospitals, trading centres, and major roads, and we assess the quality of local infrastructure like water supply and electricity. The score also reflects the terrain, flood risk, and soil type for that precise location. This means you get data that is actually relevant to your decision, not generic numbers that could apply to any plot in the area.",
    cta: "Check A Property",
    link: "/property-intel",
    color: "#b5602f",
    image: "/site-images/image-hero-3.jpeg"
  },
  {
    icon: <TrendingUp size={28} />,
    title: "Grows With Your Book",
    desc: "Start by checking a single plot to see how it works. When you need to scale, you can upload a CSV file with hundreds of properties and receive a scored report for each one in under a minute. Our portfolio plans automatically re‑score your entire list every month, so you always know which assets are performing and which are losing value. You can set custom alerts for score changes, market shifts, or risk updates, and we give you a unified dashboard to monitor everything. Whether you manage 3 units or 3,000, the platform adapts to your needs without changing how you work.",
    cta: "View Plans",
    link: "/pricing",
    color: "#2f5a66",
    image: "/site-images/hero-im-2.avif"
  },
  {
    icon: <Share2 size={28} />,
    title: "Ready To Share",
    desc: "Every report is built to be handed straight to a buyer, a bank, or a lawyer. You can export it as a polished PDF for print, as CSV for data analysis, or as JSON for integration into your own systems. With one click you can generate a public link that gives anyone access to the same information, with full control over expiration and permissions. The report includes a clear breakdown of the property score, a list of comparable sales with distances and dates, a risk assessment covering flood, terrain, and access, and a map showing nearby amenities. This professional format meets the standards of financial institutions and legal professionals, so you can share it confidently.",
    cta: "Explore Reports",
    link: "/property-intel",
    color: "#7a5c3a",
    image: "/site-images/real-estate-property.jpg"
  }
];

/* ═══════════════════════════════════════════════════════════════
   ENHANCED ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.7, 
      ease: [0.22, 1, 0.36, 1],
      damping: 20,
      stiffness: 100
    } 
  }
};

const fadeDown = {
  hidden: { opacity: 0, y: -40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.7, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
};

const slideLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
};

const slideRight = {
  hidden: { opacity: 0, x: 80 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.7, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.1, 
      delayChildren: 0.15,
      staggerDirection: 1
    } 
  }
};

const springScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      type: "spring", 
      stiffness: 280, 
      damping: 22,
      mass: 0.8
    } 
  }
};

const expandVariants = {
  hidden: { opacity: 0, maxHeight: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    maxHeight: 800,
    scale: 1,
    transition: { 
      duration: 0.4, 
      ease: [0.22, 1, 0.36, 1],
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    maxHeight: 0,
    scale: 0.95,
    transition: { 
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const VIEWPORT = { once: true, amount: 0.15 };

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [testi, setTesti] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [expandedFeature, setExpandedFeature] = useState(null);
  const [activeIndustry, setActiveIndustry] = useState(0);
  const [activeProcStep, setActiveProcStep] = useState(null);
  const [ripples, setRipples] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "", human: false });
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatLog, setChatLog] = useState([{ from: "bot", text: "Hi! I'm your Scape assistant. Drop an address or ask me anything about property intelligence." }]);
  const analyze = usePropertyAnalyze();
  const {
    address: searchTerm, setAddress: setSearchTerm, isSearching,
    result: searchResults, statusMessage: searchStatusMessage, errorMessage: searchErrorMessage,
    run: handleSearch,
  } = analyze;
  const [hoveredIndustry, setHoveredIndustry] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [parallaxOffset, setParallaxOffset] = useState(0);

  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setPageLoaded(true), 650);
    return () => clearTimeout(t);
  }, []);

  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const searchBoxRef = useRef(null);
  const location = useLocation();

  // Coming back from PaymentCallback's "Submit another Request" button --
  // scroll straight to the pin-submission hero section instead of landing
  // at the top of the marketing page.
  useEffect(() => {
    if (location.state?.scrollToPin && heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.state]);

  // Nudge the page up slightly once a search starts, so the processing
  // steps/bar that expand below the input aren't cut off below the fold.
  useEffect(() => {
    if (isSearching && searchBoxRef.current) {
      searchBoxRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isSearching]);

  // Small, self-contained type/hold/delete loop for the hero H1 --
  // deliberately separate from the old SLIDES/22s carousel machinery
  // below (that stays inert), since this cycles two short phrases on a
  // much snappier cadence than a 3-part marketing headline needs.
  const HERO_PHRASES = ["Paste a location pin", "Check a property"];
  const [heroTypedText, setHeroTypedText] = useState("");

  useEffect(() => {
    let cancelled = false;
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let timeoutId;

    const tick = () => {
      if (cancelled) return;
      const current = HERO_PHRASES[phraseIdx];
      if (!deleting) {
        charIdx += 1;
        setHeroTypedText(current.slice(0, charIdx));
        if (charIdx >= current.length) {
          deleting = true;
          timeoutId = setTimeout(tick, 14000);
          return;
        }
        timeoutId = setTimeout(tick, 45);
      } else {
        charIdx -= 1;
        setHeroTypedText(current.slice(0, charIdx));
        if (charIdx <= 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % HERO_PHRASES.length;
          timeoutId = setTimeout(tick, 300);
          return;
        }
        timeoutId = setTimeout(tick, 25);
      }
    };

    timeoutId = setTimeout(tick, 300);
    return () => { cancelled = true; clearTimeout(timeoutId); };
  }, []);

  // Types tag + headline only, restarting each time the slide changes.
  const [tagTyped, setTagTyped] = useState("");
  const [headlineTyped, setHeadlineTyped] = useState("");
  const [headline2Typed, setHeadline2Typed] = useState("");

  useEffect(() => {
    let cancelled = false;
    setTagTyped("");
    setHeadlineTyped("");
    setHeadline2Typed("");
    const typeString = (str, setter, onDone) => {
      let i = 0;
      const id = setInterval(() => {
        if (cancelled) { clearInterval(id); return; }
        i += 1;
        setter(str.slice(0, i));
        if (i >= str.length) {
          clearInterval(id);
          if (onDone) onDone();
        }
      }, 28);
    };
    typeString(SLIDES[slide].tag, setTagTyped, () => {
      typeString(SLIDES[slide].headline, setHeadlineTyped, () => {
        typeString(SLIDES[slide].headline2, setHeadline2Typed);
      });
    });
    return () => { cancelled = true; };
  }, [slide]);

  // Auto-slide effects
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 22000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTesti(t => (t + 1) % TESTIMONIALS.length), 7000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveIndustry(p => (p + 1) % INDUSTRIES.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 500);
      setParallaxOffset(window.scrollY * 0.3);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Enhanced Canvas data flow animation (unchanged)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const nodes = [
      { x: 60, y: 120, label: 'Land Records', color: '#35606e' },
      { x: 60, y: 270, label: 'Sales Data', color: '#b5602f' },
      { x: 60, y: 420, label: 'Risk Factors', color: '#2f5a66' },
      { x: 760, y: 270, label: 'Your Report', color: '#b5602f' },
    ];

    const particles = Array.from({ length: 40 }, () => ({
      start: Math.floor(Math.random() * 3),
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.015,
      size: 2 + Math.random() * 4,
      waveOffset: Math.random() * Math.PI * 2,
    }));

    const drawFlow = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background grid
      ctx.strokeStyle = 'rgba(53, 96, 110, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw connection lines with glow
      for (let i = 0; i < 3; i++) {
        const gradient = ctx.createLinearGradient(
          nodes[i].x, nodes[i].y,
          nodes[3].x, nodes[3].y
        );
        gradient.addColorStop(0, 'rgba(53, 96, 110, 0.15)');
        gradient.addColorStop(0.5, 'rgba(181, 96, 47, 0.2)');
        gradient.addColorStop(1, 'rgba(53, 96, 110, 0.15)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 8]);
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        
        const midX = 400 + Math.sin(time + i) * 20;
        const midY = (nodes[i].y + nodes[3].y) / 2 + Math.sin(time * 0.7 + i * 1.5) * 15;
        ctx.quadraticCurveTo(midX, midY, nodes[3].x, nodes[3].y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw nodes with glow
      nodes.forEach((node, i) => {
        const isTarget = i === 3;
        
        const glow = ctx.createRadialGradient(
          node.x, node.y, 5,
          node.x, node.y, 35
        );
        glow.addColorStop(0, `${node.color}40`);
        glow.addColorStop(1, `${node.color}00`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 35, 0, Math.PI * 2);
        ctx.fill();

        const gradient = ctx.createRadialGradient(
          node.x - 4, node.y - 4, 2,
          node.x, node.y, 16
        );
        gradient.addColorStop(0, isTarget ? '#b5602f' : '#35606e');
        gradient.addColorStop(1, isTarget ? '#7a3d1f' : '#1a3d47');
        
        ctx.shadowBlur = 25;
        ctx.shadowColor = `${node.color}60`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(node.x - 3, node.y - 5, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.font = '600 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(node.label, node.x, node.y - 24);
        
        if (isTarget) {
          ctx.fillStyle = '#b5602f';
          ctx.font = '500 10px Inter, sans-serif';
          ctx.textBaseline = 'top';
          ctx.fillText('Generated', node.x, node.y + 22);
        }
      });

      // Draw animated particles
      particles.forEach(p => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        const start = nodes[p.start];
        const end = nodes[3];
        const t = p.progress;
        const waveY = Math.sin(t * Math.PI * 4 + p.waveOffset + time) * 5;
        
        const x = (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * 400 + t * t * end.x;
        const y = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * start.y + t * t * end.y + waveY;

        const alpha = 0.3 + 0.7 * (1 - Math.abs(t - 0.5) * 2);
        const size = p.size * (0.5 + 0.5 * (1 - Math.abs(t - 0.5) * 2));

        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(53, 96, 110, ${alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(53, 96, 110, ${alpha * 0.8})`;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(x, y, size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(53, 96, 110, ${alpha * 0.1})`;
        ctx.fill();
      });

      // Pulse rings
      const pulseSize = 20 + Math.sin(time * 2) * 5;
      ctx.strokeStyle = `rgba(181, 96, 47, ${0.1 + 0.1 * Math.sin(time * 2)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(nodes[3].x, nodes[3].y, pulseSize + 10, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.strokeStyle = `rgba(181, 96, 47, ${0.05 + 0.05 * Math.sin(time * 2 + 0.5)})`;
      ctx.beginPath();
      ctx.arc(nodes[3].x, nodes[3].y, pulseSize + 25, 0, Math.PI * 2);
      ctx.stroke();

      animationId = requestAnimationFrame(drawFlow);
    };

    drawFlow();
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Handlers
  const addRipple = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples(p => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setRipples(p => p.filter(r => r.id !== id)), 700);
  }, []);

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Please enter your name";
    if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Please enter a valid email address";
    if (!formData.phone.trim()) e.phone = "Please enter your phone number";
    if (!formData.subject.trim()) e.subject = "Please add a subject";
    if (!formData.message.trim()) e.message = "Please write a message";
    if (!formData.human) e.human = "Please confirm you're human";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }
    setLoading(true);
    setSubmitError(null);
    try {
      await new Promise((res) => setTimeout(res, 1200));
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "", human: false });
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendChat = () => {
    if (!chatMsg.trim()) return;
    setChatLog(l => [...l, { from: "user", text: chatMsg }]);
    setChatMsg("");
    setTimeout(() => {
      const responses = [
        "For a full scored report on that address, use the Property Check tool above. We're also happy to walk you through a live demo.",
        "Great question! Let me get you the most relevant information about that property...",
        "I see what you're looking for. Here's what Scape can do with that property data...",
        "Our intelligence would analyze that property for risk factors, market value, and location benefits in under 2 seconds."
      ];
      setChatLog(l => [...l, { from: "bot", text: responses[Math.floor(Math.random() * responses.length)] }]);
    }, 600 + Math.random() * 400);
  };

  const renderStars = (n = 5) => {
    return [...Array(n)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
      >
        <Star size={16} fill="#b5602f" color="#b5602f" />
      </motion.div>
    ));
  };

  const change = (f, v) => setFormData(p => ({ ...p, [f]: v }));

  return (
    
    <>
    <SEO title="Property Intelligence Reports for Kenyan Real Estate" description="Instant parcel-level reports with land value benchmarks, accessibility and investment scoring, school and hospital proximity, and air quality data for any location in Kenya." path="/" />
    <div className={styles.page}>
      {/* ─── PAGE LOAD ANIMATION ─── */}
      <AnimatePresence>
        {!pageLoaded && (
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#0f2027",
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <motion.div style={{ textAlign: "center" }}>
              <motion.img
                src="/site-images/logo.svg"
                alt="Scape"
                style={{ width: 64, height: 64, marginBottom: 16 }}
                animate={{ 
                  opacity: [0.3, 1, 0.3], 
                  scale: [0.9, 1.05, 0.9],
                  rotate: [0, 360, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" }
                }}
              />
              <motion.div
                style={{
                  width: 120,
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, #b5602f, transparent)',
                  borderRadius: 2,
                  margin: '0 auto'
                }}
                animate={{ 
                  scaleX: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── NAVBAR (logo removed) ─── */}
      <motion.header 
        className={styles.navbar}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={`${styles.container} ${styles.navInner}`}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className={styles.brand}>
              <span>Scape <em>Property Intelligence</em></span>
            </Link>
          </motion.div>
          <nav className={styles.navLinks}>
            <div className={styles.navItem}>
              <Link to="/property-intel" className={styles.navLink}>
                <Search size={14} /> Check A Property
              </Link>
            </div>

            <div className={styles.navItem}>
              <button type="button" className={styles.navLink}>
                Solutions <ChevronDown size={14} />
              </button>
              <div className={styles.navDropdownPanel}>
                <Link to="/solutions/brokers" className={styles.navDropdownLink}>
                  <Building2 size={16} />
                  <div>
                    <strong>Brokers & Agents</strong>
                    <span>Close a sale with proof, not promises</span>
                  </div>
                </Link>
                <Link to="/solutions/buyers-agents" className={styles.navDropdownLink}>
                  <ShieldCheck size={16} />
                  <div>
                    <strong>Buyer's Agents</strong>
                    <span>Protect your client before they sign</span>
                  </div>
                </Link>
                <Link to="/solutions/lenders" className={styles.navDropdownLink}>
                  <Landmark size={16} />
                  <div>
                    <strong>Banks & Lenders</strong>
                    <span>Check collateral before you approve</span>
                  </div>
                </Link>
                <Link to="/solutions/legal" className={styles.navDropdownLink}>
                  <Award size={16} />
                  <div>
                    <strong>Lawyers & Surveyors</strong>
                    <span>Back up due diligence with real data</span>
                  </div>
                </Link>
              </div>
            </div>

            <div className={styles.navItem}>
              <Link to="/pricing" className={styles.navLink}>Pricing</Link>
            </div>

            <div className={styles.navItem}>
              <button type="button" className={styles.navLink}>
                Company <ChevronDown size={14} />
              </button>
              <div className={styles.navDropdownPanel}>
                <Link to="/about" className={styles.navDropdownLink}>
                  <Users size={16} />
                  <div>
                    <strong>About</strong>
                    <span>Who we are and why we built Scape</span>
                  </div>
                </Link>
                <Link to="/blog" className={styles.navDropdownLink}>
                  <BookOpen size={16} />
                  <div>
                    <strong>Blog</strong>
                    <span>Market data and product updates</span>
                  </div>
                </Link>
                <Link to="/careers" className={styles.navDropdownLink}>
                  <Briefcase size={16} />
                  <div>
                    <strong>Careers</strong>
                    <span>Join the team building Scape</span>
                  </div>
                </Link>
                <Link to="/contact" className={styles.navDropdownLink}>
                  <Mail size={16} />
                  <div>
                    <strong>Contact</strong>
                    <span>Get in touch with our team</span>
                  </div>
                </Link>
              </div>
            </div>
          </nav>
          <div className={styles.navRight}>
            <motion.div whileHover={{ scale: 1.05 }}><Link to="/login" className={styles.navSignIn}>Sign In</Link></motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(181, 96, 47, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/signup" className={styles.navSignUp}>Get Started</Link>
            </motion.div>
            <motion.button 
              className={styles.burger} 
              onClick={() => setNavOpen(!navOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Menu size={22} />
            </motion.button>
          </div>
        </div>
        <AnimatePresence>
          {navOpen && (
            <motion.div
              className={styles.mobileMenu}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
                <Link to="/property-intel" onClick={() => setNavOpen(false)}>
                  <Search size={14} /> Check A Property
                </Link>
              </motion.div>
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Link to="/pricing" onClick={() => setNavOpen(false)}>Pricing</Link>
              </motion.div>
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <Link to="/blog" onClick={() => setNavOpen(false)}>Blog</Link>
              </motion.div>
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Link to="/about" onClick={() => setNavOpen(false)}>About</Link>
              </motion.div>
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <Link to="/login" onClick={() => setNavOpen(false)}>Sign In</Link>
              </motion.div>
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link to="/signup" onClick={() => setNavOpen(false)} className={styles.mobileSignUp}>
                  Get Started Free
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: pageLoaded ? 1 : 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >

      <main>
        {/* ─── HERO (workspace-style, matches the logged-in dashboard) ─── */}
        <section className={styles.hero} ref={heroRef}>
          <div className={styles.heroGridBg} />

          <div className={`${styles.container} ${styles.heroInner}`}>
            <div className={styles.heroLeft}>
              <span className={styles.heroEyebrow}>
                <Sparkles size={12} /> Property Intelligence Workspace
              </span>

              <h1 className={styles.heroTitle}>
                {heroTypedText}
                <span className={styles.heroTypedCursor} />
              </h1>
              <p className={styles.heroSub}>
                Drop a pin on the map, or paste a Google Maps link. Get a scored,
                evidence backed report on that land in seconds -- the same tool
                your dashboard uses.
              </p>

              <div className={styles.heroSearch} ref={searchBoxRef}>
                <div className={styles.searchInput}>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Paste a Google Maps pin, or type an address, to check it now"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button onClick={handleSearch} disabled={isSearching}>
                    {isSearching ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                        <Loader2 size={18} />
                      </motion.div>
                    ) : (
                      <Search size={18} />
                    )}
                    <span>Analyze</span>
                  </button>
                </div>

                <AnimatePresence>
                  {isSearching && (
                    <motion.div
                      className={styles.searchProcessing}
                      initial={{ opacity: 0, maxHeight: 0 }}
                      animate={{ opacity: 1, maxHeight: 200 }}
                      exit={{ opacity: 0, maxHeight: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className={styles.processingSteps}>
                        {[
                          { label: "Locating property...", delay: 0.2 },
                          { label: "Analyzing comparable sales...", delay: 0.7 },
                          { label: "Checking risk factors...", delay: 1.2 },
                          { label: "Generating report...", delay: 1.7 }
                        ].map((step, idx) => (
                          <motion.div
                            key={idx}
                            className={styles.processingStep}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: step.delay }}
                          >
                            <motion.span
                              className={styles.stepDot}
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: idx * 0.2 }}
                            />
                            {step.label}
                          </motion.div>
                        ))}
                      </div>
                      <div className={styles.processingBar}>
                        <motion.div
                          className={styles.processingFill}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2.5, ease: 'easeInOut' }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {searchStatusMessage && isSearching && (
                  <motion.div
                    className={styles.searchResults}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ display: "inline-flex" }}>
                      <Loader2 size={16} />
                    </motion.span>
                    {searchStatusMessage}
                  </motion.div>
                )}

                {searchErrorMessage && !isSearching && (
                  <motion.div
                    className={styles.searchResults}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ color: "#b3392b" }}
                  >
                    {searchErrorMessage}
                  </motion.div>
                )}

                {searchResults?.pdfUrl && !isSearching && (
                  <motion.div
                    className={styles.searchResults}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <div className={styles.resultHeader}>
                      <span className={styles.resultLabel}>Your report is ready</span>
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <a href={searchResults.pdfUrl} target="_blank" rel="noopener noreferrer" className={styles.viewFullReport}>
                        View your Listing Details <Download size={14} />
                      </a>
                    </motion.div>
                  </motion.div>
                )}
              </div>

              <AnalyzeModals {...analyze} />

              <div className={styles.heroActions}>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className={styles.ctaWrapper}>
                  <a href="https://app.scapedatasolutions.com/signup" className={styles.ctaPrimary} onClick={addRipple}>
                    {ripples.map(r => (
                      <motion.span
                        key={r.id}
                        className={styles.ripple}
                        style={{ left: r.x, top: r.y }}
                        initial={{ scale: 0, opacity: 0.5 }}
                        animate={{ scale: 4, opacity: 0 }}
                        transition={{ duration: 0.7 }}
                      />
                    ))}
                    Open Full Workspace <ArrowRight size={16} />
                  </a>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <a href="https://app.scapedatasolutions.com/sample_report.pdf" target="_blank" rel="noopener noreferrer" className={styles.ctaGhost}>
                    <Eye size={15} /> See Example Report
                  </a>
                </motion.div>
              </div>
            </div>

            <div className={styles.heroRight}>
              <motion.div
                className={styles.previewCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className={styles.previewHeader}>
                  <span>Sample report</span>
                  <span className={styles.previewBadge}>Example</span>
                </div>
                <div className={styles.previewScoreRow}>
                  <div className={styles.previewScoreCircle}>84</div>
                  <div>
                    <strong>Investment score</strong>
                    <p>Kiambu Road, Ruiru — 0.4 acres</p>
                  </div>
                </div>
                <div className={styles.previewFactors}>
                  {[
                    { label: "Access road", val: "Tarmac, 80m away" },
                    { label: "Nearest school", val: "1.2 km" },
                    { label: "Flood risk", val: "Low" },
                    { label: "Price vs comparable sales", val: "6% below average" },
                  ].map((f, i) => (
                    <div key={i} className={styles.previewFactorRow}>
                      <span><CheckCircle size={13} /> {f.label}</span>
                      <strong>{f.val}</strong>
                    </div>
                  ))}
                </div>
              </motion.div>

              <div className={styles.heroStatsRow}>
                {[
                  { val: "12+", label: "Data sources" },
                  { val: "98%", label: "Data accuracy" },
                  { val: "<2s", label: "Report time" }
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    className={styles.heroStatCard}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    whileHover={{ y: -3 }}
                  >
                    <span className={styles.heroStatVal}>{stat.val}</span>
                    <span className={styles.heroStatLbl}>{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── INDUSTRIES SECTION ─── */}
        <motion.section
          className={`${styles.sec} ${styles.secNavy}`}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
        >
          <div className={styles.container}>
            <motion.div
              className={styles.secHead}
              variants={fadeUp}
            >
              <motion.h3 
                className={styles.secTitleLight}
                whileHover={{ scale: 1.02 }}
              >
                Built For Everyone Who Has To Vouch For A Plot
              </motion.h3>
            </motion.div>

            <motion.div
              className={styles.industryGrid}
              variants={staggerContainer}
            >
              {INDUSTRIES.map((ind, i) => (
                <motion.div
                  key={i}
                  className={`${styles.industryCard}${activeIndustry === i ? " " + styles.industryCardOn : ""}`}
                  variants={springScale}
                  onClick={() => setActiveIndustry(i)}
                  onHoverStart={() => setHoveredIndustry(i)}
                  onHoverEnd={() => setHoveredIndustry(null)}
                  whileHover={{ y: -12, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                  style={{ 
                    borderColor: activeIndustry === i ? ind.color : undefined,
                    boxShadow: hoveredIndustry === i ? `0 12px 30px ${ind.color}20` : undefined
                  }}
                >
                  <motion.div
                    className={styles.indIcon}
                    style={{ color: ind.color }}
                    animate={{
                      scale: activeIndustry === i || hoveredIndustry === i ? 1.15 : 1,
                      rotate: activeIndustry === i || hoveredIndustry === i ? 8 : 0,
                      y: activeIndustry === i || hoveredIndustry === i ? -4 : 0
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    {ind.icon}
                  </motion.div>
                  <h4 className={styles.indName}>{ind.name}</h4>
                  <p className={styles.indStat} style={{ color: ind.color }}>{ind.stat}</p>
                  <AnimatePresence>
                    {(activeIndustry === i || hoveredIndustry === i) && (
                      <motion.div
                        className={styles.indInsight}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={expandVariants}
                        style={{ overflow: 'hidden' }}
                      >
                        <motion.p 
                          className={styles.indInsightText}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {ind.insight}
                        </motion.p>
                        <motion.div 
                          className={styles.indMetrics}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {ind.metrics.map((metric, j) => (
                            <motion.span 
                              key={j} 
                              className={styles.indMetric}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3 + j * 0.1, type: "spring" }}
                            >
                              {metric}
                            </motion.span>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* ─── FEATURES SECTION – ACCORDION ─── */}
        <motion.section
          className={`${styles.sec} ${styles.secGrey}`}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
        >
          <div className={styles.container}>
            <motion.div
              className={styles.secHead}
              variants={fadeUp}
            >
              <motion.h3 
                className={styles.secTitle}
                whileHover={{ scale: 1.02 }}
              >
                Why Scape?
              </motion.h3>
            </motion.div>

            <div className={styles.faqContainer}>
              <div className={styles.faqList}>
                {FEATURES.map((feature, i) => {
                  const isOpen = expandedFeature === i;
                  return (
                    <motion.div
                      key={i}
                      className={styles.faqBlock}
                      variants={fadeUp}
                      custom={i}
                      whileInView="visible"
                      viewport={VIEWPORT}
                      initial="hidden"
                    >
                      <div
                        className={styles.faqQ}
                        onClick={() => setExpandedFeature(isOpen ? null : i)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ color: feature.color }}>{feature.icon}</span>
                          <strong>{feature.title}</strong>
                        </span>
                        <span>{isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</span>
                      </div>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            className={styles.faqA}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            style={{ overflow: "hidden" }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                              <p>{feature.desc}</p>
                              {feature.image && (
                                <img 
                                  src={feature.image} 
                                  alt={feature.title} 
                                  style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
                                />
                              )}
                              <div>
                                <Link to={feature.link} className={styles.splitCTA}>
                                  {feature.cta} <ArrowRight size={16} />
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ─── REPORT SECTION ─── */}
        <motion.section
          className={`${styles.sec} ${styles.secGrey}`}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
        >
          <div className={styles.container}>
            <motion.div
              className={styles.secHead}
              variants={fadeUp}
            >
              <motion.h3 
                className={styles.secTitle}
                whileHover={{ scale: 1.02 }}
              >
                Every Score, Fully Explained
              </motion.h3>
            </motion.div>

            <div className={styles.reportContent}>
              <motion.div
                className={styles.reportVisual}
                variants={slideLeft}
              >
                <canvas ref={canvasRef} width={800} height={500} className={styles.dataFlowCanvas} />
              </motion.div>

              <motion.div
                className={styles.reportExplanation}
                variants={slideRight}
              >
                <div className={styles.reportParagraph}>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={VIEWPORT}
                  >
                    We don't just hand you a number, we show you the full story behind it.
                    Your score is built from the exact pin you dropped: recent sale prices of
                    nearby plots, how easy the land is to reach by road, how prices in that area
                    have moved over the last 6, 12, and 24 months, and real risk factors like
                    flood zones, terrain, and how far the plot sits from the nearest trading
                    centre.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    viewport={VIEWPORT}
                  >
                    Every part of the 0 to 100 score is labeled, so a buyer, a bank, or a
                    lawyer can see exactly what raised it or lowered it, not just trust our word.
                    Past the score, you get a full picture of the surrounding area: the closest
                    schools, markets, main roads, and water sources, ranked with real distances.
                  </motion.p>
                  <div className={styles.reportHighlights}>
                    {[
                      { title: "Real Sales Data", desc: "Actual comparable sales, not estimates" },
                      { title: "Exact Location", desc: "Specific to your property pin" },
                      { title: "Risk Assessment", desc: "Flood, terrain, access factors" }
                    ].map((item, idx) => (
                      <motion.div 
                        key={idx}
                        className={styles.reportHighlight}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + idx * 0.15, type: "spring" }}
                        viewport={VIEWPORT}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* ─── PROCESS SECTION ─── */}
        <motion.section
          className={`${styles.sec} ${styles.secGrey}`}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
        >
          <div className={styles.container}>
            <motion.div
              className={styles.secHead}
              variants={fadeUp}
            >
              <motion.h3 
                className={styles.secTitle}
                whileHover={{ scale: 1.02 }}
              >
                What Happens After You Search
              </motion.h3>
            </motion.div>

            <div className={styles.processContainer}>
              <div className={styles.processTimeline}>
                {PROCESS.map((step, i) => (
                  <motion.div
                    key={i}
                    className={`${styles.processStep}${activeProcStep === i ? " " + styles.processStepOn : ""}`}
                    variants={slideLeft}
                    custom={i}
                    onClick={() => setActiveProcStep(activeProcStep === i ? null : i)}
                    whileHover={{ x: 12 }}
                    style={{
                      borderLeftColor: activeProcStep === i ? '#b5602f' : '#ddd'
                    }}
                  >
                    <motion.div
                      className={styles.processNumber}
                      animate={{
                        scale: activeProcStep === i ? 1.15 : 1,
                        backgroundColor: activeProcStep === i ? '#b5602f20' : 'transparent',
                        borderColor: activeProcStep === i ? '#b5602f' : '#ddd'
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {activeProcStep === i ? step.icon : step.step}
                    </motion.div>
                    <div className={styles.processContent}>
                      <motion.h4 
                        className={styles.processTitle}
                        animate={{
                          color: activeProcStep === i ? '#b5602f' : '#222'
                        }}
                      >
                        {step.title}
                      </motion.h4>
                      <p className={styles.processDesc}>{step.desc}</p>
                      <AnimatePresence>
                        {activeProcStep === i && (
                          <motion.div
                            className={styles.processDetail}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={expandVariants}
                            style={{ overflow: 'hidden' }}
                          >
                            <span>{step.detail}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className={styles.processIllustration}
                variants={scaleIn}
              >
                <motion.div 
                  className={styles.processIllustrationContent}
                  animate={{ 
                    boxShadow: [
                      "0 0 0 0 rgba(53, 96, 110, 0.1)",
                      "0 0 0 20px rgba(53, 96, 110, 0)",
                      "0 0 0 0 rgba(53, 96, 110, 0.1)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div 
                    className={styles.processIlluIcon}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Database size={48} />
                  </motion.div>
                  <div className={styles.processIlluStats}>
                    {[
                      { num: "12+", label: "Data Sources" },
                      { num: "<2s", label: "Response Time" },
                      { num: "98%", label: "Accuracy" }
                    ].map((stat, idx) => (
                      <motion.div 
                        key={idx}
                        className={styles.processIlluStat}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.15 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <motion.span 
                          className={styles.processIlluNum}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.3 }}
                        >
                          {stat.num}
                        </motion.span>
                        <span>{stat.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* ─── FAQ SECTION ─── */}
        <motion.section
          className={`${styles.sec} ${styles.secGrey}`}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
        >
          <div className={styles.container}>
            <motion.div
              className={styles.secHead}
              variants={fadeUp}
            >
              <motion.h3 
                className={styles.secTitle}
                whileHover={{ scale: 1.02 }}
              >
                Questions People Actually Ask
              </motion.h3>
            </motion.div>

            <div className={styles.faqContainer}>
              <div className={styles.faqList}>
                {FAQS.map((faq, i) => {
                  const isOpen = expandedFaq === i;
                  return (
                    <motion.div
                      key={i}
                      className={styles.faqBlock}
                      variants={fadeUp}
                      custom={i}
                      whileInView="visible"
                      viewport={VIEWPORT}
                      initial="hidden"
                    >
                      <h4
                        className={styles.faqQ}
                        onClick={() => setExpandedFaq(isOpen ? null : i)}
                      >
                        {faq.q}
                      </h4>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.p
                            className={styles.faqA}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            style={{ overflow: "hidden" }}
                          >
                            {faq.a}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ─── TESTIMONIALS ─── */}
        <motion.section
          className={styles.sec}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
        >
          <div className={styles.container}>
            <motion.div
              className={styles.secHead}
              variants={fadeUp}
            >
              <motion.h3 
                className={styles.secTitle}
                whileHover={{ scale: 1.02 }}
              >
                What Our Clients Say
              </motion.h3>
            </motion.div>

            <div className={styles.testiWrap}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={testi}
                  className={styles.testiCard}
                  initial={{ opacity: 0, x: 40, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -40, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ 
                    boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
                    y: -4
                  }}
                >
                  <div className={styles.testiHeader}>
                    <div className={styles.testiAuthor}>
                      <div>
                        <strong className={styles.testiName}>{TESTIMONIALS[testi].name}</strong>
                        <p className={styles.testiRole}>{TESTIMONIALS[testi].role}, {TESTIMONIALS[testi].company}</p>
                      </div>
                    </div>
                    <div className={styles.testiDate}>{TESTIMONIALS[testi].date}</div>
                  </div>
                  <div className={styles.stars}>{renderStars(TESTIMONIALS[testi].rating)}</div>
                  <motion.blockquote 
                    className={styles.testiQ}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    "{TESTIMONIALS[testi].quote}"
                  </motion.blockquote>
                </motion.div>
              </AnimatePresence>

              <div className={styles.testiNav}>
                <motion.button 
                  className={styles.testiBtn} 
                  onClick={() => setTesti(t => (t - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                  whileHover={{ scale: 1.1, color: "var(--amber)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft size={18} />
                </motion.button>
                <div className={styles.testiDots}>
                  {TESTIMONIALS.map((_, i) => (
                    <motion.span
                      key={i}
                      className={`${styles.tDot}${i === testi ? " " + styles.tDotOn : ""}`}
                      onClick={() => setTesti(i)}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.8 }}
                      animate={i === testi ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.4 }}
                    />
                  ))}
                </div>
                <motion.button 
                  className={styles.testiBtn} 
                  onClick={() => setTesti(t => (t + 1) % TESTIMONIALS.length)}
                  whileHover={{ scale: 1.1, color: "var(--amber)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight size={18} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ─── CONTACT ─── */}
        <motion.section
          className={`${styles.sec} ${styles.secDark}`}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
        >
          <div className={styles.container}>
            <motion.div className={styles.secHead} variants={fadeUp}>
              <motion.h3 
                className={styles.secTitleLight}
                whileHover={{ scale: 1.02 }}
              >
                Ready To Get Started?
              </motion.h3>
              <p className={styles.secLead}>
                Whether it's one listing or a full portfolio, tell us what you need checked
                and we'll get back to you within one business day.
              </p>
            </motion.div>

            {submitted ? (
              <motion.div 
                className={styles.formOk} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  <CheckCircle size={28} color="#2e7d32" />
                </motion.div>
                <div>
                  <h4>Message Sent!</h4>
                  <p>Thanks, our team will be in touch shortly.</p>
                </div>
              </motion.div>
            ) : (
              <motion.form className={styles.cForm} onSubmit={handleSubmit} noValidate variants={fadeUp}>
                {submitError && (
                  <motion.div 
                    className={styles.formErrBanner}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <AlertCircle size={16} /> {submitError}
                  </motion.div>
                )}

                <div className={styles.fRow}>
                  {[
                    { id: "name", label: "Your Name *", placeholder: "John Doe", type: "text" },
                    { id: "email", label: "Email Address *", placeholder: "john@example.com", type: "email" }
                  ].map((field) => (
                    <div key={field.id} className={styles.fGroup}>
                      <label className={styles.fLabel}>{field.label}</label>
                      <motion.input
                        type={field.type}
                        value={formData[field.id]}
                        onChange={e => change(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className={formErrors[field.id] ? styles.fError : ''}
                        whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(181, 96, 47, 0.2)" }}
                      />
                      {formErrors[field.id] && <motion.span 
                        className={styles.fErr}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >{formErrors[field.id]}</motion.span>}
                    </div>
                  ))}
                </div>

                <div className={styles.fRow}>
                  {[
                    { id: "phone", label: "Phone *", placeholder: "+1 (555) 000-0000", type: "tel" },
                    { id: "subject", label: "Subject *", placeholder: "Property assessment inquiry", type: "text" }
                  ].map((field) => (
                    <div key={field.id} className={styles.fGroup}>
                      <label className={styles.fLabel}>{field.label}</label>
                      <motion.input
                        type={field.type}
                        value={formData[field.id]}
                        onChange={e => change(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className={formErrors[field.id] ? styles.fError : ''}
                        whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(181, 96, 47, 0.2)" }}
                      />
                      {formErrors[field.id] && <motion.span 
                        className={styles.fErr}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >{formErrors[field.id]}</motion.span>}
                    </div>
                  ))}
                </div>

                <div className={styles.fGroup}>
                  <label className={styles.fLabel}>Message *</label>
                  <motion.textarea
                    rows={4}
                    value={formData.message}
                    onChange={e => change("message", e.target.value)}
                    placeholder="Tell us about your property needs..."
                    className={formErrors.message ? styles.fError : ''}
                    whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(181, 96, 47, 0.2)" }}
                  />
                  {formErrors.message && <motion.span 
                    className={styles.fErr}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >{formErrors.message}</motion.span>}
                </div>

                <div className={styles.fBottom}>
                  <motion.label 
                    className={styles.captcha}
                    whileHover={{ scale: 1.02 }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.human}
                      onChange={e => change("human", e.target.checked)}
                    />
                    <span>I'm not a robot</span>
                    {formErrors.human && <motion.span 
                      className={styles.fErr}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >{formErrors.human}</motion.span>}
                  </motion.label>
                  <motion.button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={loading}
                    whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(181, 96, 47, 0.4)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 size={16} />
                        </motion.div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send size={16} />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </div>
        </motion.section>
      </main>

      {/* ─── FOOTER ─── */}
      <motion.footer 
        className={styles.footer}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.6 }}
      >
        <div className={`${styles.container} ${styles.footGrid}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ delay: 0.1 }}
          >
            <div className={styles.footBrand}>
              <span>Scape <em>Property Intelligence</em></span>
            </div>
            <p className={styles.footTagline}>
              Real property data, turned into a clear report in under two seconds.
            </p>
            <div className={styles.footSocials}>
              {[LinkedinIcon, TwitterIcon, FacebookIcon, YoutubeIcon, GithubIcon].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  aria-label={`Social ${i}`}
                  whileHover={{ scale: 1.2, y: -3, color: "#b5602f" }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {[
            { title: "Product", links: ["Check A Property", "Pricing", "API Docs", "Integrations"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Contact"] }
          ].map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ delay: 0.2 + idx * 0.1 }}
            >
              <h4 className={styles.footH}>{section.title}</h4>
              <ul className={styles.footLinks}>
                {section.links.map((link, i) => (
                  <motion.li 
                    key={i}
                    whileHover={{ x: 5, color: "#b5602f" }}
                  >
                    <Link to={`/${link.toLowerCase().replace(/\s+/g, '-')}`}>{link}</Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ delay: 0.4 }}
          >
            <h4 className={styles.footH}>Contact</h4>
            <p className={styles.footContactLine}>
              <Mail size={14} /> hello@scapeintel.com
            </p>
            <p className={styles.footContactLine}>
              <Phone size={14} /> +1 (757) 598-0582
            </p>
            <p className={styles.footContactLine}>
              <MapPin size={14} /> Nairobi, Kenya
            </p>
            <div className={styles.footNewsletter}>
              <p>Subscribe to our newsletter</p>
              <div className={styles.footNewsletterForm}>
                <motion.input 
                  type="email" 
                  placeholder="Your email"
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(181, 96, 47, 0.3)" }}
                />
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "#b5602f" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowRight size={14} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className={styles.copyright}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ delay: 0.5 }}
        >
          <p>© {new Date().getFullYear()} Scape Property Intelligence. All rights reserved.</p>
          <div className={styles.copyrightLinks}>
            {["Privacy", "Terms", "Cookies"].map((link, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }}>
                <Link to={`/${link.toLowerCase()}`}>{link}</Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.footer>

      {/* ─── CHAT WIDGET ─── */}
      <div className={styles.chatWidget}>
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              className={styles.chatBox}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.chatHeader}>
                <div className={styles.chatHeaderInfo}>
                  <motion.div 
                    className={styles.chatAvatar}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <MessageSquare size={14} />
                  </motion.div>
                  <div>
                    <strong>Scape Assistant</strong>
                    <span>Online</span>
                  </div>
                </div>
                <motion.button 
                  onClick={() => setChatOpen(false)} 
                  className={styles.chatClose}
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <X size={16} />
                </motion.button>
              </div>

              <div className={styles.chatLog}>
                {chatLog.map((msg, i) => (
                  <motion.div
                    key={i}
                    className={`${styles.chatMsg} ${msg.from === "user" ? styles.chatMsgUser : styles.chatMsgBot}`}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {msg.text}
                  </motion.div>
                ))}
              </div>

              <div className={styles.chatInput}>
                <motion.input
                  value={chatMsg}
                  onChange={e => setChatMsg(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendChat()}
                  placeholder="Ask about property intelligence..."
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(181, 96, 47, 0.3)" }}
                />
                <motion.button
                  onClick={sendChat}
                  whileHover={{ scale: 1.15, backgroundColor: "#b5602f" }}
                  whileTap={{ scale: 0.85 }}
                >
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          className={styles.chatToggle}
          onClick={() => setChatOpen(!chatOpen)}
          whileHover={{ scale: 1.15, boxShadow: "0 8px 30px rgba(181, 96, 47, 0.4)" }}
          whileTap={{ scale: 0.85 }}
          animate={{ 
            boxShadow: chatOpen 
              ? "0 4px 15px rgba(0,0,0,0.2)" 
              : ["0 4px 15px rgba(181, 96, 47, 0.3)", "0 4px 25px rgba(181, 96, 47, 0.6)", "0 4px 15px rgba(181, 96, 47, 0.3)"]
          }}
          transition={{ boxShadow: { duration: 2, repeat: chatOpen ? 0 : Infinity } }}
        >
          {chatOpen ? <X size={20} /> : <MessageSquare size={20} />}
          {!chatOpen && (
            <motion.span
              className={styles.chatBadge}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              1
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* ─── SCROLL TO TOP ─── */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            className={styles.scrollTop}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.15, boxShadow: "0 8px 30px rgba(181, 96, 47, 0.4)" }}
            whileTap={{ scale: 0.85 }}
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      </motion.div>
    </div>
  </>
  );
}