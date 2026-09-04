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

const emptyForm = {
  patientName: "",
  bloodGroup: "",
  hospital: "",
  location: "",
  contactNumber: "",
  requiredDate: "",
  unitsNeeded: "",
  urgency: "NORMAL",
  description: "",
  status: "OPEN",
};

export default function BloodDonationPage() {
  const [formData, setFormData] = useState(emptyForm);

  const [requests, setRequests] = useState<BloodRequest[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [message, setMessage] = useState("");

  const [searchLocation, setSearchLocation] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  // =========================
  // FORM CHANGE
  // =========================
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

  // =========================
  // LOAD ALL REQUESTS
  // =========================
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

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    loadBloodRequests();
  }, []);

  // =========================
  // RESET FORM
  // =========================
  function resetForm() {
    setFormData(emptyForm);
    setEditingId(null);
  }

  // =========================
  // CREATE / UPDATE
  // =========================
  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setIsSubmitting(true);
    setMessage("");

    try {
      const isEditing = editingId !== null;

const url = isEditing
    ? `${API_URL}/api/blood-requests/${editingId}/user/1`
    : `${API_URL}/api/blood-requests/user/1`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...formData,
          unitsNeeded: Number(formData.unitsNeeded),

          status: isEditing
            ? formData.status
            : "OPEN",
        }),
      });

      if (!response.ok) {
        throw new Error(
          isEditing
            ? "Failed to update blood request"
            : "Failed to create blood request"
        );
      }

      if (isEditing) {
        setMessage(
          "Blood request updated successfully."
        );
      } else {
        setMessage(
          "Blood request created successfully."
        );
      }

      resetForm();

      setSearchLocation("");
      setBloodGroupFilter("");
      setStatusFilter("");

      await loadBloodRequests();
    } catch (error) {
      console.error(error);

      setMessage(
        editingId !== null
          ? "Unable to update blood request."
          : "Unable to create blood request. Please check the backend server."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // =========================
  // START EDIT
  // =========================
  function editBloodRequest(request: BloodRequest) {
    setEditingId(request.id);

    setFormData({
      patientName: request.patientName,
      bloodGroup: request.bloodGroup,
      hospital: request.hospital,
      location: request.location,
      contactNumber: request.contactNumber,
      requiredDate: request.requiredDate,
      unitsNeeded: String(request.unitsNeeded),
      urgency: request.urgency,
      description: request.description || "",
      status: request.status,
    });

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================
  // CANCEL EDIT
  // =========================
  function cancelEdit() {
    resetForm();

    setMessage(
      "Editing cancelled."
    );
  }

  // =========================
  // SEARCH LOCATION
  // =========================
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

  // =========================
  // BLOOD GROUP FILTER
  // =========================
  async function filterByBloodGroup(
    value: string
  ) {
    setBloodGroupFilter(value);

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

  // =========================
  // STATUS FILTER
  // =========================
  async function filterByStatus(
    value: string
  ) {
    setStatusFilter(value);

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

  // =========================
  // RESET FILTER
  // =========================
  async function resetFilters() {
    setSearchLocation("");
    setBloodGroupFilter("");
    setStatusFilter("");

    await loadBloodRequests();
  }

  // =========================
  // DELETE
  // =========================
  async function deleteBloodRequest(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blood request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/blood-requests/${id}/user/1`,
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

      if (editingId === id) {
        resetForm();
      }

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

  // =========================
  // BLOOD GROUP FORMAT
  // =========================
  function formatBloodGroup(
    bloodGroup: string
  ) {
    return bloodGroup
      .replace("_POSITIVE", "+")
      .replace("_NEGATIVE", "-");
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <section className="border-b border-red-100 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-10">

          <div className="inline-flex rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
            Emergency Blood Support
          </div>

          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            Blood Donation
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Create an emergency blood request and connect
            with community members who may be able to help.
          </p>

        </div>

      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[420px_1fr]">

        {/* ================= FORM ================= */}
        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start justify-between gap-4">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">

                {editingId !== null
                  ? "Update Blood Request"
                  : "Create Blood Request"}

              </h2>

              <p className="mt-2 text-sm text-slate-500">

                {editingId !== null
                  ? "Edit the information and save your changes."
                  : "Please provide accurate information for the patient."}

              </p>
            </div>

            {editingId !== null && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                Editing
              </span>
            )}

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >

            {/* Patient */}
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

                <option value="">
                  Select blood group
                </option>

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

            {/* Status only during Edit */}
            {editingId !== null && (

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-red-500"
                >

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

            )}

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
                placeholder="Add important information..."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
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
                ? editingId !== null
                  ? "Updating Request..."
                  : "Creating Request..."
                : editingId !== null
                ? "Save Changes"
                : "Create Blood Request"}

            </button>

            {/* Cancel Edit */}
            {editingId !== null && (

              <button
                type="button"
                onClick={cancelEdit}
                className="w-full rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel Edit
              </button>

            )}

          </form>

        </div>

        {/* ================= REQUESTS ================= */}
        <div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-2xl font-bold text-slate-900">
              Active Blood Requests
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Emergency blood requests from the EcoKnot community.
            </p>

            {/* FILTERS */}
            <div className="mt-6 grid gap-3 md:grid-cols-3">

              {/* Search */}
              <div className="flex">

                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) =>
                    setSearchLocation(e.target.value)
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
                  className="rounded-r-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Search
                </button>

              </div>

              {/* Blood Group */}
              <select
                value={bloodGroupFilter}
                onChange={(e) =>
                  filterByBloodGroup(e.target.value)
                }
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none"
              >

                <option value="">
                  All Blood Groups
                </option>

                <option value="A_POSITIVE">A+</option>
                <option value="A_NEGATIVE">A-</option>

                <option value="B_POSITIVE">B+</option>
                <option value="B_NEGATIVE">B-</option>

                <option value="AB_POSITIVE">AB+</option>
                <option value="AB_NEGATIVE">AB-</option>

                <option value="O_POSITIVE">O+</option>
                <option value="O_NEGATIVE">O-</option>

              </select>

              {/* Status */}
              <select
                value={statusFilter}
                onChange={(e) =>
                  filterByStatus(e.target.value)
                }
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none"
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

            {/* Reset filters */}
            <button
              type="button"
              onClick={resetFilters}
              className="mt-3 text-sm font-semibold text-red-600 hover:text-red-700"
            >
              Reset Filters
            </button>

            {/* LIST */}
            <div className="mt-8 space-y-4">

              {isLoading ? (

                <div className="rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                  Loading blood requests...
                </div>

              ) : requests.length === 0 ? (

                <div className="rounded-2xl border-2 border-dashed border-slate-200 px-6 py-14 text-center">

                  <div className="text-4xl">
                    🩸
                  </div>

                  <h3 className="mt-4 font-bold text-slate-800">
                    No blood requests found
                  </h3>

                </div>

              ) : (

                requests.map((request) => (

                  <div
                    key={request.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md"
                  >

                    {/* Top */}
                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          {/* Blood */}
                          <span className="rounded-lg bg-red-100 px-3 py-1 text-sm font-bold text-red-700">

                            {formatBloodGroup(
                              request.bloodGroup
                            )}

                          </span>

                          {/* Urgency */}
                          <span
                            className={`rounded-lg px-3 py-1 text-xs font-bold ${
                              request.urgency === "CRITICAL"
                                ? "bg-red-100 text-red-700"
                                : request.urgency === "URGENT"
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
                      <div className="text-right">

                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Units Needed
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                          {request.unitsNeeded}
                        </p>

                      </div>

                    </div>

                    {/* Details */}
                    <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">

                      <div>

                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Required Date
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {request.requiredDate}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs font-semibold uppercase text-slate-400">
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
                            : request.status === "FULFILLED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >

                        {request.status}

                      </span>

                    </div>

                    {/* BUTTONS */}
                    <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() =>
                          editBloodRequest(request)
                        }
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Edit Request
                      </button>

                      {/* Delete */}
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