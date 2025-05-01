import React, { useEffect } from "react";
import Lottie from "lottie-react";
import Loading from "@/Loading.json";
import { useGetUserDataQuery } from "../lib/state/userApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);
  const { data: userData, isLoading, error } = useGetUserDataQuery();
  const user = userData?.user;

  useEffect(() => {
    if (!accessToken) {
      navigate("/");
    }
  }, [accessToken, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Lottie animationData={Loading} loop={true} className="w-1/2 h-1/2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <h1 className="font-roboto-condensed text-3xl text-white">
        Welcome, {user?.username || "Guest"}
      </h1>
    </div>
  );
}

export default Dashboard;
