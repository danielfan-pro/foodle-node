import React from 'react'
import { Link } from 'react-router-dom'
import foodleTransparentLogo from '../foodle-logo.png'

// User profiles require a database — disabled in this version.
const UserProfileContainer = () => (
  <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
    <img src={foodleTransparentLogo} alt="Foodle logo" className="logo-main-search" style={{ margin: '0 auto 2rem' }} />
    <h3>User profiles are not available</h3>
    <p>Sign-in and user profiles have been disabled on this version of Foodle.</p>
    <Link to="/restaurants" className="button clear">Browse Restaurants</Link>
  </div>
)

export default UserProfileContainer
