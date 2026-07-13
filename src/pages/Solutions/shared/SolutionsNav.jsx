import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, ShieldCheck, Landmark, Award } from "lucide-react";
import { fadeUp } from "../../../styles/animations";

const LIST = [
  { slug: "brokers", label: "Brokers & Agents", icon: Building2 },
  { slug: "buyers-agents", label: "Buyer's Agents", icon: ShieldCheck },
  { slug: "lenders", label: "Banks & Lenders", icon: Landmark },
  { slug: "legal", label: "Lawyers & Surveyors", icon: Award },
];

export default function SolutionsNav({ current }) {
  return (
    <motion.div variants={fadeUp} style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 28 }}>
      {LIST.map((seg) => {
        const Icon = seg.icon;
        const isActive = seg.slug === current;
        return (
          <Link key={seg.slug} to={`/solutions/${seg.slug}`}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", fontSize: 13,
              fontFamily: "var(--font-mono)", fontWeight: 600, textDecoration: "none", borderRadius: 999,
              border: `1px solid ${isActive ? "#8fc2d6" : "rgba(255,255,255,0.15)"}`,
              background: isActive ? "rgba(143,194,214,0.12)" : "transparent",
              color: isActive ? "#8fc2d6" : "rgba(255,255,255,0.6)", transition: "all 0.25s ease" }}>
            <Icon size={14} /> {seg.label}
          </Link>
        );
      })}
    </motion.div>
  );
}
