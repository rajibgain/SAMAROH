import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertCircle, Target, Zap } from 'lucide-react';
import { CHART_COLORS, COLORS } from '../constants';
import styles from '../styles/budgetanalytics.module.css';

export function AdvancedBudgetAnalytics({ expenses = [], budget = 0, guests = [] }) {
  const [analysisMode, setAnalysisMode] = useState('overview');

  const analytics = useMemo(() => {
    return calculateBudgetAnalytics(expenses, budget, guests);
  }, [expenses, budget, guests]);

  const categoryColors = {
    Catering: CHART_COLORS.CATERING,
    Venue: CHART_COLORS.VENUE,
    Decoration: CHART_COLORS.DECORATION,
    Entertainment: CHART_COLORS.ENTERTAINMENT,
    Photography: CHART_COLORS.PHOTOGRAPHY,
    Gifts: CHART_COLORS.GIFTS,
    Transportation: CHART_COLORS.TRANSPORTATION,
    Other: CHART_COLORS.OTHER,
  };

  return (
    <div className={styles.budgetContainer}>
      <div className={styles.header}>
        <h2>💰 Advanced Budget Analytics & AI Insights</h2>
        <p>Smart spending analysis with predictions</p>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <motion.div
          className={styles.metric}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={`${styles.metricIcon} ${styles.metricIconBudget}`}>
            <span className={styles.colorPrimary}>₹</span>
          </div>
          <div className={styles.metricContent}>
            <p className={styles.label}>Total Budget</p>
            <h3 className={styles.value}>₹{budget.toLocaleString('en-IN')}</h3>
          </div>
        </motion.div>

        <motion.div
          className={styles.metric}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={`${styles.metricIcon} ${styles.metricIconSpent}`}>
            <span className={styles.colorDanger}>₹</span>
          </div>
          <div className={styles.metricContent}>
            <p className={styles.label}>Spent</p>
            <h3 className={styles.value}>₹{analytics.totalSpent.toLocaleString('en-IN')}</h3>
          </div>
        </motion.div>

        <motion.div
          className={styles.metric}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={`${styles.metricIcon} ${styles.metricIconRemaining}`}>
            <span className={styles.colorSuccess}>₹</span>
          </div>
          <div className={styles.metricContent}>
            <p className={styles.label}>Remaining</p>
            <h3 className={`${styles.value} ${analytics.remaining < 0 ? styles.danger : ''}`}>
              ₹{analytics.remaining.toLocaleString('en-IN')}
            </h3>
          </div>
        </motion.div>

        <motion.div
          className={styles.metric}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={`${styles.metricIcon} ${styles.metricIconPercentage}`}>
            <span className={styles.colorWarning}>%</span>
          </div>
          <div className={styles.metricContent}>
            <p className={styles.label}>Budget Used</p>
            <h3 className={styles.value}>{analytics.percentageUsed}%</h3>
          </div>
        </motion.div>
      </div>

      {/* Analysis Tabs */}
      <div className={styles.tabs}>
        {['overview', 'breakdown', 'predictions', 'insights'].map(tab => (
          <motion.button
            key={tab}
            className={`${styles.tab} ${analysisMode === tab ? styles.active : ''}`}
            onClick={() => setAnalysisMode(tab)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Charts Section */}
      <div className={styles.chartsContainer}>
        {analysisMode === 'overview' && (
          <motion.div
            className={styles.chartWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3>Spending Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="amount" fill={COLORS.PRIMARY} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {analysisMode === 'breakdown' && (
          <motion.div
            className={styles.chartWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3>Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill={COLORS.PRIMARY}
                  dataKey="amount"
                >
                  {analytics.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[entry.category] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {analysisMode === 'predictions' && (
          <motion.div
            className={styles.chartWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3>Budget Projection</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="spent" stroke={COLORS.DANGER} strokeWidth={2} dot={{ fill: COLORS.DANGER }} />
                <Line type="monotone" dataKey="projected" stroke={COLORS.PRIMARY} strokeWidth={2} strokeDasharray="5 5" dot={{ fill: COLORS.PRIMARY }} />
                <Line type="monotone" dataKey="budget" stroke={COLORS.SUCCESS} strokeWidth={2} dot={{ fill: COLORS.SUCCESS }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {analysisMode === 'insights' && (
          <motion.div
            className={styles.insightsWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3>📊 AI-Generated Insights</h3>
            <div className={styles.insightsList}>
              {analytics.insights.map((insight, idx) => (
                <motion.div
                  key={idx}
                  className={`${styles.insight} ${styles[insight.type]}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className={styles.insightIcon}>
                    {insight.type === 'warning' && <AlertCircle size={20} />}
                    {insight.type === 'success' && <Zap size={20} />}
                    {insight.type === 'info' && <TrendingUp size={20} />}
                  </div>
                  <div className={styles.insightContent}>
                    <h4>{insight.title}</h4>
                    <p>{insight.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Cost Optimization Tips */}
      <div className={styles.tipsSection}>
        <h3>💡 Cost Optimization Tips</h3>
        <div className={styles.tipsList}>
          {analytics.optimizationTips.map((tip, idx) => (
            <motion.div
              key={idx}
              className={styles.tip}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <span className={styles.tipNumber}>{idx + 1}</span>
              <p>{tip}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate analytics
function calculateBudgetAnalytics(expenses, budget, guests) {
  const totalSpent = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const remaining = budget - totalSpent;
  const percentageUsed = budget > 0 ? Math.min(100, Math.round((totalSpent / budget) * 100)) : 0;

  // Group by category
  const categoryMap = {};
  expenses.forEach(exp => {
    const category = exp.category || 'Other';
    categoryMap[category] = (categoryMap[category] || 0) + (exp.amount || 0);
  });

  const categoryData = Object.entries(categoryMap).map(([category, amount]) => ({
    category,
    amount
  }));

  // Generate projection data (next 4 weeks)
  const avgWeeklySpend = totalSpent > 0 ? totalSpent / Math.ceil(expenses.length / 2) : 0;
  const projectionData = Array.from({ length: 4 }, (_, i) => ({
    week: `Week ${i + 1}`,
    spent: i === 0 ? totalSpent : totalSpent,
    projected: totalSpent + (avgWeeklySpend * (i + 1)),
    budget: budget
  }));

  // Generate insights
  const insights = generateBudgetInsights(totalSpent, budget, categoryData, guests);

  // Generate optimization tips
  const optimizationTips = [
    `Negotiate with top ${categoryData.length > 0 ? categoryData[0].category.toLowerCase() : 'vendors'} vendors for bulk discounts`,
    'Consider off-peak timing for better rates',
    'Combine multiple services to get package deals',
    'Look for alternative options with comparable quality',
    'Build relationships for long-term discounts',
    'Set aside 10% contingency fund for emergencies'
  ];

  return {
    totalSpent,
    remaining,
    percentageUsed,
    categoryData,
    projectionData,
    insights,
    optimizationTips
  };
}

function generateBudgetInsights(spent, budget, categoryData, guests) {
  const insights = [];

  // Budget status insight
  const percentageUsed = budget > 0 ? (spent / budget) * 100 : 0;
  if (percentageUsed > 100) {
    insights.push({
      type: 'warning',
      title: 'Budget Exceeded',
      message: `You have exceeded your budget by ₹${(spent - budget).toFixed(2)}. Consider reducing expenses or increasing budget.`
    });
  } else if (percentageUsed > 90) {
    insights.push({
      type: 'warning',
      title: 'Budget Warning',
      message: `You are at ${percentageUsed.toFixed(0)}% of your budget. Be cautious with remaining expenses.`
    });
  } else if (percentageUsed < 50 && budget > 0) {
    insights.push({
      type: 'info',
      title: 'Budget on Track',
      message: `You have ₹${(budget - spent).toFixed(2)} remaining. Good budget management!`
    });
  }

  // Category insights
  if (categoryData.length > 0) {
    const topCategory = categoryData.reduce((prev, current) =>
      prev.amount > current.amount ? prev : current
    );
    insights.push({
      type: 'info',
      title: `${topCategory.category} is Your Largest Expense`,
      message: `₹${topCategory.amount.toFixed(2)} (${((topCategory.amount / categoryData.reduce((s, c) => s + c.amount, 0)) * 100).toFixed(1)}% of total)`
    });
  }

  // Per head cost
  if (guests.length > 0) {
    const perHeadCost = spent / guests.length;
    insights.push({
      type: 'success',
      title: 'Per Head Cost Analysis',
      message: `Your average cost per guest is ₹${perHeadCost.toFixed(2)}. This helps with scalability.`
    });
  }

  return insights;
}
