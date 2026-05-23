import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard({ auth, usersCount, certificatesCount, dailyViewCounts, locationData }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const isAdmin = auth.user?.role === 'admin';

    // Set isLoaded to true after component mounts for animations
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Prepare daily view count data for the line chart
    const dailyViewChartData = {
        labels: dailyViewCounts?.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }) || [],
        datasets: [
            {
                label: 'Certificate Views',
                data: dailyViewCounts?.map(item => item.count) || [],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                tension: 0.3,
                fill: true,
            },
        ],
    };

    // Line chart options
    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Daily Certificate Views (Last 30 Days)',
                font: {
                    size: 16
                }
            },
            tooltip: {
                callbacks: {
                    title: function (tooltipItems) {
                        return tooltipItems[0].label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            }
        },
        maintainAspectRatio: false
    };

    // Prepare location data for the pie chart
    const locationChartData = {
        labels: locationData?.map(item => item.country) || [],
        datasets: [
            {
                data: locationData?.map(item => item.count) || [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(199, 99, 132, 0.7)',
                    'rgba(96, 162, 235, 0.7)',
                    'rgba(220, 206, 86, 0.7)',
                    'rgba(120, 192, 192, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 99, 132, 1)',
                    'rgba(96, 162, 235, 1)',
                    'rgba(220, 206, 86, 1)',
                    'rgba(120, 192, 192, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    // Pie chart options
    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Certificate Views by Location',
                font: {
                    size: 16
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
        maintainAspectRatio: false
    };

    // Animation variants for cards
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        },
        hover: {
            y: -5,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            transition: { duration: 0.2 }
        }
    };

    // Animation variants for counters
    const counterVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: (custom) => ({
            opacity: 1,
            scale: 1,
            transition: {
                delay: 0.3 + (custom * 0.1),
                duration: 0.5,
                type: "spring",
                stiffness: 200
            }
        })
    };

    // Animation for icons
    const iconVariants = {
        hidden: { scale: 0, rotate: -30 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
            }
        },
        hover: {
            rotate: 15,
            scale: 1.1,
            transition: { duration: 0.2 }
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl  leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-6 sm:py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="p-4 sm:p-6">
                            <h3 className="text-xl font-bold text-blue-800 mb-2">Welcome to the Certificate Verification Portal</h3>
                            <p className="">Here you can manage certificates and users in the system.</p>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                        {/* Certificates Card */}
                        <motion.div
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-t-4 border-blue-600 h-full"
                            variants={cardVariants}
                            initial="hidden"
                            animate={isLoaded ? "visible" : "hidden"}
                            whileHover="hover"
                            custom={0}
                        >
                            <div className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start">
                                    <motion.div
                                        className="bg-blue-100 p-3 rounded-full mb-4 sm:mb-0"
                                        variants={iconVariants}
                                        initial="hidden"
                                        animate={isLoaded ? "visible" : "hidden"}
                                        whileHover="hover"
                                    >
                                        <img src="/image/certificates-icon.png" alt="Certificates" className="w-10 h-10" />
                                    </motion.div>
                                    <div className="ml-0 sm:ml-5 text-center sm:text-left">
                                        <h3 className="text-lg font-medium text-blue-800">Total Certificates</h3>
                                        <motion.div
                                            className="mt-2 flex flex-col sm:flex-row items-center sm:items-baseline"
                                            variants={counterVariants}
                                            initial="hidden"
                                            animate={isLoaded ? "visible" : "hidden"}
                                            custom={1}
                                        >
                                            <span className="text-3xl sm:text-4xl font-bold text-gray-800">{certificatesCount}</span>
                                            <span className="ml-0 sm:ml-2 mt-1 sm:mt-0 text-sm text-blue-500">Verified Documents</span>
                                        </motion.div>
                                    </div>
                                </div>
                                <motion.div
                                    className="mt-4 text-center sm:text-left"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <a href={route('certificates.index')} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center sm:justify-start">
                                        View all certificates
                                        <motion.svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 ml-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            initial={{ x: -3 }}
                                            animate={{ x: 0 }}
                                            whileHover={{ x: 3 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </motion.svg>
                                    </a>
                                </motion.div>
                            </div>
                        </motion.div>

                        {isAdmin && (
                            <motion.div
                                className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-t-4 border-indigo-500 h-full"
                                variants={cardVariants}
                                initial="hidden"
                                animate={isLoaded ? "visible" : "hidden"}
                                whileHover="hover"
                                custom={1}
                            >
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start">
                                        <motion.div
                                            className="bg-indigo-100 p-3 rounded-full mb-4 sm:mb-0"
                                            variants={iconVariants}
                                            initial="hidden"
                                            animate={isLoaded ? "visible" : "hidden"}
                                            whileHover="hover"
                                        >
                                            <img src="/image/users-icon.png" alt="Users" className="w-10 h-10" />
                                        </motion.div>
                                        <div className="ml-0 sm:ml-5 text-center sm:text-left">
                                            <h3 className="text-lg font-medium text-indigo-800">Total Users</h3>
                                            <motion.div
                                                className="mt-2 flex flex-col sm:flex-row items-center sm:items-baseline"
                                                variants={counterVariants}
                                                initial="hidden"
                                                animate={isLoaded ? "visible" : "hidden"}
                                                custom={2}
                                            >
                                                <span className="text-3xl sm:text-4xl font-bold text-gray-800">{usersCount}</span>
                                                <span className="ml-0 sm:ml-2 mt-1 sm:mt-0 text-sm text-indigo-500">Registered Accounts</span>
                                            </motion.div>
                                        </div>
                                    </div>
                                    <motion.div
                                        className="mt-4 text-center sm:text-left"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <a href={route('users.index')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center sm:justify-start">
                                            Manage users
                                            <motion.svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 ml-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                initial={{ x: -3 }}
                                                animate={{ x: 0 }}
                                                whileHover={{ x: 3 }}
                                                transition={{ type: "spring", stiffness: 400 }}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </motion.svg>
                                        </a>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Charts Section */}
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Daily View Counts Chart */}
                        <motion.div
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-t-4 border-green-500"
                            variants={cardVariants}
                            initial="hidden"
                            animate={isLoaded ? "visible" : "hidden"}
                            whileHover="hover"
                            custom={2}
                        >
                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg font-medium text-green-800 mb-4">Certificate View Trends</h3>
                                <div className="h-72">
                                    <Line data={dailyViewChartData} options={lineOptions} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Locations Chart */}
                        <motion.div
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-t-4 border-purple-500"
                            variants={cardVariants}
                            initial="hidden"
                            animate={isLoaded ? "visible" : "hidden"}
                            whileHover="hover"
                            custom={3}
                        >
                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg font-medium text-purple-800 mb-4">Certificate Views by Location</h3>
                                <div className="h-72">
                                    <Pie data={locationChartData} options={pieOptions} />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
