import React from 'react';
import { FileText, CheckCircle, AlertCircle, Clock, Shield, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProposalDetails() {
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
                                <div className="h-10"></div> {/* Signature Space */}
                                <p className="text-xs text-slate-400 font-mono">AUTHORIZED SIGNATURE</p>
                            </div>
                            <div className="border-b-2 border-slate-300 pb-2 w-full md:w-1/2">
                                <div className="h-10 flex items-end">
                                    <span className="font-handwriting text-2xl text-slate-800">Vijay Software Solutions</span>
                                </div>
                                <p className="text-xs text-slate-400 font-mono">SERVICE PROVIDER</p>
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                            <button className="bg-slate-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-lg">
                                Accept Proposal & Proceed
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
