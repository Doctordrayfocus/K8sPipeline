import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const ORIGIN = process.env.ORIGIN === 'true';
export const {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITLAB_APP_ID,
  GITLAB_APP_SECRET,
  BITBUCKET_CLIENT_ID,
  BITBUCKET_CLIENT_SECRET,
  TEMPLATE_CONFIG_REPO_URL,
  TEMPLATE_SYNC_INTERVAL,
  APP_URL,
  DOCKER_REGISTRY,
} = process.env;
