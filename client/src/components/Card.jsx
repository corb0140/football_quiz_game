import React from "react";

function Card({ children, className }) {
  return <div className={`${className} rounded-md`}>{children}</div>;
}

export default Card;
