import React from 'react'
import { Link } from 'react-router-dom'

// Reviews require a database — disabled in this version.
const ReviewForm = (props) => {
  const restaurantId = props.match?.params?.id
  return (
    <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <h3>Reviews are not available</h3>
      <p>User reviews have been disabled on this version of Foodle.</p>
      <Link to={`/restaurants/${restaurantId}`} className="button clear">
        Back to Restaurant
      </Link>
    </div>
  )
}

export default ReviewForm
