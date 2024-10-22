"use client";

// TODO: get back to this and use the correct csv, index of help aided on stunting it shows all province.

import { useState, useEffect } from "react";
import { Row, Card, Select, Table, Col } from "antd";
import { parse } from "csv-parse/browser/esm/sync"; // Import csv-parse

const csvFilePath =
  "/data/Jumlah dan Persentase Balita Stunting Menurut Kabupaten_Kota, 2021-2023.csv";

interface DataType {
  key: React.Key;
  city: string;
  stuntingPercentage: string;
}

interface StuntingData {
  city: string;
  stuntingPercentage: number | null; // Use number | null to accommodate non-numeric values
}

interface CSVRow {
  [index: number]: string; // Dynamic index for CSV rows
}

const StuntingProvinceCard: React.FC = () => {
  const [data, setData] = useState<CSVRow[]>([]);
  const [stuntingDataForYear, setStuntingDataForYear] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("2023");

  const yearIndex: any = {
    "2023": 16,
    "2022": 17,
    "2021": 18,
  };

  useEffect(() => {
    const fetchCsvData = async () => {
      try {
        const response = await fetch(csvFilePath);
        const text = await response.text();

        // Parse CSV without named columns
        const records: CSVRow[] = parse(text, {
          columns: false,
          skip_empty_lines: true,
        });

        console.log("records:", records);
        setData(records);
      } catch (error) {
        console.error("Error loading CSV:", error);
      }
    };

    fetchCsvData(); // Fetch and parse CSV on component mount
  }, [csvFilePath]);

  useEffect(() => {
    const tableData: any = data.slice(4).map((row) => {
      //   console.log("row:", row);
      return { city: row[0], stuntingPercentage: row[yearIndex[selectedYear]] };
    });
    console.log(stuntingDataForYear);
    setStuntingDataForYear(tableData);
  }, [data, selectedYear]);
  // Handle year selection change
  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  // Table columns definition
  const columns = [
    {
      title: "Kota",
      dataIndex: "city",
      key: "city",
      sorter: (a: any, b: any) => a.city.localeCompare(b.city),
      width: 200, // Sort alphabetically
    },
    {
      title: "Persentase Stunting",
      dataIndex: "stuntingPercentage",
      key: "stuntingPercentage",
      sorter: (a: any, b: any) =>
        a.stuntingPercentage.localeCompare(b.stuntingPercentage), // Sort alphabetically
      render: (text: any) => (text !== null ? `${text}%` : "N/A"), // Render percentage or N/A
    },
  ];
  //   <Row justify={"space-between"}>
  //   {/* Dropdown for selecting the year */}
  //   <Select defaultValue="2021" onChange={handleYearChange}>
  //     <Select.Option value="2023">2023</Select.Option>
  //     <Select.Option value="2022">2022</Select.Option>
  //     <Select.Option value="2021">2021</Select.Option>
  //   </Select>
  //   <Select defaultValue="desc">
  //     <Select.Option value="desc">Paling Banyak</Select.Option>
  //     <Select.Option value="asc">Paling Sedikit</Select.Option>
  //     <Select.Option value="az">A - Z</Select.Option>
  //     <Select.Option value="za">Z - A</Select.Option>
  //   </Select>
  // </Row>
  return (
    <Card title="Persentase Stunting di Setiap Provinsi">
      <Col>
        {/* Table to render stunting data */}
        <Table
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
            className: "justify-start",
          }}
          columns={columns}
          dataSource={stuntingDataForYear}
          rowKey="city"
          showSorterTooltip={{ target: "sorter-icon" }}
        />
      </Col>
    </Card>
  );
};

export default StuntingProvinceCard;
