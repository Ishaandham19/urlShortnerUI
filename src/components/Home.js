import React, { useState, useEffect, useRef} from "react";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import UserData from "./UserData";
import HomeMessage from "./HomeMessage"

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
      <div className="alertText" role="alert">
        Not a valid url
      </div>
    );
  }
}

const validAlias = (alias) => {
  const aliasRegex = RegExp("^[A-Za-z0-9_]+$")
  if (!aliasRegex.test(alias) && alias.length < 50) {
    return (
      <div className="alertText" role="alert">
        Alias must only contain alphabets, numbers and underscores
      </div>
    );
  }
}

const required = (value) => {
  if (!value) {
    return (
      <div className="alertText" role="alert">
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
  const [updateUserUrls, setUpdateUserUrls] = useState(false)

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
          setUpdateUserUrls(!updateUserUrls)
          if (navigator.clipboard) {
            navigator.clipboard.writeText(res.data.shortUrl)
            .then(
              (res) => {
                setMessage("Copied short url to clipboard!")
              }
            )
            .catch(
              (err) => {
                setMessage("Short url created!")
              }
            )
          }
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
    <div id="home-container" className="container-fluid">
    <div className="row">
        <div id="form-container" className="col-8">
          <div className="card-container">

            <Form onSubmit={handleLogin} ref={form}>
              <div className="form-group">
                <Input
                  type="text"
                  placeholder="Enter a url"
                  className="form-control"
                  name="url"
                  value={url}
                  onChange={onChangeUrl}
                  validations={[required, validUrl]}
                />
              </div>

              <div className="form-group">
                <Input
                  type="text"
                  placeholder="Custom Alias"
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
                  <span className="gradient-text">Shorten</span>
                </button>
              </div>

              {message && (
                <div className="form-group" style={{ textAlign: 'center'}}>
                  <div className="alertText" role="alert">
                    {message}
                  </div>
                </div>
              )}
              <CheckButton style={{ display: "none" }} ref={checkBtn} />
            </Form>
          </div>
        </div>
      <div className="col">
        <UserData update={updateUserUrls}></UserData>
      </div>
    </div>
   </div>
  )}
  else {
    return (
      <HomeMessage />
    )
  }};

export default Home;
