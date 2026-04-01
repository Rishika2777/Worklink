import "./Analytics.css";
import { FiSearch } from "react-icons/fi";

import {
PieChart,
Pie,
Cell,
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
LineChart,
Line
} from "recharts";

const completionData = [
{ name: "Completed", value: 75 },
{ name: "In Progress", value: 20 },
{ name: "Not Started", value: 5 }
];

const performanceData = [
{ name: "Web Dev", avg: 100, pass: 70 },
{ name: "UI/UX", avg: 85, pass: 50 },
{ name: "Data Analytics", avg: 100, pass: 15 },
{ name: "Cyber Security", avg: 85, pass: 35 }
];

const trendData = [
{ month: "Jul", value: 120 },
{ month: "Aug", value: 350 },
{ month: "Sep", value: 150 },
{ month: "Oct", value: 400 },
{ month: "Nov", value: 450 },
{ month: "Dec", value: 200 }
];

const COLORS = ["#0c0c6b", "#ff2d2d", "#ddd"];

function Analytics() {

return (

<div className="analytics-container">

{/* SEARCH */}

<div className="analytics-header">

<div></div>

<div className="search-box">
<FiSearch/>
<input placeholder="Search students, courses...."/>
</div>

</div>


{/* TOP CARDS */}

<div className="analytics-grid">

{/* DONUT */}

<div className="analytics-card">

<h3>Course Completion Rate</h3>
<p>Overall Student Completion Statistics</p>

<div className="chart-row">

<ResponsiveContainer width={200} height={200}>

<PieChart>

<Pie
data={completionData}
innerRadius={60}
outerRadius={90}
dataKey="value"
>

{completionData.map((entry,index)=>(
<Cell key={index} fill={COLORS[index]} />
))}

</Pie>

</PieChart>

</ResponsiveContainer>

<div className="legend">

<p><span className="dot blue"></span>Completed 75%</p>
<p><span className="dot red"></span>In Progress 20%</p>
<p><span className="dot grey"></span>Not Started 5%</p>

</div>

</div>

</div>



{/* BAR CHART */}

<div className="analytics-card">

<h3>Course Performance</h3>
<p>Average Scores and Pass Rates</p>

<ResponsiveContainer width="100%" height={220}>

<BarChart data={performanceData}>

<XAxis dataKey="name" />
<YAxis />
<Tooltip />

<Bar dataKey="avg" fill="#0c0c6b" />
<Bar dataKey="pass" fill="#f6c044" />

</BarChart>

</ResponsiveContainer>

</div>

</div>



{/* LINE CHART */}

<div className="analytics-card full">

<h3>Enrollment Trend</h3>
<p>Monthly Students Enrollment over time</p>

<ResponsiveContainer width="100%" height={260}>

<LineChart data={trendData}>

<XAxis dataKey="month" />
<YAxis />
<Tooltip />

<Line
type="monotone"
dataKey="value"
stroke="#111"
strokeWidth={2}
/>

</LineChart>

</ResponsiveContainer>

</div>

</div>

);
}

export default Analytics;