import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsNotEmptyIfExists(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotEmptyIfExists',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          // const [relatedPropertyName] = args.constraints;
          // const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            value === undefined ||
            value === null ||
            (typeof value === 'string' && value.length > 0)
          ); // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}
