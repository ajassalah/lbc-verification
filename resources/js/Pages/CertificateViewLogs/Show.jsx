import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import SecondaryButton from "@/Components/SecondaryButton";

// Helper component for log details
const LogDetail = ({ label, value, capitalize, uppercase, delay = 0 }) => {
    const valueClass = `${capitalize ? 'capitalize' : ''} ${uppercase ? 'uppercase' : ''}`;

    return (
        <motion.div
            className="px-3 "
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay }}
        >
            <span className="block text-sm text-blue-600 font-medium mb-1">
                {label}
            </span>
            <span className={`block font-semibold text-gray-800 ${valueClass}`}>
                {value}
            </span>
        </motion.div>
    );
};

export default function Show({ auth, log }) {
    // Add animation state
    const [isVisible, setIsVisible] = useState(false);

    // Animation effect on component mount
    useEffect(() => {
        // Small delay for entrance animation
        setTimeout(() => setIsVisible(true), 300);
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight">
                    Certificate View Log Details
                </h2>
            }
        >
            <Head title="Certificate View Log Details" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg"
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
                                                Certificate View Log Details
                                            </h1>
                                            <p className="text-md text-gray-600">
                                                Certificate reference: <span className="font-medium">{log.reference_no}</span>
                                            </p>
                                            <div className="w-24 h-1 bg-blue-600 mx-auto my-4"></div>
                                        </motion.div>

                                        <div className="grid grid-cols-1 gap-6">
                                            {/* Location Information Section */}
                                            <motion.div
                                                className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: 0.4 }}
                                            >
                                                <h3 className="text-lg font-semibold text-blue-800 mb-4 pb-2 border-b border-blue-200">
                                                    Location Information
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <LogDetail
                                                        label="IP Address"
                                                        value={log.ip || "N/A"}
                                                        delay={0.5}
                                                    />
                                                    <LogDetail
                                                        label="Country"
                                                        value={log.country || "N/A"}
                                                        capitalize={true}
                                                        delay={0.6}
                                                    />
                                                    <LogDetail
                                                        label="Country Code"
                                                        value={log.country_code || "N/A"}
                                                        delay={0.7}
                                                    />
                                                    <LogDetail
                                                        label="Region Name"
                                                        value={log.region_name || "N/A"}
                                                        capitalize={true}
                                                        delay={0.8}
                                                    />
                                                    <LogDetail
                                                        label="Region Code"
                                                        value={log.region || "N/A"}
                                                        delay={0.9}
                                                    />
                                                    <LogDetail
                                                        label="City"
                                                        value={log.city || "N/A"}
                                                        capitalize={true}
                                                        delay={1.0}
                                                    />
                                                    <LogDetail
                                                        label="ZIP Code"
                                                        value={log.zip || "N/A"}
                                                        delay={1.1}
                                                    />
                                                    <LogDetail
                                                        label="Timezone"
                                                        value={log.timezone || "N/A"}
                                                        delay={1.2}
                                                    />
                                                    <LogDetail
                                                        label="Latitude"
                                                        value={log.lat || "N/A"}
                                                        delay={1.3}
                                                    />
                                                    <LogDetail
                                                        label="Longitude"
                                                        value={log.lon || "N/A"}
                                                        delay={1.4}
                                                    />
                                                </div>
                                            </motion.div>

                                            {/* Connection Information Section */}
                                            <motion.div
                                                className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: 1.5 }}
                                            >
                                                <h3 className="text-lg font-semibold text-blue-800 mb-4 pb-2 border-b border-blue-200">
                                                    Connection Information
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <LogDetail
                                                        label="ISP"
                                                        value={log.isp || "N/A"}
                                                        delay={1.6}
                                                    />
                                                    <LogDetail
                                                        label="Organization"
                                                        value={log.org || "N/A"}
                                                        delay={1.7}
                                                    />
                                                    <LogDetail
                                                        label="AS"
                                                        value={log.as || "N/A"}
                                                        delay={1.8}
                                                    />

                                                    <LogDetail
                                                        label="Proxy"
                                                        value={log.proxy ? "Yes" : "No"}
                                                        delay={1.9}
                                                    />
                                                    <LogDetail
                                                        label="Hosting"
                                                        value={log.hosting ? "Yes" : "No"}
                                                        delay={2.0}
                                                    />
                                                    <LogDetail
                                                        label="User Agent"
                                                        value={log.user_agent || "N/A"}
                                                        delay={2.1}
                                                    />
                                                </div>
                                            </motion.div>

                                            {/* Meta Information Section */}
                                            <motion.div
                                                className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: 2.2 }}
                                            >
                                                <h3 className="text-lg font-semibold text-blue-800 mb-4 pb-2 border-b border-blue-200">
                                                    Meta Information
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <LogDetail
                                                        label="Reference No"
                                                        value={log.reference_no || "N/A"}
                                                        delay={2.3}
                                                    />
                                                    <LogDetail
                                                        label="Status"
                                                        value={log.status || "N/A"}
                                                        capitalize={true}
                                                        delay={2.4}
                                                    />
                                                    <LogDetail
                                                        label="Viewed At"
                                                        value={new Date(log.created_at).toLocaleString() || "N/A"}
                                                        delay={2.5}
                                                    />
                                                    <LogDetail
                                                        label="Updated At"
                                                        value={new Date(log.updated_at).toLocaleString() || "N/A"}
                                                        delay={2.6}
                                                    />
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>

                                    <motion.div
                                        className="flex items-center justify-end mt-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3, delay: 2.7 }}
                                    >
                                        <SecondaryButton>
                                            <Link
                                                className="w-full"
                                                href={route("certificate-view-logs.index")}
                                            >
                                                Back to Logs
                                            </Link>
                                        </SecondaryButton>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}