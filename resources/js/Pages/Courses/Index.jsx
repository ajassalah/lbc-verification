import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PlusIcon, PencilSquareIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon, XMarkIcon, AcademicCapIcon, BookOpenIcon, UsersIcon } from '@heroicons/react/24/outline';
import Pagination from '@/Components/Pagination';
import Dropdown from '@/Components/Dropdown';
import { Dialog } from '@headlessui/react';

export default function Index({ auth, courses, params = {}, facultyOptions = [] }) {
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(params.name || '');
    const [selectedFaculty, setSelectedFaculty] = useState(params.faculty || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
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
    };

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

    // Handle search input changes
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            performSearch(value, selectedFaculty);
        }, 500);
    };

    // Handle faculty filter change
    const handleFacultyChange = (e) => {
        const value = e.target.value;
        setSelectedFaculty(value);
        performSearch(searchTerm, value);
    };

    // Execute search with filters
    const performSearch = (term, faculty) => {
        setIsLoading(true);
        router.get(route('courses.index'),
            {
                name: term || undefined,
                faculty: faculty || undefined,
                page: 1,
            },
            {
                preserveState: true,
                replace: true,
                onSuccess: () => setIsLoading(false),
                onError: () => setIsLoading(false),
            }
        );
    };

    // Handle search submission (when pressing enter)
    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            performSearch(searchTerm, selectedFaculty);
        }
    };

    // Handle input blur
    const handleBlur = () => {
        performSearch(searchTerm, selectedFaculty);
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedFaculty('');
        router.get(route('courses.index'), {}, { preserveState: true, replace: true });
    };

    const confirmDelete = (course) => {
        setCourseToDelete(course);
        setShowDeleteModal(true);
    };

    const deleteCourseConfirmed = () => {
        if (courseToDelete) {
            router.delete(route('courses.destroy', courseToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setCourseToDelete(null);
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Courses</h2>}
        >
            <Head title="Courses" />

            <motion.div
                className="py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
                        initial="hidden"
                        animate={isLoaded ? "visible" : "hidden"}
                    >
                        {/* Total Courses Card */}
                        <motion.div
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg"
                            variants={cardVariants}
                            custom={0}
                            whileHover="hover"
                        >
                            <div className="p-6 flex items-center">
                                <motion.div
                                    className="rounded-full bg-indigo-100 p-3 mr-4"
                                    variants={iconVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                >
                                    <BookOpenIcon className="h-6 w-6 text-indigo-600" />
                                </motion.div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500">Total Courses</div>
                                    <motion.div
                                        className="text-2xl font-bold text-gray-900"
                                        variants={counterVariants}
                                        custom={0}
                                    >
                                        {courses.meta?.total || 0}
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Active Courses Card */}
                        <motion.div
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg"
                            variants={cardVariants}
                            custom={1}
                            whileHover="hover"
                        >
                            <div className="p-6 flex items-center">
                                <motion.div
                                    className="rounded-full bg-green-100 p-3 mr-4"
                                    variants={iconVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                >
                                    <AcademicCapIcon className="h-6 w-6 text-green-600" />
                                </motion.div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500">Active Courses</div>
                                    <motion.div
                                        className="text-2xl font-bold text-gray-900"
                                        variants={counterVariants}
                                        custom={1}
                                    >
                                        {courses.data?.filter(course => course.status).length || 0}
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Total Modules Card */}
                        <motion.div
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg"
                            variants={cardVariants}
                            custom={2}
                            whileHover="hover"
                        >
                            <div className="p-6 flex items-center">
                                <motion.div
                                    className="rounded-full bg-amber-100 p-3 mr-4"
                                    variants={iconVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                >
                                    <UsersIcon className="h-6 w-6 text-amber-600" />
                                </motion.div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500">Total Modules</div>
                                    <motion.div
                                        className="text-2xl font-bold text-gray-900"
                                        variants={counterVariants}
                                        custom={2}
                                    >
                                        {courses.data?.reduce((sum, course) => sum + (course.modules?.length || 0), 0) || 0}
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                                <h3 className="text-lg font-semibold">All Courses</h3>

                                {/* Search and Filter Controls */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Search input */}
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Search courses..."
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            onKeyDown={handleSearch}
                                            onBlur={handleBlur}
                                        />
                                    </div>

                                    {/* Faculty Filter */}
                                    <div className="relative">
                                        <select
                                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            value={selectedFaculty}
                                            onChange={handleFacultyChange}
                                        >
                                            <option value="">All Faculties</option>
                                            {facultyOptions.map(faculty => (
                                                <option key={faculty} value={faculty}>{faculty}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Clear Filters */}
                                    {(searchTerm || selectedFaculty) && (
                                        <button
                                            onClick={clearFilters}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <XMarkIcon className="h-4 w-4 mr-1" />
                                            Clear
                                        </button>
                                    )}

                                    {/* Add New Course Button */}
                                    <Link href={route('courses.create')}>
                                        <motion.button
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            whileHover={buttonVariants.hover}
                                        >
                                            <PlusIcon className="h-4 w-4 mr-1" />
                                            Add New Course
                                        </motion.button>
                                    </Link>
                                </div>
                            </div>

                            <motion.div
                                className="overflow-x-auto"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >                                {isLoading ? (
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
                            ) : courses.data.length === 0 ? (

                                <div className="flex flex-col items-center justify-center text-gray-500 mt-4">
                                    <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <div className="text-base font-medium">No courses found</div>
                                    <p className="mt-1 text-sm">Try adjusting your search or filter to find what you're looking for. Or click "Add New Course" to create one.</p>
                                </div>

                             ) : (
                                 <>
                                     {/* Mobile Cards View */}
                                     <div className="md:hidden space-y-4 px-4 py-6">
                                         {courses.data.map((course, index) => (
                                             <motion.div
                                                 key={course.id}
                                                 initial={{ opacity: 0, y: 20 }}
                                                 animate={{ opacity: 1, y: 0 }}
                                                 transition={{ duration: 0.3, delay: index * 0.05 }}
                                                 className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5 space-y-4"
                                             >
                                                 <div className="flex justify-between items-start">
                                                     <div className="min-w-0 flex-1">
                                                         <h4 className="text-base font-bold text-blue-900 leading-tight">{course.name}</h4>
                                                     </div>
                                                     <span className={`px-2 py-1 inline-flex items-center text-[10px] uppercase tracking-wider font-bold rounded-full border ${course.status
                                                         ? 'bg-green-50 border-green-200 text-green-700'
                                                         : 'bg-red-50 border-red-200 text-red-700'
                                                         }`}>
                                                         {course.status ? 'Active' : 'Inactive'}
                                                     </span>
                                                 </div>

                                                 <div className="grid grid-cols-1 gap-4 pt-3 border-t border-blue-50">
                                                     <div>
                                                         <p className="text-[10px] font-bold text-gray-400 uppercase">Faculty</p>
                                                         <p className="text-xs font-semibold text-gray-700">{course.faculty || 'N/A'}</p>
                                                     </div>
                                                 </div>

                                                 <div className="pt-4 flex items-center justify-end gap-2">
                                                     <Link
                                                         href={route('courses.show', course.id)}
                                                         className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                     >
                                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                         </svg>
                                                     </Link>
                                                     <Link
                                                         href={route('courses.edit', course.id)}
                                                         className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                                     >
                                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                         </svg>
                                                     </Link>
                                                     {isAdmin && (
                                                         <button
                                                             onClick={() => confirmDelete(course)}
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
                                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
                                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                 </tr>
                                             </thead>
                                             <tbody className="bg-white divide-y divide-gray-200">
                                                 {courses.data.map((course, index) => (
                                                     <motion.tr
                                                         key={course.id}
                                                         className="hover:bg-gray-50"
                                                         variants={itemVariants}
                                                     >
                                                         <td className="px-6 py-4 whitespace-nowrap">
                                                             <div className="text-sm font-medium text-gray-900">{course.name}</div>
                                                         </td>
                                                         <td className="px-6 py-4 whitespace-nowrap">
                                                             <div className="text-sm text-gray-500">{course.faculty}</div>
                                                         </td>
                                                         <td className="px-6 py-4 whitespace-nowrap">
                                                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                 {course.status ? 'Active' : 'Inactive'}
                                                             </span>
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
                                                                     <Dropdown.Link href={route('courses.show', course.id)} className="flex items-center text-green-600">
                                                                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                         </svg>
                                                                         View
                                                                     </Dropdown.Link>

                                                                     <Dropdown.Link href={route('courses.edit', course.id)} className="flex items-center text-indigo-600">
                                                                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                         </svg>
                                                                         Edit
                                                                     </Dropdown.Link>

                                                                     {isAdmin && (
                                                                         <button
                                                                             onClick={() => confirmDelete(course)}
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
                            </motion.div>

                            {/* Pagination */}
                            {courses.meta?.links && courses.data.length > 0 && (
                                <div className="px-6 py-4 bg-white border-t border-gray-200">
                                    <div className="flex justify-end">
                                        <Pagination links={courses.meta.links} params={params} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.div>            {/* Delete Confirmation Modal */}
            <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Delete Course
                        </Dialog.Title>
                        <div className="mt-3">
                            <p className="text-sm text-gray-600">
                                Are you sure you want to delete this course{' '}
                                <span className="font-semibold text-gray-900">
                                    "{courseToDelete?.name}"
                                </span>
                                ? This action cannot be undone.
                            </p>
                            {courseToDelete && (
                                <div className="mt-2 p-3 bg-gray-50 rounded-md text-xs">
                                    <div><span className="font-semibold">Code:</span> {courseToDelete.code}</div>
                                    <div><span className="font-semibold">Faculty:</span> {courseToDelete.faculty}</div>
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
                                onClick={deleteCourseConfirmed}
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
