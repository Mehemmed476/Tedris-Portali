// src/components/StatisticsDashboard.js

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, collectionGroup } from 'firebase/firestore';
import { db } from '../firebase/config';
import { ICONS } from './Icon.jsx';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatCard = ({ icon, title, value, color }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 border-l-4 ${color}`}>
        <div className="text-3xl">{icon}</div>
        <div>
            <p className="text-gray-500 font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const StatisticsDashboard = ({ user }) => {
    const [stats, setStats] = useState({
        classCount: 0,
        studentCount: 0,
        classesWithStudentCounts: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            setLoading(true);

            // 1. Müəllimə aid bütün sinifləri tap
            const classesRef = collection(db, "classes");
            const q = query(classesRef, where("teacherId", "==", user.uid));
            const querySnapshot = await getDocs(q);

            const classCount = querySnapshot.size;
            const classDocs = querySnapshot.docs;

            // 2. Hər sinifdəki şagirdlərin sayını tap
            let totalStudentCount = 0;
            const studentCountPromises = classDocs.map(async (classDoc) => {
                const studentsRef = collection(db, "classes", classDoc.id, "students");
                const studentsSnapshot = await getDocs(studentsRef);
                const studentCountForClass = studentsSnapshot.size;
                totalStudentCount += studentCountForClass;
                return { 
                    className: classDoc.data().className, 
                    studentCount: studentCountForClass 
                };
            });

            const classesWithStudentCounts = await Promise.all(studentCountPromises);

            setStats({
                classCount: classCount,
                studentCount: totalStudentCount,
                classesWithStudentCounts: classesWithStudentCounts.sort((a, b) => b.studentCount - a.studentCount) // Çoxdan aza sırala
            });
            setLoading(false);
        };

        fetchStats();
    }, [user]);

    const chartData = {
        labels: stats.classesWithStudentCounts.map(c => c.className),
        datasets: [{
            label: 'Hər sinifdəki şagird sayı',
            data: stats.classesWithStudentCounts.map(c => c.studentCount),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
        }, ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Siniflər üzrə şagird bölgüsü',
            },
        },
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full">{ICONS.spinner}</div>;
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Ümumi Statistika</h2>
            
            {/* Stat Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard 
                    icon={ICONS.classIcon} 
                    title="Ümumi Sinif Sayı" 
                    value={stats.classCount} 
                    color="border-blue-500" 
                />
                <StatCard 
                    icon={ICONS.users} 
                    title="Ümumi Şagird Sayı" 
                    value={stats.studentCount} 
                    color="border-green-500"
                />
            </div>

            {/* Qrafik */}
            {stats.classCount > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                     <Bar options={chartOptions} data={chartData} />
                </div>
            )}
        </div>
    );
};

export default StatisticsDashboard;