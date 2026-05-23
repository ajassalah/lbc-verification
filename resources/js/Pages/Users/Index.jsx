import React, { useState, useEffect, useRef } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Pagination from "@/Components/Pagination";
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import Dropdown from '@/Components/Dropdown';

export default function Index({ auth, users, adminCount, userCount, totalUsersCount, params = {}, roles = [] }) {
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(params.name || '');
    const [selectedRole, setSelectedRole] = useState(params.role || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const searchTimeoutRef = useRef(null);

    // Check if user is admin
    const isAdmin = auth.user?.role === 'admin';

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

    // Calculate user statistics
    const totalUsers = users.meta?.total || 0;
    const adminUsers = users.data?.filter(user => user.role === 'admin').length || 0;
    const regularUsers = totalUsers - adminUsers;

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
            performSearch(value, selectedRole);
        }, 3000);
    };

    // Handle role filter change
    const handleRoleChange = (e) => {
        const value = e.target.value;
        setSelectedRole(value);
        performSearch(searchTerm, value);
    };

    // Execute search with filters
    const performSearch = (term, role) => {
        setIsLoading(true);

        const searchParams = { page: 1 };
        if (term) searchParams.name = term;
        if (role) searchParams.role = role;

        router.get(
            route('users.index'),
            searchParams,
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

        performSearch(searchTerm, selectedRole);
    };

    // Handle input blur
    const handleBlur = () => {
        // Clear any existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        performSearch(searchTerm, selectedRole);
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedRole('');
        setIsLoading(true);

        router.get(
            route('users.index'),
            { page: 1 },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            }
        );
    };

    const confirmDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const deleteUserConfirmed = () => {
        if (!userToDelete) return;

        router.delete(route('users.destroy', userToDelete.id), {
            onStart: () => setIsLoading(true),
            onFinish: () => {
                setIsLoading(false);
                setShowDeleteModal(false);
                setUserToDelete(null);
            },
        });
    };

    // Get role icon based on role name
    const getRoleIcon = (roleName) => {
        switch (roleName) {
            case 'admin':
                return (
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                );
            case 'user':
                return (
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                );
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl  leading-tight flex items-center">
                        <svg className="w-6 h-6 mr-2 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Users Management
                    </h2>
                </div>
            }>
            <Head title="Users" />
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
                            <h3 className="text-xl font-bold text-blue-800 mb-2">User Management Dashboard</h3>
                            <p className="text-gray-600">Manage all registered users in the certificate verification system. Add new users, edit their details, or remove them as needed.</p>
                        </div>
                    </motion.div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {/* Total Users Card */}
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
                                        <img src="/image/users-icon.png" alt="Total Users" className="w-8 h-8" />
                                    </motion.div>
                                    <div className="ml-5">
                                        <h3 className="text-sm font-medium text-blue-800">Total Users</h3>
                                        <motion.div
                                            className="mt-1 flex items-baseline"
                                            variants={totalUsersCount}
                                            initial="hidden"
                                            animate={isLoaded ? "visible" : "hidden"}
                                            custom={1}
                                        >
                                            <span className="text-2xl font-bold text-gray-800">{totalUsersCount}</span>
                                            <span className="ml-2 text-xs text-blue-500">Registered Accounts</span>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Admin Users Card */}
                        <motion.div
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-t-4 border-purple-600"
                            variants={cardVariants}
                            initial="hidden"
                            animate={isLoaded ? "visible" : "hidden"}
                            whileHover="hover"
                            custom={1}
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
                                        <img src="/image/users-icon.png" alt="Admin Users" className="w-8 h-8" />
                                    </motion.div>
                                    <div className="ml-5">
                                        <h3 className="text-sm font-medium text-purple-800">Admin Users</h3>
                                        <motion.div
                                            className="mt-1 flex items-baseline"
                                            variants={adminCount}
                                            initial="hidden"
                                            animate={isLoaded ? "visible" : "hidden"}
                                            custom={2}
                                        >
                                            <span className="text-2xl font-bold text-gray-800">{adminCount}</span>
                                            <span className="ml-2 text-xs text-purple-500">Administrator Accounts</span>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Regular Users Card */}
                        <motion.div
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-t-4 border-indigo-600"
                            variants={cardVariants}
                            initial="hidden"
                            animate={isLoaded ? "visible" : "hidden"}
                            whileHover="hover"
                            custom={2}
                        >
                            <div className="p-4 sm:p-5">
                                <div className="flex items-center">
                                    <motion.div
                                        className="bg-indigo-100 p-3 rounded-full"
                                        variants={iconVariants}
                                        initial="hidden"
                                        animate={isLoaded ? "visible" : "hidden"}
                                        whileHover="hover"
                                    >
                                        <img src="/image/users-icon.png" alt="Regular Users" className="w-8 h-8" />
                                    </motion.div>
                                    <div className="ml-5">
                                        <h3 className="text-sm font-medium text-indigo-800">Regular Users</h3>
                                        <motion.div
                                            className="mt-1 flex items-baseline"
                                            variants={userCount}
                                            initial="hidden"
                                            animate={isLoaded ? "visible" : "hidden"}
                                            custom={3}
                                        >
                                            <span className="text-2xl font-bold text-gray-800">{userCount}</span>
                                            <span className="ml-2 text-xs text-indigo-500">Standard Accounts</span>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        {/* Search and Actions Bar */}
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
                                            placeholder="Search users..."
                                        />
                                        {searchTerm && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    performSearch('', selectedRole);
                                                }}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-150" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        )}
                                    </form>

                                    {/* Role Filter Dropdown */}
                                    <div className="relative w-full sm:w-48">
                                        <select
                                            value={selectedRole}
                                            onChange={handleRoleChange}
                                            className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors duration-150 ease-in-out"
                                        >
                                            <option value="">All Roles</option>
                                            {roles.map((role) => (
                                                <option key={role} value={role}>
                                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>

                                    {(searchTerm || selectedRole) && (
                                        <button
                                            onClick={clearFilters}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Clear
                                        </button>
                                    )}
                                </div>

                                {isAdmin && (
                                    <div className="flex items-center">
                                        <Link
                                            className="group relative inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md overflow-hidden font-medium text-sm text-white shadow-sm transition-all duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            href={route('users.create')}
                                        >
                                            <span className="absolute top-0 left-0 w-full h-0 bg-white/20 transition-all duration-300 ease-out group-hover:h-full"></span>
                                            <span className="absolute right-0 -mt-12 -mr-12 w-12 h-12 bg-white/10 rounded-full transform rotate-45 transition-all duration-700 ease-in-out group-hover:scale-150 group-hover:mt-1 group-hover:mr-3"></span>
                                            <svg className="w-4 h-4 mr-2 transition-transform duration-300 transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            <span className="relative">Add User</span>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Display active filters */}
                            {(searchTerm || selectedRole) && (
                                <div className="mt-4 text-gray-600 text-sm flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    <span className="font-medium">Filters:</span>
                                    {searchTerm && (
                                        <span className="ml-2 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-200">
                                            Search: "{searchTerm}"
                                        </span>
                                    )}
                                    {selectedRole && (
                                        <span className="ml-2 bg-gray-50 text-gray-700 text-xs px-2 py-1 rounded border border-gray-200">
                                            Role: {selectedRole}
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

                         {/* Mobile Cards View */}
                         <div className="md:hidden space-y-4 px-4 py-6">
                             {users.data && users.data.length > 0 ? (
                                 users.data.map((user) => (
                                     <div key={user.id} className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5 space-y-4">
                                         <div className="flex justify-between items-start">
                                             <div>
                                                 <h4 className="text-base font-bold text-blue-900">{user.name}</h4>
                                                 <p className="text-xs text-blue-500 font-medium">{user.email}</p>
                                             </div>
                                             <span className={`px-2 py-1 inline-flex items-center text-[10px] capitalize leading-5 font-bold rounded-full border ${user.role === 'admin'
                                                 ? 'bg-purple-50 border-purple-200 text-purple-700'
                                                 : 'bg-green-50 border-green-200 text-green-700'
                                                 }`}>
                                                 {user.role}
                                             </span>
                                         </div>

                                         {isAdmin && (
                                             <div className="pt-4 border-t border-blue-50 flex justify-end gap-2">
                                                 <Link
                                                     href={route('users.edit', user.id)}
                                                     className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                                 >
                                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                     </svg>
                                                 </Link>
                                                 <button
                                                     onClick={() => confirmDelete(user)}
                                                     className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                 >
                                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                     </svg>
                                                 </button>
                                             </div>
                                         )}
                                     </div>
                                 ))
                             ) : (
                                 <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-blue-200">
                                     <svg className="w-16 h-16 mb-4 text-blue-200 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                     </svg>
                                     <p className="text-blue-400 font-bold">No users found</p>
                                 </div>
                             )}
                         </div>

                         {/* Users Table */}
                         <div className="hidden md:block overflow-x-auto">
                             <table className="min-w-full divide-y divide-gray-200">
                                 <thead className="bg-gray-50">
                                     <tr>
                                         <th
                                             scope="col"
                                             className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                         >
                                             Name
                                         </th>
                                         <th
                                             scope="col"
                                             className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                         >
                                             Email
                                         </th>
                                         <th
                                             scope='col'
                                             className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                         >
                                             Role
                                         </th>
                                         {isAdmin && (
                                             <th
                                                 scope='col'
                                                 className='px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                                             >
                                                 Actions
                                             </th>
                                         )}
                                     </tr>
                                 </thead>
                                 <tbody className="bg-white divide-y divide-gray-200">
                                     {users.data && users.data.length > 0 ? (
                                         users.data.map((user) => (
                                             <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                 <td className="px-6 py-4 whitespace-nowrap">
                                                     <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                 </td>
                                                 <td className="px-6 py-4 whitespace-nowrap">
                                                     <div className="text-sm text-gray-500">{user.email}</div>
                                                 </td>
                                                 <td className="px-6 py-4 whitespace-nowrap">
                                                     <span className={`px-2 py-1 inline-flex items-center text-xs capitalize leading-5 font-medium rounded-sm border min-w-[70px] justify-center ${user.role === 'admin'
                                                         ? 'border-purple-300 text-purple-800'
                                                         : 'border-green-300 text-green-800'
                                                         }`}>
                                                         {getRoleIcon(user.role)}
                                                         {user.role}
                                                     </span>
                                                 </td>
                                                 {isAdmin && (
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
                                                                 <Dropdown.Link href={route('users.edit', user.id)}>
                                                                     <span className="flex items-center">
                                                                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                         </svg>
                                                                         Edit
                                                                     </span>
                                                                 </Dropdown.Link>
                                                                 <button
                                                                     onClick={() => confirmDelete(user)}
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
                                                 )}
                                             </tr>
                                         ))
                                     ) : (
                                         <tr>
                                             <td colSpan={isAdmin ? "4" : "3"} className="px-6 py-12 text-center">
                                                 <div className="flex flex-col items-center justify-center text-gray-500">
                                                     <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                     </svg>
                                                     <div className="text-base font-medium">No users found</div>
                                                     <p className="mt-1 text-sm">Try adjusting your search or filter to find what you're looking for.</p>
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
                                <Pagination links={users.meta.links} params={params} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Delete User
                        </Dialog.Title>
                        <div className="mt-3">
                            <p className="text-sm text-gray-600">
                                Are you sure you want to delete{' '}
                                <span className="font-semibold text-gray-900">{userToDelete?.name}</span>? This action cannot be undone.
                            </p>
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
                                onClick={deleteUserConfirmed}
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
