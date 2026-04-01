import "./NeedHelp.css"
import { FiSearch, FiBell, FiSend } from "react-icons/fi"
import robot from "../../../../assets/images/robot-login.png"

function NeedHelp(){

return(

<div className="need-help">

{/* HEADER */}

<div className="help-header">

<div className="header-right">

<div className="search-box">
<FiSearch className="search-icon"/>

<input
type="text"
placeholder="Search courses, jobs..."
/>

</div>

<FiBell className="bell-icon"/>

</div>

</div>


{/* CHAT AREA */}

<div className="help-chat">

<div className="robot-section">

<img src={robot} alt="robot"/>

<div className="chat-bubble">
Hello Buddy! How can i help you?
</div>

</div>

</div>


{/* MESSAGE INPUT */}

<div className="help-input">

<input
type="text"
placeholder="Enter Your Message"
/>

<button>
<FiSend/>
</button>

</div>

</div>

)

}

export default NeedHelp