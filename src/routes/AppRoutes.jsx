import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing/Landing";
import Login from "../pages/Auth/Login";
import GoogleAccountChooser from "../pages/Auth/GoogleAccountChooser";
import VerifyEmailOtp from "../pages/Auth/VerifyEmailOtp";
import CreateAccount from "../pages/Auth/CreateAccount";
import ResetPassword from "../pages/Auth/ResetPassword";
import CheckInbox from "../pages/Auth/CheckInbox";
import Welcome from "../pages/Welcome/Welcome";
import RoleSelection from "../pages/RoleSelection/RoleSelection";
import SharedOnboarding from "../pages/Onboarding/SharedOnboarding";
import StudentOnboarding from "../pages/Onboarding/StudentOnboarding";
import RecruiterOnboarding from "../pages/Onboarding/RecruiterOnboarding";
import InstituteOnboarding from "../pages/Onboarding/InstituteOnboarding";
import RecruiterHome from "../modules/recruiter/pages/recuriter-home/Recuriter-home";
import Layout from "../components/layout/Layout";
import Dashboard from "../modules/recruiter/pages/Dashboard/Dashboard";
import JobPosting from "../modules/recruiter/pages/JobPosting/JobPosting";
import Candidates from "../modules/recruiter/pages/Candidates/Candidates";
import InterviewsSchedule from "../modules/recruiter/pages/InterviewsSchedule/InterviewsSchedule";
import Shortlisted from "../modules/recruiter/pages/Shortlisted/Shortlisted";
import Profile from "../modules/recruiter/pages/Profile/Profile";

// ------------------- INSTITUTE PAGES -------------------
import InstituteLanding from "../pages/Institute/InstituteLanding";
import InstituteDashboard from "../modules/institute/pages/Dashboard/Dashboard";
import CourseManagement from "../modules/institute/pages/CourseManagement/CourseManagement";
import StudentEnroll from "../modules/institute/pages/StudentEnroll/StudentEnroll";
import Assessment from "../modules/institute/pages/Assessment/Assessment";
import Analytics from "../modules/institute/pages/Analytics/Analytics";

// ------------------- STUDENT PAGES -------------------
import StudentHome from "../modules/student/pages/StudentHome/StudentHome";
import StudentDashboard from "../modules/student/pages/Dashboard/Dashboard";
import MyCourses from "../modules/student/pages/MyCourses/MyCourses";
import Certificate from "../modules/student/pages/Certificate/Certificate";
import StudentAssessment from "../modules/student/pages/Assessment/Assessment";
import JobMatches from "../modules/student/pages/JobMatches/JobMatches";
import Interviews from "../modules/student/pages/Interviews/Interviews";
import JobDetails from "../modules/student/pages/JobDetails/JobDetails";
import ApplyJob from "../modules/student/pages/ApplyJob/ApplyJob";
import NeedHelp from "../modules/student/pages/NeedHelp/NeedHelp";
import ProfileResume from "../modules/student/pages/ProfileResume/ProfileResume";
import ContinueCourse from "../modules/student/pages/ContinueCourse/ContinueCourse";
import AdminHome from "../modules/admin/pages/AdminHome/AdminHome";
import AdminDashboard from "../modules/admin/pages/Dashboard/Dashboard";
import Aspirants from "../modules/admin/pages/Aspirants/Aspirants";
import AdminEmployees from "../modules/admin/pages/Employees/Employees";
import AdminTraining from "../modules/admin/pages/Training/Training";




function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/google" element={<GoogleAccountChooser />} />
        <Route path="/login/verify-email" element={<VerifyEmailOtp />} />
        <Route path="/signup" element={<CreateAccount />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/reset-password/check-inbox"
          element={<CheckInbox />}
        />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/onboarding" element={<SharedOnboarding />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route
          path="/onboarding/student"
          element={<StudentOnboarding />}
        />
        <Route
          path="/onboarding/recruiter"
          element={<RecruiterOnboarding />}
        />
        <Route
          path="/onboarding/institute"
          element={<InstituteOnboarding />}
        />
        <Route path="/recruiter" element={<RecruiterHome />} />
   <Route
          path="/recruiter-dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
 path="/recruiter-dashboard/job-posting"
 element={
  <Layout>
   <JobPosting/>
  </Layout>
 }
/>

<Route
  path="/recruiter-dashboard/candidates"
  element={
  <Layout>
   <Candidates />
  </Layout>
 }
/>

<Route
 path="/recruiter-dashboard/interview"
 element={
 <Layout>
  <InterviewsSchedule />
 </Layout>
 }
/>

<Route
 path="/recruiter-dashboard/shortlisted"
 element={
 <Layout>
  <Shortlisted />
 </Layout>
 }
/>

<Route
 path="/recruiter-dashboard/profile"
 element={
  <Layout>
   <Profile />
  </Layout>
 }
/>

{/* -------------------------------- INSTITUTE ------------- */}

<Route path="/institute" element={<InstituteLanding />} />
<Route
 path="/institute-dashboard"
 element={
  <Layout>
   <InstituteDashboard />
  </Layout>
 }
/>

<Route
 path="/institute-dashboard/course-management"
 element={
  <Layout>
   <CourseManagement/>
  </Layout>
 }
/>

<Route
path="/institute-dashboard/student-enrollment"
element={
<Layout>
<StudentEnroll/>
</Layout>
}
/>


<Route
path="/institute-dashboard/assessment"
element={
<Layout>
<Assessment/>
</Layout>
}
/>

<Route
path="/institute-dashboard/analytics"
element={
<Layout>
<Analytics/>
</Layout>
}
/>

{/* -------------------- STUDENT ------------ */}
<Route path="/student" element={<StudentHome />} />

<Route
 path="/student-dashboard"
 element={
  <Layout>
   <StudentDashboard/>
  </Layout>
 }
/>

<Route
path="/student-dashboard/my-courses"
element={
<Layout>
<MyCourses/>
</Layout>
}
/>

<Route
path="/student-dashboard/certificate"
element={
<Layout>
<Certificate/>
</Layout>
}
/>

<Route
path="/student-dashboard/assessment"
element={
<Layout>
<StudentAssessment/>
</Layout>
}
/>

<Route
path="/student-dashboard/jobs"
element={
<Layout>
<JobMatches/>
</Layout>
}
/>

<Route
path="/student-dashboard/job-details/:id"
element={
<Layout>
<JobDetails/>
</Layout>
}
/>

<Route
path="/student-dashboard/apply-job/:id"
element={
<Layout>
<ApplyJob/>
</Layout>
}
/>
<Route
  path="/student-dashboard/interviews"
  element={
    <Layout>
      <Interviews />
    </Layout>
  }
/>

<Route
path="/student-dashboard/help"
element={
<Layout>
<NeedHelp/>
</Layout>
}
/>

<Route
path="/student-dashboard/profile"
element={
<Layout>
<ProfileResume/>
</Layout>
}
/>

<Route
 path="/student-dashboard/course-details"
 element={<ContinueCourse />}
/>

{/* -------------------- ADMIN ------------ */}
<Route path="/admin" element={<AdminHome />} />

<Route
 path="/admin-dashboard"
 element={
  <Layout>
   <AdminDashboard />
  </Layout>
 }
/>

<Route
 path="/admin-dashboard/aspirants"
 element={
  <Layout>
   <Aspirants />
  </Layout>
 }
/>

<Route
 path="/admin-dashboard/employees"
 element={
  <Layout>
   <AdminEmployees />
  </Layout>
 }
/>

<Route
 path="/admin-dashboard/training"
 element={
  <Layout>
   <AdminTraining />
  </Layout>
 }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;