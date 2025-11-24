import React, { useState } from "react";

export default function SignupForm() {
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.includes("@"))
      newErrors.email = "Valid email is required";
    if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Mobile must be 10 digits";

    const p = formData.password;
    const validPass =
      /[A-Z]/.test(p) &&
      /[a-z]/.test(p) &&
      /[!@#$%^&*(),.?\":{}|<>]/.test(p) &&
      p.length >= 8 &&
      p.length <= 12;

    if (!validPass)
      newErrors.password =
        "Password must include uppercase, lowercase, special char & 8–12 chars";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.department) newErrors.department = "Department required";
    if (!formData.branch) newErrors.branch = "Branch required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setModalMessage("Registration failed. Check errors.");
      setShowModal(true);
      return;
    }

    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          mobile: formData.mobile,
          department: formData.department,
          branch: formData.branch,
          role: "student"
        })
      });

      const data = await res.json();

      if (res.ok) {
        setModalMessage("✅ Registered successfully");
      } else {
        setModalMessage(data.error || "Registration failed");
      }
    } catch (err) {
      console.error("API Error:", err);
      setModalMessage("❌ Server error. Try again later.");
    }

    setShowModal(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 via-blue-500 to-red-800 p-4">

      <div className="flex w-full max-w-5xl h-[640px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Image Section */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src="../resources/img1.png"
            className="w-full h-full object-cover brightness-75 blur-[1.5px]"
            alt="bg"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20"></div>

          <div className="absolute inset-0 flex flex-col justify-center px-10 text-white">
            <h1 className="text-2xl font-bold mb-2">
              Vijay Software Solutions Pvt Ltd -
            </h1>
            <p className="text-md font-semibold mb-4">
              Online Examination Portal
            </p>
            <p className="text-sm opacity-80">
              Start your exam with confidence.
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold">
              VIJAY SOFTWARE SOLUTIONS
            </h1>
          </div>

          <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
            SIGN UP
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            <input name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />

            <div className="relative">
              <input type={showPass ? "text" : "password"} name="password" placeholder="Password"
                value={formData.password} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg" />
              <span onClick={() => setShowPass(!showPass)} className="absolute right-3 top-2 cursor-pointer">
                {showPass ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>

            <div className="relative">
              <input type={showConfirmPass ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password"
                value={formData.confirmPassword} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg" />
              <span onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-2 cursor-pointer">
                {showConfirmPass ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>

            <input name="department" placeholder="Department" value={formData.department} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            <input name="branch" placeholder="Branch" value={formData.branch} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />

            <button className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
              Register
            </button>
          </form>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center max-w-xs">
            <h3 className="text-lg font-semibold">{modalMessage}</h3>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
