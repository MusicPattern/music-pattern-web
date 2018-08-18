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
          staffVoices: {
            key: "staffVoices",
            normalizer: {
              voice: {
                key: "voices",
                normalizer: {
                  voicePatterns: {
                    key: "voicePatterns",
                    normalizer: {
                      pattern: {
                        key: "patterns",
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
          }
        }
      }
    }
  }
}
