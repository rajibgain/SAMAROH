import React, { useState } from 'react';

function App() {
  // Mock State for Hackathon Speed - We will connect Firebase here next!
  const [currentRole, setCurrentRole] = useState('All');
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Book Catering Advanced Payment', assignedTo: 'Ramesh Kaku', role: 'Catering', status: 'Pending', deadline: 'Today' },
    { id: 2, title: 'Finalize Stage Flower Decor', assignedTo: 'Sneha Di', role: 'Decor', status: 'In Progress', deadline: '17th May' },
    { id: 3, title: 'Send Digital WhatsApp Invites', assignedTo: 'Rajib', role: 'Invites', status: 'Completed', deadline: 'Completed' },
  ]);

  const [guestCount, setGuestCount] = useState({ total: 150, confirmed: 92, pending: 58 });
  const [budget, setBudget] = useState({ total: 500000, spent: 185000 });

  // Filter tasks based on selected family role
  const filteredTasks = currentRole === 'All' ? tasks : tasks.filter(t => t.role === currentRole);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Top Navbar */}
      <nav className="bg-amber-600 text-white shadow-md px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">✨ SAMAROH</h1>
          <p className="text-xs text-amber-100">Smart Family Event Coordination</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium bg-amber-700 px-3 py-1.5 rounded-full">🧑‍🍳 Role Filter:</span>
          <select 
            className="bg-white text-slate-800 rounded-lg px-2 py-1 text-sm font-semibold outline-none"
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
          >
            <option value="All">All Relatives</option>
            <option value="Catering">Catering Team (Uncles)</option>
            <option value="Decor">Decoration Team (Cousins)</option>
            <option value="Invites">Invitation Desk</option>
          </select>
        </div>
      </nav>

      {/* Main Content Dashboard */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Quick Stats Column */}
        <div className="md:col-span-1 flex flex-col gap-4">
          {/* Budget Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Budget Ledger</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1">₹{budget.spent.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">out of Max Budget: ₹{budget.total.toLocaleString()}</p>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(budget.spent / budget.total) * 100}%` }}></div>
            </div>
          </div>

          {/* Guests Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Guest Invitations</h3>
            <div className="grid grid-cols-3 gap-2 mt-2 text-center">
              <div className="bg-blue-50 p-2 rounded-xl">
                <span className="block text-xl font-bold text-blue-600">{guestCount.total}</span>
                <span className="text-[10px] text-slate-500">Invited</span>
              </div>
              <div className="bg-green-50 p-2 rounded-xl">
                <span className="block text-xl font-bold text-green-600">{guestCount.confirmed}</span>
                <span className="text-[10px] text-slate-500">Going</span>
              </div>
              <div className="bg-amber-50 p-2 rounded-xl">
                <span className="block text-xl font-bold text-amber-600">{guestCount.pending}</span>
                <span className="text-[10px] text-slate-500">Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task Tracking Column */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900">Active Arrangements ({filteredTasks.length})</h2>
            <button className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm">
              + Assign New Task
            </button>
          </div>

          {/* Task List Layout */}
          <div className="flex flex-col gap-3">
            {filteredTasks.map((task) => (
              <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-200 text-slate-600 rounded-md mr-2">
                    {task.role}
                  </span>
                  <h4 className="inline-block font-semibold text-slate-800 text-sm md:text-base">{task.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Responsible Person: <strong className="text-slate-700">{task.assignedTo}</strong></p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-none pt-2 sm:pt-0">
                  <span className="text-xs text-slate-400">Due: {task.deadline}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;