import "./Certificate.css";
import { FiArrowLeft, FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Certificate() {

const navigate = useNavigate();

return (

<div className="certificate-page">

{/* HEADER */}

<div className="certificate-header">

<button
className="back-btn"
onClick={()=>navigate(-1)}
>
<FiArrowLeft/> Back
</button>

<button className="download-btn">
<FiDownload/> Download
</button>

</div>



{/* CERTIFICATE */}

<div className="certificate-card">

<div className="certificate-logo">
WorkLink
</div>

<h1 className="certificate-title">
CERTIFICATE
</h1>

<h3 className="certificate-sub">
of Completion
</h3>

<p className="certificate-text">
This Certificate is awarded to :
</p>

<h2 className="certificate-name">
Rimee Modi
</h2>

<p className="certificate-desc">
for successfully completing the course of
<strong> Web Development Essentials</strong>
</p>

<p className="certificate-date">
Awarded March 2026
</p>

</div>

</div>

);

}

export default Certificate;