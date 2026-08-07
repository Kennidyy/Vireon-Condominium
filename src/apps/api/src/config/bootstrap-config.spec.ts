import {
  assertConfig,
  ConfigurationReader,
  MissingConfigurationException,
} from './bootstrap-config';

function reader(values: Record<string, unknown>): ConfigurationReader {
  return {
    get<TProperty>(key: string): TProperty | undefined {
      return values[key] as TProperty | undefined;
    },
  };
}

describe('bootstrap configuration', () => {
  it('should pass when JWT_SECRET is defined', () => {
    expect(() =>
      assertConfig(reader({ 'auth.jwtSecret': 'super-secret' })),
    ).not.toThrow();
  });

  it('should fail fast when JWT_SECRET is missing', () => {
    expect(() => assertConfig(reader({}))).toThrow(
      MissingConfigurationException,
    );
  });

  it('should fail fast when JWT_SECRET is empty', () => {
    expect(() => assertConfig(reader({ 'auth.jwtSecret': '' }))).toThrow(
      MissingConfigurationException,
    );
  });

  it('should report the missing variable name', () => {
    let error: MissingConfigurationException | undefined;

    try {
      assertConfig(reader({}));
    } catch (caught) {
      error = caught as MissingConfigurationException;
    }

    expect(error?.name).toBe('MissingConfigurationException');
    expect(error?.message).toContain('JWT_SECRET');
  });
});
