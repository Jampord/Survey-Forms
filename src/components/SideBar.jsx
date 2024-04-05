// import { useState } from "react";
// import { elastic as Menu } from "react-burger-menu";
// import "./SideBar.css";
// import burgerIcon from "../assets/burger-icon.png";
// import { NavLink } from "react-router-dom";

// function CustomBurgerIcon() {
//   <img src="../assets/burger-icon.png" alt="burger-icon" />;
// }

// export default function SideBar() {
//   const [isOpen, setIsOpen] = useState(false);

//   function toggleSideBar() {
//     setIsOpen(!isOpen);
//   }

//   return (
//     <>
//       <button onClick={toggleSideBar}>
//         {<img src={burgerIcon} alt="burger-icon" />}
//       </button>
//       {isOpen && (
//         <Menu
//           noOverlay
//           customBurgerIcon={<CustomBurgerIcon />}
//           isOpen={isOpen}
//           onStateChange={(state) => setIsOpen(state.isOpen)}
//           className="sidebar"
//         >
//           <ul>
//             <li id="dashboard" className="menu-item">
//               <NavLink to="/">Dash Board</NavLink>
//             </li>
//             <li id="User Account" className="menu-item">
//               <NavLink to="/user-account">User Account</NavLink>
//             </li>
//             <li id="User Role" className="menu-item">
//               <NavLink to="/user-role">User Role</NavLink>
//             </li>
//           </ul>
//         </Menu>
//       )}
//     </>
//   );
// }
