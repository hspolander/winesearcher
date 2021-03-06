import React from 'react';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadFieldAutocomplete, onClearFieldFocus, onFieldFocus, resetForm } from './actions';

import '../../../css/_util.scss';

import {
  numeric,
  required,
  minValue1950,
  maxValueCurrentYear,
} from './addFormValidation';

import { addKr, addMl } from './addFormNormalize';

const renderField = ({ input, autocompleteData, focusedField, label, type, placeholder, meta: { touched, error, active } }) => (
  <div className="input-div">
    <span className="input-label noSelect">{ label }</span>
    <input {...input} type={type} placeholder={placeholder} autoComplete="off" list="dataList" />
    {touched && error && <span className="form-error">{error}</span>}
    { active && autocompleteData &&
      <datalist id="dataList">
        {Object.values(autocompleteData[focusedField]).map(value => (
          <option key={value} value={value} />
        ))}
      </datalist>}
  </div>
);
renderField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  meta: PropTypes.object.isRequired,
  autocompleteData: PropTypes.object,
  focusedField: PropTypes.string,
};

const renderRange = ({ input, value, focusedField, label, type, placeholder, meta: { touched, error, active } }) => (
  <div className="input-div">
    <span className="input-label noSelect">{ label }</span>
    <input {...input} type="range" min="1" max= "10" placeholder={placeholder} autoComplete="off" list="dataList" />
    {touched && error && <span className="form-error">{error}</span>}
  </div>
);
renderField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  meta: PropTypes.object.isRequired,
  autocompleteData: PropTypes.object,
  focusedField: PropTypes.string,
};

const dataList = ({ autocompleteData, focusedField }) => (
  <datalist id="dataList">
    {Object.values(autocompleteData[focusedField]).map(value => (
      <option key={value} value={value} />
    ))}
  </datalist>
);
dataList.propTypes = {
  autocompleteData: PropTypes.object,
  focusedField: PropTypes.string,
};

const renderSelect = ({ input, label, options, meta: { touched, error } }) => (
  <div className="input-div">
    <span className="input-label noSelect">{ label }</span>
    <select {...input}>
      {options.map(option => (
        <option value={option} key={option}>{option}</option>
      ))}
    </select>
    {touched && error && <span className="form-error">{error}</span>}
  </div>
);
renderSelect.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  meta: PropTypes.object,
};

let renderGrapes = ({ autocompleteData, focusedField, fields, loadFieldAutocomplete, onClearFieldFocus, onFieldFocus }) => (
  <div className="grape-div">
    <div className="input-div">
      <div className="input-div">
        <span className="input-label noSelect">Lägg till druvor
          <i onClick={() => fields.pop()} className="fa fa-lg fa-minus-square" aria-hidden="true" />
          <i onClick={() => fields.push()} className="fa fa-lg fa-plus-square" aria-hidden="true" />
        </span>
      </div>
    </div>
    {fields.map((grape, index) => (
      <div className="input-div" key={index}>
        <Field
          name={grape}
          autoComplete="off"
          autocompleteData={autocompleteData}
          validate={required}
          type="text"
          placeholder="ex. Chardonnay"
          focusedField={focusedField}
          component={renderField}
          label=""
          onChange={(e) => { loadFieldAutocomplete('grape', e.target.value); }}
          onBlur={() => { onClearFieldFocus(); }}
          onFocus={() => { onFieldFocus('grape'); }}
        />
      </div>
    ))}
  </div>
);
renderGrapes.propTypes = {
  fields: PropTypes.object.isRequired,
  autocompleteData: PropTypes.object,
  focusedField: PropTypes.string,
  loadFieldAutocomplete: PropTypes.func,
  onClearFieldFocus: PropTypes.func,
  onFieldFocus: PropTypes.func,
};

