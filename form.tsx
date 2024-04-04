import React, { useState } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import Swal from 'sweetalert2'

const NewForm = () => {
  const initialFormData = {
    question1: '',
    question2: '',
    question3: '',
    question4: [],
    question5: '',
    question6: '',
    question7: '',
    question8: [],
    question9: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [validated, setValidated] = useState(false);
  const [showQuestions2to5, setShowOption1Questions] = useState(false)
  const [showQuestions6to9, setShowOption2Questions] = useState(false)

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      let updatedCheckboxes = [...formData[name]]
      if (checked) {
        updatedCheckboxes = [...updatedCheckboxes, value]
      } else {
        updatedCheckboxes = updatedCheckboxes.filter(val => val !== value)
      }
      setFormData(prevState => ({ ...prevState, [name]: updatedCheckboxes }))
    } else {
      setFormData(prevState => ({ ...prevState, [name]: value }))
    }
  }

  const handleSubmit = e => {
    e.preventDefault()

    // Manually validate relevant fields based on the selected option
    if (formData.question1 === 'Option 1') {
      setValidated({
        question2: !!formData.question2,
        question3: !!formData.question3,
        question4: formData.question4.length > 0,
        question5: !!formData.question5,
      })
    } else if (formData.question1 === 'Option 2') {
      setValidated({
        question6: !!formData.question6,
        question7: !!formData.question7,
        question8: formData.question8.length > 0,
        question9: !!formData.question9,
      })
    }

    // Check if all relevant fields are valid
    const isValid = Object.values(validated).every(value => value === true)

    if (isValid) {
      Swal.fire({
        title: 'Success!',
        text: 'Form data submitted successfully',
        icon: 'success',
        confirmButtonText: 'OK',
      })
      axios
        .post('/api/submit-form', formData)
        .then(response => {
          console.log('Form data submitted successfully:', response.data)
          Swal.fire({
            title: 'Success!',
            text: 'Form data submitted successfully',
            icon: 'success',
            confirmButtonText: 'OK',
          })
          // Handle successful submission
        })
        .catch(error => {
          Swal.fire({
            title: 'Error!',
            text: 'Error submitting form data',
            icon: 'error',
            confirmButtonText: 'OK',
          })
          console.error('Error submitting form data:', error)
          // Handle error
        })
    }
  }

  const handleRadioChange = e => {
    const { value } = e.target
    setFormData(prevState => ({ ...prevState, question1: value }))
    setShowOption1Questions(value === 'Option 1')
    setShowOption2Questions(value === 'Option 2')
  }

  const showInvalidFeedback = (fieldName, condition) => {
    return validated && condition ? (
      <div className="invalid-feedback">Invalid input</div>
    ) : null
  }

  const shouldValidate = fieldName => {
    if (formData.question1 === 'Option 1') {
      return ['question2', 'question3', 'question4', 'question5'].includes(
        fieldName,
      )
    } else if (formData.question1 === 'Option 2') {
      return ['question6', 'question7', 'question8', 'question9'].includes(
        fieldName,
      )
    }
    return false
  }

  const handleClearForm = () => {
    setFormData(initialFormData);
    setValidated(false);
  };


  return (
    <div className="container">
      <form
        noValidate
        validated={validated ? 'true' : undefined}
        onSubmit={handleSubmit}
      >
        <div className="row mb-3">
          <div className="col-12">
            <label htmlFor="question1" className="form-label">
              Question 1 (Mandatory)
            </label>
            <div className="form-check">
              <input
                className={`form-check-input ${
                  validated && !formData.question1 ? 'is-invalid' : ''
                }`}
                type="radio"
                name="question1"
                id="option1"
                value="Option 1"
                checked={formData.question1 === 'Option 1'}
                onChange={handleRadioChange}
                required
              />
              <label className="form-check-label" htmlFor="option1">
                Option 1
              </label>
            </div>
            <div className="form-check">
              <input
                className={`form-check-input ${
                  validated && !formData.question1 ? 'is-invalid' : ''
                }`}
                type="radio"
                name="question1"
                id="option2"
                value="Option 2"
                checked={formData.question1 === 'Option 2'}
                onChange={handleRadioChange}
                required
              />
              <label className="form-check-label" htmlFor="option2">
                Option 2
              </label>
            </div>
            {showInvalidFeedback('question1', !formData.question1)}
          </div>
        </div>
        {showQuestions2to5 && (
          <>
            <div className="row mb-3">
              <div className="mb-3">
                <label htmlFor="question2" className="form-label">
                  Question 2 (Mandatory)
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    shouldValidate('question2') &&
                    (!formData.question2 ||
                      !/^[a-zA-Z]+$/.test(formData.question2))
                      ? 'is-invalid'
                      : ''
                  }`}
                  id="question2"
                  name="question2"
                  value={formData.question2}
                  onChange={handleChange}
                  pattern="^[a-zA-Z]+$"
                  required
                />
                {showInvalidFeedback(
                  'question2',
                  shouldValidate('question2') &&
                    (!formData.question2 ||
                      !/^[a-zA-Z]+$/.test(formData.question2)),
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="question3" className="form-label">
                  Question 3 (Mandatory)
                </label>
                <select
                  className={`form-select ${
                    shouldValidate('question3') && !formData.question3
                      ? 'is-invalid'
                      : ''
                  }`}
                  id="question3"
                  name="question3"
                  value={formData.question3}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="Value1">Value 1</option>
                  <option value="Value2">Value 2</option>
                  <option value="Value3">Value 3</option>
                </select>
                {showInvalidFeedback(
                  'question3',
                  shouldValidate('question3') && !formData.question3,
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Question 4 (Mandatory)</label>
                <div
                  className={`${
                    validated && formData.question4.length === 0
                      ? 'is-invalid'
                      : ''
                  }`}
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="v1"
                    name="question4"
                    value="V1"
                    checked={formData.question4.includes('V1')}
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label" htmlFor="v1">
                    V1
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="v2"
                    name="question4"
                    value="V2"
                    checked={formData.question4.includes('V2')}
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label" htmlFor="v2">
                    V2
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="v3"
                    name="question4"
                    value="V3"
                    checked={formData.question4.includes('V3')}
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label" htmlFor="v3">
                    V3
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="v4"
                    name="question4"
                    value="V4"
                    checked={formData.question4.includes('V4')}
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label" htmlFor="v4">
                    V4
                  </label>
                </div>
                {showInvalidFeedback(
                  'question4',
                  formData.question4.length === 0,
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="question5" className="form-label">
                  Question 5 (Mandatory)
                </label>
                <textarea
                  className={`form-control ${
                    validated && !formData.question5 ? 'is-invalid' : ''
                  }`}
                  id="question5"
                  name="question5"
                  rows="3"
                  value={formData.question5}
                  onChange={handleChange}
                  required
                ></textarea>
                {showInvalidFeedback('question5', !formData.question5)}
              </div>
            </div>
          </>
        )}

        {showQuestions6to9 && (
          <>
            <div className="mb-3">
              <label htmlFor="question6" className="form-label">
                Question 6 (Mandatory)
              </label>
              <input
                type="text"
                className={`form-control ${
                  validated &&
                  (!formData.question6 ||
                    !/^[a-zA-Z]+$/.test(formData.question6))
                    ? 'is-invalid'
                    : ''
                }`}
                id="question6"
                name="question6"
                value={formData.question6}
                onChange={handleChange}
                pattern="^[a-zA-Z]+$"
                required
              />
              {showInvalidFeedback(
                'question6',
                !formData.question6 || !/^[a-zA-Z]+$/.test(formData.question6),
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="question7" className="form-label">
                Question 7 (Mandatory)
              </label>
              <select
                className={`form-select ${
                  validated && !formData.question7 ? 'is-invalid' : ''
                }`}
                id="question7"
                name="question7"
                value={formData.question7}
                onChange={handleChange}
                required
              >
                <option value="">Select an option</option>
                <option value="Value8">Value 8</option>
                <option value="Value9">Value 9</option>
                <option value="Value10">Value 10</option>
              </select>
              {showInvalidFeedback('question7', !formData.question7)}
            </div>

            <div className="mb-3">
              <label className="form-label">Question 8 (Mandatory)</label>
              <div
                className={`${
                  validated && formData.question8.length === 0
                    ? 'is-invalid'
                    : ''
                }`}
              >
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="v7"
                  name="question8"
                  value="V7"
                  checked={formData.question8.includes('V7')}
                  onChange={handleChange}
                  required
                />
                <label className="form-check-label" htmlFor="v7">
                  V7
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="v8"
                  name="question8"
                  value="V8"
                  checked={formData.question8.includes('V8')}
                  onChange={handleChange}
                  required
                />
                <label className="form-check-label" htmlFor="v8">
                  V8
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="v9"
                  name="question8"
                  value="V9"
                  checked={formData.question8.includes('V9')}
                  onChange={handleChange}
                  required
                />
                <label className="form-check-label" htmlFor="v9">
                  V9
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="v10"
                  name="question8"
                  value="V10"
                  checked={formData.question8.includes('V10')}
                  onChange={handleChange}
                  required
                />
                <label className="form-check-label" htmlFor="v10">
                  V10
                </label>
              </div>
              {showInvalidFeedback(
                'question8',
                formData.question8.length === 0,
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="question9" className="form-label">
                Question 9 (Mandatory)
              </label>
              <textarea
                className={`form-control ${
                  validated && !formData.question9 ? 'is-invalid' : ''
                }`}
                id="question9"
                name="question9"
                rows="3"
                value={formData.question9}
                onChange={handleChange}
                required
              ></textarea>
              {showInvalidFeedback('question9', !formData.question9)}
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-secondary mx-2"
          onClick={handleClearForm}
        >
          Clear
        </button>
      </form>
    </div>
  )
}

export default NewForm
