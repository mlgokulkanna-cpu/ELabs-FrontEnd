import {
useMemo,
useState,
useEffect
} from "react";

import { useNavigate } from "react-router-dom";

import {
ChevronDown,
X
} from "lucide-react";

import {
Table as UITable,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

interface Column{
header:string;
accessor:string;
}

interface TableProps{
columns:Column[];
data:Record<string,any>[];
}

const Table=({
columns,
data,
}:TableProps)=>{

const navigate=useNavigate();

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

return(

<div
className="
relative
bg-transparent
overflow-hidden
"
>
<div
className="
absolute
top-0
right-0
z-20
"
>

<Button
variant="outline"
onClick={clearAllFilters}
className="
h-[38px]
border
border-[rgba(41,64,111,0.16)]
bg-[rgba(255,255,255,0.22)]
backdrop-blur-md
px-4
text-[12px]
font-semibold
text-[#29406F]
hover:bg-[rgba(255,255,255,0.34)]
hover:text-[#243B6B]
shadow-none
"
>

<X className="mr-2 h-3 w-3" />

Clear All Slicers

</Button>

</div>

<div
className="
overflow-auto
max-h-[58vh]
lg:max-h-[64vh]
"
>

<UITable>

<TableHeader
className="
sticky
top-0
z-30
bg-[#EAF7FC]
backdrop-blur-md
"
>

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
min-w-[120px]
lg:min-w-[145px]
px-3
py-3
text-[12px]
lg:text-[13px]
font-semibold
tracking-normal
text-[#29406F]
border-none
bg-[#EAF7FC]
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

<span>
{col.header}
</span>

<button
onClick={(e)=>{

e.stopPropagation();

setOpenFilter(
isOpen
? null
: col.accessor
);

}}
className={`
flex
h-7
w-7
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
absolute
left-0
top-12
z-[999]
w-[200px]
border
border-[#DDECF0]
bg-white
shadow-2xl
"
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
border-[rgba(255,255,255,0.16)]
transition-all
hover:bg-[rgba(255,255,255,0.12)]
"
>

{columns.map((col)=>(

<TableCell
key={col.accessor}
className="
px-2
lg:px-3
py-3
text-[12px]
lg:text-[14px]
font-medium
text-[#42506A]
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