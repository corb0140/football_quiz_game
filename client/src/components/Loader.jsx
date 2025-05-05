import Lottie from "lottie-react";
import Loading from "@/Loading.json";

function Loader({ isLoading, error }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Lottie animationData={Loading} loop={true} className="w-20 h-20" />
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
}

export default Loader;
