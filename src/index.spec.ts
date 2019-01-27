import { get, required } from '.';

describe('get', () => {
  it('should return expected field values', async () => {
    const string = required('string');
    const number = required('number');

    const data = {
      name: 'john doe',
      age: 23
    };

    const [name, age]: [string, number] = await get(
      string('name'),
      number('age'),
      data
    );

    expect(name).toBe(data.name);
    expect(age).toBe(data.age);
  });

  it('should return expected field promise values', async () => {
    const getName = (data: any) => Promise.resolve(data['name']);
    const getAge = (data: any) => Promise.resolve(data['age']);

    const data = {
      name: 'john doe',
      age: 23
    };

    const [name, age]: [string, number] = await get(
      getName,
      getAge,
      data
    );

    expect(name).toBe(data.name);
    expect(age).toBe(data.age);
  });
});

describe('required', () => {
  it('should return field value with given type.', () => {
    const data = {
      name: 'john doe',
      age: 23,
      meta: {}
    };

    const string = required('string')('name')(data);
    const number = required('number')('age')(data);
    const meta = required('object')('meta')(data);

    expect(typeof string).toEqual('string');
    expect(string).toEqual(data.name);
    expect(typeof number).toEqual('number');
    expect(number).toEqual(data.age);
    expect(typeof meta).toEqual('object');
    expect(meta).toEqual({});
  });

  it('should throw an exception if missing field.', () => {
    const data = {
    };

    expect(() =>
      required('string')('name')(data)
    ).toThrow("Required field 'name' is missing.");
  });

  it('should throw an exception if number type with non-number value.', () => {
    const data = {
      age: 'xxxx'
    };

    expect(() =>
      required('number')('age')(data)
    ).toThrow("Required number field 'age' is not a number but is 'xxxx'.");
  });

  it('should throw an exception if object type with non-object value.', () => {
    const data = {
      meta: 'not an object'
    };

    expect(() => {
      required('object')('meta')(data)
    }).toThrow("Required object field 'meta' is not an object but is 'not an object'.");
  });
});