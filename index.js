#!/usr/bin/env node

const { execSync } = require("child_process");
const yargs = require("yargs");

// Define your CLI commands and options
const argv = yargs
  .usage("Usage: $0 [options]")
  .option("name", {
    describe: "Name of your next app",
    demandOption: true, // Require the 'name' option
    type: "string"
  })
  .help().argv;

function createNextApp() {
  console.log("Creating Next.js app...");
  try {
    execSync(`npx create-next-app ${argv.name}`, { stdio: "inherit" });
    console.log("Next.js app created successfully.");
  } catch (error) {
    console.error("Error creating Next.js app:", error.message);
    process.exit(1);
  }
}

function installSst() {
  console.log("Installing SST...");
  try {
    execSync(`cd ./${argv.name} && npx create-sst@latest`, {
      stdio: "inherit"
    });
    console.log("SST installed successfully.");
  } catch (error) {
    console.error("Error installing SST:", error.message);
    process.exit(1);
  }
}

function installPrisma() {
  console.log("Installing Prisma...");
  try {
    execSync(
      `cd ./${argv.name} && npm install prisma --save-dev && npx prisma && npx prisma init`,
      {
        stdio: "inherit"
      }
    );

    execSync(
      `mkdir -p ./${argv.name}/helpers/Prisma && cat ./helpers/Prisma/db.ts > ./${argv.name}/helpers/Prisma/db.ts`
    );

    console.log("Prisma installed successfully.");
  } catch (error) {
    console.error("Error installing Prisma:", error.message);
    process.exit(1);
  }
}

function installNextAuth() {
  console.log("Installing Next Auth...");
  try {
    execSync(`cd ./${argv.name} && npm install next-auth`, {
      stdio: "inherit"
    });
    execSync(
      `mkdir -p ./${argv.name}/app/api/auth/\[...nextauth\]/ && touch ./${argv.name}/app/api/auth/\[...nextauth\]/route.ts && cat ./app/api/auth/\[...nextauth\]/route.ts > ./${argv.name}/app/api/auth/\[...nextauth\]/route.ts`,
      {
        stdio: "inherit"
      }
    );
    execSync(
      `mkdir -p ./${argv.name}/util && touch ./${argv.name}/util/auth.ts && cat ./util/auth.ts > ./${argv.name}/util/auth.ts`,
      {
        stdio: "inherit"
      }
    );

    execSync(
      `mkdir -p ./${argv.name}/components/NextAuthProvider && cat ./components/NextAuthProvider/provider.tsx > ./${argv.name}/components/NextAuthProvider/next-auth-provider.tsx`
    );
    execSync(
      `mkdir -p ./${argv.name}/components/Debugger && cat ./components/Debugger/debugger.tsx > ./${argv.name}/components/Debugger/debugger.tsx`
    );

    console.log("Next Auth installed successfully.");
  } catch (error) {
    console.error("Error installing Next Auth:", error.message);
    process.exit(1);
  }
}

function installWinston() {
  execSync(
    `mkdir -p ./${argv.name}/helpers/Logger && cat ./helpers/Logger/winston.ts > ./${argv.name}/helpers/Logger/winston.ts`
  );
  console.log("Installing Winston...");
  try {
  } catch (error) {
    console.error("Error installing Winston:", error.message);
    process.exit(1);
  }
}

function installHighLevel() {
  console.log("Installing HighLevel...");
  execSync(`npm install bson`);
  execSync(`npm install crypto-js`);
  execSync(`npm install qs`);
  execSync(`npm install axios`);
  execSync(
    `mkdir -p ./${argv.name}/api/lead-connector && cat ./api/lead-connector/route.ts > ./${argv.name}/helpers/lead-connector/route.ts`
  );
  execSync(
    `mkdir -p ./${argv.name}/helpers/HighLevel && cat ./helpers/HighLevel/highlevel.ts > ./${argv.name}/helpers/HighLevel/highlevel.ts`
  );
  execSync(
    `cat ./helpers/HighLevel/index.ts > ./${argv.name}/helpers/HighLevel/index.ts`
  );
  execSync(
    `cat ./helpers/HighLevel/model.ts > ./${argv.name}/helpers/HighLevel/model.ts`
  );
  try {
  } catch (error) {
    console.error("Error installing HighLevel:", error.message);
    process.exit(1);
  }
}

function installContextProvider() {
  execSync(
    `mkdir -p ./${argv.name}/components/ContextProvider && cat ./helpers/ContextProvider/context-provider.tsx > ./${argv.name}/helpers/ContextProvider/context-provider.tsx`
  );
}

function installChakraProvider() {
  execSync(
    `mkdir -p ./${argv.name}/components/ChakraProvider && cat ./helpers/ChakraProvider/chakra-provider.tsx > ./${argv.name}/helpers/ChakraProvider/chakra-provider.tsx`
  );
}

function installLayout() {
  execSync(`cat ./app/layout.tsx > ./${argv.name}/app/layout.tsx`);
}

function installVariables() {
  // Values to be injected
  const result = execSync("openssl rand -base64 32", { stdio: "pipe" }); // Example value for secret
  const secret = result.toString().trim();
  console.log("SECRET:", secret);
  // Content template with placeholders for dynamic values
  const content = `NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${secret}"`;

  // Destination file to be overwritten
  const destinationFile = `${argv.name}/.env`;

  // Write the content to the destination file using shell redirection
  try {
    execSync(`mkdir -p ${argv.name} && touch ${destinationFile}`);
    execSync(`cat << EOF > ${destinationFile}\n${content}\nEOF`);
    console.log("File overwritten successfully.");
  } catch (error) {
    console.error("Error overwriting file:", error.message);
  }
}

function installGitIgnoreFile() {
  execSync(`touch ./${argv.name}/.gitignore`);
  execSync(`cat .gitignore > ./${argv.name}/.gitignore`);
}

createNextApp();
installSst();
installPrisma();
installNextAuth();
installWinston();
installHighLevel();
installContextProvider();
installChakraProvider();
installLayout();
installVariables();
installGitIgnoreFile();

console.log("CLI process completed.");
console.log(
  `Don't forget to update ./${argv.name}/prisma/schema.prisma add the "schema": "prisma generate" command to your package.json.`
);
