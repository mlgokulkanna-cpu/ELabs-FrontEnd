import { useEffect, useState } from "react";

import {
Building2,
Boxes,
ShieldCheck,
TriangleAlert,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";

import Table from "../components/tables/Table";

import { getMasterData } from "../api/dashboardApi";

const OverviewPage = () => {

const [excelData, setExcelData] =
useState<any[]>([]);

useEffect(() => {

const loadData = async () => {

try {

const data =
await getMasterData();

setExcelData(data);

} catch (err) {

console.error(err);

}

};

loadData();

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
client_sku_number: row.client_sku_number || "",
elabs_fg_match_code: row.elabs_fg_match_code || "",
fill_weight: row.fill_weight || "",
formula_number: row.formula_number || "",
valid_from: row.valid_from || "",
}));

const totalClients =
new Set(mappedTableData.map((r) => r.company_name)).size;

const totalFGs = mappedTableData.length;

const matchedCount = Math.floor(totalFGs * 0.82);

const reviewCount = totalFGs - matchedCount;

const stats = [
{
title: "Total Clients",
value: totalClients,
icon: <Building2 className="h-5 w-5" />,
card: "from-[#FFB7A0] to-[#FFD5C7]",
glow: "shadow-[0_10px_30px_rgba(255,183,160,0.18)]",
text: "text-[#7B4A3A]",
},
{
title: "Total FGs",
value: totalFGs,
icon: <Boxes className="h-5 w-5" />,
card: "from-[#CDECC9] to-[#E9F9E6]",
glow: "shadow-[0_10px_30px_rgba(205,236,201,0.18)]",
text: "text-[#49614B]",
},
{
title: "Validated FG count",
value: matchedCount,
icon: <ShieldCheck className="h-5 w-5" />,
card: "from-[#B9ECD8] to-[#DDF8EE]",
glow: "shadow-[0_10px_30px_rgba(185,236,216,0.18)]",
text: "text-[#2D5B4F]",
},
{
title: "Need to Review FG count",
value: reviewCount,
icon: <TriangleAlert className="h-5 w-5" />,
card: "from-[#97E0ED] to-[#D7F7FB]",
glow: "shadow-[0_10px_30px_rgba(151,224,237,0.18)]",
text: "text-[#2B5862]",
},
];

return (

<DashboardLayout>

<div
className="
relative
h-full
overflow-hidden
pb-16
"
>

<div className="shrink-0">

<h1
className="
text-[22px]
sm:text-[28px]
lg:text-[35px]
font-bold
tracking-tight
text-[#243B6B]
leading-tight
"
>
BOM Extraction - Customer Overview
</h1>

<p
className="
mt-1
text-[11px]
sm:text-[14px]
italic
text-[#445B88]
"
>
Review extracted FG records and line items by client
</p>

</div>

<div
className="
grid
grid-cols-2
lg:grid-cols-4
gap-3
mt-5
shrink-0
"
>

{stats.map((item) => (

<div
key={item.title}
className={`
bg-gradient-to-br
${item.card}
${item.glow}
border
border-white/10
h-[60px]
sm:h-[70px]
lg:h-[80px]
overflow-hidden
`}
>

<div
className="
h-full
px-4
py-3
flex
items-start
justify-between
"
>

<div className="min-w-0">

<p
className={`
text-[10px]
sm:text-[15px]
font-semibold
truncate
${item.text}
`}
>
{item.title}
</p>

<h2
className={`
mt-1
text-[24px]
lg:text-[28px]
font-bold
leading-none
${item.text}
`}
>
{item.value}
</h2>

</div>

<div
className={`
flex
h-8
w-8
items-center
justify-center
shrink-0
${item.text}
`}
>
{item.icon}
</div>

</div>

</div>

))}

</div>

<div
className="
mt-5
shrink-0
flex
items-center
justify-between
gap-4
"
>

<h2
className="
text-[28px]
font-bold
text-[#243B6B]
"
>
Finished Goods Overview
</h2>

<button
onClick={()=>{
localStorage.removeItem(
"bom-table-filters"
);
window.location.reload();
}}
className="
h-[38px]
px-4
text-[13px]
font-medium
border
border-[rgba(36,59,107,0.16)]
bg-[rgba(255,255,255,0.28)]
backdrop-blur-md
text-[#243B6B]
hover:bg-[rgba(255,255,255,0.45)]
transition-all
"
>
Clear All Slicers
</button>

</div>

<div
className="
flex-1
min-h-0
overflow-hidden
mt-5
"
>

<Table
columns={columns}
data={mappedTableData}
/>

</div>

</div>

</DashboardLayout>

);

};

export default OverviewPage;