import { PropsWithChildren } from "react";
// import MobileNavbar from "./mobileNavbar";
import DesktopNavbar from "./desktopNavbar";

type Props = PropsWithChildren;
const NavbarContainer = (props: Props) => {
  return (
    <div className="relative">
      <DesktopNavbar>{props.children}</DesktopNavbar>
      {/* <MobileNavbar>{props.children}</MobileNavbar> */}
    </div>
  );
};

export default NavbarContainer;