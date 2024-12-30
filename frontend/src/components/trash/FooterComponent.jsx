import { AuthContext } from "../todo/security/AuthContext";
import { useContext } from "react";
function FooterComponent() {
  const authContext = useContext(AuthContext);
  console.log(`Footer component - ${authContext.number}`);
  return <footer className="footer"></footer>;
}

export default FooterComponent;
