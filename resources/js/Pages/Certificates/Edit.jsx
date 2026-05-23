import React, { useState, useEffect } from "react";
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { motion } from 'framer-motion';
import axios from 'axios';

const normalizeModulesData = (value) => {
    let parsed = value;

    for (let index = 0; index < 2 && typeof parsed === 'string'; index += 1) {
        try {
            parsed = JSON.parse(parsed);
        } catch (error) {
            return { years: [] };
        }
    }

    if (!parsed || typeof parsed !== 'object') {
        return { years: [] };
    }

    const years = Array.isArray(parsed.years) ? parsed.years : [];

    return {
        ...parsed,
        years: years.map((year) => ({
            ...year,
            modules: Array.isArray(year.modules) ? year.modules : [],
        })),
    };
};

export default function Edit({ auth, certificate, courses, learners, centers = [] }) {

    const courseOptions = Array.isArray(courses) ? courses : (courses?.data || []);
    const learnerOptions = Array.isArray(learners) ? learners : (learners?.data || []);
    const centerOptions = Array.isArray(centers) ? centers : (centers?.data || []);
    const initialCourse = courseOptions.find(c => c.id === certificate.course_id) || null;
    const [selectedCourse, setSelectedCourse] = useState(initialCourse);
    const [modulesByYear, setModulesByYear] = useState({});
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        learner_id: certificate ? certificate.learner_id : '',
        course_id: certificate ? certificate.course_id : '',
        reference_no: certificate ? certificate.reference_no : '',
        course_start_date: certificate ? certificate.course_start_date : '',
        course_end_date: certificate ? certificate.course_end_date : '',
        awarding_date: certificate ? certificate.awarding_date : '',
        specialization: certificate ? certificate.specialization : '',
        center_name: certificate ? certificate.center_name : '',
        status: certificate ? certificate.status : 'Pending',
        cumulative_credits_earned: certificate ? certificate.cumulative_credits_earned : 0,
        cumulative_grade_point_average: certificate ? parseFloat(certificate.cumulative_grade_point_average || 0) : 0,
        modules_data: JSON.stringify(normalizeModulesData(certificate?.modules_data))
    });

    // Load modules when component mounts or course changes
    useEffect(() => {
        if (data.course_id) {
            loadModulesForCourse(data.course_id);
        } else {
            setModulesByYear({});
            setYears([]);
        }
    }, [data.course_id]);

    // Function to load modules for a course
    const loadModulesForCourse = (courseId) => {
        setLoading(true);

        axios.get(route('modules.byCourse', courseId))
            .then(response => {
                const modules = response.data;

                // Group modules by year
                const moduleGroups = {};
                const yearsList = [];

                modules.forEach(module => {
                    if (!moduleGroups[module.year]) {
                        moduleGroups[module.year] = [];
                        yearsList.push(module.year);
                    }
                    moduleGroups[module.year].push({
                        ...module,
                        grade: '',
                    });
                });

                // Sort years
                yearsList.sort((a, b) => a - b);

                setYears(yearsList);
                setModulesByYear(moduleGroups);

                // Find the selected course
                const course = courseOptions.find(c => c.id === parseInt(courseId));
                setSelectedCourse(course);

                // If we have existing module data, use it, otherwise initialize new data
                if (certificate && certificate.modules_data) {
                    try {
                        const existingData = normalizeModulesData(certificate.modules_data);

                        initializeNewModulesData(yearsList, moduleGroups, existingData);
                    } catch (e) {
                        initializeNewModulesData(yearsList, moduleGroups);
                    }
                } else {
                    initializeNewModulesData(yearsList, moduleGroups);
                }
            })
            .catch(error => {
                console.error('Error fetching modules:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const initializeNewModulesData = (yearsList, moduleGroups, existingData = null) => {
        const initialModulesData = {
            years: yearsList.map(year => ({
                year: year,
                total_credits: moduleGroups[year]?.reduce((total, module) => total + (parseInt(module.credit_count, 10) || 0), 0) || 0,
                total_modules_count: moduleGroups[year]?.length || 0,
                grading_type: 'Pending',
                gpa: 0,
                modules: moduleGroups[year]?.map(module => {
                    const existingYear = existingData?.years?.find((yearData) => String(yearData.year) === String(year));
                    const existingModule = existingYear?.modules?.find((savedModule) => savedModule.id === module.id);

                    return {
                        id: module.id,
                        code: module.code,
                        name: module.name,
                        level: existingModule?.level || module.level || '',
                        units: existingModule?.units ?? module.unit_count,
                        credits: existingModule?.credits ?? module.credit_count,
                        grade: existingModule?.grade || ''
                    };
                }) || []
            }))
        };

        initialModulesData.years.forEach((yearData, yearIndex) => {
            calculateYearStats(initialModulesData, yearIndex);
        });

        setData('modules_data', JSON.stringify(initialModulesData));
        calculateCumulativeStats(initialModulesData);
    };

    const updateModuleGrade = (yearIndex, moduleIndex, grade) => {
        const modulesData = normalizeModulesData(data.modules_data);
        modulesData.years[yearIndex].modules[moduleIndex].grade = grade;

        // Recalculate year totals and grading result
        calculateYearStats(modulesData, yearIndex);

        // First update the modules data
        setData(data => ({
            ...data,
            modules_data: JSON.stringify(modulesData)
        }));

        // Then recalculate cumulative stats (this needs to happen after modules_data is updated)
        calculateCumulativeStats(modulesData);
    };

    const getGradingType = (modules = []) => {
        if (!modules.length) {
            return 'Pending';
        }

        if (modules.some((module) => module.grade === 'FAIL')) {
            return 'FAIL';
        }

        if (modules.every((module) => module.grade === 'PASS')) {
            return 'PASS';
        }

        return 'Pending';
    };

    const calculateYearStats = (modulesData, yearIndex) => {
        const yearData = modulesData.years[yearIndex];
        yearData.total_credits = yearData.modules.reduce(
            (total, module) => total + (parseInt(module.credits, 10) || 0),
            0
        );
        yearData.total_modules_count = yearData.modules.length;
        yearData.grading_type = getGradingType(yearData.modules);
        yearData.gpa = 0;
    };

    const calculateCumulativeStats = (modulesData) => {
        const allModules = normalizeModulesData(modulesData).years.flatMap((year) => year.modules || []);
        const totalCredits = allModules.reduce(
            (total, module) => total + (parseInt(module.credits, 10) || 0),
            0
        );
        const gradingType = getGradingType(allModules);

        // Update the form data
        setData(data => ({
            ...data,
            cumulative_credits_earned: totalCredits,
            cumulative_grade_point_average: gradingType === 'PASS' ? 1 : 0
        }));
    };

    const submit = e => {
        e.preventDefault();

        // Parse current modules data
        const modulesData = normalizeModulesData(data.modules_data);

        // Recalculate all year stats to ensure they're up to date
        modulesData.years.forEach((year, index) => {
            calculateYearStats(modulesData, index);
        });

        // Recalculate cumulative stats based on the updated year stats
        calculateCumulativeStats(modulesData);

        // Update modules data in form state
        setData('modules_data', JSON.stringify(modulesData));

        // Submit the form
        put(route('certificates.update', certificate.id), {
            preserveScroll: true,
        });
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

    const parsedModulesData = (() => {
        try {
            return normalizeModulesData(data.modules_data);
        } catch (error) {
            return { years: [] };
        }
    })();

    const cumulativeGradingType = getGradingType(
        parsedModulesData.years.flatMap((year) => year.modules || [])
    );
    const modulesForDisplay = parsedModulesData.years.flatMap((year, yearIndex) =>
        (year.modules || []).map((module, moduleIndex) => ({
            ...module,
            yearIndex,
            moduleIndex,
        }))
    );
    const totalModuleCredits = modulesForDisplay.reduce(
        (total, module) => total + (parseInt(module.credits, 10) || parseInt(module.credit_count, 10) || 0),
        0
    );
    const hasSelectedCenter = centerOptions.some((center) => center.name === data.center_name);

    const formatLevelValue = (level) => {
        if (level === null || level === undefined || level === '') {
            return 'N/A';
        }

        return String(level).replace(/^Level\s*/i, '').trim() || 'N/A';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <h2 className="font-semibold text-xl leading-tight">Edit Certificate</h2>
                </div>
            }
        >
            <Head title="Edit Certificate" />
            <motion.div
                className="py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <motion.div
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <form onSubmit={submit}>
                            <motion.div
                                className="space-y-6"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {/* Certificate Basic Information */}
                                <h3 className="font-medium text-lg text-gray-700">Certificate Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div variants={itemVariants}>
                                        <InputLabel htmlFor="reference_no" value="Certificate/Reference Number" />
                                        <TextInput
                                            id="reference_no"
                                            name="reference_no"
                                            value={data.reference_no}
                                            onChange={(e) => setData('reference_no', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.reference_no} className="mt-2" />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <InputLabel htmlFor="center_name" value="Center Name" />
                                        <select
                                            id="center_name"
                                            name="center_name"
                                            value={data.center_name}
                                            onChange={(e) => setData('center_name', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="">Select Center</option>
                                            {!hasSelectedCenter && data.center_name && (
                                                <option value={data.center_name}>{data.center_name}</option>
                                            )}
                                            {centerOptions.map((center) => (
                                                <option key={center.id} value={center.name}>
                                                    {`${center.name} (${center.number})`}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.center_name} className="mt-2" />
                                    </motion.div>
                                </div>

                                {/* Learner Selection */}
                                <motion.div variants={itemVariants}>
                                    <InputLabel htmlFor="learner_id" value="Select Learner" />
                                    <select
                                        id="learner_id"
                                        name="learner_id"
                                        value={data.learner_id}
                                        onChange={(e) => setData('learner_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">Select Learner</option>
                                        {learnerOptions.map(learner => (
                                            <option key={learner.id} value={learner.id}>
                                                {learner.full_name} ({learner.learner_id})
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.learner_id} className="mt-2" />
                                </motion.div>

                                {/* Course Selection */}
                                <motion.div variants={itemVariants}>
                                    <InputLabel htmlFor="course_id" value="Select Course" />
                                    <select
                                        id="course_id"
                                        name="course_id"
                                        value={data.course_id}
                                        onChange={(e) => setData('course_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">Select Course</option>
                                        {courseOptions.map(course => (
                                            <option key={course.id} value={course.id}>
                                                {course.name} ({course.code})
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.course_id} className="mt-2" />
                                </motion.div>
                                {/* Status Selection */}
                                <motion.div variants={itemVariants}>
                                    <InputLabel htmlFor="status" value="Status" />
                                    <select
                                        id="status"
                                        name="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Verified">Verified</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <InputLabel htmlFor="awarding_date" value="Awarding Date" />
                                    <TextInput
                                        id="awarding_date"
                                        name="awarding_date"
                                        type="date"
                                        value={data.awarding_date}
                                        onChange={(e) => setData('awarding_date', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.awarding_date} className="mt-2" />
                                </motion.div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div variants={itemVariants}>
                                        <InputLabel htmlFor="course_start_date" value="Course Start Date" />
                                        <TextInput
                                            id="course_start_date"
                                            name="course_start_date"
                                            type="date"
                                            value={data.course_start_date || ''}
                                            onChange={(e) => setData('course_start_date', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.course_start_date} className="mt-2" />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <InputLabel htmlFor="course_end_date" value="Course End Date" />
                                        <TextInput
                                            id="course_end_date"
                                            name="course_end_date"
                                            type="date"
                                            value={data.course_end_date || ''}
                                            onChange={(e) => setData('course_end_date', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.course_end_date} className="mt-2" />
                                    </motion.div>
                                </div>

                                {/* Module Information */}
                                {loading ? (
                                    <div className="text-center py-4">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                                        <p className="mt-2 text-gray-600">Loading modules...</p>
                                    </div>
                                ) : selectedCourse && modulesForDisplay.length > 0 ? (
                                    <motion.div
                                        variants={itemVariants}
                                        className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                                    >
                                        <h3 className="font-medium text-lg text-gray-700 mb-4">Module Information</h3>

                                        <div className="border rounded-lg p-4 bg-white">
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Ref</th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module Name</th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {modulesForDisplay.map((module) => (
                                                            <tr key={`${module.yearIndex}-${module.id}`}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{module.code}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{module.name}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatLevelValue(module.level)}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{module.credits || module.credit_count || 0}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    <select
                                                                        value={parsedModulesData.years[module.yearIndex]?.modules[module.moduleIndex]?.grade || ''}
                                                                        onChange={(e) => updateModuleGrade(module.yearIndex, module.moduleIndex, e.target.value)}
                                                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                                    >
                                                                        <option value="">Select Grade</option>
                                                                        <option value="PASS">PASS</option>
                                                                        <option value="FAIL">FAIL</option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="mt-4 bg-gray-50 p-3 rounded-md">
                                                <div className="text-sm text-gray-700">
                                                    <p><strong>Total Modules:</strong> {modulesForDisplay.length}</p>
                                                    <p><strong>Total Credits:</strong> {totalModuleCredits}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <h4 className="font-medium text-blue-700 mb-2">Cumulative Statistics</h4>
                                            <p><strong>TOTAL CREDIT ACHIEVED:</strong> {data.cumulative_credits_earned}</p>
                                            <p><strong>GRADING TYPE:</strong> {cumulativeGradingType}</p>
                                        </div>
                                    </motion.div>
                                ) : null}

                                <motion.div className="flex justify-end items-center mt-8 gap-4" >

                                    <Link href={route('certificates.index')}>
                                        <motion.div type="button" variants={buttonVariants} whileHover="hover" >
                                            <SecondaryButton type="button">

                                                Cancel
                                            </SecondaryButton>
                                        </motion.div>
                                    </Link>
                                    <motion.div variants={buttonVariants} whileHover="hover"                                    >
                                        <PrimaryButton disabled={processing}>

                                            Update Certificate
                                        </PrimaryButton>
                                    </motion.div>

                                </motion.div>
                            </motion.div>
                        </form>
                    </motion.div>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
