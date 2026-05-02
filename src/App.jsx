import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, Link, NavLink, useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Menu, X, ChevronRight, PlayCircle, ShieldCheck,
  CheckCircle2, MapPin, Phone, ArrowRight,
  Stethoscope, Activity, Heart, Users,
  Star, LogIn, CreditCard, User, AlertCircle
} from 'lucide-react';

const PORTAL_URL = 'https://portal.pnwclinicalbodywork.com';
const BOOKING_URLS = {
  '60': 'https://link.marketsimple.pro/widget/booking/bqERPQ65nI7B8U8aiuV6',
  '90': 'https://link.marketsimple.pro/widget/booking/J6RrXqJgAxQng60x9A7g',
  '120': 'https://link.marketsimple.pro/widget/booking/KTKamdGDgMsTGNagSEM0',
};

// ── Booking Context ──────────────────────────────────────────────────────
const BookingContext = createContext();
const useBooking = () => useContext(BookingContext);

function BookingProvider({ children }) {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedBookingUrl, setSelectedBookingUrl] = useState(null);
  const closeBooking = () => { setShowBooking(false); setSelectedBookingUrl(null); };
  const openBooking = () => setShowBooking(true);
  return (
    <BookingContext.Provider value={{ showBooking, openBooking, closeBooking, selectedBookingUrl, setSelectedBookingUrl }}>
      {children}
    </BookingContext.Provider>
  );
}

// ── Scroll to top on route change ────────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// ── Blog Articles Data ───────────────────────────────────────────────────
const BLOG_ARTICLES = [
  {
    id: 'pip-claims-101',
    title: 'PIP Claims 101: What Every Washington Driver Should Know',
    excerpt: 'If you\'ve been in a car accident in Washington State, your PIP coverage likely pays for massage therapy. Here\'s how the process works and what you need to get started.',
    date: 'April 28, 2026',
    readTime: '5 min read',
    category: 'Insurance',
    content: [
      { heading: 'What Is PIP?', body: 'Personal Injury Protection (PIP) is a mandatory component of auto insurance in Washington State. Every driver carries at least $10,000 in PIP coverage. This coverage pays for medical expenses — including massage therapy — regardless of who caused the accident.' },
      { heading: 'Does PIP Cover Massage Therapy?', body: 'Yes. Washington State recognizes licensed massage therapists as qualified healthcare providers. If your injuries result from a motor vehicle accident, PIP covers your treatment. You do not need a referral from a physician to begin treatment with a licensed massage therapist in Washington.' },
      { heading: 'How Billing Works', body: 'At PNW Clinical Bodywork, we bill your auto insurance directly. You don\'t pay anything out of pocket in most cases. After each session, we document your treatment with detailed SOAP notes and generate a CMS-1500 claim form that goes straight to your insurance company.' },
      { heading: 'What You Need to Get Started', body: 'To begin PIP-covered treatment, we need three things: your auto insurance company name, your claim number (call your insurer if you don\'t have it yet), and the date of your accident. You can submit all of this through our secure online intake form.' },
      { heading: 'Common Mistakes to Avoid', body: 'Don\'t wait too long to start treatment. Insurance adjusters look for gaps in care — if you wait weeks after your accident to begin treatment, it can weaken your claim. Start as soon as possible, even if your pain seems minor. Soft tissue injuries often worsen before they improve.' },
      { heading: 'What If My Claim Is Denied?', body: 'Denials happen, but they\'re often reversible. We maintain thorough documentation of every session specifically to support appeals. If you have an attorney, we coordinate directly with their office to provide the records they need.' },
    ]
  },
  {
    id: 'first-visit',
    title: 'What to Expect at Your First Clinical Massage Session',
    excerpt: 'Your first visit is about understanding your pain, building a treatment plan, and starting the process of real recovery. Here\'s a step-by-step walkthrough.',
    date: 'April 25, 2026',
    readTime: '4 min read',
    category: 'Patient Guide',
    content: [
      { heading: 'Before You Arrive', body: 'Wear comfortable clothing. If you\'re coming in for a PIP claim, have your insurance company name, claim number, and accident date ready. You can also complete our online intake form ahead of time to save time at the office.' },
      { heading: 'The Consultation (10-15 Minutes)', body: 'Glen will start by asking about your pain history, where it hurts, when it started, and what makes it better or worse. He\'ll ask about your daily activities and what you want to get back to doing. This isn\'t small talk — it directly shapes your treatment plan.' },
      { heading: 'Assessment', body: 'Glen will assess your range of motion, identify trigger points, and evaluate which muscle groups are contributing to your pain. He may use a body diagram to mark areas of concern so you can visually track your progress over sessions.' },
      { heading: 'Treatment', body: 'This is clinical massage — not a spa experience. Glen uses targeted techniques like myofascial release and trigger point therapy to address the root cause of your pain. Communication is key: he\'ll check in throughout the session to adjust pressure and technique.' },
      { heading: 'After the Session', body: 'You may feel immediate relief, or you may feel sore for 24-48 hours as your body adjusts. Glen will recommend home exercises or stretches to support your recovery between visits. Drink plenty of water.' },
      { heading: 'Your Treatment Plan', body: 'Most conditions respond best to consistent treatment. Glen will recommend a frequency — typically once or twice per week initially — and adjust as you improve. For PIP patients, this documentation also supports your insurance claim.' },
    ]
  },
  {
    id: 'clinical-vs-spa',
    title: 'Clinical Massage vs. Spa Massage: Why the Difference Matters',
    excerpt: 'They both involve hands-on bodywork, but clinical massage and spa massage have fundamentally different goals. Understanding the difference could change how you approach your pain.',
    date: 'April 20, 2026',
    readTime: '4 min read',
    category: 'Education',
    content: [
      { heading: 'The Goal Is Different', body: 'A spa massage is designed to help you relax. A clinical massage is designed to fix a problem. That\'s the core difference. Relaxation may be a side effect of clinical work, but it\'s not the purpose. The purpose is measurable improvement — less pain, more range of motion, better function.' },
      { heading: 'Assessment Comes First', body: 'In a spa, you fill out a brief form and get on the table. In a clinical setting, your therapist evaluates your posture, range of motion, and pain patterns before they touch you. The treatment is based on findings, not preferences.' },
      { heading: 'Technique Is Targeted', body: 'Spa massage typically uses long, flowing strokes across the whole body. Clinical massage zeroes in on specific muscles, tendons, and fascia that are causing your symptoms. Techniques like trigger point therapy and myofascial release are rarely used in a spa setting.' },
      { heading: 'Documentation Matters', body: 'Clinical massage therapists maintain SOAP notes — Subjective, Objective, Assessment, Plan — just like any other healthcare provider. These notes track your progress, guide future treatment, and are essential for insurance billing.' },
      { heading: 'Insurance Covers Clinical Work', body: 'Spa massages are out-of-pocket luxuries. Clinical massage, when performed by a licensed therapist for a documented condition, can be covered by health insurance or PIP auto insurance. This is because clinical work is healthcare, not self-care.' },
      { heading: 'When to Choose Which', body: 'If you want to unwind after a stressful week, a spa massage is great. If you have chronic pain, limited mobility, an injury, or you\'re recovering from an accident — you need clinical massage. The two aren\'t interchangeable.' },
    ]
  },
  {
    id: 'injury-recovery-timeline',
    title: 'How Long Does Injury Recovery Actually Take?',
    excerpt: 'One of the most common questions we hear: "How many sessions will I need?" Here\'s an honest answer based on 20 years of clinical experience.',
    date: 'April 15, 2026',
    readTime: '5 min read',
    category: 'Recovery',
    content: [
      { heading: 'The Honest Answer: It Depends', body: 'Every injury is different, and every body heals at its own pace. But after 20 years of clinical work, Glen has seen enough patterns to give you a realistic framework. The key factors are: how long you\'ve had the pain, how severe the initial injury was, and how consistent you are with treatment.' },
      { heading: 'Acute Injuries (0-6 Weeks Old)', body: 'Recent injuries from car accidents, falls, or sports typically respond fastest. With consistent treatment (1-2 sessions per week), most patients see significant improvement within 4-8 sessions. The key is starting early — the sooner you begin, the faster you heal.' },
      { heading: 'Subacute Injuries (6 Weeks - 3 Months)', body: 'At this stage, your body has started to compensate for the injury, creating secondary tension patterns. Treatment takes longer because we\'re addressing both the original injury and the compensation. Expect 8-16 sessions over 2-4 months.' },
      { heading: 'Chronic Pain (3+ Months)', body: 'Chronic pain involves deeply established patterns in your muscles and nervous system. This is where patience matters most. Significant improvement typically takes 3-6 months of regular treatment, but most patients notice meaningful progress within the first month.' },
      { heading: 'What "Better" Actually Looks Like', body: 'Recovery isn\'t always linear. You might have a great week followed by a tough one. What matters is the trend. Glen tracks your progress with body diagrams and pain scales so you can see objective improvement even when subjective feelings fluctuate.' },
      { heading: 'The Role of Home Care', body: 'What you do between sessions matters as much as what happens during them. Glen prescribes specific stretches and exercises tailored to your condition. Patients who follow their home care plan consistently recover 30-40% faster than those who rely on in-office treatment alone.' },
    ]
  },
];

