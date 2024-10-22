"use client";
import { Button, Col, Row } from "antd";

export default function AdminDashboardIndex() {
  return (
    <main>
      <div style={{ padding: "20px" }}>
        <Row>
          <Col span={12}>
            {/* You can use an SVG image or a React component to show the map */}
            <img
              src="/path-to-your-map-image.svg"
              alt="Map"
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={12}>
            <h2>Persentase Stunting di Setiap Provinsi</h2>
            <ul>
              <li>Jakarta: 12.53%</li>
              <li>Aceh: 20.27%</li>
              <li>Bandung: 13.91%</li>
              <li>Depok: 23.63%</li>
              <li>Tangerang: 7.04%</li>
              <li>Bogor: 22.84%</li>
            </ul>
            <Button type="primary">Lihat Selengkapnya</Button>
          </Col>
        </Row>
      </div>
    </main>
  );
}
