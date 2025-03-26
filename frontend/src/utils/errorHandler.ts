import { analytics } from '../FirebaseCredentials';
import { logEvent } from 'firebase/analytics';

export const logError = (error: Error) => {
  logEvent(analytics, 'error_occurred', {
    error_message: error.message,
    error_stack: error.stack,
  });
};