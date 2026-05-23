import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useForm } from '@inertiajs/react';

export default function DeleteConfirmationDialog({ isOpen, setIsOpen, module }) {
    const { delete: destroy, processing } = useForm();

    // Close the dialog
    function closeModal() {
        setIsOpen(false);
    }

    // Handle delete confirmation
    function handleDelete() {
        destroy(route('modules.destroy', module.id), {
            preserveScroll: true,

            onSuccess: () => {
                closeModal();
                // The redirect happens server-side
            },
            only: ['modules', 'flash'],
            onError: () => {
                // Handle error
            },
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
                        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            <div className="flex items-center justify-center mb-4">
                                <ExclamationCircleIcon className="h-14 w-14 text-red-500" aria-hidden="true" />
                            </div>

                            <Dialog.Title as="h3" className="text-lg font-medium text-center text-gray-900">
                                Delete Module
                            </Dialog.Title>

                            <div className="mt-4">
                                <p className="text-sm text-gray-500 text-center">
                                    Are you sure you want to delete the module "{module?.name}"? This action cannot be undone.
                                </p>
                            </div>

                            <div className="mt-6 flex justify-center space-x-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    onClick={handleDelete}
                                    disabled={processing}
                                >
                                    {processing ? 'Deleting...' : 'Delete Module'}
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
