import React, { useState } from "react";
import img1 from "../resources/img1.png";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    department: "",
    branch: "",
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const err = {};
    if (!formData.name) err.name = "Name required";
    if (!formData.email.includes("@")) err.email = "Invalid email";
    if (!/^\d{10}$/.test(formData.mobile)) err.mobile = "Mobile must be 10 digits";
    if (formData.password !== formData.confirmPassword)
      err.confirmPassword = "Passwords do not match";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setModalMessage("Please fix errors");
      setShowModal(true);
      return;
    }

    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: "student",
        }),
      });

      const data = await res.json();
      setModalMessage(res.ok ? "✅ Registered successfully" : data.error);
    } catch {
      setModalMessage("❌ Server error");
    }

    setShowModal(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 via-blue-500 to-red-800 p-4">
      <div className="flex w-full max-w-5xl h-[640px] bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Left Image */}
        <div className="hidden md:block w-1/2 relative">
          <img src={img1} className="w-full h-full object-cover" alt="bg" />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto">
          <h2 className="text-2xl font-bold text-center mb-6">SIGN UP</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" placeholder="Name" onChange={handleChange} />
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name="mobile" placeholder="Mobile" onChange={handleChange} />

            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />

            <input
              type={showConfirmPass ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
            />

            <input name="department" placeholder="Department" onChange={handleChange} />
            <input name="branch" placeholder="Branch" onChange={handleChange} />

            <button className="w-full bg-blue-800 text-white py-2 rounded">
              Register
            </button>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded">
            <p>{modalMessage}</p>
            <button onClick={() => setShowModal(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
