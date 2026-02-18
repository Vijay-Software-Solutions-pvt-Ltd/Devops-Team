import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Twitter, Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-4">
                            Vijay Software Solutions
                        </h2>
                        <p className="text-slate-400 max-w-sm mb-6">
                            Empowering institutions with secure, scalable, and intelligent assessment solutions.
                            Transforming the way exams are conducted globally.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 transition-colors">
                                <Linkedin className="w-5 h-5 text-white" />
                            </a>
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-400 transition-colors">
                                <Twitter className="w-5 h-5 text-white" />
                            </a>
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-700 transition-colors">
                                <Facebook className="w-5 h-5 text-white" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4 text-lg">Platform</h3>
                        <ul className="space-y-2">
                            <li><Link to="/login" className="hover:text-blue-400 transition-colors">Login</Link></li>
                            <li><Link to="/signup" className="hover:text-blue-400 transition-colors">Sign Up</Link></li>
                            <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
                            <li><a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4 text-lg">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPin className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                                <span>Hyderabad, India</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-5 h-5 text-blue-500 mr-2" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="w-5 h-5 text-blue-500 mr-2" />
                                <span>contact@vijaysoftware.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Vijay Software Solutions Pvt Ltd. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
