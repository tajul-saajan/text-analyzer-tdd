// Register a handler for uncaught exceptions
process.on('uncaughtException', error => {
  console.error('Uncaught exception:', error);
  unhandledException(error)
    .then(() => {})
    .catch(logError => {
      console.error('Error logging exception:', logError);
    });

  process.exit(1);
});

process.on('unhandledRejection', reason => {
  console.error('Unhandled rejection:', reason);

  unhandledException(reason)
    .then(() => {})
    .catch(logError => {
      console.error('Error logging rejection:', logError);
    });
});

/**
 * Function to log exceptions
 * @param {Error} error - The exception/error to log
 * @returns {Promise<void>}
 */
async function unhandledException(error) {
  try {
    console.log('error', 'Exception occurred', { error });
    console.log('Exception occurred');
  } catch (error) {
    throw new Error(`Failed to log exception: ${error?.message}`);
  }
}

process.on('exit', code => {
  setTimeout(() => {
    console.log(`Exiting with code error: ${code}`);
  }, 15000);
});

export function run() {
  console.log('ran for uncaught exception issues');
}
