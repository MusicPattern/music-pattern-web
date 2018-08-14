export const harmonyNormalizer = {
  scales: {
    key: "scales",
    normalizer: {
      scaleNotes: "notes"
    }
  }
}

export const scoreNormalizer = {
  scoreInstruments: {
    key: "scoreInstruments",
    normalizer: {
      instrument: {
        key: "instruments",
        normalizer: {
          sounds: {
            key: "sounds",
            normalizer: {
              pitch: "pitches",
              sample: "samples"
            }
          }
        }
      }
    }
  },
  scoreStaves: {
    key: "scoreStaves",
    normalizer: {
      staff: {
        key: "staves",
        normalizer: {
          staffBars: {
            key: "staffBars",
            normalizer: {
              bar: {
                key: "bars",
                normalizer: {
                  barVoices: {
                    key: "barVoices",
                    normalizer: {
                      voice: {
                        key: "voices",
                        normalizer: {
                          melody: "melodies",
                          rhythm: "rhythms"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
        }
      }
    }
  }
}
