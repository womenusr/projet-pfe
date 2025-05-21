import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import {
  getWorkPermitById,
  sendEmail,
} from "../../services/workPermitServices";
import { FiPrinter, FiMail, FiDownload, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import axios from "axios";
import ViewHotWork from "../FirePermit/ViewHotWork";

const WorkPermitView = ({ data, setDisplayWorkPermitView }) => {
  const navigate = useNavigate();
  const [workPermit, setWorkPermit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    recipient: "",
    subject: "Work Permit Details",
    message: "Please find attached the work permit details.",
  });
  const pdfRef = useRef();

  useEffect(() => {
    const fetchWorkPermit = async () => {
      try {
        setWorkPermit(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching work permit:", error);
        toast.error("Failed to load work permit");
        setLoading(false);
      }
    };

    fetchWorkPermit();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const downloadPDF = () => {
    const input = pdfRef.current;

    // First clone the node to avoid modifying the original
    const cloned = input.cloneNode(true);

    // Replace unsupported color functions
    const elements = cloned.querySelectorAll("*");
    elements.forEach((el) => {
      const style = window.getComputedStyle(el);
      if (style.color.includes("oklch")) {
        el.style.color = "#000000";
      }
      if (style.backgroundColor.includes("oklch")) {
        el.style.backgroundColor = "#ffffff";
      }
    });

    let hotworkpermit = document.getElementById("hot-work-container");
    let clonedHotWorkContainer = hotworkpermit.cloneNode(true);
    clonedHotWorkContainer.classList.add("hot-work");

    const hotworkstyle = document.createElement("style");
    hotworkstyle.innerHTML = `
.hot-work {
margin-top : 130vh;}
`;

    clonedHotWorkContainer.appendChild(hotworkstyle);
    // Create a temporary container
    const tempContainer = document.createElement("div");
    tempContainer.appendChild(cloned);
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    document.body.appendChild(tempContainer);

    html2canvas(cloned, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`work_permit_${data._id}.pdf`);
      toast.success("PDF downloaded successfully");

      // Clean up
      document.body.removeChild(tempContainer);
    });
  };

  const printDocument = () => {
    const input = pdfRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const windowContent = "<!DOCTYPE html>";
      const html = `<html><head><title>Print Work Permit</title></head><body style="margin:0;padding:0;"><img src="${imgData}" style="max-width:100%;"/></body></html>`;

      const printWin = window.open("", "", "width=800,height=600");
      printWin.document.open();
      printWin.document.write(windowContent + html);
      printWin.document.close();
      printWin.focus();
      printWin.print();
    });
  };

  const handleEmailSend = async () => {
    try {
      // First generate the PDF content
      const input = pdfRef.current;

      // Clone the node to avoid modifying the original
      const cloned = input.cloneNode(true);

      // Replace unsupported color functions (if needed)
      const elements = cloned.querySelectorAll("*");
      elements.forEach((el) => {
        const style = window.getComputedStyle(el);
        if (style.color.includes("oklch")) {
          el.style.color = "#000000";
        }
        if (style.backgroundColor.includes("oklch")) {
          el.style.backgroundColor = "#ffffff";
        }
      });

      // Create a temporary container
      const tempContainer = document.createElement("div");
      tempContainer.appendChild(cloned);
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      document.body.appendChild(tempContainer);

      // Generate canvas from the cloned element
      const canvas = await html2canvas(cloned, {
        scale: 1,
        logging: false,
        useCORS: true,
        allowTaint: true,
        quality: 0.7,
      });

      // Clean up the temporary container
      document.body.removeChild(tempContainer);

      // Convert canvas to PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(
        canvas,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Convert PDF to Blob
      const pdfBlob = pdf.output("blob");
      const pdfFile = new File([pdfBlob], `work_permit_${workPermit._id}.pdf`, {
        type: "application/pdf",
      });

      // Create FormData for the email
      const formData = new FormData();
      formData.append("recipient", emailData.recipient);
      formData.append("subject", emailData.subject);
      formData.append("message", emailData.message);
      formData.append("file", pdfFile); // The PDF file attachment

      await sendEmail(formData);

      toast.success("Email sent successfully");
      setEmailModalOpen(false);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    }
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!workPermit) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Work permit not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
        <div className="flex space-x-3">
          <button
            onClick={printDocument}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FiPrinter className="mr-2" /> Print
          </button>
          <button
            onClick={() => setEmailModalOpen(true)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FiMail className="mr-2" /> Email
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
          >
            <FiDownload className="mr-2" /> Download PDF
          </button>
        </div>
      </div>

      {/* Work Permit Content */}
      <div ref={pdfRef} className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">WORK PERMIT</h1>

        {/* Permit Number and Status */}
        <div className="flex justify-between mb-6">
          <div>
            <span className="font-semibold">Permit #:</span>{" "}
            {workPermit.numero || "N/A"}
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              workPermit.status === "approved"
                ? "bg-green-100 text-green-800"
                : workPermit.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {workPermit.status?.toUpperCase() || "N/A"}
          </div>
        </div>

        {/* Work Coordinator */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-1 mb-3">
            WORK COORDINATOR
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Name:</p>
              <p>{workPermit.coordinatorName || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">Position:</p>
              <p>{workPermit.coordinatorPosition || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Company Speaker */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-1 mb-3">
            COMPANY SPEAKER
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="font-medium">Name:</p>
              <p>{workPermit.speakerName || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">Position:</p>
              <p>{workPermit.speakerPosition || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">CIN:</p>
              <p>{workPermit.speakerCIN || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">Signature:</p>
              <p>{workPermit.speakerSignature || "N/A"}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="font-medium">Accompanying persons:</p>
            <p>{workPermit.accompanyingNumber || "0"}</p>
          </div>
        </div>

        {/* Accompanying Persons */}
        {workPermit.persons && workPermit.persons.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b pb-1 mb-3">
              ACCOMPANYING PERSONS
            </h2>
            <div className="space-y-4">
              {workPermit.persons.map((person, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">Name:</p>
                    <p>{person.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Position:</p>
                    <p>{person.position || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium">CIN:</p>
                    <p>{person.cin || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Signature:</p>
                    <p>{person.signature || "N/A"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Duration and Location */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-1 mb-3">
            DURATION AND LOCATION
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Start Date/Time:</p>
              <p>{formatDate(workPermit.startDateTime)}</p>
            </div>
            <div>
              <p className="font-medium">End Date/Time:</p>
              <p>{formatDate(workPermit.endDateTime)}</p>
            </div>
            <div className="md:col-span-2">
              <p className="font-medium">Place of Intervention:</p>
              <p>{workPermit.placeArea || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Nature of Works */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-1 mb-3">
            NATURE OF WORKS
          </h2>
          <p>{workPermit.natureOfWorks || "N/A"}</p>
        </div>

        {/* Tools Used */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-1 mb-3">
            TOOLS USED
          </h2>
          <div className="flex flex-wrap gap-2">
            {workPermit.toolsUsed && workPermit.toolsUsed.length > 0 ? (
              workPermit.toolsUsed.map((tool, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {tool}
                </span>
              ))
            ) : (
              <p>No tools specified</p>
            )}
            {workPermit.otherTool && (
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                Other: {workPermit.otherTool}
              </span>
            )}
          </div>
        </div>

        {/* Safety Requirements */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-1 mb-3">
            SAFETY REQUIREMENTS
          </h2>
          <div className="space-y-2">
            <p className="font-medium">Other Requirements:</p>
            <p>{workPermit.otherRequirements || "None specified"}</p>
          </div>
        </div>

        {/* Approvals */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-1 mb-3">
            APPROVALS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Engineering Manager:</p>
              <p>{workPermit.engineerManager || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">HSE Officer:</p>
              <p>{workPermit.hseOfficer || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">Job of Guard:</p>
              <p>{workPermit.guardJob || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Inspection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-1 mb-3">
            INSPECTION DETAILS
          </h2>
          <p>
            Joint inspection of the places of work, of the installation and of
            material took place on {formatDate(workPermit.inspectionDate)} at
            Park M, {workPermit.inspectionPlace || "N/A"}. The sector
            intervention has been delimited, the ways of traffic of the people
            and equipment indicated.
          </p>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-4 border-t">
          <div className="text-center">
            <h3 className="font-medium mb-2">COORDINATOR OF THE WORKS</h3>
            <p className="text-sm text-gray-500 mb-4">(Date and signature)</p>
            <div className="h-16 border-b border-gray-300">
              {workPermit.coordinatorSignature || "N/A"}
            </div>
          </div>
          <div className="text-center">
            <h3 className="font-medium mb-2">RESPONSIBLE HSE</h3>
            <p className="text-sm text-gray-500 mb-4">(Date and signature)</p>
            <div className="h-16 border-b border-gray-300">
              {workPermit.responsibleSignature || "N/A"}
            </div>
          </div>
        </div>
        <div id="hot-work-container">
          {" "}
          {data.hot_work_id._id && (
            <ViewHotWork hotWorkData={data.hot_work_id} />
          )}
        </div>
      </div>

      {/* Email Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Send Work Permit by Email
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  name="recipient"
                  value={emailData.recipient}
                  onChange={handleEmailChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={emailData.subject}
                  onChange={handleEmailChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={emailData.message}
                  onChange={handleEmailChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEmailModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailSend}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
      <button onClick={() => setDisplayWorkPermitView(false)}>fermer</button>
    </div>
  );
};

export default WorkPermitView;
