import React from "react";

import Sidebar from "./Sidebar";

const DashboardLayout = ({
children,
}:{
children:React.ReactNode;
}) => {

return(

<div
className="
h-screen
w-screen
overflow-hidden
flex
bg-white
"
>

<Sidebar />

<div
className="
flex-1
min-w-0
h-screen
overflow-hidden
"
>

<div
className="
h-full
overflow-auto
px-3
sm:px-5
lg:px-7
py-3
"
>

{children}

</div>

</div>

</div>

);

};

export default DashboardLayout;