import { useMemo, useState, useEffect } from "react";
import { getMasterData } from "../api/dashboardApi";

import {
useNavigate,
useParams
} from "react-router-dom";

import {
ArrowLeft,
BadgeCheck,
ShieldCheck,
Boxes,
Database,
TriangleAlert
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";

const DrillthroughPage=()=>{

const [fgData, setData] = useState<any[]>([]);

useEffect(() => {

const fetchData = async () => {

try {

const result =
await getMasterData();

setData(result);

} catch (err) {

console.error(err);

}

};

fetchData();

}, []);

const navigate=useNavigate();

const {id}=useParams();

const selectedData=useMemo(()=>{

return fgData.find(
(item)=>
String(item.unique_id)===
String(id)
);

},[fgData,id]);

if(!selectedData){

return(
<DashboardLayout>

<div
className="
h-full
flex
items-center
justify-center
"
>

<div className="text-center">

<h2
className="
text-3xl
font-bold
text-[#243B6B]
"
>
Record not found
</h2>

<button
onClick={()=>
navigate("/overview")
}
className="
mt-4
bg-[#243B6B]
text-white
px-5
py-3
"
>
Back
</button>

</div>

</div>

</DashboardLayout>
);

}

const validationRows=[
{
field:"FG Description",
agent:selectedData.fg_description,
master:selectedData.fg_description,
},
{
field:"SKU",
agent:selectedData.client_sku_number,
master:selectedData.client_sku_number,
},
{
field:"Formula",
agent:selectedData.formula_number,
master:selectedData.formula_number,
},
{
field:"Match Code",
agent:selectedData.elabs_fg_match_code,
master:selectedData.elabs_fg_match_code,
},
];

const stats=[
{
title:"Unique ID",
value:selectedData.unique_id,
icon:<Database className="h-6 w-6" />,
card:
"from-[#FFB7A0] to-[#FFD5C7]",
glow:
"shadow-[0_10px_30px_rgba(255,183,160,0.18)]",
text:"text-[#7B4A3A]",
},
{
title:"Formula",
value:selectedData.formula_number,
icon:<Boxes className="h-6 w-6" />,
card:
"from-[#CDECC9] to-[#E9F9E6]",
glow:
"shadow-[0_10px_30px_rgba(205,236,201,0.18)]",
text:"text-[#49614B]",
},
{
title:"Validation",
value:"98%",
icon:<ShieldCheck className="h-6 w-6" />,
card:
"from-[#B9ECD8] to-[#DDF8EE]",
glow:
"shadow-[0_10px_30px_rgba(185,236,216,0.18)]",
text:"text-[#2D5B4F]",
},
{
title:"Review Status",
value:"Matched",
icon:<TriangleAlert className="h-6 w-6" />,
card:
"from-[#97E0ED] to-[#D7F7FB]",
glow:
"shadow-[0_10px_30px_rgba(151,224,237,0.18)]",
text:"text-[#2B5862]",
},
];

return(

<DashboardLayout>

<div
className="
w-full
max-w-[1600px]
mx-auto
"
>

<div
className="
flex
items-center
justify-between
gap-4
flex-wrap
"
>

<button
onClick={()=>
navigate("/overview")
}
className="
flex
items-center
gap-2
px-4
py-3
bg-white/50
backdrop-blur-md
text-[#243B6B]
font-medium
hover:bg-white/70
transition-all
"
>

<ArrowLeft size={18} />

Back to Overview

</button>

<div
className="
flex
items-center
gap-2
bg-[#DDF8EE]
text-[#2D5B4F]
px-4
py-3
font-semibold
shadow-lg
"
>

<BadgeCheck size={18} />

Matched

</div>

</div>

<div className="mt-7">

<h1
className="
text-[30px]
sm:text-[42px]
font-bold
text-[#243B6B]
leading-tight
"
>
FG Drill-through
</h1>

<p
className="
mt-2
text-[#5B739D]
text-sm
"
>
Detailed validation and comparison view for selected FG product.
</p>

</div>

<div
className="
grid
grid-cols-2
md:grid-cols-4
gap-4
mt-6
"
>

{stats.map((item)=>(

<div
key={item.title}
className={`
bg-gradient-to-br
${item.card}
${item.glow}
p-4
`}
>

<div className="flex items-center justify-between">

<div>

<p
className={`
text-xs
font-semibold
${item.text}
opacity-80
`}
>
{item.title}
</p>

<h2
className={`
mt-2
text-2xl
font-bold
${item.text}
break-words
`}
>
{item.value}
</h2>

</div>

<div className={item.text}>

{item.icon}

</div>

</div>

</div>

))}

</div>

<div
className="
grid
xl:grid-cols-2
gap-5
mt-6
"
>

<div
className="
bg-[rgba(255,255,255,0.18)]
backdrop-blur-xl
border
border-white/20
p-5
shadow-xl
"
>

<h2
className="
text-[26px]
font-bold
text-[#243B6B]
"
>
Agent Extracted Data
</h2>

<div
className="
grid
grid-cols-2
gap-x-8
gap-y-5
mt-6
"
>

{[
["Extraction ID",`EXT-${selectedData.unique_id}`],
["Sender","sarah@clientbrw.com"],
["Client",selectedData.company_name],
["FG Description",selectedData.fg_description],
["SKU",selectedData.client_sku_number],
["Match Code",selectedData.elabs_fg_match_code],
["Formula Number",selectedData.formula_number],
["Fill Weight",selectedData.fill_weight],
["Valid From",selectedData.valid_from],
["Confidence","0.98"],
].map(([label,value])=>(

<div key={label}>

<p
className="
text-[11px]
uppercase
tracking-[1px]
font-semibold
text-[#7B8FB3]
"
>
{label}
</p>

<p
className="
mt-1
text-[16px]
font-medium
text-[#2F4467]
break-words
"
>
{value}
</p>

</div>

))}

</div>

</div>

<div
className="
bg-[rgba(255,255,255,0.18)]
backdrop-blur-xl
border
border-white/20
p-5
shadow-xl
"
>

<h2
className="
text-[26px]
font-bold
text-[#243B6B]
"
>
Validation Summary
</h2>

<div className="mt-5 overflow-auto">

<table className="w-full">

<thead>

<tr
className="
bg-white/20
"
>

<th
className="
px-4
py-3
text-left
text-xs
font-semibold
text-[#243B6B]
"
>
Field
</th>

<th
className="
px-4
py-3
text-left
text-xs
font-semibold
text-[#243B6B]
"
>
Agent Extracted
</th>

<th
className="
px-4
py-3
text-left
text-xs
font-semibold
text-[#243B6B]
"
>
Master Data
</th>

</tr>

</thead>

<tbody>

{validationRows.map((row,index)=>(

<tr
key={index}
className="
border-b
border-white/10
"
>

<td
className="
px-4
py-4
text-sm
font-semibold
text-[#243B6B]
"
>
{row.field}
</td>

<td
className="
px-4
py-4
text-sm
text-[#445B88]
"
>
{row.agent}
</td>

<td
className="
px-4
py-4
text-sm
text-[#445B88]
"
>
{row.master}
</td>

</tr>

))}

</tbody>

</table>

</div>

<div
className="
grid
grid-cols-2
gap-5
mt-8
"
>

<div>

<p
className="
text-[11px]
uppercase
tracking-[1px]
font-semibold
text-[#7B8FB3]
"
>
Master Client
</p>

<p
className="
mt-1
text-[16px]
font-medium
text-[#2F4467]
"
>
{selectedData.company_name}
</p>

</div>

<div>

<p
className="
text-[11px]
uppercase
tracking-[1px]
font-semibold
text-[#7B8FB3]
"
>
SKU
</p>

<p
className="
mt-1
text-[16px]
font-medium
text-[#2F4467]
"
>
{selectedData.client_sku_number}
</p>

</div>

<div>

<p
className="
text-[11px]
uppercase
tracking-[1px]
font-semibold
text-[#7B8FB3]
"
>
Formula
</p>

<p
className="
mt-1
text-[16px]
font-medium
text-[#2F4467]
"
>
{selectedData.formula_number}
</p>

</div>

<div>

<p
className="
text-[11px]
uppercase
tracking-[1px]
font-semibold
text-[#7B8FB3]
"
>
FG Match Code
</p>

<p
className="
mt-1
text-[16px]
font-medium
text-[#2F4467]
"
>
{selectedData.elabs_fg_match_code}
</p>

</div>

</div>

</div>

</div>

</div>

</DashboardLayout>

);

};

export default DrillthroughPage;