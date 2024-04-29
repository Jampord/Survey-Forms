import NavBar from "../components/NavBar";
import Sidebar from "../components/SideBar";
import "../styles/Home.scss";
export default function HomePage() {
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
                <p>Click the button below to begin the survey.</p>
                <button className="start-button">Start Survey</button>
              </section>
            </main>
            <footer>
              <p>© RDF. All rights reserved.</p>
            </footer>
          </div>
        </div>
      </Sidebar>
    </>
  );
}
