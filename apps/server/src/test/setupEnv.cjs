const dotenv = require("dotenv");

// Always load test env, regardless of NODE_ENV
dotenv.config({ path: ".env.test" });

process.env.NODE_ENV = "test";
