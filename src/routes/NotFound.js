import React from "react"
import { useHistory } from "react-router-dom"
import { Button } from '@material-ui/core'
import "./index.css"

const NotFound = (props) => {

  const {
    redirectFunction = null,
    redirectString = null,
    returnFunction = null,
    returnString = null
  } = props;

  const history = useHistory();
  const defaultRedirect = () => history.push("/home");
  const defaultReturn = () => history.goBack();

  return (
    <div className="NotFound">
      <h1>404: Not Found</h1>
      <p>Sorry, the page you are looking for cannot be found</p>
      <br />
      <Button variant="contained" color="primary" onClick={redirectFunction || defaultRedirect}>{redirectString || "Home"}</Button>
      <Button variant="contained" onClick={returnFunction || defaultReturn}>{returnString || "Go Back"}</Button>
    </div>
  );
};

export default NotFound;