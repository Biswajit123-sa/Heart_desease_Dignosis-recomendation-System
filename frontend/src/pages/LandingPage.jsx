import React from 'react';
import { Link } from 'react-router-dom';

// Import assets
import analyticsImg from '../assets/predictativeanalysis.avif';
import crmImg from '../assets/premium_photo-1681996543579-b24cd01d4516.avif';
import chatImg from '../assets/chataiassistant.avif';
import stethoscopeImg from '../assets/istockphoto-506476770-612x612.webp';

const LandingPage = () => {
  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-white z-0"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-100 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-100 blur-3xl opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-left animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-sm font-bold mb-8">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
                </span>
                AI-Powered Healthcare
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                Predicting Heart Health with <span className="text-brand-500 bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-orange-500">Precision</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                Empower your practice with predictive analytics, seamless patient management, and an intelligent clinical chatbot designed for modern healthcare professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-brand-500/30 transition-all hover:-translate-y-1 text-lg flex items-center justify-center gap-2">
                  Get Started <i className="fa-solid fa-arrow-right"></i>
                </Link>
                <Link to="/login" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-lg flex items-center justify-center">
                   Login
                </Link>
              </div>
            </div>

            <div className="lg:w-1/2 w-full relative animate-fade-in">
              <div className="absolute -inset-4 bg-gradient-to-l from-brand-100 to-orange-100 rounded-[2.5rem] transform -rotate-3 opacity-70"></div>
              <img 
                src={stethoscopeImg} 
                alt="Heart and Stethoscope" 
                className="relative w-full object-cover h-[450px] rounded-[2rem] shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-20 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Next-Generation Clinical Tools</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Everything you need to deliver proactive cardiovascular care in one integrated platform.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-brand-100/50 hover:-translate-y-2 transition-all duration-300 border border-slate-100 group">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                <img src={analyticsImg} alt="Predictive Analytics" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white font-bold">
                  <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
                    <i className="fa-solid fa-heart-pulse"></i>
                  </div>
                  Predictive Analytics
                </div>
              </div>
              <div className="p-8">
                <p className="text-slate-600 leading-relaxed">Advanced ML models analyze 13 critical clinical variables to predict heart disease risk with unprecedented accuracy, enabling early intervention.</p>
              </div>
            </div>
            
            {/* Feature Card 2 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-2 transition-all duration-300 border border-slate-100 group">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                <img src={crmImg} alt="Patient CRM" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white font-bold">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <i className="fa-solid fa-users"></i>
                  </div>
                  Patient CRM
                </div>
              </div>
              <div className="p-8">
                <p className="text-slate-600 leading-relaxed">Efficiently manage comprehensive patient records, track historical predictions, and monitor dynamic risk statuses over time in a secure environment.</p>
              </div>
            </div>
            
            {/* Feature Card 3 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-100/50 hover:-translate-y-2 transition-all duration-300 border border-slate-100 group">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                <img src={chatImg} alt="AI Chat Assistant" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white font-bold">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <i className="fa-solid fa-robot"></i>
                  </div>
                  AI Chat Assistant
                </div>
              </div>
              <div className="p-8">
                <p className="text-slate-600 leading-relaxed">A specialized conversational AI trained extensively on cardiovascular guidelines to answer diagnostic, dietary, and lifestyle questions instantly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-500 via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to transform your clinical workflow?</h2>
          <p className="text-slate-300 mb-10 text-lg">Join forward-thinking healthcare providers using AI to save lives.</p>
          <Link to="/register" className="bg-brand-500 hover:bg-brand-400 text-white px-10 py-4 rounded-xl font-bold shadow-lg transition-all hover:-translate-y-1 text-lg inline-block">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 text-center border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <i className="fa-solid fa-heart-pulse text-brand-500"></i> HeartCare AI
          </div>
          <p className="text-slate-500 text-sm">© 2026 Heart Disease AI System. All rights reserved.</p>
          
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
