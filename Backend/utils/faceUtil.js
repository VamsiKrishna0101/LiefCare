function descriptorDistance(arr1, arr2) {
  if (!arr1 || !arr2 || arr1.length !== arr2.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < arr1.length; i++) {
    const diff = arr1[i] - arr2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

function isMatch(descriptorA, descriptorB, threshold = 0.6) {
  const dist = descriptorDistance(descriptorA, descriptorB);
  return { match: dist <= threshold, distance: dist };
}

export { isMatch };
