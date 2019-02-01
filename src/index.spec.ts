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
    const birthDayStr = '2018-01-01T00:00:00.000Z';

    const data = {
      name: 'john doe',
      age: 23,
      birthDayStr,
      birthDay: new Date(birthDayStr),
      meta: {}
    };

    const string = required('string')('name')(data);
    const number = required('number')('age')(data);
    const meta = required('object')('meta')(data);
    const dateFromStr = required('date')('birthDayStr')(data);
    const dateFromDt = required('date')('birthDay')(data);

    expect(typeof string).toEqual('string');
    expect(string).toEqual(data.name);
    expect(typeof number).toEqual('number');
    expect(number).toEqual(data.age);
    expect(typeof meta).toEqual('object');
    expect(dateFromStr.toISOString()).toEqual(birthDayStr);
    expect(dateFromDt.toISOString()).toEqual(birthDayStr);
    expect(meta).toEqual({});
  });

  it('should throw an exception if missing field.', () => {
    const data = {
    };

    expect(() =>
      required('string')('name')(data)
    ).toThrow("Required field 'name' is missing.");
  });

  it('should throw an error if date type with not a date or string', () => {
    const data = {
      dt: 999
    };

    expect(() => {
      required('date')('dt')(data);
    }).toThrow("Required date field 'dt' is not a date string but is '999'.");
  });

  it('should throw an error if date type non-date string', () => {
    const data = {
      dt: 'not a date'
    };

    expect(() => {
      required('date')('dt')(data);
    }).toThrow("Required date field 'dt' is not a date string but is 'not a date'.");
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