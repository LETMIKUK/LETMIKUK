"use client";

import React, { useEffect, useState } from "react";
import { Table, Pagination } from "antd";
import TypographyTitle from "antd/lib/typography/Title";
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

interface TableColumn {
  title: string;
  dataIndex: string;
  key: string;
}

interface TableData {
  key: number;
  [key: string]: string | number;
}

function generateMockData() {
  const mockData = [];
  const randomNames = ["John Doe", "Jane Smith", "Alice Brown", "Bob Johnson", "Chandra Gupta", "Samuel Santoso", "Sari Kurniawan", "Rafael Sibolga"];
  const randomAges = [22, 25, 30, 35];
  const randomEduBackgrounds = ["SD", "SMP", "SMA", "Diploma", "S1", "S2"];
  const randomInstitutions = ["Universitas A", "Universitas B", "Sekolah Tinggi C", "Institut D"];
  const randomPositions = ["Spesialis Kesehatan", "Penulis Konten Edukasi", "Pembuat Strategi Konten Edukasi", "Pencerita Dongeng Edukasi"];
  const randomReasons = ["Saya menyukai pemecahan masalah", "Saya memiliki minat dalam teknologi", "Saya menikmati bekerja dalam tim", "Saya ingin menciptakan produk yang berdampak"];
  const randomPortfolios = ["Portofolio A", "Portofolio B", "Portofolio C", "Portofolio D"];
  const randomIslands = ["Sumatra", "Java", "Bali", "Kalimantan", "Sulawesi", "Nusa Tenggara", "Papua"];

  let lastName = "";
  let lastAge = 0;
  let lastEduBackground = "";
  let lastInstitution = "";
  let lastPosition = "";
  let lastReason = "";
  let lastPortfolio = "";
  let lastIsland = "";

  for (let i = 0; i < 50; i++) {
    const name = getRandomUniqueItem(randomNames, lastName);
    const age = getRandomUniqueItem(randomAges, lastAge);
    const eduBackground = getRandomUniqueItem(randomEduBackgrounds, lastEduBackground);
    const institution = getRandomUniqueItem(randomInstitutions, lastInstitution);
    const position = getRandomUniqueItem(randomPositions, lastPosition);
    const reason = getRandomUniqueItem(randomReasons, lastReason);
    const portfolio = getRandomUniqueItem(randomPortfolios, lastPortfolio);
    const island = getRandomUniqueItem(randomIslands, lastIsland);
    
    mockData.push({
      key: i,
      col0: name,
      col1: age,
      col2: eduBackground,
      col3: island, // New column for the island of origin
      col4: institution,
      col5: position,
      col6: reason,
      col7: portfolio
    });

    lastName = name;
    lastAge = age;
    lastEduBackground = eduBackground;
    lastInstitution = institution;
    lastPosition = position;
    lastReason = reason;
    lastPortfolio = portfolio;
    lastIsland = island;
  }

  return mockData;
}

function getRandomUniqueItem<T>(array: T[], lastValue: T): T {
  let newValue;
  do {
    newValue = array[Math.floor(Math.random() * array.length)];
  } while (newValue === lastValue);
  return newValue;
}

