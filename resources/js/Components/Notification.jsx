import { Fragment, useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { usePage } from "@inertiajs/react";

export default function Notification() {
    const { flash } = usePage().props;
    const [show, setShow] = useState(false);

    // Show notification whenever flash message is present
    useEffect(() => {
        if (flash.success || flash.warning || flash.error) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [flash.success, flash.warning, flash.error]);

    const getMessageType = () => {
        if (flash.success) return "Success";
        if (flash.warning) return "Warning";
        if (flash.error) return "Error";
        return "";
    };

    const getMessageContent = () => {
        return flash.success || flash.warning || flash.error || "";
    };

    const getIconColor = () => {
        if (flash.success) return "text-green-400";
        if (flash.warning) return "text-blue-400";
        if (flash.error) return "text-red-400";
        return "";
    };

    return (
        <>
            {(flash.success || flash.warning || flash.error) && (
                <div
                    aria-live="assertive"
                    className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
                >
                    <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                        <Transition
                            show={show}
                            as={Fragment}
                            enter="transform ease-out duration-300 transition"
                            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                <div className="p-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <CheckCircleIcon
                                                className={`h-6 w-6 ${getIconColor()}`}
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div className="ml-3 w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {getMessageType()}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {getMessageContent()}
                                            </p>
                                        </div>
                                        <div className="ml-4 flex flex-shrink-0">
                                            <button
                                                type="button"
                                                className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                onClick={() => setShow(false)}
                                            >
                                                <span className="sr-only">Close</span>
                                                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            )}
        </>
    );
}
