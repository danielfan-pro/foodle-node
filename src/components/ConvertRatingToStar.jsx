import React from "react"

class ConvertRatingToStar {
  static convert(rating) {
    const parsedRating = Number(rating)
    const safeRating = Number.isFinite(parsedRating)
      ? Math.max(0, Math.min(5, Math.round(parsedRating * 2) / 2))
      : 0

    const fullStars = Math.floor(safeRating)
    const hasHalfStar = safeRating % 1 !== 0
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="rating">
        {Array.from({ length: fullStars }).map((_, index) => (
          <i key={`full-${index}`} className="fa-solid fa-star"></i>
        ))}
        {hasHalfStar ? (
          <i key="half" className="fa-solid fa-star-half-stroke"></i>
        ) : null}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <i key={`empty-${index}`} className="fa-regular fa-star"></i>
        ))}
      </div>
    )
  }
}

export default ConvertRatingToStar
