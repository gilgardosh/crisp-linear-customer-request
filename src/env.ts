import { config } from 'dotenv';
import zod from 'zod';

config();

const CrispModel = zod.object({
    WEBSITE_ID: zod.string(),
    IDENTIFIER: zod.string(),
    KEY: zod.string(),
});

const configs = {
    crisp: CrispModel.safeParse(process.env),
};

const environmentErrors: Array<string> = [];

for (const config of Object.values(configs)) {
  if (config.success === false) {
    environmentErrors.push(JSON.stringify(config.error.format(), null, 4));
  }
}

if (environmentErrors.length) {
  const fullError = environmentErrors.join(`\n`);
  console.error('❌ Invalid environment variables:', fullError);
  process.exit(1);
}

function extractConfig<Input, Output>(config: zod.SafeParseReturnType<Input, Output>): Output {
  if (!config.success) {
    throw new Error('Something went wrong.');
  }
  return config.data;
}

const crisp = extractConfig(configs.crisp);

export const env = {
  crisp: {
    websiteId: crisp.WEBSITE_ID,
    identifier: crisp.IDENTIFIER,
    key: crisp.KEY,
  },
} as const;