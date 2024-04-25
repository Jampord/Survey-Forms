import { useSelector } from "react-redux";
import { navigationData } from "../routes/NavigationData";
import CurrentDate from "./CurrentDate";
import Logout from "./Logout";

import "../styles/NavBar.scss";
import { NavLink } from "react-router-dom";
import { Button } from "@mui/material";

export default function NavBar() {
  const permissions = useSelector((state) => state.permissions.permissions);
  const filteredNavdata = navigationData.filter((item) =>
    permissions.includes(item.name)
  );
  // const navdata = navigationData;

  // useEffect(() => {
  //   if (selectedItem) {
  //     navigate(
  //       selectedItem === filteredNavdata[0].name
  //         ? "/"
  //         : filteredNavdata.find((item) => item.name === selectedItem).path
  //     );
  //   }
  // }, [selectedItem, navigate, filteredNavdata]);

  return (
    <nav className="navbar">
      <div className="navbar__date">
        <CurrentDate />
        <div className="navbar__items">
          {filteredNavdata.map((item) => {
            return (
              <NavLink to={item.path}>
                {({ isActive }) => (
                  <Button>
                    <span
                      className={`navbar__items__spacer ${
                        isActive ? "selected" : ""
                      }`}
                    >
                      {item.name}
                    </span>
                  </Button>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
      <Logout />
    </nav>
  );
}
