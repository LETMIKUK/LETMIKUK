"use client";

import { useState, useEffect } from "react";
import { Row, Card, Select, Table } from "antd";
import { parse } from "csv-parse/browser/esm/sync"; // Import csv-parse

const csvFilePath = "/public/data/Jumlah_dan_Persentase_Balita_Stunting.csv";

const StuntingProvinceCard = () => {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2023"); // Default year

  useEffect(() => {
    const fetchCsvData = async () => {
      try {
        const response = await fetch(csvFilePath);
        const text = await response.text();

        // Parse CSV using csv-parse
        const records = parse(text, {
          columns: true, // Use first row as column names
          skip_empty_lines: true,
        });

        console.log("Parsed CSV Data:", records); // Check the structure
        setData(records); // Store parsed data
      } catch (error) {
        console.error("Error loading CSV:", error);
      }
    };

    fetchCsvData();
  }, []);

  // Extract the relevant stunting data for the selected year
  const stuntingDataForYear = data.map((row) => ({
    city: row["Wilayah"], // Assuming "Wilayah" is the column for city names
    stuntingPercentage: row[`Persentase Stunting ${selectedYear}`], // Match the year
  }));

  // Handle year selection change
  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  // Table columns definition
  const columns = [
    { title: "City", dataIndex: "city", key: "city" },
    {
      title: "Stunting Percentage",
      dataIndex: "stuntingPercentage",
      key: "stuntingPercentage",
    },
  ];

  return (
    <Card title="Persentase Stunting di Setiap Provinsi">
      <Row>
        {/* Dropdown for selecting the year */}
        <Select defaultValue="2023" onChange={handleYearChange}>
          <Select.Option value="2023">2023</Select.Option>
          <Select.Option value="2022">2022</Select.Option>
          <Select.Option value="2021">2021</Select.Option>
        </Select>

        {/* Table to render stunting data */}
        <Table
          columns={columns}
          dataSource={stuntingDataForYear}
          rowKey="city"
          pagination={false}
        />
      </Row>
    </Card>
  );
};

export default StuntingProvinceCard;
