export const harmonyNormalizer = {
  scales: {
    key: "scales",
    normalizer: {
      scaleNotes: "notes"
    }
  }
}

export const scoreNormalizer = {
  scoreStaves: {
    key: "staves",
    normalizer: {
      staffBars: {
        key: "bars",
        normalizer: {
          barVoices: {
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
