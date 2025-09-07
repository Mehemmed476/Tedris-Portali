// src/pages/StudentLoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { ICONS } from '../components/Icon.jsx';

const API_URL = 'http://localhost:3001/api/auth/';

const StudentLoginPage = () => {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (inviteCode.trim() === '') {
      setError("Zəhmət olmasa, dəvət kodunu daxil edin.");
      return;
    }
    setLoading(true);

    try {
      const { data } = await axios.post(API_URL + 'student-login', { inviteCode });

      if (data) {
        localStorage.setItem('user', JSON.stringify(data));
        window.location.reload();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Xəta baş verdi.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800">Şagird Girişi</h1>
        <p className="text-gray-600 mt-2">Müəllimin sizə verdiyi dəvət kodunu daxil edin.</p>

        <form onSubmit={handleSubmit} className="mt-8 bg-white p-8 rounded-2xl shadow-lg space-y-4">
          <label htmlFor="invite-code" className="block text-sm font-medium text-gray-700">Şagird Dəvət Kodu</label>
          <input
            id="invite-code"
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            placeholder="SAG-XXXXXX"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 flex items-center justify-center"
          >
            {loading ? ICONS.spinnerSmall : "Daxil ol"}
          </button>
          <a href="/" className="text-sm text-blue-600 hover:underline mt-4 block">Müəllim və ya Valideynsiniz?</a>
        </form>
      </div>
    </div>
  );
};

export default StudentLoginPage;