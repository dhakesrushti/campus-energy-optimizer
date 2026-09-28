import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { fetchSavings } from '../services/api';
import { TrendingDown, DollarSign, Leaf, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function EnergySavings() {
  const [savingsData, setSavingsData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    const loadSavings = async () => {
      try {
        const data = await fetchSavings();
        setSavingsData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadSavings();
    const interval = setInterval(loadSavings, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleGenerateReport = () => {
    setGeneratingReport(true);
    setReportSuccess(false);
    
    try {
      const doc = new jsPDF();
      const date = new Date().toLocaleString();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(33, 150, 243);
      doc.text('Campus Energy Optimizer', 14, 20);
      
      doc.setFontSize(16);
      doc.setTextColor(50, 50, 50);
      doc.text('AI Energy Savings Report', 14, 30);
      
      // Section 1: Executive Summary
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('1. Executive Summary', 14, 45);
      
      autoTable(doc, {
        startY: 50,
        theme: 'striped',
        head: [['Metric', 'Value']],
        body: [
          ['Report Date', new Date().toLocaleDateString()],
          ['Report Time', new Date().toLocaleTimeString()],
          ['Total Sensor Records Analyzed', `${savingsData.total_records_analyzed}`],
          ['System Status', 'Active (Optimizing)']
        ]
      });

      // Section 2: Current Performance
      const finalY1 = doc.lastAutoTable.finalY + 10;
      doc.text('2. Current Performance', 14, finalY1);
      
      autoTable(doc, {
        startY: finalY1 + 5,
        theme: 'striped',
        head: [['Metric', 'Value']],
        body: [
          ['Expected Consumption (Baseline)', `${savingsData.baseline_consumption} W`],
          ['Actual Consumption', `${savingsData.current_consumption} W`],
          ['Optimization Efficiency', `${savingsData.optimization_efficiency}%`],
          ['Energy Saved Today', `${savingsData.energy_saved_today_kwh} kWh`],
          ['Cost Saved Today', `₹${savingsData.cost_saved_today}`]
        ]
      });

      // Section 3: Savings Analysis
      const finalY2 = doc.lastAutoTable.finalY + 10;
      doc.text('3. Savings Analysis', 14, finalY2);
      
      autoTable(doc, {
        startY: finalY2 + 5,
        theme: 'striped',
        head: [['Period', 'Energy Saved (kWh)', 'Cost Saved (₹)']],
        body: [
          ['Daily', savingsData.energy_saved_today_kwh, savingsData.cost_saved_today],
          ['Weekly (Proj.)', (savingsData.energy_saved_today_kwh * 7).toFixed(2), (savingsData.cost_saved_today * 7).toFixed(2)],
          ['Monthly (Proj.)', (savingsData.energy_saved_today_kwh * 30).toFixed(2), savingsData.monthly_savings],
          ['Annual (Proj.)', (savingsData.energy_saved_today_kwh * 365).toFixed(2), savingsData.annual_savings]
        ]
      });

      // Add a new page for remaining sections
      doc.addPage();
      
      // Section 4: Baseline vs Actual
      doc.text('4. Baseline vs Actual Consumption', 14, 20);
      
      autoTable(doc, {
        startY: 25,
        theme: 'striped',
        head: [['Metric', 'Power (Watts)']],
        body: [
          ['Baseline Consumption (ML Predicted)', savingsData.baseline_consumption],
          ['Actual Consumption (Sensor Reading)', savingsData.current_consumption],
          ['Reduction Percentage', `${savingsData.reduction_percentage}%`]
        ]
      });

      // Section 5: Environmental Impact
      const finalY3 = doc.lastAutoTable.finalY + 10;
      doc.text('5. Environmental Impact', 14, finalY3);
      
      const co2Kg = (savingsData.energy_saved_today_kwh * 0.82).toFixed(2);
      const co2Tons = (co2Kg / 1000).toFixed(4);
      
      autoTable(doc, {
        startY: finalY3 + 5,
        theme: 'striped',
        head: [['Metric', 'Amount Avoided']],
        body: [
          ['CO2 Saved Today (kg)', `${co2Kg} kg`],
          ['CO2 Saved Today (tons)', `${co2Tons} tons`]
        ]
      });

      // Section 6: AI Insights
      const finalY4 = doc.lastAutoTable.finalY + 10;
      doc.text('6. AI Insights', 14, finalY4);
      
      autoTable(doc, {
        startY: finalY4 + 5,
        theme: 'striped',
        head: [['Insight / System Feedback']],
        body: [
          [savingsData.dynamic_insight || '']
        ]
      });
      
      // Section 7: Recommendations
      const finalY5 = doc.lastAutoTable.finalY + 10;
      doc.text('7. Recommendations', 14, finalY5);
      
      autoTable(doc, {
        startY: finalY5 + 5,
        theme: 'striped',
        head: [['Automated Recommendation']],
        body: [
          [savingsData.dynamic_recommendation || '']
        ]
      });
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount} - College Project Campus Energy Optimizer - Generated: ${date}`, 14, 285);
      }

      // Download PDF
      doc.save('Campus_Energy_Optimizer_AI_Report.pdf');
      
      setTimeout(() => {
        setGeneratingReport(false);
        setReportSuccess(true);
        setTimeout(() => setReportSuccess(false), 5000);
      }, 500);

    } catch (err) {
      console.error("PDF Generation Error: ", err);
      setGeneratingReport(false);
    }
  };

  if (loading) return <div className="text-white text-lg">Calculating Real-time Savings...</div>;
  if (error) return <div className="text-red-500 text-lg">Error loading savings data: {error}</div>;
  if (!savingsData) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Energy Savings & ROI</h2>
        <p className="text-gray-400 mt-1">Real-time calculations based on ML predictions vs Actual consumption</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard className="flex flex-col items-center justify-center text-center py-6">
          <div className="p-4 rounded-full bg-primary-green/20 text-primary-green mb-4">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">{savingsData.energy_saved_today_kwh} kWh</h3>
          <p className="text-gray-400">Energy Saved Today</p>
        </GlassCard>
        
        <GlassCard className="flex flex-col items-center justify-center text-center py-6">
          <div className="p-4 rounded-full bg-primary-blue/20 text-primary-blue mb-4">
            <DollarSign className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">₹{savingsData.cost_saved_today}</h3>
          <p className="text-gray-400">Cost Saved Today</p>
        </GlassCard>

        <GlassCard className="flex flex-col items-center justify-center text-center py-6">
          <div className="p-4 rounded-full bg-yellow-500/20 text-yellow-400 mb-4">
            <TrendingDown className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">{savingsData.optimization_efficiency}%</h3>
          <p className="text-gray-400">Optimization Efficiency</p>
        </GlassCard>

        <GlassCard className="flex flex-col items-center justify-center text-center py-6">
          <div className="p-4 rounded-full bg-purple-500/20 text-purple-400 mb-4">
            <Activity className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">₹{savingsData.monthly_savings}</h3>
          <p className="text-gray-400">Projected Monthly Savings</p>
        </GlassCard>
        
        <GlassCard className="flex flex-col items-center justify-center text-center py-6">
          <div className="p-4 rounded-full bg-teal-500/20 text-teal-400 mb-4">
            <Leaf className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">₹{savingsData.annual_savings}</h3>
          <p className="text-gray-400">Projected Annual Savings</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-6">Baseline vs Actual Consumption</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Expected (Baseline)</span>
                <span className="text-white font-semibold">{savingsData.baseline_consumption} W</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div className="bg-gray-500 h-3 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Actual (Optimized)</span>
                <span className="text-white font-semibold">{savingsData.current_consumption} W</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - savingsData.reduction_percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-primary-green h-3 rounded-full"
                />
              </div>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="flex flex-col justify-center relative">
            <div className="text-center p-8">
                <h3 className="text-2xl font-bold text-white mb-2">System Reduction: {savingsData.reduction_percentage}%</h3>
                <p className="text-gray-400 text-sm mb-6">
                    By actively comparing the Machine Learning expected power with the true consumption, 
                    we are saving {savingsData.energy_saved_today_kwh} kWh of energy per day.
                </p>
                <button 
                  onClick={handleGenerateReport}
                  disabled={generatingReport}
                  className={`px-6 py-3 text-white font-medium rounded-xl transition-all shadow-lg shadow-primary-blue/20 ${generatingReport ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-primary-green to-primary-blue hover:opacity-90'}`}>
                    {generatingReport ? 'Generating...' : 'Export AI Savings Report'}
                </button>
                {reportSuccess && (
                  <p className="text-primary-green text-sm mt-4 font-semibold absolute bottom-4 left-0 right-0">
                    ROI Report Generated Successfully!
                  </p>
                )}
            </div>
        </GlassCard>
      </div>
    </div>
  );
}
