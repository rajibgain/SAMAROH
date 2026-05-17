import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign } from 'lucide-react';
import styles from '../styles/analytics.module.css';

export function BudgetAnalytics({ expenses = [] }) {
  const [categoryData, setCategoryData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);

  useEffect(() => {
    if (expenses.length === 0) return;

    // Category breakdown
    const categoryBreakdown = {};
    let total = 0;

    expenses.forEach(exp => {
      const cat = exp.category || 'Other';
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + (parseFloat(exp.amount) || 0);
      total += parseFloat(exp.amount) || 0;
    });

    const catData = Object.entries(categoryBreakdown).map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
      percentage: Math.round((value / total) * 100)
    }));

    setCategoryData(catData);
    setTotalBudget(total);

    // Timeline data
    const timeline = {};
    expenses.forEach(exp => {
      const date = exp.date || new Date().toISOString().split('T')[0];
      timeline[date] = (timeline[date] || 0) + (parseFloat(exp.amount) || 0);
    });

    const timeData = Object.entries(timeline)
      .sort()
      .map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: Math.round(amount * 100) / 100
      }));

    setTimelineData(timeData);
  }, [expenses]);

  const COLORS = ['#8e70c1', '#f8bbd0', '#ffab91', '#ffd54f', '#81c784', '#64b5f6'];

  if (expenses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={styles.empty}
      >
        <DollarSign size={48} />
        <p>No expenses recorded yet</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.container}
    >
      <div className={styles.summary}>
        <div className={styles.card}>
          <h4>Total Budget</h4>
          <p className={styles.amount}>${totalBudget.toFixed(2)}</p>
        </div>
        <div className={styles.card}>
          <h4>Transactions</h4>
          <p className={styles.count}>{expenses.length}</p>
        </div>
      </div>

      <div className={styles.charts}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={styles.chart}
        >
          <h3>Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={styles.chart}
        >
          <h3>Spending Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(142, 112, 193, 0.1)" />
              <XAxis dataKey="date" stroke="#8e70c1" />
              <YAxis stroke="#8e70c1" />
              <Tooltip
                contentStyle={{ background: 'rgba(255, 255, 255, 0.95)', border: '1px solid #8e70c1' }}
                formatter={(value) => `$${value.toFixed(2)}`}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8e70c1"
                strokeWidth={3}
                dot={{ fill: '#8e70c1', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={styles.chart}
        >
          <h3>Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(142, 112, 193, 0.1)" />
              <XAxis dataKey="name" stroke="#8e70c1" />
              <YAxis stroke="#8e70c1" />
              <Tooltip
                contentStyle={{ background: 'rgba(255, 255, 255, 0.95)', border: '1px solid #8e70c1' }}
                formatter={(value) => `$${value.toFixed(2)}`}
              />
              <Bar dataKey="value" fill="#8e70c1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={styles.breakdown}
      >
        <h3>
          <TrendingUp size={20} /> Category Details
        </h3>
        <div className={styles.list}>
          {categoryData.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.05 }}
              className={styles.item}
            >
              <div className={styles.itemInfo}>
                <span className={styles.category}>{cat.name}</span>
                <span className={styles.percentage}>{cat.percentage}%</span>
              </div>
              <div className={styles.bar}>
                <div
                  className={styles.barFill}
                  style={{ width: `${cat.percentage}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                />
              </div>
              <span className={styles.amount}>${cat.value.toFixed(2)}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
