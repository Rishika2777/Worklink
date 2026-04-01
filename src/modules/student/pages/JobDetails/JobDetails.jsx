import "./JobDetails.css";
import {
FiArrowLeft,
FiMapPin,
FiUser,
FiClock,
FiBriefcase,
FiAward,
FiDollarSign,
FiUsers
} from "react-icons/fi";

import { useNavigate, useParams } from "react-router-dom";

function JobDetails(){

const navigate = useNavigate();
const { id } = useParams();

/* SAME JOB DATA (MATCHING JobMatches.jsx) */

const jobs = [

{
id:1,
company:"Expedia",
role:"MERN Stack Developer",
salary:"$80,000/yr",
location:"Remote, Seattle WA",
skills:["SQL","Java","Springboot","MongoDB"],
posted:"2 days ago",
applicants:"1,868",
opening:"1000",
description:`Join Expedia as a MERN Stack Developer and help shape the future of travel by uncovering insights that drive impactful decisions. At Expedia we harness the power of data to personalize experiences for millions of travelers worldwide.`
},

{
id:2,
company:"Coinbase",
role:"Backend Developer",
salary:"$60-80/hr",
location:"Remote, New York",
skills:["Firebase","Postman","End-to-End Testing"],
posted:"3 days ago",
applicants:"1,200",
opening:"500",
description:`Join Coinbase as a Backend Developer and build secure financial platforms for millions of crypto users.`
},

{
id:3,
company:"Google",
role:"Frontend Developer",
salary:"$95,000/yr",
location:"Remote, California",
skills:["React","JavaScript","CSS","TypeScript"],
posted:"1 week ago",
applicants:"2,450",
opening:"200",
description:`Join Google and develop highly scalable frontend applications used by billions of users globally.`
},

{
id:4,
company:"Amazon",
role:"Full Stack Developer",
salary:"$110,000/yr",
location:"Remote, Texas",
skills:["NodeJS","MongoDB","Express","React"],
posted:"5 days ago",
applicants:"1,900",
opening:"300",
description:`Amazon is hiring a Full Stack Developer to build scalable ecommerce systems.`
}

];


/* FIND CURRENT JOB */

const job = jobs.find((item)=> item.id === Number(id));

if(!job){
return <div className="job-details">Job not found</div>
}

return (

<div className="job-details">

<button
className="back-btn"
onClick={()=>navigate(-1)}
>
<FiArrowLeft/> Back
</button>


{/* TOP CARD */}

<div className="job-card">

<div className="job-left">

<div className="company-icon">
<FiBriefcase/>
</div>

<div>

<h2>{job.company}</h2>
<p>{job.role}</p>

<div className="skills">

{job.skills.map((skill,index)=>(
<span key={index}>{skill}</span>
))}

</div>

<div className="job-meta">

<span>Posted : {job.posted}</span>
<span>Applicants : {job.applicants}</span>
<span>Opening : {job.opening}</span>

</div>

</div>

</div>


<div className="job-right">

<h3>{job.salary}</h3>

<p className="location">
{job.location}
</p>

<button
className="apply-btn"
onClick={()=>navigate(`/student-dashboard/apply-job/${id}`)}
>
Apply Now
</button>

</div>

</div>



{/* MAIN CONTENT */}

<div className="job-content">


{/* DESCRIPTION */}

<div className="job-description">

<h2>Job Description</h2>

<p>{job.description}</p>

<p>
In this role you'll work with large datasets, machine learning,
statistical analysis and advanced modeling techniques to solve
complex problems and improve product experiences.
</p>

</div>



{/* JOB OVERVIEW */}

<div className="job-overview">

<h3>Job Overview</h3>

<div className="overview-item">
<FiUser/>
<div>
<p>Job Title</p>
<span>{job.role}</span>
</div>
</div>

<div className="overview-item">
<FiClock/>
<div>
<p>Job Type</p>
<span>Full-Time</span>
</div>
</div>

<div className="overview-item">
<FiBriefcase/>
<div>
<p>Experience</p>
<span>Two Years</span>
</div>
</div>

<div className="overview-item">
<FiAward/>
<div>
<p>Degree</p>
<span>Graduation</span>
</div>
</div>

<div className="overview-item">
<FiDollarSign/>
<div>
<p>Offered Salary</p>
<span>{job.salary}</span>
</div>
</div>

<div className="overview-item">
<FiUsers/>
<div>
<p>Gender</p>
<span>Both</span>
</div>
</div>

<div className="overview-item">
<FiMapPin/>
<div>
<p>Location</p>
<span>{job.location}</span>
</div>
</div>

</div>

</div>

</div>
)

}

export default JobDetails