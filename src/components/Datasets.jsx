// components/Datasets.jsx
import React, { useState, useEffect } from "react";
import Papa from "papaparse";

const Datasets = () => {
  const [csvData, setCsvData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // To track the current page
  const [searchQuery, setSearchQuery] = useState(""); // To track the search query
  const rowsPerPage = 12; // Number of rows per page

  useEffect(() => {
    // Load CSV file from the public folder
    fetch("/land_acquisition_notice_2016.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            setCsvData(results.data);
          },
        });
      })
      .catch((error) => console.error("Error fetching CSV:", error));
  }, []);

  // Function to handle CSV download
  const handleCsvDownload = () => {
    const link = document.createElement("a");
    link.href = "/land_acquisition_notice_2016.csv";
    link.download = "land_acquisition_notice_2016.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to handle Excel download
  const handleExcelDownload = () => {
    const link = document.createElement("a");
    link.href = "/land_acquisition_notice_2016.xlsx";
    link.download = "land_acquisition_notice_2016.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to handle pagination
  const handleNextPage = () => {
    if (csvData && (currentPage + 1) * rowsPerPage < filteredData().length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Filtered data based on search query
  const filteredData = () => {
    if (!csvData) return [];
    return csvData.filter((row) =>
      Object.values(row).some((value) =>
        value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  // Get rows for the current page
  const getCurrentRows = () => {
    const data = filteredData();
    const startIndex = currentPage * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  };

  return (
    <div className="p-6">
      {/* Flex container for buttons and search bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={handleCsvDownload}
            className={`px-4 py-2 text-sm font-medium border border-[#E37547] rounded-lg 
              bg-white text-gray-900 hover:bg-[#E37547] hover:text-white
              transition-colors duration-200 ease-in-out`}
          >
            CSV
          </button>
          <button
            type="button"
            onClick={handleExcelDownload}
            className={`px-4 py-2 text-sm font-medium border border-[#E37547] rounded-lg 
              bg-white text-gray-900 hover:bg-[#E37547] hover:text-white
              transition-colors duration-200 ease-in-out`}
          >
            Excel
          </button>
        </div>
        {/* Search Bar positioned to the right */}
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-[#E37547] rounded-lg px-3 py-2 w-1/7 focus:outline-none focus:ring-2 focus:ring-[#E37547]"
        />
      </div>

      {/* Table to display CSV data */}
      {csvData ? (
        <>
          <div className="overflow-x-auto">
            <table
              className="min-w-full border"
              style={{ fontFamily: "Preeti, sans-serif" }}
            >
              <thead>
                <tr>
                  {Object.keys(csvData[0]).map((header, index) => (
                    <th key={index} className="border px-4 py-2 bg-gray-50">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getCurrentRows().map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <td key={cellIndex} className="border px-4 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-between items-center">
            <div>
              Showing {currentPage * rowsPerPage + 1} to{" "}
              {Math.min((currentPage + 1) * rowsPerPage, filteredData().length)} of{" "}
              {filteredData().length} entries
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className={`px-4 py-2 rounded-lg shadow 
                  ${currentPage === 0 ? "bg-gray-300 text-gray-700" : "bg-[#E37547] text-white"} 
                  transition-colors duration-200`}
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={(currentPage + 1) * rowsPerPage >= filteredData().length}
                className={`px-4 py-2 rounded-lg shadow 
                  ${(currentPage + 1) * rowsPerPage >= filteredData().length ? "bg-gray-300 text-gray-700" : "bg-[#E37547] text-white"} 
                  transition-colors duration-200`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <p>Loading CSV data...</p>
      )}
    </div>
  );
};

export default Datasets;