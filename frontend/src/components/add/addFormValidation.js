const minLength = min => value => value && value.length < min ? `Minst ${min} tecken` : undefined;
const maxValue = max => value => value && value > max ? 'För högt årtal' : undefined;
const minValue = min => value => value && value < min ? 'För lågt årtal' : undefined;
const getCurrentYear = () => (new Date()).getFullYear();

export const numeric = value => value && isNaN(Number(value)) ? 'Endast siffor' : undefined;
export const required = value => (value ? undefined : 'Måste fyllas i');
export const minValue1950 = minValue(1950);
export const maxValueCurrentYear = maxValue(getCurrentYear());
export const minLength15 = minLength(15);
