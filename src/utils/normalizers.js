export const harmonyNormalizer = {
  scales: {
    key: "scales",
    normalizer: {
      scaleNotes: "notes"
    }
  }
}

export const scoreNormalizer = {
  staves: {
    key: "staves",
    normalizer: {
      bars: {
        key: "bars",
        normalizer: {
          voices: {
            key: "voices",
            normalizer: {
              melody: "melodies",
              rhythm: "rhythms"
            }
          }
        }
      },
    }
  }
}
