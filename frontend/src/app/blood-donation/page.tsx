"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type BloodRequest = {
  id: number;
  patientName: string;
  bloodGroup: string;
  hospital: string;
  location: string;
  contactNumber: string;
  requiredDate: string;
  unitsNeeded: number;
  urgency: string;
  description: string;
  status: string;
};

export default function BloodDonationPage() {
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

  const [requests, setRequests] = useState<BloodRequest[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [message, setMessage] = useState("");

  const [searchLocation, setSearchLocation] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // -----------------------------
  // Form change
  // -----------------------------
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

  // -----------------------------
  // Load all blood requests
  // -----------------------------
  async function loadBloodRequests() {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${API_URL}/api/blood-requests`
      );

      if (!response.ok) {
        throw new Error("Failed to load blood requests");
      }

      const data: BloodRequest[] = await response.json();

      setRequests(data);
    } catch (error) {
      console.error(
        "Error loading blood requests:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  }

  // -----------------------------
  // Load data when page opens
  // -----------------------------
  useEffect(() => {
    loadBloodRequests();
  }, []);

  // -----------------------------
  // Create blood request
  // -----------------------------
  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/blood-requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...formData,
            unitsNeeded: Number(formData.unitsNeeded),
            status: "OPEN",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to create blood request"
        );
      }

      const createdRequest = await response.json();

      console.log(
        "Created request:",
        createdRequest
      );

      setMessage(
        "Blood request created successfully."
      );

      // Clear form
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

      // Clear filters
      setSearchLocation("");
      setBloodGroupFilter("");
      setStatusFilter("");

      // Reload requests
      await loadBloodRequests();
    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to create blood request. Please check the backend server."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // -----------------------------
  // Search by location
  // -----------------------------
  async function searchByLocation() {
    try {
      setIsLoading(true);

      setBloodGroupFilter("");
      setStatusFilter("");

      if (!searchLocation.trim()) {
        await loadBloodRequests();
        return;
      }

      const response = await fetch(
        `${API_URL}/api/blood-requests/search?location=${encodeURIComponent(
          searchLocation
        )}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to search blood requests"
        );
      }

      const data: BloodRequest[] = await response.json();

      setRequests(data);
    } catch (error) {
      console.error(
        "Location search error:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  }

  // -----------------------------
  // Filter by blood group
  // -----------------------------
  async function filterByBloodGroup(
    value: string
  ) {
    setBloodGroupFilter(value);

    // Clear other filters
    setSearchLocation("");
    setStatusFilter("");

    try {
      setIsLoading(true);

      if (!value) {
        await loadBloodRequests();
        return;
      }

      const response = await fetch(
        `${API_URL}/api/blood-requests/blood-group/${value}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to filter by blood group"
        );
      }

      const data: BloodRequest[] = await response.json();

      setRequests(data);
    } catch (error) {
      console.error(
        "Blood group filter error:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  }

  // -----------------------------
  // Filter by status
  // -----------------------------
  async function filterByStatus(value: string) {
    setStatusFilter(value);

    // Clear other filters
    setSearchLocation("");
    setBloodGroupFilter("");

    try {
      setIsLoading(true);

      if (!value) {
        await loadBloodRequests();
        return;
      }

      const response = await fetch(
        `${API_URL}/api/blood-requests/status/${value}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to filter by status"
        );
      }

      const data: BloodRequest[] = await response.json();

      setRequests(data);
    } catch (error) {
      console.error(
        "Status filter error:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  }

  // -----------------------------
  // Reset filters
  // -----------------------------
  async function resetFilters() {
    setSearchLocation("");
    setBloodGroupFilter("");
    setStatusFilter("");

    await loadBloodRequests();
  }

  // -----------------------------
  // Delete request
  // -----------------------------
  async function deleteBloodRequest(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blood request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/blood-requests/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete blood request"
        );
      }

      setRequests((previousRequests) =>
        previousRequests.filter(
          (request) => request.id !== id
        )
      );

      setMessage(
        "Blood request deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete blood request error:",
        error
      );

      alert(
        "Unable to delete blood request."
      );
    }
  }

  // -----------------------------
  // Format blood group
  // -----------------------------
  function formatBloodGroup(
    bloodGroup: string
  ) {
    return bloodGroup
      .replace("_POSITIVE", "+")
      .replace("_NEGATIVE", "-");
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
            Create an emergency blood request and
            connect with community members who may
            be able to help.
          </p>

        </div>
      </section>

      {/* Main Area */}
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[420px_1fr]">

        {/* ================= FORM ================= */}
        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-bold text-slate-900">
            Create Blood Request
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please provide accurate information for
            the patient.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >

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
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              >
                <option value="">
                  Select blood group
                </option>

                <option value="A_POSITIVE">
                  A+
                </option>

                <option value="A_NEGATIVE">
                  A-
                </option>

                <option value="B_POSITIVE">
                  B+
                </option>

                <option value="B_NEGATIVE">
                  B-
                </option>

                <option value="AB_POSITIVE">
                  AB+
                </option>

                <option value="AB_NEGATIVE">
                  AB-
                </option>

                <option value="O_POSITIVE">
                  O+
                </option>

                <option value="O_NEGATIVE">
                  O-
                </option>
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
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
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
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
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
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
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
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
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
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              >
                <option value="NORMAL">
                  Normal
                </option>

                <option value="URGENT">
                  Urgent
                </option>

                <option value="CRITICAL">
                  Critical
                </option>
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
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* Message */}
            {message && (
              <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700">
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-red-600 px-5 py-3.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Creating Request..."
                : "Create Blood Request"}
            </button>

          </form>
        </div>

        {/* ================= REQUEST LIST ================= */}
        <div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Active Blood Requests
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Emergency blood requests from the
                EcoKnot community.
              </p>
            </div>

            {/* ================= FILTERS ================= */}
            <div className="mt-6 grid gap-3 md:grid-cols-3">

              {/* Location Search */}
              <div className="flex">

                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) =>
                    setSearchLocation(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchByLocation();
                    }
                  }}
                  placeholder="Search location"
                  className="min-w-0 flex-1 rounded-l-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                />

                <button
                  type="button"
                  onClick={searchByLocation}
                  className="rounded-r-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Search
                </button>

              </div>

              {/* Blood Filter */}
              <select
                value={bloodGroupFilter}
                onChange={(e) =>
                  filterByBloodGroup(
                    e.target.value
                  )
                }
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-red-500"
              >
                <option value="">
                  All Blood Groups
                </option>

                <option value="A_POSITIVE">
                  A+
                </option>

                <option value="A_NEGATIVE">
                  A-
                </option>

                <option value="B_POSITIVE">
                  B+
                </option>

                <option value="B_NEGATIVE">
                  B-
                </option>

                <option value="AB_POSITIVE">
                  AB+
                </option>

                <option value="AB_NEGATIVE">
                  AB-
                </option>

                <option value="O_POSITIVE">
                  O+
                </option>

                <option value="O_NEGATIVE">
                  O-
                </option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) =>
                  filterByStatus(
                    e.target.value
                  )
                }
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-red-500"
              >
                <option value="">
                  All Status
                </option>

                <option value="OPEN">
                  Open
                </option>

                <option value="FULFILLED">
                  Fulfilled
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>
              </select>

            </div>

            {/* Reset */}
            <button
              type="button"
              onClick={resetFilters}
              className="mt-3 text-sm font-semibold text-red-600 transition hover:text-red-700"
            >
              Reset Filters
            </button>

            {/* ================= CARDS ================= */}
            <div className="mt-8 space-y-4">

              {isLoading ? (

                <div className="rounded-2xl border border-slate-200 p-8 text-center">
                  <p className="text-slate-500">
                    Loading blood requests...
                  </p>
                </div>

              ) : requests.length === 0 ? (

                <div className="rounded-2xl border-2 border-dashed border-slate-200 px-6 py-14 text-center">

                  <div className="text-4xl">
                    🩸
                  </div>

                  <h3 className="mt-4 font-bold text-slate-800">
                    No blood requests found
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Try changing the filters or
                    create a new request.
                  </p>

                </div>

              ) : (

                requests.map((request) => (

                  <div
                    key={request.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        {/* Blood Group + Urgency */}
                        <div className="flex flex-wrap items-center gap-2">

                          <span className="rounded-lg bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                            {formatBloodGroup(
                              request.bloodGroup
                            )}
                          </span>

                          <span
                            className={`rounded-lg px-3 py-1 text-xs font-bold ${
                              request.urgency ===
                              "CRITICAL"
                                ? "bg-red-100 text-red-700"
                                : request.urgency ===
                                  "URGENT"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {request.urgency}
                          </span>

                        </div>

                        <h3 className="mt-4 text-lg font-bold text-slate-900">
                          {request.patientName}
                        </h3>

                        <p className="mt-1 text-sm font-medium text-slate-600">
                          {request.hospital}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {request.location}
                        </p>

                      </div>

                      {/* Units */}
                      <div className="min-w-fit text-right">

                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Units Needed
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                          {request.unitsNeeded}
                        </p>

                      </div>

                    </div>

                    {/* Date + Contact */}
                    <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Required Date
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {request.requiredDate}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Contact
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {request.contactNumber}
                        </p>
                      </div>

                    </div>

                    {/* Description */}
                    {request.description && (
                      <p className="mt-4 text-sm leading-6 text-slate-600">
                        {request.description}
                      </p>
                    )}

                    {/* Status */}
                    <div className="mt-5">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          request.status === "OPEN"
                            ? "bg-green-100 text-green-700"
                            : request.status ===
                              "FULFILLED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {request.status}
                      </span>

                    </div>

                    {/* Delete */}
                    <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">

                      <button
                        type="button"
                        onClick={() =>
                          deleteBloodRequest(
                            request.id
                          )
                        }
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete Request
                      </button>

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}