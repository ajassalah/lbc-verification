import React, { useState, useEffect, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import Dropdown from "@/Components/Dropdown";

export default function Index({ auth, logs, params = {}, totalViewsCount, totalCountriesCount, mostViewedCountry, locationStats, deviceStats }) {
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(params.search || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [logToDelete, setLogToDelete] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const searchTimeoutRef = useRef(null);

    // Set isLoaded to true after component mounts for animations
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Clear timeout on component unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Animation variants for cards
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (custom) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                delay: custom * 0.1,
                ease: "easeOut"
            }
        }),
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

    // Animation variant for table rows
    const tableRowVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (custom) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.2 + (custom * 0.05),
                duration: 0.4
            }
        }),
        hover: {
            backgroundColor: "rgba(243, 244, 246, 0.8)",
            transition: { duration: 0.1 }
        }
    };    // Using real data from backend now
    const totalViews = totalViewsCount || logs.meta?.total || 0;

    // Handle search input changes
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Clear any existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set a new timeout to execute search after 3 seconds
        searchTimeoutRef.current = setTimeout(() => {
            performSearch(value);
        }, 3000);
    };

    // Execute search
    const performSearch = (term) => {
        setIsLoading(true);

        router.get(
            route('certificate-view-logs.index'),
            { search: term, page: 1 },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            }
        );
    };

    // Handle search submission (when pressing enter)
    const handleSearch = (e) => {
        e.preventDefault();

        // Clear any existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        performSearch(searchTerm);
    };

    // Handle input blur
    const handleBlur = () => {
        // Clear any existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        performSearch(searchTerm);
    };

    // Clear search
    const clearSearch = () => {
        setSearchTerm('');
        setIsLoading(true);

        router.get(
            route('certificate-view-logs.index'),
            { page: 1 },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            }
        );
    };

    // Confirm delete dialog
    const confirmDelete = (log) => {
        setLogToDelete(log);
        setShowDeleteModal(true);
    };

    // Delete log when confirmed
    const deleteLogConfirmed = () => {
        if (!logToDelete) return;

        router.delete(route('certificate-view-logs.destroy', logToDelete.id), {
            onStart: () => setIsLoading(true),
            onFinish: () => {
                setIsLoading(false);
                setShowDeleteModal(false);
                setLogToDelete(null);
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl leading-tight flex items-center">
                        <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Certificate View Logs
                    </h2>
                </div>
            }
        >
            <Head title="Certificate View Logs" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Description section */}
                    <motion.div
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="p-4 sm:p-6 text-gray-900">
                            <h3 className="text-xl font-bold text-blue-800 mb-2">Certificate Access Analytics</h3>
                            <p className="text-gray-600">Monitor and analyze certificate verification attempts. Track IP addresses, locations, and access patterns for security and analytics.</p>
                        </div>
                    </motion.div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {/* Total Views Card */}
                        <motion.div
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-t-4 border-blue-600"
                            variants={cardVariants}
                            initial="hidden"
                            animate={isLoaded ? "visible" : "hidden"}
                            whileHover="hover"
                            custom={0}
                        >
                            <div className="p-4 sm:p-5">
                                <div className="flex items-center">
                                    <motion.div
                                        className="bg-blue-100 p-3 rounded-full"
                                        variants={iconVariants}
                                        initial="hidden"
                                        animate={isLoaded ? "visible" : "hidden"}
                                        whileHover="hover"
                                    >
                                        <img src="/image/total-views.png" alt="Total Views" className="w-8 h-8" />
                                    </motion.div>
                                    <div className="ml-5">
                                        <h3 className="text-sm font-medium text-blue-800">Total Certificate Views</h3>
                                        <motion.div
                                            className="mt-1 flex items-baseline"
                                            variants={counterVariants}
                                            initial="hidden"
                                            animate={isLoaded ? "visible" : "hidden"}
                                            custom={1}
                                        >
                                            <span className="text-2xl font-bold text-gray-800">{totalViews}</span>
                                            <span className="ml-2 text-xs text-blue-500">Verification Attempts</span>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Locations Card */}
                        <motion.div
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-t-4 border-green-600"
                            variants={cardVariants}
                            initial="hidden"
                            animate={isLoaded ? "visible" : "hidden"}
                            whileHover="hover"
                            custom={1}
                        >
                            <div className="p-4 sm:p-5">
                                <div className="flex items-center">
                                    <motion.div
                                        className="bg-green-100 p-3 rounded-full"
                                        variants={iconVariants}
                                        initial="hidden"
                                        animate={isLoaded ? "visible" : "hidden"}
                                        whileHover="hover"
                                    >
                                        <img src="/image/locations.png" alt="Locations" className="w-8 h-8" />
                                    </motion.div>
                                    <div className="ml-5">
                                        <h3 className="text-sm font-medium text-green-800">Global Reach</h3>
                                        <motion.div
                                            className="mt-1 flex items-baseline"
                                            variants={counterVariants}
                                            initial="hidden"
                                            animate={isLoaded ? "visible" : "hidden"}
                                            custom={1}
                                        >
                                            <span className="text-2xl font-bold text-gray-800">{totalCountriesCount || locationStats?.uniqueCountriesCount || 0}</span>
                                            <span className="ml-2 text-xs text-green-500">Countries</span>
                                        </motion.div>
                                        <p className="text-xs text-gray-500 mt-1">Top: {mostViewedCountry || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Device Distribution Card */}
                        <motion.div
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-t-4 border-purple-600"
                            variants={cardVariants}
                            initial="hidden"
                            animate={isLoaded ? "visible" : "hidden"}
                            whileHover="hover"
                            custom={2}
                        >
                            <div className="p-4 sm:p-5">
                                <div className="flex items-center">
                                    <motion.div
                                        className="bg-purple-100 p-3 rounded-full"
                                        variants={iconVariants}
                                        initial="hidden"
                                        animate={isLoaded ? "visible" : "hidden"}
                                        whileHover="hover"
                                    >
                                        {/* <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg> */}

                                        <img src="/image/mobile-phone.png" alt="Locations" className="w-8 h-8" />
                                    </motion.div>
                                    <div className="ml-5">
                                        <h3 className="text-sm font-medium text-purple-800">Device Access</h3>
                                        <motion.div
                                            className="mt-1 flex items-baseline"
                                            variants={counterVariants}
                                            initial="hidden"
                                            animate={isLoaded ? "visible" : "hidden"}
                                            custom={2}
                                        >
                                            <span className="text-2xl font-bold text-gray-800">{deviceStats?.mobileCount || 0}</span>
                                            <span className="ml-2 text-xs text-purple-500">Mobile Views</span>
                                        </motion.div>
                                        <p className="text-xs text-gray-500 mt-1">{totalViews > 0 ? Math.round((deviceStats?.mobileCount / totalViews) * 100) : 0}% of total views</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Table with integrated search */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="p-6 bg-gray-50 border-b border-gray-200">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
                                    <form onSubmit={handleSearch} className="relative w-full md:w-64 flex">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            onBlur={handleBlur}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 ease-in-out text-sm"
                                            placeholder="Search by reference, country or city..."
                                        />
                                        {searchTerm && (
                                            <button
                                                type="button"
                                                onClick={clearSearch}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-150" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        )}
                                    </form>
                                </div>

                                {searchTerm && (
                                    <div className="text-blue-600 text-sm">
                                        Showing results for "{searchTerm}" · <button onClick={clearSearch} className="text-blue-800 hover:underline font-medium">Clear search</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="flex justify-center my-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        )}

                        <div className="overflow-x-auto">
                             {/* Mobile Cards View */}
                             <div className="md:hidden space-y-4 px-4 py-6">
                                 {logs.data && logs.data.length > 0 ? (
                                     logs.data.map((log, index) => (
                                         <motion.div
                                             key={log.id}
                                             initial={{ opacity: 0, y: 20 }}
                                             animate={{ opacity: 1, y: 0 }}
                                             transition={{ duration: 0.3, delay: index * 0.05 }}
                                             className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5 space-y-4"
                                         >
                                             <div className="flex justify-between items-start">
                                                 <div className="min-w-0 flex-1">
                                                     <h4 className="text-base font-bold text-blue-900 leading-tight">{log.ip || "N/A"}</h4>
                                                     <p className="text-xs text-blue-500 font-medium mt-1">Ref: {log.reference_no || "N/A"}</p>
                                                 </div>
                                                 <span className="text-[10px] font-bold text-gray-400 uppercase">{log.created_at || "N/A"}</span>
                                             </div>

                                             <div className="space-y-2 pt-3 border-t border-blue-50">
                                                 <div className="flex items-center text-sm text-gray-700">
                                                     <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                     </svg>
                                                     {log.city}, {log.country}
                                                 </div>
                                                 <div className="flex items-center text-xs text-gray-500 italic">
                                                     <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                     </svg>
                                                     {log.isp || "N/A"}
                                                 </div>
                                             </div>

                                             <div className="pt-4 flex items-center justify-end gap-2">
                                                 <Link
                                                     href={route("certificate-view-logs.show", log.id)}
                                                     className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                                 >
                                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                     </svg>
                                                 </Link>
                                                 <button
                                                     onClick={() => confirmDelete(log)}
                                                     className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                 >
                                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                     </svg>
                                                 </button>
                                             </div>
                                         </motion.div>
                                     ))
                                 ) : (
                                     <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-blue-200">
                                         <svg className="w-16 h-16 mb-4 text-blue-200 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                         </svg>
                                         <p className="text-blue-400 font-bold">No logs found</p>
                                     </div>
                                 )}
                             </div>

                             {/* Desktop Table View */}
                             <div className="hidden md:block overflow-x-auto">
                                 <table className="min-w-full divide-y divide-gray-200">
                                     <thead className="bg-gray-50">
                                         <tr>
                                             <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                                             <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference No</th>
                                             <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                             <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISP</th>
                                             <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                                             <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                         </tr>
                                     </thead>
                                     <tbody className="bg-white divide-y divide-gray-200">
                                         {logs.data && logs.data.length > 0 ? (
                                             logs.data.map((log, index) => (
                                                 <motion.tr
                                                     key={log.id}
                                                     className="hover:bg-gray-50 transition-colors duration-150"
                                                     variants={tableRowVariants}
                                                     initial="hidden"
                                                     animate={isLoaded ? "visible" : "hidden"}
                                                     whileHover="hover"
                                                     custom={index}
                                                 >
                                                     <td className="px-6 py-4 whitespace-nowrap">
                                                         <Link
                                                             href={route("certificate-view-logs.show", log.id)}
                                                             className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                                                         >
                                                             {log.ip || "N/A"}
                                                         </Link>
                                                     </td>
                                                     <td className="px-6 py-4 whitespace-nowrap">
                                                         <div className="text-sm font-medium text-gray-700">
                                                             {log.reference_no || "N/A"}
                                                         </div>
                                                     </td>
                                                     <td className="px-6 py-4 whitespace-nowrap">
                                                         {log.country && log.city ? (
                                                             <div className="text-sm text-gray-600 flex items-center">
                                                                 <span className="w-4 h-3 mr-2 rounded-sm border border-gray-200 bg-gray-100"></span>
                                                                 {log.city}, {log.country}
                                                             </div>
                                                         ) : (
                                                             <div className="text-sm text-gray-500">N/A</div>
                                                         )}
                                                     </td>
                                                     <td className="px-6 py-4 whitespace-nowrap">
                                                         <div className="text-sm text-gray-500 italic">{log.isp || "N/A"}</div>
                                                     </td>
                                                     <td className="px-6 py-4 whitespace-nowrap">
                                                         <div className="text-sm text-gray-600">{log.created_at || "N/A"}</div>
                                                     </td>
                                                     <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                         <Dropdown>
                                                             <Dropdown.Trigger>
                                                                 <button className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200">
                                                                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                                         <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                                                     </svg>
                                                                 </button>
                                                             </Dropdown.Trigger>
                                                             <Dropdown.Content width="48" align="right">
                                                                 <Dropdown.Link href={route("certificate-view-logs.show", log.id)} className="flex items-center text-blue-600">
                                                                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                     </svg>
                                                                     View
                                                                 </Dropdown.Link>
                                                                 <button
                                                                     onClick={() => confirmDelete(log)}
                                                                     className="block w-full px-4 py-2 text-start text-sm leading-5 text-red-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out flex items-center"
                                                                 >
                                                                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                     </svg>
                                                                     Delete
                                                                 </button>
                                                             </Dropdown.Content>
                                                         </Dropdown>
                                                     </td>
                                                 </motion.tr>
                                             ))
                                         ) : (
                                             <tr>
                                                 <td colSpan="6" className="px-6 py-12 text-center">
                                                     <div className="flex flex-col items-center justify-center text-gray-500">
                                                         <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                         </svg>
                                                         <div className="text-base font-medium">No logs found</div>
                                                         <p className="mt-1 text-sm">Certificate view logs will appear here</p>
                                                     </div>
                                                 </td>
                                             </tr>
                                         )}
                                     </tbody>
                                 </table>
                             </div>

                            {/* Pagination */}
                            <div className="px-6 py-4 bg-white border-t border-gray-200">
                                <div className="flex justify-end">
                                    <Pagination links={logs.meta.links} params={params} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="relative z-50">
                <div className="fixed inset-0 bg-gray-500/75" aria-hidden="true" />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900 flex items-center">
                            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Delete Certificate View Log
                        </Dialog.Title>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete this log record for reference{' '}
                                <span className="font-semibold">{logToDelete?.reference_no}</span>? This action cannot be undone.
                            </p>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                onClick={deleteLogConfirmed}
                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                            >
                                Delete
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                                Cancel
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </AuthenticatedLayout>
    );
}
