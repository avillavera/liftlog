const dotenv = require("dotenv");
const { execSync } = require("node:child_process");

module.exports = async () => {
  dotenv.config({ path: ".env.test" });
  process.env.NODE_ENV = "test";

  execSync("npx prisma migrate deploy", { stdio: "inherit" });
  execSync("npx prisma db seed", { stdio: "inherit" });
};
