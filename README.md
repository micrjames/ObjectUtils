# ObjectUtils
A utility library for advanced object manipulation in TypeScript, providing methods for property management and transformation.

## Table Of Contents
- [General Info](#general-info)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Setup](#setup)
- [Usage](#usage)
- [Project Status](#project-status)
- [Room for Improvement](#room-for-improvement)
- [Contact](#contact)

## General Info
The ObjectUtils library is a customizable utility for manipulating JavaScript objects in TypeScript. It provides a variety of methods for managing object properties, including the ability to remove properties dynamically.

## Technologies Used
- **TypeScript**: A superset of JavaScript that adds static types.
- **JavaScript**: The programming language used for object manipulation.

## Features
- Remove properties from objects with type safety.
- Static methods for easy access without instantiation.
- TypeScript generics for enhanced flexibility and type checking.
- Additional utility methods for object manipulation (to be added in future versions).

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/object-utils.git
   cd object-utils
   ```

2. Install the required dependencies (if any):
   ```bash
   npm install
   ```

3. Ensure you have Node.js and TypeScript installed. If not, you can install them using:
   ```bash
   npm install -g typescript
   ```

## Usage
1. Import the ObjectUtils class in your TypeScript application:
   ```typescript
   import { ObjectUtils } from './path/to/ObjectUtils';

   const myObject = { a: 1, b: 2, c: 3 };

   // Remove a property from the object
   const updatedObject = ObjectUtils.removeProperty(myObject, 'b');
   console.log(updatedObject); // Output: { a: 1, c: 3 }
   ```

2. Example of removing a property with type safety:
   ```typescript
   interface MyObject {
       a: number;
       b: number;
       c: number;
   }

   const myObject: MyObject = { a: 1, b: 2, c: 3 };

   // Remove property 'b'
   const updatedObject = ObjectUtils.removeProperty(myObject, 'b');
   console.log(updatedObject); // Output: { a: 1, c: 3 }
   ```

## Project Status
The project is currently in development and is actively maintained. Contributions are welcome!

## Room for Improvement
- Expand the library with additional utility methods for object manipulation (e.g., merging, cloning, filtering).
- Implement comprehensive unit tests to ensure method reliability.
- Enhance documentation with examples for all utility methods.
- Create a configuration file for easier setup and customization.

## Contact
For any inquiries or contributions, please contact:
- **Michael James**: [micrjamesjr@gmail.com](mailto:micrjamesjr@gmail.com)
- **GitHub**: [micrjams](https://github.com/micrjams)
