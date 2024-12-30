// import "./TodoApp.css";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import LogoutComponent from "./LogoutComponent";
// import HeaderComponent from "./HeaderComponent";
// import ListTodosComponent from "./ListTodosComponent";
// import WelcomeComponent from "./WelcomeComponent";
// import LoginComponent from "./security/LoginComponent";
// import ErrorComponent from "./ErrorComponent";
// import FooterComponent from "./FooterComponent";
// import AuthProvider, { useAuth } from "./security/AuthContext";
// import SignUpComponent from "./security/SignUpComponent";
// function AuthenticatedRoute({ children }) {
//   const authContext = useAuth();

//   if (authContext.isAuthenticated) return children;

//   return <Navigate to="/" />;
// }

// export default function TodoApp() {
//   return (
//     <div>
//       <AuthProvider>
//         <BrowserRouter>
//           <HeaderComponent />
//           <Routes>
//             <Route path="/" element={<LoginComponent />}></Route>
//             <Route path="/login" element={<LoginComponent />}></Route>
//             <Route path="/signUp" element={<SignUpComponent />}></Route>
//             <Route
//               path="/welcome/:username"
//               element={
//                 <AuthenticatedRoute>
//                   <WelcomeComponent />
//                 </AuthenticatedRoute>
//               }
//             ></Route>
//             <Route path="*" element={<ErrorComponent />}></Route>
//             <Route
//               path="/todos"
//               element={
//                 <AuthenticatedRoute>
//                   <ListTodosComponent />
//                 </AuthenticatedRoute>
//               }
//             />
//             <Route
//               path="/logout"
//               element={
//                 <AuthenticatedRoute>
//                   <LogoutComponent />
//                 </AuthenticatedRoute>
//               }
//             />{" "}
//           </Routes>
//         </BrowserRouter>
//         {/* <FooterComponent /> */}
//       </AuthProvider>
//     </div>
//   );
// }

import React from "react";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import Header from "./Layout/Header";
import Navigation from "./Layout/Navigation";
import TaskList from "./TaskList/TaskList";
import CreateTaskList from "./TaskList/CreateTaskList";
import TaskDetails from "../trash/Task/TaskDetails";
import SearchResults from "./Search/SearchResults";
import TimeclockForm from "./Timeclock/TimeclockForm";
import RepeatList from "../trash/Repeats/RepeatList";
import RepeatForm from "../trash/Repeats/RepeatForm";
import Login from "./security/LoginComponent";
import SignUpComponent from "./security/SignUpComponent";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import { store } from "./redux/store";

const App = () => {
  useEffect(() => {
    document.title = "Todo App"; // Set the new title here
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <div>
          <Header />
          <Navigation />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/tasks"
              element={
                <div>
                  <TaskList />
                  <CreateTaskList taskListName="Task" />
                </div>
              }
            />
            <Route path="/task/:id" element={<TaskDetails />}></Route>
            <Route path="/search" element={<SearchResults />}></Route>
            <Route path="/timeclock" element={<TimeclockForm />}></Route>
            <Route path="/signUp" element={<SignUpComponent />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/logout" element={<Logout />}></Route>
            <Route
              path="/repeats"
              element={
                <div>
                  {" "}
                  <RepeatList />
                  <RepeatForm />
                </div>
              }
            ></Route>
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
