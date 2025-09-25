import React from "react";

export default function Button({ variant = "primary", children, ...rest }) {
  const cls = variant === "primary" ? "btn-primary" : "btn-secondary";
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
