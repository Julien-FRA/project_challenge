import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { StudentRegister } from "./pages/Student/StudentRegister";
import { ChallengeCreate } from "./pages/Admin/Dashboard/Challenge/ChallengeCreate";
import { AdminSignIn } from "./pages/Admin/AdminSignIn";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { ChallengeList } from "./pages/Admin/Dashboard/Challenge/ChallengeList";
import { PageError } from "./pages/PageError";
import { StudentSingUp } from "./pages/Student/StudentSingUp";
import { StudentVerify } from "./pages/Student/StudentVerify";
import { Challenge } from "./pages/Challenge/Challenge";
import { ManagementCreate } from "./pages/Admin/Dashboard/Management/ManagementCreate";
import { ManagementList } from "./pages/Admin/Dashboard/Management/ManagementList";
import { PromotionsCreate } from "./pages/Admin/Dashboard/Promotions/PromotionsCreate";
import { PromotionsList } from "./pages/Admin/Dashboard/Promotions/PromotionsList";
import { QuestionCreate } from "./pages/Admin/Dashboard/Questions/QuestionsCreate";
import { QuestionsList } from "./pages/Admin/Dashboard/Questions/QuestionsList";
import { StudentList } from "./pages/Admin/Dashboard/Student/StudentList";

const PrivateWrapper = ({ children }: { children: JSX.Element }) => {
  const auth = localStorage.getItem('ConnectedID')
  return auth ? children : <Navigate to="../connexion" replace />;
};

export const Router = () => {
  return (
    <Routes>
      <Route path="sing-up" element={<StudentSingUp />}/>
      <Route path="register" element={<StudentRegister />} />
      <Route path="connexion" element={<AdminSignIn />} />
      <Route path="admin" element={
          <PrivateWrapper>
            <AdminDashboard />
          </PrivateWrapper>
        }>
      {/* <Route path="admin" element={<AdminDashboard /> }> */}
        <Route path="challenge/create" element={<ChallengeCreate />} />
        <Route path="challenge/list" element={<ChallengeList />} />
        <Route path="management/create" element={<ManagementCreate />} />
        <Route path="management/list" element={<ManagementList />} />
        <Route path="students" element={<StudentList />} />
        <Route path="promotions/create" element={<PromotionsCreate />} />
        <Route path="promotions/list" element={<PromotionsList />} />
        <Route path="questions/create" element={<QuestionCreate />} />
        <Route path="questions/list" element={<QuestionsList />} />
      </Route>
      <Route path="challenge" element={<Challenge />} />
      <Route path="verify" element={<StudentVerify />} />
      <Route path="*" element={<PageError />} />
    </Routes>
  );
};
