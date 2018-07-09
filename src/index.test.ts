import { resolve } from './index'
import { expect } from 'chai'

let result: any = {}
describe('when a value is normal', () => {
  beforeEach(() => {
    result = resolve({
      foo: 'bar',
      nestedFoo: {
        nestedBar: 'bar'
      }
    })
  })

  it('does not touch the value', () => {
    expect(result.foo).to.equal('bar')
  })
  it('does not touch a nested value', () => {
    expect(result.nestedFoo.nestedBar).to.equal('bar')
  })
})

describe('when a value references another value', () => {
  beforeEach(() => {
    result = resolve({
      foo: 'bar',
      two: '$.foo',
      moo: 3,
      nestedFoo: {
        nestedBar: 'par',
        nestedTwo: '$.nestedFoo.nestedBar',
        nestedMoo: '$.moo'
      }
    })
  })

  it('maps the value properly', () => {
    expect(result.two).to.equal('bar')
  })
  it('maps the nested value properly', () => {
    expect(result.nestedFoo.nestedTwo).to.equal('par')
  })
  it('maps a nested integer value properly', () => {
    expect(result.nestedFoo.nestedMoo).to.equal(3)
  })
})

describe('when a value references another reference', () => {
  beforeEach(() => {
    result = resolve({
      foo: 'bar',
      two: '$.foo',
      three: '$.two',
      nestedFoo: {
        nestedBar: 'par',
        nestedTwo: '$.nestedFoo.nestedBar',
        nestedThree: '$.nestedFoo.nestedTwo'
      }
    })
  })

  it('maps the value properly', () => {
    expect(result.three).to.equal('bar')
  })
  it('maps the nested value properly', () => {
    expect(result.nestedFoo.nestedThree).to.equal('par')
  })
})

describe('when arrays are involved', () => {
  beforeEach(() => {
    result = resolve({
      foo: 'bar',
      two: 'par',
      three: '$.arrayItem.2',
      five: '$.arrayItem.1.four',
      arrayItem: [
        '$.foo',
        {
          objectReference: '$.two',
          four: 'lar',
          five: 'dar'
        },
        'boo'
      ],
      nestedObject: {
        nestedValue: '$.arrayItem.1.five'
      }
    })
  })

  it('maps an array value properly', () => {
    expect(result.arrayItem[0]).to.equal('bar')
  })
  it('maps an object value inside an array properly', () => {
    expect(result.arrayItem[1].objectReference).to.equal('par')
  })
  it('maps a value referencing an array item properly', () => {
    expect(result.three).to.equal('boo')
  })
  it('maps a value referencing an object inside an array properly', () => {
    expect(result.five).to.equal('lar')
  })
  it('maps the nested value properly', () => {
    expect(result.nestedObject.nestedValue).to.equal('dar')
  })
})

describe('when a two values reference each other (circular reference)', () => {
  it('throws an error detailing which values reference each other', () => {
    expect(() => resolve({
      foo: '$.boo',
      boo: '$.foo'
    })).to.throw('Cannot resolve object. $.foo > $.boo are circularly referenced to $.foo.')
  })
  it('detects complex circular references', () => {
    expect(() => resolve({
      foo: '$.boo',
      boo: '$.doo',
      moo: '$.foo',
      doo: '$.moo'
    })).to.throw('Cannot resolve object. $.foo > $.boo > $.doo > $.moo are circularly referenced to $.foo.')
  })
  it('detects values referencing themselves', () => {
    expect(() => resolve({
      foo: '$.foo'
    })).to.throw('Cannot resolve object. $.foo are circularly referenced to $.foo.')
  })
})

describe('when a value references something that does not exist', () => {
  beforeEach(() => {
    result = resolve({
      foo: 'doo',
      loo: '$.notHere'
    })
  })

  it('returns a null value properly', () => {
    expect(result.foo).to.equal('doo')
    expect(result.loo).to.equal(null)
  })
})
