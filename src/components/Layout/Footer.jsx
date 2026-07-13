import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} ${styles.footGrid}`}>
        <div>
          <div className={styles.footBrand}>
            <img src="/site-images/logo-image.png" alt="Scape" className={styles.brandLogo} />
            Scape <em>Property Intelligence</em>
          </div>
          <p className={styles.footTagline}>
            Real property data, turned into a clear report in under two seconds.
          </p>
        </div>

        {[
          { title: "Product", links: [["Check A Property", "/property-intel"], ["Pricing", "/pricing"], ["API Docs", "/api-docs"], ["Integrations", "/integrations"]] },
          { title: "Company", links: [["About", "/about"], ["Blog", "/blog"], ["Careers", "/careers"], ["Contact", "/contact"]] },
        ].map((section) => (
          <div key={section.title}>
            <h4 className={styles.footH}>{section.title}</h4>
            <ul className={styles.footLinks}>
              {section.links.map(([label, to]) => (
                <li key={to}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className={styles.footH}>Contact</h4>
          <p className={styles.footContactLine}><Mail size={14} /> hello@scapeintel.com</p>
          <p className={styles.footContactLine}><Phone size={14} /> +1 (757) 598-0582</p>
          <p className={styles.footContactLine}><MapPin size={14} /> Nairobi, Kenya</p>
        </div>
      </div>

      <div className={styles.copyright}>
        <p>© {new Date().getFullYear()} Scape Property Intelligence. All rights reserved.</p>
        <div className={styles.copyrightLinks}>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/cookies">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
