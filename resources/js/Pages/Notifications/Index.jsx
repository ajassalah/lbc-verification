import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { CheckIcon, InboxIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, notifications }) {
    const [processing, setProcessing] = useState(false);

    const markAsRead = (id) => {
        setProcessing(true);
        router.post(route('notifications.markAsRead', id), {}, {
            onFinish: () => setProcessing(false),
        });
    };

    const markAllAsRead = () => {
        setProcessing(true);
        router.post(route('notifications.markAllAsRead'), {}, {
            onFinish: () => setProcessing(false),
        });
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Notifications</h2>}
        >
            <Head title="Notifications" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Your Notifications</h3>
                                {notifications.data.length > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                    >
                                        {processing ? 'Processing...' : 'Mark All as Read'}
                                    </button>
                                )}
                            </div>

                            {notifications.data.length > 0 ? (
                                <div className="space-y-4">
                                    {notifications.data.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 border rounded-lg ${notification.read_at ? 'bg-white' : 'bg-blue-50'}`}
                                        >                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="font-medium">
                                                        {notification.data.title || notification.type || 'Notification'}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {notification.data.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        {formatDate(notification.created_at)}
                                                    </p>
                                                    {notification.data.reference_no && (
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            Reference: {notification.data.reference_no}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex flex-col space-y-2">

                                                    {!notification.read_at && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            disabled={processing}
                                                            className="text-blue-600 hover:text-blue-800 disabled:opacity-50 flex items-center text-sm"
                                                        >
                                                            <CheckIcon className="w-4 h-4 mr-1" />
                                                            Mark as read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="mt-6">
                                        {/* Pagination links */}
                                        <div className="flex justify-end">
                                            {notifications.prev_page_url && (
                                                <Link
                                                    href={notifications.prev_page_url}
                                                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                >
                                                    Previous
                                                </Link>
                                            )}

                                            {notifications.next_page_url && (
                                                <Link
                                                    href={notifications.next_page_url}
                                                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 ml-3"
                                                >
                                                    Next
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <InboxIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                                    <p className="mt-1 text-sm text-gray-500">You don't have any notifications at the moment.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}