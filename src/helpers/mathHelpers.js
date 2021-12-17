export const isNonNegativeFloat = (value) => {
    var floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
    if (!floatRegex.test(value)) {
      return false;
    }
  
    const floatValue = parseFloat(value);
    if (isNaN(floatValue)) {
      return false;
    }
    if (floatValue < 0) {
      return false;
    }
    return true;
  };

  export function isPositiveFloat(s) {
    return !isNaN(s) && Number(s) > 0;
  }