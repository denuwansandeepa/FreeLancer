const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log("=== SkillLanka Admin Creator ===");
  console.log("This script will create a new ADMIN account or promote an existing user to ADMIN.\n");

  const email = await ask("Enter Email Address: ");
  if (!email) {
    console.error("Email is required!");
    rl.close();
    return;
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`\nUser with email '${email}' already exists (Current Role: ${existingUser.role}).`);
    const confirm = await ask("Do you want to promote this user to ADMIN? (yes/no): ");
    
    if (confirm.toLowerCase() === "yes" || confirm.toLowerCase() === "y") {
      await prisma.user.update({
        where: { email },
        data: { role: "ADMIN" },
      });
      console.log(`\nSuccessfully promoted ${existingUser.name} to ADMIN!`);
      console.log(`⚠️ IMPORTANT: Remember to add '${email}' to the ADMIN_EMAILS list in your '.env' file!`);
    } else {
      console.log("\nOperation cancelled.");
    }
  } else {
    // Create new admin
    const name = await ask("Enter Full Name: ");
    if (!name) {
      console.error("Name is required!");
      rl.close();
      return;
    }

    const password = await ask("Enter Password: ");
    if (!password || password.length < 6) {
      console.error("Password is required and must be at least 6 characters!");
      rl.close();
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        location: "Sri Lanka",
      },
    });

    console.log(`\nSuccessfully created new Admin user: ${newUser.name} (${newUser.email})`);
    console.log(`⚠️ IMPORTANT: Remember to add '${newUser.email}' to the ADMIN_EMAILS list in your '.env' file!`);
  }

  rl.close();
}

main()
  .catch((err) => {
    console.error("Error creating admin:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
