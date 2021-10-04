const
  fs = require('fs'),
  handlebars = require('handlebars'),
  handlebarsWax = require('handlebars-wax'),
  addressFormat = require('address-format'),
  moment = require('moment'),
  Swag = require('swag');

Swag.registerHelpers(handlebars);

const isTechnology = (keywords) => keywords.some(keyword =>  keyword.toLowerCase() === "technologies");
const isSkill = (keywords) => !isTechnology(keywords);
const isCertification = (education) => education.studyType.toLowerCase() === "certification";
const isEducation = (education) => !isCertification(education); 

handlebars.registerHelper({
  removeProtocol: function (url) {
    return url.replace(/.*?:\/\//g, '');
  },

  concat: function () {
    let res = '';

    for (let arg in arguments) {
      if (typeof arguments[arg] !== 'object') {
        res += arguments[arg];
      }
    }

    return res;
  },

  formatAddress: function (address, city, region, postalCode, countryCode) {
    let addressList = addressFormat({
      address: address,
      city: city,
      subdivision: region,
      postalCode: postalCode,
      countryCode: countryCode
    });


    return addressList.join('<br/>');
  },

  formatDate: (date) => moment(date).format('MMM YYYY'),
  formatYear: (date) => moment(date).format('YYYY'),
  isDev: (label, options) => ["develop", "programmer"].some(term =>  label.toLowerCase().includes(term)) ? options.fn(this) : options.inverse(this),
  isTechnology: (skill, options) => isTechnology(skill.keywords) ? options.fn(skill) : options.inverse(this),
  ifHasTechnologies: (skills, options) => skills.some(skill => isTechnology(skill.keywords)) ? options.fn(skills) : options.inverse(this),
  isSkill: (skill, options) => isSkill(skill.keywords) ? options.fn(skill) : options.inverse(this),
  ifHasSkills: (skills, options) => skills.some(skill => isSkill(skill.keywords)) ? options.fn(skills) : options.inverse(this),
  isEducation: (education, options) => isEducation(education) ? options.fn(education) : options.inverse(this),
  ifHasEducation: (educations, options) => educations.some(education => isEducation(education)) ? options.fn(educations) : options.inverse(this),
  isCertification: (education, options) => isCertification(education) ? options.fn(education) : options.inverse(this),
  ifHasCertifications: (educations, options) => educations.some(education => isCertification(education)) ? options.fn(educations) : options.inverse(this),
  console: (object) => JSON.stringify(object),
});

function render(resume) {
  let dir = __dirname + '/public',
    css = fs.readFileSync(dir + '/styles/main.css', 'utf-8'),
    resumeTemplate = fs.readFileSync(dir + '/views/resume.hbs', 'utf-8');

  let Handlebars = handlebarsWax(handlebars);

  Handlebars.partials(dir + '/views/partials/**/*.{hbs,js}');
  Handlebars.partials(dir + '/views/components/**/*.{hbs,js}');

  return Handlebars.compile(resumeTemplate)({
    css: css,
    resume: resume
  });
}

module.exports = {
  render: render
};
