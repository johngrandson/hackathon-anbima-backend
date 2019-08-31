export const checkRangeOverlap = (ranges: any) => {
  let err = false;
  ranges.forEach(function (a: any, ia: any) {
    ranges.forEach(function (b: any, ib: any) {
      if (a !== b) {
        if (a.min <= b.max && a.max >= b.min) {
          err = true;
        }
      }
    });
  });
  return err;
};
