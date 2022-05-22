import Timeline from '../Timeline';

const timeline = new Timeline();

test.each([
  ['51.50851, -0.12572', true],
  ['51.50851,-0.12572', true],
  ['[51.50851,-0.12572]', true],
  ['[51.50,-0.12572]', false],
  ['51.508,-0.12572', false],
  ['151.508,-0.12572', false],
  ['11,50678,-0.12572', false],
  ['11,-0.12572', false],
])('testing checkValidity method with param %s', (coordinates, result) => {
  expect(timeline.checkValidity(coordinates)).toBe(result);
});
