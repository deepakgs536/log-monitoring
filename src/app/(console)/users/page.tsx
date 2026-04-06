'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { User, UserPlus, UserMinus, ShieldAlert, Check, AlertCircle, Mail, Key } from 'lucide-react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const getAvatarGradient = (name: string) => {
    const chars = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
    const gradients = [
        'from-red-500 to-orange-500',
        'from-rose-500 to-pink-600',
        'from-red-600 to-rose-400',
        'from-orange-600 to-red-500',
    ];
    return gradients[chars % gradients.length];
};

export default function UsersPage() {
    const { currentApp, currentUser, inviteUser } = useApp();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviting, setInviting] = useState(false);
    const [inviteError, setInviteError] = useState('');

    const [userToRemove, setUserToRemove] = useState<any>(null);
    const [removing, setRemoving] = useState(false);

    useEffect(() => {
        if (currentApp) {
            setIsLoading(true);
            fetch(`/api/apps/${currentApp.id}/users`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setUsers(data);
                    setIsLoading(false);
                })
                .catch(e => {
                    console.error(e);
                    setIsLoading(false);
                });
        }
    }, [currentApp]);

    const isOwner = currentApp && (!currentApp.ownerId || currentApp.ownerId === currentUser?.userId);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setInviteError('');
        if (!inviteEmail.trim() || !currentApp) return;
        
        setInviting(true);
        try {
            const newUser = await inviteUser(currentApp.id, inviteEmail);
            setUsers(prev => [...prev, newUser]);
            setIsInviteOpen(false);
            setInviteEmail('');
        } catch (error: any) {
            if (error.message.toLowerCase().includes('does not exist') || error.message.toLowerCase().includes('found')) {
                setInviteError('Invalid user email');
            } else {
                setInviteError(error.message);
            }
        } finally {
            setInviting(false);
        }
    };

    const handleRemove = async () => {
        if (!userToRemove || !currentApp) return;
        setRemoving(true);
        try {
            const res = await fetch(`/api/apps/${currentApp.id}/users/${userToRemove.id}`, {
                method: 'DELETE'
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to remove user');
            }
            setUsers(prev => prev.filter(u => u.id !== userToRemove.id));
            setUserToRemove(null);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setRemoving(false);
        }
    };

    if (!currentApp) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-pulse flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <ShieldAlert className="w-6 h-6 text-red-300" />
                    </div>
                    <p className="text-gray-400 font-medium tracking-wide">No application selected...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-slate-50 relative overflow-hidden flex flex-col">
            {/* Elegant Background Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-200/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-200/20 blur-[100px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3" />

            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 px-6 py-10 lg:px-12">
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto space-y-10"
                >
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200/60 shadow-[0_1px_0_0_rgba(255,255,255,0.8)]">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg shadow-red-500/20 text-white">
                                    <User className="w-5 h-5" />
                                </div>
                                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Access Management</h1>
                            </div>
                            <p className="text-slate-500 font-medium pl-1">
                                Managing members and permissions for <span className="text-slate-800 font-bold px-2 py-0.5 bg-white shadow-sm border border-slate-100 rounded-md ml-1">{currentApp.name}</span>
                            </p>
                        </div>

                        {/* Actions */}
                        {isOwner && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    setInviteEmail('');
                                    setInviteError('');
                                    setIsInviteOpen(true);
                                }}
                                className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-xl shadow-slate-900/10 transition-all focus:ring-4 focus:ring-slate-900/10"
                            >
                                <UserPlus className="w-4 h-4 text-red-400" />
                                <span>Invite Member</span>
                            </motion.button>
                        )}
                    </div>

                    {/* Users Grid/List Container */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                        {/* Table Header Wrapper */}
                        <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <div className="col-span-6 md:col-span-5 pl-2">User Details</div>
                            <div className="col-span-3 md:col-span-4 hidden md:block">Permission Role</div>
                            <div className="col-span-6 md:col-span-3 text-right pr-2">Actions</div>
                        </div>

                        {isLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-4">
                                <div className="w-10 h-10 border-4 border-red-100 border-t-red-500 rounded-full animate-spin" />
                                <span className="text-slate-400 font-medium text-sm animate-pulse">Loading members...</span>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="py-20 text-center text-slate-500 font-medium">
                                No members found.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100/80">
                                <AnimatePresence>
                                    {users.map((user, index) => (
                                        <motion.div 
                                            key={user.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-white transition-colors duration-300"
                                        >
                                            {/* User Details */}
                                            <div className="col-span-8 md:col-span-5 flex items-center gap-4">
                                                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${getAvatarGradient(user.name)} flex items-center justify-center text-white font-bold shadow-md transform group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300`}>
                                                    {user.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-slate-900 text-[15px] flex items-center gap-2 truncate">
                                                        {user.name}
                                                        {user.id === currentUser?.userId && (
                                                            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border border-red-200">You</span>
                                                        )}
                                                    </div>
                                                    <div className="text-slate-500 text-xs font-medium mt-0.5 flex items-center gap-1.5 truncate">
                                                        <Mail className="w-3 h-3 text-slate-400" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Role */}
                                            <div className="col-span-4 md:col-span-4 hidden md:flex items-center">
                                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                                                    user.role === 'owner' 
                                                        ? 'bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border border-red-100' 
                                                        : 'bg-slate-100 text-slate-600 border border-slate-200 shadow-inner'
                                                }`}>
                                                    {user.role === 'owner' ? <Key className="w-3 h-3 text-red-500" /> : <User className="w-3 h-3 text-slate-400" />}
                                                    {user.role}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="col-span-4 md:col-span-3 flex items-center justify-end">
                                                {isOwner && user.role !== 'owner' ? (
                                                    <button
                                                        onClick={() => setUserToRemove(user)}
                                                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
                                                    >
                                                        <UserMinus className="w-3.5 h-3.5" />
                                                        Remove
                                                    </button>
                                                ) : (
                                                    <span className="text-xs font-semibold text-slate-300 italic opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        No actions
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Invite Modal - Premium UI */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isInviteOpen && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                            <motion.div 
                                key="invite-overlay"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => !inviting && setIsInviteOpen(false)}
                                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            />
                            <motion.div 
                                key="invite-modal"
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative bg-white/90 backdrop-blur-2xl rounded-[32px] shadow-2xl shadow-slate-900/20 w-full max-w-md overflow-hidden border border-white"
                            >
                                <div className="px-8 py-8">
                                    <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mb-6 shadow-inner border border-white">
                                        <UserPlus className="w-6 h-6 text-red-600" />
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Add New Member</h3>
                                    <p className="text-sm text-slate-500 font-medium mb-6">Are you sure you want to add this member to the application? They will gain read access.</p>
                                    
                                    <form onSubmit={handleInvite}>
                                        <div className="space-y-5">
                                            {/* Error State */}
                                            <AnimatePresence>
                                                {inviteError && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm font-bold shadow-sm mb-4">
                                                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                                                            {inviteError}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            
                                            <div className="space-y-2 relative group">
                                                <label htmlFor="email" className="text-xs font-extrabold uppercase tracking-wide text-slate-500 ml-1">Member Email</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                                                    <input
                                                        id="email"
                                                        type="email"
                                                        value={inviteEmail}
                                                        onChange={(e) => {
                                                            setInviteEmail(e.target.value);
                                                            setInviteError('');
                                                        }}
                                                        placeholder="colleague@domain.com"
                                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 hover:bg-slate-100 focus:bg-white rounded-2xl border border-slate-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-medium text-slate-900 placeholder:text-slate-400 outline-none"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-10 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsInviteOpen(false)}
                                                className="flex-1 py-3.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors focus:ring-4 focus:ring-slate-200"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={!inviteEmail.trim() || inviting}
                                                className="flex-[2] py-3.5 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all flex items-center justify-center gap-2 focus:ring-4 focus:ring-red-500/20"
                                            >
                                                {inviting ? (
                                                    <span className="flex items-center gap-2">
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Adding...
                                                    </span>
                                                ) : "Confirm & Invite"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* Remove Confirmation Modal - Premium UI */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {userToRemove && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                            <motion.div 
                                key="remove-overlay"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => !removing && setUserToRemove(null)}
                                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            />
                            <motion.div 
                                key="remove-modal"
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative bg-white/90 backdrop-blur-2xl rounded-[32px] shadow-2xl shadow-slate-900/20 max-w-sm w-full overflow-hidden border border-white text-center p-8"
                            >
                                <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 shadow-inner border border-white relative">
                                    <div className="absolute inset-0 rounded-full animate-ping bg-red-100 opacity-50" />
                                    <ShieldAlert className="w-8 h-8 text-red-600 relative z-10" />
                                </div>
                                
                                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Remove Member</h3>
                                <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                                    Are you sure you want to remove <strong className="text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">{userToRemove.name}</strong> from this application? They will lose access immediately.
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setUserToRemove(null)}
                                        className="py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors focus:ring-4 focus:ring-slate-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleRemove}
                                        disabled={removing}
                                        className="py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-500 disabled:bg-slate-300 disabled:text-slate-500 rounded-xl shadow-lg shadow-red-500/30 transition-all focus:ring-4 focus:ring-red-500/20"
                                    >
                                        {removing ? 'Processing...' : 'Yes, Remove'}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
