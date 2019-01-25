# @tsutil/lenses [![Build Status](https://travis-ci.com/emeraldwalk/tsutil-lenses.svg?branch=master)](https://travis-ci.com/emeraldwalk/tsutil-lenses)
TypeScript data lenses for extracting and validating data.

## Overview
This package provides a `get` function that can run 1-n lense functions against a given data object and return a promise to an array of values containing the result of each lense.

```typescript
const [a, b, c] = await get(
  lenseA,
  lenseB,
  lenseC,
  data
);
```

Each lense is a function that takes will receive the data object passed to `get` and return either a value or a `Promise` to a value. 

> NOTE: The implementation details of each `lense` is really up to the provider. They might throw exceptions, set defaults, etc. It is really up to the caller of `get` to be familiar with the particular lenses that are used. There are also a few lense implementations provided with this library.

## Installation
```bash
npm install --save @tsutil/lenses
```

## Usage

Lenses are functions that take a data object and return either a value or a `Promise` to a value.

```typescript
type Lense<V> = (data: any) => V | Promise<V>;
```

Here's an example using the `required` lense factory provided with this lib:

```typescript
// setup 2 lense factories for required fields
const string = required('string');
const number = required('number');

// create our actual lense functions
const nameLense = string('name');
const ageLense = number('age');

const validData = {
  name: 'jane doe',
  age: 23
};

// extract data from our fields
const [name, age]: [string, number] = await get(
  nameLense,
  ageLense,
  validData
);
```

Each lense will enforce the corresponding required field, so the following will throw an exception:
```typescript
const invalidData = {
  name: 'jane doe'
};

await get(
  nameLense,
  ageLense, // this will throw an exception since no age field exists
  invalidData
)
```

Lenses can also return promises, and they will be resolved into the result of `get`.

```typescript
// 2 lenses returning promises to propery values
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
```