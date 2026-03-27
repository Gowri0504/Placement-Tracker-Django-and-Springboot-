import React from 'react';
import { FiTrendingUp, FiAlertCircle, FiCheckCircle, FiTarget } from 'react-icons/fi';
import Card from '../ui/Card';
import { motion } from 'framer-motion';

const InsightsCard = ({ prsData, stats }) => {
  const getInsights = () => {
    const insights = [];
    if (!prsData || !prsData.breakdown) return [];

    const { breakdown } = prsData;

    // 🧠 AI-Style Insights (Smart Suggestion Engine)
    
    // 1. Time Efficiency vs Accuracy
    if (breakdown.accuracy > 80 && breakdown.timeEfficiency < 50) {
      insights.push({
        type: 'improvement',
        title: 'Speed Up Your Logic',
        desc: 'You solve problems accurately but take 40% more time than average. Focus on BFS/DFS pattern speed.',
        icon: <FiTarget className="text-amber-400" />,
        color: 'border-amber-500/20 bg-amber-500/5'
      });
    }

    // 2. Weak Topic Decay Detection
    if (breakdown.coreCoverage > 60 && breakdown.consistency < 40) {
      insights.push({
        type: 'alert',
        title: 'Revision Needed',
        desc: 'Your SQL joins accuracy dropped after 10 days of inactivity — schedule a quick revision session.',
        icon: <FiAlertCircle className="text-rose-400" />,
        color: 'border-rose-500/20 bg-rose-500/5'
      });
    }

    // 3. Pattern Mastery Suggestion
    if (breakdown.difficulty < 40) {
      insights.push({
        type: 'suggestion',
        title: 'Level Up Challenge',
        desc: 'You are comfortable with Easy problems. It is time to tackle "Medium" DP – Knapsack patterns.',
        icon: <FiTrendingUp className="text-blue-400" />,
        color: 'border-blue-500/20 bg-blue-500/5'
      });
    }

    // 4. Mock Interview Recommendation
    if (breakdown.accuracy > 70 && breakdown.coreCoverage > 70) {
      insights.push({
        type: 'success',
        title: 'Interview Ready?',
        desc: 'Your fundamentals are strong. A mock interview is highly recommended this week to test your soft skills.',
        icon: <FiCheckCircle className="text-emerald-400" />,
        color: 'border-emerald-500/20 bg-emerald-500/5'
      });
    }

    return insights;
  };

  const insights = getInsights();

  // Smart Suggestions based on data
  const getSmartSuggestion = () => {
    if (!prsData || !prsData.breakdown) return "Complete your first task to see AI recommendations.";
    const { breakdown } = prsData;
    
    if (breakdown.coreCoverage < 50) return "Master 'OS: Process Management' today to boost your core score.";
    if (breakdown.accuracy < 60) return "Solve 5 'Easy' Arrays problems to improve your base accuracy.";
    if (breakdown.difficulty < 50) return "Try 3 'Medium' Trees problems today to challenge yourself.";
    
    return "Your progress is balanced. Schedule a mock interview or refine your resume.";
  };

  if (insights.length === 0) return null;

  return (
    <Card className="h-full">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <FiTarget className="text-primary" />
        AI Insights & Suggestions
      </h3>
      <div className="space-y-4">
        {insights.map((insight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-4 rounded-xl border ${insight.color} flex gap-4`}
          >
            <div className="mt-1">{insight.icon}</div>
            <div>
              <h4 className="font-bold text-white text-sm">{insight.title}</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">{insight.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20">
        <p className="text-primary font-bold text-xs uppercase tracking-wider mb-2">Next Step</p>
        <p className="text-white text-sm">
          {getSmartSuggestion()}
        </p>
      </div>
    </Card>
  );
};

export default InsightsCard;
