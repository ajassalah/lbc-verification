import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { XCircleIcon } from '@heroicons/react/24/outline';

export default function EditModuleDialog({ isOpen, setIsOpen, module, courseId, levelOptions = [] }) {
    const { data, setData, errors, processing, reset, clearErrors, post, patch } = useForm({
        name: '',
        code: '',
        level: '',
    });

    // Initialize form data when module changes
    useEffect(() => {
        if (module && isOpen) {
            setData({
                name: module.name || '',
                code: module.code || '',
                level: module.level || '',
            });
        }
    }, [module, isOpen]);

    // Close the dialog
    function closeModal() {
        reset();
        clearErrors();
        setIsOpen(false);
    }    // Handle form submission
    function handleSubmit(e) {
        e.preventDefault();

        patch(route('modules.update', module.id), {
            preserveScroll: true,
            onSuccess: () => {
                // The controller will handle the success message via flash
                closeModal();
            },
            onError: (errors) => {
                // We can access errors from the response
            },
            only: ['modules', 'flash', 'course'],
        });
    }

    return (
        <Transition show={isOpen} as={React.Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-50 overflow-y-auto"
                onClose={closeModal}
            >
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-50" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
                    </span>

                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            <div className="flex justify-between items-center">
                                <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                                    Edit Module
                                </Dialog.Title>
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-500"
                                    onClick={closeModal}
                                >
                                    <XCircleIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>                            <form onSubmit={handleSubmit} className="mt-4">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                        {/* Unit Reference */}
                                        <div>
                                            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                                                Unit Reference *
                                            </label>
                                            <input
                                                type="text"
                                                name="code"
                                                id="code"
                                                value={data.code}
                                                onChange={(e) => setData('code', e.target.value)}
                                                placeholder="LBC/2/M1D1"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                            {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                                        </div>

                                        {/* Units */}
                                        <div>
                                            <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                                                Units
                                            </label>
                                            <select
                                                name="level"
                                                id="level"
                                                value={data.level}
                                                onChange={(e) => setData('level', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                <option value="">Select Units</option>
                                                {levelOptions.map((level) => (
                                                    <option key={level} value={level}>
                                                        {level}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.level && <p className="mt-1 text-sm text-red-600">{errors.level}</p>}
                                        </div>

                                        {/* Module Name */}
                                        <div className="md:col-span-2">
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                        </div>

                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        disabled={processing}
                                    >
                                        {processing ? 'Updating...' : 'Update Module'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
