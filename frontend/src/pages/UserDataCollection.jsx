import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Alert from '../components/Alert';
import useAxios from '../hooks/useAxios';
import { createPrediction } from '../services/predictionService';

const Tooltip = ({ text, children }) => (
  <div className="relative group inline-block">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-10 w-max max-w-xs whitespace-normal text-center shadow-lg pointer-events-none">
      {text}
      <svg className="absolute text-slate-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve">
        <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
      </svg>
    </div>
  </div>
);

const UserDataCollection = () => {
  const navigate = useNavigate();
  const api = useAxios();
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    age: '', sex: '1', smoking: '0', diabetes: '0', 
    chest_pain: '0', hypertension: '0', high_cholesterol: '0', 
    obesity: '0', family_history: '0', physically_inactive: '0'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPredicting(true);
    setError('');

    // Convert strings to numeric integers expected by the API
    const payload = {
      age: parseInt(formData.age, 10),
      sex: parseInt(formData.sex, 10),
      smoking: parseInt(formData.smoking, 10),
      diabetes: parseInt(formData.diabetes, 10),
      chest_pain: parseInt(formData.chest_pain, 10),
      hypertension: parseInt(formData.hypertension, 10),
      high_cholesterol: parseInt(formData.high_cholesterol, 10),
      obesity: parseInt(formData.obesity, 10),
      family_history: parseInt(formData.family_history, 10),
      physically_inactive: parseInt(formData.physically_inactive, 10),
    };
    
    try {
      const result = await createPrediction(api, payload);
      // Navigate to prediction result page and pass the result data
      navigate('/prediction', { state: { result } });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'AI service request failed. Please check inputs and try again.');
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Diagnostic Wizard</h1>
        <p className="text-slate-500 mt-1">Enter patient lifestyle and clinical factors for AI risk prediction.</p>
      </div>

      <Card className="p-0 overflow-hidden relative">
        <div className="p-8">
          {error && <Alert type="error" message={error} className="mb-6" />}
          <form onSubmit={handleSubmit}>
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-800">Patient Risk Profile</h2>
                <p className="text-sm text-slate-500 mt-1">Complete the 10 required fields to generate a comprehensive health report.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Demographics */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <i className="fa-solid fa-cake-candles text-brand-500 w-5"></i> Age
                  </label>
                  <div className="relative">
                    <input required type="number" min="1" max="120" name="age" value={formData.age} onChange={handleChange} className="w-full pl-4 pr-10 py-3 border-b-2 border-slate-200 focus:border-brand-500 bg-slate-50 rounded-t-xl transition-colors focus:outline-none font-medium text-slate-700" placeholder="e.g. 45" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold tracking-wider">YRS</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <i className="fa-solid fa-venus-mars text-purple-500 w-5"></i> Biological Sex
                  </label>
                  <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <button type="button" onClick={() => handleChange({target: {name: 'sex', value: '1'}})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${formData.sex === '1' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}><i className="fa-solid fa-mars"></i> Male</button>
                    <button type="button" onClick={() => handleChange({target: {name: 'sex', value: '0'}})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${formData.sex === '0' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}><i className="fa-solid fa-venus"></i> Female</button>
                  </div>
                </div>

                {/* Medical History */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <label className="flex items-center justify-between text-sm font-bold text-slate-700 mb-3">
                    <span className="flex items-center gap-2"><i className="fa-solid fa-heart-crack text-red-500 w-5"></i> Chest Pain</span>
                    <Tooltip text="Does the patient currently experience any form of chest pain?"><i className="fa-regular fa-circle-question text-slate-400"></i></Tooltip>
                  </label>
                  <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <button type="button" onClick={() => handleChange({target: {name: 'chest_pain', value: '0'}})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${formData.chest_pain === '0' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>No</button>
                    <button type="button" onClick={() => handleChange({target: {name: 'chest_pain', value: '1'}})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${formData.chest_pain === '1' ? 'bg-red-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>Yes</button>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <i className="fa-solid fa-gauge-high text-orange-500 w-5"></i> Hypertension
                  </label>
                  <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <button type="button" onClick={() => handleChange({target: {name: 'hypertension', value: '0'}})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${formData.hypertension === '0' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>No</button>
                    <button type="button" onClick={() => handleChange({target: {name: 'hypertension', value: '1'}})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${formData.hypertension === '1' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>Yes</button>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <i className="fa-solid fa-burger text-yellow-500 w-5"></i> High Cholesterol
                  </label>
                  <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <button type="button" onClick={() => handleChange({target: {name: 'high_cholesterol', value: '0'}})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${formData.high_cholesterol === '0' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>No</button>
                    <button type="button" onClick={() => handleChange({target: {name: 'high_cholesterol', value: '1'}})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${formData.high_cholesterol === '1' ? 'bg-yellow-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>Yes</button>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <i className="fa-solid fa-cubes-stacked text-blue-500 w-5"></i> Diabetes
                  </label>
                  <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <button type="button" onClick={() => handleChange({target: {name: 'diabetes', value: '0'}})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${formData.diabetes === '0' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>No</button>
                    <button type="button" onClick={() => handleChange({target: {name: 'diabetes', value: '1'}})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${formData.diabetes === '1' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>Yes</button>
                  </div>
                </div>
                
                {/* Lifestyle & Genetics */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <i className="fa-solid fa-smoking text-slate-500 w-5"></i> Smoking
                  </label>
                  <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <button type="button" onClick={() => handleChange({target: {name: 'smoking', value: '0'}})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${formData.smoking === '0' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>No</button>
                    <button type="button" onClick={() => handleChange({target: {name: 'smoking', value: '1'}})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${formData.smoking === '1' ? 'bg-slate-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>Yes</button>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <i className="fa-solid fa-weight-scale text-indigo-500 w-5"></i> Obesity
                  </label>
                  <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <button type="button" onClick={() => handleChange({target: {name: 'obesity', value: '0'}})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${formData.obesity === '0' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>No</button>
                    <button type="button" onClick={() => handleChange({target: {name: 'obesity', value: '1'}})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${formData.obesity === '1' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>Yes</button>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <i className="fa-solid fa-couch text-teal-500 w-5"></i> Physically Inactive
                  </label>
                  <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <button type="button" onClick={() => handleChange({target: {name: 'physically_inactive', value: '0'}})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${formData.physically_inactive === '0' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>No</button>
                    <button type="button" onClick={() => handleChange({target: {name: 'physically_inactive', value: '1'}})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${formData.physically_inactive === '1' ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>Yes</button>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <i className="fa-solid fa-dna text-pink-500 w-5"></i> Family History (Heart Disease)
                  </label>
                  <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <button type="button" onClick={() => handleChange({target: {name: 'family_history', value: '0'}})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${formData.family_history === '0' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>No</button>
                    <button type="button" onClick={() => handleChange({target: {name: 'family_history', value: '1'}})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${formData.family_history === '1' ? 'bg-pink-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>Yes</button>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isPredicting}
                  className="px-6 py-2.5 bg-brand-500 text-white font-medium rounded-xl shadow-sm hover:bg-brand-600 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:bg-brand-300 disabled:transform-none"
                >
                  {isPredicting ? (
                    <><i className="fa-solid fa-circle-notch fa-spin"></i> Analyzing...</>
                  ) : (
                    <><i className="fa-solid fa-wand-magic-sparkles"></i> Generate AI Report</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default UserDataCollection;
