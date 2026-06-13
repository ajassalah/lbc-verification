import React, { useState, useEffect, useRef } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Pagination from "@/Components/Pagination";
import { Dialog } from '@headlessui/react';
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import Dropdown from '@/Components/Dropdown';

export default function Index({ auth, certificates, params = {}, courses = [], statuses = [],
    totalPendingCount, totalVerifiedCount, totalCertificatesCount }) {
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(params.search || '');
    const [selectedCourse, setSelectedCourse] = useState(params.course || '');
    const [selectedStatus, setSelectedStatus] = useState(params.status || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [certificateToDelete, setCertificateToDelete] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const searchTimeoutRef = useRef(null);

    // Check if user is admin
    const isAdmin = auth.user?.role === 'admin';

    // Set isLoaded to true after component mounts for animations
    useEffect(() => {
        setIsLoaded(true);
    }, []);

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

    // Calculate certificate statistics
    const totalCertificates = certificates.meta?.total || 0;
    const verifiedCertificates = certificates.data?.filter(cert => cert.status.toLowerCase() === 'verified').length || 0;
    const pendingCertificates = totalCertificates - verifiedCertificates;

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            performSearch(value, selectedCourse, selectedStatus);
        }, 500); // Reduced from 3000ms to 500ms for better responsiveness
    };

    const handleCourseChange = (e) => {
        const value = e.target.value;
        setSelectedCourse(value);
        performSearch(searchTerm, value, selectedStatus);
    };

    const handleStatusChange = (e) => {
        const value = e.target.value;
        setSelectedStatus(value);
        performSearch(searchTerm, selectedCourse, value);
    };

    const performSearch = (term, course, status) => {
        setIsLoading(true);

        const searchParams = { page: 1 };
        if (term) searchParams.search = term;
        if (course) searchParams.course = course;
        if (status) searchParams.status = status;

        router.get(
            route('certificates.index'),
            searchParams,
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            }
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        performSearch(searchTerm, selectedCourse, selectedStatus);
    };

    const handleBlur = () => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        performSearch(searchTerm, selectedCourse, selectedStatus);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCourse('');
        setSelectedStatus('');
        setIsLoading(true);

        router.get(
            route('certificates.index'),
            { page: 1 },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            }
        );
    };

    const confirmDelete = (certificate) => {
        setCertificateToDelete(certificate);
        setShowDeleteModal(true);
    };

    const deleteConfirmed = () => {
        if (!certificateToDelete) return;

        setIsLoading(true);
        axios.delete(route('certificates.destroy', certificateToDelete.id))
            .then(() => {
                router.reload({
                    onFinish: () => {
                        setIsLoading(false);
                        setShowDeleteModal(false);
                        setCertificateToDelete(null);
                    },
                });
            })
            .catch(() => {
                setIsLoading(false);
                setShowDeleteModal(false);
                setCertificateToDelete(null);
            });
    };

    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case 'verified':
                return (
                    <span className="px-2 py-1 inline-flex items-center text-xs capitalize leading-5 font-medium rounded-full border min-w-[70px] justify-center border-green-300 bg-green-50 text-green-800">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {status}
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-1 inline-flex items-center text-xs capitalize leading-5 font-medium rounded-full border min-w-[70px] justify-center border-yellow-300 bg-yellow-50 text-yellow-800">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {status}
                    </span>
                );
        }
    };

    const certificatePdfUrl = (certificate, printCopy = false) => {
        const params = new URLSearchParams({
            type: 'old',
            v: certificate.pdf_version || certificate.updated_at || Date.now(),
        });

        if (printCopy) {
            params.set('print_copy', '1');
        }

        return `/certificates/${certificate.id}/pdf?${params.toString()}`;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl leading-tight flex items-center">
                        <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Certificates Management
                    </h2>
                </div>
            }>

            <Head title="Certificates" />
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
                            <h3 className="text-xl font-bold text-blue-800 mb-2">Certificate Verification Portal</h3>
                            <p className="text-gray-600">Manage and verify educational certificates. Search, filter, and view certificate details to validate authenticity.</p>
                        </div>
                    </motion.div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {/* Total Certificates Card */}
                        <motion.div
                            className="bg-white overflow-hidden shadow-sm rounded-lg border-t-4 border-blue-600"
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
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </motion.div>
                                    <div className="ml-5">
                                        <h3 className="text-sm font-medium text-blue-800">Total Certificates</h3>
                                        <motion.div
                                            className="mt-1 flex items-baseline"
                                            variants={counterVariants}
                                            initial="hidden"
                                            animate={isLoaded ? "visible" : "hidden"}
                                            custom={1}
                                        >
                                            <span className="text-2xl font-bold text-gray-800">{totalCertificatesCount}</span>
                                            <span className="ml-2 text-xs text-blue-500">Total Documents</span>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Verified Certificates Card */}
                        <motion.div
                            className="bg-white overflow-hidden shadow-sm rounded-lg border-t-4 border-green-600"
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
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </motion.div>
                                    <div className="ml-5">
                                        <h3 className="text-sm font-medium text-green-800">Verified Certificates</h3>
                                        <motion.div
                                            className="mt-1 flex items-baseline"
                                            variants={counterVariants}
                                            initial="hidden"
                                            animate={isLoaded ? "visible" : "hidden"}
                                            custom={2}
                                        >
                                            <span className="text-2xl font-bold text-gray-800">{totalVerifiedCount}</span>
                                            <span className="ml-2 text-xs text-green-500">Verified Documents</span>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Pending Certificates Card */}
                        <motion.div
                            className="bg-white overflow-hidden shadow-sm rounded-lg border-t-4 border-yellow-600"
                            variants={cardVariants}
                            initial="hidden"
                            animate={isLoaded ? "visible" : "hidden"}
                            whileHover="hover"
                            custom={2}
                        >
                            <div className="p-4 sm:p-5">
                                <div className="flex items-center">
                                    <motion.div
                                        className="bg-yellow-100 p-3 rounded-full"
                                        variants={iconVariants}
                                        initial="hidden"
                                        animate={isLoaded ? "visible" : "hidden"}
                                        whileHover="hover"
                                    >
                                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </motion.div>
                                    <div className="ml-5">
                                        <h3 className="text-sm font-medium text-yellow-800">Pending Certificates</h3>
                                        <motion.div
                                            className="mt-1 flex items-baseline"
                                            variants={counterVariants}
                                            initial="hidden"
                                            animate={isLoaded ? "visible" : "hidden"}
                                            custom={3}
                                        >
                                            <span className="text-2xl font-bold text-gray-800">{totalPendingCount}</span>
                                            <span className="ml-2 text-xs text-yellow-500">Pending Verification</span>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
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
                                            placeholder="Search certificates..."
                                        />
                                        {searchTerm && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    performSearch('', selectedCourse, selectedStatus);
                                                }}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-150" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        )}
                                    </form>

                                    <div className="flex items-center">
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-md shadow-sm text-sm leading-4 font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                            </svg>
                                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                                        </button>
                                    </div>

                                    {(searchTerm || selectedCourse || selectedStatus) && (
                                        <button
                                            onClick={clearFilters}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Clear Filters
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <Link
                                        className="group relative inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md overflow-hidden font-medium text-sm text-white shadow-sm transition-all duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        href={route('certificates.create')}
                                    >
                                        <span className="absolute top-0 left-0 w-full h-0 bg-white/20 transition-all duration-300 ease-out group-hover:h-full"></span>
                                        <span className="absolute right-0 -mt-12 -mr-12 w-12 h-12 bg-white/10 rounded-full transform rotate-45 transition-all duration-700 ease-in-out group-hover:scale-150 group-hover:mt-1 group-hover:mr-3"></span>
                                        <svg className="w-4 h-4 mr-2 transition-transform duration-300 transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <span className="relative">Add Certificate</span>
                                    </Link>
                                </div>
                            </div>

                            <AnimatePresence>
                                {showFilters && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-4 pt-4 border-t border-gray-200"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="relative">
                                                <label htmlFor="course-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Course</label>
                                                <select
                                                    id="course-filter"
                                                    value={selectedCourse}
                                                    onChange={handleCourseChange}
                                                    className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors duration-150 ease-in-out"
                                                >
                                                    <option value="">All Courses</option>
                                                    {courses.map((course) => (
                                                        <option key={course.id} value={course.id}>
                                                            {course.name} {course.code && `(${course.code})`}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 top-6 flex items-center px-2 text-gray-700">
                                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                                                <select
                                                    id="status-filter"
                                                    value={selectedStatus}
                                                    onChange={handleStatusChange}
                                                    className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors duration-150 ease-in-out"
                                                >
                                                    <option value="">All Statuses</option>
                                                    {statuses.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 top-6 flex items-center px-2 text-gray-700">
                                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {(searchTerm || selectedCourse || selectedStatus) && (
                                <div className="mt-4 text-gray-600 text-sm flex items-center flex-wrap gap-2">
                                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    <span className="font-medium">Active Filters:</span>
                                    {searchTerm && (
                                        <span className="ml-2 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200">
                                            Search: "{searchTerm}"
                                        </span>
                                    )}
                                    {selectedCourse && (
                                        <span className="ml-2 bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full border border-indigo-200">
                                            Course: {selectedCourse}
                                        </span>
                                    )}
                                    {selectedStatus && (
                                        <span className="ml-2 bg-gray-50 text-gray-700 text-xs px-2 py-1 rounded-full border border-gray-200">
                                            Status: {selectedStatus}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Loading Indicator with Animation */}
                        {isLoading && (
                            <motion.div
                                className="flex justify-center my-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full absolute border-4 border-gray-200"></div>
                                    <motion.div
                                        className="w-12 h-12 rounded-full absolute border-4 border-blue-500 border-t-transparent"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    ></motion.div>
                                </div>
                            </motion.div>
                        )}


                             <div className="md:hidden space-y-4 px-4 py-6">
                                {certificates.data && certificates.data.length > 0 ? (
                                    certificates.data.map((certificate, index) => (
                                        <motion.div
                                            key={certificate.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5 space-y-4"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">{certificate.reference_no}</p>
                                                    <h4 className="text-base font-bold text-blue-900">{certificate.learner?.full_name || 'N/A'}</h4>
                                                    <p className="text-xs text-blue-400 font-medium">ID: {certificate.learner?.learner_id || 'N/A'}</p>
                                                </div>
                                                {getStatusBadge(certificate.status)}
                                            </div>

                                            <div className="space-y-3 pt-3 border-t border-blue-50">
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Course</p>
                                                    <p className="text-sm font-semibold text-gray-700">{certificate.course?.name || 'N/A'}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {certificate.course?.code && <span className="mr-2">{certificate.course.code}</span>}
                                                        {certificate.course?.duration && <span>{certificate.course.duration} {certificate.course.duration === 1 ? 'month' : 'months'}</span>}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="pt-4 flex items-center justify-between gap-2">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={route("certificates.show", certificate.id)}
                                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                        title="View"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Link>
                                                    {isAdmin && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                disabled
                                                                className="p-2 bg-gray-50 text-gray-400 rounded-lg cursor-not-allowed opacity-60"
                                                                title="New Certificate temporarily disabled"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            </button>
                                                            <a
                                                                href={certificatePdfUrl(certificate)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                                                title="Old Certificate"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H3a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            </a>
                                                            <a
                                                                href={certificatePdfUrl(certificate, true)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                                                                title="Print Copy Old Certificate"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h20a2 2 0 012 2v5a2 2 0 01-2 2h-2m-16 0v4h12v-4H6z" />
                                                                </svg>
                                                            </a>
                                                        </>
                                                    )}
                                                    <Link
                                                        href={route("certificates.edit", certificate.id)}
                                                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => confirmDelete(certificate)}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-blue-200">
                                        <svg className="w-16 h-16 mb-4 text-blue-200 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-blue-400 font-bold">No certificates found</p>
                                    </div>
                                )}
                            </div>

                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference No</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Learner Name</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {certificates.data && certificates.data.length > 0 ? (
                                            certificates.data.map((certificate, index) => (
                                                <motion.tr
                                                    key={certificate.id}
                                                    className="hover:bg-gray-50 transition-colors duration-150"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm font-medium text-blue-600">
                                                            {certificate.reference_no}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 font-medium">
                                                            {certificate.learner ? certificate.learner.full_name : 'N/A'}
                                                        </div>
                                                        {certificate.learner && certificate.learner.learner_id && (
                                                            <div className="text-xs text-gray-500">ID: {certificate.learner.learner_id}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {certificate.course ? certificate.course.name : 'N/A'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {certificate.course && certificate.course.code &&
                                                                <span className="mr-1">{certificate.course.code}</span>
                                                            }
                                                            {certificate.course && certificate.course.duration &&
                                                                <span>{certificate.course.duration} {certificate.course.duration === 1 ? 'month' : 'months'}</span>
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(certificate.status)}
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
                                                            <Dropdown.Content width="48" align="right" position="fixed">
                                                                <Dropdown.Link href={route("certificates.show", certificate.id)} className="flex items-center text-green-600">
                                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </svg>
                                                                    View
                                                                </Dropdown.Link>
                                                                {isAdmin && (
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            disabled
                                                                            className="flex w-full cursor-not-allowed items-center px-4 py-2 text-start text-sm leading-5 text-gray-400 opacity-60"
                                                                        >
                                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                            </svg>
                                                                            New Certificate
                                                                        </button>
                                                                        <a
                                                                            href={certificatePdfUrl(certificate)}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="block w-full px-4 py-2 text-start text-sm leading-5 text-blue-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out flex items-center"
                                                                        >
                                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H3a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                            </svg>
                                                                            Old Certificate
                                                                        </a>
                                                                        <a
                                                                            href={certificatePdfUrl(certificate, true)}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="block w-full px-4 py-2 text-start text-sm leading-5 text-slate-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out flex items-center"
                                                                        >
                                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h20a2 2 0 012 2v5a2 2 0 01-2 2h-2m-16 0v4h12v-4H6z" />
                                                                            </svg>
                                                                            Print Copy Old Certificate
                                                                        </a>
                                                                    </>
                                                                )}
                                                                <Dropdown.Link href={route("certificates.edit", certificate.id)} className="flex items-center text-indigo-600">
                                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                    Edit
                                                                </Dropdown.Link>
                                                                {isAdmin && (
                                                                    <button
                                                                        onClick={() => confirmDelete(certificate)}
                                                                        className="block w-full px-4 py-2 text-start text-sm leading-5 text-red-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out flex items-center"
                                                                    >
                                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                        </svg>
                                                                        Delete
                                                                    </button>
                                                                )}
                                                            </Dropdown.Content>
                                                        </Dropdown>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <div className="text-base font-medium">No certificates found</div>
                                                        <p className="mt-1 text-sm">Try adjusting your search or filter to find what you're looking for.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        {certificates.meta && (
                            <div className="px-6 py-4 bg-white border-t border-gray-200">
                                <div className="flex justify-end">
                                    <Pagination links={certificates.meta.links} params={params} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Delete Certificate
                        </Dialog.Title>
                        <div className="mt-3">
                            <p className="text-sm text-gray-600">
                                Are you sure you want to delete this certificate for{' '}
                                <span className="font-semibold text-gray-900">
                                    {certificateToDelete?.learner?.full_name || 'N/A'}
                                </span>
                                ? This action cannot be undone.
                            </p>
                            {certificateToDelete && (
                                <div className="mt-2 p-3 bg-gray-50 rounded-md text-xs">
                                    <div><span className="font-semibold">Learner ID:</span> {certificateToDelete.learner?.learner_id || 'N/A'}</div>
                                    <div><span className="font-semibold">Reference No:</span> {certificateToDelete.reference_no}</div>
                                    <div><span className="font-semibold">Course:</span> {certificateToDelete.course?.name || 'N/A'} {certificateToDelete.course?.code ? `(${certificateToDelete.course.code})` : ''}</div>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={deleteConfirmed}
                                className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm transition-all duration-200 hover:shadow-md"
                            >
                                Delete
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </AuthenticatedLayout>
    );
}
