export function levenshteinDistance(left: string, right: string): number {
  if (left === right) return 0;
  if (!left) return right.length;
  if (!right) return left.length;

  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  const current = Array.from({ length: right.length + 1 }, () => 0);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    current[0] = leftIndex;

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;

      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + substitutionCost,
      );
    }

    for (let index = 0; index <= right.length; index += 1) previous[index] = current[index];
  }

  return previous[right.length];
}

export function isSmallSpellingMistake(queryToken: string, candidateToken: string, maxEditDistance = 1): boolean {
  if (queryToken.length < 4 || candidateToken.length < 4) return false;
  if (Math.abs(queryToken.length - candidateToken.length) > maxEditDistance) return false;

  return levenshteinDistance(queryToken, candidateToken) <= maxEditDistance;
}

export function isPartialWordMatch(queryToken: string, candidateToken: string): boolean {
  if (queryToken.length < 3 || candidateToken.length < 3) return false;
  return candidateToken.includes(queryToken) || queryToken.includes(candidateToken);
}

export function isPrefixMatch(queryToken: string, candidateToken: string): boolean {
  if (queryToken.length < 2) return false;
  return candidateToken.startsWith(queryToken);
}

export function isSuffixMatch(queryToken: string, candidateToken: string): boolean {
  if (queryToken.length < 3) return false;
  return candidateToken.endsWith(queryToken);
}
