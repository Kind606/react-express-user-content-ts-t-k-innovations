import { Link } from "react-router";

const Header = () => {
  //replace it with actual auth logic later
  const isLoggedIn = false;
  const isAdmin = false;

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Content Platform</Link>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/posts">Posts</Link>
          </li>

          {isLoggedIn ? (
            <>
              <li>
                <Link to="/create-post">Create Post</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin">Admin</Link>
                </li>
              )}
              <li>
                <button>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
