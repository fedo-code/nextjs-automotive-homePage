const { addAuthorizedEmail } = require("../lib/auth");

async function initializeAuthorizedEmails() {
  try {
    const authorizedEmails = [
      "admin@veichle.com",
      "demo@veichle.com",
      "test@veichle.com",
    ];

    console.log("Adding authorized Google emails...");

    for (const email of authorizedEmails) {
      try {
        await addAuthorizedEmail(email);
        console.log(`Added authorized email: ${email}`);
      } catch (error) {
        console.log(`Failed to authorize ${email}: ${error.message}`);
      }
    }

    console.log("\nAuthorized email initialization completed.");
    console.log("\nAuthorized emails:");
    authorizedEmails.forEach((email) => {
      console.log(`  ${email}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Failed to initialize authorized emails:", error.message);
    process.exit(1);
  }
}

initializeAuthorizedEmails();
