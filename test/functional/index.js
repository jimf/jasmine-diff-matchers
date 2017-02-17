const spawn = require('cross-spawn')
const test = require('tape')

test('jasmine diff matchers failure output', t => {
  const result = spawn.sync('karma', [
    'start',
    'test/functional/karma.conf.js'
  ]).stdout.toString().replace(/\t/g, '        ').replace(/^\s+$/gm, '')

  t.ok(result.includes('(4 FAILED)'), 'covers expected number of failure cases')

  const numDiffs = result
    .split('\n')
    .filter(line => line.includes('+ expected'))
    .length
  t.equal(numDiffs, 2, 'selectively displays diff output based on actual/expected values')

  t.ok(result.includes(`
        Expected [ 1, 2, 3, 4 ] to equal [ 1, 2, 3 ].

        + expected
        - actual

        -  3
        +  3,
        +  4
  `.trim()), 'displays diff output for arrays')

  t.ok(result.includes(`
        Expected Object({ foo: 'foo', baz: 'baz' }) to equal Object({ foo: 'foo', bar: 'bar' }).

        + expected
        - actual

        -  "bar": "bar",
        +  "baz": "baz",
  `.trim()), 'displays diff output for objects')

  t.end()
})
