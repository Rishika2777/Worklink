import "./StudentEnroll.css";
import { FiBell, FiCalendar, FiDollarSign, FiBookOpen } from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";

function StudentEnroll() {

const courses = [
{
title:"Full Stack Development",
teacher:"Payal Gupta",
batch:"Batch: Jan 2026",
progress:75,
date:"12 Jan 2026",
fee:"Free",
status:"In Progress"
},
{
title:"UI/UX Design",
teacher:"Sanjana Singh",
batch:"Batch: Jan 2026",
progress:85,
date:"18 Jan 2026",
fee:"Free",
status:"In Progress"
},
{
title:"Data Analytics",
teacher:"Ritu Yadav",
batch:"Batch: Jan 2026",
progress:90,
date:"28 Jan 2026",
fee:"Free",
status:"In Progress"
},
{
title:"Cyber Security",
teacher:"Ankit Jain",
batch:"Batch: Feb 2026",
progress:50,
date:"1 Feb 2026",
fee:"Free",
status:"In Progress"
},
{
title:"Graphic Designing",
teacher:"Arpit Jha",
batch:"Batch: Jan 2025",
progress:100,
date:"12 Nov 2025",
fee:"Free",
status:"In Progress"
}
];

return (

<div className="enroll-container">

{/* HEADER */}

<div className="enroll-header">

<div></div>

<div className="header-actions">

<FiBell className="bell-icon"/>

<button className="add-course-btn">
+ Add New Courses
</button>

</div>

</div>


{/* FILTER BUTTONS */}

<div className="enroll-filters">

<button className="filter active">All</button>

<button className="filter">
<span className="dot green"></span>
Active
</button>

<button className="filter">
<span className="dot blue"></span>
Completed
</button>

<button className="filter">
<span className="dot red"></span>
Cancelled
</button>

</div>



{/* COURSE GRID */}

<div className="enroll-grid">

{courses.map((course,index)=>(

<div key={index} className="enroll-card">

<div className="course-top">

<div className="course-icon">
  <FiBookOpen />
</div>

<div>

<h4>{course.title}</h4>
<p>{course.teacher}</p>

</div>

</div>

<div className="batch">{course.batch}</div>


{/* PROGRESS */}

<div className="progress-section">

<div className="progress-top">
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


{/* INFO */}

<div className="course-info">

<div>
<FiCalendar className="info-icon" />
<p>{course.date}</p>
</div>

<div>
<FiDollarSign className="info-icon" />
<p>{course.fee}</p>
</div>

</div>


{/* STATUS */}

<div className="status">
<span className="status-dot"></span>
{course.status}
</div>

</div>

))}

</div>

</div>

);
}

export default StudentEnroll;