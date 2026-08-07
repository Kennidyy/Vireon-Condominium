export interface ConfigurationReader {
  get<TProperty = unknown>(propertyPath: string): TProperty | undefined;
}

export class MissingConfigurationException extends Error {
  constructor(variable: string) {
    super(`Required environment variable "${variable}" is not defined`);
    this.name = 'MissingConfigurationException';
  }
}

export function assertConfig(configService: ConfigurationReader): void {
  const jwtSecret = configService.get<string>('auth.jwtSecret');

  if (!jwtSecret) {
    throw new MissingConfigurationException('JWT_SECRET');
  }
}
