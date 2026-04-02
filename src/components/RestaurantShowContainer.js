import React, { useState, useEffect } from 'react'
import RestaurantShow from './RestaurantShow'
import GoogleMapLoader from './GoogleMapLoader'

const RestaurantShowContainer = (props) => {
  const [restaurant, setRestaurant] = useState({
    categories: [],
    location: { display_address: [] },
    coordinates: { latitude: null, longitude: null },
  })

  const restaurantId = props.match.params.id

  const getRestaurant = async () => {
    try {
      const response = await fetch(`/api/v1/restaurants/${restaurantId}`)
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
      const body = await response.json()
      setRestaurant(body.restaurant || body)
    } catch (err) {
      console.error('Error fetching restaurant:', err.message)
    }
  }

  useEffect(() => { getRestaurant() }, [])

  return (
    <div>
      <div className="grid-x grid-margin-x">
        <RestaurantShow restaurant={restaurant} />
        <div className="cell">
          <div className="maps">
            <GoogleMapLoader
              latitude={restaurant.coordinates?.latitude}
              longitude={restaurant.coordinates?.longitude}
            />
          </div>
        </div>
      </div>
      <div className="extra-padding"></div>
    </div>
  )
}

export default RestaurantShowContainer
