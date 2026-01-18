
import React, { useState, useMemo } from 'react';
import { Product, CartItem, Order, OrderStatus, Category, CompanySettings, PaymentSettings, Language } from '../types';

interface Props {
  onCheckout: (order: Order) => void;
  settings: CompanySettings;
  paymentSettings: PaymentSettings;
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', nameEn: 'Cheese Pizza (Large)', nameUr: 'پنیر پیزا (بڑا)', price: 1200, stock: 50, category: 'Food' },
  { id: '2', nameEn: 'Pepperoni Delight', nameUr: 'پیپرونی ڈی لائٹ', price: 1400, stock: 30, category: 'Food' },
  { id: '3', nameEn: 'Classic Burger', nameUr: 'کلاسک برگر', price: 650, stock: 40, category: 'Food' },
  { id: '4', nameEn: 'Coke 1.5L', nameUr: 'کوک 1.5 لیٹر', price: 180, stock: 100, category: 'Beverage' },
  { id: '5', nameEn: 'Panadol 500mg', nameUr: 'پیناڈول 500 ملی گرام', price: 40, stock: 500, category: 'Medicine', batchNo: 'PN-001', expiryDate: '2025-12-01' },
];

const POS: React.FC<Props> = ({ onCheckout, settings, paymentSettings }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });
  const [orderType, setOrderType] = useState<'Dine-in' | 'Takeaway' | 'Delivery'>('Dine-in');

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => 
      p.nameEn.toLowerCase().includes(search.toLowerCase()) || 
      p.nameUr.includes(search)
    );
  }, [search]);

  const addToCart = (p: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === p.id);
      if (existing) return prev.map(item => item.id === p.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...p, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return alert("Cart is empty");
    if (orderType === 'Delivery' && (!customer.phone || !customer.address)) {
      return alert("Phone and Address are required for Delivery");
    }

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerName: customer.name || 'Walk-in',
      customerPhone: customer.phone,
      address: customer.address,
      items: [...cart],
      total,
      status: OrderStatus.PENDING,
      type: orderType,
      createdAt: new Date().toISOString(),
      paymentMethod: 'Cash'
    };

    onCheckout(newOrder);
    setCart([]);
    setCustomer({ name: '', phone: '', address: '' });
  };

  const isUrdu = settings.language === Language.UR;

  return (
    <div className="flex h-full gap-4 p-4 overflow-hidden">
      {/* Products Area */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border flex items-center gap-4">
          <div className="flex-1 relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder={isUrdu ? "تلاش کریں..." : "Search products..."}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Food', 'Beverage', 'Other'].map(cat => (
              <button key={cat} className="px-4 py-1.5 rounded-lg text-sm font-semibold border hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
          {filteredProducts.map(p => (
            <button 
              key={p.id} 
              onClick={() => addToCart(p)}
              className="bg-white p-4 rounded-2xl shadow-sm border hover:border-indigo-500 hover:shadow-md transition-all text-left group flex flex-col justify-between"
            >
              <div>
                <div className="aspect-square bg-slate-100 rounded-xl mb-3 flex items-center justify-center text-slate-400">
                  <i className="fa-solid fa-image text-4xl"></i>
                </div>
                <h3 className="font-bold text-gray-800 line-clamp-1">{p.nameEn}</h3>
                <h4 className="urdu-font text-sm text-gray-500 mb-2">{p.nameUr}</h4>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-indigo-600 font-bold">Rs. {p.price}</span>
                <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded font-bold">{p.stock} in stock</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Area */}
      <div className="w-96 bg-white rounded-2xl shadow-xl border flex flex-col overflow-hidden">
        <div className="p-4 border-b bg-indigo-50 flex justify-between items-center">
          <h2 className="font-bold text-indigo-900 flex items-center gap-2">
            <i className="fa-solid fa-cart-shopping"></i>
            Current Cart
          </h2>
          <button onClick={() => setCart([])} className="text-xs text-red-500 font-bold hover:underline">Clear All</button>
        </div>

        <div className="p-4 border-b space-y-3">
          <div className="flex gap-2">
            {(['Dine-in', 'Takeaway', 'Delivery'] as const).map(type => (
              <button 
                key={type} 
                onClick={() => setOrderType(type)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${orderType === type ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500'}`}
              >
                {type}
              </button>
            ))}
          </div>

          {orderType === 'Delivery' && (
            <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
              <input 
                className="w-full text-xs border rounded-lg p-2 outline-none" 
                placeholder="Phone Number *" 
                value={customer.phone}
                onChange={e => setCustomer({ ...customer, phone: e.target.value })}
              />
              <textarea 
                className="w-full text-xs border rounded-lg p-2 outline-none h-16" 
                placeholder="Delivery Address *" 
                value={customer.address}
                onChange={e => setCustomer({ ...customer, address: e.target.value })}
              />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300">
               <i className="fa-solid fa-basket-shopping text-4xl mb-2"></i>
               <p className="text-xs font-bold uppercase">Empty Cart</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="flex justify-between items-center group">
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800 leading-tight">{isUrdu ? item.nameUr : item.nameEn}</p>
                <p className="text-xs text-indigo-500">Rs. {item.price} x {item.quantity}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-700">Rs. {item.price * item.quantity}</span>
                <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                   <i className="fa-solid fa-circle-xmark"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-slate-50 border-t space-y-4">
          <div className="space-y-1">
             <div className="flex justify-between text-gray-500 text-sm">
                <span>Subtotal</span>
                <span>Rs. {total}</span>
             </div>
             <div className="flex justify-between text-gray-500 text-sm">
                <span>Tax (0%)</span>
                <span>Rs. 0</span>
             </div>
             <div className="flex justify-between text-indigo-900 text-xl font-black pt-2">
                <span>Total</span>
                <span>Rs. {total}</span>
             </div>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-3"
          >
            {isUrdu ? "چیک آؤٹ" : "CHECKOUT"}
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
