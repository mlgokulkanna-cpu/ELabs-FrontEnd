import { useEffect, useState } from "react";
import Dashboardlayout from "../components/layout/DashboardLayout";
import Header from "../components/layout/Header";
import Table from "../components/tables/Table";
import { readExcelSheet } from "../data/excelReader";
import "../components/cards/Card.css";

function App() {
  const [excelData, setExcelData] = useState<any[]>([]);

  useEffect(() => {
    const loadExcelData = async () => {
      const data = await readExcelSheet("/data/dummy_dataset.xlsx", "master_fg_data");

      setExcelData(data);
    };

    loadExcelData();
  }, []);

  const columns = [
    { header: "Unique ID", accessor: "unique_id" },
    { header: "Client Name", accessor: "company_name" },
    { header: "FG Description", accessor: "fg_description" },
    { header: "SKU", accessor: "client_sku_number" },
    { header: "FG Match Code", accessor: "elabs_fg_match_code" },
    { header: "Fill Weight", accessor: "fill_weight" },
    { header: "Formula Number", accessor: "formula_number" },
    { header: "Valid From", accessor: "valid_from" },
  ];

  const mappedTableData = excelData.map((row) => ({
    unique_id: row.unique_id || "",
    company_name: row.company_name || "",
    fg_description: row.fg_description || "",
    client_sku_number:
      row.client_sku_number || "",
    elabs_fg_match_code:
      row.elabs_fg_match_code || "",
    fill_weight: row.fill_weight || "",
    formula_number:
      row.formula_number || "",
    valid_from: row.valid_from || "",
  }));

  const handleCellClick = (
    accessor: string,
    value: string
  ) => {
    console.log(accessor, value);
  };

  const totalClients = new Set(
    mappedTableData.map(
      (r) => r.company_name
    )
  ).size;

  const totalFGs =
    mappedTableData.length;

  return (
    <Dashboardlayout>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100vh",
          overflow: "hidden",
          padding:
            "0 18px 18px 18px",
        }}
      >
        <Header />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "18px",
              flexWrap: "wrap",
            }}
          >
            <div className="card">
              <h3 className="card-title">
                Total Clients
              </h3>

              <p className="card-value">
                {totalClients}
              </p>
            </div>

            <div className="card">
              <h3 className="card-title">
                Total FGs
              </h3>

              <p className="card-value">
                {totalFGs}
              </p>
            </div>
          </div>

          <h2 className="table-title">
            Finished Goods Overview
          </h2>

          <Table
            columns={columns}
            data={mappedTableData}
            onCellClick={
              handleCellClick
            }
          />
        </div>
      </div>
    </Dashboardlayout>
  );
}

export default App;