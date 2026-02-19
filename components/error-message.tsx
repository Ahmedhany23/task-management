"use client";

type Props = {
  error: unknown;
};

export const ErrorMessage = ({ error }: Props) => {
  if (!error) return null;

  return (
    <p style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
      {"Something went wrong"}
    </p>
  );
};
