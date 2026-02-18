import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, BarChart2, Smartphone, Monitor, Code, Zap, Globe, Lock } from 'lucide-react';

const features = [
    {
        title: 'AI Proctoring',
        description: 'Advanced AI monitors behavior, detecting suspicious activities like tab switching, multiple faces, or absence.',
        icon: ShieldCheck,
        color: 'text-rose-500',
        bg: 'bg-rose-500/10'
    },
    {
        title: 'Advanced Analytics',
        description: 'Deep dive into student performance with topic-wise heatmaps, time analysis, and growth tracking.',
        icon: BarChart2,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
    },
    {
        title: 'Mobile Accessibility',
        description: 'Optimized for all devices. Students can take exams on smartphones, tablets, or laptops seamlessly.',
        icon: Smartphone,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10'
    },
    {
        title: 'White Labeling',
        description: 'Your brand, your portal. Custom domains, logos, and color themes to match your institution\'s identity.',
        icon: Monitor,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10'
    },
    {
        title: 'Coding Assessments',
        description: 'Integrated compiler supporting multiple languages for technical assessments and automated grading.',
        icon: Code,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10'
    },
    {
        title: 'Scalable Infrastructure',
        description: 'cloud-native architecture ensures stability even with thousands of concurrent test-takers.',
        icon: Zap,
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10'
    },
    {
        title: 'Global Reach',
        description: 'Low-latency connections through CDNs ensure students anywhere in the world have a smooth experience.',
        icon: Globe,
        color: 'text-cyan-500',
        bg: 'bg-cyan-500/10'
    },
    {
        title: 'Enterprise Security',
        description: 'Data encryption at rest and in transit, GDPR compliance, and role-based access control.',
        icon: Lock,
        color: 'text-slate-500',
        bg: 'bg-slate-500/10'
    }
];

export default function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-base font-bold text-blue-600 tracking-widest uppercase"
                    >
                        Why Choose Us
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mt-3 text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-5xl"
                    >
                        A Complete Ecosystem for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Digital Assessments</span>
                    </motion.p>
                    <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
                        Powerful tools designed to simplify the examination lifecycle, from creation to certification.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 group"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
