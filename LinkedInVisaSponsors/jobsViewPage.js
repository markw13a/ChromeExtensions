const sponsorElementClassname = "artdeco-entity-lockup__visa-sponsor";
const sponsorIconURL = chrome.runtime.getURL('assets/sponsor-icon.svg');
let visaSponsors = [];
const loadVisaSponsor = async () => {
    const pathToSponsorsJSON = chrome.runtime.getURL('data/visaSponsors.json');
    const res = await fetch(pathToSponsorsJSON);
    visaSponsors = await res.json();
};
loadVisaSponsor();

setInterval(() => {
    const companyName = document.querySelector(".jobs-unified-top-card__subtitle-primary-grouping a")?.textContent?.trim();
    const isCompanyAVisaSponsor = !!visaSponsors.find(sponsor => sponsor.includes(companyName));

    if (!isCompanyAVisaSponsor) {
        return;
    }

    // "job-flavours" are supposed to present a single aspect of the job that may pique an applicant's interest
    // As there is only ever meant to be one of these shown at a time, we delete the existing job-flavors list in favour of showing the visa sponsor icon
    // https://engineering.linkedin.com/blog/2016/08/job-flavors-at-linkedin--part-i
    // For view page, job flavours are always last
    const jobFlavours = document.querySelector(".jobs-unified-top-card__job-insight:last-child");
    
    if (jobFlavours) {
        jobFlavours.style = "display: none !important;";
    }

    // Get container that contains job insights (number of employees, size of company, etc.)
    const jobInsightsElement = document.querySelector(".jobs-unified-top-card__job-insight");
    const container = jobInsightsElement.parentElement;

    // Don't re-add the sponsor element if it's already been added
    const isVisaSponsorElementAlreadyPresent = container.querySelector(`.${sponsorElementClassname}`);
    if (!isVisaSponsorElementAlreadyPresent) {
        // Element that contains job title, company name, etc.
        const visaSponsorElement = createVisaSponsorElement();
        container.appendChild(visaSponsorElement);
    }
}, 500);

const createVisaSponsorElement = () => {
    const visaSponsorContainer = document.createElement("div");
    visaSponsorContainer.style = "display: flex; flex-direction: row; align-items: center;";
    visaSponsorContainer.className = sponsorElementClassname;

    const visaSponsorIconContainer = document.createElement("div");
    visaSponsorIconContainer.className = "mr2";
    visaSponsorIconContainer.style = "width: 24px; height: 24px;"
    visaSponsorContainer.appendChild(visaSponsorIconContainer);

    const visaSponsorIcon = document.createElement("img");
    visaSponsorIcon.style = "color: #057642;";
    visaSponsorIcon.src = sponsorIconURL;
    visaSponsorIconContainer.appendChild(visaSponsorIcon);
    
    const visaSponsorTextContainer = document.createElement("span");
    // These classes are provided by LinkedIn's stylesheets
    visaSponsorContainer.appendChild(visaSponsorTextContainer);

    const visaSponsorText = document.createTextNode("Visa sponsor");
    visaSponsorTextContainer.appendChild(visaSponsorText);

    return visaSponsorContainer;
};