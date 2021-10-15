const
  fs = require('fs'),
  handlebars = require('handlebars'),
  handlebarsWax = require('handlebars-wax'),
  addressFormat = require('address-format'),
  moment = require('moment'),
  Swag = require('swag');

Swag.registerHelpers(handlebars);

const isTechnology = (keywords) => keywords && keywords.some(keyword =>  keyword.toLowerCase() === "technologies");
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
  console: (object) => JSON.stringify(object),

  technologiesMustache: () => 
  `{{#technologies.length}}
    <div class="container technologies-container">
      <div class="title"><h3>Technologies</h3></div>
      <section>
        <h4>
          {{#technologies}}{{name}}{{^last}} | {{/last}}{{/technologies}}
        </h4>
      </section>
    </div>
  {{/technologies.length}}`,
  certificationsMustache: () => `
  {{#certifications.length}}
  <div class="container certification-container">
    <div class="title"><h3>Certifications</h3></div>
    {{#certifications}}
      <section class='item'>
        {{#specialization}}
          <h4>{{specialization}}</h4>
        {{/specialization}}
        {{#institution}}
          <h4>{{institution}}</h4>
        {{/institution}}
        <h4>
          {{#startDate}}(<span class='startDate'>{{startDate}}</span>{{/startDate}}
          {{#endDate}}<span class='endDate'> to {{endDate}}</span>){{/endDate}}
        </h4>
      </section>
    {{/certifications}}
  </div>
  {{/certifications.length}}`,

  isArray: (element, options) => Array.isArray(element) ? options.fn(element) : options.inverse(element),
  isDev: (label, options) => ["develop", "programmer"].some(term =>  label.toLowerCase().includes(term)) ? options.fn(this) : options.inverse(this),
  isTechnology: (skill, options) => isTechnology(skill.keywords) ? options.fn(skill) : options.inverse(this),
  ifHasTechnologies: (skills, options) => !Array.isArray(skills) || skills.some(skill => isTechnology(skill.keywords)) ? options.fn(skills) : options.inverse(this),
  isSkill: (skill, options) => isSkill(skill.keywords) ? options.fn(skill) : options.inverse(this),
  ifHasSkills: (skills, options) => !Array.isArray(skills) || skills.some(skill => isSkill(skill.keywords)) ? options.fn(skills) : options.inverse(this),
  isEducation: (education, options) => isEducation(education) ? options.fn(education) : options.inverse(this),
  ifHasEducation: (educations, options) => !Array.isArray(educations) || educations.some(education => isEducation(education)) ? options.fn(educations) : options.inverse(this),
  isCertification: (education, options) => isCertification(education) ? options.fn(education) : options.inverse(this),
  ifHasCertifications: (educations, options) => !Array.isArray(educations) ||  educations.some(education => isCertification(education)) ? options.fn(educations) : options.inverse(this),
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

const returnHTML = () => {
  const dir = __dirname + '/public';
  const html = fs.readFileSync(dir + '/index.html', 'utf-8')
  return html;
}

module.exports = {
  render: render,
  html: returnHTML,
};
