export const modalStyles = (theme: any, width?: string) => ({
  display: "flex",
    flexDirection: "column" as const,
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width ?? "85%",
    maxHeight: "80vh",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: theme.shadows[5],
});
