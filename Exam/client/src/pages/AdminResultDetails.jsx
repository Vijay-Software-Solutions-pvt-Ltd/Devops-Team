import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { FiArrowLeft, FiCheck, FiX, FiClock, FiUser, FiAward, FiDownload } from 'react-icons/fi';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export default function AdminResultDetails() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const reportRef = useRef(null);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const res = await api.get(`/admin/results/${id}`);
            setData(res.data);
        } catch (err) {
            console.error('Failed to fetch details', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        const input = reportRef.current;
        if (!input) return;

        setGenerating(true);

        try {
            // Using html-to-image which is more robust for modern CSS features like CSS variables/grids/calc()
            const dataUrl = await toPng(input, {
                quality: 0.95,
                backgroundColor: '#ffffff'
            });

            // Getting dimensions for PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Calculate image dimensions to fit width
            const imgProps = pdf.getImageProperties(dataUrl);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // If the content is taller than one page, create a long specialized PDF page or handle multi-page
            // For simplicity and "scrollable" feel requested, we make a custom page size that fits the whole content

            const contentHeightMm = (input.clientHeight * 25.4) / 96; // Approximate px to mm

            // Custom PDF size matching content (like a receipt)
            const customPdf = new jsPDF('p', 'mm', [pdfWidth, Math.max(pdfHeight, contentHeightMm + 20)]);

            customPdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, contentHeightMm);
            customPdf.save(`Exam_Report_${data.attempt.user_name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (err) {
            console.error("PDF Generation failed", err);
            alert("Failed to generate PDF. Support for modern CSS might vary.");
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;
    if (!data) return <div className="p-8 text-center text-slate-500">Result not found.</div>;

    const { attempt, answers } = data;

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center mb-6 no-print">
                <Link to="/admin/results" className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors">
                    <FiArrowLeft className="mr-2" /> Back to Results
                </Link>
                <button
                    onClick={handleDownloadPDF}
                    disabled={generating}
                    className={`flex items-center gap-2 px-4 py-2 ${generating ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-lg font-medium transition-colors shadow-sm`}
                >
                    <FiDownload className={generating ? 'animate-bounce' : ''} />
                    {generating ? 'Generating PDF...' : 'Download Report PDF'}
                </button>
            </div>

            {/* This div is what gets captured */}
            <div ref={reportRef} className="bg-slate-50 p-4" style={{ backgroundColor: '#f8fafc' }}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Attempt Overview Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                                <FiUser className="mr-2 text-blue-500" /> Candidate
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Name</label>
                                    <p className="text-lg font-medium text-slate-900">{attempt.user_name}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Email</label>
                                    <p className="text-sm text-slate-600">{attempt.user_email}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Organization</label>
                                    <p className="text-sm text-slate-600">{attempt.org_name || attempt.org_id}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                                <FiAward className="mr-2 text-blue-500" /> Performance
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                    <span className="text-slate-500">Status</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${attempt.status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {attempt.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                    <span className="text-slate-500">Total Score</span>
                                    <span className="text-2xl font-bold text-slate-900">{attempt.total_score}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500">Submitted At</span>
                                    <span className="text-sm text-slate-900 font-mono">
                                        {attempt.finished_at ? new Date(attempt.finished_at).toLocaleString() : '-'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Answers */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800">Response Analysis</h3>
                                <p className="text-sm text-slate-500">Detailed question-wise breakdown</p>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {answers.map((ans, idx) => (
                                    <div key={ans.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-xs font-mono font-bold">
                                                Q{idx + 1}
                                            </span>
                                            <div className="flex items-center space-x-2">
                                                {ans.is_correct ? (
                                                    <span className="flex items-center text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                                        <FiCheck className="mr-1" /> Correct (+{ans.score})
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-red-600 text-sm font-bold bg-red-50 px-2 py-1 rounded-full border border-red-100">
                                                        <FiX className="mr-1" /> Incorrect (0)
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-slate-800 font-medium text-lg mb-4 leading-relaxed">
                                            {typeof ans.question_text === 'string' ? (
                                                (() => {
                                                    try {
                                                        const parsed = JSON.parse(ans.question_text);
                                                        return parsed.title || parsed.question || parsed.text || ans.question_text;
                                                    } catch (e) { return ans.question_text; }
                                                })()
                                            ) : (
                                                ans.question_text?.title || ans.question_text?.question || ans.question_text?.text || JSON.stringify(ans.question_text)
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className={`p-4 rounded-xl border-2 ${ans.is_correct ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}`}>
                                                <label className="block text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">User Answer</label>
                                                <div className="text-slate-900 font-medium">
                                                    {typeof ans.answer_payload === 'string' ? (
                                                        // Try to parse if it's JSON string, else show as is
                                                        (() => {
                                                            try {
                                                                const parsed = JSON.parse(ans.answer_payload);
                                                                return parsed.choice || parsed.code || ans.answer_payload;
                                                            } catch (e) { return ans.answer_payload; }
                                                        })()
                                                    ) : (
                                                        ans.answer_payload?.choice || ans.answer_payload?.code || JSON.stringify(ans.answer_payload)
                                                    )}
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-100">
                                                <label className="block text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">Correct Answer</label>
                                                <div className="text-slate-600 font-medium">
                                                    {typeof ans.correct_answer === 'string' ? (
                                                        (() => {
                                                            try {
                                                                const parsed = JSON.parse(ans.correct_answer);
                                                                return parsed.correct || parsed.output || ans.correct_answer;
                                                            } catch (e) { return ans.correct_answer; }
                                                        })()
                                                    ) : (
                                                        ans.correct_answer?.correct || JSON.stringify(ans.correct_answer)
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
