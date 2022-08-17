import React, { useState, useEffect, useRef} from "react";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";


  // const urlCreate = () => {
  //   let isCreated = false
  //   UserService.createUrl("https://fluffy.cc", "fluffy").then((res) => {
  //     isCreated = res.status === 201 ? true : false
  //   })
  //   console.log("Created url ", isCreated)
  //   return isCreated
  // }


const validUrl = (url) => {
  // https://gist.github.com/dperini/729294
  const URLRegex = RegExp(
    "^" +
      // protocol identifier (optional)
      // short syntax // still required
      "(?:(?:(?:https?|ftp):)?\\/\\/)" +
      // user:pass BasicAuth (optional)
      "(?:\\S+(?::\\S*)?@)?" +
      "(?:" +
        // IP address dotted notation octets
        // excludes loopback network 0.0.0.0
        // excludes reserved space >= 224.0.0.0
        // excludes network & broadcast addresses
        // (first & last IP address of each class)
        "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
        "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
        "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
      "|" +
        // host & domain names, may end with dot
        // can be replaced by a shortest alternative
        // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
        "(?:" +
          "(?:" +
            "[a-z0-9\\u00a1-\\uffff]" +
            "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
          ")?" +
          "[a-z0-9\\u00a1-\\uffff]\\." +
        ")+" +
        // TLD identifier name, may end with dot
        "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
      ")" +
      // port number (optional)
      "(?::\\d{2,5})?" +
      // resource path (optional)
      "(?:[/?#]\\S*)?" +
    "$"
  );

  if (!URLRegex.test(url)) {
    return (
      <div className="alert alert-danger" role="alert">
        Not a valid url
      </div>
    );
  }
}

const validAlias = (alias) => {
  const aliasRegex = RegExp("^[A-Za-z0-9_]+$")
  if (!aliasRegex.test(alias) && alias.length < 50) {
    return (
      <div className="alert alert-danger" role="alert">
        Alias must only contain alphabets, numbers and underscores
      </div>
    );
  }
}

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const Home = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [user, setUser] = useState(null)
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setUser(AuthService.getCurrentUser())
  }, []);

  const onChangeUrl = (e) => {
    const url = e.target.value;
    setUrl(url);
  };

  const onChangeAlias = (e) => {
    const alias = e.target.value;
    setAlias(alias);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      UserService.createUrl(url, alias).then(
        (res) => {
          setLoading(false);
          navigator.clipboard.writeText(res.data.shortUrl)
          setMessage("Copied short url to clipboard!")
        },
        (error) => {
          const resMessage = (error.response && error.response.message)
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
      );
    } else {
      setLoading(false);
    }
  };

  if (user) {
    return (
        <div className="col-lg-12">
        <div className="card card-container">

          <Form onSubmit={handleLogin} ref={form}>
            <div className="form-group">
              <label htmlFor="url">Url</label>
              <Input
                type="text"
                className="form-control"
                name="url"
                value={url}
                onChange={onChangeUrl}
                validations={[required, validUrl]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="alias">Alias</label>
              <Input
                type="text"
                className="form-control"
                name="alias"
                value={alias}
                onChange={onChangeAlias}
                validations={[required, validAlias]}
              />
            </div>

            <div className="form-group">
              <button className="btn btn-primary btn-block" disabled={loading}>
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Shorten</span>
              </button>
            </div>

            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
            <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>
          <button onClick={UserService.getUserUrls}>GetAllUrls</button>
        </div>
      </div>
    )
  } else {
    return (
      <div>Please Login!</div>
    )
  }
};

export default Home;
