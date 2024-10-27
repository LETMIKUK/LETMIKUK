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
  const randomEduBackgrounds = ["SD", "SMP", "SMA", "S1", "S2", "S3"];
  const randomInstitutions = ["Universitas A", "Universitas B", "Sekolah Tinggi C", "Institut D"];
  const randomPositions = ["Driver", "Relawan", "Relawan Logistik Bansos", "Manajer", "Relawan Penanggung Jawab Lokasi", "Relawan Manajer Penyimpanan"];
  const randomReasons = ["Saya menyukai pemecahan masalah", "Saya memiliki minat dalam teknologi", "Saya menikmati bekerja dalam tim", "Saya ingin menciptakan produk yang berdampak"];
  const randomPortfolios = ["PortofolioA.pdf", "PortofolioB.pdf", "PortofolioC.pdf", "PortofolioD.pdf"];
  const randomIslands = ["Papua", "Aceh", "Sulawesi"];
  const randomGenders = ["Laki-Laki", "Perempuan"];

  let lastName = "";
  let lastAge = 0;
  let lastEduBackground = "";
  let lastInstitution = "";
  let lastPosition = "";
  let lastReason = "";
  let lastPortfolio = "";
  let lastIsland = "";
  let lastGender = "";

  for (let i = 0; i < 50; i++) {
    const name = getRandomUniqueItem(randomNames, lastName);
    const age = getRandomUniqueItem(randomAges, lastAge);
    const eduBackground = getRandomUniqueItem(randomEduBackgrounds, lastEduBackground);
    const institution = getRandomUniqueItem(randomInstitutions, lastInstitution);
    const position = getRandomUniqueItem(randomPositions, lastPosition);
    const reason = getRandomUniqueItem(randomReasons, lastReason);
    const portfolio = getRandomUniqueItem(randomPortfolios, lastPortfolio);
    const island = getRandomUniqueItem(randomIslands, lastIsland);
    const gender = getRandomUniqueItem(randomGenders, lastGender);

    mockData.push({
      key: i,
      col0: name,
      col1: gender,
      col2: age,
      col3: eduBackground,
      col4: island,
      col5: institution,
      col6: position,
      col7: reason,
      col8: portfolio
    });

    lastName = name;
    lastAge = age;
    lastEduBackground = eduBackground;
    lastInstitution = institution;
    lastPosition = position;
    lastReason = reason;
    lastPortfolio = portfolio;
    lastIsland = island;
    lastGender = gender;
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
  const [positionCounts, setPositionCounts] = useState<{ [key: string]: number }>({});
  const [genderCounts, setGenderCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const desiredHeaders = [
      "(E) Nama Lengkap:",
      "(E) Jenis Kelamin",
      "(E) Umur:",
      "(E) Latar Belakang Edukasi:",
      "(E) Provinsi Yang Diminati:",
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
      const eduBackground = item.col3 as string; 
      acc[eduBackground] = acc[eduBackground] ? acc[eduBackground] + 1 : 1;
      return acc;
    }, {});

    const ageCounts = tableData.reduce((acc: { [key: number]: number }, item) => {
      const age = item.col2 as number; 
      acc[age] = acc[age] ? acc[age] + 1 : 1;
      return acc;
    }, {});

    const islandCounts = tableData.reduce((acc: { [key: string]: number }, item) => {
      const island = item.col4 as string; 
      acc[island] = acc[island] ? acc[island] + 1 : 1;
      return acc;
    }, {});

    const positionCounts = tableData.reduce((acc: { [key: string]: number }, item) => {
      const position = item.col6 as string; 
      acc[position] = acc[position] ? acc[position] + 1 : 1;
      return acc;
    }, {});

    const genderCounts = tableData.reduce((acc: { [key: string]: number }, item) => {
      const gender = item.col1 as string;
      acc[gender] = acc[gender] ? acc[gender] + 1 : 1;
      return acc;
    }, {});

    setColumns(columns);
    setSheetData(tableData);
    setEduBackgroundCounts(eduBackgroundCounts);
    setAgeCounts(ageCounts);
    setIslandCounts(islandCounts);
    setPositionCounts(positionCounts);
    setGenderCounts(genderCounts);
  }, []);

  const currentData = sheetData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleChange = (page: number) => {
    setCurrentPage(page);
  };

  const educationOrder = ["SD", "SMP", "SMA", "S1", "S2", "S3"];
  const sortedEduBackgroundCounts = educationOrder.map(label => eduBackgroundCounts[label] || 0);

  const pieChartLabelsAge = Object.keys(ageCounts);
  const pieChartDataAge = Object.values(ageCounts);

  const barChartLabelsEdu = educationOrder;
  const barChartDataEdu = sortedEduBackgroundCounts;

  const barChartLabelsIsland = Object.keys(islandCounts);
  const barChartDataIsland = Object.values(islandCounts);

  const pieChartLabelsPosition = Object.keys(positionCounts);
  const pieChartDataPosition = Object.values(positionCounts);

  const pieChartLabelsGender = Object.keys(genderCounts);
  const pieChartDataGender = Object.values(genderCounts);

  return (
    <div style={{ padding: '5rem', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <TypographyTitle>Rekrutmen Divisi Edukasi</TypographyTitle>
      <p style={{ paddingBottom: '1rem' }}>Data Grafik</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', paddingBottom: '2rem' }}>
        
        <div style={{ width: '48%', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '0.5rem', marginBottom: '1rem' }}>
          <h3 style={{ textAlign: 'center' }}>Distribusi Umur</h3>
          <ApexCharts 
            type="pie" 
            series={pieChartDataAge as number[]} 
            options={{
              labels: pieChartLabelsAge,
              chart: { height: 300 }, 
              plotOptions: {
                pie: {
                  donut: { size: '50%', labels: { show: false } },
                },
              },
              tooltip: { enabled: true },
              legend: { position: 'bottom' }
            } as ApexOptions}
          />
        </div>

        <div style={{ width: '48%', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '0.5rem', marginBottom: '1rem' }}>
          <h3 style={{ textAlign: 'center' }}>Distribusi Latar Belakang Edukasi</h3>
          <ApexCharts 
            type="bar" 
            series={[{ data: barChartDataEdu }]} 
            options={{
              xaxis: { categories: barChartLabelsEdu },
              chart: { height: 300 }, 
              plotOptions: { bar: { horizontal: false, columnWidth: '50%' } },
              tooltip: { enabled: true },
              legend: { position: 'bottom' }
            } as ApexOptions}
          />
        </div>

        <div style={{ width: '48%', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '0.5rem', marginBottom: '1rem' }}>
          <h3 style={{ textAlign: 'center' }}>Distribusi Pulau yang Diminati</h3>
          <ApexCharts 
            type="bar" 
            series={[{ data: barChartDataIsland }]} 
            options={{
              xaxis: { categories: barChartLabelsIsland },
              chart: { height: 300 }, 
              plotOptions: { bar: { horizontal: false, columnWidth: '50%' } },
              tooltip: { enabled: true },
              legend: { position: 'bottom' }
            } as ApexOptions}
          />
        </div>

        <div style={{ width: '48%', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '0.5rem', marginBottom: '1rem' }}>
          <h3 style={{ textAlign: 'center' }}>Distribusi Posisi yang Diminati</h3>
          <ApexCharts 
            type="pie" 
            series={pieChartDataPosition as number[]} 
            options={{
              labels: pieChartLabelsPosition,
              chart: { height: 300 }, 
              plotOptions: {
                pie: {
                  donut: { size: '50%', labels: { show: false } },
                },
              },
              tooltip: { enabled: true },
              legend: { position: 'bottom' }
            } as ApexOptions}
          />
        </div>

        <div style={{ width: '48%', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '0.5rem', marginBottom: '1rem' }}>
          <h3 style={{ textAlign: 'center' }}>Distribusi Jenis Kelamin</h3>
          <ApexCharts 
            type="pie" 
            series={pieChartDataGender as number[]} 
            options={{
              labels: pieChartLabelsGender,
              chart: { height: 300 }, 
              plotOptions: {
                pie: {
                  donut: { size: '50%', labels: { show: false } },
                },
              },
              tooltip: { enabled: true },
              legend: { position: 'bottom' }
            } as ApexOptions}
          />
        </div>

      </div>

      <Table columns={columns} dataSource={currentData} pagination={false} />
      <Pagination current={currentPage} pageSize={pageSize} total={sheetData.length} onChange={handleChange} 
      style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '1rem', paddingBottom: '5rem' }} />
    </div>
  );
}
