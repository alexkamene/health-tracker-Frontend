"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SecurityLogs = () => {
  const [logs, setLogs] = useState([]);
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
    } catch (error) {
      console.error("Error fetching security logs:", error);
    }
  };

  // ✅ Generate PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("🔒 Security Logs Report", 14, 10);

    const tableColumn = ["Action", "Status", "IP Address", "Location", "Device", "Timestamp"];
    const tableRows = logs.map(log => [
      log.action,
      log.status,
      log.ip_address,
      log.location || "N/A",
      log.device || "N/A",
      new Date(log.timestamp).toLocaleString()
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("Security_Logs_Report.pdf");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">🔒 Security Logs</h1>

      {/* PDF Download Button */}
      <div className="text-right mb-4">
        <button
          onClick={downloadPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          📥 Download PDF
        </button>
      </div>

      {/* Display Security Logs */}
      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-4">📜 Logged Security Events</h3>
        {logs.length === 0 ? (
          <p className="text-gray-500">No security logs recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border border-gray-300 p-2 text-left">Action</th>
                  <th className="border border-gray-300 p-2 text-left">Status</th>
                  <th className="border border-gray-300 p-2 text-left">IP Address, Location, Device</th>
                  <th className="border border-gray-300 p-2 text-left">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={index} className="border border-gray-300">
                    <td className="border border-gray-300 p-2">{log.action}</td>
                    <td className={`border border-gray-300 p-2 font-bold text-${log.status === "Success" ? "green" : "red"}-500`}>
                      {log.status}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {log.ip_address}, {log.location || "N/A"}, {log.device || "N/A"}
                    </td>
                    <td className="border border-gray-300 p-2">{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityLogs;
