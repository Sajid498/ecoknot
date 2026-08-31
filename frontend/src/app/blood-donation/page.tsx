"use client";

import { useState } from "react";

export default function BloodDonationPage() {

      const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "",
    hospital: "",
    location: "",
    contactNumber: "",
    requiredDate: "",
    unitsNeeded: "",
    urgency: "NORMAL",
    description: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

 async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  setIsSubmitting(true);
  setMessage("");

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    const response = await fetch(`${apiUrl}/api/blood-requests`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        ...formData,
        unitsNeeded: Number(formData.unitsNeeded),
        status: "OPEN",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create blood request");
    }

    const createdRequest = await response.json();

    console.log("Created request:", createdRequest);

    setMessage("Blood request created successfully.");

    setFormData({
      patientName: "",
      bloodGroup: "",
      hospital: "",
      location: "",
      contactNumber: "",
      requiredDate: "",
      unitsNeeded: "",
      urgency: "NORMAL",
      description: "",
    });
  } catch (error) {
    console.error(error);

    setMessage(
      "Unable to create blood request. Please check the backend server."
    );
  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b border-red-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="inline-flex rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
            Emergency Blood Support
          </div>

          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            Blood Donation
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Create an emergency blood request and connect with community
            members who may be able to help.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[420px_1fr]">
        {/* Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Create Blood Request
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please provide accurate information for the patient.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {/* Patient Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Patient Name
              </label>

              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
                placeholder="Enter patient name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* Blood Group */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Blood Group
              </label>

              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-red-500"
              >
                <option value="">Select blood group</option>
                <option value="A_POSITIVE">A+</option>
                <option value="A_NEGATIVE">A-</option>
                <option value="B_POSITIVE">B+</option>
                <option value="B_NEGATIVE">B-</option>
                <option value="AB_POSITIVE">AB+</option>
                <option value="AB_NEGATIVE">AB-</option>
                <option value="O_POSITIVE">O+</option>
                <option value="O_NEGATIVE">O-</option>
              </select>
            </div>

            {/* Hospital */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Hospital
              </label>

              <input
                type="text"
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                required
                placeholder="Hospital name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g. Dhanmondi, Dhaka"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Contact Number
              </label>

              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                placeholder="01XXXXXXXXX"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            {/* Date + Units */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Required Date
                </label>

                <input
                  type="date"
                  name="requiredDate"
                  value={formData.requiredDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Units
                </label>

                <input
                  type="number"
                  min="1"
                  name="unitsNeeded"
                  value={formData.unitsNeeded}
                  onChange={handleChange}
                  required
                  placeholder="2"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Urgency
              </label>

              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-red-500"
              >
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Additional Information
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Add any important information..."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
              />
            </div>
{message && (
  <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700">
    {message}
  </div>
)}
            <button
              type="submit"
              className="w-full rounded-xl bg-red-600 px-5 py-3.5 font-semibold text-white transition hover:bg-red-700"
            >
              Create Blood Request
            </button>
          </form>
        </div>

        {/* Right Side */}
        <div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Active Blood Requests
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Emergency blood requests from the EcoKnot community.
                </p>
              </div>
            </div>

            {/* Temporary placeholder */}
            <div className="mt-8 rounded-2xl border-2 border-dashed border-slate-200 px-6 py-14 text-center">
              <div className="text-4xl">🩸</div>

              <h3 className="mt-4 font-bold text-slate-800">
                Blood requests will appear here
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                In the next step, this section will load real requests from
                our Spring Boot API.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}