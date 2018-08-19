import React from 'react';
import { Field, FieldArray, reduxForm, getFormValues } from 'redux-form';
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

let AddWineForm = props => (
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
    <Field name="color" label="Färg" component={renderSelect} sublabel="" validate={required} options={['', 'Rött', 'Vitt', 'Rosé', 'Orange', 'Vitt bubbel', 'Rött bubbel']} />
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
    { props.initialValues && props.initialValues.systembolagetartnr && <Field type="text" label="Systembolagets art.nr" validate={numeric} name="systembolagetartnr" component={renderField} placeholder="ex. 123456" /> }
    <Field type="text" label="Pris" onChange={props.priceChange} normalize={addKr} name="price" component={renderField} placeholder="ex. 139kr" />
    <Field name="container" label="Förpackning" component={renderSelect} options={['', 'Helflaska', 'Glas', 'Box', 'Halvflaska', 'Liten box', 'Piccolo', 'Magnum', 'Tetra', 'Stor flaska', 'Annan']} />
    { props.initialValues && props.initialValues.sizeml && <Field type="text" label="Volym" normalize={addMl} name="sizeml" component={renderField} placeholder="" /> }
    <FieldArray name="grapes" component={renderGrapes} props={props} />
    <div className="button-div">
      <button type="submit" disabled={props.submitting}>Lägg till</button>
      <button className="clearForm" type="button" onClick={() => props.resetForm('AddWineForm')} disabled={props.submitting}>Rensa</button>
    </div>
  </form>
);
AddWineForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  priceChange: PropTypes.func.isRequired,
};

const mapStateToProps = state =>
  ({
    autocompleteData: state.addReducer.fieldData,
    focusedField: state.addReducer.focusedField,
    values: getFormValues('AddWineForm')(state),
    initialValues: state.addReducer.initialValue,
  });

const mapDispatchToProps = {
  loadFieldAutocomplete,
  onClearFieldFocus,
  onFieldFocus,
  resetForm,
};

AddWineForm = reduxForm({
  form: 'AddWineForm',
})(AddWineForm);

AddWineForm = connect(
  mapStateToProps,
  mapDispatchToProps,
  )(AddWineForm);

export default AddWineForm;
