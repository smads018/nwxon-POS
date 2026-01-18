
import React from 'react';
import { Order, Driver, OrderStatus, DriverStatus } from '../types';

interface Props {
  orders: Order[];
  drivers: Driver[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

const DeliveryModule: React.FC<Props> = ({ orders, drivers, onUpdateStatus }) => {
  const deliveryOrders = orders.filter(o => o.type === 'Delivery');

  return (
    <div className="p-6 h-full flex flex-col gap-6">
      <div className="grid grid-cols-12 gap-6 h-full">
        {/* Drivers List */}
        <div className="col-span-4 bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <i className="fa-solid fa-helmet-safety text-indigo-500"></i>
              Active Drivers
            </h2>
            <button className="text-indigo-600 text-xs font-bold hover:underline">+ Register Driver</button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4 custom-scrollbar">
            {drivers.map(driver => (
              <div key={driver.id} className="flex items-center gap-4 p-3 border rounded-xl hover:bg-slate-50 transition-colors">
                <div className="relative">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                    {driver.name[0]}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    driver.status === DriverStatus.AVAILABLE ? 'bg-green-500' : 
                    driver.status === DriverStatus.BUSY ? 'bg-orange-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-sm">{driver.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    {driver.status} • {driver.activeOrdersCount} Active Orders
                  </p>
                </div>
                <button className="text-gray-400 hover:text-indigo-600">
                  <i className="fa-solid fa-location-dot"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Delivery Orders */}
        <div className="col-span-8 bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <i className="fa-solid fa-map-location-dot text-indigo-500"></i>
              Live Deliveries
            </h2>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-slate-50 sticky top-0 border-b">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase">Address</th>
                  <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase">Driver</th>
                  <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {deliveryOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-800">#{order.id}</p>
                      <p className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-700 line-clamp-1 w-40 font-medium">{order.address}</p>
                      <p className="text-[10px] text-indigo-500">{order.customerPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      {order.driverId ? (
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                               {drivers.find(d => d.id === order.driverId)?.name[0]}
                            </div>
                            <span className="text-xs font-bold">{drivers.find(d => d.id === order.driverId)?.name}</span>
                         </div>
                      ) : (
                        <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded">UNASSIGNED</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                        order.status === OrderStatus.PENDING ? 'bg-orange-100 text-orange-600' :
                        order.status === OrderStatus.OUT_FOR_DELIVERY ? 'bg-indigo-100 text-indigo-600' :
                        order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {order.status === OrderStatus.READY && (
                        <button 
                          onClick={() => onUpdateStatus(order.id, OrderStatus.OUT_FOR_DELIVERY)}
                          className="text-xs font-bold text-indigo-600 hover:underline"
                        >
                          Dispatch
                        </button>
                      )}
                      {order.status === OrderStatus.OUT_FOR_DELIVERY && (
                        <button 
                          onClick={() => onUpdateStatus(order.id, OrderStatus.DELIVERED)}
                          className="text-xs font-bold text-green-600 hover:underline"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {deliveryOrders.length === 0 && (
              <div className="p-12 text-center text-gray-300">
                <i className="fa-solid fa-truck-ramp-box text-5xl mb-4"></i>
                <p className="font-bold">No Delivery Orders Found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryModule;
