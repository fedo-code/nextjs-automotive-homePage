export function getAuthApiError(error, fallbackMessage) {
  if (error?.code === "ENOTFOUND" && String(error?.hostname || "").includes("mongodb")) {
    return "MongoDB host not found. Update MONGODB_URI in your .env file with a real cluster URL.";
  }

  if (String(error?.message || "").toLowerCase().includes("authentication failed")) {
    return "MongoDB authentication failed. Check database username and password in MONGODB_URI.";
  }

  if (String(error?.message || "").toLowerCase().includes("timed out")) {
    return "MongoDB connection timed out. Verify network access and MongoDB IP allowlist.";
  }

  return fallbackMessage;
}
