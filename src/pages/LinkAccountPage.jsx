// src/pages/LinkAccountPage.jsx
import React, { useState } from 'react';
import api from '../api/api';
import { ICONS } from '../components/Icon.jsx';
import Swal from 'sweetalert2';

const LinkAccountPage = ({ user }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (inviteCode.trim() === '') {
      setError("Zəhmət olmasa, dəvət kodunu daxil edin.");
      return;
    }
    setLoading(true);

    try {
      const { data } = await api.post('/users/link-account', { inviteCode });
      
      // Lokal yaddaşdakı istifadəçi məlumatını yeniləyirik
      const loggedInUser = JSON.parse(localStorage.getItem('user'));
      loggedInUser.linkedStudentId = data.user.linkedStudentId;
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      await Swal.fire({
        title: 'Uğurlu!',
        text: 'Hesabınız uğurla övladınızın profilinə bağlandı! İndi panelə yönləndirilirsiniz.',
        icon: 'success',
      });

      window.location.reload();

    } catch (err) {
        const message = err.response?.data?.message || "Xəta baş verdi";
        setError(message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800">Xoş Gəlmisiniz!</h1>
        <p className="text-gray-600 mt-2">Davam etmək üçün müəllim tərəfindən sizə verilən dəvət kodunu daxil edin.</p>

        <form onSubmit={handleSubmit} className="mt-8 bg-white p-8 rounded-2xl shadow-lg space-y-4">
          <label htmlFor="invite-code" className="block text-sm font-medium text-gray-700">Valideyn Dəvət Kodu</label>
          <input
            id="invite-code"
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            placeholder="VAL-XXXXXX"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {loading ? ICONS.spinnerSmall : "Hesabı Bağla"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LinkAccountPage;