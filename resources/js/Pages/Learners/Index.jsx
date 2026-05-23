import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Dropdown from '@/Components/Dropdown';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import SearchableSelect from '@/Components/SearchableSelect';
import { Dialog } from '@headlessui/react';
export default function Index({ auth, learners, params = {}, genderOptions = [], countryOptions = [], maleCount = 0, femaleCount = 0, totalLearnersCount = 0 }) {
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(params.search || '');
    const [selectedGender, setSelectedGender] = useState(params.gender || '');
    const [selectedCountry, setSelectedCountry] = useState(params.country || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [learnerToDelete, setLearnerToDelete] = useState(null);
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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.05,
            transition: { duration: 0.2 }
        }
    };    // Animation variants for cards
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

    // Handle search input changes
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            performSearch(e.target.value, selectedGender, selectedCountry);
        }, 500);
    };

    // Handle gender filter change
    const handleGenderChange = (e) => {
        setSelectedGender(e.target.value);
        performSearch(searchTerm, e.target.value, selectedCountry);
    };

    // Handle country filter change
    const handleCountryChange = (country) => {
        setSelectedCountry(country);
        performSearch(searchTerm, selectedGender, country);
    };

    // Execute search with filters
    const performSearch = (search, gender, country) => {
        setIsLoading(true);
        router.get(
            route('learners.index'),
            { search, gender, country },
            {
                preserveState: true,
                onFinish: () => {
                    setIsLoading(false);
                }
            }
        );
    };

    // Handle search submission (when pressing enter)
    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            performSearch(searchTerm, selectedGender, selectedCountry);
        }
    };

    // Handle input blur
    const handleBlur = () => {
        performSearch(searchTerm, selectedGender, selectedCountry);
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedGender('');
        setSelectedCountry('');
        performSearch('', '', '');
    };

    const confirmDelete = (learner) => {
        setLearnerToDelete(learner);
        setShowDeleteModal(true);
    };

    const deleteLearnerConfirmed = () => {
        if (learnerToDelete) {
            router.delete(route('learners.destroy', learnerToDelete.id), {
                onFinish: () => {
                    setShowDeleteModal(false);
                    setLearnerToDelete(null);
                }
            });
        }
    }; return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl leading-tight flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Learners Management
                    </h2>
                </div>
            }
        >            <Head title="Learners" />
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
                            <h3 className="text-xl font-bold text-blue-800 mb-2">Learner Management Dashboard</h3>
                            <p className="text-gray-600">Manage all registered learners in the certificate verification system. Add new learners, edit their details, or remove them as needed.</p>
                        </div>
                    </motion.div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {/* Total Learners Card */}
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
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </motion.div>
                                    <div className="ml-5">
                                        <h3 className="text-sm font-medium text-blue-800">Total Learners</h3>
                                        <motion.div
                                            className="mt-1 flex items-baseline"
                                            initial="hidden"
                                            animate={isLoaded ? "visible" : "hidden"}
                                            custom={1}
                                        >
                                            <span className="text-2xl font-bold text-gray-800">{totalLearnersCount}</span>
                                            <span className="ml-2 text-xs text-blue-500">Registered Learners</span>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Male Learners Card */}
                        <motion.div
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-t-4 border-indigo-600"
                            variants={cardVariants}
                            initial="hidden"
                            animate={isLoaded ? "visible" : "hidden"}
                            whileHover="hover"
                            custom={1}
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
                                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </motion.div>
                                    <div className="ml-5">
                                        <h3 className="text-sm font-medium text-indigo-800">Male Learners</h3>
                                        <motion.div
                                            className="mt-1 flex items-baseline"
                                            initial="hidden"
                                            animate={isLoaded ? "visible" : "hidden"}
                                            custom={2}
                                        >
                                            <span className="text-2xl font-bold text-gray-800">{maleCount}</span>
                                            <span className="ml-2 text-xs text-indigo-500">{totalLearnersCount ? Math.round((maleCount / totalLearnersCount) * 100) : 0}% of total</span>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Female Learners Card */}
                        <motion.div
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-t-4 border-pink-600"
                            variants={cardVariants}
                            initial="hidden"
                            animate={isLoaded ? "visible" : "hidden"}
                            whileHover="hover"
                            custom={2}
                        >
                            <div className="p-4 sm:p-5">
                                <div className="flex items-center">
                                    <motion.div
                                        className="bg-pink-100 p-3 rounded-full"
                                        variants={iconVariants}
                                        initial="hidden"
                                        animate={isLoaded ? "visible" : "hidden"}
                                        whileHover="hover"
                                    >
                                        <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </motion.div>
                                    <div className="ml-5">
                                        <h3 className="text-sm font-medium text-pink-800">Female Learners</h3>
                                        <motion.div
                                            className="mt-1 flex items-baseline"
                                            initial="hidden"
                                            animate={isLoaded ? "visible" : "hidden"}
                                            custom={3}
                                        >
                                            <span className="text-2xl font-bold text-gray-800">{femaleCount}</span>
                                            <span className="ml-2 text-xs text-pink-500">{totalLearnersCount ? Math.round((femaleCount / totalLearnersCount) * 100) : 0}% of total</span>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        {/* Search and Actions Bar */}
                        <div className="p-6 bg-gray-50 border-b border-gray-200">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
                                    <form onSubmit={(e) => { e.preventDefault(); handleSearch({ key: 'Enter' }); }} className="relative w-full md:w-64 flex">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            onKeyDown={handleSearch}
                                            onBlur={handleBlur}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 ease-in-out text-sm"
                                            placeholder="Search learners..."
                                        />
                                        {searchTerm && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    performSearch('', selectedGender, selectedCountry);
                                                }}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-150" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        )}
                                    </form>

                                    {/* Gender Filter */}
                                    <div className="relative w-full sm:w-48">
                                        <select
                                            value={selectedGender}
                                            onChange={handleGenderChange}
                                            className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors duration-150 ease-in-out"
                                        >
                                            <option value="">All Genders</option>
                                            {genderOptions.map((gender, index) => (
                                                <option key={index} value={gender}>{gender}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Country Filter */}
                                    <div className="relative w-full sm:w-48">
                                        <SearchableSelect
                                            value={selectedCountry}
                                            options={countryOptions}
                                            placeholder="All Countries"
                                            searchPlaceholder="Search countries..."
                                            noOptionsText="No countries found"
                                            onChange={handleCountryChange}
                                        />
                                    </div>

                                    {/* Clear Filters Button */}
                                    <button
                                        onClick={clearFilters}
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        disabled={!searchTerm && !selectedGender && !selectedCountry}
                                    >
                                        <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Clear Filters
                                    </button>
                                </div>

                                <Link href={route('learners.create')}>
                                    <motion.button
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        whileHover={{ scale: 1.05 }}
                                        variants={buttonVariants}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add New Learner
                                    </motion.button>
                                </Link>
                            </div>                        </div>

                        {/* Learner List Table */}
                        <div className="p-0 sm:p-0">
                            {isLoading ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
                                <>
                                    {learners.data.length === 0 ? (
                                        <div className="text-center py-16">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No learners found</h3>
                                            <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or adding a new learner.</p>
                                            <div className="mt-6">
                                                <Link href={route('learners.create')}>
                                                    <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                                        </svg>
                                                        Add Learner
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                     ) : (
                                         <>
                                             {/* Mobile Cards View */}
                                             <div className="md:hidden space-y-4 px-4 py-6">
                                                 {learners.data.map((learner, index) => (
                                                     <motion.div
                                                         key={learner.id}
                                                         initial={{ opacity: 0, y: 20 }}
                                                         animate={{ opacity: 1, y: 0 }}
                                                         transition={{ duration: 0.3, delay: index * 0.05 }}
                                                         className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5 space-y-4"
                                                     >
                                                         <div className="flex items-center space-x-4">
                                                             <div className="w-12 h-12 rounded-2xl overflow-hidden bg-blue-50 border border-blue-100 shadow-inner flex-shrink-0">
                                                                 {learner.profile_picture ? (
                                                                     <img src={learner.profile_picture} alt={learner.full_name} className="w-full h-full object-cover" />
                                                                 ) : (
                                                                     <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500 font-bold text-lg">
                                                                         {learner.full_name.charAt(0).toUpperCase()}
                                                                     </div>
                                                                 )}
                                                             </div>
                                                             <div className="min-w-0 flex-1">
                                                                 <h4 className="text-base font-bold text-blue-900 truncate">{learner.full_name}</h4>
                                                                 <p className="text-xs text-blue-500 font-medium">Learner Number /Reference: {learner.learner_id || '-'}</p>
                                                             </div>
                                                         </div>

                                                         <div className="grid grid-cols-2 gap-4 pt-3 border-t border-blue-50">
                                                             <div>
                                                                 <p className="text-[10px] font-bold text-gray-400 uppercase">Contact</p>
                                                                 <p className="text-xs font-semibold text-gray-700 truncate">{learner.email}</p>
                                                                 <p className="text-[10px] text-gray-500">{learner.phone_no || '-'}</p>
                                                             </div>
                                                             <div>
                                                                 <p className="text-[10px] font-bold text-gray-400 uppercase">Proof ID</p>
                                                                 <p className="text-xs font-semibold text-gray-700">{learner.proof_id || '-'}</p>
                                                                 <p className="text-[10px] text-gray-500">{learner.proof_type || '-'}</p>
                                                             </div>
                                                         </div>

                                                         <div className="pt-4 flex items-center justify-end gap-2">
                                                             <Link
                                                                 href={route("learners.show", learner.id)}
                                                                 className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                             >
                                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                 </svg>
                                                             </Link>
                                                             <Link
                                                                 href={route("learners.edit", learner.id)}
                                                                 className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                                             >
                                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                 </svg>
                                                             </Link>
                                                             {isAdmin && (
                                                                 <button
                                                                     onClick={() => confirmDelete(learner)}
                                                                     className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                                 >
                                                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                     </svg>
                                                                 </button>
                                                             )}
                                                         </div>
                                                     </motion.div>
                                                 ))}
                                             </div>

                                             {/* Desktop Table View */}
                                             <div className="hidden md:block overflow-x-auto">
                                                 <table className="min-w-full divide-y divide-gray-200">
                                                     <thead className="bg-gray-50">
                                                         <tr>
                                                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                                                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Learner Number /Reference</th>
                                                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proof ID</th>
                                                             <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                         </tr>
                                                     </thead>
                                                     <tbody className="bg-white divide-y divide-gray-200">
                                                         {learners.data.map((learner, index) => (
                                                             <motion.tr
                                                                 key={learner.id}
                                                                 initial={{ opacity: 0 }}
                                                                 animate={{ opacity: 1 }}
                                                                 exit={{ opacity: 0 }}
                                                                 transition={{ duration: 0.2, delay: index * 0.05 }}
                                                                 className="hover:bg-gray-50"
                                                             >
                                                                 <td className="px-6 py-4 whitespace-nowrap">
                                                                     <div className="flex-shrink-0 h-10 w-10">
                                                                         <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                                                             {learner.profile_picture ? (
                                                                                 <img
                                                                                     src={learner.profile_picture}
                                                                                     alt={learner.full_name}
                                                                                     className="w-full h-full object-cover"
                                                                                 />
                                                                             ) : (
                                                                                 <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                                                                                     {learner.full_name.charAt(0).toUpperCase()}
                                                                                 </div>
                                                                             )}
                                                                         </div>
                                                                     </div>
                                                                 </td>
                                                                 <td className="px-6 py-4 whitespace-nowrap">
                                                                     <div className="text-sm font-medium text-gray-900">{learner.full_name}</div>
                                                                 </td>
                                                                 <td className="px-6 py-4 whitespace-nowrap">
                                                                     <div className="text-sm text-gray-500">{learner.learner_id || '-'}</div>
                                                                 </td>
                                                                 <td className="px-6 py-4 whitespace-nowrap">
                                                                     <div className="text-sm text-gray-900 font-medium">{learner.email}</div>
                                                                     <div className="text-xs text-gray-500">{learner.phone_no || '-'}</div>
                                                                 </td>
                                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                     <div className="text-sm text-gray-900 font-medium">{learner.proof_id || '-'}</div>
                                                                     <div className="text-xs text-gray-500">{learner.proof_type || '-'}</div>
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
                                                                             <Dropdown.Link href={route("learners.show", learner.id)} className="flex items-center text-green-600">
                                                                                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                                 </svg>
                                                                                 View
                                                                             </Dropdown.Link>
                                                                             <Dropdown.Link href={route("learners.edit", learner.id)} className="flex items-center text-indigo-600">
                                                                                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                                 </svg>
                                                                                 Edit
                                                                             </Dropdown.Link>
                                                                             {isAdmin && (
                                                                                 <button
                                                                                     onClick={() => confirmDelete(learner)}
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
                                                         ))}
                                                     </tbody>
                                                 </table>
                                             </div>
                                         </>
                                     )}

                                    {/* Pagination */}
                                    <div className="p-4 bg-white border-t border-gray-200 flex justify-end">
                                        <Pagination links={learners.meta.links} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                className="fixed z-10 inset-0 overflow-y-auto"
            >
                <div className="flex items-center justify-center min-h-screen">
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

                    <div className="relative bg-white rounded-lg max-w-md mx-auto p-6 shadow-xl">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                            Confirm Deletion
                        </Dialog.Title>
                        <div className="mt-3">
                            <div className="text-sm text-gray-500">
                                <p className="mb-4">
                                    Are you sure you want to delete this learner? This action cannot be undone.
                                </p>
                                {learnerToDelete && (
                                    <div className="mt-2 p-4 border border-gray-200 rounded-md bg-gray-50">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 mr-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
                                                    {learnerToDelete.profile_picture ? (
                                                        <img
                                                            src={learnerToDelete.profile_picture}
                                                            alt={learnerToDelete.full_name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                            {learnerToDelete.full_name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{learnerToDelete.full_name}</p>
                                                <p className="text-sm text-gray-600">{learnerToDelete.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                type="button"
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                                onClick={deleteLearnerConfirmed}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </AuthenticatedLayout>
    );
}
