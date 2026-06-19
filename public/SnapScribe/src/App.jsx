import { ToastContainer, Slide } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  clearCaptionLogs,
  getCaptionLogs,
  removeCaption,
} from "./utils/caption";
import { useState } from "react";

// Components
import CaptionUploader from "./components/CaptionUploader";
import ConfirmDelete from "./components/ConfirmDelete";
import CaptionLogs from "./components/CaptionLogs";
import Settings from "./components/Settings";
import Logo from "./components/ui/Logo";
import Modal from "./components/Modal";

// Styles
import "./styles/settings-modal.css";
import "./styles/topbar.css";

// Icons
import { IoSettingsOutline } from "react-icons/io5";
import { IoArrowBackOutline } from "react-icons/io5";

const queryClient = new QueryClient();

const App = () => {
  const [captionLogs, setCaptionLogs] = useState(() => getCaptionLogs());
  const [showSettings, setShowSettings] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = (captionId) => {
    const updatedCaptions = removeCaption(captionId);
    setCaptionLogs(updatedCaptions);
  };

  const handleDeleteAllCaptions = () => {
    clearCaptionLogs();
    setCaptionLogs([]);
    setConfirmDelete(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-bg">
        {/* Ambient blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <main className="app-main">
          {/* Top nav row */}
          <div className="app-topbar">
            <a href="/" className="back-btn" aria-label="Back to home">
              <IoArrowBackOutline />
              Back
            </a>

            <button
              className="settings-trigger-btn"
              onClick={() => setShowSettings(true)}
              aria-label="Open settings"
            >
              <IoSettingsOutline />
              Settings
            </button>
          </div>

          <Logo />

          <div className="app-card">
            <CaptionUploader setCaptionLogs={setCaptionLogs} />

            <div className="divider" />

            <CaptionLogs
              captionLogs={captionLogs}
              handleDelete={handleDelete}
              setConfirmDelete={setConfirmDelete}
            />
          </div>
        </main>
      </div>

      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Settings"
      >
        <Settings />
      </Modal>

      <Modal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={"Delete Confirmation"}
      >
        <ConfirmDelete handleDeleteAllCaptions={handleDeleteAllCaptions} />
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={1800}
        limit={1}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        closeButton={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
    </QueryClientProvider>
  );
};

export default App;
