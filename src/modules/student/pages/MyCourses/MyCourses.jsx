import "./MyCourses.css";
import { FiClock, FiBook } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import course1 from "../../../../assets/images/course1.jpg";
import course2 from "../../../../assets/images/course2.jpg";
import course3 from "../../../../assets/images/course3.jpg";

function MyCourses() {
 const navigate = useNavigate();
const courses = [

{
title:"Web Development",
author:"William Peter",
time:"12h 30min",
lessons:"12 Lessons",
progress:75,
status:"ongoing",
rating:"4.6",
image:course1
},

{
title:"MERN Stack Development",
author:"Harish Ali Khan",
time:"10h 20min",
lessons:"10 Lessons",
progress:65,
status:"ongoing",
rating:"4.8",
image:course2
},

{
title:"Cyber Security (Beginners)",
author:"SP Classes",
time:"15h 30min",
lessons:"21 Lessons",
progress:100,
status:"completed",
rating:"4.6",
image:course3
},

{
title:"UI UX Design",
author:"John Smith",
time:"8h 10min",
lessons:"8 Lessons",
progress:40,
status:"ongoing",
rating:"4.5",
image:course1
},

{
title:"Python Programming",
author:"David Lee",
time:"14h 20min",
lessons:"15 Lessons",
progress:100,
status:"completed",
rating:"4.7",
image:course2
},

{
title:"React Development",
author:"Sophia Clark",
time:"11h 15min",
lessons:"9 Lessons",
progress:60,
status:"ongoing",
rating:"4.8",
image:course3
}

];


const [filter,setFilter] = useState("all");


const filteredCourses =
filter === "all"
? courses
: courses.filter(course => course.status === filter);



return (

<div className="mycourses">


{/* FILTERS */}

<div className="course-filters">

<span
className={filter==="all" ? "active" : ""}
onClick={()=>setFilter("all")}
>
All ({courses.length})
</span>

<span
className={filter==="ongoing" ? "active" : ""}
onClick={()=>setFilter("ongoing")}
>
Ongoing ({courses.filter(c=>c.status==="ongoing").length})
</span>

<span
className={filter==="completed" ? "active" : ""}
onClick={()=>setFilter("completed")}
>
Completed ({courses.filter(c=>c.status==="completed").length})
</span>

</div>



{/* COURSE GRID */}

<div className="course-grid">

{filteredCourses.map((course,index)=>(

<div className="course-card" key={index}>

<img src={course.image} alt="course"/>

<div className="course-content">

<div className="rating">
⭐⭐⭐⭐⭐ <span>({course.rating})</span>
</div>

<h4>{course.title}</h4>

<p className="author">
By {course.author}
</p>


<div className="course-info">

<span>
<FiClock/> {course.time}
</span>

<span>
<FiBook/> {course.lessons}
</span>

</div>


<div className="progress-section">

<div className="progress-label">
<span>Progress</span>
<span>{course.progress}%</span>
</div>

<div className="progress-bar">

<div
className="progress-fill"
style={{width:`${course.progress}%`}}
></div>

</div>

</div>


<button
className="continue-btn"
onClick={()=>{

if(course.status === "completed"){
navigate("/student-dashboard/certificate")
}

else{
navigate("/student-dashboard/course-details")
}

}}
>

{course.status === "completed"
? "View Certificate"
: "Continue"}

</button>

</div>

</div>

))}

</div>

</div>

);

}

export default MyCourses;