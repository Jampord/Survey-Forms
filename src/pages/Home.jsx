import { Box, Modal } from "@mui/material";
import NavBar from "../components/NavBar";
import Sidebar from "../components/SideBar";
import "../styles/Home.scss";
import GradingForm from "../components/GradingForm";
import useDisclosure from "../hooks/useDisclosure";
export default function HomePage() {
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 550,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
  };

  return (
    <>
      <Sidebar>
        {/* <NavBar /> */}

        <div className="container">
          <div className="home-page-container">
            <header>
              <h1>Welcome to our Survey!</h1>
              <p>We appreciate your feedback.</p>
            </header>
            <main>
              <section className="survey-description">
                <h2>Survey Description</h2>
                <p>This survey aims to gather information about...</p>
              </section>
              <section className="start-survey">
                <h2>Start Survey</h2>
                <p>Click the button below to begin the grading.</p>
                <button className="start-button" onClick={() => onModalOpen()}>
                  Start Grading
                </button>
              </section>
            </main>
            <footer>
              <p>© RDF. All rights reserved.</p>
            </footer>
          </div>
        </div>

        <Modal open={isModalOpen} onClose={onModalClose}>
          <Box sx={style}>
            <GradingForm onClose={onModalClose} />
          </Box>
        </Modal>
      </Sidebar>
    </>
  );
}
