import React from "react";
import LastestEightCars from "../first-eight-cars";

export default function FeaturedCarsSection({ allCars ,isFeatured = false}) {
  return (
    <>
      {isFeatured  ?  <LastestEightCars allCars={allCars} isFeatured={true} /> :
        <LastestEightCars allCars={allCars} isFeatured={false} />
     }
    </>
  );
}
