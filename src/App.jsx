import React, { useState } from 'react';
import {
  Menu, X, ChevronRight, PlayCircle, ShieldCheck,
  CheckCircle2, MapPin, Phone, MessageSquare, ArrowRight,
  Stethoscope, Activity, Heart, Users, Calendar, Clock,
  Check, Quote, Star, LogIn
} from 'lucide-react';

const PORTAL_URL = 'https://portal.pnwclinicalbodywork.com';
const BOOKING_URLS = {
  '60': 'https://link.marketsimple.pro/widget/booking/bqERPQ65nI7B8U8aiuV6',
  '90': 'https://link.marketsimple.pro/widget/booking/J6RrXqJgAxQng60x9A7g',
  '120': 'https://link.marketsimple.pro/widget/booking/KTKamdGDgMsTGNagSEM0',
};
const BOOKING_URL = BOOKING_URLS['60'];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showBooking, setShowBooking] = useState(false);
  const [selectedBookingUrl, setSelectedBookingUrl] = useState(null);

  // Theme Colors: Muted Teal, Sage, White
  const colors = {
    teal: 'text-teal-800',
    bgTeal: 'bg-teal-700',
    sage: 'text-emerald-700',
    bgSage: 'bg-emerald-50',
    white: 'bg-white',
    slate: 'text-slate-600'
  };

  const NavItem = ({ label, id }) => (
    <button
      onClick={() => { setActiveTab(id); setIsMenuOpen(false); window.scrollTo(0,0); }}
      className={`text-sm font-bold tracking-tight transition-colors ${activeTab === id ? 'text-teal-700' : 'text-slate-500 hover:text-teal-600'}`}
    >
      {label}
    </button>
  );

  // --- SUB-VIEWS ---

  const HomeView = () => (
    <>
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/50 -skew-x-12 translate-x-1/2 z-0 hidden lg:block"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              <ShieldCheck size={14} /> Vancouver, WA Recovery Specialist
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.05] mb-6 tracking-tighter">
              Stop managing the pain and <span className="text-teal-700">start fixing the cause.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium mb-10 max-w-lg leading-relaxed">
              Clinical massage specifically designed for injury recovery. We help you get back to the activities you love, from hiking the Gorge to playing with your grandkids.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowBooking(true)}
                className="px-10 py-5 bg-teal-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-teal-700/30 hover:scale-105 transition-all"
              >
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
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-teal-900/20 mix-blend-multiply"></div>
              <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/90 backdrop-blur-md rounded-3xl border border-white/50 shadow-xl">
                <p className="text-teal-900 font-black italic text-lg leading-tight">"After just a few sessions with Glen, I had less pain and increased range of motion. I highly recommend him."</p>
                <p className="mt-3 text-xs font-black uppercase text-teal-600 tracking-widest">— Carrie F.</p>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-100 rounded-3xl -z-10 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Patient Spotlight / AI Generated Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-8">
              <div className="inline-flex items-center gap-2 text-teal-600 font-black uppercase text-[10px] tracking-[0.3em]">
                <Star size={14} /> Patient Spotlight
              </div>
              <h3 className="text-4xl font-black text-slate-900 leading-tight">
                From "Constant Discomfort" to the <span className="text-teal-700">Dance Floor.</span>
              </h3>
              <div className="space-y-4 text-slate-600 font-medium leading-relaxed">
                <p className="text-lg italic text-slate-500">
                  "I have a 38-degree curve in my spine. I was in constant discomfort and pain. I thought my days of being active with my grandkids were behind me."
                </p>
                <p>
                  When Diane first came to PNW Clinical Bodywork, she was resigned to "managing" her pain with medication and limited activity. Her granddaughter's wedding was six months away, and Diane's only goal was to be able to stand for the ceremony.
                </p>
                <p>
                  <strong>The Approach:</strong> Instead of a general relaxation massage, Glen focused on releasing the tight muscle groups that had been "combined and tightened" for most of Diane's life. Using targeted myofascial release and light therapy, they worked on the root causes of her spinal tension.
                </p>
                <p className="font-bold text-teal-800">
                  The Result: Diane didn't just stand for the ceremony—she danced for three hours. Two weeks later, she took the trip to the beach she had previously cancelled.
                </p>
              </div>
              <div className="pt-4">
                <button onClick={() => setActiveTab('blog')} className="flex items-center gap-2 text-sm font-black uppercase text-teal-700 hover:gap-4 transition-all">
                  Read More Stories <ArrowRight size={18} />
                </button>
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
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Pain Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-600 mb-4">The Challenge</h2>
          <h3 className="text-4xl font-black text-slate-900 mb-16 tracking-tight">Does chronic pain dictate your daily schedule?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Temporary Relief Isn't Enough", desc: "Spa massages feel good for an hour, but they don't fix the underlying structural issues.", icon: Heart },
              { title: "Limited Range of Motion", desc: "Feeling stuck in your own body prevents you from living your second half of life with vitality.", icon: Activity },
              { title: "Injury Breakdown", desc: "Just as you wouldn't drive a car with failing brakes, you shouldn't ignore your body's pain signals.", icon: Stethoscope }
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
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

  const ServicesView = () => (
    <section className="pt-32 pb-24 px-6 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-sm font-black text-teal-600 uppercase tracking-widest mb-4">Our Expertise</h2>
          <h3 className="text-5xl font-black text-slate-900 tracking-tighter">Specialized Clinical Care</h3>
          <p className="mt-6 text-slate-500 max-w-2xl mx-auto font-medium">We don't do "general" massage. We focus on clinical techniques that produce measurable results in pain reduction and mobility.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { name: "Myofascial Release", time: "60/90 Min", price: "$100+", desc: "Targets the stiff connective tissue to reduce chronic pain and improve flexibility.", icon: Activity },
            { name: "Injury Rehabilitation", time: "60/90 Min", price: "Insurance/PIP", desc: "Focuses on repairing damaged tissues from car accidents, surgeries, or repetitive strain.", icon: Stethoscope },
            { name: "Deep Tissue Massage", time: "60/90 Min", price: "$100+", desc: "Firm strokes on deeper layers of muscle to relieve stubborn chronic tension.", icon: Heart },
            { name: "Trigger Point Therapy", time: "60 Min", price: "$100", desc: "Focused pressure on 'knots' that cause referred pain in other parts of the body.", icon: Users }
          ].map((s, i) => (
            <div key={i} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col items-start hover:bg-white hover:shadow-2xl hover:border-teal-100 transition-all group">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-teal-700 group-hover:text-white transition-colors">
                 <s.icon size={24} />
               </div>
               <div className="flex justify-between w-full items-start mb-4">
                 <h4 className="text-2xl font-black">{s.name}</h4>
                 <span className="text-xs font-black text-teal-600 uppercase bg-teal-50 px-3 py-1 rounded-full">{s.time}</span>
               </div>
               <p className="text-slate-500 font-medium leading-relaxed mb-8">{s.desc}</p>
               <button
                onClick={() => setShowBooking(true)}
                className="mt-auto flex items-center gap-2 text-xs font-black uppercase tracking-widest text-teal-700 hover:text-teal-900 transition-colors"
               >
                 Check Availability <ChevronRight size={14} />
               </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const AboutView = () => (
    <section className="pt-32 pb-24 px-6 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-[4/5] bg-slate-100 rounded-[4rem] overflow-hidden shadow-2xl relative">
               <div className="absolute inset-0 bg-[url('/images/glen-arn.jpg')] bg-cover bg-center bg-top"></div>
               <div className="absolute inset-0 bg-teal-900/10"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-8 rounded-3xl shadow-xl border border-slate-50">
              <p className="text-3xl font-black text-teal-700 leading-none">20+</p>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Years Clinical Exp.</p>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-black text-teal-600 uppercase tracking-widest mb-4">Meet Glen Arn, LMT</h2>
            <h3 className="text-5xl font-black text-slate-900 leading-tight mb-8 tracking-tighter">Helping you get back to the things you love.</h3>
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

  const LegalPage = ({ title, children }) => (
    <section className="pt-32 pb-24 px-6 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 text-xs font-black uppercase text-teal-700 hover:text-teal-900 tracking-widest mb-8">
          <ChevronRight size={14} className="rotate-180" /> Back to Home
        </button>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">{title}</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-12">Effective Date: April 29, 2026</p>
        <div className="prose prose-slate max-w-none space-y-8 text-slate-600 font-medium leading-relaxed">
          {children}
        </div>
      </div>
    </section>
  );

  const PrivacyView = () => (
    <LegalPage title="Privacy Policy">
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">Who We Are</h2>
        <p>PNW Clinical Bodywork is a licensed massage therapy practice operated by Glen Arn, LMT #77218, located at 5514 NE 107th Ave. Ste. 101, Vancouver, WA 98662. This policy describes how we collect, use, and protect your personal information.</p>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Contact information:</strong> Name, email, phone number, and mailing address when you book an appointment or submit an inquiry.</li>
          <li><strong>Health information:</strong> Intake forms, treatment history, SOAP notes, and insurance details necessary for clinical care and billing. This information is protected under HIPAA (see our HIPAA Compliance page).</li>
          <li><strong>Booking data:</strong> Appointment dates, times, and session preferences collected through our scheduling system.</li>
          <li><strong>Website usage:</strong> We do not use third-party analytics or tracking scripts on this website. No cookies are set for advertising purposes.</li>
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To provide and coordinate your clinical care</li>
          <li>To process insurance claims and PIP billing</li>
          <li>To communicate appointment reminders and follow-ups</li>
          <li>To comply with legal and regulatory requirements</li>
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">Information Sharing</h2>
        <p>We do not sell, rent, or trade your personal information. We may share your information only in the following circumstances:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><strong>Insurance companies:</strong> To process claims and PIP/auto accident billing on your behalf.</li>
          <li><strong>Legal requirements:</strong> When required by law, court order, or regulatory authority.</li>
          <li><strong>Service providers:</strong> Our scheduling and practice management platform (Go High Level) processes booking and communication data under a Business Associate Agreement.</li>
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">Data Security</h2>
        <p>All data transmitted through this website and our clinical portal is encrypted via HTTPS/TLS. Access to patient records is restricted to authorized personnel only. See our HIPAA Compliance page for additional safeguards.</p>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">Your Rights</h2>
        <p>You have the right to access, correct, or request deletion of your personal information. For health records, see our HIPAA Compliance page for your rights under federal law. For all other inquiries, contact us at (360) 521-0804.</p>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">Changes to This Policy</h2>
        <p>We may update this policy as our practices evolve. The effective date at the top of this page reflects the most recent revision.</p>
      </div>
    </LegalPage>
  );

  const TermsView = () => (
    <LegalPage title="Terms of Service">
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">Agreement to Terms</h2>
        <p>By accessing this website or booking an appointment with PNW Clinical Bodywork, you agree to the following terms. If you do not agree, please do not use our services.</p>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">Services</h2>
        <p>PNW Clinical Bodywork provides clinical massage therapy services including myofascial release, injury rehabilitation, deep tissue massage, and trigger point therapy. Our services are therapeutic in nature and are not a substitute for medical diagnosis or treatment by a physician.</p>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">Appointments &amp; Cancellation</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Appointments are scheduled through our online booking system or by phone at (360) 521-0804.</li>
          <li>We require <strong>24 hours' notice</strong> for cancellations. Late cancellations or no-shows may be subject to a fee equal to the full session rate.</li>
          <li>We reserve the right to limit scheduling to a maximum of 4 appointments per day to ensure quality of care.</li>
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">Pricing &amp; Payment</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>60-Minute Session: $100</li>
          <li>90-Minute Session: $150</li>
          <li>2-Hour Session: $200</li>
          <li>PIP and auto accident claims are billed directly to the insurance provider.</li>
          <li>Payment is due at the time of service unless covered by insurance.</li>
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">Referral Program</h2>
        <p>When you refer a new client, both you and the referred client receive $25 off your next session. Referral credits are non-transferable and cannot be redeemed for cash.</p>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">Insurance &amp; PIP Claims</h2>
        <p>We accept Regence BlueCross BlueShield and process PIP/auto accident claims. It is the client's responsibility to verify their coverage and provide accurate insurance information. We are not responsible for claims denied due to policy limitations or incorrect information.</p>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">Limitation of Liability</h2>
        <p>PNW Clinical Bodywork provides services with professional care and skill. However, results vary by individual. We are not liable for outcomes that fall outside the scope of licensed massage therapy practice. By receiving treatment, you acknowledge that you have disclosed all relevant medical conditions and understand the nature of the services provided.</p>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">Website</h2>
        <p>This website is provided for informational purposes. We make reasonable efforts to keep content accurate but do not guarantee completeness. Links to third-party services (booking, insurance portals) are provided for convenience and are governed by their own terms.</p>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">Contact</h2>
        <p>Questions about these terms may be directed to PNW Clinical Bodywork at (360) 521-0804 or at our office: 5514 NE 107th Ave. Ste. 101, Vancouver, WA 98662.</p>
      </div>
    </LegalPage>
  );

  const HipaaView = () => (
    <LegalPage title="HIPAA Compliance">
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">Our Commitment</h2>
        <p>PNW Clinical Bodywork is committed to protecting the privacy and security of your Protected Health Information (PHI) in accordance with the Health Insurance Portability and Accountability Act of 1996 (HIPAA) and the Washington State Health Care Information Act (RCW 70.02).</p>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">What Is Protected Health Information?</h2>
        <p>PHI includes any individually identifiable health information related to your past, present, or future care. This includes your name, contact details, treatment records, SOAP notes, diagnosis codes, insurance information, and billing records.</p>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">How We Protect Your PHI</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Access controls:</strong> Only Glen Arn, LMT and authorized staff have access to patient records. Access is role-based and password-protected.</li>
          <li><strong>Encryption:</strong> All data in transit is encrypted via TLS/HTTPS. Clinical records are stored in systems that encrypt data at rest.</li>
          <li><strong>Session security:</strong> Our clinical portal enforces automatic logout after 20 minutes of inactivity.</li>
          <li><strong>Business Associate Agreements:</strong> We maintain BAAs with all third-party vendors who handle PHI on our behalf.</li>
          <li><strong>Minimum necessary:</strong> We only access, use, and share the minimum amount of PHI required to provide your care and process billing.</li>
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">Your Rights Under HIPAA</h2>
        <p>As a patient, you have the right to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><strong>Access:</strong> Request a copy of your health records.</li>
          <li><strong>Amendment:</strong> Request corrections to inaccurate information in your records.</li>
          <li><strong>Accounting of disclosures:</strong> Request a list of entities to whom we have disclosed your PHI.</li>
          <li><strong>Restriction:</strong> Request restrictions on certain uses or disclosures of your PHI.</li>
          <li><strong>Confidential communications:</strong> Request that we communicate with you through a specific method or at a specific location.</li>
          <li><strong>Complaint:</strong> File a complaint if you believe your privacy rights have been violated, without fear of retaliation.</li>
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">Permitted Uses and Disclosures</h2>
        <p>We may use or disclose your PHI without your authorization for the following purposes:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><strong>Treatment:</strong> To provide, coordinate, or manage your care.</li>
          <li><strong>Payment:</strong> To bill and collect payment from you or your insurance provider, including PIP and auto accident claims.</li>
          <li><strong>Healthcare operations:</strong> For quality assurance, compliance, and administrative functions.</li>
          <li><strong>Legal requirements:</strong> When required by federal, state, or local law.</li>
        </ul>
        <p className="mt-2">All other uses and disclosures require your written authorization, which you may revoke at any time.</p>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">Breach Notification</h2>
        <p>In the event of a breach of unsecured PHI, we will notify affected individuals within 60 days as required by the HIPAA Breach Notification Rule. If a breach affects more than 500 individuals, we will also notify the U.S. Department of Health and Human Services and local media.</p>
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-3">Contact &amp; Complaints</h2>
        <p>To exercise your rights, request information, or file a complaint, contact:</p>
        <div className="mt-3 p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="font-black text-slate-900">Glen Arn, LMT — Privacy Officer</p>
          <p>PNW Clinical Bodywork</p>
          <p>5514 NE 107th Ave. Ste. 101, Vancouver, WA 98662</p>
          <p>Phone: (360) 521-0804</p>
        </div>
        <p className="mt-4">You may also file a complaint with the U.S. Department of Health and Human Services Office for Civil Rights at <span className="font-bold">hhs.gov/ocr</span>.</p>
      </div>
    </LegalPage>
  );

  const closeBooking = () => { setShowBooking(false); setSelectedBookingUrl(null); };

  const BookingModal = () => (
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
              <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-black uppercase text-teal-700 hover:text-teal-900">
                <LogIn size={14} /> Practitioner Portal
              </a>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <iframe
              src={selectedBookingUrl}
              title="Book Appointment"
              className="w-full h-full border-0"
              allow="payment"
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      {showBooking && <BookingModal />}

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <Activity className="text-teal-600" size={32} />
            <div className="leading-none">
              <span className="text-xl font-black tracking-tighter text-slate-800">PNW CLINICAL</span>
              <br/><span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-700">Bodywork</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <NavItem label="Home" id="home" />
            <NavItem label="Services" id="services" />
            <NavItem label="About Glen" id="about" />
            <NavItem label="Insurance" id="insurance" />
            <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" className="text-sm font-bold tracking-tight text-slate-500 hover:text-teal-600 transition-colors flex items-center gap-1.5">
              <LogIn size={14} /> Practitioner Portal
            </a>
            <button
              onClick={() => setShowBooking(true)}
              className="bg-teal-700 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/20"
            >
              Book Now
            </button>
          </div>

          <button className="md:hidden text-slate-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 p-6 flex flex-col gap-6 animate-in slide-in-from-top-4">
            <NavItem label="Home" id="home" />
            <NavItem label="Services" id="services" />
            <NavItem label="About Glen" id="about" />
            <NavItem label="Insurance" id="insurance" />
            <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold tracking-tight text-slate-500 hover:text-teal-600 transition-colors flex items-center gap-2">
              <LogIn size={16} /> Practitioner Portal
            </a>
            <button
              onClick={() => { setShowBooking(true); setIsMenuOpen(false); }}
              className="w-full bg-teal-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest"
            >
              Book Appointment
            </button>
          </div>
        )}
      </nav>

      {/* Render Dynamic Content */}
      <main>
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'services' && <ServicesView />}
        {activeTab === 'about' && <AboutView />}
        {activeTab === 'privacy' && <PrivacyView />}
        {activeTab === 'terms' && <TermsView />}
        {activeTab === 'hipaa' && <HipaaView />}
        {(activeTab === 'insurance' || activeTab === 'blog') && (
          <div className="pt-40 pb-40 px-6 text-center">
            <h3 className="text-2xl font-black mb-4">Content coming soon</h3>
            <p className="text-slate-500 mb-8 font-medium">We are currently drafting our {activeTab} information.</p>
            <button onClick={() => setActiveTab('home')} className="text-teal-600 font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 mx-auto">
               Return Home <ArrowRight size={14} />
            </button>
          </div>
        )}
      </main>

      {/* Shared Sections: CTA & Footer */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
        <div className="bg-emerald-50 p-12 rounded-[3rem] border border-emerald-100 flex flex-col justify-center">
          <h3 className="text-3xl font-black text-emerald-900 mb-6 tracking-tight">Have a PIP or Auto Accident Claim?</h3>
          <p className="text-emerald-800 font-medium mb-8 leading-relaxed">
            We specialize in Motor Vehicle Accident (MVA) recovery. We bill the insurance companies directly so you can focus on healing, not paperwork.
          </p>
          <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" className="self-start flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all">
            Start Insurance Inquiry <ArrowRight size={16} />
          </a>
        </div>
        <div className="bg-teal-50 p-12 rounded-[3rem] border border-teal-100 flex flex-col justify-center">
          <h3 className="text-3xl font-black text-teal-900 mb-6 tracking-tight">Referral Program</h3>
          <p className="text-teal-800 font-medium mb-8 leading-relaxed">
            When you refer a friend, you both receive $25 off your next session. It's our way of saying thank you for trusting us with your recovery.
          </p>
          <div className="flex items-center gap-4">
            <Users className="text-teal-600" size={40} />
            <p className="text-sm font-black text-teal-900 uppercase tracking-tighter">Refer a Friend, Get $25</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 pt-24 pb-12 px-6 text-white rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6" onClick={() => setActiveTab('home')}>
              <Activity className="text-teal-400" size={28} />
              <h1 className="text-xl font-black tracking-tighter">PNW CLINICAL BODYWORK</h1>
            </div>
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
                (360) 521-0804
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
          <div className="flex gap-8">
            <button onClick={() => { setActiveTab('privacy'); window.scrollTo(0,0); }} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => { setActiveTab('terms'); window.scrollTo(0,0); }} className="hover:text-white transition-colors">Terms of Service</button>
            <button onClick={() => { setActiveTab('hipaa'); window.scrollTo(0,0); }} className="hover:text-white transition-colors">HIPAA Compliance</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
