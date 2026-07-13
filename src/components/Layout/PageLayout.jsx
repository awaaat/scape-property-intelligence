import Navbar from "./Navbar";
import Footer from "./Footer";
import styles from "./PageLayout.module.css";

export default function PageLayout({ children }) {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
