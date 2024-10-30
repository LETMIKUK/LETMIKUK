"use client";
import React, { useState, useEffect } from "react";
import { Table, Pagination } from "antd";
import "@/lib/AssetTable.css";

interface AssetData {
  key: number;
  assetName: string;
  assetType: string;
  currentAmount: number;
  amountNeeded: number;
  price: number;
  additionalBudget: number; // New field for additional budget needed
}

// Function to determine the asset type based on asset name
function getAssetType(assetName: string): string {
  switch (assetName) {
    case "Beras":
      return "Sembako Karbohidrat";
    case "Daging Ayam":
    case "Telur":
      return "Sembako Protein";
    case "Wortel":
    case "Tomat":
    case "Jeruk":
    case "Apel":
      return "Sembako Vitamin";
    case "Air":
      return "Sembako Hidrasi";
    case "Kardus":
    case "Packaging Sterofoam":
    case "Kantong Plastik":
    case "Lakban":
      return "Pengemasan";
    default:
      return "Unknown";
  }
}

// Function to determine the price based on asset type
function getPriceByAssetType(assetType: string): number {
  switch (assetType) {
    case "Sembako Karbohidrat":
      return 50000;
    case "Sembako Protein":
      return 40000;
    case "Sembako Vitamin":
      return 30000;
    case "Sembako Hidrasi":
      return 20000;
    case "Pengemasan":
      return 5000;
    default:
      return 0;
  }
}

// Generate unique asset data on the client side only
function generateUniqueAssetData(): AssetData[] {
  const assets = [
    "Lakban",
    "Beras",
    "Daging Ayam",
    "Telur",
    "Wortel",
    "Tomat",
    "Jeruk",
    "Apel",
    "Air",
    "Kardus",
    "Packaging Sterofoam",
    "Kantong Plastik",
  ];

  return assets.map((assetName, index) => {
    const assetType = getAssetType(assetName);
    const price = getPriceByAssetType(assetType);
    const currentAmount = getRandomNumber(50, 200);
    const amountNeeded = 100;

    // Calculate additional budget if current stock is less than the needed stock
    const additionalBudget =
      currentAmount < amountNeeded ? (amountNeeded - currentAmount) * price : 0;

    return {
      key: index,
      assetName,
      assetType,
      currentAmount,
      amountNeeded,
      price,
      additionalBudget, // Assign calculated additional budget here
    };
  });
}

// Helper function to generate a random number between min and max
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function AssetTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [assetData, setAssetData] = useState<AssetData[]>([]);
  const pageSize = 5;

  useEffect(() => {
    // Generate asset data only on the client side
    setAssetData(generateUniqueAssetData());
  }, []);

  const columns = [
    {
      title: "Nama Aset",
      dataIndex: "assetName",
      key: "assetName",
    },
    {
      title: "Tipe Aset",
      dataIndex: "assetType",
      key: "assetType",
    },
    {
      title: "Jumlah Tersedia",
      dataIndex: "currentAmount",
      key: "currentAmount",
    },
    {
      title: "Jumlah Dibutuhkan",
      dataIndex: "amountNeeded",
      key: "amountNeeded",
    },
    {
      title: "Harga Satuan",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `Rp ${price.toLocaleString()}`,
    },
    {
      title: "Modal Diperlukan",
      dataIndex: "additionalBudget",
      key: "additionalBudget",
      render: (additionalBudget: number) =>
        `Rp ${additionalBudget.toLocaleString()}`, // Format additional budget with thousand separators
    },
  ];

  const currentData = assetData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f5f5f5" }}>
      <h2>Penyimpanan Aset</h2>
      <Table
        columns={columns}
        dataSource={currentData}
        pagination={false}
        rowClassName={(record) =>
          `table-row-hover ${record.currentAmount < record.amountNeeded ? "low-inventory" : "sufficient-inventory"}`
        }
        style={{ borderCollapse: "separate", borderSpacing: "0 1px" }}
        bordered
      />

      <Pagination
        current={currentPage}
        total={assetData.length}
        pageSize={pageSize}
        onChange={handleChange}
        style={{
          textAlign: "center",
          marginTop: "1rem",
          padding: "1rem 0",
        }}
      />
    </div>
  );
}
