import { Callback } from '../src/index'

const data: number[] = []
const cleanupData: number[] = []

const callback1 = (arg: number) => {
  data.push(2 * arg, 3 * arg)
  return () => {
    cleanupData.push(data.pop())
  }
}
const callback2 = (arg: number) => {
  data.push(7 * arg, 8 * arg)
  return () => {
    cleanupData.push(data.pop())
  }
}
const callback = new Callback().add(callback1).add(callback2)

let cleanup: any
test('Test correctness of callbacks execution', () => {
  cleanup = callback(5)
  expect(data).toEqual([10, 15, 35, 40])

  cleanup()
  expect(data).toEqual([10, 15])
  expect(cleanupData).toEqual([40, 35])
})

test('Test if cleanup only execute once', () => {
  cleanup()
  expect(data).toEqual([10, 15])
  expect(cleanupData).toEqual([40, 35])
})

test('Test removal of function from the callbacks', () => {
  callback.remove(callback2)
  callback(4)()
  expect(data).toEqual([10, 15, 8])
})
