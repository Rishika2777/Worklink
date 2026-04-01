import "./JobMatches.css";
import { FiSearch, FiBell, FiMapPin, FiBriefcase } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function JobMatches() {

const navigate = useNavigate();

const jobs = [

{
id:1,
company:"Expedia",
role:"MERN Stack Developer",
salary:"$80,000/yr",
location:"Remote, Seattle, WA",
skills:["SQL","Java","Springboot","MongoDB"],
date:"Posted Jan 9, 2026"
},

{
id:2,
company:"Coinbase",
role:"Backend Developer",
salary:"$60-80/hr",
location:"Remote, New York",
skills:["Firebase","Postman","End-to-End Testing"],
date:"Posted Jan 7, 2026"
},

{
id:3,
company:"Google",
role:"Frontend Developer",
salary:"$95,000/yr",
location:"Remote, California",
skills:["React","JavaScript","CSS","TypeScript"],
date:"Posted Jan 6, 2026"
},

{
id:4,
company:"Amazon",
role:"Full Stack Developer",
salary:"$110,000/yr",
location:"Remote, Texas",
skills:["NodeJS","MongoDB","Express","React"],
date:"Posted Jan 5, 2026"
}

];

return (

<div className="jobmatches">

{/* HEADER */}

<div className="job-header">

<div className="header-right">

<div className="search-box">
<FiSearch className="search-icon"/>
<input
type="text"
placeholder="Search courses, jobs...."
/>
</div>

<FiBell className="bell-icon"/>

</div>

</div>


{/* SMART JOB MATCH BOX */}

<div className="smart-box">

<h3>⭐ Smart Job Matching</h3>

<p>
Based on your skills, course completion and assessment scores,
We've found 4 jobs that matches your profile.
</p>

</div>


<h4 className="recommended-title">
Recommended Jobs ({jobs.length})
</h4>


{/* JOB LIST */}

<div className="job-list">

{jobs.map((job)=>(

<div className="job-card" key={job.id}>

{/* LEFT SECTION */}

<div className="job-left">

<div className="company-icon">
<FiBriefcase/>
</div>

<div>

<h3>{job.company}</h3>

<p className="role">
{job.role}
</p>

<div className="skills">

{job.skills.map((skill,i)=>(
<span key={i}>{skill}</span>
))}

</div>

</div>

</div>


{/* RIGHT SECTION */}

<div className="job-right">

<div className="salary">
{job.salary}
</div>

<div className="location">
<FiMapPin/> {job.location}
</div>

<div className="date">
{job.date}
</div>

<button
className="view-job-btn"
onClick={()=>navigate(`/student-dashboard/job-details/${job.id}`)}
>
View Job
</button>

</div>

</div>

))}

</div>

</div>

);

}

export default JobMatches;