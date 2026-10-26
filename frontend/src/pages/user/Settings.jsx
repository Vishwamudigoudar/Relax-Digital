import React, { useState } from 'react';
import { Settings, Bell, Shield, Mail, CheckCircle2 } from 'lucide-react';

const UserSettings = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [promoOffers, setPromoOffers] = useState(false);
  const [smsTracking, setSmsTracking] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-600" />
          Account Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Customize shipment notifications, promotional communications, and privacy settings
        </p>
      </div>

      {saved && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Preferences updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" />
            Communication & Notifications
          </h3>

          <div className="space-y-3.5 text-xs text-slate-600">
            <label className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 cursor-pointer border border-slate-100 transition">
              <div>
                <p className="font-semibold text-slate-800">Order & Delivery Notifications</p>
                <p className="text-slate-400">Receive instant updates when orders are shipped or delivered.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 cursor-pointer border border-slate-100 transition">
              <div>
                <p className="font-semibold text-slate-800">SMS Milestone Alerts</p>
                <p className="text-slate-400">Get courier tracking links directly to your mobile device.</p>
              </div>
              <input
                type="checkbox"
                checked={smsTracking}
                onChange={(e) => setSmsTracking(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 cursor-pointer border border-slate-100 transition">
              <div>
                <p className="font-semibold text-slate-800">Exclusive Deals & Product Drops</p>
                <p className="text-slate-400">Be notified first when limited inventory or discounts drop.</p>
              </div>
              <input
                type="checkbox"
                checked={promoOffers}
                onChange={(e) => setPromoOffers(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition shadow-md shadow-emerald-600/20"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserSettings;
