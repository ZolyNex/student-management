import { Outlet } from "react-router";
import NavBar from "../ui/NavBar";

export default function Home() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
