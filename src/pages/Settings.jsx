import { useState } from 'react';
import { User, Bell, Shield, Save, Check } from 'lucide-react';

export default function Settings() {
  // Mock State for Settings
  const [name, setName] = useState('Admin User');
  const [email, setEmail] = useState('admin@nksecommerce.com');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Mock API Call Simulation
  const handleSave = () => {
    setIsSaving(true);
    setSaved(false);
    
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      
      // Hide the success message after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pb-10">
      
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Settings</h1>
        <p className="text-muted text-sm mt-1">Manage your account settings and application preferences.</p>
      </div>

      <div className="bg-primary-bg border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        
        {/* Profile Section */}
        <div className="p-6 md:p-8 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-secondary-bg rounded-md text-primary-text border border-gray-100">
              <User size={20} />
            </div>
            <h2 className="text-lg font-semibold text-primary-text">Profile Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-primary-text mb-2">Display Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-primary-text focus:ring-1 focus:ring-primary-text transition-all bg-primary-bg text-primary-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-text mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-primary-text focus:ring-1 focus:ring-primary-text transition-all bg-primary-bg text-primary-text"
              />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="p-6 md:p-8 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-secondary-bg rounded-md text-primary-text border border-gray-100">
              <Bell size={20} />
            </div>
            <h2 className="text-lg font-semibold text-primary-text">Notifications</h2>
          </div>

          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-primary-text">Email Notifications</p>
                <p className="text-sm text-muted">Receive daily summary emails about store activity.</p>
              </div>
              <button onClick={() => setEmailNotifs(!emailNotifs)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${emailNotifs ? 'bg-primary-text' : 'bg-gray-200'}`}>
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emailNotifs ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-primary-text">Push Notifications</p>
                <p className="text-sm text-muted">Get instantly notified about low stock alerts.</p>
              </div>
              <button onClick={() => setPushNotifs(!pushNotifs)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${pushNotifs ? 'bg-primary-text' : 'bg-gray-200'}`}>
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${pushNotifs ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 md:p-8 bg-secondary-bg flex items-center justify-between">
          <div className="text-sm text-muted flex items-center gap-2">
            <Shield size={16} />
            <span>Your data is stored securely.</span>
          </div>
          
          <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-primary-text hover:bg-black text-white rounded-md font-medium transition-colors disabled:opacity-70">
            {saved ? <Check size={18} /> : <Save size={18} />}
            <span>{isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}