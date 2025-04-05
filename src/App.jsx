import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./App.css";
import Applayout from "./ui/Applayout";
import Home from "./pages/Home";
import Info from "./features/user/Info";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import ScoreEdit from "./features/score/ScoreEdit";
import ScoreList from "./features/score/ScoreList";
import StudentList from "./features/student/StudentList";
import StudentEdit from "./features/student/StudentEdit";
import ScoreUpload from "./features/score/ScoreUpload";
import StudentCreate from "./features/student/StudentCreate";
import { Toaster } from "sonner";
export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Applayout />}>
            <Route path="" element={<Navigate to="/home/score" />} />
            <Route path="home" element={<Home />}>
              <Route path="score">
                <Route path="" element={<ScoreList />} />
                <Route path="upload" element={<ScoreUpload />} />
                <Route path=":id" element={<ScoreEdit />} />
              </Route>
              <Route path="student">
                <Route path="" element={<StudentList />} />
                <Route path="create" element={<StudentCreate />} />
                <Route path=":id" element={<StudentEdit />} />
              </Route>
              <Route path="info" element={<Info />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}