let AddReviewForm = props => (
  <form onSubmit={props.handleSubmit}>
    <Field
      {...props}
      type="text"
      autoComplete="off"
      label="Namn"
      name="name"
      component={renderField}
      validate={required}
      placeholder="ex. Bolla Le Poiane"
      onChange={(e) => { props.loadFieldAutocomplete('name', e.target.value); }}
      onBlur={() => { props.onClearFieldFocus(); }}
      onFocus={() => { props.onFieldFocus('name'); }}
    />
    <Field
      {...props}
      type="text"
      autoComplete="off"
      label="Producent"
      name="producer"
      component={renderField}
      placeholder="ex. Barolo"
      onChange={(e) => { props.loadFieldAutocomplete('producer', e.target.value); }}
      onBlur={() => { props.onClearFieldFocus(); }}
      onFocus={() => { props.onFieldFocus('producer'); }}
    />
    <Field name="color" label="Färg" component={renderSelect} validate={required} options={['', 'Rött', 'Vitt', 'Rosé', 'Orange', 'Vitt bubbel', 'Rött bubbel']} />
    <Field type="text" label="År" name="year" component={renderField} validate={[maxValueCurrentYear, minValue1950, numeric]} placeholder="ex. 2012" />
    <Field
      type="text"
      autoComplete="off"
      {...props}
      label="Land"
      name="country"
      component={renderField}
      placeholder="ex. Italien"
      onChange={(e) => { props.loadFieldAutocomplete('country', e.target.value); }}
      onBlur={() => { props.onClearFieldFocus(); }}
      onFocus={() => { props.onFieldFocus('country'); }}
    />
    <Field
      {...props}
      type="text"
      autoComplete="off"
      label="Inköpsplats"
      name="boughtFrom"
      component={renderField}
      placeholder="ex. Systembolaget"
      onChange={(e) => { props.loadFieldAutocomplete('boughtFrom', e.target.value); }}
      onBlur={() => { props.onClearFieldFocus(); }}
      onFocus={() => { props.onFieldFocus('boughtFrom'); }}
    />
    { props.initialValues && props.initialValues.nr && <Field type="text" label="Systembolagets art.nr" validate={numeric} name="nr" component={renderField} placeholder="ex. 139kr" /> }
    <Field type="text" label="Pris" normalize={addKr} name="price" component={renderField} placeholder="ex. 139kr" />
    <Field name="container" label="Förpackning" component={renderSelect} options={['', 'Helflaska', 'Glas', 'Box', 'Halvflaska', 'Liten box', 'Piccolo', 'Magnum', 'Tetra', 'Stor flaska', 'Annan']} />
    { props.initialValues && props.initialValues.sizeml && <Field type="text" label="Volym" normalize={addMl} name="sizeml" component={renderField} placeholder="" /> }
    <Field
      {...props}
      type="text"
      autoComplete="off"
      label={props.score ? `Betyg: ${props.score}` : 'Sätt betyg'}
      name="score"
      component={renderRange}
      min="0"
      max="10"
      step="1"
      validate={required}
    />
    <FieldArray name="grapes" component={renderGrapes} props={props} />
    <div className="input-div block">
      <span className="input-label noSelect">Kommentarer</span>
      <Field name="comment" validate={required} component="textarea" />
    </div>
    <div className="button-div">
      <button type="submit" disabled={props.pristine || props.submitting}>Lägg till</button>
      <button className="clearForm" type="button" onClick={() => props.resetForm('WineReview')} disabled={props.submitting}>Rensa</button>
    </div>
  </form>
);
AddReviewForm.propTypes = {
  resetForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const selector = formValueSelector('WineReview');
const mapStateToProps = state =>
  ({
    autocompleteData: state.addReducer.fieldData,
    focusedField: state.addReducer.focusedField,
    score: selector(state, 'score'),
    initialValues: state.addReducer.initialValue,
  });

const mapDispatchToProps = {
  loadFieldAutocomplete,
  onClearFieldFocus,
  onFieldFocus,
  resetForm,
};

AddReviewForm = reduxForm({
  form: 'WineReview',
})(AddReviewForm);

AddReviewForm = connect(
  mapStateToProps,
  mapDispatchToProps,
  )(AddReviewForm);

export default AddReviewForm;
