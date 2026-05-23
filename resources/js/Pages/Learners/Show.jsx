import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function Show({ auth, learner }) {
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

    const buttonVariants = {
        hover: {
            scale: 1.05,
            transition: { duration: 0.2 }
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Learner Details</h2>

                </div>
            }
        >
            <Head title={`Learner: ${learner.full_name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <motion.div
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Left Column - Profile Picture and Basic Info */}
                                <motion.div
                                    className="col-span-1"
                                    variants={cardVariants}
                                    custom={0}
                                >
                                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                        <div className="flex flex-col items-center mb-6">
                                            <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200 mb-4">
                                                {learner.profile_picture ? (
                                                    <img
                                                        src={learner.profile_picture}
                                                        alt={learner.full_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-4xl font-bold">
                                                        {learner.full_name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <h2 className="text-2xl font-bold text-center">
                                                {learner.prefix ? `${learner.prefix} ` : ''}{learner.full_name}
                                            </h2>
                                            <p className="text-gray-600 text-center mt-1">{learner.name_with_initials}</p>
                                        </div>

                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="grid grid-cols-1 gap-3">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-500">Email</span>
                                                    <span className="font-medium">{learner.email}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-500">Learner Number /Reference</span>
                                                    <span className="font-medium">{learner.learner_id}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-500">Gender</span>
                                                    <span className="font-medium">{learner.gender}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-500">Date of Birth</span>
                                                    <span className="font-medium">{learner.date_of_birth}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-500">Phone Number</span>
                                                    <span className="font-medium">{learner.phone_no || 'Not provided'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Right Column - Additional Information */}
                                <motion.div
                                    className="col-span-1 md:col-span-2"
                                    variants={cardVariants}
                                    custom={1}
                                >
                                    {/* Identity Information */}
                                    <motion.div
                                        className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6"
                                        variants={itemVariants}
                                    >
                                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
                                            <h3 className="text-lg font-semibold">Identity Information</h3>
                                        </div>
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="font-medium text-gray-700">ID Type</h4>
                                                    <p>{learner.proof_type}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-700">{learner.proof_type ? `${learner.proof_type} Number` : 'ID Number'}</h4>
                                                    <p>{learner.proof_id}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Documents Information */}
                                    <motion.div
                                        className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6"
                                        variants={itemVariants}
                                    >
                                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
                                            <h3 className="text-lg font-semibold">Documents</h3>
                                        </div>
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="font-medium text-gray-700">ID Proof Document</h4>
                                                    {learner.id_proof_document ? (
                                                        <a
                                                            href={learner.id_proof_document}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center mt-2 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                            </svg>
                                                            View ID Document
                                                        </a>
                                                    ) : (
                                                        <p className="text-gray-500 italic mt-2">No document uploaded</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-700">CV/Resume</h4>
                                                    {learner.cv_document ? (
                                                        <a
                                                            href={learner.cv_document}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center mt-2 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                            </svg>
                                                            View CV/Resume
                                                        </a>
                                                    ) : (
                                                        <p className="text-gray-500 italic mt-2">No document uploaded</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Address Information */}
                                    <motion.div
                                        className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6"
                                        variants={itemVariants}
                                    >
                                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
                                            <h3 className="text-lg font-semibold">Address Information</h3>
                                        </div>
                                        <div className="p-6">
                                            <div className="mb-4">
                                                <h4 className="font-medium text-gray-700">Full Address</h4>
                                                <p className="text-gray-800 mt-1">{learner.full_address || 'No address provided'}</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                <div>
                                                    <h4 className="font-medium text-gray-700">City</h4>
                                                    <p>{learner.city || 'Not provided'}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-700">State/Province</h4>
                                                    <p>{learner.state || 'Not provided'}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-700">Postal/ZIP Code</h4>
                                                    <p>{learner.postal_code || 'Not provided'}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-700">Nationality</h4>
                                                    <p>{learner.nationality || 'Not provided'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Registration Information */}
                                    <motion.div
                                        className="bg-white border border-gray-200 rounded-lg shadow-sm"
                                        variants={itemVariants}
                                    >
                                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
                                            <h3 className="text-lg font-semibold">Registration Information</h3>
                                        </div>
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="font-medium text-gray-700">Created At</h4>
                                                    <p>{learner.created_at}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-700">Last Updated</h4>
                                                    <p>{learner.updated_at}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>

                            <div className="flex justify-end mt-6 gap-2">
                                <Link href={route('learners.index')} className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150">
                                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                                    Back to Learners
                                </Link>

                                <Link href={route('learners.edit', learner.id)} className='inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150'>

                                    <PencilIcon className="h-5 w-5 mr-2" />
                                    Edit
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
