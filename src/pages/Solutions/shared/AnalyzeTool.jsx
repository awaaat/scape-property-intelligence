import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import usePropertyAnalyze from "../../../hooks/usePropertyAnalyze";
import AnalyzeModals from "../../../components/PropertyAnalyze/AnalyzeModals";

// Real pin-submission flow, reused across Solutions pages. `render` lets
// each page fully control the markup/styling around the input, button, and
// result — this component only owns state, network calls, and the two
// modals (email capture, OTP) the backend can demand mid-flow.
export default function AnalyzeTool({ render }) {
  const analyze = usePropertyAnalyze();
  const { address, setAddress, isSearching, result, statusMessage, errorMessage, run } = analyze;

  return (
    <>
      {render({ address, setAddress, isSearching, result, statusMessage, errorMessage, run, Search, Loader2, motion, AnimatePresence })}
      <AnalyzeModals {...analyze} />
    </>
  );
}
