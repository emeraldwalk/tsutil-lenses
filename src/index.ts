/**
 * Takes 1-n lenses and returns a promise to their return values.
 * @param args 1-n lenses
 */
export async function get<
  A extends Array<any>,
  V extends
    A extends [Func<any, infer T1 | Promise<infer T1>>, any] ? [T1] :
    A extends [Func<any, infer T1 | Promise<infer T1>>, Func<any, infer T2 | Promise<infer T2>>, any] ? [T1, T2] :
    A extends [Func<any, infer T1 | Promise<infer T1>>, Func<any, infer T2 | Promise<infer T2>>, Func<any, infer T3 | Promise<infer T3>>, any] ? [T1, T2, T3] :
    never
>(
  ...args: A
): Promise<V> {
  const data = args[args.length - 1];
  const results = args.slice(0, -1).map(f => f(data));
  return Promise.all(results) as unknown as V;
}

/**
 * Lense for retrieving a required field value from given data.
 * @param type expected field type.
 */
export function required<
  T extends 'string' | 'object' | 'number',
  V extends
    T extends 'string' ? string :
    T extends 'object' ? Object :
    T extends 'number' ? number :
    never
>(type: T) {
  return (field: string) => (data: any): V => {
    if(data[field] == null) {
      throw new Error(`Required field '${field}' is missing.`)
    }

    const cast = {
      number: (raw: any) => {
        if(isNaN(raw)) {
          throw new Error(`Required number field '${field}' is not a number but is '${raw}'.`);
        }
        return Number(raw);
      },
      object: (raw: any) => {
        if(typeof raw !== 'object') {
          throw new Error(`Required object field '${field}' is not an object but is '${raw}'.`)
        }
        return raw;
      },
      // TODO: possibly validate whether it is actually a string
      // but not sure if there would be things like numbers that
      // in deserialization that we'd want to let through and just
      // cast vs flagging as an error. For now just going with the cast.
      string: String
    }[type];

    return cast(data[field]) as any;
  }
}

/**
 * Helpers for common use cases.
 */
export const requiredObject = required('object');
export const requiredNumber = required('number');
export const requiredString = required('string');