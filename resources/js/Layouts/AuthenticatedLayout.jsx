import { useState } from 'react';
import Logo from '@/Components/Logo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import Notification from '@/Components/Notification';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BuildingOffice2Icon,
    Squares2X2Icon, 
    BookOpenIcon, 
    UsersIcon, 
    AcademicCapIcon, 
    UserGroupIcon, 
    ClipboardDocumentListIcon,
    CircleStackIcon,
    Bars3Icon,
    XMarkIcon,
    ChevronDownIcon,
    BellIcon
} from '@heroicons/react/24/outline';

export default function Authenticated({ user, header, children }) {
    const [showingSidebar, setShowingSidebar] = useState(false);
    const { notification_count, notifications } = usePage().props;
    const isAdmin = user?.role === 'admin';

    const navigation = [
        { name: 'Dashboard', href: route('dashboard'), icon: Squares2X2Icon, active: route().current('dashboard') },
        { name: 'Courses', href: route('courses.index'), icon: BookOpenIcon, active: route().current('courses.*') },
        { name: 'Learners', href: route('learners.index'), icon: UsersIcon, active: route().current('learners.*') },
        { name: 'Certificates', href: route('certificates.index'), icon: AcademicCapIcon, active: route().current('certificates.*') },
        { name: 'Centers', href: route('centers.index'), icon: BuildingOffice2Icon, active: route().current('centers.*') },
        { name: 'Data', href: route('data.index'), icon: CircleStackIcon, active: route().current('data.*') || route().current('data-options.*') },
        ...(isAdmin ? [
            { name: 'Users', href: route('users.index'), icon: UserGroupIcon, active: route().current('users.*') },
            { name: 'Certificate View Logs', href: route('certificate-view-logs.index'), icon: ClipboardDocumentListIcon, active: route().current('certificate-view-logs.*') },
        ] : []),
    ];

    return (
        <div className="min-h-screen bg-blue-50 flex overflow-hidden">
            {/* Sidebar for Desktop */}
            <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-blue-200 shadow-sm fixed h-full z-30">
                <div className="flex items-center justify-center h-20 border-b border-blue-100 px-6">
                    <Link href="/">
                        <Logo className="h-20 w-auto" />
                    </Link>
                </div>
                
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                                item.active 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                                : 'text-blue-700 hover:bg-blue-50 hover:text-blue-900'
                            }`}
                        >
                            <item.icon className={`h-5 w-5 mr-3 transition-colors ${item.active ? 'text-white' : 'text-blue-500'}`} />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-blue-100 bg-blue-50/30">
                    <div className="flex items-center px-2">
                        <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3 shadow-md">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-blue-900 truncate">{user.name}</p>
                            <p className="text-xs text-blue-500 truncate capitalize">{user.role || 'Administrator'}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {showingSidebar && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowingSidebar(false)}
                            className="fixed inset-0 bg-blue-900/40 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.aside 
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden shadow-2xl flex flex-col"
                        >
                            <div className="flex items-center justify-between h-20 px-6 border-b border-blue-100">
                                <Logo className="h-14 w-auto" />
                                <button onClick={() => setShowingSidebar(false)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setShowingSidebar(false)}
                                        className={`flex items-center px-4 py-4 text-base font-bold rounded-xl transition-all ${
                                            item.active 
                                            ? 'bg-blue-600 text-white shadow-xl' 
                                            : 'text-blue-700 hover:bg-blue-50'
                                        }`}
                                    >
                                        <item.icon className="h-6 w-6 mr-4" />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                            <div className="p-6 border-t border-blue-100">
                                <Link href={route('logout')} method="post" as="button" className="w-full text-center py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center space-x-2">
                                    <span>Log Out</span>
                                </Link>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-64 min-w-0 h-screen overflow-hidden">
                {/* Top Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-blue-200 h-20 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm shrink-0">
                    <div className="flex items-center min-w-0">
                        <button 
                            onClick={() => setShowingSidebar(true)}
                            className="lg:hidden p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-3"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                        {header && <div className="text-lg font-bold text-blue-900 truncate">{header}</div>}
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Notifications */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="relative p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                    <BellIcon className="h-6 w-6" />
                                    {notification_count > 0 && (
                                        <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                                            {notification_count}
                                        </span>
                                    )}
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="right" width="72" position="fixed" offsetX={-72} contentClasses="py-1 bg-white shadow-2xl rounded-2xl border border-blue-100">
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-blue-900">Notifications</h3>
                                        {notification_count > 0 && (
                                            <Link href={route('notifications.markAllAsRead')} method="post" className="text-xs text-blue-600 hover:underline font-semibold">Mark all as read</Link>
                                        )}
                                    </div>
                                    <div className="max-h-64 overflow-y-auto space-y-3">
                                        {notifications && notifications.length > 0 ? (
                                            notifications.map((n) => (
                                                <div key={n.id} className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 hover:bg-blue-50 transition-colors">
                                                    <p className="text-xs font-bold text-blue-900 mb-1">{n.data.title}</p>
                                                    <p className="text-xs text-blue-700 leading-relaxed">{n.data.message}</p>
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <span className="text-[10px] text-blue-400 font-medium">{n.created_at}</span>
                                                        <Link href={route('notifications.markAsRead', n.id)} method="post" className="text-[10px] text-blue-600 font-bold hover:underline">Dismiss</Link>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-8 text-center">
                                                <BellIcon className="h-8 w-8 text-blue-200 mx-auto mb-2" />
                                                <p className="text-xs text-blue-400 font-medium">All caught up!</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-blue-100">
                                        <Link href={route('notifications.index')} className="block text-center text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">See all activity</Link>
                                    </div>
                                </div>
                            </Dropdown.Content>
                        </Dropdown>

                        {/* User Profile */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center space-x-2 p-1.5 hover:bg-blue-50 rounded-full transition-colors group">
                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <ChevronDownIcon className="h-4 w-4 text-blue-400 group-hover:text-blue-600 transition-colors hidden sm:block" />
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="right" contentClasses="py-2 bg-white w-48 shadow-2xl rounded-2xl border border-blue-100">
                                <div className="px-4 py-2 border-b border-blue-50 mb-1">
                                    <p className="text-xs font-bold text-blue-900 truncate">{user.name}</p>
                                    <p className="text-[10px] text-blue-400 truncate font-medium">{user.email}</p>
                                </div>
                                <Dropdown.Link href={route('profile.edit')} className="text-blue-700 font-medium text-xs hover:bg-blue-50">View Profile</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button" className="text-red-600 font-bold text-xs hover:bg-red-50">Log Out</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-blue-50/50">
                    <Notification />
                    <motion.div 
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="max-w-7xl mx-auto"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
