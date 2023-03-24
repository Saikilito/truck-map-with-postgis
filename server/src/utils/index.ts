const snakeToCamelCase = (str: string) =>
  str.toLowerCase().replace(/([_][a-z])/g, (group) => group.toUpperCase().replace('_', ''))

export const parseObjKeysToCamelCase = (obj: Record<string, string>) =>
  Object.keys(obj).reduce((acc, current) => {
    const parsed = snakeToCamelCase(current)

    return {
      ...acc,
      [parsed]: obj[current]
    }
  }, {})
