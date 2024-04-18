import { useSelector } from "react-redux";
import { navigationData } from "../routes/NavigationData";
import CurrentDate from "./CurrentDate";
import Logout from "./Logout";

import "./NavBar.scss";
import { Link } from "react-router-dom";

export default function NavBar() {
  const permissions = useSelector((state) => state.permissions.permissions);
  // const navdata = navigationData;
  const filteredNavdata = navigationData.filter((item) =>
    permissions.includes(item.name)
  );
  console.log(filteredNavdata);
  return (
    <nav className="navbar">
      <div className="navbar__date">
        <CurrentDate />
        <div className="navbar__items">
          {navigationData.map((item) => {
            return (
              <Link to={item.path} key={item.id}>
                <span className="navbar__spacer">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <Logout />
    </nav>
  );
}
