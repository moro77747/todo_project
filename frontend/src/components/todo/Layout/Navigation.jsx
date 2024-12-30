import { Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Navigation = ({isAuthenticated}) => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">Home</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={NavLink} to="/tasks">
            Tasks 
          </Nav.Link>
          <Nav.Link as={NavLink} to="/search">
            Search
          </Nav.Link>
          <Nav.Link as={NavLink} to="/timeclock">
            Timeclock
          </Nav.Link>
          <Nav.Link as={NavLink} to="/repeats">
            Repeats
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
