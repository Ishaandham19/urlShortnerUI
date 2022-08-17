import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getUserBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }, []);

  return (
    <div>
        <nav>
        <ul class="nav">
            <li><a href="#">Login</a></li>
            <li><a href="#">Register</a></li>
        </ul>
        </nav>
  </div>
  );
};

export default Navbar;
