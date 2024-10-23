// src/app/(admin)/admin/edukasi/pengrekrutan/page.tsx
"use client"; // Specify this as a Client Component

import React, { useEffect, useState } from "react";
import { Table } from "antd"; // Import Ant Design Table component

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

export default function Page() {
  const [sheetData, setSheetData] = useState<TableData[]>([]);
  const [columns, setColumns] = useState<TableColumn[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/sheets'); // Fetch data from API
        const data = await response.json();

        const desiredHeaders = [
          "(E) Nama Lengkap:",
          "(E) Umur:",
          "(E) Latar Belakang Edukasi:",
          "(E) Institusi Edukasi Terakhir:",
          "(E) Posisi Yang Diinginkan:",
          "(E) Mengapa anda ingin memilih posisi tersebut?",
          "(E) Jika ada portofolio yang ingin dilampirkan, silahkan untuk upload di bagian ini"
        ];

        // Set up table columns
        const columns: TableColumn[] = desiredHeaders.map((header, index) => ({
          title: header,
          dataIndex: `col${index}`,
          key: `col${index}`,
        }));

        // Process the data for the table
        const tableData: TableData[] = data.map((row: any, rowIndex: number) => {
          const rowData: Record<string, string> = {};
          desiredHeaders.forEach((header, cellIndex) => {
            if (header in row) {
              rowData[`col${cellIndex}`] = row[header];
            }
          });
          return { key: rowIndex, ...rowData }; // Include index as key
        });

        setColumns(columns);
        setSheetData(tableData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }

    fetchData(); // Fetch data when component mounts
  }, []);

  return (
    <div>
      <h1>Google Sheets Data</h1>
      <Table columns={columns} dataSource={sheetData} pagination={false} />
    </div>
  );
}
