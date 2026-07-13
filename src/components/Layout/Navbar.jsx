import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ChevronDown, Search, Building2, ShieldCheck, Landmark, Award, Users, BookOpen, Briefcase, Mail } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={`${styles.container} ${styles.navInner}`}>
        <Link to="/" className={styles.brand}>
          {/* Logo image removed – only text remains */}
          <span>Scape <em>Property Intelligence</em></span>
        </Link>

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
              <div className={styles.navDropdownPanelInner}>
                <Link to="/solutions/brokers" className={styles.navDropdownLink}>
                  <Building2 size={16} />
                  <div><strong>Brokers & Agents</strong><span>Close a sale with proof, not promises</span></div>
                </Link>
                <Link to="/solutions/buyers-agents" className={styles.navDropdownLink}>
                  <ShieldCheck size={16} />
                  <div><strong>Buyer's Agents</strong><span>Protect your client before they sign</span></div>
                </Link>
                <Link to="/solutions/lenders" className={styles.navDropdownLink}>
                  <Landmark size={16} />
                  <div><strong>Banks & Lenders</strong><span>Check collateral before you approve</span></div>
                </Link>
                <Link to="/solutions/legal" className={styles.navDropdownLink}>
                  <Award size={16} />
                  <div><strong>Lawyers & Surveyors</strong><span>Back up due diligence with real data</span></div>
                </Link>
              </div>
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
              <div className={styles.navDropdownPanelInner}>
                <Link to="/about" className={styles.navDropdownLink}>
                  <Users size={16} />
                  <div><strong>About</strong><span>Who we are and why we built Scape</span></div>
                </Link>
                <Link to="/blog" className={styles.navDropdownLink}>
                  <BookOpen size={16} />
                  <div><strong>Blog</strong><span>Market data and product updates</span></div>
                </Link>
                <Link to="/careers" className={styles.navDropdownLink}>
                  <Briefcase size={16} />
                  <div><strong>Careers</strong><span>Join the team building Scape</span></div>
                </Link>
                <Link to="/contact" className={styles.navDropdownLink}>
                  <Mail size={16} />
                  <div><strong>Contact</strong><span>Get in touch with our team</span></div>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className={styles.navRight}>
          <Link to="/login" className={styles.navSignIn}>Sign In</Link>
          <Link to="/signup" className={styles.navSignUp}>Get Started</Link>
          <button type="button" className={styles.burger} onClick={() => setNavOpen(!navOpen)}>
            <Menu size={22} />
          </button>
        </div>
      </div>

      {navOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/property-intel" onClick={() => setNavOpen(false)}><Search size={14} /> Check A Property</Link>
          <Link to="/solutions/brokers" onClick={() => setNavOpen(false)}>Brokers & Agents</Link>
          <Link to="/solutions/buyers-agents" onClick={() => setNavOpen(false)}>Buyer's Agents</Link>
          <Link to="/solutions/lenders" onClick={() => setNavOpen(false)}>Banks & Lenders</Link>
          <Link to="/solutions/legal" onClick={() => setNavOpen(false)}>Lawyers & Surveyors</Link>
          <Link to="/pricing" onClick={() => setNavOpen(false)}>Pricing</Link>
          <Link to="/about" onClick={() => setNavOpen(false)}>About</Link>
          <Link to="/blog" onClick={() => setNavOpen(false)}>Blog</Link>
          <Link to="/careers" onClick={() => setNavOpen(false)}>Careers</Link>
          <Link to="/contact" onClick={() => setNavOpen(false)}>Contact</Link>
          <Link to="/login" onClick={() => setNavOpen(false)}>Sign In</Link>
          <Link to="/signup" onClick={() => setNavOpen(false)} className={styles.mobileSignUp}>Get Started Free</Link>
        </div>
      )}
    </header>
  );
}