import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Card from '../components/Card';

// SVG Gauge Chart
const GaugeChart = ({ percentage }) => {
  const [animatedPct, setAnimatedPct] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPct(percentage), 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPct / 100) * (circumference / 2);
  
  const getColor = (p) => {
    if (p < 40) return '#22c55e'; // Green
    if (p < 70) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  return (
    <div className="relative w-64 h-36 mx-auto overflow-hidden">
      <svg className="w-full h-full transform rotate-180" viewBox="0 0 160 100">
        <circle 
          cx="80" cy="80" r="60" 
          fill="transparent" stroke="#f1f5f9" strokeWidth="15" 
          strokeDasharray={circumference} strokeDashoffset={circumference / 2}
          className="transform rotate-90 origin-center"
        />
        <circle 
          cx="80" cy="80" r="60" 
          fill="transparent" stroke={getColor(animatedPct)} strokeWidth="15" 
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          className="transform rotate-90 origin-center transition-all duration-1500 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 text-center pb-2">
        <span className="text-4xl font-extrabold text-slate-800">{animatedPct}%</span>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Risk Probability</p>
      </div>
    </div>
  );
};

const Prediction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get result data from router state
  const result = location.state?.result;

  if (!result) {
    // If accessed directly without data, redirect to data collection
    return <Navigate to="/data-collection" replace />;
  }

  // Resolve snake_case vs camelCase fields returned by API
  const riskScore = result.risk_score ?? result.riskScore ?? 0;
  const riskLevel = result.risk_level ?? result.riskLevel ?? 'Unknown Risk';
  const keyRiskFactors = result.key_risk_factors ?? result.keyRiskFactors ?? [];
  const medicalInsights = result.medical_insights ?? result.medicalInsights ?? '';
  const recommendations = result.recommendations ?? [];
  const preventiveMeasures = result.preventive_measures ?? result.preventiveMeasures ?? [];
  const disclaimer = result.disclaimer ?? '';

  return (
    <div className="animate-fade-in max-w-4xl mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Diagnostic Result</h1>
        <p className="text-slate-500 mt-1">Review the AI-generated health report based on your data.</p>
      </div>

      <Card className="p-0 overflow-hidden relative">
        <div className="p-8">
          <div className="animate-fade-in text-center">
            <div className="mb-6 flex justify-between items-start">
              <button onClick={() => navigate('/data-collection')} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-arrow-left"></i> Back to Input
              </button>
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border 
                ${riskScore > 70 ? 'bg-brand-100 text-brand-800 border-brand-200' : 
                  riskScore > 30 ? 'bg-orange-100 text-orange-800 border-orange-200' : 
                  'bg-green-100 text-green-800 border-green-200'}`}>
                {riskScore > 70 && <i className="fa-solid fa-triangle-exclamation"></i>}
                {riskLevel}
              </span>
              <div className="w-8"></div> {/* Spacer */}
            </div>
            
            <GaugeChart percentage={riskScore} />
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-brain text-brand-500"></i> Medical Insights
                </h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{medicalInsights}</p>
                
                <h4 className="font-bold text-sm text-slate-700 mb-2">Key Risk Factors:</h4>
                <div className="flex flex-wrap gap-2">
                  {keyRiskFactors.map((factor, i) => (
                    <span key={i} className="bg-white border border-slate-200 text-xs px-2.5 py-1 rounded-md text-slate-600">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-list-check text-brand-500"></i> Recommendations
                </h3>
                <ul className="space-y-2 mb-4">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-600">
                      <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0"></i>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
                
                <h4 className="font-bold text-sm text-slate-700 mb-2 mt-4">Preventive Measures:</h4>
                <ul className="space-y-2">
                  {preventiveMeasures.map((measure, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-600">
                      <i className="fa-solid fa-shield-heart text-blue-400 mt-0.5 flex-shrink-0"></i>
                      <span>{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl text-left">
              <p className="text-xs text-orange-800 italic">
                <i className="fa-solid fa-circle-info mr-1"></i> {disclaimer}
              </p>
            </div>

            {/* Agent Breakdown Section */}
            {result._id && (
              <div className="mt-8 border-t border-slate-200 pt-8 text-left">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg">
                  <i className="fa-solid fa-network-wired text-brand-500"></i> AI Agent Workflow Breakdown
                </h3>
                <p className="text-slate-500 text-sm mb-4">Transparency in AI: See exactly how our specialized agents collaborated behind the scenes to generate your report.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link to={`/agent/prediction/${result._id}`} className="block p-4 border border-slate-200 rounded-xl hover:border-brand-300 hover:shadow-md transition-all bg-white group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <i className="fa-solid fa-robot"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-700">Agent 1: ML Prediction</h4>
                        <p className="text-xs text-slate-500">View model execution and scores</p>
                      </div>
                    </div>
                  </Link>

                  <Link to={`/agent/risk/${result._id}`} className="block p-4 border border-slate-200 rounded-xl hover:border-brand-300 hover:shadow-md transition-all bg-white group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <i className="fa-solid fa-magnifying-glass-chart"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-700">Agent 2: Risk Analysis</h4>
                        <p className="text-xs text-slate-500">View factor weights and projections</p>
                      </div>
                    </div>
                  </Link>

                  <Link to={`/agent/rag/${result._id}`} className="block p-4 border border-slate-200 rounded-xl hover:border-brand-300 hover:shadow-md transition-all bg-white group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <i className="fa-solid fa-database"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-700">Agent 3: RAG Retrieval</h4>
                        <p className="text-xs text-slate-500">View queried medical literature</p>
                      </div>
                    </div>
                  </Link>

                  <Link to={`/agent/recommendation/${result._id}`} className="block p-4 border border-slate-200 rounded-xl hover:border-brand-300 hover:shadow-md transition-all bg-white group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <i className="fa-solid fa-heart-pulse"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-700">Agent 4: Recommendations</h4>
                        <p className="text-xs text-slate-500">View personalized care synthesis</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-center gap-4">
              <button onClick={() => navigate('/data-collection')} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors">
                New Prediction
              </button>
              <Link to="/chat" className="px-6 py-2.5 bg-brand-500 text-white font-medium rounded-xl shadow-sm hover:bg-brand-600 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                <i className="fa-solid fa-robot"></i> Discuss with AI
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Prediction;
