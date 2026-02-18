import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r transition-all duration-300 ${scrolled ? 'from-blue-600 to-indigo-600' : 'from-blue-400 to-indigo-400'}`}>
                            ExamPortal
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-6">
                            {['Features', 'Pricing', 'Contact'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-300 ${scrolled
                                            ? 'text-slate-600 hover:text-blue-600'
                                            : 'text-slate-300 hover:text-white'
                                        }`}
                                >
                                    {item}
                                </a>
                            ))}
                            <Link
                                to="/login"
                                className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-300 ${scrolled
                                        ? 'text-blue-600 hover:text-blue-700'
                                        : 'text-white hover:text-blue-200'
                                    }`}
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg transform hover:-translate-y-0.5 ${scrolled
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-600/30'
                                        : 'bg-white text-blue-600 hover:bg-blue-50 hover:shadow-white/20'
                                    }`}
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`inline-flex items-center justify-center p-2 rounded-md transition-colors ${scrolled ? 'text-gray-400 hover:text-gray-500 hover:bg-gray-100' : 'text-white/80 hover:text-white hover:bg-white/10'
                                } focus:outline-none`}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white shadow-xl border-t border-gray-100 absolute w-full">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {['Features', 'Pricing', 'Contact'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                onClick={() => setIsOpen(false)}
                            >
                                {item}
                            </a>
                        ))}
                        <Link
                            to="/login"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => setIsOpen(false)}
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="block w-full text-center px-4 py-3 mt-4 rounded-lg text-base font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                            onClick={() => setIsOpen(false)}
                        >
                            Sign Up Free
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
