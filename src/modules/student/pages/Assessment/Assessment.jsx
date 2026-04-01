import "./Assessment.css";
import { useState } from "react";
import { FiClipboard, FiSearch, FiBell } from "react-icons/fi";
import GiveTest from "../GiveTest/GiveTest";

function Assessment() {

    const [activeTest, setActiveTest] = useState(null);
const [filter,setFilter] = useState("all");

const assessments = [

{
title:"HTML & CSS Basics",
score:"85/100",
status:"passed"
},

{
title:"JavaScript Quiz",
score:"92/100",
status:"passed"
},

{
title:"Basic of UI/UX",
score:"100/100",
status:"passed"
},

{
title:"Cyber Security Basic",
score:"",
status:"pending"
},

{
title:"Jitter Tool Quiz",
score:"",
status:"pending"
}

];


const filteredAssessments =
filter === "all"
? assessments
: assessments.filter(a => a.status === filter);

  if (activeTest) {
    return (
      <GiveTest
        testTitle={activeTest}
        onBack={() => setActiveTest(null)}
      />
    );
  }
  
return (

<div className="assessment">


{/* HEADER */}

<div className="assessment-header">

<div className="search-box">

<FiSearch className="search-icon"/>

<input
type="text"
placeholder="Search courses, jobs...."
/>

</div>

<FiBell className="bell-icon"/>

</div>



{/* FILTERS */}

<div className="assessment-filters">

<span
className={filter==="all" ? "active" : ""}
onClick={()=>setFilter("all")}
>
All ({assessments.length})
</span>

<span
className={filter==="passed" ? "active" : ""}
onClick={()=>setFilter("passed")}
>
Passed ({assessments.filter(a=>a.status==="passed").length})
</span>

<span
className={filter==="pending" ? "active" : ""}
onClick={()=>setFilter("pending")}
>
Pending ({assessments.filter(a=>a.status==="pending").length})
</span>

</div>



{/* GRID */}

<div className="assessment-grid">

{filteredAssessments.map((item,index)=>(

<div className="assessment-card" key={index}>

<div className="assessment-icon">
<FiClipboard/>
</div>

<div className="assessment-info">

<h4>{item.title}</h4>

<p>MCQ Test</p>

<span className={`status ${item.status}`}>
{item.status === "passed" ? "Passed" : "Pending"}
</span>

</div>


<div className="assessment-right">

{item.score && (
<span className="score">Score: {item.score}</span>
)}

{item.status === "passed" ? (

<button className="result-btn">
View Result
</button>

) : (

<button
  className="give-btn"
  onClick={() => setActiveTest(item.title)}
>
  Give Test
</button>

)}

</div>

</div>

))}

</div>

</div>

);

}

export default Assessment;