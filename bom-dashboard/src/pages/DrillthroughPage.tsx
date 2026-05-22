import { useMemo, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import "./DrillthroughPage.css";
import masterData from "../../public/data/master_fg_data.json";
import agentData from "../../public/data/agent_extracted_data.json";

const DrillthroughPage = () => {

const [uniqueIdFilter,setUniqueIdFilter] = useState("");
const [clientFilter,setClientFilter] = useState("");
const [fgFilter,setFgFilter] = useState("");
const [formulaFilter,setFormulaFilter] = useState("");
const [validFromFilter,setValidFromFilter] = useState("");

const filteredMasterData = useMemo(() => {
return masterData.filter((item:any) => {

const uniqueIdMatch =
!uniqueIdFilter ||
String(item.unique_id).toLowerCase().includes(uniqueIdFilter.toLowerCase());

const clientMatch =
!clientFilter ||
String(item.company_name).toLowerCase().includes(clientFilter.toLowerCase());

const fgMatch =
!fgFilter ||
String(item.fg_description).toLowerCase().includes(fgFilter.toLowerCase());

const formulaMatch =
!formulaFilter ||
String(item.formula_number).toLowerCase().includes(formulaFilter.toLowerCase());

const validFromMatch =
!validFromFilter ||
String(item.valid_from).toLowerCase().includes(validFromFilter.toLowerCase());

return (
uniqueIdMatch &&
clientMatch &&
fgMatch &&
formulaMatch &&
validFromMatch
);

});
},[
uniqueIdFilter,
clientFilter,
fgFilter,
formulaFilter,
validFromFilter
]);

const selectedMaster = filteredMasterData[0];

const relatedAgent = useMemo(() => {
return agentData.filter(
(item:any) =>
String(item.source_unique_id) ===
String(selectedMaster?.unique_id)
);
},[selectedMaster]);

const selectedAgent = relatedAgent[0];

const getStatusClass = (status:string) => {
if(status === "matched") return "status-matched";
if(status === "review") return "status-review";
return "status-manual";
};

return (
<DashboardLayout>

<div className="drillthrough-page">

<div className="drillthrough-header">

<h1>FG Drill-through</h1>

<p>
Inspect extracted FG records against source system master data
</p>

</div>

<div className="drillthrough-filter-bar">

<div className="filter-select-wrapper">
<select
value={uniqueIdFilter}
onChange={(e)=>setUniqueIdFilter(e.target.value)}
>
<option value="">Clear All Filters</option>

{[...new Set(masterData.map((item:any)=>item.unique_id))]
.map((id:any)=>(
<option key={id} value={id}>
{id}
</option>
))}
</select>

<span className="filter-label">
Unique ID
</span>

<span className="filter-arrow">
▼
</span>
</div>

<div className="filter-select-wrapper">
<select
value={clientFilter}
onChange={(e)=>setClientFilter(e.target.value)}
>
<option value="">Clear All Filters</option>

{[...new Set(masterData.map((item:any)=>item.company_name))]
.map((client:any)=>(
<option key={client} value={client}>
{client}
</option>
))}
</select>

<span className="filter-label">
Client Name
</span>

<span className="filter-arrow">
▼
</span>
</div>

<div className="filter-select-wrapper">
<select
value={fgFilter}
onChange={(e)=>setFgFilter(e.target.value)}
>
<option value="">Clear All Filters</option>

{[...new Set(masterData.map((item:any)=>item.fg_description))]
.map((fg:any)=>(
<option key={fg} value={fg}>
{fg}
</option>
))}
</select>

<span className="filter-label">
FG Description
</span>

<span className="filter-arrow">
▼
</span>
</div>

<div className="filter-select-wrapper">
<select
value={formulaFilter}
onChange={(e)=>setFormulaFilter(e.target.value)}
>
<option value="">Clear All Filters</option>

{[...new Set(masterData.map((item:any)=>item.formula_number))]
.map((formula:any)=>(
<option key={formula} value={formula}>
{formula}
</option>
))}
</select>

<span className="filter-label">
Formula Number
</span>

<span className="filter-arrow">
▼
</span>
</div>

<div className="filter-select-wrapper">
<select
value={validFromFilter}
onChange={(e)=>setValidFromFilter(e.target.value)}
>
<option value="">Clear All Filters</option>

{[...new Set(masterData.map((item:any)=>item.valid_from))]
.map((date:any)=>(
<option key={date} value={date}>
{date}
</option>
))}
</select>

<span className="filter-label">
Valid From
</span>

<span className="filter-arrow">
▼
</span>
</div>

<button
className="clear-slicer-btn"
onClick={()=>{
setUniqueIdFilter("");
setClientFilter("");
setFgFilter("");
setFormulaFilter("");
setValidFromFilter("");
}}
>
Clear All Slicers
</button>

</div>

<div className="drillthrough-grid">

<div className="panel-card">

<div className="panel-title">
Agent Extracted Data
</div>

<div className="details-wrapper">

<div className="details-grid">

<div className="detail-item">
<label>Extraction ID</label>
<span>{selectedAgent?.extraction_id}</span>
</div>

<div className="detail-item">
<label>Sender</label>
<span>{selectedAgent?.sender_name}</span>
</div>

<div className="detail-item">
<label>Client</label>
<span>{selectedAgent?.extracted_client_name}</span>
</div>

<div className="detail-item">
<label>FG Description</label>
<span>{selectedAgent?.extracted_fg_description}</span>
</div>

<div className="detail-item">
<label>SKU</label>
<span>{selectedAgent?.extracted_sku}</span>
</div>

<div className="detail-item">
<label>Match Code</label>
<span>{selectedAgent?.extracted_match_code}</span>
</div>

<div className="detail-item">
<label>Formula Number</label>
<span>{selectedAgent?.extracted_formula_number}</span>
</div>

<div className="detail-item">
<label>Fill Weight</label>
<span>{selectedAgent?.extracted_fill_weight}</span>
</div>

<div className="detail-item">
<label>Valid From</label>
<span>{selectedAgent?.extracted_valid_from}</span>
</div>

<div className="detail-item">
<label>Confidence</label>
<span>{selectedAgent?.extraction_confidence}</span>
</div>

<div className="detail-item">
<label>Status</label>

<span className={getStatusClass(selectedAgent?.extraction_status)}>
{selectedAgent?.extraction_status}
</span>

</div>

</div>

<div className="notes-box">

<div className="notes-title">
Extracted Notes
</div>

<div className="notes-content">
{selectedAgent?.extracted_notes}
</div>

</div>

</div>

</div>

<div className="panel-card">

<div className="panel-title">
Master System Data
</div>

<div className="details-wrapper">

<div className="details-grid">

<div className="detail-item">
<label>Unique ID</label>
<span>{selectedMaster?.unique_id}</span>
</div>

<div className="detail-item">
<label>Client Name</label>
<span>{selectedMaster?.company_name}</span>
</div>

<div className="detail-item">
<label>FG Description</label>
<span>{selectedMaster?.fg_description}</span>
</div>

<div className="detail-item">
<label>SKU</label>
<span>{selectedMaster?.client_sku_number}</span>
</div>

<div className="detail-item">
<label>FG Match Code</label>
<span>{selectedMaster?.elabs_fg_match_code}</span>
</div>

<div className="detail-item">
<label>Formula Number</label>
<span>{selectedMaster?.formula_number}</span>
</div>

<div className="detail-item">
<label>Fill Weight</label>
<span>{selectedMaster?.fill_weight}</span>
</div>

<div className="detail-item">
<label>Valid From</label>
<span>{selectedMaster?.valid_from}</span>
</div>

</div>

</div>

<div className="comparison-section">

<div className="comparison-title">
Validation Summary
</div>

<table className="comparison-table">

<thead>
<tr>
<th>Field</th>
<th>Agent Extracted</th>
<th>Master Data</th>
</tr>
</thead>

<tbody>

<tr>
<td>FG Description</td>
<td>{selectedAgent?.extracted_fg_description}</td>
<td>{selectedMaster?.fg_description}</td>
</tr>

<tr>
<td>SKU</td>
<td>{selectedAgent?.extracted_sku}</td>
<td>{selectedMaster?.client_sku_number}</td>
</tr>

<tr>
<td>Formula</td>
<td>{selectedAgent?.extracted_formula_number}</td>
<td>{selectedMaster?.formula_number}</td>
</tr>

<tr>
<td>Match Code</td>
<td>{selectedAgent?.extracted_match_code}</td>
<td>{selectedMaster?.elabs_fg_match_code}</td>
</tr>

</tbody>

</table>

</div>

</div>

</div>

</div>

</DashboardLayout>
);
};

export default DrillthroughPage;