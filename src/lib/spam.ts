/**
 * Checks if a submission was filled out by an automated bot via honeypot field.
 * Legitimate humans will not see or fill the _gotcha field.
 */
export function isSpamSubmission(gotchaValue?: string): boolean {
  if (gotchaValue && gotchaValue.trim().length > 0) {
    return true;
  }
  return false;
}
