import React, { useState } from 'react';
import {
  Menu, X, ChevronRight, PlayCircle, ShieldCheck,
  CheckCircle2, MapPin, Phone, MessageSquare, ArrowRight,
  Stethoscope, Activity, Heart, Users
} from 'lucide-react';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

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
      onClick={() => { setActiveTab(id); setIsMenuOpen(false); }}
      className={`text-sm font-bold tracking-tight transition-colors ${activeTab === id ? 'text-teal-700' : 'text-slate-500 hover:text-teal-600'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-teal-100 selection:text-teal-900">

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
            <NavItem label="Blog" id="blog" />
            <button className="bg-teal-700 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/20">
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
            <NavItem label="Blog" id="blog" />
            <button className="w-full bg-teal-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest">Book Appointment</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/50 -skew-x-12 translate-x-1/2 z-0 hidden lg:block"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
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
              <button className="px-10 py-5 bg-teal-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-teal-700/30 hover:scale-105 transition-all">
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
          <div className="relative">
            <div className="aspect-[4/5] bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl ring-8 ring-white relative group">
              {/* Mock Hero Video Placeholder */}
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

      {/* The Guide / About Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-sm font-black text-teal-600 uppercase tracking-widest mb-4">Meet Your Therapist</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-8 tracking-tight">
              A Personal Journey from 15 Broken Bones to Clinical Expertise.
            </h3>
            <div className="space-y-6 text-slate-600 font-medium leading-relaxed">
              <p>
                Glen Arn grew up right here in the Pacific Northwest. After surviving roughly 15 broken bones throughout his active life, Glen developed a deep understanding of what it means to live in a body that's signaling for help.
              </p>
              <p>
                He lives in Vancouver with his wife and their three children. When he's not in the clinic, you'll find him exploring the mountains or the coast. This personal tie to an active lifestyle is why he's so passionate about keeping you on the road.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(n => (
                  <div key={n} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200"></div>
                ))}
              </div>
              <p className="text-sm font-bold text-slate-500"><span className="text-slate-900">20+ Years</span> of Clinical Experience</p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="aspect-square bg-slate-100 rounded-[4rem] overflow-hidden shadow-2xl relative">
                 {/* Placeholder for updated Headshot */}
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700"></div>
                 <div className="absolute inset-0 bg-teal-900/10"></div>
              </div>
              <div className="absolute -top-6 -left-6 px-8 py-4 bg-teal-700 text-white rounded-2xl shadow-2xl">
                <p className="text-xs font-black uppercase tracking-widest">Glen Arn, LMT</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-teal-900 text-white rounded-[3rem] mx-6 mb-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-800 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>
        <div className="max-w-7xl mx-auto px-10 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-teal-400 mb-4">Specialized Treatments</h2>
              <h3 className="text-4xl font-black tracking-tight leading-none">High-performance recovery for everyday life.</h3>
            </div>
            <button className="text-teal-400 font-black uppercase text-xs tracking-widest border-b-2 border-teal-400 pb-1 hover:text-white hover:border-white transition-all">View Full Menu</button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Myofascial Release", desc: "Targets the connective tissue to 'unstick' tightness and restore mobility." },
              { name: "Treatment Massage", desc: "Clinical therapy tailored to fix specific muscular pain and knots." },
              { name: "Injury Rehab", desc: "Clinical repair for car accidents, surgeries, or repetitive strain." },
              { name: "Trigger Point", desc: "Focused pressure to release hypersensitive knots and referred pain." }
            ].map((service, i) => (
              <div key={i} className="p-8 bg-teal-800/50 rounded-3xl border border-teal-700 hover:bg-teal-800 transition-all">
                <h4 className="text-xl font-black mb-4">{service.name}</h4>
                <p className="text-teal-200/70 text-sm font-medium leading-relaxed mb-8">{service.desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-teal-400">
                  Book Session <ChevronRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance CTA */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
        <div className="bg-emerald-50 p-12 rounded-[3rem] border border-emerald-100 flex flex-col justify-center">
          <h3 className="text-3xl font-black text-emerald-900 mb-6 tracking-tight">Have a PIP or Auto Accident Claim?</h3>
          <p className="text-emerald-800 font-medium mb-8 leading-relaxed">
            We specialize in Motor Vehicle Accident (MVA) recovery. We bill the insurance companies directly so you can focus on healing, not paperwork. No out-of-pocket charges for patients with active PIP coverage.
          </p>
          <button className="self-start flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all">
            Start Insurance Inquiry <ArrowRight size={16} />
          </button>
        </div>
        <div className="bg-teal-50 p-12 rounded-[3rem] border border-teal-100 flex flex-col justify-center">
          <h3 className="text-3xl font-black text-teal-900 mb-6 tracking-tight">Referral Program</h3>
          <p className="text-teal-800 font-medium mb-8 leading-relaxed">
            Share the gift of movement. When you refer a friend, you both receive $25 off your next session. It's our way of saying thank you for trusting us with your recovery.
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
            <div className="flex items-center gap-2 mb-6">
              <Activity className="text-teal-400" size={28} />
              <h1 className="text-xl font-black tracking-tighter">PNW CLINICAL BODYWORK</h1>
            </div>
            <p className="text-slate-400 font-medium max-w-sm mb-8 leading-relaxed">
              Helping you get back to the things you love through targeted, clinical manual therapy in Vancouver, WA.
            </p>
            <div className="flex gap-4">
               {/* Social Icons Placeholder */}
               <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-700 transition-colors cursor-pointer">
                 <Phone size={18} />
               </div>
               <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-700 transition-colors cursor-pointer">
                 <MessageSquare size={18} />
               </div>
            </div>
          </div>
          <div>
            <h5 className="font-black uppercase text-xs tracking-widest text-teal-400 mb-6">Contact</h5>
            <ul className="space-y-4 text-slate-400 text-sm font-bold">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-teal-400 shrink-0 mt-1" />
                5514 NE 107th Ave. Ste. 100<br/>Vancouver, WA 98662
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-teal-400" />
                (360) 555-0123
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
          <p>© 2026 PNW Clinical Bodywork. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">HIPAA Compliance</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
