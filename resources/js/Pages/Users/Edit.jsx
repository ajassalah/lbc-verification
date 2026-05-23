import React, { useState } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

function ToggleField({ id, label, checked, onChange }) {
    return (
        <label
            htmlFor={id}
            className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
        >
            <div>
                <span className="block text-sm font-semibold text-gray-800">{label}</span>
                <span className="mt-1 block text-xs text-gray-500">
                    On: manual entry. Off: auto generated.
                </span>
            </div>
            <span className="relative inline-flex items-center">
                <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="sr-only peer"
                />
                <span className="h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-blue-600" />
                <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
            </span>
        </label>
    );
}

export default function Edit({ auth, user }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: user.data.name || '',
        email: user.data.email || '',
        password: '',
        password_confirmation: '',
        role: user.data.role || 'user',
        allow_manual_learner_id: Boolean(user.data.allow_manual_learner_id),
        allow_manual_certificate_reference: Boolean(user.data.allow_manual_certificate_reference),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('users.update', user.data.id));
    };

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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl leading-tight">Edit User</h2>}>

            <Head title="Edit User" />
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
                        <form onSubmit={handleSubmit}>
                            <motion.div
                                className="space-y-6"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div variants={itemVariants}>
                                        <InputLabel htmlFor="name" value="Name" />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <InputLabel htmlFor="email" value="Email" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </motion.div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div variants={itemVariants}>
                                        <InputLabel htmlFor="password" value="New Password" />
                                        <div className="relative mt-1">
                                            <TextInput
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={data.password}
                                                className="block w-full pr-11"
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Leave blank to keep current password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((current) => !current)}
                                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-blue-600"
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? (
                                                    <EyeSlashIcon className="h-5 w-5" />
                                                ) : (
                                                    <EyeIcon className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} className="mt-2" />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <InputLabel htmlFor="password_confirmation" value="Confirm New Password" />
                                        <div className="relative mt-1">
                                            <TextInput
                                                id="password_confirmation"
                                                type={showPasswordConfirmation ? 'text' : 'password'}
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                className="block w-full pr-11"
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Leave blank to keep current password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswordConfirmation((current) => !current)}
                                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-blue-600"
                                                aria-label={showPasswordConfirmation ? 'Hide confirm password' : 'Show confirm password'}
                                            >
                                                {showPasswordConfirmation ? (
                                                    <EyeSlashIcon className="h-5 w-5" />
                                                ) : (
                                                    <EyeIcon className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        <InputError message={errors.password_confirmation} className="mt-2" />
                                    </motion.div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div variants={itemVariants}>
                                        <InputLabel htmlFor="role" value="Role" />
                                        <select
                                            id="role"
                                            name="role"
                                            value={data.role}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            onChange={(e) => setData('role', e.target.value)}
                                            required
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <InputError message={errors.role} className="mt-2" />
                                    </motion.div>
                                </div>

                                <motion.div variants={itemVariants}>
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                                        Auto Generation
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <ToggleField
                                            id="allow_manual_learner_id"
                                            label="Student ID auto Generation"
                                            checked={data.allow_manual_learner_id}
                                            onChange={(checked) => setData('allow_manual_learner_id', checked)}
                                        />
                                        <ToggleField
                                            id="allow_manual_certificate_reference"
                                            label="Certificate/Reference Number auto generation"
                                            checked={data.allow_manual_certificate_reference}
                                            onChange={(checked) => setData('allow_manual_certificate_reference', checked)}
                                        />
                                    </div>
                                    <InputError message={errors.allow_manual_learner_id} className="mt-2" />
                                    <InputError message={errors.allow_manual_certificate_reference} className="mt-2" />
                                </motion.div>
                            </motion.div>

                            <motion.div
                                className="flex items-center justify-end mt-8 space-x-3"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <Link href={route('users.index')}>
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
                                        Update User
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
