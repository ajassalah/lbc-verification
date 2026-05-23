import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, EllipsisVerticalIcon, PencilIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Dropdown from '@/Components/Dropdown';
import EditModuleDialog from './Components/EditModuleDialog';
import DeleteConfirmationDialog from './Components/DeleteConfirmationDialog';

export default function Show({ auth, course, moduleStats, moduleLevelOptions = [] }) {
    // State for module dialogs
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState(null);
    const isAdmin = auth.user?.role === 'admin';

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

    const formatDuration = (duration) => {
        if (!duration) {
            return 'N/A';
        }

        return `${duration} ${Number(duration) === 1 ? 'month' : 'months'}`;
    };

    // Handle edit module
    const handleEditModule = (module) => {
        setSelectedModule(module);
        setIsEditDialogOpen(true);
    };

    // Handle delete module
    const handleDeleteModule = (module) => {
        setSelectedModule(module);
        setIsDeleteDialogOpen(true);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Course Details</h2>}
        >
            <Head title={`${course.name} - Course Details`} />

            <motion.div
                className="py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">


                    <motion.div
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <div className="p-6">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >                                <motion.div variants={itemVariants} className="col-span-2 flex flex-col md:flex-row md:items-start gap-6">
                                    <div className="w-full">
                                        <h2 className="text-2xl font-bold text-gray-800">{course.name}</h2>
                                        <div className="flex space-x-2 mt-2">
                                            <span className={`px-3 py-1 ${course.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} rounded-full text-sm`}>
                                                {course.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>



                                <motion.div variants={itemVariants}>
                                    <h3 className="text-sm font-semibold text-gray-500">Faculty</h3>
                                    <p className="mt-1 text-gray-800">{course.faculty}</p>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <h3 className="text-sm font-semibold text-gray-500">Course Code</h3>
                                    <p className="mt-1 text-gray-800">{course.code || 'N/A'}</p>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <h3 className="text-sm font-semibold text-gray-500">Course Duration</h3>
                                    <p className="mt-1 text-gray-800">{formatDuration(course.duration)}</p>
                                </motion.div>

                            </motion.div>
                        </div>
                    </motion.div>                    {/* Modules Section */}
                    <motion.div
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                    >
                        <div className="p-6">                            <div className="border-b pb-4 mb-6">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold">Course Modules</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        This course contains {moduleStats?.total || course.modules?.length || 0} module{(moduleStats?.total || course.modules?.length) === 1 ? '' : 's'}
                                        .
                                    </p>
                                    {(moduleStats?.units?.length > 0 || moduleStats?.years?.length > 0) && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {moduleStats?.units?.length > 0 && (
                                                <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                                                    Units: {moduleStats.units.join(', ')}
                                                </div>
                                            )}
                                            {moduleStats?.years?.length > 0 && (
                                                <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                                                    Years: {moduleStats.years.join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        {moduleStats?.total || course.modules?.length || 0} Total
                                    </span>
                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {moduleStats?.active || 0} Active
                                    </span>

                                </div>
                            </div>
                        </div>

                            {course.modules && course.modules.length > 0 ? (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="overflow-x-auto"
                                >                                    <table className="min-w-full divide-y divide-gray-200 border-collapse rounded overflow-hidden">
                                        <thead>
                                            <tr className="bg-blue-50">
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                                                    Unit Reference
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                                                    Units
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {course.modules.map((module, index) => (<motion.tr
                                                key={module.id}
                                                variants={itemVariants}
                                                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-blue-50'}
                                                whileHover={{
                                                    backgroundColor: 'rgba(239, 246, 255, 0.6)',
                                                    transition: { duration: 0.2 }
                                                }}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                    {module.code}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {module.level || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {module.name || 'Unnamed Module'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="flex justify-center">
                                                        <Dropdown>
                                                            <Dropdown.Trigger>
                                                                <button
                                                                    type="button"
                                                                    className="rounded-full p-1 text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700"
                                                                    title="Module actions"
                                                                >
                                                                    <EllipsisVerticalIcon className="h-5 w-5" />
                                                                </button>
                                                            </Dropdown.Trigger>
                                                            <Dropdown.Content width="48" align="right">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleEditModule(module)}
                                                                    className="flex w-full items-center px-4 py-2 text-left text-sm text-blue-600 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                                                >
                                                                    <PencilIcon className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </button>
                                                                {isAdmin && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDeleteModule(module)}
                                                                        className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                                                    >
                                                                        <TrashIcon className="mr-2 h-4 w-4" />
                                                                        Delete
                                                                    </button>
                                                                )}
                                                            </Dropdown.Content>
                                                        </Dropdown>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </motion.div>
                            ) : (
                                <motion.div
                                    variants={itemVariants}
                                    className="text-center py-8"
                                >
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                        <div className="text-base font-medium">No modules available</div>
                                        <p className="mt-1 text-sm">This course doesn't have any modules yet.</p>
                                    </div>                                </motion.div>
                            )}

                            <div className="mt-6 flex justify-end gap-4">
                                <Link href={route('courses.index')}>
                                    <motion.button

                                        className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                        whileHover={buttonVariants.hover}
                                    >
                                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                                        Back to Courses
                                    </motion.button>
                                </Link>
                                <Link href={route('courses.edit', course.id)}>
                                    <motion.button
                                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                        whileHover={buttonVariants.hover}
                                    >
                                        <PencilSquareIcon className="h-4 w-4 mr-1" />
                                        Edit Course
                                    </motion.button>
                                </Link>
                            </div>

                        </div>



                    </motion.div>

                </div>
            </motion.div >

            {/* Module edit dialog */}
            < EditModuleDialog
                isOpen={isEditDialogOpen}
                setIsOpen={setIsEditDialogOpen}
                module={selectedModule}
                courseId={course.id}
                levelOptions={moduleLevelOptions}
            />

            {/* Module delete confirmation dialog */}
            < DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
                module={selectedModule}
            />
        </AuthenticatedLayout >
    );
}
