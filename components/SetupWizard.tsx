
import React, { useState } from 'react';
import { Category, Language, CompanySettings, PrinterSettings, PaymentSettings, PrinterType } from '../types';
import { CATEGORY_OPTIONS } from '../constants';

interface Props {
  onComplete: (comp: CompanySettings, print: PrinterSettings, pay: PaymentSettings) => void;
}

const SetupWizard: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [comp, setComp] = useState<CompanySettings>({
    name: '',
    category: Category.GENERAL_STORE,
    language: Language.EN,
    adminName: '',
    isWizardComplete: false
  });

  const [print, setPrint] = useState<PrinterSettings>({
    type: PrinterType.THERMAL,
    size: '80mm',
    showLogo: true,
    header: 'Welcome to our store',
    footer: 'Thank you for shopping!'
  });

  const [pay, setPay] = useState<PaymentSettings>({
    cashEnabled: true,
    jazzCashEnabled: true,
    easyPaisaEnabled: true,
    bankTransferEnabled: true,
    cardEnabled: false,
    otherLabel: 'Customer Credit'
  });

  const handleFinish = () => {
    if (!comp.name || !comp.adminName) {
      alert("Please fill in required fields");
      return;
    }
    onComplete(comp, print, pay);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-indigo-700 p-8 text-white">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Nexus POS Setup</h1>
            <span className="bg-indigo-600 px-3 py-1 rounded-full text-sm">Step {step} of 3</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-white' : 'bg-indigo-500'}`}></div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 overflow-auto max-h-[60vh] custom-scrollbar">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Company Registration</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <input 
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                    value={comp.name} 
                    onChange={e => setComp({ ...comp, name: e.target.value })} 
                    placeholder="e.g. Blue Moon Pizza"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select 
                    className="w-full border rounded-lg p-2.5 outline-none" 
                    value={comp.category}
                    onChange={e => setComp({ ...comp, category: e.target.value as Category })}
                  >
                    {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select 
                    className="w-full border rounded-lg p-2.5 outline-none" 
                    value={comp.language}
                    onChange={e => setComp({ ...comp, language: e.target.value as Language })}
                  >
                    <option value={Language.EN}>English</option>
                    <option value={Language.UR}>اردو (Urdu)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner / Admin Name *</label>
                  <input 
                    className="w-full border rounded-lg p-2.5 outline-none" 
                    value={comp.adminName} 
                    onChange={e => setComp({ ...comp, adminName: e.target.value })} 
                    placeholder="Administrator Name"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Printer Configuration</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Printer Type</label>
                  <select 
                    className="w-full border rounded-lg p-2.5 outline-none" 
                    value={print.type}
                    onChange={e => setPrint({ ...print, type: e.target.value as PrinterType })}
                  >
                    <option value={PrinterType.THERMAL}>Thermal (Receipt)</option>
                    <option value={PrinterType.NORMAL}>Normal (A4/Letter)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Size</label>
                  <select 
                    className="w-full border rounded-lg p-2.5 outline-none" 
                    value={print.size}
                    onChange={e => setPrint({ ...print, size: e.target.value })}
                  >
                    {print.type === PrinterType.THERMAL ? (
                      <>
                        <option value="58mm">58mm</option>
                        <option value="80mm">80mm</option>
                      </>
                    ) : (
                      <>
                        <option value="A4">A4</option>
                        <option value="Letter">Letter</option>
                      </>
                    )}
                  </select>
                </div>
                <div className="col-span-2 space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={print.showLogo} onChange={e => setPrint({ ...print, showLogo: e.target.checked })} className="w-4 h-4 text-indigo-600" />
                    <label className="text-sm font-medium text-gray-700">Show Company Logo on Receipts</label>
                  </div>
                </div>
                <div className="col-span-2 pt-4 flex justify-center">
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium border border-gray-300 transition-colors" onClick={() => alert("Printing Test Page...")}>
                    <i className="fa-solid fa-print mr-2"></i> TEST PRINT
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Payment Methods</h2>
              <p className="text-sm text-gray-500">Enable the payment gateways you accept. Cash is enabled by default.</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <i className="fa-solid fa-money-bill-1-wave"></i>
                    </div>
                    <div>
                      <p className="font-bold">Cash</p>
                      <p className="text-xs text-gray-500">Standard Over-the-counter</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">ALWAYS ON</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'jazzCashEnabled', label: 'JazzCash', color: 'bg-red-500' },
                    { key: 'easyPaisaEnabled', label: 'EasyPaisa', color: 'bg-green-500' },
                    { key: 'bankTransferEnabled', label: 'Bank Transfer', color: 'bg-blue-600' },
                    { key: 'cardEnabled', label: 'Debit/Credit Card (Disabled)', color: 'bg-indigo-600' }
                  ].map(method => (
                    <div key={method.key} className="flex items-center gap-3 p-3 border rounded-xl hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => {
                      if (method.key !== 'cardEnabled') {
                         setPay({ ...pay, [method.key]: !pay[method.key as keyof PaymentSettings] })
                      }
                    }}>
                      <div className={`w-3 h-3 rounded-full ${pay[method.key as keyof PaymentSettings] ? method.color : 'bg-gray-300'}`}></div>
                      <span className="font-medium text-sm text-gray-700">{method.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t bg-slate-50 flex justify-between">
          <button 
            className={`px-6 py-2 rounded-lg font-bold ${step === 1 ? 'invisible' : 'text-gray-600 hover:bg-gray-200 transition-colors'}`} 
            onClick={() => setStep(step - 1)}
          >
            Back
          </button>
          {step < 3 ? (
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-2 rounded-lg font-bold shadow-lg shadow-indigo-200 transition-all" onClick={() => setStep(step + 1)}>
              Next Step
            </button>
          ) : (
            <button className="bg-green-600 hover:bg-green-700 text-white px-10 py-2 rounded-lg font-bold shadow-lg shadow-green-200 transition-all" onClick={handleFinish}>
              Launch Nexus POS
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;
