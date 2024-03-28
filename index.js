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
      `cd ./${argv.name} && npm install prisma --save-dev && yarn prisma init`,
      {
        stdio: "inherit"
      }
    );

    execSync(
      `mkdir -p ./${argv.name}/helpers/Prisma && cp ./helpers/Prisma/db.ts ./${argv.name}/helpers/Prisma/`
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
      `mkdir -p ./${argv.name}/app/api/auth/\[...nextauth\]/ && cp ./app/api/auth/\[...nextauth\]/route.ts ./${argv.name}/app/api/auth/\[...nextauth\]/`,
      {
        stdio: "inherit"
      }
    );
    execSync(
      `mkdir -p ./${argv.name}/util && touch ./${argv.name}/util/auth.ts && cp ./util/auth.ts ./${argv.name}/util/`,
      {
        stdio: "inherit"
      }
    );

    execSync(
      `mkdir -p ./${argv.name}/components/NextAuthProvider && cp ./components/NextAuthProvider/next-auth-provider.tsx ./${argv.name}/components/NextAuthProvider/`
    );
    execSync(
      `mkdir -p ./${argv.name}/components/Debugger && cp ./components/Debugger/debugger.tsx ./${argv.name}/components/Debugger/`
    );

    console.log("Next Auth installed successfully.");
  } catch (error) {
    console.error("Error installing Next Auth:", error.message);
    process.exit(1);
  }
}

function installWinston() {
  execSync(
    `mkdir -p ./${argv.name}/helpers/Logger && cp ./helpers/Logger/winston.ts ./${argv.name}/helpers/Logger/`
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
    `mkdir -p ./${argv.name}/app/api/lead-connector && cp ./app/api/lead-connector/route.ts ./${argv.name}/app/api/lead-connector/`
  );
  execSync(
    `mkdir -p ./${argv.name}/helpers/HighLevel && cp -r ./helpers/HighLevel/* ./${argv.name}/helpers/HighLevel`
  );

  try {
  } catch (error) {
    console.error("Error installing HighLevel:", error.message);
    process.exit(1);
  }
}

function installContextProvider() {
  execSync(
    `mkdir -p ./${argv.name}/components/ContextProvider && cp ./components/ContextProvider/context-provider.tsx ./${argv.name}/components/ContextProvider/`
  );
}

function installChakraUiProvider() {
  execSync(
    `mkdir -p ./${argv.name}/components/ChakraProvider && cp ./components/ChakraProvider/chakra-provider.tsx ./${argv.name}/components/ChakraProvider/`
  );
}

function installLayout() {
  execSync(`cp ./app/layout.tsx ./${argv.name}/app/`);
}

function installVariables() {
  // Values to be injected
  const result = execSync("openssl rand -base64 32", { stdio: "pipe" }); // Example value for secret
  const secret = result.toString().trim();
  console.log("SECRET:", secret);
  // Content template with placeholders for dynamic values
  const content = `NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${secret}"
DATADOG_API_KEY=""
DATABASE_URL=""
`;

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
  execSync(`cp ./.gitignore ./${argv.name}/`);
}

createNextApp();
installSst();
installPrisma();
installNextAuth();
installWinston();
installHighLevel();
installContextProvider();
installChakraUiProvider();
installLayout();
installVariables();
installGitIgnoreFile();

// installGit()
// pushToGit()
// deploy()

console.log("CLI process completed.");
console.log(
  `Don't forget to update ./${argv.name}/prisma/schema.prisma add the "schema": "prisma generate" command to your package.json.`
);
