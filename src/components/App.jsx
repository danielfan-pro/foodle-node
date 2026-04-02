import React, { useState, useEffect } from "react"
import { BrowserRouter, Link, NavLink, Route, Switch } from "react-router-dom"
import HomePage from "./HomePage"
import RestaurantIndexContainer from "./RestaurantIndexContainer"
import RestaurantShowContainer from "./RestaurantShowContainer"
import ReviewForm from "./ReviewForm"
import UserProfileContainer from "./UserProfileContainer"
import RecipeIndexContainer from "./RecipeIndexContainer"
import RecipeShowContainer from "./RecipeShowContainer"
import foodleTransparentLogo from "../foodle-logo.png"

export const App = () => {
  const [theme, setTheme] = useState("light")
  const [status, setStatus] = useState("moon")

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
      setStatus("sun")
    } else {
      setTheme("light")
      setStatus("moon")
    }
  }

  useEffect(() => {
    document.body.className = theme
  }, [theme])

  return (
    <div className={`App ${theme}`}>
      <BrowserRouter>
        <div className="top-bar">
          <div className="left">
            <Link to="/" aria-label="Foodle home">
              <img
                src={foodleTransparentLogo}
                alt="Foodle logo"
                className="logo-nav-bar"
              />
            </Link>
          </div>

          <div className="top-bar-section">
            <ul className="right">
              <li>
                <NavLink to="/restaurants" className="button clear">
                  Restaurants
                </NavLink>
              </li>
              <li>
                <NavLink to="/recipes" className="button clear">
                  Recipes
                </NavLink>
              </li>
              <li id="theme-toggle-slot">
                <i
                  className={`fa-solid fa-${status} dark-mode-toggle`}
                  onClick={toggleTheme}
                ></i>
              </li>
            </ul>
          </div>
        </div>

        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route
            exact
            path="/restaurants"
            component={RestaurantIndexContainer}
          />
          <Route
            exact
            path="/restaurants/:id/reviews/new"
            component={ReviewForm}
          />
          <Route
            exact
            path="/restaurants/:id"
            component={RestaurantShowContainer}
          />
          <Route exact path="/recipes" component={RecipeIndexContainer} />
          <Route exact path="/recipes/:id" component={RecipeShowContainer} />
          <Route exact path="/u/:username" component={UserProfileContainer} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default App
