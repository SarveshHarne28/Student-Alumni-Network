import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaClipboardList,
} from "react-icons/fa";

const StudentDashboard = () => {
  const [studentName, setStudentName] = useState("");
  const [applications, setApplications] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [summary, setSummary] = useState({
    applied: 0,
    underReview: 0,
    selected: 0,
    rejected: 0,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const studentId = localStorage.getItem("studentId"); // Make sure you're storing this on login

  // Fetch student profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/students/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStudentName(data.name || "Student");
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    fetchProfile();
  }, [studentId, token]);

  // Fetch student applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(`/api/applications/student/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        setApplications(data.slice(0, 5)); // only recent 5 apps

        // Build summary
        let applied = data.length;
        let underReview = data.filter((a) => a.status === "Pending").length;
        let selected = data.filter((a) => a.status === "Accepted").length;
        let rejected = data.filter((a) => a.status === "Rejected").length;

        setSummary({ applied, underReview, selected, rejected });
      } catch (err) {
        console.error("Error fetching applications", err);
      }
    };

    fetchApplications();
  }, [studentId, token]);

  // Fetch latest opportunities
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await fetch("/api/opportunities", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOpportunities(data.slice(0, 4)); // latest 4
      } catch (err) {
        console.error("Error fetching opportunities", err);
      }
    };

    fetchOpportunities();
  }, [token]);

  const handleApply = (id) => {
    navigate(`/apply/${id}`);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="text-2xl font-bold">
        Welcome back, {studentName}! 👋
        <div className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-100 rounded-xl p-4 flex items-center shadow">
          <FaClipboardList className="text-blue-600 text-3xl mr-3" />
          <div>
            <div className="text-xl font-bold">{summary.applied}</div>
            <div className="text-gray-600">Applied</div>
          </div>
        </div>

        <div className="bg-yellow-100 rounded-xl p-4 flex items-center shadow">
          <FaHourglassHalf className="text-yellow-600 text-3xl mr-3" />
          <div>
            <div className="text-xl font-bold">{summary.underReview}</div>
            <div className="text-gray-600">Under Review</div>
          </div>
        </div>

        <div className="bg-green-100 rounded-xl p-4 flex items-center shadow">
          <FaCheckCircle className="text-green-600 text-3xl mr-3" />
          <div>
            <div className="text-xl font-bold">{summary.selected}</div>
            <div className="text-gray-600">Selected</div>
          </div>
        </div>

        <div className="bg-red-100 rounded-xl p-4 flex items-center shadow">
          <FaTimesCircle className="text-red-600 text-3xl mr-3" />
          <div>
            <div className="text-xl font-bold">{summary.rejected}</div>
            <div className="text-gray-600">Rejected</div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div>
        <h2 className="text-xl font-semibold mb-3">📝 My Recent Applications</h2>
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Company</th>
                <th className="p-3">Position</th>
                <th className="p-3">Applied Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-t">
                  <td className="p-3">{app.company_name}</td>
                  <td className="p-3">{app.position}</td>
                  <td className="p-3">
                    {new Date(app.applied_date).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        app.status === "Accepted"
                          ? "bg-green-100 text-green-700"
                          : app.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-500">
                    No applications yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Latest Opportunities */}
      <div>
        <h2 className="text-xl font-semibold mb-3">🆕 Latest Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white shadow rounded-xl p-4 border border-gray-100"
            >
              <h3 className="font-bold text-lg">{opp.title}</h3>
              <p className="text-gray-600">{opp.company_name}</p>
              <p className="text-sm text-gray-500">
                {opp.type} • Deadline:{" "}
                {new Date(opp.deadline).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleApply(opp.id)}
                className="mt-3 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 text-right">
          <button
            onClick={() => navigate("/opportunities")}
            className="text-blue-600 hover:underline"
          >
            View All Opportunities →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
