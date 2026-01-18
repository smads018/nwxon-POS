
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Order } from '../types';

interface Props {
  orders: Order[];
}

const Reports: React.FC<Props> = ({ orders }) => {
  const chartData = useMemo(() => {
    // Group orders by last 7 days or simply by ID for this demo
    return orders.slice(0, 10).map(o => ({
      name: `#${o.id}`,
      sales: o.total,
    })).reverse();
  }, [orders]);

  const stats = useMemo(() => {
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    const avgOrder = orders.length > 0 ? totalSales / orders.length : 0;
    const deliveryShare = orders.length > 0 ? (orders.filter(o => o.type === 'Delivery').length / orders.length) * 100 : 0;
    
    return { totalSales, avgOrder, deliveryShare, count: orders.length };
  }, [orders]);

  return (
    <div className="p-6 h-full space-y-6 overflow-auto custom-scrollbar">
      <h1 className="text-2xl font-black text-gray-800">Business Analytics</h1>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-l-4 border-l-indigo-600">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Sales</p>
          <p className="text-2xl font-black text-gray-800">Rs. {stats.totalSales.toLocaleString()}</p>
          <p className="text-xs text-green-500 font-bold mt-2">↑ 12% from last week</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-l-4 border-l-orange-500">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Orders</p>
          <p className="text-2xl font-black text-gray-800">{stats.count}</p>
          <p className="text-xs text-indigo-500 font-bold mt-2">Active POS Session</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-l-4 border-l-blue-500">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Order Value</p>
          <p className="text-2xl font-black text-gray-800">Rs. {Math.round(stats.avgOrder).toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-2 font-medium">Lifetime Average</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-l-4 border-l-teal-500">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Delivery Share</p>
          <p className="text-2xl font-black text-gray-800">{Math.round(stats.deliveryShare)}%</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3">
             <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${stats.deliveryShare}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-chart-column text-indigo-600"></i>
            Recent Sales Activity
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#818cf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-4 bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-ranking-star text-orange-500"></i>
            Popular Categories
          </h3>
          <div className="space-y-4">
             {[
               { name: 'Food', count: 42, color: 'bg-indigo-500' },
               { name: 'Beverages', count: 28, color: 'bg-orange-500' },
               { name: 'Sides', count: 15, color: 'bg-teal-500' },
               { name: 'Deals', count: 10, color: 'bg-red-500' },
             ].map(item => (
               <div key={item.name} className="flex items-center gap-4">
                  <div className={`w-2 h-10 ${item.color} rounded-full`}></div>
                  <div className="flex-1">
                     <p className="text-sm font-bold text-gray-800">{item.name}</p>
                     <p className="text-xs text-gray-400">{item.count} items sold today</p>
                  </div>
                  <span className="text-xs font-black text-gray-700">{Math.round((item.count/95)*100)}%</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
