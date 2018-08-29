import get from 'lodash.get'
import { Field, Form } from 'pass-culture-shared'
import React from 'react'
import { connect } from 'react-redux'

import melodySelector from '../../selectors/melody'
import patternPatchSelector from '../../selectors/patternPatch'
import rhythmSelector from '../../selectors/rhythm'

const PatternForm = ({
  patternPatch
}) => {
  return (
    <Form
      action="/pattern"
      name="pattern"
      patch={patternPatch}>
      <Field
        isExpanded
        label="intervals"
        name="intervals"
        required
      />
      <Field
        isExpanded
        label="durations"
        name="durations"
        required
      />
    </Form>
  )
}

export default connect(
  (state, ownProps) => {
    const pattern = get(ownProps, 'pattern')
    const melodyId = get(ownProps, 'pattern.melodyId')
    const rhythmId = get(ownProps, 'pattern.rhythmId')
    const melody = melodySelector(state, null, melodyId)
    const rhythm = rhythmSelector(state, null, rhythmId)
    return {
      patternPatch: patternPatchSelector(state, pattern, melody, rhythm)
    }
  }
)(PatternForm)
