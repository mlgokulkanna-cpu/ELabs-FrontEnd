import {
useMemo,
useState,
useEffect,
useRef
} from "react";

import { useNavigate } from "react-router-dom";

import {
ChevronDown,
} from "lucide-react";

import {
Table as UITable,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from "@/components/ui/table";

interface Column{
header:string;
accessor:string;
}

interface TableProps{
columns:Column[];
data:Record<string,any>[];
}

const COL_FLEX: Record<string,number>={
unique_id:1,
company_name:1.5,
fg_description:2.5,
client_sku_number:1.5,
elabs_fg_match_code:1.5,
fill_weight:1,
formula_number:1.5,
valid_from:1.2,
};

const Table=({
columns,
data,
}:TableProps)=>{

const navigate=useNavigate();

const containerRef=useRef<HTMLDivElement>(null);

const [colFilters,setColFilters]=
useState<Record<string,string>>(()=>{

const savedFilters=
localStorage.getItem(
"bom-table-filters"
);

return savedFilters
? JSON.parse(savedFilters)
: {};

});

useEffect(()=>{

localStorage.setItem(
"bom-table-filters",
JSON.stringify(colFilters)
);

},[colFilters]);

const [openFilter,setOpenFilter]=
useState<string|null>(null);

useEffect(()=>{

const handleClickOutside=(e:MouseEvent)=>{

if(
containerRef.current &&
!containerRef.current.contains(
e.target as Node
)
){
setOpenFilter(null);
}

};

document.addEventListener(
"mousedown",
handleClickOutside
);

return()=>{
document.removeEventListener(
"mousedown",
handleClickOutside
);
};

},[]);

const filteredData=useMemo(()=>{

return data.filter((row)=>
columns.every((col)=>{

const filterValue=
colFilters[col.accessor];

if(!filterValue) return true;

return(
String(row[col.accessor] ?? "")===
filterValue
);

})
);

},[
data,
columns,
colFilters
]);

const getColumnOptions=(
accessor:string
)=>{

const rowsWithoutCurrentFilter=
data.filter((row)=>
columns.every((col)=>{

if(col.accessor===accessor)
return true;

const filterValue=
colFilters[col.accessor];

if(!filterValue) return true;

return(
String(row[col.accessor] ?? "")===
filterValue
);

})
);

return[
...new Set(
rowsWithoutCurrentFilter
.map((row)=>
String(row[accessor] ?? "")
)
.filter(Boolean)
),
].sort();

};

const setFilter=(
accessor:string,
value:string
)=>{

setColFilters((prev)=>({
...prev,
[accessor]:value,
}));

setOpenFilter(null);

};

const clearFilter=(accessor:string)=>{

setColFilters((prev)=>{

const updated={...prev};

delete updated[accessor];

return updated;

});

setOpenFilter(null);

};

const clearAllFilters=()=>{

setColFilters({});
setOpenFilter(null);

};

const totalFlex=
columns.reduce((acc,col)=>
acc+(COL_FLEX[col.accessor]??1),0
);

const getColWidth=(accessor:string)=>{
const flex=COL_FLEX[accessor]??1;
return`${((flex/totalFlex)*100).toFixed(2)}%`;
};

const tableStyle={
width:"100%",
tableLayout:"fixed" as const,
};

return(

<div
ref={containerRef}
className="relative bg-transparent w-full"
>

<UITable style={tableStyle}>

<colgroup>
{columns.map((col)=>(
<col
key={col.accessor}
style={{ width:getColWidth(col.accessor) }}
/>
))}
</colgroup>

<TableHeader>

<TableRow
className="
border-none
hover:bg-transparent
"
>

{columns.map((col)=>{

const isOpen=
openFilter===col.accessor;

const isFiltered=
!!colFilters[col.accessor];

return(

<TableHead
key={col.accessor}
className="
relative
px-3
py-3
text-[12px]
lg:text-[13px]
font-semibold
tracking-normal
text-[#29406F]
border-none
bg-[#EAF7FC]
shadow-sm
overflow-visible
"
>

<div
className="
flex
items-center
justify-between
gap-2
"
>

<span className="truncate">
{col.header}
</span>

<button
onClick={(e)=>{
e.stopPropagation();
setOpenFilter(
isOpen ? null : col.accessor
);
}}
className={`
flex
h-7
w-7
shrink-0
items-center
justify-center
transition-all
${
isFiltered
?
"bg-[#97E0ED] text-[#243B6B] border border-[#243B6B]"
:
"bg-[rgba(255,255,255,0.55)] text-[#243B6B] border border-[rgba(36,59,107,0.18)]"
}
`}
>

<ChevronDown className="h-3 w-3" />

</button>

</div>

{isOpen && (

<div
className="
fixed
z-[9999]
w-[200px]
border
border-[#DDECF0]
bg-white
shadow-2xl
mt-1
"
style={{
top:"auto",
}}
>

<button
onClick={()=>
clearFilter(col.accessor)
}
className="
w-full
border-b
border-[#EEF4F6]
px-3
py-2
text-left
text-xs
font-medium
text-red-500
hover:bg-red-50
"
>

Clear Filter

</button>

<div
className="
max-h-[240px]
overflow-auto
"
>

{getColumnOptions(
col.accessor
).map((opt)=>(

<button
key={opt}
onClick={()=>
setFilter(
col.accessor,
opt
)
}
className={`
w-full
px-3
py-2
text-left
text-xs
transition-all
${
colFilters[
col.accessor
]===opt
?
"bg-[#D9F7FA] text-[#243B6B] font-semibold"
:
"text-[#4B5D7A] hover:bg-[#F4FBFC]"
}
`}
>

{opt}

</button>

))}

</div>

</div>

)}

</TableHead>

);

})}

</TableRow>

</TableHeader>

</UITable>

<div
className="
overflow-y-auto
h-[52vh]
lg:h-[58vh]
"
>

<UITable style={tableStyle}>

<colgroup>
{columns.map((col)=>(
<col
key={col.accessor}
style={{ width:getColWidth(col.accessor) }}
/>
))}
</colgroup>

<TableBody>

{filteredData.map((
row,
rowIndex
)=>(

<TableRow
key={rowIndex}
onClick={()=>{
navigate(
`/drillthrough/${row.unique_id}`
);
}}
className="
cursor-pointer
border-b
border-[rgba(36,59,107,0.08)]
transition-all
hover:bg-[rgba(234,247,252,0.5)]
"
>

{columns.map((col)=>(

<TableCell
key={col.accessor}
className="
px-3
py-3
text-[12px]
lg:text-[14px]
font-medium
text-[#42506A]
truncate
"
>

{row[col.accessor]}

</TableCell>

))}

</TableRow>

))}

</TableBody>

</UITable>

</div>

</div>

);

};

export default Table;