import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import socket from "../socket/socket";
import { useAuth } from "./AuthContext";

const JobContext = createContext(null);

export const JobProvider = ({ children }) => {
  const { addToast } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async (params = {}) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/jobs", { params });
      setJobs(res.data);
    } catch (e) {
      addToast(e.response?.data?.message || "Failed to load jobs", "error");
    } finally { setLoading(false); }
  };

  // Real-time: new job posted by any employer appears instantly
  useEffect(() => {
    socket.on("newJob", (job) => {
      setJobs((prev) => [job, ...prev]);
      addToast(`🆕 New job posted: ${job.title} at ${job.company}`, "info");
    });
    return () => socket.off("newJob");
  }, []);

  return (
    <JobContext.Provider value={{ jobs, setJobs, loading, fetchJobs }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => useContext(JobContext);