// ── Booking Modal ────────────────────────────────────────────────────────
function BookingModal() {
  const { showBooking, closeBooking, selectedBookingUrl, setSelectedBookingUrl } = useBooking();
  const navigate = useNavigate();
  if (!showBooking) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`bg-white w-full ${selectedBookingUrl ? 'max-w-2xl h-[90vh]' : 'max-w-xl'} rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 flex flex-col`}>
        <div className="p-6 bg-teal-700 text-white flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            {selectedBookingUrl && (
              <button onClick={() => setSelectedBookingUrl(null)} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-colors">
                <ChevronRight size={18} className="rotate-180" />
              </button>
            )}
            <div>
              <h3 className="text-xl font-black">Book a Session</h3>
              <p className="text-teal-100 text-xs font-bold uppercase tracking-widest">Vancouver Clinical Studio</p>
            </div>
          </div>
          <button onClick={closeBooking} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
            <X size={22} />
          </button>
        </div>
        {!selectedBookingUrl ? (
          <div className="p-8 space-y-6 overflow-y-auto">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Select Session Length</p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: '60-Minute Session', price: '$100', url: BOOKING_URLS['60'] },
                  { label: '90-Minute Session', price: '$150', url: BOOKING_URLS['90'] },
                  { label: '2-Hour Session', price: '$200', url: BOOKING_URLS['120'] },
                ].map(s => (
                  <button key={s.label} onClick={() => setSelectedBookingUrl(s.url)} className="px-5 py-4 border border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-teal-500 hover:bg-teal-50 transition-all flex items-center justify-between group text-left">
                    <div>
                      <span className="text-sm">{s.label}</span>
                      <span className="text-xs text-teal-600 ml-2">{s.price}</span>
                    </div>
                    <ChevronRight size={14} className="text-teal-600 opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-[10px] font-bold text-slate-400">MVA/PIP patients — start your intake here:</p>
              <button onClick={() => { closeBooking(); navigate('/pip-intake'); }} className="inline-flex items-center gap-2 text-xs font-black uppercase text-teal-700 hover:text-teal-900">
                <ArrowRight size={14} /> PIP Intake Form
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <iframe src={selectedBookingUrl} title="Book Appointment" className="w-full h-full border-0" allow="payment" />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Nav Item ─────────────────────────────────────────────────────────────
function NavItem({ label, to, closeMenu }) {
  return (
    <NavLink
      to={to}
      onClick={closeMenu}
      className={({ isActive }) => `text-sm font-bold tracking-tight transition-colors py-2 ${isActive ? 'text-teal-700' : 'text-slate-500 hover:text-teal-600'}`}
    >
      {label}
    </NavLink>
  );
}

// ── Layout ───────────────────────────────────────────────────────────────
function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openBooking } = useBooking();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      <BookingModal />

      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Activity className="text-teal-600" size={32} />
            <div className="leading-none">
              <span className="text-xl font-black tracking-tighter text-slate-800">PNW CLINICAL</span>
              <br/><span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-700">Bodywork</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <NavItem label="Home" to="/" closeMenu={closeMenu} />
            <NavItem label="Services" to="/services" closeMenu={closeMenu} />
            <NavItem label="About Glen" to="/about" closeMenu={closeMenu} />
            <NavItem label="Insurance" to="/insurance" closeMenu={closeMenu} />
            <NavItem label="Blog" to="/blog" closeMenu={closeMenu} />
            <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" className="text-sm font-bold tracking-tight text-slate-500 hover:text-teal-600 transition-colors flex items-center gap-1.5">
              <LogIn size={14} /> Practitioner Portal
            </a>
            <button onClick={openBooking} className="bg-teal-700 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/20">
              Book Now
            </button>
          </div>

          <button className="md:hidden text-slate-800 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 p-6 flex flex-col gap-6 animate-in slide-in-from-top-4">
            <NavItem label="Home" to="/" closeMenu={closeMenu} />
            <NavItem label="Services" to="/services" closeMenu={closeMenu} />
            <NavItem label="About Glen" to="/about" closeMenu={closeMenu} />
            <NavItem label="Insurance" to="/insurance" closeMenu={closeMenu} />
            <NavItem label="Blog" to="/blog" closeMenu={closeMenu} />
            <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" onClick={closeMenu} className="text-sm font-bold tracking-tight text-slate-500 hover:text-teal-600 transition-colors flex items-center gap-2">
              <LogIn size={16} /> Practitioner Portal
            </a>
            <button onClick={() => { openBooking(); closeMenu(); }} className="w-full bg-teal-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest">
              Book Appointment
            </button>
          </div>
        )}
      </nav>

      <main>
        <Routes>
          <Route index element={<HomeView />} />
          <Route path="services" element={<ServicesView />} />
          <Route path="about" element={<AboutView />} />
          <Route path="insurance" element={<InsuranceView />} />
          <Route path="blog" element={<BlogListView />} />
          <Route path="blog/:slug" element={<BlogArticleView />} />
          <Route path="pip-intake" element={<IntakeView />} />
          <Route path="privacy" element={<PrivacyView />} />
          <Route path="terms" element={<TermsView />} />
          <Route path="hipaa" element={<HipaaView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Shared Sections: CTA & Footer */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
        <div className="bg-emerald-50 p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-[3rem] border border-emerald-100 flex flex-col justify-center">
          <h3 className="text-2xl sm:text-3xl font-black text-emerald-900 mb-6 tracking-tight">Have a PIP or Auto Accident Claim?</h3>
          <p className="text-emerald-800 font-medium mb-8 leading-relaxed">
            We specialize in Motor Vehicle Accident (MVA) recovery. We bill the insurance companies directly so you can focus on healing, not paperwork.
          </p>
          <Link to="/pip-intake" className="self-start flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all">
            Start Insurance Inquiry <ArrowRight size={16} />
          </Link>
        </div>
        <div className="bg-teal-50 p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-[3rem] border border-teal-100 flex flex-col justify-center">
          <h3 className="text-2xl sm:text-3xl font-black text-teal-900 mb-6 tracking-tight">Referral Program</h3>
          <p className="text-teal-800 font-medium mb-8 leading-relaxed">
            When you refer a friend, you both receive $25 off your next session. It's our way of saying thank you for trusting us with your recovery.
          </p>
          <div className="flex items-center gap-4">
            <Users className="text-teal-600" size={40} />
            <p className="text-sm font-black text-teal-900 uppercase tracking-tighter">Refer a Friend, Get $25</p>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 pt-12 sm:pt-24 pb-8 sm:pb-12 px-6 text-white rounded-t-3xl sm:rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Activity className="text-teal-400" size={28} />
              <span className="text-xl font-black tracking-tighter">PNW CLINICAL BODYWORK</span>
            </Link>
            <p className="text-slate-400 font-medium max-w-sm mb-8 leading-relaxed">
              Helping you get back to the things you love through targeted, clinical manual therapy in Vancouver, WA.
            </p>
          </div>
          <div>
            <h5 className="font-black uppercase text-xs tracking-widest text-teal-400 mb-6">Contact</h5>
            <ul className="space-y-4 text-slate-400 text-sm font-bold">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-teal-400 shrink-0 mt-1" />
                5514 NE 107th Ave. Ste. 101<br/>Vancouver, WA 98662
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-teal-400" />
                <a href="tel:+13605210804">(360) 521-0804</a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-black uppercase text-xs tracking-widest text-teal-400 mb-6">Office Hours</h5>
            <ul className="space-y-2 text-slate-400 text-sm font-bold">
              <li className="flex justify-between"><span>Mon — Fri</span> <span className="text-white">9:00 — 3:00</span></li>
              <li className="flex justify-between"><span>Sat — Sun</span> <span className="text-red-400">Closed</span></li>
            </ul>
            <p className="mt-6 text-[10px] text-slate-500 font-black uppercase">Max 4 Appointments Daily</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800 pt-12 flex flex-col md:flex-row justify-between gap-6 text-slate-500 text-[10px] font-black uppercase tracking-widest">
          <p>&copy; 2026 PNW Clinical Bodywork. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-4 sm:gap-8">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/hipaa" className="hover:text-white transition-colors">HIPAA Compliance</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Views ────────────────────────────────────────────────────────────────

function HomeView() {
  const { openBooking } = useBooking();
  return (
    <>
      <section className="pt-28 sm:pt-32 lg:pt-40 pb-12 sm:pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/50 -skew-x-12 translate-x-1/2 z-0 hidden lg:block"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              <ShieldCheck size={14} /> Vancouver, WA Recovery Specialist
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-black text-slate-900 leading-[1.05] mb-6 tracking-tighter">
              Stop managing the pain and <span className="text-teal-700">start fixing the cause.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium mb-10 max-w-lg leading-relaxed">
              Clinical massage specifically designed for injury recovery. We help you get back to the activities you love, from hiking the Gorge to playing with your grandkids.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={openBooking} className="px-10 py-5 bg-teal-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-teal-700/30 hover:scale-105 transition-all">
                Book Recovery Session
              </button>
              <button className="px-10 py-5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
                <PlayCircle size={20} className="text-teal-600" /> Watch Story
              </button>
            </div>
            <p className="mt-8 text-xs font-bold text-slate-400 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" /> Regence BlueCross BlueShield Accepted
            </p>
          </div>
          <div className="relative animate-in fade-in zoom-in duration-1000">
            <div className="aspect-[4/5] bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl ring-8 ring-white relative group">
              <div className="absolute inset-0 bg-[url('/images/glen-hero.jpg')] bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-teal-900/20 mix-blend-multiply"></div>
              <div className="absolute bottom-4 left-4 right-4 p-4 sm:bottom-10 sm:left-10 sm:right-10 sm:p-6 bg-white/90 backdrop-blur-md rounded-3xl border border-white/50 shadow-xl">
                <p className="text-teal-900 font-black italic text-sm sm:text-lg leading-tight">"After just a few sessions with Glen, I had less pain and increased range of motion. I highly recommend him."</p>
                <p className="mt-3 text-xs font-black uppercase text-teal-600 tracking-widest">— Carrie F.</p>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-100 rounded-3xl -z-10 animate-pulse hidden sm:block"></div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-8">
              <div className="inline-flex items-center gap-2 text-teal-600 font-black uppercase text-[10px] tracking-[0.3em]">
                <Star size={14} /> Patient Spotlight
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                From "Constant Discomfort" to the <span className="text-teal-700">Dance Floor.</span>
              </h3>
              <div className="space-y-4 text-slate-600 font-medium leading-relaxed">
                <p className="text-lg italic text-slate-500">"I have a 38-degree curve in my spine. I was in constant discomfort and pain. I thought my days of being active with my grandkids were behind me."</p>
                <p>When Diane first came to PNW Clinical Bodywork, she was resigned to "managing" her pain with medication and limited activity. Her granddaughter's wedding was six months away, and Diane's only goal was to be able to stand for the ceremony.</p>
                <p><strong>The Approach:</strong> Instead of a general relaxation massage, Glen focused on releasing the tight muscle groups that had been "combined and tightened" for most of Diane's life. Using targeted myofascial release and light therapy, they worked on the root causes of her spinal tension.</p>
                <p className="font-bold text-teal-800">The Result: Diane didn't just stand for the ceremony—she danced for three hours. Two weeks later, she took the trip to the beach she had previously cancelled.</p>
              </div>
              <div className="pt-4">
                <Link to="/blog" className="flex items-center gap-2 text-sm font-black uppercase text-teal-700 hover:gap-4 transition-all">
                  Read More Stories <ArrowRight size={18} />
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="aspect-video bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl relative group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/60 to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">Success Story</p>
                  <p className="text-2xl font-black">Diane's Comeback</p>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full -z-10 hidden lg:block"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-600 mb-4">The Challenge</h2>
          <h3 className="text-2xl sm:text-4xl font-black text-slate-900 mb-16 tracking-tight">Does chronic pain dictate your daily schedule?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Temporary Relief Isn't Enough", desc: "Spa massages feel good for an hour, but they don't fix the underlying structural issues.", icon: Heart },
              { title: "Limited Range of Motion", desc: "Feeling stuck in your own body prevents you from living your second half of life with vitality.", icon: Activity },
              { title: "Injury Breakdown", desc: "Just as you wouldn't drive a car with failing brakes, you shouldn't ignore your body's pain signals.", icon: Stethoscope }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-700 transition-colors">
                  <item.icon className="text-teal-600 group-hover:text-white" size={32} />
                </div>
                <h4 className="text-xl font-black mb-4">{item.title}</h4>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ServicesView() {
  const { openBooking } = useBooking();
  return (
    <section className="pt-32 pb-24 px-6 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-sm font-black text-teal-600 uppercase tracking-widest mb-4">Our Expertise</h2>
          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter">Specialized Clinical Care</h3>
          <p className="mt-6 text-slate-500 max-w-2xl mx-auto font-medium">We don't do "general" massage. We focus on clinical techniques that produce measurable results in pain reduction and mobility.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { name: "Myofascial Release", time: "60/90 Min", price: "$100+", desc: "Targets the stiff connective tissue to reduce chronic pain and improve flexibility.", icon: Activity },
            { name: "Injury Rehabilitation", time: "60/90 Min", price: "Insurance/PIP", desc: "Focuses on repairing damaged tissues from car accidents, surgeries, or repetitive strain.", icon: Stethoscope },
            { name: "Deep Tissue Massage", time: "60/90 Min", price: "$100+", desc: "Firm strokes on deeper layers of muscle to relieve stubborn chronic tension.", icon: Heart },
            { name: "Trigger Point Therapy", time: "60 Min", price: "$100", desc: "Focused pressure on 'knots' that cause referred pain in other parts of the body.", icon: Users }
          ].map((s, i) => (
            <div key={i} className="p-6 sm:p-10 bg-slate-50 rounded-2xl sm:rounded-[3rem] border border-slate-100 flex flex-col items-start hover:bg-white hover:shadow-2xl hover:border-teal-100 transition-all group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-teal-700 group-hover:text-white transition-colors">
                <s.icon size={24} />
              </div>
              <div className="flex justify-between w-full items-start mb-4">
                <h4 className="text-2xl font-black">{s.name}</h4>
                <span className="text-xs font-black text-teal-600 uppercase bg-teal-50 px-3 py-1 rounded-full">{s.time}</span>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">{s.desc}</p>
              <button onClick={openBooking} className="mt-auto flex items-center gap-2 text-xs font-black uppercase tracking-widest text-teal-700 hover:text-teal-900 transition-colors">
                Check Availability <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutView() {
  return (
    <section className="pt-32 pb-24 px-6 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div className="relative">
            <div className="aspect-[4/5] bg-slate-100 rounded-[4rem] overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-[url('/images/glen-arn.jpg')] bg-cover bg-center bg-top"></div>
              <div className="absolute inset-0 bg-teal-900/10"></div>
            </div>
            <div className="absolute -bottom-4 left-4 sm:-bottom-6 sm:-left-6 bg-white p-8 rounded-3xl shadow-xl border border-slate-50">
              <p className="text-3xl font-black text-teal-700 leading-none">20+</p>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Years Clinical Exp.</p>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-black text-teal-600 uppercase tracking-widest mb-4">Meet Glen Arn, LMT</h2>
            <h3 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight mb-8 tracking-tighter">Helping you get back to the things you love.</h3>
            <div className="space-y-6 text-slate-600 font-medium leading-relaxed text-lg">
              <p>Glen grew up in the Pacific Northwest and has lived the active lifestyle he helps his clients maintain. Having sustained roughly 15 broken bones himself, Glen understands pain from the inside out.</p>
              <p>With a 20-year career focusing on clinical manual therapy, Glen has helped countless people in Vancouver avoid surgeries and return to hiking, dancing, and playing with grandkids.</p>
              <p>He is a family man, dedicated to his wife and three children, which brings a level of safety and personal connection that his clients deeply appreciate.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LegalPage({ title, children }) {
  return (
    <section className="pt-32 pb-24 px-6 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-xs font-black uppercase text-teal-700 hover:text-teal-900 tracking-widest mb-8 py-2">
          <ChevronRight size={14} className="rotate-180" /> Back to Home
        </Link>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">{title}</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-12">Effective Date: April 29, 2026</p>
        <div className="prose prose-slate max-w-none space-y-8 text-slate-600 font-medium leading-relaxed">
          {children}
        </div>
      </div>
    </section>
  );
}

function PrivacyView() {
  return (
    <LegalPage title="Privacy Policy">
      <div><h2 className="text-xl font-black text-slate-900 mb-3">Who We Are</h2><p>PNW Clinical Bodywork is a licensed massage therapy practice operated by Glen Arn, LMT #77218, located at 5514 NE 107th Ave. Ste. 101, Vancouver, WA 98662. This policy describes how we collect, use, and protect your personal information.</p></div>
      <div><h2 className="text-xl font-black text-slate-900 mb-3">Information We Collect</h2><ul className="list-disc pl-6 space-y-2"><li><strong>Contact information:</strong> Name, email, phone number, and mailing address when you book an appointment or submit an inquiry.</li><li><strong>Health information:</strong> Intake forms, treatment history, SOAP notes, and insurance details necessary for clinical care and billing. This information is protected under HIPAA (see our HIPAA Compliance page).</li><li><strong>Booking data:</strong> Appointment dates, times, and session preferences collected through our scheduling system.</li><li><strong>Website usage:</strong> We do not use third-party analytics or tracking scripts on this website. No cookies are set for advertising purposes.</li></ul></div>
      <div><h2 className="text-xl font-black text-slate-900 mb-3">How We Use Your Information</h2><ul className="list-disc pl-6 space-y-2"><li>To provide and coordinate your clinical care</li><li>To process insurance claims and PIP billing</li><li>To communicate appointment reminders and follow-ups</li><li>To comply with legal and regulatory requirements</li></ul></div>
      <div><h2 className="text-xl font-black text-slate-900 mb-3">Information Sharing</h2><p>We do not sell, rent, or trade your personal information. We may share your information only in the following circumstances:</p><ul className="list-disc pl-6 space-y-2 mt-2"><li><strong>Insurance companies:</strong> To process claims and PIP/auto accident billing on your behalf.</li><li><strong>Legal requirements:</strong> When required by law, court order, or regulatory authority.</li><li><strong>Service providers:</strong> Our scheduling and practice management platform (Go High Level) processes booking and communication data under a Business Associate Agreement.</li></ul></div>
      <div><h2 className="text-xl font-black text-slate-900 mb-3">Data Security</h2><p>All data transmitted through this website and our clinical portal is encrypted via HTTPS/TLS. Access to patient records is restricted to authorized personnel only. See our HIPAA Compliance page for additional safeguards.</p></div>
      <div><h2 className="text-xl font-black text-slate-900 mb-3">Your Rights</h2><p>You have the right to access, correct, or request deletion of your personal information. For health records, see our HIPAA Compliance page for your rights under federal law. For all other inquiries, contact us at (360) 521-0804.</p></div>
      <div><h2 className="text-xl font-black text-slate-900 mb-3">Changes to This Policy</h2><p>We may update this policy as our practices evolve. The effective date at the top of this page reflects the most recent revision.</p></div>
    </LegalPage>
  );
}

function TermsView() {
  return (
    <LegalPage title="Terms of Service">
      <div><h2 className="text-xl font-black text-slate-900 mb-3">Agreement to Terms</h2><p>By accessing this website or booking an appointment with PNW Clinical Bodywork, you agree to the following terms. If you do not agree, please do not use our services.</p></div>
      <div><h2 className="text-xl font-black text-slate-900 mb-3">Services</h2><p>PNW Clinical Bodywork provides clinical massage therapy services including myofascial release, injury rehabilitation, deep tissue massage, and trigger point therapy. Our services are therapeutic in nature and are not a substitute for medical diagnosis or treatment by a physician.</p></div>
      <div><h2 className="text-xl font-black text-slate-900 mb-3">Appointments &amp; Cancellation</h2><ul className="list-disc pl-6 space-y-2"><li>Appointments are scheduled through our online booking system or by phone at (360) 521-0804.</li><li>We require <strong>24 hours' notice</strong> for cancellations. Late cancellations or no-shows may be subject to a fee equal to the full session rate.</li><li>We reserve the right to limit scheduling to a maximum of 4 appointments per day to ensure quality of care.</li></ul></div>
      <div><h2 className="text-xl font-black text-slate-900 mb-3">Pricing &amp; Payment</h2><ul className="list-disc pl-6 space-y-2"><li>60-Minute Session: $100</li><li>90-Minute Session: $150</li><li>2-Hour Session: $200</li><li>PIP and auto accident claims are billed directly to the insurance provider.</li><li>Payment is due at the time of service unless covered by insurance.</li></ul></div>
      <div><h2 className="text-xl font-black text-slate-900 mb-3">Referral Program</h2><p>When you refer a new client, both you and the referred client receive $25 off your next session. Referral credits are non-transferable and cannot be redeemed for cash.</p></div>
      <div><h2 className="text-xl font-black text-slate-900 mb-3">Insurance &amp; PIP Claims</h2><p>We accept Regence BlueCross BlueShield and process PIP/auto accident claims. It is the client's responsibility to verify their coverage and provide accurate insurance information. We are not responsible for claims denied due to policy limitations or incorrect information.</p></div>
      <div><h2 className="text-xl font-black text-slate-900 mb-3">Limitation of Liability</h2><p>PNW Clinical Bodywork provides services with professional care and skill. However, results vary by individual. We are not liable for outcomes that fall outside the scope of licensed massage therapy practice. By receiving treatment, you acknowledge that you have disclosed all relevant medical conditions and understand the nature of the services provided.</p></div>
      <div><h2 className="text-xl font-black text-slate-900 mb-3">Website</h2><p>This website is provided for informational purposes. We make reasonable efforts to keep content accurate but do not guarantee completeness. Links to third-party services (booking, insurance portals) are provided for convenience and are governed by their own terms.</p></div>
      <div><h2 className="text-xl font-black text-slate-900 mb-3">Contact</h2><p>Questions about these terms may be directed to PNW Clinical Bodywork at (360) 521-0804 or at our office: 5514 NE 107th Ave. Ste. 101, Vancouver, WA 98662.</p></div>
    </LegalPage>
  );
}

function HipaaView() {
  return (
    <LegalPage title="HIPAA Compliance">
      <div><h2 className="text-xl font-black text-slate-900 mb-3">Our Commitment</h2><p>PNW Clinical Bodywork is committed to protecting the privacy and security of your Protected Health Information (PHI) in accordance with the Health Insurance Portability and Accountability Act of 1996 (HIPAA) and the Washington State Health Care Information Act (RCW 70.02).</p></div>
      <div><h2 className="text-xl font-black text-slate-900 mb-3">What Is Protected Health Information?</h2><p>PHI includes any individually identifiable health information related to your past, present, or future care. This includes your name, contact details, treatment records, SOAP notes, diagnosis codes, insurance information, and billing records.</p></div>
      <div><h2 className="text-xl font-black text-slate-900 mb-3">How We Protect Your PHI</h2><ul className="list-disc pl-6 space-y-2"><li><strong>Access controls:</strong> Only Glen Arn, LMT and authorized staff have access to patient records. Access is role-based and password-protected.</li><li><strong>Encryption:</strong> All data in transit is encrypted via TLS/HTTPS. Clinical records are stored in systems that encrypt data at rest.</li><li><strong>Session security:</strong> Our clinical portal enforces automatic logout after 20 minutes of inactivity.</li><li><strong>Business Associate Agreements:</strong> We maintain BAAs with all third-party vendors who handle PHI on our behalf.</li><li><strong>Minimum necessary:</strong> We only access, use, and share the minimum amount of PHI required to provide your care and process billing.</li></ul></div>
      <div><h2 className="text-xl font-black text-slate-900 mb-3">Your Rights Under HIPAA</h2><p>As a patient, you have the right to:</p><ul className="list-disc pl-6 space-y-2 mt-2"><li><strong>Access:</strong> Request a copy of your health records.</li><li><strong>Amendment:</strong> Request corrections to inaccurate information in your records.</li><li><strong>Accounting of disclosures:</strong> Request a list of entities to whom we have disclosed your PHI.</li><li><strong>Restriction:</strong> Request restrictions on certain uses or disclosures of your PHI.</li><li><strong>Confidential communications:</strong> Request that we communicate with you through a specific method or at a specific location.</li><li><strong>Complaint:</strong> File a complaint if you believe your privacy rights have been violated, without fear of retaliation.</li></ul></div>
      <div><h2 className="text-xl font-black text-slate-900 mb-3">Permitted Uses and Disclosures</h2><p>We may use or disclose your PHI without your authorization for the following purposes:</p><ul className="list-disc pl-6 space-y-2 mt-2"><li><strong>Treatment:</strong> To provide, coordinate, or manage your care.</li><li><strong>Payment:</strong> To bill and collect payment from you or your insurance provider, including PIP and auto accident claims.</li><li><strong>Healthcare operations:</strong> For quality assurance, compliance, and administrative functions.</li><li><strong>Legal requirements:</strong> When required by federal, state, or local law.</li></ul><p className="mt-2">All other uses and disclosures require your written authorization, which you may revoke at any time.</p></div>
      <div><h2 className="text-xl font-black text-slate-900 mb-3">Breach Notification</h2><p>In the event of a breach of unsecured PHI, we will notify affected individuals within 60 days as required by the HIPAA Breach Notification Rule. If a breach affects more than 500 individuals, we will also notify the U.S. Department of Health and Human Services and local media.</p></div>
      <div><h2 className="text-xl font-black text-slate-900 mb-3">Contact &amp; Complaints</h2><p>To exercise your rights, request information, or file a complaint, contact:</p><div className="mt-3 p-6 bg-slate-50 rounded-2xl border border-slate-100"><p className="font-black text-slate-900">Glen Arn, LMT — Privacy Officer</p><p>PNW Clinical Bodywork</p><p>5514 NE 107th Ave. Ste. 101, Vancouver, WA 98662</p><p>Phone: (360) 521-0804</p></div><p className="mt-4">You may also file a complaint with the U.S. Department of Health and Human Services Office for Civil Rights at <span className="font-bold">hhs.gov/ocr</span>.</p></div>
    </LegalPage>
  );
}

function IntakeView() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const painAreas = Array.from(form.querySelectorAll('input[name="painArea"]:checked')).map(cb => cb.value);
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName, lastName: data.lastName,
          email: data.email || undefined, phone: data.phone,
          dateOfBirth: data.dateOfBirth || undefined, address: data.address || undefined,
          accidentDate: data.accidentDate || undefined, insuranceCompany: data.insuranceCompany || undefined,
          claimNumber: data.claimNumber || undefined, policyNumber: data.policyNumber || undefined,
          adjusterName: data.adjusterName || undefined, adjusterPhone: data.adjusterPhone || undefined,
          attorneyName: data.attorneyName || undefined, attorneyPhone: data.attorneyPhone || undefined,
          lawFirm: data.lawFirm || undefined, injuryDescription: data.injuryDescription || undefined,
          painAreas: painAreas.length > 0 ? painAreas : undefined,
          physicianName: data.physicianName || undefined, currentMedications: data.currentMedications || undefined,
          preExistingConditions: data.preExistingConditions || undefined,
          consentToTreat: !!data.consentToTreat, hipaaAcknowledged: !!data.hipaaAcknowledged,
        }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Submission failed'); }
      setSuccess(true);
      form.reset();
    } catch (err) { setError(err.message); } finally { setSubmitting(false); }
  };

  if (success) {
    return (
      <section className="pt-32 pb-24 px-6 animate-in fade-in duration-500">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="text-emerald-600" size={40} /></div>
          <h2 className="text-4xl font-black text-slate-900 mb-4">Intake Received</h2>
          <p className="text-lg text-slate-500 font-medium mb-8">Thank you. Glen will review your information and contact you within one business day to schedule your first appointment.</p>
          <p className="text-sm text-slate-400 font-bold mb-10">If you need immediate assistance, call <strong>(360) 521-0804</strong>.</p>
          <Link to="/" className="px-10 py-4 bg-teal-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-800 transition-all inline-block">Return Home</Link>
        </div>
      </section>
    );
  }

  const inputClass = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent";
  const labelClass = "text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 block";
  const sectionTitle = (icon, title) => <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">{icon} {title}</h3>;

  return (
    <section className="pt-32 pb-24 px-6 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"><ShieldCheck size={14} /> HIPAA-Compliant Secure Form</div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter mb-4">PIP / Auto Accident Intake</h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">Complete this form to start your PIP claim. All information is encrypted and handled in accordance with HIPAA regulations.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            {sectionTitle(<User className="text-teal-600" size={22} />, 'Patient Information')}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div><label className={labelClass}>First Name *</label><input name="firstName" type="text" required className={inputClass} /></div>
              <div><label className={labelClass}>Last Name *</label><input name="lastName" type="text" required className={inputClass} /></div>
              <div><label className={labelClass}>Phone Number *</label><input name="phone" type="tel" required className={inputClass} placeholder="(360) 555-0000" /></div>
              <div><label className={labelClass}>Email Address</label><input name="email" type="email" className={inputClass} /></div>
              <div><label className={labelClass}>Date of Birth</label><input name="dateOfBirth" type="date" className={inputClass} /></div>
              <div><label className={labelClass}>Mailing Address</label><input name="address" type="text" className={inputClass} placeholder="Street, City, State ZIP" /></div>
            </div>
          </div>
          <div className="bg-emerald-50/50 p-6 sm:p-10 rounded-[2.5rem] border border-emerald-100">
            {sectionTitle(<AlertCircle className="text-emerald-700" size={22} />, 'Accident & Insurance Details')}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div><label className={labelClass}>Date of Accident *</label><input name="accidentDate" type="date" required className={inputClass} /></div>
              <div><label className={labelClass}>Auto Insurance Company *</label><input name="insuranceCompany" type="text" required className={inputClass} placeholder="e.g. State Farm, GEICO" /></div>
              <div><label className={labelClass}>Claim Number</label><input name="claimNumber" type="text" className={inputClass} /></div>
              <div><label className={labelClass}>Policy Number</label><input name="policyNumber" type="text" className={inputClass} /></div>
              <div><label className={labelClass}>Adjuster Name</label><input name="adjusterName" type="text" className={inputClass} /></div>
              <div><label className={labelClass}>Adjuster Phone</label><input name="adjusterPhone" type="tel" className={inputClass} /></div>
            </div>
            <div className="mt-6"><label className={labelClass}>Describe the Accident & Your Injuries</label><textarea name="injuryDescription" rows={3} className={inputClass + ' resize-none'} placeholder="e.g. Rear-ended at a stoplight, experiencing neck and lower back pain..." /></div>
          </div>
          <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            {sectionTitle(<Activity className="text-teal-600" size={22} />, 'Areas of Pain')}
            <p className="text-sm text-slate-500 font-medium mb-4">Select all areas where you are experiencing pain or discomfort:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Neck / Cervical', 'Upper Back / Thoracic', 'Lower Back / Lumbar', 'Left Shoulder', 'Right Shoulder', 'Left Arm / Hand', 'Right Arm / Hand', 'Left Hip', 'Right Hip', 'Left Leg / Knee', 'Right Leg / Knee', 'Headaches'].map((area) => (
                <label key={area} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-teal-50 hover:border-teal-200 transition-all text-sm font-bold text-slate-700">
                  <input type="checkbox" name="painArea" value={area} className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />{area}
                </label>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            {sectionTitle(<ShieldCheck className="text-slate-500" size={22} />, 'Attorney Information (if applicable)')}
            <p className="text-sm text-slate-500 font-medium mb-4">If you have retained an attorney for your accident claim, provide their details below.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div><label className={labelClass}>Attorney Name</label><input name="attorneyName" type="text" className={inputClass} /></div>
              <div><label className={labelClass}>Law Firm</label><input name="lawFirm" type="text" className={inputClass} /></div>
              <div><label className={labelClass}>Attorney Phone</label><input name="attorneyPhone" type="tel" className={inputClass} /></div>
            </div>
          </div>
          <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            {sectionTitle(<Heart className="text-teal-600" size={22} />, 'Medical History')}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div><label className={labelClass}>Primary Care Physician</label><input name="physicianName" type="text" className={inputClass} /></div>
              <div><label className={labelClass}>Current Medications</label><input name="currentMedications" type="text" className={inputClass} placeholder="List any current medications" /></div>
            </div>
            <div className="mt-4"><label className={labelClass}>Pre-existing Conditions</label><textarea name="preExistingConditions" rows={2} className={inputClass + ' resize-none'} placeholder="List any conditions relevant to your injury (e.g. prior back surgery, arthritis)" /></div>
          </div>
          <div className="bg-slate-50 p-6 sm:p-10 rounded-[2.5rem] border border-slate-200">
            {sectionTitle(<ShieldCheck className="text-teal-700" size={22} />, 'Consent & Acknowledgment')}
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" name="consentToTreat" value="yes" required className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 mt-0.5" /><span className="text-sm font-medium text-slate-700"><strong>Consent to Treat:</strong> I authorize PNW Clinical Bodywork and Glen Arn, LMT to provide massage therapy treatment for my injuries. I understand the nature of the services offered and that results may vary. *</span></label>
              <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" name="hipaaAcknowledged" value="yes" required className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 mt-0.5" /><span className="text-sm font-medium text-slate-700"><strong>HIPAA Acknowledgment:</strong> I acknowledge that my health information will be collected, used, and protected in accordance with HIPAA regulations and PNW Clinical Bodywork's <Link to="/privacy" className="text-teal-600 underline">Privacy Policy</Link>. *</span></label>
            </div>
          </div>
          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-bold text-sm text-center">{error}</div>}
          <button type="submit" disabled={submitting} className="w-full py-6 bg-teal-700 text-white rounded-[2rem] font-black text-base sm:text-xl shadow-2xl shadow-teal-700/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? 'Submitting...' : 'Submit Secure Intake Form'}
          </button>
          <p className="text-center text-xs text-slate-400 font-medium">
            Your information is encrypted and transmitted securely. By submitting this form, you agree to our{' '}
            <Link to="/terms" className="text-teal-600 underline">Terms of Service</Link>{' '}and{' '}
            <Link to="/hipaa" className="text-teal-600 underline">HIPAA Compliance</Link>{' '}policies.
          </p>
        </form>
      </div>
    </section>
  );
}

function InsuranceView() {
  const { openBooking } = useBooking();
  return (
    <section className="pt-32 pb-24 px-6 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-sm font-black text-teal-600 uppercase tracking-widest mb-4">Insurance & Billing</h2>
          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter">We Handle the Paperwork</h3>
          <p className="mt-6 text-slate-500 max-w-2xl mx-auto font-medium">Whether you're paying out-of-pocket or filing through insurance, we make the process simple so you can focus on recovery.</p>
        </div>
        <div className="bg-emerald-50 p-8 sm:p-12 rounded-[3rem] border border-emerald-100 mb-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"><ShieldCheck size={14} /> PIP / Auto Accident Claims</div>
              <h3 className="text-3xl font-black text-emerald-900 mb-4 tracking-tight">Injured in a Car Accident?</h3>
              <p className="text-emerald-800 font-medium leading-relaxed mb-6">Washington State PIP (Personal Injury Protection) covers massage therapy for motor vehicle accident injuries. We bill your auto insurance directly — you pay nothing out of pocket in most cases.</p>
              <ul className="space-y-3 mb-8">
                {['We bill your auto insurance company directly','No upfront cost to you in most PIP cases','We handle all claim paperwork and CMS-1500 forms','Coordination with your attorney if applicable','Detailed treatment documentation for your claim'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-emerald-800 font-medium"><CheckCircle2 size={16} className="text-emerald-600 mt-1 flex-shrink-0" />{item}</li>
                ))}
              </ul>
              <Link to="/pip-intake" className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all">Start Your PIP Claim <ArrowRight size={16} /></Link>
            </div>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-emerald-100">
                <h4 className="text-sm font-black text-emerald-900 uppercase tracking-widest mb-3">How PIP Billing Works</h4>
                <ol className="space-y-4">
                  {[{step:'1',title:'Intake',desc:'Submit your claim number, insurance company, and accident date through our secure intake portal.'},{step:'2',title:'Treatment',desc:'Receive clinical massage therapy. We document every session with detailed SOAP notes.'},{step:'3',title:'We Bill',desc:'We generate CMS-1500 claim forms and submit them directly to your auto insurance.'},{step:'4',title:'You Heal',desc:'Focus on recovery. We handle follow-ups with the insurance company.'}].map((item) => (
                    <li key={item.step} className="flex items-start gap-3"><span className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0">{item.step}</span><div><p className="text-sm font-black text-slate-900">{item.title}</p><p className="text-xs text-slate-500 font-medium">{item.desc}</p></div></li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6"><ShieldCheck className="text-teal-600" size={28} /></div>
            <h4 className="text-2xl font-black text-slate-900 mb-4">Accepted Insurance</h4>
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100"><p className="text-lg font-black text-teal-900">Regence BlueCross BlueShield</p><p className="text-xs font-bold text-teal-600 mt-1">In-network provider</p></div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-lg font-black text-slate-700">Auto Insurance / PIP</p><p className="text-xs font-bold text-slate-500 mt-1">All WA auto insurance carriers accepted for MVA claims</p></div>
            </div>
            <p className="mt-6 text-sm text-slate-500 font-medium leading-relaxed">Don't see your carrier? Contact us at <strong>(360) 521-0804</strong> — we can verify your coverage and discuss options.</p>
          </div>
          <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-6"><CreditCard className="text-slate-600" size={28} /></div>
            <h4 className="text-2xl font-black text-slate-900 mb-4">Out-of-Pocket Rates</h4>
            <div className="space-y-3">
              {[{session:'60-Minute Session',price:'$100'},{session:'90-Minute Session',price:'$150'},{session:'2-Hour Session',price:'$200'}].map((item) => (
                <div key={item.session} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100"><span className="font-bold text-slate-700">{item.session}</span><span className="font-black text-teal-700 text-lg">{item.price}</span></div>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate-500 font-medium leading-relaxed">Payment is due at the time of service. We accept cash, check, and major credit cards.</p>
            <button onClick={openBooking} className="mt-6 w-full py-4 bg-teal-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/20">Book a Session</button>
          </div>
        </div>
        <div className="bg-slate-50 p-8 sm:p-12 rounded-[3rem] border border-slate-100">
          <h4 className="text-2xl font-black text-slate-900 mb-8 tracking-tight text-center">Common Questions</h4>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {q:'Do I need a referral from my doctor?',a:'No. In Washington State, you can see a licensed massage therapist without a physician referral.'},
              {q:'How many sessions does PIP cover?',a:'PIP coverage varies by policy, but most plans cover treatment related to your accident injuries until you reach maximum medical improvement. We track your progress with detailed SOAP notes to support your claim.'},
              {q:'What if my PIP claim is denied?',a:'We provide complete documentation to support appeals. If you have an attorney, we coordinate directly with their office.'},
              {q:'Can I use health insurance and PIP together?',a:'PIP is primary for auto accident injuries in Washington State. Once PIP benefits are exhausted, we can discuss health insurance or out-of-pocket options.'},
              {q:'Do you offer payment plans?',a:'Yes. For out-of-pocket patients, we offer treatment packages that reduce the per-session cost. Ask about our Recovery Bundle and Wellness Pack.'},
              {q:'What is a superbill?',a:'A superbill is an itemized receipt with CPT and diagnosis codes that you can submit to your health insurance for potential reimbursement on out-of-pocket sessions.'},
            ].map((item, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100"><h5 className="font-black text-slate-900 mb-2">{item.q}</h5><p className="text-sm text-slate-500 font-medium leading-relaxed">{item.a}</p></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogListView() {
  return (
    <section className="pt-32 pb-24 px-6 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-black text-teal-600 uppercase tracking-widest mb-4">Clinical Insights</h2>
          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter">Recovery Resources</h3>
          <p className="mt-6 text-slate-500 max-w-2xl mx-auto font-medium">Expert guidance on injury recovery, insurance claims, and clinical massage therapy from Glen Arn, LMT.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {BLOG_ARTICLES.map((article) => (
            <Link key={article.id} to={`/blog/${article.id}`} className="text-left bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-teal-100 transition-all group block">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full">{article.category}</span>
                <span className="text-[10px] font-bold text-slate-400">{article.readTime}</span>
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-3 group-hover:text-teal-700 transition-colors">{article.title}</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">{article.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{article.date}</span>
                <span className="flex items-center gap-1 text-xs font-black uppercase text-teal-700 opacity-0 group-hover:opacity-100 transition-opacity">Read <ChevronRight size={14} /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogArticleView() {
  const { slug } = useParams();
  const { openBooking } = useBooking();
  const article = BLOG_ARTICLES.find(a => a.id === slug);
  if (!article) return <Navigate to="/blog" replace />;
  return (
    <section className="pt-32 pb-24 px-6 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto">
        <Link to="/blog" className="flex items-center gap-2 text-xs font-black uppercase text-teal-700 hover:text-teal-900 tracking-widest mb-8 py-2">
          <ChevronRight size={14} className="rotate-180" /> All Articles
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full">{article.category}</span>
          <span className="text-[10px] font-bold text-slate-400">{article.date}</span>
          <span className="text-[10px] font-bold text-slate-400">{article.readTime}</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">{article.title}</h1>
        <p className="text-lg text-slate-500 font-medium mb-10 leading-relaxed">{article.excerpt}</p>
        <div className="flex items-center gap-3 mb-12 pb-8 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-teal-700 text-white flex items-center justify-center font-black text-sm">GA</div>
          <div><p className="text-sm font-black text-slate-900">Glen Arn, LMT</p><p className="text-[10px] font-bold text-slate-400 uppercase">Licensed Massage Therapist #77218</p></div>
        </div>
        <div className="space-y-10">
          {article.content.map((section, i) => (
            <div key={i}><h2 className="text-xl font-black text-slate-900 mb-3">{section.heading}</h2><p className="text-slate-600 font-medium leading-relaxed">{section.body}</p></div>
          ))}
        </div>
        <div className="mt-16 p-8 bg-teal-50 rounded-[2rem] border border-teal-100 text-center">
          <h3 className="text-xl font-black text-teal-900 mb-3">Ready to Start Your Recovery?</h3>
          <p className="text-sm text-teal-700 font-medium mb-6">Book a session with Glen or start your PIP intake today.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={openBooking} className="px-8 py-3 bg-teal-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-800 transition-all">Book a Session</button>
            <Link to="/pip-intake" className="px-8 py-3 bg-white border border-teal-200 text-teal-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-50 transition-all text-center">PIP Intake Form</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── App (root) ───────────────────────────────────────────────────────────
export default function App() {
  return (
    <BookingProvider>
      <ScrollToTop />
      <Layout />
    </BookingProvider>
  );
}
