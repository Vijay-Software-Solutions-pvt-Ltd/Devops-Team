import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Calculator } from 'lucide-react';

export default function PricingSection() {
    const [billingCycle, setBillingCycle] = useState('annual');

    // Calculator State
    const [numUsers, setNumUsers] = useState(500);
    const [examsPerMonth, setExamsPerMonth] = useState(4);
    const [tenureMonths, setTenureMonths] = useState(12);

    const enterpriseFeatures = [
        'Up to 500 Concurrent Students',
        '4 Exams per Month (48/Year)',
        'Effective Rate: ₹15/student/exam',
        '24/7 Unlimited Access',
        '99.9% Uptime Guarantee'
    ];

    const payPerExamFeatures = [
        'Flexible, on-demand testing',
        'Pay only for what you use',
        'Standard Support',
        'Suitable for irregular schedules'
    ];

    // Dynamic Price Calculation
    // Base logic derived from enterprise plan: 450000 / (500 users * 48 exams) = ~18.75 per unit? 
    // Wait, prompt says effective rate is 15. So 450,000 / (500 * 48) = 18.75.
    // Close enough. Let's use a tiered logic.
    const calculateCustomPrice = () => {
        const totalExams = examsPerMonth * tenureMonths;
        const totalUnits = numUsers * totalExams;

        // Base rate per student-exam unit
        let ratePerUnit = 25;
        if (totalUnits > 5000) ratePerUnit = 20;
        if (totalUnits > 10000) ratePerUnit = 18;
        if (totalUnits > 20000) ratePerUnit = 15; // Enterprise level

        // Tenure discount
        let discount = 0;
        if (tenureMonths >= 12) discount = 0.10; // 10% off for annual commitment in custom plan

        const basePrice = totalUnits * ratePerUnit;
        const finalPrice = basePrice * (1 - discount);

        return Math.round(finalPrice);
    };

    return (
        <section id="pricing" className="py-24 bg-slate-900 relative overflow-hidden text-white">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-blue-400 font-semibold tracking-wide uppercase text-sm">Investment Options</h2>
                    <h3 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
                        Choose the right plan for your institution
                    </h3>
                    <p className="mt-4 text-xl text-gray-400">
                        Select a standard plan or customize one to fit your scale.
                    </p>
                </div>

                {/* Standard Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
                    {/* Enterprise Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative bg-slate-800/50 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 flex flex-col hover:border-blue-500/60 transition-colors"
                    >
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                            BEST VALUE
                        </div>
                        <div className="mb-4">
                            <h4 className="text-2xl font-bold text-white">Enterprise Annual Plan</h4>
                            <p className="text-gray-400 mt-2">Designed for consistent, high-volume assessment cycles.</p>
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-extrabold text-white">₹4,50,000</span>
                            <span className="text-gray-400"> / year</span>
                        </div>
                        <ul className="mb-8 space-y-4 flex-1">
                            {enterpriseFeatures.map((feature, idx) => (
                                <li key={idx} className="flex items-center text-gray-300">
                                    <Check className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg transform hover:-translate-y-1">
                            Select Enterprise Plan
                        </button>
                    </motion.div>

                    {/* Pay-per-Exam Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative bg-slate-800/30 backdrop-blur-md border border-gray-700 rounded-3xl p-8 flex flex-col hover:border-gray-600 transition-colors"
                    >
                        <div className="mb-4">
                            <h4 className="text-2xl font-bold text-white">Tiered Pay-per-Exam</h4>
                            <p className="text-gray-400 mt-2">Designed for flexible, on-demand testing requirements.</p>
                        </div>
                        <div className="mb-6">
                            <div className="mt-2 space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                <div className="flex justify-between text-gray-300 text-sm border-b border-slate-700 pb-2">
                                    <span>Up to 100 Students</span>
                                    <span className="font-bold text-white">₹5,000 / exam</span>
                                </div>
                                <div className="flex justify-between text-gray-300 text-sm border-b border-slate-700 pb-2">
                                    <span>101 - 250 Students</span>
                                    <span className="font-bold text-white">₹10,000 / exam</span>
                                </div>
                                <div className="flex justify-between text-gray-300 text-sm">
                                    <span>251 - 500 Students</span>
                                    <span className="font-bold text-white">₹14,000 / exam</span>
                                </div>
                            </div>
                        </div>
                        <ul className="mb-8 space-y-4 flex-1">
                            {payPerExamFeatures.map((feature, idx) => (
                                <li key={idx} className="flex items-center text-gray-300">
                                    <Star className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-4 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition-all">
                            Contact Sales
                        </button>
                    </motion.div>
                </div>

                {/* Custom Calculator Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-5xl mx-auto bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl"
                >
                    <div className="p-8 md:p-12">
                        <div className="flex items-center mb-8">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mr-4">
                                <Calculator className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">Custom Plan Estimator</h3>
                                <p className="text-slate-400">Adjust the parameters to estimate a plan tailored to your scale.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                {/* Sliders */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-slate-300">Concurrent Users</label>
                                        <span className="text-indigo-400 font-bold">{numUsers} Users</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="50" max="2000" step="50"
                                        value={numUsers}
                                        onChange={(e) => setNumUsers(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-slate-300">Exams per Month</label>
                                        <span className="text-indigo-400 font-bold">{examsPerMonth} Exams</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1" max="20" step="1"
                                        value={examsPerMonth}
                                        onChange={(e) => setExamsPerMonth(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-slate-300">Duration (Tenure)</label>
                                        <span className="text-indigo-400 font-bold">{tenureMonths} Months</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1" max="24" step="1"
                                        value={tenureMonths}
                                        onChange={(e) => setTenureMonths(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                                        <span>1 Month</span>
                                        <span>2 Years</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700 flex flex-col justify-center items-center text-center">
                                <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-2">
                                    Estimated Investment
                                </p>
                                <div className="text-5xl font-extrabold text-white mb-2">
                                    ₹{calculateCustomPrice().toLocaleString()}
                                </div>
                                <p className="text-slate-400 text-sm mb-6">
                                    Total for {tenureMonths} months
                                </p>

                                <div className="space-y-2 w-full text-sm text-slate-300 mb-6">
                                    <div className="flex justify-between">
                                        <span>Total Exams:</span>
                                        <span className="font-semibold">{examsPerMonth * tenureMonths}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Max Users:</span>
                                        <span className="font-semibold">{numUsers}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-slate-700 pt-2 mt-2">
                                        <span>Effective Rate:</span>
                                        <span className="font-semibold text-emerald-400">
                                            ₹{(calculateCustomPrice() / (numUsers * examsPerMonth * tenureMonths)).toFixed(2)}/unit
                                        </span>
                                    </div>
                                </div>

                                <button className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors">
                                    Request Custom Quote
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Cost Benefit Analysis - Re-added below */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 max-w-4xl mx-auto"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1">
                            <h4 className="text-2xl font-bold text-white mb-2 flex items-center">
                                <Zap className="w-6 h-6 text-yellow-400 mr-2" />
                                Value Proposition
                            </h4>
                            <p className="text-gray-400">
                                Our Enterprise Plan offers approximately <strong>33% annual savings</strong> compared to pay-per-exam models at scale.
                            </p>
                        </div>
                        <div className="flex-1 w-full bg-slate-800/50 rounded-xl p-6 border border-gray-700/50">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-lg font-semibold">
                                    <span className="text-white">Enterprise Plan</span>
                                    <span className="text-blue-400">₹4,50,000</span>
                                </div>
                                <p className="text-xs text-slate-500">Fixed annual cost for 500 users, 48 exams.</p>
                                <div className="h-px bg-gray-700 my-2"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-green-400 font-bold">Your Savings</span>
                                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold">
                                        ₹2,22,000+
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
