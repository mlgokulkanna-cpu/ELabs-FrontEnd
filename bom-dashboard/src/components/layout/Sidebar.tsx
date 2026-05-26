import { useState, useEffect } from "react";

import {
useNavigate,
useLocation
} from "react-router-dom";

import {
LayoutGrid,
Paperclip,
ChevronLeft,
ChevronRight
} from "lucide-react";

const Sidebar=()=>{

const [collapsed,setCollapsed]=useState(()=>{
const savedState=
localStorage.getItem("sidebar-collapsed");
return savedState==="true";
});

useEffect(()=>{

localStorage.setItem(
"sidebar-collapsed",
String(collapsed)
);

},[collapsed]);

const navigate=useNavigate();

const location=useLocation();

const menuItems=[
{
label:"BOM Customer Overview",
path:"/overview",
icon:<LayoutGrid size={20} />,
},
{
label:"Attachments",
path:"/attachments",
icon:<Paperclip size={20} />,
},
];

return(

<div
className={`
relative
transition-all
duration-300
border-r
border-white/20
backdrop-blur-xl
bg-[rgba(255, 255, 255, 0.72)]
${collapsed
? "w-[72px]"
: "w-[250px]"
}
shrink-0
h-screen
`}
>

<div
className="
flex
items-center
justify-between
px-3
py-4
"
>

<div
className="
flex
items-center
gap-3
overflow-hidden
cursor-pointer
"
onClick={()=>{
if(collapsed){
setCollapsed(false);
}
}}
>

<img
src="/elab_logo.jpg"
alt="logo"
className="
w-12
h-12
object-contain
bg-white/60
p-1
"
/>

{!collapsed &&(

<div>

<h2
className="
text-[15px]
font-bold
text-[#243B6B]
leading-tight
"
>
Elevation Labs
</h2>

<p
className="
text-[11px]
font-medium
text-[#57BFCF]
"
>
Analytics Workspace
</p>

</div>

)}

</div>

<button
onClick={()=>
setCollapsed(!collapsed)
}
className="
h-10
w-10
flex
items-center
justify-center
bg-[#D9F7FB]
text-[#243B6B]
hover:bg-[#97E0ED]
transition-all
"
>

{collapsed
? <ChevronRight size={18} />
: <ChevronLeft size={18} />
}

</button>

</div>

<div
className="
mt-6
px-2
space-y-2
"
>

{menuItems.map((item)=>(

<button
key={item.path}
onClick={()=>
navigate(item.path)
}
className={`
w-full
flex
items-center
gap-3
px-4
py-4
transition-all
text-left
group
${location.pathname===
item.path
? "bg-gradient-to-r from-[#FFB7A0] to-[#97E0ED] text-[#243B6B]"
: "text-[#243B6B] hover:bg-white/40"
}
`}
>

<div
className="
shrink-0
"
>
{item.icon}
</div>

{!collapsed &&(

<span
className="
text-[15px]
font-medium
truncate
"
>
{item.label}
</span>

)}

</button>

))}

</div>

</div>

);

};

export default Sidebar;