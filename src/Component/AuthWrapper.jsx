import { useEffect, useState } from "react";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import google from "../Icons/google.webp";

export default function AuthWrapper({ onAuthenticated }) {
  const [loading, setLoading] = useState(false);

  return (
    <div
      className="auth-wrapper w-fit h-fit p-10 absolute bg-red-500 z-50
        top-1/2 left-1/2 bg-white rounded shadow-lg"
      style={{
        transform: "translate(-50%, -50%)",
      }}
    >
      {loading && (
        <DataUsageIcon
          className="loading-spin animate-spin h-10 w-10 text-sky-500 flex m-auto"
          style={{ fontSize: 50 }}
        />
      )}
      {!loading && (
        <div className="flex flex-col w-300">
          <div className="p-0.5 rounded bg-gray-200 m-auto flex w-5/6 mb-2"></div>
          <span className="font-semibold text-xl mb-5">
            Let's connect with other people
          </span>
          <div className="flex flex-col gap-4">
            <a
              href="/auth/google"
              className="flex items-center gap-4 bg-blue-100 rounded-lg py-2 px-4 hover:bg-blue-200 hover:outline-2 hover:outline-sky-500 hover:outline"
            >
              <img
                src={google}
                alt="continue with google"
                className="w-8 h-8"
              />
              <div className="text-blue-500 font-semibold antialised text-lg">
                Continue with Google
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
