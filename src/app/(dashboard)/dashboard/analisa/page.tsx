import IndonesiaMap from "@/app/components/IndonesiaMap";
import StuntingProvinceCard from "@/app/components/StuntingProvinceCard";
import TypographyTitle from "antd/lib/typography/Title";

export default function Page() {
  return (
    <div className="p-5 flex flex-col">
      <TypographyTitle>Analisa Stunting Per Provinsi</TypographyTitle>

      <div className="flex  flex-row justify-evenly items-center">
        <IndonesiaMap />
        <StuntingProvinceCard />
      </div>
    </div>
  );
}
