"use client"; // Specify this as a Client Component

import React, { useEffect, useState } from "react";
import { Table, Pagination } from "antd"; // Import Ant Design Table and Pagination component
import TypographyTitle from "antd/lib/typography/Title";
import dynamic from 'next/dynamic'; // Use dynamic import for ApexCharts
import { ApexOptions } from 'apexcharts'; // Import ApexOptions for type definitions
import { LeftOutlined, RightOutlined } from '@ant-design/icons'; // Import icons for switching charts

// Dynamic import for ApexCharts to prevent SSR issues
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

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

  // Generate 50 rows of random data
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
  const [eduBackgroundCounts, setEduBackgroundCounts] = useState<{ [key: string]: number }>({}); // For pie chart data
  const [ageCounts, setAgeCounts] = useState<{ [key: number]: number }>({}); // For bar chart data
  const [chartType, setChartType] = useState('pie'); // To switch between charts

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

    // Count occurrences of each education background for pie chart
    const eduBackgroundCounts = tableData.reduce((acc: { [key: string]: number }, item) => {
      const eduBackground = item.col2 as string; // Explicitly cast to string
      acc[eduBackground] = acc[eduBackground] ? acc[eduBackground] + 1 : 1;
      return acc;
    }, {});

    // Count occurrences of each age for bar chart
    const ageCounts = tableData.reduce((acc: { [key: number]: number }, item) => {
      const age = item.col1 as number; // Explicitly cast to number
      acc[age] = acc[age] ? acc[age] + 1 : 1;
      return acc;
    }, {});

    // Set columns and data
    setColumns(columns);
    setSheetData(tableData);
    setEduBackgroundCounts(eduBackgroundCounts);
    setAgeCounts(ageCounts);
  }, []);

  // Calculate the current data to be displayed
  const currentData = sheetData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Handle page change
  const handleChange = (page: number) => {
    setCurrentPage(page);
  };

  // Prepare data for the pie chart
  const pieChartLabels = Object.keys(eduBackgroundCounts);
  const pieChartData = Object.values(eduBackgroundCounts);

  // Prepare data for the bar chart
  const barChartLabels = Object.keys(ageCounts);
  const barChartData = Object.values(ageCounts);

  // Handle chart switching
  const handleSwitchChart = (direction: string) => {
    if (direction === 'left') {
      setChartType(chartType === 'pie' ? 'bar' : 'pie');
    } else if (direction === 'right') {
      setChartType(chartType === 'pie' ? 'bar' : 'pie');
    }
  };

  return (
    <div style={{ padding: '5rem' }}> {/* Apply padding to the whole container div */}
      <TypographyTitle>Rekrutmen Divisi Edukasi</TypographyTitle>
      <p style={{ paddingBottom: '5rem' }}>Data Grafik</p>

      {/* Switchable charts with arrows */}
      <div style={{ width: '40%', margin: '0 auto', paddingBottom: '2rem', position: 'relative' }}>
        {/* Left arrow for chart switch */}
        <LeftOutlined 
          style={{ position: 'absolute', top: '50%', left: '-2rem', cursor: 'pointer' }} 
          onClick={() => handleSwitchChart('left')} 
        />

        {/* Chart rendering based on chartType */}
        {chartType === 'pie' ? (
          <ApexCharts 
            type="pie" 
            series={pieChartData as number[]} // Explicitly cast to number[]
            options={{
              labels: pieChartLabels,
              chart: {
                width: '100%', // Full width by default
              },
              responsive: [
                {
                  breakpoint: 1200, // On larger screens (maximized)
                  options: {
                    chart: {
                      width: '40%', // 40% of container width
                    },
                  },
                },
                {
                  breakpoint: 768, // For smaller tablets and phones
                  options: {
                    chart: {
                      width: '100%', // Full width for smaller screens
                    },
                    legend: {
                      position: 'bottom'
                    }
                  }
                },
                {
                  breakpoint: 480, // Mobile view
                  options: {
                    chart: {
                      width: 300 // Fixed width for very small screens
                    },
                    legend: {
                      position: 'bottom'
                    }
                  }
                }
              ]
            } as ApexOptions} // Cast options to ApexOptions
          />
        ) : (
          <ApexCharts 
            type="bar" 
            series={[{ data: barChartData as number[] }]} // Explicitly cast to number[]
            options={{
              xaxis: {
                categories: barChartLabels,
              },
              chart: {
                type: 'bar',
                width: '100%', // Full width by default
              },
              responsive: [
                {
                  breakpoint: 1200, // On larger screens (maximized)
                  options: {
                    chart: {
                      width: '40%', // 40% of container width
                    },
                  },
                },
                {
                  breakpoint: 768, // For smaller tablets and phones
                  options: {
                    chart: {
                      width: '100%', // Full width for smaller screens
                    },
                    legend: {
                      position: 'bottom'
                    }
                  }
                },
                {
                  breakpoint: 480, // Mobile view
                  options: {
                    chart: {
                      width: 300 // Fixed width for very small screens
                    },
                    legend: {
                      position: 'bottom'
                    }
                  }
                }
              ]
            } as ApexOptions} // Cast options to ApexOptions
          />
        )}

        {/* Right arrow for chart switch */}
        <RightOutlined 
          style={{ position: 'absolute', top: '50%', right: '-2rem', cursor: 'pointer' }} 
          onClick={() => handleSwitchChart('right')} 
        />
      </div>
      <p>Data Tabel</p>
      {/* Table to display data */}
      <Table 
        columns={columns} 
        dataSource={currentData} 
        pagination={false} // Disable built-in pagination
      />

      {/* Custom Pagination component */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={sheetData.length}
        onChange={handleChange}
        
      />
    </div>
  );
}
