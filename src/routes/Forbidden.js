import React from "react"
import { Link, useLocation, useHistory } from "react-router-dom"
import { Button } from '@material-ui/core'
import "./index.css"

// For redirecting from AuthRoute
const Forbidden = () => {
    const history = useHistory()
    const location = useLocation()

    const urlParams = new URLSearchParams(location.search)
    const redirected = urlParams.get('redirected')

    return (
        <div className="NotFound">
            <h1>403: Forbidden</h1>
            <p>
                Sorry! The current account does not have the necessary permissions to access the page.
                <br />
                Please log in with a different account with admin privileges
            </p>
            <Link to="/admin"><Button variant="contained" color="primary">Log In</Button></Link>
            <p>
                <Button variant="contained" onClick={() => redirected ? history.go(-2) : history.goBack()}>Go Back</Button>
            </p>
        </div>
    )
}

export default Forbidden;