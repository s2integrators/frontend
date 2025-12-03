// // filepath: src/App.jsx
// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Dashboard from "./pages/Dashboard";
// import InterviewRoom from "./pages/InterviewRoom";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Default route */}
//         <Route path="/" element={<Dashboard />} />

//         {/* Interview room route */}
//         <Route path="/interview-room/:roomId" element={<InterviewRoom />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }



// // src/App.jsx
// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Dashboard from "./pages/Dashboard";
// import InterviewRoom from "./pages/InterviewRoom";
// import Recommendations from "./pages/Recommendations";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Default route */}
//         <Route path="/" element={<Dashboard />} />

//         {/* Recruiter recommendations */}
//         <Route path="/recruiter/recommendations" element={<Recommendations />} />

//         {/* Interview room route */}
//         <Route path="/interview-room/:roomId" element={<InterviewRoom />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }




// // src/App.jsx
// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Dashboard from "./pages/Dashboard";
// import InterviewRoom from "./pages/InterviewRoom";
// import Recommendations from "./pages/Recommendations";
// import ProtectedRoute from "./components/ProtectedRoute";
// import LoginPage from "./pages/Login";
// import RegisterPage from "./pages/Register";
// // import Profile from "./pages/Profile";

// export default function App() {
//   return (
//     <BrowserRouter>
//       {/* <TopNav />   SHOW TOP NAV ON ALL LOGGED-IN PAGES */}

//       <Routes>
//         {/* Auth routes */}
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />

//         {/* Default (protected) dashboard */}
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />

//         {/* Recruiter recommendations (kept as in your original code) */}
//         <Route path="/recruiter/recommendations" element={<Recommendations />} />

//         {/* Interview room route */}
//         <Route path="/interview-room/:roomId" element={<InterviewRoom />} />

//         {/* Example profile route (kept commented as in friend's version) */}
//         {/*
//         <Route
//           path="/profile"
//           element={
//             <ProtectedRoute>
//               <Profile />
//             </ProtectedRoute>
//           }
//         />
//         */}
//       </Routes>
//     </BrowserRouter>
//   );
// }




// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import InterviewRoom from "./pages/InterviewRoom";
import Recommendations from "./pages/Recommendations";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import MonitorRoom from "./pages/MonitorRoom"; // ⭐ NEW IMPORT

// import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Default (protected) dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Recruiter recommendations */}
        <Route path="/recruiter/recommendations" element={<Recommendations />} />

        {/* Candidate interview room */}
        <Route path="/interview-room/:roomId" element={<InterviewRoom />} />

        {/* ⭐ NEW: HR Monitor Meeting Page */}
        <Route path="/monitor/:roomId" element={<MonitorRoom />} />

        {/* Example profile route */}
        {/* 
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        /> 
        */}
      </Routes>
    </BrowserRouter>
  );
}
