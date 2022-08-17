import React, { useState, useEffect } from "react";

const InputForm = () => {
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
        <form id="url-form">
            <input id="url" name="url" type="text" placeholder="paste a long url" autofocus required />
            <input id="alias" name="alias" type="text" placeholder="custom alias" required />
            <button id="btn" class="gradient-text">create short url</button>
        </form>
        <div id="result"></div>
  </div>
  );
};

export default InputForm;
