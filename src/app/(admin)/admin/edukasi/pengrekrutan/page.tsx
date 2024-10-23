// src/app/(admin)/admin/edukasi/pengrekrutan/page.tsx
"use client"; // Specify this as a Client Component

import React, { useEffect, useState } from "react";
import { Table, Pagination } from "antd"; // Import Ant Design Table and Pagination component

// Define types for the data structure
interface TableColumn {
  title: string;
  dataIndex: string;
  key: string;
}

interface TableData {
  key: number;
  [key: string]: string | number; // Dynamic keys for table columns
}

// Function to generate random mock data
function generateMockData() {
  const mockData = [];
  const randomNames = ["John Doe", "Jane Smith", "Alice Brown", "Bob Johnson", "Chandra Gupta", "Samuel Santoso", "Sari Kurniawan", "Rafael Sibolga"];
  const randomAges = [22, 25, 30, 35];
  const randomEduBackgrounds = ["SD", "SMP", "SMA", "Diploma", "S1", "S2"];
  const randomInstitutions = ["Universitas A", "Universitas B", "Sekolah Tinggi C", "Institut D"];
  const randomPositions = [
    "Spesialis Kesehatan", 
    "Penulis Konten Edukasi", 
    "Pembuat Strategi Konten Edukasi", 
    "Pencerita Dongeng Edukasi"
  ];
  
  const randomReasons = [
    "Saya menyukai pemecahan masalah",
    "Saya memiliki minat dalam teknologi",
    "Saya menikmati bekerja dalam tim",
    "Saya ingin menciptakan produk yang berdampak"
  ];
  
  const randomPortfolios = [
    "Portofolio A", 
    "Portofolio B", 
    "Portofolio C", 
    "Portofolio D"
  ];

  // Track last selected options to avoid duplicates
  let lastName = "";
  let lastAge: number | null = null;
  let lastEduBackground = "";
  let lastInstitution = "";
  let lastPosition = "";
  let lastReason = "";
  let lastPortfolio = "";

  // Generate 20 rows of random data
  for (let i = 0; i < 50; i++) {
    const name = getRandomUniqueItem(randomNames, lastName);
    const age = getRandomUniqueItem(randomAges, lastAge);
    const eduBackground = getRandomUniqueItem(randomEduBackgrounds, lastEduBackground);
    const institution = getRandomUniqueItem(randomInstitutions, lastInstitution);
    const position = getRandomUniqueItem(randomPositions, lastPosition);
    const reason = getRandomUniqueItem(randomReasons, lastReason);
    const portfolio = getRandomUniqueItem(randomPortfolios, lastPortfolio);
    
    mockData.push({
      key: i,
      col0: name,
      col1: age,
      col2: eduBackground,
      col3: institution,
      col4: position,
      col5: reason,
      col6: portfolio
    });

    // Update last selected items
    lastName = name;
    lastAge = age;
    lastEduBackground = eduBackground;
    lastInstitution = institution;
    lastPosition = position;
    lastReason = reason;
    lastPortfolio = portfolio;
  }

  return mockData;
}

// Helper function to get a random unique item
function getRandomUniqueItem(array: any[], lastValue: any) {
  let newValue;
  do {
    newValue = array[Math.floor(Math.random() * array.length)];
  } while (newValue === lastValue);
  return newValue;
}

export default function Page() {
  const [sheetData, setSheetData] = useState<TableData[]>([]);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const pageSize = 5; // Rows per page

  useEffect(() => {
    // Define desired headers
    const desiredHeaders = [
      "(E) Nama Lengkap:",
      "(E) Umur:",
      "(E) Latar Belakang Edukasi:",
      "(E) Institusi Edukasi Terakhir:",
      "(E) Posisi Yang Diinginkan:",
      "(E) Alasan",
      "(E) Portofolio"
    ];

    // Set up table columns
    const columns: TableColumn[] = desiredHeaders.map((header, index) => ({
      title: header,
      dataIndex: `col${index}`,
      key: `col${index}`,
    }));

    // Generate mock data
    const tableData = generateMockData();

    // Set columns and data
    setColumns(columns);
    setSheetData(tableData);
  }, []);

  // Calculate the current data to be displayed
  const currentData = sheetData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Handle page change
  const handleChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1>Google Sheets Data (Mockup)</h1>
      <Table 
        columns={columns} 
        dataSource={currentData} 
        pagination={false} // Disable default pagination
      />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
        <Pagination 
          current={currentPage} 
          pageSize={pageSize} 
          total={sheetData.length} 
          onChange={handleChange} 
          showSizeChanger={false} // Optional: hide page size changer
        />
      </div>
    </div>
  );
}
