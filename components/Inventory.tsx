
import React from 'react';
import { Category } from '../types';

interface Props {
  category: Category;
}

const Inventory: React.FC<Props> = ({ category }) => {
  return (
    <div className="p-6 h-full flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border shadow-sm">
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
          <i className="fa-solid fa-boxes-stacked text-indigo-500"></i>
          Product Inventory
        </h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-md shadow-indigo-100">
          + Add New Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center gap-4">
           <div className="flex-1 relative">
             <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
             <input className="w-full pl-10 pr-4 py-2 border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Search inventory by name, SKU or barcode..." />
           </div>
           <button className="px-4 py-2 border rounded-xl hover:bg-slate-50 font-bold text-sm text-gray-600">Filters</button>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
           <table className="w-full text-left">
              <thead className="bg-slate-50 sticky top-0 border-b">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase">Product Name</th>
                  <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase">Price</th>
                  <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase">Stock</th>
                  
                  {category === Category.PHARMACY && (
                    <>
                      <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase">Batch #</th>
                      <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase">Expiry</th>
                    </>
                  )}

                  {(category === Category.HARDWARE || category === Category.AUTO_SPARE_PARTS) && (
                    <>
                      <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase">Part #</th>
                      <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase">Brand</th>
                    </>
                  )}

                  <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">IMG</div>
                         <div>
                            <p className="text-sm font-bold text-gray-800">Sample Product {i}</p>
                            <p className="text-[10px] text-indigo-500 font-bold">Category: Food</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-sm text-gray-700">Rs. {450 + (i * 100)}</td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-0.5 rounded text-[10px] font-black ${i === 3 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                          {i === 3 ? 'LOW STOCK: 5' : 'IN STOCK: 42'}
                       </span>
                    </td>

                    {category === Category.PHARMACY && (
                      <>
                        <td className="px-6 py-4 text-xs font-medium text-gray-600">BCH-992{i}</td>
                        <td className="px-6 py-4 text-xs font-medium text-red-500">2025-10-12</td>
                      </>
                    )}

                    {(category === Category.HARDWARE || category === Category.AUTO_SPARE_PARTS) && (
                      <>
                        <td className="px-6 py-4 text-xs font-medium text-gray-600">PN-X{i}00</td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-600">Brand Name</td>
                      </>
                    )}

                    <td className="px-6 py-4 text-right">
                       <button className="text-gray-400 hover:text-indigo-600 mx-2 transition-colors"><i className="fa-solid fa-pen-to-square"></i></button>
                       <button className="text-gray-400 hover:text-red-500 mx-2 transition-colors"><i className="fa-solid fa-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
