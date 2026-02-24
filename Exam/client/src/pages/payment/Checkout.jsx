import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://razorpay-backend-931100197216.asia-south1.run.app";

export default function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();

    // Parse query params to get plan details
    const searchParams = new URLSearchParams(location.search);
    const plan = searchParams.get("plan") || "institutional";
    const amountParam = searchParams.get("amount");
    const overrideAmount = amountParam ? parseInt(amountParam, 10) : null;

    let baseAmount = overrideAmount;
    if (!baseAmount) {
        if (plan === "institutional") baseAmount = 420000;
        else if (plan === "flexi") baseAmount = 18000;
        else baseAmount = 10000; // fallback
    }

    const [form, setForm] = useState({
        orgName: "", firstName: "", lastName: "", email: "", phone: "",
        password: "", confirmPassword: "",
        street: "", city: "", state: "", zipCode: "", country: ""
    });
    const [coupon, setCoupon] = useState("");
    const [loading, setLoading] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [couponError, setCouponError] = useState("");

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    // Since it's a microservice, we will use the fetch API
    const validateCoupon = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/coupons/validate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ couponCode: coupon, trainingId: plan === "institutional" ? 1 : 2 }) // fallback training IDs to bypass required fields
            });
            const data = await response.json();
            if (data.valid) {
                const discountAmount = Math.round(baseAmount * (data.discount_percent / 100));
                setDiscount(discountAmount);
                setIsCouponApplied(true);
                setCouponError("");
            } else {
                throw new Error(data.message || "Invalid coupon");
            }
        } catch (err) {
            setDiscount(0);
            setIsCouponApplied(false);
            setCouponError(err.message || "Invalid or expired coupon");
        }
    };

    const handlePayNow = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            // Need a new or modified backend route to handle arbitrary subscription payments,
            // or we use the custom one we just discussed building.
            const response = await fetch(`${BASE_URL}/api/subscription/checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plan,
                    baseAmount, // tell the backend exactly how much if custom
                    couponCode: coupon,
                    ...form
                })
            });

            const data = await response.json();

            if (!data.razorpay_key) {
                throw new Error(data.error || "Payment initiation failed");
            }

            const options = {
                key: data.razorpay_key,
                amount: data.amount, // from backend
                currency: "INR",
                order_id: data.order_id,
                name: "ExamPortal by Vijay Software",
                description: `Subscription: ${plan.toUpperCase()}`,
                handler: async function (response) {
                    try {
                        const subscribeRes = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth/subscribe` : "http://localhost:8082/auth/subscribe", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                orgName: form.orgName,
                                firstName: form.firstName,
                                lastName: form.lastName,
                                email: form.email,
                                password: form.password,
                                phone: form.phone,
                                address: `${form.street}, ${form.city}, ${form.state} ${form.zipCode}, ${form.country}`,
                                plan
                            })
                        });
                        const subscribeData = await subscribeRes.json();
                        if (!subscribeRes.ok) throw new Error(subscribeData.error || "Failed to register subscription credentials.");

                        alert("Payment successful! Subscription activated. You can now log in.");
                        navigate("/login");
                    } catch (err) {
                        alert("Payment was successful but we couldn't create your account: " + err.message);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: `${form.firstName} ${form.lastName}`,
                    email: form.email,
                    contact: form.phone
                },
                theme: { color: "#4f46e5" }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                alert("Payment failed: " + response.error.description);
                setLoading(false);
            });
            rzp.open();

        } catch (error) {
            alert(error.message);
            setLoading(false);
        }
    };

    const totalAmount = baseAmount - discount;

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 font-sans text-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-4 mb-8">
                    <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-700 font-medium flex items-center transition">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back
                    </button>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Complete your Subscription
                    </h1>
                </div>

                <form onSubmit={handlePayNow} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* LEFT SIDE: BILLING */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-6 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 text-slate-800 border-b border-slate-100 pb-4">Organization & Billing</h2>

                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Organization / Institution Name <span className="text-red-500">*</span></label>
                            <input onChange={handleChange} name="orgName" value={form.orgName} type="text" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg py-2.5 px-4 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required placeholder="University / Company Name" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
                                <input onChange={handleChange} name="firstName" value={form.firstName} type="text" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg py-2.5 px-4 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Last Name</label>
                                <input onChange={handleChange} name="lastName" value={form.lastName} type="text" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg py-2.5 px-4 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                                <input onChange={handleChange} name="email" value={form.email} type="email" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg py-2.5 px-4 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone <span className="text-red-500">*</span></label>
                                <input onChange={handleChange} name="phone" value={form.phone} type="tel" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg py-2.5 px-4 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                                <input onChange={handleChange} name="password" value={form.password} type="password" minLength="6" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg py-2.5 px-4 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required placeholder="To access your dashboard" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                                <input onChange={handleChange} name="confirmPassword" value={form.confirmPassword} type="password" minLength="6" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg py-2.5 px-4 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required placeholder="Re-enter password" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address <span className="text-red-500">*</span></label>
                            <input onChange={handleChange} name="street" value={form.street} type="text" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg py-2.5 px-4 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all mb-3" required placeholder="Street Address" />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-3">
                                <input onChange={handleChange} name="city" value={form.city} type="text" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg py-2.5 px-4 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required placeholder="City" />
                                <input onChange={handleChange} name="state" value={form.state} type="text" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg py-2.5 px-4 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required placeholder="State / Province" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <input onChange={handleChange} name="zipCode" value={form.zipCode} type="text" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg py-2.5 px-4 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required placeholder="Zip Code" />
                                <input onChange={handleChange} name="country" value={form.country} type="text" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg py-2.5 px-4 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required placeholder="Country" />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: ORDER SUMMARY */}
                    <div className="lg:col-span-5 xl:col-span-4 h-full relative">
                        {/* Sticky container for larger screens */}
                        <div className="sticky top-24 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl flex flex-col justify-between overflow-hidden">
                            {/* Decorative top accent */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

                            <div>
                                <h2 className="text-xl font-bold mb-6 text-slate-800 border-b border-slate-100 pb-4">Order Summary</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-4 rounded-xl">
                                        <span className="font-semibold text-slate-600">Plan: <span className="text-slate-900 capitalize ml-1">{plan}</span></span>
                                        <span className="font-bold text-slate-900">₹{baseAmount.toLocaleString()}</span>
                                    </div>

                                    <div className="mt-6">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Coupon Code</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={coupon}
                                                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                                                placeholder="Enter code"
                                                className="bg-white border border-slate-200 text-slate-900 rounded-lg py-2.5 px-4 flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase font-medium"
                                            />
                                            <button type="button" onClick={validateCoupon} className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm">
                                                Apply
                                            </button>
                                        </div>
                                    </div>

                                    {couponError && <p className="text-red-500 text-sm font-medium">{couponError}</p>}
                                    {isCouponApplied && (
                                        <div className="flex justify-between items-center text-emerald-600 font-semibold bg-emerald-50 p-3 rounded-lg border border-emerald-100 mt-2">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                Discount Applied
                                            </span>
                                            <span>- ₹{discount.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-6 bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                                    <span className="text-lg font-bold text-slate-800">Total Due</span>
                                    <span className="text-3xl font-extrabold text-blue-600 flex items-baseline tracking-tight">
                                        <span className="text-blue-500 text-xl mr-1 font-bold">₹</span>
                                        {totalAmount.toLocaleString()}
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex justify-center items-center"
                                >
                                    {loading ? (
                                        <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    ) : (
                                        "Proceed to Pay Secured"
                                    )}
                                </button>
                                <div className="text-center mt-5 flex items-center justify-center text-slate-500 text-sm font-medium">
                                    <svg className="w-4 h-4 mr-1.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    Payments are 100% secured by Razorpay
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
