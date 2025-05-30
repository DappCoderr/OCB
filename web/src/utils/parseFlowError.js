export function parseFlowError(error) {
  let msg =
    (typeof error === "string" && error) ||
    (error && error.message) ||
    (error && error.errorMessage) ||
    "Transaction failed";

  // Try to extract a user-friendly message from Cadence errors
  // Look for "pre-condition failed: ..." or "error: ..."
  const preCondMatch = msg.match(/pre-condition failed: ([^.]*)/i);
  if (preCondMatch && preCondMatch[1]) {
    return preCondMatch[1].trim();
  }
  const errorMatch = msg.match(/error: ([^.]*)/i);
  if (errorMatch && errorMatch[1]) {
    return errorMatch[1].trim();
  }
  // Fallback: show only the first line if it's too long
  if (msg.length > 120) {
    return msg.split("\n")[0];
  }
  return msg;
}
