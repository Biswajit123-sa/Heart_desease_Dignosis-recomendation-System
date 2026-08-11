import React from 'react';
import heroImg from '../assets/photo-1698247888586-80f7f3e8cc84.avif';
import predictionAgentImg from '../assets/prediction_agent.webp';
import riskAgentImg from '../assets/risk_analysis agent.avif';
import ragAgentImg from '../assets/knowledgerag_agent.avif';
import recommendationAgentImg from '../assets/recomendation_agent.webp';
import reportAgentImg from '../assets/report_generation-agent.avif';

const About = () => {
  return (
    <div className="flex-1 bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20 animate-fade-in">
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Pioneering the Future of <span className="text-brand-500">Cardiology</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              HeartCare AI is dedicated to providing cutting-edge AI technology for the early detection and prevention of heart disease. We combine state-of-the-art machine learning models with accessible digital tools to offer reliable health risk assessments and actionable insights to patients and providers globally.
            </p>
            <div className="flex gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex-1 text-center">
                <h3 className="text-3xl font-bold text-brand-500 mb-1">98%</h3>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Model Accuracy</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex-1 text-center">
                <h3 className="text-3xl font-bold text-blue-500 mb-1">5+</h3>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">AI Agents</p>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-100 to-blue-100 rounded-[2.5rem] transform rotate-3 opacity-70"></div>
            <img 
              src={heroImg} 
              alt="Medical Professional" 
              className="relative w-full object-cover h-[400px] rounded-[2rem] shadow-2xl"
            />
          </div>
        </div>

        {/* How Agents Work Section */}
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How Our AI Agents Work</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">A seamless pipeline of specialized intelligent agents collaborating to deliver actionable medical insights.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Agent 1 */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
            <div className="h-48 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent z-10"></div>
              <img src={predictionAgentImg} alt="ML Prediction Agent" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white font-bold">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <i className="fa-solid fa-robot"></i>
                </div>
                1.Prediction Agent (ML Prediction)
              </div>
            </div>
            <div className="p-8">
              <p className="text-slate-600 leading-relaxed">Processes raw health inputs through our trained machine learning model to calculate an initial, highly accurate risk score and label.</p>
            </div>
          </div>
          
          {/* Agent 2 */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
            <div className="h-48 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent z-10"></div>
              <img src={riskAgentImg} alt="Risk Analysis Agent" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white font-bold">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                  <i className="fa-solid fa-magnifying-glass-chart"></i>
                </div>
                2. Risk Analysis Agent
              </div>
            </div>
            <div className="p-8">
              <p className="text-slate-600 leading-relaxed">Evaluates specific physiological risk factors and projects long-term future trajectories based on the initial prediction.</p>
            </div>
          </div>

          {/* Agent 3 */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
            <div className="h-48 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent z-10"></div>
              <img src={ragAgentImg} alt="RAG Retrieval Agent" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white font-bold">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <i className="fa-solid fa-database"></i>
                </div>
                3. RAG Retrieval (knowledge agent)
              </div>
            </div>
            <div className="p-8">
              <p className="text-slate-600 leading-relaxed">Queries specialized local medical literature and databases to ground AI recommendations in evidence-based science.</p>
            </div>
          </div>

          {/* Agent 4 */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
            <div className="h-48 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent z-10"></div>
              <img src={recommendationAgentImg} alt="Recommendation Agent" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white font-bold">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <i className="fa-solid fa-heart-pulse"></i>
                </div>
                4. Recommendation Agent
              </div>
            </div>
            <div className="p-8">
              <p className="text-slate-600 leading-relaxed">Synthesizes the data to generate highly personalized lifestyle changes and preventive measures aligned with medical guidelines.</p>
            </div>
          </div>

          {/* Agent 5 */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
            <div className="h-48 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent z-10"></div>
              <img src={reportAgentImg} alt="Report Generation Agent" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white font-bold">
                <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
                  <i className="fa-solid fa-file-medical"></i>
                </div>
                5. Report Generation Agent
              </div>
            </div>
            <div className="p-8">
              <p className="text-slate-600 leading-relaxed">Drafts a cohesive, empathetic summary of all findings to present the final medical insight directly to the user.</p>
            </div>
          </div>
        </div>
        
        {/* Disclaimer */}
        <div className="max-w-3xl mx-auto p-6 bg-orange-50 border border-orange-100 rounded-2xl shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-xl mx-auto mb-4">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
          <p className="text-sm text-orange-800 leading-relaxed">
            <strong>Disclaimer:</strong> HeartCare AI is a predictive tool intended for informational and educational purposes. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </div>

      </div>
    </div>
  );
};

export default About;
