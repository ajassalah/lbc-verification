import React from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { motion } from 'framer-motion';
import ModuleCard from './Components/ModuleCard';
import { PlusCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Edit({ auth, course, facultyOptions, moduleLevelOptions = [] }) {
    const isAdmin = auth.user?.role === 'admin';

    const { data, setData, post, processing, errors } = useForm({
        name: course.name || '',
        code: course.code || '',
        slug: course.slug || '',
        faculty: course.faculty || '',
        duration: course.duration || '',
        status: course.status,
        modules: course.modules || [],
        _method: 'PUT'
    }, { forceFormData: true });



    const handleChange = (field, value) => {
        setData(field, value);
    };
    const addModule = () => {
        const newModule = {
            name: '',
            code: '',
            level: '',
        };

        setData('modules', [...data.modules, newModule]);
    };

    // Update a module in the modules array
    const updateModule = (index, updatedModule) => {
        const updatedModules = [...data.modules];
        updatedModules[index] = updatedModule;
        setData('modules', updatedModules);
    };

    // Remove a module from the modules array
    const removeModule = (index) => {
        const updatedModules = [...data.modules];
        updatedModules.splice(index, 1);
        setData('modules', updatedModules);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('courses.update', course.id));
    };

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
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3, delay: 0.3 }
        },
        hover: {
            scale: 1.05,
            transition: { duration: 0.2 }
        }
    };

    const moduleContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl leading-tight">Edit Course</h2>}>

            <Head title="Edit Course" />
            <motion.div
                className="py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link href={route('courses.show', course.id)}>
                            <motion.button
                                className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-800 uppercase tracking-widest hover:bg-gray-300 focus:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                whileHover={buttonVariants.hover}
                            >
                                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                                Back to Course Details
                            </motion.button>
                        </Link>
                    </div>

                    <motion.div
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <form onSubmit={handleSubmit}>
                            <motion.div
                                className="space-y-6"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >                                <h3 className="text-lg font-semibold border-b pb-2">Course Details</h3>

                                {/* Course Name */}
                                <div className="grid grid-cols-1 gap-6">
                                    <motion.div variants={itemVariants}>
                                        <InputLabel htmlFor="name" value="Course Name" />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            className="mt-1 block w-full"
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </motion.div>
                                </div>                                {/* Course Code and Faculty */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div variants={itemVariants}>
                                        <InputLabel htmlFor="code" value="Course Code" />
                                        <TextInput
                                            id="code"
                                            type="text"
                                            name="code"
                                            value={data.code}
                                            className="mt-1 block w-full"
                                            onChange={(e) => handleChange('code', e.target.value)}
                                        />
                                        <InputError message={errors.code} className="mt-2" />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <InputLabel htmlFor="faculty" value="Faculty" />
                                        <select
                                            id="faculty"
                                            name="faculty"
                                            value={data.faculty}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            onChange={(e) => setData('faculty', e.target.value)}
                                        >
                                            <option value="">Select Faculty</option>
                                            {facultyOptions.map((faculty, index) => (
                                                <option key={index} value={faculty}>{faculty}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.faculty} className="mt-2" />
                                    </motion.div>
                                </div>

                                {/* Course Duration */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <motion.div variants={itemVariants}>
                                        <InputLabel htmlFor="duration" value="Course Duration" />
                                        <TextInput
                                            id="duration"
                                            type="number"
                                            name="duration"
                                            min="1"
                                            value={data.duration}
                                            className="mt-1 block w-full"
                                            onChange={(e) => handleChange('duration', e.target.value)}
                                            placeholder="Months"
                                        />
                                        <InputError message={errors.duration} className="mt-2" />
                                    </motion.div>
                                </div>

                                {/* Modules Section */}
                                <motion.div variants={containerVariants} className="mt-10">
                                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                                        <h3 className="text-lg font-semibold">Course Modules</h3>
                                    </div>

                                    <motion.div variants={moduleContainerVariants}>
                                        {data.modules.map((module, index) => (
                                            <ModuleCard
                                                key={module.id || index}
                                                index={index}
                                                module={module}
                                                updateModule={updateModule}
                                                removeModule={removeModule}
                                                errors={errors}
                                                levelOptions={moduleLevelOptions}
                                                canRemove={isAdmin}
                                            />
                                        ))}

                                        {data.modules.length === 0 && (
                                            <motion.div
                                                className="text-center py-8 text-gray-500 border border-dashed rounded-lg"
                                                variants={itemVariants}
                                            >
                                                No modules added yet. Click "Add Module" to add one.
                                            </motion.div>
                                        )}
                                    </motion.div>

                                    <div className="mt-4 flex justify-center">
                                        <motion.button
                                            type="button"
                                            className="flex items-center bg-indigo-50 text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors"
                                            onClick={addModule}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <PlusCircleIcon className="w-5 h-5 mr-1" />
                                            Add Module
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Buttons - Full Width */}
                            <motion.div
                                className="flex items-center justify-end mt-8 space-x-3"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <Link href={route('courses.show', course.id)}>
                                    <motion.div
                                        variants={buttonVariants}
                                        whileHover="hover"
                                    >
                                        <SecondaryButton type="button">
                                            Cancel
                                        </SecondaryButton>
                                    </motion.div>
                                </Link>
                                <motion.div
                                    variants={buttonVariants}
                                    whileHover="hover"
                                >
                                    <PrimaryButton
                                        type="submit"
                                        className="ml-4"
                                        disabled={processing}
                                    >
                                        Update Course
                                    </PrimaryButton>
                                </motion.div>
                            </motion.div>
                        </form>
                    </motion.div>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
