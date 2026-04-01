import "./ApplyJob.css"
import { useState } from "react"
import { FiArrowLeft } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

function ApplyJob(){

const navigate = useNavigate()
const [step,setStep] = useState(1)

return(

<div className="apply-job">

{/* HEADER */}

<div className="apply-header">

<button
className="back-icon"
onClick={()=>navigate(-1)}
>
<FiArrowLeft/>
</button>

<div>
<h2>MERN Stack Developer</h2>
<p>Expedia</p>
</div>

</div>


{/* ================= STEP 1 ================= */}

{step===1 && (

<div className="form-card">

<h3 className="form-title">Registration form</h3>


{/* BASIC DETAILS */}

<div className="form-section">

<h4>Basic Details</h4>

<div className="form-grid">

<div className="form-group">
<label>First Name *</label>
<input type="text"/>
</div>

<div className="form-group">
<label>Last Name *</label>
<input type="text"/>
</div>

<div className="form-group">
<label>Email *</label>
<input type="email"/>
</div>

<div className="form-group">
<label>Mobile *</label>
<input type="text"/>
</div>

</div>


{/* GENDER */}

<div className="form-group">

<label>Gender *</label>

<div className="radio-group">

<button type="button">Female</button>
<button type="button">Male</button>
<button type="button">Others</button>

</div>

</div>


<div className="form-group">

<label>Location *</label>
<input type="text"/>

</div>

</div>



{/* USER DETAILS */}

<div className="form-section">

<h4>User Details</h4>

<div className="radio-group">

<button type="button">College Student</button>
<button type="button">Professional</button>
<button type="button">Fresher</button>

</div>

</div>



{/* RESUME UPLOAD */}

<div className="form-section">

<h4>Upload CV / Resume *</h4>

<div className="upload-box">

<p>
Drop file or <span>click here</span> to choose file
</p>

<small>
(PDF, DOC, DOCX maximum file size is 50 MB)
</small>

</div>

</div>


<div className="form-actions">

<button
className="next-btn"
onClick={()=>setStep(2)}
>
Next
</button>

</div>

</div>

)}



{/* ================= STEP 2 ================= */}

{step===2 && (

<div className="form-card additional-form">

<h2>Additional Details</h2>


<div className="form-group">

<label>
Have you worked on Data Scientist Project Before? *
</label>

<select>
<option>Select</option>
<option>Yes</option>
<option>No</option>
</select>

</div>


<div className="form-group">

<label>
Do you know how to use Tableau? *
</label>

<select>
<option>Select</option>
<option>Yes</option>
<option>No</option>
</select>

</div>


<div className="form-group">

<label>
Do you know how to use Power BI? *
</label>

<select>
<option>Select</option>
<option>Yes</option>
<option>No</option>
</select>

</div>


<div className="form-group">

<label>Share a bit about your project</label>

<textarea rows="5"></textarea>

</div>


<div className="form-actions">

<button
className="back-btn"
onClick={()=>setStep(1)}
>
Back
</button>

<button className="submit-btn">
Submit
</button>

</div>

</div>

)}

</div>

)

}

export default ApplyJob