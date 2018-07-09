import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
import isString from 'lodash/isString'
import get from 'lodash/get'

interface FlexibleObject {
  [key: string]: any
}

type resolveObject = (parentObj: FlexibleObject, obj: FlexibleObject, parentKeys?: Array<string>) => FlexibleObject

const resolveValue = (obj: any, value: any, parentKeys: Array<string> = []): any => {
  if (isString(value) && value.startsWith('$.')) {
    const loopSearchPath: string = `$.${parentKeys.join('.')}`
    const searchPath: string = value
    let keyHistory: Array<string> = [searchPath]
    let currentSearchPath: string = searchPath
    while (isString(currentSearchPath) && currentSearchPath.startsWith('$.') && currentSearchPath !== loopSearchPath) {
      currentSearchPath = get(obj, currentSearchPath.replace('$.', ''), null)
      keyHistory.push(currentSearchPath)
    }
    if (currentSearchPath === loopSearchPath) {
      keyHistory.unshift(keyHistory[keyHistory.length - 1])
      keyHistory.pop()
      throw new Error(`Cannot resolve object. ${keyHistory.join(' > ')} are circularly referenced to ${loopSearchPath}.`)
    }
    return currentSearchPath
  } else return value
}

const resolveArray = (obj: object, arr: Array<any>, parentKeys: Array<string> = []): Array<any> => {
  return arr.map((item: any, index: number): any => {
    if (isObject(item)) {
      return resolveObject(obj, item, [...parentKeys, index.toString()])
    } else if (isArray(item)) {
      return resolveArray(obj, item, [...parentKeys, index.toString()])
    } else {
      return resolveValue(obj, item, [...parentKeys, index.toString()])
    }
  })
}

const resolveObject: resolveObject = (parentObj, obj, parentKeys = []) => {
  return Object.keys(obj).reduce((result: FlexibleObject, key: string): object => {
    const value = obj[key]
    if (isObject(value)) {
      result[key] = resolveObject(parentObj, value, [...parentKeys, key])
    } else if (isArray(value)) {
      result[key] = resolveArray(parentObj, value, [...parentKeys, key])
    } else {
      result[key] = resolveValue(parentObj, value, [...parentKeys, key])
    }
    return result
  }, {})
}

export const resolve = (obj: object): object => {
  return resolveObject(obj, obj)
}

export default resolve
