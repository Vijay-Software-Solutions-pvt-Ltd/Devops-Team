import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FiDownload, FiSearch, FiEye, FiFilter } from 'react-icons/fi';

export default function AdminResults() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        org_id: '',
        user_id: '',
        exam_id: ''
    });
    const [orgs, setOrgs] = useState([]);

    useEffect(() => {
        fetchOrgs();
        fetchResults();
    }, []);

    const fetchOrgs = async () => {
        try {
            const res = await api.get('/admin/orgs'); // Assuming this endpoint exists based on routes
            setOrgs(res.data.orgs || res.data);
        } catch (err) {
            console.error('Failed to fetch orgs', err);
        }
    };

    const fetchResults = async () => {
        setLoading(true);
        try {
            // Build query string
            const params = new URLSearchParams();
            if (filters.org_id) params.append('org_id', filters.org_id);
            if (filters.user_id) params.append('user_id', filters.user_id);
            if (filters.exam_id) params.append('exam_id', filters.exam_id);

            const res = await api.get(`/admin/results?${params.toString()}`);
            setResults(res.data);
        } catch (err) {
            console.error('Failed to fetch results', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchResults();
    };

    // Fallback CSV export if XLSX is not installed
    const handleExportCSV = () => {
        const header = ['Attempt ID', 'User Name', 'User Email', 'Organization', 'Exam Title', 'Score', 'Status', 'Started At', 'Finished At'];
        const rows = results.map(r => [
            r.id,
            r.user_name,
            r.user_email,
            r.org_name || r.org_id,
            r.exam_title,
            r.total_score,
            r.status,
            new Date(r.started_at_server).toLocaleString(),
            r.finished_at ? new Date(r.finished_at).toLocaleString() : '-'
        ]);

        const csvContent = [
            header.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `exam_results_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Exam Results</h1>
                    <p className="text-slate-500 mt-1">Real-time monitoring of student performance</p>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                    <FiDownload />
                    <span>Export CSV</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Organization</label>
                        <div className="relative">
                            <select
                                name="org_id"
                                value={filters.org_id}
                                onChange={handleFilterChange}
                                className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                            >
                                <option value="">All Organizations</option>
                                {orgs.map(org => (
                                    <option key={org.id} value={org.id}>{org.name} ({org.id})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">User ID / Email</label>
                        <input
                            type="text"
                            name="user_id"
                            value={filters.user_id}
                            onChange={handleFilterChange}
                            placeholder="Search by User ID..."
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Exam ID</label>
                        <input
                            type="text"
                            name="exam_id"
                            value={filters.exam_id}
                            onChange={handleFilterChange}
                            placeholder="Filter by Exam ID..."
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors shadow-md flex justify-center items-center space-x-2"
                    >
                        <FiSearch />
                        <span>Apply Filters</span>
                    </button>
                </form>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-500">Loading results...</div>
                ) : results.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">No results found matching your criteria.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Organization</th>
                                    <th className="px-6 py-4">Exam</th>
                                    <th className="px-6 py-4">Score</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {results.map((result) => (
                                    <tr key={result.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{result.user_name}</div>
                                            <div className="text-xs text-slate-500">{result.user_email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {result.org_name || <span className="font-mono text-xs">{result.org_id}</span>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                            {result.exam_title}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${result.total_score >= 80 ? 'bg-green-100 text-green-800' :
                                                result.total_score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {result.total_score || 0} pts
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${result.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                                                result.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-slate-100 text-slate-800'
                                                }`}>
                                                {result.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(result.started_at_server).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                to={`/admin/results/${result.id}`}
                                                className="inline-flex items-center justify-center p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                                title="View Details"
                                            >
                                                <FiEye className="w-5 h-5" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
