import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Calculator, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PricingSection() {
    const navigate = useNavigate();

    // Calculator State
    const [numUsers, setNumUsers] = useState(1000);
    const [examsPerMonth, setExamsPerMonth] = useState(4);
    const [tenureMonths, setTenureMonths] = useState(12);

    const enterpriseFeatures = [
        'Up to 1000 Concurrent Students',
        '4 Exams per Month (48/Year)',
        'Effective Rate: ~₹8.75/student/exam',
        '24/7 Unlimited Access',
        'Dedicated Monthly Maintenance',
        '99.9% Uptime Guarantee'
    ];

    const payPerExamFeatures = [
        'Flexible, on-demand testing',
        'Pay only for what you use',
        'Standard Email & Chat Support',
        'Suitable for irregular schedules'
    ];

    // Dynamic Price Calculation
    const calculateCustomPrice = () => {
        const totalExams = examsPerMonth * tenureMonths;
        const totalUnits = numUsers * totalExams;

        let ratePerUnit = 18;
        if (totalUnits >= 12000) ratePerUnit = 12;
        if (totalUnits >= 24000) ratePerUnit = 10;
        if (totalUnits >= 48000) ratePerUnit = 8.75;
        if (totalUnits >= 100000) ratePerUnit = 7.5;

        let discount = 0;
        if (tenureMonths > 12) discount = 0.10;

        const basePrice = totalUnits * ratePerUnit;
        const finalPrice = basePrice * (1 - discount);

        return Math.round(finalPrice);
    };

    return (
        <section id="pricing" className="py-24 bg-slate-50 relative overflow-hidden font-sans">
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center space-x-2 bg-blue-100/50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-blue-200"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Transparent & Scalable Pricing</span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                        Invest in the Future of <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            Digital Assessments
                        </span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed font-normal">
                        Purpose-built for high-volume academic institutions, our plans bring down the cost per exam drastically while ensuring a completely robust and secure proctoring environment.
                    </p>
                </div>

                {/* Pre-packaged Plans Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">

                    {/* Enterprise / Institutional Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative bg-white rounded-3xl p-8 sm:p-10 border-2 border-blue-500 shadow-[0_8px_30px_rgb(59,130,246,0.12)] flex flex-col hover:shadow-[0_8px_40px_rgb(59,130,246,0.2)] transition-shadow duration-300 transform md:-translate-y-4"
                    >
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-md w-max">
                            HIGHLY RECOMMENDED
                        </div>

                        <div className="mb-6 mt-4">
                            <h3 className="text-2xl font-bold text-slate-900">Institutional Deal</h3>
                            <p className="text-slate-500 mt-2 font-medium">The comprehensive package for large continuous batches.</p>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-baseline text-slate-900">
                                <span className="text-5xl font-extrabold tracking-tight">₹4,20,000</span>
                                <span className="text-lg text-slate-500 font-medium ml-2">/ year</span>
                            </div>
                            <p className="text-sm text-blue-600 mt-3 font-semibold bg-blue-50 inline-block px-3 py-1 rounded-md">
                                Includes Monthly Maintenance Support ✨
                            </p>
                        </div>

                        <ul className="mb-10 space-y-5 flex-1 text-slate-700">
                            {enterpriseFeatures.map((feature, idx) => (
                                <li key={idx} className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                                        <Check className="w-4 h-4 text-blue-600 font-bold" />
                                    </div>
                                    <span className="font-medium text-[15px]">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => navigate('/checkout?plan=institutional')}
                            className="group w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center"
                        >
                            Choose Institutional Plan
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>

                    {/* Pay-per-Exam Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg flex flex-col hover:border-slate-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-10 -mt-10"></div>

                        <div className="mb-6 relative">
                            <h3 className="text-2xl font-bold text-slate-900">Flexi-Scale</h3>
                            <p className="text-slate-500 mt-2 font-medium">For smaller batches or irregular testing schedules.</p>
                        </div>

                        <div className="mb-8 relative">
                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                                <div className="flex justify-between items-center text-slate-700 border-b border-slate-200 pb-3">
                                    <span className="font-medium">Up to 250 Students</span>
                                    <span className="font-bold text-slate-900 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">₹12,000 <span className="text-xs font-normal text-slate-500">/exam</span></span>
                                </div>
                                <div className="flex justify-between items-center text-slate-700 border-b border-slate-200 pb-3">
                                    <span className="font-medium">251 - 500 Students</span>
                                    <span className="font-bold text-slate-900 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">₹18,000 <span className="text-xs font-normal text-slate-500">/exam</span></span>
                                </div>
                                <div className="flex justify-between items-center text-slate-700">
                                    <span className="font-medium">501 - 1000 Students</span>
                                    <span className="font-bold text-slate-900 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">₹25,000 <span className="text-xs font-normal text-slate-500">/exam</span></span>
                                </div>
                            </div>
                        </div>

                        <ul className="mb-10 space-y-5 flex-1 text-slate-600 relative">
                            {payPerExamFeatures.map((feature, idx) => (
                                <li key={idx} className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center mr-3 mt-0.5">
                                        <Star className="w-3.5 h-3.5 text-slate-500" />
                                    </div>
                                    <span className="font-medium text-[15px]">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => navigate('/checkout?plan=flexi')}
                            className="group w-full py-4 rounded-xl bg-slate-800 text-white font-bold text-lg hover:bg-slate-900 transition-all flex items-center justify-center shadow-md relative"
                        >
                            Choose Flexi-Scale
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>

                {/* Custom Interactive Calculator Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl relative"
                >
                    <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>

                    <div className="p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-center md:items-start mb-10 text-center md:text-left gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                                <Calculator className="w-7 h-7 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">Build Your Custom Plan</h3>
                                <p className="text-slate-500 font-medium">Adjust the parameters to estimate a predictive structural plan tailored perfectly to your unique scale.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

                            {/* Sliders Area */}
                            <div className="lg:col-span-7 space-y-10">
                                {/* Slider 1: Users */}
                                <div className="relative">
                                    <div className="flex justify-between items-end mb-4">
                                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Concurrent Users Capacity</label>
                                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold border border-blue-100 shadow-sm">{numUsers} Students</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="100" max="2500" step="100"
                                        value={numUsers}
                                        onChange={(e) => setNumUsers(Number(e.target.value))}
                                        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
                                    />
                                    <div className="flex justify-between text-xs text-slate-400 font-medium mt-2">
                                        <span>100</span>
                                        <span>2500+</span>
                                    </div>
                                </div>

                                {/* Slider 2: Exams */}
                                <div className="relative">
                                    <div className="flex justify-between items-end mb-4">
                                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Exams Conducted Monthly</label>
                                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold border border-blue-100 shadow-sm">{examsPerMonth} Exams</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1" max="10" step="1"
                                        value={examsPerMonth}
                                        onChange={(e) => setExamsPerMonth(Number(e.target.value))}
                                        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
                                    />
                                    <div className="flex justify-between text-xs text-slate-400 font-medium mt-2">
                                        <span>1/mo</span>
                                        <span>10+/mo</span>
                                    </div>
                                </div>

                                {/* Slider 3: Duration */}
                                <div className="relative">
                                    <div className="flex justify-between items-end mb-4">
                                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Commitment Tenure</label>
                                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold border border-blue-100 shadow-sm">{tenureMonths} Months</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1" max="24" step="1"
                                        value={tenureMonths}
                                        onChange={(e) => setTenureMonths(Number(e.target.value))}
                                        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
                                    />
                                    <div className="flex justify-between text-xs text-slate-400 font-medium mt-2">
                                        <span>1 Month</span>
                                        <span>2 Years</span>
                                    </div>

                                    {tenureMonths > 12 && (
                                        <p className="absolute -bottom-6 right-0 text-xs font-bold text-emerald-600 flex items-center">
                                            <Zap className="w-3 h-3 mr-1" /> Multi-year discount unlocked
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Summary Card Area */}
                            <div className="lg:col-span-5 relative">
                                <div className="bg-slate-900 rounded-2xl p-8 shadow-xl h-full flex flex-col justify-center items-center text-center relative overflow-hidden">
                                    {/* Abstract background shapes inside the dark card */}
                                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
                                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

                                    <div className="relative z-10 w-full">
                                        <p className="text-slate-300 text-sm uppercase tracking-widest font-bold mb-3">
                                            Live Estimate
                                        </p>
                                        <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2 tracking-tight">
                                            <span className="text-blue-400 mr-1">₹</span>
                                            {calculateCustomPrice().toLocaleString()}
                                        </div>
                                        <p className="text-indigo-300 text-xs font-semibold mb-8 tracking-wide">
                                            + Secure Maintenance & Support
                                        </p>

                                        <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-5 mb-8 border border-slate-700/50 space-y-3">
                                            <div className="flex justify-between text-sm items-center">
                                                <span className="text-slate-400 font-medium">Total Volume:</span>
                                                <span className="font-bold text-white bg-slate-700 px-2.5 py-1 rounded-md">{examsPerMonth * tenureMonths} Exams</span>
                                            </div>
                                            <div className="flex justify-between border-t border-slate-700 pt-3">
                                                <span className="text-slate-400 font-medium">Effective Net Rate:</span>
                                                <span className="font-extrabold text-emerald-400">
                                                    ₹{(calculateCustomPrice() / (numUsers * examsPerMonth * tenureMonths)).toFixed(2)}
                                                    <span className="text-[10px] text-slate-500 ml-1 font-medium">/ unit</span>
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/checkout?plan=custom&amount=${calculateCustomPrice()}`)}
                                            className="w-full py-4 rounded-xl bg-white text-slate-900 font-extrabold text-lg hover:bg-gray-100 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transform hover:-translate-y-0.5"
                                        >
                                            Generate Payment Link
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Value Proposition Highlight */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-20 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-blue-50/50 border border-blue-100/50 p-6 md:p-8 rounded-2xl"
                >
                    <div className="flex-1 text-center md:text-left">
                        <h4 className="text-xl font-bold text-slate-900 mb-2 flex items-center justify-center md:justify-start">
                            <Zap className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" />
                            Massive Scale Advantage
                        </h4>
                        <p className="text-slate-600 font-medium text-sm md:text-base pr-0 md:pr-4">
                            Standard market rates hover between ₹25 - ₹40 per proctored session online. Our structural architecture allows us to collapse this to <strong className="text-blue-700">~₹8.75/session</strong> on the Institutional Plan.
                        </p>
                    </div>
                    <div className="flex-shrink-0 w-full md:w-auto">
                        <div className="bg-white border border-slate-200 px-6 py-4 rounded-xl shadow-sm text-center">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Scale Savings</div>
                            <div className="text-2xl font-black text-emerald-600">Up to 75% Off</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
