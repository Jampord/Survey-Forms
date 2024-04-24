import { useSelector } from "react-redux";
import { navigationData } from "../routes/NavigationData";
import CurrentDate from "./CurrentDate";
import Logout from "./Logout";

import "./NavBar.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@mui/material";

export default function NavBar() {
  const navigate = useNavigate();
  const permissions = useSelector((state) => state.permissions.permissions);
  const filteredNavdata = navigationData.filter((item) =>
    permissions.includes(item.name)
  );
  // const navdata = navigationData;
  const [selectedItem, setSelectedItem] = useState(
    permissions.length > 0 ? filteredNavdata[0].name : null
  );

  const handleItemClick = (item) => {
    navigate(item.path);
    setSelectedItem(item.name);
  };
  console.log(selectedItem, "selectedItem");

  return (
    <nav className="navbar">
      <div className="navbar__date">
        <CurrentDate />
        <div className="navbar__items">
          {filteredNavdata.map((item) => {
            return (
              <Button onClick={() => handleItemClick(item)}>
                <span
                  className={`navbar__items__spacer ${
                    selectedItem === item.name ? "selected" : ""
                  }`}
                >
                  {item.name}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
      <Logout />
    </nav>
  );
}
