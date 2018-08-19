import React from 'react';
import { Field, reduxForm } from 'redux-form';

const renderField = ({ input, label, type, placeholder, meta: { touched, error } }) => (
  <div className="input-div">
    <span className="input-label noSelect">{ label }</span>
    <input {...input} type={type} placeholder={placeholder} />
    {touched && error && <span>{error}</span>}
  </div>
);

const LoginForm = (props) => {
  const { handleSubmit, pristine, submitting } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Field type="text" label="Användarnamn" name="username" component={renderField} placeholder="Användarnamn" />
      <Field type="password" label="Lösenord" name="password" component={renderField} placeholder="......." />
      <div className="button-div">
        <button type="submit" disabled={pristine || submitting}>Logga in</button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'LoginForm',
})(LoginForm);
