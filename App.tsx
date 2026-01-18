
import React, { useState, useEffect, useMemo } from 'react';
import { CompanySettings, Language, Category, PrinterSettings, PaymentSettings, Order, OrderStatus, Product, Driver, DriverStatus } from './types';
import SetupWizard from './components/SetupWizard';
import POS from './components/POS';
import Inventory from './components/Inventory';
import KitchenScreen from './components/KitchenScreen';
import DeliveryModule from './components/DeliveryModule';
import Reports from './components/Reports';
import Sidebar from './components/Sidebar';
import { TRANSLATIONS } from './constants';

const App: React.FC = () => {
  // Persistence Simulation (SQLite Proxy)
  const [settings, setSettings] = useState<CompanySettings | null>(() => {
    const saved = localStorage.getItem('company_settings');
    return saved ? JSON.parse(saved) : null;
  });

  const [printerSettings, setPrinterSettings] = useState<PrinterSettings | null>(() => {
    const saved = localStorage.getItem('printer_settings');
    return saved ? JSON.parse(saved) : null;
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(() => {
    const saved = localStorage.getItem('payment_settings');
    return saved ? JSON.parse(saved) : null;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('drivers');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Ali Ahmed', status: DriverStatus.AVAILABLE, activeOrdersCount: 0 },
      { id: '2', name: 'Zeeshan Khan', status: DriverStatus.AVAILABLE, activeOrdersCount: 0 },
      { id: '3', name: 'Haris Malik', status: DriverStatus.BUSY, activeOrdersCount: 2 },
    ];
  });

  const [currentView, setCurrentView] = useState('pos');

  // Auto-persist to "SQLite" (localStorage)
  useEffect(() => {
    if (settings) localStorage.setItem('company_settings', JSON.stringify(settings));
    if (printerSettings) localStorage.setItem('printer_settings', JSON.stringify(printerSettings));
    if (paymentSettings) localStorage.setItem('payment_settings', JSON.stringify(paymentSettings));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('drivers', JSON.stringify(drivers));
  }, [settings, printerSettings, paymentSettings, orders, drivers]);

  const t = useMemo(() => {
    return TRANSLATIONS[settings?.language || Language.EN];
  }, [settings?.language]);

  const isDeliveryCategory = settings?.category === Category.PIZZA_RESTAURANT || settings?.category === Category.DELIVERY_SHOP;

  // Driver Assignment Algorithm
  const assignDriver = (order: Order) => {
    const availableDrivers = drivers.filter(d => d.status === DriverStatus.AVAILABLE);
    if (availableDrivers.length === 0) return null;

    // 1. Sort by least active orders
    // 2. Tie-break by alphabetical/id (simulating oldest last_assigned_at)
    const bestDriver = [...availableDrivers].sort((a, b) => {
      if (a.activeOrdersCount !== b.activeOrdersCount) {
        return a.activeOrdersCount - b.activeOrdersCount;
      }
      return a.id.localeCompare(b.id);
    })[0];

    return bestDriver.id;
  };

  const handleAddOrder = (newOrder: Order) => {
    let finalOrder = { ...newOrder };
    if (newOrder.type === 'Delivery' && isDeliveryCategory) {
      const assignedDriverId = assignDriver(newOrder);
      if (assignedDriverId) {
        finalOrder.driverId = assignedDriverId;
        finalOrder.status = OrderStatus.PENDING;
        // Update driver stats
        setDrivers(prev => prev.map(d => d.id === assignedDriverId ? { ...d, activeOrdersCount: d.activeOrdersCount + 1 } : d));
      }
    }
    setOrders(prev => [finalOrder, ...prev]);
    alert("Order Successful!");
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        // If order finished, free up driver
        if (status === OrderStatus.DELIVERED && o.driverId) {
          setDrivers(dPrev => dPrev.map(d => d.id === o.driverId ? { ...d, activeOrdersCount: Math.max(0, d.activeOrdersCount - 1) } : d));
        }
        return { ...o, status };
      }
      return o;
    }));
  };

  if (!settings?.isWizardComplete) {
    return (
      <SetupWizard 
        onComplete={(comp, print, pay) => {
          setSettings({ ...comp, isWizardComplete: true });
          setPrinterSettings(print);
          setPaymentSettings(pay);
        }} 
      />
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'pos': return <POS onCheckout={handleAddOrder} settings={settings} paymentSettings={paymentSettings!} />;
      case 'inventory': return <Inventory category={settings.category} />;
      case 'kitchen': return isDeliveryCategory ? <KitchenScreen orders={orders} onUpdateStatus={updateOrderStatus} /> : <div className="p-8 text-center text-gray-500">Module Disabled for this category.</div>;
      case 'delivery': return isDeliveryCategory ? <DeliveryModule orders={orders} drivers={drivers} onUpdateStatus={updateOrderStatus} /> : <div className="p-8 text-center text-gray-500">Module Disabled for this category.</div>;
      case 'reports': return <Reports orders={orders} />;
      default: return <POS onCheckout={handleAddOrder} settings={settings} paymentSettings={paymentSettings!} />;
    }
  };

  return (
    <div className={`flex h-screen w-full bg-slate-50 ${settings.language === Language.UR ? 'flex-row-reverse' : 'flex-row'}`} dir={settings.language === Language.UR ? 'rtl' : 'ltr'}>
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        isDelivery={isDeliveryCategory} 
        t={t} 
        settings={settings}
      />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-3">
             <span className="text-xl font-bold text-indigo-700">{settings.name}</span>
             <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-xs font-medium uppercase">{settings.category}</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               Offline Mode Active
             </div>
             <button className="text-gray-400 hover:text-indigo-600 transition-colors">
               <i className="fa-solid fa-cloud-arrow-up text-lg"></i>
             </button>
             <button className="flex items-center gap-2 border rounded-lg px-3 py-1.5 hover:bg-gray-50">
               <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                 {settings.adminName[0].toUpperCase()}
               </div>
               <span className="text-sm font-semibold">{settings.adminName}</span>
             </button>
          </div>
        </header>
        <div className="flex-1 overflow-auto custom-scrollbar">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
