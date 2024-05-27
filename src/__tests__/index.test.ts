import * as RNTC from '../index';

it('sanity check for exported methods', () => {
  expect(RNTC).toMatchSnapshot();
});