export default function Page() {
  const [sheetData, setSheetData] = useState<TableData[]>([]);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [eduBackgroundCounts, setEduBackgroundCounts] = useState<{ [key: string]: number }>({});
  const [ageCounts, setAgeCounts] = useState<{ [key: number]: number }>({});
  const [islandCounts, setIslandCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const desiredHeaders = [
      "(E) Nama Lengkap:",
      "(E) Umur:",
      "(E) Latar Belakang Edukasi:",
      "(E) Pulau Asal:", // New header for island of origin
      "(E) Institusi Edukasi Terakhir:",
      "(E) Posisi Yang Diinginkan:",
      "(E) Alasan",
      "(E) Portofolio"
    ];

    const columns: TableColumn[] = desiredHeaders.map((header, index) => ({
      title: header,
      dataIndex: `col${index}`,
      key: `col${index}`,
    }));

    const tableData = generateMockData();

    const eduBackgroundCounts = tableData.reduce((acc: { [key: string]: number }, item) => {
      const eduBackground = item.col2 as string;
      acc[eduBackground] = acc[eduBackground] ? acc[eduBackground] + 1 : 1;
      return acc;
    }, {});

    const ageCounts = tableData.reduce((acc: { [key: number]: number }, item) => {
      const age = item.col1 as number;
      acc[age] = acc[age] ? acc[age] + 1 : 1;
      return acc;
    }, {});

    const islandCounts = tableData.reduce((acc: { [key: string]: number }, item) => {
      const island = item.col3 as string;
      acc[island] = acc[island] ? acc[island] + 1 : 1;
      return acc;
    }, {});

    setColumns(columns);
    setSheetData(tableData);
    setEduBackgroundCounts(eduBackgroundCounts);
    setAgeCounts(ageCounts);
    setIslandCounts(islandCounts);
  }, []);

  const currentData = sheetData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleChange = (page: number) => {
    setCurrentPage(page);
  };

  const pieChartLabelsEdu = Object.keys(eduBackgroundCounts);
  const pieChartDataEdu = Object.values(eduBackgroundCounts);

  const pieChartLabelsIsland = Object.keys(islandCounts);
  const pieChartDataIsland = Object.values(islandCounts);

  const barChartLabels = Object.keys(ageCounts);
  const barChartData = Object.values(ageCounts);

  return (
    <div style={{ padding: '5rem', backgroundColor: '#f5f5f5', minHeight: '100vh' }}> {/* Set background color and minimum height */}
      <TypographyTitle>Rekrutmen Divisi Edukasi</TypographyTitle>
      <p style={{ paddingBottom: '1rem' }}>Data Grafik</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingBottom: '2rem' }}>
        <div style={{ width: '48%', height: '500px', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '1rem', overflow: 'hidden' }}>
          <h3 style={{ textAlign: 'center' }}>Latar Belakang Edukasi</h3>
          <ApexCharts 
            type="pie" 
            series={pieChartDataEdu as number[]} 
            options={{
              labels: pieChartLabelsEdu,
              chart: { width: '100%', height: '100%' },
              plotOptions: {
                pie: {
                  donut: {
                    size: '50%', // Adjust the donut size to make it smaller
                    labels: {
                      show: false, // Hide labels
                    },
                  },
                },
              },
              tooltip: { enabled: false }, // Disable tooltip
              responsive: [
                { breakpoint: 768, options: { chart: { width: '100%' }, legend: { position: 'bottom' } } },
                { breakpoint: 480, options: { chart: { width: '100%' }, legend: { position: 'bottom' } } }
              ]
            } as ApexOptions}
          />
        </div>

        <div style={{ width: '48%', height: '500px', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '1rem', overflow: 'hidden' }}>
          <h3 style={{ textAlign: 'center' }}>Distribusi Umur</h3>
          <ApexCharts 
            type="bar" 
            series={[{ data: barChartData as number[] }]} 
            options={{
              xaxis: { categories: barChartLabels },
              chart: { type: 'bar', width: '100%', height: '100%' },
              responsive: [
                { breakpoint: 768, options: { chart: { width: '100%' }, legend: { position: 'bottom' } } },
                { breakpoint: 480, options: { chart: { width: '100%' }, legend: { position: 'bottom' } } }
              ]
            } as ApexOptions}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingBottom: '2rem' }}>
        <div style={{ width: '48%', height: '500px', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '1rem', overflow: 'hidden' }}>
          <h3 style={{ textAlign: 'center' }}>Pulau Asal</h3>
          <ApexCharts 
            type="pie" 
            series={pieChartDataIsland as number[]} 
            options={{
              labels: pieChartLabelsIsland,
              chart: { width: '100%', height: '100%' },
              plotOptions: {
                pie: {
                  donut: {
                    size: '50%', // Adjust the donut size to make it smaller
                    labels: {
                      show: false, // Hide labels
                    },
                  },
                },
              },
              tooltip: { enabled: false }, // Disable tooltip
              responsive: [
                { breakpoint: 768, options: { chart: { width: '100%' }, legend: { position: 'bottom' } } },
                { breakpoint: 480, options: { chart: { width: '100%' }, legend: { position: 'bottom' } } }
              ]
            } as ApexOptions}
          />
        </div>
      </div>
      <p style={{ paddingBottom: '1rem' }}>Data Grafik</p>
      <div style={{ paddingBottom: '10rem' }}>
      <Table
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          onChange: handleChange,
          total: sheetData.length,
        }}
        dataSource={currentData}
        columns={columns}
        bordered
        style={{ marginTop: '20px' }}
      />
    </div>
    </div>
  );
}
