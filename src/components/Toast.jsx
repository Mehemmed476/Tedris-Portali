// src/components/Toast.js

import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onDismiss }) => {
    if (!message) return null;

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    useEffect(() => {
        const timer = setTimeout(() => onDismiss(), 3000);
        return () => clearTimeout(timer);
    }, [message, onDismiss]);

    return (
        <div className={`fixed bottom-5 right-5 text-white px-6 py-3 rounded-lg shadow-lg z-50 ${bgColor}`}>
            {message}
        </div>
    );
};

export default Toast;