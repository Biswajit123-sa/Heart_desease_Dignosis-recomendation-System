import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/Card';

import api from '../services/api';

const AgentRiskAnalysisView = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/agent-risk/${id}`);
        setData(res.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("Agent data not found. This prediction was likely created before detailed agent tracking was enabled. Please create a new prediction.");
        } else {
          setError(err.message || 'Failed to fetch Agent Risk Analysis data');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading Agent 2 data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="animate-fade-in max-w-4xl mx-auto py-12">
      <div className="mb-8">
        <Link to="/prediction" className="text-brand-500 hover:underline mb-4 inline-block">&larr; Back to Main Report</Link>
        <h1 className="text-3xl font-bold text-slate-800">Agent 2: Risk Analysis</h1>
        <p className="text-slate-500 mt-1">Internal view of risk factor identification and future projections.</p>
      </div>

      <Card className="p-8">
        <div className="space-y-4 text-slate-700">
          <p><strong>Prediction ID:</strong> {data.predictionId}</p>
          <p><strong>Computed Risk Level:</strong> {data.risk_level}</p>
          <p><strong>Agent Risk Summary:</strong> {data.risk_summary}</p>
          <p><strong>Future Outlook Projection:</strong> {data.future_outlook}</p>
          
          <h3 className="font-bold mt-6 mb-2">Key Risk Factors Analyzed:</h3>
          <ul className="list-disc pl-5">
            {data.key_risk_factors?.map((f, i) => (
              <li key={i}>{f.name} (Weight: {f.weight})</li>
            ))}
          </ul>
          
          <div className="mt-6 p-4 bg-slate-50 rounded-lg text-sm font-mono border border-slate-200 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AgentRiskAnalysisView;
