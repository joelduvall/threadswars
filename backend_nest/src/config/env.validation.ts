import { plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  NODE_ENV!: string;

  @IsNumber()
  @IsNotEmpty()
  PORT!: number;

  @IsBoolean()
  @IsNotEmpty()
  PRODUCTION!: boolean;

  @IsString()
  @IsNotEmpty()
  MONGODB_HOST!: string;

  @IsString()
  @IsNotEmpty()
  MONGODB_USERNAME!: string;

  @IsString()
  @IsNotEmpty()
  MONGODB_PASSWORD!: string;

  @IsString()
  @IsNotEmpty()
  MONGODB_DATABASE_NAME!: string;

  @IsString()
  @IsNotEmpty()
  AZURE_STORAGE_ACCOUNT_NAME!: string;

  @IsString()
  @IsNotEmpty()
  AZURE_STORAGE_ACCOUNT_KEY!: string;

  @IsString()
  @IsNotEmpty()
  AZURE_STORAGE_AVATAR_CONTAINER_NAME!: string;

  @IsString()
  @IsNotEmpty()
  AZURE_STORAGE_THREAD_CONTAINER_NAME!: string;

  @IsString()
  @IsNotEmpty()
  CLERK_ISSUER_URL: string;

  @IsString()
  @IsNotEmpty()
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;

  @IsString()
  @IsNotEmpty()
  CLERK_SECRET_KEY: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
