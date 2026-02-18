import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function VideoSection() {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <section className="py-24 bg-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                >
                    <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase mb-2">
                        Product Walkthrough
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-8">
                        See ExamPortal in Action
                    </h3>

                    {/* Video Container - Browser Window Style */}
                    <div className="relative w-full max-w-5xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 group">

                        {/* Browser Header Bar */}
                        <div className="absolute top-0 left-0 right-0 h-8 bg-slate-800 flex items-center px-4 space-x-2 z-20">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            <div className="flex-1 text-center">
                                <span className="text-xs text-slate-400 font-mono">dashboard.examportal.com</span>
                            </div>
                        </div>

                        {/* Video Element */}
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover pt-8 bg-slate-900"
                            autoPlay
                            loop
                            muted
                            playsInline
                            poster="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80"
                        >
                            {/* Using a reliable tech-related stock video */}
                            <source src="https://cdn.coverr.co/videos/coverr-typing-on-computer-keyboard-5169/1080p.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        {/* Overlay Controls */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between">
                            <button
                                onClick={togglePlay}
                                className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-all"
                            >
                                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                            </button>

                            <button
                                onClick={toggleMute}
                                className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-all"
                            >
                                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                            </button>
                        </div>

                    </div>

                    {/* Decorative blurred glow behind */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-2xl opacity-20 -z-10 transform scale-95 translate-y-4"></div>
                </motion.div>
            </div>
        </section>
    );
}
