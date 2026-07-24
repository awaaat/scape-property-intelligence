import { BrowserRouter, Routes, Route } from "react-router-dom";

import ScrollToTop from "./components/Layout/ScrollToTop";
import HomePage from "./pages/home/HomePage";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import PaymentCallback from "./pages/PaymentCallback/PaymentCallback";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import PropertyIntel from "./pages/PropertyIntel/PropertyIntel";
import Brokers from "./pages/Solutions/Brokers";
import BuyersAgents from "./pages/Solutions/BuyersAgents/BuyersAgents";
import Lenders from "./pages/Solutions/Lenders/Lenders";
import Legal from "./pages/Solutions/Legal/Legal";
import Pricing from "./pages/Pricing/Pricing";
import About from "./pages/About/About";
import Blog from "./pages/Blog/Blog";
import Careers from "./pages/Careers/Careers";
import Contact from "./pages/Contact/Contact";
import Privacy from "./pages/Privacy/Privacy";
import Terms from "./pages/Terms/Terms";
import Cookies from "./pages/Cookies/Cookies";
import ApiDocs from "./pages/ApiDocs/ApiDocs";
import Integrations from "./pages/Integrations/Integrations";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/property-intel" element={<PropertyIntel />} />
        <Route path="/solutions/brokers" element={<Brokers />} />
        <Route path="/solutions/buyers-agents" element={<BuyersAgents />} />
        <Route path="/solutions/lenders" element={<Lenders />} />
        <Route path="/solutions/legal" element={<Legal />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/api-docs" element={<ApiDocs />} />
        <Route path="/integrations" element={<Integrations />} />
      </Routes>
    </BrowserRouter>
  );
}