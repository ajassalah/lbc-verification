import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";

// Define proof type text mapping
const PROOF_TYPE_TEXT = {
    Passport: "Passport",
    Nic: "ID Number",
    Driving_license: "Driving License",
    Aadhar: "Aadhar Card",
    Pan: "PAN Card",
    Voter: "Voter ID"
};

// Helper component for certificate details - with improved styling
const CertificateDetail = ({ label, value, capitalize = false, uppercase = false, delay = 0 }) => {
    const valueClass = `${capitalize ? 'capitalize' : ''} ${uppercase ? 'uppercase' : ''}`;

    return (
        <motion.div
            className="mb-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay }}
        >
            <span className="block text-sm text-blue-600 font-medium mb-1">
                {label}
            </span>
            <span className={`block font-semibold text-gray-800 ${valueClass}`}>
                {value || "N/A"}
            </span>
        </motion.div>
    );
};

export default function Show({ auth, certificate, user }) {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("details");

    // Animation effect on component mount
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        }
    };

    const sectionVariants = {
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

    // Helper function to get status badge color
    const getStatusColor = (status) => {
        status = status.toLowerCase();
        if (status === 'verified') return 'bg-green-100 text-green-800 border-green-200';
        if (status === 'pending') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-gray-100 text-gray-800 border-gray-200';
    };

    // Define the tab button styles
    const tabButtonStyle = (tabName) => {
        const baseStyle = "px-4 py-2 font-medium text-sm rounded-md focus:outline-none transition-all duration-200";
        const activeStyle = "bg-blue-600 text-white shadow-md";
        const inactiveStyle = "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200";

        return `${baseStyle} ${activeTab === tabName ? activeStyle : inactiveStyle}`;
    };

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Parse modules data if available
    const parseModuleData = () => {
        try {
            if (!certificate.modules_data) return { years: [] };

            let data = certificate.modules_data;

            for (let index = 0; index < 2 && typeof data === 'string'; index += 1) {
                data = JSON.parse(data);
            }

            if (!data || typeof data !== "object") {
                return { years: [] };
            }

            return {
                ...data,
                years: Array.isArray(data.years) ? data.years : [],
            };
        } catch (error) {
            return { years: [] };
        }
    };

    const moduleData = parseModuleData();

    // Extract all modules from all years for calculations
    const allModules = moduleData.years
        ? moduleData.years.flatMap(year => year.modules || [])
        : [];

    const getGradingType = (modules = []) => {
        if (!modules.length) return "Pending";
        if (modules.some((module) => module.grade === "FAIL")) return "FAIL";
        if (modules.every((module) => module.grade === "PASS")) return "PASS";
        return "Pending";
    };

    const getGradeColor = (grade) => {
        if (!grade) return "text-gray-500";
        if (grade === "PASS") return "text-green-600 font-semibold";
        if (grade === "FAIL") return "text-red-600 font-semibold";
        return "text-gray-700";
    };

    const formatLevelValue = (level) => {
        if (level === null || level === undefined || level === "") {
            return "N/A";
        }

        return String(level).replace(/^Level\s*/i, "").trim() || "N/A";
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h2 className="font-semibold text-xl leading-tight">
                        Certificate Details
                    </h2>
                </div>
            }
        >
            <Head title="Certificate Details" />
            <div className="py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white overflow-hidden shadow-sm rounded-lg"
                    >
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="mt-2">
                                <div className="rounded-lg">
                                    <div className="flex flex-col gap-6">
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.6 }}
                                            className="text-center"
                                        >
                                            <h1 className="text-2xl font-bold text-blue-800 mb-2">
                                                Certificate Details
                                            </h1>
                                            <p className="text-md text-gray-600 flex items-center justify-center">
                                                <span className="font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                                    {certificate.reference_no}
                                                </span>
                                            </p>
                                            <div className="w-24 h-1 bg-blue-600 mx-auto my-4"></div>
                                        </motion.div>

                                        {/* Certificate Status Card with enhanced design */}
                                        <motion.div
                                            className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: 0.2 }}
                                            whileHover={{
                                                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
                                                transition: { duration: 0.2 }
                                            }}
                                        >
                                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                                <div>
                                                    <div className="flex items-center">
                                                        <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                                        </svg>
                                                        <h2 className="text-xl font-bold text-gray-800">
                                                            Registration: <span className="text-blue-700">{certificate.learner?.learner_id}</span>
                                                        </h2>
                                                    </div>
                                                    <p className="text-gray-600 mt-1 ml-8">
                                                        {certificate.course?.name}
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(certificate.status)} border`}>
                                                        {certificate.status === "verified" ? (
                                                            <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        )}
                                                        {certificate.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Tab navigation */}
                                        <div className="flex justify-center mb-4">
                                            <div className="inline-flex rounded-md shadow-sm p-1 bg-gray-50" role="group">
                                                <button
                                                    className={tabButtonStyle("details")}
                                                    onClick={() => setActiveTab("details")}
                                                >
                                                    <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    Learner Details
                                                </button>
                                                <button
                                                    className={tabButtonStyle("academic")}
                                                    onClick={() => setActiveTab("academic")}
                                                >
                                                    <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                                    </svg>
                                                    Academic Info
                                                </button>
                                                <button
                                                    className={tabButtonStyle("modules")}
                                                    onClick={() => setActiveTab("modules")}
                                                >
                                                    <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                    Modules
                                                </button>
                                                <button
                                                    className={tabButtonStyle("meta")}
                                                    onClick={() => setActiveTab("meta")}
                                                >
                                                    <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Meta Info
                                                </button>
                                            </div>
                                        </div>

                                        {activeTab === "details" && (
                                            <motion.div
                                                className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: 0.4 }}
                                                whileHover={{
                                                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                                                    transition: { duration: 0.2 }
                                                }}
                                            >
                                                <h3 className="text-lg font-semibold text-blue-800 mb-4 pb-2 border-b border-blue-200 flex items-center">
                                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    Learner Information
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <CertificateDetail
                                                        label="Learner ID"
                                                        value={certificate.learner?.learner_id}
                                                        delay={0.5}
                                                    />
                                                    <CertificateDetail
                                                        label="Full Name"
                                                        value={certificate.learner?.full_name}
                                                        capitalize={true}
                                                        delay={0.6}
                                                    />
                                                    <CertificateDetail
                                                        label="Gender"
                                                        value={certificate.gender || certificate.learner?.gender}
                                                        capitalize={true}
                                                        delay={0.7}
                                                    />
                                                    <CertificateDetail
                                                        label="Email"
                                                        value={certificate.learner?.email}
                                                        delay={0.8}
                                                    />
                                                    <CertificateDetail
                                                        label="Phone Number"
                                                        value={certificate.learner?.phone_no}
                                                        delay={0.9}
                                                    />
                                                    <CertificateDetail
                                                        label="Date of Birth"
                                                        value={certificate.learner?.date_of_birth ? formatDate(certificate.learner.date_of_birth) : "N/A"}
                                                        delay={1.0}
                                                    />
                                                    <CertificateDetail
                                                        label="Country"
                                                        value={certificate.country || certificate.learner?.country}
                                                        delay={1.1}
                                                    />
                                                    <CertificateDetail
                                                        label="Address"
                                                        value={certificate.learner?.full_address}
                                                        delay={1.2}
                                                    />
                                                    {certificate.learner?.proof_type && (
                                                        <CertificateDetail
                                                            label="Identification"
                                                            value={`${PROOF_TYPE_TEXT[certificate.learner.proof_type] || certificate.learner.proof_type}: ${certificate.learner.proof_id}`}
                                                            delay={1.3}
                                                        />
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}

                                        {activeTab === "academic" && (
                                            <motion.div
                                                className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: 0.4 }}
                                                whileHover={{
                                                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                                                    transition: { duration: 0.2 }
                                                }}
                                            >
                                                <h3 className="text-lg font-semibold text-blue-800 mb-4 pb-2 border-b border-blue-200 flex items-center">
                                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                                    </svg>
                                                    Academic Information
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <CertificateDetail
                                                        label="Reference No"
                                                        value={certificate.reference_no}
                                                        delay={0.5}
                                                    />
                                                    <CertificateDetail
                                                        label="Course"
                                                        value={certificate.course?.name}
                                                        delay={0.6}
                                                    />
                                                    <CertificateDetail
                                                        label="Course Code"
                                                        value={certificate.course?.code}
                                                        delay={0.7}
                                                    />
                                                    <CertificateDetail
                                                        label="Course Duration"
                                                        value={certificate.course?.duration ? `${certificate.course.duration} months` : "N/A"}
                                                        delay={0.8}
                                                    />
                                                    <CertificateDetail
                                                        label="Awarding Date"
                                                        value={formatDate(certificate.awarding_date)}
                                                        delay={0.9}
                                                    />
                                                    <CertificateDetail
                                                        label="Course Start Date"
                                                        value={formatDate(certificate.course_start_date)}
                                                        delay={1.0}
                                                    />
                                                    <CertificateDetail
                                                        label="Course End Date"
                                                        value={formatDate(certificate.course_end_date)}
                                                        delay={1.1}
                                                    />
                                                    <CertificateDetail
                                                        label="Center"
                                                        value={certificate.center_name}
                                                        delay={1.0}
                                                    />

                                                    {/* Academic performance metrics box */}
                                                    <div className="md:col-span-2">
                                                        <h4 className="text-sm font-medium text-blue-700 mb-3">Academic Performance</h4>
                                                        <div className="bg-blue-50 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div>
                                                                <span className="text-sm text-gray-500">Credits Earned</span>
                                                                <div className="text-2xl font-bold text-gray-800">
                                                                    {certificate.cumulative_credits_earned || "N/A"}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-gray-500">Grading Type</span>
                                                                <div className="text-2xl font-bold text-gray-800">
                                                                    {getGradingType(allModules)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                        {activeTab === "modules" && (
                                            <motion.div
                                                className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: 0.4 }}
                                                whileHover={{
                                                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                                                    transition: { duration: 0.2 }
                                                }}
                                            >
                                                <h3 className="text-lg font-semibold text-blue-800 mb-4 pb-2 border-b border-blue-200 flex items-center">
                                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                    Course Modules
                                                </h3>

                                                {moduleData.years && moduleData.years.length > 0 ? (
                                                    <>
                                                        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                                                            <div className="flex items-center mb-2">
                                                                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <h4 className="text-sm font-semibold text-blue-700">Program Summary</h4>
                                                            </div>
                                                            <p className="text-sm text-gray-700">
                                                                This certificate includes a total of {allModules.length} modules.
                                                                {allModules.reduce((total, module) => total + (parseInt(module.credits) || 0), 0) > 0 &&
                                                                    ` Total credits: ${allModules.reduce((total, module) => total + (parseInt(module.credits) || 0), 0)}.`
                                                                }
                                                            </p>
                                                        </div>

                                                        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 mb-4">
                                                            <table className="min-w-full divide-y divide-gray-200">
                                                                <thead className="bg-gray-50">
                                                                    <tr>
                                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Unit Ref
                                                                        </th>
                                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Module Name
                                                                        </th>
                                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Level
                                                                        </th>
                                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Credits
                                                                        </th>
                                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Grade
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="bg-white divide-y divide-gray-200">
                                                                    {allModules.map((module, index) => (
                                                                        <tr key={module.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                                {module.code}
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">
                                                                                {module.name}
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                                {formatLevelValue(module.level)}
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                                {module.credits || "N/A"}
                                                                            </td>
                                                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${getGradeColor(module.grade)}`}>
                                                                                {module.grade || "N/A"}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 italic">
                                                            Note: Module information is provided by the course administrator.
                                                            Please contact the institution for any clarification on modules or grades.
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                                        <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                        </svg>
                                                        <p className="mt-2 text-gray-600">No module data is available for this certificate.</p>
                                                        <div className="mt-4">
                                                            <Link
                                                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                                                href={route("certificates.edit", certificate.id)}
                                                            >
                                                                Add module data in the certificate editor
                                                            </Link>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}

                                        {activeTab === "meta" && (
                                            <motion.div
                                                className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: 0.4 }}
                                                whileHover={{
                                                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                                                    transition: { duration: 0.2 }
                                                }}
                                            >
                                                <h3 className="text-lg font-semibold text-blue-800 mb-4 pb-2 border-b border-blue-200 flex items-center">
                                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Meta Information
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <CertificateDetail
                                                        label="Created By"
                                                        value={user ? user.name : ""}
                                                        delay={0.5}
                                                    />
                                                    <CertificateDetail
                                                        label="Status"
                                                        value={certificate.status}
                                                        capitalize={true}
                                                        delay={0.6}
                                                    />
                                                    <CertificateDetail
                                                        label="Created At"
                                                        value={certificate.created_at ? new Date(certificate.created_at).toLocaleDateString("en-US", {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : ""}
                                                        delay={0.7}
                                                    />
                                                    <CertificateDetail
                                                        label="Updated At"
                                                        value={certificate.updated_at ? new Date(certificate.updated_at).toLocaleDateString("en-US", {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : ""}
                                                        delay={0.8}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Action Buttons with improved styling */}
                                        <motion.div
                                            className="flex flex-col sm:flex-row justify-end gap-3 mt-6"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3, delay: 0.8 }}
                                        >
                                            <Link
                                                className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                                href={route("certificates.index")}
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                                </svg>
                                                Back to Certificates
                                            </Link>
                                            <Link
                                                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                                href={route("certificates.edit", certificate.id)}
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit Certificate
                                            </Link>

                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
