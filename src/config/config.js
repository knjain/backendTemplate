const Joi = require('joi');
const path = require('path');
const dotnev = require('dotenv');

dotnev.config({path: path.join(__dirname, '../../.env')});

// schema of env files for validation
const envVarsSchema = Joi.object()
  .keys({
    NEXT_PUBLIC_NODE_ENV: Joi.string()
      .valid('test', 'development', 'production')
      .required(),
    NEXT_PUBLIC_PORT: Joi.number().default(8082),
    NEXT_PUBLIC_MONGODB_URL: Joi.string().required(),
    NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY: Joi.string().required(),
    NEXT_PUBLIC_AWS_S3_REGION: Joi.string().required(),
    NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID: Joi.string().required(),
    NEXT_PUBLIC_AWS_S3_BUCKET: Joi.string().required(),
  })
  .unknown();

// validating the process.env object that contains all the env variables
const {value: envVars, error} = envVarsSchema.prefs({errors: {label: 'key'}}).validate(process.env);

// throw error if the validation fails or results into false
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NEXT_PUBLIC_NODE_ENV,
  port: envVars.NEXT_PUBLIC_PORT,
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  },
  aws: {
    s3: {
      name: envVars.NEXT_PUBLIC_AWS_S3_BUCKET,
      region: envVars.NEXT_PUBLIC_AWS_S3_REGION,
      accessKeyId: envVars.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: envVars.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY,
    },
  },
  mongoose: {
    // exception added for TDD purpose
    url: envVars.NEXT_PUBLIC_MONGODB_URL + (envVars.NEXT_PUBLIC_NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  sendGridAPIKey: process.env.SENDGRID_API_KEY,
  adminEmail: process.env.ADMIN_EMAIL,
};
