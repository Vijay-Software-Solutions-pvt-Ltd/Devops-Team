import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, AlertCircle, Clock, Shield, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProposalDetails() {
    const navigate = useNavigate();
    const [signature, setSignature] = useState('');
    const terms = [
        {
            title: 'Payment Terms',
            icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
            text: '50% Advance on signing; 50% Balance within 30 days of deployment.'
        },
        {
            title: 'Service Uptime',
            icon: <Clock className="w-5 h-5 text-blue-500" />,
            text: '99.9% Uptime Guarantee ensured during all scheduled examination windows.'
        },
        {
            title: 'Exam Quota',
            icon: <FileText className="w-5 h-5 text-gray-500" />,
            text: 'Enterprise Plan exams (4/month) are fixed; No rollover for unused exams to the next month.'
        },
        {
            title: 'Data Ownership',
            icon: <Lock className="w-5 h-5 text-indigo-500" />,
            text: 'All question banks, student records, and results are the exclusive property of the Client.'
        },
        {
            title: 'Technical Support',
            icon: <Shield className="w-5 h-5 text-sky-500" />,
            text: '24/7 Priority Support during live exams; 24-hour response for general queries.'
        },
        {
            title: 'Validity',
            icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
            text: 'This proposal and the quoted pricing remain valid for 30 days from today.'
        },
        {
            title: 'Termination',
            icon: <FileText className="w-5 h-5 text-red-400" />,
            text: "Either party may terminate with 30 days' written notice. Pro-rated refunds apply."
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
                >
                    <div className="bg-slate-100 px-8 py-6 border-b border-slate-200">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center">
                            <span className="bg-slate-800 text-white rounded-md px-2 py-1 text-sm font-mono mr-3">Draft</span>
                            Terms & Conditions
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">Please review the service agreement details below.</p>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {terms.map((term, idx) => (
                            <div key={idx} className="p-6 md:flex hover:bg-slate-100/50 transition-colors">
                                <div className="flex items-center md:w-1/3 mb-2 md:mb-0">
                                    <div className="mr-3 p-2 bg-white rounded-lg shadow-sm">
                                        {term.icon}
                                    </div>
                                    <h4 className="font-semibold text-slate-700">{term.title}</h4>
                                </div>
                                <div className="md:w-2/3 text-slate-600 text-sm leading-relaxed flex items-center">
                                    {term.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="px-8 py-8 bg-slate-50 border-t border-slate-200">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Authorization</h4>
                        <div className="flex flex-col md:flex-row justify-between gap-12">
                            <div className="border-b-2 border-slate-300 pb-2 w-full md:w-1/2">
                                <input
                                    type="text"
                                    value={signature}
                                    onChange={(e) => setSignature(e.target.value)}
                                    placeholder="Type your name to sign..."
                                    className="w-full h-10 bg-transparent border-none outline-none font-handwriting text-2xl text-slate-800 placeholder:font-sans placeholder:text-sm placeholder:text-slate-300"
                                />
                                <p className="text-xs text-slate-400 font-mono">AUTHORIZED SIGNATURE</p>
                            </div>
                            <div className="border-b-2 border-slate-300 pb-2 w-full md:w-1/2">
                                <div className="h-10 flex items-end">
                                    <span className="font-handwriting text-2xl text-slate-800">Vijay Software Solutions</span>
                                </div>
                                <p className="text-xs text-slate-400 font-mono">SERVICE PROVIDER</p>
                            </div>
                        </div>
                        <div className="mt-8 text-center flex flex-col items-center">
                            <button
                                onClick={() => navigate('/checkout?plan=institutional')}
                                disabled={!signature.trim()}
                                className={`px-10 py-3.5 rounded-xl font-bold transition-all ${signature.trim()
                                        ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:shadow-xl hover:-translate-y-0.5 shadow-lg'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                                    }`}
                            >
                                Accept Proposal & Proceed
                            </button>
                            {!signature.trim() && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm font-medium text-amber-600 mt-3"
                                >
                                    Please type your signature above to authorize.
                                </motion.p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
