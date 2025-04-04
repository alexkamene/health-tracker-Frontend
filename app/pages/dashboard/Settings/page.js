"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiDownload, FiFilter, FiLock, FiShield, FiAlertTriangle } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const SecurityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortField, setSortField] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
    } else {
      fetchSecurityLogs(storedToken);
    }
  }, [router]);

  const fetchSecurityLogs = async (authToken) => {
    try {
      const response = await axios.get("https://heath-tracker-backend.onrender.com/securitylogs", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setLogs(response.data);
      setFilteredLogs(response.data);
      toast.success("Security logs loaded!", { position: "top-right" });
    } catch (error) {
      console.error("Error fetching security logs:", error);
      toast.error("Failed to load security logs.", { position: "top-right" });
    }
  };

  // Filter and Sort Logs
  const applyFiltersAndSort = () => {
    let updatedLogs = [...logs];

    // Date Filtering
    if (startDate || endDate) {
      updatedLogs = updatedLogs.filter((log) => {
        const logDate = new Date(log.timestamp);
        const start = startDate ? new Date(startDate) : new Date("2000-01-01");
        const end = endDate ? new Date(endDate) : new Date();
        return logDate >= start && logDate <= end;
      });
    }

    // Sorting
    updatedLogs.sort((a, b) => {
      const fieldA = typeof a[sortField] === "string" ? a[sortField].toLowerCase() : a[sortField];
      const fieldB = typeof b[sortField] === "string" ? b[sortField].toLowerCase() : b[sortField];
      if (sortField === "timestamp") {
        return sortOrder === "asc" ? new Date(a.timestamp) - new Date(b.timestamp) : new Date(b.timestamp) - new Date(a.timestamp);
      }
      return sortOrder === "asc" ? (fieldA > fieldB ? 1 : -1) : (fieldB > fieldA ? 1 : -1);
    });

    setFilteredLogs(updatedLogs);
    toast.info("Filters and sorting applied!", { position: "top-right" });
  };

  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
    applyFiltersAndSort();
  };

  // Generate PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("🔒 Security Logs Report", 14, 10);

    const tableColumn = ["Action", "Status", "IP Address", "Location", "Device", "Timestamp"];
    const tableRows = filteredLogs.map((log) => [
      log.action,
      log.status,
      log.ip_address,
      log.location || "N/A",
      log.device || "N/A",
      new Date(log.timestamp).toLocaleString(),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "striped",
      headStyles: { fillColor: [76, 81, 191] }, // Indigo
      styles: { fontSize: 10, cellPadding: 3 },
    });

    doc.save(`Security_Logs_${new Date().toLocaleDateString()}.pdf`);
    toast.success("PDF downloaded successfully!", { position: "top-right" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-green-50 to-purple-50 p-4 md:p-6 relative overflow-hidden">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="w-80 h-80 bg-indigo-200 rounded-full absolute top-10 left-10 opacity-20 animate-blob"></div>
        <div className="w-96 h-96 bg-green-200 rounded-full absolute bottom-20 right-20 opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-gray-900 animate-fade-in-down">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">🔒 Security Logs</span>
        </h1>
        {/* enalbel two factor authentication */}

        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-2xl shadow-xl text-white mb-6 animate-fade-in-down">

          <h3 className="text-xl font-bold flex items-center gap-2">

            <FiLock className="text-yellow-300" /> Enable Two-Factor Authentication
          </h3>
          
          <Link href="/Enabl2Fauth" className="text-yellow-200 underline mt-2">Click here to set up</Link>

          <p className="text-gray-200 mt-2">Secure your account with an extra layer of protection.</p>

          </div>




        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 animate-slide-in-left">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={applyFiltersAndSort}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 px-4 rounded-lg font-semibold flex items-center gap-2 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 hover:scale-105"
            >
              <FiFilter /> Filter Logs
            </button>
          </div>
        </div>

        {/* Security Logs Card */}
        <div className="bg-white p-6 rounded-2xl shadow-xl animate-slide-in-right">
          <div className="flex justify-between items-center mb-4">
            


            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
              <FiShield className="text-indigo-500" /> Logged Security Events
            </h3>
            <button
              onClick={downloadPDF}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 rounded-lg font-semibold flex items-center gap-2 hover:from-green-600 hover:to-teal-600 transition-all duration-300 hover:scale-105"
            >
              <FiDownload /> Download PDF
            </button>
          </div>

          {filteredLogs.length === 0 ? (
            <p className="text-gray-500 text-center">No security logs recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("action")}>
                      Action {sortField === "action" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("status")}>
                      Status {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="p-3 text-left">IP Address, Location, Device</th>
                    <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("timestamp")}>
                      Timestamp {sortField === "timestamp" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-indigo-50 transition-all duration-200">
                      <td className="p-3">{log.action}</td>
                      <td className={`p-3 font-semibold ${log.status === "Success" ? "text-green-600" : "text-red-600"}`}>
                        {log.status} {log.status !== "Success" && <FiAlertTriangle className="inline ml-1" />}
                      </td>
                      <td className="p-3">
                        {log.ip_address}, {log.location || "N/A"}, {log.device || "N/A"}
                      </td>
                      <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Security Score (Gamification Hint) */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-2xl shadow-xl mt-6 text-white animate-slide-in-left">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FiLock className="text-yellow-300" /> Your Security Score
          </h3>
          <p className="text-3xl font-bold mt-2">{filteredLogs.filter(log => log.status === "Success").length}/{filteredLogs.length}</p>
          <p className="text-gray-200 mt-2">Successful logins out of total attempts. Stay vigilant!</p>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes blob {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out; }
        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out; }
        .animate-slide-in-right { animation: slideInRight 0.8s ease-out; }
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default SecurityLogs;