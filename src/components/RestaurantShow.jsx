import React from "react"
import ConvertRatingToStar from "./ConvertRatingToStar"

const RestaurantShow = (props) => {
  let categoriesArray = []
  let categories = ""

  const categoriesSource = Array.isArray(props.restaurant?.categories)
    ? props.restaurant.categories
    : []

  categoriesSource.forEach((category) => {
    categoriesArray.push(category.title)
    return categoriesArray
  })

  categories = categoriesArray.join(", ")

  const displayAddress = Array.isArray(props.restaurant?.location?.display_address)
    ? props.restaurant.location.display_address.join(", ")
    : ""
  const websiteUrl = props.restaurant?.business_website || ""
  const websiteHref = websiteUrl.startsWith("http")
    ? websiteUrl
    : `https://${websiteUrl}`

  return (
    <div className="cell">
      <div className="restaurant-show-tile">
        <h3>{props.restaurant?.name || ""}</h3>
        <div className="restaurant-stars">
          {ConvertRatingToStar.convert(props.restaurant?.rating)}
        </div>
        <div className="price">{props.restaurant?.price || ""}</div>
        <div>
          <p className="restaurant-info-line">{categories}</p>
        </div>
        <div>
          <p className="restaurant-info-line">{props.restaurant?.display_phone || ""}</p>
          {websiteUrl ? (
            <p className="restaurant-info-line">
              <a
                href={websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="restaurant-info-link"
              >
                {websiteUrl}
              </a>
            </p>
          ) : null}
        </div>
        <img
          src={props.restaurant?.image_url}
          className="restaurant-show-image"
        />
        <div className="restaurant-address">
          <p>{displayAddress}</p>
        </div>
      </div>
    </div>
  )
}

export default RestaurantShow
