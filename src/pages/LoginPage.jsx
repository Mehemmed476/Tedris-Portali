// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { ICONS } from '../components/Icon.jsx';
import { Button } from "@/components/ui/button"; // YENİ İMPORT

const API_URL = 'http://localhost:3001/api/auth/';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('muellim');
  
  const handleAuthAction = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let response;
      if (isSigningUp) {
        const userData = { email, password, role };
        response = await axios.post(API_URL + 'register', userData);
      } else {
        const userData = { email, password };
        response = await axios.post(API_URL + 'login', userData);
      }
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        window.location.reload();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Xəta baş verdi. Zəhmət olmasa, yenidən cəhd edin.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Tədris Portalı</h1>
          <p className="text-gray-500 mt-2">{isSigningUp ? 'Hesab yaradın' : 'Sistemə daxil olun'}</p>
        </div>
        {error && <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg">{error}</p>}

        <form onSubmit={handleAuthAction} className="space-y-6">
          {isSigningUp && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Hesab növünü seçin:</label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer"><input type="radio" name="role" value="muellim" checked={role === 'muellim'} onChange={() => setRole('muellim')} className="h-4 w-4" /><span className="ml-2 text-sm">Mən müəlliməm</span></label>
                <label className="flex items-center cursor-pointer"><input type="radio" name="role" value="valideyn" checked={role === 'valideyn'} onChange={() => setRole('valideyn')} className="h-4 w-4" /><span className="ml-2 text-sm">Mən valideynəm</span></label>
              </div>
            </div>
          )}

          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">{ICONS.user}</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-poçt ünvanı" required className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">{ICONS.lock}</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifrə" required className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>

          {/* --- DƏYİŞİKLİK BURADADIR --- */}
          <Button type="submit" disabled={loading} className="w-full py-6 text-md">
            {loading ? ICONS.spinnerSmall : (isSigningUp ? 'Qeydiyyatdan keç' : 'Daxil ol')}
          </Button>
        </form>

        <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              {isSigningUp ? 'Hesabınız var?' : 'Hesabınız yoxdur?'}{' '}
              <button onClick={() => { setIsSigningUp(!isSigningUp); setError(''); }} className="font-medium text-blue-600 hover:underline ml-1">{isSigningUp ? 'Daxil olun' : 'Qeydiyyatdan keçin'}</button>
            </p>
            <a href="/student-login" className="text-sm text-emerald-600 hover:underline">Şagirdsiniz? Buradan daxil olun.</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;