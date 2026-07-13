import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2 } from "lucide-react";

// A bare-bones scoring simulation, reused across Solutions pages.
// `render` lets each page fully control the markup/styling around
// the input, button, and result — this component only owns state
// and timing, never layout.
export default function AnalyzeTool({ render }) {
  const [address, setAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);

  const run = async () => {
    if (!address.trim() || isSearching) return;
    setResult(null);
    setIsSearching(true);
    await new Promise((r) => setTimeout(r, 1500));
    setResult({
      score: 84,
      trend: "+8.4% YoY",
      comps: 11,
      risk: "Low flood risk · Moderate terrain · Good access",
      amenities: "School 1.2km · Market 0.5km · Hospital 2.8km",
    });
    setIsSearching(false);
  };

  return render({ address, setAddress, isSearching, result, run, Search, Loader2, motion, AnimatePresence });
}
