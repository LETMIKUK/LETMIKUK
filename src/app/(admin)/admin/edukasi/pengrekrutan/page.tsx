"use client";

import React from "react";
import { Table } from "antd";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import TypographyTitle from "antd/lib/typography/Title";


export default function Page() {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
  ];

  const data = [
    {
      key: "1",
      name: "John Doe",
      age: 32,
      address: "123 Main Street",
      email: "john.doe@example.com",
      gender: "Male",
    },
    {
      key: "2",
      name: "Jane Smith",
      age: 28,
      address: "456 Maple Avenue",
      email: "jane.smith@example.com",
      gender: "Female",
    },
    {
      key: "3",
      name: "Michael Johnson",
      age: 45,
      address: "789 Elm Road",
      email: "michael.johnson@example.com",
      gender: "Male",
    },
  ];

  // Calculate gender distribution
  const genderData = data.reduce(
    (acc, item) => {
      if (item.gender === "Male") {
        acc.male += 1;
      } else if (item.gender === "Female") {
        acc.female += 1;
      }
      return acc;
    },
    { male: 0, female: 0 }
  );

  // Pie chart configuration
  const chartOptions: ApexOptions = {
    chart: {
      type: "pie",
    },
    labels: ["Male", "Female"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const chartSeries = [genderData.male, genderData.female];

  return (
    <div>
      <div className="p-5 flex flex-col">
      <TypographyTitle >Dashboard Rekrutmen Edukasi</TypographyTitle>
        <Table columns={columns} dataSource={data} />
      </div>
      <div className="p-5 flex flex-col">
        <h2>Gender Distribution</h2>
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="pie"
          width={380}
        />
      </div>
    </div>
  );
}
