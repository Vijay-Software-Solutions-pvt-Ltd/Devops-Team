import React, { useEffect, useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const GeometricScene = lazy(() => import('./3DScene.jsx'));

export default function HeroSection() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('user') || 'null');
        setUser(u);
    }, []);

    return (
        <div className="relative h-screen min-h-[600px] w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-black overflow-hidden flex items-center justify-center">
            <Suspense fallback={null}>
                <GeometricScene />
            </Suspense>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6 drop-shadow-2xl">
                        Digital Assessment <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">Solution</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
                        Engineered to provide a seamless, secure, and proctored environment for students while offering powerful analytics for administrators.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                        {user ? (
                            <Link
                                to={(user.role === 'admin' || user.role === 'superadmin') ? '/admin' : '/student'}
                                className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.7)]"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <a href="#pricing" className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.7)]">
                                View Plans
                            </a>
                        )}
                        <a href="#features" className="px-8 py-3 rounded-full bg-white/10 backdrop-blur-md text-white font-semibold hover:bg-white/20 transition-all border border-white/20">
                            Explore Features
                        </a>
                    </div>
                </motion.div>
            </div>

            <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-slate-900 to-transparent z-10 pointer-events-none" />
        </div>
    );
}