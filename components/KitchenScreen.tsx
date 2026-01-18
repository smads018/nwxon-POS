
import React from 'react';
import { Order, OrderStatus } from '../types';

interface Props {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

const KitchenScreen: React.FC<Props> = ({ orders, onUpdateStatus }) => {
  const activeOrders = orders.filter(o => 
    o.status === OrderStatus.PENDING || 
    o.status === OrderStatus.PREPARING || 
    o.status === OrderStatus.READY
  );

  return (
    <div className="p-6 h-full flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border shadow-sm">
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
          <i className="fa-solid fa-fire-burner text-orange-500"></i>
          Kitchen Queue
        </h1>
        <div className="flex gap-4">
          <div className="text-center bg-orange-50 px-4 py-1 rounded-lg">
             <p className="text-[10px] font-bold text-orange-600 uppercase">Pending</p>
             <p className="text-xl font-black text-orange-700">{activeOrders.filter(o => o.status === OrderStatus.PENDING).length}</p>
          </div>
          <div className="text-center bg-indigo-50 px-4 py-1 rounded-lg">
             <p className="text-[10px] font-bold text-indigo-600 uppercase">Preparing</p>
             <p className="text-xl font-black text-indigo-700">{activeOrders.filter(o => o.status === OrderStatus.PREPARING).length}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 flex gap-6 custom-scrollbar">
        {activeOrders.map(order => (
          <div key={order.id} className="w-80 flex-shrink-0 bg-white rounded-2xl shadow-lg border overflow-hidden flex flex-col border-t-4 border-t-indigo-500">
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-indigo-600">#{order.id}</p>
                <p className="text-sm font-black text-gray-800">{order.type} Order</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400">Time Elapsed</p>
                <p className="text-xs font-bold text-orange-500">4m 20s</p>
              </div>
            </div>

            <div className="flex-1 p-4 space-y-3 overflow-auto custom-scrollbar">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs font-bold mr-2">{item.quantity}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">{item.nameEn}</p>
                    <p className="text-xs text-gray-400">Regular Toppings</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t flex flex-col gap-2">
              {order.status === OrderStatus.PENDING && (
                <button 
                  onClick={() => onUpdateStatus(order.id, OrderStatus.PREPARING)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl font-bold shadow-md shadow-orange-100 transition-all"
                >
                  START PREPARING
                </button>
              )}
              {order.status === OrderStatus.PREPARING && (
                <button 
                  onClick={() => onUpdateStatus(order.id, OrderStatus.READY)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-bold shadow-md shadow-indigo-100 transition-all"
                >
                  MARK AS READY
                </button>
              )}
              {order.status === OrderStatus.READY && (
                <div className="bg-green-100 text-green-700 p-2 rounded-xl text-center text-xs font-bold">
                  WAITING FOR PICKUP / DELIVERY
                </div>
              )}
            </div>
          </div>
        ))}

        {activeOrders.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
             <i className="fa-solid fa-clipboard-check text-6xl mb-4"></i>
             <p className="text-xl font-bold">No Active Kitchen Orders</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenScreen;
