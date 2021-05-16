import React from "react"
import {
  Route,
  BrowserRouter,
  Switch
} from "react-router-dom"

// import pages
import Landing from "./Landing"
import Home from "./Home"

function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                {/* AUTHENTICATED ROUTES */}

                {/* PUBLIC ROUTES */}
                <Route path="/home" component={Home} />
                <Route path="*" component={Landing} />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes
