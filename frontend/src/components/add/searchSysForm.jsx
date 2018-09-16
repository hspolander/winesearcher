import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

import './add.scss';
import '../../../css/_util.scss';

import {
  numeric,
  maxValueCurrentYear,
} from './addFormValidation';

import addKr from './addFormNormalize';

const renderField = ({ input, label, type, placeholder, meta: { touched, error } }) => (
  <div className="input-div">
    <span className="input-label noSelect">{ label }</span>
    <input {...input} type={type} placeholder={placeholder} autoComplete="off" list="dataList" />
    {touched && error && <span className="form-error">{error}</span>}
  </div>
);
renderField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  meta: PropTypes.object.isRequired,
};

const renderSelect = ({ input, label, sublabel, options, meta: { touched, error } }) => (
  <div className="input-div">
    <span className="input-label noSelect">{ label }</span>
    <select {...input}>
      {options.map(option => (
        <option value={option} key={option}>{option}{sublabel}</option>
      ))}
    </select>
    {touched && error && <span className="form-error">{error}</span>}
  </div>
);
renderSelect.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  sublabel: PropTypes.string,
  meta: PropTypes.object,
};

const SearchSysform = props => (
  <form onSubmit={props.handleSubmit}>
    <Field type="text" label="Namn" name="name" component={renderField} placeholder="ex. Baron de ley" />
    <Field name="color" label="Färg" component={renderSelect} sublabel="" options={['', 'Rött', 'Vitt', 'Rosé', 'Mousserande vin']} />
    <Field type="text" label="År" name="year" component={renderField} validate={[maxValueCurrentYear, numeric]} placeholder="ex. 2012" />
    <Field type="text" label="Systembolaget Artnr" normalize={addKr} name="systembolagetartnr" component={renderField} placeholder="" />
    <Field type="text" label="Pris" normalize={addKr} name="price" component={renderField} placeholder="ex. 139kr" />
    <div className="button-div">
      <button type="submit" disabled={props.pristine || props.submitting}>Sök</button>
    </div>
  </form>
);
SearchSysform.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'sysSearchForm',
})(SearchSysform);
