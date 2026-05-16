/**
 * Checks if at least two chemicals have a quantity greater than zero.
 *
 * @param {number[]} chemicals - An array of chemical quantities.
 * @returns {boolean} True if at least two chemicals are present, false otherwise.
 */
export function hasSufficientReactants(chemicals) {
  return chemicals.filter(amount => amount > 0).length >= 2;
}
